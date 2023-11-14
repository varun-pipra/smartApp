import * as React from 'react';
import { IconButton } from '@mui/material';
import {
	Refresh, Add, EditOutlined, Delete,
	CloudDownload, CloudUpload, Phishing,
	AccountTree, Lan, Factory, HistoryEdu
} from '@mui/icons-material';

import IQTooltip from 'components/iqtooltip/IQTooltip';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import { useAppDispatch } from 'app/hooks';
import { fetchCatalogs } from '../operations/catalogSlice';

const CatalogToolbar = (props: any) => {
	const dispatch = useAppDispatch();

	return <React.Fragment>
		<div key="toolbar-buttons" className="toolbar-item-wrapper">
			<IQTooltip title="Refresh" placement={'bottom'}>
				<IconButton aria-label="Refresh catalog list" onClick={() => dispatch(fetchCatalogs())}>
				<span className="common-icon-refresh"></span>
				</IconButton>
			</IQTooltip>
			<IQTooltip title="Add Catalog" placement={'bottom'}>
				<IconButton aria-label="Add new catalog" onClick={() => props.handleCatalogForm(true)}>
					<Add />
				</IconButton>
			</IQTooltip>
			<IQTooltip title="Edit" placement={'bottom'}>
				<IconButton aria-label="Edit catalog">
					<EditOutlined />
				</IconButton>
			</IQTooltip>
			<IQTooltip title="Delete" placement={'bottom'}>
				<IconButton aria-label="Delete catalog">
					<Delete />
				</IconButton>
			</IQTooltip>
			<IQTooltip title="Import" placement={'bottom'}>
				<IconButton aria-label="Import catalog">
					<CloudDownload />
				</IconButton>
			</IQTooltip>
			<IQTooltip title="Export" placement={'bottom'}>
				<IconButton aria-label="Export catalog">
					<CloudUpload />
				</IconButton>
			</IQTooltip>
		</div>
		<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
			<IQSearch
				sx={{ height: '4vh', width: '20rem' }}
				groups={getGroupMenuOptions()}
				filters={getFilterMenuOptions()}
			/>
		</div>
		<div key="spacer" className="toolbar-item-wrapper"></div>
	</React.Fragment>;
};

export default CatalogToolbar;

const getGroupMenuOptions = () => {
	return [{
		text: 'Type',
		value: 'type',
		icon: <Phishing />
	}, {
		text: 'Category',
		value: 'category',
		icon: <AccountTree />
	}, {
		text: 'Sub Category',
		value: 'sub-category',
		icon: <Lan />
	}];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'Type',
		value: 'type',
		icon: <Phishing />,
		children: {
			type: 'checkbox',
			items: [{
				text: 'Tools',
				value: 'tools'
			}, {
				text: 'Equipment',
				value: 'equipment'
			}]
		}
	}, {
		text: 'Category',
		value: 'category',
		icon: <AccountTree />
	}, {
		text: 'Manufacturer',
		value: 'manufacturer',
		icon: <Factory />
	}, {
		text: 'Model',
		value: 'model',
		icon: <HistoryEdu />
	}];
};