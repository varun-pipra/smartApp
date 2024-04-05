
interface EstimateManagerWindowProps {
    fullScreen?:boolean
}
// const EstimateBudgetManagerWindow = (props:EstimateManagerWindowProps) => {return(<></>)}

// export default EstimateBudgetManagerWindow;

import './EstimateManagerWindow.scss';

import { setCurrencySymbol, setServer, getServer, setCostCodeDivisionList, setCostTypeList } from 'app/common/appInfoSlice';
import { isChangeEventClient, isChangeEventGC, isChangeEventSC } from 'app/common/userLoginUtils';
import { useAppDispatch, useAppSelector, useHomeNavigation } from 'app/hooks';
import { currency, isLocalhost, postMessage } from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import { appInfoData } from 'data/appInfo';
import _ from 'lodash';
import { memo, useMemo, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import convertDateToDisplayFormat, { minmaxDate, triggerEvent } from 'utilities/commonFunctions';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
// import { stateMap, statusFilterOptions, fundingSourceMap } from './CERUtils';
// import ChangeEventRequestsForm from './content/form/ChangeEventRequestsForm';
// import { CERLeftButtons, CERRightButtons } from './content/toolbar/CERToolbar';
// import ChangeEventRequestsLID from './details/ChangeEventRequestsLID';
// import {
// 	getChangeEventList, setSelectedChangeEvents, setToast, setDriveFiles, setCurrentChangeEventId, setTab, setChangeEventIframeActive
// } from './stores/ChangeEventSlice';
import CustomFilterHeader from 'features/common/gridHelper/CustomFilterHeader';
import { CustomGroupHeader } from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import { AgGridReact } from 'ag-grid-react';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';
import SUIAlert from 'sui-components/Alert/Alert';
import ViewBuilder from 'sui-components/ViewBuilder/ViewBuilder';
import { ViewBuilderOptions } from "sui-components/ViewBuilder/utils";
import { deleteView, addNewView, updateViewItem } from "sui-components/ViewBuilder/Operations/viewBuilderAPI";
import { fetchViewBuilderList, fetchViewData } from "sui-components/ViewBuilder/Operations/viewBuilderSlice";
import { fetchConnectors } from 'features/budgetmanager/operations/gridSlice';
import { fetchCostCodeDropdownList, fetchdefaultdrodown, fetchDivisionCostCodeFilterList, fetchSettings, fetchSettingsCostCodeAndType } from 'features/budgetmanager/operations/settingsSlice';
import { settingcostcodetypeData } from 'data/SettingsCosttypeData';
import {clearObjectValues} from 'sui-components/ViewBuilder/utils';
import BudgetCreateForm from './content/createform/BudgetCreateForm';
import { EMLeftButtons, EMRightButtons } from './content/toolbar/EMToolbar';
import { Button } from '@mui/material';
import { fetchGridData } from './stores/EstimateRoomSlice';
import EstimateManagerLID from './details/EstimateManagerLID';

const EstimateBudgetManagerWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const modName = 'changeevent';
	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const location = useLocation();
	const { toast, sourceList, changeEventIframeActive } = useAppSelector((state) => state.changeEventRequest);
	const {gridData}=  useAppSelector((state) =>state.estimateRoom)
	const { server, currencySymbol } = useAppSelector((state) => state.appInfo);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [isFullView, setFullView] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>('');
	const [filters, setFilters] = useState<any>({});
	const [search, setSearch] = useState<string>('');
	const [defaultFilters, setDefaultFilters] = useState<any>({});
	const groupKeyValue = useRef<any>(null);
	const [activeGroupKey, setActiveGroupKey] = useState<String>('None');

	let gridRef = useRef<AgGridReact>();
	let contractFilter: any = {};
	// sourceList.map((el: any) => contractFilter[el.clientContract?.id] = el.clientContract?.title);
//	const [viewBuilderData, setViewBuilderData] = useState<any>({ viewName: "", viewId: "" });
	const { viewData, viewBuilderData } = useAppSelector(state => state.viewBuilder);
	const { settingsData, CostCodeAndTypeData, openAlert, divisionCostCodeFilterData, costCodeDropdownData, costTypeDropdownData } = useAppSelector(state => state.settings);

	//if (statusFilter) defaultCERStatusFilter = filters.status;

	const gcGroupOptions = [
		{ text: 'Status', value: 'status' },
		{ text: 'Funding Source', value: 'fundingSource' },
		{ text: 'Client Contracts', value: 'clientContract.title' }
	];
	const scGroupOptions = [
		{ text: 'Status', value: 'status' },
		{ text: 'Vendor Contracts', value: 'vendorContract.title' }
	];

	const tabEnum: any = {
		details: 'change-Event-Details',
		lineItems: 'budget-line-items',
		referencefiles: 'reference-files',
		links: 'links'
	};

	const queryParams: any = new URLSearchParams(location.search);

	/**
	 * This effect is to process the incoming query string and act accordingly
	 */
	useEffect(() => {
		// const {search} = location;
		if (queryParams?.size > 0) {
			// const params: any = new URLSearchParams(search);
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');
			setFullView(queryParams?.get('inlineModule') === 'true');	
			// if (queryParams?.get('id')) {
			// 	dispatch(setCurrentChangeEventId(queryParams?.get('id')));
			// 	setManualLIDOpen(true);

			// 	if (queryParams?.get("tab")) {
			// 		dispatch(setTab(tabEnum[queryParams?.get("tab")]));
			// 	}
			// }
		}
		dispatch(fetchGridData(appInfo))
		dispatch(fetchSettings(appInfo));
		dispatch(fetchSettingsCostCodeAndType(appInfo));
	}, []);


		useEffect(() => {
		// console.log('settings in header pinning', CostCodeAndTypeData)
		dispatch(fetchDivisionCostCodeFilterList({ appInfo: appInfo, costCodeName: settingsData.divisionCostCode }));
		dispatch(fetchCostCodeDropdownList({ appInfo: appInfo, name: settingsData.divisionCostCode }));
		// dispatch(fetchCostTypeDropdownList({appInfo: appInfo, name: settingsData.divisionCostCode}));
		// console.log("List divisionCostCodeFilterData",divisionCostCodeFilterData, costCodeDropdownData, costTypeDropdownData)

		const ListData = localhost ? settingcostcodetypeData.values : CostCodeAndTypeData.values;
		// console.log('ListData', divisionCostCodeFilterData, costCodeDropdownData, costTypeDropdownData)
		const divisionCostCodeListValues = getDivisionCostCodeValues(ListData, settingsData.divisionCostCodeId);
		const costTypeListValues = getDivisionCostCodeValues(ListData, settingsData.costTypeId);
		// console.log('divisionCostCodeListValues', divisionCostCodeListValues, costTypeListValues)
		divisionCostCodeListValues?.length > 0 && dispatch(setCostCodeDivisionList(divisionCostCodeListValues[0]));
		costTypeListValues?.length > 0 && console.log(costTypeListValues[0]); dispatch(setCostTypeList(costTypeListValues[0]));

	}, [settingsData, CostCodeAndTypeData]);

	const getDivisionCostCodeValues = (data: any, id: any) => {
		if (data.length > 0) {
			const values = data.map((obj: any) => {
				if (obj.id === id) {
					return obj.listValues;
				}
			});

			return values.filter((element: any) => {
				return element !== undefined;
			});
		}
	};
	// useEffect(() => {
	// 	setToastMessage(toast);
	// 	setTimeout(() => {
	// 		setToastMessage('');
	// 		dispatch(setToast(''));
	// 	}, 3000);
	// }, [toast]);

	/**
	 * All initial APIs will be called here
	 * Grid API
	 * Dropdown APIs that supports adding a new record
	 */
	useEffect(() => {
		if (server) {
			// dispatch(getChangeEventList());
			// dispatch(fetchConnectors(server));
			// dispatch(fetchdefaultdrodown(appInfo));
			// dispatch(fetchSettings(appInfo));			
		}
	}, [server]);

	useEffect(() => {
		if (localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
		} else {
			if (!server) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == 'string' ? JSON.parse(data) : data;
					data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
					if (data) {
						switch (data.event || data.evt) {
							case 'hostAppInfo':
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case 'getdrivefiles':
								try {
									// dispatch(setDriveFiles(data.data));
								} catch (error) {
									console.log('Error in adding Files from Drive:', error);
								}
								break;
							case 'updateparticipants':
								// console.log('updateparticipants', data)
								triggerEvent('updateparticipants', { data: data.data, appType: data.appType });
								break;
							case 'updatecommentbadge':
								// console.log('updatecommentbadge', data)
								triggerEvent('updatecommentbadge', { data: data.data, appType: data.appType });
								break;
							case 'updatechildparticipants':
								// console.log('updatechildparticipants', data)
								// dispatch(setPresenceData(data.data));
								break;
							case "frame-active":
								console.log("frame-active", data);
								// data?.data?.name == "changeevents" && dispatch(setChangeEventIframeActive(true));
								break;
						}
					}
				};

				postMessage({
					event: 'hostAppInfo',
					body: { iframeId: 'changeEventRequestsIframe', roomId: server && server.presenceRoomId, appType: 'ChangeEventRequests' }
				});
			}
		}
	}, [localhost, appData]);

	useEffect(() => {
		if(changeEventIframeActive) {
			console.log("changeEventIframeActive", changeEventIframeActive);			
			// dispatch(getChangeEventList());
			// setTimeout(()=> {dispatch(setChangeEventIframeActive(false))}, 5000)
		}
	}, [changeEventIframeActive])

	const onGroupingChange = (groupKey: any) => {
		const data = groupKey == null || groupKey == 'undefined' ? 'None' : groupKey;
		if (((data ?? false) && data !== "")) {
			groupKeyValue.current = data;
		} else if (data ?? true) {
			groupKeyValue.current = null;
		}
		setActiveGroupKey(data);
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if (node.group) {
			const colName = groupKeyValue?.current;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if (colName === "status") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							// label={stateMap[data?.status]?.text} colName={colName}
						/>
					</div>
				);
			} else if (colName === "fundingSource") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={data?.fundingSource} colName={colName}
						/>
					</div>
				);
			} else if (colName === "clientContract.title") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={data?.clientContract?.title} colName={colName}
						/>
					</div>
				);
			}
		};
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
		return list.filter((item: any) => {
			const regex = new RegExp(search, 'gi');
			return (!search || (search && (item.name?.match(regex) || 
            // (fundingSourceMap[item.fundingSource]).match(regex) ||
				// (stateMap[item.status]?.text).match(regex) || item.code?.match(regex) ||
				item.fundingSource?.match(regex) || item.clientContract?.client?.name?.match(regex) ||
				item.clientContract?.title?.match(regex) ||
				item.budgetItems?.filter((el: any) => {
					return el.name?.match(regex) || el.constType?.match(regex) ||
						el.costCode?.match(regex) || el.division?.match(regex);
				}).length > 0)))
				&& (_.isEmpty(filters) || (!_.isEmpty(filters)
					&& (_.isEmpty(filters.status) || filters.status?.length === 0 || filters.status?.indexOf(item.status) > -1)
					&& (_.isEmpty(filters.fundingSource) || filters.fundingSource?.length === 0 || filters.fundingSource?.indexOf(item.fundingSource) > -1)
					&& (_.isEmpty(filters.clientContracts) || filters.clientContracts?.length === 0 || filters.clientContracts?.indexOf(item.clientContract.id) > -1)));
		});
	};

	const getContractFilters = (contractMap: any) => {
		let list: any = [];
		for (let id in contractMap) {
			list.push({
				text: contractMap[id],
				key: id,
				value: id
			});
		}
		return list;
	};

	const getVendorContractName = (data: any) => {
		let title: any;
		data?.forEach((obj: any) => {
			title = (title ? title + ',' : '') + obj?.title;
		});
		return title;
	};

	const handleStatusFilter = (statusFilters: any) => {
		setFilters((prevFilters: any) => {
			const consolidatedFilter = { ...prevFilters, ...{ status: statusFilters } };
			setDefaultFilters(consolidatedFilter);
			return consolidatedFilter;
		});
	};

	const handleStatusColumnSort = (direction: any) => {
		gridRef?.current?.columnApi?.applyColumnState({
			state: [{ colId: 'status', sort: direction }],
			defaultState: { sort: null }
		});
	};

	/**
	 * Grid data is set in this method
	 * 
	 * Search, Filters are applied to the source data and the result
	 * is set to the local state
	 */
	const modifiedList:any = [] //gridData; //searchAndFilter(gridData);
    console.log('gridData---------->', gridData);
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
			// valueGetter: (params: any) => customValueGetter(params),
			keyCreator: (params: any) => params.data.division || 'None',
			aggFunc: (params: any) => {
				if (!params.rowNode?.key) {
					return 'Grand Total';
				}
				return params.rowNode?.key;
			},
			cellRendererParams: {
				// innerRenderer: (params: any) => customCellRendererClass(params),
			}
		},
		{ headerName: 'Esimate ID/CBS', field: 'name', hide: false, suppressMenu: true },
		
		{
			headerName: 'Division/Cost Code',
			field: 'costCode',
			minWidth: 380,
			suppressMenu: true,
			keyCreator: (params: any) => params.data.costCode || 'None',
			// tooltipComponent: CustomTooltip,
			tooltipValueGetter: (params: any) => {
				return params && params?.data && params.value && params.value.length > 50
					? params.value
					: null;
			},
			cellRenderer: (params: any) => {
				// let selectOptions: any = [...getDivisionOptions()];
				let hiddenOptions: any = [];
				// let isCostCodeExistsInOptions: any = params?.data?.costCode ? isCostCodeExists(selectOptions, params?.data?.costCode) : false;
				//if (!isCostCodeExistsInOptions) {
					let obj: any =
					{
						value: params?.data?.costCode,
						id: params?.data?.costCode,
						children: null,
						isHidden: true,
					};
					hiddenOptions.push(obj);
				//}
				let inLinefilter: any = [];
				// getDivisionFilterOptions()?.map((option: any) => {
				// 	if (option?.value == params?.data?.division) {
				// 		// setMultiLevelDefaultFilters([option?.hierarchy]);
				// 		inLinefilter = [option?.hierarchy];
				// 	}
				// });


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
				// return (					
				// 	params?.node?.rowPinned !== 'bottom' && params?.data && (
				// 		isReadOnly ? `${params?.data?.division}-${params?.data?.costCode}`
				// 			: <>
				// 				{(
				// 					<CostCodeSelect
				// 						label=" "
				// 						options={selectOptions}
				// 						hiddenOptions={hiddenOptions}
				// 						onChange={(value: any) => handleOnChange(value, params)}
				// 						// required={true}
				// 						// startIcon={<div className='budget-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>}
				// 						checkedColor={"#0590cd"}
				// 						showFilter={false}
				// 						selectedValue={
				// 							params?.data?.division && params?.data?.costCode
				// 								?  params?.data?.costCode
				// 								: ""
				// 						}
				// 						Placeholder={"Select"}
				// 						outSideOfGrid={false}
				// 						showFilterInSearch={true}
				// 						isFullWidth={true}
				// 						sx={{
				// 							fontSize: "13px",
				// 							"&:before": {
				// 								border: "none",
				// 							},
				// 							"&:after": {
				// 								border: "none",
				// 							},
				// 							".MuiSelect-icon": {
				// 								display: "none",
				// 							},
				// 						}}
				// 						filteroptions={getDivisionFilterOptions()}
				// 						filteringValue={params?.data?.division}
				// 						onFiltersUpdate={(filters: any) =>
				// 							setMultiLevelDefaultFilters(filters)
				// 						}
				// 						defaultFilters={
				// 							multiLevelDefaultFilters?.length
				// 								? multiLevelDefaultFilters?.length
				// 								: inLinefilter
				// 						}
				// 					/>
				// 				)
				// 					// : (
				// 					//   <div
				// 					//     onClick={(e: any) => {
				// 					// 		console.log('srini on click');
				// 					//     //   e.stopPropagation();
				// 					//     //   params.node.setData({
				// 					//     //     ...params.node.data,
				// 					//     //     isCostCodeExistsInOptions: true,
				// 					//     //   });
				// 					//     }}
				// 					//   >
				// 					//     Srini {params.data?.costCode}
				// 					//   </div>
				// 					// )
				// 				}
				// 			</>
				// 	)
				// );
				// ) : null;
			}
		},
		{
			headerName: 'Cost Type',
			field: 'costType',
			hide: false,
			suppressMenu: true,
			keyCreator: (params: any) => params.data.costType || 'None',
			// cellRenderer: (params: any) => {
			// 	// return params?.node?.level == 1 ? (
			// 	return params?.node?.rowPinned !== 'bottom' && params?.data && <SmartDropDown
			// 		options={getCostTypeOptions()}
			// 		dropDownLabel=''
			// 		isSearchField={false}
			// 		isFullWidth={true}
			// 		outSideOfGrid={false}
			// 		selectedValue={params.data ? params?.data?.costType : ''}
			// 		handleChange={(value: any) => handleOnChange(value, params)}
			// 		sx={{
			// 			fontSize: '13px',
			// 			'&:before': {
			// 				border: 'none',
			// 			},
			// 			'&:after': {
			// 				border: 'none',
			// 			},
			// 			'.MuiSelect-icon': {
			// 				display: 'none',
			// 			},
			// 		}}
			// 		menuProps={classes.menuPaper}
			// 	/>;
			// 	// ) : null;
			// }
		}, 
        {
			headerName: 'Original Budget Amount',
			field: 'originalAmount',
			valueGetter: (params: any) =>
				params.data ? params?.data?.originalAmount : '',
			aggFunc: 'sum',
			minWidth: 250,
			type: 'rightAligned',
			// editable: true,
			hide: false,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if (params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		},
        { headerName: 'Description', field: 'description', hide: false, suppressMenu: true },
        {
			headerName: 'Associated Location/System',
			field: 'locations',
			suppressMenu: true,
			minWidth: 220,
			keyCreator: (params: any) => {
				const { value } = params;
				return (Array.isArray(value) && value?.length > 0) ? (value || [])?.map((location: any) => location?.name)?.join(', ') : 'NA';
			},
			cellRenderer: (params: any) => {
				const { value } = params;
				return Array.isArray(value) ? (value || [])?.map((location: any) => location?.name)?.join(', ') : '';
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
			field: 'markupFeeAmount',
			valueGetter: (params: any) => {
				if (params?.data?.allowMarkupFee) {
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
				if(params?.node?.rowPinned == 'bottom'){
					return amountFormatWithSymbol(params?.data?.markupFeeAmount) ?? '';
				}else {
					if (params?.value && params?.node?.footer) {
						return amountFormatWithSymbol(params?.value);
					}
					else if (params?.data && params?.value && params?.data?.markupFeePercentage) {
						return amountFormatWithSymbol(params?.value) + `(${params?.data?.markupFeePercentage}%)`;
					}
					else if (params?.data && params?.value && params?.data?.markupFeePercentage == null) {
						return params?.value == 'N/A' ? 'N/A' : amountFormatWithSymbol(params?.value);
					}
				}				
			}
		},
        {
			headerName: 'Provider Source',
			field: 'providerSource',
			hide: false,
			// valueGetter: (params: any) => providerSourceObj?.[params.data?.providerSource],
		},
        {
			headerName: 'System Breakdown Structure (SBS)',
			field: 'sbs',
			hide: false,
			// valueGetter: (params: any) => providerSourceObj?.[params.data?.providerSource],
		},
        {
			headerName: "Phase",
			field: "sbsPhaseName",
			suppressMenu: true,
			minWidth: 260,
			cellRenderer: (params: any) => {
				const phase = params.data?.sbsPhaseName;
				const buttonStyle = {
					// backgroundColor: getSBSPhaseColor(params.data?.sbsPhaseId),
					color: "#fff",
					alignItems: "center",
				};

				return (
					<>
						{phase ? (
							<Button style={buttonStyle} className="phase-btn">
								<span className="common-icon-phase"></span>
								{phase}
							</Button>
						) : null}
					</>
				);
			},
		},
        {
			headerName: 'Estimated Start Date',
			field: 'estimatedStart',
			hide: false,
			minWidth: 210,
			suppressMenu: true,
			valueGetter: (params: any) => params?.data ? convertDateToDisplayFormat(params?.data?.estimatedStart) : '',
			aggFunc: (params: any) => {
				if (params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if (newArr.length > 0) return minmaxDate(newArr, 'minDate');
				}
			},
			// cellRenderer: (params: any) => {
			// 	return (
			// 		params && params?.data ?
			// 			<DatePickerComponent
			// 				defaultValue={convertDateToDisplayFormat(params?.data?.estimatedStart)}
			// 				onChange={(val: any) => handleOnChange(val, params)}
			// 				maxDate={params?.node?.footer ? new Date('12/31/9999') : params?.data?.estimatedEnd !== '' ? new Date(params?.data?.estimatedEnd) : new Date('12/31/9999')}
			// 				style={{
			// 					width: '170px',
			// 					border: 'none',
			// 					background: 'transparent',
			// 					fontSize: '14px',
			// 					fontFamily: 'Roboto-Regular'
			// 				}}
			// 			/>
			// 			: params && params?.value ? <span style={{ marginLeft: '4px' }}>{params?.value}</span>
			// 				// : params && params.node.footer && params.value ? <span style={{ marginLeft: '4px' }}>{params.value}</span>
			// 				: null
			// 	);
			// }
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
				if (params && params?.values) {
					const newArr = params?.values.filter((a: any) => a);
					if (newArr.length > 0) return minmaxDate(newArr, 'maxDate');
				}
			},
			// cellRenderer: (params: any) => {
			// 	return (
			// 		params && params?.data ?
			// 			<DatePickerComponent
			// 				defaultValue={convertDateToDisplayFormat(params?.data?.estimatedEnd)}
			// 				onChange={(val: any) => handleOnChange(val, params)}
			// 				minDate={new Date(params?.data?.estimatedStart)}
			// 				style={{
			// 					width: '170px',
			// 					border: 'none',
			// 					background: 'transparent',
			// 					fontSize: '14px',
			// 					fontFamily: 'Roboto-Regular'
			// 				}}

			// 			/>
			// 			: params && params?.value ? <span style={{ marginLeft: '4px' }}>{params?.value}</span>
			// 				: null
			// 	);
			// }
		},
		
        { headerName: 'Unit Of Measure', field: 'unitOfMeasure', hide: false, },
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
				if (params?.value && (
					params?.node?.footer ||
					params?.node?.level > 0 ||
					!params?.node?.expanded)
				) {
					return amountFormatWithSymbol(params?.value);
				}
			}
		}        
	];

	const [colDef, setColDef] = useState<any>([...columns]);

	const filterOptions = useMemo(() => [
		{
			text: 'Status',
			value: 'status',
			key: 'status',
			children: {
				type: 'checkbox',
				// items: statusFilterOptions
			}
		},
		{
			text: 'Funding Source',
			value: 'fundingSource',
			key: 'fundingSource',
			children: {
				type: 'checkbox',
				items: [{
					text: 'Change Order',
					key: 'ChangeOrder',
					value: 'ChangeOrder'
				}, {
					text: 'Contingency',
					key: 'Contingency',
					value: 'Contingency'
				}, {
					text: 'General Contractor',
					key: 'GeneralContractor',
					value: 'GeneralContractor'
				}]
			}
		},
		{
			text: 'Client Contracts',
			value: 'clientContracts',
			key: 'clientContracts',
			children: {
				type: 'checkbox',
				items: getContractFilters(contractFilter)
			}
		}
	], []);


	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: 'changeEventRequestsIframe', roomId: server && server.presenceRoomId, appType: 'ChangeEventRequests' }
		});
	};

	const rowSelected = (sltdRows: any) => {
		// dispatch(setSelectedChangeEvents(sltdRows));
	};

	const handleIconClick = () => {
		if (isInline) useHomeNavigation('changeEventRequestIframe', 'ChangeEventRequests');
	};

	const handleDropDown = (value: any, data: any) => {
		if (value === "save") {
			saveViewHandler(data);
			setToastMessage(`${viewData?.viewName} Saved Successfully`);
		}
		else if (value === "delete") {
			DeleteViewHandler();
			setToastMessage(`${viewData?.viewName} Deleted Successfully`);
		}
	}

	const saveNewViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(filters);
		const payload = { ...value, viewFor: modName, filters: filters ? FilterValue : '{}', groups: activeGroupKey ? [activeGroupKey] : ['None'] };
		console.log('payload', payload);
		addNewView(appInfo, payload, modName, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'ChangeEvent' }));
			// dispatch(getChangeEventList());
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewData?.viewId }));
		});
	}
	const saveViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(filters);
		const payload = { ...value, filters: FilterValue ? FilterValue : '{}', groups: activeGroupKey ? [activeGroupKey] : ['None'] };
		console.log('payload', payload);
		updateViewItem(appInfo, viewData?.viewId, payload, (response: any) => {
			// dispatch(getChangeEventList());
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewData?.viewId }));
		});
	}
	const DeleteViewHandler = () => {
		deleteView(appInfo, viewData?.viewId, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'ChangeEvent' }));
		});
	}

	// useMemo(()=>{
	// 	if(filters.status?.length){
	// 		if(statusFilter){
	// 			let updatedColumndDefList2: any = colDef.map((cDef: any) => {
	// 				if (cDef.field == "status") {
	// 					return { ...cDef,headerComponentParams : {...cDef.headerComponentParams , defaultFilters :[...filters.status]}};
	// 				}
	// 				return cDef;
	// 			});
	// 			setColDef(updatedColumndDefList2);
	// 		}
	// 	}
	// 		else{
	// 			let updatedColumndDefList2: any = colDef.length > 0 && colDef.map((cDef: any) => {
	// 				if (cDef.field == "status") {
	// 					return { ...cDef,headerComponentParams : {...cDef.headerComponentParams , defaultFilters :undefined}};
	// 				}
	// 				return cDef;
	// 			});
	// 			setColDef(updatedColumndDefList2);
	// 		}
	// },[filters])
	
	// useEffect(() => {
	// 	//Appending viewbuilder data to grid 
	// 	if (viewBuilderData.length > 0 &&  viewData?.columnsForLayout?.length) {
	// 		let updatedColumndDefList: any = [];
	// 		const gridApi = gridRef.current;
	// 		if (gridApi) {
	// 			let updatedColumndDefList: any = [];
	// 			viewData?.columnsForLayout.forEach((viewItem: any) => {
	// 				columns?.forEach((cDef: any) => {
	// 					if (viewItem.field == cDef.field) {
	// 						let newColumnDef = {
	// 							...cDef,
	// 							...viewItem,
	// 							hide: viewItem?.hide,
	// 							headerComponentParams : cDef.field == "status" && {...cDef.headerComponentParams , defaultFilters :filters.status?.length ? filters.status : undefined}
	// 						};
	// 						updatedColumndDefList.push(newColumnDef);
	// 					}
	// 				});
	// 			});
	// 			setColDef([...updatedColumndDefList])
	// 			gridApi?.api?.setColumnDefs(updatedColumndDefList);
	// 		}
	// 	}
	// }, [viewData]);

	// useMemo(() => {
	// 	if (viewData?.viewId) {
	// 		const formatedFilter = viewData?.filters == null ? JSON.parse('{}') : JSON.parse(viewData?.filters);
	// 		const formatedgrouping = viewData?.groups?.length ==  0 || viewData?.groups == null || viewData?.groups[0] == '' || viewData?.groups[0] == 'None'  ? 'undefined': viewData?.groups?.[0];
	// 		if(!_.isEmpty(filters) && formatedFilter){
	// 			const data = clearObjectValues(filters,formatedFilter);
	// 			setFilters(data);
	// 			setDefaultFilters(data);
	// 		}	
	// 		else{
	// 			setFilters(formatedFilter);
	// 			setDefaultFilters(formatedFilter);
	// 		}
	// 		setActiveGroupKey(formatedgrouping);
	// 	}
	// }, [viewData])

	// useMemo(() => {
	// 	// if grouping value is changed and colDef array as a data.
	// 	// modifing the coldef array, object value rowGroup true or false based on activeMainGridGroupKey
	// 	if (activeGroupKey && colDef) {
	// 		const data = colDef?.length > 0 && colDef?.map((item: any) => {
	// 			if (item.field === activeGroupKey) {
	// 				return { ...item, 
	// 					rowGroup: true,
	// 					headerComponentParams : item.field == "status" && {...item.headerComponentParams , defaultFilters :filters.status?.length ? filters.status : undefined}
	// 				 };
	// 			} else if (item.rowGroup) {
	// 				return { ...item, rowGroup: false };
	// 			}
	// 			return item;
	// 		});
	// 		setColDef(data);
	// 	}
	// }, [activeGroupKey])

	const viewListOnChange = (data: any) => {
		//setViewBuilderData(data);
		// dispatch(getChangeEventList());
	}

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		server && (isChangeEventGC() || isChangeEventSC() || isChangeEventClient() ? <GridWindow
			open={true}
			title='Estimate Manager'
			companyInfo={isChangeEventClient() || isChangeEventSC()}
			centerPiece={
				(isChangeEventClient() && <>{`Below are all Change Order Requests for your company '${server?.currentUserInfo?.company}' for the Project '${server?.currentProjectInfo?.name}'`}</>)
				|| (isChangeEventSC() && <>{`Below are Quote Requests for your Trade '${server?.gblConfig?.currentUserSkillTrade?.tradeName ? server?.gblConfig?.currentUserSkillTrade?.tradeName : ''}' for the Project '${server?.currentProjectInfo?.name}'`}</>)
			}
			className='estimate-manager-window'
			iconCls='common-icon-change-event-details'
			appType='EstimateManager'
			appInfo={server}
			iFrameId='estimateManagerIframe'
			// defaultTabId='change-Event-Details'
			isFromHelpIcon={true}
			zIndex={100}
			gridRef={gridRef}
			onClose={handleClose}
			manualLIDOpen={manualLIDOpen}
			moduleColor='#00e5b0'
			inlineModule={isInline}
			isFullView={isFullView}
			maxByDefault={isMaxByDefault}
			showBrena={server?.showBrena}
			onIconClick={handleIconClick}
			presenceProps={{
				presenceId: 'estimate-manager-presence',
				showBrena: false,
				showLiveSupport: true,
				showLiveLink: true,
				showStreams: true,
				showComments: true,
				showChat: false,
				hideProfile: false,
			}}
			righPanelPresenceProps={{
				presenceId: "estimate-manager-presence",
				showLiveSupport: true,
				showStreams: true,
				showPrint: true,
			}}
			tools={{
				closable: true,
				resizable: true,
				openInNewTab: true
			}}
			PaperProps={{
				sx: maxSize ? {
					height: '100%',
					minWidth: '100vw',
					minHeight: '100vh',
					borderRadius: 0
				} : {
					width: '95%',
					height: '90%'
				}
			}}
			toast={toastMessage}
			content={{
				headContent: isChangeEventGC() ? { regularContent: <BudgetCreateForm /> } : {},
				detailView: EstimateManagerLID,
				gridContainer: {
					toolbar: {
						leftItems: <EMLeftButtons />,
						rightItems: <EMRightButtons />,
						searchComponent: {
							show: true,
							type: 'regular',
							// defaultFilters: defaultFilters,
							// defaultGroups: activeGroupKey,
							groupOptions: isChangeEventSC() ? scGroupOptions : gcGroupOptions,
							filterOptions: filterOptions,
							onGroupChange: onGroupingChange,
							onSearchChange: onGridSearch,
							onFilterChange: (value: any) => { onFilterChange(value) },
							placeholder: viewData?.viewName,
							viewBuilderapplied: false,
						},
						viewBuilder: <ViewBuilder
							moduleName={modName}
							appInfo={appInfo}
							dropDownOnChange={(value: any, data: any) => { handleDropDown(value, data) }}
							saveView={(data: any) => { saveViewHandler(data) }}
							deleteView={() => { DeleteViewHandler() }}
							saveNewViewData={(data: any) => { saveNewViewHandler(data) }}
							//dataList={(data: any) => { setViewBuilderData(data) }}
							viewListOnChange={(data: any) => { viewListOnChange(data) }}
							requiredColumns={['name', 'status']}
						/>
					},
					grid: {
						// headers: columns,
						headers: colDef && colDef.length > 0 ? colDef : columns,
						data: gridData,
						getRowId: (params: any) => params.data?.id,
						grouped: true,
						groupIncludeTotalFooter: false,
						rowSelection: 'single',
						groupIncludeFooter: false,
						rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						nowRowsMsg: '<div>Create New Estimate Line Item by Clicking the + Add button above</div>',
						// groupRowRendererParams: groupRowRendererParams,
					}
				}
			}}
		/>
			: <SUIAlert
				open={true}
				DailogClose={true}
				onClose={() => {
					postMessage({
						event: 'closeiframe',
						body: { iframeId: 'changeEventRequestIframe', roomId: server && server?.presenceRoomId, appType: 'ChangeEventRequests' }
					});
				}}
				contentText={'You Are Not Authorized'}
				title={'Warning'}
				onAction={(e: any, type: string) => {
					type == 'close' && postMessage({
						event: 'closeiframe',
						body: { iframeId: 'changeEventRequestIframe', roomId: server && server?.presenceRoomId, appType: 'ChangeEventRequests' }
					});
				}}
				showActions={false}
			/>
		)
	);
};

export default memo(EstimateBudgetManagerWindow);