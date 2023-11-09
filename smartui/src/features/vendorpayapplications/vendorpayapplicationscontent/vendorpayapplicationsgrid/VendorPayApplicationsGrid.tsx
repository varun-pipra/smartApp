import React, {useRef} from 'react';
import {useAppSelector, useAppDispatch} from 'app/hooks';
// import './BidManagerGrid.scss';
import SUIGrid from 'sui-components/Grid/Grid';
import {getServer} from 'app/common/appInfoSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import Button from '@mui/material/Button';
import {getBidStatus} from 'utilities/bid/enums';
import {formatDate} from 'utilities/datetime/DateTimeUtils';
import CustomHeader from 'features/bidmanager/bidmanagercontent/bidmanagergrid/CustomHeader';
import {VendorContractsGridData} from 'data/vendorContracts/gridData';
import {setShowLineItemDetails, setSelectedNode, setSelectedRecord} from 'features/vendorcontracts/stores/VendorContractsSlice';
import {vendorContractsStatus, vendorContractsStatusOptions} from 'utilities/vendorContracts/enums';
var tinycolor = require('tinycolor2');

const VendorPayApplicationsGrid = (props: any) => {
	const dispatch = useAppDispatch();
	const gridRef = useRef<any>();
	const appInfo = useAppSelector(getServer);
	const containerStyle = React.useMemo(() => ({width: "100%", height: "100%"}), []);
	const gridStyle = React.useMemo(() => ({height: "100%", width: "100%"}), []);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const [statusFilter, setStatusFilters] = React.useState<boolean>(true);
	const showLineItemDetails = useAppSelector((state) => state.vendorContracts.showLineItemDetails);
	const selectedRecord = useAppSelector((state) => state.vendorContracts.selectedRecord);

	const onClick = (values: any) => {
		// if(values?.ids?.length) {
		// 	let data = originalGridData.map((row:any) => {
		// 		if(values?.ids?.includes(row.status)) return row;
		// 		return;
		// 	})
		// 	data = data.filter(function (element: any) {
		// 		return element !== undefined;
		// 	});
		// 	setStatusFilters(false);
		// 	dispatch(setGridData(data));
		// }
		// else {
		// 	setStatusFilters(true);			
		// 	dispatch(setGridData(originalGridData));
		// }
	};

	// React.useEffect(() => {setStatusFilters(true); setColumns(headers);}, [originalGridData])
	// React.useEffect(() => {statusFilter && setColumns(headers);}, [statusFilter])

	const headers = [
		{
			headerName: 'Title',
			pinned: "left",
			field: 'name',
			sort: 'asc',
			checkboxSelection: true,
			headerCheckboxSelection: true,
			width: 300,
			cellRenderer: 'agGroupCellRenderer',
			valueGetter: (params: any) => params.data?.name,
			cellRendererParams: {
				// checkbox: true,
				suppressDoubleClickExpand: true,
				innerRenderer: (params: any) => {
					return <>
						{/* <IQTooltip
						title={"Scheduled"}
						placement={"bottom"} arrow={true}
		> */}
						{/* {params?.data?.status == 5 && <span className='common-icon-AwardBid' style={{ position: 'absolute', left: '3%', marginTop: '12px'}} />} */}
						{/* </IQTooltip> */}
						<span className="ag-costcodegroup" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', color: '#059CDF'}}>{params.data?.name} </span>
					</>;
				}
			}
		}, {
			headerName: 'Status',
			pinned: "left",
			field: 'status',
			// filter: true,
			// valueGetter: (params:any) => params?.data?.status ? getBidStatus(params?.data?.status) : '', 			
			headerComponent: CustomHeader,
			headerComponentParams: {
				options: vendorContractsStatusOptions,
				columnName: 'Status',
				clearFilters: statusFilter,
				filterUpdated: (values: any) => onClick(values)
			},
			width: 220,
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				const stageIndicator = getBidStatus(params?.data?.status) ?
					getBidStatus(params?.data?.status) === 'Summary' ?
						params?.value : <IQTooltip title={getBidStatus(params?.data?.status)?.length > 11 ? getBidStatus(params?.data?.status) : ''}>
							<Button disabled
								variant='contained'
								// startIcon={<span className={StatusIcons[params?.data?.status]}/>}
								// startIcon={<Box component='img' src={StatusIcons[params?.data?.status]} style={{ height: "16px", width: '16px' }} />}
								style={{
									// backgroundColor: `#${StatusColors[params.data?.status]}`,
									// color: tinycolor(StatusColors[params.data?.status]).isDark() ? 'white' : 'black',
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
				return stageIndicator;
			}
		}, {
			headerName: 'Contract ID',
			field: 'code',
			minWidth: 150,
		}, {
			headerName: 'PO Number',
			field: 'poNumber',
			minWidth: 150,
		}, {
			headerName: 'Contract Amount',
			field: 'contractAmount',
			sum: 'aggFunc',
			type: "rightAligned",
			valueGetter: (params: any) => params.data?.contractAmount ? `${currencySymbol} ${params.data?.contractAmount?.toLocaleString("en-US")}` : "",

		}, {
			headerName: 'Vendor',
			field: 'company.name',
		}, {
			headerName: 'Bid',
			field: 'bidPackage',
		}, {
			headerName: 'Contract Start Date',
			field: 'contractStartDate',
			valueGetter: (params: any) => params.data ? formatDate(params.data?.contractStartDate) : "",
		}, {
			headerName: 'Contract End Date',
			field: 'contractEndDate',
			valueGetter: (params: any) => params.data ? formatDate(params.data?.contractEndDate) : "",
		},
		{
			headerName: 'Contract Accepted Date',
			field: 'contractAcceptedDate',
			valueGetter: (params: any) => params.data ? formatDate(params.data?.contractAcceptedDate) : "",
		},
	];

	const [columns, setColumns] = React.useState<any>(headers);

	const onBidGridRowDoubleClick = (row: any, tableRef: any) => {
		if(row && row.data) {
			// console.log("node", row?.node);
			if(props?.onRefChange) props?.onRefChange(tableRef);
			dispatch(setShowLineItemDetails(true));
			dispatch(setSelectedNode(row?.node));
			dispatch(setSelectedRecord(row?.data));
		}
	};
	const rowSelected = (sltdRows: any) => {
		// dispatch(setSelectedRows(sltdRows));
	};

	return (
		<div className="NestedGrid" style={containerStyle}>
			<div style={gridStyle} className="ag-theme-alpine">
				<SUIGrid
					ref={gridRef}
					headers={columns}
					data={VendorContractsGridData}
					getRowId={(params: any) => params.data?.id}
					grouped={true}
					rowSelection='single'
					groupIncludeTotalFooter={false}
					onRowDoubleClicked={onBidGridRowDoubleClick}
					rowSelected={(e: any) => rowSelected(e)}
					isMainGrid={true}
					openLID={showLineItemDetails}
					selectedRecord={selectedRecord}
					nowRowsMsg={'<div>Create new Vendor Contract by Clicking the + button above</div>'}


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

export default VendorPayApplicationsGrid;