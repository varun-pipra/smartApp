import React, { useMemo, useState } from 'react';
import { AgGridReact as Grid } from 'ag-grid-react';
import { ColDef } from 'ag-grid-enterprise';
import { Box, Button, Badge } from '@mui/material';
import { FilePresent } from '@mui/icons-material';
import { Avatar, AvatarSize } from '@ui5/webcomponents-react';

import './PayApplicationsGrid.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import IQSearch from 'components/iqsearchfield/IQSearchField';

import { postMessage, isLocalhost } from 'app/utils';
import { getTransactionTypeText, stringToUSDateTime } from 'utilities/commonFunctions';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getServer, getCurrencySymbol } from 'app/common/appInfoSlice';
import { fetchTransactionsData, getFilteredRecords, setOpenDirectCostForm } from 'features/budgetmanager/operations/transactionsSlice';
import SUIGrid from 'sui-components/Grid/Grid';

var tinycolor = require('tinycolor2');

interface TransactionGridProps {
	groupAndFilterData?: any;
}

// const PayApplicationsGrid = (props: TransactionGridProps) => {
const PayApplicationsGrid = ({ groupAndFilterData }: TransactionGridProps) => {
	const dispatch = useAppDispatch();
	const headers: ColDef[] = [{
		headerName: 'Pay App ID'
	}, {
		headerName: 'Contract Number'
	}, {
		headerName: 'Vendor'
	}, {
		headerName: 'Payment Amount'
	}, {
		headerName: 'Pending Amount'
	}, {
		headerName: 'Date Approved'
	}, {
		headerName: 'Date Paid'
	}, {
		headerName: 'Retainage'
	}];

	const [columns, setColumns] = React.useState<ColDef[]>(headers);

	return (
		<SUIGrid
			headers={columns}
			data={[]}
			getRowId={(params: any) => params.data.uniqueId}
			grouped={true}
			groupIncludeTotalFooter={false}
			pinnedBottomRowConfig={{
				aggregateFields: ['amount'],
				displayFields: {
					stageName: 'Summary'
				}
			}}
		/>
	);
};

export default PayApplicationsGrid;

// const headers: ColDef[] = [{
// 	headerName: 'Item Name',
// 	field: 'smartAppId',
// 	pinned: 'left',
// 	width: 130,
// 	minWidth: 130,
// 	menuTabs: [],
// 	onCellClicked: (event: any) => {
// 		if (event.data.smartItemId) {
// 			postMessage({ event: 'openitem', body: { smartItemId: event.data.smartItemId } });
// 		}
// 	},
// 	cellRenderer: (params: any) => {
// 		const initials = params.data?.name?.split('-')[0];
// 		const image = params.value ? <img src={`${appInfo?.hostUrl}/EnterpriseDesktop/Dashboard/Shortcut.mvc/GetAppThumbnailUrl?appId=${params.value}&size=2&sessionId=${appInfo?.sessionId}`} style={{ height: '32px', width: '32px' }} /> :
// 			params.data?.stageName !== 'Summary' ? <Avatar colorScheme={'Accent10'} initials={initials} size={AvatarSize.XS}></Avatar> : '';
// 		return params.data && (<div className={`app-items-cell-contentt ${params.value && params.data.stageName ? 'clickablee' : ''}`}>
// 			{image}&nbsp;<span className='txn-name-tag'>{params.data?.name}</span>
// 		</div>
// 		);
// 	}
// }, {
// 	headerName: '',
// 	field: 'stageName',
// 	pinned: 'left',
// 	width: 150,
// 	minWidth: 130,
// 	menuTabs: [],
// 	cellRenderer: (params: any) => {
// 		const stageIndicator = params.value ?
// 			params.value === 'Summary' ?
// 				params.value : <IQTooltip title={params.value.length > 11 ? params.value : ''}>
// 					<Button disabled
// 						variant='contained'
// 						style={{
// 							backgroundColor: `#${params.data?.stageColor}`,
// 							color: tinycolor(params.data?.stageColor).isDark() ? 'white' : 'black',
// 							width: '130px',
// 							overflow: 'hidden',
// 							whiteSpace: 'nowrap',
// 							display: 'block',
// 							textOverflow: 'ellipsis',
// 							marginTop: '5px',
// 						}}>{params.value}
// 					</Button>
// 				</IQTooltip>
// 			: <></>;
// 		return stageIndicator;
// 	}
// },
// {
// 	headerName: 'Amount',
// 	field: 'amount',
// 	minWidth: 150,
// 	aggFunc: "sum",
// 	menuTabs: [],
// 	cellRenderer: (params: any) => {
// 		let operand = params.value >= 0 ? '(+)' : '(-)',
// 			styleOpts = params.value >= 0 ? {} : { style: { color: 'red' } };

// 		if (params.value && (
// 			params.node.footer ||
// 			params.node.level > 0 ||
// 			!params.node.expanded)
// 		)
// 			return <div className='right-align' {...styleOpts}>
// 				{currency} {Math.abs(params.value || 0)?.toLocaleString()} {operand}
// 			</div>
// 	}
// }, {
// 	headerName: 'Remaining Balance',
// 	field: 'balance',
// 	minWidth: 180,
// 	menuTabs: [],
// 	cellRenderer: (params: any) => {
// 		let operand = params.value >= 0 ? '(+)' : '(-)',
// 			styleOpts = { style: { color: (params.value >= 0 ? '#008000c2' : 'red') } };
// 		if (params.value && (
// 			params.node.footer ||
// 			params.node.level > 0 ||
// 			!params.node.expanded)
// 		)
// 			return <div className='right-align' {...styleOpts}>
// 				{currency} {Math.abs(params.value || 0)?.toLocaleString()} {operand}
// 			</div>
// 	}
// },
// {
// 	headerName: 'Type',
// 	field: 'transactionType',
// 	minWidth: 150,
// 	menuTabs: [],
// 	hide: false,
// 	rowGroup: false,
// 	pinned: null,
// 	cellRenderer: (params: any) => {
// 		return params.data?.stageName !== 'Summary' ? params.data?.smartItemId ? 'App Item' : params.value && getTransactionTypeText(params.value) : '';
// 	}
// }, {
// 	headerName: 'Description',
// 	field: 'description',
// 	minWidth: 150,
// 	menuTabs: [],
// 	cellStyle: { 'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow': 'hidden', 'padding': 0 },
// 	cellRenderer: (params: any) => {
// 		return <div className='auto-wrapped-ellipsis'>{params.value}</div>
// 	}
// }, {
// 	headerName: 'Vendor',
// 	field: 'vendor.name',
// 	minWidth: 180,
// 	menuTabs: [],
// 	cellStyle: { 'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'overflow': 'hidden', 'padding': 0 },
// 	cellRenderer: (params: any) => {
// 		return <div className='auto-wrapped-ellipsis'>{params.value}</div>
// 	}
// }, {
// 	headerName: 'Invoice/PO No.',
// 	field: 'invoicePONumber',
// 	minWidth: 150,
// 	menuTabs: [],
// 	cellRenderer: (params: any) => <div className='right-align'>{params.value}</div>
// },
// {
// 	headerName: 'Date',
// 	field: 'date',
// 	minWidth: 150,
// 	menuTabs: [],
// 	cellRenderer: (params: any) => {
// 		return params.value ? stringToUSDateTime(params.value) : '';
// 	}
// },
// {
// 	headerName: 'Created By',
// 	field: 'createdBy.displayName',
// 	minWidth: 150,
// 	menuTabs: [],
// }, {
// 	headerName: '',
// 	field: 'noOfAttachments',
// 	maxWidth: 50,
// 	menuTabs: [],
// 	cellRenderer: (params: any) => {
// 		const attachments = [1, 2, 3].includes(params.data?.transactionType) && params.data?.smartItemId === null && params?.value > 0 ?
// 			<Badge
// 				className='transaction-badge'
// 				color="success" overlap="circular"
// 				badgeContent={params.value > 0 ? params.value : null}
// 			>
// 				<FilePresent fontSize="large" style={{ color: '#77C3EB' }} />
// 			</Badge> : <></>;

// 		return attachments;
// 	}
// }];