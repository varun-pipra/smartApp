import React, {useMemo} from 'react';
import {ColDef} from 'ag-grid-enterprise';
import {Box, Button} from '@mui/material';

import './ForecastGrid.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';

import {postMessage} from 'app/utils';
import Dispatch from 'resources/images/budgetManager/Dispatch.svg';
import PlannerIcon from 'resources/images/budgetManager/PlannerTag.svg';
import convertDateToDisplayFormat from 'utilities/commonFunctions';
import {useAppSelector} from 'app/hooks';
import {getServer} from 'app/common/appInfoSlice';
import {getFilteredRecords} from 'features/budgetmanager/operations/forecastSlice';
import CustomTooltip from 'features/budgetmanager/aggrid/customtooltip/CustomToolTip';
import SUIGrid from "sui-components/Grid/Grid";
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';
var tinycolor = require('tinycolor2');


interface ForecastGridProps {
	groupAndFilterData?: any;
}
const ForecastGrid = (props: ForecastGridProps) => {
	const appInfo = useAppSelector(getServer);
	const records = useAppSelector(getFilteredRecords);

	const headers: ColDef[] = [{
		headerName: 'Item Name',
		field: 'name',
		pinned: 'left',
		width: 155,
		minWidth: 130,
		// maxWidth: 200,
		menuTabs: [],
		resizable: true,
		tooltipComponent: CustomTooltip,
		// tooltipValueGetter: (params: any) => {
		// 	return params.data?.name && params.data?.name?.length > 20 ? params.data.name : null;
		// },
		onCellClicked: (event: any) => {
			if(event.data.uniqueId && event.data.type == 'App Item') {
				postMessage({event: 'openitem', body: {smartItemId: event.data.uniqueId}});
			}
			else if(['Work Tag', 'Planner Tag', 'Summary Tag'].includes(event.data.type) && event.data.scheduleUId && event.data.boardUId && event.data.uniqueId) {
				postMessage({event: 'opentagproperties', body: {scheduleUid: event.data.scheduleUId, boardUid: event.data.boardUId, tagUid: event.data.uniqueId}});
			}
		},
		cellRenderer: (params: any) => {
			const initials = params.data?.name?.toString().substring(0, 2).toUpperCase();
			const image = params.data?.smartAppUniqueId ? <img src={`${appInfo?.hostUrl}/EnterpriseDesktop/Dashboard/Shortcut.mvc/GetAppThumbnailUrl?appId=${params.data?.smartAppUniqueId}&size=2&sessionId=${appInfo?.sessionId}`} style={{height: '32px', width: '32px'}} />
				: params.data?.stageName !== 'Summary' ? params?.data?.type === 'Planner Tag' ? <Box component='img' alt={params?.data?.type + 'icon'} src={PlannerIcon} className='image' width={32} height={32} />
					: <Box component='img' alt={params?.data?.type + 'icon'} src={Dispatch} className='image' width={32} height={32} />
					: '';
			return params.data && (
				<div className={`app-items-cell-content ${'clickable'}`}>
					{image}&nbsp;
					<IQTooltip title={params.data?.type} placement={"bottom"} arrow={true}>
						<span className='txn-name-tag' style={{color: '#059CDF'}}>{params.value}</span>
					</IQTooltip>
				</div>);
		},
	},
	{
		headerName: '',
		field: 'stageName',
		pinned: 'left',
		width: 150,
		minWidth: 130,
		// maxWidth: 150,
		menuTabs: [],
		cellRenderer: (params: any) => {
			const stageIndicator = params.value ? params.value === 'Summary' ? params.value : <IQTooltip title={params.value.length > 11 ? params.value : ''}>
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
						marginTop: '5px'
					}}>{params.value}</Button>
			</IQTooltip> : <></>;
			return stageIndicator;
		}
	},
	{
		headerName: 'Amount',
		field: 'amount',
		aggFunc: "sum",
		minWidth: 130,
		// type: "currency",
		menuTabs: [],
		cellRenderer: (params: any) => {
			let operand = params.value >= 0 ? '(+)' : '(-)',
				styleOpts = {style: {color: (Number(params.value?.toString()?.replaceAll(",", ""))) >= 0 ? '#008000c2' : 'red'}};
			if(params.node.footer || params.node.level > 0 || !params.node.expanded) {
				return <div className='right-align' {...styleOpts}>
					{amountFormatWithSymbol(params.value)}
				</div>;
			}
		}
	},
	{
		headerName: 'Type',
		field: 'type',
		minWidth: 120,
		menuTabs: [],
		hide: false,
		rowGroup: false,
		pinned: null,
		cellRenderer: (params: any) => {
			return params.data?.stageName !== 'Summary' ? params.value === 'Planner Tag' ? 'Summary Tag' : params.value : '';
		}
	}, {
		headerName: 'Description',
		field: 'description',
		minWidth: 150,
		menuTabs: [],
		cellRenderer: (params: any) => {
			return <div className='auto-wrapped-ellipsis'>{params.value}</div>;
		}
	}, {
		headerName: 'Vendor',
		field: 'vendor.name',
		minWidth: 180,
		menuTabs: [],
		cellRenderer: (params: any) => {
			return <div className='auto-wrapped-ellipsis'>{params.value}</div>;
		}
	}, {
		headerName: 'Project Schedule Start',
		field: 'projectedStartDate',
		minWidth: 200,
		// maxWidth: 185,
		menuTabs: [],
		cellRenderer: (params: any) => {
			return params.value ? convertDateToDisplayFormat(params.value) : '';
		}
	}, {
		headerName: 'Project Schedule End',
		field: 'projectedEndDate',
		minWidth: 200,
		// maxWidth: 180,
		menuTabs: [],
		cellRenderer: (params: any) => {
			return params.value ? convertDateToDisplayFormat(params.value) : '';
		}
	},];
	const [columns, setColumns] = React.useState<ColDef[]>(headers);

	// React.useEffect(() => {
	// 	const data = dispatch(fetchForecastData({ 'appInfo': appInfo, id: selectedRow.id }));
	// }, [selectedRow]);

	// React.useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		rightPannel &&
	// 			dispatch(fetchForecastData({ 'appInfo': appInfo, id: selectedRow.id }));
	// 		dispatch(fetchLineItemData({ 'appInfo': appInfo, id: selectedRow.id }));
	// 	}, 10000);
	// 	return () => clearInterval(interval);
	// }, [selectedRow])

	React.useEffect(() => {
		if(props.groupAndFilterData) {
			if(props.groupAndFilterData.group) {
				const updatedColDefs: ColDef[] = columns.map((colDef: any, index) => {
					if(colDef.field === props.groupAndFilterData.group) {
						return {...colDef, rowGroup: true, hide: false};
					} return {...colDef, pinned: '', rowGroup: false};
				});
				setColumns(updatedColDefs);
			}
			else {setColumns(headers);}
		}
	}, [props.groupAndFilterData]);

	const groupRowRendererParams = useMemo(() => {
		return {
			innerRenderer: (params: any) => {
				return <div className="group-type-header">
					{/* <img className="group-type-img" src={getImageBasedonType(params.value)} /> */}
					{params.value}
				</div>;
			}
		};
	}, []);

	return (
		<SUIGrid headers={columns}
			data={records}
			grouped={true}
			groupIncludeTotalFooter={false}
			groupDisplayType={'groupRows'}
			groupRowRendererParams={groupRowRendererParams}
			pinnedBottomRowConfig={{
				displayFields: {
					stageName: 'Summary',
					// description: 'This shows the summary data'
				},
				aggregateFields: ['amount']
			}}
			//  suppressRowClickSelection={true}
			getRowId={(params: any) => params.data.uniqueId}
		// rowSelection='single'
		// rowSelected={(e:any) => onRowClick(e)}
		/>
	);
};

export default ForecastGrid;