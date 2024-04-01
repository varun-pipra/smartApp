import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import SUIGrid from 'sui-components/Grid/Grid';
import { getServer } from 'app/common/appInfoSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import Button from '@mui/material/Button';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { setShowLineItemDetails, setSelectedNode, setSelectedRecord, getContractDetailsById } from 'features/vendorcontracts/stores/VendorContractsSlice';
import { fetchTransactions } from 'features/vendorcontracts/stores/tabs/transactions/TransactionTabSlice';
import { vendorContractsStatusOptions, vendorContractsResponseStatusOptions, vendorContractsStatus, vendorContractsStatusColors, vendorContractsStatusIcons, vendorContractsResponseStatus, vendorContractsResponseStatusIcons, vendorContractsResponseStatusColors } from 'utilities/vendorContracts/enums';
import { isUserGC } from 'utilities/commonutills';
import { setActiveMainGridFilters, setActiveMainGridDefaultFilters, setActiveMainGridGroupKey, setSelectedRows, setVendorsList } from 'features/vendorcontracts/stores/gridSlice';
import { updateContractDetails } from 'features/vendorcontracts/stores/gridAPI';
import { CustomGroupHeader } from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';
import CustomFilterHeader from 'features/common/gridHelper/CustomFilterHeader';
import { blockchainStates } from 'app/common/blockchain/BlockchainSlice';
import {clearObjectValues} from 'sui-components/ViewBuilder/utils';
import _ from 'lodash';

var tinycolor = require('tinycolor2');
let defaultVCStatusFilter: any = [];

const VendorContractsGrid = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
	const { selectedRecord } = useAppSelector((state) => state.vendorContracts);

	const { gridData, liveData, activeMainGridGroupKey, activeMainGridFilters, gridOriginalData, mainGridSearchText } = useAppSelector((state) => state.vendorContractsGrid);

	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	// const [statusFilter, setStatusFilters] = useState<any>({ids: [], names: []});
	const [rowData, setRowData] = useState<any>(gridData);
	const [gridRef, setGridRef] = React.useState<any>();
	const groupKeyValue = useRef<any>(null);
	const [filteredRecords, setFilteredRecords] = React.useState<any>([]);
	const [viewBuilderColumns, setViewBuilderColumns] = React.useState<any>([]);
	const [aliasOriginalGridData, setAliasOriginalGridData] = useState(gridOriginalData);
	const showLineItemDetails = useAppSelector((state) => state.vendorContracts.showLineItemDetails);
	const {blockchainEnabled} = useAppSelector((state) => state.blockchain);
	const vendorContractBlockchainRef: any = useRef(false);

	useEffect(()=>{
		vendorContractBlockchainRef.current = blockchainEnabled;
		if (gridRef?.current?.api) {
			setTimeout(()=> {
				gridRef.current.api.refreshCells({
					force: true,
					  rowNodes: gridRef.current.api.getRenderedNodes() || [],
				})
			}, 500)
		}
	}, [blockchainEnabled])


	const { viewData, viewBuilderData } = useAppSelector(state => state.viewBuilder);

	useEffect(() => {
		setRowData(gridData);
		setFilteredRecords(gridData);
		const uniqueVendors: any = Array.from(new Map((gridData || []).map((item: any) =>
			[item.vendor.id, { text: item?.vendor?.name, key: item?.vendor?.id, value: item?.vendor?.id }])).values());
		dispatch(setVendorsList(uniqueVendors));
	}, [gridData]);

	useEffect(() => {
		if (gridOriginalData?.length) {
			let updatedGridData = gridOriginalData?.map((obj: any) => ({
				...obj,
				aliasStatus: vendorContractsStatus[obj['status']] || '',
				aliasBidPackage: obj?.bidPackage?.name || '',
				aliasScheduleOfValues: obj?.scheduleOfValues?.map((item: any) => item.type),
				aliasStartDate: formatDate(obj['startDate']) || '',
				aliasEndDate: formatDate(obj['endDate']) || '',
				aliasVendor: obj?.vendor?.name,
			}));
			setAliasOriginalGridData(updatedGridData);
		}
	}, [gridOriginalData]);

	useEffect(() => {
		gridRef?.current?.api?.applyTransaction(liveData);
	}, [liveData]);



	const isFound = (rec: any, key: string, filters: any) => {
		let isFound = false;
		rec?.scheduleOfValues?.map((item: any) => {
			if (filters?.includes(item[key]) && !isFound) isFound = true;
		});
		return isFound;
	};

	const FilterBy = (gridData: any) => {
		const gridDataCopy = [...gridData];
		let filteredData = gridDataCopy;
		// if(!activeMainGridFilters?.status) setStatusFilters({ids: [], names: []});
		if (activeMainGridFilters?.status?.length > 0) {
			filteredData = gridDataCopy.filter((rec: any) => {
				return activeMainGridFilters?.status?.includes(rec.status);
			});
			let statusIds: any = [];
			let statusNames: any = [];
			const filters = activeMainGridFilters?.status?.map((ele: any) => {
				statusIds.push(ele);
				isUserGC(appInfo) ? statusNames.push(vendorContractsStatus[ele]) : statusNames.push(vendorContractsResponseStatus[ele]);
			});
			// setStatusFilters({ids: [...statusIds], names: [...statusNames]});
		} else if (Object.keys(activeMainGridFilters).length === 0 || (activeMainGridFilters?.status?.length === 0 ?? false)) {
			// setStatusFilters({ids: [], names: []});
		};
		if (activeMainGridFilters?.vendor?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.vendor?.includes(rec?.vendor?.id);
			});
		}
		if (activeMainGridFilters?.sovType?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return isFound(rec, 'type', activeMainGridFilters?.sovType);
			});
		}
		if (activeMainGridFilters?.bidPackage?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.bidPackage?.includes(rec?.bidPackage?.name);
			});
		}
		return filteredData;
	};

	const SearchBy = (gridData: any) => {
		const filteredIds = gridData?.map((obj: any) => obj?.id);
		const firstResult = aliasOriginalGridData.filter((obj: any) => {
			return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(mainGridSearchText?.toLowerCase());
		});
		return firstResult;
	};

	useEffect(() => {
		const gridDataCopy = [...gridData];
		let data: any;
		if (activeMainGridFilters && Object.keys(activeMainGridFilters)?.length > 0) {
			data = FilterBy(gridDataCopy);
			if (mainGridSearchText !== "") {
				let SearchGridData = SearchBy(data);
				setRowData(SearchGridData);
				setFilteredRecords(SearchGridData);
			} else {
				setRowData(data);
				setFilteredRecords(data);
			};
		} else if (mainGridSearchText !== "") {
			let SearchGridData = SearchBy(gridDataCopy);
			setRowData(SearchGridData);
			setFilteredRecords(SearchGridData);
			// setStatusFilters({ids: [], names: []});
		} else {
			setRowData([...gridDataCopy]);
			setFilteredRecords([...gridDataCopy]);
			// setStatusFilters({ids: [], names: []});
		};
	}, [activeMainGridFilters, mainGridSearchText, gridData]);

	const onClick = (values: any) => {
		dispatch(setActiveMainGridDefaultFilters({ ...activeMainGridFilters, status: [...values?.ids] }));
		if (values?.ids?.length) {
			let data = gridOriginalData.map((row: any) => {
				if (values?.ids?.includes(row.status)) return row;
				return;
			});
			data = data.filter(function (element: any) {
				return element !== undefined;
			});
			setRowData(data);
		}
	};

	useEffect(() => { setColumns([...columns]); }, [gridOriginalData]);

	useEffect(() => {
		if (isUserGC(appInfo)) setColumns([...headers]);
		else {
			headers.splice(5, 1);
			headers.splice(5, 1);
			headers.splice(7, 1);
			setColumns([...headers]);
		}
	}, [appInfo]);

	const handleStatusFilter = (statusFilters: any) => {
		const consolidatedFilter = { ...activeMainGridFilters, ...{ status: statusFilters } };
		dispatch(setActiveMainGridFilters(consolidatedFilter));
		dispatch(setActiveMainGridDefaultFilters(consolidatedFilter));
	};

	const handleStatusColumnSort = (direction: any) => {
		gridRef?.current?.columnApi?.applyColumnState({
			state: [{ colId: 'status', sort: direction }],
			defaultState: { sort: null }
		});
	};

	const headers = useMemo(() => [
		{
			headerName: 'Title',
			pinned: 'left',
			field: 'title',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 300,
			cellRenderer: 'agGroupCellRenderer',
			valueGetter: (params: any) => params.data?.title,
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			cellRendererParams: {
				suppressDoubleClickExpand: true,
				innerRenderer: (params: any) => {
					const bcStatus = params.data?.blockChainStatus;
					const showBCIcon = (vendorContractBlockchainRef?.current && blockchainStates.indexOf(bcStatus) === -1);
					return <>
						{showBCIcon && <span className='common-icon-Block-chain' style={{position: 'absolute', left: '8%', marginTop: '8px', fontSize: '1.6em'}}></span>}
						{params?.data?.hasChangeOrder && <IQTooltip
							title={'Schedule Of Values of the Contract to be updated due to recent approval of the Change Event Request.'}
							placement={'bottom'}
							arrow={true}
						>
							<span className='common-icon-c-mark' style={{color: '#26d8b1', position: 'absolute', left: '-0.2%', marginTop: '8px', fontSize: '24px', cursor: 'pointer'}} />
						</IQTooltip>}
						<span className='ag-costcodegroup' style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#059CDF' }}>{params.data?.title} </span>
					</>;
				}
			}
		}, {
			headerName: isUserGC(appInfo) ? 'Status' : 'Response Status',
			pinned: 'left',
			field: 'status',
			width: 325,
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: isUserGC(appInfo) ? 'Status' : 'Response Status',
				options: isUserGC(appInfo) ? vendorContractsStatusOptions : vendorContractsResponseStatusOptions,
				defaultFilters: defaultVCStatusFilter,
				onSort: handleStatusColumnSort,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			cellRenderer: (params: any) => {
				if (params?.node?.rowPinned == 'bottom') return 'Total Contract Value';
				if (isUserGC(appInfo)) {
					return vendorContractsStatus[params?.data?.status] ?
						vendorContractsStatus[params?.data?.status] === 'Summary' ?
							params?.value : <IQTooltip title={vendorContractsStatus[params?.data?.status]?.length > 11 ? vendorContractsStatus[params?.data?.status] : ''}>
								<Button disabled
									variant='contained'
									startIcon={<span className={vendorContractsStatusIcons[params?.data?.status]} style={{ color: 'white' }} />}
									style={{
										backgroundColor: `${vendorContractsStatusColors[params.data?.status]}`,
										color: tinycolor(vendorContractsStatusColors[params.data?.status]).isDark() ? 'white' : 'black',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										width: 'auto',
										paddingLeft: '10px',
										paddingRight: '10px',
										minWidth: '50px',
										textOverflow: 'ellipsis',
									}}>{vendorContractsStatus[params?.data?.status]}
								</Button>
							</IQTooltip>
						: <></>;
				} else {
					return vendorContractsResponseStatus[params?.data?.status] ?
						vendorContractsResponseStatus[params?.data?.status] === 'Summary' ?
							params?.value : <IQTooltip title={vendorContractsResponseStatus[params?.data?.status]?.length > 11 ? vendorContractsResponseStatus[params?.data?.status] : ''}>
								<Button disabled
									variant='contained'
									startIcon={<span className={vendorContractsResponseStatusIcons[params?.data?.status]} style={{ color: 'white' }} />}
									// startIcon={<Box component='img' src={StatusIcons[params?.data?.status]} style={{ height: '16px', width: '16px' }} />}
									style={{
										backgroundColor: `${vendorContractsResponseStatusColors[params.data?.status]}`,
										color: tinycolor(vendorContractsResponseStatusColors[params.data?.status]).isDark() ? 'white' : 'black',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										width: 'auto',
										paddingLeft: '10px',
										paddingRight: '10px',
										minWidth: '50px',
										textOverflow: 'ellipsis',
									}}>{vendorContractsResponseStatus[params?.data?.status]}
								</Button>
							</IQTooltip>
						: <></>;
				}
				// return stageIndicator;
			}
		}, {
			headerName: 'Contract ID',
			field: 'code',
			minWidth: 150,
		}, {
			headerName: 'PO Number',
			field: 'poNumber',
			minWidth: 150,
			editable: isUserGC(appInfo),
		}, {
			headerName: 'Contract Amount',
			field: 'amount',
			sum: 'aggFunc',
			type: 'rightAligned',
			valueGetter: (params: any) => amountFormatWithSymbol(params.data?.amount),

		}, {
			headerName: 'Vendor',
			field: 'vendor.name',
		}, {
			headerName: 'Bid',
			field: 'bidPackage.name',
			minWidth: 250,
		}, {
			headerName: 'Contract Start Date',
			field: 'startDate',
			valueGetter: (params: any) => params.data?.startDate ? formatDate(params.data?.startDate) : '',
		}, {
			headerName: 'Contract End Date',
			field: 'endDate',
			valueGetter: (params: any) => params.data?.endDate ? formatDate(params.data?.endDate) : '',
		},
		{
			headerName: 'Contract Accepted Date',
			field: 'acceptedOn',
			minWidth: 250,
			valueGetter: (params: any) => params.data?.acceptedOn ? formatDate(params.data?.acceptedOn) : '',
		}
	], [defaultVCStatusFilter, blockchainEnabled]);

	const [columns, setColumns] = useState<any>(isUserGC(appInfo) ? [...headers] : [...headers]);

	useMemo(()=>{
		if(activeMainGridFilters.status?.length){
			if(statusFilter){
				let updatedColumndDefList2: any = columns.map((cDef: any) => {
					if (cDef.field == "status") {
						return { ...cDef,headerComponentParams : {...cDef.headerComponentParams , defaultFilters :[...activeMainGridFilters.status]}};
					}
					return cDef;
				});
				setColumns(updatedColumndDefList2);
			}
		}
			else{
				let updatedColumndDefList2: any = columns.map((cDef: any) => {
					if (cDef.field == "status") {
						return { ...cDef,headerComponentParams : {...cDef.headerComponentParams , defaultFilters :undefined}};
					}
					return cDef;
				});
				setColumns(updatedColumndDefList2);
			}
	},[activeMainGridFilters])
	
	const onCellEditingStopped = useCallback((event: any) => {
		updateContractDetails(appInfo, { poNumber: event?.newValue }, event?.data?.id);
	}, [selectedRecord]);

	useEffect(() => {
		if (viewBuilderData.length && viewData?.columnsForLayout?.length) {
			let updatedColumndDefList: any = [];
			viewData?.columnsForLayout.forEach((viewItem: any) => {
				columns.forEach((cDef: any) => {
					if (viewItem.field === cDef.field) {
						let newColumnDef = {
							...cDef,
							...viewItem,
							hide: viewItem?.hide,
							headerName: viewItem.field == 'status' ?isUserGC(appInfo) ? 'Status' : 'Response Status': cDef.headerName,
							headerComponentParams : cDef.field == "status" && {...cDef.headerComponentParams , defaultFilters :activeMainGridFilters.status?.length ? activeMainGridFilters.status : undefined}
						};

						updatedColumndDefList.push(newColumnDef);
					}
				});
			});
			setViewBuilderColumns(updatedColumndDefList);
		}
	}, [viewData]);

	useMemo(() => {
		// set the filters and grouping data
		if (viewData?.viewId) {
			const formatedFilter = viewData?.filters == null ? JSON.parse('{}') : JSON.parse(viewData?.filters);
			const formatedgrouping = viewData?.groups?.length ==  0 || viewData?.groups == null || viewData?.groups[0] == ''   ? 'undefined': viewData?.groups?.[0];
			if(!_.isEmpty(activeMainGridFilters) && formatedFilter){
				const data = clearObjectValues(activeMainGridFilters,formatedFilter);
				dispatch(setActiveMainGridFilters(data));
				dispatch(setActiveMainGridDefaultFilters(data));
			}	
			else{
				dispatch(setActiveMainGridFilters(formatedFilter));
				dispatch(setActiveMainGridDefaultFilters(formatedFilter));
			}
		 	dispatch(setActiveMainGridGroupKey(formatedgrouping));
		}
	}, [viewData])

	useEffect(() => {
		const columnsCopy = viewBuilderColumns && viewBuilderColumns.length > 0 ? [...viewBuilderColumns] : [...columns];
		if (((activeMainGridGroupKey ?? false) && activeMainGridGroupKey !== "")) {
			groupKeyValue.current = activeMainGridGroupKey;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = activeMainGridGroupKey ? activeMainGridGroupKey === col.field : false;
				col.headerComponentParams = col.field == "status" && {...col.headerComponentParams , defaultFilters :activeMainGridFilters.status?.length ? activeMainGridFilters.status : undefined};
			});
			setColumns(columnsCopy);
		} else if (activeMainGridGroupKey ?? true) {
			groupKeyValue.current = null;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = false;
			});
			dispatch(setActiveMainGridGroupKey(null));
			setColumns(columnsCopy);
		};
	}, [activeMainGridGroupKey, viewBuilderColumns]);

	const onGridRowDoubleClick = (row: any, tableRef: any) => {
		if (row && row?.data && row?.rowPinned != 'bottom') {
			if (props?.onRefChange) props?.onRefChange(tableRef);
			dispatch(setShowLineItemDetails(true));
			dispatch(setSelectedNode(row?.node));
			dispatch(setSelectedRecord(row?.data));
			dispatch(getContractDetailsById({ appInfo: appInfo, id: row?.data?.id }));
			dispatch(fetchTransactions({ appInfo: appInfo, contractId: row?.data?.id }));
			// dispatch(setSelectedNode(row?.node));
		}
	};

	/**
	 * Triggers after initial grid data available
	 * Based on id from searchParam in the URL, opening that specific record's right panel
	 * @author Srinivas Nadendla
	 */
	const onFirstDataRendered = () => {
		const params = new URLSearchParams(window.location.search);
		if (params.has("id")) {
			const selectedRecId = params.get('id');
			const selectedRec = gridData.find((rec: any) => rec.id === selectedRecId);
			dispatch(setShowLineItemDetails(true));
			dispatch(setSelectedRecord(selectedRec));
			dispatch(getContractDetailsById({ appInfo: appInfo, id: selectedRecId }));
			dispatch(fetchTransactions({ appInfo: appInfo, contractId: selectedRecId }));
		}
	};

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedRows(sltdRows));
		if (sltdRows?.node?.selected) {
			postMessage({
				event: 'joinroom',
				body: { iframeId: 'vendorContractsIframe', roomId: sltdRows?.data?.id, appType: 'VendorContractsLineItem_' + sltdRows?.data?.id, roomTitle: sltdRows?.title }
			});
		} else {
			postMessage({
				event: 'exitroom',
				body: { iframeId: 'vendorContractsIframe', roomId: sltdRows?.data?.id, appType: 'VendorContractsLineItem_' + sltdRows?.data?.id }
			});
		}
	};

	const autoGroupColumnDef = {
		cellRenderer: "agGroupCellRenderer",
		cellRendererParams: {
			suppressCount: false,
			innerRenderer: (params: any) => {
				if (params.node.group) {
					const colName = params?.node?.field;
					const data = params?.node?.childrenAfterGroup?.[0]?.data || {};
					if (colName === "vendor.name") {
						return data?.vendor?.name;
					} else if (colName === "status") {
						return data?.status || "";
					}
					return data?.[colName] || "";
				}
			},
		},
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if (node.group) {
			const colName = groupKeyValue?.current || activeMainGridGroupKey;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if (colName === "status") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={isUserGC(appInfo) ? vendorContractsStatus[data?.status] : vendorContractsResponseStatus[data?.status]} colName={colName}
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

	return (
		<div className='vendor-contracts-grid check-box-customize' style={containerStyle}>
			<div style={gridStyle} className='ag-theme-alpine'>
				<SUIGrid
					headers={columns}
					data={rowData}
					animateRows={true}
					getRowId={(params: any) => params?.data?.id}
					grouped={true}
					rowSelection='multiple'
					groupIncludeTotalFooter={false}
					groupIncludeFooter={false}
					onRowDoubleClicked={onGridRowDoubleClick}
					rowSelected={(e: any) => rowSelected(e)}
					onCellEditingStopped={onCellEditingStopped}
					onFirstDataRendered={onFirstDataRendered}
					autoGroupColumnDef={autoGroupColumnDef}
					getReference={(value: any) => { setGridRef(value); }}
					pinnedBottomRowConfig={{
						displayFields: {
							status: 'Total Contract Value',
							// description: 'This shows the summary data'
						},
						aggregateFields: ['amount']
					}}
					groupDisplayType={'groupRows'}
					groupRowRendererParams={groupRowRendererParams}
					isMainGrid={true}
					openLID={showLineItemDetails}
					selectedRecord={selectedRecord}
					nowRowsMsg={isUserGC(appInfo) ? '<div>Create new Vendor Contract by Clicking the + button above</div>' : ''}
				/>
			</div>
		</div>
	);
};

export default VendorContractsGrid;