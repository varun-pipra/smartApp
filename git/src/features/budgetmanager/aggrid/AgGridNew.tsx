import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {Button, Stack} from '@mui/material';
import {createStyles, makeStyles} from '@mui/styles';
import {ColDef} from 'ag-grid-community/dist/lib/entities/colDef';
import {
	getCostCodeDivisionList,
	getCostTypeList,
	getServer,
} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
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
import {setBidPackagesList, setClientContractsList, setSelectedRows, setVendorContractsList} from '../operations/gridSlice';
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
import IQDataGrid from 'components/iqdatagrid/IQDataGrid';
var tinycolor = require('tinycolor2');
import {CustomGroupHeader} from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';

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
	const {gridData, originalGridApiData, presenceData} = useAppSelector((state) => state.gridData);

	const {selectedRowIndexData} = useAppSelector(
		(state) => state.rightPanel
	);
	const {settingsData} = useAppSelector(state => state.settings);

	const rightPannel = useAppSelector(showRightPannel);
	const {viewData, viewBuilderData} = useAppSelector((state) => state.viewBuilder);
	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const [collapsedGroupHeaders, setCollapsedGroupHeaders] = useState<any>([]);
	const [showTooltip, setShowTooltip] = useState(false);
	const hideShowGridColumn = useAppSelector<any>(getGridColumnHide);


	const [updateObj, setUpdateObj] = useState<any>({});
	const [tableReff, setTableReff] = useState<any>();
	const [presencePrevState, setPresencePrevState] = useState<any>([]);
	const selectedGroupKey = useAppSelector(state => state.gridData?.selectedGroupKey);

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
			suppressMenu: true,
			checkboxSelection: true,
			cellRenderer: 'agGroupCellRenderer',
			valueGetter: (params: any) => customValueGetter(params),
			keyCreator: (params: any) => params.data.division || 'None',
			aggFunc: (params: any) => {
				if(!params.rowNode?.key) {
					return 'Grand Total';
				}
				return 'Sub Total - ' + params.rowNode?.key;
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
								onClick={() => window.open(`${appInfo?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/change-event-requests?inlineModule=true&id=${context.data?.changeEvent?.id}#react`, '_blank')}
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
			// hide: false,
			tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params && params?.data && params.value && params.value.length > 50
					? params.value
					: null;
			},
			cellRenderer: (params: any) => {
				return params?.node?.level == 1 ? (
					<CostCodeDropdown
						label=''
						options={getDivisionOptions()}
						required={false}
						selectedValue={
							params?.data
								? params?.data?.division + '|' + params?.data?.costCode
								: ''
						}
						checkedColor={'#0590cd'}
						onChange={(value) => handleOnChange(value, params)}
						showFilter={false}
						showFilterInSearch={true}
						isFullWidth={true}
						outSideOfGrid={false}
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
						filteringValue={params?.data?.division}
					/>
				) : null;
			}
		},
		{
			headerName: 'Cost Type',
			field: 'costType',
			hide: false,
			suppressMenu: true,
			keyCreator: (params: any) => params.data.costType || 'None',
			cellRenderer: (params: any) => {
				return params?.node?.level == 1 ? (
					<SmartDropDown
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
				) : null;
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
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
				}
			}
		},
		{
			headerName: 'Mark-up Fee',
			field: 'markupFee',
			valueGetter: (params: any) => {
				if(params?.data?.allowMarkupFee) return params?.data?.markupFeeAmount ? params?.data?.markupFeeAmount : params?.data?.markupFeePercentage ? `${(params?.data?.markupFeePercentage / 100) * (params?.data?.originalAmount)} (${params?.data?.markupFeePercentage ? params?.data?.markupFeePercentage : 0}%)` : 'N/A';
				else 'N/A';
			},
			aggFunc: 'sum',
			minWidth: 250,
			type: 'rightAligned',
			editable: false,
			hide: !settingsData?.allowMarkupFee,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
				}
			}
		},
		{
			headerName: 'Budget Transfer Amount',
			valueGetter: (params: any) => 0,
			aggFunc: 'sum',
			minWidth: 230,
			hide: false,
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
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
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
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
				}
			}
		},
		{
			headerName: 'Revised Budget',
			field: 'revisedBudget',
			hide: false,
			valueGetter: (params: any) =>
				params?.data ? params?.data?.revisedBudget : '',
			aggFunc: 'sum',
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
				}
			}
		},
		{
			headerName: 'Transaction Amount',
			field: 'balanceModifications',
			hide: false,
			valueGetter: (params: any) =>
				params?.data ? params?.data?.balanceModifications : '',
			aggFunc: 'sum',
			minWidth: 230,
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
				}
			}
		},
		{
			headerName: 'Remaining Balance',
			field: 'balance',
			hide: false,
			valueGetter: (params: any) => (params?.data ? params?.data?.balance : ''),
			aggFunc: 'sum',
			minWidth: 230,
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return currencySymbol + ' ' + params?.value?.toLocaleString('en-US');
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
				return params?.node?.level == 1 ? (
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
				return params && params?.node?.level == 1 ? (
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
					params && params?.node?.level == 1 && params?.data ?
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
					params && params?.node?.level == 1 && params?.data ?
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
			valueGetter: (params: any) => params?.data ? params?.data?.unitCost : '',
			field: 'unitCost',
			type: 'rightAligned',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
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
					return currencySymbol + ' ' + params?.value?.toLocaleString('en-US');
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
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
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
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
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
					return currencySymbol + ' ' + params?.value.toLocaleString('en-US');
				}
			}
		},
		{
			headerName: 'Bid Package Name',
			field: 'bidPackage.name',
			hide: false,
			suppressMenu: true,
			// valueGetter: (params: any) => params?.data ? params?.data?.balanceForecast : '',
			// aggFunc: 'sum',
			// type: 'rightAligned',
			cellRenderer: (params: any) => {
				if(
					params?.value && (
						params?.node?.footer ||
						params?.node?.level > 0 ||
						!params?.node?.expanded
					)
				) {
					return <span className='hot-link'
						onClick={() => {window.open(`${appInfo?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/bid-manager/home?id=${params?.data?.bidPackage?.id}#react`, '_blank');}}
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
						onClick={() => window.open(`${appInfo.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/vendor-contracts/home?id=${params?.data?.vendorContract?.id}#react`, '_blank')}					>
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
						onClick={() => window.open(`${appInfo.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/client-contracts/home?id=${params?.data?.clientContract?.id}#react`, '_blank')}
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
		// // console.log('viewData', viewData);
		// // console.log('viewData?.columnsForLayout', viewData?.columnsForLayout);

		if(viewBuilderData.length && viewData?.columnsForLayout?.length) {

			let updatedColumndDefList: any = [];
			updatedColumndDefList[0] = columnDefs[0];
			viewData?.columnsForLayout.forEach((viewItem: any) => {
				columnDefs.forEach((cDef: any) => {
					if(viewItem.field == cDef.field) {
						let newColumnDef = {
							...cDef,
							...viewItem
						};
						updatedColumndDefList.push(newColumnDef);
					}
				});
			});
			// // console.log('updatedColumndDefList', updatedColumndDefList);
			setColumnDefs(updatedColumndDefList);
		}
	}, [viewData]);

	useEffect(() => {
		if(columnDefs.length > 0) {
			dispatch(setColumnDefsHeaders(columnDefs));
		}
	}, [columnDefs]);

	// useEffect(() => {
	// 	if(tableReff){
	// 		tableReff.refreshCells({ columns: ['costType'], force: true });
	// 	}
	// }, [costTypeOpts])

	const getCostTypeOptions = () => {
		return useAppSelector(getCostTypeList);
	};

	const getDivisionOptions = () => {
		return useAppSelector(getCostCodeDivisionList);
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
		if(!params.data) {
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
			<span className='ag-costcodegroup' style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{params?.data?.name + ' - ' + params.data.costCode + ' : ' + params.data.costType} </span>
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
			// valueGetter: (params: any) => params.data ? customCellRendererClass(params) : '',
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
				innerRenderer: (params: any) => customCellRendererClass(params)
			}
		};
	}, []);

	const gridOptions = {
		frameworkComponents: {'mySimpleEditor': CustomDateComponent},
		columnDefs: columnDefs,
		defaultColDef: defaultColDef,
		tooltipShowDelay: 0,
		// groupSelectsChildren: true
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

	const getRowStyle = (params: any) => {
		if(
			params?.data !== undefined && rightPannel === true
				? params?.rowIndex === selectedRowIndexData.rowIndex
				: null
		) {
			params.api.ensureIndexVisible(Number(params.rowIndex + 3));
			return {background: '#fff9cc'};
		}
		return {background: 'white'};
	};

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
			//el && // console.log('else', el.offsetWidth < el.scrollWidth); setShowTooltip(el.offsetWidth < el.scrollWidth)
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

	useEffect(() => {
	}, [mousePos]);

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

	const columnsNew = useMemo(() => [
		{headerName: 'Budget ID/CBS', field: 'budgetId'},
		{headerName: 'Description', field: 'description'},
		{headerName: 'Division/Cost Code', field: 'costCode'},
		{headerName: 'Cost Type', field: 'Cost Type'},
		{headerName: 'Associated Location/System', field: 'locations'},
		{headerName: 'Original Budget Amount', field: 'originalBudgetAmount'},
		{headerName: 'Budget Transfer Amount', field: 'budgetTransferAmount'},
		{headerName: 'Approved COs', field: 'approvedCOs'},
		{headerName: 'Revised Budget', field: 'revisedBudget'},
		{headerName: 'Transaction Amount', field: 'transactionAmount'},
		{headerName: 'Remaining Balance', field: 'remainingBalance'},
		{headerName: 'Curve', field: 'curve'},
		{headerName: 'Vendor', field: 'vendor'},
		{headerName: 'Estimated Start Date', field: 'estimatedStartDate'},
		{headerName: 'Estimated End Date', field: 'estimatedEndDate'},
		{headerName: 'Projected Schedule Start', field: 'projectedScheduleStart'},
		{headerName: 'Projected Schedule End', field: 'projectedScheduleEnd'},
		{headerName: 'Actual Schedule Start', field: 'actualScheduleStart'},
		{headerName: 'Actual Schedule End', field: 'actualScheduleEnd'},
		{headerName: 'Unit of Measure', field: 'unitofMeasure'},
		{headerName: 'Unit Quantity', field: 'unitQuantity'},
		{headerName: 'Unit Cost', field: 'unitCost'},
		{headerName: 'Pending Change Order', field: 'pendingChangeOrder'},
		{headerName: 'Pending Transactions', field: 'pendingTransactions'},
		{headerName: 'Budget Forecast', field: 'budgetForecast'},
		{headerName: 'Balance Forecast', field: 'balanceForecast'},
		{headerName: 'Bid Package Name', field: 'bidPackageName'},
		{headerName: 'Bid Award Date', field: 'bidAwardDate'},
		{headerName: 'Bid Status', field: 'bidStatus'},
		{headerName: 'Vendor Contract Name', field: 'vendorContractName'},
		{headerName: 'Vendor Contract Date', field: 'vendorContractDate'},
		{headerName: 'Vendor Contract Status', field: 'vendorContractStatus'},
		{headerName: 'Client Contract Name', field: 'clientContractName'},
		{headerName: 'Client Contract Date', field: 'clientContractDate'},
		{headerName: 'Client Contract Status', field: 'clientContractStatus'}
	], []);

	const getDataId = useMemo(() => {
		return (context: any) => context.data.id;
	}, []);

	const getDataPath = useMemo(() => {
		return (data: any) => data.costCodeGroup;
	}, []);

	const defaultColDefNew = useMemo(() => {
		return {
			minWidth: 150,
			suppressMenu: true
		};
	}, []);

	return (
		<>
			<div style={containerStyle} className='budget-grid-cls'>
				<div style={gridStyle} className='ag-theme-alpine'>
					{
						// gridData && gridData.length > 0 && (
						<SUIGrid
							headers={columnDefs}
							data={gridData}
							grouped={true}
							animateRows={true}
							realTimeDocPrefix='budgetManagerLineItems@'
							autoGroupColumnDef={autoGroupColumnDef}
							isGroupOpenByDefault={isGroupOpenByDefault}
							// suppressRowClickSelection={true}
							onRowDoubleClicked={(e: any, tableRef: any) => rowDoubleClicked(e, tableRef)}
							onRowClicked={(e: any, tableRef: any) => rowClicked(e, tableRef)}
							onRowGroupOpened={onRowGroupOpened}
							onCellEditingStopped={onCellEditingStopped}
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
							getDataPath={getDataPath}
							getRowId={getDataId}
						></SUIGrid>
					}
				</div>
			</div >
			<Divelement />
		</>
	);
};

export default TableGrid;