import './ChangeEventRequestsLID.scss';

import { getServer } from 'app/common/appInfoSlice';
import { isChangeEventClient, isChangeEventGC, isChangeEventSC } from 'app/common/userLoginUtils';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import IQGridLID from 'components/iqgridwindowdetail/IQGridWindowDetail';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import ContractSignModal from 'sui-components/ContractSignModal/ContractSignModal';
import { stringToUSDateTime2 } from 'utilities/commonFunctions';
import Toast from 'components/toast/Toast';
import { SUIToast2 } from 'sui-components/Toast/Suitoast';
import { TextField } from '@mui/material';

import { ContractorResponse } from 'features/vendorcontracts/vendorcontractsdetails/ContractorResponse/ContractorResponse';
import { connectorImages, getAmountAlignment } from 'utilities/commonutills';
import { checkAtleastOneBudgetIsAssignedToVendor, checkEstimatedAmount, checkSubmitBy, checkSubmitEnable, stateMap } from '../CERUtils';
import Confirmation from '../modal/CERConfirmation';
import { authorizeByClient, rejectByClient, requestQuoteFromVendor, reviseByClient, submitChangeEvent, submitQuoteByVendor } from '../stores/ChangeEventAPI';
import {
	getBudgetLineItems, getChangeEventById, getChangeEventList, setChangeRequestDetails, setCurrentChangeEventId, setConfirmationBudgetList, setConfirmationGCSign
} from '../stores/ChangeEventSlice';
import BudgetLineItem from './tabs/budgetlineitem/BudgetLineItem';
import ChangeEventsDetails from './tabs/changeeventdetail/ChangeEventDetails';
import Links from './tabs/links/Links';
import ReferenceFiles from './tabs/referencefiles/ReferenceFiles';
import { amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
import { sapLinksObj } from 'utilities/sapLink';

const ChangeEventRequestsLID = memo(({ data, ...props }: any) => {
	const dispatch = useAppDispatch();
	const { server } = useAppSelector(state => state.appInfo);
	const appInfo = useAppSelector(getServer);
	const { currentChangeEventId, changeRequestDetails, referenceFiles = [], linksGridData } = useAppSelector(state => state.changeEventRequest);
	const [openModel, setOpenModel] = useState<boolean>(false);
	const [contractDialog, setContractDialog] = React.useState<any>({ show: false, disable: false });
	const [modelData, setModelData] = useState<any>({
		label: '',
		modelWidth: '',
		modelHeight: '',
		buttonLabel: '',
		formType: '',
		checkBoxUserName: '',
		checkboxdesc: '',
		gridData: [],
		description: false,
		descriptionlabel: '',
		signatureLabel: '',
		defaultSignature: '',
		signatureHeight: ''
	});
	const [toastMessage, setToastMessage] = useState<any>({ displayToast: false, message: '' });
	const [toastMessage2, setToastMessage2] = useState<any>({ displayToast: false, message1: '', message2: '' });
	const currentUser = server?.currentUserInfo?.name;
	const [submitChangeEventBtn, setSubmitChangeEventBtn] = useState<any>({ show: false, disable: true });
	const [requestQuoteFromVendorBtn, setRequestQuoteFromVendorBtn] = useState<any>({ show: false, disable: true });
	const [clientResponse, setClientResponse] = React.useState<any>({ show: false, type: '' });
	const responseTypeObj: any = { 'Accepted': 2, 'Declined': 0, 'SentBackForRevision': 1 };
	const responseTextObj: any = { 2: 'Change Event Signed & Authorized By', 0: 'Change Event Reviewed & Rejected By', 1: 'Change Event Request Sent Back for Revision By' };

	const loadData = (id: any) => {
		dispatch(getChangeEventById(id));
		dispatch(getBudgetLineItems(id));
	};

	/**
	 * All initial LID APIs will be called inside this effect
	 */
	useEffect(() => {
		// To show the grid data if GET Api fails
		if (data?.id) {
			dispatch(setChangeRequestDetails(data));
			dispatch(setCurrentChangeEventId(data.id));
			loadData(data.id);
		}
	}, [data?.id]);

	useEffect(() => {
		if (!data?.id && currentChangeEventId)
			loadData(currentChangeEventId);
	}, [currentChangeEventId]);

	useEffect(() => {
		setClientResponse({ ...clientResponse, show: ["Rejected", "Authorized", "SentBackForRevision", "Revise"]?.includes(changeRequestDetails?.status), type: responseTypeObj[changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.type] });
		if (['Draft', 'QuoteReceived'].includes(changeRequestDetails?.status)) {
			changeRequestDetails?.budgetItems?.length > 0 && setSubmitChangeEventBtn({ show: true, disable: !checkEstimatedAmount(changeRequestDetails) });
		}
		if (['Draft'].includes(changeRequestDetails?.status)) {
			if (changeRequestDetails?.budgetItems?.length > 0 && checkAtleastOneBudgetIsAssignedToVendor(changeRequestDetails)) {
				setRequestQuoteFromVendorBtn({ show: true, disable: !checkSubmitBy(changeRequestDetails) });
			}
			else setRequestQuoteFromVendorBtn({ show: false, disable: true });
		}
		if (changeRequestDetails?.status !== 'Draft') setRequestQuoteFromVendorBtn({ show: false, disable: true });
	}, [changeRequestDetails]);

	const afterItemAction = (response: any) => {
		console.log("response", response);
		if (response) {
			console.log("response123", response);
			if (modelData?.formType == 'confirmation') {
				setToastMessage({ displayToast: true, message: 'Submitted Change Event Request to the Client Successfully' });
			}
			if (modelData?.formType == 'requestquote') {
				setToastMessage({ displayToast: true, message: 'Submitted Quote Request to the Trade Successfully' });
			}
			if (modelData?.formType == 'verify') {

				if (changeRequestDetails?.fundingSource == 'ChangeOrder') {
					setToastMessage2({
						displayToast: true,
						message1: 'The Change Event update has been notified to the General Contractor',
						message2: 'Budget has been updated due to approval of the Change Event'
					});
				}
				else {
					setToastMessage2({
						displayToast: true,
						message1: 'The Change Event update has been notified to the General Contractor',
					});
				}
			}
			if (modelData?.formType == 'reject') {
				setToastMessage2({
					displayToast: true,
					message1: 'The Change Event updated has been notified to the General Contractor',
				});
			};
			if (modelData?.formType == 'revise') {
				setToastMessage2({
					displayToast: true,
					message1: 'The Change Event updated has been notified to the General Contractor',
				});
			}
			dispatch(setChangeRequestDetails(response));
		}
		dispatch(getChangeEventList());
	};

	const handleSubmit = (type: string, data: any) => {
		const requestQuotePayload = { signature: data?.signature, budgetItems: changeRequestDetails?.budgetItems?.filter((item: any) => item?.estimateSource == 'QuoteFromVendor')?.map((obj: any) => { return { id: obj?.id }; }) };
		if (type == 'submit') submitChangeEvent(currentChangeEventId, { contractOption: data?.contractOption, signature: data?.signature }, afterItemAction);
		if (type == 'requestQuote') requestQuoteFromVendor(currentChangeEventId, requestQuotePayload, afterItemAction);
		if (type == 'verifyAuthorize') authorizeByClient(currentChangeEventId, { signature: data?.signature }, afterItemAction);
		if (type == 'reject') rejectByClient(currentChangeEventId, { reason: data?.description, signature: data?.signature }, afterItemAction);
		if (type == 'revise') reviseByClient(currentChangeEventId, { reason: data?.description, signature: data?.signature }, afterItemAction);
	};

	const handleQuoteSubmit = () => {
		const payload = { budgetItems: changeRequestDetails?.budgetItems?.filter((item: any) => item?.estimateSource == 'QuoteFromVendor')?.map((obj: any) => { return { id: obj?.id, quote: { amount: obj?.quote?.amount, quantity: obj?.quote?.quantity, unitCost: obj?.quote?.unitCost } }; }) };
		submitQuoteByVendor(currentChangeEventId, payload, afterItemAction);
		setToastMessage({ displayToast: true, message: 'Quote Sent to the General Contractor Successfully' });
	};

	const tabConfig = [
		{
			tabId: 'change-Event-Details',
			label: 'Change Event Details',
			showCount: false,
			iconCls: 'common-icon-change-event-details',
			content: <ChangeEventsDetails />
		}, {
			tabId: 'budget-line-items',
			label: 'Budget Line Items',
			showCount: true,
			count: changeRequestDetails?.budgetItems?.length,
			iconCls: 'common-icon-smartapptype',
			content: <BudgetLineItem />
		}, {
			tabId: 'reference-files',
			label: 'Reference Files',
			showCount: referenceFiles?.length > 0,
			count: referenceFiles?.length,
			iconCls: 'common-icon-referance',
			content: <ReferenceFiles />
		}, {
			tabId: 'links',
			label: 'Links',
			showCount: false,
			showTab: !['Draft', 'QuoteReceived', 'AwaitingTradeQuote', 'AwaitingQuote', 'QuoteSent']?.includes(changeRequestDetails?.status),
			count: linksGridData?.length,
			iconCls: 'common-icon-Links',
			disabled: false,
			content: <Links />
		}
	];

	const HeaderContentUpdate = useMemo(() => {
		return HeaderContent;
	}, [changeRequestDetails]);

	useEffect(() => {
		if (toastMessage?.displayToast == true) {
			setTimeout(() => {
				setToastMessage({ displayToast: false, message: '' });
			}, 3000);
		}
	}, [toastMessage]);
	useEffect(() => {
		if (toastMessage2?.displayToast == true) {
			setTimeout(() => {
				setToastMessage2({ displayToast: false, message1: '', message2: '' });
			}, 3000);
		}
	}, [toastMessage2]);

	const lidProps = {
		title: <TextField className='textField' variant='outlined' value={changeRequestDetails?.name} size='small' margin='normal' style={{ width: '40%' }} />,
		defaultTabId: 'change-Event-Details',
		tabPadValue: 10,
		headContent: {
			showCollapsed: true,
			regularContent: <HeaderContentUpdate />,
			collapsibleContent: <CollapseContent />
		},
		tabs: tabConfig,
		footer: {
			rightNode: <>
				{(isChangeEventGC() && requestQuoteFromVendorBtn?.show)
					&& <IQButton
						className='ce-buttons'
						color='blue'
						disabled={requestQuoteFromVendorBtn?.disable}
						onClick={() => { submitClickEvent('requestquote'); }}
					>
						REQUEST QUOTE FROM VENDOR
					</IQButton>
				}
				{(isChangeEventClient() && changeRequestDetails?.status === 'AwaitingAcceptance')
					&& <IQButton
						className='ce-buttons reject'
						color='lightGrey'
						disabled={false}
						onClick={() => submitClickEvent('reject')}
					>
						REJECT
					</IQButton>}
				{((isChangeEventClient() && changeRequestDetails?.status === 'AwaitingAcceptance') || ((isChangeEventGC() && ['Revise', 'Rejected'].includes(changeRequestDetails?.status))))
					&& <IQButton
						className={changeRequestDetails?.status == 'Rejected' || changeRequestDetails?.status == 'Revise' ? 'ce-buttons revise-resubmit-contained' : 'ce-buttons revise-resubmit'}
						color='blue'
						disabled={changeRequestDetails?.status == 'Rejected' && changeRequestDetails?.fundingSource === 'ChangeOrder' ? true : false}
						//variant={changeRequestDetails?.status == 'Rejected' || changeRequestDetails?.status == 'Revise' ? 'contained' : 'outlined'}
						onClick={() => submitClickEvent('revise')}
					>
						REVISE & RESUBMIT
					</IQButton>
				}
				{
					(isChangeEventClient() && changeRequestDetails?.status === 'AwaitingAcceptance')
					&& <IQButton
						className='ce-buttons authorize'
						color='blue'
						disabled={false}
						onClick={() => { submitClickEvent('authorize'); }}
					>
						AUTHORIZE
					</IQButton>
				}
				{
					(isChangeEventGC() && !requestQuoteFromVendorBtn?.show && ['Draft', 'QuoteReceived'].includes(changeRequestDetails?.status))
					&& <IQButton
						className='ce-buttons'
						color='blue'
						disabled={submitChangeEventBtn?.disable}
						onClick={() => { submitClickEvent('submitChangeEvent'); }}
					>
						SUBMIT CHANGE EVENT
					</IQButton>
				}
				{
					(isChangeEventSC() && changeRequestDetails?.status === 'AwaitingQuote')
					&& <IQButton
						className='ce-buttons'
						color='blue'
						disabled={!checkSubmitEnable(changeRequestDetails)}
						onClick={() => { handleQuoteSubmit(); }}
					>
						SUBMIT
					</IQButton>
				}
			</>,
			leftNode: <>
				{
					clientResponse?.show && <ContractorResponse
						text={responseTextObj?.[clientResponse?.type]}
						contractorName={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.by?.displayName}
						respondedOn={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.on}
						responseType={clientResponse?.type}
						reason={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.reason}
						sign={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.signature}
						thumbNailImg={changeRequestDetails?.responses?.[changeRequestDetails?.responses?.length - 1]?.by?.image?.downloadUrl}
					/>
				}
			</>,
			toast: <>
				{toastMessage.displayToast ? <Toast message={toastMessage.message} interval={3000} /> : null}
				{toastMessage2.displayToast && <SUIToast2
					message1={toastMessage2.message1}
					message2={toastMessage2.message2}
					showclose={true}
				/>}
			</>
		},
		appInfo: appInfo,
		iFrameId: "changeEventRequestIframe",
		appType: "ChangeEventRequests",
		isFromHelpIcon: true,
		presenceProps: {
			presenceId: 'ChangeEventRequests-LineItem-presence',
			showLiveSupport: true,
			showPrint: true,
			showLiveLink: false,
			showStreams: true,
			showComments: false,
			showChat: false,
			hideProfile: false
		},
		data: changeRequestDetails,
	};

	const UpdateChangeRequestDetailsData = (data: any) => {
		if (data?.length > 0) {
			let finalData = data.map((item: any) => ({
				...item,
				vendorDetails: {
					name: item?.vendorContract?.vendor?.name || '',
					image: item?.vendorContract?.vendor?.image || '',
					pointOfContacts: item?.vendorContract?.vendor?.pointOfContacts || {}
				},
				estimatedAmount: item?.estimate?.amount ? item?.estimate?.amount : null,
				revisedAmount: item?.estimate?.amount ?
					((item?.estimate?.amount?.replaceAll ? Number(item?.estimate?.amount) : item?.estimate?.amount)
						+ ((item?.contractAmount.replaceAll ? Number(item?.contractAmount) : item?.contractAmount))) : null
			}));
			return finalData;
		}
	};

	const submitClickEvent = (type: any) => {
		if (type == 'submitChangeEvent') {
			dispatch(setConfirmationBudgetList(UpdateChangeRequestDetailsData(changeRequestDetails?.budgetItems || [])));
			setModelData({
				type: 'submit',
				label: 'Confirmation',
				buttonLabel: 'SUBMIT',
				formType: 'confirmation',
				checkBoxUserName: currentUser,
				checkboxdesc: 'would like to send the Change Event Requests to the Client for an approval.',
				gridData: UpdateChangeRequestDetailsData(changeRequestDetails?.budgetItems ? changeRequestDetails?.budgetItems : []),
				signatureLabel: 'General Contractor Signature',
				modelWidth: '65em',
				modelHeight: '45em',
				signatureHeight: 100
			});
		}
		else if (type == 'reject') {
			setModelData({
				type: 'reject',
				label: 'Reject Change Event Request',
				buttonLabel: 'REJECT',
				formType: 'reject',
				checkBoxUserName: currentUser,
				checkboxdesc: 'reviewed the Change Event Request in detail and decided not proceed with the proposed Change Event Request',
				description: true,
				modelWidth: '27em',
				modelHeight: '42em',
				descriptionlabel: 'Reason for Rejecting the Change Event',
				signatureLabel: 'Signature',
				signatureHeight: 160
			});
		}
		else if (type == 'revise') {
			if (changeRequestDetails?.status == 'Rejected' || changeRequestDetails?.status == 'Revise') {
				dispatch(setConfirmationBudgetList(UpdateChangeRequestDetailsData(changeRequestDetails?.budgetItems || [])));
				setModelData({
					type: 'submit',
					label: 'Confirmation',
					buttonLabel: 'SUBMIT',
					formType: 'revise',
					checkBoxUserName: currentUser,
					checkboxdesc: 'would like to send the Change Event Requests to the Client for an approval.',
					gridData: UpdateChangeRequestDetailsData(changeRequestDetails?.budgetItems ? changeRequestDetails?.budgetItems : []),
					signatureLabel: 'General Contractor Signature',
					modelWidth: '58em',
					modelHeight: '42em',
					signatureHeight: 100
				});
			}
			else {
				setModelData({
					type: 'revise',
					label: 'Revise & Resubmit Change Event Request',
					buttonLabel: 'SUBMIT',
					formType: 'revise',
					checkBoxUserName: currentUser,
					checkboxdesc: 'reviewed the Change Event Request in detail and would like to make some changes detailed the above reason.',
					description: true,
					modelWidth: '27em',
					modelHeight: '42em',
					descriptionlabel: 'Reason for sending back the Change Event',
					signatureLabel: 'Signature',
					signatureHeight: 170
				});
			}
		}
		else if (type == 'requestquote') {
			dispatch(setConfirmationBudgetList(UpdateChangeRequestDetailsData(changeRequestDetails?.budgetItems?.filter((item: any) => item?.estimateSource == 'QuoteFromVendor'))));
			setModelData({
				type: 'requestQuote',
				label: 'Confirmation',
				buttonLabel: 'SUBMIT',
				formType: 'requestquote',
				checkBoxUserName: currentUser,
				checkboxdesc: 'Would like to Request a Quote from Trade for the above listed Work Item(s).',
				gridData: changeRequestDetails?.budgetItems?.filter((item: any) => item?.estimateSource == 'QuoteFromVendor'),
				signatureLabel: 'General Contractor Signature',
				modelWidth: '58em',
				modelHeight: '42em',
				signatureHeight: 100
			});
		}
		else {
			try {
				dispatch(setConfirmationBudgetList(UpdateChangeRequestDetailsData(changeRequestDetails?.budgetItems ? changeRequestDetails?.budgetItems : [])));
				dispatch(setConfirmationGCSign(changeRequestDetails.submitted.signature));
				setModelData({
					type: 'verifyAuthorize',
					label: 'Verify & Authorize',
					buttonLabel: 'AUTHORIZE',
					formType: 'verify',
					checkBoxUserName: currentUser,
					checkboxdesc: 'reviewed the Change Event Request in detail and I acknowledge & Authorize the Budget for all the Work Items to get Updated.',
					gridData: UpdateChangeRequestDetailsData(changeRequestDetails?.budgetItems ? changeRequestDetails?.budgetItems : []),
					modelWidth: '65em',
					modelHeight: '45em',
					defaultSignature: 'ssss'
				});
			} catch (e) { console.log(e); }
		}
		setOpenModel(true);
	};

	const onConfimationModalClose = useCallback(() => {
		setOpenModel(false);
		dispatch(setConfirmationBudgetList([]));
		dispatch(setConfirmationGCSign(''));
	}, []);

	const onSubmitAction = (type: string, data: any) => {
		onConfimationModalClose();
		handleSubmit(type, data);
	};

	return (
		<div className='change-event-lineitem-detail'>
			<IQGridLID {...lidProps} {...props} />
			{openModel &&
				<Confirmation open
					type={modelData.type}
					itemStatus={changeRequestDetails?.status}
					contractOption={changeRequestDetails?.contractOption}
					fundingSource={changeRequestDetails?.fundingSource}
					onClose={onConfimationModalClose}
					onCancel={onConfimationModalClose}
					onSubmitRequest={onSubmitAction}
					onAuthorize={onSubmitAction}
					showTitleMessage={
						((modelData?.formType == 'revise' && changeRequestDetails?.status == 'Rejected')
							|| (modelData?.formType == 'verify' && changeRequestDetails?.fundingSource == 'GeneralContractor')
							|| (modelData?.formType == 'confirmation' && changeRequestDetails?.fundingSource == 'GeneralContractor'))
					}
				/>
			}
			{contractDialog?.show && <ContractSignModal
				open={contractDialog?.show}
				formType={contractDialog?.type}
				userName={appInfo?.currentUserInfo?.name}
				onModalClose={() => { setContractDialog({ ...contractDialog, show: false }); }}
				onSubmit={(value: any) => { console.log('vaue', value); }}
			></ContractSignModal>}
		</div >
	);
});

const HeaderContent = memo((props: any) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { changeRequestDetails } = useAppSelector(state => state.changeEventRequest);
	const { connectors } = useAppSelector((state) => state.gridData);

	const [stateObject, setStateObject] = useState<any>({});

	useEffect(() => {
		const state = stateMap[changeRequestDetails?.status];
		setStateObject(state);
	}, [changeRequestDetails?.status]);

	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				{/* <span className='budgetid-label grey-font'>Change Order ID:</span>
				<span className='grey-fontt'>{changeRequestDetails?.code || ''}</span> */}
				<span className='budgetid-label grey-font'>Change Order ID:</span>		
					<span className='changevent-content'>
						<span className='grey-fontt'>{changeRequestDetails?.code || ''}</span>
							{connectors?.length && changeRequestDetails?.connectorItemData ? <img
								className="sapnumber"
								src={connectorImages?.[changeRequestDetails?.connectorItemData?.type]}
								alt="connector Image"
							/> : ''}
							{connectors?.length && changeRequestDetails?.connectorItemData ? <span className='sapnumber hot-link' onClick={()=>{changeRequestDetails?.connectorItemData?.url && window.open(changeRequestDetails?.connectorItemData?.url)}}>{changeRequestDetails?.connectorItemData?.name}</span> : ''}
				</span>
				<span className='budgetid-label grey-font'>Status:</span>
				<span className='status-pill' style={{ backgroundColor: stateObject?.lightColor, color: stateObject?.bgColor }}>
					<span className={`status ${stateObject?.icon}`}></span>{stateObject?.text}
				</span>
				<span className='last-modified-label grey-font'>Last Modified:</span>
				<span className='grey-fontt'>{changeRequestDetails?.modifiedOn && stringToUSDateTime2(changeRequestDetails?.modifiedOn)} by {changeRequestDetails?.modifiedBy?.displayName && changeRequestDetails?.modifiedBy?.displayName}</span>
			</div>
			{!isChangeEventSC() && <span className='kpi-right-container'>
				<span className='kpi-name' >Estimated Change Event Amount  <span className='bold'>{currencySymbol}</span></span>
				<span className='amount' style={{ backgroundColor: '#c9e59f' }}>{changeRequestDetails?.estimatedAmount && amountFormatWithOutSymbol(changeRequestDetails?.estimatedAmount)}</span>
			</span>}
		</div>
	</div>;
});

const CollapseContent = memo((props: any) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { changeRequestDetails } = useAppSelector(state => state.changeEventRequest);
	const [stateObject, setStateObject] = useState<any>({});

	useEffect(() => {
		const state = stateMap[changeRequestDetails.status];
		setStateObject(state);
	}, [changeRequestDetails.status]);

	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				<span className='budgetid-label grey-font'>Status:</span>
				<span className='status-pill' style={{ backgroundColor: stateObject?.lightColor, color: stateObject?.bgColor }}>
					<span className={`status ${stateObject?.icon}`}></span>{stateObject?.text}
				</span>
			</div>
			{!isChangeEventSC() && <span className='kpi-right-container'>
				<span className='kpi-name' >Estimated Change Event Amount  <span className='bold'>{currencySymbol}</span></span>
				<span className='amount' style={{ backgroundColor: '#c9e59f' }}>{changeRequestDetails?.estimatedAmount && amountFormatWithOutSymbol(changeRequestDetails?.estimatedAmount)}</span>
			</span>}
		</div>
	</div>;
});

export default ChangeEventRequestsLID;