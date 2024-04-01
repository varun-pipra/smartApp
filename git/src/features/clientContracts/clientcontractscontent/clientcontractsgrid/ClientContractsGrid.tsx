import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import SUIGrid from 'sui-components/Grid/Grid';
import { getServer } from 'app/common/appInfoSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import Button from '@mui/material/Button';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { vendorContractsResponseStatus, vendorContractsResponseStatusColors, vendorContractsResponseStatusIcons, vendorContractsResponseStatusOptions, vendorContractsStatus, vendorContractsStatusColors, vendorContractsStatusIcons, vendorContractsStatusOptions } from 'utilities/vendorContracts/enums';
import { getClientContractDetails, setSelectedNode, setSelectedRecord, setShowLineItemDetails } from 'features/clientContracts/stores/ClientContractsSlice';
import { setActiveMainGridFilters, getClientContractsList, setActiveMainGridDefaultFilters, setActiveMainGridGroupKey, setClientsList, setSelectedRows } from 'features/clientContracts/stores/gridSlice';
import { updateClientContractDetails } from 'features/clientContracts/stores/gridAPI';
import { isUserGCForCC } from 'features/clientContracts/utils';
import { CustomGroupHeader } from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';
import CustomFilterHeader from 'features/common/gridHelper/CustomFilterHeader';
import {blockchain, blockchainStates} from 'app/common/blockchain/BlockchainSlice';
import {clearObjectValues} from 'sui-components/ViewBuilder/utils';
import _ from 'lodash';

var tinycolor = require('tinycolor2');
let defaultCCStatusFilter: any = [];

const ClientContractsGrid = (props: any) => {
	const dispatch = useAppDispatch();
	// const gridRef = useRef<any>();
	const appInfo = useAppSelector(getServer);
	const containerStyle = React.useMemo(() => ({ width: "100%", height: "100%" }), []);
	const gridStyle = React.useMemo(() => ({ height: "100%", width: "100%" }), []);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { loginUserData, selectedRecord } = useAppSelector((state) => state.clientContracts);
	const { gridData, gridOriginalData, activeMainGridFilters, activeMainGridGroupKey, mainGridSearchText } = useAppSelector((state) => state.cCGrid);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const [viewBuilderColumns, setViewBuilderColumns] = React.useState<any>([]);
	const [rowData, setRowData] = React.useState<any>(gridData);
	const groupKeyValue = useRef<any>(null);
	const [filteredRecords, setFilteredRecords] = React.useState<any>([]);
	const [aliasOriginalGridData, setAliasOriginalGridData] = React.useState(gridOriginalData);
	const showLineItemDetails = useAppSelector((state) => state.clientContracts.showLineItemDetails);
	const [gridRef, setGridRef] = useState<any>();
	const {blockchainEnabled} = useAppSelector((state) => state.blockchain);
	const clientContractBlockchainRef: any = useRef(false);

	useEffect(()=> {
		clientContractBlockchainRef.current = blockchainEnabled;
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

	useEffect(() => { setColumns([...columns]); }, [gridOriginalData]);

	useEffect(() => {
		setRowData(gridData);
		setFilteredRecords(gridData);
		const uniqueClients: any = Array.from(new Map((gridData || []).map((item: any) =>
			[item.client.id, { text: item?.client?.name, key: item?.client?.id, value: item?.client?.id }])).values());
		dispatch(setClientsList(uniqueClients));
	}, [gridData]);

	useEffect(() => {
		if (gridOriginalData?.length) {
			let updatedGridData = gridOriginalData?.map((obj: any) => ({
				...obj,
				aliasStatus: vendorContractsStatus[obj['status']] || '',
				aliasBillingSchedule: obj?.billingSchedule?.type,
				aliasStartDate: formatDate(obj['startDate']) || '',
				aliasEndDate: formatDate(obj['endDate']) || '',
				aliasClient: obj?.client?.name,
			}));
			setAliasOriginalGridData(updatedGridData);
		}
	}, [gridOriginalData]);

	useEffect(() => {
		if (isUserGCForCC(appInfo)) setColumns([...headers]);
		else {
			headers.splice(5, 1);
			headers.splice(6, 1);
			setColumns([...headers]);
		}
	}, [appInfo]);


	const FilterBy = (gridData: any) => {
		const gridDataCopy = [...gridData];
		let filteredData = gridDataCopy;
		if (activeMainGridFilters?.status?.length > 0) {
			filteredData = gridDataCopy.filter((rec: any) => {
				return activeMainGridFilters?.status?.includes(rec.status);
			});
			let statusIds: any = [];
			let statusNames: any = [];
			const filters = activeMainGridFilters?.status?.map((ele: any) => {
				statusIds.push(ele);
				isUserGCForCC(appInfo) ? statusNames.push(vendorContractsStatus[ele]) : statusNames.push(vendorContractsResponseStatus[ele]);
			});
		}
		if (activeMainGridFilters?.client?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.client?.includes(rec?.client?.id);
			});
		}
		if (activeMainGridFilters?.sovType?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.sovType?.includes(rec?.billingSchedule?.type);
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

	const headers = useMemo(() => [
		{
			headerName: 'Title',
			pinned: "left",
			field: 'title',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 300,
			cellRenderer: 'agGroupCellRenderer',
			valueGetter: (params: any) => params.data?.title,
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			cellRendererParams: {
				// checkbox: true,
				suppressDoubleClickExpand: true,
				innerRenderer: (params: any) => {
					const bcStatus = params.data?.blockChainStatus;
					const showBCIcon = (clientContractBlockchainRef?.current && blockchainStates.indexOf(bcStatus) === -1);
					return <>
						{showBCIcon && <span className='common-icon-Block-chain' style={{position: 'absolute', left: '8%', marginTop: '8px', fontSize: '1.6em'}}></span>}
						{params?.data?.hasChangeOrder && <IQTooltip
							title={'Billing Schedule of the Contract to be updated due to recent approval of the Change Event Request.'}
							placement={'bottom'}
							arrow={true}
						>
							<span className='common-icon-c-mark' style={{color: '#26d8b1', position: 'absolute', left: '-0.2%', marginTop: '8px', fontSize: '24px', cursor: 'pointer'}} />
						</IQTooltip>}
						<span className="ag-costcodegroup" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#059CDF' }}>{params.data?.title} </span>
					</>;
				}
			}
		}, {
			headerName: isUserGCForCC(appInfo) ? 'Status' : 'Response Status',
			pinned: "left",
			field: 'status',
			width: 325,
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: isUserGCForCC(appInfo) ? 'Status' : 'Response Status',
				options: isUserGCForCC(appInfo) ? vendorContractsStatusOptions : vendorContractsResponseStatusOptions,
				defaultFilters: defaultCCStatusFilter,
				onSort: handleStatusColumnSort,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			cellRenderer: (params: any) => {
				if (isUserGCForCC(appInfo)) {
					return vendorContractsStatus[params?.data?.status] ?
						vendorContractsStatus[params?.data?.status] === 'Summary' ?
							params?.value : <IQTooltip title={vendorContractsStatus[params?.data?.status]?.length > 11 ? vendorContractsStatus[params?.data?.status] : ''}>
								<Button disabled
									variant='contained'
									startIcon={<span className={vendorContractsStatusIcons[params?.data?.status]} style={{ color: 'white' }} />}
									// startIcon={<Box component='img' src={StatusIcons[params?.data?.status]} style={{ height: "16px", width: '16px' }} />}
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
									// startIcon={<Box component='img' src={StatusIcons[params?.data?.status]} style={{ height: "16px", width: '16px' }} />}
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
			editable: isUserGCForCC(appInfo),
		}, {
			headerName: 'Contract Amount',
			field: 'amount',
			sum: 'aggFunc',
			type: "rightAligned",
			valueGetter: (params: any) => amountFormatWithSymbol(params.data?.totalAmount),

		}, {
			headerName: 'Client Company',
			field: 'client.name',
		}, {
			headerName: 'Contract Start Date',
			field: 'startDate',
			valueGetter: (params: any) => params.data?.startDate ? formatDate(params.data?.startDate) : "",
		}, {
			headerName: 'Contract End Date',
			field: 'endDate',
			valueGetter: (params: any) => params.data?.endDate ? formatDate(params.data?.endDate) : "",
		},
		{
			headerName: 'Contract Accepted Date',
			field: 'acceptedOn',
			minWidth: 250,
			valueGetter: (params: any) => params.data?.acceptedOn ? formatDate(params.data?.acceptedOn) : "",
		},
	], [defaultCCStatusFilter, blockchainEnabled]);

	const [columns, setColumns] = React.useState<any>(headers);

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
	
	useEffect(() => {
		if (viewBuilderData.length && viewData?.columnsForLayout?.length && viewData?.viewId) {
			let updatedColumndDefList: any = [];
			viewData?.columnsForLayout.forEach((viewItem: any) => {
				columns.forEach((cDef: any) => {
					if (viewItem.field === cDef.field) {
						let newColumnDef = {
							...cDef,
							...viewItem,
							hide: viewItem?.hide,
							headerName: viewItem.field == 'status' ?isUserGCForCC(appInfo) ? 'Status' : 'Response Status': cDef.headerName,
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


	const onClientGridRowDoubleClick = (row: any, tableRef: any) => {
		if (row && row.data) {
			if (props?.onRefChange) props?.onRefChange(tableRef);
			dispatch(setShowLineItemDetails(true));
			dispatch(setSelectedRecord(row?.data));
			dispatch(setSelectedNode(row?.node));
			dispatch(getClientContractDetails({ appInfo: appInfo, contractId: row?.data?.id }));
		}
	};
	const onCellEditingStopped = useCallback((event: any) => {
		updateClientContractDetails(appInfo, event?.data?.id, { poNumber: event?.newValue }, (response: any) => {
			dispatch(getClientContractsList(appInfo));
		});
	}, [selectedRecord]);

	const onFirstDataRendered = () => {
		const params = new URLSearchParams(window.location.search);
		if (params.has("id")) {
			const selectedRecId = params.get('id');
			const selectedRec = gridData.find((rec: any) => rec.id === selectedRecId);
			dispatch(setShowLineItemDetails(true));
			dispatch(setSelectedRecord(selectedRec));
			dispatch(getClientContractDetails({ appInfo: appInfo, contractId: selectedRecId }));
		}
	};

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedRows(sltdRows));
		if (sltdRows?.node?.selected) {
			postMessage({
				event: 'joinroom',
				body: { iframeId: 'clientContractsIframe', roomId: sltdRows?.data?.id, appType: 'ClientContractsLineItem_' + sltdRows?.data?.id, roomTitle: sltdRows?.title }
			});
		} else {
			postMessage({
				event: 'exitroom',
				body: { iframeId: 'clientContractsIframe', roomId: sltdRows?.data?.id, appType: 'ClientContractsLineItem_' + sltdRows?.data?.id }
			});
		}
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
							label={isUserGCForCC(appInfo) ? vendorContractsStatus[data?.status] : vendorContractsResponseStatus[data?.status]} colName={colName}
						/>
					</div>
				);
			} else if (colName === "client.name") {
				return (
					<div style={{ display: 'flex' }}>
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

	return (
		<div className="client-contracts-grid check-box-customize" style={containerStyle}>
			<div style={gridStyle} className="ag-theme-alpine">
				<SUIGrid
					ref={gridRef}
					headers={columns}
					data={rowData}
					animateRows={true}
					getRowId={(params: any) => params.data?.id}
					grouped={true}
					rowSelection='multiple'
					groupIncludeTotalFooter={false}
					onCellEditingStopped={onCellEditingStopped}
					onRowDoubleClicked={onClientGridRowDoubleClick}
					rowSelected={(e: any) => rowSelected(e)}
					onFirstDataRendered={onFirstDataRendered}
					groupDisplayType={'groupRows'}
					groupIncludeFooter={false}
					groupRowRendererParams={groupRowRendererParams}
					isMainGrid={true}
					openLID={showLineItemDetails}
					selectedRecord={selectedRecord}
					getReference={(value: any) => { setGridRef(value); }}
					nowRowsMsg={isUserGCForCC(appInfo) ? '<div>Create new Client Contract by Clicking the + button above</div>' : ''}

				// pinnedBottomRowConfig={{
				// 	aggregateFields: ['estimatedBudget'],
				// 	displayFields: {
				// 		packageName: 'Summary',
				// 	}
				// }}

				/>
			</div>
		</div>
	);
};

export default ClientContractsGrid;