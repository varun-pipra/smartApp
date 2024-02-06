import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import './TimeLogWindow.scss';

import { setCurrencySymbol, setCustomDatesRange, setServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector, useHomeNavigation } from 'app/hooks';
import { currency, isLocalhost, postMessage } from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import { appInfoData } from 'data/appInfo';
import _ from 'lodash';
import { memo, useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getTime, triggerEvent } from 'utilities/commonFunctions';
import SUIAlert from 'sui-components/Alert/Alert';
import AddTimeLogForm from './AddTimeLogForm';
import { timelogStatusMap } from './TimeLogConstants';
import CustomFilterHeader from '../gridHelper/CustomFilterHeader';
import { TLLeftButtons, TLRightButtons } from './toolbar/TimeLogToolbar';
import { timelogList } from 'data/timelog/TimeLogData';
import TimeLogLID from './details/TimeLogLID';
import { Avatar, Button } from '@mui/material';
import { findAndUpdateFiltersData } from 'features/safety/sbsmanager/utils';
import moment from "moment";
import { CustomGroupHeader } from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import { getAppsList } from 'features/safety/sbsmanager/operations/sbsManagerSlice';
import { setSelectedTimeLog } from './stores/TimeLogSlice';
import { getTimeLogDateRange, getTimeLogStatus } from 'utilities/timeLog/enums';
import CustomDateRangeFilterComp from 'components/daterange/DateRange';
import SUIClock from 'sui-components/Clock/Clock';

let defaultTimeLogStatusFilter: any = [];

const TimeLogWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const iFrameId = 'timelogIframe', appType = 'TimeLog';

	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);

	const location = useLocation();
	const { server } = useAppSelector((state) => state.appInfo);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>('');
	const [filters, setFilters] = useState<any>({});
	const [selectedFilters, setSelectedFilters] = useState<any>();
	const [search, setSearch] = useState<string>('');
	const [defaultFilters, setDefaultFilters] = useState<any>({});
	const groupKeyValue = useRef<any>(null);
	// const [activeGroupKey, setActiveGroupKey] = useState<String>('');
	const [columns, setColumns] = useState([]);
	const [rowData, setRowData] = useState<Array<any>>([]);
	const [modifiedList, setModifiedList] = useState<Array<any>>([]);
	const dateTimeFields = ['startDate', 'endDate'];
	let gridRef = useRef<AgGridReact>();
	const datesRef = useRef<any>({
		startDate : '',
		endDate : '',
	});
	const selectedFiltersRef = useRef<any>({});
	if (statusFilter) defaultTimeLogStatusFilter = filters.status;

	const groupOptions = [{
		text: 'Users', value: 'users'
	}, {
		text: 'Work Team', value: 'workTeam'
	}, {
		text: 'Companies', value: 'company'
	}, {
		text: 'Apps', value: 'smartItem'
	}, {
		text: 'Status', value: 'status'
	}, {
		text: 'Source', value: 'source'
	}, {
		text: 'Created By', value: 'createdBy'
	}, {
		text: 'Timelog ID', value: 'timeLogId'
	}, {
		text: 'Date', value: 'startDate'
	}, {
		text: 'System Breakdown Structure', value: 'sbs'
	}, {
		text: 'Location', value: 'location'
	}];

	// const tabEnum: any = {
	// 	details: 'change-Event-Details',
	// 	lineItems: 'budget-line-items',
	// 	referencefiles: 'reference-files',
	// 	links: 'links'
	// };

	const queryParams: any = new URLSearchParams(location.search);

	/**
	 * This effect is to process the incoming query string and act accordingly
	 */
	useEffect(() => {
		// const {search} = location;
		if (queryParams?.size > 0) {
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');

			if (queryParams?.get('id')) {
				//
				setManualLIDOpen(true);

				if (queryParams?.get("tab")) {
					//
				}
			}
		}
	}, []);

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
			dispatch(getAppsList());
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

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if (node.group) {
			const colName = groupKeyValue?.current;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if (colName === 'smartItem') return (
				<div style={{ display: 'flex' }} className='status-column'>
					{data?.smartItem?.iconUrl ?
						<img
							src={data?.smartItem?.iconUrl}
							alt="Avatar"
							style={{ width: "24px", height: "24px", padding: "1px" }}
							className="base-custom-img"
						/> : <Avatar
							sx={{
								backgroundColor: `#${data?.color}` ?? '#fff',
								width: "24px",
								height: "24px",
								padding: "1px",
								marginRight: '10px',
								fontSize: '13px'
							}}>{data?.smartItem?.name?.toUpperCase()}</Avatar>
					}
					<span className="custom-group-header-label-cls">{data?.smartItem?.name || ""}</span>
				</div>
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
			startDate : '',
			endDate : '',
		};
	};
	const onFilterChange = (filterValues: any, type?: string) => {
		if (Object.keys(filterValues).length !== 0) {
			let filterObj = filterValues;
			if(selectedFilters?.dateRange?.includes('custom') && !filterValues?.dateRange?.includes('custom')) {
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
			if (!_.isEqual(selectedFilters, filterObj) && Object.keys(filterObj).length > 0) {
				setSelectedFilters(filterObj);
			} else {
				if (!_.isEqual(selectedFilters, filterObj)
					&& Object.keys(filterValues).length === 0) {
						setSelectedFilters(filterObj);
						defaultDateRangeState();
				};
			}
		} else {
			 if (Object.keys(filterValues).length === 0) {
				setSelectedFilters(filterValues);
				defaultDateRangeState();
			};
		};
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
			let filterValues = {...selectedFilters};
			selectedFiltersRef.current = selectedFilters;
			if(filterValues?.dateRange?.includes("custom")) {
				let dateRange = filterValues?.dateRange?.filter((item:any) => !item.includes('custom'));
				filterValues.dateRange = dateRange; 
			};
			const filterVal = (_.isEmpty(filterValues) || (!_.isEmpty(filterValues)
				&& (_.isEmpty(filterValues?.apps) || filterValues?.apps?.length === 0 || filterValues?.apps?.indexOf(item.smartItem.name) > -1)
				&& (_.isEmpty(filterValues?.companies) || filterValues?.companies?.length === 0 || filterValues?.companies?.indexOf(item.company) > -1)
				&& (_.isEmpty(filterValues?.conflicting) || filterValues?.conflicting?.length === 0 || filterValues?.conflicting?.indexOf(item?.conflicting)) > -1)
				&& (_.isEmpty(filterValues?.createdBy) || filterValues?.createdBy?.length === 0 || filterValues?.createdBy?.indexOf(item.createdBy?.name) > -1)
				&& (_.isEmpty(filterValues?.location) || filterValues?.location?.length === 0 || filterValues?.location?.indexOf(item?.location)) > -1)
				&& (_.isEmpty(filterValues?.sbs) || filterValues?.sbs?.length === 0 || filterValues?.sbs?.indexOf(item.sbs) > -1)
				&& (_.isEmpty(filterValues?.source) || filterValues?.source?.length === 0 || filterValues?.source?.indexOf(item?.source) > -1)
				&& (_.isEmpty(filterValues?.workTeam) || filterValues?.workTeam?.length === 0 || filterValues?.workTeam?.indexOf(item?.workTeam) > -1)
				&& (_.isEmpty(filterValues?.status) || filterValues?.status?.length === 0 || filterValues?.status?.indexOf(item.status) > -1)
				&& (_.isEmpty(filterValues?.dateRange) || filterValues?.dateRange?.length === 0 || item?.dateRange === 'custom' ? false : filterValues?.dateRange?.indexOf(item?.dateRange)) > -1;
				
				const filterDates = moment(item.endDate).isBetween(moment(datesRef?.current?.startDate), moment(datesRef?.current?.endDate));
				if(!_.values(datesRef.current).every(_.isEmpty)) return searchVal && filterVal && filterDates;
				else return searchVal && filterVal;
		});
	};

	useEffect(() => {
		if (search || selectedFilters) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [search, selectedFilters]);

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

	const handleApplyDatesFilter = (dates:any) => {
		if(!!selectedFiltersRef?.current?.dateRange) {
			setSelectedFilters({...selectedFiltersRef?.current, ['dateRange']: [...selectedFiltersRef?.current?.dateRange,'custom']});
		} else {
			setSelectedFilters({...selectedFiltersRef?.current, ['dateRange']: ['custom']});
		};
		datesRef.current = dates;
		dispatch(setCustomDatesRange(dates));
	};
	
	const handleClearDatesFilter = () => {
		let filtersCopy = selectedFiltersRef?.current;
		setSelectedFilters((filtersCopy?.dateRange || [])?.filter((x:any) => !['custom','all'].includes(x)));
		defaultDateRangeState();
		dispatch(setCustomDatesRange(datesRef.current));
	};
	const onDataChange = (fieldName: string, time: any, rowIndex?: any) => {
		// let updatedEntries;
		// updatedEntries[rowIndex][fieldName] = time;
		// if (fieldName === "startTime" || fieldName === "endTime") {
		//   if (
		// 	updatedEntries[rowIndex].startTime &&
		// 	updatedEntries[rowIndex].endTime
		//   ) {
		// 	const startDateTime: any = addTimeToDate(
		// 	  dateStr,
		// 	  updatedEntries[rowIndex].startTime
		// 	);
		// 	const endDateTime: any = addTimeToDate(
		// 	  dateStr,
		// 	  updatedEntries[rowIndex].endTime
		// 	);
		// 	const durationInSeconds =
		// 	  (new Date(endDateTime).getTime() -
		// 		new Date(startDateTime).getTime()) /
		// 	  1000;
		// 	  if (durationInSeconds > 0) {
		// 		updatedEntries[rowIndex].duration = durationInSeconds;
		// 	  } else {
		// 		updatedEntries[rowIndex].duration = 0;
		// 		if (fieldName === 'startTime') {
		// 		  updatedEntries[rowIndex].endTime = '';
		// 		} else {
		// 		  updatedEntries[rowIndex].startTime = '';
		// 		}
		// 	  }
			
		//   }
		// }
	  };
	  const convertTimetoDate = (date: any) => {
		if (date === "") return null;
		// let b: any = date ? dayjs(`1/1/1 ${date}`).format("HH:mm:00") : null; //checking AM or PM
		// let a: any = dayjs(new Date()).set('hour', (b?.split(":")?.[0])).set('minute', (b?.split(":")?.[1]?.split(" ")?.[0]));
		let b: any = date ? moment.utc(date).format("HH:mm:A") : null; //checking AM or PM
		let a: any = moment.utc(new Date()).set('hour', (b?.split(":")?.[0])).set('minute', (b?.split(":")?.[1]?.split(" ")?.[0]));
		return a._d;
	};
	  const getPickerDefaultTime = (time: any, incrementDecrement: any) => {
		
		let currentTime: any = convertTimetoDate(time);
		if (isNaN(currentTime)) {
		  return '';
		}
		let [hours, minutes, ampm] = time.split(/:|\s/);
		hours = parseInt(hours, 10);
			minutes = parseInt(minutes, 10);
		if (isNaN(hours) && isNaN(minutes)) {
		  return '';
		}
		if (incrementDecrement) {
						minutes += 5;
						if (minutes >= 60) {
				minutes -= 60;
				hours = (hours + 1) % 12;
						}
		} else {
			  minutes -= 5;
						if (minutes < 0) {
				minutes += 60;
				hours = (hours - 1 + 12) % 12;
						}
		}
		// Format the new time
		hours = hours === 0 ? 12 : hours; // Handle midnight (0 hours)
		if (hours === 12 && minutes === 0) {
		ampm = ampm?.toLowerCase() === "am" ? "PM" : "AM";
		}
		let newTime = `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
		return newTime;
	  }
	/**
	 * Grid data is set in this method
	 * 
	 * Search, Filters are applied to the source data and the result
	 * is set to the local state
	 */
	const headers: any = useMemo(() => [{
		headerName: 'Time Segment ID',
		field: 'timeSegmentId',
		pinned: 'left',
		suppressMenu: true,
		checkboxSelection: (params: any) => {
			if (!!params?.node?.footer) return false;
			else return true;
		},
		headerCheckboxSelection: true,
		cellRenderer: (params: any) => {
			return <div className='blue-color'>
				{params?.data?.timeSegmentId}
			</div>;
		}
	}, {
		headerName: 'Status',
		field: 'status',
		pinned: 'left',
		cellClass: 'status-column',
		headerClass: 'custom-filter-header',
		headerComponent: CustomFilterHeader,
		headerComponentParams: {
			columnName: 'Status',
			options: timelogStatusMap,
			defaultFilters: defaultTimeLogStatusFilter,
			onSort: handleStatusColumnSort,
			onOpen: () => setStatusFilter(false),
			onClose: () => setStatusFilter(true),
			onFilter: handleStatusFilter
		},
		keyCreator: (params: any) => getTimeLogStatus(params?.data?.status),
		cellRenderer: (params: any) => {
			const stateObject: any = (timelogStatusMap || [])?.find((x: any) => x.value === params?.value);
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
		field: 'entryFor',
		pinned: 'left',
		aggFunc: (params: any) => {
			if (!params.rowNode?.key) {
				return 'Summary';
			} return `Sub Total - ${params.rowNode?.key}`;
		}
	},
	// {
	// 	headerName: 'Date Range',
	// 	field: 'dateRange',
	// 	pinned: 'left',
	// 	valueGetter: (params: any) => params?.data?.dateRange,
	// },
	 {
		headerName: 'Company',
		field: 'company'
	}, {
		headerName: 'Start Date',
		field: 'startDate',
		keyCreator: (params: any) => {
			return moment.utc(params?.data?.endDate).format('DD/MM/YYYY') + " " + (`(${getTimeLogDateRange(params.data.dateRange)})`) || "None";
		}
	}, {
		headerName: 'End Date',
		field: 'endDate'
	}, {
		headerName: 'Start Time',
		field: 'startTime',
		cellRenderer: (params: any) => {
			return params?.data ? (
				<SUIClock
				onTimeSelection={(value: any) => {
				onDataChange("startTime", getTime(value));
				}}
				disabled={false}
				defaultTime={moment.utc(params?.data?.startTime).format('h:mm A') || ""}
				pickerDefaultTime={getPickerDefaultTime(params?.data?.startTime, false)}
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
			return params?.data ? (
				<SUIClock
				onTimeSelection={(value: any) => {
				onDataChange("endTime", getTime(value));
				}}
				disabled={false}
				defaultTime={moment.utc(params?.data?.endTime).format('h:mm A') || ""}
				pickerDefaultTime={getPickerDefaultTime(params?.data?.endTime, false)}
				placeholder={"HH:MM"}
				// actions={[]}
				ampmInClock={true}
			></SUIClock>
			) : null
		},
	}, {
	}, {
		headerName: 'Duration',
		field: 'duration',
		aggFunc: (params: any) => {
			let sum = 0;
			params.values.forEach((time: any) => {
				let a;
				if(time?.includes('Hrs') || time?.includes('Mins')) {
					a = time?.replace('Hrs', ':');
					a = a?.replace('Mins', '');
				} else a = time;
				a = a?.split(":");
				let calculate = +a[0] * 60 * 60 + +a[1] * 60;
				sum += calculate;
			});
			if (moment(new Date(sum * 1000))?.isValid()) {
				let finalCnt = new Date(sum * 1000)?.toISOString();
				return finalCnt?.substr(11, 2)+" Hrs "+" "+ finalCnt?.substr(14, 2)+" Mins "
			};
		},
		valueGetter: (params: any) => params?.data?.duration
	}, {
		headerName: 'Source',
		field: 'source',
		keyCreator: (params: any) => params.data?.source || "None"
	}, {
		headerName: 'Created By',
		field: 'createdBy',
		valueGetter: (params: any) => params.data?.createdBy?.name,
		keyCreator: (params: any) => params.data?.createdBy?.name || "None"
	}, {
		headerName: 'Smart Item',
		field: 'smartItem',
		valueGetter: (params: any) => params.data?.smartItem?.name,
		keyCreator: (params: any) => params.data?.smartItem?.name || "None"
	}, {
		headerName: 'Work Team',
		field: 'workTeam',
		keyCreator: (params: any) => params.data?.workTeam || "None"
	}, {
		headerName: 'Location',
		field: 'location',
		keyCreator: (params: any) => params.data?.location || "None"
	}, {
		headerName: 'System Breakdown Structure',
		field: 'sbs',
	}, {
		headerName: 'Phase',
		field: 'phase',
		keyCreator: (params: any) => params.data?.phase?.[0]?.name || "None",
		minWidth: 260,
		cellRenderer: (params: any) => {
			const phase = params.data?.phase?.[0]?.name;
			const buttonStyle = {
				backgroundColor: params.data?.phase?.[0]?.color ?? "red",
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
	}], [defaultTimeLogStatusFilter, server, selectedFilters]);

	(headers || [])?.forEach((item: any) => {
		if (dateTimeFields?.includes(item?.field)) {
			item.cellRenderer = (params: any) => {
				if (!!params?.node?.footer) return null;
				else return (
					<>{moment.utc(params?.value).format('DD/MM/YYYY')}</>
				);
			}
		};
	});

	let filterOptions = useMemo(() => {
	var filterMenu = [{
		text: 'Users',
		value: 'users',
		key: 'users',
		keyValue: 'users',
		children: { type: "checkbox", items: [] }
	}, {
		text: 'Work Team',
		value: 'workTeam',
		key: 'workTeam',
		keyValue: 'workTeam',
		children: { type: "checkbox", items: [] }
	}, {
		text: 'Companies',
		value: 'companies',
		key: 'companies',
		keyValue: 'company',
		children: { type: "checkbox", items: [] }
	}, {
		text: 'Apps',
		value: 'apps',
		key: 'apps',
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
		children: { type: "checkbox", items: [] }
	}, {
		text: 'Created By',
		value: 'createdBy',
		key: 'createdBy',
		keyValue: 'createdBy',
		children: { type: "checkbox", items: [] }
	}, {
		text: 'Conflicting Time Entries',
		value: 'conflicting',
		key: 'conflicting',
		keyValue :'conflicting',
		children: {
			type: 'checkbox',
			items: [{
				text: 'Conflicting Time',
				key: 'conflictingTime',
				value: 'conflictingTime'
			}, {
				text: 'Conflicting Location',
				key: 'conflictingLocation',
				value: 'conflictingLocation'
			}]
		}
	}, {
		text: 'Date Range',
		value: 'dateRange',
		key: 'dateRange',
		keyValue :'dateRange',
		children: {
			type: 'checkbox',
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
			},{
				text: "Custom",
				value: "custom",
				key: "custom",
				keyValue: "custom",
				children: {
				type: "custom",
				component: <CustomDateRangeFilterComp 
					dates={{
						startDate : datesRef?.current?.startDate ?? selectedFilters?.dateRange?.startDate,
						endDate : datesRef?.current?.endDate ?? selectedFilters?.dateRange?.endDate,
					}} 
					handleApplyDatesFilter={handleApplyDatesFilter}
					handleClearDatesFilter= {handleClearDatesFilter}
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
	}];
    return filterMenu;
  }, []);

	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: iFrameId, roomId: server && server.presenceRoomId, appType: appType }
		});
	};

	const rowSelected = (sltdRows: any) => {
		//dispatch(setSelectedTimeLog(sltdRows));
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

	const GenerateFilters = () => {
		setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "workTeam"));
		setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "company"));
		setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "source"));
		setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "sbs"));
		setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "location"));
		setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "createdBy", true, "name"));
		setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "smartItem", true, "name"));
	};
	const GetDateRangeFilterData = (data:any) => {
		const todayDate = new Date();

		const startDayOfThisWeek = moment(todayDate).startOf('week');
		const lastDayOfThisWeek = moment(todayDate).endOf('week');

		const startDayOfPrevWeek = moment(startDayOfThisWeek).subtract(1, 'week').startOf('week');
		const lastDayOfPrevWeek = moment(lastDayOfThisWeek).subtract(1, 'week').endOf('week');
		
		const startDayOfPrevMonth = moment(todayDate).subtract(1, 'month').startOf('month');
		const lastDayOfPrevMonth = moment(todayDate).subtract(1, 'month').endOf('month');

		const startDayOfThisMonth = moment(todayDate).startOf('month');
		const lastDayOfThisMonth = moment(todayDate).endOf('month');

		const todayStart = moment().startOf('day');
		const todayEnd = moment().endOf('day');
		const yesterdayStart = moment().subtract(1, 'days').startOf('day');
		const yesterdayEnd = moment().subtract(1, 'days').endOf('day');
		const actualDate = moment(data?.endDate);

			if(moment(actualDate).isBetween(todayStart, todayEnd)) return 'today';
		else if(moment(actualDate).isBetween(yesterdayStart, yesterdayEnd)) return 'yesterday';
		
		else if(moment(actualDate).isBetween(startDayOfPrevWeek, lastDayOfPrevWeek)) return 'lastWeek';
		else if(moment(actualDate).isBetween(startDayOfThisWeek, lastDayOfThisWeek)) return 'thisWeek';
		
		else if(moment(actualDate).isBetween(startDayOfThisMonth, lastDayOfThisMonth)) return 'thisMonth';
		else if(moment(actualDate).isBetween(startDayOfPrevMonth, lastDayOfPrevMonth)) return 'lastMonth';

		else return 'future';
	};
	React.useEffect(() => {
		if(timelogList.length > 0) {

			let data = timelogList.map((item:any, index:any) => ({
				...item,
				dateRange : GetDateRangeFilterData(item)
			}));
			setRowData(data);
			setModifiedList(data);
			GenerateFilters();
		} else if (timelogList.length === 0) {
			setModifiedList([]);
			setRowData([]);
			GenerateFilters();
		}
	}, [timelogList]);
	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		server && <GridWindow
			open={true}
			title='Time Log'
			className='time-log-window'
			iconCls='common-icon-change-event-details'
			appType={appType}
			appInfo={server}
			iFrameId={iFrameId}
			isFromHelpIcon={true}
			zIndex={100}
			gridRef={gridRef}
			onClose={handleClose}
			manualLIDOpen={manualLIDOpen}
			moduleColor='#00e5b0'
			inlineModule={isInline}
			maxByDefault={isMaxByDefault}
			showBrena={server?.showBrena}
			onIconClick={handleIconClick}
			presenceProps={{
				presenceId: 'timelog-presence',
				showBrena: false,
				showLiveSupport: true,
				showLiveLink: true,
				showStreams: true,
				showComments: true,
				showChat: false,
				hideProfile: false,
			}}
			righPanelPresenceProps={{
				presenceId: "timelog-presence",
				showLiveSupport: true,
				showStreams: true,
				showPrint:true,
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
				headContent: { regularContent: <AddTimeLogForm /> },
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
							filterOptions: filterOptions,
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
						emptyMsg:'No items available yet',
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