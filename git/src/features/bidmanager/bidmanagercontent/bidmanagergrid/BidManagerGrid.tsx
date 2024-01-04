import './BidManagerGrid.scss';

import {Button} from '@mui/material';
import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import {
	fetchBidPackageDetails, setSelectedNode, setSelectedRecord, setShowLineItemDetails
} from 'features/bidmanager/stores/BidManagerSlice';
import {fetchBiddersGriddata} from 'features/bidmanager/stores/BiddersSlice';
import {setAwardBidDetailsData, setExpandedRows} from 'features/bidmanager/stores/awardBidSlice';
import {
	setActiveCompaniesList, setActiveMainGridFilters, setActiveMainGridDefaultFilters,
	setActiveMainGridGroupKey, setGridData, setRefreshed, setSelectedRows
} from 'features/bidmanager/stores/gridSlice';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import SUIGrid from 'sui-components/Grid/Grid';
import {
	StatusColors,
	StatusIcons,
	getBidProcessType,
	getBidStatus, getBidType, getGridStatusIcons, getIntendToBid, getIntendToBidColors,
	getSubmissionStatus, getSubmissionStatusColors, getSubmissionStatusIcons,
	statusOptions
} from 'utilities/bid/enums';
import {formatPhoneNumber, removeHtmlFromString} from 'utilities/commonFunctions';
import {formatDate} from 'utilities/datetime/DateTimeUtils';
// import CustomHeader from './CustomHeader';
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';
import CustomFilterHeader from 'features/common/gridHelper/CustomFilterHeader';

var tinycolor = require('tinycolor2');
let defaultBidStatusFilter: any = [];

const BidManagerGrid = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const {bidId} = useAppSelector((state) => state.bidManager);
	const {gridData, originalGridData, refreshed, liveData, activeMainGridGroupKey,
		activeMainGridFilters, mainGridSearchText, activeMainGridDefaultFilters} = useAppSelector((state) => state.bidManagerGrid);
	const {BiddersGridData} = useAppSelector((state) => state.bidders);
	const {expandedRows} = useAppSelector((state) => state.awardBid);
	const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
	const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const [bidders, setBidders] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>();
	// const [statusFilter, setStatusFilters] = useState<any>({ids: [], names: []});
	const [rowData, setRowData] = useState<any>([]);
	const [gridRef, setGridRef] = React.useState<any>();
	const [filteredRecords, setFilteredRecords] = React.useState<any>([]);
	const [aliasOriginalGridData, setAliasOriginalGridData] = useState(originalGridData);
	const groupKeyValue = useRef<any>(null);
	const showLineItemDetails = useAppSelector((state) => state.bidManager.showLineItemDetails);
	const selectedRecord = useAppSelector((state) => state.bidManager.selectedRecord);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);

	useEffect(() => {
		gridRef?.current?.api?.applyTransaction(liveData);
	}, [liveData]);

	useEffect(() => {
		setRowData(gridData);
		setFilteredRecords(gridData);
	}, [gridData]);

	if(statusFilter) defaultBidStatusFilter = activeMainGridFilters.status?.length > 0 ? [...activeMainGridFilters.status] : undefined;

	useEffect(() => {
		const companiesList: any = [];
		originalGridData?.map((item: any) => {
			item?.bidders?.map((bidder: any) => {
				!companiesList?.map((a: any) => a.value)?.includes(bidder?.company?.id) && companiesList.push({
					text: bidder?.company?.name,
					key: bidder?.company?.id,
					value: bidder?.company?.id
				});
			});
		});
		dispatch(setActiveCompaniesList(companiesList));
	}, [originalGridData]);

	const onClick = (values: any) => {
		// console.log("values", values);
		dispatch(setActiveMainGridDefaultFilters({...activeMainGridFilters, status: values?.ids?.map(String)}));
		if(values?.ids?.length) {
			let data = originalGridData.map((row: any) => {
				if(values?.ids?.includes(row.status)) return row;
				return;
			});
			data = data.filter(function (element: any) {
				return element !== undefined;
			});
			setRowData(data);
			// } else {
			// 	setStatusFilters({ids: [], names: []});
			// 	setRowData(originalGridData);
		}
	};

	// useEffect(() => {setBidders(BiddersGridData);}, [BiddersGridData]);
	// useEffect(() => () => {
	// 	// console.log('expandedRows', expandedRows)
	// 	if(expandedRows?.length && rowData?.length) {
	// 		updateDetailGrid();
	// 	}
	// }, [expandedRows]);

	// const updateDetailGrid = () => {
	// 	const requests = rowData.map(async (row: any) => {
	// 		if(expandedRows?.includes(row?.id)) {
	// 			let bidderRes = await dispatch(fetchBiddersGriddata({appInfo: appInfo, packageId: row?.id}));
	// 			return {...row, bidders: bidderRes?.payload};
	// 		} else {
	// 			return row;
	// 		}
	// 	});
	// 	Promise.all(requests).then((res: any) => {
	// 		gridRef?.current?.setRowData([...res]);
	// 	});
	// };

	// useEffect(() => {setColumns(headers);}, [originalGridData, statusFilter, refreshed]);
	useEffect(() => {
		// const columnsCopy = [...columns];
		// console.log("activeMainGridGroupKey", activeMainGridGroupKey, columnsCopy);
		if(((activeMainGridGroupKey ?? false) && activeMainGridGroupKey !== "")) {
			// setGroupKey(activeMainGridGroupKey);
			groupKeyValue.current = activeMainGridGroupKey;
			// columnsCopy.forEach((col: any) => {
			// 	col.rowGroup = activeMainGridGroupKey ? activeMainGridGroupKey === col.field : false;
			// 	setColumns(columnsCopy);
			// });
		} else if(activeMainGridGroupKey ?? true) {
			groupKeyValue.current = null;
			// columnsCopy.forEach((col: any) => {
			// 	// console.log("status", col?.rowGroup);
			// 	col.rowGroup = false;
			// });
			// console.log("else group key", columnsCopy);
			dispatch(setActiveMainGridGroupKey(null));
			// setColumns(columnsCopy);
		};
	}, [activeMainGridGroupKey]);

	const GetDetailsGridData = (array: any, key: string, filterValues: any) => {
		const filterBidderData = array.filter((item: any) => item.bidders.some((subItem: any) => {
			if(key === 'company') return filterValues?.includes(subItem?.company?.id);
			else return filterValues?.includes(subItem?.[key]?.toString());
		})).map((item: any) => {
			let n = Object.assign({}, item, {
				'bidders': item.bidders.filter((childItem: any) => {
					if(key === 'company') return filterValues?.includes(childItem?.company?.id);
					else return filterValues?.includes(childItem?.[key]?.toString());
				}
				)
			});
			return n;
		});
		return filterBidderData;
	};

	const FilterBy = (gridData: any) => {
		const gridDataCopy = [...gridData];
		let filteredData = gridDataCopy;
		// console.log("data in filters", activeMainGridFilters);
		// if(!activeMainGridFilters?.status) setStatusFilters({ids: [], names: []});
		if(activeMainGridFilters?.status?.length > 0) {
			filteredData = gridDataCopy.filter((rec: any) => {
				return activeMainGridFilters?.status?.includes(rec?.status?.toString());
			});
			// let statusIds: any = [];
			// let statusNames: any = [];
			// const filters = activeMainGridFilters?.status?.map((ele: any) => {
			// 	statusIds.push(Number(ele));
			// 	statusNames.push(getBidStatus(Number(ele)));
			// });
			// setStatusFilters({ids: [...statusIds], names: [...statusNames]});
		} else if(Object.keys(activeMainGridFilters).length === 0 || (activeMainGridFilters?.status?.length === 0 ?? false)) {
			// setStatusFilters({ids: [], names: []});
		};
		if(activeMainGridFilters?.processType?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.processType?.includes(rec?.processType?.toString());
			});
		}
		if(activeMainGridFilters?.type?.length > 0) {
			// console.log("typeee");
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.type?.includes(rec?.type?.toString());
			});
		}
		if(activeMainGridFilters?.submissionStatus?.length > 0) {
			filteredData = GetDetailsGridData(filteredData, 'submissionStatus', activeMainGridFilters?.submissionStatus);
		}
		if(activeMainGridFilters?.company?.length > 0) {
			filteredData = GetDetailsGridData(filteredData, 'company', activeMainGridFilters?.company);
		}
		if(activeMainGridFilters?.intendToBid?.length > 0) {
			filteredData = GetDetailsGridData(filteredData, 'intendToBid', activeMainGridFilters?.intendToBid);
			// console.log("intendToBid", filteredData);
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
		if(activeMainGridFilters && Object.keys(activeMainGridFilters)?.length > 0) {
			data = FilterBy(gridDataCopy);
			if(mainGridSearchText !== "") {
				let SearchGridData = SearchBy(data);
				setRowData(SearchGridData);
				setFilteredRecords(SearchGridData);
			} else {
				setRowData(data);
				setFilteredRecords(data);
			};
		} else if(mainGridSearchText !== "") {
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

	// useEffect(() => {
	// 	if(refreshed && gridApi) {
	// 		gridApi.forEachNode((node: any) => {
	// 			node.expanded = false;
	// 			node.setSelected(false);
	// 		});
	// 		gridApi.onGroupExpandedOrCollapsed();
	// 	}
	// }, [ refreshed ]);

	const handleStatusFilter = (statusFilters: any) => {
		const consolidatedFilter = {...activeMainGridFilters, ...{status: statusFilters}};
		dispatch(setActiveMainGridFilters(consolidatedFilter));
		dispatch(setActiveMainGridDefaultFilters(consolidatedFilter));
	};

	useEffect(() => {
		if(originalGridData.length) {
			let updatedGridData = originalGridData.map((obj: any) => ({
				...obj,
				aliasStatus: getBidStatus(obj['status']) || '',
				aliasType: getBidType(obj['type']) || '',
				aliasProcessType: getBidProcessType(obj['processType']) || '',
				aliasStartdate: formatDate(obj['startDate']) || '',
				aliasEnddate: formatDate(obj['endDate']) || ''
			}));
			setAliasOriginalGridData(updatedGridData);
		}
	}, [originalGridData]);

	const headers = useMemo(() => [
		{
			headerName: 'Bid Packages',
			pinned: 'left',
			field: 'name',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 300,
			cellRenderer: 'agGroupCellRenderer',
			valueGetter: (params: any) => params.data?.name,
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			cellRendererParams: {
				// checkbox: true,
				suppressDoubleClickExpand: true,
				innerRenderer: (params: any) => {
					return <>
						{/* <IQTooltip
						title={'Scheduled'}
						placement={'bottom'} arrow={true}
		> */}
						<span className={getGridStatusIcons(params?.data?.status)} style={{position: 'absolute', left: '3%', marginTop: '12px', color: `#${StatusColors[params.data?.status]}`}} />
						{/* </IQTooltip> */}
						<span className='ag-costcodegroup' style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#059CDF'}}>{params.data?.name} </span>
					</>;
				}
			}
		}, {
			headerName: 'Status',
			pinned: 'left',
			field: 'status',
			// cellClass: 'status-column',
			// filter: true,
			// valueGetter: (params:any) => params?.data?.status ? getBidStatus(params?.data?.status) : '', 			
			// headerComponent: CustomHeader,
			// headerComponentParams: {
			// 	options: statusOptions,
			// 	columnName: 'Status',
			// 	// clearFilters: statusFilter,
			// 	defaultFilters: statusFilter,
			// 	// onFilterOpened: onFilterOpened,
			// 	filterUpdated: (values: any) => onClick(values)
			// },
			width: 220,
			rowGroup: activeMainGridGroupKey === 'status',
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: 'Status',
				options: statusOptions,
				defaultFilters: defaultBidStatusFilter,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			cellRenderer: (params: any) => {
				const stageIndicator = getBidStatus(params?.data?.status) ?
					getBidStatus(params?.data?.status) === 'Summary' ?
						params?.value : <IQTooltip title={getBidStatus(params?.data?.status)?.length > 11 ? getBidStatus(params?.data?.status) : ''}>
							<Button disabled
								variant='contained'
								startIcon={<span className={StatusIcons[params?.data?.status]} />}
								style={{
									backgroundColor: `#${StatusColors[params.data?.status]}`,
									color: tinycolor(StatusColors[params.data?.status]).isDark() ? 'white' : 'black',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									width: 'auto',
									paddingLeft: '10px',
									paddingRight: '10px',
									minWidth: '50px',
									textOverflow: 'ellipsis',
								}}>{getBidStatus(params?.data?.status)}
							</Button>
						</IQTooltip>
					: <></>;
				return stageIndicator;
				// return <div
				// 	className='status'
				// 	style={{
				// 		color: tinycolor(StatusColors[params.data?.status]).isDark() ? 'white' : 'black',
				// 		backgroundColor: `#${StatusColors[params.data?.status]}`
				// 	}}
				// >
				// 	<span className={`status-icon ${StatusIcons[params?.data?.status]}`}></span> {getBidStatus(params?.data?.status)}{' '}
				// </div>;
			}
		}, {
			headerName: 'Bid ID',
			field: 'displayId',
			minWidth: 100
		}, {
			headerName: 'Estimated Budget',
			field: 'estimatedBudget',
			sum: 'aggFunc',
			type: 'rightAligned',
			valueGetter: (params: any) => amountFormatWithSymbol(params.data?.estimatedBudget)

		}, {
			headerName: 'Description',
			field: 'description'
		}, {
			headerName: 'Budget Line Item',
			field: 'budgetItems',
			type: 'showCount',
			minWidth: 300,
			valueGetter: (params: any) => {
				if(params.data?.budgetItems?.length) {
					const values: any = [];
					params?.data?.budgetItems?.map((obj: any) => {
						if(obj?.name && obj?.costCode) values.push(`${obj?.name} - ${obj?.costCode}`);
					});
					return values;
				}
				return '';
			}
		}, {
			headerName: 'Bid Type',
			field: 'type',
			rowGroup: activeMainGridGroupKey === 'type',
			valueGetter: (params: any) => params.data ? getBidType(params.data?.type) : ''
		},
		{
			headerName: 'Bid Process Type',
			field: 'processType',
			rowGroup: activeMainGridGroupKey === 'processType',
			valueGetter: (params: any) => params.data ? getBidProcessType(params.data?.processType) : ''
		},
		{
			headerName: 'Start Date & Time',
			field: 'startDate',
			valueGetter: (params: any) => params.data ? formatDate(params.data?.startDate) : ''
		}, {
			headerName: 'End Date & Time',
			field: 'endDate',
			valueGetter: (params: any) => params.data ? formatDate(params.data?.endDate) : ''
		}, {
			headerName: 'Bidding Instructions',
			field: 'instructions',
			valueGetter: (params: any) => removeHtmlFromString(params?.data?.instructions)
		}, {
			headerName: 'No.of Bidders',
			field: 'bidderCount',
			minWidth: 150,
			type: 'rightAligned'
		}, {
			headerName: 'Awarded To',
			field: 'awardedTo'
		}, {
			headerName: "Company",
			field: "company",
			minWidth: 170,
			hide: true,
			rowGroup: activeMainGridGroupKey === 'company',
			keyCreator: (params: any) => {return params?.data?.company?.name;},
			valueGetter: (params: any) => {return params?.data?.company?.name;}
		}
	], [defaultBidStatusFilter, activeMainGridGroupKey]);

	const detailCellRendererParams = useMemo(() => {
		const details = {
			detailGridOptions: {
				headerHeight: 36,
				groupDefaultExpanded: 0,
				columnDefs: [
					{
						headerName: 'Company', field: 'name',
						minWidth: 250,
						valueGetter: (params: any) => params?.data?.company?.name,
						cellRenderer: (params: any) => {
							return <>
								{params?.data?.awarded && <span className='common-icon-AwardBid' style={{position: 'absolute', left: '0%', marginTop: '12px'}} />}
								<img
									src={params?.data?.company?.thumbnailUrl || ''}
									alt='Avatar'
									style={{width: '28px', height: '28px'}}
									className='base-custom-img companyimg-cls'
								/>
								{params?.value}
							</>;
						}
					},
					{
						field: 'intendToBid',
						headerName: 'Intend To Bid',
						valueGetter: (params: any) => getIntendToBid(params?.data?.intendToBid),
						cellRenderer: (params: any) => {
							const stageIndicator = params.value ?
								getIntendToBid(params?.data?.intendToBid) === 'Summary' ?
									getIntendToBid(params?.data?.intendToBid) : <IQTooltip title={params.value.length > 11 ? params.value : ''}>
										<Button disabled
											variant='contained'
											// startIcon={<Box component='img' src={StatusIcons[params?.data?.statusCode]} style={{height: '20px', width: '20px'}}/>}
											style={{
												backgroundColor: `#${getIntendToBidColors(params.data?.intendToBid)}`,
												color: tinycolor(`#${getIntendToBidColors(params?.data?.intendToBid)}`).isDark() ? 'white' : 'black',
												overflow: 'hidden',
												whiteSpace: 'nowrap',
												width: 'auto',
												paddingLeft: '10px',
												paddingRight: '10px',
												minWidth: '30px',
												textOverflow: 'ellipsis',
											}}>{getIntendToBid(params?.data?.intendToBid)}
										</Button>
									</IQTooltip>
								: <></>;
							return stageIndicator;
						}
					},
					{
						headerName: 'Submission Status',
						field: 'submissionStatus', minWidth: 220,
						valueGetter: (params: any) => getSubmissionStatus(params?.data?.submissionStatus),
						cellRenderer: (params: any) => {
							const stageIndicator = params.value ?
								getSubmissionStatus(params?.data?.submissionStatus) === 'Summary' ?
									getSubmissionStatus(params?.data?.submissionStatus) : <IQTooltip title={params.value.length > 11 ? params.value : ''}>
										<Button disabled
											variant='contained'
											startIcon={<span className={getSubmissionStatusIcons(params?.data?.submissionStatus)} />}
											style={{
												backgroundColor: `#${getSubmissionStatusColors(params.data?.submissionStatus)}`,
												color: tinycolor(`#${getSubmissionStatusColors(params?.data?.getSubmissionStatusIcons)}`).isDark() ? 'white' : 'black',
												overflow: 'hidden',
												whiteSpace: 'nowrap',
												width: 'auto',
												paddingLeft: '10px',
												paddingRight: '10px',
												minWidth: '30px',
												textOverflow: 'ellipsis',
											}}>{getSubmissionStatus(params?.data?.submissionStatus)}
										</Button>
									</IQTooltip>
								: <></>;
							return stageIndicator;
						}
					},
					{
						field: 'totalBidValue', headerName: 'Bid Value', type: 'leftAligned', minWidth: 150,
						valueGetter: (params: any) => amountFormatWithSymbol(params?.data?.totalBidValue)
					},
					{headerName: 'Contact', field: 'contactPerson', minWidth: 150, valueGetter: (params: any) => params?.data?.contactPerson?.firstName + ' ' + params?.data?.contactPerson?.lastName},
					{headerName: `Contact's Email`, field: 'contactsEmail', minWidth: 265, valueGetter: (params: any) => params?.data?.contactPerson?.email},
					{headerName: 'Phone No.', field: 'phoneNumber', minWidth: 220, valueGetter: (params: any) => formatPhoneNumber(params?.data?.contactPerson?.phone)},
					{headerName: 'Queries', field: 'queryCount', type: 'leftAligned', minWidth: 150}
				]
			},
			getDetailRowData: (params: any) => {
				return params.successCallback(params?.data?.bidders);
			}
		};
		return details;
	}, []);

	const defaultColDef = useMemo(() => {
		return {
			flex: 1,
		};
	}, []);

	// const [columns, setColumns] = useState<any>(headers);

	const onBidGridRowDoubleClick = (row: any, tableRef: any) => {
		if(row && row.data) {
			if(props?.onRefChange) props?.onRefChange(tableRef);
			dispatch(setShowLineItemDetails(true));
			dispatch(setSelectedRecord(row?.data));
			dispatch(fetchBidPackageDetails({appInfo: appInfo, packageId: row?.data?.id}));
			dispatch(setSelectedNode(row?.node));
			dispatch(setAwardBidDetailsData({}));
		}
	};

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedRows(sltdRows));
		dispatch(setRefreshed(false));
	};

	/**
	 * This method is to open right panel using the id from the route
	 */
	const onFirstDataRendered = (event: any) => {
		if(bidId) {
			const rowNode = event.api.getRowNode(bidId);
			rowNode.setSelected(true);
		}
	};

	const onRowGroupOpened = (params: any) => {
		// gridRef.current = params.api;
		// if(params.expanded === false) {
		// 	let index = expandedRows.indexOf(params?.data?.id);
		// 	let dupOfExpandedRows = [...expandedRows];
		// 	if(index !== -1) {
		// 		dupOfExpandedRows.splice(index, 1);
		// 		dispatch(setExpandedRows([...dupOfExpandedRows]));
		// 	}
		// } else {
		// 	dispatch(setRefreshed(false));
		// 	dispatch(setExpandedRows([...expandedRows, params?.data?.id]));
		// 	// dispatch(fetchBiddersGriddata({appInfo: appInfo, packageId: params?.data?.id})).then((data: any) => {
		// 	// 	const gridDataClone = rowData?.map((row: any) => {
		// 	// 		if(row?.id == params?.data?.id) return {...row, bidders: data?.payload};
		// 	// 		return row;
		// 	// 	});
		// 	// 	dispatch(setGridData(gridDataClone));
		// 	// });
		// }
	};

	const isRowMaster = (dataItem: any) => {
		return dataItem?.bidderCount !== 0 ? true : false;
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if(node.group) {
			const colName = groupKeyValue?.current || activeMainGridGroupKey;
			const data = node?.childrenAfterGroup?.[0]?.data || {};

			if(colName === "status") {
				return (
					<div style={{display: 'flex'}}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getBidStatus(data?.status)} colName={colName}
						/>
					</div>
				);
			} else if(colName === "processType") {
				return (
					<div style={{display: 'flex'}}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getBidProcessType(data?.processType)} colName={colName}
						/>
					</div>
				);
			} else if(colName === "type") {
				return (
					<div style={{display: 'flex'}}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getBidType(data?.type)} colName={colName}
						/>
					</div>
				);
			} else if(colName === "company") {
				return (
					<div style={{display: 'flex'}}>
						<CustomGroupHeader iconCls={'common-icon-company-new'} baseCustomLine={false}
							label={data?.company?.name} colName={colName}
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
	}, [activeMainGridGroupKey]);

	return (
		<div className='bid-manager-grid' style={containerStyle}>
			<div style={gridStyle} className='ag-theme-alpine'>
				<SUIGrid
					// headers={columns}
					headers={headers}
					data={rowData}
					animateRows={true}
					tableref={(val: any) => setGridApi(val)}
					getRowId={(params: any) => params.data?.id}
					grouped={true}
					rowSelection='single'
					masterDetail={true}
					groupIncludeTotalFooter={false}
					groupIncludeFooter={false}
					defaultColDef={defaultColDef}
					detailCellRendererParams={detailCellRendererParams}
					onRowDoubleClicked={onBidGridRowDoubleClick}
					rowSelected={(e: any) => rowSelected(e)}
					onRowGroupOpened={onRowGroupOpened}
					nowRowsMsg={'<div>Create new Bid by Clicking the + button above</div>'}
					isRowMaster={isRowMaster}
					groupDefaultExpanded={0}
					isGroupOpenByDefault={((params: any) => params.level === 0)}
					onFirstDataRendered={onFirstDataRendered}
					getReference={(value: any) => setGridRef(value)}
					groupDisplayType={'groupRows'}
					groupRowRendererParams={groupRowRendererParams}
					isMainGrid={true}
					openLID={showLineItemDetails}
					selectedRecord={selectedRecord}
				/>
			</div>
		</div>
	);
};

export default memo(BidManagerGrid);

export const CustomGroupHeader = memo((props: any) => {
	const {iconCls, color,bgColor, baseCustomLine = false,showStatus = false, label, colName = '', ...rest} = props;
	return (
		<div className="custom-group-header-cls" style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
			{baseCustomLine && (
				<div className={"base-custom-line pt-group"} style={{backgroundColor: color, width: '4px', height: '36px'}}></div>
			)}
			{showStatus && (
				<div
				className='status'
				style={{
					color: color,
					backgroundColor: bgColor
				}}
			>
				<span className={`status-icon ${iconCls}`}></span> {label}{' '}
			</div>
			)}
			{!showStatus && (
				<span className="custom-group-header-label-cls">{label}</span>
			)}
		</div>
	);
});