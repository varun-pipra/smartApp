import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import './TimeLogLID.scss'
import { getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import IQGridLID from 'components/iqgridwindowdetail/IQGridWindowDetail';
import Toast from 'components/toast/Toast';
import { SUIToast2 } from 'sui-components/Toast/Suitoast';
import { TextField } from '@mui/material';
import TLLinks from './tabs/links/Links';
import Details from './tabs/details/Details';
import { ContractorResponse } from 'features/vendorcontracts/vendorcontractsdetails/ContractorResponse/ContractorResponse';
import { getTimeLogDetails, setSelectedTimeLogDetails,setDetailsPayloadSave, getTimeLogList ,setSmartItemOptionSelected} from '../stores/TimeLogSlice';
import { stringToUSDateTime2 } from 'utilities/commonFunctions';
import { getTimeLogDateRange, getTimeLogStatus } from 'utilities/timeLog/enums';
import { timelogStatusMap } from '../TimeLogConstants';
import {generateSplitEntryData, getDuration,checkGUID} from '../utils';
import {updateTimeLogDetails, addTimeLog, acceptTimeLog, sendBackTimeLog} from '../stores/TimeLogAPI';
import {canManageTimeForCompany,canManageTimeForProject, isWorker} from 'app/common/userLoginUtils';
import SendBackModel from '../toolbar/SendBackModel/sendBackModel';
import SplitTimeSegmentDialog from '../timeSplitSegment/SplitTimeSegmentDialog';
import { addTimeToDate } from 'utilities/datetime/DateTimeUtils';
import moment from 'moment';

const TimeLogLID = memo(({ data, ...props }: any) => {
	const dispatch = useAppDispatch();
	const { server } = useAppSelector(state => state.appInfo);
	const appInfo = useAppSelector(getServer);
	const { selectedTimeLogDetails ,DetailspayloadSave, TimeLogGridList,saveButtonEnable} = useAppSelector(state => state.timeLogRequest);
	const stateObject: any = (timelogStatusMap || [])?.find((x: any) => x.value === selectedTimeLogDetails?.status?.toString());
	const [closeSubtitle, setCloseSubtitle] = React.useState<any>(true)
	const [openSendBack, setOpenSendBack] = React.useState<any>(false)
	const [openSplit, setOpenSplit] = React.useState<any>(false)
	
	useEffect(() => {
		if (selectedTimeLogDetails?.id) {
			const subtitleEnable: any = (selectedTimeLogDetails?.hasOwnProperty('splitFromSegmentId') && selectedTimeLogDetails?.splitFromSegmentId !== null && checkGUID(selectedTimeLogDetails?.splitFromSegmentId))  || selectedTimeLogDetails?.hasTimeOverlap || selectedTimeLogDetails?.hasLocationConflict;
			setCloseSubtitle(subtitleEnable)
			dispatch(setSmartItemOptionSelected({}));
		}
	}, [selectedTimeLogDetails?.id]);

	useEffect(() => {
		if (data?.id) {
			dispatch(setSelectedTimeLogDetails(data));
			dispatch(getTimeLogDetails(data?.id))
		}
	}, [data?.id]);

	const onClickSave = () =>{
			updateTimeLogDetails(selectedTimeLogDetails?.id, DetailspayloadSave, 
				(response: any) => {
				 dispatch(setSelectedTimeLogDetails(response));
				 afterItemAction(response);
				 dispatch(setDetailsPayloadSave({}));
				 dispatch(setSmartItemOptionSelected({}));
			});
	}
	const afterItemAction = (response: any) => {
		dispatch(getTimeLogDetails(selectedTimeLogDetails?.id))
		dispatch(getTimeLogList({}));
	};
	const handleAccept = () => {
		const payload = {
			timeSegmentIds:[selectedTimeLogDetails?.id]
		}
		acceptTimeLog(payload, afterItemAction)
	}
	const handleSendback = (data:any) => {
		const payload = {
			timeSegmentIds:[selectedTimeLogDetails?.id],
			reason:data?.reason,
			signature:data?.sign
		}
		sendBackTimeLog(payload, afterItemAction);
		setOpenSendBack(false);
	}
	const handleSplit = (data:any) => {
		const splitEntries = data?.timeEntries?.map((entry:any) => {

			let startDate = addTimeToDate(selectedTimeLogDetails?.startTime,entry?.startTime);
			let endDate = addTimeToDate(selectedTimeLogDetails?.endTime, entry?.endTime);
			return {
				startTime: startDate ? moment(startDate).format("MM/DD/yyyy h:mm A") : '',
				endTime: endDate ? moment(endDate).format("MM/DD/yyyy h:mm A"): '',
				userId : selectedTimeLogDetails?.user?.ID
			}
		});
		const payload = {
			splitFromSegmentId: selectedTimeLogDetails?.id,
			segments: [...splitEntries],
			reason: data?.description
		}
		console.log('payload',payload)
		addTimeLog(payload,afterItemAction)
	}

	const tabConfig = [
		{
			tabId: 'details',
			label: 'Details',
			showCount: false,
			disabled: false,
			iconCls: 'common-icon-details',
			content: <Details />
		}, {
			tabId: 'links',
			label: 'Links',
			showCount: true,
			iconCls: 'common-icon-Links',
			disabled: false,
			count: selectedTimeLogDetails?.links?.length,
			content: <TLLinks />
		}
	];

	const HeaderContentUpdate = useMemo(() => {
		return HeaderContent;
	}, [selectedTimeLogDetails]);

	const TitleUpdate = useMemo(() => {
		return Title;
	}, [selectedTimeLogDetails]);

	const lidProps = {
		title: <TitleUpdate />,
		showSubTitle: closeSubtitle,
		subtitle: (selectedTimeLogDetails?.hasOwnProperty('splitFromSegmentId') && selectedTimeLogDetails?.splitFromSegmentId !== null && checkGUID(selectedTimeLogDetails?.splitFromSegmentId) ) || getTimeLogStatus(selectedTimeLogDetails.status) == 'Reported' ? <SubTitleContent toast={(value: any) => { setCloseSubtitle(value) }} /> : null,
		defaultTabId: 'details',
		tabPadValue: 10,
		headContent: {
			showCollapsed: true,
			regularContent: <HeaderContentUpdate status={stateObject} />,
			collapsibleContent: <CollapseContent status={stateObject} />
		},
		tabs: tabConfig,
		footer: {
			rightNode: <>
			{
				(!isWorker() && getTimeLogStatus(selectedTimeLogDetails?.status) == 'Reported') && <>
					<IQButton className='sendback-buttons' disabled={false} onClick={() => {setOpenSendBack(true)}}>
						SEND BACK
					</IQButton>
					<IQButton className='split-buttons' disabled={false} onClick={() => { setOpenSplit(true)}}>
						Split
					</IQButton>
					<IQButton className='accept-buttons' disabled={false} onClick={() => {handleAccept()}}>
						ACCEPT
					</IQButton>

				</>
			}
			{(getTimeLogStatus(selectedTimeLogDetails?.status) == 'Sent Back') && <IQButton className='resubmit-buttons' disabled={saveButtonEnable} onClick={() => {  onClickSave() }}>
					Resubmit
			</IQButton>}
			{['Reported']?.includes(getTimeLogStatus(selectedTimeLogDetails?.status)) && <IQButton className='save-buttons' disabled={saveButtonEnable} onClick={() => { onClickSave() }}>
				SAVE
			</IQButton> }

				{/* {
				getTimeLogStatus(selectedTimeLogDetails.status) == 'Reported' ? 
						<>
									{canManageTimeForCompany() ?
										<>
											<IQButton className='sendback-buttons' disabled={false} onClick={() => {handleSendback()}}>
												SEND BACK
											</IQButton>
											<IQButton className='accept-buttons' disabled={false} onClick={() => {handleAccept()}}>
												ACCEPT
											</IQButton>
										</>
										:
										<></>
									}
										<IQButton className='split-buttons' disabled={false} onClick={() => { handleSplit() }}>
										Split
									</IQButton>
									<IQButton className='save-buttons' disabled={false} onClick={() => { onClickSave() }}>
										SAVE
									</IQButton> 
						</> :
						getTimeLogStatus(selectedTimeLogDetails.status) == 'Sent Back' ?
							<IQButton className='resubmit-buttons' disabled={false} onClick={() => { console.log('Resubmit') }}>
								Resubmit
							</IQButton>
							:	
							<IQButton className='save-buttons' disabled={false} onClick={() => { onClickSave() }}>
								SAVE
							</IQButton> 
				} */}
			</>,
			leftNode: <>
				{getTimeLogStatus(selectedTimeLogDetails.status) == 'Sent Back' &&
					<ContractorResponse
						text={'Time Log Entries Sent Back for Revision'}
						contractorName={selectedTimeLogDetails?.sentBackBy ? selectedTimeLogDetails?.sentBackBy : ''}
						respondedOn={selectedTimeLogDetails?.sentBackOn ? stringToUSDateTime2(selectedTimeLogDetails?.sentBackOn) : ''}
						responseType={1}
						reason={selectedTimeLogDetails?.sendBackReason}
						sign={'sign'}
						thumbNailImg={selectedTimeLogDetails?.sentBackByThumbnail}
					/>
				}
			</>,
			toast: <></>
		},
		appInfo: appInfo,
		iFrameId: "timeLogIframe",
		appType: "TimeLogRequests",
		isFromHelpIcon: true,
		presenceProps: {
			presenceId: 'TimeLog-LineItem-presence',
			showLiveSupport: true,
			showPrint: true,
			showLiveLink: false,
			showStreams: true,
			showComments: false,
			showChat: false,
			hideProfile: false
		},
		data: selectedTimeLogDetails,
	};


	return (
		<div className='timeLog-lineitem-detail'>
			<IQGridLID {...lidProps} {...props} />
			{openSendBack && <SendBackModel data={selectedTimeLogDetails ? [selectedTimeLogDetails] : []} onClose={(value: any) => { setOpenSendBack(false) }} onSubmit={(val:any) => {handleSendback(val)}}/>}
			{
			openSplit && <SplitTimeSegmentDialog defaultRowData = {generateSplitEntryData(selectedTimeLogDetails)} data={selectedTimeLogDetails} handleSubmit={(data:any) => handleSplit(data)} onClose={() => {setOpenSplit(false)}} />				
			}
		</div >
	);
});

const HeaderContent = memo((props: any) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedTimeLogDetails } = useAppSelector(state => state.timeLogRequest);
	const stateObject = props.status;

	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				<span className='budgetid-label grey-font'>Time Segment ID:</span>
				<span className='grey-fontt bold'>{selectedTimeLogDetails?.timeSegmentId}</span>
				<span className='budgetid-label grey-font'>Segment Duration:</span>
				<span className='grey-fontt bold'>{getDuration(selectedTimeLogDetails?.duration)}</span>
				<span className='last-modified-label grey-font'>Date Created:</span>
				<span className='grey-fontt'>{selectedTimeLogDetails?.createdDate && stringToUSDateTime2(selectedTimeLogDetails?.createdDate)} by {selectedTimeLogDetails?.createdBy?.firstName && selectedTimeLogDetails?.createdBy?.firstName + ' ' +selectedTimeLogDetails?.createdBy?.lastName}</span>
			</div>
			<span className='kpi-right-container'>
				<span className='kpi-name'>
					<span>Status :</span>
					<span
						className='status'
						style={{
							color: stateObject?.color,
							backgroundColor: stateObject?.bgColor
						}}
					>
						<span className={`status-icon ${stateObject?.icon}`}></span> {stateObject?.text}{' '}
					</span>
				</span>
			</span>
		</div>
	</div>;
});

const CollapseContent = memo((props: any) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedTimeLogDetails } = useAppSelector(state => state.timeLogRequest);
	const stateObject = props.status;

	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				<span className='status grey-font'>Status:</span>
				<span className='status' style={{ backgroundColor: stateObject?.bgColor, color: stateObject?.color, width: 'fit-content' }}>
					<span className={`status-icon ${stateObject?.icon}`}></span>{stateObject?.text}
				</span>
			</div>
		</div>
	</div>;
});

const Title = memo(() => {
	const { selectedTimeLogDetails } = useAppSelector(state => state.timeLogRequest);
	return (
		<div className='title-section'>
			<div className='image-section'>
				<img src={selectedTimeLogDetails?.user ? selectedTimeLogDetails?.user?.icon : ''} className='image' />
			</div>
			<div className='name-section'>
				<div className='name'>{selectedTimeLogDetails?.user?.firstName + ' ' +selectedTimeLogDetails?.user?.lastName}</div>
				<div className='companyName'>{selectedTimeLogDetails?.company?.name}</div>
			</div>
		</div>
	)
})

const SubTitleContent = (props: any) => {
	const { selectedTimeLogDetails } = useAppSelector(state => state.timeLogRequest);

	const splitFromSegment = selectedTimeLogDetails?.hasOwnProperty('splitFromSegmentId') && selectedTimeLogDetails?.splitFromSegmentId !== null && checkGUID(selectedTimeLogDetails?.splitFromSegmentId) ;
	const Title = splitFromSegment == true ? `The Split Time entry was Created from the orignal Time Segment ID: ${selectedTimeLogDetails?.timeSegmentId}.` :
								selectedTimeLogDetails?.hasTimeOverlap == true ? 'There seems to be a duplicate or an overlapping time entry' :
								selectedTimeLogDetails?.hasLocationConflict == true  ? 'This Time was not entered anywhere within the Job Location'
								: null;
	const iconClass = splitFromSegment == true ? 'common-icon-sku': selectedTimeLogDetails?.hasTimeOverlap == true || selectedTimeLogDetails?.hasLocationConflict == true ? 'common-icon-exclamation' : '';

	return (
		<>
		 {(selectedTimeLogDetails?.hasOwnProperty('splitFromSegmentId') && selectedTimeLogDetails?.splitFromSegmentId !== null && checkGUID(selectedTimeLogDetails?.splitFromSegmentId))  || selectedTimeLogDetails?.hasTimeOverlap || selectedTimeLogDetails?.hasLocationConflict &&
				<div style={{
					display: 'flex',
					gap: '6px',
					alignItems: 'center',
					background: '#fdf5ca',
					padding: '8px 10px',
					borderRadius: '6px',
					marginTop: '6px',
					width: 'fit-content',
					border: '2px solid #fae57a'
				}}>
					<span className={iconClass} style={{ color: splitFromSegment === true ? 'orange' : 'red', fontSize: "30px", marginTop: "-1px", }} />
					<div style={{ fontSize: '14px', fontFamily: "Roboto-Regular", color: 'black', fontWeight: 500 }}>
						{Title}
					</div>
					{splitFromSegment == true && <span className={'closeicon common-icon-close'} onClick={() => { props.toast(false) }} />}
				</div>
		 }
		</>
	)
};
export default TimeLogLID;