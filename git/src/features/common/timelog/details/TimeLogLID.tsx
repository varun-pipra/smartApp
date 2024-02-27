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
import { getTimeLogDetails, setSelectedTimeLogDetails,setDetailsPayloadSave, getTimeLogList } from '../stores/TimeLogSlice';
import { stringToUSDateTime2 } from 'utilities/commonFunctions';
import { getTimeLogDateRange, getTimeLogStatus } from 'utilities/timeLog/enums';
import { timelogStatusMap } from '../TimeLogConstants';
import {getDuration} from '../utils';
import {updateTimeLogDetails, addTimeLog, acceptTimeLog, sendBackTimeLog} from '../stores/TimeLogAPI';
import {canManageTimeForCompany,canManageTimeForProject, isWorker} from 'app/common/userLoginUtils';
import SendBackModel from '../toolbar/SendBackModel/sendBackModel';
import SplitTimeSegmentDialog from '../timeSplitSegment/SplitTimeSegmentDialog';

const TimeLogLID = memo(({ data, ...props }: any) => {
	const dispatch = useAppDispatch();
	const { server } = useAppSelector(state => state.appInfo);
	const appInfo = useAppSelector(getServer);
	const { selectedTimeLogDetails ,DetailspayloadSave, TimeLogGridList} = useAppSelector(state => state.timeLogRequest);
	const stateObject: any = (timelogStatusMap || [])?.find((x: any) => x.value === selectedTimeLogDetails?.status?.toString());
	const [closeSubtitle, setCloseSubtitle] = React.useState<any>(true)
	const [openSendBack, setOpenSendBack] = React.useState<any>(false)
	const [openSplit, setOpenSplit] = React.useState<any>(false)
	
	useEffect(() => {
		if (selectedTimeLogDetails?.id) {
			const subtitleEnable: any = getTimeLogStatus(selectedTimeLogDetails?.status) == 'Sent Back' || selectedTimeLogDetails?.hasTimeOverlap || selectedTimeLogDetails?.hasLocationConflict;
			setCloseSubtitle(subtitleEnable)
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
					console.log('response',response)
				 dispatch(setSelectedTimeLogDetails(response));
				 dispatch(setDetailsPayloadSave({}));
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
		console.log("handleSendback data", data)
		const payload = {
			timeSegmentIds:[selectedTimeLogDetails?.id],
			reason:data?.reason,
			signature:data?.sign
		}
		sendBackTimeLog(payload, afterItemAction);
		setOpenSendBack(false);
	}
	const handleSplit = (data:any) => {
		const payload = {
			splitFromSegmentId: selectedTimeLogDetails?.id,
			segments: []
		}
		addTimeLog(payload, (response:any) => {});
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
			showCount: false,
			iconCls: 'common-icon-Links',
			disabled: false,
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
		subtitle: getTimeLogStatus(selectedTimeLogDetails.status) == 'Sent Back' || getTimeLogStatus(selectedTimeLogDetails.status) == 'Reported' ? <SubTitleContent toast={(value: any) => { setCloseSubtitle(value) }} /> : null,
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
			{(isWorker() && getTimeLogStatus(selectedTimeLogDetails?.status) == 'Sent Back') && <IQButton className='resubmit-buttons' disabled={false} onClick={() => { console.log('Resubmit') }}>
					Resubmit
			</IQButton>}
			{['In Progress', 'Planned']?.includes(getTimeLogStatus(selectedTimeLogDetails?.status)) && <IQButton className='save-buttons' disabled={false} onClick={() => { onClickSave() }}>
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
						contractorName={'Gerald,Alexendra'}
						respondedOn={'05/01/2024'}
						responseType={1}
						reason={'cross check the timelog'}
						sign={'sign'}
						thumbNailImg={''}
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
			openSplit && <SplitTimeSegmentDialog data={selectedTimeLogDetails} handleSubmit={(data:any) => handleSplit(data)} onClose={() => {setOpenSplit(false)}} />				
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
				<span className='grey-fontt'>{selectedTimeLogDetails?.startDate && stringToUSDateTime2(selectedTimeLogDetails?.startDate)} by {selectedTimeLogDetails?.createdBy?.firstName + ' ' +selectedTimeLogDetails?.createdBy?.lastName}</span>
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

	const Status = getTimeLogStatus(selectedTimeLogDetails.status);
	const Title = Status == 'Sent Back' ? 'The Split Time entry was Created from the orignal Time Segment ID: TS00.' :
								selectedTimeLogDetails?.hasTimeOverlap == true ? 'There seems to be a duplicate or an overlapping time entry' :
								selectedTimeLogDetails?.hasLocationConflict == true  ? 'This Time was not entered anywhere within the Job Location'
								: null;
	const iconClass = Status == 'Sent Back' ? 'common-icon-sku': selectedTimeLogDetails?.hasTimeOverlap == true || selectedTimeLogDetails?.hasLocationConflict == true ? 'common-icon-exclamation' : '';

	return (
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
			<span className={iconClass} style={{ color: Status === 'Sent Back' ? 'orange' : 'red', fontSize: "30px", marginTop: "-1px", }} />
			<div style={{ fontSize: '14px', fontFamily: "Roboto-Regular", color: 'black', fontWeight: 500 }}>
				{Title}
			</div>
			{Status == 'Sent Back' && <span className={'closeicon common-icon-close'} onClick={() => { props.toast(false) }} />}
		</div>
	)
};
export default TimeLogLID;