import * as React from 'react';
import { Tooltip } from '@mui/material';
import { Hardware, Phishing } from '@mui/icons-material';
import { GRID_CHECKBOX_SELECTION_FIELD } from '@mui/x-data-grid-premium';
import { useAppSelector, useAppDispatch } from 'app/hooks';

import './InventoryList.scss';
import Toolbar from './InventoryToolbar';
import SmartGrid from 'components/smartgrid/SmartGrid';
import { fetchInventory } from '../operations/inventorySlice';

const InventoryList = (props: any) => {
	const dispatch = useAppDispatch();
	const commonColumnProps = { disableColumnMenu: true };
	const { tools, loading } = useAppSelector((state) => state.inventory);

	React.useEffect(() => {
		dispatch(fetchInventory());
	}, []);

	return <SmartGrid
		disableColumnReorder
		disableColumnResize
		hideFooter
		checkboxSelection
		rowHeight={38}
		getRowId={(row) => row['objectId']}
		columns={getColumnList(commonColumnProps)}
		pinnedColumns={{ left: [GRID_CHECKBOX_SELECTION_FIELD, 'image', 'name'] }}
		rows={tools}
		className='te-inventory-list'
		custom={{
			toolbar: true,
			toolbarItems: < Toolbar />,
			emptyText: getEmptyMessage()
		}}
	/>;
};

export default InventoryList;

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
		width: 100,
		sortable: false,
		renderCell: (params: any) => <img className={'tool-image'} src={params.value} alt={''} />,
		...commonProps
	}, { field: 'name', headerName: 'Name', width: 250, ...commonProps, renderCell: (params: any) => <span className={'link-style-cell'}>{params.value}</span> },
	{ field: 'type', headerName: 'Type', width: 75, ...commonProps },
	{ field: 'ownership', headerName: 'Ownership', width: 150, ...commonProps },
	{ field: 'uniqueId', headerName: 'Unique Id', width: 120, ...commonProps },
	{
		field: 'status',
		headerName: 'Status',
		width: 225,
		...commonProps,
		renderCell: (params: any) => {
			const stateList: any[] = [{
				state: 'Available',
				cls: 'available'
			}, {
				state: 'Assigned',
				cls: 'assigned'
			}, {
				state: 'Not Assigned',
				cls: 'not-assigned'
			}, {
				state: 'Needs Service',
				cls: 'needs-service'
			}];
			const itemState = stateList[params.value - 1];
			return <span className={`status-cell ${itemState?.cls}`}>{itemState?.state}</span>;
		}
	}, { field: 'category', headerName: 'Category', width: 150, ...commonProps },
	{ field: 'subCategory', headerName: 'Sub Category', width: 200, ...commonProps },
	{ field: 'modelNumber', headerName: 'Model No.', width: 130, ...commonProps },
	{ field: 'rtlsId', headerName: 'RTLS Id', width: 130, ...commonProps }];
}