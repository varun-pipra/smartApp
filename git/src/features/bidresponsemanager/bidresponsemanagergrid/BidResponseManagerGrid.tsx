import './BidResponseManagerGrid.scss';
import _ from 'lodash';
import { getCostCodeDivisionList, getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import CustomHeader from 'features/bidmanager/bidmanagercontent/bidmanagergrid/CustomHeader';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SUIAwardedBidderTooltip from 'sui-components/AwardedBidderTooltip/AwardedBidderTooltip';
import SUIGrid from 'sui-components/Grid/Grid';
import { getBidProcessType, getBidStatus, getIntendToBid } from 'utilities/bid/enums';
import {
	getPackageStatus, getPackageStatusColor, getResponseStatus, getResponseStatusColor,
	getResponseStatusIcons, ResponseStatusOptions
} from 'utilities/bidResponse/enums';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import Button from '@mui/material/Button';
import {
	fetchBidResponseDetailsData, setSelectedNode, setSelectedRecord, setShowLineItemDetails,
} from '../stores/BidResponseManagerSlice';
import { setActiveMainGridFilters, setActiveMainGridGroupKey, setActiveMainGridDefaultFilters, setSelectedRows } from '../stores/gridSlice';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';
import CustomFilterHeader from 'features/common/gridHelper/CustomFilterHeader';
import {clearObjectValues} from 'sui-components/ViewBuilder/utils';


var tinycolor = require('tinycolor2');
let defaultBRMStatusFilter: any = [];

const BidResponseManagerGrid = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { bidResponseData, originalBidResponseData, liveData, activeMainGridGroupKey,
		activeMainGridFilters, mainGridSearchText } = useAppSelector((state) => state.bidResponseManagerGrid);
	const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
	const [rowData, setRowData] = useState<any>([]);
	const [respStatusFilter, setRespStatusFilters] = useState<any>({ ids: [], names: [] });
	const gridRT = useRef<boolean>(false);
	const [gridRef, setGridRef] = React.useState<any>();
	const groupKeyValue = useRef<any>(null);
	const [filteredRecords, setFilteredRecords] = React.useState<any>([]);
	const [aliasOriginalGridData, setAliasOriginalGridData] = useState(originalBidResponseData);
	const showLineItemDetails = useAppSelector((state) => state.bidResponseManager.showLineItemDetails);
	const selectedRecord = useAppSelector((state) => state.bidResponseManager.selectedRecord);
	const [statusFilter, setStatusFilter] = useState<boolean>(true);
	const { viewData, viewBuilderData } = useAppSelector(state => state.viewBuilder);

	const [viewBuilderColumns, setViewBuilderColumns] = React.useState<any>([]);

	

	useEffect(() => {
		gridRef?.current?.api?.applyTransaction(liveData);
	}, [liveData]);

	useEffect(() => { setRowData(bidResponseData); setFilteredRecords(bidResponseData); }, [bidResponseData]);

	useEffect(() => {
		if (originalBidResponseData?.length) {
			let updatedGridData = originalBidResponseData?.map((obj: any) => ({
				...obj,
				aliasStatus: getResponseStatus(obj?.responseStatus) || '',
				aliasBidPackage: getBidStatus(obj?.packageStatus) || '',
				aliasprocess: getBidProcessType(obj?.processType) || '',
				aliasIntendToBid: getIntendToBid(obj?.intendToBid) || '',
				aliasBudgets: obj?.budgetItems?.map((budget: any) => budget?.name + '-' + budget?.costCode + '-' + budget?.costType)
			}));
			setAliasOriginalGridData(updatedGridData);
		}
	}, [originalBidResponseData]);


	const FilterBy = (gridData: any) => {
		const gridDataCopy = [...bidResponseData];
		let filteredData = gridDataCopy;
		if (!activeMainGridFilters?.responseStatus) setRespStatusFilters({ ids: [], names: [] });
		if (activeMainGridFilters?.responseStatus?.length > 0) {
			filteredData = gridDataCopy.filter((rec: any) => {
				return activeMainGridFilters?.responseStatus?.includes(rec?.responseStatus?.toString());
			});
			// let statusIds: any = [];
			// let statusNames: any = [];
			// const filters = activeMainGridFilters?.responseStatus?.map((ele: any) => {
			// 	statusIds.push(Number(ele));
			// 	statusNames.push(getResponseStatus(Number(ele)));
			// });
			// setRespStatusFilters({ids: [...statusIds], names: [...statusNames]});
			// } else if(Object.keys(activeMainGridFilters).length === 0 || (activeMainGridFilters?.status?.length === 0 ?? false)) {
			// setRespStatusFilters({ids: [], names: []});
		}
		if (activeMainGridFilters?.bidpackageStatus?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.bidpackageStatus?.includes(rec?.packageStatus?.toString());
			});
		}
		if (activeMainGridFilters?.intendToBid?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.intendToBid?.includes(rec?.intendToBid?.toString());
			});
		}
		if (activeMainGridFilters?.processType?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return activeMainGridFilters?.processType?.includes(rec?.processType?.toString());
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
		const gridDataCopy = [...bidResponseData];
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
			setRespStatusFilters({ ids: [], names: [] });
		} else {
			setRowData([...gridDataCopy]);
			setFilteredRecords([...gridDataCopy]);
			setRespStatusFilters({ ids: [], names: [] });
		};
	}, [activeMainGridFilters, mainGridSearchText, bidResponseData]);


	const onClick = (values: any) => {
		dispatch(setActiveMainGridDefaultFilters({ ...activeMainGridFilters, responseStatus: values?.ids?.map(String) }));
		if (values?.ids?.length) {
			let data = originalBidResponseData.map((row: any) => {
				if (values?.ids?.includes(row.responseStatus)) return row;
				return;
			});
			data = data.filter(function (element: any) {
				return element !== undefined;
			});
			setRowData(data);
		} else {
			setRespStatusFilters({ ids: [], names: [] });
			setRowData(originalBidResponseData);
		}
	};

	const handleStatusFilter = (statusFilters: any) => {
		const consolidatedFilter = { ...activeMainGridFilters, ...{ responseStatus: statusFilters } };
		dispatch(setActiveMainGridFilters(consolidatedFilter));
		dispatch(setActiveMainGridDefaultFilters(consolidatedFilter));
	};

	const biddersContent = (event: any) => {
		const array = event?.map((value: any) => {
			return {
				id: value.company.id,
				company: value.company.name,
				amount: value.totalBidValue,
				logo: value.company.thumbnailUrl,
				isAwarded: value.hasWon,
			};
		});
		return array;
	};

	const headers = useMemo(() => [
		{
			headerName: 'Bid Packages',
			pinned: 'left',
			field: 'name',
			sort: 'asc',
			comparator: (valueA: any, valueB: any) => valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
			//accentedSort: true,
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 350,
			valueGetter: (params: any) => params.data?.name,
			cellRenderer: (params: any) => {
				return <span className='ag-costcodegroup' style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#059cdf' }}>{params.data?.name} </span>;
			}
		}, {
			headerName: 'Response Status',
			pinned: 'left',
			field: 'responseStatus',
			width: 100,
			rowGroup: activeMainGridGroupKey === 'responseStatus',
			// headerComponent: CustomHeader,
			// headerComponentParams: {
			// 	options: ResponseStatusOptions,
			// 	columnName: 'Response Status',
			// 	defaultFilters: respStatusFilter,
			// 	filterUpdated: (values: any) => onClick(values)
			// },
			headerComponent: CustomFilterHeader,
			headerComponentParams: {
				columnName: 'Response Status',
				options: ResponseStatusOptions,
				defaultFilters: defaultBRMStatusFilter,
				onOpen: () => setStatusFilter(false),
				onClose: () => setStatusFilter(true),
				onFilter: handleStatusFilter
			},
			cellRenderer: (params: any) => {
				const stageIndicator = getResponseStatus(params?.data?.responseStatus) ?
					getResponseStatus(params?.data?.responseStatus) === 'Summary' ?
						params?.value : <IQTooltip title={getResponseStatus(params?.data?.responseStatus)?.length > 11 ? getResponseStatus(params?.data?.responseStatus) : ''}>
							<Button disabled
								variant='contained'
								startIcon={<span className={getResponseStatusIcons(params?.data?.responseStatus)} />}
								style={{
									backgroundColor: `#${getResponseStatusColor(params.data?.responseStatus)}`,
									color: tinycolor(getResponseStatusColor(params.data?.responseStatus)).isDark() ? 'white' : 'black',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									width: 'auto',
									paddingLeft: '10px',
									paddingRight: '10px',
									minWidth: '50px',
									textOverflow: 'ellipsis',
									marginTop: '0px',
								}}>{getResponseStatus(params?.data?.responseStatus)}
							</Button>
						</IQTooltip>
					: <></>;
				return stageIndicator;
			}
		}, {
			headerName: 'Bid Package Status',
			field: 'packageStatus',
			width: 100,
			menuTabs: [],
			rowGroup: activeMainGridGroupKey === 'packageStatus',
			cellRenderer: (params: any) => {
				const stageIndicator = getPackageStatus(params?.data?.packageStatus) ?
					getPackageStatus(params?.data?.packageStatus) === 'Summary' ?
						params?.value : <><IQTooltip title={getPackageStatus(params?.data?.packageStatus)?.length > 11 ? getPackageStatus(params?.data?.packageStatus) : ''}>
							<Button disabled
								variant='contained'
								style={{
									backgroundColor: `#${getPackageStatusColor(params.data?.packageStatus)}`,
									color: tinycolor(getPackageStatusColor(params.data?.packageStatus)).isDark() ? 'white' : 'black',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									width: 'auto',
									paddingLeft: '10px',
									paddingRight: '10px',
									minWidth: '50px',
									textOverflow: 'ellipsis',
									marginTop: '0px',
								}}>{getPackageStatus(params?.data?.packageStatus)}
							</Button>
						</IQTooltip>
							{params.data?.packageStatus == 5 && params?.data?.processType != 1 ?
								<SUIAwardedBidderTooltip
									uniqeId={params?.data?.id}
									tooltipData={biddersContent(params.data?.bidders)}
								/>
								: null} </>
					: <></>;
				return stageIndicator;
			}
		}, {
			headerName: 'Bid Amount',
			field: 'bidAmount',
			sum: 'aggFunc',
			type: 'rightAligned',
			valueGetter: (params: any) => amountFormatWithSymbol(params.data.bidAmount)
		}, {
			headerName: 'Bid Process',
			field: 'processType',
			rowGroup: activeMainGridGroupKey === 'processType',
			valueGetter: (params: any) => params.data ? getBidProcessType(params.data?.processType) : ''
		}, {
			headerName: 'Description',
			field: 'description'
		}, {
			headerName: 'Budget Line Item',
			field: 'budgetItems',
			type: 'showCount',
			minWidth: 300,
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
			headerName: 'Query Deadline',
			field: 'querydeadline',
			valueGetter: (params: any) => params.data?.queryDeadLine ? formatDate(params.data?.queryDeadLine) : ''
		}, {
			headerName: 'Intent Bid',
			field: 'intendToBid',
			rowGroup: activeMainGridGroupKey === 'intendToBid',
			valueGetter: (params: any) => params.data ? getIntendToBid(params?.data?.intendToBid) : ''
		}, {
			headerName: 'Queries',
			field: 'queryCount',
			type: 'rightAligned',
			cellRenderer: (params: any) => {
				return <span style={{ color: '#059CDF' }}>{params.data?.queryCount} </span>;
			}
		}
	], [defaultBRMStatusFilter, activeMainGridGroupKey]);

	const [colDef, setColDef] = useState<any>([...headers]);

	useMemo(()=>{
		if(activeMainGridFilters.responseStatus?.length){
			if(statusFilter){
				let updatedColumndDefList: any = colDef.map((cDef: any) => {
					if (cDef.field == "responseStatus") {
						return { ...cDef,headerComponentParams : {...cDef.headerComponentParams , defaultFilters :[...activeMainGridFilters.responseStatus]}};
					}
					return cDef;
				});
				setColDef(updatedColumndDefList);
			}
		}
		else{
			let updatedColumndDefList2: any = colDef.map((cDef: any) => {
				if (cDef.field == "status") {
					return { ...cDef,headerComponentParams : {...cDef.headerComponentParams , defaultFilters :undefined}};
				}
				return cDef;
			});
			setColDef(updatedColumndDefList2);
		}
	},[activeMainGridFilters])

	useEffect(() => {
		if (viewBuilderData.length && viewData?.columnsForLayout?.length) {
			let updatedColumndDefList: any = [];
			const gridApi = gridRef.current;
			if (gridApi) {
				let updatedColumndDefList: any = [];

				const columns = gridRef?.current?.columnApi?.columnModel?.columnDefs;
				viewData?.columnsForLayout.forEach((viewItem: any) => {
					columns.forEach((cDef: any) => {
						if (viewItem.field == cDef.field) {
							let newColumnDef = {
								...cDef,
								...viewItem,
								hide: viewItem?.hide,
								headerComponentParams : cDef.field == "responseStatus" && {...cDef.headerComponentParams , defaultFilters :activeMainGridFilters.responseStatus?.length ? activeMainGridFilters.responseStatus : undefined}
							};
							updatedColumndDefList.push(newColumnDef);
						}
					});
				});
				setViewBuilderColumns(updatedColumndDefList);
				// setColDef([...updatedColumndDefList])
				// gridApi?.api?.setColumnDefs(updatedColumndDefList);
			}
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
		const columnsCopy = viewBuilderColumns && viewBuilderColumns.length > 0 ? [...viewBuilderColumns] : [...colDef];
		if (((activeMainGridGroupKey ?? false) && activeMainGridGroupKey !== "")) {
			groupKeyValue.current = activeMainGridGroupKey;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = activeMainGridGroupKey ? activeMainGridGroupKey === col.field : false;
				col.headerComponentParams = col.field == "responseStatus" && {...col.headerComponentParams , defaultFilters :activeMainGridFilters.responseStatus?.length ? activeMainGridFilters.responseStatus : undefined};
			});
			setColDef(columnsCopy);
		} else if (activeMainGridGroupKey ?? true) {
			groupKeyValue.current = null;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = false;
			});
			dispatch(setActiveMainGridGroupKey(null));
			setColDef(columnsCopy);
		};
	}, [activeMainGridGroupKey, viewBuilderColumns]);

	const defaultColDef = useMemo(() => {
		return {
			flex: 1,
		};
	}, []);

	const onBidGridRowDoubleClick = (row: any, tableRef: any) => {
		if (row && row.data) {
			if (props?.onRefChange) props?.onRefChange(tableRef);
			dispatch(setShowLineItemDetails(true));
			dispatch(setSelectedRecord(row?.data));
			dispatch(fetchBidResponseDetailsData({ appInfo: appInfo, responseId: row?.data?.id }));
			dispatch(setSelectedNode(row?.node));
		}
	};

	const rowSelected = (sltdRows: any) => {
		dispatch(setSelectedRows(sltdRows));
	};

	const CustomGroupHeader = React.memo((props: any) => {
		const { iconCls, color, baseCustomLine = false, label, colName = '', ...rest } = props;
		return (
			<div className="custom-group-header-cls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
				{baseCustomLine && (
					<div className={"base-custom-line pt-group"} style={{ backgroundColor: color, width: '4px', height: '36px' }}></div>
				)}
				<span className="custom-group-header-label-cls">{label}</span>
			</div>
		);
	});

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if (node.group) {
			const colName = groupKeyValue?.current || activeMainGridGroupKey;
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if (colName === "responseStatus") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getResponseStatus(data?.responseStatus)} colName={colName}
						/>
					</div>
				);
			} else if (colName === "packageStatus") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getPackageStatus(data?.packageStatus)} colName={colName}
						/>
					</div>
				);
			} else if (colName === "intendToBid") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getIntendToBid(data?.intendToBid)} colName={colName}
						/>
					</div>
				);
			} else if (colName === "processType") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={getBidProcessType(data?.processType)} colName={colName}
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


	return (
		<div className='NestedGrid' style={containerStyle}>
			<div style={gridStyle} className='ag-theme-alpine gridCt'>
				<SUIGrid
					headers={colDef}
					//headers={headers}
					data={rowData}
					grouped={true}
					animateRows={true}
					getRowId={(params: any) => params.data?.id}
					groupIncludeTotalFooter={false}
					groupIncludeFooter={false}
					defaultColDef={defaultColDef}
					onRowDoubleClicked={onBidGridRowDoubleClick}
					rowSelection='multiple'
					rowSelected={(e: any) => rowSelected(e)}
					getReference={(value: any) => { setGridRef(value); }}
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

export default BidResponseManagerGrid;