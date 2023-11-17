import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { styled, alpha, Box, Button, Paper, Stack, IconButton, Menu, MenuItem, Divider, MenuProps, Alert } from '@mui/material';
import { Add, Close, KeyboardArrowDown } from '@mui/icons-material';
import { ColDef } from 'ag-grid-enterprise';
import './VCChangeEvents.scss';

import SUIGrid from 'sui-components/Grid/Grid';
import { getTransactionTypeText } from 'utilities/commonFunctions';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { getVCChangeEventsList, setPostAndLockResponseClick } from 'features/vendorcontracts/stores/VCChangeEventsSlice';
import { getServer } from 'app/common/appInfoSlice';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';

const CCChangeEvents = (props: any) => {
	const dispatch = useAppDispatch();
	const [rowData, setRowData] = useState<Array<any>>([]);
	const appInfo = useAppSelector(getServer);
	const { selectedRecord } = useAppSelector((state) => state.vendorContracts);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const submitPostChangeAndLockResponseClick = useAppSelector((state) => state?.changeEvents?.submitPostChangeAndLockResponseClick)
	const { changeEventsList } = useAppSelector((state) => state?.changeEvents);

	React.useEffect(() => {
		// console.log("payment ledger");
		dispatch(getVCChangeEventsList({ appInfo: appInfo, id: selectedRecord?.id }));
	}, [selectedRecord]);

	React.useEffect(() => {
		setRowData(changeEventsList?.events);
	}, [changeEventsList]);

	const columns = [{
		headerName: 'Name',
		field: 'changeEvent.name',
		pinned: 'left',
		hide: true,
		rowGroup: true
	}, {
		headerName: 'Change Event ID',
		field: 'changeEvent.code',
		menuTabs: [],
	}, {
		headerName: 'Original Amount',
		field: 'contractAmount',
		menuTabs: [],
		aggFunc: 'sum',
		type: 'rightAligned',
		cellRenderer: (params: any) => {
			if (params.value && (params.node.footer || params.node.level > 0 || !params.node.expanded))
				return <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div>;
		}
	}, {
		headerName: 'Change Event/CO Amount',
		field: 'changeOrderAmount',
		menuTabs: [],
		aggFunc: 'sum',
		minWidth: 220,
		type: 'rightAligned',
		cellRenderer: (params: any) => {
			if (params.value && (params.node.footer || params.node.level > 0 || !params.node.expanded))
				return <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div>;
		}
	}, {
		headerName: 'Revised Amount',
		field: 'revisedAmount',
		menuTabs: [],
		aggFunc: 'sum',
		type: 'rightAligned',
		cellRenderer: (params: any) => {
			if (params.value && (params.node.footer || params.node.level > 0 || !params.node.expanded))
				return <div className='right-align'>
					{amountFormatWithSymbol(params.value || 0)}
				</div>;
		}
	}, {
		headerName: 'Date',
		field: 'submittedOn',
		menuTabs: [],
		valueGetter: (params: any) => params?.value ? formatDate(params?.value) : '',
	},];
	const autoGroupColumnDef: ColDef = useMemo<ColDef>(() => {
		return {
			headerName: 'Name',
			field: 'changeEvent.name',
			pinned: 'left',
			minWidth: 400,
			rowGroup: true,
			resizable: true,
			suppressRowClickSelection: true,
			cellRenderer: 'agGroupCellRenderer',
			onCellClicked: (cell: any) => {
				const { smartapp, id } = cell.data;
				if (id) {
					postMessage({ event: 'openitem', body: { smartItemId: id } });
				}
			},
			cellRendererParams: {
				innerRenderer: (cell: any) => {
					if (!cell.data) {
						const isFooter = cell?.node?.footer;
						const isRootLevel = cell?.node?.level === -1;
						if (isFooter) {
							if (isRootLevel) {
								return 'Summary';
							}
							return `Subtotal`;
						} else {
							return <span className='hot-link' onClick={() => {
								window.open(
									`${appInfo?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/change-event-requests/home?id=${cell?.data?.id}#react`,
									"_blank"
								);
							}}>{cell.value}</span>;;
						}
					}
					if (cell.node.group) {
						return <span className='hot-link' onClick={() => {
							window.open(
								`${appInfo?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/change-event-requests/home?id=${cell?.data?.id}#react`,
								"_blank"
							);
						}}>{cell.value}</span>;
					} else {
						const { name, board, smartapp } = cell.data;

						return <div>
							<span className='hot-link1'>
								{`${cell?.data?.name} - ${cell?.data?.division} - ${cell?.data?.costCode} - ${cell?.data?.costType}`}
							</span></div>
					}
				}
			},
			// valueGetter: (params: any) => {
			// 	if (params.node.group) {
			// 		return params.data?.budgetLineItem || '';
			// 	} else return params.data?.name || '';
			// }
		};
	}, []);

	return <Box className='vc-change-events'>
		<div className='header'>
			<div className='title-action'>
				<span className='title'>Change Events</span>
			</div>
			<div className='kpi-fields'>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>No. of Change Events</div>
					<div className='kpi-field-container'>
						<span className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></span>
						<span className='kpi-value'>
							{/* {`1`} */}
							{` ${changeEventsList?.noofEvents ? changeEventsList?.noofEvents?.toLocaleString('en-US') : 0}`}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Change Event Amount</div>
					<div className='kpi-field-container'>
						<span className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></span>
						<span className='kpi-value'>
							{amountFormatWithSymbol(changeEventsList?.totalChangeEventAmount)}
						</span>
					</div>
				</span>
			</div>
		</div>
		<div className='vc-client-contract-list'>
			<SUIGrid
				headers={columns}
				data={rowData}
				getRowId={(params: any) => params?.data?.rowId}
				grouped={true}
				groupIncludeTotalFooter={false}
				nowRowsMsg={''}
				realTimeDocPrefix="changeEvent@"
				autoGroupColumnDef={autoGroupColumnDef}

			/>
		</div>
		{submitPostChangeAndLockResponseClick && (
			<Alert severity="success" className='floating-toast-cls' onClose={() => { dispatch(setPostAndLockResponseClick(false)) }}>
				<span className="toast-text-cls toast-line-cls">
					<b>1</b> Created change events and notified to the Vendor.
				</span>
				<span className="toast-text-cls toast-line-cls">
					<b>2</b> Posted Contract and Locked.
				</span>
			</Alert>
		)}
	</Box>;
};

export default CCChangeEvents;