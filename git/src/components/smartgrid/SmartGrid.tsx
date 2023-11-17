import * as React from 'react';
import _ from 'lodash';
import { Stack } from '@mui/material';
import { DataGridPremium as Grid, DataGridPremiumProps, GridColumns, GridRowsProp } from '@mui/x-data-grid-premium';

import './SmartGrid.scss';
import SmartGridToolbar from './toolbar/SmartGridToolbar';

export interface SmartGridProps extends DataGridPremiumProps {
	custom?: {
		toolbar?: boolean;
		toolbarItems?: React.ReactNode;
		emptyText?: string | React.ReactNode;
	}
}

const SmartGrid = (props: SmartGridProps) => {
	let optionalProps: any = getOptionalProps(props);

	return (
		<Grid
			{..._.merge(optionalProps, _.omit(props, 'custom'))}
			// getRowClassName={({ row }) => { return row.isGroup ? 'smartgrid-group-row' : '' }}
			// getCellClassName={({ field, row }) => {
			// 	let cellClass = '';
			// 	if (row.isGroup && field !== 'groupName') cellClass = 'smartgrid-grouping-unwanted-cells';
			// 	if (!row.isGroup && field === 'groupName') cellClass = 'smartgrid-grouping-unwanted-cells';
			// 	if (row.isGroup && field === 'groupName') cellClass = 'smartgrid-group-name-cell';
			// 	return cellClass;
			// }}
		/>
	);
};

export default SmartGrid;

const getOptionalProps: any = (props: any) => {
	const noRowsOverlay = <Stack className="empty-text-container" height="100%" alignItems="center" justifyContent="center">
		{props.custom?.emptyText || 'No data to display'}
	</Stack>;
	let optionalProps: any = {
		components: {
			NoRowsOverlay: () => noRowsOverlay,
			NoResultsOverlay: () => noRowsOverlay
		}
	};
	if (props.custom?.toolbar && props.custom?.toolbarItems) {
		optionalProps.components.Toolbar = SmartGridToolbar;
		optionalProps.componentsProps = {
			toolbar: { children: props.custom?.toolbarItems }
		};
	}

	return optionalProps;
};