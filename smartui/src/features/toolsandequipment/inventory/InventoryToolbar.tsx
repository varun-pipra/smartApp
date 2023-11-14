import * as React from 'react';
import { IconButton, ToggleButton, ToggleButtonGroup, Stack } from '@mui/material';
import {
	Refresh, Add, EditOutlined, Delete,
	CloudDownload, CloudUpload, Construction,
	Leaderboard, Sensors, ManageAccounts,
	CalendarMonth
} from '@mui/icons-material';

import './InventoryToolbar.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { fetchInventory, getInventoryTab, setInventoryTab, setShowAddInventoryPopup } from '../operations/inventorySlice';

const InventoryToolbar = (props: any) => {
	const tab = useAppSelector(getInventoryTab);
	const dispatch = useAppDispatch();

	return <Stack direction={'row'} className={'inventory-toolbar-root-container'}>
		<div key="toolbar-buttons" className="toolbar-item-wrapper">
			{(tab === 0 || tab === 2) &&
				<>
					<IQTooltip title="Refresh" placement={'bottom'}>
						<IconButton aria-label="Refresh inventory list" onClick={() => dispatch(fetchInventory())}>
						<span className="common-icon-refresh"></span>
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Add Tool" placement={'bottom'}>
						<IconButton aria-label="Add new tool" onClick={() => dispatch(setShowAddInventoryPopup(true))}>
							<Add />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Edit" placement={'bottom'}>
						<IconButton aria-label="Edit tool">
							<EditOutlined />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Reserve" placement={'bottom'}>
						<IconButton aria-label="Reserve tool">
							<CalendarMonth />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Inspect" placement={'bottom'}>
						<IconButton aria-label="Inspect tool">
							<ManageAccounts />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Delete" placement={'bottom'}>
						<IconButton aria-label="Delete tool">
							<Delete />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Import" placement={'bottom'}>
						<IconButton aria-label="Import inventory">
							<CloudDownload />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Export" placement={'bottom'}>
						<IconButton aria-label="Export inventory">
							<CloudUpload />
						</IconButton>
					</IQTooltip>
				</>
			}
		</div>
		<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
			<IQSearch sx={{ height: '4vh', width: '20rem' }} />
		</div>
		<div key="spacer" className="toolbar-item-wrapper toolbar-group-button-wrapper">
			<ToggleButtonGroup
				exclusive
				value={tab}
				onChange={(e, index) => dispatch(setInventoryTab(index))}
				aria-label="Inventory tab view buttons">
				<ToggleButton value={0} aria-label="Tool details tab">
					<Construction />
				</ToggleButton>
				<ToggleButton value={1} aria-label="Analytics tab">
					<Leaderboard />
				</ToggleButton>
				<ToggleButton value={2} aria-label="RTLS tab">
					<Sensors />
				</ToggleButton>
			</ToggleButtonGroup>
		</div>
	</Stack>;
};

export default InventoryToolbar;