import * as React from 'react';
import { Tooltip } from '@mui/material';
import { Hardware, Phishing } from '@mui/icons-material';
import { GRID_CHECKBOX_SELECTION_FIELD } from '@mui/x-data-grid-premium';
import { useAppSelector, useAppDispatch } from 'app/hooks';

import './CatalogList.scss';
import Toolbar from './CatalogToolbar';
import SmartGrid from 'components/smartgrid/SmartGrid';
import { fetchCatalogs } from '../operations/catalogSlice';
import CatalogForm from './CatalogForm';
import InventoryForm from '../inventory/InventoryPage';

const CatalogList = (props: any) => {
	const dispatch = useAppDispatch();
	const commonColumnProps = { disableColumnMenu: true };
	const { catalogs, loading } = useAppSelector((state) => state.catalog);
	const [catalogForm, openCatalogForm] = React.useState(false);
	const [inventoryForm, openInventoryForm] = React.useState(false);

	React.useEffect(() => {
		dispatch(fetchCatalogs());
	}, []);

	const handleCatalogForm = (value: boolean) => {
		openCatalogForm(value)
	}

	const handleInventoryForm = (value: boolean) => {
		openInventoryForm(value)
	}


	return (
		<><SmartGrid
			disableColumnReorder
			disableColumnResize
			hideFooter
			checkboxSelection
			rowHeight={38}
			className='te-catalog-list'
			getRowId={(row) => row['objectId']}
			columns={getColumnList(commonColumnProps)}
			pinnedColumns={{ left: [GRID_CHECKBOX_SELECTION_FIELD, 'groupName', 'image', 'name'] }}
			rows={catalogs}
			// rows={[{ objectId: 26, groupName: 'Drilling', isGroup: true }].concat(catalogs)}
			defaultGroupingExpansionDepth={1}
			custom={{
				toolbar: true,
				toolbarItems: <Toolbar handleCatalogForm={handleCatalogForm} />,
				emptyText: getEmptyMessage(),
			}}
		/>
			{catalogForm ? <CatalogForm open={catalogForm} onClose={() => handleCatalogForm(false)} openInventoryForm={() => handleInventoryForm(true)} /> : null}
			{inventoryForm ? <InventoryForm open={catalogForm} onClose={() => handleInventoryForm(false)} inventoryHeaderData={{
				modelName: "Drilling",
				modelNumber: "12345",
				noOfItems: 3,
				applySelectedDataToAllItems: false,
			}} /> : null}</>
	);
};

export default CatalogList;

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
	// 	field: 'groupName',
	// 	width: 0,
	// 	minWidth: 0,
	// 	maxWidth: 500,
	// 	headerClassName: 'smartgrid-group-header'
	// }, {
		field: 'image',
		headerName: '',
		width: 100,
		sortable: false,
		renderCell: (params: any) => <img className={'tool-image'} src={params.value} alt={''} />,
		...commonProps
	}, { field: 'name', headerName: 'Name', width: 200, ...commonProps, renderCell: (params: any) => <span className={'link-style-cell'}>{params.value}</span> },
	{ field: 'manufacturer', headerName: 'Manufacturer', width: 200, ...commonProps },
	{ field: 'modelNumber', headerName: 'Model No.', width: 110, ...commonProps },
	{ field: 'category', headerName: 'Category', width: 150, ...commonProps },
	{ field: 'subCategory', headerName: 'Sub Category', width: 200, ...commonProps },
	{ field: 'type', headerName: 'Type', width: 75, ...commonProps },
	{
		field: 'status',
		headerName: 'Status',
		width: 125,
		renderCell: (params: any) => <span className={`status-cell ${params.value === 1 ? 'active' : 'retired'}`}>{params.value === 1 ? 'Active' : 'Retired'}</span>,
		...commonProps
	}, { field: 'description', headerName: 'Description', width: 400, ...commonProps },
	{
		field: 'certificationRequired',
		headerName: 'Cert. Required',
		width: 175,
		renderCell: (params: any) => params.value ? <span className={'link-style-cell'}>YES</span> : 'NO',
		...commonProps
	}, {
		field: 'supplementalInfo',
		headerName: 'Supplemental Info',
		width: 225,
		renderCell: (params: any) => params.value?.length ? <span className={'link-style-cell'}>Additional Info</span> : <span className={'grey-text-cell'}>NO DATA</span>,
		...commonProps
	}];
}