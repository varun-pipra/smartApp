import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { styled, alpha, Box, Button, Paper, Stack, IconButton, Menu, MenuItem, Divider, MenuProps } from '@mui/material';
import { Add, Close, KeyboardArrowDown } from '@mui/icons-material';
import { ColDef } from 'ag-grid-enterprise';
import './CCChangeEvents.scss';

import SUIGrid from 'sui-components/Grid/Grid';
import { getTransactionTypeText } from 'utilities/commonFunctions';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { getServer } from 'app/common/appInfoSlice';
import { getCCChangeEventsList } from 'features/clientContracts/stores/CCChangeEventsSlice';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

const CCChangeEvents = (props: any) => {
	const dispatch = useAppDispatch();
	const [rowData, setRowData] = useState<Array<any>>([]);
	const appInfo = useAppSelector(getServer);
	const { selectedRecord } = useAppSelector((state) => state.clientContracts);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { changeEventsList } = useAppSelector((state) => state?.ccChangeEvents);


	React.useEffect(() => {
		dispatch(getCCChangeEventsList({ appInfo: appInfo, id: selectedRecord?.id }));
	}, [selectedRecord]);

	React.useEffect(() => {
		console.log("changeEventsList", changeEventsList);
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
		// cellRendererParams: {
		// 	innerRenderer: (cell: any) => {
		// 		if (cell?.node?.group) {
		// 			return cell?.value;
		// 		} else ''
		// 	}
		// },
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
					{amountFormatWithSymbol(params.value)}
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
							return <div className='hot-link' onClick={() => {
								window.open(
									`${appInfo?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/change-event-requests/home?id=${cell?.data?.id}#react`,
									"_blank"
								);
							}}>{cell.value}</div>;;
						}
					}
					if (cell.node.group) {
						return <div className='hot-link' onClick={() => {
							window.open(
								`${appInfo?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/change-event-requests/home?id=${cell?.data?.id}#react`,
								"_blank"
							);
						}}>{cell.value}</div>;
					}
					else {
						const { name, board, smartapp } = cell.data;

						return <div className='blue-color mouse-pointer vertical-center-align1'>
							<span className="hot-link1" >
								{`${cell?.data?.name} - ${cell?.data?.division} - ${cell?.data?.costCode} - ${cell?.data?.costType}`}
							</span>
						</div>
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

	return <Box className='cc-change-events'>
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
		<div className='cc-client-contract-list'>
			<SUIGrid
				headers={columns}
				data={rowData}
				getRowId={(params: any) => params?.data?.rowId}
				grouped={true}
				groupIncludeTotalFooter={false}
				nowRowsMsg={''}
				realTimeDocPrefix="changeEvent@"
				// autoGroupColumnDef={{ minWidth: 200 }}
				autoGroupColumnDef={autoGroupColumnDef}
			/>
		</div>
	</Box>;
};

export default CCChangeEvents;