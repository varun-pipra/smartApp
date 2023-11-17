import React, { useMemo } from "react";
import SUIGrid from "sui-components/Grid/Grid";
import CustomTooltip from "../../features/budgetmanager/aggrid/customtooltip/CustomToolTip";
import VendorList from "../../features/budgetmanager/aggrid/vendor/Vendor";
import CostCodeDropdown from "components/costcodedropdown/CostCodeDropdown";
import SmartDropDown from "components/smartDropdown";
import { makeStyles, createStyles } from '@mui/styles';
import convertDateToDisplayFormat, { getCurveText } from "utilities/commonFunctions";
import DatePickerComponent from "components/datepicker/DatePicker";
import { curveList } from "../../features/budgetmanager/headerpage/HeaderPage";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSelectedRows, fetchGridData, setGridData } from "../../features/budgetmanager/operations/gridSlice";
import { setSelectedRowData } from "../../features/budgetmanager/operations/rightPanelSlice";
import { setSelectedRowIndex } from "../../features/budgetmanager/operations/rightPanelSlice";
import { updateBudgetLineItem } from "../../features/budgetmanager/operations/gridAPI";
import { getServer, getCostCodeDivisionList, getCostTypeList } from "app/common/appInfoSlice";

import "./GridExample.scss";

import {
	setRightPannel,
	showRightPannel,
} from "../../features/budgetmanager/operations/tableColumnsSlice";
import DropdownEditor from "sui-components/Grid/editors/DropDownEditor";

import { appInfoData } from "data/appInfo";
import DateEditor from "sui-components/Grid/editors/DateEditor";

import Toolbar from "sui-components/Grid/Toolbar";

import IQSearchField from "components/iqsearchfield/IQSearchField";

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			//maxHeight: 300,
			maxWidth: '160px !important',
			minWidth: 'fit-content !important',
			marginLeft: '18px'
		}
	})
);

const GridPaginationExample = (props: any) => {

	const dispatch = useAppDispatch();
	const { gridData, selectedRows, liveData } = useAppSelector((state) => state.gridData);
	const [collapsedGroupHeaders, setCollapsedGroupHeaders] = React.useState<any>([]);
	const [tableRef, setGridRef] = React.useState<any>(null);
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const costCodeDivisionOpts = useAppSelector(getCostCodeDivisionList);
	const costTypeOpts = useAppSelector(getCostTypeList);

	const { isBudgetLocked } = useAppSelector((state) => state.tableColumns);
	const { selectedRowIndexData, selectedRow } = useAppSelector(
		(state) => state.rightPanel
	);
	const rightPannel = useAppSelector(showRightPannel);

	React.useEffect(() => {
		sessionStorage.setItem('collapsedGroupHeaders', JSON.stringify(collapsedGroupHeaders));
	}, [collapsedGroupHeaders]);

	React.useEffect(() => {
		dispatch(setSelectedRows([]));
	}, [gridData]);

	React.useEffect(() => {
		// console.log(liveData);
		tableRef?.current?.api?.applyTransaction(liveData);
	}, [liveData]);

	const classes = useStyles();
	const [columnDefs, setColumnDefs] = React.useState([
		{
			headerName: "Cost Code Group",
			field: "division",
			pinned: "left",
			rowGroup: true,
			hide: true,
		},
		{ headerName: "Budget ID/CBS", field: "name" },
		{ headerName: "Description", field: "description", editable: true },
		{
			headerName: "Division/Cost Code",
			field: "costCode",
			minWidth: 380,
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				// return params && params.data && params.value.length > 50
				// 	? params.value
				// 	: null;
			},
			cellRenderer: (params: any) => {
				return params.node.level == 1 ? (
					<CostCodeDropdown
						label=""
						options={
							costCodeDivisionOpts?.length > 0 ? costCodeDivisionOpts : []
						}
						required={false}
						selectedValue={
							params.data
								? params.data.division + "|" + params.data.costCode
								: ""
						}
						checkedColor={"#0590cd"}
						onChange={(value) => handleOnChange(value, params)}
						showFilter={false}
						isFullWidth={true}
						sx={{
							fontSize: "13px",
							"&:before": {
								border: "none",
							},
							"&:after": {
								border: "none",
							},
							".MuiSelect-icon": {
								display: "none",
							},
						}}
					/>
				) : null;
				//<>{params.data ? params.data.costType : ''}</>
			},
		},
		{
			headerName: "Cost Type",
			field: "costType",
			type: 'dropdown',
			editable: true,
			// cellEditor: DropdownEditor,
			// cellEditorPopup: true,
			// cellEditorParams: {
			options: [
				{ label: "None - None", value: "None - None" },
				{ label: "E - Equipment", value: "E - Equipment" },
				{ label: "L - Labor", value: "L - Labor" },
				{ label: "M - Materials", value: "M - Materials" },
				{ label: "OC - Owner Cost", value: "OC - Owner Cost" },
				{ label: "S - Commitment", value: "S - Commitment" },
				{ label: "SVC - Professional Services", value: "SVC - Professional Services" },
				{ label: "O - Others", value: "O - Others" }
			]
			// },

			// cellRenderer: (params: any) => {
			// 	return params.node.level == 1 ? (
			// 		<SmartDropDown
			// 			options={costTypeOpts}
			// 			dropDownLabel=""
			// 			isSearchField={false}
			// 			isFullWidth={true}
			// 			selectedValue={params.data ? params.data.costType : ""}
			// 			handleChange={(value: any) => handleOnChange(value, params)}
			// 			sx={{
			// 				fontSize: "13px",
			// 				"&:before": {
			// 					border: "none",
			// 				},
			// 				"&:after": {
			// 					border: "none",
			// 				},
			// 				".MuiSelect-icon": {
			// 					display: "none",
			// 				},
			// 			}}
			// 			menuProps={classes.menuPaper}
			// 		/>
			// 	) : null;
			// },
		},
		{
			headerName: "Original Budget Amount",
			field: "originalAmount",
			valueGetter: (params: any) =>
				params.data ? params.data.originalAmount : "",
			aggFunc: "sum",
			minWidth: 210,
			type: "rightAligned",
			// cellRenderer: (params: any) => {
			// 	if (params.value && (
			// 		params.node.footer ||
			// 		params.node.level > 0 ||
			// 		!params.node.expanded)
			// 	) {
			// 		return currencySymbol + " " + params.value.toLocaleString("en-US");
			// 	}
			// },
		},
		{
			headerName: "Budget Transfer Amount",
			valueGetter: (params: any) => 0,
			aggFunc: "sum",
			minWidth: 210,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (
					// params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded
					// )
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Approved COs",
			valueGetter: (params: any) =>
				params.data ? params.data.approvedBudgetChange : "",
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded)
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Revised Budget",
			valueGetter: (params: any) =>
				params.data ? params.data.revisedBudget : "",
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded)
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Transaction Amount",
			valueGetter: (params: any) =>
				params.data ? params.data.balanceModifications : "",
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded)
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Remaining Balance",
			valueGetter: (params: any) => (params.data ? params.data.balance : ""),
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded)
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Curve",
			field: "curve",
			minWidth: 120,
			valueGetter: (params: any) =>
				params.data ? getCurveText(params.data.curve) : "",
			cellRenderer: (params: any) => {
				return params.node.level == 1 ? (
					<SmartDropDown
						options={curveList}
						dropDownLabel=""
						isSearchField={false}
						isFullWidth={false}
						selectedValue={params.data ? params.data.curve : ""}
						handleChange={(value: any) => handleOnChange(value, params)}
						sx={{
							"&:before": {
								border: "none",
							},
							"&:after": {
								border: "none",
							},
							".MuiSelect-icon": {
								display: "none",
							},
						}}
						menuProps={classes.menuPaper}
					/>
				) : null;
			},
		},
		{
			headerName: "Vendor",
			field: "Vendors",
			minWidth: 210,
			editable: true,
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params.data && params.value.length > 25 ? params.value : null;
			},
			cellRenderer: (params: any) => {
				return params && params.node.level == 1 ? (
					<VendorList
						value={params.data.Vendors}
						handleVendorChange={handleChangeVendor}
						params={params}
						multiSelect={true}
					/>
				) : null;
			},
		},
		{
			headerName: "Estimated Start Date",
			field: "estimatedStart",
			valueGetter: (params: any) => params.data ? convertDateToDisplayFormat(params.data.estimatedStart) : "",
			editable: true,
			type: 'date',
			//editable: true,
			// cellEditor: 'mySimpleEditor',
			// cellEditorParams: {
			// 	onChange: (value: any, params: any) => {
			// 		handleOnChange(value, params)
			// 	}
			// },
			// cellRenderer: (params: any) => {
			// 	return (
			// 		params.node.level == 1 ?
			// 			<DatePickerComponent
			// 				defaultValue={convertDateToDisplayFormat(params.data.estimatedStart)}
			// 				onChange={(val: any) => handleOnChange(val, params)}
			// 				maxDate={params.data.estimatedEnd !== '' ? new Date(params.data.estimatedEnd) : new Date('12/31/9999')}
			// 				style={{
			// 					width: '170px',
			// 					border: 'none',
			// 					background: 'transparent'
			// 				}}
			// 			/>
			// 			: null
			// 	)
			// }
		},
		{
			headerName: "Estimated End Date",
			//editable: true,
			field: "estimatedEnd",
			valueGetter: (params: any) => params.data ? convertDateToDisplayFormat(params.data.estimatedEnd) : "",
			cellRenderer: (params: any) => {
				return (
					params.node.level == 1 ?
						<DatePickerComponent
							defaultValue={convertDateToDisplayFormat(params.data.estimatedEnd)}
							onChange={(val: any) => handleOnChange(val, params)}
							minDate={new Date(params.data.estimatedStart)}
							style={{
								width: '170px',
								border: 'none',
								background: 'transparent'
							}}

						/>
						: null
				)
			}
		},
		{
			headerName: "Projected Schedule Start",
			// field: "estimatedStart",
			valueGetter: (params: any) => "",
		},
		{
			headerName: "Projected Schedule End",
			// field: "estimatedStart",
			valueGetter: (params: any) => "",
		},
		{
			headerName: "Actual Schedule Start",
			// field: "estimatedStart",
			valueGetter: (params: any) => "",

		},
		{
			headerName: "Actual Schedule End",
			field: "estimatedStart",
			// valueGetter: (params: any) => "",
		},
		{ headerName: "Unit Of Measure", field: "unitOfMeasure" },
		{ headerName: "Unit Quantity",
			field: "unitQuantity" ,
			cellRenderer: (params: any) => {
				return (
					<span>{params?.data?.unitQuantity?.toLocaleString("en-US")}</span>
				)
			}
		},
		{
			headerName: "Unit Cost",
			valueGetter: (params: any) =>
				params.data ? params.data.unitCost : "",
			field: "unitCost",
			cellRenderer: (params: any) => {
				if (params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded)
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Pending Change Order",
			valueGetter: (params: any) => (params.data ? 0 : ""),
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if
					// (params.value && 
					(
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded
					// )
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Pending Transactions",
			valueGetter: (params: any) => (params.data ? 0.0 : ""),
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (
					// params.value && 
					// (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded
					// )
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Budget Forecast",
			valueGetter: (params: any) => (params.data ? 0.0 : ""),
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (
					// params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded
					// )
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
		{
			headerName: "Balance Forecast",
			valueGetter: (params: any) => (params.data ? 0.0 : ""),
			aggFunc: "sum",
			type: "rightAligned",
			cellRenderer: (params: any) => {
				if (
					// params.value && (
					params.node.footer ||
					params.node.level > 0 ||
					!params.node.expanded
					// )
				) {
					return currencySymbol + " " + params.value.toLocaleString("en-US");
				}
			},
		},
	]);

	const handleOnChange = (newvalue: any, event: any) => {
		const fieldname = event.colDef.field;
		let new_obj;
		if (fieldname == "originalAmount") {
			new_obj = { ...event.data, originalAmount: newvalue };
		} else if (fieldname == "costType") {
			new_obj = { ...event.data, costType: newvalue[0] };
		} else if (fieldname == "curve") {
			new_obj = { ...event.data, curve: newvalue };
		} else if (fieldname == "estimatedStart") {
			new_obj = { ...event.data, estimatedStart: newvalue };
		} else if (fieldname == "estimatedEnd") {
			new_obj = { ...event.data, estimatedEnd: newvalue };
		} else if (fieldname == "Vendors") {
			new_obj = { ...event.data, Vendors: newvalue };
		} else if (fieldname == "costCode") {
			const costCodeTuple = newvalue.split("|");
			new_obj = { ...event.data, costCode: costCodeTuple[1] };
		}
		const object = {
			division: new_obj.division,
			costCode: new_obj.costCode,
			costType: new_obj.costType,
			estimatedStart: convertDateToDisplayFormat(new_obj.estimatedStart),
			estimatedEnd: convertDateToDisplayFormat(new_obj.estimatedEnd),
			curve: new_obj.curve,
			originalAmount: parseInt(new_obj.originalAmount),
			status: new_obj.status,
			Vendors: new_obj.Vendors,
		};
		updateBudgetLineItem(appInfo, new_obj.id, object, (response: any) => {
			dispatch(fetchGridData(appInfo));
		});
	};

	const handleChangeVendor = (vendor: string[], params: any) => {
		handleOnChange(vendor, params);
	};

	const [rowData] = React.useState([
		{
			"id": "cf321266-f8fc-48e6-9e67-04b1b596f1a8",
			"description": null,
			"createdBy": {
				"email": "mksudeep@smartapp.com",
				"uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "Sudeep 02",
				"firstName": "MK",
				"displayName": "Sudeep 02, MK"
			},
			"modifiedBy": {
				"email": "mksudeep@smartapp.com",
				"uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "Sudeep 02",
				"firstName": "MK",
				"displayName": "Sudeep 02, MK"
			},
			"createdDate": "2022-10-28T10:54:07.33",
			"modifiedDate": "2022-10-28T10:54:07.33",
			"projectId": "190e55b8-5907-42cd-9d94-13024a8ea568",
			"name": "00143",
			"division": "01 - General Requirement",
			"costCode": "General Contractor- Industrial Maintenance 1007",
			"costType": "OC - Owner Cost",
			"estimatedStart": "2022-10-24T00:00:00",
			"estimatedEnd": "2022-10-27T00:00:00",
			"curve": 2,
			"originalAmount": 1000,
			"status": 0,
			"balanceModifications": 0,
			"approvedBudgetChange": 0,
			"revisedBudget": -1000,
			"balance": -1000,
			"isCostCodeInvalid": true,
			"Vendors": [],
			"unitOfMeasure": null,
			"unitQuantity": null,
			"unitCost": null,
			"pendingChangeOrderAmount": null,
			"pendingTransactionAmount": 0,
			"budgetForecast": null,
			"balanceForecast": -1000,
			"actualScheduleStart": null,
			"actualScheduleEnd": null,
			"projectedScheduleStart": null,
			"projectedScheduleEnd": null
		}, { "id": "344147ad-b2ce-4033-9ed8-04b74e77047c", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "createdDate": "2022-10-24T17:06:38.923", "modifiedDate": "2022-10-24T17:14:05.61", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00128", "division": "02 - Existing Conditions", "costCode": "Cement 2065", "costType": "M - Materials", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-28T00:00:00", "curve": 0, "originalAmount": 50000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 50000, "balance": 49550, "isCostCodeInvalid": true, "Vendors": [{ "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }, { "id": "78eaaeb8-2aa6-4b54-ae35-c946bd3eebfd", "name": "Idea", "color": "1B5E20" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 50000, "balanceForecast": 49550, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "02db7f32-ed55-4e6f-a04f-0a500535cd3a", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-27T13:38:03.267", "modifiedDate": "2022-11-04T01:32:29.863", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00140", "division": "09 - Finishes", "costCode": "Carpet 9680", "costType": "L - Labor", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-28T00:00:00", "curve": 1, "originalAmount": 8000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 7000, "balance": 6200, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 300, "budgetForecast": 7000, "balanceForecast": 6500, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "d0c148cc-1185-4a69-b697-1f65fac1de07", "description": null, "createdBy": { "email": "mcolapietro@smartapp.com", "uniqueId": "17705337-f6ad-428a-98d4-f071e4b3c4f5", "globalId": "c38e8e45-64b3-498f-86ce-11efd3821d6c", "lastName": "Colapietro", "firstName": "Michael", "displayName": "Colapietro, Michael" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-26T14:34:04.04", "modifiedDate": "2022-10-24T17:18:17.61", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00078", "division": "02 - Existing Conditions", "costCode": "Off-site Transportation and Disposal 2060", "costType": "L - Labor", "estimatedStart": "2022-09-26T00:00:00", "estimatedEnd": "2022-09-30T00:00:00", "curve": 0, "originalAmount": 5000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 5000, "balance": 0, "isCostCodeInvalid": true, "Vendors": [{ "id": "d005b969-30a0-44b6-8e16-6181d9c9d176", "name": "YS1", "color": "808080" }, { "id": "6e2e94da-163f-41f2-ace4-3413fc7bd290", "name": "RKSSync", "color": "dddddd" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 5000, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "2bce6bb4-776e-467e-852e-203f677198cd", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-22T18:51:19.88", "modifiedDate": "2022-09-22T18:51:19.88", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00021", "division": "Marine Work 2480", "costCode": "02 - Existing Conditions", "costType": "Labour", "estimatedStart": "2022-09-24T00:00:00", "estimatedEnd": "2023-09-30T00:00:00", "curve": 0, "originalAmount": 1000000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "e2d2c79c-7bfc-4ed5-b500-24cc3a8dadf3", "description": null, "createdBy": { "email": "bpradhan@smartapp.com", "uniqueId": "618348ab-f8b1-451f-b0bd-8fee76cacde5", "globalId": "7480a85f-28bc-4dc1-9ef2-49d139a13e2a", "lastName": "Pradhan", "firstName": "Binaya", "displayName": "Pradhan, Binaya" }, "modifiedBy": { "email": "bpradhan@smartapp.com", "uniqueId": "618348ab-f8b1-451f-b0bd-8fee76cacde5", "globalId": "7480a85f-28bc-4dc1-9ef2-49d139a13e2a", "lastName": "Pradhan", "firstName": "Binaya", "displayName": "Pradhan, Binaya" }, "createdDate": "2022-09-23T07:36:35.16", "modifiedDate": "2022-09-23T07:36:35.16", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00038", "division": "20 - ABC Miscellaneous", "costCode": "Attorney 20300", "costType": "OC", "estimatedStart": "2022-09-14T00:00:00", "estimatedEnd": "2022-09-20T00:00:00", "curve": 0, "originalAmount": 9999999, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": false, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "e78dece5-8ca2-4a5e-afad-27a04d360efe", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-23T14:14:11.83", "modifiedDate": "2022-09-23T14:14:11.83", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00043", "division": "20 - ABC Miscellaneous", "costCode": "Insurance 20800", "costType": "Owner Cost", "estimatedStart": "2022-09-21T00:00:00", "estimatedEnd": "2022-09-23T00:00:00", "curve": 0, "originalAmount": 2200, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": false, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "16760f0c-36e0-40de-94ba-2a36eede3591", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-19T13:55:27.8", "modifiedDate": "2022-11-02T06:09:09.51", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00122", "division": "01 - General Requirement", "costCode": "General Contractor- Heavy/Highway 1006", "costType": "L - Labor", "estimatedStart": "2022-10-17T00:00:00", "estimatedEnd": "2022-10-21T00:00:00", "curve": 1, "originalAmount": 50000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 50000, "balance": 0, "isCostCodeInvalid": true, "Vendors": [{ "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }, { "id": "8e65bcc0-df5a-4c2d-b41f-4f906522ddb8", "name": "Android Data Sync Company", "color": "a64203" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 50000, "balanceForecast": 0, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "7c4d984e-1072-40db-9f60-2cf1d2e0988c", "description": "", "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-11-04T01:27:14.64", "modifiedDate": "2022-11-04T01:27:14.64", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00156", "division": "09 - Finishes", "costCode": "Wood Flooring 9550", "costType": "E - Equipment", "estimatedStart": "2022-11-01T00:00:00", "estimatedEnd": "2022-11-05T00:00:00", "curve": 0, "originalAmount": 3333, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 3333, "balance": 3333, "isCostCodeInvalid": false, "Vendors": [], "unitOfMeasure": "", "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 3333, "balanceForecast": 3333, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "dc95c24c-30ef-4a21-89d7-307283a2085b", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-23T07:26:26.533", "modifiedDate": "2022-11-02T06:09:08.883", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00030", "division": "01 - General Requirement", "costCode": "General Contractor- Heavy/Highway 1006", "costType": "E - Equipment", "estimatedStart": "2022-09-23T00:00:00", "estimatedEnd": "2022-09-28T00:00:00", "curve": 2, "originalAmount": 5555, "status": 0, "balanceModifications": 100, "approvedBudgetChange": 0, "revisedBudget": 5965, "balance": -43945, "isCostCodeInvalid": true, "Vendors": [{ "id": "0d688a6b-bc90-4fc8-8016-0e185c897663", "name": "No Company", "color": "FF0000" }, { "id": "03304ee2-b151-4f74-aa40-6422ef214a64", "name": "Smartapp", "color": "FF0000" }, { "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }, { "id": "83a0e9c6-af0c-43ee-982f-0c4ef183dd7a", "name": "SampleC", "color": "aae752" }, { "id": "782e4fbe-5574-4baa-95d4-0afa52b17287", "name": "SampleD", "color": "13ee34" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 5965, "balanceForecast": -43945, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "a16426bb-1f74-4aaa-b2df-30c95563c087", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-12T09:38:46.95", "modifiedDate": "2022-10-12T09:38:46.95", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00105", "division": "06 - Wood and Plastics", "costCode": "Lumber 6300", "costType": "L - Labor", "estimatedStart": "2022-10-12T00:00:00", "estimatedEnd": "2022-10-13T00:00:00", "curve": 0, "originalAmount": 5, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 5, "balance": 5, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 5, "balanceForecast": 5, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "00fc386c-d042-4284-b301-3959e4e375d3", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-22T18:51:19.887", "modifiedDate": "2022-09-22T18:51:19.887", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00023", "division": "Aggregate Manufacture Supplier 2040", "costCode": "02 - Existing Conditions", "costType": "Equipment", "estimatedStart": "2022-09-24T00:00:00", "estimatedEnd": "2023-09-30T00:00:00", "curve": 0, "originalAmount": 1000000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "0d94bedc-5283-4cac-a305-3a4b0b9d32e0", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-24T17:09:16.25", "modifiedDate": "2022-09-24T17:09:16.25", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00062", "division": "09 - Finishes", "costCode": "Drywall 9250", "costType": "L - Labor", "estimatedStart": "2022-09-20T00:00:00", "estimatedEnd": "2022-09-26T00:00:00", "curve": 1, "originalAmount": 1200, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "cf2b55e5-40d8-4433-9e0c-3ef8a3137c31", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-19T13:31:23.443", "modifiedDate": "2022-11-02T07:18:54.9", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00120", "division": "01 - General Requirement", "costCode": "General Contractor- Industrial Maintenance 1007", "costType": "M - Materials", "estimatedStart": "2022-10-18T00:00:00", "estimatedEnd": "2022-10-27T00:00:00", "curve": 2, "originalAmount": 100000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 100000, "balance": 98276, "isCostCodeInvalid": true, "Vendors": [{ "id": "03304ee2-b151-4f74-aa40-6422ef214a64", "name": "Smartapp", "color": "FF0000" }, { "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }, { "id": "782e4fbe-5574-4baa-95d4-0afa52b17287", "name": "SampleD", "color": "13ee34" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 270, "budgetForecast": 100000, "balanceForecast": 98546, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "d2dfdf57-4142-40b6-92e2-415599c931d7", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-27T13:32:50.877", "modifiedDate": "2022-10-27T13:34:01.643", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00139", "division": "02 - Existing Conditions", "costCode": "Demolition 2050", "costType": "SVC - Professional Services", "estimatedStart": "2001-01-01T00:00:00", "estimatedEnd": "2001-01-01T00:00:00", "curve": 1, "originalAmount": 20000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 20000, "balance": 20000, "isCostCodeInvalid": true, "Vendors": [{ "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 20000, "balanceForecast": 20000, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "4a986d00-17e5-4e69-9d64-46cdef8aac3c", "description": null, "createdBy": { "email": "vraj@inquesttechnologies.com", "uniqueId": "d11793c8-cc25-419f-8e7a-e7d360ef915b", "globalId": "9193ac67-fd46-4ae2-b34a-4db3656ad1cf", "lastName": "Mani", "firstName": "1Vimal Raj", "displayName": "Mani, 1Vimal Raj" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-31T20:40:09.18", "modifiedDate": "2022-11-02T06:48:32.29", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00149", "division": "01 - General Requirement", "costCode": "General Contractor- Commercial 1004", "costType": "SVC - Professional Services", "estimatedStart": "2022-11-01T00:00:00", "estimatedEnd": "2022-10-31T00:00:00", "curve": 0, "originalAmount": 100, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 21, "balance": 1, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 21, "balanceForecast": 1, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "2ef924c6-9e60-4ec1-8ff0-47072dc4f425", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-28T14:27:07.463", "modifiedDate": "2022-11-02T06:09:18.35", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00145", "division": "05 - Metals", "costCode": "Structural Metal Erection 5010", "costType": "E - Equipment", "estimatedStart": "2022-10-28T00:00:00", "estimatedEnd": "2022-10-29T00:00:00", "curve": 1, "originalAmount": 100, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 100, "balance": 100, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 100, "balanceForecast": 100, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "3c793ded-c42a-49c1-aa87-4a46666a06ff", "description": null, "createdBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "modifiedBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "createdDate": "2022-10-24T18:47:41.183", "modifiedDate": "2022-10-24T18:47:41.183", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00131", "division": "16 - Electrical", "costCode": "Controls 16900", "costType": "M - Materials", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-28T00:00:00", "curve": 2, "originalAmount": 50000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 50000, "balance": 50000, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 50000, "balanceForecast": 50000, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "a290dbf8-be38-43ce-aab0-4d4fbc9ebe7f", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-19T13:57:11.457", "modifiedDate": "2022-11-02T06:09:10.68", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00123", "division": "01 - General Requirement", "costCode": "General Contractor- Industrial 1008", "costType": "OC - Owner Cost", "estimatedStart": "2022-10-19T00:00:00", "estimatedEnd": "2022-10-27T00:00:00", "curve": 0, "originalAmount": 60000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 0, "balanceForecast": 0, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "d4fd8a40-46e8-4b73-96fb-50cddc1b4156", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-22T18:51:19.887", "modifiedDate": "2022-09-22T18:51:19.887", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00022", "division": "Railroad Work 2450", "costCode": "02 - Existing Conditions", "costType": "Labour", "estimatedStart": "2022-09-24T00:00:00", "estimatedEnd": "2023-09-30T00:00:00", "curve": 0, "originalAmount": 1000000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "91213e63-1bd3-41df-ad3a-587ac532befd", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-11-03T16:18:33.89", "modifiedDate": "2022-11-03T16:20:48.237", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00154", "division": "10 - Specialties", "costCode": "Wall and Corner Guards 10260", "costType": "E - Equipment", "estimatedStart": "2022-11-01T00:00:00", "estimatedEnd": "2022-11-04T00:00:00", "curve": 0, "originalAmount": 890, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 890, "balance": 890, "isCostCodeInvalid": false, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 890, "balanceForecast": 890, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "12c43538-c16d-4c84-bcc9-58c2dd251500", "description": null, "createdBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "modifiedBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "createdDate": "2022-10-24T17:25:04.923", "modifiedDate": "2022-10-24T17:25:04.923", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00129", "division": "02 - Existing Conditions", "costCode": "Railroad Work 2450", "costType": "L - Labor", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-28T00:00:00", "curve": 1, "originalAmount": 100000, "status": 0, "balanceModifications": 789, "approvedBudgetChange": 0, "revisedBudget": 100789, "balance": 96578, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 100789, "balanceForecast": 96578, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "1047532c-1d0c-45fa-a2fe-5ad9cdf1e926", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-19T08:41:27.49", "modifiedDate": "2022-10-19T08:41:27.49", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00109", "division": "09 - Finishes", "costCode": "Acoustical Treatment 9500", "costType": "OC - Owner Cost", "estimatedStart": "0001-01-01T00:00:00", "estimatedEnd": "0001-01-01T00:00:00", "curve": 1, "originalAmount": 20000, "status": 0, "balanceModifications": 100, "approvedBudgetChange": 0, "revisedBudget": 21400, "balance": 21400, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 21400, "balanceForecast": 21400, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "34f8c76a-0ba7-4ae1-88bc-60bd02f31979", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-20T14:08:36.68", "modifiedDate": "2022-11-04T02:47:25.007", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00126", "division": "01 - General Requirement", "costCode": "General Contractor- Airports 1002", "costType": "L - Labor", "estimatedStart": "2022-10-20T00:00:00", "estimatedEnd": "2022-10-27T00:00:00", "curve": 0, "originalAmount": 10000, "status": 0, "balanceModifications": 10, "approvedBudgetChange": 0, "revisedBudget": 11000, "balance": 10725, "isCostCodeInvalid": true, "Vendors": [{ "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }, { "id": "8e65bcc0-df5a-4c2d-b41f-4f906522ddb8", "name": "Android Data Sync Company", "color": "a64203" }, { "id": "880991e3-5a51-4b93-8caa-902f5ff8afa5", "name": "Android Sub Contractor Ds", "color": "a75825" }, { "id": "dfbd9450-f9ad-4a46-a97b-fcdcde49f7b6", "name": "CompanyD", "color": "769c02" }, { "id": "f85bbbb0-5971-4989-bfd7-b572e16ad6d8", "name": "companyE", "color": "a0d11e" }, { "id": "e65c67b4-dd01-45c5-9df9-105b01a4e0f6", "name": "companyX", "color": "a97e4f" }, { "id": "5e44fa20-506a-4cfc-a63d-e5beac487621", "name": "companyV", "color": "b41860" }, { "id": "3dbfeb18-7fbb-4216-839e-7f440871e69e", "name": "companyF", "color": "9adf4d" }, { "id": "fb610afa-0652-4aef-82bf-bbb84d14987a", "name": "CompanySync", "color": "080808" }, { "id": "1af5e8a2-04ce-4c4a-9eba-e40669a7f587", "name": "Apple", "color": "c0f7e5" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 11000, "balanceForecast": 10725, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "f46aad74-d22b-47f7-a3c1-6120dd3a96d2", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-19T08:20:29.6", "modifiedDate": "2022-10-19T08:20:29.6", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00108", "division": "09 - Finishes", "costCode": "Drywall 9250", "costType": "M - Materials", "estimatedStart": "0001-01-01T00:00:00", "estimatedEnd": "0001-01-01T00:00:00", "curve": 0, "originalAmount": 5000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 4600, "balance": 4600, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 4600, "balanceForecast": 4600, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "90709a52-b29d-486c-8ba8-613a66e7891a", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "dpao@smartapp.com", "uniqueId": "9763dfda-49b9-416c-8feb-99950f836789", "globalId": "cbed40c6-6980-4ff1-8a74-e81130516bd4", "lastName": "Pao", "firstName": "Danilo", "displayName": "Pao, Danilo" }, "createdDate": "2022-10-31T12:37:03.01", "modifiedDate": "2022-11-02T14:04:22.793", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00147", "division": "01 - General Requirement", "costCode": "General Contractor- Churches 1003", "costType": "None - None", "estimatedStart": "2001-01-01T00:00:00", "estimatedEnd": "2001-01-01T00:00:00", "curve": 0, "originalAmount": 100, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 100, "balance": -8277, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 100, "balanceForecast": -8277, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "5fe15151-778b-4c15-b830-613f41205e97", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-28T13:54:25.46", "modifiedDate": "2022-11-02T06:09:32.2", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00144", "division": "01 - General Requirement", "costCode": "General Contractor- Design/Build 1005", "costType": "SVC - Professional Services", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-28T00:00:00", "curve": 0, "originalAmount": 2500, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 2500, "balance": 2500, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 2500, "balanceForecast": 2500, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "22053417-f6b0-444f-84b9-6773764995f5", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-04T13:52:33.153", "modifiedDate": "2022-10-28T08:00:06.17", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00094", "division": "08 - Doors and Windows", "costCode": "Access Doors 8305", "costType": "E - Equipment", "estimatedStart": "2022-10-02T00:00:00", "estimatedEnd": "2022-10-07T00:00:00", "curve": 0, "originalAmount": 5000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 5000, "balance": 4950, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 5000, "balanceForecast": 4950, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "a5604cd9-e0a5-4682-82e5-67d6e6cf37ea", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-19T10:16:20.42", "modifiedDate": "2022-10-19T12:44:46.443", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00116", "division": "02 - Existing Conditions", "costCode": "Site Work Supplier 2010", "costType": "L - Labor", "estimatedStart": "2001-01-01T00:00:00", "estimatedEnd": "2001-01-01T00:00:00", "curve": 0, "originalAmount": 50000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 50000, "balance": 50000, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 50000, "balanceForecast": 50000, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "4d80961b-c4e0-4a98-a888-6a1060b14e93", "description": "sadfsda\nsadf\nsadf\n", "createdBy": { "email": "mcolapietro@smartapp.com", "uniqueId": "17705337-f6ad-428a-98d4-f071e4b3c4f5", "globalId": "c38e8e45-64b3-498f-86ce-11efd3821d6c", "lastName": "Colapietro", "firstName": "Michael", "displayName": "Colapietro, Michael" }, "modifiedBy": { "email": "mcolapietro@smartapp.com", "uniqueId": "17705337-f6ad-428a-98d4-f071e4b3c4f5", "globalId": "c38e8e45-64b3-498f-86ce-11efd3821d6c", "lastName": "Colapietro", "firstName": "Michael", "displayName": "Colapietro, Michael" }, "createdDate": "2022-11-02T20:20:23.887", "modifiedDate": "2022-11-02T20:20:23.887", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00153", "division": "09 - Finishes", "costCode": "Special Coatings 9800", "costType": "M - Materials", "estimatedStart": "2022-11-01T00:00:00", "estimatedEnd": "2022-11-05T00:00:00", "curve": 1, "originalAmount": 250, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 250, "balance": 250, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": "ea", "unitQuantity": 5, "unitCost": 50, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 250, "balanceForecast": 250, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "88ef502a-9538-4eb9-beb2-6b4ffa3ffbc0", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-22T18:49:29.027", "modifiedDate": "2022-09-22T18:49:29.027", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00015", "division": "Metal Handrails & Railings 5520", "costCode": "05 - Metals", "costType": "Owner Cost", "estimatedStart": "2022-09-24T00:00:00", "estimatedEnd": "2023-09-30T00:00:00", "curve": 0, "originalAmount": 1000000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": false, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "42fa3203-d2fd-4e55-b238-70af3a98bd2d", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-22T18:51:19.87", "modifiedDate": "2022-09-22T18:51:19.87", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00018", "division": "Concrete Formwork 3100", "costCode": "03 - Concrete", "costType": "Labour", "estimatedStart": "2022-09-24T00:00:00", "estimatedEnd": "2023-09-30T00:00:00", "curve": 0, "originalAmount": 1000000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "131b6acb-f99f-4b9e-9520-74b600c268a4", "description": null, "createdBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-24T18:51:25.217", "modifiedDate": "2022-11-02T06:09:10.07", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00133", "division": "01 - General Requirement", "costCode": "General Contractor- High Rise Office 1011", "costType": "E - Equipment", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-28T00:00:00", "curve": 2, "originalAmount": 55800, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 55800, "balance": 40400, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 55800, "balanceForecast": 40400, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "0f65377a-a168-43ea-96a9-76cbd28385be", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-24T12:09:05.597", "modifiedDate": "2022-10-24T12:09:05.597", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00127", "division": "05 - Metals", "costCode": "Structural Metal Erection 5010", "costType": "M - Materials", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-25T00:00:00", "curve": 0, "originalAmount": 4, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 4, "balance": 4, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 4, "balanceForecast": 4, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "6e58507e-82d1-4e05-8b68-7a3cf342feab", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-22T18:51:19.877", "modifiedDate": "2022-09-22T18:51:19.877", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00019", "division": "Miscellaneous Metal Fabrications 5500", "costCode": "05 - Metals", "costType": "Owner Cost", "estimatedStart": "2022-09-24T00:00:00", "estimatedEnd": "2023-09-30T00:00:00", "curve": 0, "originalAmount": 1000000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": false, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "5a9d18fc-805f-43c4-b22d-7d1664656c42", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-22T18:49:28.977", "modifiedDate": "2022-09-22T18:49:28.977", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00014", "division": "General Contractor 1001", "costCode": "01 - General Requirement", "costType": "Materials", "estimatedStart": "2022-09-24T00:00:00", "estimatedEnd": "2023-09-30T00:00:00", "curve": 0, "originalAmount": 1000000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 0, "balance": 0, "isCostCodeInvalid": false, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": null, "balanceForecast": null, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "1f021075-2e74-49db-ae48-7d72078634f8", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-11-02T14:29:59.563", "modifiedDate": "2022-11-02T14:29:59.563", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00150", "division": "02 - Existing Conditions", "costCode": "Marine Work 2480", "costType": "E - Equipment", "estimatedStart": "2022-11-02T00:00:00", "estimatedEnd": "2022-11-03T00:00:00", "curve": 2, "originalAmount": 12, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 12, "balance": 12, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": "", "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 12, "balanceForecast": 12, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "941f0a7b-a155-467e-8453-7d968110726e", "description": null, "createdBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "modifiedBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "createdDate": "2022-10-24T18:49:34.17", "modifiedDate": "2022-10-24T18:49:34.17", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00132", "division": "16 - Electrical", "costCode": "High Voltage Distribution, Switching and Protection 16320", "costType": "L - Labor", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-29T00:00:00", "curve": 2, "originalAmount": 25000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 25000, "balance": 25000, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 25000, "balanceForecast": 25000, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "bb4064d1-8f2f-41f0-af11-85e8e9c0729a", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-12T06:21:24.417", "modifiedDate": "2022-11-02T06:09:27.75", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00099", "division": "05 - Metals", "costCode": "Steel Joists 5210", "costType": "SVC - Professional Services", "estimatedStart": "2022-10-12T00:00:00", "estimatedEnd": "2022-10-13T00:00:00", "curve": 2, "originalAmount": 3, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 103, "balance": 101, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 103, "balanceForecast": 101, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "f991abc3-7496-4721-8365-8b03ec0539b3", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-24T13:03:08.36", "modifiedDate": "2022-10-19T19:34:17.237", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00061", "division": "01 - General Requirement", "costCode": "General Contractor- Institutional 1009", "costType": "M - Materials", "estimatedStart": "2022-09-21T00:00:00", "estimatedEnd": "2022-09-30T00:00:00", "curve": 2, "originalAmount": 3000, "status": 0, "balanceModifications": 350, "approvedBudgetChange": 0, "revisedBudget": 3975, "balance": 3725, "isCostCodeInvalid": true, "Vendors": [{ "id": "03304ee2-b151-4f74-aa40-6422ef214a64", "name": "Smartapp", "color": "FF0000" }, { "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 3975, "balanceForecast": 3725, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "f88716ae-3301-4131-9016-90758543f33e", "description": null, "createdBy": { "email": "jcarr@smartapp.com", "uniqueId": "ce5e5a12-230e-425e-a955-648b02c20fba", "globalId": "980f5175-1bdf-457f-b894-f6d145710c25", "lastName": "Carr", "firstName": "Jeremy", "displayName": "Carr, Jeremy" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-24T18:27:07.56", "modifiedDate": "2022-11-03T13:59:25.58", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00130", "division": "16 - Electrical", "costCode": "Industrial Electrical Work 16400", "costType": "L - Labor", "estimatedStart": "2022-10-24T00:00:00", "estimatedEnd": "2022-10-28T00:00:00", "curve": 3, "originalAmount": 50000, "status": 0, "balanceModifications": 200, "approvedBudgetChange": 0, "revisedBudget": 50100, "balance": 47100, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 50100, "balanceForecast": 47100, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "608fc745-a97d-4de7-ba7c-9184f1be8c96", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-12T05:35:11.733", "modifiedDate": "2022-10-17T19:58:43.263", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00097", "division": "02 - Existing Conditions", "costCode": "Tunneling 2300", "costType": "SVC - Professional Services", "estimatedStart": "2022-10-12T00:00:00", "estimatedEnd": "2022-10-14T00:00:00", "curve": 2, "originalAmount": 500, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 500, "balance": 500, "isCostCodeInvalid": true, "Vendors": [{ "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }, { "id": "78eaaeb8-2aa6-4b54-ae35-c946bd3eebfd", "name": "Idea", "color": "1B5E20" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 788, "budgetForecast": 500, "balanceForecast": 1288, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "09957197-9d6a-4512-8279-91b5e0759cfc", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-31T12:31:40.777", "modifiedDate": "2022-11-02T06:44:52.77", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00146", "division": "01 - General Requirement", "costCode": "General Contractor- Design/Build 1005", "costType": "M - Materials", "estimatedStart": "2001-01-01T00:00:00", "estimatedEnd": "2001-01-01T00:00:00", "curve": 0, "originalAmount": 1000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 4000, "balance": -444, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 4000, "balanceForecast": -444, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "345dfb06-c219-410f-929a-9657e593dc05", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-09-23T18:21:46.297", "modifiedDate": "2022-09-23T18:21:46.297", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00045", "division": "08 - Doors and Windows", "costCode": "Special Windows 8650", "costType": "Equipment", "estimatedStart": "2022-09-26T00:00:00", "estimatedEnd": "2022-09-30T00:00:00", "curve": 0, "originalAmount": 22000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 22000, "balance": 22000, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 22000, "balanceForecast": 22000, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "31dbaee8-918d-4536-af70-9659a4fc935d", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-12T09:38:33.633", "modifiedDate": "2022-10-12T09:38:33.633", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00104", "division": "06 - Wood and Plastics", "costCode": "Rough Carpentry 6100", "costType": "OC - Owner Cost", "estimatedStart": "2022-10-12T00:00:00", "estimatedEnd": "2022-10-14T00:00:00", "curve": 0, "originalAmount": 4, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 4, "balance": 4, "isCostCodeInvalid": true, "Vendors": [], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 4, "balanceForecast": 4, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "808767ce-1f76-4e2f-9ae2-9735a2ffbc23", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-19T13:53:21.55", "modifiedDate": "2022-11-01T16:48:07.223", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00121", "division": "01 - General Requirement", "costCode": "General Contractor- Industrial Maintenance 1007", "costType": "L - Labor", "estimatedStart": "2022-10-17T00:00:00", "estimatedEnd": "2022-10-21T00:00:00", "curve": 0, "originalAmount": 80000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 79400, "balance": 77422, "isCostCodeInvalid": true, "Vendors": [{ "id": "8e65bcc0-df5a-4c2d-b41f-4f906522ddb8", "name": "Android Data Sync Company", "color": "a64203" }, { "id": "880991e3-5a51-4b93-8caa-902f5ff8afa5", "name": "Android Sub Contractor Ds", "color": "a75825" }, { "id": "f82dc2ed-0170-4b3f-8f05-11de8ed34d49", "name": "comapnyI", "color": "65a110" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 79400, "balanceForecast": 77422, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }, { "id": "175b8233-9b8a-45e7-99b0-9ea6486a6940", "description": null, "createdBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "modifiedBy": { "email": "mksudeep@smartapp.com", "uniqueId": "7c4f29bf-34de-44a0-917c-c4897589418b", "globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c", "lastName": "Sudeep 02", "firstName": "MK", "displayName": "Sudeep 02, MK" }, "createdDate": "2022-10-26T18:27:25.867", "modifiedDate": "2022-10-31T14:46:36.297", "projectId": "190e55b8-5907-42cd-9d94-13024a8ea568", "name": "00134", "division": "01 - General Requirement", "costCode": "General Contractor- Retail 1033", "costType": "L - Labor", "estimatedStart": "2022-10-27T00:00:00", "estimatedEnd": "2022-10-31T00:00:00", "curve": 2, "originalAmount": 60000, "status": 0, "balanceModifications": 0, "approvedBudgetChange": 0, "revisedBudget": 60000, "balance": 60000, "isCostCodeInvalid": true, "Vendors": [{ "id": "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5", "name": "ACME Inc", "color": "21042f" }], "unitOfMeasure": null, "unitQuantity": null, "unitCost": null, "pendingChangeOrderAmount": 0, "pendingTransactionAmount": 0, "budgetForecast": 60000, "balanceForecast": 60000, "actualScheduleStart": null, "actualScheduleEnd": null, "projectedScheduleStart": null, "projectedScheduleEnd": null }]);

	const autoGroupColumnDef = {
		headerName: "Cost Code Group",
		valueGetter: (params: any) =>
			params.data
				? `${params.data.division} - ${params.data.costCode} - ${params.data.costType}`
				: "",
		pinned: "left",
		sort: "asc",
		width: 550,
		resizable: true,
		// tooltipComponent: CustomTooltip,
		tooltipValueGetter: (params: any) => {
			return params.data && params.value.length > 68 ? params.value : null;
		},
		cellRenderer: "agGroupCellRenderer",
		cellRendererParams: {
			suppressCount: false,
			checkbox: true,
			footerValueGetter: (params: any) => {
				const isRootLevel = params.node.level === -1;
				if (isRootLevel) {
					return "Grand Total";
				}
				return `Sub Total - ${params.value}`;
			},
		},
	}

	const rowSelected = (selectedRows: any) => {
		dispatch(setSelectedRows(selectedRows));
	};

	const rowDoubleClicked = React.useCallback((rowData: any, tableRef: any) => {
		if (rowData && rowData.data) {
			if (props.onRefChange) props.onRefChange(tableRef);
			dispatch(setRightPannel(true));
			dispatch(setSelectedRowData(rowData.data));
			dispatch(setSelectedRowIndex(rowData.node));
		}
	}, []);

	//TODO: Why are we using this?
	const isGroupOpenByDefault = React.useCallback((params: any) => {
		// console.log('isGroupOpenByDefault: ', params);

		const groupedData: any = gridData.map((data: any) => { return data.division })
		const divisionData: any = groupedData.filter((item: any, index: any) => groupedData.indexOf(item) === index); //removing duplicate division

		const localData: any = sessionStorage.getItem('collapsedGroupHeaders'); // getting collapsed grouped array data 

		const lScollapsedGroupHeaders = JSON.parse(localData);

		const finalHeaderOpenedData = divisionData.filter((x: any) => !lScollapsedGroupHeaders.includes(x)); //Removing the collapsed data from the main division array

		if (finalHeaderOpenedData.length > 0) {
			// console.log('isGroupOpenByDefault: Returning.. ', finalHeaderOpenedData);
			return finalHeaderOpenedData.includes(params.key)
		}

	}, [gridData]);

	const onRowGroupOpened = (params: any) => {
		if (params.expanded === false) {
			setCollapsedGroupHeaders([...collapsedGroupHeaders, params.node.key])
		}
		else {
			setCollapsedGroupHeaders((products: any) => products.filter((value: any, index: any) => value !== params.node.key));
		}
	};

	const onCellEditingStopped = React.useCallback((event: any) => {
		handleOnChange(event.newValue, event);
	}, []);

	const getGroupMenuOptions = (columnDefs: any[]) => {

		let grouMenuOpts: any[] = [];

		columnDefs.forEach((it: any) => {
			if (it.field) {
				grouMenuOpts.push({
					text: it.headerName,
					valie: it.field
				});
			}
		});

		return grouMenuOpts
		// return [{
		// 	text: 'Transaction Type',
		// 	value: 'type'
		// }];
	};

	const getFilterMenuOptions = (columnDefs: any) => {
		return [{
			text: 'All Transaction',
			value: 'all'
		}, {
			text: 'Posted Transactions',
			value: 'posted'
		}, {
			text: 'Pending Transactions',
			value: 'pending'
		}];
	};

	const containerStyle = useMemo(() => ({ width: "100%", height: "640px" }), []);

	return (
		<div style={containerStyle} className="budget-grid-cls">
			<SUIGrid
				headers={columnDefs}
				// data={rowData}
				grouped={true}
				rowModelType={'serverSide'}
				// toolbar={
				// 	<div className='committed-transaction-header'>
				// 	<div className='title-action'>
				// 		<span className='title'>Committed Transactions</span>
				// 		<TypeMenu/>
				// 	</div>
				// 	<div className='search-action'>
				// 		<IQSearchField sx={{ height: '2vh', width: '20rem' }}
				// 			groups={getGroupMenuOptions(columnDefs)}
				// 			filters={getFilterMenuOptions(columnDefs)}
				// 		/>
				// 	</div>
				// </div>
				// }
				// toolbar="sfgWithViewBuilder"
				autoGroupColumnDef={autoGroupColumnDef}
				// rowSelected={rowSelected}
				// rowDoubleClicked={rowDoubleClicked}
				isGroupOpenByDefault={isGroupOpenByDefault}
				// onRowGroupOpened={onRowGroupOpened}
				// onCellEditingStopped={onCellEditingStopped}
				realTimeDocPrefix="budgetManagerLineItems@"
			/>
		</div>
	);
}

export default GridPaginationExample;