import React, {useEffect, useState, useRef} from "react";
import SUISelectionTiles from "sui-components/SelectionTiles/SUISelectionTiles";
import SUIPayIntervalFrequency from "sui-components/PayIntervalFrequency/SUIPayIntervalFrequency";
import WorkItemsDropdown from "sui-components/WorkItemsDropdown/WorkItemsDropdown";
import SUILineItem from 'sui-components/LineItem/LineItem';
import IQToggle from 'components/iqtoggle/IQToggle';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import {Stack, Box, Button} from '@mui/material';
import infoicon from "resources/images/common/infoicon.svg";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {useAppDispatch, useAppSelector} from 'app/hooks';
import "./CCBillingSchedule.scss";
import {Lock, FileCopy} from "@mui/icons-material";
import {getSumOfEXistedValues, tilesConstData} from "./utils";
import {getAmountAlignment} from "utilities/commonutills";
import {isUserGCForCC} from "features/clientContracts/utils";
import {getServer} from "app/common/appInfoSlice";
import {addBillingSchedulePayment, createBillingSchedule, deleteBillingScheduleByContract, deletePayment, updatePayment, updatePayWhenPaid} from "features/clientContracts/stores/BillngScheduleAPI";
import SUIAlert from "sui-components/Alert/Alert";
import {getValuesOfAllEntries} from "features/vendorcontracts/vendorcontractsdetails/tabs/schedulevalues/utils";
import {getClientContractDetails, setSelectedRecord} from "features/clientContracts/stores/ClientContractsSlice";
import {getClientContractsList} from "features/clientContracts/stores/gridSlice";
import {setUnlockedSov} from "features/clientContracts/stores/BillingScheduleSlice";
import {PaymentStatus} from "utilities/vendorContracts/enums";
import {formatDate} from "utilities/datetime/DateTimeUtils";
import {amountFormatWithSymbol, amountFormatWithOutSymbol} from 'app/common/userLoginUtils';
import {primaryIconSize} from "features/budgetmanager/BudgetManagerGlobalStyles";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';


const CCBillingSchedule = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const {selectedRecord, cCDetailsGetCall} = useAppSelector((state) => state.clientContracts);
	const {settingsData} = useAppSelector(state => state.settings);


	const newRecRef = useRef<any>();
	const tableDataRef = useRef<any>();

	const [activeTile, setActiveTile] = useState<any>(tilesConstData[1]);
	const [newRecord, setNewRecord] = useState<any>({});
	const [tableData, setTableData] = useState<any>([]);
	const [percentHeaders, setPercentHeaders] = useState<any>([]);
	const [dollarHeaders, setDollarHeaders] = useState<any>([]);
	const [toggleChecked, setToggleChecked] = React.useState<boolean>(false);
	const [sovUnlocked, setSovUnlocked] = React.useState<boolean>(false);
	const [selectedTileData, setSelectedTileData] = useState<any>({});
	const [alert, setAlert] = useState<any>({show: false, warning: false, warningMsg: ''});
	const emptyObj = [{completionPercentage: "", payoutPercentage: "", payoutAmount: null, balanceAmount: null}];
	const billingSchedule = selectedRecord?.billingSchedule;
	const contingencyPercentageAmount = selectedRecord?.addContingencies ? (selectedRecord?.contingencyPercentage / 100 * selectedRecord?.originalAmount) : 0;
	const totalBudgetValue = Number(selectedRecord?.totalAmount ?? 0) - Number(selectedRecord?.downPaymentAmount ?? 0) - Number(selectedRecord?.contingencyAmount ? selectedRecord?.contingencyAmount : contingencyPercentageAmount) + Number(selectedRecord?.changeOrderAmount ?? 0);


	// const totalBudgetValue = selectedRecord?.includeEntireBudget ? selectedRecord?.totalAmount : getValuesOfAllEntries(selectedRecord?.budgetItems, 'budgetAmount')?.reduce((a: any, b: any) => Number(a) + Number(b), 0)

	const [tilesData, setTilesData] = useState<any>(tilesConstData);
	const [pinnedTopData, setPinnedTopData] = useState<any>([]);

	useEffect(() => {
		if(selectedRecord?.billingSchedule) {
			console.log("ifffff");
			const tiles = tilesData?.map((obj: any) => {
				if(obj?.type == selectedRecord?.billingSchedule?.type) {setActiveTile(obj); return {...obj, isActive: true};}
				return {...obj, isActive: false};
			});
			setTilesData(tiles);
		}
		else {
			console.log("elseeee", cCDetailsGetCall, selectedRecord, activeTile);
			selectedRecord?.billingSchedule == null && cCDetailsGetCall && createBillingSchedule(appInfo, selectedRecord?.id, {type: activeTile?.type}, (response: any) => {
				dispatch(setSelectedRecord(response));
			});
		}
		if(selectedRecord?.billingSchedule?.status == 'Completed') {dispatch(setUnlockedSov(false)); setSovUnlocked(false);};

	}, [selectedRecord]);

	const getWarningSymbol = (params: any, inputField: boolean, type: string) => {
		if(['ActiveUnlockedPendingSOVUpdate', 'ActivePendingSOVUpdate']?.includes(selectedRecord?.status) && !params?.data?.payoutAmount && (inputField ? params.node.rowPinned !== 'top' : true) && !['Paid', 'SelectedForPayment']?.includes(params?.data?.status)) return <IQTooltip
			title={`This field currently reflects the previous ${type == 'percentComplete' ? '% Payout' : 'Payout Amount'} entered for this SOV. Please validate and enter a new ${type == 'percentComplete' ? '% Payout' : 'Payout Amount'} value.`}
			placement={'bottom'}
			arrow={true}
		>
			<WarningAmberIcon fontSize={primaryIconSize} style={{color: 'red'}} />
		</IQTooltip>;

		else return '';
	};

	React.useEffect(() => {dispatch(setUnlockedSov(sovUnlocked));}, [sovUnlocked]);

	useEffect(() => {
		newRecRef.current = {};
		const percentCols = [
			{
				headerName: "",
				minWidth: 60,
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
				minWidth: 165,
				sortable: false,
				sort: 'asc',
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div style={{textAlign: "center"}}>
							{params.data?.completionPercentage}%
						</div>
					) : (
						<div style={{textAlign: "center"}}>
							<TextField
								id="work-completion-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{width: "70px"}}
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
				type: "rightAligned",
				sortable: false,
				cellRenderer: (params: any) => {
					return props.readOnly || ['Paid', 'SelectedForPayment'].includes(params?.data?.status) ? (
						<div style={{textAlign: "center"}} className="warning-cls">{params.data?.payoutPercentage}%
							{getWarningSymbol(params, false, 'percentComplete')}
						</div>
					) : (
						<div style={{textAlign: "center"}} className="warning-cls">
							<TextField
								id="payout-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{width: "70px"}}
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
										<InputAdornment position="end">%
											{getWarningSymbol(params, true, 'percentComplete')}
										</InputAdornment>
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
					return !props.readOnly && params.node.rowPinned === 'top' ? (
						<div>{amountFormatWithSymbol(newRecRef.current?.payoutAmount)}</div>
					) : (
						<div>
							{amountFormatWithSymbol(params?.data?.payoutAmount)}
						</div>
					);
				},
			},
			{
				headerName: "Balance Amount",
				field: "balanceAmount",
				minWidth: 200,
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
								{amountFormatWithSymbol(totalBudgetValue)}
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
								of
								{" "}
								{amountFormatWithSymbol(totalBudgetValue)}
							</span>
						</div>
					);
				},
			},
		];
		setPercentHeaders(percentCols);

		const dollarCols = [
			{
				headerName: "",
				minWidth: 70,
				type: "rightAligned",
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
						<div style={{textAlign: "left"}}>
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
							{getWarningSymbol(params, false, 'dollarAmount')}
						</div>
					) : (
						<div>
							<TextField
								id="payout-text-field"
								placeholder="Enter"
								variant="standard"
								sx={{width: "80px"}}
								value={
									params.node.rowPinned === 'top'
										? amountFormatWithOutSymbol(newRecRef.current?.payoutAmount)
										: amountFormatWithOutSymbol(params.data.payoutAmount)
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
											{getWarningSymbol(params, true, 'dollarAmount')}
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
				minWidth: 220,
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
								{amountFormatWithSymbol(totalBudgetValue)}
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
								{amountFormatWithSymbol(totalBudgetValue)}
							</span>
						</div>
					);
				},
			},
		];
		setDollarHeaders(dollarCols);
		// setTableData(gridData);
		// tableDataRef.current = gridData;
	}, [selectedRecord?.billingSchedule, props.readOnly, totalBudgetValue]);

	React.useEffect(() => {
		if(!props.readOnly) {
			setPinnedTopData(emptyObj);
		}
		else setPinnedTopData([]);
	}, [selectedRecord, props.readOnly]);

	const statusColumn = [
		{
			headerName: "Payment Status",
			field: "status",
			minWidth: 185,
			menuTabs: [],
			cellStyle: {textAlign: "center"},
			cellRenderer: (params: any) => {
				const payStatus = PaymentStatus[params.data?.status];
				if(payStatus === "Paid") {
					let styleOpts = {
						style: {color: payStatus === "Paid" ? "#008000c2" : "red"},
					};
					return <div {...styleOpts}>{payStatus}</div>;
				} return payStatus;
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
		event.stopPropagation();
		const enteredValue = selectedRecord?.billingSchedule?.type == 'DollarAmount' && colKey == 'workStage' ? event?.target?.value : Number(event.target.value?.replaceAll(',', ''));
		let existedValuesSum = (selectedRecord?.billingSchedule?.type != 'DollarAmount' && colKey != 'workStage') && getSumOfEXistedValues(selectedRecord?.billingSchedule?.payments, colKey, params);
		console.log("ffff", selectedRecord?.billingSchedule, enteredValue, getValuesOfAllEntries(selectedRecord?.billingSchedule?.payments, colKey), existedValuesSum,);
		// if(getValuesOfAllEntries(selectedRecord?.billingSchedule?.payments, colKey)?.includes(enteredValue)) {
		// 	console.log("if")
		// 	setAlert({...alert, show: true, warning: true, warningMsg: 'Duplicate Values are not allowed.' })    
		// }
		if(selectedRecord?.billingSchedule?.type == 'PercentComplete' && enteredValue > 100) {
			setAlert({...alert, show: true, warning: true, warningMsg: 'Values More than 100 are not allowed.'});

		}
		else if(colKey == 'payoutPercentage' && ((params.node?.rowPinned === 'top' && existedValuesSum ? Number(existedValuesSum) : 0) + enteredValue > 100)) {
			setAlert({...alert, show: true, warning: true, warningMsg: "The sum of 'Percent Payout' values from all the rows cannot be more than 100."});
		}
		else if(colKey == 'payoutAmount' && totalBudgetValue && (enteredValue > totalBudgetValue || ((existedValuesSum ? Number(existedValuesSum) : 0) + enteredValue > totalBudgetValue))) {
			setAlert({...alert, show: true, warning: true, warningMsg: 'Sum of Payout amount of all rows cannot exceed the total contract Value.'});

		}
		else {
			const value = (totalBudgetValue / 100) * enteredValue;

			if(params.node.rowPinned === 'top') {
				newRecRef.current[colKey] = enteredValue;
				if(activeTile?.type == "PercentComplete") {
					let existedValues = getValuesOfAllEntries(selectedRecord?.billingSchedule?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0);
					existedValues = (existedValues ? Number(existedValues) : 0) + Number(enteredValue);
					console.log("existeddd", existedValues);
					const paidAmount = Number(totalBudgetValue / 100) * Number(existedValues);
					console.log("iffffff", existedValues, enteredValue, paidAmount);
					if(colKey == "payoutPercentage") {
						console.log("second");
						newRecRef.current["payoutAmount"] = value;
						newRecRef.current["balanceAmount"] =
							totalBudgetValue - Number(paidAmount);
					}
					if(
						newRecRef?.current?.completionPercentage &&
						newRecRef?.current?.payoutAmount
					) {
						newRecRef.current["enableAddBtn"] = true;
					} else {
						newRecRef.current["enableAddBtn"] = false;
					}
				}
				if(activeTile?.type == "DollarAmount") {
					if(colKey == 'payoutAmount') {
						let existedValues = getValuesOfAllEntries(selectedRecord?.billingSchedule?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0);
						existedValues = (existedValues ? Number(existedValues) : 0) + Number(enteredValue);
						newRecRef.current["balanceAmount"] = totalBudgetValue - Number(existedValues);
					}
					if(newRecRef?.current?.workStage && newRecRef?.current?.payoutAmount) {
						newRecRef.current["enableAddBtn"] = true;
					} else {
						newRecRef.current["enableAddBtn"] = false;
					}
				}

				params.node.setData(newRecRef.current);//Using to re-render the cells when there is a change

				console.log("onchange", newRecRef);
			}
			else {
				console.log("put call", colKey, enteredValue, tableDataRef?.current);
				// params.node.setDataValue(colKey, enteredValue); 
				const gridDataCopy = [...selectedRecord?.billingSchedule?.payments];
				let updatedObj = {...gridDataCopy[params.node.rowIndex]};
				if(activeTile?.type == "PercentComplete") {
					console.log("iffffff", colKey, gridDataCopy, value, updatedObj);
					if(colKey == 'payoutPercentage') {
						console.log("second", gridDataCopy[params.node.rowIndex]["payoutAmount"], value);
						let existedValues = getValuesOfAllEntries(selectedRecord?.billingSchedule?.payments, colKey)?.reduce((a: any, b: any) => Number(a) + Number(b), 0);
						existedValues = existedValues + Number(enteredValue);
						updatedObj = {...updatedObj, payoutAmount: value};
						updatedObj = {...updatedObj, balanceAmount: totalBudgetValue - Number(value)};
						console.log("dataaa111", gridDataCopy);
					}
				}
				console.log("dataaa222", gridDataCopy, updatedObj);
				if(activeTile?.type == "DollarAmount") {
					if(colKey == 'payoutAmount') updatedObj = {...updatedObj, balanceAmount: totalBudgetValue - Number(value)};
				}
				updatedObj = {...updatedObj, [colKey]: enteredValue};
				gridDataCopy[params.node.rowIndex] = updatedObj;
				console.log("dataaa", gridDataCopy, updatedObj);
				//params.node.setDataValue(colKey, enteredValue);
				params.node.setData(gridDataCopy[params.node.rowIndex]);//Using to re-render the cells when there is a change
				tableDataRef.current = {...selectedRecord?.billingSchedule, payments: [...gridDataCopy]};
			}
		};
	};

	/**
	 * On blur of cell, updating the tableData based on tableDataRef.current.
	 * We can perform any other validations needed here.
	 * @param event
	 * @param params Ag grid row params
	 * @param colKey dynamic column field
	 * @author Srinivas Nadendla
	 */
	const handleTableCellsBlur = (event: any, params: any, colKey: string) => {
		const enteredValue = activeTile?.type == 'DollarAmount' && colKey == 'workStage' ? event?.target?.value : Number(event.target.value);
		if(['completionPercentage', 'workStage'].includes(colKey) && getValuesOfAllEntries(selectedRecord?.billingSchedule?.payments, colKey)?.includes(enteredValue)) {
			setAlert({...alert, show: true, warning: true, warningMsg: 'Duplicate Values are not allowed.'});
			newRecRef.current[colKey] = '';
			newRecRef.current["enableAddBtn"] = false;
			params.node.setData(newRecRef.current);
		}
		if(params.node.rowPinned !== 'top') {
			const updatedRecord = tableDataRef?.current;
			console.log("updatedRecord", updatedRecord);
			const payload = updatedRecord?.type == 'PercentComplete' ? {completionPercentage: updatedRecord?.payments[params.node.rowIndex]?.completionPercentage, payoutPercentage: updatedRecord?.payments[params.node.rowIndex]?.payoutPercentage}
				: {payoutAmount: updatedRecord?.payments[params.node.rowIndex]?.payoutAmount, workStage: updatedRecord?.payments[params.node.rowIndex]?.workStage};
			updatePayment(appInfo, selectedRecord?.id, payload, params?.data?.id, (response: any) => {
				if(response?.status != selectedRecord?.status) {
					dispatch(getClientContractsList(appInfo));
				}
				dispatch(setSelectedRecord(response));
			});
		}
		if(params.node.rowPinned === 'top') {
			console.log("pinned", newRecRef?.current);
			if(colKey == 'payoutAmount') {newRecRef.current['newRecRef.current'] = amountFormatWithOutSymbol(newRecRef.current?.payoutAmount);}
			const event = new CustomEvent('updateSOVRec', {detail: newRecRef});
			document.dispatchEvent(event);
		}
	};

	const onSelectedTileChange = (tile: any) => {
		console.log("tile", tile, selectedRecord?.billingSchedule);
		if(Object?.keys(tile)?.length) {
			if(selectedRecord?.billingSchedule?.payments?.length > 0 || (activeTile?.type == 'PayWhenPaid' && ['Monthly', 'Weekly', 'RealTime']?.includes(selectedRecord?.billingSchedule?.payIntervalFrequency))) {
				setAlert({...alert, show: true});
			}
			else {
				Object.keys(tile)?.length && setActiveTile(tile);
				const resp = deleteBillingScheduleByContract(appInfo, selectedRecord?.id, (response: any) => {
					createBillingSchedule(appInfo, selectedRecord?.id, {type: tile?.type}, (response: any) => {
						dispatch(setSelectedRecord(response));
					});
				});
				// setTimeout(() => {
				// 	createBillingSchedule(appInfo, selectedRecord?.id, { type: tile?.type }, (response: any) => {
				// 		dispatch(setSelectedRecord(response))
				// 	})
				// }, 5000);
			}
			setSelectedTileData(tile);
			// console.log("new reffff");
			newRecRef.current = {};
			setNewRecord(emptyObj[0]);
		}
	};


	/**
	 * On adding a new record updating the local ref values
	 * @param value
	 * @param updatedRecords  whole table rows data
	 * @author Srinivas Nadendla
	 */
	const onGridRecordAdd = (value: any, updatedRecords: any) => {
		console.log("onGridRecordAdd", value, selectedRecord?.billingSchedule, activeTile);
		tableDataRef.current = updatedRecords;
		const payload = selectedRecord?.billingSchedule?.type == 'PercentComplete' ? {completionPercentage: value?.completionPercentage, payoutPercentage: value?.payoutPercentage} : {workStage: value?.workStage, payoutAmount: value?.payoutAmount};
		addBillingSchedulePayment(appInfo, selectedRecord?.id, payload, (response: any) => {
			if(response?.status != selectedRecord?.status) {
				dispatch(getClientContractsList(appInfo));
			}
			dispatch(setSelectedRecord(response));
			console.log("responseresponseresponse", response);
		});
		setNewRecord(emptyObj[0]);
		newRecRef.current = {};
	};

	/***
	 * On removing record updating the local ref values to the latest
	 * @param value
	 * @param updatedRecords  whole table rows data
	 * @author Srinivas Nadendla
	 */
	const onGridRecordRemove = (value: any, updatedRecords: any) => {
		console.log(value);
		tableDataRef.current = updatedRecords;
		deletePayment(appInfo, selectedRecord?.id, value, (response: any) => {
			dispatch(getClientContractDetails({appInfo: appInfo, contractId: selectedRecord?.id}));
		});
		// setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...tableData[selectedBudgetItem?.id], payments: [...updatedRecords] } })
		// setTimeout(() => {
		// 	dispatch(getClientContractDetails({ appInfo: appInfo, contractId: selectedRecord?.id }));
		// }, 5000);
	};

	const handlePayWhenPaid = (obj: any) => {
		console.log("pay when paid", obj);
		updatePayWhenPaid(appInfo, selectedRecord?.id, obj, (response: any) => {
			if(response?.status != selectedRecord?.status) {
				dispatch(getClientContractsList(appInfo));
			}
			dispatch(setSelectedRecord(response));
		});

	};
	const ChangePayOutType = (type: string) => {
		if(type == 'yes') {
			setActiveTile(selectedTileData);
			newRecRef.current = {};
			setNewRecord(emptyObj[0]);
			// setTableData({ ...tableData, [selectedBudgetItem?.id]: { ...tableData[selectedBudgetItem?.id], payments: [] } })
			deleteBillingScheduleByContract(appInfo, selectedRecord?.id, (response: any) => {
				createBillingSchedule(appInfo, selectedRecord?.id, {type: selectedTileData?.type}, (response: any) => {
					if(response?.status != selectedRecord?.status) {
						dispatch(getClientContractsList(appInfo));
					}
					dispatch(setSelectedRecord(response));
				});
			});
			setAlert({...alert, show: false});
			// createBillingSchedule(appInfo, selectedRecord?.id, { type: selectedTileData?.type }, (response: any) => {
			// 	if (response?.status != selectedRecord?.status) {
			// 		dispatch(getClientContractsList(appInfo));
			// 	}
			// 	dispatch(setSelectedRecord(response))
			// })
		}
		else {
			//   console.log("els", activeTile)
			setAlert({...alert, show: false});
			// tableDataRef.current = tableData[selectedBudgetItem?.id]?.payments;
			const data: any = tilesData?.map((tile: any) => {
				if(tile?.recordId == activeTile?.recordId) return {...tile, isActive: true};
				return {...tile, isActive: false};
			});
			setTilesData(data);
		}
	};
	const getSovAmountDetailText = (contractDetails: any, allowMarkupFee: boolean) => {
		const totalMarkupFeeAmount = amountFormatWithOutSymbol(contractDetails?.totalMarkupFeeAmount ?? 0);
		const contingencyAmount = contractDetails?.contingencyAmount ? amountFormatWithOutSymbol(contractDetails?.contingencyAmount) : amountFormatWithOutSymbol(contractDetails?.contingencyPercentage / 100 * contractDetails?.originalAmount);
		const feeAmount = contractDetails?.feeAmount ? amountFormatWithOutSymbol(contractDetails?.feeAmount) : amountFormatWithOutSymbol(contractDetails?.feePercentage / 100 * contractDetails?.originalAmount);
		const downPaymentAmount = amountFormatWithOutSymbol(contractDetails?.downPaymentAmount ?? 0);
		const originalContractAmount = amountFormatWithOutSymbol(contractDetails?.originalAmount);
		const totalContractAmount = amountFormatWithOutSymbol(contractDetails?.totalAmount);
		const contingencyPercentageAmount = contractDetails?.addContingencies ? (contractDetails?.contingencyPercentage / 100 * contractDetails?.originalAmount) : 0;
		const newSovAmount = amountFormatWithOutSymbol(Number(contractDetails?.totalAmount ?? 0) + Number(contractDetails?.changeOrderAmount ?? 0) - Number(contractDetails?.downPaymentAmount ?? 0) - Number(contractDetails?.contingencyAmount ? contractDetails?.contingencyAmount : contingencyPercentageAmount));
		const changeOrder = contractDetails?.changeOrderAmount && ['ActiveUnlockedPendingSOVUpdate', 'ActivePendingSOVUpdate']?.includes(contractDetails?.status) ? `+ Change Order Amount (${amountFormatWithSymbol(contractDetails?.changeOrderAmount)})` : null;

		if(contractDetails?.addFee && contractDetails?.addContingencies) {
			return <>
				New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) = Original Contract Amount ({amountFormatWithSymbol(originalContractAmount)})
				{allowMarkupFee ? ` + Mark-up Fee (${amountFormatWithSymbol(totalMarkupFeeAmount)})` : ''} +
				Contract Fee ({amountFormatWithSymbol(feeAmount)}) + Contingency ({amountFormatWithSymbol(contingencyAmount)}).
				<span className="bold"> Contingency amount is excluded from SOV break-up calculation.</span>
				New SOV Amount ({amountFormatWithSymbol(newSovAmount)}) = New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) {changeOrder ? changeOrder : ''} {contractDetails?.hasDownPayment ? ` - Down Payment (${amountFormatWithSymbol(downPaymentAmount)})` : ''} - Contingency ({amountFormatWithSymbol(contingencyAmount)})
			</>;
		}
		else if(contractDetails?.addContingencies) {
			return <>
				New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) = Original Contract Amount ({amountFormatWithSymbol(originalContractAmount)})
				{allowMarkupFee ? ` + Mark-up Fee (${amountFormatWithSymbol(contractDetails?.totalMarkupFeeAmount)})` : ''} +
				Contingency ({amountFormatWithSymbol(contingencyAmount)}).
				<span className="bold">Contingency amount is excluded from SOV break-up calculation.</span>
				New SOV Amount({amountFormatWithSymbol(newSovAmount)}) = New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) {changeOrder ? changeOrder : ''} {contractDetails?.hasDownPayment ? ` - Down Payment (${amountFormatWithSymbol(downPaymentAmount)})` : ''} - Contingency ({amountFormatWithSymbol(contingencyAmount)})
			</>;
		}
		else if(contractDetails?.addFee)
			return !contractDetails?.hasDownPayment ? <>
				New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) = Original Contract Amount ({amountFormatWithSymbol(originalContractAmount)})
				{allowMarkupFee ? ` + Mark-up Fee (${amountFormatWithSymbol(totalMarkupFeeAmount)}) ` : ' '} +
				Contract Fee ({amountFormatWithSymbol(feeAmount)})
			</>
				: <>
					New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) = Original Contract Amount ({amountFormatWithSymbol(originalContractAmount)})
					{allowMarkupFee ? ` + Mark-up Fee (${amountFormatWithSymbol(totalMarkupFeeAmount)}) ` : ' '} +
					Contract Fee({amountFormatWithSymbol(feeAmount)}).
					<span>Down Payment amount is excluded from SOV break-up calculation.</span>
					New SOV Amount({amountFormatWithSymbol(newSovAmount)}) = New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) {changeOrder ? changeOrder : ''} - Down Payment ({amountFormatWithSymbol(downPaymentAmount)}).
				</>;

		else if(contractDetails?.hasDownPayment) {
			return <>
				Down Payment Of ({amountFormatWithSymbol(downPaymentAmount)}) for the Original Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) has been enabled under schedule of values.
			</>;
		}
		else if(allowMarkupFee) {
			return <>
				New Contract Amount ({amountFormatWithSymbol(totalContractAmount)}) = Original Contract Amount ({amountFormatWithSymbol(originalContractAmount)})
				{allowMarkupFee ? ` + Mark-up Fee (${amountFormatWithSymbol(totalMarkupFeeAmount)})` : ''}
			</>;
		}
	};

	return (
		<>
			<div className="cc-schedule-values">
				<div className="cc-schedule-values_title-wrapper">
					<b>Billing Schedule</b>
					<b>{(selectedRecord?.includeEntireBudget === null || !selectedRecord?.budgetItems) && 'You Need to define the Schedule Of Values and at least one budget should be selected then only you can add the Payments'}</b>
					<div className="cc-schedule-values_auto-pay-switch">
						Auto Create Pay Applications
						<IQTooltip title={`Auto Create Pay Applications `} arrow={true} >
							<span className="common-icon-Project-Info"></span>
						</IQTooltip>
						<Stack direction='row'>
							<IQToggle
								checked={selectedRecord?.billingSchedule?.autoCreatePayApplication}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => {
									console.log('On change', value);
									// setToggleChecked(value)
									updatePayWhenPaid(appInfo, selectedRecord?.id, {autoCreatePayApplication: value}, (response: any) => dispatch(setSelectedRecord(response)));
								}}
								edge={'end'}
								disabled={props?.readOnly || selectedRecord?.billingSchedule?.type == 'DollarAmount' ? true : false}
							/>
						</Stack>
					</div>
				</div>
				<div className="cc-schedule-values_body">
					<div className="cc-schedule-values_headers">
						<b>How would you like to Pay</b>
					</div>
					<SUISelectionTiles
						tilesData={tilesData}
						// readOnly={props?.readOnly}
						readOnly={['Draft', 'ReadyToSubmit',].includes(selectedRecord?.status) && selectedRecord?.budgetItems ? false : true}
						selectedTile={(tile: any) => onSelectedTileChange(tile)}
					></SUISelectionTiles>
					{
						((isUserGCForCC(appInfo)) && selectedRecord?.budgetItems?.length && (selectedRecord?.totalMarkupFeeAmount > 0 || selectedRecord?.addFee || selectedRecord?.addContingencies || selectedRecord?.hasDownPayment)) && <div className="estimated-bid-cls">
							<div className="message-text-yellow">
								<span className="common-icon-info-white"></span>
								<span className="text">{getSovAmountDetailText(selectedRecord, settingsData?.allowMarkupFee)}</span>
							</div>
						</div>
					}
					<div className="vc-schedule-values_buttons-wrapper">
						{['ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status) && sovUnlocked && (
							<div className="vc-schedule-values_buttons-wrapper-progress">
							</div>
						)}
						{isUserGCForCC(appInfo) && ['ActiveUnlocked', 'Active', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status) && !sovUnlocked ? (
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
								UNLOCK BILLING SCHEDULE
							</Button>
						) : null
						}
					</div>

					{activeTile?.recordId === 2 && (
						<div style={{width: "100%", height: "300px"}} className="sov-grid-cls">
							<SUILineItem
								// headers={percentHeaders}
								headers={!['Draft', 'ReadyToSubmit', 'Scheduled', 'AwaitingAcceptance']?.includes(selectedRecord?.status) ? [...percentHeaders, ...statusColumn] : percentHeaders}
								data={selectedRecord?.billingSchedule?.payments ? selectedRecord?.billingSchedule?.payments : []}
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
						<div style={{width: "100%", height: "200px"}}>
							<SUILineItem
								// headers={dollarHeaders}
								headers={!['Draft', 'ReadyToSubmit', 'Scheduled', 'AwaitingAcceptance']?.includes(selectedRecord?.status) ? [...dollarHeaders, ...statusColumn] : dollarHeaders}
								data={selectedRecord?.billingSchedule?.payments ? selectedRecord?.billingSchedule?.payments : []}
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

					{(!activeTile.recordId || activeTile?.recordId === 1) && (
						<>
							<div className="cc-schedule-values_headers">
								<b>
									Select an Interval Frequency for the Pay Application to process
									the payment:
								</b>
							</div>
							<SUIPayIntervalFrequency readOnly={props?.readOnly} defaultData={selectedRecord?.billingSchedule} onChange={handlePayWhenPaid} endDate={selectedRecord?.endDate}></SUIPayIntervalFrequency>
						</>
					)}

					{
						alert?.show && <SUIAlert
							open={alert?.show}
							onClose={() => {
								setAlert(false);
							}}
							contentText={
								alert?.warning ?
									<div>
										<span>{alert?.warningMsg}</span>
										<div style={{textAlign: 'right', marginTop: '10px'}}>
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
													setAlert({show: false, warning: false, warningMsg: ''});
												}}>OK</Button>
										</div>
									</div>
									: <span>Changing the Payout type will remove the already defined Billing Schedule.<br /><br /> Are you sure want to continue?</span>
							}
							title={alert?.warning ? 'Warning' : 'Confirmation'}
							onAction={(e: any, type: string) => ChangePayOutType(type)}
							showActions={alert?.warning ? false : true}
						/>
					}
				</div>
			</div>
		</>
	);
};

export default CCBillingSchedule;
