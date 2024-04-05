import { AgGridReact } from "ag-grid-react";
import { getServer, setCurrencySymbol, setServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { currency, isLocalhost } from "app/utils";
import { appInfoData } from "data/appInfo";
import { useState, useRef, useEffect } from "react";
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
	const { toast, sourceList, changeEventIframeActive } = useAppSelector((state) => state.changeEventRequest);
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
	const columns = [
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
			width: 220,
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
					headerName: 'BidPackage',
					field: 'bidpackage',
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
    ]
    const data = [{
        id: 1,
        name:'Budget1',
        status: 'Active',
				description: 'Budget 1 description',
				bidpackage:'NA',
        createdBy: {name: 'Justin, Robinson', date: new Date()},
        modifiedBy: {name: 'Justin, Robinson', date: new Date()},
        },
        {
            id: 2,
            name:'Budget2',
            status: 'Draft',
						description: 'Budget 2 description',
						bidpackage:'NA',
            createdBy: {name: 'Justin, Parker', date: new Date()},
            modifiedBy: {name: 'Justin, Kelly', date: new Date()},
            },
            {
                id: 3,
                name:'Budget For Tools and Materials',
                status: 'Deactivated',
								description: 'Budget',
								bidpackage:'NA',
                createdBy: {name: 'Anne, Peterson', date: new Date()},
                modifiedBy: {name: 'Anne, Peterson', date: new Date()},
            },
    ]
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
    
    const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: 'budgetRoomIframe', roomId: server && server.presenceRoomId, appType: 'BudgetRoom' }
		});
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
						leftItems: < LeftSideToolBarButtons/>,
						rightItems: <RightSideToolBarButtons />,
						searchComponent: {
							show: true,
							type: 'regular',
							// defaultFilters: defaultFilters,
							// defaultGroups: activeGroupKey,
							// groupOptions: isChangeEventSC() ? scGroupOptions : gcGroupOptions,
							// filterOptions: filterOptions,
							// onGroupChange: onGroupingChange,
							// onSearchChange: onGridSearch,
							// onFilterChange: (value: any) => { onFilterChange(value) },
							// placeholder: viewData?.viewName,
							viewBuilderapplied: true,
						},
						// viewBuilder: <ViewBuilder
						// 	moduleName={modName}
						// 	appInfo={appInfo}
						// 	dropDownOnChange={(value: any, data: any) => { handleDropDown(value, data) }}
						// 	saveView={(data: any) => { saveViewHandler(data) }}
						// 	deleteView={() => { DeleteViewHandler() }}
						// 	saveNewViewData={(data: any) => { saveNewViewHandler(data) }}
						// 	//dataList={(data: any) => { setViewBuilderData(data) }}
						// 	viewListOnChange={(data: any) => { viewListOnChange(data) }}
						// 	requiredColumns={['name', 'status']}
						// />
					},
					grid: {
						headers: columns,
						data: [...data],
						getRowId: (params: any) => params.data?.id,
						grouped: true,
						groupIncludeTotalFooter: false,
						rowSelection: 'single',
            groupIncludeFooter: false,
						// rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						nowRowsMsg: '<div>Create New Change Event Request by Clicking the + Add button above</div>',
						// groupRowRendererParams: groupRowRendererParams,
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
				// negativeAction="No"
				showActions={true}
				modelWidth={'610px'}
			/>
		)}
		
			</>
		)
	);
};

export default EstimateRoomWindow;