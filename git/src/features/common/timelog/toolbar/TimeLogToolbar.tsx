import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
// Project files and internal support import
import IQTooltip from 'components/iqtooltip/IQTooltip';
import {memo, useEffect, useState} from 'react';
import SUIAlert from 'sui-components/Alert/Alert';

import {Gavel, GridOn, Refresh, TableRows} from '@mui/icons-material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import {Button, IconButton, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {ReportAndAnalyticsToggle} from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';

// Component definition
export const TLLeftButtons = memo(() => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);

	const [disableDelete, setDisableDelete] = useState<boolean>(true);
	const [alert, setAlert] = useState<boolean>(false);
	const {selectedChangeEvents, selectedChangeEventsCount} = useAppSelector((state) => state.changeEventRequest);

	return <>
		<IQTooltip title='Refresh' placement='bottom'>
			<IconButton
				aria-label='Refresh Time Log List'
			>
				<span className='common-icon-refresh'></span>
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Delete' placement='bottom'>
			<IconButton aria-label='Delete Time Log Item'
				disabled={true}
			>
				<span className='common-icon-delete'></span>
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Generate PDF' placement='bottom'>
			<IconButton aria-label='Generate PDF Time Log List'
			// disabled={selectedCount === 0}
			>
				<span className='common-icon-pdf'></span>
			</IconButton>
		</IQTooltip>
		<Button variant="outlined" startIcon={<Gavel />} disabled={true}>
			Accept
		</Button>
		<Button variant="outlined" startIcon={<Gavel />} disabled={true}>
			Send Back
		</Button>
	</>;
});

// Component definition
export const TLRightButtons = memo(() => {
	const dispatch = useAppDispatch();

	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if(value !== null) {
			// dispatch(setShowTableViewType(value));
		}
	};

	return <>
		<div key='spacer' className='toolbar-item-wrapper toolbar-group-button-wrapper' >
			<ReportAndAnalyticsToggle />
			<ToggleButtonGroup
				exclusive
				value={'List'}
				size='small'
				onChange={handleView}
				aria-label='Inventory tab view buttons'
			>
				<ToggleButton value={'List'} aria-label='Change Events List Tab'>
					<GridOn />
				</ToggleButton>
				<ToggleButton value={'Chart'} aria-label='Change Events Analytics Tab'>
					<AssessmentOutlinedIcon />
				</ToggleButton>
			</ToggleButtonGroup>
			<IQTooltip title='Settings' placement={'bottom'}>
				<IconButton
					className='settings-button'
					aria-label='Change Events Settings'
				>
					<TableRows />
				</IconButton>
			</IQTooltip>
		</div>
	</>;
});