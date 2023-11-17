import React, { useMemo, useState } from 'react';
import { AgGridReact as Grid } from 'ag-grid-react';
import { ColDef } from 'ag-grid-enterprise';
import { Box, Button, Badge } from '@mui/material';
import { FilePresent } from '@mui/icons-material';
import { Avatar, AvatarSize } from '@ui5/webcomponents-react';

import './ForecastGrid.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import IQSearch from 'components/iqsearchfield/IQSearchField';

import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { postMessage, isLocalhost } from 'app/utils';
import Dispatch from 'resources/images/budgetManager/Dispatch.svg';
import PlannerIcon from 'resources/images/budgetManager/PlannerTag.svg';
import convertDateToDisplayFormat, { getTransactionTypeText } from 'utilities/commonFunctions';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getServer, getCurrencySymbol } from 'app/common/appInfoSlice';
import { fetchForecastData, getFilteredRecords } from 'features/budgetmanager/operations/forecastSlice';
import CustomTooltip from 'features/budgetmanager/aggrid/customtooltip/CustomToolTip';
import SUIGrid from "sui-components/Grid/Grid";
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

var tinycolor = require('tinycolor2');

interface ForecastGridProps {
	groupAndFilterData?: any;
}

const ForecastGrid = (props: ForecastGridProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const currency = useAppSelector(getCurrencySymbol);
	const { selectedRecord } = useAppSelector(state => state.clientContracts);
	const { forecasts } = useAppSelector(state => state.cCForecasts);
	const [disableRightArrow, setDisableRightArrow] = React.useState<boolean>(true);
	const [disableLeftArrow, setDisableLeftArrow] = React.useState<boolean>(false);
	const [buttonPosition, setButtonPosition] = useState<string>('buttons-section');
	const [showTransactionDetails, setShowTransactionDetails] = React.useState<boolean>(false);
	const [transactionDetailsUrl, setTransactionDetailsUrl] = React.useState<string>('');
	const [showNonSmartItemMessage, setShowNonSmartItemMessage] = React.useState<boolean>(false);
	const [selectedId, setSelectedId] = React.useState<any>();
	const [rowData, setRowData] = React.useState<any>(forecasts);

	const onRowClick = (e: any) => {
		if (e.data?.uniqueId !== null) {
			postMessage({ event: 'openitem', body: { smartItemId: e.data.uniqueId } });
		}
	};

	React.useEffect(() => { setRowData(forecasts) }, [rowData, forecasts]);

	const headers: ColDef[] = [
		{
			headerName: 'Item Name',
			field: 'budgetLineItem',
			pinned: 'left',
			hide: true,
			rowGroup: true
		}, {
			headerName: 'Budget Amount',
			field: 'budgetItem.budgetAmount',
			maxWidth: 140,
			menuTabs: [],
			cellRenderer: (params: any) => {
				return (params.node.group && !params.node.footer) ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const groupKey = params.node.key;
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;

					return (currentRecord?.budgetItem?.budgetAmount || 0);
				}
			}
		}, {
			headerName: 'Forecast Amount',
			field: 'forecastAmount',
			menuTabs: [],
			maxWidth: 172,
			aggFunc: 'sum',
			type: 'rightAligned',
			cellRenderer: (params: any) => {
				if (params.value && (params.node.footer || params.node.level > 0 || !params.node.expanded))
					return <div className='right-align'>
						{amountFormatWithSymbol(params.value)}
					</div>;
			}
		}, {
			headerName: 'Forecast Balance',
			field: 'balance',
			menuTabs: [],
			maxWidth: 165,
			cellRenderer: (params: any) => {
				return (!params.node.group && !params.node.footer) ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			}
		}, {
			headerName: 'Est. Start Date',
			field: 'budgetItem.estimatedStartDate',
			menuTabs: [],
			cellRenderer: (params: any) => {
				return params.value ? formatDate(params.value, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
			}
		}, {
			headerName: 'Est. End Date',
			field: 'budgetItem.estimatedEndDate',
			menuTabs: [],
			cellRenderer: (params: any) => {
				return params.value ? formatDate(params.value, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
			}
		}, {
			headerName: 'Unit of Measure',
			field: 'budgetItem.unitOfMeasure',
			menuTabs: [],
			maxWidth: 150,
			cellRenderer: (params: any) => {
				return <div className='center-align'>
					{(params.value || '')}
				</div>;
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const groupKey = params.node.key;
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;

					return (currentRecord?.budgetItem?.unitOfMeasure || '');
				} else return params?.data?.budgetItem?.unitOfMeasure || '';
			}
		}, {
			headerName: 'Unit Quantity',
			field: 'forecastQuantity',
			menuTabs: [],
			maxWidth: 125,
			aggFunc: 'sum',
			cellRenderer: (params: any) => {
				return !params.node.footer ? <div className='right-align'>
					{(params.value ? params.value : 0)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					return (params.node.aggData?.forecastQuantity || 0);
				} else return (params?.data?.forecastQuantity || 0);
			}
		}, {
			headerName: 'Unit Cost',
			field: 'budgetItem.unitCost',
			menuTabs: [],
			maxWidth: 98,
			cellRenderer: (params: any) => {
				return !params.node.footer ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const groupKey = params.node.key;
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;

					return (currentRecord?.budgetItem?.unitCost || 0);
				} else return (params?.data?.budgetItem?.unitCost || 0);
			}
		}
	];

	const customValueGetter = (params: any) => {
		return params?.node?.group ?
			params.data?.budgetItem?.name ? params.data?.budgetItem?.name : "" + params.data?.budgetItem?.costCode ? " - " + params.data?.budgetItem?.costCode : "" + params.data?.budgetItem?.costType ? " - " + params.data?.budgetItem?.costType : ""
			: params?.data?.name;
	}

	const customCellRendererClass = (params: any) => {
		if (!params.data) {
			const isFooter = params?.node?.footer;
			const isRootLevel = params?.node?.level === -1;
			if (isFooter) {
				if (isRootLevel) {
					return "Summary";
				}
				return `Sub Total`;
			} else {
				if (params?.node?.group) {
					return `${params.node?.childrenAfterGroup?.[0]?.data?.budgetItem?.name ? params.node?.childrenAfterGroup?.[0]?.data?.budgetItem?.name : ""} ${params.node?.childrenAfterGroup?.[0]?.data?.budgetItem?.costCode ? " - " + params.node?.childrenAfterGroup?.[0]?.data?.budgetItem?.costCode : ""} ${params.node?.childrenAfterGroup?.[0]?.data?.budgetItem?.costType ? " - " + params.node?.childrenAfterGroup?.[0]?.data?.budgetItem?.costType : ""}`
				}
				return `${params?.value}`;

			}
		}
		else {
			const initials = params.data?.name?.toString().substring(0, 2).toUpperCase();
			const image = params.data?.smartAppUniqueId ? <img src={`${appInfo?.hostUrl}/EnterpriseDesktop/Dashboard/Shortcut.mvc/GetAppThumbnailUrl?appId=${params.data?.smartAppUniqueId}&size=2&sessionId=${appInfo?.sessionId}`} style={{ height: '32px', width: '32px' }} />
				: params.data?.stageName !== 'Summary' ? params?.data?.type === 'Planner Tag' ? <Box component='img' alt={params?.data?.type + 'icon'} src={PlannerIcon} className='image' width={32} height={32} />
					: <Box component='img' alt={params?.data?.type + 'icon'} src={Dispatch} className='image' width={32} height={32} />
					: '';
			return params.data && (
				<div className={`app-items-cell-content ${'clickable'}`}>
					{image}&nbsp;
					<IQTooltip title={params.data?.type} placement={"bottom"} arrow={true}>
						<span className='txn-name-tag' style={{ color: '#059CDF' }}>{params.value}</span>
					</IQTooltip>
				</div>)
		}

	}
	const autoGroupColumnDef = useMemo<ColDef>(() => {
		return {
			headerName: "Item Name",
			field: "budgetItem.division",
			valueGetter: (params: any) => customValueGetter(params),
			pinned: "left",
			sort: "asc",
			width: 400,
			resizable: true,
			suppressRowClickSelection: true,
			cellRenderer: "agGroupCellRenderer",
			onCellClicked: (event: any) => {
				const { id, type, schedule, board } = event.data;
				if (id && type == 'App Item') {
					postMessage({ event: 'openitem', body: { smartItemId: id } });
				}
				else if (['Work Tag', 'Planner Tag', 'Summary Tag'].includes(type) && schedule?.id && board?.id && id) {
					postMessage({ event: 'opentagproperties', body: { scheduleUid: schedule?.id, boardUid: board?.id, tagUid: id } });
				}
			},
			cellRendererParams: {
				suppressCount: false,
				innerRenderer: (params: any) => customCellRendererClass(params),
			},
		};
	}, []);

	const [columns, setColumns] = React.useState<ColDef[]>(headers);

	const groupRowRendererParams = useMemo(() => {
		return {
			innerRenderer: (params: any) => {
				return <div className="group-type-header">
					{params.value}
				</div>
			}
		}
	}, []);

	return (
		<SUIGrid headers={columns}
			data={rowData}
			grouped={true}
			groupRowRendererParams={groupRowRendererParams}
			autoGroupColumnDef={autoGroupColumnDef}
			getRowId={(params: any) => params.data?.id}
		/>
	)
};

export default ForecastGrid;