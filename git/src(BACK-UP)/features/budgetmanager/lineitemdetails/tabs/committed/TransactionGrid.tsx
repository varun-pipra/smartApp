import React, {useMemo, useState} from 'react';
import {ColDef} from 'ag-grid-enterprise';
import {Box, Button, Badge} from '@mui/material';
import {Avatar, AvatarSize} from '@ui5/webcomponents-react';
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';
import BalanceModification from 'resources/images/budgetManager/BalanceModification.svg';
import BudgetModification from 'resources/images/budgetManager/BudgetModification.svg';
import DirectCost from 'resources/images/budgetManager/DirectCost.png';
import TransferIn from 'resources/images/budgetManager/TransferIn.svg';
import TransferOut from 'resources/images/budgetManager/TransferOut.svg';

import './TransactionGrid.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';

import {postMessage} from 'app/utils';
import {getTransactionTypeText, stringToUSDateTime} from 'utilities/commonFunctions';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {getServer, getCurrencySymbol} from 'app/common/appInfoSlice';
import {fetchTransactionsData, getFilteredRecords} from 'features/budgetmanager/operations/transactionsSlice';
import SUIGrid from 'sui-components/Grid/Grid';
import FilePin from "resources/images/budgetManager/Group.svg";
var tinycolor = require('tinycolor2');

interface TransactionGridProps {
	groupAndFilterData?: any;
}

// const TransactionGrid = (props: TransactionGridProps) => {
const TransactionGrid = ({groupAndFilterData}: TransactionGridProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const currency = useAppSelector(getCurrencySymbol);
	const records = useAppSelector(getFilteredRecords);
	const {selectedRow} = useAppSelector(state => state.rightPanel);

	const headers: ColDef[] = [{
		headerName: 'Item Name',
		field: 'name',
		pinned: 'left',
		width: 130,
		minWidth: 130,
		// maxWidth: 200,
		menuTabs: [],
		onCellClicked: (event: any) => {
			if(event.data?.smartItemId) {
				postMessage({event: 'openitem', body: {smartItemId: event.data?.smartItemId}});
			}
		},
		cellRenderer: (params: any) => {
			const initials = params.data?.name?.split('-')[0];
			const image = params.data?.smartAppId ? <img src={`${appInfo?.hostUrl}/EnterpriseDesktop/Dashboard/Shortcut.mvc/GetAppThumbnailUrl?appId=${params.data?.smartAppId}&size=2&sessionId=${appInfo?.sessionId}`} style={{height: '32px', width: '32px'}} /> :
				params.data?.stageName !== 'Summary' ? <Avatar colorScheme={'Accent10'} initials={initials} size={AvatarSize.XS}></Avatar> : '';
			return params.data && (<div className={`app-items-cell-contentt ${params.value && params.data.stageName ? 'clickablee' : ''}`}>
				{image}&nbsp;
				<IQTooltip title={params.data?.smartItemId ? 'App Item' : getTransactionTypeText(params.data.transactionType)} placement={"bottom"} arrow={true}>
					<span className='txn-name-tag' style={{color: params.data?.smartAppId ? '#059CDF' : ''}}>{params.value}</span>
				</IQTooltip>
			</div>
			);
		}
	}, {
		headerName: '',
		field: 'stageName',
		pinned: 'left',
		width: 170,
		minWidth: 170,
		// maxWidth: 150,
		menuTabs: [],
		cellRenderer: (params: any) => {
			// console.log("params In cellrender", params)
			const stageIndicator = params.value ?
				params.value === 'Summary' ?
					params.value : <IQTooltip title={params.value.length > 11 ? params.value : ''}>
						<Button disabled
							variant='contained'
							style={{
								backgroundColor: `#${params.data?.stageColor}`,
								color: tinycolor(params.data?.stageColor).isDark() ? 'white' : 'black',
								width: '130px',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								display: 'block',
								textOverflow: 'ellipsis',
								marginTop: '5px',
							}}>{params.value}
						</Button>
					</IQTooltip>
				: <></>;
			return stageIndicator;
		}
	},
	{
		headerName: 'Amount',
		field: 'amount',
		// type:'coloredCurrency',
		minWidth: 150,
		// maxWidth: 200,
		aggFunc: "sum",
		// type: "currency",
		menuTabs: [],
		cellRenderer: (params: any) => {
			let styleOpts = {style: {color: (Number(params.value?.toString()?.replaceAll(",", ""))) >= 0 ? '' : 'red'}};
			if(params.node.footer || params.node.level > 0 || !params.node.expanded) {
				return <div className='right-align' {...styleOpts}>
					{amountFormatWithSymbol(params?.value)}
				</div>;
			}
		}
	}, {
		headerName: 'Remaining Balance',
		field: 'balance',
		// type:'coloredCurrency',
		minWidth: 180,
		// maxWidth: 165,
		// aggFunc: "sum",
		// type: "currency",
		menuTabs: [],
		cellRenderer: (params: any) => {
			let styleOpts = params?.data?.stageName == 'Summary' ? {style: {color: (Number(getSelectedRowData()?.balance?.toString()?.replaceAll(",", ""))) >= 0 ? '#008000c2' : 'red'}} : {style: {color: (Number(params.value?.toString()?.replaceAll(",", ""))) >= 0 ? '#008000c2' : 'red'}};
			if(params.node.footer || params.node.level > 0 || !params.node.expanded) {
				return <div className='right-align' {...styleOpts}>
					{params?.data?.stageName == 'Summary' ? amountFormatWithSymbol(getSelectedRowData()?.balance) : amountFormatWithSymbol(params.value)}
				</div>;
			}
		}
	},
	{
		headerName: 'Committed Date',
		field: 'date',
		minWidth: 200,
		sort: 'asc',
		menuTabs: [],
		cellRenderer: (params: any) => {
			return params.value ? stringToUSDateTime(params.value) : '';
		}
	},
	{
		headerName: 'Vendor',
		field: 'vendor.name',
		minWidth: 180,
		rowGroup: false,
		// maxWidth: 150,
		menuTabs: [],
		cellStyle: {'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow': 'hidden', 'padding': 0},
		cellRenderer: (params: any) => {
			return <div className='auto-wrapped-ellipsis'>{params.value}</div>;
		}
	},
	{
		headerName: 'Description',
		field: 'description',
		minWidth: 150,
		// maxWidth: 150,
		menuTabs: [],
		cellStyle: {'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow': 'hidden', 'padding': 0},
		cellRenderer: (params: any) => {
			return <div className='auto-wrapped-ellipsis'>{params.value}</div>;
		}
	},
	{
		headerName: 'Invoice/PO No.',
		field: 'invoicePONumber',
		minWidth: 150,
		// maxWidth: 150,
		menuTabs: [],
		cellRenderer: (params: any) => <div className='right-align'>{params.value}</div>
	},
	{
		headerName: 'Type',
		field: 'transactionType',
		minWidth: 150,
		menuTabs: [],
		hide: false,
		rowGroup: false,
		pinned: null,
		cellRenderer: (params: any) => {
			return params.data?.stageName !== 'Summary' ? params.value && getTransactionTypeText(params.value) : '';
			// return params.data?.stageName !== 'Summary' ? params.data?.smartItemId !== null ? 'App Item' : getTransactionTypeText(params.value) : '';
		}
	},
	{
		headerName: 'Created By',
		field: 'createdBy.displayName',
		minWidth: 150,
		menuTabs: [],
	}, {
		headerName: '',
		field: 'noOfAttachments',
		maxWidth: 50,
		menuTabs: [],
		cellRenderer: (params: any) => {
			const attachments = [1, 2, 3].includes(params.data?.transactionType) && params.data?.smartItemId === null && params?.value > 0 ?
				<Badge
					className='transaction-badge'
					color="success" overlap="circular"
					badgeContent={params.value > 0 ? params.value : null}
				>
					{/* <FilePresent fontSize="large" style={{ color: '#77C3EB' }} /> */}
					<Box component='img' alt='New View' src={FilePin} className='image' width={30} height={30} />
				</Badge>
				: <></>;

			return attachments;
		}
	}];

	const [columns, setColumns] = React.useState<ColDef[]>(headers);

	// React.useEffect(() => {
	// 	dispatch(fetchTransactionsData({ 'appInfo': appInfo, id: selectedRow.id }));
	// }, [selectedRow]);

	React.useEffect(() => {
		if(groupAndFilterData) {
			if(groupAndFilterData.group) {
				const updatedColDefs: ColDef[] = columns.map((colDef: any, index) => {
					// console.log("groupAndFilterData", groupAndFilterData);
					if(colDef.field === groupAndFilterData.group) {
						return {...colDef, rowGroup: true, hide: false, };
					} return {...colDef, pinned: '', rowGroup: false};
				});
				setColumns(updatedColDefs);

			}
			else {setColumns(headers);}
		}
	}, [groupAndFilterData]);

	const getSelectedRowData = () => {
		const {selectedRow} = useAppSelector(state => state.rightPanel);
		return selectedRow;
	};

	const getImageBasedonType = (type: any) => {
		const typeObj: any = {
			'0': BalanceModification,
			'1': DirectCost,
			'2': BalanceModification,
			'3': BudgetModification,
			'4': TransferIn,
			'5': TransferOut
		};
		return typeObj[type];
	};

	const groupRowRendererParams = useMemo(() => {
		return {
			innerRenderer: (params: any) => {
				return <div className="group-type-header">
					<img className="group-type-img" src={getImageBasedonType(params.value)} />
					{getTransactionTypeText(params.value)}
				</div>;

			}
		};
	}, []);

	return (
		// <Grid
		// 	className='committed-txn ag-theme-alpine'
		// 	rowHeight={45}
		// 	headerHeight={35}
		// 	gridOptions={{
		// 		tooltipShowDelay: 0,
		// 		columnDefs: columns,
		// 		defaultColDef: {
		// 			flex: 1,
		// 			minWidth: 190,
		// 			sortable: true,
		// 			resizable: true,
		// 		}
		// 	}}
		// 	rowData={records}
		// 	getRowId={(params) => params.data.id}
		// 	animateRows={true}
		// 	groupDefaultExpanded={-1}
		// />
		// <div className="transaction-grid-cls">
		<SUIGrid
			headers={columns}
			data={records}
			getRowId={(params: any) => params.data.uniqueId}
			grouped={true}
			groupIncludeTotalFooter={false}
			nowRowsMsg={'<div>Click on Add Transaction Button</div> <div>To add transaction</div>'}
			groupDisplayType={'groupRows'}
			groupRowRendererParams={groupRowRendererParams}
			realTimeDocPrefix="transactions@"
			// autoGroupColumnDef={{ minWidth: 200 }}
			// autoGroupColumnDef={autoGroupColumnDef}
			pinnedBottomRowConfig={{
				aggregateFields: ['amount', 'balance'],
				displayFields: {
					stageName: 'Summary',
					// description: 'This shows the summary data'
				}
			}
			} />
		// </div>

	);
};

export default TransactionGrid;