import React, { useState, useEffect } from "react";
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';
import IQToggle from "components/iqtoggle/IQToggle";
import ViewBuilder from '../../sui-components/ViewBuilder/ViewBuilder';
import { Box } from "@mui/material";
import SaveIcon from "resources/images/common/Save.svg";
import SaveAsIcon from "resources/images/common/Saveas.svg";
import EditIcon from "resources/images/common/Edit.svg";
import DeleteIcon from "resources/images/common/Delete.svg";
import NewviewIcon from "resources/images/common/Newgridview.svg";
import { Phishing, AccountTree, Lan } from "@mui/icons-material";
import IQSearch from "components/iqsearchfield/IQSearchField";
import { useAppSelector, useAppDispatch } from "app/hooks";

const GridData = [
	{
		"headerName": "Budget ID/CBS",
		"field": "name",
		"hide": true
	},
	{
		"headerName": "Description",
		"field": "description",
		"editable": true,
		"hide": true
	},
	{
		"headerName": "Division/Cost Code",
		"field": "costCode",
		"minWidth": 380,
		"hide": false
	},
	{
		"headerName": "Cost Type",
		"field": "costType",
		"hide": false
	},
	{
		"headerName": "Original Budget Amount",
		"field": "originalAmount",
		"aggFunc": "sum",
		"minWidth": 250,
		"type": "rightAligned",
		"editable": true,
		"hide": false
	},
	{
		"headerName": "Budget Transfer Amount",
		"aggFunc": "sum",
		"minWidth": 230,
		"hide": false,
		"type": "rightAligned",
		"field": null
	},
	{
		"headerName": "Approved COs",
		"field": "approvedBudgetChange",
		"hide": false,
		"aggFunc": "sum",
		"type": "rightAligned"
	},
	{
		"headerName": "Revised Budget",
		"field": "revisedBudget",
		"hide": false,
		"aggFunc": "sum",
		"type": "rightAligned"
	},
	{
		"headerName": "Transaction Amount",
		"field": "balanceModifications",
		"hide": false,
		"aggFunc": "sum",
		"minWidth": 230,
		"type": "rightAligned"
	},
	{
		"headerName": "Remaining Balance",
		"field": "balance",
		"hide": false,
		"aggFunc": "sum",
		"minWidth": 230,
		"type": "rightAligned"
	},
	{
		"headerName": "Curve",
		"field": "curve",
		"hide": false,
		"minWidth": 120
	},
	{
		"headerName": "Vendor",
		"field": "Vendors",
		"hide": false,
		"minWidth": 210,
		"editable": true
	},
	{
		"headerName": "Estimated Start Date",
		"field": "estimatedStart",
		"hide": false,
		"minWidth": 210
	},
	{
		"headerName": "Estimated End Date",
		"hide": false,
		"minWidth": 210,
		"field": "estimatedEnd"
	},
	{
		"headerName": "Projected Schedule Start",
		"field": "projectedScheduleStart",
		"hide": false,
		"minWidth": 230
	},
	{
		"headerName": "Projected Schedule End",
		"field": "projectedScheduleEnd",
		"hide": false,
		"minWidth": 230
	},
	{
		"headerName": "Actual Schedule Start",
		"field": "actualScheduleStart",
		"hide": false,
		"minWidth": 210
	},
	{
		"headerName": "Actual Schedule End",
		"field": "actualScheduleEnd",
		"hide": false,
		"minWidth": 200
	},
	{
		"headerName": "Unit Of Measure",
		"field": "unitOfMeasure",
		"hide": false
	},
	{
		"headerName": "Unit Quantity",
		"field": "unitQuantity",
		"hide": false
	},
	{
		"headerName": "Unit Cost",
		"hide": false,
		"field": "unitCost",
		"type": "rightAligned"
	},
	{
		"headerName": "Pending Change Order",
		"field": "pendingChangeOrderAmount",
		"hide": false,
		"aggFunc": "sum",
		"minWidth": 220,
		"type": "rightAligned"
	},
	{
		"headerName": "Pending Transactions",
		"field": "pendingTransactionAmount",
		"hide": false,
		"aggFunc": "sum",
		"minWidth": 210,
		"type": "rightAligned"
	},
	{
		"headerName": "Budget Forecast",
		"field": "budgetForecast",
		"hide": false,
		"aggFunc": "sum",
		"type": "rightAligned"
	},
	{
		"headerName": "Balance Forecast",
		"field": "balanceForecast",
		"hide": false,
		"aggFunc": "sum",
		"type": "rightAligned"
	}
]

const dropDownList = [
	{
		text: 'New View',
		value: 'new',
		icon: <Box component='img' alt='New View' src={NewviewIcon} className='image' width={25} height={25} color={'#666666'} />
	}, {
		text: 'Save',
		value: 'save',
		icon: <Box component='img' alt='Save' src={SaveIcon} className='image' width={25} height={25} color={'#666666'} />
	},
	{
		text: 'Save As',
		value: 'saveAs',
		icon: <Box component='img' alt='Save As' src={SaveAsIcon} className='image' width={25} height={25} color={'#666666'} sx={{ marginLeft: '-2px!important' }} />
	},
	{
		text: 'Edit',
		value: 'edit',
		icon: <Box component='img' alt='Edit' src={EditIcon} className='image' width={25} height={25} color={'#666666'} />
	},
	{
		text: 'Delete',
		value: 'delete',
		icon: <Box component='img' alt='Delete' src={DeleteIcon} className='image' width={25} height={25} color={'#666666'} />
	},
];

const groupList = [
	{
		text: 'Type',
		value: 'type',
		icon: <Phishing />
	}, {
		text: 'Category',
		value: 'category',
		icon: <AccountTree />
	}, {
		text: 'Sub Category',
		value: 'sub-category',
		icon: <Lan />
	}
];

const viewBuilderDataExample = [
	{
		"text": "Basic View",
		"value": {
			"viewId": 10500568,
			"viewName": "Basic View",
			"viewType": 2,
			"defaultView": true,
			"selected": false,
			"viewOwner": 0,
			"columnsForLayout": [
				{
					"headerName": "Cost Code Group",
					"hide": true,
					"field": "division"
				},
				{
					"headerName": "Budget ID/CBS",
					"hide": false,
					"field": "name"
				},
				{
					"headerName": "Description",
					"hide": false,
					"field": "description"
				},
				{
					"headerName": "Division/Cost Code",
					"hide": false,
					"field": "costCode"
				},
				{
					"headerName": "Cost Type",
					"hide": false,
					"field": "costType"
				},
				{
					"headerName": "Original Budget Amount",
					"hide": false,
					"field": "originalAmount"
				},
				{
					"headerName": "Budget Transfer Amount",
					"hide": false,
					"field": null
				},
				{
					"headerName": "Approved COs",
					"hide": false,
					"field": "approvedBudgetChange"
				},
				{
					"headerName": "Revised Budget",
					"hide": false,
					"field": "revisedBudget"
				},
				{
					"headerName": "Transaction Amount",
					"hide": false,
					"field": "balanceModifications"
				},
				{
					"headerName": "Remaining Balance",
					"hide": false,
					"field": "balance"
				},
				{
					"headerName": "Curve",
					"hide": false,
					"field": "curve"
				},
				{
					"headerName": "Vendor",
					"hide": false,
					"field": "Vendors"
				},
				{
					"headerName": "Estimated Start Date",
					"hide": false,
					"field": "estimatedStart"
				},
				{
					"headerName": "Estimated End Date",
					"hide": false,
					"field": "estimatedEnd"
				},
				{
					"headerName": "Projected Schedule Start",
					"hide": false,
					"field": "projectedScheduleStart"
				},
				{
					"headerName": "Projected Schedule End",
					"hide": false,
					"field": "projectedScheduleEnd"
				},
				{
					"headerName": "Actual Schedule Start",
					"hide": false,
					"field": "actualScheduleStart"
				},
				{
					"headerName": "Actual Schedule End",
					"hide": false,
					"field": "actualScheduleEnd"
				},
				{
					"headerName": "Unit Of Measure",
					"hide": false,
					"field": "unitOfMeasure"
				},
				{
					"headerName": "Unit Quantity",
					"hide": false,
					"field": "unitQuantity"
				},
				{
					"headerName": "Unit Cost",
					"hide": false,
					"field": "unitCost"
				},
				{
					"headerName": "Pending Change Order",
					"hide": false,
					"field": "pendingChangeOrderAmount"
				},
				{
					"headerName": "Pending Transactions",
					"hide": false,
					"field": "pendingTransactionAmount"
				},
				{
					"headerName": "Budget Forecast",
					"hide": false,
					"field": "budgetForecast"
				},
				{
					"headerName": "Balance Forecast",
					"hide": false,
					"field": "balanceForecast"
				}
			]
		}
	},
	{
		"text": "BM Basic view1",
		"value": {
			"viewId": 10215406,
			"viewName": "BM Basic view1",
			"viewType": 1,
			"defaultView": false,
			"selected": false,
			"viewOwner": 0,
			"columnsForLayout": []
		}
	},
	{
		"text": "BM Basic view2",
		"value": {
			"viewId": 10215419,
			"viewName": "BM Basic view2",
			"viewType": 0,
			"defaultView": false,
			"selected": false,
			"viewOwner": 0,
			"columnsForLayout": []
		}
	},
	{
		"text": "BM Basic view3 edited re",
		"value": {
			"viewId": 10215426,
			"viewName": "BM Basic view3 edited re",
			"viewType": 0,
			"defaultView": false,
			"selected": false,
			"viewOwner": 0,
			"columnsForLayout": []
		}
	},
	{
		"text": "BudgetManager View",
		"value": {
			"viewId": 7280731,
			"viewName": "BudgetManager View",
			"viewType": 1,
			"defaultView": false,
			"selected": false,
			"viewOwner": 0,
			"columnsForLayout": [
				{
					"headerName": "Cost Code Group",
					"hide": true,
					"field": "division"
				},
				{
					"headerName": "Budget ID/CBS",
					"hide": true,
					"field": "name"
				},
				{
					"headerName": "Description",
					"hide": true,
					"field": "description"
				},
				{
					"headerName": "Division/Cost Code",
					"hide": false,
					"field": "costCode"
				},
				{
					"headerName": "Cost Type",
					"hide": false,
					"field": "costType"
				},
				{
					"headerName": "Original Budget Amount",
					"hide": false,
					"field": "originalAmount"
				},
				{
					"headerName": "Budget Transfer Amount",
					"hide": false,
					"field": null
				},
				{
					"headerName": "Approved COs",
					"hide": false,
					"field": "approvedBudgetChange"
				},
				{
					"headerName": "Revised Budget",
					"hide": false,
					"field": "revisedBudget"
				},
				{
					"headerName": "Transaction Amount",
					"hide": false,
					"field": "balanceModifications"
				},
				{
					"headerName": "Remaining Balance",
					"hide": false,
					"field": "balance"
				},
				{
					"headerName": "Curve",
					"hide": false,
					"field": "curve"
				},
				{
					"headerName": "Vendor",
					"hide": false,
					"field": "Vendors"
				},
				{
					"headerName": "Estimated Start Date",
					"hide": false,
					"field": "estimatedStart"
				},
				{
					"headerName": "Estimated End Date",
					"hide": false,
					"field": "estimatedEnd"
				},
				{
					"headerName": "Projected Schedule Start",
					"hide": false,
					"field": "projectedScheduleStart"
				},
				{
					"headerName": "Projected Schedule End",
					"hide": false,
					"field": "projectedScheduleEnd"
				},
				{
					"headerName": "Actual Schedule Start",
					"hide": false,
					"field": "actualScheduleStart"
				},
				{
					"headerName": "Actual Schedule End",
					"hide": false,
					"field": "actualScheduleEnd"
				},
				{
					"headerName": "Unit Of Measure",
					"hide": false,
					"field": "unitOfMeasure"
				},
				{
					"headerName": "Unit Quantity",
					"hide": false,
					"field": "unitQuantity"
				},
				{
					"headerName": "Unit Cost",
					"hide": false,
					"field": "unitCost"
				},
				{
					"headerName": "Pending Change Order",
					"hide": false,
					"field": "pendingChangeOrderAmount"
				},
				{
					"headerName": "Pending Transactions",
					"hide": false,
					"field": "pendingTransactionAmount"
				},
				{
					"headerName": "Budget Forecast",
					"hide": false,
					"field": "budgetForecast"
				},
				{
					"headerName": "Balance Forecast",
					"hide": false,
					"field": "balanceForecast"
				}
			]
		}
	}
]


const ViewBuilderExample = (props: any) => {

	const [viewBuilderDailog, setViewBuilderDailog] = useState<boolean>(false);
	const [modeStatus, setModeStatus] = React.useState<boolean>(false); //for edit mode false , for new view true 
	const [tableHeadersData, setTableHeadersData] = useState<any>(GridData);
	const [itemsToUpdate, setItemsToUpdate] = useState<any>([]);

	const [newViewBuilder_Data, setnewViewBuilder_Data] = useState<any>(
		{
			viewName: "",
			viewType: "",
			columnsForLayout: []
		}
	);
	const viewData = {
		"viewId": 10500568,
		"viewName": "Basic View",
		"viewType": 2,
		"defaultView": true,
		"selected": false,
		"viewOwner": 0,
		"columnsForLayout": [
			{
				"headerName": "Cost Code Group",
				"hide": true,
				"field": "division"
			},
			{
				"headerName": "Budget ID/CBS",
				"hide": false,
				"field": "name"
			},
			{
				"headerName": "Description",
				"hide": false,
				"field": "description"
			},
			{
				"headerName": "Division/Cost Code",
				"hide": false,
				"field": "costCode"
			},
			{
				"headerName": "Cost Type",
				"hide": false,
				"field": "costType"
			},
			{
				"headerName": "Original Budget Amount",
				"hide": false,
				"field": "originalAmount"
			},
			{
				"headerName": "Budget Transfer Amount",
				"hide": false,
				"field": null
			},
			{
				"headerName": "Approved COs",
				"hide": false,
				"field": "approvedBudgetChange"
			},
			{
				"headerName": "Revised Budget",
				"hide": false,
				"field": "revisedBudget"
			},
			{
				"headerName": "Transaction Amount",
				"hide": false,
				"field": "balanceModifications"
			},
			{
				"headerName": "Remaining Balance",
				"hide": false,
				"field": "balance"
			},
			{
				"headerName": "Curve",
				"hide": false,
				"field": "curve"
			},
			{
				"headerName": "Vendor",
				"hide": false,
				"field": "Vendors"
			},
			{
				"headerName": "Estimated Start Date",
				"hide": false,
				"field": "estimatedStart"
			},
			{
				"headerName": "Estimated End Date",
				"hide": false,
				"field": "estimatedEnd"
			},
			{
				"headerName": "Projected Schedule Start",
				"hide": false,
				"field": "projectedScheduleStart"
			},
			{
				"headerName": "Projected Schedule End",
				"hide": false,
				"field": "projectedScheduleEnd"
			},
			{
				"headerName": "Actual Schedule Start",
				"hide": false,
				"field": "actualScheduleStart"
			},
			{
				"headerName": "Actual Schedule End",
				"hide": false,
				"field": "actualScheduleEnd"
			},
			{
				"headerName": "Unit Of Measure",
				"hide": false,
				"field": "unitOfMeasure"
			},
			{
				"headerName": "Unit Quantity",
				"hide": false,
				"field": "unitQuantity"
			},
			{
				"headerName": "Unit Cost",
				"hide": false,
				"field": "unitCost"
			},
			{
				"headerName": "Pending Change Order",
				"hide": false,
				"field": "pendingChangeOrderAmount"
			},
			{
				"headerName": "Pending Transactions",
				"hide": false,
				"field": "pendingTransactionAmount"
			},
			{
				"headerName": "Budget Forecast",
				"hide": false,
				"field": "budgetForecast"
			},
			{
				"headerName": "Balance Forecast",
				"hide": false,
				"field": "balanceForecast"
			}
		]
	}
	const headerData = [
		{
			headerName: 'Column Name',
			rowDrag: true,
			suppressMovable: true,
			rowDragText: (params: any) => { return params.data.headerName },
			menuTabs: [],
			cellStyle: (params: any) => {
				if (params.data.field === "division") {
					return { display: "none" };
				}
				return null;
			},
			cellRenderer: (params: any) => {
				if (params.data.field === "division") {
					return null;
				} else {
					return <div>{params.data.headerName}</div>
				}
			}
		},
		{
			headerName: 'Show/Hide Column',
			menuTabs: [],
			suppressMovable: true,
			headerComponent: (params: any) => {
				return (
					<div className="custom-header">
						<span className='hideshow'>{params ? params.displayName : ''}</span>
						{modeStatus == false && <IconMenu
							options={getViewFilters()}
							onChange={handleFilter}
							menuProps={{
								open: true,
								placement: 'bottom-start',
								sx: {
									width: 'fit-content',
									lineheight: '1.5',
									fontSize: '18px !important',
									'& .css-1jxx3va-MuiTypography-root': {
										fontSize: '0.96rem !important',
										color: '#333 !important'
									}
								}
							}}
							buttonProps={{
								className: 'preview-button',
								startIcon: <span className='common-icon-down-arrow' style={{ color: '#5b5b5b' }} />,
								// <Stack component='img' alt='Views' src={EyeIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)' }} />,
								disableRipple: true
							}}
						/>}
					</div>
				);
			},
			cellStyle: (params: any) => {
				if (!params.value) {
					return { border: "none" };
				}
				return null;
			},
			cellRenderer: (params: any) => {
				if (params.data.field === "costCode" || params.data.field === "costType" || params.data.field === "originalAmount" || params.data.field === "division") {
					return null;
				} else {
					return (
						<IQToggle
							defaultChecked={!params.data.hide}
							switchLabels={['ON', 'OFF']}
							onChange={(e, value) => { handleToggleChange(value, params.data) }}
							edge={'end'}
						/>
					)
				}

			}
		}
	];

	const [showHideValues, setShowHideValues] = useState<any>({
		show: tableHeadersData.filter((x: any) => x.hide == false),
		hide: tableHeadersData.filter((x: any) => x.hide == true),
		total: tableHeadersData
	})

	const getViewFilters = () => {
		return [
			{ text: `Show All(${showHideValues.total.length})`, value: 'showAll', },
			{ text: `Show Selected Columns(${showHideValues.total.length}/${showHideValues.show.length})`, value: 'showSelectedColumns', },
			{ text: `Show Hide Columns(${showHideValues.total.length}/${showHideValues.hide.length})`, value: 'showHideColumns', },
		];
	};

	const handleDropDown = (data: any) => {

		if (data === "edit") {
			setViewBuilderDailog(true)
			setModeStatus(false)

		} else if (data === "new") {
			setViewBuilderDailog(true);
			setModeStatus(true)
		} else if (data === "delete") {

		}
	}

	const handleViewList = (viewObj: any) => {
		// dispatch(fetchViewData({ appInfo: appInfo, viewId: viewObj.viewId }))
	}

	const handleToggleChange = (value: any, params: any) => {
		tableHeadersData.map((data: any, index: any) => {
			if (data.field == params.field) {
				let new_obj = {};
				if (value == false) {
					new_obj = { ...data, hide: true }
				} else {
					new_obj = { ...data, hide: false }
				}
				tableHeadersData[index] = new_obj
			}
		})
	}

	const handleFilter = (value: any) => {
		if (value == 'showAll') {
			setTableHeadersData(showHideValues.total)
		}
		else if (value == 'showSelectedColumns') {
			setTableHeadersData(showHideValues.show)
		}
		else {
			setTableHeadersData(showHideValues.hide)
		}

	}

	const onGridRowDragEnd = (params: any) => {
		let gridApi: any = params.api;
		gridApi.forEachNodeAfterFilterAndSort(function (rowNode: any) {
			itemsToUpdate.push(rowNode.data);
		});
	}

	const saveViewHandler = () => {
		let finalColumnsData: any = [];
		if (itemsToUpdate.length > 0) {
			finalColumnsData = [];
			itemsToUpdate.forEach((rearrangeObj: any) => {
				let obj = rearrangeObj;
				let filteredData = tableHeadersData.filter((x: any) => x.headerName === obj.headerName)
				finalColumnsData.push(filteredData[0]);
			});
		}
		const payload = {
			viewId: viewData.viewId,
			viewName: viewData.viewName,
			viewType: viewData.viewType,
			columnsForLayout: itemsToUpdate.length > 0 ? finalColumnsData : tableHeadersData,
		}
		// console.log('payload', payload)
	}

	const saveNewViewHandler = (data: any) => {
		const result = {
			viewName: data.viewName,
			viewType: data.viewType,
			columnsForLayout: [...tableHeadersData]
		}
	}

	const handleOnSearchChange = (value: any) => {

	}
	return (
		<>
			<IQSearch
				groups={groupList}
				placeholder={viewData && viewData?.viewName}
				// filters={viewBuilderData}
				onSearchChange={(text: string) => handleOnSearchChange(text)}
				filterHeader='Filters'
				// onSettingsChange={handleSettings}
				// onViewFilterChange={handleViewFilter}
				// onGroupChange={groupHandler}
				// onSearchChange={searchHandler}
				// onFilterChange={filterHandler}
			/>
			<ViewBuilder
				dropDownList={dropDownList}
				dropDownOnChange={(value) => { handleDropDown(value) }}
				dailogOpen={viewBuilderDailog}
				dailogClose={(value) => { setViewBuilderDailog(false) }}
				mode={modeStatus}
				griddata={tableHeadersData}
				headerData={headerData}
				onRowDragEnd={(value) => { onGridRowDragEnd(value) }}
				viewData={viewData}
				saveView={() => { saveViewHandler() }}
				saveNewViewData={(data: any) => { saveNewViewHandler(data) }}
				viewList={viewBuilderDataExample}
				viewListOnChange={(obj) => { handleViewList(obj) }}
			/>
		</>
	);
};

export default ViewBuilderExample;

