import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import SUISelectionTiles from "sui-components/SelectionTiles/SUISelectionTiles";
import SUIPayIntervalFrequency from "sui-components/PayIntervalFrequency/SUIPayIntervalFrequency";
import WorkItemsDropdown from "sui-components/WorkItemsDropdown/WorkItemsDropdown";
import SUILineItem from "sui-components/LineItem/LineItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IQToggle from "components/iqtoggle/IQToggle";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { Stack, Box } from "@mui/material";
import infoicon from "resources/images/common/infoicon.svg";
import SUIAlert from "sui-components/Alert/Alert";

import { Button } from "@mui/material";
//import { Lock, FileCopy } from "@mui/icons-material";
import "./VendorContractsScheduleValues.scss";
import { getServer } from "app/common/appInfoSlice";
import { addPaymenForSov, createScheduleOfValues, deleteAllScheduleOfValues, deleteScheduleOfValue, updateScheduleOfValues, updateScheduleOfValuesThroughDate } from "features/vendorcontracts/stores/ScheduleOfValuesAPI";
import { errorMsg, errorStatus, getAmountAlignment, isUserGC } from "utilities/commonutills";
import { setSelectedRecord } from "features/vendorcontracts/stores/VendorContractsSlice";
import { getValuesOfAllEntries, tiles } from "./utils";
import { getVendorContractsList } from "features/vendorcontracts/stores/gridSlice";
import { setUnlockedSov } from "features/vendorcontracts/stores/ScheduleOfValuesSlice";
import { getContractDetailsById } from 'features/vendorcontracts/stores/VendorContractsSlice';
import Toast from "components/toast/Toast";
import { PaymentStatus } from "utilities/vendorContracts/enums";
import { formatDate } from "utilities/datetime/DateTimeUtils";
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';

const VendorContractsScheduleValues = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const emptyObj = [{ completionPercentage: "", payoutPercentage: "", payoutAmount: null, balanceAmount: null }];
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedRecord, contractDetailsGetCall } = useAppSelector((state) => state.vendorContracts);
	const { budgetItems } = useAppSelector((state) => state.vendorContractsGrid);
	const { loginUserData } = useAppSelector((state) => state.vendorContracts);

	const [toggleChecked, setToggleChecked] = React.useState<boolean>(true);
	const [sovUnlocked, setSovUnlocked] = React.useState<boolean>(false);
	const [selectedBudgetItem, setSelectedBudgetItem] = React.useState<any>({});
	const scheduleOfValuesData = selectedRecord?.scheduleOfValues;
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const newRecRef = useRef<any>();
	const tableDataRef = useRef<any>();
	const [pinnedTopData, setPinnedTopData] = useState<any>([]);

	React.useEffect(() => { budgetItems?.length && setSelectedBudgetItem(budgetItems?.[0]) }, [budgetItems])

	const [activeTile, setActiveTile] = useState<any>(tiles[0]);
	const [tilesData, setTilesData] = useState<any>(tiles);
	const [newRecord, setNewRecord] = useState<any>(emptyObj[0]);
	const [tableData, setTableData] = useState<any>({});
	const [percentHeaders, setPercentHeaders] = useState<any>([]);
	const [unitHeaders, setUnitHeaders] = useState<any>([]);
	const [dollarHeaders, setDollarHeaders] = useState<any>([]);
	const [recUpdated, setRecUpdated] = useState("");
	const [selectedTileData, setSelectedTileData] = useState<any>({});
	const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
	const [showDuplicateMsg, setShowDuplicateMsg] = useState<boolean>(false);
	const [toastMsg, setToastMsg] = useState<any>("")
	const [toast, setToast] = useState<any>({ show: false, message: '' });
	const cellValueChangedRef = useRef<any>(false);

	React.useEffect(() => {
		toast?.show && setTimeout(() => {
			setToast({ show: false, message: '' })
		}, 5000)
	}, [toast?.show])

	const workItemsExtraColumns = [
		{ headerName: 'Work Item', dataKey: 'label', name: 'label', width: '60%', showCol: true, showRenderColVal: false },
		{ name: "status", showIcon: true, dataKey: "status", width: '15%', showValueOnTop: true},
		{ name: "pagination", width: '15%', colWidth: '5%', showCol: true, showRenderColVal: true },
		{ headerName: 'Bid Value', dataKey: 'bidValue', name: 'amount', width: '125px', align: 'left', colWidth: '10%', showCol: true, showRenderColVal: false },
		{ headerName: 'Change Order Amount', dataKey: 'changeOrderAmt', name: 'amount', width: '240px', align: 'right', showCol: true, colWidth: '17.5%', showRenderColVal: false },
		{ headerName: 'Revised Bid Value', dataKey: 'revisedBidValue', name: 'amount', width: '180px', align: 'right', showCol: true, colWidth: '14%', showRenderColVal: false },
	];

	/**
	 * Triggers on input cell change
	 * For Add row - updating the value to the newRecRef and using the same while reading the value.
	 * Rest of the rows - setting the updated value to rowNode, so that table will not re-renders.
	 * And setting the updated data to tableDataRef - can be used on blur to update tableData
	 * @param event HTMLEvent
	 * @param params ag grid row params
	 * @param colKey dynamic column field
	 * @author Srinivas Nadendla
	 */
	const handleTableCellsChange = (event: any, params: any, colKey: string) => {
		cellValueChangedRef.current = true;
		event.stopPropagation();
		const enteredValue = activeTile?.type == 'DollarAmount' && colKey == 'workStage' ? event?.target?.value : Number(event.target.value?.replaceAll(',', ''));
		let existedValuesSum = getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0)
		console.log("handleTableCellsChange", enteredValue, colKey, getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey), selectedBudgetItem?.quantity)
		// } else if (activeTile?.type == 'PercentComplete' && (enteredValue > 100 || ((params.node?.rowPinned === 'top' && existedValuesSum ? Number(existedValuesSum) : 0) + enteredValue > 100))) {
		if (activeTile?.type == 'PercentComplete' && enteredValue > 100) {
			setShowErrorMsg(true);
			setShowAlert(true);
			setToastMsg('Values More than 100 are not allowed.');
		} else if (colKey == 'payoutPercentage' && ((params.node?.rowPinned === 'top' && existedValuesSum ? Number(existedValuesSum) : 0) + enteredValue > 100)) {
			setShowErrorMsg(true);
			setShowAlert(true);
			setToastMsg("The sum of 'Percent Payout' values from all the rows cannot be more than 100.");
		} else if (colKey == 'completionQuantity' && selectedBudgetItem?.quantity && (enteredValue > selectedBudgetItem?.quantity)) {
			setShowAlert(true);
			setShowErrorMsg(true);
			setToastMsg("The 'Unit Quantity' cannot be more than the total Unit Quantity of the selected Work Item")
		} else if (colKey == 'completionQuantity' && selectedBudgetItem?.quantity && getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey)?.includes(selectedBudgetItem?.quantity)) {
			setShowAlert(true);
			setShowErrorMsg(true);
			setToastMsg("You have already entered the 'Total Unit Quantity' So You can't add new Record. If you still want to add then edit/delete the existed record with 'Total Quantity'.")
		}
		else if (colKey == 'payoutAmount' && selectedBudgetItem?.bidValue && (enteredValue > selectedBudgetItem?.bidValue || ((params.node.rowPinned === 'top' && existedValuesSum ? Number(existedValuesSum) : 0) + enteredValue > selectedBudgetItem?.bidValue))) {
			setShowAlert(true);
			setShowErrorMsg(true);
			// newRecRef.current[colKey] = '';
			setToastMsg("Sum of Payout amount of all rows cannot exceed the total Bid Value.")
		} else {
			const value = colKey == 'completionQuantity' && selectedBudgetItem?.quantity ? (selectedBudgetItem?.bidValue / selectedBudgetItem?.quantity) * enteredValue : (selectedBudgetItem?.bidValue / 100) * enteredValue;
			newRecRef.current[colKey] = enteredValue;
			if (params.node.rowPinned === 'top') {
				if (activeTile?.type == "PercentComplete") {
					let existedValues = getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0)
					existedValues = (existedValues ? Number(existedValues) : 0) + Number(enteredValue);
					//   console.log("existeddd", existedValues)
					const paidAmount = (selectedBudgetItem?.bidValue / 100) * Number(existedValues);
					//   console.log("iffffff", existedValues, enteredValue, paidAmount);
					if (colKey == 'payoutPercentage') {
						//   console.log("second");
						newRecRef.current["payoutAmount"] = value; newRecRef.current["balanceAmount"] = selectedBudgetItem?.bidValue - Number(paidAmount);
					}
					if (newRecRef?.current?.completionPercentage && newRecRef?.current?.payoutPercentage) {
						// console.log("reffffffffffff", newRecRef?.current) 
						newRecRef.current["enableAddBtn"] = true;
					} else {
						newRecRef.current["enableAddBtn"] = false;
					}
				}
				if (activeTile?.type == "UnitOfMeasure") {
					let existedValues = getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0)
					existedValues = (existedValues ? Number(existedValues) : 0) + Number(enteredValue);
					const paidAmount = selectedBudgetItem?.quantity ? (selectedBudgetItem?.bidValue / selectedBudgetItem?.quantity) * Number(enteredValue) : 0;
					console.log("activeTile?.type", activeTile?.type, existedValues, paidAmount)
					if (selectedBudgetItem?.quantity) {
						console.log("ifffff", selectedBudgetItem?.quantity, value)
						newRecRef.current["balanceAmount"] = selectedBudgetItem?.bidValue - Number(paidAmount)
						if (colKey == 'completionQuantity') {
							const vals = Number(getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, 'payoutAmount')?.reduce((a: any, b: any) => Number(a) + Number(b), 0))
							const payoutAmt = Number(value) - (vals && vals != NaN ? vals : 0)
							newRecRef.current["payoutAmount"] = payoutAmt < 0 ? Number(value) : payoutAmt
							console.log("ïssues", newRecRef?.current, payoutAmt, Number(value), Number(getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, 'payoutAmount')?.reduce((a: any, b: any) => Number(a) + Number(b), 0)));
						}
						else newRecRef.current["balanceAmount"] = selectedBudgetItem?.bidValue - Number(existedValues)
					} else {
						console.log("elseee", selectedBudgetItem?.quantity)
						if (colKey == 'payoutAmount') newRecRef.current["balanceAmount"] = selectedBudgetItem?.bidValue - Number(existedValues)
					}
					if (newRecRef?.current?.completionQuantity && newRecRef?.current?.payoutAmount) {
						newRecRef.current["enableAddBtn"] = true;
					} else {
						newRecRef.current["enableAddBtn"] = false;
					}
				}
				if (activeTile?.type == "DollarAmount") {
					if (colKey == 'payoutAmount') {
						let existedValues = getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0)
						existedValues = (existedValues ? Number(existedValues) : 0) + Number(enteredValue);
						newRecRef.current["balanceAmount"] = selectedBudgetItem?.bidValue - Number(existedValues);
					}
					if (newRecRef?.current?.workStage && newRecRef?.current?.payoutAmount) {
						newRecRef.current["enableAddBtn"] = true;
					} else {
						newRecRef.current["enableAddBtn"] = false;
					}
				}
				params.node.setData(newRecRef.current);//Using to re-render the cells when there is a change
				// console.log("onchange", newRecRef, recUpdated)
			} else {
				// console.log("put call", colKey, enteredValue, tableDataRef?.current);
				// params.node.setDataValue(colKey, enteredValue); 
				const gridDataCopy = [...tableDataRef.current[selectedBudgetItem?.id]?.payments];
				let updatedObj = { ...gridDataCopy[params.node.rowIndex] }
				if (activeTile?.type == "PercentComplete") {
					//   console.log("iffffff", colKey, gridDataCopy, value, updatedObj)
					if (colKey == 'payoutPercentage') {
						// console.log("second", gridDataCopy[params.node.rowIndex]["payoutAmount"], value);
						let existedValues = getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0)
						existedValues = existedValues + Number(enteredValue);
						updatedObj = { ...updatedObj, payoutAmount: value }
						updatedObj = { ...updatedObj, balanceAmount: selectedBudgetItem?.bidValue - Number(value) }
						// console.log("dataaa111", gridDataCopy);
					}
				}
				// console.log("dataaa222", gridDataCopy, updatedObj);

				if (activeTile?.type == "UnitOfMeasure") {
					updatedObj = { ...updatedObj, balanceAmount: selectedBudgetItem?.bidValue - Number(value) }
					updatedObj = colKey == 'completionQuantity' ? { ...updatedObj, payoutAmount: value } : { ...updatedObj, balanceAmount: selectedBudgetItem?.bidValue - Number(enteredValue) }
				}
				if (activeTile?.type == "DollarAmount") {
					if (colKey == 'payoutAmount') updatedObj = { ...updatedObj, balanceAmount: selectedBudgetItem?.bidValue - Number(value) }
				}
				updatedObj = { ...updatedObj, [colKey]: enteredValue }
				gridDataCopy[params.node.rowIndex] = updatedObj
				// console.log("dataaa", gridDataCopy, updatedObj);
				//params.node.setDataValue(colKey, enteredValue);
				params.node.setData(gridDataCopy[params.node.rowIndex]);//Using to re-render the cells when there is a change
				tableDataRef.current = { ...tableData, [selectedBudgetItem?.id]: { ...tableData[selectedBudgetItem?.id], payments: [...gridDataCopy] } };
			}
		}
	};
	React.useEffect(() => { dispatch(setUnlockedSov(sovUnlocked)) }, [sovUnlocked]);
	React.useEffect(() => {
		if (!props.readOnly) {
			setPinnedTopData(emptyObj);
		}
		else setPinnedTopData([]);

	}, [selectedRecord, props.readOnly])

	React.useEffect(() => {
		if (budgetItems?.length == selectedRecord?.budgetLineItemsWithValidSOV) { dispatch(setUnlockedSov(false)); setSovUnlocked(false) }
	}, [selectedRecord, budgetItems]);

	/**
	 * On blur of cell, updating the tableData based on tableDataRef.current.
	 * We can perform any other validations needed here.
	 * @param event
	 * @param params Ag grid row params
	 * @param colKey dynamic column field
	 * @author Srinivas Nadendla
	 */
	const handleTableCellsBlur = (event: any, params: any, colKey: string) => {
		if (!cellValueChangedRef.current) return;
		cellValueChangedRef.current = false;
		const enteredValue = activeTile?.type == 'DollarAmount' && colKey == 'workStage' ? event?.target?.value : Number(event.target.value?.replaceAll(',', ''));
		const checkDuplicates = () => {
			if (params.node.rowPinned == 'top') return getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey)?.includes(enteredValue)
			else {
				let values = getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey);
				console.log("elsee", values, params.node.rowIndex)
				values.splice(params.node.rowIndex, 1)
				console.log("elsee1", values, params.node.rowIndex)
				return values?.includes(enteredValue)
			}
		}
		console.log("enteredValue", enteredValue, checkDuplicates(), getValuesOfAllEntries(tableData[selectedBudgetItem?.id]?.payments, colKey));
		if (['completionPercentage', 'completionQuantity', 'workStage'].includes(colKey) && (checkDuplicates())) {
			setShowErrorMsg(true);
			setShowAlert(true);
			setToastMsg('Duplicate Values are not allowed')
			newRecRef.current[colKey] = '';
			newRecRef.current["enableAddBtn"] = false;
			if (colKey == 'completionQuantity') {
				newRecRef.current['payoutAmount'] = '';
				newRecRef.current['balanceAmount'] = '';
			}
			params.node.setData(newRecRef.current);
		}
		if (colKey == 'completionQuantity') {
			if (newRecRef?.current?.payoutAmount < 0) {
				setShowAlert(true);
				newRecRef.current[colKey] = '';
				newRecRef.current['payoutAmount'] = '';
				newRecRef.current['balanceAmount'] = '';
				newRecRef.current["enableAddBtn"] = false;
				setShowErrorMsg(true);
				setToastMsg("You have already Added the total Unit Quantity. If you want to add one more, edit the alrealy existed then add new Payment / Remove the existed Payments and add from starting.")
			}
		}
		if (params.node.rowPinned !== 'top') {
			console.log("rowPinned", params.node.rowPinned)
			// const value = (selectedBudgetItem?.bidValue / 100) * enteredValue;      
			// const gridDataCopy = [...tableDataRef.current[selectedBudgetItem?.id]?.payments];
			//   if(activeTile?.type == "PercentComplete") {
			//     console.log("iffffff", gridDataCopy, params.node.rowIndex, enteredValue)
			//     if(colKey == 'payoutPercentage') { 
			//       console.log("second"); 
			//       // gridDataCopy[params.node.rowIndex]["payoutAmount"] = value; 
			//       // gridDataCopy[params.node.rowIndex]["balanceAmount"] = Number(selectedBudgetItem?.bidValue) - Number(value); 
			//       console.log("dataaa111", gridDataCopy);
			//     }
			//   }
			//   console.log("dataaa222", gridDataCopy);        

			//   if(activeTile?.type == "UnitOfMeasure") {
			//     gridDataCopy[params.node.rowIndex]["balanceAmount"] = selectedBudgetItem?.bidValue - value
			//     colKey == 'completionQuantity' ? gridDataCopy[params.node.rowIndex]["payoutAmount"] = value : gridDataCopy[params.node.rowIndex]["balanceAmount"] = selectedBudgetItem?.bidValue - enteredValue
			//   }
			//   if(activeTile?.type == "DollarAmount") {
			//     if(colKey == 'payoutAmount') gridDataCopy[params.node.rowIndex]["balanceAmount"] = selectedBudgetItem?.bidValue - enteredValue;
			//   }
			//   console.log("dataaa", gridDataCopy);
			//   gridDataCopy[params.node.rowIndex][colKey] = enteredValue;
			//   //params.node.setDataValue(colKey, enteredValue);
			//   params.node.setData(gridDataCopy[params.node.rowIndex]);//Using to re-render the cells when there is a change
			//   tableDataRef.current = {...tableData, [selectedBudgetItem?.id]: {...tableData[selectedBudgetItem?.id], payments:  [...gridDataCopy]}};


			const updatedRecord = tableDataRef?.current[selectedBudgetItem?.id]
			console.log("put blur", tableDataRef?.current, updatedRecord, enteredValue, updatedRecord?.payments[params.node.rowIndex]?.[colKey])
			const payload = updatedRecord?.type == 'PercentComplete' ? { completionPercentage: updatedRecord?.payments[params.node.rowIndex]?.completionPercentage, payoutPercentage: updatedRecord?.payments[params.node.rowIndex]?.payoutPercentage }
				: updatedRecord?.type == 'UnitOfMeasure' ? { completionQuantity: updatedRecord?.payments[params.node.rowIndex]?.completionQuantity, payoutAmount: updatedRecord?.payments[params.node.rowIndex]?.payoutAmount } : { payoutAmount: updatedRecord?.payments[params.node.rowIndex]?.payoutAmount, workStage: updatedRecord?.payments[params.node.rowIndex]?.workStage }
			updateScheduleOfValues(appInfo, selectedRecord?.id, selectedBudgetItem?.id, params?.data?.id, payload, (response: any) => {
				if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
				else dispatch(setSelectedRecord(response))
			})
		}
		if (params.node.rowPinned === 'top') {
			if (colKey == 'payoutAmount') {
				newRecRef.current['newRecRef.current'] = getAmountAlignment(newRecRef.current?.payoutAmount);
			}
			// params.node.setData(newRecRef.current);
			// setRecUpdated(recUpdated + Math.random());
			const event = new CustomEvent('updateSOVRec', { detail: newRecRef });
			document.dispatchEvent(event);
		}
	};

	useEffect(() => {
		newRecRef.current = {};
		const percentCols = [
			{
				headerName: "",
				minWidth: 40,
				maxWidth: 73,
				// type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return props.readOnly ? (
						<div>
							<span className="vc-schedule-values_row-count">
								{params.node.rowIndex + 1}
							</span>
							<span>AT</span>
						</div>
					) : params.node.rowPinned === 'top' ? (
						<div>
							<span>AT</span>
						</div>
					) : (
						<div>
							<span className="vc-schedule-values_row-count">
								{params.node.rowIndex + 1}
							</span>
							<span>AT</span>
						</div>
					);
				},
			},
			{
				headerName: "% Work Completion",
				field: "completionPercentage",
				minWidth: 200,
				ignoreDefaultTooltip: true,
				sort: 'asc',
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div style={{ textAlign: "center" }}>
							{params.data?.completionPercentage}%
						</div>
					) : (
						<div style={{ textAlign: "center" }}>
							<TextField
								id="work-completion-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{ width: "70px" }}
								value={
									params.node.rowPinned === 'top'
										? newRecRef.current?.completionPercentage
										: params.data?.completionPercentage
								}
								onChange={(event: any) => {
									handleTableCellsChange(event, params, "completionPercentage");
								}}
								onBlur={(event: any) => {
									handleTableCellsBlur(event, params, "completionPercentage");
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">%</InputAdornment>
									),
								}}
							/>
						</div>
					);
				},
			},
			{
				headerName: "",
				minWidth: 190,
				sortable: false,
				cellRenderer: (params: any) => {
					return <div>of Work Completion, Pay</div>;
				},
			},
			{
				headerName: "% Payout",
				field: "payoutPercentage",
				maxWidth: 100,
				type: "centerAligned",
				ignoreDefaultTooltip: true,
				sortable: false,
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div style={{ textAlign: "center" }}>{params?.data?.payoutPercentage}%</div>
					) : (
						<div style={{ textAlign: "center" }}>
							<TextField
								id="payout-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{ width: "70px" }}
								value={
									params.node.rowPinned === 'top'
										? newRecRef.current?.payoutPercentage
										: params.data?.payoutPercentage
								}
								onChange={(event: any) => {
									handleTableCellsChange(event, params, "payoutPercentage");
								}}
								onBlur={(event: any) => {
									handleTableCellsBlur(event, params, "payoutPercentage");
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">%</InputAdornment>
									),
								}}
							/>
						</div>
					);
				},
			},
			{
				headerName: "Payout Amount",
				field: "payoutAmount",
				minWidth: 140,
				type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					//   console.log("pinnedddd", newRecRef.current, getAmountAlignment(newRecRef.current?.payoutAmount))
					return !props.readOnly && params.node.rowPinned === 'top' ? (
						<div>{amountFormatWithSymbol(newRecRef.current?.payoutAmount)}</div>
					) : (
						<div>
							{amountFormatWithSymbol(params?.data?.payoutAmount)}
							{/* {(selectedBudgetItem?.bidValue / 100) * params?.data?.payoutPercentage?.toLocaleString("en-US")} */}
						</div>
					);
				},
			},
			{
				headerName: "Balance Amount",
				field: "balanceAmount",
				minWidth: 146,
				type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return !props.readOnly && params.node.rowPinned === 'top' ? (
						<div>
							{amountFormatWithSymbol(newRecRef.current?.balanceAmount)}
							{newRecRef.current?.balanceAmount && <span className="totalAmount">
								{" "}
								of 
								{" "} 
								{amountFormatWithSymbol(selectedBudgetItem?.bidValue)}
							</span>}
						</div>
					) : (
						<div>
							{" "}
							<span className="balanceAmount">
								{amountFormatWithSymbol(params.data?.balanceAmount)}
							</span>
							<span className="totalAmount">
								{" "}
								of 
								{" "}  
								{amountFormatWithSymbol(selectedBudgetItem?.bidValue)}
							</span>
						</div>
					);
				},
			},
		];
		setPercentHeaders(percentCols);
		const unitCols = [
			{
				headerName: "",
				minWidth: 70,
				// type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return props.readOnly ? (
						<div>
							<span className="vc-schedule-values_row-count">
								{params.node.rowIndex + 1}
							</span>
							<span>AT</span>
						</div>
					) : params.node.rowPinned === 'top' ? (
						<div>
							<span>AT</span>
						</div>
					) : (
						<div>
							<span className="vc-schedule-values_row-count">
								{params.node.rowIndex + 1}
							</span>
							<span>AT</span>
						</div>
					);
				},
			},
			{
				headerName: "Unit Quantity",
				field: "completionQuantity",
				minWidth: 150,
				maxWidth: 200,
				type: "rightAligned",
				sortable: false,
				sort: 'asc',
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div style={{ textAlign: "center" }}>
							{getAmountAlignment(params.data?.completionQuantity)} {selectedBudgetItem?.unitOfMeasure ? selectedBudgetItem?.unitOfMeasure : ''}
						</div>
					) : (
						<div style={{ textAlign: "center" }}>
							<TextField
								id="payout-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{ width: "120px" }}
								value={
									params.node.rowPinned === 'top'
										? getAmountAlignment(newRecRef.current?.completionQuantity)
										: getAmountAlignment(params.data?.completionQuantity)
								}
								onChange={(event: any) => {
									handleTableCellsChange(event, params, "completionQuantity");
								}}
								onBlur={(event: any) => {
									handleTableCellsBlur(event, params, "completionQuantity");
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">{selectedBudgetItem?.unitOfMeasure ? selectedBudgetItem?.unitOfMeasure : ''}</InputAdornment>
									),
								}}
							/>
						</div>
					);
				},
			},
			{
				headerName: "",
				minWidth: 250,
				sortable: false,
				cellRenderer: (params: any) => {
					return <div>of Work Completion, Pay</div>;
				},
			},
			{
				headerName: "Payout Amount",
				field: "payoutAmount",
				minWidth: 150,
				type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div>
							{amountFormatWithSymbol(params?.data?.payoutAmount)}
						</div>
					) : (
						<div>
							<TextField
								id="payout-amount-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{ width: "120px" }}
								value={
									params.node.rowPinned === 'top'
										? getAmountAlignment(newRecRef.current?.payoutAmount)
										: getAmountAlignment(params.data?.payoutAmount)
								}
								onChange={(event: any) => {
									handleTableCellsChange(event, params, "payoutAmount");
								}}
								onBlur={(event: any) => {
									handleTableCellsBlur(event, params, "payoutAmount");
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											{currencySymbol}
										</InputAdornment>
									),
								}}
							/>
						</div>
					);
				},
			},
			{
				headerName: "Balance Amount",
				field: "balanceAmount",
				minWidth: 180,
				type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return !props.readOnly && params.node.rowPinned === 'top' ? (
						<div>
							{amountFormatWithSymbol(newRecRef.current?.balanceAmount)}
							{newRecRef.current?.balanceAmount && <span className="totalAmount">
								{" "}
								of {" "}
								{amountFormatWithSymbol(selectedBudgetItem?.bidValue)}
							</span>}
						</div>
					) : (
						<div>
							{" "}
							<span className="balanceAmount">
								{amountFormatWithSymbol(params.data?.balanceAmount)}
							</span>
							<span className="totalAmount">
								{" "}
								of {" "}
								{amountFormatWithSymbol(selectedBudgetItem?.bidValue)}
							</span>
						</div>
					);
				},
			},
		];
		setUnitHeaders(unitCols);
		const dollarCols = [
			{
				headerName: "",
				minWidth: 70,
				// type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return props.readOnly ? (
						<div>
							<span className="vc-schedule-values_row-count">
								{params.node.rowIndex + 1}
							</span>
							<span>AT</span>
						</div>
					) : params.node.rowPinned === 'top' ? (
						<div>
							<span>AT</span>
						</div>
					) : (
						<div>
							<span className="vc-schedule-values_row-count">
								{params.node.rowIndex + 1}
							</span>
							<span>AT</span>
						</div>
					);
				},
			},
			{
				headerName: "Work Stage",
				field: "workStage",
				minWidth: 220,
				sortable: false,
				sort: 'asc',
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div>{params?.data?.workStage}</div>
					) : (
						<div style={{ textAlign: "left" }}>
							<TextField
								id="work-stage-text-field"
								placeholder="Enter"
								variant="standard"
								value={
									params.node.rowPinned === 'top'
										? newRecRef.current?.workStage
										: params.data.workStage
								}
								onChange={(event: any) => {
									handleTableCellsChange(event, params, "workStage");
								}}
								onBlur={(event: any) => {
									handleTableCellsBlur(event, params, "workStage");
								}}
							/>
						</div>
					);
				},
			},
			{
				headerName: "",
				minWidth: 180,
				sortable: false,
				cellRenderer: (params: any) => {
					return <div>of Work Completion, Pay</div>;
				},
			},
			{
				headerName: "Payout Amount",
				field: "payoutAmount",
				minWidth: 150,
				type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div>
							{amountFormatWithSymbol(params?.data?.payoutAmount)}
						</div>
					) : (
						<div>
							<TextField
								id="payout-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{ width: "120px" }}
								value={
									params.node.rowPinned === 'top'
										? getAmountAlignment(newRecRef.current?.payoutAmount)
										: getAmountAlignment(params.data.payoutAmount)
								}
								onChange={(event: any) => {
									handleTableCellsChange(event, params, "payoutAmount");
								}}
								onBlur={(event: any) => {
									handleTableCellsBlur(event, params, "payoutAmount");
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											{currencySymbol}
										</InputAdornment>
									),
								}}
							/>
						</div>
					);
				},
			},
			{
				headerName: "Balance Amount",
				field: "balanceAmount",
				minWidth: 180,
				type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return !props.readOnly && params.node.rowPinned === 'top' ? (
						<div>
							{amountFormatWithSymbol(newRecRef.current?.balanceAmount)}
							{newRecRef.current?.balanceAmount && <span className="totalAmount">
								{" "}
								of {" "}
								{amountFormatWithSymbol(selectedBudgetItem?.bidValue)}
							</span>}
						</div>
					) : (
						<div>
							{" "}
							<span className="balanceAmount">
								{amountFormatWithSymbol(params.data.balanceAmount)}
							</span>
							<span className="totalAmount">
								{" "}
								of {" "}
								{amountFormatWithSymbol(selectedBudgetItem?.bidValue)}
							</span>
						</div>
					);
				},
			},
		];
		setDollarHeaders(dollarCols);
	}, [selectedBudgetItem, activeTile, props?.readOnly]);

	const statusColumn = [
		{
			headerName: "Retainage %",
			field: "retainagePercentage",
			minWidth: 120,
			menuTabs: [],
			valueGetter: (params: any) => selectedRecord?.retainagePercentage ? `${selectedRecord?.retainagePercentage} %` : '',
			// cellStyle: { textAlign: "center" },

		},
		{
			headerName: "Retainage Amount",
			field: "retainageAmount",
			minWidth: 170,
			menuTabs: [],
			valueGetter: (params: any) => amountFormatWithSymbol(params.data?.retainageAmount),
		},
		{
			headerName: "Payment Status",
			field: "status",
			minWidth: 185,
			menuTabs: [],
			cellStyle: { textAlign: "center" },
			cellRenderer: (params: any) => {
				console.log("status in sov", params, params?.data?.status)
				const payStatus = PaymentStatus[params.data?.status];
				if (payStatus === "Paid") {
					let styleOpts = {
						style: { color: payStatus === "Paid" ? "#008000c2" : "red" },
					}
					return <div {...styleOpts}>{payStatus}</div>;
				} return payStatus
			}
		},
		{
			headerName: "Payment Date",
			field: "paymentDate",
			minWidth: 180,
			menuTabs: [],
			valueGetter: (params: any) => params.data?.paymentDate ? formatDate(params.data?.paymentDate) : '',
			// cellStyle: { textAlign: "center" },

		},
		{
			headerName: "Invoice",
			field: "invoice",
			minWidth: 120,
			menuTabs: [],
		}

	]

	// useEffect(() => {
	// 	if (!['Draft', 'ReadyToSubmit', 'Scheduled']?.includes(selectedRecord?.status)) {
	// 		setPercentHeaders([...percentHeaders, statusColumn ])
	// 		setUnitHeaders([...unitHeaders, statusColumn]);
	// 		setDollarHeaders([...dollarHeaders, statusColumn]);			
	// 	}
	// }, [selectedRecord?.status])


	React.useEffect(() => {
		let scheduleOfValuesGridData: any = {};
		if (selectedRecord?.scheduleOfValues) {
			selectedRecord?.scheduleOfValues?.length && selectedRecord?.scheduleOfValues?.map((obj: any) => {
				// console.log("obj", obj, scheduleOfValuesGridData);
				if (!Object.keys(scheduleOfValuesGridData)?.includes(obj?.budgetItem?.id)) {
					// console.log("ifff", obj?.budgetItem?.id)
					scheduleOfValuesGridData = { ...scheduleOfValuesGridData, [obj?.budgetItem?.id]: { ...obj } }
				}
			})
		}
		else {
			//   console.log("elseeee scheduleOfValues", selectedRecord?.scheduleOfValues, budgetItems, contractDetailsGetCall)
			selectedRecord?.scheduleOfValues == null && contractDetailsGetCall && budgetItems?.map((row: any) => {
				// console.log("repeated call")
				if (!Object.keys(scheduleOfValuesGridData)?.includes(row?.id)) {
					//   console.log("scheduleOfValuesGridData in ", row?.id)
					createScheduleOfValues(appInfo, selectedRecord?.id, row?.id, { type: 'PercentComplete' }, (response: any) => {
						if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
						else response?.scheduleOfValues?.map((obj: any) => {
							if (obj?.budgetItem?.id == row?.id) {
								scheduleOfValuesGridData = { ...scheduleOfValuesGridData, [row?.id]: { ...obj } };
								setTableData(scheduleOfValuesGridData);
							}

						})
					})
				}
			})
			//   console.log("Active tile", tilesData[0])
			setActiveTile(tilesData[0])
		}
		// console.log("scheduleOfValuesGridData", scheduleOfValuesGridData, Object.keys(scheduleOfValuesGridData))
		setTableData(scheduleOfValuesGridData);
		tableDataRef.current = scheduleOfValuesGridData;
	}, [selectedRecord, budgetItems])

	React.useEffect(() => {
		const data = tilesData?.map((tile: any) => {
			//   console.log("active tile set", tableData[selectedBudgetItem?.id], selectedBudgetItem)
			if (tile?.type == tableData[selectedBudgetItem?.id]?.type) {
				// console.log("tile", tile)
				setActiveTile(tile)
				return { ...tile, isActive: true }
			};
			return { ...tile, isActive: false }
		})
		setTilesData(data);
	}, [tableData, selectedBudgetItem]);

	const onSelectedTileChange = (tile: any) => {
		// console.log("selected Tile", tile, activeTile?.type,tableData[selectedBudgetItem?.id]?.payIntervalFrequency );
		if (tableData[selectedBudgetItem?.id]?.payments?.length > 0 || (activeTile?.type == 'ThroughDate' && ['Monthly', 'Weekly', 'RealTime']?.includes(tableData[selectedBudgetItem?.id]?.payIntervalFrequency))) {
			setShowAlert(true)
		}
		else {
			setActiveTile(tile);
			const resp = deleteAllScheduleOfValues(appInfo, selectedRecord?.id, selectedBudgetItem?.id, (response: any) => {
				if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
				else createScheduleOfValues(appInfo, selectedRecord?.id, selectedBudgetItem?.id, { type: tile?.type }, (response: any) => {
					if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
					else response?.scheduleOfValues?.map((obj: any) => {
						if (obj?.budgetItem?.id == selectedBudgetItem?.id) setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...obj } })
					})
					// dispatch(setSelectedRecord(response))
				})
			})
			//   console.log("deleteeeee resp", resp);      
			// setTimeout(() => {
			// 	// console.log("set time out")
			// 	createScheduleOfValues(appInfo, selectedRecord?.id, selectedBudgetItem?.id, { type: tile?.type }, (response: any) => {
			// 		//   console.log("createeee")
			// 		response?.scheduleOfValues?.map((obj: any) => {
			// 			if (obj?.budgetItem?.id == selectedBudgetItem?.id) setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...obj } })
			// 		})
			// 		// dispatch(setSelectedRecord(response))
			// 	})
			// }, 5000);
		}
		setSelectedTileData(tile);
		// console.log("new reffff")
		newRecRef.current = {};
		setNewRecord(emptyObj[0]);
	};

	// useEffect(() => {
	// 	// console.log("record updateee", newRecRef.current)
	// 	setNewRecord(newRecRef.current);
	// }, [recUpdated]);

	const WorkItemsBar = useMemo(() => {
		const budgetItemsData = JSON.parse(JSON.stringify(budgetItems || []));
		const sovData = JSON.parse(JSON.stringify(selectedRecord?.scheduleOfValues || []));
		const options: any =
			budgetItemsData?.length &&
			budgetItemsData?.map((obj: any) => {
				let status = 'pending';
				sovData?.map((row: any) => {
					if (row?.budgetItem?.id == obj?.id) status = row?.status == 'Pending' ? 'pending' : 'completed'
				})
				return {
					value: obj?.id,
					label: `${obj?.name} - ${obj?.costCode ? obj?.costCode : ''} - ${obj?.costType ? obj?.costType : ''}`,
					status: status,
					bidValue: obj?.bidValue,
					changeOrderAmt: obj?.bidValue,
					revisedBidValue: obj?.bidValue,
					description: obj?.description,
				};
			});
		const handleChange = (val: any) => {
			budgetItemsData?.forEach((obj: any) => {
				if (obj?.id == val) setSelectedBudgetItem(obj);
			});
			const data: any = tilesData?.map((tile: any) => {
				if (tile?.type == tableData[val]?.type) { setActiveTile({ ...tile, isActive: true }); return { ...tile, isActive: true } };
				return { ...tile, isActive: false }
			})
			setTilesData(data);
			setSovUnlocked(false)
			newRecRef.current["enableAddBtn"] = false;
		};
		return (
			<div className="vc-schedule-values_work-items">
				<div style={{ width: 500 }}>
					<WorkItemsDropdown
						lineItemlabel={`Work Items (${selectedRecord?.budgetLineItemsWithValidSOV ? selectedRecord?.budgetLineItemsWithValidSOV : 0} of ${budgetItems && budgetItems?.length} Schedule Value Completed)`}
						dropDownListExtraColumns={['ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(selectedRecord?.status) ? [
							...workItemsExtraColumns
						] : [
							{
								name: "status",
								showIcon: true,
								dataKey: "status",
								showValueOnTop: true,
							},
							{ name: "pagination", showValueOnTop: true },
						]}
						ignoreSorting={true}
						selectedValue={selectedBudgetItem?.id}
						options={options || []}
						handleInputChange={(val: any) => { handleChange(val) }}
						showExtraColumns={true}
						showDescription={true}						
						isDropDownPosition={true}
						// columnBasedOptions={['ActivePendingSOVUpdate']?.includes(selectedRecord?.status)}
					></WorkItemsDropdown>
				</div>
				<div className="vc-schedule-values_unit">
					Unit of Measure <b>{selectedBudgetItem?.unitOfMeasure}</b>
				</div>
				<div className="vc-schedule-values_unit">
					Unit Quantity <b>{amountFormatWithOutSymbol(selectedBudgetItem?.quantity)}</b>
				</div>
				<div className="vc-schedule-values_unit">
					Unit Cost{" "}
					<b>
						{amountFormatWithSymbol(selectedBudgetItem?.unitCost)}
					</b>
				</div>
				<div className="vc-schedule-values_unit">
					Bid Value{" "}
					<b>
						{amountFormatWithSymbol(selectedBudgetItem?.bidValue)}
					</b>
				</div>
			</div>
		);
	}, [budgetItems, selectedRecord, selectedBudgetItem]);

	/**
	 * On adding a new record updating the local ref values
	 * @param value
	 * @param updatedRecords  whole table rows data
	 * @author Srinivas Nadendla
	 */
	const onGridRecordAdd = (value: any, updatedRecords: any) => {
		// console.log("onGridRecordAdd", updatedRecords, value);
		const payload = activeTile?.type == 'PercentComplete' ? {
			completionPercentage: value?.completionPercentage,
			payoutPercentage: value?.payoutPercentage,
		} : activeTile?.type == 'UnitOfMeasure' ? {
			completionQuantity: value?.completionQuantity,
			payoutAmount: value?.payoutAmount
		} : {
			workStage: value?.workStage,
			payoutAmount: value?.payoutAmount
		}
		addPaymenForSov(appInfo, selectedRecord?.id, selectedBudgetItem?.id, payload, (response: any) => {
			if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
			else {
				if (response?.status != selectedRecord?.status) {
					dispatch(getVendorContractsList(appInfo));
				}
				dispatch(setSelectedRecord(response));
				response?.scheduleOfValues?.map((obj: any) => {
					if (obj?.budgetItem?.id == selectedBudgetItem?.id && obj?.status == 'Completed') setToast({ show: true, message: `${response?.budgetLineItemsWithValidSOV && response?.budgetLineItemsWithValidSOV} Of ${budgetItems?.length} Schedule Value Completed Successfully.` })
				})
			}
		})
		setNewRecord(emptyObj[0])
		newRecRef.current = {};
		newRecRef.current["enableAddBtn"] = false;
	};

	const ChangePayOutType = (type: string) => {
		if (type == 'yes') {
			setActiveTile(selectedTileData);
			newRecRef.current = {};
			setNewRecord(emptyObj[0]);
			setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...tableData[selectedBudgetItem?.id], payments: [] } })
			deleteAllScheduleOfValues(appInfo, selectedRecord?.id, selectedBudgetItem?.id, (response: any) => {
				if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
				else createScheduleOfValues(appInfo, selectedRecord?.id, selectedBudgetItem?.id, { type: selectedTileData?.type }, (response: any) => {
					if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
					else response?.scheduleOfValues?.map((obj: any) => {
						if (obj?.budgetItem?.id == selectedBudgetItem?.id) setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...obj } })
					})
					// dispatch(setSelectedRecord(response))          
				})
			});
			setShowAlert(false);
			// createScheduleOfValues(appInfo, selectedRecord?.id, selectedBudgetItem?.id, { type: selectedTileData?.type }, (response: any) => {
			// 	response?.scheduleOfValues?.map((obj: any) => {
			// 		if (obj?.budgetItem?.id == selectedBudgetItem?.id) setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...obj } })
			// 	})
			// 	// dispatch(setSelectedRecord(response))          
			// })
			newRecRef.current["enableAddBtn"] = false;
		}
		else {
			//   console.log("els", activeTile)
			setShowAlert(false);
			tableDataRef.current = tableData[selectedBudgetItem?.id]?.payments;
			const data: any = tilesData?.map((tile: any) => {
				if (tile?.recordId == activeTile?.recordId) return { ...tile, isActive: true }
				return { ...tile, isActive: false };
			})
			setTilesData(data);
		}
	}
	/***
	 * On removing record updating the local ref values to the latest
	 * @param value
	 * @param updatedRecords  whole table rows data
	 * @author Srinivas Nadendla
	 */
	const onGridRecordRemove = (value: any, updatedRecords: any) => {
		// setShowAlert(true);
		// console.log("true", value, updatedRecords);
		deleteScheduleOfValue(appInfo, selectedRecord?.id, selectedBudgetItem?.id, value, (response: any) => {
			if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
			else dispatch(getContractDetailsById({ appInfo: appInfo, id: selectedRecord?.id })).then((resp: any) => {
				console.log("respp", resp)
				resp?.payload?.status != selectedRecord?.status && dispatch(getVendorContractsList(appInfo));
			});
		});
		setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...tableData[selectedBudgetItem?.id], payments: [...updatedRecords] } })
		// setTimeout(() => {
		// 	dispatch(getContractDetailsById({ appInfo: appInfo, id: selectedRecord?.id }));
		// }, 5000);
	};
	const handleThroughData = (obj: any) => {
		console.log("handleThroughData", obj);
		updateScheduleOfValuesThroughDate(appInfo, selectedRecord?.id, selectedBudgetItem?.id, obj, (response: any) => {
			if (errorStatus?.includes(response?.status)) setToast({ show: true, message: errorMsg });
			else dispatch(setSelectedRecord(response));
		});

	}

	return (
		<>
			<div className="vc-schedule-values">
				<div className="vc-schedule-values_title-wrapper">
					<b>Schedule of Values</b>
					<div className="vc-schedule-values_auto-pay-switch">
						Auto Create Pay Applications
						<IQTooltip title={`Auto Create Pay Applications `} arrow={true}>
							<Box
								component="img"
								alt="Info icon"
								src={infoicon}
								className="image"
								width={12}
								height={12}
								style={{ marginLeft: "4px", marginRight: 10 }}
							/>
						</IQTooltip>
						<Stack direction="row">
							<IQToggle
								checked={tableData[selectedBudgetItem?.id]?.autoCreatePayApplication}
								switchLabels={["ON", "OFF"]}
								onChange={(e, value) => {
									updateScheduleOfValuesThroughDate(appInfo, selectedRecord?.id, selectedBudgetItem?.id, { autoCreatePayApplication: value }, (response: any) => {
										dispatch(setSelectedRecord(response));
									});
								}}
								disabled={activeTile?.type == 'DollarAmount' ? true : !["Draft", "ReadyToSubmit", "AwaitingAcceptanceUnlocked", "ActiveUnlocked"]?.includes(selectedRecord?.status)}
								edge={"end"}
							/>
						</Stack>
					</div>
				</div>
				{WorkItemsBar}
				<div className="vc-schedule-values_headers">
					<b>How would you like to Pay</b>
				</div>
				<SUISelectionTiles
					tilesData={tilesData}
					readOnly={['Draft', 'ReadyToSubmit',].includes(selectedRecord?.status) || (['ActiveUnlockedPendingSOVUpdate']?.includes(selectedRecord?.status) && selectedBudgetItem?.hasChangeOrder) ? false : true}
					selectedTile={(tile: any) => onSelectedTileChange(tile)}
				></SUISelectionTiles>
				<div className="vc-schedule-values_buttons-wrapper">
					{['ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status) && sovUnlocked && (
						<div className="vc-schedule-values_buttons-wrapper-progress">
							{/* Updates to Schedule of Values in progress ... */}
						</div>
					)}
					{isUserGC(appInfo) && ['ActiveUnlocked', 'Active', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status) && !sovUnlocked ? (
						<Button
							className="vc-schedule-values_buttons-wrapper-btn"
							variant="outlined"
							onClick={() => setSovUnlocked(true)}
							startIcon={<span className='common-icon-lock-fill'></span>}
							disabled={selectedRecord?.status == 'Active' ? true : false}
							sx={{
								"&.Mui-disabled": {
									color: "#febb8f !important",
									border: "1px solid #febb8f !important",
								},
							}}
						>
							UNLOCK SCHEDULE OF VALUE
						</Button>
					) : null
					}
				</div>

				{(!activeTile.recordId || activeTile?.recordId === 1) && (
					<div style={{ width: "100%", height: "300px" }}  className="sov-grid-cls">
						<SUILineItem
							headers={!['Draft', 'ReadyToSubmit', 'Scheduled', 'AwaitingAcceptance']?.includes(selectedRecord?.status) ? [...percentHeaders, ...statusColumn] : percentHeaders}
							// headers={percentHeaders}
							data={tableData[selectedBudgetItem?.id]?.payments ? tableData[selectedBudgetItem?.id]?.payments : []}
							onAdd={(value: any, updatedRecords: any) =>
								onGridRecordAdd(value, updatedRecords)
							}
							onRemove={(value: any, updatedRecords: any) =>
								onGridRecordRemove(value, updatedRecords)
							}
							addRowPosition={"bottom"}
							newRecord={newRecord}
							actionheaderprop={{
								minWidth: 80,
								maxWidth: 80,
							}}
							readOnly={props.readOnly}
							pinnedTopRowData={pinnedTopData}
							hasPinnedTopRow={pinnedTopData?.length}
							deleteConfirmationRequired={true}
						/>
					</div>
				)}
				{activeTile?.recordId === 2 && (
					<div style={{ width: "100%", height: "200px" }}>
						<SUILineItem
							headers={!['Draft', 'ReadyToSubmit', 'Scheduled', 'AwaitingAcceptance']?.includes(selectedRecord?.status) ? [...unitHeaders, ...statusColumn] : unitHeaders}
							data={tableData[selectedBudgetItem?.id]?.payments ? tableData[selectedBudgetItem?.id]?.payments : []}
							onAdd={(value: any, updatedRecords: any) =>
								onGridRecordAdd(value, updatedRecords)
							}
							onRemove={(value: any, updatedRecords: any) =>
								onGridRecordRemove(value, updatedRecords)
							}
							addRowPosition={"bottom"}
							newRecord={newRecord}
							actionheaderprop={{
								minWidth: 80,
								maxWidth: 80,
							}}
							readOnly={props.readOnly}
							pinnedTopRowData={pinnedTopData}
							hasPinnedTopRow={pinnedTopData?.length}
							deleteConfirmationRequired={true}
						/>
					</div>
				)}
				{activeTile?.recordId === 3 && (
					<div style={{ width: "100%", height: "200px" }}>
						<SUILineItem
							headers={!['Draft', 'ReadyToSubmit', 'Scheduled', 'AwaitingAcceptance']?.includes(selectedRecord?.status) ? [...dollarHeaders, ...statusColumn] : dollarHeaders}
							// headers={dollarHeaders}
							data={tableData[selectedBudgetItem?.id]?.payments ? tableData[selectedBudgetItem?.id]?.payments : []}
							onAdd={(value: any, updatedRecords: any) =>
								onGridRecordAdd(value, updatedRecords)
							}
							onRemove={(value: any, updatedRecords: any) =>
								onGridRecordRemove(value, updatedRecords)
							}
							addRowPosition={"bottom"}
							newRecord={newRecord}
							actionheaderprop={{
								minWidth: 80,
								maxWidth: 80,
							}}
							readOnly={props.readOnly}
							pinnedTopRowData={pinnedTopData}
							hasPinnedTopRow={pinnedTopData?.length}
							deleteConfirmationRequired={true}
						/>
					</div>
				)}

				{activeTile?.recordId === 4 && (
					<>
						<div className="vc-schedule-values_headers">
							<b>
								Select an Interval Frequency for the Pay Application to process
								the payment:
							</b>
						</div>
						<SUIPayIntervalFrequency readOnly={props?.readOnly} defaultData={tableData[selectedBudgetItem?.id]} onChange={handleThroughData} endDate={selectedRecord?.endDate}></SUIPayIntervalFrequency>
					</>
				)}
				{
					showAlert && <SUIAlert
						open={showAlert}
						onClose={() => {
							setShowAlert(false);
						}}
						contentText={
							showErrorMsg || showDuplicateMsg ?
								<div>
									<span>{toastMsg}</span>
									<div style={{ textAlign: 'right', marginTop: '10px' }}>
										<Button
											className="cancel-cls"
											style={{
												backgroundColor: '#666',
												color: '#fff',
												padding: '12px',
												height: '37px',
												borderRadius: '2px',
												marginRight: '0px',
												boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
												display: 'initial'
											}}
											onClick={(e: any) => {
												setShowAlert(false); setShowErrorMsg(false); setShowDuplicateMsg(false);
											}}>OK</Button>
									</div>
								</div>
								: <span>Changing the Payout type will remove the already defined SOV values.<br /><br /> Are you sure want to continue?</span>
						}
						title={showErrorMsg || showDuplicateMsg ? 'Warning' : 'Confirmation'}
						onAction={(e: any, type: string) => ChangePayOutType(type)}
						showActions={showErrorMsg || showDuplicateMsg ? false : true}
					/>}
				{
					toast?.show && <Toast message={toast?.message} interval={5000} />
				}

			</div>
		</>
	);
};

export default VendorContractsScheduleValues;
