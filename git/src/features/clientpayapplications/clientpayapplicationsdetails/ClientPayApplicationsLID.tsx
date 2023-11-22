import React, { useEffect } from 'react';
import IQGridLID, { IQGridWindowDetailProps } from 'components/iqgridwindowdetail/IQGridWindowDetail';
import DynamicPage, { DynamicPageProps } from 'components/ui5/dynamicpage/DynamicPage';
import { useAppDispatch, useAppSelector, hideLoadMask } from 'app/hooks';
import BidDetailIO from 'resources/images/bidManager/BidDetails.svg';
import RefFilesIB from 'resources/images/bidManager/ReferenceFiles.svg';
import BiddersIB from 'resources/images/bidManager/Bidders.svg';
import BidQueriesIB from 'resources/images/bidManager/BidQueries.svg';
import AwardBidIB from 'resources/images/bidManager/AwardBid.svg';
var tinycolor = require('tinycolor2');
import { Box, Button, Stack, IconButton, Paper, TextField } from '@mui/material';
import { getBidStatus } from 'utilities/bid/enums';
import './ClientPayApplicationsLID.scss';
import ScheduleOFValues from './tabs/scheduleOfValues/ScheduleOfValues';
import ClientPayDetails from './tabs/clientpaydetails/ClientPayDetails';
import LienWaiver from './tabs/clientlienWaiver/LienWaiver';
import IQButton from 'components/iqbutton/IQButton';
import { vendorPayAppsPaymentStatus, vendorPayAppsPaymentStatusColors, vendorPayAppsPaymentStatusIcons } from 'utilities/vendorPayApps/enums';
import { stringToUSDateTime2 } from 'utilities/commonFunctions';
import { getServer } from 'app/common/appInfoSlice';
import { getClientPayAppDetailsById, getSelectedRecord, setSelectedRecord } from '../stores/ClientPayAppsSlice';
import { isUserGCForCPA } from '../utils';
import ContractSignModal from 'sui-components/ContractSignModal/ContractSignModal';
import { authorizePayApp, rejectPayApp, submitPayApp } from '../stores/ButtonAPI';
import { ContractorResponse } from 'features/vendorcontracts/vendorcontractsdetails/ContractorResponse/ContractorResponse';
import { getClientPayAppsList } from '../stores/GridSlice';
import { amountFormatWithOutSymbol } from 'app/common/userLoginUtils';


const HeaderContent = (props: any) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	return (
		<>
			<div className='kpi-section'>
				<div className='kpi-vertical-container'>
					<div className='lid-details-container'>
						<span className='budgetid-label grey-font'>Status:</span>
						<span className='status-pill' style={{ backgroundColor: vendorPayAppsPaymentStatusColors[props?.headerData?.status], color: tinycolor(vendorPayAppsPaymentStatusColors[props?.headerData?.status]).isDark() ? 'white' : 'black', }}>
							<span className={vendorPayAppsPaymentStatusIcons[props?.headerData?.status]} />
							{vendorPayAppsPaymentStatus[props?.headerData?.status]}
						</span>
						<span className='last-modified-label grey-font'>Last Modified:</span>{props?.headerData?.modifiedOn ? stringToUSDateTime2(props?.headerData?.modifiedOn) : ''} by {props?.headerData?.modifiedBy?.displayName}<span className='grey-fontt'> </span>
					</div>
					<span className='kpi-right-container'>
						<span className='kpi-name' >Total Payout Amount  <span className='bold'>{currencySymbol}</span></span>
						<span className='amount' style={{ backgroundColor: '#c9e59f' }}>{amountFormatWithOutSymbol(props?.headerData?.amount)}</span>
					</span>
				</div>
			</div>
		</>
	)
}

const CollapseContent = (props: any) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	return (
		<>
			<div className='kpi-section'>
				<div className='kpi-vertical-container'>
					<div className='lid-details-container'>
						<span className='budgetid-label grey-font'>Status:</span>
						<span className='status-pill' style={{ backgroundColor: vendorPayAppsPaymentStatusColors[props?.headerData?.status], color: tinycolor(vendorPayAppsPaymentStatusColors[props?.headerData?.status]).isDark() ? 'white' : 'black', }}>
							<span className={vendorPayAppsPaymentStatusIcons[props?.headerData?.status]} />
							{vendorPayAppsPaymentStatus[props?.headerData?.status]}
						</span>
					</div>
					<span className='kpi-right-container'>
						<span className='kpi-name' >Total Payout Amount <span className='bold'>{currencySymbol}</span></span>
						<span className='amountSection' style={{ backgroundColor: '#c9e59f' }}>{amountFormatWithOutSymbol(props?.headerData?.amount)}</span>
					</span>
				</div>
			</div>
		</>
	)
}
const ClientPayApplicationsLID = ({ data, ...props }: IQGridWindowDetailProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const clientPayAppLineItem: any = useAppSelector(getSelectedRecord);
	const { eableSubmitPayAppBtn, signature } = useAppSelector((state) => state.clientPayApps);
	const [submitPayAppBtn, setSubmitPayAppBtn] = React.useState<any>({ show: false, disable: false });
	const [authorize, setAuthorize] = React.useState<any>({ show: false, disable: false });
	const [reject, setReject] = React.useState<any>({ show: false, disable: false });
	const [contractDialog, setContractDialog] = React.useState<any>({ show: false, disable: false });
	const [contractorResponse, setContractorResponse] = React.useState<any>({ show: false, type: 2, data: {} });
	const { cPayAppId, tab } = useAppSelector((state) => state.clientPayApps);

	React.useEffect(() => {
		setContractorResponse({ ...contractorResponse, show: ["Rejected"]?.includes(clientPayAppLineItem?.status), type: 3, data: clientPayAppLineItem?.scAuthorization?.rejection ? clientPayAppLineItem?.scAuthorization : clientPayAppLineItem?.gcAuthorization });
		['Draft', 'AutoGeneratedWaitingForBothParties'].includes(clientPayAppLineItem?.status) ? setSubmitPayAppBtn({ show: true, disable: !eableSubmitPayAppBtn }) : setSubmitPayAppBtn({ show: false, disable: false });
		// ['Submitted'].includes(data?.status) ? setUnlockPayApp({ show: true, disable: false }) : setUnlockPayApp({ show: false, disable: false });
		// if(!isUserGCForCPA(appInfo)) {
		['AwaitingAcceptance'].includes(clientPayAppLineItem?.status) ? setAuthorize({ show: true, disable: !eableSubmitPayAppBtn }) : setAuthorize({ show: false, disable: false });
		['AwaitingAcceptance'].includes(clientPayAppLineItem?.status) ? setReject({ show: true, disable: false }) : setReject({ show: false, disable: false });
		// }
	}, [clientPayAppLineItem, eableSubmitPayAppBtn]);

	React.useEffect(() => {
		dispatch(setSelectedRecord(data));
		dispatch(getClientPayAppDetailsById({ appInfo: appInfo, id: data?.id }))
	}, [data?.id]);

	const handleSubmitPayApp = () => {
		submitPayApp(appInfo, clientPayAppLineItem?.id, (response: any) => {
			dispatch(setSelectedRecord(response))
			dispatch(getClientPayAppsList(appInfo));
		})
	}

	const handleAuthorize = () => {
		console.log("Authorize", clientPayAppLineItem)
		// const sign = isUserGCForVPA(appInfo) ? vendorPayAppLineItem?.gcAuthorization?.signature : vendorPayAppLineItem?.scAuthorization?.signature
		authorizePayApp(appInfo, { signature: signature }, clientPayAppLineItem?.id, (response: any) => {
			dispatch(setSelectedRecord(response));
			dispatch(getClientPayAppsList(appInfo));
		})
	};

	useEffect(() => {
		if (cPayAppId) {
			const callList: Array<any> = [
				dispatch(
					getClientPayAppDetailsById({ appInfo: appInfo, id: cPayAppId })
				),
			];
			Promise.all(callList).then(() => {
				hideLoadMask();
			});
		}
	}, [appInfo, cPayAppId]);

	const tabConfig = [
		{
			tabId: 'pay-Application-Details',
			label: 'Pay Application Details',
			showCount: false,
			iconCls: 'common-icon-pay-application',
			// icon: <span className='common-icon-pay-application tabicon tabicon_orange' />,
			content: <ClientPayDetails />
		}, {
			tabId: 'billing-Schedules',
			label: 'Billing Schedules',
			showCount: true,
			iconCls: 'common-icon-schedule-values',
			// icon: <span className='common-icon-schedule-values tabicon tabicon_orange' />,
			content: <ScheduleOFValues />
		}, {
			tabId: 'lien-Waiver',
			label: 'Lien Waiver',
			showCount: true,
			iconCls: 'common-icon-lien-waiver',
			// icon: <span className='common-icon-lien-waiver tabicon tabicon_orange' />,
			content: <LienWaiver />
		},
		// {
		// 	tabId: 'links',
		// 	label: 'Links',
		// 	showCount: false,
		// 	iconCls: 'common-icon-Links',
		// 	// icon: <span className='common-icon-Links tabicon tabicon_orange' />,
		// 	disabled: true,
		// 	content: <p>links</p>
		// }
	]

	const lidProps = {
		title: `Pay Application ID: ${clientPayAppLineItem?.code}`,
		defaultTabId: 'pay-Application-Details',
		tabPadValue: 10,
		headContent: {
			regularContent: <HeaderContent headerData={clientPayAppLineItem} />,
			collapsibleContent: <CollapseContent headerData={clientPayAppLineItem} />,
			collapsed: true,
		},
		tabs: tabConfig,
		footer: {
			rightNode: <>
				{
					submitPayAppBtn?.show && <IQButton
						disabled={submitPayAppBtn?.disable}
						className='btn-post-contract'
						// color='white'
						onClick={() => handleSubmitPayApp()}
					// startIcon={<Gavel />}
					>
						SUBMIT PAY APPLICATION
					</IQButton>
				}
				{
					reject.show && <IQButton
						disabled={reject.disable}
						className='btn-save-changes'
						variant="outlined"
						onClick={() => setContractDialog({ show: true, type: 'reject' })}
					>
						REJECT
					</IQButton>
				}
				{
					authorize?.show && <IQButton
						disabled={authorize?.disable}
						className='btn-post-contract'
						// color='white'
						onClick={() => { handleAuthorize() }}
					// startIcon={<Gavel />}
					>
						AUTHORIZE
					</IQButton>
				}
				{contractDialog?.show && <ContractSignModal
					open={contractDialog?.show}
					formType={contractDialog?.type}
					userName={appInfo?.currentUserInfo?.name}
					onModalClose={() => { setContractDialog({ ...contractDialog, show: false }) }}
					onSubmit={(value: any) => { rejectPayApp(appInfo, { signature: signature, reason: value?.reason }, clientPayAppLineItem?.id, (response: any) => { dispatch(setSelectedRecord(response)); dispatch(getClientPayAppsList(appInfo)); setContractDialog({ ...contractDialog, show: false }) }) }}
				></ContractSignModal>}
			</>,
			leftNode: <>
				{
					contractorResponse?.show && contractorResponse?.data && < ContractorResponse contractorName={contractorResponse?.data?.displayName} respondedOn={contractorResponse?.data?.rejection?.date} responseType={contractorResponse?.type} reason={contractorResponse?.data?.rejection?.reason} sign={contractorResponse?.data?.signature}
						thumbNailImg={contractorResponse?.data?.image?.downloadUrl}
					/>
				}
			</>
		},
		appInfo: appInfo,
		iFrameId: "clientPayAppIframe",
		appType: "clientPayApp",
		isFromHelpIcon: true,
		presenceProps: {
			presenceId: 'clientPayApp-LineItem-presence',
			showLiveSupport: true,
			showLiveLink: false,
			showStreams: true,
			showComments: false,
			showChat: false,
			hideProfile: false
		},
		data: clientPayAppLineItem,
	};

	return (
		<div className='Clientpay-lineitem-detail-panel'>
			<IQGridLID {...lidProps} {...props} />
		</div>
	)
};

export default ClientPayApplicationsLID;