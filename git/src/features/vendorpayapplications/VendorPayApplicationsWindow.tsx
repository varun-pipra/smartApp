import './VendorPayApplicationsWindow.scss';

import {
	getServer, setCostUnitList, setCurrencySymbol, setServer
} from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector, useHomeNavigation } from 'app/hooks';
import { currency, isLocalhost, postMessage } from 'app/utils';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { appInfoData } from 'data/appInfo';
import { fetchCompanyList } from 'features/vendorcontracts/stores/VendorContractsSlice';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SUIAlert from 'sui-components/Alert/Alert';
import { triggerEvent } from 'utilities/commonFunctions';
import {
	vendorPayAppsPaymentStatus, vendorPayAppsPaymentStatusColors, vendorPayAppsPaymentStatusFilterOptions, vendorPayAppsPaymentStatusIcons,
	vendorPayAppsPaymentStatusOptions
} from 'utilities/vendorPayApps/enums';

import { formatDate } from '@fullcalendar/react';
import { Button } from '@mui/material';

import { CustomGroupHeader } from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import { getVendorPayAppsLst, setSelectedRows } from './stores/gridSlice';
import {
	getPayAppDetails, getToastMessage, setSelectedRecord, setShowLineItemDetails,
	setToastMessage, setVPayAppId, setTab
} from './stores/VendorPayAppSlice';
import { isUserGCForVPA } from './utils';
import VendorPayAppToolbarLeftButtons from './vendorpayapplicationscontent/toolbarbuttons/LeftToolbarButtons';
import VendorPayAppToolbarRightButtons from './vendorpayapplicationscontent/toolbarbuttons/RightToolbarButtons';
import VendorPayApplicationsForm from './vendorpayapplicationscontent/vendorpayapplicationsform/VendorPayApplicationsForm';
import VendorPayApplicationsLID from './vendorpayapplicationsdetails/VendorPayApplicationsLID';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';
import CustomFilterHeader from 'features/common/gridHelper/CustomFilterHeader';
import { AgGridReact } from 'ag-grid-react';
import ViewBuilder from 'sui-components/ViewBuilder/ViewBuilder';
import { ViewBuilderOptions } from "sui-components/ViewBuilder/utils";
import { deleteView, addNewView, updateViewItem } from "sui-components/ViewBuilder/Operations/viewBuilderAPI";
import { fetchViewBuilderList, fetchViewData } from "sui-components/ViewBuilder/Operations/viewBuilderSlice";
import { blockchainStates,checkBlockchainStatus } from 'app/common/blockchain/BlockchainSlice';
import { fetchConnectors } from 'features/budgetmanager/operations/gridSlice';

var tinycolor = require('tinycolor2');
let defaultVPAStatusFilter: any = [];
let vpaBlockchain = false;

const VendorPayApplicationsWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const modName = 'vendorpayapp';
	const location = useLocation();
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const { gridData, gridOriginalData, refreshed } = useAppSelector((state) => state.VPAGrid);
	const [columns, setColumns] = useState<any>([]);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	// const [statusFilter, setStatusFilter] = useState<any>({ids: [], names: []});
	const ToastMessage = useAppSelector(getToastMessage);
	const [showToastMessage, setShowToastMessage] = useState<any>('');
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [isFullView, setFullView] = useState(false);
	const [rowData, setRowData] = useState<any>(gridData);
	const groupKeyValue = useRef<any>(null);
	const [mainGridFilters, setMainGridFilters] = useState<any>({});
	const [activeMainGridDefaultFilters, setActiveMainGridDefaultFilters] = useState<any>();
	const [filteredRecords, setFilteredRecords] = React.useState<any>([]);
	const [aliasOriginalGridData, setAliasOriginalGridData] = useState(gridOriginalData);
	const [gridSearchText, setGridSearchText] = useState<any>('');
	const [selectedGroup, setSelectedGroup] = useState<string>('None');
	const [viewBuilderData, setViewBuilderData] = useState<any>({ viewName: "", viewId: "" });
	const [colDef, setColDef] = useState<any>([]);

	let gridRef = useRef<AgGridReact>();
	if (statusFilter) defaultVPAStatusFilter = mainGridFilters.status;
	const { blockchainEnabled } = useAppSelector((state) => state.blockchain);
	const vpaBlockchainRef: any = useRef(false);
	useEffect(()=> {
		vpaBlockchainRef.current = blockchainEnabled;
		if (gridRef?.current?.api) {
			setTimeout(()=> {
				gridRef?.current?.api?.refreshCells({
					force: true,
					rowNodes: gridRef?.current?.api?.getRenderedNodes() || [],
				})
			}, 500)
		}
	}, [blockchainEnabled])

	const tabEnum: any = {
		payAppDetails: 'pay-Application-Details',
		sov: 'schedule-of-Values',
		lienWaiver: 'lien-Waiver',
		links: 'links'
	};

	useEffect(() => {
		if (gridOriginalData?.length) {
			let updatedGridData = gridOriginalData.map((obj: any) => ({
				...obj,
				aliasStatus: vendorPayAppsPaymentStatus[obj['status']] || '',
				aliasSubmitDate: formatDate(obj['submittedOn']) || ''
			}));
			setAliasOriginalGridData(updatedGridData);
		}
	}, [gridOriginalData]);

	useEffect(() => {
		if (refreshed) {
			console.log("refesh", refreshed);
			setActiveMainGridDefaultFilters({});
			groupKeyValue.current = null;
		}
	}, [refreshed]);

	const groupOptions = [
		{ text: "Payment Status", value: "status" },
		{ text: "Contracts", value: "contract.name" },
		{ text: "Vendors", value: "vendor.name" },
	];
	//isUserGCForVPA(appInfo) ? 'Payment Status' : 'Response Status',
	const filterOptions = [
		{
			text: "Payment Status",
			value: "status",
			key: "status",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: vendorPayAppsPaymentStatusFilterOptions,
			},
		},
		{
			text: "Contracts",
			value: "contract",
			key: "contract",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: "Vendors",
			value: "vendor",
			key: "vendor",
			// iconCls: "common-icon-name-id",
			children: {
				type: "checkbox",
				items: [],
			},
		},
	];

	const [filters, setFilters] = useState<any>(filterOptions);
	const [groups, setGroups] = useState<any>(groupOptions);
	const queryParams: any = new URLSearchParams(location.search);

	useEffect(() => {
		// const {search} = location;
		if (queryParams?.size > 0) {
			// const params: any = new URLSearchParams(search);
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');
			setFullView(queryParams?.get('inlineModule') === 'true');

			if (queryParams?.get("id")) {
				dispatch(setVPayAppId(queryParams?.get("id")));
				dispatch(setShowLineItemDetails(true));

				if (queryParams?.get("tab")) {
					dispatch(setTab(tabEnum[queryParams?.get("tab")]));
				}
			}
		}
	}, [location]);

	useEffect(() => {
		setShowToastMessage(ToastMessage);
		setTimeout(() => { setShowToastMessage(''); dispatch(setToastMessage('')); }, 3000);
	}, [ToastMessage]);

	useEffect(() => {
		const filtersCopy = [...filters];
		const groupsCopy = [...groups];
		if (appInfo) {
			let statusItem = filtersCopy.find((rec: any) => rec.value === "status");
			let groupItem = groupsCopy.find((rec: any) => rec.value === "status");
			if (appInfo && !isUserGCForVPA(appInfo)) {
				statusItem.text = 'Response Status';
				groupItem.text = 'Response Status';
			}
			dispatch(checkBlockchainStatus('VendorPayApplication'));
			dispatch(fetchCompanyList(appInfo));
			dispatch(getVendorPayAppsLst(appInfo));
			dispatch(fetchConnectors(appInfo));
		}
	}, [appInfo]);

	useEffect(() => {
		if (localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
		} else {
			if (!appInfo) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == 'string' ? JSON.parse(data) : data;
					data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
					if (data) {
						switch (data.event || data.evt) {
							case 'hostAppInfo':
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								//dispatch(setCostUnitList(structuredData?.DivisionCost?.CostUnit));
								dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case 'getdrivefiles':
								try {
									// setDriveFileQueue(data.data);
								} catch (error) {
									console.log('Error in adding Vendor Contract Additional File from Drive:', error);
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
								console.log("frame-active", data, appInfo);
								data?.data?.name == "vendorpayapp" && dispatch(getVendorPayAppsLst(appInfo));
								break;
						}
					}
				};
				postMessage({
					event: 'hostAppInfo',
					body: { iframeId: 'vendorPayAppsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorPayApps' }
				});
			}
		}
	}, [localhost, appData]);

	// const onClick = (values: any) => {
	// 	setActiveMainGridDefaultFilters({ ...mainGridFilters, status: [...values?.ids] });
	// 	if (values?.ids?.length) {
	// 		let data = gridOriginalData.map((row: any) => {
	// 			if (values?.ids?.includes(row?.status)) return row;
	// 			return;
	// 		});
	// 		data = data.filter(function (element: any) {
	// 			return element !== undefined;
	// 		});
	// 		// setStatusFilter(false);
	// 		setRowData(data);
	// 		// } else {
	// 		// 	setStatusFilter({ids: [], names: []});
	// 		// 	// setStatusFilter(true);
	// 		// 	setRowData(gridOriginalData);
	// 	}
	// };

	useEffect(() => {
		setRowData(gridData);
		setFilteredRecords(gridData);
		const filtersCopy = [...filters];
		let vendorItem = filtersCopy.find((rec: any) => rec.value === "vendor");
		let contractItem = filtersCopy.find((rec: any) => rec.value === "contract");

		const uniqueVendors: any = Array.from(new Map((gridData || []).map((item: any) =>
			[item?.vendor?.id, { text: item?.vendor?.name, key: item?.vendor?.id, value: item?.vendor?.id }])).values());
		vendorItem.children.items = uniqueVendors;

		const uniqueContracts: any = Array.from(new Map((gridData || []).map((item: any) =>
			[item?.contract?.id, { text: item?.contract?.name, key: item?.contract?.id, value: item?.contract?.id }])).values());
		contractItem.children.items = uniqueContracts;

		setFilters(filtersCopy);
	}, [gridData]);

	const onGridSearch = (gridData: any) => {
		const filteredIds = gridData?.map((obj: any) => obj?.id);
		const firstResult = gridOriginalData.filter((obj: any) => {
			return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(gridSearchText?.toLowerCase());
		});
		return firstResult;
	};

	const FilterBy = (data: any) => {
		const gridDataCopy = [...data];
		let filteredData = gridDataCopy;
		// if(!mainGridFilters?.status) setStatusFilter({ids: [], names: []});
		if (mainGridFilters?.status?.length > 0) {
			filteredData = gridDataCopy.filter((rec: any) => {
				return mainGridFilters?.status?.includes(rec.status);
			});
		} else if (Object.keys(mainGridFilters).length === 0 || (mainGridFilters?.status?.length === 0 ?? false)) {
			// setStatusFilter({ids: [], names: []});
		};
		if (mainGridFilters?.vendor?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return mainGridFilters?.vendor?.includes(rec?.vendor?.id);
			});
		}
		if (mainGridFilters?.contract?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return mainGridFilters?.contract?.includes(rec?.contract?.id);
			});
		}
		return filteredData;
	};

	const onGroupingChange = (groupKey: any) => {
		const data = groupKey == null || groupKey == 'undefined' ? 'None' : groupKey;
		if (((data ?? false) && data !== "")) {
			groupKeyValue.current = data;
		} else if (data ?? true) {
			groupKeyValue.current = null;
		};
		setSelectedGroup(data);
	};

	const onFilterChange = (activeFilters: any) => {
		if (activeFilters) {
			let filterObj = activeFilters;
			Object.keys(filterObj).filter((item) => {
				if (filterObj[item]?.length === 0) {
					delete filterObj[item];
				};
			});
			if (!_.isEqual(mainGridFilters, filterObj)) {
				setMainGridFilters(filterObj);
			};
		};
	};

	useEffect(() => {
		const gridDataCopy = [...gridData];
		let data: any;
		if (mainGridFilters && Object.keys(mainGridFilters)?.length > 0) {
			console.log('mainGridFilters', mainGridFilters);
			data = FilterBy(gridDataCopy);
			if (gridSearchText !== "") {
				let SearchGridData = onGridSearch(data);
				setRowData(SearchGridData);
			} else {
				setRowData(data);
			};
		} else if (gridSearchText !== "") {
			let SearchGridData = onGridSearch(gridDataCopy);
			setRowData(SearchGridData);
		} else {
			setRowData([...gridDataCopy]);
		};
	}, [mainGridFilters, gridSearchText, gridData]);

	const handleStatusFilter = (statusFilters: any) => {
		setMainGridFilters((prevFilters: any) => {
			const consolidatedFilter = { ...prevFilters, ...{ status: statusFilters } };
			setActiveMainGridDefaultFilters(consolidatedFilter);
			return consolidatedFilter;
		});
	};

	const handleStatusColumnSort = (direction: any) => {
		gridRef?.current?.columnApi?.applyColumnState({
			state: [{ colId: 'status', sort: direction }],
			defaultState: { sort: null }
		});
	};

	const headers = useMemo<Array<any>>(() => appInfo ? [
		{
			headerName: 'Pay ID',
			pinned: 'left',
			field: 'code',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 100,
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			_cellRenderer: (params: any) => {
				const bcStatus = params.data?.blockChainStatus;
				const showBCIcon = (vpaBlockchainRef?.current && blockchainStates.indexOf(bcStatus) === -1);
				return (
					<>
						{showBCIcon && <span className='common-icon-Block-chain' style={{ position: 'absolute', left: '2%', marginTop: '8px', fontSize: '1.6em' }}></span>}
						<span
							className="ag-costcodegroup"
							style={{
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								overflow: "hidden",
								color: "#059CDF",
							}}
						>
							{params.data?.code}
						</span>
					</>
				);
			},
			get cellRenderer() {
				return this._cellRenderer;
			},
			set cellRenderer(value) {
				this._cellRenderer = value;
			},
		},
		{
			headerName: isUserGCForVPA(appInfo) ? 'Payment Status' : 'Response Status',
			pinned: 'left',
			field: 'status',
			rowGroup: selectedGroup === 'status',
			width: 332,
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: isUserGCForVPA(appInfo) ? 'Payment Status' : 'Response Status',
				options: vendorPayAppsPaymentStatusOptions,
				defaultFilters: defaultVPAStatusFilter,
				onSort: handleStatusColumnSort,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			cellRenderer: (params: any) => {
				return vendorPayAppsPaymentStatus[params?.data?.status] ? (
					vendorPayAppsPaymentStatus[params?.data?.status] === 'Summary' ? (
						params?.value
					) : (
						<IQTooltip
							title={
								vendorPayAppsPaymentStatus[params?.data?.status]?.length > 11
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
											vendorPayAppsPaymentStatusIcons[params?.data?.status]
										}
										style={{ color: 'white' }}
									/>
								}
								// startIcon={<Box component='img' src={StatusIcons[params?.data?.status]} style={{ height: '16px', width: '16px' }} />}
								style={{
									backgroundColor: `${vendorPayAppsPaymentStatusColors[params.data?.status]
										}`,
									color: tinycolor(
										vendorPayAppsPaymentStatusColors[params.data?.status]
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
			headerName: 'Vendor/Company',
			field: 'vendor.name',
			rowGroup: selectedGroup === 'vendor.name'
		},
		{
			headerName: 'Invoice Amount',
			field: 'invoiceAmount',
			sum: 'aggFunc',
			type: 'rightAligned',
			valueGetter: (params: any) => amountFormatWithSymbol(params.data?.invoiceAmount)
		},
		{
			headerName: 'Retainage %',
			field: 'retainagePercentage',
			minWidth: 150,
			valueGetter: (params: any) => params.data?.retainagePercentage ? `${params.data?.retainagePercentage} %` : ''
		},
		{
			headerName: 'Retainage Amount',
			field: 'retainageAmount',
			sum: 'aggFunc',
			type: 'rightAligned',
			valueGetter: (params: any) => amountFormatWithSymbol(params.data?.retainageAmount),
		},
		{
			headerName: 'Pay Application Amount',
			field: 'amount',
			sum: 'aggFunc',
			minWidth: 220,
			type: 'rightAligned',
			valueGetter: (params: any) => amountFormatWithSymbol(params.data?.amount)
		},
		{
			headerName: 'Submitted Date',
			field: 'submittedOn',
			valueGetter: (params: any) => params.data?.submittedOn ? formatDate(params.data?.submittedOn) : ''
		}
	] : [], [appInfo, defaultVPAStatusFilter, selectedGroup, blockchainEnabled]);

	const handleClose = () => {
		postMessage({
			event: 'closeiframe',
			body: { iframeId: 'vendorPayAppsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorPayApps' }
		});
	};

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedRows(sltdRows));
	};

	const onFirstDataRendered = () => {
		const params = new URLSearchParams(window.location.search);
		// console.log('onFirstDataRendered params', params);
		if (params.has('id')) {
			const selectedRecId = params.get('id');
			const selectedRec = rowData.find((rec: any) => rec.id === selectedRecId);
			setManualLIDOpen(true);
			dispatch(setSelectedRecord(selectedRec));
			dispatch(getPayAppDetails({ appInfo: appInfo, id: selectedRecId }));
		}
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
							label={vendorPayAppsPaymentStatus[data?.status]} colName={colName}
						/>
					</div>
				);
			} else if (colName === "contract.name") {
				// console.log("contract", colName);
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={data?.contract?.name} colName={colName}
						/>
					</div>
				);
			} else if (colName === "vendor.name") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={data?.vendor?.name} colName={colName}
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
		if (isInline) useHomeNavigation('vendorPayAppIframe', 'VendorPayApps');
	};

	const handleDropDown = (value: any, data: any) => {
		if (value === "save") {
			saveViewHandler(data);
			setShowToastMessage(`${viewBuilderData?.viewName} Saved Successfully`);
		}
		else if (value === "delete") {
			DeleteViewHandler();
			setShowToastMessage(`${viewBuilderData?.viewName} Deleted Successfully`);
		}
	}

	const saveNewViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(mainGridFilters);
		const payload = { ...value, viewFor: modName, filters: FilterValue ? FilterValue : '{}', groups: selectedGroup ? [selectedGroup] : ['None'] };
		console.log('payload', payload);
		addNewView(appInfo, payload, modName, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'VendorPayApp' }));
			dispatch(getVendorPayAppsLst(appInfo));
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewBuilderData?.viewId }));
		});
	}
	const saveViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(mainGridFilters);
		const payload = { ...value, filters: FilterValue ? FilterValue : '{}', groups: selectedGroup ? [selectedGroup] : ['None'] };
		console.log('payload', payload);
		updateViewItem(appInfo, viewBuilderData?.viewId, payload, (response: any) => {
			dispatch(getVendorPayAppsLst(appInfo));
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewBuilderData?.viewId }));
		});
	}
	const DeleteViewHandler = () => {
		deleteView(appInfo, viewBuilderData?.viewId, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'VendorPayApp' }));
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
					headers.forEach((cDef: any) => {
						if (viewItem.field == cDef.field) {
							let newColumnDef = { ...cDef, ...viewItem, hide: viewItem?.hide };
							updatedColumndDefList.push(newColumnDef);
						}
					});
				});
				setColDef([...updatedColumndDefList])
				console.log('updatedColumndDefList', updatedColumndDefList)
				gridApi?.api?.setColumnDefs(updatedColumndDefList);
			}
		}
	}, [viewBuilderData]);

	useMemo(() => {
		if (viewBuilderData?.viewId != '') {
			viewBuilderData?.groups && setSelectedGroup(viewBuilderData?.groups[0] == 'None' ? 'undefined' : viewBuilderData?.groups[0]);
			viewBuilderData?.filters && setActiveMainGridDefaultFilters(JSON.parse(viewBuilderData?.filters));
			viewBuilderData?.filters && setMainGridFilters(JSON.parse(viewBuilderData?.filters));
		}
	}, [viewBuilderData?.viewId])

	useMemo(() => {
		// if grouping value is changed and colDef array as a data.
		// modifing the coldef array, object value rowGroup true or false based on activeMainGridGroupKey
		if (selectedGroup && colDef) {
			const data = colDef?.length > 0 && colDef?.map((item: any) => {
				if (item.field === selectedGroup) {
					return { ...item, rowGroup: true };
				} else if (item.rowGroup) {
					return { ...item, rowGroup: false };
				}
				return item;
			});
			setColDef(data);
		}
	}, [selectedGroup])

	const viewListOnChange = (data: any) => {
		setViewBuilderData(data);
		dispatch(getVendorPayAppsLst(appInfo));
	}

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		appInfo && (isUserGCForVPA(appInfo) !== 'Not Authorized' ? <div className='vendor-pay-applications-cls'><GridWindow
			open={true}
			className='vendor-pay-app-cls'
			title='Vendor Pay Applications'
			companyInfo={!isUserGCForVPA(appInfo)}
			centerPiece={!isUserGCForVPA(appInfo) && `Below are all Pay Applications for your company '${appInfo?.currentUserInfo?.company}' for the Project '${appInfo?.currentProjectInfo?.name}'.`}
			iconCls='common-icon-vendor-pay-applications'
			appType='VendorPayApps'
			appInfo={appInfo}
			iFrameId='vendorPayAppIframe'
			isFromHelpIcon={true}
			defaultTabId='pay-Application-Details'
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
				presenceId: 'vendorpayapp-presence',
				showBrena: false,
				showLiveSupport: true,
				showLiveLink: true,
				showStreams: true,
				showComments: true,
				showChat: false,
				hideProfile: false,
			}}
			righPanelPresenceProps={{
				presenceId: "vendorpayapp-presence",
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
			toast={showToastMessage}
			content={{
				headContent: { regularContent: <VendorPayApplicationsForm /> },
				detailView: VendorPayApplicationsLID,
				gridContainer: {
					toolbar: {
						leftItems: <VendorPayAppToolbarLeftButtons />,
						rightItems: <VendorPayAppToolbarRightButtons />,
						searchComponent: {
							show: true,
							type: 'regular',
							onSearchChange: (val: any) => setGridSearchText(val),
							groupOptions: isUserGCForVPA(appInfo) ? groups : [groups[0], groups[1]],
							filterOptions: isUserGCForVPA(appInfo) ? filters : [filters[0], filters[1]],
							onGroupChange: onGroupingChange,
							onFilterChange: onFilterChange,
							defaultFilters: activeMainGridDefaultFilters,
							defaultGroups: selectedGroup,
							placeholder: viewBuilderData?.viewName,
							viewBuilderapplied:true,
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
							requiredColumns={['code', 'status']}
						/>
					},
					grid: {
						// headers: headers,
						headers: colDef && colDef.length > 0 ? colDef : headers,
						data: rowData,
						getRowId: (params: any) => params.data?.id,
						grouped: true,
						groupIncludeTotalFooter: false,
						groupIncludeFooter: false,
						rowSelection: 'single',
						onFirstDataRendered: onFirstDataRendered,
						// onRowDoubleClicked:onRowDoubleClick,
						rowSelected: (e: any) => rowSelected(e),
						groupDisplayType: 'groupRows',
						groupRowRendererParams: groupRowRendererParams,
						nowRowsMsg: '<div>Create New Vendor Pay Applications by Clicking the + Add button above</div>'
					}
				}
			}}
		/>
		</div>
			: <SUIAlert
				open={true}
				DailogClose={true}
				onClose={() => {
					postMessage({
						event: 'closeiframe',
						body: { iframeId: 'vendorPayAppIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorPayApp' }
					});
				}}
				contentText={'You Are Not Authorized'}
				title={'Warning'}
				onAction={(e: any, type: string) => {
					type == 'close' && postMessage({
						event: 'closeiframe',
						body: { iframeId: 'vendorPayAppIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorPayApp' }
					});
				}}
				showActions={false}
			/>));
};

export default VendorPayApplicationsWindow;