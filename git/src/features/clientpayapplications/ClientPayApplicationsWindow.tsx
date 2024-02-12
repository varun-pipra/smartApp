import './ClientPayapplicationWindow.scss';

import {
	getServer, setCostUnitList, setCurrencySymbol, setServer
} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector, useHomeNavigation} from 'app/hooks';
import {currency, isLocalhost, postMessage} from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import {appInfoData} from 'data/appInfo';
import {getClientCompanies} from 'features/clientContracts/stores/ClientContractsSlice';
import _ from 'lodash';
import {useEffect, useMemo, useState, useRef, memo} from 'react';
import {useLocation} from 'react-router-dom';
import SUIAlert from 'sui-components/Alert/Alert';
import {triggerEvent} from 'utilities/commonFunctions';
import {
	vendorPayAppsPaymentStatus, vendorPayAppsPaymentStatusColors, vendorPayAppsPaymentStatusFilterOptions, vendorPayAppsPaymentStatusIcons,
	vendorPayAppsPaymentStatusOptions
} from 'utilities/vendorPayApps/enums';

import {formatDate} from '@fullcalendar/react';
import {Button} from '@mui/material';

import ClientPayApplicationsForm from './clientpayapplicationscontent/clientpayapplicationsform/ClientPayApplicationsForm';
import ClientPayAppToolbarLeftButtons from './clientpayapplicationscontent/toolbarbuttons/LeftToolbarButtons';
import ClientPayAppToolbarRightButtons from './clientpayapplicationscontent/toolbarbuttons/RightToolbarButtons';
import ClientPayApplicationsLID from './clientpayapplicationsdetails/ClientPayApplicationsLID';
import {
	getClientPayAppDetailsById, getToastMessage, setSelectedRecord,
	setShowLineItemDetails, setToastMessage, setCPayAppId, setTab
} from './stores/ClientPayAppsSlice';
import {getClientPayAppsList, setSelectedRows} from './stores/GridSlice';
import {isUserGCForCPA} from './utils';
import {CustomGroupHeader} from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import CustomFilterHeader from 'features/common/gridHelper/CustomFilterHeader';
import {AgGridReact} from 'ag-grid-react';
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';
import {blockchainStates, checkBlockchainStatus} from 'app/common/blockchain/BlockchainSlice';

var tinycolor = require('tinycolor2');
let defaultCPAStatusFilter: any = [];
let cpaBlockchain = false;

const ClientPayApplicationsWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const iframeId = 'clientPayAppIframe',
		appType = 'ClientPayApps';

	const location = useLocation();
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const {gridData, gridOriginalData} = useAppSelector((state) => state.clientPayAppsGrid);
	const [statusFilters, setStatusFilters] = useState<any>(false);
	const ToastMessage = useAppSelector(getToastMessage);
	const [showToastMessage, setShowToastMessage] = useState<any>('');
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [isFullView, setFullView] = useState(false);
	const [rowData, setRowData] = useState<any>(gridData);
	const [columns, setColumns] = useState<any>([]);
	const groupKeyValue = useRef<any>(null);
	const [mainGridFilters, setMainGridFilters] = useState<any>({});
	const [activeMainGridDefaultFilters, setActiveMainGridDefaultFilters] = useState<any>();
	const [filteredRecords, setFilteredRecords] = useState<any>([]);
	const [gridSearchText, setGridSearchText] = useState<any>('');
	const [selectedGroup, setSelectedGroup] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const {blockchainEnabled} = useAppSelector((state) => state.blockchain);
	const cpaBlockchainRef: any = useRef(false);
	useEffect(()=> {
		cpaBlockchainRef.current = blockchainEnabled;
		if (gridRef?.current?.api) {
			setTimeout(()=> {
				gridRef?.current?.api?.refreshCells({
					force: true,
					rowNodes: gridRef?.current?.api?.getRenderedNodes() || [],
				})
			}, 500)
		}
	},[blockchainEnabled])

	const groupOptions = [
		{text: 'Payment Status', value: 'status'},
		{text: 'Contracts', value: 'contract.name'},
		{text: 'Clients', value: 'client.name'},
	];

	let gridRef = useRef<AgGridReact>();
	const filterOptions = [
		{
			text: 'Payment Status',
			value: 'status',
			key: 'status',
			// iconCls: 'common-icon-Safety-Onboarding-Flyer',
			children: {
				type: 'checkbox',
				items: vendorPayAppsPaymentStatusFilterOptions,
			},
		},
		{
			text: 'Contracts',
			value: 'contract',
			key: 'contract',
			// iconCls: 'common-icon-Safety-Onboarding-Flyer',
			children: {
				type: 'checkbox',
				items: [],
			},
		},
		{
			text: 'Clients',
			value: 'client',
			key: 'client',
			// iconCls: 'common-icon-name-id',
			children: {
				type: 'checkbox',
				items: [],
			},
		},
	];

	if(statusFilter) defaultCPAStatusFilter = mainGridFilters.status;

	const [filters, setFilters] = useState<any>(filterOptions);
	const [groups, setGroups] = useState<any>(groupOptions);

	const tabEnum: any = {
		payAppDetails: 'pay-Application-Details',
		sov: 'billing-Schedules',
		lienWaiver: 'lien-Waiver',
		links: 'links'
	};

	useEffect(() => {
		setRowData(gridData);
		setFilteredRecords(gridData);
		const filtersCopy = [...filters];
		let clientItem = filtersCopy.find((rec: any) => rec.value === 'client');
		let contractItem = filtersCopy.find((rec: any) => rec.value === 'contract');

		const clientVendors: any = Array.from(new Map((gridData || []).map((item: any) =>
			[item?.client?.id, {text: item?.client?.name, key: item?.client?.id, value: item?.client?.id}])).values());
		clientItem.children.items = clientVendors;

		const uniqueContracts: any = Array.from(new Map((gridData || []).map((item: any) =>
			[item?.contract?.id, {text: item?.contract?.name, key: item?.contract?.id, value: item?.contract?.id}])).values());
		contractItem.children.items = uniqueContracts;
		setFilters([...filtersCopy]);
	}, [gridData]);

	const onGridSearch = (gridData: any) => {
		const filteredIds = gridData?.map((obj: any) => obj?.id);
		const firstResult = gridOriginalData.filter((obj: any) => {
			return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(gridSearchText?.toLowerCase());
		});
		return firstResult;
	};

	const FilterBy = (data: any, filterValues: any) => {
		const gridDataCopy = [...data];
		let filteredData = gridDataCopy;
		if(!filterValues?.status) setStatusFilters({ids: [], names: []});
		if(filterValues?.status?.length > 0) {
			filteredData = gridDataCopy.filter((rec: any) => {
				return filterValues?.status?.includes(rec.status);
			});
			let statusIds: any = [];
			let statusNames: any = [];
			const filters = filterValues?.status?.map((ele: any) => {
				statusIds.push(ele);
				statusNames.push(vendorPayAppsPaymentStatus[ele]);
			});
			setStatusFilters({ids: [...statusIds], names: [...statusNames]});
		} else if(Object.keys(filterValues).length === 0 || (filterValues?.status?.length === 0 ?? false)) {
			setStatusFilters({ids: [], names: []});
		};
		if(filterValues?.client?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return filterValues?.client?.includes(rec?.client?.id);
			});
		}
		if(filterValues?.contract?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return filterValues?.contract?.includes(rec?.contract?.id);
			});
		}
		return filteredData;
	};

	const onGroupingChange = (groupKey: any) => {
		const columnsCopy = [...columns];
		if(((groupKey ?? false) && groupKey !== '')) {
			groupKeyValue.current = groupKey;
		} else if(groupKey ?? true) {
			groupKeyValue.current = null;
		};
		setSelectedGroup(groupKey);
	};

	const onFilterChange = (activeFilters: any) => {
		if(activeFilters) {
			let filterObj = activeFilters;
			Object.keys(filterObj).filter((item) => {
				if(filterObj[item]?.length === 0) {
					delete filterObj[item];
				};
			});
			if(!_.isEqual(mainGridFilters, filterObj)) {
				setMainGridFilters(filterObj);
			};
		};
	};

	useEffect(() => {
		const gridDataCopy = [...gridData];
		let data: any;
		if(mainGridFilters && Object.keys(mainGridFilters)?.length > 0) {
			data = FilterBy(gridDataCopy, mainGridFilters);
			if(gridSearchText !== '') {
				let SearchGridData = onGridSearch(data);
				setRowData(SearchGridData);
			} else {
				setRowData(data);
			};
		} else if(gridSearchText !== '') {
			let SearchGridData = onGridSearch(gridDataCopy);
			setRowData(SearchGridData);
			setStatusFilters({ids: [], names: []});
		} else {
			setRowData([...gridDataCopy]);
			setStatusFilters({ids: [], names: []});
		};
	}, [mainGridFilters, gridSearchText, gridData]);

	const queryParams: any = new URLSearchParams(location.search);
	useEffect(() => {
		if(queryParams?.size > 0) {
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');
			setFullView(queryParams?.get('inlineModule') === 'true');
			if(queryParams?.get('id')) {
				dispatch(setCPayAppId(queryParams?.get('id')));
				dispatch(setShowLineItemDetails(true));

				if(queryParams?.get('tab')) {
					dispatch(setTab(tabEnum[queryParams?.get('tab')]));
				}
			}
		}
	}, [location]);

	useEffect(() => {
		setShowToastMessage(ToastMessage);
		setTimeout(() => {setShowToastMessage(''); dispatch(setToastMessage(''));}, 3000);
	}, [ToastMessage]);

	useEffect(() => {
		const filtersCopy = [...filters];
		const groupsCopy = [...groups];
		let statusItem = filtersCopy.find((rec: any) => rec.value === 'status');
		let groupItem = groupsCopy.find((rec: any) => rec.value === "status");
		if(appInfo && !isUserGCForCPA(appInfo)) {
			statusItem.text = 'Response Status';
			groupItem.text = 'Response Status';
		}
		dispatch(checkBlockchainStatus('ClientPayApplication'));
		dispatch(getClientPayAppsList(appInfo));
		dispatch(getClientCompanies(appInfo));
	}, [appInfo]);

	useEffect(() => {
		if(localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
		} else {
			if(!appInfo) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == 'string' ? JSON.parse(data) : data;
					data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
					if(data) {
						switch(data.event || data.evt) {
							case 'hostAppInfo':
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
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
					body: {iframeId: 'clientPayIframe', roomId: appInfo && appInfo.presenceRoomId, appType: appType}
				});
			}
		}
	}, [localhost, appData]);

	const onClick = (values: any) => {
		setActiveMainGridDefaultFilters({...mainGridFilters, status: [...values?.ids]});
		if(values?.ids?.length) {
			let data = gridOriginalData.map((row: any) => {
				if(values?.ids?.includes(row?.status)) return row;
				return;
			});
			data = data.filter(function (element: any) {
				return element !== undefined;
			});
			setRowData(data);
		} else {
			setStatusFilters({ids: [], names: []});
			setRowData(gridOriginalData);
		}
	};

	const handleStatusFilter = (statusFilters: any) => {
		setMainGridFilters((prevFilters: any) => {
			const consolidatedFilter = {...prevFilters, ...{status: statusFilters}};
			setActiveMainGridDefaultFilters(consolidatedFilter);
			return consolidatedFilter;
		});
	};

	const handleStatusColumnSort = (direction: any) => {
		gridRef?.current?.columnApi?.applyColumnState({
			state: [{colId: 'status', sort: direction}],
			defaultState: {sort: null}
		});
	};

	const headers: any = useMemo(() => appInfo ? [
		{
			headerName: 'Pay ID',
			pinned: 'left',
			field: 'code',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 100,
			cellRenderer: 'agGroupCellRenderer',
			valueGetter: (params: any) => params.data?.code,
			comparator: (valueA: any, valueB: any) =>
				valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			cellRendererParams: {
				// checkbox: true,
				suppressDoubleClickExpand: true,
				innerRenderer: (params: any) => {
					const bcStatus = params.data?.blockChainStatus;
					const showBCIcon = (cpaBlockchainRef?.current && blockchainStates.indexOf(bcStatus) === -1);
					return (
						<>
							{showBCIcon && <span className='common-icon-Block-chain' style={{position: 'absolute', left: '2%', marginTop: '8px', fontSize: '1.6em'}}></span>}
							<span
								className='ag-costcodegroup'
								style={{
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									color: '#059CDF',
								}}
							>
								{params.data?.code}
							</span>
						</>
					);
				},
			},
		},
		{
			headerName: isUserGCForCPA(appInfo) ? 'Payment Status' : 'Response Status',
			pinned: 'left',
			field: 'status',
			width: 325,
			// filter: true,
			// valueGetter: (params:any) => params?.data?.status ? getBidStatus(params?.data?.status) : '',
			// headerComponent: CustomHeader,
			// headerComponentParams: {
			// 	options: vendorPayAppsPaymentStatusOptions,
			// 	columnName: isUserGCForCPA(appInfo) ? 'Payment Status': 'Response Status',
			// 	defaultFilters: statusFilters,
			// 	filterUpdated: (values: any) => onClick(values),
			// },
			rowGroup: selectedGroup === 'status',
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: isUserGCForCPA(appInfo) ? 'Payment Status' : 'Response Status',
				options: vendorPayAppsPaymentStatusOptions,
				defaultFilters: defaultCPAStatusFilter,
				onSort: handleStatusColumnSort,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			cellRenderer: (params: any) => {
				return vendorPayAppsPaymentStatus[params?.data?.status] ? (
					vendorPayAppsPaymentStatus[params?.data?.status] ===
						'Summary' ? (
						params?.value
					) : (
						<IQTooltip
							title={
								vendorPayAppsPaymentStatus[params?.data?.status]
									?.length > 11
									? vendorPayAppsPaymentStatus[params?.data?.status]
									: ''
							}
						>
							<Button
								disabled
								variant='contained'
								startIcon={
									<span
										className={
											vendorPayAppsPaymentStatusIcons[
											params?.data?.status
											]
										}
										style={{color: 'white'}}
									/>
								}
								// startIcon={<Box component='img' src={StatusIcons[params?.data?.status]} style={{ height: '16px', width: '16px' }} />}
								style={{
									backgroundColor: `${vendorPayAppsPaymentStatusColors[
										params.data?.status
									]
										}`,
									color: tinycolor(
										vendorPayAppsPaymentStatusColors[
										params.data?.status
										]
									).isDark()
										? 'white'
										: 'black',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									width: 'auto',
									paddingLeft: '10px',
									paddingRight: '10px',
									minWidth: '50px',
									textOverflow: 'ellipsis',
								}}
							>
								{vendorPayAppsPaymentStatus[params?.data?.status]}
							</Button>
						</IQTooltip>
					)
				) : (
					<></>
				);
			},
		},
		{
			headerName: 'Contract',
			field: 'contract.name',
			minWidth: 220,
			rowGroup: selectedGroup === 'contract.name'
		},
		{
			headerName: 'PO Number',
			field: 'poNumber',
			minWidth: 150,
		},
		{
			headerName: 'Client Company',
			field: 'client.name',
			rowGroup: selectedGroup === 'client.name'
		},
		{
			headerName: 'Invoice Amount',
			field: 'invoiceAmount',
			sum: 'aggFunc',
			type: 'rightAligned',
			valueGetter: (params: any) => params.data?.invoiceAmount && amountFormatWithSymbol(params.data?.invoiceAmount),
		},
		{
			headerName: 'Pay Application Amount',
			field: 'amount',
			sum: 'aggFunc',
			minWidth: 220,
			type: 'rightAligned',
			valueGetter: (params: any) => params.data?.amount && amountFormatWithSymbol(params.data?.amount),
		},
		{
			headerName: 'Submitted Date',
			field: 'submittedOn',
			valueGetter: (params: any) =>
				params.data?.submittedOn
					? formatDate(params.data?.submittedOn)
					: '',
		},
	]
		: [], [appInfo, defaultCPAStatusFilter, selectedGroup, blockchainEnabled]);

	// const onRowDoubleClick = (row: any, tableRef: any) => {
	// 	if(row && row.data) {
	// 		// console.log('node', row?.node);
	// 		if(props?.onRefChange) props?.onRefChange(tableRef);
	// 		dispatch(setShowLineItemDetails(true));
	// 		dispatch(setSelectedNode(row?.node));
	// 		dispatch(setSelectedRecord(row?.data));
	// 	}
	// };

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedRows(sltdRows));
	};

	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: {iframeId: iframeId, roomId: appInfo && appInfo.presenceRoomId, appType: appType}
		});
	};

	const onFirstDataRendered = () => {
		const params = new URLSearchParams(window.location.search);
		if(params.has('id')) {
			const selectedRecId = params.get('id');
			const selectedRec = rowData.find((rec: any) => rec.id === selectedRecId);
			setManualLIDOpen(true);
			dispatch(setSelectedRecord(selectedRec));
			dispatch(getClientPayAppDetailsById({appInfo: appInfo, id: selectedRecId}));
		}
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if(node.group) {
			const colName = groupKeyValue?.current;
			console.log('cellerender', colName, node?.group);
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if(colName === 'status') {
				return (
					<div style={{display: 'flex'}}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={vendorPayAppsPaymentStatus[data?.status]} colName={colName}
						/>
					</div>
				);
			} else if(colName === 'contract.name') {
				console.log('contract', colName);
				return (
					<div style={{display: 'flex'}}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={data?.contract?.name} colName={colName}
						/>
					</div>
				);
			} else if(colName === 'client.name') {
				return (
					<div style={{display: 'flex'}}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={data?.client?.name} colName={colName}
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

	const handleIconClick = () => {
		if(isInline) useHomeNavigation(iframeId, appType);
	};

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		appInfo && (isUserGCForCPA(appInfo) !== 'Not Authorized' ? <div className='client-pay-applications-cls'><GridWindow
			open={true}
			className='client-pay-app-cls'
			iconCls='common-icon-pay-application'
			title='Client Pay Applications'
			defaultTabId='pay-Application-Details'
			companyInfo={!isUserGCForCPA(appInfo)}
			centerPiece={!isUserGCForCPA(appInfo) && `Below are all Pay Applications for your company '${appInfo?.currentUserInfo?.company}' for the Project '${appInfo?.currentProjectInfo?.name}'.`}
			appType={appType}
			appInfo={appInfo}
			iFrameId={iframeId}
			isFromHelpIcon={true}
			zIndex={100}
			gridRef={gridRef}
			onClose={handleClose}
			manualLIDOpen={manualLIDOpen}
			moduleColor='#00e5b0'
			inlineModule={isInline}
			isFullView={isFullView}
			maxByDefault={isMaxByDefault}
			showBrena={appInfo?.showBrena}
			onIconClick={handleIconClick}
			presenceProps={{
				presenceId: 'clientpayapp-presence',
				showBrena: false,
				showLiveSupport: true,
				showLiveLink: true,
				showStreams: true,
				showComments: true,
				showChat: false,
				hideProfile: false,
			}}
			righPanelPresenceProps={{
				presenceId: "clientpayapp-presence",
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
			toast={showToastMessage}
			content={{
				headContent: {regularContent: <ClientPayApplicationsForm />},
				detailView: ClientPayApplicationsLID,
				gridContainer: {
					toolbar: {
						leftItems: <ClientPayAppToolbarLeftButtons />,
						rightItems: <ClientPayAppToolbarRightButtons />,
						searchComponent: {
							show: true,
							type: 'regular',
							onSearchChange: (val: any) => setGridSearchText(val),
							groupOptions: isUserGCForCPA(appInfo) ? groups : [groups[0], groups[1]],
							filterOptions: isUserGCForCPA(appInfo) ? filters : [filters[0], filters[1]],
							onGroupChange: onGroupingChange,
							onFilterChange: onFilterChange,
							defaultFilters: activeMainGridDefaultFilters,
						}
					},
					grid: {
						headers: headers,
						data: rowData,
						getRowId: (params: any) => params.data?.id,
						grouped: true,
						groupIncludeTotalFooter: false,
						groupIncludeFooter: false,
						rowSelection: 'single',
						// onRowDoubleClicked:onRowDoubleClick,
						onFirstDataRendered: onFirstDataRendered,
						rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						groupRowRendererParams: groupRowRendererParams,
						nowRowsMsg: '<div>Create New Client Pay Applications by Clicking the + Add button above</div>',
					}
				}
			}}
		/></div>
			: <SUIAlert
				open={true}
				DailogClose={true}
				onClose={() => {
					postMessage({
						event: 'closeiframe',
						body: {iframeId: iframeId, roomId: appInfo && appInfo.presenceRoomId, appType: 'clientPayApp'}
					});
				}}
				contentText={'You Are Not Authorized'}
				title={'Warning'}
				onAction={(e: any, type: string) => {
					type == 'close' && postMessage({
						event: 'closeiframe',
						body: {iframeId: iframeId, roomId: appInfo && appInfo.presenceRoomId, appType: 'clientPayApp'}
					});
				}}
				showActions={false}
			/>));
};

export default memo(ClientPayApplicationsWindow);