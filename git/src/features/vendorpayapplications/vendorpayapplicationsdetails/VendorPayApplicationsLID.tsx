import React, {useEffect} from 'react';
import IQGridLID, {IQGridWindowDetailProps} from 'components/iqgridwindowdetail/IQGridWindowDetail';
import {useAppDispatch, useAppSelector, hideLoadMask} from 'app/hooks';
import './VendorPayApplicationsLID.scss';
import ScheduleOFValues from './tabs/scheduleOfValues/ScheduleOfValues';
import VendorPayDetails from './tabs/vendorpaydetails/VendorPayDetails';
import LienWaiver from './tabs/lienWaiver/LienWaiver';
import IQButton from 'components/iqbutton/IQButton';
import {vendorPayAppsPaymentStatus, vendorPayAppsPaymentStatusColors, vendorPayAppsPaymentStatusIcons} from 'utilities/vendorPayApps/enums';
import {getServer} from 'app/common/appInfoSlice';
import {getPayAppDetails, getSelectedRecord, setSelectedRecord} from '../stores/VendorPayAppSlice';
import {stringToUSDateTime2} from 'utilities/commonFunctions';
import ContractSignModal from 'sui-components/ContractSignModal/ContractSignModal';
import {authorizePayApp, rejectPayApp, submitPayApp} from '../stores/ButtonAPI';
import {ContractorResponse} from 'features/vendorcontracts/vendorcontractsdetails/ContractorResponse/ContractorResponse';
import {getVendorPayAppsLst} from '../stores/gridSlice';
import {patchVendorPayAppDetails} from "features/vendorpayapplications/stores/gridApi";
import {amountFormatWithOutSymbol} from 'app/common/userLoginUtils';
import {blockchainStates, setShowBlockchainDialog} from 'app/common/blockchain/BlockchainSlice';
import BlockchainIB from 'features/common/informationBubble/BlockchainIB';
import { sapLinksObj } from 'utilities/sapLink';
import { connectorImages } from 'utilities/commonutills';
var tinycolor = require('tinycolor2');

const HeaderContent = (props: any) => {
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const { connectors } = useAppSelector((state) => state.gridData);
	const vendorPayAppLineItem: any = useAppSelector(getSelectedRecord);
	return (
		<>
			<div className='kpi-section'>
				<div className='kpi-vertical-container'>
					<div className='lid-details-container'>
						<span className='budgetid-label grey-font'>Status:</span>
						{/* <span className='status-pill'
							style={{backgroundColor: vendorPayAppsPaymentStatusColors[props?.headerData?.status], color: tinycolor(vendorPayAppsPaymentStatusColors[props?.headerData?.status]).isDark() ? 'white' : 'black', }}
						>
							<span className={vendorPayAppsPaymentStatusIcons[props?.headerData?.status]} />
							{vendorPayAppsPaymentStatus[props?.headerData?.status]}
						</span> */}
						<span className='bid-content'>
								<span className='status-pill'
									style={{backgroundColor: vendorPayAppsPaymentStatusColors[props?.headerData?.status], color: tinycolor(vendorPayAppsPaymentStatusColors[props?.headerData?.status]).isDark() ? 'white' : 'black', }}
								>
									<span className={vendorPayAppsPaymentStatusIcons[props?.headerData?.status]} />
									{vendorPayAppsPaymentStatus[props?.headerData?.status]}
								</span>
								<span className='sap'>
										{connectors?.length && vendorPayAppLineItem?.connectorItemData ? <img
												className="sapnumber hot-link"
												src={connectorImages?.[vendorPayAppLineItem?.connectorItemData?.type]}
												alt="connector Image"
											/> : ''}
											{connectors?.length && vendorPayAppLineItem?.connectorItemData ? <span className='sapnumber hot-link' onClick={()=>{vendorPayAppLineItem?.connectorItemData?.url && window.open(vendorPayAppLineItem?.connectorItemData?.url)}}>{vendorPayAppLineItem?.connectorItemData?.name}</span> : ''}
								</span>
						</span>
						<span className='last-modified-label grey-font'>Last Modified:</span><span className='grey-fontt'>{props?.headerData?.modifiedOn ? stringToUSDateTime2(props?.headerData?.modifiedOn) : ''} by {props?.headerData?.modifiedBy?.displayName} </span>
					</div>
					<span className='kpi-right-container'>
						<span className='kpi-name' >Total Payout Amount  <span className='bold'>{currencySymbol}</span></span>
						<span className='amount' style={{backgroundColor: '#c9e59f'}}>{amountFormatWithOutSymbol(props?.headerData?.amount)}</span>
					</span>
				</div>
			</div>
		</>
	);
};

const CollapseContent = (props: any) => {
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	return (
		<>
			<div className='kpi-section'>
				<div className='kpi-vertical-container'>
					<div className='lid-details-container'>
						<span className='budgetid-label grey-font'>Status:</span>
						<span className='status-pill' style={{backgroundColor: vendorPayAppsPaymentStatusColors[props?.headerData?.status], color: tinycolor(vendorPayAppsPaymentStatusColors[props?.headerData?.status]).isDark() ? 'white' : 'black', }}>
							<span className={vendorPayAppsPaymentStatusIcons[props?.headerData?.status]} />
							{vendorPayAppsPaymentStatus[props?.headerData?.status]}
						</span>
					</div>
					<span className='kpi-right-container'>
						<span className='kpi-name' >Total Payout Amount<span className='bold'>{currencySymbol}</span></span>
						<span className='amount' style={{backgroundColor: '#c9e59f'}}>{amountFormatWithOutSymbol(props?.headerData?.amount)}</span>
					</span>
				</div>
			</div>
		</>
	);
};

const VendorPayApplicationsLID = ({data, ...props}: IQGridWindowDetailProps) => {

	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const vendorPayAppLineItem: any = useAppSelector(getSelectedRecord);
	const {eableSubmitPayAppBtn, signature, selectedRecord} = useAppSelector((state) => state.vendorPayApps);
	const [submitPayAppBtn, setSubmitPayAppBtn] = React.useState<any>({show: false, disable: false});
	// const [unlockPayApp, setUnlockPayApp] = React.useState<any>({ show: false, disable: false });
	const [authorize, setAuthorize] = React.useState<any>({show: false, disable: false});
	const [reject, setReject] = React.useState<any>({show: false, disable: false});
	const [contractDialog, setContractDialog] = React.useState<any>({show: false, disable: false});
	const [contractorResponse, setContractorResponse] = React.useState<any>({show: false, type: 2, data: {}});
	const {vPayAppId, tab} = useAppSelector((state) => state.vendorPayApps);
	const {blockchainEnabled} = useAppSelector((state) => state.blockchain);
	const disableBlockchainActionButtons = (blockchainEnabled && blockchainStates.indexOf(vendorPayAppLineItem?.blockChainStatus) === -1);

	React.useEffect(() => {
		setContractorResponse({...contractorResponse, show: ["Rejected"]?.includes(vendorPayAppLineItem?.status), type: 3, data: vendorPayAppLineItem?.scAuthorization?.rejection ? vendorPayAppLineItem?.scAuthorization : vendorPayAppLineItem?.gcAuthorization});
		['Draft', 'AutoGeneratedWaitingForBothParties'].includes(vendorPayAppLineItem?.status) ? setSubmitPayAppBtn({show: true, disable: !eableSubmitPayAppBtn}) : setSubmitPayAppBtn({show: false, disable: false});
		// ['Submitted'].includes(data?.status) ? setUnlockPayApp({ show: true, disable: false }) : setUnlockPayApp({ show: false, disable: false });
		// if(!isUserGCForVPA(appInfo)) {
		['AwaitingAcceptance'].includes(vendorPayAppLineItem?.status) ? setAuthorize({show: true, disable: !eableSubmitPayAppBtn}) : setAuthorize({show: false, disable: false});
		['AwaitingAcceptance'].includes(vendorPayAppLineItem?.status) ? setReject({show: true, disable: false}) : setReject({show: false, disable: false});
		// }
	}, [vendorPayAppLineItem, eableSubmitPayAppBtn]);

	React.useEffect(() => {
		dispatch(setSelectedRecord(data));
		dispatch(getPayAppDetails({appInfo: appInfo, id: data?.id}));
	}, [data?.id]);

	const handleSubmitPayApp = () => {
		selectedRecord?.status != 'AwaitingAcceptance' &&
			patchVendorPayAppDetails(appInfo, {signature: signature, signedOn: new Date()}, selectedRecord?.id, (response: any) => {
				submitPayApp(appInfo, vendorPayAppLineItem?.id, (response: any) => {
					dispatch(setSelectedRecord(response));
					dispatch(getVendorPayAppsLst(appInfo));
					if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
						dispatch(setShowBlockchainDialog(true));
					}
				});
			});
	};

	const handleAuthorize = () => {
		authorizePayApp(appInfo, {signature: signature}, vendorPayAppLineItem?.id, (response: any) => {
			dispatch(setSelectedRecord(response));
			dispatch(getVendorPayAppsLst(appInfo));
			if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
				dispatch(setShowBlockchainDialog(true));
			}
		});
	};

	useEffect(() => {
		if(vPayAppId) {
			const callList: Array<any> = [
				dispatch(getPayAppDetails({appInfo: appInfo, id: vPayAppId}))
			];

			Promise.all(callList).then(() => {
				hideLoadMask();
			});
		}
	}, [appInfo, vPayAppId]);

	const tabConfig = [
		{
			tabId: 'pay-Application-Details',
			label: 'Pay Application Details',
			showCount: false,
			iconCls: 'common-icon-pay-application',
			content: <VendorPayDetails />
		}, {
			tabId: 'schedule-of-Values',
			label: 'Schedule of Values',
			showCount: true,
			iconCls: 'common-icon-schedule-values',
			content: <ScheduleOFValues />
		}, {
			tabId: 'lien-Waiver',
			label: 'Lien Waiver',
			showCount: true,
			iconCls: 'common-icon-lien-waiver',
			content: <LienWaiver />
		},
		// {
		// 	tabId: 'links',
		// 	label: 'Links',
		// 	showCount: false,
		// 	iconCls: 'common-icon-Links',
		// 	disabled: true,
		// 	content: <p>links</p>
		// }
	];

	const lidProps = {
		title: `Pay Application ID: ${vendorPayAppLineItem?.code}`,
		defaultTabId: 'pay-Application-Details',
		tabPadValue: 15,
		headContent: {
			showCollapsed: true,
			showBCInfo: disableBlockchainActionButtons,
			regularContent: <HeaderContent headerData={vendorPayAppLineItem} />,
			collapsibleContent: <CollapseContent headerData={vendorPayAppLineItem} />
		},
		tabs: tabConfig,
		footer: {
			rightNode: <>
				{
					submitPayAppBtn?.show && <IQButton
						disabled={submitPayAppBtn?.disable || disableBlockchainActionButtons}
						className='btn-post-contract'
						// color='white'
						onClick={() => handleSubmitPayApp()}
					// startIcon={<Gavel />}
					>
						SUBMIT PAY APPLICATION
					</IQButton>
				}
				{/* {
					unlockPayApp?.show && <IQButton
						disabled={unlockPayApp?.disable}
						className='btn-post-contract'
					// color='white'
					// onClick={handlePostBid}
					// startIcon={<Gavel />}
					>
						UNLOCK PAY APPLICATION
					</IQButton>
				} */}
				{
					reject.show && <IQButton
						disabled={reject.disable || disableBlockchainActionButtons}
						className='btn-save-changes'
						variant="outlined"
						onClick={() => setContractDialog({show: true, type: 'reject'})}
					>
						REJECT
					</IQButton>
				}
				{
					authorize?.show && <IQButton
						disabled={authorize?.disable || disableBlockchainActionButtons}
						className='btn-post-contract'
						// color='white'
						onClick={() => {handleAuthorize();}}
					// startIcon={<Gavel />}
					>
						AUTHORIZE
					</IQButton>
				}
				{contractDialog?.show && <ContractSignModal
					open={contractDialog?.show}
					formType={contractDialog?.type}
					userName={appInfo?.currentUserInfo?.name}
					onModalClose={() => {setContractDialog({...contractDialog, show: false});}}
					onSubmit={(value: any) => {
						rejectPayApp(appInfo, signature !== null ? {reason: value?.reason, signature: signature} : {reason: value?.reason}, vendorPayAppLineItem?.id, (response: any) => {
							dispatch(setSelectedRecord(response));
							dispatch(getVendorPayAppsLst(appInfo));
							setContractDialog({...contractDialog, show: false});
							if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
								dispatch(setShowBlockchainDialog(true));
							}
						});
					}}
				></ContractSignModal>}
			</>,
			leftNode: <>
				{
					contractorResponse?.show && contractorResponse?.data && <ContractorResponse
						contractorName={contractorResponse?.data?.displayName}
						respondedOn={contractorResponse?.data?.rejection?.date}
						responseType={contractorResponse?.type}
						reason={contractorResponse?.data?.rejection?.reason}
						sign={contractorResponse?.data?.signature}
						thumbNailImg={contractorResponse?.data?.image?.downloadUrl}

					/>
				}
			</>

		},
		appInfo: appInfo,
		iFrameId: "vendorPayAppIframe",
		appType: "VendorPayAppLineItem",
		isFromHelpIcon: true,
		presenceProps: {
			presenceId: 'VendorPayApp-LineItem-presence',
			showLiveSupport: true,
			showPrint: true,
			showLiveLink: false,
			showStreams: true,
			showComments: false,
			showChat: false,
			hideProfile: false
		},
		data: vendorPayAppLineItem,
	};

	return (
		<div className='Vendorpay-lineitem-detail-panel'>
			<IQGridLID {...lidProps} {...props} />
		</div>
	);
};

export default VendorPayApplicationsLID;




