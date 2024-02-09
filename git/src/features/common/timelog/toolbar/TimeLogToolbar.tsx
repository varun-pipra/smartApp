import { getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
// Project files and internal support import
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { memo, useEffect, useState } from 'react';
import SUIAlert from 'sui-components/Alert/Alert';

import { Gavel, GridOn, Refresh, TableRows } from '@mui/icons-material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ReportAndAnalyticsToggle } from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';
import SendBackModel from './SendBackModel/sendBackModel';

// Component definition
export const TLLeftButtons = memo(() => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);

	const [sendBackClick, setSendBackClick] = useState<boolean>(false);
	const [acceptClick, setacceptClick] = useState<boolean>(false);
	const { selectedRowData } = useAppSelector(state => state.timeLogRequest);
	const [acceptBtn, setAcceptBtn] = useState<boolean>(false);
	const [sendBackBtn, setsendBackBtn] = useState<boolean>(false);


	const acceptModel = (e: any, type: any) => {
		if (type == 'cancel' || type == 'close') { setacceptClick(false) }
		else {
			console.log('click')
		}
	}
	useEffect(()=>{
		console.log('selectedRowData', selectedRowData)	
	}, [selectedRowData]);

	return <>
		<IQTooltip title='Refresh' placement='bottom'>
			<IconButton aria-label='Refresh Time Log List'>
				<span className='common-icon-refresh'></span>
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Delete' placement='bottom'>
			<IconButton aria-label='Delete Time Log Item' disabled={selectedRowData.length > 0 ? false : true}>
				<span className='common-icon-delete'></span>
			</IconButton>
		</IQTooltip>
		<IconButton className='divider-line-cls'></IconButton>
		<IQTooltip title='Generate PDF' placement='bottom'>
			<IconButton className='pdf-toolbar-btn1' aria-label='Generate PDF Time Log List' disabled={selectedRowData.length > 0 ? false : true}>
				<span className='common-icon-pdf'></span>
			</IconButton>
		</IQTooltip>
		<IconButton className='divider-line-cls'>
		</IconButton>
		<Button className={`tl-toolbar-btn  ${!acceptBtn ? 'accept-btn' : 'btn-disable'}`} variant="outlined" startIcon={<span className='common-icon-accept'></span>} disabled={acceptBtn} onClick={() => { setacceptClick(true) }}>
			Accept
		</Button>
		<Button className={`tl-toolbar-btn  ${!sendBackBtn ? 'sendBack-btn' : 'btn-disable'}`} variant="outlined" startIcon={<span className='common-icon-send-back1'></span>} disabled={sendBackBtn} onClick={() => { setSendBackClick(true) }}>
			Send Back
		</Button>

		{
			sendBackClick && <SendBackModel data={[]} onClose={(value: any) => { setSendBackClick(value) }} onSubmit={(formData: any) => { console.log('') }} />
		}
		{
			acceptClick &&
			<SUIAlert
				open={acceptClick}
				DailogClose={true}
				contentText={
					<span>Are you sure you want to Accept the selected Time Entries?</span>
				}

				title={'Confirmation'}
				onAction={(e: any, type: string) => acceptModel(e, type)}
				showActions={true}
			/>
		}
	</>;
});



// Component definition
export const TLRightButtons = memo(() => {
	const dispatch = useAppDispatch();

	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if (value !== null) {
			// dispatch(setShowTableViewType(value));
		}
	};

	return <>
		<div key='spacer' className='toolbar-item-wrapper toolbar-group-button-wrapper' >
			<ReportAndAnalyticsToggle />
			{/* <ToggleButtonGroup
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
			</ToggleButtonGroup> */}
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