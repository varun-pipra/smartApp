import * as React from 'react';
import { Tooltip } from '@mui/material';
import { Hardware, Phishing, Sensors } from '@mui/icons-material';
import { GRID_CHECKBOX_SELECTION_FIELD } from '@mui/x-data-grid-premium';
import { useAppSelector, useAppDispatch } from 'app/hooks';

import './InventoryRTLSList.scss';
import Toolbar from './InventoryToolbar';
import SmartGrid from 'components/smartgrid/SmartGrid';
import { fetchInventoryRTLSData } from '../operations/inventorySlice';

const InventoryRTLSList = (props: any) => {
	const dispatch = useAppDispatch();
	const commonColumnProps = { disableColumnMenu: true };
	const { rtlsData, loading } = useAppSelector((state) => state.inventory);

	React.useEffect(() => {
		dispatch(fetchInventoryRTLSData());
	}, []);

	return <SmartGrid
		disableColumnReorder
		disableColumnResize
		hideFooter
		checkboxSelection
		rowHeight={38}
		getRowId={(row) => row['objectId']}
		columns={getColumnList(commonColumnProps)}
		// pinnedColumns={{ left: [GRID_CHECKBOX_SELECTION_FIELD, 'image', 'name'] }}
		rows={rtlsData}
		className='te-inventory-rtls-list'
		custom={{
			toolbar: true,
			toolbarItems: < Toolbar />,
			emptyText: getEmptyMessage()
		}}
	/>;
};

export default InventoryRTLSList;

const getEmptyMessage: any = () => {
	return <div className="empty-text-wrapper">
		<div className="empty-text-image-container">
			<Hardware className="empty-text-images" />
			<Phishing className="empty-text-images" />
		</div>
		<p className="empty-text-message primary-message">No Tools and Equipment available</p>
		<p className="empty-text-message help-message">Click on + to add new tools and equipment</p>
	</div>;
};

const getColumnList: any = (commonProps: any) => {
	return [{
		field: 'image',
		headerName: '',
		width: 60,
		sortable: false,
		renderCell: (params: any) => <img className={'tool-image'} src={params.value} alt={''} />,
		...commonProps
	}, {
		field: 'online',
		headerName: '',
		width: 60,
		sortable: false,
		renderCell: (params: any) => <Sensors className="active" />,
		...commonProps
	}, { field: 'name', headerName: 'Name', width: 250, ...commonProps, renderCell: (params: any) => <span className={'link-style-cell'}>{params.value}</span> },
	{ field: 'rtlsId', headerName: 'RTLS Id', width: 130, ...commonProps },
	{ field: 'lastSeen', headerName: 'Last Seen', flex: 1 , ...commonProps },
	{ field: 'lastLocation', headerName: 'Last Location', flex: 1 , ...commonProps },
	{ field: 'totalTime', headerName: 'Total Time Ever', flex: 1 , ...commonProps },
	{ field: 'firstSeen', headerName: 'First Seen Ever', flex: 1 , ...commonProps }];
}