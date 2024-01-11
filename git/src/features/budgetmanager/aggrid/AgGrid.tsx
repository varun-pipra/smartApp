import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {Button, Stack} from '@mui/material';
import {createStyles, makeStyles} from '@mui/styles';
import {ColDef} from 'ag-grid-community/dist/lib/entities/colDef';
import {
	getCostCodeDivisionList,
	getCostTypeList,
	getServer,
} from 'app/common/appInfoSlice';
import _ from 'lodash';
// import {getAmountAlignmentNew} from 'utilities/commonutills';
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';
import {useAppDispatch, useAppSelector, useHotLink} from 'app/hooks';
import {postMessage} from 'app/utils';
import CostCodeDropdown from 'components/costcodedropdown/CostCodeDropdown';
import DatePickerComponent from 'components/datepicker/DatePicker';
import IQTooltip, {IQGridTooltip} from 'components/iqtooltip/IQTooltip';
import SmartDropDown from 'components/smartDropdown';
import {setOpenBudgetTransferForm, setOpenCostForm} from 'features/budgetmanager/operations/rightPanelSlice';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import SUIGrid from 'sui-components/Grid/Grid';
import convertDateToDisplayFormat, {
	getCurveText,
} from 'utilities/commonFunctions';
import 'utilities/presence/PresenceManager.css';
import PresenceManager from 'utilities/presence/PresenceManager.js';
import {primaryIconSize} from '../BudgetManagerGlobalStyles';
import {curveList} from '../headerpage/HeaderPage';
import {setBidPackagesList, setClientContractsList, setSelectedRows, setVendorContractsList, setLiveData} from '../operations/gridSlice';
import {setSelectedRowData, setSelectedRowIndex} from '../operations/rightPanelSlice';
import {
	getGridColumnHide,
	setColumnDefsHeaders,
	setRightPannel,
	showRightPannel
} from '../operations/tableColumnsSlice';
import './AgGrid.scss';
import CustomTooltip from './customtooltip/CustomToolTip';
import {CustomDateComponent} from './example';
import VendorList from './vendor/Vendor';

import {getBidStatus, getBidStatusIdFromText, StatusColors, StatusIcons} from 'utilities/bid/enums';
import {formatDate} from 'utilities/datetime/DateTimeUtils';
import {vendorContractsStatus, vendorContractsStatusColors, vendorContractsStatusIcons} from 'utilities/vendorContracts/enums';
import {budgetManagerMainGridRTListener} from '../BudgetManagerRT';
import CostCodeSelect from 'sui-components/CostCodeSelect/costCodeSelect';
import {getCostCodeDropdownList, getCostCodeFilterList} from '../operations/settingsSlice';
import { providerSourceObj } from 'utilities/commonutills';
// import {setInterval} from 'timers/promises';
var tinycolor = require('tinycolor2');

interface TableGridProps {
	liveData?: any;
	onRefChange?: (ref: any) => void;
}

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxWidth: '160px !important',
			minWidth: 'fit-content !important',
			marginLeft: '18px'
		}
	})
);

const minmaxDate = (date: any, type: any) => {
	if(type == 'minDate') {
		return date.reduce((acc: any, date: any) => {

			return acc && new Date(acc) < new Date(date) ? acc : date;
		}, '');

	}
	else {
		return date.reduce((acc: any, date: any) => {
			return acc && new Date(acc) > new Date(date) ? acc : date;
		}, '');
	}
};

const TableGrid = (props: TableGridProps) => {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
	const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);
	const {gridData, originalGridApiData, presenceData, liveData,
		selectedFilters, searchText} = useAppSelector((state) => state.gridData);

	const {selectedRowIndexData} = useAppSelector(
		(state) => state.rightPanel
	);
	const {settingsData, costCodeDropdownData, divisionCostCodeFilterData} = useAppSelector(state => state.settings);

	const rightPannel = useAppSelector(showRightPannel);
	const {viewData, viewBuilderData} = useAppSelector((state) => state.viewBuilder);
	const appInfo = useAppSelector(getServer);
	const {currencySymbol, currencyCode} = useAppSelector((state) => state.appInfo);
	const [collapsedGroupHeaders, setCollapsedGroupHeaders] = useState<any>([]);
	const [showTooltip, setShowTooltip] = useState(false);
	const hideShowGridColumn = useAppSelector<any>(getGridColumnHide);

	const [updateObj, setUpdateObj] = useState<any>({});
	const [tableReff, setTableReff] = useState<any>();
	const [presencePrevState, setPresencePrevState] = useState<any>([]);
	const selectedGroupKey = useAppSelector(state => state.gridData?.selectedGroupKey);
	const [gridRef, setGridRef] = React.useState<any>();
	const [multiLevelDefaultFilters, setMultiLevelDefaultFilters] = React.useState<any>([]);


	const selectedRecord = useAppSelector((state) => state.rightPanel.selectedRow);
	const RemoveDuplicates = (array: any, key: any) => {
		let unique: any = [];
		array.map((x: any) => unique.filter((a: any) => a[key] === x[key]).length > 0 ? null : unique.push(x));
		return unique;
	};

	useEffect(() => {
		const filterOptions: any = {bidList: [], vendorContractsList: [], clientContractsList: []};
		originalGridApiData?.map((item: any) => {
			// console.log('companiesList?.map((a:any) => a.id)', item);
			item?.bidPackage && filterOptions?.bidList?.push({
				text: item?.bidPackage?.name,
				key: item?.bidPackage?.id,
				value: item?.bidPackage?.id
			});
			item?.vendorContract && filterOptions?.vendorContractsList?.push({
				text: item?.vendorContract?.name,
				key: item?.vendorContract?.id,
				value: item?.vendorContract?.id
			});
			item?.clientContract && filterOptions?.clientContractsList?.push({
				text: item?.clientContract?.name,
				key: item?.clientContract?.id,
				value: item?.clientContract?.id
			});
		});
		dispatch(setBidPackagesList(RemoveDuplicates(filterOptions?.bidList, 'text')));
		dispatch(setVendorContractsList(RemoveDuplicates(filterOptions?.vendorContractsList, 'text')));
		dispatch(setClientContractsList(RemoveDuplicates(filterOptions?.clientContractsList, 'text')));
	}, [originalGridApiData]);

	const addPresenceListener = (presenceManager: any, roomId?: any) => {
		if(presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;
			participantCtrl.addEventListener('presencecountclick', function (e: any) {
				let participantsjson = participantCtrl.getParticipants(),
					participantids = [];
				if(participantsjson) {
					for(var i = 0;i < participantsjson.length;i++) {
						participantids.push((participantsjson[i].userid));
					}
				}
				postMessage({
					event: 'launchlivechat',
					body: {iframeId: 'budgetManagerIframe', roomId: roomId, appType: 'BudgetManagerLineItem_' + roomId},
					livechatData: {participantsIds: participantids}
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: {iframeId: 'budgetManagerIframe', roomId: roomId, appType: 'BudgetManagerLineItem_' + roomId},
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'click'
					}
				});
			});
			participantCtrl.addEventListener('presenceuserhover', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: {iframeId: 'budgetManagerIframe', roomId: roomId, appType: 'BudgetManagerLineItem_' + roomId},
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'hover'
					}
				});
			});
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager, roomId);
		}, 1000);
	};

	useEffect(() => {
		sessionStorage.setItem('collapsedGroupHeaders', JSON.stringify(collapsedGroupHeaders));
	}, [collapsedGroupHeaders]);

	useEffect(() => {
		dispatch(setSelectedRows([]));
	}, [gridData]);

	useEffect(() => {
		if(tableReff && Object.keys(tableReff).length > 0) {
			if(hideShowGridColumn.length > 0) {
				tableReff.setColumnDefs(hideShowGridColumn);
			}
		}
	}, [hideShowGridColumn]);

	const handleOnChange = (newvalue: any, event: any) => {
		const fieldName = event.colDef.field;
		const value = fieldName === 'costCode' ? newvalue.split('|')[1] : fieldName === 'costType' ? newvalue[0] : newvalue;
		setUpdateObj(fieldName === 'costCode' ? {id: event.data.id, newValue: value, field: fieldName, division: newvalue.split('|')[0]} : {id: event.data.id, newValue: value, field: fieldName});
	};

	const handleChangeVendor = (vendor: string[], params: any) => {
		handleOnChange(vendor, params);
	};

	useEffect(() => {
		let updatedColumns: any = [...columnDefs].map((rec: any) => {
			if(selectedGroupKey) {
				return {...rec, rowGroup: rec.field === selectedGroupKey, sort: rec.field === selectedGroupKey ? 'asc' : null};
			} else {
				return {...rec, rowGroup: false, sort: null};
			}
		});

		setColumnDefs(updatedColumns);

	}, [selectedGroupKey]);

	const isCostCodeExists = (options: any, costCodeVal: any)=> {
		let isExists: any = false;
		(options || []).forEach((rec: any)=>{
			if (rec.value === costCodeVal) {
				isExists = true;
			} else {
				if(rec.children?.length > 0) {
					rec.children.forEach((childRec: any)=>{
						if(childRec.value === costCodeVal) {
							isExists = true;
						}
					})
				}
			}
		});
		return isExists;
	}

	const columns: any = [
		{
			headerName: 'Cost Code Group',
			field: 'division',
			pinned: 'left',
			rowGroup: true,
			//hide: true,
			width: 550,
			minWidth: 550,
			sort: 'asc',
			suppressMenu: false,
			checkboxSelection: true,
			headerCheckboxSelection: true,
			cellRenderer: 'agGroupCellRenderer',
			valueGetter: (params: any) => customValueGetter(params),
			keyCreator: (params: any) => params.data.division || 'None',
			aggFunc: (params: any) => {
				if(!params.rowNode?.key) {
					return 'Grand Total';
				}
				return params.rowNode?.key;
			},
			cellRendererParams: {
				innerRenderer: (params: any) => customCellRendererClass(params),
			}
		},
		{headerName: 'Budget ID/CBS', field: 'name', hide: false, suppressMenu: true},
		{
			headerName: 'Description',
			field: 'description',
			editable: true,
			hide: false,
			suppressMenu: true,
			cellRenderer: (context: any) => {
				if(context.data?.source === 1)
					return <IQGridTooltip
						className='budget-desc-tooltip'
						title={<>
							<div>{context.value}</div>
							<div>Change Event ID: <a style={{cursor: 'pointer', color: '#059cdf'}}
								onClick={() => window.open(useHotLink(`change-event-requests?inlineModule=true&id=${context.data?.changeEvent?.id}`), '_blank')}
							>{context.data?.changeEvent?.code}</a>
							</div>
						</>}
						placement={'bottom'}
						arrow={true}
					>
						<div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{context.value}</div>
					</IQGridTooltip>;
				else return context.value;
			}
		},
		{
			headerName: 'Division/Cost Code',
			field: 'costCode',
			minWidth: 380,
			suppressMenu: true,
			keyCreator: (params: any) => params.data.costCode || 'None',
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params && params?.data && params.value && params.value.length > 50
					? params.value
					: null;
			},
			cellRenderer: (params: any) => {
				let selectOptions: any = [...getDivisionOptions()];
				let hiddenOptions: any = [];
				let isCostCodeExistsInOptions: any = params?.data?.costCode ? isCostCodeExists(selectOptions, params?.data?.costCode) : false;
				if (!isCostCodeExistsInOptions) {
					let obj: any = 
						{
							value: params?.data?.costCode,
							id: params?.data?.costCode,
							children: null,
							isHidden: true,
						}
					hiddenOptions.push(obj);
				}
				let inLinefilter: any = [];
				getDivisionFilterOptions()?.map((option: any) => {
					if(option?.value == params?.data?.division) {
						setMultiLevelDefaultFilters([option?.hierarchy]);
						inLinefilter = [option?.hierarchy];
					}
				});
				
				
				// return params?.node?.level == 1 ? (
					// <CostCodeDropdown
					// 	label=''
					// 	options={getDivisionOptions()}
					// 	required={false}
					// 	selectedValue={
					// 		params?.data
					// 			? params?.data?.division + '|' + params?.data?.costCode
					// 			: ''
					// 	}
					// 	checkedColor={'#0590cd'}
					// 	onChange={(value) => handleOnChange(value, params)}
					// 	showFilter={false}
					// 	showFilterInSearch={true}
					// 	isFullWidth={true}
					// 	outSideOfGrid={false}
					// 	sx={{
					// 		fontSize: '13px',
					// 		'&:before': {
					// 			border: 'none',
					// 		},
					// 		'&:after': {
					// 			border: 'none',
					// 		},
					// 		'.MuiSelect-icon': {
					// 			display: 'none',
					// 		},
					// 	}}
					// 	filteringValue={params?.data?.division}
					// />
					return (
            params?.data && (
              <>
                {(
                  <CostCodeSelect
                    label=" "
                    options={selectOptions}
					hiddenOptions = {hiddenOptions}
                    onChange={(value: any) => handleOnChange(value, params)}
                    // required={true}
                    // startIcon={<div className='budget-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>}
                    checkedColor={"#0590cd"}
                    showFilter={false}
                    selectedValue={
                      params?.data?.division && params?.data?.costCode
                        ? (!isCostCodeExistsInOptions ? params?.data?.costCode : (params?.data?.division + "|" + params?.data?.costCode))
                        : ""
                    }
                    Placeholder={"Select"}
                    outSideOfGrid={false}
                    showFilterInSearch={true}
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
                    filteroptions={getDivisionFilterOptions()}
                    filteringValue={params?.data?.division}
                    onFiltersUpdate={(filters: any) =>
                      setMultiLevelDefaultFilters(filters)
                    }
                    defaultFilters={
                      multiLevelDefaultFilters?.length
                        ? multiLevelDefaultFilters?.length
                        : inLinefilter
                    }
                  />
                ) 
				// : (
                //   <div
                //     onClick={(e: any) => {
				// 		console.log('srini on click');
                //     //   e.stopPropagation();
                //     //   params.node.setData({
                //     //     ...params.node.data,
                //     //     isCostCodeExistsInOptions: true,
                //     //   });
                //     }}
                //   >
                //     Srini {params.data?.costCode}
                //   </div>
                // )
				}
              </>
            )
          );
				// ) : null;
			}
		},
		{
			headerName: 'Cost Type',
			field: 'costType',
			hide: false,
			suppressMenu: true,
			keyCreator: (params: any) => params.data.costType || 'None',
			cellRenderer: (params: any) => {
				// return params?.node?.level == 1 ? (
					return params?.data && <SmartDropDown
						options={getCostTypeOptions()}
						dropDownLabel=''
						isSearchField={false}
						isFullWidth={true}
						outSideOfGrid={false}
						selectedValue={params.data ? params?.data?.costType : ''}
						handleChange={(value: any) => handleOnChange(value, params)}
						sx={{
							fontSize: '13px',
							'&:before': {
								border: 'none',
							},
							'&:after': {
								border: 'none',
							},
							'.MuiSelect-icon': {
								display: 'none',
							},
						}}
						menuProps={classes.menuPaper}
					/>
				// ) : null;
			}
		}, {
			headerName: 'Associated Location/System',
			field: 'locations',
			suppressMenu: true,
			minWidth: 220,
			keyCreator: (params: any) => {
				const {value} = params;
				return (Array.isArray(value) && value?.length > 0) ? (value || [])?.map((location: any) => location?.name)?.join(', ') : 'NA';
			},
			cellRenderer: (params: any) => {
				const {value} = params;
				return Array.isArray(value) ? (value || [])?.map((location: any) => location?.name)?.join(', ') : '';
			}
		},
		{
			headerName: 'Original Budget Amount',
			field: 'originalAmount',
			valueGetter: (params: any) =>
				params.data ? params?.data?.originalAmount : '',
			aggFunc: 'sum',
			minWidth: 250,
			type: 'rightAligned',
			editable: true,
			hide: false,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		// {
		// 	headerName: 'Mark-up Fee',
		// 	field: 'markupFee',
		// 	valueGetter: (params: any) => {
		// 		if(params?.data?.allowMarkupFee) return params?.data?.markupFeeType == 0 ? params?.data?.markupFeeAmount ?? 'N/A' : params?.data?.markupFeePercentage ? `${amountFormatWithSymbol(params?.data?.markupFeeAmount)} (${params?.data?.markupFeePercentage}%)` : 'N/A';
		// 		else 'N/A';
		// 	},
		// 	aggFunc: 'sum',
		// 	minWidth: 250,
		// 	type: 'rightAligned',
		// 	editable: false,
		// 	// hide: !settingsData?.allowMarkupFee,
		// 	suppressMenu: true,
		// 	cellRenderer: (params: any) => {
		// 		if(params?.value && (
		// 			params?.node?.footer ||
		// 			params?.node?.level > 0 ||
		// 			!params?.node?.expanded)
		// 		) {
		// 			console.log("mark up", params?.value);
		// 			return params?.value != 'N/A' && params?.data?.markupFeeType != 1 ? amountFormatWithSymbol(params?.value) : params?.value;
		// 		}
		// 	}
		// },
		{
			headerName: 'Mark-up Fee',
			field: 'markupFee',
			valueGetter: (params: any) => {
				if(params?.data?.allowMarkupFee) {
					return params?.data?.markupFeeType == 0 ? params?.data?.markupFeeAmount ?? 'N/A'
						: params?.data?.markupFeePercentage ? params?.data?.markupFeeAmount
							: 'N/A';
				}
				else {
					return 'N/A';
				}
			},
			aggFunc: 'sum',
			minWidth: 250,
			type: 'rightAligned',
			editable: false,
			// hide: !settingsData?.allowMarkupFee,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && params?.node?.footer) {
					return currencySymbol + ' ' + params?.value?.toLocaleString("en-US");
				}
				else if(params?.data && params?.value && params?.data?.markupFeePercentage) {
					return currencySymbol + ' ' + params?.value?.toLocaleString("en-US") + `(${params?.data?.markupFeePercentage}%)`;
				}
				else if(params?.data && params?.value && params?.data?.markupFeePercentage == null) {
					return params?.value == 'N/A' ? 'N/A' : currencySymbol + ' ' + params?.value?.toLocaleString("en-US");
				}
			}
		},
		{
			headerName: 'Budget Transfer Amount',
			aggFunc: 'sum',
			minWidth: 230,
			hide: false,
			type: 'rightAligned',
			suppressMenu: true,
			valueGetter: (params: any) => 0,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Approved COs',
			field: 'approvedBudgetChange',
			hide: false,
			valueGetter: (params: any) =>
				params?.data ? params?.data?.approvedBudgetChange : '',
			aggFunc: 'sum',
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Revised Budget',
			field: 'revisedBudget',
			hide: false,
			aggFunc: 'sum',
			type: 'rightAligned',
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? params?.data?.revisedBudget : '',
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Provider Source',
			field: 'providerSource',
			hide: false,
			valueGetter: (params: any) => providerSourceObj?.[params.data?.providerSource],			
		},
		{
			headerName: 'Transaction Amount',
			field: 'balanceModifications',
			hide: false,
			aggFunc: 'sum',
			minWidth: 230,
			type: 'rightAligned',
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? params?.data?.balanceModifications : '',
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Remaining Balance',
			field: 'balance',
			hide: false,
			aggFunc: 'sum',
			minWidth: 230,
			type: 'rightAligned',
			suppressMenu: true,
			valueGetter: (params: any) => (params?.data ? params?.data?.balance : ''),
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Curve',
			field: 'curve',
			hide: false,
			minWidth: 120,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? getCurveText(params?.data?.curve) : '',
			cellRenderer: (params: any) => {
				return params?.data ? (
					<SmartDropDown
						options={curveList}
						dropDownLabel=''
						isSearchField={false}
						isFullWidth={false}
						outSideOfGrid={false}
						selectedValue={params?.data ? params?.data?.curve : ''}
						handleChange={(value: any) => handleOnChange(value, params)}
						sx={{
							'&:before': {
								border: 'none',
							},
							'&:after': {
								border: 'none',
							},
							'.MuiSelect-icon': {
								display: 'none',
							},
						}}
						menuProps={classes.menuPaper}
					/>
				) : null;
			}
		},
		{
			headerName: 'Vendor',
			field: 'Vendors',
			hide: false,
			minWidth: 210,
			editable: false,
			suppressMenu: true,
			keyCreator: (params: any) => {
				return params?.data?.Vendors?.length > 0 ? params?.data?.Vendors?.map((rec: any) => rec.name) : 'None';
			},
			// tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params?.value && params?.value.length > 25 ? params?.value : null;
			},
			cellRenderer: (params: any) => {
				return params && params?.data ? (
					params?.data?.bidPackage?.status == 'Awarded' ?
						params?.data?.Vendors?.map((data: any, i: any) => {
							return (
								<IQTooltip
									title={'Vendor has been awarded the Bid and the Vendor cannot be updated'}
									placement={'bottom'}
									arrow={true}
								>
									<span key={i}>{i > 0 && ', '}{data.name}</span>
								</IQTooltip>
							);
						})
						:
						<VendorList
							value={params?.data?.Vendors}
							handleVendorChange={handleChangeVendor}
							params={params}
							multiSelect={true}
							outSideOfGrid={false}
							showFilterInSearch={true}
						/>
				) : null;
			}
		},
		{
			headerName: 'Estimated Start Date',
			field: 'estimatedStart',
			hide: false,
			minWidth: 210,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? convertDateToDisplayFormat(params?.data?.estimatedStart) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'minDate');
				}
			},
			cellRenderer: (params: any) => {
				return (
					params && params?.data ?
						<DatePickerComponent
							defaultValue={convertDateToDisplayFormat(params?.data?.estimatedStart)}
							onChange={(val: any) => handleOnChange(val, params)}
							maxDate={params?.node?.footer ? new Date('12/31/9999') : params?.data?.estimatedEnd !== '' ? new Date(params?.data?.estimatedEnd) : new Date('12/31/9999')}
							style={{
								width: '170px',
								border: 'none',
								background: 'transparent',
								fontSize: '14px',
								fontFamily: 'Roboto-Regular'
							}}
						/>
						: params && params?.value ? <span style={{marginLeft: '4px'}}>{params?.value}</span>
							// : params && params.node.footer && params.value ? <span style={{ marginLeft: '4px' }}>{params.value}</span>
							: null
				);
			}
		},
		{
			headerName: 'Estimated End Date',
			//editable: true,
			hide: false,
			minWidth: 210,
			field: 'estimatedEnd',
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? convertDateToDisplayFormat(params?.data?.estimatedEnd) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'maxDate');
				}
			},
			cellRenderer: (params: any) => {
				return (
					params && params?.data ?
						<DatePickerComponent
							defaultValue={convertDateToDisplayFormat(params?.data?.estimatedEnd)}
							onChange={(val: any) => handleOnChange(val, params)}
							minDate={new Date(params?.data?.estimatedStart)}
							style={{
								width: '170px',
								border: 'none',
								background: 'transparent',
								fontSize: '14px',
								fontFamily: 'Roboto-Regular'
							}}

						/>
						: params && params?.value ? <span style={{marginLeft: '4px'}}>{params?.value}</span>
							: null
				);
			}
		},
		{
			headerName: 'Projected Schedule Start',
			field: 'projectedScheduleStart',
			hide: false,
			minWidth: 230,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.projectedScheduleStart ? convertDateToDisplayFormat(params?.data?.projectedScheduleStart) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'minDate');
				}
			}
		},
		{
			headerName: 'Projected Schedule End',
			field: 'projectedScheduleEnd',
			hide: false,
			minWidth: 230,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.projectedScheduleEnd ? convertDateToDisplayFormat(params?.data?.projectedScheduleEnd) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'maxDate');
				}
			}
		},
		{
			headerName: 'Actual Schedule Start',
			field: 'actualScheduleStart',
			hide: false,
			minWidth: 210,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.actualScheduleStart ? convertDateToDisplayFormat(params?.data?.actualScheduleStart) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'minDate');
				}
			}
		},
		{
			headerName: 'Actual Schedule End',
			field: 'actualScheduleEnd',
			hide: false,
			minWidth: 200,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.actualScheduleEnd ? convertDateToDisplayFormat(params?.data?.actualScheduleEnd) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'maxDate');
				}
			}
		},
		{headerName: 'Unit Of Measure', field: 'unitOfMeasure', hide: false, },
		{
			headerName: 'Unit Quantity',
			field: 'unitQuantity',
			hide: false,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				return (
					<span>{params?.data?.unitQuantity?.toLocaleString('en-US')}</span>
				);
			}
		},
		{
			headerName: 'Unit Cost',
			hide: false,
			field: 'unitCost',
			type: 'rightAligned',
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? params?.data?.unitCost : '',
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Pending Change Order',
			field: 'pendingChangeOrderAmount',
			hide: false,
			valueGetter: (params: any) => params?.data ? params?.data?.pendingChangeOrderAmount : '',
			aggFunc: 'sum',
			minWidth: 220,
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value &&
					(
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Pending Transactions',
			field: 'pendingTransactionAmount',
			hide: false,
			valueGetter: (params: any) => params?.data ? params?.data?.pendingTransactionAmount : '',
			aggFunc: 'sum',
			minWidth: 210,
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value &&
					(
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Budget Forecast',
			field: 'budgetForecast',
			hide: false,
			valueGetter: (params: any) => params?.data ? params?.data?.budgetForecast : '',
			aggFunc: 'sum',
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Balance Forecast',
			field: 'balanceForecast',
			hide: false,
			valueGetter: (params: any) => params?.data ? params?.data?.balanceForecast : '',
			aggFunc: 'sum',
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
		{
			headerName: 'Bid Package Name',
			field: 'bidPackage.name',
			hide: false,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return <span className='hot-link'
						onClick={() => {window.open(useHotLink(`bid-manager/home?id=${params?.data?.bidPackage?.id}`), '_blank');}}
					>
						{params?.data?.bidPackage?.name && params?.data?.bidPackage?.name}
					</span>;
				}
			}
		},
		{
			headerName: 'Bid Award Date',
			field: 'bidPackage.awardedOn',
			hide: false,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.bidPackage?.awardedOn ? formatDate(params?.data?.bidPackage?.awardedOn, {year: 'numeric', month: '2-digit', day: '2-digit'}) : ''
		},
		{
			headerName: 'Bid Status',
			field: 'bidPackage.status',
			hide: false,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return params?.data?.bidPackage?.status ? <Button className='status-pill'
						startIcon={<span className={StatusIcons[getBidStatusIdFromText(params?.data?.bidPackage?.status)]} />}
						style={{
							backgroundColor: `#${StatusColors[getBidStatusIdFromText(params?.data?.bidPackage?.status)]}`,
							color: tinycolor(StatusColors[getBidStatusIdFromText(params?.data?.bidPackage?.status)]).isDark() ? 'white' : 'black',
						}}>
						{getBidStatus(getBidStatusIdFromText(params?.data?.bidPackage?.status))}
					</Button> : '-';
				}
			}
		},
		{
			headerName: 'Vendor Contract Name',
			field: 'vendorContract.name',
			hide: false,
			minWidth: 220,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return <span className='hot-link'
						onClick={() => window.open(useHotLink(`vendor-contracts/home?id=${params?.data?.vendorContract?.id}`), '_blank')}					>
						{params?.data?.vendorContract?.name && params?.data?.vendorContract?.name}
					</span>;
				}
			}
		},
		{
			headerName: 'Vendor Contract Date',
			field: 'vendorContract.startDate',
			hide: false,
			minWidth: 240,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.vendorContract?.startDate && params?.data?.vendorContract?.endDate ?
				`${formatDate(params?.data?.vendorContract?.startDate, {year: 'numeric', month: '2-digit', day: '2-digit'})} - ${formatDate(params?.data?.vendorContract?.endDate, {year: 'numeric', month: '2-digit', day: '2-digit'})}` :
				''
		},
		{
			headerName: 'Vendor Contract Status',
			field: 'vendorContract.status',
			hide: false,
			minWidth: 220,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return params?.data?.vendorContract?.status ? <Button disabled className='status-pill'
						startIcon={<span className={vendorContractsStatusIcons[params?.data?.vendorContract?.status]} style={{color: 'white'}} />}
						style={{
							backgroundColor: vendorContractsStatusColors[params?.data?.vendorContract?.status],
							color: tinycolor(vendorContractsStatusColors[params?.data?.vendorContract?.status]).isDark() ? 'white' : 'black'
						}}>
						{vendorContractsStatus[params?.data?.vendorContract?.status]}
					</Button> : '-';
				}
			}
		},
		{
			headerName: 'Client Contract Name',
			field: 'clientContract.name',
			hide: false,
			minWidth: 220,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return <span className='hot-link'
						onClick={() => window.open(useHotLink(`client-contracts/home?id=${params?.data?.clientContract?.id}`), '_blank')}
					>
						{params?.data?.clientContract?.name && params?.data?.clientContract?.name}
					</span>;
				}
			}
		},
		{
			headerName: 'Client Contract Date',
			field: 'clientContract.startDate',
			hide: false,
			minWidth: 240,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.clientContract?.startDate && params?.data?.clientContract?.endDate ?
				`${formatDate(params?.data?.clientContract?.startDate, {year: 'numeric', month: '2-digit', day: '2-digit'})} - ${formatDate(params?.data?.clientContract?.endDate, {year: 'numeric', month: '2-digit', day: '2-digit'})}` :
				''
		},
		{
			headerName: 'Client Contract Status',
			field: 'clientContract.status',
			hide: false,
			minWidth: 220,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return params?.data?.clientContract?.status ? <Button disabled className='status-pill'
						startIcon={<span className={vendorContractsStatusIcons[params?.data?.clientContract?.status]} style={{color: 'white'}} />}
						style={{
							backgroundColor: vendorContractsStatusColors[params?.data?.clientContract?.status],
							color: tinycolor(vendorContractsStatusColors[params?.data?.clientContract?.status]).isDark() ? 'white' : 'black'
						}}>
						{vendorContractsStatus[params?.data?.clientContract?.status]}
					</Button> : '-';
				}
			}
		},
		{headerName: 'Manufacturer', field: 'equipmentManufacturer', hide: false, suppressMenu: true},
		{headerName: 'Model Number', field: 'equipmentModel', hide: false, suppressMenu: true},
	];

	const [columnDefs, setColumnDefs] = useState<any>(columns);

	useEffect(() => {
		if(viewBuilderData.length && viewData?.columnsForLayout?.length) {

			let updatedColumndDefList: any = [];
			updatedColumndDefList[0] = columnDefs[0];
			viewData?.columnsForLayout.forEach((viewItem: any) => {
				columnDefs.forEach((cDef: any) => {
					if(viewItem.field == cDef.field) {
						let newColumnDef = {
							...cDef,
							...viewItem,
							hide: viewItem.field == 'markupFee' ? !settingsData?.allowMarkupFee : viewItem?.hide
						};
						updatedColumndDefList.push(newColumnDef);
					}
				});
			});
			setColumnDefs(updatedColumndDefList);
		}
	}, [viewData, settingsData]);

	useEffect(() => {
		if(columnDefs.length > 0) {
			dispatch(setColumnDefsHeaders(columnDefs));
		}
	}, [columnDefs]);

	const getCostTypeOptions = () => {
		return useAppSelector(getCostTypeList);
	};

	const getDivisionOptions = () => {
		// return useAppSelector(getCostCodeDivisionList);
		return useAppSelector(getCostCodeDropdownList);
	};


	const getDivisionFilterOptions = () => {
		// return useAppSelector(getCostCodeDivisionList);
		return useAppSelector(getCostCodeFilterList);
	};

	useEffect(() => {
		if(hideShowGridColumn.length > 0) {
			dispatch(setColumnDefsHeaders(hideShowGridColumn));
		}
	}, [hideShowGridColumn]);

	const defaultColDef = useMemo<ColDef>(() => {
		return {
			flex: 1,
			minWidth: 190,
			sortable: true,
			resizable: true,
		};
	}, []);

	const generatePresenceToolIds = (data: any) => {
		const presenceId = data.id;
		const presenceTools = <React.Fragment>{
			<>
				<div id={presenceId} className='budgetmanager-presence'></div>
			</>
		}</React.Fragment>;
		return presenceTools;
	};

	useEffect(() => {
		updateRowwisePresence();
	}, [presenceData]);

	const updateRowwisePresence = () => {
		let pids = Object.keys(presenceData);
		if(presencePrevState.length) {
			presencePrevState.forEach((id: any) => {
				if(!pids.includes(id)) {
					updatePresenceData(id, []);
				}
			});
		}
		setPresencePrevState(pids);
		pids.forEach((pId) => {
			updatePresenceData(pId, presenceData[pId]);
		});
	};
	const updatePresenceData = (pId: any, data: any) => {
		let presenceCmpRef = document.getElementById(pId) as any | null;
		if(presenceCmpRef) {
			let presenceManager = (presenceCmpRef.children && presenceCmpRef.children[0]) as any | null;
			if(presenceManager != null) {
				presenceManager.updateParticipants(data);
			}
		}
		return '';
	};

	const updatePresenceOnScrollandCollapse = () => {
		setTimeout(() => {
			updateRowwisePresence();
		}, 1000);
	};

	const renderPresence = (presenceId: any) => {
		let presenceManager = new PresenceManager({
			domElementId: presenceId,
			initialconfig: {
				'showLiveSupport': false,
				'showLiveLink': false,
				'showStreams': false,
				'showComments': false,
				'showChat': false,
				'hideProfile': true,
				'participants': [],
				'maxUser': 1
			}
		});
		addPresenceListener(presenceManager, presenceId);
		return '';
	};

	const customCellRendererClass = (params: any) => {
		const {data} = params;
		if(!data) {
			const isFooter = params?.node?.footer;
			const isRootLevel = params?.node?.level === -1;
			if(isFooter) {
				if(isRootLevel) {
					return 'Grand Total';
				}
				return `Sub Total - ${params?.value}`;
			} else {
				return `${params?.value}`;
			}
		}

		let {name, costCodeGroup, costType} = data,
			multiLevelList = costCodeGroup && costCodeGroup.length > 0 ? [...costCodeGroup] : [];

		if(multiLevelList && multiLevelList.length > 0) {
			multiLevelList.shift();
		}

		const multilevelString = multiLevelList.length > 0 ? multiLevelList?.join(' - ') : '';
		return <><div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', position: 'absolute', left: 0}}>
			<div className='presence-tools'>
				{[generatePresenceToolIds(params?.data)].map((presenceTool: any) => presenceTool)}
				<span>{renderPresence(params?.data?.id)}</span>
			</div>
			{params?.data?.isCostCodeInvalid ?
				<IQTooltip
					title={
						<Stack direction='row' className='tooltipcontent'>
							<WarningAmberIcon fontSize={primaryIconSize} style={{color: 'red'}} />
							<p className='tooltiptext'>The Division / Cost Code number does not match any code in the new list. Please update a new code.</p>
						</Stack>}
					placement={'bottom'}
					arrow={true}
				>
					<WarningAmberIcon fontSize={primaryIconSize} style={{color: 'red'}} />
				</IQTooltip>
				: (params?.data?.balance < 0 &&
					<IQTooltip
						title={
							<Stack direction='column'>
								<Stack direction='row' className='tooltipcontent'>
									<WarningAmberIcon fontSize={primaryIconSize} style={{color: 'red'}} />
									<p className='tooltiptext'>Your Remaining Balance is Negative</p>
								</Stack>
								<Stack direction='row' mt={-2} className='tooltipcontent'>
									<WarningAmberIcon fontSize={primaryIconSize} style={{color: '#f4e39f'}} />
									<p className='tooltiptext'>Your Forecasted Remaining Balance is Negative</p>
								</Stack>
							</Stack>}
						placement={'bottom'}
						arrow={true}
					>
						<WarningAmberIcon fontSize={primaryIconSize} style={{color: 'red'}} />
					</IQTooltip>)
			}
			{params?.data?.source === 1 &&
				<IQTooltip
					title={'Schedule Of Values of the Contract to be updated due to recent approval of the Change Event Request.'}
					placement={'bottom'}
					arrow={true}
				>
					<span className='common-icon-c-mark' style={{color: '#26d8b1', width: 20, height: 20, cursor: 'pointer'}} />
				</IQTooltip>
			}
		</div>
			<span className='ag-costcodegroup' style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
				{params?.data?.name + ' - ' + params.data.costCode + ' : ' + params.data.costType}
				{/* {`${name ? `${name} - ` : ''}${multilevelString ? `${multilevelString} : ` : ''}${costType}`} */}
			</span>
		</>;
	};

	const customValueGetter = (params: any) => {
		if(!params.data) {
			return params.value;
		}
		return params?.data?.name + ' - ' + params.data?.costCode + ' : ' + params.data?.costType;
	};

	const autoGroupColumnDef = useMemo<ColDef>(() => {
		return {
			headerName: 'Cost Code Group',
			field: 'division',
			valueGetter: (params: any) => customValueGetter(params),
			pinned: 'left',
			sort: 'asc',
			width: 550,
			resizable: true,
			// tooltipComponent: CustomTooltip,
			suppressRowClickSelection: true,
			// tooltipValueGetter: (params: any) => {
			// 	return params.value ? params.value : null;
			// },
			cellRenderer: 'agGroupCellRenderer',
			cellRendererParams: {
				suppressCount: false,
				checkbox: true,
				footerValueGetter: (params: any) => {
					const isRootLevel = params?.node?.level === -1;
					if(isRootLevel) {
						return 'Grand Total';
					}
					return `Sub Total - ${params?.value}`;
				},
				innerRenderer: (params: any) => customCellRendererClass(params),
			},
		};

	}, []);

	const gridOptions = {
		frameworkComponents: {'mySimpleEditor': CustomDateComponent},
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		tooltipShowDelay: 0
	};

	const rowDoubleClicked = useCallback((rowData: any, tableRef: any) => {
		if(rowData && rowData.data) {
			if(props.onRefChange) props.onRefChange(tableRef);
			rowData.node.setSelected(true, true);
			dispatch(setRightPannel(true));
			dispatch(setSelectedRowData(rowData.data));
			dispatch(setSelectedRowIndex(rowData.node));
			dispatch(setOpenBudgetTransferForm(false));
			dispatch(setOpenCostForm(false));
		}
	}, []);

	const rowClicked = useCallback((rowData: any, tableRef: any) => {
		if(rowData && rowData.data) {
			if(props.onRefChange) props.onRefChange(tableRef);
			dispatch(setSelectedRowData(rowData.data));
			dispatch(setSelectedRowIndex(rowData.node));
		}
	}, []);

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedRows(sltdRows));
		if(sltdRows?.node?.selected) {
			postMessage({
				event: 'joinroom',
				body: {iframeId: 'budgetManagerIframe', roomId: sltdRows?.data?.id, appType: 'BudgetManagerLineItem_' + sltdRows?.data?.id, roomTitle: sltdRows?.name}
			});
		} else {
			postMessage({
				event: 'exitroom',
				body: {iframeId: 'budgetManagerIframe', roomId: sltdRows?.data?.id, appType: 'BudgetManagerLineItem_' + sltdRows?.data?.id}
			});
		}
	};

	const onCellEditingStopped = useCallback((event: any) => {
		handleOnChange(event.newValue, event);
	}, []);

	// const getRowStyle = (params: any) => {
	// 	if(
	// 		params?.data !== undefined && rightPannel === true
	// 			? params?.rowIndex === selectedRowIndexData.rowIndex
	// 			: null
	// 	) {
	// 		params.api.ensureIndexVisible(Number(params.rowIndex + 3));
	// 		return {background: '#fff9cc'};
	// 	}
	// 	return {background: 'white'};
	// };

	const onRowGroupOpened = (params: any) => {
		if(params.expanded === false) {
			setCollapsedGroupHeaders([...collapsedGroupHeaders, params?.node?.key]);
		}
		else {
			setCollapsedGroupHeaders((products: any) => products.filter((value: any, index: any) => value !== params?.node?.key));
			updatePresenceOnScrollandCollapse();
		}
	};

	const isGroupOpenByDefault = useCallback((params: any) => {
		const groupedData: any = gridData.map((data: any) => {return data.division;});
		const divisionData: any = groupedData.filter((item: any, index: any) => groupedData.indexOf(item) === index); //removing duplicate division

		const localData: any = sessionStorage.getItem('collapsedGroupHeaders'); // getting collapsed grouped array data 

		const lScollapsedGroupHeaders = JSON.parse(localData);

		const finalHeaderOpenedData = divisionData.filter((x: any) => !lScollapsedGroupHeaders.includes(x)); //Removing the collapsed data from the main division array

		if(finalHeaderOpenedData.length > 0) {
			return finalHeaderOpenedData.includes(params.key);
		} {
			return true;
		}

	}, [gridData]);

	const [mousePos, setMousePos] = useState<any>({
		top: '-9999px',
		left: '-9999px', // hide div first
		data: '',
		display: false
	});

	const onCellMouseOver = (params: any) => {
		const costcodegroup = params?.data?.costCode + '-' + params?.data?.costType;
		const el = params.event.target;
		const boundingClient = el.getBoundingClientRect();
		const topPosition = boundingClient.y - (2 * boundingClient.height + 25) + 'px';
		const leftPosition = boundingClient.width + boundingClient.left - 140 + 'px';

		if(el.classList.contains('ag-cell') || el.classList.contains('ag-cell-wrapper') || el.classList.contains('ag-group-value')) {
			const groupCell = el?.querySelector('.ag-costcodegroup');
			if(groupCell) {
				setShowTooltip(groupCell.offsetWidth < groupCell.scrollWidth);
				setMousePos({
					...mousePos,
					top: topPosition,
					left: leftPosition,
					data: costcodegroup,
					display: groupCell.offsetWidth < groupCell.scrollWidth,
				});
			} else {
				setShowTooltip(false);
				setMousePos({
					...mousePos,
					top: topPosition,
					left: leftPosition,
					data: costcodegroup,
					display: false,
				});
			}
		} else {
			if(el) {
				setShowTooltip(el.offsetWidth < el.scrollWidth);
				setMousePos({
					...mousePos,
					top: topPosition,
					left: leftPosition,
					data: costcodegroup,
					display: el.offsetWidth < el.scrollWidth,
				});
			} else {
				setShowTooltip(false);
				setMousePos({
					...mousePos,
					top: topPosition,
					left: leftPosition,
					data: costcodegroup,
					display: false,
				});
			}
		}
	};

	const Divelement = () => {
		return (
			mousePos.display && (
				<div
					className='suiGrid-tooltip'
					style={{
						top: mousePos.top,
						left: mousePos.left,
					}}
				>
					{mousePos.data ? mousePos.data : null}
				</div>
			)
		);
	};

	const objDiff = (oldRec: any, newRec: any) => {
		// console.log('Object.keys(oldRec, newRec)-->', Object.values(oldRec), Object.values(newRec));
		let keyValues;
		keyValues = Object.keys(oldRec).filter(key => {
			if(typeof (oldRec[key]) != 'object') {
				// if(((oldRec[key] != undefined && oldRec[key] != null) &&  (newRec[key] != undefined && newRec[key] != null))){
				if(oldRec[key] != newRec[key]) {
					if(!['modifiedDate', 'rowId'].includes(key)) {
						console.log('Object key-->', key);
						return key;
					}
				}
				// }				
			}
		});

		// console.log('keyValues--->', keyValues);
		return keyValues.filter((element) => {
			return element != undefined || element != null;
		});
	};

	useEffect(() => {
	}, [mousePos]);

	useEffect(() => {
		if(liveData) {
			for(let id in liveData) {
				const diffKeys = liveData[id];
				let rowNode = gridRef.current?.api?.getRowNode(id);

				if(diffKeys && diffKeys.length > 0)
					gridRef.current?.api?.flashCells({rowNodes: [rowNode], columns: ['division', ...diffKeys]});
				else
					gridRef.current?.api?.flashCells({rowNodes: [rowNode]});
			}
		}
	}, [liveData]);

	const tableref = (value: any) => {
		setTableReff(value);
	};
	const groupRowRendererParams = () => {
		return {
			checkbox: true,
			suppressCount: false,
			suppressGroupRowsSticky: true
		};
	};

	/**
	 * Method to apply search and filters selected in the main window toolbar
	 * Kindly do not edit this method without understanding the complete logic
	 * @param list input list of budget items
	 * @returns list of filtered budget items
	 */
	const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(searchText, 'gi');
			const locationText = item.locations?.map((location: any) => location.name)?.join(',');
			const locationIds = item.locations?.map((location: any) => location.id?.toString());
			const vendorsIds = item.Vendors?.map((vendor: any) => vendor.id?.toString());
			const vendorText = item.Vendors?.map((vendor: any) => vendor.name)?.join(',');
			const curveText = _.find(curveList, {value: item.curve})?.label;
			const estimatedStartText = formatDate(item.estimatedStart, {year: 'numeric', month: '2-digit', day: '2-digit'});
			const estimatedEndText = formatDate(item.estimatedEnd, {year: 'numeric', month: '2-digit', day: '2-digit'});
			const providerSourceText = providerSourceObj?.[item?.providerSource];

			return (!searchText || (searchText && (item.name?.match(regex) || item.description?.match(regex) ||
				item.division.match(regex) || item.costCode.match(regex) || item.costType?.match(regex) ||
				item.unitOfMeasure?.match(regex) || item.vendorContract?.name.match(regex) ||
				item.vendorContract?.code.match(regex) || item.vendorContract?.status.match(regex) ||
				item.clientContract?.name?.match(regex) || item.clientContract?.code?.match(regex) ||
				item.clientContract?.status?.match(regex) || locationText?.match(regex) ||
				vendorText?.match(regex) || curveText?.match(regex) || providerSourceText?.match(regex) || estimatedStartText?.match(regex) ||
				estimatedEndText?.match(regex) || item.originalAmount?.toString()?.match(regex) ||
				item.revisedBudget?.toString()?.match(regex) || item.balance?.toString()?.match(regex) ||
				item.originalAmount?.toString()?.match(regex) ||
				item.equipmentManufacturer?.match(regex) || item.equipmentModel?.match(regex))))
				&& (_.isEmpty(selectedFilters) || (!_.isEmpty(selectedFilters)
					&& (_.isEmpty(selectedFilters.costCode) || selectedFilters.costCode?.length === 0 || selectedFilters.costCode?.indexOf(item.costCode) > -1)
					&& (_.isEmpty(selectedFilters.division) || selectedFilters.division?.length === 0 || selectedFilters.division?.indexOf(item.division) > -1)
					&& (_.isEmpty(selectedFilters.costType) || selectedFilters.costType?.length === 0 || selectedFilters.costType?.indexOf(item.costType) > -1)
					&& (_.isEmpty(selectedFilters.curve) || selectedFilters.curve?.length === 0 || selectedFilters.curve?.indexOf(item.curve?.toString()) > -1)
					&& (_.isEmpty(selectedFilters.bidPackage) || selectedFilters.bidPackage?.length === 0 || selectedFilters.bidPackage?.indexOf(item.bidPackage?.id) > -1)
					&& (_.isEmpty(selectedFilters.bidStatus) || selectedFilters.bidStatus?.length === 0 || selectedFilters.bidStatus?.indexOf(getBidStatusIdFromText(item?.bidPackage?.status)?.toString()) > -1)
					&& (_.isEmpty(selectedFilters.vendorContract) || selectedFilters.vendorContract?.length === 0 || selectedFilters.vendorContract?.indexOf(item.vendorContract?.id) > -1)
					&& (_.isEmpty(selectedFilters.vendorStatus) || selectedFilters.vendorStatus?.length === 0 || selectedFilters.vendorStatus?.indexOf(item.vendorContract?.status) > -1)
					&& (_.isEmpty(selectedFilters.clientContract) || selectedFilters.clientContract?.length === 0 || selectedFilters.clientContract?.indexOf(item.clientContract?.id) > -1)
					&& (_.isEmpty(selectedFilters.clientStatus) || selectedFilters.clientStatus?.length === 0 || selectedFilters.clientStatus?.indexOf(item.clientContract?.status) > -1)
					&& (_.isEmpty(selectedFilters.location) || selectedFilters.location?.length === 0 || _.intersection(selectedFilters.location, locationIds).length > 0)
					&& (_.isEmpty(selectedFilters.Vendors) || selectedFilters.Vendors?.length === 0 || _.intersection(selectedFilters.Vendors, vendorsIds).length > 0)
					&& (_.isEmpty(selectedFilters.providerSource) || selectedFilters.providerSource?.length === 0 || selectedFilters.providerSource?.indexOf(item.providerSource?.toString()) > -1)	
				));
		});
	};

	const modifiedData = searchAndFilter(gridData);

	return (
		<>
			<div style={containerStyle} className='budget-grid-cls'>
				<div style={gridStyle} className='ag-theme-alpine'>
					{
						<SUIGrid
							headers={columnDefs}
							data={modifiedData}
							grouped={true}
							animateRows={true}
							// realTimeDocPrefix='budgetManagerLineItems@'
							autoGroupColumnDef={autoGroupColumnDef}
							isGroupOpenByDefault={isGroupOpenByDefault}
							onRowDoubleClicked={(e: any, tableRef: any) => rowDoubleClicked(e, tableRef)}
							onRowClicked={(e: any, tableRef: any) => rowClicked(e, tableRef)}
							onRowGroupOpened={onRowGroupOpened}
							onCellEditingStopped={onCellEditingStopped}
							getRowId={(params: any) => params?.data?.id}
							rowSelected={(e: any) => rowSelected(e)}
							tableref={(value: any) => tableref(value)}
							onCellMouseOver={onCellMouseOver}
							updatedObj={updateObj}
							nowRowsMsg={'<div>Create new budget line item from above</div>'}
							onBodyScrollEnd={(e: any) => updatePresenceOnScrollandCollapse()}
							isMainGrid={true}
							openLID={rightPannel}
							selectedRecord={selectedRecord}
							groupRowRendererParams={groupRowRendererParams}
							groupDisplayType={'groupRows'}
							groupSelectsChildren={true}
							getReference={(value: any) => setGridRef(value)}
						></SUIGrid>
					}
				</div>
			</div >
			<Divelement />
		</>
	);
};

export default TableGrid;