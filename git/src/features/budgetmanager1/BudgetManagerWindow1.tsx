import './BudgetManagerWindow.scss';

import {
	setCurrencySymbol, setServer, getCostCodeDivisionList,
	getCostTypeList
} from 'app/common/appInfoSlice';
// import {isChangeEventClient, isChangeEventGC, isChangeEventSC} from 'app/common/userLoginUtils';
import {useAppDispatch, useAppSelector, useHomeNavigation, useHotLink} from 'app/hooks';
import {currency, isLocalhost, postMessage} from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import {appInfoData} from 'data/appInfo';
import _ from 'lodash';
import {memo, useEffect, useMemo, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {triggerEvent} from 'utilities/commonFunctions';
import {getBudgetItems, setCurrentBudgetId, setToast} from './store/BudgetManagerSlice';
import {ColDef} from 'ag-grid-community';
import IQTooltip, {IQGridTooltip} from 'components/iqtooltip/IQTooltip';
import {formatDate} from 'utilities/datetime/DateTimeUtils';
import CustomTooltip from 'features/budgetmanager/aggrid/customtooltip/CustomToolTip';
import CostCodeDropdown from 'components/costcodedropdown/CostCodeDropdown';
import SmartDropDown from 'components/smartDropdown';
import {getFormattedAmount} from 'utilities/commonutills';
import VendorList from 'features/budgetmanager/aggrid/vendor/Vendor';
import DatePickerComponent from 'components/datepicker/DatePicker';
import {vendorContractsStatus, vendorContractsStatusColors, vendorContractsStatusIcons} from 'utilities/vendorContracts/enums';
import {getBidStatusIdFromText, StatusColors, StatusIcons} from 'utilities/bid/enums';
import {createStyles, makeStyles} from '@mui/styles';

let tinycolor = require('tinycolor2');

let defaultStatusFilter: any = [];

const curveOpts: any = {
	0: "Back Loaded",
	1: "Front Loaded",
	2: "Linear",
	3: "Bell"
};

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxWidth: '160px !important',
			minWidth: 'fit-content !important',
			marginLeft: '18px'
		}
	})
);

const BudgetManagerWindow = () => {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const iframeId = 'budgetManagerIframe', appType = 'BudgetManager';

	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);

	const location = useLocation();
	const {toast, sourceList, settings, curveList} = useAppSelector((state) => state.budgetManager);
	const {server, currencySymbol, currencyCode} = useAppSelector((state) => state.appInfo);
	// const {settingsData} = useAppSelector(state => state.settings);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [isFullView, setFullView] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>('');
	const [filters, setFilters] = useState<any>({});
	const [search, setSearch] = useState<string>('');
	const [updateObj, setUpdateObj] = useState<any>({});
	const [defaultFilters, setDefaultFilters] = useState<any>({});
	const groupKeyValue = useRef<any>(null);
	// const [activeGroupKey, setActiveGroupKey] = useState<String>('');

	let contractFilter: any = {};
	sourceList.map((el: any) => contractFilter[el.clientContract?.id] = el.clientContract?.title);

	if(statusFilter) defaultStatusFilter = filters.status;

	/**
	 * This effect is to process the incoming query string and act accordingly
	 */
	useEffect(() => {
		const {search} = location;
		if(search) {
			const params: any = new URLSearchParams(search);
			setMaxByDefault(params?.get('maximizeByDefault') === 'true');
			setInline(params?.get('inlineModule') === 'true');
			setFullView(params?.get('inlineModule') === 'true');

			if(params?.get('id')) {
				dispatch(setCurrentBudgetId(params?.get('id')));
				setManualLIDOpen(true);
			}
		}
	}, []);

	useEffect(() => {
		setToastMessage(toast);
		setTimeout(() => {
			setToastMessage('');
			dispatch(setToast(''));
		}, 3000);
	}, [toast]);

	/**
	 * All initial APIs will be called here
	 * Grid API
	 * Dropdown APIs that supports adding a new record
	 */
	useEffect(() => {
		if(server) {
			dispatch(getBudgetItems());
		}
	}, [server]);

	useEffect(() => {
		if(localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
		} else {
			if(!server) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == 'string' ? JSON.parse(data) : data;
					data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
					if(data) {
						switch(data.event || data.evt) {
							case 'hostAppInfo':
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'updateparticipants':
								triggerEvent('updateparticipants', {data: data.data, appType: data.appType});
								break;
							case 'updatecommentbadge':
								triggerEvent('updatecommentbadge', {data: data.data, appType: data.appType});
								break;
						}
					}
				};

				postMessage({
					event: 'hostAppInfo',
					body: {iframeId: iframeId, roomId: server && server.presenceRoomId, appType: appType}
				});
			}
		}
	}, [localhost, appData]);

	const onGroupingChange = (groupKey: any) => {
		// const columnsCopy = [...columns];
		// setActiveGroupKey(groupKey);
		// console.log("activeMainGridGroupKey", groupKey, columnsCopy);
		// if(((groupKey ?? false) && groupKey !== "")) {
		// 	groupKeyValue.current = groupKey;
		// 	// columnsCopy.forEach((col: any) => {
		// 	// 	col.rowGroup = groupKey ? groupKey === col.field : false;
		// 	// 	setColumns(columnsCopy);
		// 	// });
		// } else if(groupKey ?? true) {
		// 	groupKeyValue.current = null;
		// 	// columnsCopy.forEach((col: any) => {
		// 	// 	// console.log("status", col?.rowGroup);
		// 	// 	col.rowGroup = false;
		// 	// });
		// 	// console.log("else group key", columnsCopy);
		// 	// setColumns(columnsCopy);
		// };
	};

	const GroupRowInnerRenderer = (props: any) => {
		// const node = props.node;
		// if(node.group) {
		// 	const colName = groupKeyValue?.current;
		// 	console.log("cellerender", colName, node?.group);
		// 	const data = node?.childrenAfterGroup?.[0]?.data || {};
		// 	if(colName === "status") {
		// 		return (
		// 			<div style={{display: 'flex'}}>
		// 				<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
		// 					label={stateMap[data?.status]?.text} colName={colName}
		// 				/>
		// 			</div>
		// 		);
		// 	} else if(colName === "fundingSource") {
		// 		// console.log("contract", colName);
		// 		return (
		// 			<div style={{display: 'flex'}}>
		// 				<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
		// 					label={data?.fundingSource} colName={colName}
		// 				/>
		// 			</div>
		// 		);
		// 	} else if(colName === "clientContract.title") {
		// 		return (
		// 			<div style={{display: 'flex'}}>
		// 				<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
		// 					label={data?.clientContract?.title} colName={colName}
		// 				/>
		// 			</div>
		// 		);
		// 	}
		// };
	};

	// const groupRowRendererParams = useMemo(() => {
	// 	return {
	// 		checkbox: true,
	// 		suppressCount: false,
	// 		suppressGroupRowsSticky: true,
	// 		innerRenderer: GroupRowInnerRenderer
	// 	};
	// }, []);

	const onFilterChange = (activeFilters: any, type?: string) => {
		setFilters(activeFilters);
	};

	const onGridSearch = (searchText: any) => {
		setSearch(searchText);
	};

	const searchAndFilter = (list: any) => {
		// return list.filter((item: any) => {
		// 	const regex = new RegExp(search, 'gi');
		// 	return (!search || (search && (item.name?.match(regex) || (fundingSourceMap[item.fundingSource]).match(regex) ||
		// 		(stateMap[item.status]?.text).match(regex) || item.code?.match(regex) ||
		// 		item.fundingSource?.match(regex) || item.clientContract?.client?.name?.match(regex) ||
		// 		item.clientContract?.title?.match(regex) ||
		// 		item.budgetItems?.filter((el: any) => {
		// 			return el.name?.match(regex) || el.constType?.match(regex) ||
		// 				el.costCode?.match(regex) || el.division?.match(regex);
		// 		}).length > 0)))
		// 		&& (_.isEmpty(filters) || (!_.isEmpty(filters)
		// 			&& (_.isEmpty(filters.status) || filters.status?.length === 0 || filters.status?.indexOf(item.status) > -1)
		// 			&& (_.isEmpty(filters.fundingSource) || filters.fundingSource?.length === 0 || filters.fundingSource?.indexOf(item.fundingSource) > -1)
		// 			&& (_.isEmpty(filters.clientContracts) || filters.clientContracts?.length === 0 || filters.clientContracts?.indexOf(item.clientContract.id) > -1)));
		// });
		return list;
	};

	const getCostTypeOptions = () => {
		return useAppSelector(getCostTypeList);
	};

	const getDivisionOptions = () => {
		return useAppSelector(getCostCodeDivisionList);
	};

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

	const handleBudgetGridInlineChange = (newvalue: any, event: any) => {
		const fieldName = event.colDef.field;
		const value = fieldName === 'costCode' ? newvalue.split('|')[1] : fieldName === 'costType' ? newvalue[0] : newvalue;
		setUpdateObj(fieldName === 'costCode' ? {id: event.data.id, newValue: value, field: fieldName, division: newvalue.split('|')[0]} : {id: event.data.id, newValue: value, field: fieldName});
	};

	const handleStatusFilter = (statusFilters: any) => {
		setFilters((prevFilters: any) => {
			const consolidatedFilter = {...prevFilters, ...{status: statusFilters}};
			setDefaultFilters(consolidatedFilter);
			return consolidatedFilter;
		});
	};

	const columns = useMemo<Array<ColDef>>(() => [
		{
			headerName: 'Cost Code Group',
			field: 'division',
			pinned: 'left',
			hide: true,
			rowGroup: true
		}, {
			headerName: 'Budget ID/CBS',
			field: 'name',
			suppressMenu: true
		}, {
			headerName: 'Description',
			field: 'description',
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
		}, {
			headerName: 'Division/Cost Code',
			field: 'costCode',
			suppressMenu: true,
			minWidth: 380,
			keyCreator: (params: any) => params.data.costCode || 'None',
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
						onChange={(value: any) => handleBudgetGridInlineChange(value, params)}
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
		}, {
			headerName: 'Cost Type',
			field: 'costType',
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
						handleChange={(value: any) => handleBudgetGridInlineChange(value, params)}
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
		}, {
			headerName: 'Original Budget Amount',
			field: 'originalAmount',
			aggFunc: 'sum',
			minWidth: 250,
			type: 'rightAligned',
			editable: true,
			suppressMenu: true,
			valueGetter: (params: any) => params.data ? params?.data?.originalAmount : '',
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Mark-up Fee',
			field: 'markupFee',
			valueGetter: (params: any) => {
				if(params?.data?.allowMarkupFee) return params?.data?.markupFeeType == 0 ? params?.data?.markupFeeAmount ?? 'N/A' : params?.data?.markupFeePercentage ? `${params?.data?.markupFeeAmount?.toLocaleString('en-US')} (${params?.data?.markupFeePercentage}%)` : 'N/A';
				else 'N/A';
			},
			aggFunc: 'sum',
			minWidth: 250,
			type: 'rightAligned',
			editable: false,
			hide: !settings?.allowMarkupFee,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return params?.value != 'N/A' ? currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode) : 'N/A';
				}
			}
		}, {
			headerName: 'Budget Transfer Amount',
			aggFunc: 'sum',
			minWidth: 230,
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Approved COs',
			field: 'approvedBudgetChange',
			aggFunc: 'sum',
			type: 'rightAligned',
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? params?.data?.approvedBudgetChange : '',
			cellRenderer: (params: any) => {
				if(params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Revised Budget',
			field: 'revisedBudget',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Transaction Amount',
			field: 'balanceModifications',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Remaining Balance',
			field: 'balance',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Curve',
			field: 'curve',
			minWidth: 120,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.curve ? curveOpts[params?.data?.curve] : '',
			cellRenderer: (params: any) => {
				return params?.node?.level == 1 ? (
					<SmartDropDown
						options={curveList}
						dropDownLabel=''
						isSearchField={false}
						isFullWidth={false}
						outSideOfGrid={false}
						selectedValue={params?.data ? params?.data?.curve : ''}
						handleChange={(value: any) => handleBudgetGridInlineChange(value, params)}
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
		}, {
			headerName: 'Vendor',
			field: 'Vendors',
			minWidth: 210,
			editable: false,
			suppressMenu: true,
			keyCreator: (params: any) => {
				return params?.data?.Vendors?.length > 0 ? params?.data?.Vendors?.map((rec: any) => rec.name) : 'None';
			},
			tooltipComponent: CustomTooltip,
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
							handleVendorChange={handleBudgetGridInlineChange}
							params={params}
							multiSelect={true}
							outSideOfGrid={false}
							showFilterInSearch={true}
						/>
				) : null;
			}
		}, {
			headerName: 'Estimated Start Date',
			field: 'estimatedStart',
			minWidth: 210,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? formatDate(params?.data?.estimatedStart, {year: 'numeric', month: '2-digit', day: '2-digit'}) : '',
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
							defaultValue={formatDate(params?.data?.estimatedStart, {year: 'numeric', month: '2-digit', day: '2-digit'})}
							onChange={(val: any) => handleBudgetGridInlineChange(val, params)}
							maxDate={params?.node?.footer ? new Date('12/31/9999') : params?.data?.estimatedEnd !== '' ? new Date(params?.data?.estimatedEnd) : new Date('12/31/9999')}
							style={{
								width: '170px',
								border: 'none',
								background: 'transparent',
								fontSize: '14px',
								fontFamily: 'Roboto-Regular'
							}}
						/> : (params && params?.value ? <span style={{marginLeft: '4px'}}>{params?.value}</span> : null)
				);
			}
		}, {
			headerName: 'Estimated End Date',
			minWidth: 210,
			field: 'estimatedEnd',
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? formatDate(params?.data?.estimatedEnd, {year: 'numeric', month: '2-digit', day: '2-digit'}) : '',
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
							defaultValue={formatDate(params?.data?.estimatedEnd, {year: 'numeric', month: '2-digit', day: '2-digit'})}
							onChange={(val: any) => handleBudgetGridInlineChange(val, params)}
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
		}, {
			headerName: 'Projected Schedule Start',
			field: 'projectedScheduleStart',
			minWidth: 230,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.projectedScheduleStart ? formatDate(params?.data?.projectedScheduleStart, {year: 'numeric', month: '2-digit', day: '2-digit'}) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'minDate');
				}
			}
		}, {
			headerName: 'Projected Schedule End',
			field: 'projectedScheduleEnd',
			minWidth: 230,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.projectedScheduleEnd ? formatDate(params?.data?.projectedScheduleEnd, {year: 'numeric', month: '2-digit', day: '2-digit'}) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'maxDate');
				}
			}
		}, {
			headerName: 'Actual Schedule Start',
			field: 'actualScheduleStart',
			minWidth: 210,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.actualScheduleStart ? formatDate(params?.data?.actualScheduleStart, {year: 'numeric', month: '2-digit', day: '2-digit'}) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'minDate');
				}
			}
		}, {
			headerName: 'Actual Schedule End',
			field: 'actualScheduleEnd',
			minWidth: 200,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data && params?.data?.actualScheduleEnd ? formatDate(params?.data?.actualScheduleEnd, {year: 'numeric', month: '2-digit', day: '2-digit'}) : '',
			aggFunc: (params: any) => {
				if(params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if(newArr.length > 0) return minmaxDate(newArr, 'maxDate');
				}
			}
		}, {
			headerName: 'Unit of Measure', field: 'unitofMeasure', suppressMenu: true
		}, {
			headerName: 'Unit Quantity',
			field: 'unitQuantity',
			suppressMenu: true,
			cellRenderer: (params: any) => params?.data?.unitQuantity?.toLocaleString('en-US') || ''
		}, {
			headerName: 'Unit Cost',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Pending Change Order',
			field: 'pendingChangeOrderAmount',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Pending Transactions',
			field: 'pendingTransactionAmount',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Budget Forecast',
			field: 'budgetForecast',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Balance Forecast',
			field: 'balanceForecast',
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
					return currencySymbol + ' ' + getFormattedAmount(params?.value, currencyCode);
				}
			}
		}, {
			headerName: 'Bid Package Name',
			field: 'bidPackage.name',
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
		}, {
			headerName: 'Bid Award Date',
			field: 'bidPackage.awardedOn',
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.bidPackage?.awardedOn ? formatDate(params?.data?.bidPackage?.awardedOn, {year: 'numeric', month: '2-digit', day: '2-digit'}) : ''
		}, {
			headerName: 'Bid Status',
			field: 'bidPackage.status',
			suppressMenu: true,
			cellRenderer: (params: any) => {
				const state = params?.data?.bidPackage?.status || '',
					icon = StatusIcons[state],
					color = StatusColors[state],
					text = getBidStatusIdFromText(state);

				if(params?.value && (params?.node?.footer || params?.node?.level > 0 || !params?.node?.expanded)) {
					return state ? <div
						className='status'
						style={{
							color: tinycolor(color),
							backgroundColor: color
						}}
					>
						<span className={`status-icon ${icon}`}></span> {text}{' '}
					</div> : '-';
				}
			}
		}, {
			headerName: 'Vendor Contract Name',
			field: 'vendorContract.name',
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
						onClick={() => window.open(useHotLink(`vendor-contracts/home?id=${params?.data?.vendorContract?.id}`), '_blank')}>
						{params?.data?.vendorContract?.name && params?.data?.vendorContract?.name}
					</span>;
				}
			}
		}, {
			headerName: 'Vendor Contract Date',
			field: 'vendorContract.startDate',
			minWidth: 240,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.vendorContract?.startDate && params?.data?.vendorContract?.endDate ?
				`${formatDate(params?.data?.vendorContract?.startDate, {year: 'numeric', month: '2-digit', day: '2-digit'})} - ${formatDate(params?.data?.vendorContract?.endDate, {year: 'numeric', month: '2-digit', day: '2-digit'})}` :
				''
		}, {
			headerName: 'Vendor Contract Status',
			field: 'vendorContract.status',
			minWidth: 220,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				const state = params?.data?.vendorContract?.status || '',
					icon = vendorContractsStatusIcons[state],
					color = vendorContractsStatusColors[state],
					text = vendorContractsStatus[state];

				if(params?.value && (params?.node?.footer || params?.node?.level > 0 || !params?.node?.expanded)) {
					return state ? <div
						className='status'
						style={{
							color: tinycolor(color),
							backgroundColor: color
						}}
					>
						<span className={`status-icon ${icon}`}></span> {text}{' '}
					</div> : '-';
				}
			}
		}, {
			headerName: 'Client Contract Name',
			field: 'clientContract.name',
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
		}, {
			headerName: 'Client Contract Date',
			field: 'clientContract.startDate',
			minWidth: 240,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data?.clientContract?.startDate && params?.data?.clientContract?.endDate ?
				`${formatDate(params?.data?.clientContract?.startDate, {year: 'numeric', month: '2-digit', day: '2-digit'})} - ${formatDate(params?.data?.clientContract?.endDate, {year: 'numeric', month: '2-digit', day: '2-digit'})}` :
				''
		}, {
			headerName: 'Client Contract Status',
			field: 'clientContract.status',
			minWidth: 220,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				const state = params?.data?.clientContract?.status || '',
					icon = vendorContractsStatusIcons[state],
					color = vendorContractsStatusColors[state],
					text = vendorContractsStatus[state];

				if(params?.value && (params?.node?.footer || params?.node?.level > 0 || !params?.node?.expanded)) {
					return state ? <div
						className='status'
						style={{
							color: tinycolor(color),
							backgroundColor: color
						}}
					>
						<span className={`status-icon ${icon}`}></span> {text}{' '}
					</div> : '-';
				}
			}
		}, {
			headerName: 'Manufacturer', field: 'equipmentManufacturer', suppressMenu: true
		}, {
			headerName: 'Model Number', field: 'equipmentModel', suppressMenu: true
		}
	], []);

	const budgetAutoGroup = useMemo<ColDef>(() => {
		return {
			headerName: 'Cost Code Group',
			field: 'division',
			pinned: 'left',
			sort: 'asc',
			width: 550,
			rowGroup: true,
			resizable: true,
			suppressRowClickSelection: true,
			cellRenderer: 'agGroupCellRenderer',
			cellRendererParams: {
				suppressCount: false,
				checkbox: true,
				// footerValueGetter: (params: any) => {
				// 	const isRootLevel = params?.node?.level === -1;
				// 	if(isRootLevel) {
				// 		return 'Grand Total';
				// 	}
				// 	return `Sub Total - ${params?.value}`;
				// },
				innerRenderer: (context: any) => {
					if(!context.data) {
						const isFooter = context?.node?.footer;
						const isRootLevel = context?.node?.level === -1;
						if(isFooter) {
							if(isRootLevel) {
								return 'Grand Total';
							}
							return `Sub Total - ${context?.value}`;
						} else {
							return `${context?.value}`;
						}
					}
					if(context.node.group) {
						return <div className='bold-font'>{context.value}</div>;
					} else {
						const {name, board, smartapp} = context.data;
						const initials = name?.split('-')[0];

						return <div className='blue-color mouse-pointer vertical-center-align'>
							{context.value}
						</div>;
					}
				}
			},
			valueGetter: (context: any) => {
				return context.data ? `${context?.data?.name} - ${context.data?.costCode} : ${context.data?.costType}` : context.value;
			}
		};
	}, []);

	// const filterOptions = useMemo(() => [
	// 	// {
	// 	// 	text: 'Status',
	// 	// 	value: 'status',
	// 	// 	key: 'status',
	// 	// 	children: {
	// 	// 		type: 'checkbox',
	// 	// 		items: statusFilterOptions
	// 	// 	}
	// 	// },
	// 	// {
	// 	// 	text: 'Funding Source',
	// 	// 	value: 'fundingSource',
	// 	// 	key: 'fundingSource',
	// 	// 	children: {
	// 	// 		type: 'checkbox',
	// 	// 		items: [{
	// 	// 			text: 'Change Order',
	// 	// 			key: 'ChangeOrder',
	// 	// 			value: 'ChangeOrder'
	// 	// 		}, {
	// 	// 			text: 'Contingency',
	// 	// 			key: 'Contingency',
	// 	// 			value: 'Contingency'
	// 	// 		}, {
	// 	// 			text: 'General Contractor',
	// 	// 			key: 'GeneralContractor',
	// 	// 			value: 'GeneralContractor'
	// 	// 		}]
	// 	// 	}
	// 	// },
	// 	// {
	// 	// 	text: 'Client Contracts',
	// 	// 	value: 'clientContracts',
	// 	// 	key: 'clientContracts',
	// 	// 	children: {
	// 	// 		type: 'checkbox',
	// 	// 		items: getContractFilters(contractFilter)
	// 	// 	}
	// 	// }
	// ], []);

	// console.log("columnsss", columns, activeGroupKey);

	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: {iframeId: iframeId, roomId: server && server.presenceRoomId, appType: appType}
		});
	};

	const handleIconClick = () => {
		if(isInline) useHomeNavigation(iframeId, appType);
	};

	/**
	 * Grid data is set in this method
	 * 
	 * Search, Filters are applied to the source data and the result
	 * is set to the local state
	 */
	const modifiedList = searchAndFilter(sourceList);

	return <GridWindow
		open={true}
		title='Budget Manager'
		className='budget-manager-window'
		iconCls='common-icon-budget-manager'
		appInfo={server}
		appType={appType}
		iFrameId={iframeId}
		zIndex={100}
		onClose={handleClose}
		manualLIDOpen={manualLIDOpen}
		moduleColor='#00e5b0'
		inlineModule={isInline}
		isFullView={isFullView}
		maxByDefault={isMaxByDefault}
		showBrena={server?.showBrena}
		onIconClick={handleIconClick}
		presenceProps={{
			presenceId: 'budgetmanager-presence',
			showBrena: false,
			showLiveSupport: true,
			showLiveLink: true,
			showStreams: true,
			showComments: true,
			showChat: false,
			hideProfile: false,
		}}
		tools={{
			closable: true,
			resizable: true,
			openInNewTab: true
		}}
		PaperProps={{
			sx: {
				width: '95%',
				height: '90%'
			}
		}}
		toast={toastMessage}
		content={{
			headContent: {regularContent: <></>},
			// detailView: ChangeEventRequestsLID,
			gridContainer: {
				toolbar: {
					// leftItems: <CERLeftButtons />,
					// rightItems: <CERRightButtons />,
					searchComponent: {
						show: true,
						type: 'regular',
						// defaultFilters: defaultFilters,
						// groupOptions: [],
						// filterOptions: filterOptions,
						onGroupChange: onGroupingChange,
						onSearchChange: onGridSearch,
						onFilterChange: onFilterChange
					}
				},
				grid: {
					headers: columns,
					data: modifiedList,
					grouped: true,
					animateRows: true,
					// rowSelection: 'single',
					// groupIncludeFooter: false,
					// groupDisplayType: 'groupRows',
					// groupIncludeTotalFooter: false,
					groupDefaultExpanded: 1,
					autoGroupColumnDef: budgetAutoGroup,
					getRowId: (params: any) => params.data?.id,
					// getDataPath: (item: any) => item.costCodeGroup,
					// groupRowRendererParams: groupRowRendererParams,
					nowRowsMsg: `<div>Create new budget line item from above</div>`
				}
			}
		}}
	/>;
};

export default memo(BudgetManagerWindow);