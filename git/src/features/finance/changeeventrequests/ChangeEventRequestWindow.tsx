import './ChangeEventRequestWindow.scss';

import { setCurrencySymbol, setServer, getServer } from 'app/common/appInfoSlice';
import { isChangeEventClient, isChangeEventGC, isChangeEventSC } from 'app/common/userLoginUtils';
import { useAppDispatch, useAppSelector, useHomeNavigation } from 'app/hooks';
import { currency, isLocalhost, postMessage } from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import { appInfoData } from 'data/appInfo';
import _ from 'lodash';
import { memo, useMemo, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { triggerEvent } from 'utilities/commonFunctions';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { stateMap, statusFilterOptions, fundingSourceMap } from './CERUtils';
import ChangeEventRequestsForm from './content/form/ChangeEventRequestsForm';
import { CERLeftButtons, CERRightButtons } from './content/toolbar/CERToolbar';
import ChangeEventRequestsLID from './details/ChangeEventRequestsLID';
import {
	getChangeEventList, setSelectedChangeEvents, setToast, setDriveFiles, setCurrentChangeEventId, setTab
} from './stores/ChangeEventSlice';
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

let defaultCERStatusFilter: any = [];

const ChangeEventRequestsWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const modName = 'changeevent';
	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const location = useLocation();
	const { toast, sourceList } = useAppSelector((state) => state.changeEventRequest);
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
	sourceList.map((el: any) => contractFilter[el.clientContract?.id] = el.clientContract?.title);
	const [viewBuilderData, setViewBuilderData] = useState<any>({ viewName: "", viewId: "" });
	const [colDef, setColDef] = useState<any>([]);

	if (statusFilter) defaultCERStatusFilter = filters.status;

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

			if (queryParams?.get('id')) {
				dispatch(setCurrentChangeEventId(queryParams?.get('id')));
				setManualLIDOpen(true);

				if (queryParams?.get("tab")) {
					dispatch(setTab(tabEnum[queryParams?.get("tab")]));
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

	/**
	 * All initial APIs will be called here
	 * Grid API
	 * Dropdown APIs that supports adding a new record
	 */
	useEffect(() => {
		if (server) {
			dispatch(getChangeEventList());
			dispatch(fetchConnectors(server));
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
									dispatch(setDriveFiles(data.data));
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
								data?.data?.name == "changeevents" && dispatch(getChangeEventList());
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

	const onGroupingChange = (groupKey: any) => {
		const data = groupKey == null || groupKey == 'undefined' ? 'None' : groupKey;
		if (((data ?? false) && data !== "")) {
			groupKeyValue.current = data;
		} else if (data ?? true) {
			groupKeyValue.current = null;
		}
		console.log('groupKey', data)
		setActiveGroupKey(data);
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if (node.group) {
			const colName = groupKeyValue?.current;
			console.log("cellerender", colName, node?.group);
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if (colName === "status") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={stateMap[data?.status]?.text} colName={colName}
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

	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
			suppressGroupRowsSticky: true,
			innerRenderer: GroupRowInnerRenderer
		};
	}, []);


	const onFilterChange = (activeFilters: any, type?: string) => {
		console.log('onFilterChange', activeFilters)
		setFilters(activeFilters);
	};

	const onGridSearch = (searchText: any) => {
		setSearch(searchText);
	};

	const searchAndFilter = (list: any) => {
		console.log('filters', filters)
		return list.filter((item: any) => {
			const regex = new RegExp(search, 'gi');
			return (!search || (search && (item.name?.match(regex) || (fundingSourceMap[item.fundingSource]).match(regex) ||
				(stateMap[item.status]?.text).match(regex) || item.code?.match(regex) ||
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
	const modifiedList = searchAndFilter(sourceList);

	const columns = useMemo(() => [
		{
			headerName: 'Name',
			pinned: 'left',
			field: 'name',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 100,
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			cellRenderer: (params: any) => {
				return <div className='blue-color ellipsis mouse-pointer'>
					{params?.data?.name}
				</div>;
			}
		}, {
			headerName: 'Status',
			pinned: 'left',
			field: 'status',
			minWidth: 270,
			rowGroup: activeGroupKey === 'status',
			cellClass: 'status-column',
			sortable: true,
			headerClass: 'custom-filter-header',
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: 'Status',
				options: statusFilterOptions,
				defaultFilters: defaultCERStatusFilter,
				onSort: handleStatusColumnSort,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			cellRenderer: (params: any) => {
				const stateObject: any = stateMap[params?.value];
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
			headerName: 'Change Event ID',
			field: 'code',
			minWidth: 150,
			suppressMenu: true
		},
		{
			headerName: 'Change Event Quote Amount',
			field: 'quoteAmount',
			minWidth: 230,
			suppressMenu: true,
			hide: !isChangeEventSC(),
			cellRenderer: (params: any) => {
				const estimatedQuoteAmount = params.value && amountFormatWithSymbol(params.value);
				return <div className='right-align'>{estimatedQuoteAmount}</div>;
			}
		},
		{
			headerName: 'Funding Resource',
			field: 'fundingSource',
			minWidth: 160,
			rowGroup: activeGroupKey === 'fundingSource',
			hide: isChangeEventSC(),
			suppressMenu: true,
			cellRenderer: (context: any) => {
				return fundingSourceMap[context.value];
			}
		}, {
			headerName: 'Est. Change Event Amount',
			field: 'estimatedAmount',
			minWidth: 210,
			hide: isChangeEventSC(),
			suppressMenu: true,
			cellRenderer: (params: any) => {
				const estimatedCEAmount = params.value && amountFormatWithSymbol(params.value);
				return <div className='right-align'>{estimatedCEAmount}</div>;
			}
		}, {
			headerName: 'Client Company',
			field: 'clientContract.client.name',
			minWidth: 160,
			hide: isChangeEventSC(),
			suppressMenu: true
		}, {
			headerName: 'Contract',
			field: isChangeEventSC() ? 'vendorContracts' : 'clientContract.title',
			minWidth: 220,
			suppressMenu: true,
			rowGroup: activeGroupKey === (isChangeEventSC() ? 'vendorContract.title' : 'clientContract.title'),
			cellRenderer: (params: any) => {
				const contract = !isChangeEventSC() ? params.value
					: getVendorContractName(params.value);
				return <div>{contract}</div>;
			}
		}, {
			headerName: 'Work Items',
			field: 'budgetItems',
			type: 'showCount',
			minWidth: 300,
			suppressMenu: true,
			valueGetter: (params: any) => {
				if (params.data?.budgetItems?.length) {
					const values: any = [];
					params?.data?.budgetItems?.map((obj: any) => {
						if (obj?.name && obj?.costCode) values.push(`${obj?.name} - ${obj?.costCode}`);
					});
					return values;
				}
				return '';
			}
		}, {
			headerName: 'Submitted Date',
			field: 'submitted.on',
			suppressMenu: true,
			valueGetter: (params: any) => params.data?.submitted ? formatDate(params.data?.submitted?.on) : ''
		}
	], [defaultCERStatusFilter, server, activeGroupKey]);

	const filterOptions = useMemo(() => [
		{
			text: 'Status',
			value: 'status',
			key: 'status',
			children: {
				type: 'checkbox',
				items: statusFilterOptions
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

	// console.log("columnsss", columns, activeGroupKey);

	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: 'changeEventRequestsIframe', roomId: server && server.presenceRoomId, appType: 'ChangeEventRequests' }
		});
	};

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedChangeEvents(sltdRows));
	};

	const handleIconClick = () => {
		if (isInline) useHomeNavigation('changeEventRequestIframe', 'ChangeEventRequests');
	};

	const handleDropDown = (value: any, data: any) => {
		if (value === "save") {
			saveViewHandler(data);
			setToastMessage(`${viewBuilderData?.viewName} Saved Successfully`);
		}
		else if (value === "delete") {
			DeleteViewHandler();
			setToastMessage(`${viewBuilderData?.viewName} Deleted Successfully`);
		}
	}

	const saveNewViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(filters);
		const payload = { ...value, viewFor: modName, filters: filters ? FilterValue : '{}', groups: activeGroupKey ? [activeGroupKey] : ['None'] };
		console.log('payload', payload);
		addNewView(appInfo, payload, modName, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'ChangeEvent' }));
			dispatch(getChangeEventList());
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewBuilderData?.viewId }));
		});
	}
	const saveViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(filters);
		const payload = { ...value, filters: FilterValue ? FilterValue : '{}', groups: activeGroupKey ? [activeGroupKey] : ['None'] };
		console.log('payload', payload);
		updateViewItem(appInfo, viewBuilderData?.viewId, payload, (response: any) => {
			dispatch(getChangeEventList());
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewBuilderData?.viewId }));
		});
	}
	const DeleteViewHandler = () => {
		deleteView(appInfo, viewBuilderData?.viewId, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'ChangeEvent' }));
		});
	}
	useEffect(() => {
		//Appending viewbuilder data to grid 
		if (viewBuilderData?.columnsForLayout?.length) {
			let updatedColumndDefList: any = [];
			const gridApi = gridRef.current;
			if (gridApi) {
				let updatedColumndDefList: any = [];
				console.log('viewBuilderData?.columnsForLayout', viewBuilderData?.columnsForLayout);
				viewBuilderData?.columnsForLayout.forEach((viewItem: any) => {
					columns?.forEach((cDef: any) => {
						if (viewItem.field == cDef.field) {
							let newColumnDef = {
								...cDef,
								...viewItem,
								hide: viewItem?.hide
							};
							updatedColumndDefList.push(newColumnDef);
						}
					});
				});
				setColDef([...updatedColumndDefList])
				gridApi?.api?.setColumnDefs(updatedColumndDefList);
			}
		}
	}, [viewBuilderData]);

	useMemo(() => {
		if (viewBuilderData != '') {
			console.log('viewBuilderData', viewBuilderData)
			viewBuilderData?.groups && setActiveGroupKey(viewBuilderData?.groups[0] == 'None' ? 'undefined' : viewBuilderData?.groups[0]);
			viewBuilderData?.filters && setFilters(JSON.parse(viewBuilderData?.filters));
			viewBuilderData?.filters && setDefaultFilters(JSON.parse(viewBuilderData?.filters));
		}
	}, [viewBuilderData?.viewId])

	useMemo(() => {
		// if grouping value is changed and colDef array as a data.
		// modifing the coldef array, object value rowGroup true or false based on activeMainGridGroupKey
		if (activeGroupKey && colDef) {
			const data = colDef?.length > 0 && colDef?.map((item: any) => {
				if (item.field === activeGroupKey) {
					return { ...item, rowGroup: true };
				} else if (item.rowGroup) {
					return { ...item, rowGroup: false };
				}
				return item;
			});
			setColDef(data);
		}
	}, [activeGroupKey])

	const viewListOnChange = (data: any) => {
		setViewBuilderData(data);
		dispatch(getChangeEventList());
	}


	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		server && (isChangeEventGC() || isChangeEventSC() || isChangeEventClient() ? <GridWindow
			open={true}
			title='Change Event Requests'
			companyInfo={isChangeEventClient() || isChangeEventSC()}
			centerPiece={
				(isChangeEventClient() && <>{`Below are all Change Order Requests for your company '${server?.currentUserInfo?.company}' for the Project '${server?.currentProjectInfo?.name}'`}</>)
				|| (isChangeEventSC() && <>{`Below are Quote Requests for your Trade '${server?.gblConfig?.currentUserSkillTrade?.tradeName ? server?.gblConfig?.currentUserSkillTrade?.tradeName : ''}' for the Project '${server?.currentProjectInfo?.name}'`}</>)
			}
			className='change-event-request-window'
			iconCls='common-icon-change-event-details'
			appType='ChangeEventRequests'
			appInfo={server}
			iFrameId='changeEventRequestIframe'
			defaultTabId='change-Event-Details'
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
				presenceId: 'changeeventrequest-presence',
				showBrena: false,
				showLiveSupport: true,
				showLiveLink: true,
				showStreams: true,
				showComments: true,
				showChat: false,
				hideProfile: false,
			}}
			righPanelPresenceProps={{
				presenceId: "changeeventrequest-presence",
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
				headContent: isChangeEventGC() ? { regularContent: <ChangeEventRequestsForm /> } : {},
				detailView: ChangeEventRequestsLID,
				gridContainer: {
					toolbar: {
						leftItems: <CERLeftButtons />,
						rightItems: <CERRightButtons />,
						searchComponent: {
							show: true,
							type: 'regular',
							defaultFilters: defaultFilters,
							defaultGroups: activeGroupKey,
							groupOptions: isChangeEventSC() ? scGroupOptions : gcGroupOptions,
							filterOptions: filterOptions,
							onGroupChange: onGroupingChange,
							onSearchChange: onGridSearch,
							onFilterChange: (value: any) => { onFilterChange(value) },
							placeholder: viewBuilderData?.viewName,
							viewBuilderapplied: true,
						},
						viewBuilder: <ViewBuilder
							moduleName={modName}
							appInfo={appInfo}
							dropDownOnChange={(value: any, data: any) => { handleDropDown(value, data) }}
							saveView={(data: any) => { saveViewHandler(data) }}
							deleteView={() => { DeleteViewHandler() }}
							saveNewViewData={(data: any) => { saveNewViewHandler(data) }}
							dataList={(data: any) => { setViewBuilderData(data) }}
							viewListOnChange={(data: any) => { viewListOnChange(data) }}
							requiredColumns={['name', 'status']}
						/>
					},
					grid: {
						// headers: columns,
						headers: colDef && colDef.length > 0 ? colDef : columns,
						data: modifiedList,
						getRowId: (params: any) => params.data?.id,
						grouped: true,
						groupIncludeTotalFooter: false,
						rowSelection: 'single',
						groupIncludeFooter: false,
						rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						nowRowsMsg: '<div>Create New Change Event Request by Clicking the + Add button above</div>',
						groupRowRendererParams: groupRowRendererParams,
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

export default memo(ChangeEventRequestsWindow);