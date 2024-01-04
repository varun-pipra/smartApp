import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import './TimeLogWindow.scss';

import {setCurrencySymbol, setServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector, useHomeNavigation} from 'app/hooks';
import {currency, isLocalhost, postMessage} from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import {appInfoData} from 'data/appInfo';
import _ from 'lodash';
import {memo, useMemo, useEffect, useState, useRef, useCallback} from 'react';
import {useLocation} from 'react-router-dom';
import {triggerEvent} from 'utilities/commonFunctions';
import {formatDate} from 'utilities/datetime/DateTimeUtils';
import SUIAlert from 'sui-components/Alert/Alert';
import AddTimeLogForm from './AddTimeLogForm';
import {timelogStatusMap} from './TimeLogConstants';
import CustomFilterHeader from '../gridHelper/CustomFilterHeader';
import {TLLeftButtons, TLRightButtons} from './toolbar/TimeLogToolbar';
import {timelogList} from 'data/timelog/TimeLogData';
import TimeLogLID from './details/TimeLogLID';
import { Button } from '@mui/material';
import { findAndUpdateFiltersData } from 'features/safety/sbsmanager/utils';
import moment from "moment";
import {CustomGroupHeader} from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';

let defaultTimeLogStatusFilter: any = [];

const TimeLogWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const iFrameId = 'timelogIframe', appType = 'TimeLog';

	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);

	const location = useLocation();
	const {server} = useAppSelector((state) => state.appInfo);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>('');
	const [filters, setFilters] = useState<any>({});
	const [search, setSearch] = useState<string>('');
	const [defaultFilters, setDefaultFilters] = useState<any>({});
	const groupKeyValue = useRef<any>(null);
	// const [activeGroupKey, setActiveGroupKey] = useState<String>('');
	const [columns, setColumns] = useState([]);
	const [rowData, setRowData] = useState<Array<any>>([]);
  	const [modifiedList, setModifiedList] = useState<Array<any>>([]);
	let gridRef = useRef<AgGridReact>();

	if(statusFilter) defaultTimeLogStatusFilter = filters.status;

	const groupOptions = [{
		text: 'Users', value: 'users'
	}, {
		text: 'Work Team', value: 'workTeam'
	}, {
		text: 'Companies', value: 'company'
	}, {
		text: 'Apps', value: 'apps'
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
		if(queryParams?.size > 0) {
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');

			if(queryParams?.get('id')) {
				//
				setManualLIDOpen(true);

				if(queryParams?.get("tab")) {
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
		if(server) {
			// dispatch(getChangeEventList());
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
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case 'getdrivefiles':
								try {
									// dispatch(setDriveFiles(data.data));
								} catch(error) {
									console.log('Error in adding Files from Drive:', error);
								}
								break;
							case 'updateparticipants':
								// console.log('updateparticipants', data)
								triggerEvent('updateparticipants', {data: data.data, appType: data.appType});
								break;
							case 'updatecommentbadge':
								// console.log('updatecommentbadge', data)
								triggerEvent('updatecommentbadge', {data: data.data, appType: data.appType});
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
					body: {iframeId: iFrameId, roomId: server && server.presenceRoomId, appType: appType}
				});
			}
		}
	}, [localhost, appData]);

	const onGroupingChange = (groupKey: any) => {
		const columnsCopy:any = [...headers];
		if(((groupKey ?? false) && groupKey !== "")) {
			groupKeyValue.current = groupKey;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = groupKey ? groupKey === col.field : false;
				setColumns(columnsCopy);
			});
		} else if(groupKey ?? true) {
			groupKeyValue.current = null;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = false;
			});
			setColumns(columnsCopy);
		}
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if(node.group) {
			const colName = groupKeyValue?.current;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if(colName === "status") {
				const stateObject: any = (timelogStatusMap || [])?.find((x:any) => x.value === node?.key);
				return (
					<div style={{display: 'flex'}} className='status-column'>
						<CustomGroupHeader iconCls={stateObject?.icon} baseCustomLine={false}
							label={stateObject?.text} showStatus = {true}
							color = {stateObject?.color} bgColor = {stateObject?.bgColor}
						/>
					</div>
				);
			}else if(colName === "startDate") {
				let now = moment.utc(new Date());
				let lastContact = moment.utc(data.endDate);
				let months = now.diff(lastContact, 'months');
          		let weeks = now.diff(lastContact, 'weeks');
				let days = now.diff(lastContact, 'days');
				// let hours = lastContact.diff(now, 'hours');
				// let minutes = lastContact.diff(now, 'minutes');
				// let seconds = lastContact.diff(now, 'seconds');
				let label = '';
    			if (days >= 2) {
        			label = moment.utc(lastContact).fromNow(); // '2 days ago' etc.
    			};	
				console.log("dfdsiufhuisd", lastContact.calendar(), months, weeks, days);
    			label = lastContact.calendar().split(' ')[0];
				return (
					<div style={{display: 'flex'}} className='status-column'>
						<CustomGroupHeader  label={moment.utc(data?.endDate).format('DD/MM/YYYY') +" "+ (`(${label})`)} />
					</div>
				);
			} else {
				return (
					<div className="custom-group-header-cls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
						<span className="custom-group-header-label-cls">{node?.key || ""}</span>
					</div>
				)
			}
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

	const onFilterChange = (activeFilters: any, type?: string) => {
		setFilters(activeFilters);
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
			
			return searchVal;
		  });
	};

	const handleStatusFilter = (statusFilters: any) => {
		setFilters((prevFilters: any) => {
			const consolidatedFilter = {...prevFilters, ...{status: statusFilters}};
			setDefaultFilters(consolidatedFilter);
			return consolidatedFilter;
		});
	};

	const handleStatusColumnSort = (direction: any) => {
		gridRef?.current?.columnApi?.applyColumnState({
			state: [{colId: 'status', sort: direction}],
			defaultState: {sort: null}
		});
	};

	/**
	 * Grid data is set in this method
	 * 
	 * Search, Filters are applied to the source data and the result
	 * is set to the local state
	 */
	const headers:any = useMemo(() => [{
		headerName: 'Time Segment ID',
		field: 'timeSegmentId',
		pinned: 'left',
		suppressMenu: true,
		checkboxSelection: true,
		headerCheckboxSelection: true,
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
		cellRenderer: (params: any) => {
			const stateObject: any = (timelogStatusMap || [])?.find((x:any) => x.value === params?.value);
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
		pinned: 'left'
	}, {
		headerName: 'Company',
		field: 'company'
	}, {
		headerName: 'Start Date',
		field: 'startDate',
		valueGetter: (params: any) => `${moment.utc(params?.data?.startDate).format('DD/MM/YYYY')}`,
	}, {
		headerName: 'End Date',
		field: 'endDate',
		valueGetter: (params: any) => `${moment.utc(params?.data?.endDate).format('DD/MM/YYYY')}`,
	}, {
		headerName: 'Start Time',
		field: 'startTime',
		valueGetter: (params: any) => `${moment.utc(params?.data?.startTime).format('h:mm A')}`,
	}, {
		headerName: 'End Time',
		field: 'endTime',
		valueGetter: (params: any) => `${moment.utc(params?.data?.endTime).format('h:mm A')}`,
	}, {
		headerName: 'Duration',
		field: 'duration'
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
		keyCreator: (params: any) => params.data?.smartItem || "None"
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
	}], []);

	const filterOptions = useMemo(() => [{
		text: 'Users',
		value: 'users',
		key: 'users',
		children: {
			type: 'checkbox'
		}
	}, {
		text: 'Work Team',
		value: 'workTeam',
		key: 'workTeam',
		children: {
			type: 'checkbox'
		}
	}, {
		text: 'Companies',
		value: 'companies',
		key: 'companies',
		children: {
			type: 'checkbox'
		}
	}, {
		text: 'Apps',
		value: 'apps',
		key: 'apps',
		children: {
			type: 'checkbox'
		}
	}, {
		text: 'Status',
		value: 'status',
		key: 'status',
		children: {
			type: 'checkbox',
			items: timelogStatusMap
		}
	}, {
		text: 'Source',
		value: 'source',
		key: 'source',
		children: {
			type: 'checkbox'
		}
	}, {
		text: 'Created By',
		value: 'createdBy',
		key: 'createdBy',
		children: {
			type: 'checkbox'
		}
	}, {
		text: 'Conflicting Time Entries',
		value: 'conflicting',
		key: 'conflicting',
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
			}]
		}
	}, {
		text: 'System Breakdown Structure',
		value: 'sbs',
		key: 'sbs',
		children: {
			type: 'checkbox'
		}
	}, {
		text: 'Location',
		value: 'location',
		key: 'location',
		children: {
			type: 'checkbox'
		}
	}], []);

	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: {iframeId: iFrameId, roomId: server && server.presenceRoomId, appType: appType}
		});
	};

	const rowSelected = (sltdRows: any) => {
		// dispatch(setSelectedChangeEvents(sltdRows));
	};

	const handleIconClick = () => {
		if(isInline) useHomeNavigation(iFrameId, appType);
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
	React.useEffect(() => {
		if (timelogList.length > 0) {
		  setModifiedList(timelogList);
		  setRowData(timelogList);
		//   setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "phase", true, "name"));
		} else if (timelogList.length === 0) {
		  setModifiedList([]);
		  setRowData([]);
		//   setFilters(findAndUpdateFiltersData(filterOptions, timelogList, "phase", true, "name"));
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
				headContent: {regularContent: <AddTimeLogForm />},
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
							filterOptions: filters,
							onGroupChange: onGroupingChange,
							onSearchChange: onGridSearch,
							onFilterChange: onFilterChange
						}
					},
					grid: {
						headers: columns,
						data: rowData,
						getRowId: (params: any) => params.data?.id,
						rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						nowRowsMsg: '<div>No items available yet</div>',
						groupRowRendererParams: groupRowRendererParams,
						onFirstDataRendered: onFirstDataRendered,
						groupIncludeTotalFooter: false,
						groupIncludeFooter: false,
						groupSelectsChildren: true,
						rowSelection: "multiple",
						groupDefaultExpanded: 1,
						grouped: true,
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