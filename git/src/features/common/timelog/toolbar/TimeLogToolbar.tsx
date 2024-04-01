import { getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
// Project files and internal support import
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { memo, useEffect, useState, useMemo } from 'react';
import SUIAlert from 'sui-components/Alert/Alert';
import {canManageTimeForCompany,canManageTimeForProject, isWorker} from 'app/common/userLoginUtils';
import { Gavel, GridOn, Refresh, TableRows } from '@mui/icons-material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ReportAndAnalyticsToggle } from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';
import SendBackModel from './SendBackModel/sendBackModel';
import { getTimeLogList, setSplitTimeSegmentBtn ,setToast} from '../stores/TimeLogSlice';
import { getSource, getTimeLogDateRange, getTimeLogStatus} from 'utilities/timeLog/enums';
import {acceptTimeLog, addTimeLog, deleteTimeLogData, sendBackTimeLog} from '../stores/TimeLogAPI';

// Component definition
export const TLLeftButtons = memo(() => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);

	const { selectedRowData, TimeLogGridList ,gridRef, gridFilters} = useAppSelector(state => state.timeLogRequest);
	const { selectedTimeLogDetails } = useAppSelector(state => state.timeLogRequest);

	const [sendBackClick, setSendBackClick] = useState<boolean>(false);
	const [acceptClick, setacceptClick] = useState<boolean>(false);
	const [acceptBtn, setAcceptBtn] = useState<boolean>(true);
	const [sendBackBtn, setsendBackBtn] = useState<boolean>(true);
	const [splitBtn, setSplitBtn] = useState<boolean>(true);
	const [deleteBtn ,setDeleteBtn] = useState<boolean>(true);

	const acceptModel = (e: any, type: any) => {
		if (type == 'cancel' || type == 'close') { setacceptClick(false) }
		else {
			handleAccept();
			setacceptClick(false)
		}
	}

	useEffect(() => {
		//Accept and SendBack Button enable and disable
		if (selectedRowData.length > 0){
			let array: any = selectedRowData?.map((value: any) => getTimeLogStatus(value.status));
			if (array.includes('Reported') && !array.includes('In Progress') && !array.includes('Accepted') && !array.includes('Planned') && !array.includes('Unavailable') && !array.includes('Sent Back')) {
				setAcceptBtn(false);
				setsendBackBtn(false);
			}
			else {
				setAcceptBtn(true);
				setsendBackBtn(true);
			}
		}
		else{
			setAcceptBtn(true);
			setsendBackBtn(true);
		}
	}, [selectedRowData]);

	useEffect(() => {
		//Split Button enable and disable
		if (selectedRowData.length > 0 && selectedRowData.length < 2 &&  !isWorker()){
			let array: any = selectedRowData?.map((value: any) => getTimeLogStatus(value.status));
			if (array.includes('Reported') && !array.includes('In Progress') && !array.includes('Accepted') && !array.includes('Planned') && !array.includes('Unavailable') && !array.includes('Sent Back')) setSplitBtn(false)
			else setSplitBtn(true);
		}
		else setSplitBtn(true);
	}, [selectedRowData]);

	useEffect(() => {
		//Delete Button enable and disable
		if (selectedRowData.length > 0){
			//enableArray 'Reported', 'Planned','Sent Back' , disableArray 'In Progress','Accepted','Unavailable';
			let array: any = selectedRowData?.map((value: any) => getTimeLogStatus(value.status));
			if ((array.includes('Reported') || array.includes('Planned') || array.includes('Sent Back')) && 
					 !array.includes('In Progress') && !array.includes('Accepted') && !array.includes('Unavailable')
				  ) {
				setDeleteBtn(false)
			}
			else {
				setDeleteBtn(true);
			}
		}
		else {setDeleteBtn(true)};
	}, [selectedRowData]);

	const deleteTimeLog = async () =>{
		try{
			await Promise.all(selectedRowData.map((record:any) => {
					deleteTimeLogData(record?.id, (response:any) => {
						if(response) {
							dispatch(getTimeLogList(gridFilters));
							dispatch(setToast('Deleted TimeLog Successfully.'));
						}
					});
			}));	
		}
		catch{
			console.log('delete error')
		}	
	
	}
	const refresh = () =>{
		dispatch(getTimeLogList(gridFilters));
	}
	const getIds = (selectedRecords:any) => {
		return selectedRecords?.map((obj:any) => {
			if(getTimeLogStatus(obj?.status) == 'Reported') return obj?.id
		})?.filter((element:any) => {return element !== undefined});
	}
	const afterItemAction = (response: any) => {
		gridcolumnUncheck()
		dispatch(getTimeLogList(gridFilters));
	};
	
	const handleAccept = () => {
		const ids = getIds(selectedRowData)
		const payload = {
			timeSegmentIds:[...ids]
		}
		acceptTimeLog(payload, afterItemAction)
	}

	const handleSendback = (data:any) => {
		const ids = getIds(selectedRowData);		
		const payload = {
			timeSegmentIds:[...ids],
			reason:data?.reason,
			signature:data?.sign
		}
		sendBackTimeLog(payload, afterItemAction);
		setSendBackClick(false);
	}

	const gridcolumnUncheck = () =>{
		if(	gridRef.current){
			gridRef.current.api.forEachNode((node:any) => {
				node.setSelected(false);
			});
		}
	}

	return <>
		<IQTooltip title='Refresh' placement='bottom'>
			<IconButton aria-label='Refresh Time Log List' onClick={() => { refresh()}}>
				<span className='common-icon-refresh'></span>
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Delete' placement='bottom'>
			<IconButton aria-label='Delete Time Log Item' disabled={deleteBtn} onClick={()=>{	deleteTimeLog()}}>
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
		{ !isWorker() &&
			<Button className={`tl-toolbar-btn  ${!acceptBtn ? 'accept-btn' : 'btn-disable'}`} variant="outlined" startIcon={<span className='common-icon-accept'></span>} disabled={acceptBtn} onClick={() => { setacceptClick(true) }}>
				Accept
			</Button>
		}
		<Button className={`tl-toolbar-btn  ${!splitBtn ? '' : 'btn-disable'}`} variant="outlined" startIcon={<span className='common-icon-send-back1'></span>} disabled={splitBtn} onClick={() => { dispatch(setSplitTimeSegmentBtn(true)) }}>
			Split
		</Button>
		{ !isWorker() &&
			<Button className={`tl-toolbar-btn  ${!sendBackBtn ? 'sendBack-btn' : 'btn-disable'}`} variant="outlined" startIcon={<span className='common-icon-send-back1'></span>} disabled={sendBackBtn} onClick={() => { setSendBackClick(true) }}>
				Send Back
			</Button>
		}

		{
			sendBackClick && <SendBackModel data={[...selectedRowData]} onClose={(value: any) => { setSendBackClick(value) }} onSubmit={(obj: any) => { handleSendback(obj) }} />
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