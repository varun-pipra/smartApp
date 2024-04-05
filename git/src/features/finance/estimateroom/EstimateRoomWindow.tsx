
import { AgGridReact } from "ag-grid-react";
import { getServer, setCurrencySymbol, setServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { currency, getGroupedColumns, getSearchBasedOnKeys, isLocalhost } from "app/utils";
import { appInfoData } from "data/appInfo";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import LeftSideToolBarButtons from "./content/toolbar/LeftSideToolBarButtons";
import RightSideToolBarButtons from "./content/toolbar/RightSideToolBarButtons";
import _ from "lodash";
import { estimateRoomStatusEnums } from "./utils";
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import SUIAlert from "sui-components/Alert/Alert";
import './EstimateRoomWindow.scss';
import CustomFilterHeader from "features/common/gridHelper/CustomFilterHeader";
import { EstimateRoomStatusMap } from "./EstimateRoomConstants";
import { CustomGroupHeader } from "features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid";
import { getEstimateRoomList, setSelectedRows } from "./stores/EstimateRoomSlice";
import ViewBuilder from "sui-components/ViewBuilder/ViewBuilder";
import { findAndUpdateFiltersData } from "features/safety/sbsmanager/utils";
import { getEstimateRoomEnums } from "utilities/estinateRoom/enums";
interface EstimateRoomWindowProps {
    fullScreen?: boolean
};

const EstimateRoomWindow = (props:EstimateRoomWindowProps) => {
  const dispatch = useAppDispatch();
	const modName = 'estimateroom';
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const location = useLocation();
	const { estimateRoomGridList } = useAppSelector((state) => state.estimateRoom);
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
	const queryParams: any = new URLSearchParams(location.search);    
	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<any>();
	const [columns, setColumns] = useState<any>([]);
	const [rowData, setRowData] = useState<Array<any>>([]);
	const [modifiedList, setModifiedList] = useState<Array<any>>([]);
	const groupOptions = [{text: 'Status', value: 'status', iconCls: 'common-icon-accept'}];
	const filterOptions = useMemo(() => {
		var filterMenu = [{
			text: 'Status',
			value: 'status',
			key: 'status',
			keyValue: 'status',
			children: {
				type: 'checkbox',
				items: EstimateRoomStatusMap
			}
		},{
			text: "Bid Package",
			value: "bidPackage",
			key: "bidPackage",
			keyValue: "bidPackage",
			children: { type: "checkbox", items: [] }
		}];
		return filterMenu;
	}, []);
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
	const headers:any = [
        {
				headerName: 'Name',
				pinned: 'left',
       			field: 'name',
				width: 300,
				checkboxSelection: true,
				cellClass: 'blue-color',
				headerCheckboxSelection: true
        },
        {
            headerName: 'Status',
			field: 'status',
			pinned: 'left',
			width: 250,
			cellClass: 'status-column',
			headerClass: 'custom-filter-header',
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: 'Status',
				options: EstimateRoomStatusMap,
				onSort: handleStatusColumnSort,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
            cellRenderer: (params: any) => {
				const stateObject: any = estimateRoomStatusEnums[params?.value];
				return <div
							className='status'
							style={{
								color: stateObject?.color,
								backgroundColor: stateObject?.bgColor
							}}
						>
					<span className={`status-icon ${stateObject?.icon}`}></span> {stateObject?.text}{' '}
				</div>
			}
        },
        {
            headerName: 'Description',
            field: 'description',
		},
		{
			headerName: 'Bid Package',
			field: 'bidPackage',
			valueGetter: (params: any) => params?.data?.bidPackage?.name || 'NA',
			keyCreator: (params: any) => params.data?.bidPackage?.name || "None",
		},
        {
            headerName: 'Created By',
            field: 'createdBy',
            valueGetter:(params:any) => `${params?.data?.createdBy?.name}, ${formatDate(params?.data?.createdBy?.date)}`
        },
        {
            headerName: 'Modified By',
            field: 'modifiedBy',
            valueGetter:(params:any) => `${params?.data?.modifiedBy?.name}, ${formatDate(params?.data?.modifiedBy?.date)}`
            
        },
    ];
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
									// triggerEvent('updateparticipants', { data: data.data, appType: data.appType });
									break;
								case 'updatecommentbadge':
									// console.log('updatecommentbadge', data)
									// triggerEvent('updatecommentbadge', { data: data.data, appType: data.appType });
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
						body: { iframeId: 'budgetRoomIframe', roomId: server && server.presenceRoomId, appType: 'BudgetRoom' }
					});
				}
			}
	}, [localhost, appData]);
    useEffect(() => {
		if (appInfo) {
			dispatch(getEstimateRoomList({}));
		}
	}, [appInfo]);
	useEffect(() => {
		if (estimateRoomGridList.length > 0) {
			const data: any = estimateRoomGridList.map((item: any) => ({
				...item, bidPackageValue: item.bidPackage === null || item.bidPackage === '' ? 'NA' : item.bidPackage,
				statusName : getEstimateRoomEnums(item?.status)
			}));
			setModifiedList(data);
			setRowData(data);
			setFilters(findAndUpdateFiltersData(filterOptions, data, "bidPackage", true, "name"));
		} else if (estimateRoomGridList.length === 0) {
			setModifiedList([]);
			setRowData([]);
			setFilters(findAndUpdateFiltersData(filterOptions, estimateRoomGridList, "bidPackage", true, "name"));
		}
	}, [estimateRoomGridList]);
    useEffect(() => {
		if (search || selectedFilters) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [search, selectedFilters]);
	const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const searchVal = getSearchBasedOnKeys(item, search);
			let filterValues = { ...selectedFilters };
			const filterVal = (_.isEmpty(filterValues) || (!_.isEmpty(filterValues) && 
			(_.isEmpty(filterValues?.bidPackage) || filterValues?.bidPackage?.length === 0 || filterValues?.bidPackage?.indexOf(item?.bidPackageValue) > -1)
			&& (_.isEmpty(filterValues?.status) || filterValues?.status?.length === 0 || filterValues?.status?.indexOf(item?.statusName)) > -1));
			return searchVal && filterVal;
		});
	};
    const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: 'budgetRoomIframe', roomId: server && server.presenceRoomId, appType: 'BudgetRoom' }
		});
	};
    const onFirstDataRendered = useCallback((params: any) => {
		gridRef.current = params;
		setColumns(headers);
	}, []);
	const updateCustomHeaderParams = useCallback((data: any) => {
		const newDefs: any = gridRef?.current?.api?.getColumnDefs()?.map((def: any) => {
			if (def?.field === "status") {
				return {
					...def,
					headerComponentParams: {
						columnName: "Status",
						options: EstimateRoomStatusMap,
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
	const GroupRowInnerRenderer = (props: any) => {
		const node = props?.node;
		if (node?.group) {
			const colName = groupKeyValue?.current;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if(colName === "status") {
				const stateObject: any = (EstimateRoomStatusMap || [])?.find((x:any) => x.value == data?.[colName]);
				return (
					<div style={{display: 'flex'}} className='status-column'>
						<CustomGroupHeader iconCls={stateObject?.icon} baseCustomLine={false}
							label={stateObject?.text} showStatus = {true}
							color = {stateObject?.color} bgColor = {stateObject?.bgColor}
						/>
					</div>
				);
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
	const onGroupingChange = useCallback((groupKey:any) => {
		const columnsCopy: any = [...headers];
		groupKeyValue.current = groupKey;
		const UpdatedCols = getGroupedColumns(columnsCopy, groupKey);
		setColumns(UpdatedCols);
	},[]);
	const onSearchChange = useCallback((searchValue:any) => {
		setSearch(searchValue);
	},[]);
	const onFilterChange = useCallback((filterValues:any) => {
			updateCustomHeaderParams(filterValues?.status);
			setSelectedFilters(filterValues);
	},[]);
	const onRowSelectionChange = useCallback((selectedRows:any) => {
			dispatch(setSelectedRows(selectedRows));
	},[]);
	const onClickRefresh = () => {
		dispatch(getEstimateRoomList({}));
	};
    return (
		server && (<><GridWindow
			open={true}
			title='Estimate Room'
			// companyInfo={isChangeEventClient() || isChangeEventSC()}
			// centerPiece={
			// 	(isChangeEventClient() && <>{`Below are all Change Order Requests for your company '${server?.currentUserInfo?.company}' for the Project '${server?.currentProjectInfo?.name}'`}</>)
			// 	|| (isChangeEventSC() && <>{`Below are Quote Requests for your Trade '${server?.gblConfig?.currentUserSkillTrade?.tradeName ? server?.gblConfig?.currentUserSkillTrade?.tradeName : ''}' for the Project '${server?.currentProjectInfo?.name}'`}</>)
			// }
			className='estimate-room-window'
			// iconCls='common-icon-change-event-details'
			appType='EstimateRoom'
			appInfo={server}
			iFrameId='estimateRoomIframe'
			// defaultTabId='cetails'
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
			// onIconClick={handleIconClick}
			presenceProps={{
				presenceId: 'estimate-room-presence',
				showBrena: false,
				showLiveSupport: true,
				showLiveLink: true,
				showStreams: true,
				showComments: true,
				showChat: false,
				hideProfile: false,
			}}
			righPanelPresenceProps={{
				presenceId: "estimate-room-presence",
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
			// toast={toastMessage}
			content={{
				// headContent: isChangeEventGC() ? { regularContent: <ChangeEventRequestsForm /> } : {},
				// detailView: ChangeEventRequestsLID,
				gridContainer: {
					toolbar: {
						leftItems: < LeftSideToolBarButtons refreshHandler={onClickRefresh} />,
						rightItems: <RightSideToolBarButtons />,
						searchComponent: {
							show: true,
							type: 'regular',
							defaultFilters: defaultFilters,
							defaultGroups: '',
							groupOptions: groupOptions,
							filterOptions: filterOptions,
							onGroupChange: onGroupingChange,
							onSearchChange: onSearchChange,
							onFilterChange: onFilterChange,
							// placeholder: viewData?.viewName,
							viewBuilderapplied: true,
						},
						viewBuilder: <ViewBuilder
							moduleName={modName}
							appInfo={appInfo}
							dropDownOnChange={(value: any, data: any) => { }}
							saveView={(data: any) => { }}
							deleteView={() => { }}
							saveNewViewData={(data: any) => { }}
							//dataList={(data: any) => { setViewBuilderData(data) }}
							viewListOnChange={(data: any) => { }}
							requiredColumns={['name', 'status']}
						/>
					},
					grid: {
						headers: columns,
						data: rowData,
						getRowId: (params: any) => params.data?.id,
						grouped: true,
						groupIncludeTotalFooter: false,
						rowSelection: 'multiple',
                        groupIncludeFooter: false,
						rowSelected: (e: any) => onRowSelectionChange(e),
						groupDisplayType: 'groupRows',
						nowRowsMsg: '<div>create your first estimate room by clicking + button above</div>',
						onFirstDataRendered:onFirstDataRendered,
						groupRowRendererParams: groupRowRendererParams,
					}
				}
			}}
		/>
		{deleteConfirmation && (
			<SUIAlert
				className={'estimate-room-dialog'}
				open={true}
				DailogClose={false}
				onClose={() => {
					setDeleteConfirmation(false);
				}}
				contentText={'Are you sure you want to delete the selected Estimate(s)'}
				title={'Confirmation'}
				onAction={(e: any, type: string) => {
					type == 'yes' ?  null :
					setDeleteConfirmation(false);
				}}
				negativeAction="No"
				showActions={true}
				modelWidth={'610px'}
			/>
		)}
		
			</>
		)
	);
};

export default EstimateRoomWindow;