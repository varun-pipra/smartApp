import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import './TimeLogWindow.scss';
import { Stack ,Radio,RadioGroup,FormControlLabel} from '@mui/material';
import IQTooltip, { IQGridTooltip } from 'components/iqtooltip/IQTooltip';
import { getServer, setCurrencySymbol, setCustomDatesRange, setServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector, useHomeNavigation } from 'app/hooks';
import { currency, isLocalhost, postMessage } from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import { appInfoData } from 'data/appInfo';
import _ from 'lodash';
import { memo, useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import convertDateToDisplayFormat , { triggerEvent } from 'utilities/commonFunctions';
import { formatDate, getTime } from 'utilities/datetime/DateTimeUtils';
import SUIAlert from 'sui-components/Alert/Alert';
import AddTimeLogForm from './AddTimeLogForm';
import { timelogStatusMap ,timelogSourceMap} from './TimeLogConstants';
import CustomFilterHeader from '../gridHelper/CustomFilterHeader';
import { TLLeftButtons, TLRightButtons } from './toolbar/TimeLogToolbar';
import { timelogList } from 'data/timelog/TimeLogData';
import TimeLogLID from './details/TimeLogLID';
import { Avatar, Button } from '@mui/material';
import { generateSplitEntryData, GetUniqueList } from 'features/common/timelog/utils';
import moment from "moment";
import { CustomGroupHeader } from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import { getAppsList,getSBSGridList,getPhaseDropdownValues} from 'features/safety/sbsmanager/operations/sbsManagerSlice';
import { setSelectedRowData, setToast, setAccess, setSplitTimeSegmentBtn, getTimeLogList,setSmartItemOptionSelected , setWorkTeamFromExt,setDriveFile } from './stores/TimeLogSlice';
import { getSource, getTimeLogDateRange, getTimeLogStatus} from 'utilities/timeLog/enums';
import CustomDateRangeFilterComp from 'components/daterange/DateRange';
import SUIClock from 'sui-components/Clock/Clock';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SplitTimeSegmentDialog from './timeSplitSegment/SplitTimeSegmentDialog';
import { getPickerDefaultTime ,getDuration,dateFunctionalities,dateFormat } from './utils';
import ManageWorkers from './workerDailog/addManageWorkers/ManageWorkers';
import {workTeamData} from "data/timelog/TimeLogData";
import CompanyIcon from "resources/images/Comapany.svg";
import  {fetchWorkTeamsData,fetchCompaniesData} from 'features/projectsettings/projectteam/operations/ptDataSlice';
import {fetchLocationswithOutIdData} from '../locationfield/LocationStore';

const TimeLogWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const iFrameId = 'timelogIframe', appType = 'TimeLog';
	
	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);

	const location = useLocation();
	const { server } = useAppSelector((state) => state.appInfo);
	const { sbsGridData, appsList } = useAppSelector((state) => state.sbsManager);
	const {companiesData,workTeams} = useAppSelector((state)=>state.projectTeamData);

	const appInfo = useAppSelector(getServer);
	const { toast, TimeLogGridList ,selectedRowData} = useAppSelector((state) => state.timeLogRequest);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>('');
	const [filters, setFilters] = useState<any>({});
	const [selectedFilters, setSelectedFilters] = useState<any>();
	const [selectedFilters2, setSelectedFilters2] = useState<any>({});
	const [search, setSearch] = useState<string>('');
	const [defaultFilters, setDefaultFilters] = useState<any>({});
	const groupKeyValue = useRef<any>(null);
	const [openManageWorkers, setOpenManageWorkers] = useState<any>(false);
	const [workTeamDataFromExt, setWorkTeamDataFromExt] = useState([]);
	// const [activeGroupKey, setActiveGroupKey] = useState<String>('');
	const [columns, setColumns] = useState([]);
	const [rowData, setRowData] = useState<Array<any>>([]);
	const [modifiedList, setModifiedList] = useState<Array<any>>([]);
	const dateTimeFields = ['startDate', 'endDate'];
	const [isFullView, setFullView] = useState(false);	
	const [smartItemLink, setSmartItemLink] = useState<any>({});
	let gridRef = useRef<AgGridReact>();
	const datesRef = useRef<any>({
		startDate: '',
		endDate: '',
	});
	const selectedFiltersRef = useRef<any>({});
	const isFromOrg = window.location.href?.includes('fromOrg');
	const { splitTimeSegmentBtn } = useAppSelector(state => state.timeLogRequest);
	const isFromPlanner = window.location.href?.includes('planner');
	const isFromFinance = window.location.href?.includes('finance');
	const isFromSafety = window.location.href?.includes('safety');
	const isFromField = window.location.href?.includes('field');
	const { locationsdata = [] } = useAppSelector(state => state.location);

	const groupOptions = [{
			text: 'Time Entry For', value: 'user', iconCls: 'common-icon-work-team'
		}, {
			text: 'Work Team', value: 'team', iconCls: 'common-icon-workteam'
		}, {
			text: 'Companies', value: 'company', iconCls: 'common-icon-filter-companies'
		}, {
			text: 'Apps', value: 'smartItem', iconCls: 'common-icon-smartapp'
		}, {
			text: 'Status', value: 'status', iconCls: 'common-icon-accept'
		}, {
			text: 'Source', value: 'source', iconCls: 'common-icon-Workactivity'
		}, {
			text: 'Created By', value: 'createdBy', iconCls: 'common-icon-created-by'
		}, {
			text: 'Timelog ID', value: 'timeLogId', iconCls: 'common-icon-timelog-id'
		}, {
			text: 'Date', value: 'startDate', iconCls: 'common-icon-DateCalendar'
		}, {
			text: 'System Breakdown Structure', value: 'sbs', iconCls: 'common-icon-filter-sbs'
		}, {
			text: 'Location', value: 'location', iconCls: 'common-icon-filter-locations'
		}
	];

	const queryParams: any = new URLSearchParams(location.search);

	/**
	 * This effect is to process the incoming query string and act accordingly
	 */
	useEffect(() => {
		// const {search} = location;
		if (queryParams?.size > 0) {
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');
			setFullView(queryParams?.get('inlineModule') === 'true');			

			if (queryParams?.get('id')) {
				//
				setManualLIDOpen(true);

				if (queryParams?.get("tab")) {
					//
				}
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

	const userImageHandleOver = useCallback((e: any, params: any) => {
        console.log(params , 'userImageHandleOver')
        const { pageX, pageY } = e;
        const { data } = params;
        const str = data?.user?.globalId.toString();
        let evtData = {
            event: "launchcontactcard",
            body: { iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType },
            data: {
                pageX: pageX,
                pageY: pageY,
                openAction: 'hover',
                userId: '',
                userIntId: ''
            }
        };
        if (data?.user?.globalId != '' && str?.substring(0, 8) != "00000000") {
            evtData.data.userId = data?.user?.globalId;
        } else if (data?.objectId && data?.objectId != '') {
            evtData.data.userIntId = data?.objectId;
        }
        let target = e.target;
        let timer = setTimeout(() => {
            postMessage(evtData);
        }, 500);
        target.addEventListener('mouseleave', function () {
            clearTimeout(timer);
        })
    }, [appInfo]);

	/**
	 * All initial APIs will be called here
	 * Grid API
	 * Dropdown APIs that supports adding a new record
	 */
	useEffect(() => {
		if (server) {
			dispatch(getAppsList());
			dispatch(getTimeLogList({}));
			dispatch(getSBSGridList());
			dispatch(fetchWorkTeamsData(server));
			dispatch(fetchCompaniesData(server));
			dispatch(fetchLocationswithOutIdData());
			dispatch(getPhaseDropdownValues());
		}
	}, [server]);


	useEffect(() => {
		if (localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setAccess('Manager'))
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
									dispatch(setDriveFile(data.data));
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
							case 'resourcepicker':
								// setWorkTeamDataFromExt(data.response)
								dispatch(setWorkTeamFromExt((data.response)));
								// setOpenManageWorkers(true);
								break;
							case "smartitemlink":
								setSmartItemLink(data);
								break;
						}
					}
				};

				postMessage({
					event: 'hostAppInfo',
					body: { iframeId: iFrameId, roomId: server && server.presenceRoomId, appType: appType }
				});
			}
		}
	}, [localhost, appData]);

	const onGroupingChange = (groupKey: any) => {
		const columnsCopy: any = [...headers];
		if (((groupKey ?? false) && groupKey !== "")) {
			groupKeyValue.current = groupKey;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = groupKey ? groupKey === col.field : false;
				setColumns(columnsCopy);
			});
		} else if (groupKey ?? true) {
			groupKeyValue.current = null;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = false;
			});
			setColumns(columnsCopy);
		}
	};

	const TimeLogGridGroupHeader = (props: any) => {
		const {iconUrl, name, color, ...rest} = props;
		return (
			<div style={{ display: 'flex' }} className='status-column'>
					{iconUrl ?
						<img
							src={iconUrl}
							alt="Avatar"
							style={{ width: "26px", height: "26px" }}
							className="base-custom-img"
						/> : <Avatar
							src={name}
							sx={{
								backgroundColor: `#${color}` ?? '#fff',
								width: "24px",
								height: "24px",
								padding: "1px",
								marginRight: '10px',
								fontSize: '13px'
							}} />
					}
					<span className="custom-group-header-label-cls">{name || ""}</span>
				</div>
		)
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props?.node;
		if (node?.group) {
			const colName = groupKeyValue?.current;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if(colName === "status") {
				const stateObject: any = (timelogStatusMap || [])?.find((x:any) => x.value == data?.[colName]);
				return (
					<div style={{display: 'flex'}} className='status-column'>
						<CustomGroupHeader iconCls={stateObject?.icon} baseCustomLine={false}
							label={stateObject?.text} showStatus = {true}
							color = {stateObject?.color} bgColor = {stateObject?.bgColor}
						/>
					</div>
				);
			}
			else if (colName === 'smartItem') return (
				<TimeLogGridGroupHeader iconUrl={data?.smartItem?.smartAppIcon} name={data?.smartItem?.name} />
			);
			else if (colName === 'company') return (
				<TimeLogGridGroupHeader iconUrl={data?.company?.url ?? CompanyIcon} name={data?.company?.name} />
			);
			else if(colName === 'createdBy') return (
				<TimeLogGridGroupHeader iconUrl={data?.createdBy?.url} name={ data?.createdBy?.firstName + ' '+data?.createdBy?.lastName} />
			);
			else if(colName === 'user')return (
				<TimeLogGridGroupHeader iconUrl={data?.user?.icon} name={data?.createdBy?.firstName + ' ' +data?.createdBy?.lastName} />
			);
			else return (
				<div className="custom-group-header-cls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
					<span className="custom-group-header-label-cls">{node?.key || ""}</span>
				</div>
			);
		};
	};

	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: true,
			suppressGroupRowsSticky: true,
			innerRenderer: GroupRowInnerRenderer
		};
	}, []);

	const defaultDateRangeState = () => {
		datesRef.current = {
			startDate: '',
			endDate: '',
		};
	};

	const updateCustomHeaderParams = useCallback((data: any) => {
		const newDefs: any = gridRef?.current?.api?.getColumnDefs()?.map((def: any) => {
			if (def?.field === "status") {
				return {
					...def,
					headerComponentParams: {
						columnName: "Status",
						options: timelogStatusMap,
						defaultFilters: data,
						onSort: handleStatusColumnSort,
						onOpen: () => setStatusFilter(false),
						onClose: () => setStatusFilter(true),
						onFilter: handleStatusFilter,
					},
				};
			}
			return def;
		});
		gridRef?.current?.api?.setColumnDefs(newDefs);
	}, []);

	const onFilterChange = (filterValues: any, type?: string) => {

		if(!_.isEqual(selectedFilters2,filterValues)){
			if (Object.keys(filterValues).length !== 0) {
				let filterObj = filterValues;
				if (selectedFilters2?.dateRange?.includes('custom') && !filterValues?.dateRange?.includes('custom')) {
					defaultDateRangeState();
				};
				Object.keys(filterObj).filter((item) => {
					if (filterObj[item]?.length === 0) {
						delete filterObj[item]
					};
					if (filterObj[item] === "" || filterObj[item] === undefined || filterObj[item] === null) {
						delete filterObj[item];
					};
				});
				if (!_.isEqual(selectedFilters2, filterObj) && Object.keys(filterObj).length > 0) {
					if (filterObj?.hasOwnProperty('status')) {
						updateCustomHeaderParams(filterObj.status);
						setSelectedFilters2(filterObj);
						dispatch(getTimeLogList(filterObj));
					};
				} else {
					if (!_.isEqual(selectedFilters2, filterObj)&& Object.keys(filterValues).length === 0) {
						defaultDateRangeState();
						if (selectedFilters2?.hasOwnProperty('status') && !filterObj?.hasOwnProperty('status')) {
							setSelectedFilters2(filterObj);
							dispatch(getTimeLogList(filterObj));
							updateCustomHeaderParams([]);
						};
					};
				}
				if(!_.isEqual(selectedFilters2, filterObj) && filterObj?.hasOwnProperty('conflicting')){
						if(filterObj['conflicting'].includes('conflictingTime')) filterObj.conflictingTime = true;
						if(filterObj['conflicting'].includes('conflictingLocations')) filterObj.conflictingLocations = true;
						if(!filterObj['conflicting'].includes('conflictingTime')) filterObj.conflictingTime = false;
						if(!filterObj['conflicting'].includes('conflictingLocations')) filterObj.conflictingLocations = false;
						setSelectedFilters2(filterObj);
						dispatch(getTimeLogList(filterObj));
				}
				if(!filterObj?.hasOwnProperty('conflicting') && (filterObj?.hasOwnProperty('conflictingTime') || filterObj?.hasOwnProperty('conflictingLocations'))){
				  delete 	filterObj.conflictingTime
					delete filterObj.conflictingLocations
					setSelectedFilters2(filterObj);
					dispatch(getTimeLogList(filterObj));
				}
				if(!_.isEqual(selectedFilters2, filterObj) && filterObj?.hasOwnProperty('dateRange')){
							setSelectedFilters2(filterObj);
							const todaydate : any = dateFunctionalities(filterObj.dateRange);
							const data = {...filterObj , dateRange : todaydate}
							dispatch(getTimeLogList(data));
				}
				else{
					if(!_.isEqual(selectedFilters2, filterObj)){
						setSelectedFilters2(filterObj);
						dispatch(getTimeLogList(filterObj));
					}
				}
			} 
			else {
				if (Object.keys(filterValues).length === 0) {
					setSelectedFilters2(filterValues);
					dispatch(getTimeLogList(filterValues));
					defaultDateRangeState();
					if (selectedFilters?.hasOwnProperty('status') && !filterValues?.hasOwnProperty('status')) {
						updateCustomHeaderParams([]);
					};
				};
			};
		}
	};

	const onGridSearch = (searchText: any) => {
		setSearch(searchText);
	};

	const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(search, "gi");
			const searchVal = Object.keys(item).some((field) => {
				if (Array.isArray(item[field])) {
					if (item[field]?.length > 0) {
						for (let i = 0; i < item[field].length; i++) {
							return Object.keys(item?.[field]?.[i])?.some((objField) => {
								return item?.[field]?.[i]?.[objField]?.toString()?.match(regex);
							});
						}
					} else return false;
				} else if ((item[field] ?? false) && typeof item[field] === "object") {
					return Object.keys(item?.[field])?.some((objField) => {
						return item?.[field]?.[objField]?.toString()?.match(regex);
					});
				} else return item?.[field]?.toString()?.match(regex);
			});
			let filterValues = { ...selectedFilters };
			selectedFiltersRef.current = selectedFilters;
			if (filterValues?.dateRange?.includes("custom")) {
				let dateRange = filterValues?.dateRange?.filter((item: any) => !item.includes('custom'));
				filterValues.dateRange = dateRange;
			};
			const filterVal = (_.isEmpty(filterValues) || (!_.isEmpty(filterValues)
				&& (_.isEmpty(filterValues?.apps) || filterValues?.apps?.length === 0 || filterValues?.apps?.indexOf(item.smartItem.name) > -1)
				&& (_.isEmpty(filterValues?.companies) || filterValues?.companies?.length === 0 || filterValues?.companies?.indexOf(item.company.name) > -1)
				&& (_.isEmpty(filterValues?.conflicting) || filterValues?.conflicting?.length === 0 || filterValues?.conflicting?.indexOf(item?.conflicting)) > -1)
				&& (_.isEmpty(filterValues?.createdBy) || filterValues?.createdBy?.length === 0 || filterValues?.createdBy?.indexOf(item.createdBy?.name) > -1)
				&& (_.isEmpty(filterValues?.location) || filterValues?.location?.length === 0 || filterValues?.location?.indexOf(item?.location)) > -1)
				&& (_.isEmpty(filterValues?.sbs) || filterValues?.sbs?.length === 0 || filterValues?.sbs?.indexOf(item.sbs) > -1)
				&& (_.isEmpty(filterValues?.timeEntryFor) || filterValues?.timeEntryFor?.length === 0 || filterValues?.timeEntryFor?.indexOf(item.user.ID) > -1)
				&& (_.isEmpty(filterValues?.source) || filterValues?.source?.length === 0 || filterValues?.source?.indexOf(item?.source?.toString()) > -1)
				&& (_.isEmpty(filterValues?.team) || filterValues?.team?.length === 0 || filterValues?.team?.indexOf(item?.team) > -1)
				&& (_.isEmpty(filterValues?.status) || filterValues?.status?.length === 0 || filterValues?.status?.indexOf(item?.status?.toString()) > -1)
				&& (_.isEmpty(filterValues?.dateRange) || filterValues?.dateRange?.length === 0 || item?.dateRange === 'custom' ? false : filterValues?.dateRange?.indexOf(item?.dateRange)) > -1;
			const orgFilters = isFromOrg 
				&& (_.isEmpty(filterValues) || (!_.isEmpty(filterValues) 
				&& (_.isEmpty(filterValues?.project) || filterValues?.project?.length === 0 || filterValues?.project?.indexOf(item.project) > -1)
				&& (_.isEmpty(filterValues?.region) || filterValues?.region?.length === 0 || filterValues?.region?.indexOf(item.region) > -1)
				&& (_.isEmpty(filterValues?.orgLocation) || filterValues?.orgLocation?.length === 0 || filterValues?.orgLocation?.indexOf(item.orgLocation) > -1)
				&& (_.isEmpty(filterValues?.orgProfile) || filterValues?.orgProfile?.length === 0 || filterValues?.orgProfile?.indexOf(item.orgProfile) > -1)
			));
			const filterDates = moment(item.endDate).isBetween(moment(datesRef?.current?.startDate), moment(datesRef?.current?.endDate));
			if (!_.values(datesRef.current).every(_.isEmpty)) return searchVal && isFromOrg ? (orgFilters && filterVal) : filterVal && filterDates;
			else return searchVal && (isFromOrg ? (orgFilters && filterVal) : filterVal);
		});
	};

	useEffect(() => {
		if (search) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [search]);

	const handleStatusFilter = (statusFilters: any) => {
		setSelectedFilters((prevFilters: any) => {
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

	const handleApplyDatesFilter = (dates: any) => {
		
		var from = dates?.startDate?.split('/');
		var to = dates?.endDate?.split('/');
		var day = from[1]; var frommonth = from[0]; var fromyear = from[2];
		var day1 = to[1];var tomonth = to[0];var toyear = to[2];
		
		var fromDate = new Date(fromyear, frommonth - 1, day);
		var toDate = new Date(toyear, tomonth - 1, day1);
		const date = {from : dateFormat(fromDate),to:dateFormat(toDate)}
		const data = {...selectedFilters2 , dateRange : date};
		dispatch(getTimeLogList(data));

		if (!!selectedFiltersRef?.current?.dateRange) {
			//setSelectedFilters({ ...selectedFiltersRef?.current, ['dateRange']: [...selectedFiltersRef?.current?.dateRange, 'custom'] });
		} else {
			//setSelectedFilters({ ...selectedFiltersRef?.current, ['dateRange']: ['custom'] });
		};
		datesRef.current = dates;
		dispatch(setCustomDatesRange(dates));
	
	};

	const handleClearDatesFilter = () => {
		let filtersCopy = selectedFiltersRef?.current;
		setSelectedFilters((filtersCopy?.dateRange || [])?.filter((x: any) => !['custom', 'all'].includes(x)));
		defaultDateRangeState();
		dispatch(setCustomDatesRange(datesRef.current));
	};

	const onDataChange = (fieldName: string, time: any, rowIndex?: any) => {

	};

	const handelAddSelect = (isOpen: boolean) => {
		setOpenManageWorkers(isOpen);		
	};

	// Function to check for time overlap or location mismatch

	/**
	 * Grid data is set in this method
	 * 
	 * Search, Filters are applied to the source data and the result
	 * is set to the local state
	 */
	const customCellRendererClass = (params: any) => {
		const { data } = params;
		return (
			<>
				{!params?.node?.footer &&
					<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', position: 'absolute', left: '4px' }}>
						{getTimeLogStatus(data?.status) == 'In Progress' && <span className='timer-animation' style={{ fontSize: '1.8em' }}></span>}
						{data?.hasTimeOverlap == true && <IQTooltip
							title={
								<Stack direction='row' className='tooltipcontent'>
									<p className='tooltiptext'>There seems to be duplicate or an overlapping time entry.</p>
								</Stack>}
							placement={'bottom'}
							arrow={true}
						>
							<span className='common-icon-exclamation hand-pointer' style={{ color: 'red', fontSize: '1.8em' }} />
						</IQTooltip>}

						{data?.hasLocationConflict == true && <IQTooltip
							title={
								<Stack direction='row' className='tooltipcontent'>
									<p className='tooltiptext'>This Time was not entered anywhere within the Job Location.</p>
								</Stack>}
							placement={'bottom'}
							arrow={true}
						>
							<span className='common-icon-exclamation hand-pointer' style={{ color: 'red', fontSize: '1.8em' }} />
						</IQTooltip>}

						{ data?.hasOwnProperty('splitFromSegmentId') && data?.splitFromSegmentId !== null ?
							<IQTooltip
								title={
									<Stack direction='row' className='tooltipcontent'>
										<p className='tooltiptext'>The Split Time entry was Created from the orignal Time Segment ID: {data?.timeSegmentId}.</p>
									</Stack>}
								placement={'bottom'}
								arrow={true}
							>
								<span className='common-icon-sku hand-pointer' style={{ color: '#fa8b59', fontSize: '1.8em' }} />
							</IQTooltip> : <></>
						}

					</div>
				}
				<div className='blue-color'>
					{data?.timeSegmentId}
				</div>
			</>
		)
	};

	const CustomDateSorting = (valueA: any, valueB: any, nodeA: any, nodeB: any, order: any) => {
		const a = valueA && new Date(valueA).getTime();
		const b = valueB && new Date(valueB).getTime();

		if (a == null && b == null) return 0;

		if (a == null) return -1;
		else if (b == null) return 1;

		return a - b;
	};

	const headers: any = useMemo(() => [
		{
			headerName: 'Date Range',
			field: 'dateRange',
			hide : true	,
			keyCreator : (params:any) => getTimeLogDateRange(params.data.dateRange)
		},
		{
			headerName: 'Time Segment ID',
			field: 'timeSegmentId',
			pinned: 'left',
			width: 220,
			suppressMenu: true,
			checkboxSelection: (params: any) => {
				if (!!params?.node?.footer) return false;
				else return true;
			},
			headerCheckboxSelection: true,
			cellRenderer: (params: any) => customCellRendererClass(params),
		}, {
			headerName: 'Status',
			field: 'status',
			pinned: 'left',
			width: 160,
			cellClass: 'status-column',
			headerClass: 'custom-filter-header',
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: 'Status',
				options: timelogStatusMap,
				onSort: handleStatusColumnSort,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			keyCreator: (params: any) => getTimeLogStatus(params?.data?.status),
			cellRenderer: (params: any) => {
				const stateObject: any = (timelogStatusMap || [])?.find((x: any) => x.value === params?.value?.toString());
				return <div
					className='status'
					style={{
						color: stateObject?.color,
						backgroundColor: stateObject?.bgColor
					}}
				>
					<span className={`status-icon ${stateObject?.icon}`}></span> {stateObject?.text}{' '}
				</div>;
			}
		}, {
			headerName: 'Time Entry For',
			field: 'user',
			width: 280,
			pinned: 'left',
			// aggFunc: (params: any) => {
			// 	if (!params.rowNode?.key) {
			// 		return 'Summary';
			// 	} return `Sub Total - ${params.rowNode?.key}`;
			// },
			keyCreator: (params: any) =>  params.data?.user && params.data?.user?.firstName  ? params.data?.user?.firstName + ' '+params.data?.user?.lastName : '' || "None",
			cellRenderer: (params: any) => {
				if (!!params?.node?.footer) {
				  if (!params.node?.key) {
					return "Summary";
				  }
				  return `Sub Total - ${params.node?.key}`;
				} else {
				  return (
					<span onMouseOver={(e: any) => {userImageHandleOver(e, params);}}>
					  { params.data?.user && params.data?.user?.firstName  ? params.data?.user?.firstName + ' '+params.data?.user?.lastName : ''}
					</span>
				  );
				}
			  },
		},
		{
			headerName: 'Project',
			field: 'project',
			width: 280,
			hide: !isFromOrg,
			pinned: 'left',
			
		},
		{
			headerName: 'Region',
			field: 'region',
			hide: !isFromOrg,
		},
		{
			headerName: 'ORG Location',
			field: 'orgLocation',
			width: 280,
			hide: !isFromOrg,
		},
		{
			headerName: 'Company',
			field: 'company',
			valueGetter: (params: any) => params.data?.company?.name,
			keyCreator: (params: any) => params.data?.company?.name || "None"
		}, {
			headerName: 'Start Date',
			field: 'startDate',
			sort:'desc',
			comparator : CustomDateSorting,
			valueGetter: (params: any) => params.data ? moment.utc(params?.data?.startDate).format('MM/DD/YYYY') : '',	
			keyCreator: (params: any) => {
				return moment.utc(params?.data?.startDate).format('MM/DD/YYYY')  + " " + (params?.data.dateRange ? (`(${getTimeLogDateRange(params.data.dateRange)})`) : '') || "None" ;
				// return moment.utc(params?.data?.endDate).format('MM/DD/YYYY') + " " + (`(${getTimeLogDateRange(params.data.dateRange)})`) || "None";
			}
		}, {
			headerName: 'End Date',
			field: 'endDate',
			comparator : CustomDateSorting,
			valueGetter: (params: any) => params.data ? formatDate(params.data?.endDate) : '',				
		}, {
			headerName: 'Start Time',
			field: 'startTime',
			cellRenderer: (params: any) => {
				let status = ['0','2'];
				return params?.data ? (
					<SUIClock
						onTimeSelection={(value: any) => {
							onDataChange("startTime", getTime(value));
						}}
						disabled={(status.includes(params?.data?.status?.toString()))}
						defaultTime={getTime(params?.data?.startTime) || ""}
						pickerDefaultTime={getTime(params?.data?.startTime)}
						placeholder={"HH:MM"}
						// actions={[]}
						ampmInClock={true}
					></SUIClock>
				) : null
			},
		}, {
			headerName: 'End Time',
			field: 'endTime',
			cellRenderer: (params: any) => {
				let status = ['0','2'];
				return params?.data ? (
					<SUIClock
						onTimeSelection={(value: any) => {
							onDataChange("endTime", getTime(value));
						}}
						disabled={(status.includes(params?.data?.status?.toString()))}
						defaultTime={getTime(params?.data?.endTime) || ''}
						pickerDefaultTime={getTime(params?.data?.endTime)}
						placeholder={"HH:MM"}
						// actions={[]}
						ampmInClock={true}
					></SUIClock>
				) : null
			},
		}, {
			headerName: 'Duration',
			field: 'duration',
			valueGetter: (params: any) => params?.data?.duration,
			aggFunc: 'sum',
			cellRenderer: (params: any) => {
				return getDuration(params?.value)
			}
		
		}, {
			headerName: 'Source',
			field: 'source',
			valueGetter: (params: any) => params.data && getSource(params.data?.source),
			keyCreator: (params: any) =>  params.data ? getSource(params.data?.source)  : "None"
		}, {
			headerName: 'Created By',
			field: 'createdBy',
			valueGetter: (params: any) => `${params.data?.createdBy?.firstName ? params.data?.createdBy?.firstName : ''} ${params.data?.createdBy?.lastName ? params.data?.createdBy?.lastName : ''}`,
			keyCreator: (params: any) => params.data?.createdBy?.firstName || "None"
		}, {
			headerName: 'Smart Item',
			field: 'smartItem',
			cellStyle: {color: "#059cdf",cursor:'pointer'},
			onCellClicked: (event: any) => {
				if (event.data?.id) {
					postMessage({ event: 'openitem', body: { smartItemId: event.data?.smartItem?.id } });
				}
			},
			valueGetter: (params: any) => params.data?.smartItem?.name,
			keyCreator: (params: any) => params.data?.smartItem?.name || "None"
		}, {
			headerName: 'Work Team',
			field: 'team',
			valueGetter: (params: any) => params.data?.team?.name,
			keyCreator: (params: any) => params.data?.team?.name || "None"
		}, {
			headerName: 'Location',
			field: 'location',
			valueGetter: (params: any) => params.data?.location?.name,
			keyCreator: (params: any) => params.data?.location?.name || "None"
		}, {
			headerName: 'System Breakdown Structure',
			field: 'sbs',
			valueGetter: (params: any) => params.data?.sbs?.name,
		}, {
			headerName: 'Phase',
			field: 'sbsPhase',
			keyCreator: (params: any) => params.data?.sbsPhase?.name || "None",
			minWidth: 260,
			cellRenderer: (params: any) => {
				const phase = params.data?.sbsPhase?.name;
				const buttonStyle = {
					backgroundColor: "blue",
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
		}, {
			headerName: 'Time Log ID',
			field: 'timeLogId',
			keyCreator: (params: any) => params?.data?.timeLogId || "None"
		}], [server, selectedFilters]);

	(headers || [])?.forEach((item: any) => {
		if (dateTimeFields?.includes(item?.field)) {
			item.cellRenderer = (params: any) => {
				if (!!params?.node?.footer) return null;
				else return (
					<>{moment.utc(params?.value).format('MM/DD/YYYY')}</>
				);
			}
		};
	});

	let filterOptions = useMemo(() => {
		var filterMenu = [{
			text: 'Time Entry For',
			value: 'user',
			key: 'user',
			keyValue: 'user',
			children: { type: "checkbox", items: [] }
		}, {
			text: 'Work Team',
			value: 'workTeams',
			key: 'workTeams',
			keyValue: 'workTeams',
			children: { type: "checkbox", items: [] }
		}, {
			text: 'Companies',
			value: 'companies',
			key: 'companies',
			keyValue: 'companies',
			children: { type: "checkbox", items: [] }
		}, {
			text: 'Apps',
			value: 'apps',
			key: 'smartItem',
			keyValue: 'smartItem',
			children: { type: "checkbox", items: [] }
		}, {
			text: 'Status',
			value: 'status',
			key: 'status',
			keyValue: 'status',
			children: {
				type: 'checkbox',
				items: timelogStatusMap
			}
		}, {
			text: 'Source',
			value: 'source',
			key: 'source',
			keyValue: 'source',
			children: { type: "checkbox", items: timelogSourceMap }
		}, {
			text: 'Created By',
			value: 'createdBy',
			key: 'createdBy',
			keyValue: 'createdBy',
			children: { type: "checkbox", items: [] }
		},
		// {
		// 	text: 'Users',
		// 	value: 'user',
		// 	key: 'user',
		// 	keyValue: 'user',
		// 	children: { type: "checkbox", items: [] }
		// },
		 {
			text: 'Conflicting Time Entries',
			value: 'conflicting',
			key: 'conflicting',
			keyValue: 'conflicting',
			children: {
				type: 'checkbox',
				items: [{
					text: 'Conflicting Time',
					key: 'conflictingTime',
					value: 'conflictingTime'
				}, {
					text: 'Conflicting Locations',
					key: 'conflictingLocations',
					value: 'conflictingLocations'
				}]
			}
		},  {
			text: 'Date Range',
			value: 'dateRange',
			key: 'dateRange',
			keyValue: 'dateRange',
			children: {
				type: 'radio',
				items: [{
					text: 'Today',
					key: 'today',
					value: 'today'
				}, {
					text: 'Yesterday',
					key: 'yesterday',
					value: 'yesterday'
				}, {
					text: 'This Week',
					key: 'thisWeek',
					value: 'thisWeek'
				}, {
					text: 'Last Week',
					key: 'lastWeek',
					value: 'lastWeek'
				}, {
					text: 'This Month',
					key: 'thisMonth',
					value: 'thisMonth'
				}, {
					text: 'Last Month',
					key: 'lastMonth',
					value: 'lastMonth'
				}, {
					text: 'Future',
					key: 'future',
					value: 'future'
				}, {
					text: "Custom",
					value: "custom",
					key: "custom",
					keyValue: "custom",
					children: {
						type: "custom",
						component: <CustomDateRangeFilterComp
							dates={{
								startDate: datesRef?.current?.startDate ?? selectedFilters?.dateRange?.startDate,
								endDate: datesRef?.current?.endDate ?? selectedFilters?.dateRange?.endDate,
							}}
							handleApplyDatesFilter={handleApplyDatesFilter}
							handleClearDatesFilter={handleClearDatesFilter}
						/>,
						items: [{}],
					}
				}]
			}
		}, {
			text: 'System Breakdown Structure',
			value: 'sbs',
			key: 'sbs',
			keyValue: 'sbs',
			children: { type: "checkbox", items: [] }
		}, {
			text: 'Location',
			value: 'location',
			key: 'location',
			keyValue: 'location',
			children: { type: "checkbox", items: [] }
		},
		{
			text: 'Projects',
			value: 'project',
			key: 'project',
			keyValue: 'project',
			hidden : !isFromOrg,
			children: { type: "checkbox", items: [] }
		},
		{
			text: 'Regions',
			value: 'region',
			key: 'region',
			keyValue: 'region',
			hidden : !isFromOrg,
			children: { type: "checkbox", items: [] }
		},
		{
			text: 'Org Locations',
			value: 'orgLocation',
			key: 'orgLocation',
			keyValue: 'orgLocation',
			hidden : !isFromOrg,
			children: { type: "checkbox", items: [] }
		},
		{
			text: 'Org Profiles',
			value: 'orgProfile',
			key: 'orgProfile',
			keyValue: 'orgProfile',
			hidden : !isFromOrg,
			children: { type: "checkbox", items: [] }
		}
		];
		return filterMenu;
	}, []);


	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: iFrameId, roomId: server && server.presenceRoomId, appType: appType }
		});
	};

	const rowSelected = (rowNodes: any) => {
		dispatch(setSelectedRowData(rowNodes));
	};

	const handleIconClick = () => {
		if (isInline) useHomeNavigation(iFrameId, appType);
	};

	const onFirstDataRendered = useCallback((params: any) => {
		gridRef.current = params;
		setColumns(headers);
	}, []);

	useEffect(() => {
		if (search || filters) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [search, filters]);

	const findAndUpdateFiltersData = (filterOptions: any,data: any,key: string, keyValue?:any ,nested?: boolean,nestedKeyFirstText?: any,nestedKeySecondText?:any,nestedkeyValue?:any) => {
		const formattedData = data?.map((rec: any) => {
		 	if (nested){
				if( rec?.[key]?.[nestedKeySecondText] != null && rec?.[key]?.[nestedKeyFirstText] != null ){
					return {
						text: rec?.[key]?.[nestedKeySecondText] != "" ? rec?.[key]?.[nestedKeyFirstText] + ' ' + rec?.[key]?.[nestedKeySecondText] : rec?.[key]?.[nestedKeyFirstText],
						value: rec?.[key]?.[nestedkeyValue]?.toString(),
						id: rec?.[key]?.id?.toString(),
					};
				}
			}
			else{
				return {
					text: rec?.[key] ?? rec?.["name"],
					value: rec?.[keyValue]?.toString() ?? rec?.["name"],
					id: rec?.id?.toString(),
				};
			}
		});
		const filtersCopy: any = [...filterOptions];
		let currentItem: any = filtersCopy.find((rec: any) => rec?.keyValue === key);
		currentItem.children.items = GetUniqueList(formattedData?.flat(), "text");
		let mapData = [...filterOptions].map((item: any) => {
			if (item.key === currentItem.key) return currentItem;
			else return item;
		});
		return mapData;
	};

	useMemo(()=>{
		if (sbsGridData?.length > 0 && filterOptions) {
			const updatedarray = sbsGridData.map((res:any) => { return{ ...res , ['sbs'] : res.name }});
			setFilters(findAndUpdateFiltersData(filterOptions, updatedarray,"sbs","uniqueid"));
		}
	},[sbsGridData]);

	useMemo(() => {
		if (appsList?.length > 0 && filterOptions) {
			const updatedarray = appsList.map((res:any) => { return{ ...res , ['apps'] : res.displayField }});
			setFilters(findAndUpdateFiltersData(filterOptions, updatedarray,"smartItem","objectId"));
		}
	}, [appsList]);

	useMemo(() => {
		if (workTeams?.length > 0 && filterOptions) {
			const updatedarray = workTeams.map((res:any) => { return{ ...res , ['workTeams'] : res.name }});
		  setFilters(findAndUpdateFiltersData(filterOptions,updatedarray, 'workTeams', "id"))
		}
	}, [workTeams]);

	useMemo(() => {
		if (companiesData?.length > 0 && filterOptions) {
			const updatedarray = companiesData.map((res:any) => { return{ ...res , ['companies'] : res.name }});
			setFilters(findAndUpdateFiltersData(filterOptions,updatedarray, 'companies', "uniqueId"))
		}
	}, [companiesData]);

	useMemo(() => {
		if (locationsdata?.length > 0 && filterOptions) {
			const updatedarray = locationsdata.map((res:any) => { return{ ...res , ['location'] : res.text }});
			setFilters(findAndUpdateFiltersData(filterOptions,updatedarray, 'location', "uniqueId"))
		}
	}, [locationsdata]);
	
	const GenerateFilters = () => {

		setFilters(findAndUpdateFiltersData(filterOptions, TimeLogGridList, "user","",true,"firstName" ,'lastName',"ID"));
		setFilters(findAndUpdateFiltersData(filterOptions, TimeLogGridList, "createdBy", "", true, "firstName" ,'lastName',"ID"));
		if(isFromOrg) {
			setFilters(findAndUpdateFiltersData(filterOptions, TimeLogGridList, "orgLocation"));
			setFilters(findAndUpdateFiltersData(filterOptions, TimeLogGridList, "orgProfile"));
			setFilters(findAndUpdateFiltersData(filterOptions, TimeLogGridList, "region"));
			setFilters(findAndUpdateFiltersData(filterOptions, TimeLogGridList, "project"));
		};
	};

	const GetDateRangeFilterData = (data: any) => {
		const todayDate = new Date();

		const todayStart = moment.utc().startOf('day');
		const todayEnd = moment.utc().endOf('day');
		const yesterdayStart = moment.utc().subtract(1, 'days').startOf('day');
		const yesterdayEnd = moment.utc().subtract(1, 'days').endOf('day');
		const actualDate = moment.utc(data?.startDate);

		// if(moment.utc(actualDate).isAfter(todayEnd)) return 'future';

		if (moment.utc(actualDate).isBetween(todayStart, todayEnd)) return 'today';
		else if (moment.utc(actualDate).isBetween(yesterdayStart, yesterdayEnd)) return 'yesterday';
		else return null

	};


	React.useEffect(() => {
		if (TimeLogGridList.length > 0) {

			let data = TimeLogGridList.map((item: any, index: any) => ({
				...item,
				dateRange: GetDateRangeFilterData(item),
			}));
			setRowData(data);
			setModifiedList(data);
			GenerateFilters();
		} else if (TimeLogGridList.length === 0) {
			setModifiedList([]);
			setRowData([]);
			GenerateFilters();
		}
	}, [TimeLogGridList]);

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	const handleSplit = (data:any) => {
		let segments:any = [];
		(Object.values(data)?.filter((x:any) => typeof(x) !== 'string') || [])?.forEach((element:any) => {
				segments.push({
					startTime : element.startTime,
					endTime : element.endTime,
					userId : ''
				})
		});
		let payload = {
			segments : segments,
			splitSegmentId : ''
		};
		console.log("Split Time Log Data", payload);
	};

	const saveSmartItemLink = (smartData: any) => {
		let smartname = smartData?.hasOwnProperty('smartItemName') ? smartData?.smartItemName : 'New' + ' ' + smartData?.body?.data?.Text;	
			let details = {
				id: smartData?.smartItemId,	
				value: smartData?.smartItemId,	
				name: smartname,
			}
			console.log('details',details)
			dispatch(setSmartItemOptionSelected(details));
			setSmartItemLink({});
	};
	
	useEffect(() => {
		if (Object.keys(smartItemLink).length) {
			console.log('smartItemLink',smartItemLink)
			saveSmartItemLink(smartItemLink);
		}
	}, [smartItemLink]);
	
	return (
		server && <> <GridWindow
			open={true}
			title={isFromOrg ? `Time Log (${TimeLogGridList?.length})` : 'Time Log'}
			className='time-log-window'
			iconCls={isInline ? isFromOrg ? 'common-icon-home org' : isFromPlanner ? 'common-icon-home planner' : isFromFinance ? 'common-icon-home finance' : isFromField ? 'common-icon-home field' : isFromSafety ? 'common-icon-home safety' : 'common-icon-home' : ''}
			appType={appType}
			commonModule={true}
			centerPiece={
				(isFromOrg && <>{`Displaying Time Entries for the projects associated to the selected Profile.`}</>)
			}
			rightSideText={(isFromOrg && <div className="active-profile-cls">
				<span className="label-cls">Active Profile: </span>
				<span className="org-master">{server?.orgData?.profileName}</span>
				<span className="label-cls">Org ID: </span>
				<span className="org-id" onClick={() => {
					postMessage({
						event: 'org-click',
						// body: {},
					})
				}}>{server?.orgData?.orgID}</span>
			</div>)}
			appInfo={server}
			iFrameId={iFrameId}
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
				presenceId: isFromOrg ? '' : 'timelog-presence',
				showBrena: false,
				showLiveSupport: !isFromOrg,
				showLiveLink: !isFromOrg,
				showStreams: !isFromOrg,
				showComments: !isFromOrg,
				showChat: false,
				hideProfile: false,
			}}
			righPanelPresenceProps={{
				presenceId: "timelog-presence",
				showLiveSupport: true,
				showStreams: true,
				showPrint: true,
			}}
			tools={{
				closable: !isFromOrg,
				resizable: !isFromOrg,
				openInNewTab: !isFromOrg
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
				showPinned: isFromOrg ? false : true,
				pinned: isFromOrg ? false : true,
				headContent: { regularContent: !isFromOrg && <AddTimeLogForm /> },
				detailView: TimeLogLID,
				gridContainer: {
					toolbar: {
						leftItems: <TLLeftButtons />,
						rightItems: <TLRightButtons />, 
						searchComponent: {
							show: true,
							type: 'regular',
							defaultFilters: defaultFilters,
							groupOptions: groupOptions,
							filterOptions: filters,//isFromOrg ? [...filterOptions, ...orgConsoleFilters] : [...filterOptions],
							onGroupChange: onGroupingChange,
							onSearchChange: onGridSearch,
							onFilterChange: onFilterChange,
							defaultGroups: "startDate"
						}
					},
					grid: {
						headers: columns,
						data: rowData,
						getRowId: (params: any) => params.data?.id,
						rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						emptyMsg: 'No items available yet',
						nowRowsMsg: '<div>create new time log entries from above</div>',
						groupRowRendererParams: groupRowRendererParams,
						onFirstDataRendered: onFirstDataRendered,
						groupIncludeTotalFooter: true,
						groupIncludeFooter: true,
						groupSelectsChildren: true,
						rowSelection: "multiple",
						groupDefaultExpanded: 1,
						grouped: true
					}
				}
			}}
		/>
		{splitTimeSegmentBtn && (
			<SplitTimeSegmentDialog defaultRowData= {generateSplitEntryData(selectedRowData?.[0])} data={selectedRowData?.[0]} handleSubmit={(data:any) => handleSplit(data)}onClose={() => dispatch(setSplitTimeSegmentBtn(false))} />
		)}
		{openManageWorkers ? (
			<ManageWorkers
				workerData={workTeamData}
				onClose={() => handelAddSelect(false)}
			/>
			) : (
			<></>
			)}
		</>
		// : <SUIAlert
		// 		open={true}
		// 		DailogClose={true}
		// 		onClose={() => {
		// 			postMessage({
		// 				event: 'closeiframe',
		// 				body: {iframeId: 'changeEventRequestIframe', roomId: server && server?.presenceRoomId, appType: 'ChangeEventRequests'}
		// 			});
		// 		}}
		// 		contentText={'You Are Not Authorized'}
		// 		title={'Warning'}
		// 		onAction={(e: any, type: string) => {
		// 			type == 'close' && postMessage({
		// 				event: 'closeiframe',
		// 				body: {iframeId: 'changeEventRequestIframe', roomId: server && server?.presenceRoomId, appType: 'ChangeEventRequests'}
		// 			});
		// 		}}
		// 		showActions={false}
		// 	/>
	);
};

export default memo(TimeLogWindow);