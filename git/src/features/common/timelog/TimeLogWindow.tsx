import {AgGridReact} from 'ag-grid-react';
// import './TimeLogWindow.scss';

import {setCurrencySymbol, setServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector, useHomeNavigation} from 'app/hooks';
import {currency, isLocalhost, postMessage} from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import {appInfoData} from 'data/appInfo';
import _ from 'lodash';
import {memo, useMemo, useEffect, useState, useRef} from 'react';
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
	const [activeGroupKey, setActiveGroupKey] = useState<String>('');

	let gridRef = useRef<AgGridReact>();

	if(statusFilter) defaultTimeLogStatusFilter = filters.status;

	const groupOptions = [{
		text: 'Users', value: 'users'
	}, {
		text: 'Work Team', value: 'workTeam'
	}, {
		text: 'Companies', value: 'companies'
	}, {
		text: 'Apps', value: 'apps'
	}, {
		text: 'Status', value: 'status'
	}, {
		text: 'Source', value: 'source'
	}, {
		text: 'Created By', value: 'createdBy'
	}, {
		text: 'Conflicting Time Entries', value: 'conflicting'
	}, {
		text: 'Date Range', value: 'dateRange'
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
		// const columnsCopy = [...columns];
		setActiveGroupKey(groupKey);
		// console.log("activeMainGridGroupKey", groupKey, columnsCopy);
		if(((groupKey ?? false) && groupKey !== "")) {
			groupKeyValue.current = groupKey;
			// columnsCopy.forEach((col: any) => {
			// 	col.rowGroup = groupKey ? groupKey === col.field : false;
			// 	setColumns(columnsCopy);
			// });
		} else if(groupKey ?? true) {
			groupKeyValue.current = null;
			// columnsCopy.forEach((col: any) => {
			// 	// console.log("status", col?.rowGroup);
			// 	col.rowGroup = false;
			// });
			// console.log("else group key", columnsCopy);
			// setColumns(columnsCopy);
		}
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if(node.group) {
			const colName = groupKeyValue?.current;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			// if(colName === "status") {
			// 	return (
			// 		<div style={{display: 'flex'}}>
			// 			<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
			// 				label={stateMap[data?.status]?.text} colName={colName}
			// 			/>
			// 		</div>
			// 	);
			// } else if(colName === "fundingSource") {
			// 	return (
			// 		<div style={{display: 'flex'}}>
			// 			<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
			// 				label={data?.fundingSource} colName={colName}
			// 			/>
			// 		</div>
			// 	);
			// } else if(colName === "clientContract.title") {
			// 	return (
			// 		<div style={{display: 'flex'}}>
			// 			<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
			// 				label={data?.clientContract?.title} colName={colName}
			// 			/>
			// 		</div>
			// 	);
			// }
		};
	};

	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
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
	const modifiedList = searchAndFilter([]);

	const columns = useMemo(() => [{
		headerName: 'Time Segment ID',
		field: 'timeSegmentId',
		pinned: 'left'
	}, {
		headerName: 'Status',
		field: 'status',
		pinned: 'left',
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
	}, {
		headerName: 'Time Entry For',
		field: 'entryFor',
		pinned: 'left'
	}, {
		headerName: 'Company',
		field: 'company'
	}, {
		headerName: 'Start Time',
		field: 'startTime'
	}, {
		headerName: 'End Time',
		field: 'endTime'
	}, {
		headerName: 'Duration',
		field: 'duration'
	}, {
		headerName: 'Source',
		field: 'source'
	}, {
		headerName: 'Created By',
		field: 'createdBy'
	}, {
		headerName: 'Smart Item',
		field: 'smartItem'
	}, {
		headerName: 'Work Team',
		field: 'workItem'
	}, {
		headerName: 'Location',
		field: 'location'
	}, {
		headerName: 'System Breakdown Structure',
		field: 'sbs'
	}, {
		headerName: 'Phase',
		field: 'phase'
	}, {
		headerName: 'Time Log ID',
		field: 'timeLogId',
	}], [defaultTimeLogStatusFilter, server, groupKeyValue.current]);

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
							filterOptions: filterOptions,
							onGroupChange: onGroupingChange,
							onSearchChange: onGridSearch,
							onFilterChange: onFilterChange
						}
					},
					grid: {
						headers: columns,
						data: timelogList,
						getRowId: (params: any) => params.data?.id,
						grouped: true,
						groupIncludeTotalFooter: false,
						rowSelection: 'single',
						groupIncludeFooter: false,
						rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						nowRowsMsg: '<div>No items available yet</div>',
						groupRowRendererParams: groupRowRendererParams,
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