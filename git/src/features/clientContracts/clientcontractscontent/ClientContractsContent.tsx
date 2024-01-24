import React, {useMemo, useState} from 'react';
import {Box, Stack, IconButton, Alert} from '@mui/material';
import {ExpandMore, ExpandLess, PushPinOutlined as PushPin, KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';
import {useAppSelector, useAppDispatch} from 'app/hooks';
import './ClientContractsContent.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import {postMessage} from 'app/utils';
import {getServer} from 'app/common/appInfoSlice';
import IQButton from 'components/iqbutton/IQButton';
import {getShowLineItemDetails, setSelectedNode, setSelectedRecord, setShowLineItemDetails, getClientCompanies, getClientContractDetails, getMinMaxDrawerStatus, setMinMaxDrawerStatus} from '../stores/ClientContractsSlice';
import ClientContractsForm from './clientcontractsform/ClientContractsForm';
import ClientContractsToolbar from './clientcontractstoolbar/ClientContractsToolbar';
import ClientContractsGrid from './clientcontractsgrid/ClientContractsGrid';
import ClientContractsLineItem from '../clientcontractsdetails/ClientContractsLineItem';
import ContractSignModal from 'sui-components/ContractSignModal/ContractSignModal';
import {ContractorResponse} from 'features/vendorcontracts/vendorcontractsdetails/ContractorResponse/ContractorResponse';
import {getClientContractsList} from '../stores/gridSlice';
import CommittedTransaction from '../clientcontractsdetails/tabs/transactions/CCCommittedTransaction';
import ForecastTransactions from '../clientcontractsdetails/tabs/forecast/ForecastTransactions';
import PaymentLedger from '../clientcontractsdetails/tabs/paymentledger/CCPaymentLedger';
import {acceptContract, activateClientContract, cancelAndLockContract, declineContract, lockAndPostContract, reviseContract, unLockContract} from '../stores/CCButtonActionsAPI';
import {getToastMessage} from 'features/clientContracts/stores/ClientContractsSlice';
import SUIAlert from 'sui-components/Alert/Alert';
import Toast from 'components/toast/Toast';
import {isUserGCForCC} from '../utils';
import {SUIToast} from 'sui-components/Toast/Suitoast';
import {getCCChangeEventsList} from 'features/clientContracts/stores/CCChangeEventsSlice';
import {fetchSettings} from 'features/budgetmanager/operations/settingsSlice';
import {blockchainStates, setShowBlockchainDialog} from 'app/common/blockchain/BlockchainSlice';

const ClientContractsContent = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const {selectedNode, selectedRecord, enablePostAndLockBtn} = useAppSelector((state) => state.clientContracts);

	// Redux state extraction
	const showRightPanel = useAppSelector(getShowLineItemDetails);
	const {unLockedSov} = useAppSelector((state) => state.cCBillingSchedule);


	// State declarations
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [showLeftButton, setShowLeftButton] = useState(false);
	const [showRightButton, setShowRightButton] = useState(false);
	const [api, setApi] = React.useState<any>('');
	const [lockContract, setLockAndPostContract] = React.useState<any>({show: false, disable: true});
	const [unlockContract, setUnlockContract] = React.useState<any>({show: false, disable: false});
	const [cancelAndLock, setCancelAndLock] = React.useState<any>({show: false, disable: false});
	const [postChangeAndLock, setPostChangeAndLock] = React.useState<any>({show: false, disable: false});
	const [contractDialog, setContractDialog] = React.useState<any>({show: false, type: ''});
	const [contractorResponse, setContractorResponse] = React.useState<any>({show: false, type: ''});
	const minMaxStatus: any = useAppSelector(getMinMaxDrawerStatus);
	const [showAlert, setShowAlert] = React.useState<any>({show: false, message: '', type: ''});
	const [toast, setToast] = React.useState<any>({show: false, message: ''});
	const [toastMessage, setToastMessage] = React.useState<any>({displayToast: false, message: ''});
	const [showLockSuccessMsg, setShowLockSuccessMsg] = React.useState<any>({show: false, msg1: '', msg: 2});

	const [SCActions, setSCActions] = React.useState<any>({show: false, decline: {show: true, disable: false}, revise: {show: true, disable: false}, accept: {show: true, disable: false}});

	const minimizeIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-minimize' style={{fontSize: '1.25rem'}}></div>;
	}, []);
	const responseTypeObj: any = {'Accepted': 2, 'Declined': 0, 'SentBackForRevision': 1, 'LockedAndPosted': 2};
	const showToastMessage = useAppSelector(getToastMessage);
	const {blockchainEnabled} = useAppSelector((state) => state.blockchain);

	React.useEffect(() => {
		setTimeout(() => {
			setToastMessage({displayToast: false, message: ''});
		}, 3000);
		setToastMessage({...showToastMessage});
	}, [showToastMessage]);

	React.useEffect(() => {
		if(toast.show == true) {
			setTimeout(() => {
				setToast({show: false, message: " "});
			}, 3000);
		}
	}, [toast]);

	React.useEffect(() => {
		dispatch(getCCChangeEventsList({appInfo: appInfo, id: selectedRecord?.id}));
		dispatch(fetchSettings(appInfo));
	}, [selectedRecord]);


	// Effect definitions
	React.useEffect(() => {
		// dispatch(fetchBudgetLineItems(appInfo));
		// dispatch(fetchGridData(appInfo));
		dispatch(getClientCompanies(appInfo));
		dispatch(getClientContractsList(appInfo));
		// dispatch(fetchTeammembersByProject(appInfo));

	}, []);
	React.useEffect(() => {
		if(unLockedSov) {
			setToast({show: true, message: "You are now allowed to change the Schedule of Values for the selected Work Item"});
		}
		else {
			setToast({show: false, message: " "});
		}
	}, [unLockedSov]);

	React.useEffect(() => {
		if(showLockSuccessMsg?.show) {
			setTimeout(() => {
				setShowLockSuccessMsg({show: false, msg1: "", msg2: ""});
			}, 5000);
		}
	}, [showLockSuccessMsg]);


	React.useEffect(() => {
		if(Object.keys(appInfo)?.length) {
			setContractorResponse({...contractorResponse, show: ["Declined", "Active", "SentBackForRevision"]?.includes(selectedRecord?.status), type: responseTypeObj[selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.type]});
			if(isUserGCForCC(appInfo)) {
				['AwaitingAcceptance', 'Active', 'SentBackForRevision', 'ActivePendingSOVUpdate'].includes(selectedRecord?.status) ? setUnlockContract({show: true, disable: false}) : setUnlockContract({show: false, disable: false});
				// ['Draft', 'ReadyToSubmit'].includes(selectedRecord?.status) ? setLockAndPostContract({ show: true, disable: selectedRecord?.status == 'Draft' || selectedRecord?.contingencyAmount > selectedRecord?.totalAmount || selectedRecord?.feeAmount > selectedRecord?.totalAmount || selectedRecord?.downPaymentAmount > selectedRecord?.totalAmount ? true : false }) : setLockAndPostContract({ show: false, disable: false });
				if(['ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status)) {
					setCancelAndLock({show: true, disable: false});
					// setPostChangeAndLock({ show: true, disable: selectedRecord?.billingSchedule?.status == 'Completed' ? false : true })
				}
				else {
					setCancelAndLock({show: false, disable: false});
					// setSaveChanges({ show: false, disable: false });
					// setPostChangeAndLock({ show: false, disable: false });
				}
				['Draft', 'ReadyToSubmit', 'ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status) ? setLockAndPostContract({show: true, disable: selectedRecord?.status == 'Draft' || selectedRecord?.contingencyAmount > selectedRecord?.totalAmount || selectedRecord?.feeAmount > selectedRecord?.totalAmount || selectedRecord?.downPaymentAmount > selectedRecord?.totalAmount ? true : selectedRecord?.billingSchedule?.status == 'Completed' ? false : true}) : setLockAndPostContract({show: false, disable: false});
			}
			else {
				if(['AwaitingAcceptance'].includes(selectedRecord?.status)) {setSCActions({...SCActions, show: true}); setContractorResponse({...contractorResponse, show: false});}
				else {
					setSCActions({...SCActions, show: false});
					// setContractorResponse({ ...contractorResponse, show: ["Declined", "Active", "SentBackForRevision"]?.includes(selectedRecord?.status),  type: responseTypeObj[selectedRecord?.responses?.[selectedRecord?.responses?.length -1]?.type] }) 
				}
			}
		}
	}, [selectedRecord, appInfo]);

	React.useEffect(() => {
		enablePostAndLockBtn && setPostChangeAndLock({show: selectedRecord != 'ReadyToSubmit' ? true : false, disable: selectedRecord?.billingSchedule?.status == 'Completed' ? false : true});
	}, [enablePostAndLockBtn]);

	React.useEffect(() => {
		setShowLeftButton(selectedNode?.firstChild ? true : false);
		setShowRightButton(selectedNode?.lastChild ? true : false);
	}, [selectedNode]);


	const handleRef = (ref: any) => {
		setApi(ref.current.api);
	};

	const handleLeftArrow = () => {
		api.forEachNode(function (node: any) {
			if(selectedNode?.rowIndex - 1 === node.rowIndex && node?.data !== undefined) {
				node.setSelected(true, true);
				dispatch(setSelectedRecord(node?.data));
				dispatch(setSelectedNode(node));
				dispatch(getClientContractDetails({appInfo: appInfo, contractId: node?.data?.id}));

			}
		});
	};
	const handleRightArrow = () => {
		api.forEachNode(function (node: any) {
			if(selectedNode?.rowIndex + 1 === node?.rowIndex) {
				node.setSelected(true, true);
				dispatch(setSelectedRecord(node?.data));
				dispatch(setSelectedNode(node));
				dispatch(getClientContractDetails({appInfo: appInfo, contractId: node?.data?.id}));

			}
		});
	};
	const onMinimizeDrawer = () => {
		dispatch(setMinMaxDrawerStatus({minMax: false, forecast: false, transactions: false}));
	};
	const handleLockAndPostContractAction = () => {
		["AwaitingAcceptanceUnlocked", "ActiveUnlocked", "ActiveUnlockedPendingSOVUpdate"]?.includes(selectedRecord?.status) ? handlePostChangeAndLockAction('lock')
			: setShowAlert({
				show: true, type: 'lock', message:
					<div>
						<span>Are you sure you want to Lock & Post the Contract?</span> <br /><br /><br />
						<span>By doing so, the contract will become Active immediately and the Client will be able to see the contract Active.</span>
					</div>
			});
		// lockAndPostContract(appInfo, selectedRecord?.id, afterItemAction);
	};
	const handleRoutForApproval = () => {
		["AwaitingAcceptanceUnlocked", "ActiveUnlocked", "ActiveUnlockedPendingSOVUpdate"]?.includes(selectedRecord?.status) ? handlePostChangeAndLockAction('route')
			: setShowAlert({
				show: true, type: 'route', message:
					<div>
						<span>Are you sure you want to Route & Post the contract?</span> <br /><br /><br />
						<span>By doing so, the contract will be Routed to the Client and has to be signed & acknowledged.</span>
					</div>
			});
	};

	const handlePostChangeAndLockAction = (type: any) => {
		setShowAlert({
			show: true, type: type, message:
				<span>The changes made to the contract will be posted as a new change event and notified to the vendor.<br /><br /> Would you like to go ahead and re post the contract?</span>
		});
		// dispatch(setPostAndLockResponseClick(true));
	};

	const handleUnlock = () => {
		if(selectedRecord?.status == 'Active' || selectedRecord?.status == 'ActivePendingSOVUpdate') {
			setShowAlert({
				show: true, type: 'unlock', message:
					<span>Unlocking the contract allows you to make modifications to it. Any changes made will create a new change order and will be notified to the vendor on reposting the contract.<br /><br /> Are you sure you want to continue?</span>
			});
		}
		else unLockContract(appInfo, selectedRecord?.id, afterItemAction);
	};
	const handleCancelAndLock = () => {
		setShowAlert({
			show: true, type: 'cancel', message:
				<span>Cancel & Lock will revert the contract back to the active state without any changes<br /><br /> Are you sure you want to continue?</span>
		});
	};

	const afterItemAction = (response: any) => {
		if(response) {
			dispatch(setSelectedRecord(response));
			!isUserGCForCC(appInfo) && setToast({show: true, message: 'Contract Status has been updated and notified the response to the Contract Manager'});
		}
		dispatch(getClientContractsList(appInfo));

		// dispatch(getContractDetailsById({ appInfo: appInfo, id: selectedRecord?.id }));
	};
	const handleContractorResponse = (response: any) => {
		console.log("response", response);
		const payload = {reason: response?.reason, signature: response?.signature};
		response?.type == 'decline' ? declineContract(appInfo, selectedRecord?.id, payload, afterItemAction)
			: response?.type == 'revise' ? reviseContract(appInfo, selectedRecord?.id, payload, afterItemAction) : acceptContract(appInfo, selectedRecord?.id, {signature: response?.signature}, afterItemAction);
		setContractDialog({...contractDialog, show: false});
		if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
			dispatch(setShowBlockchainDialog(true));
		}
	};
	const handleAlert = (type: string) => {
		if(type == 'yes') {
			showAlert?.type == 'cancel' && cancelAndLockContract(appInfo, selectedRecord?.id, afterItemAction);
			if(showAlert?.type == 'lock') {
				activateClientContract(appInfo, selectedRecord?.id, afterItemAction);
				if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
					dispatch(setShowBlockchainDialog(true));
				} else {
					setShowLockSuccessMsg({show: true, msg1: 'Posted Contract and Locked.', msg2: 'Notified the response to the Client.'});
				}
			}
			if(showAlert?.type == 'route') {
				lockAndPostContract(appInfo, selectedRecord?.id, afterItemAction);
				if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
					dispatch(setShowBlockchainDialog(true));
				} else {
					setShowLockSuccessMsg({show: true, msg1: 'Contract Routed, Posted and Locked.', msg2: 'Notified the response to the Client.'});
				}
			}
			if(showAlert?.type == 'unlock') {
				unLockContract(appInfo, selectedRecord?.id, afterItemAction);
				setToast({show: true, message: "Contract Unlocked. Changes made in the contracts will be notified to the Vendor on click of Post Change & Lock"});
			}
			setShowAlert({show: false, message: '', type: ''});

		} else {
			setShowAlert({show: false, message: '', type: ''});
		}

	};
	const rightPanelClose = () => {
		dispatch(setShowLineItemDetails(false));
		postMessage({
			event: "help",
			body: {iframeId: "clientContractsIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "ClientContracts", isFromHelpIcon: false}
		});
	};

	const disableBlockchainActionButtons = (blockchainEnabled && blockchainStates.indexOf(selectedRecord?.blockChainStatus) === -1);

	return <>
		<Box className='bid-manager-content'>
			{isUserGCForCC(appInfo) ?
				<div className='collapsible-section'>
					{collapsed === false ? <div className='bid-lineitem-form-box'>
						<p className='bid-lineitem-form-title'>Create New Client Contract</p>
						<ClientContractsForm />
					</div> : ''}
					<div className={`header-buttons-container${collapsed === true ? ' abs-position' : ''}`}>
						<IconButton className={`header-button`} aria-label={collapsed === true ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(pCollapsed => !pCollapsed)}>
							{collapsed === true ? <ExpandMore fontSize='small' /> : <ExpandLess fontSize='small' />}
						</IconButton>
						{!collapsed && <IconButton className={`header-button ${pinned === true ? 'btn-focused' : ''}`} aria-label={pinned === true ? 'Pinned' : 'Not Pinned'} onClick={() => setPinned(pPinned => !pPinned)}>
							{<PushPin fontSize='small' className={`pin ${pinned === true ? 'focused' : ''}`} {...(pinned === true ? {color: 'primary'} : {})} />}
						</IconButton>}
					</div>
				</div>
				: ''}
			<div className='bid-manager-grid-box'>
				<ClientContractsToolbar />
				<ClientContractsGrid onRefChange={(ref: any) => handleRef(ref)} />
				{toastMessage?.displayToast && <Toast message={toastMessage.message} interval={3000} />}
			</div>
		</Box>
		{/* showRightPanel */}
		{showRightPanel && (
			<SUIDrawer
				className='client-contract-lid'
				PaperProps={{style: {position: 'absolute', minWidth: '60em', width: '65vw', borderRadius: '0.5em', boxShadow: '-2px 1px 8px #0000001a'}}}
				anchor='right'
				variant='permanent'
				elevation={8}
				open={false}
			>
				<Stack className='rightpanel-content-section'>
					<ClientContractsLineItem close={() => {rightPanelClose();}} showBCInfo={disableBlockchainActionButtons} />
				</Stack>
				{selectedRecord?.status == 'ActivePendingSOVUpdate' && isUserGCForCC(appInfo) && <SUIToast
					message={
						<div className='message-content'>
							<p>Due to the recent Change Event approval, the Schedule of Values for this</p>
							<p>Contract needs to be updated.
								{/* <a onClick={() => window.open(useHotLink(`change-event-requests/home?id=${selectedRecord?.id}`), '_blank')}>CER001</a>\ */}
							</p>
							{/* <p>Original Contract Amount: <b>$200,000</b></p>
							<p>Change Order Amount: <b className='bold-oa'>$62,000</b></p> */}
						</div>
					}
					showclose={true} />
				}
				<Stack direction='row' className='rightpanel-footer'>
					{
						<Stack direction='row' spacing={3}>
							<IQTooltip title='Previous Record' placement={'top'} arrow>
								<IconButton
									aria-label='Fullscreen control'
									className='footer-icons'
									size='small'
									disabled={showLeftButton}
									onClick={handleLeftArrow}
								>
									<KeyboardArrowLeft />
								</IconButton>
							</IQTooltip>
							<IQTooltip title='Next Record' placement={'top'} arrow>
								<IconButton
									aria-label='Close Right Pane'
									className='footer-icons'
									size='small'
									disabled={showRightButton}
									onClick={handleRightArrow}
								>
									<KeyboardArrowRight />
								</IconButton>
							</IQTooltip>
						</Stack>
					}
					{
						contractorResponse?.show && selectedRecord?.responses && < ContractorResponse contractorName={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.by?.displayName} respondedOn={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.date} responseType={contractorResponse?.type} reason={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.reason} sign={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.signature}
							thumbNailImg={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.by?.image?.downloadUrl}
							text={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.type == 'LockedAndPosted' ? 'Contract Locked & Posted By' : null}
						/>
					}
					<div className='footer-button-container'>
						{
							cancelAndLock?.show && <IQButton
								disabled={cancelAndLock?.disable || disableBlockchainActionButtons}
								className='btn-cancel-contract'
								color="inherit"
								onClick={handleCancelAndLock}
							>
								CANCEL
							</IQButton>
						}
						{
							lockContract?.show && <IQButton
								disabled={lockContract?.disable || disableBlockchainActionButtons}
								className='btn-post-contract lock-post-btn'
								variant={'outlined'}
								onClick={handleLockAndPostContractAction}
							>
								LOCK & POST CONTRACT
							</IQButton>
						}

						{
							unlockContract?.show && <IQButton
								disabled={unlockContract?.disable || disableBlockchainActionButtons}
								className='btn-post-contract'
								onClick={handleUnlock}
							>
								UNLOCK CONTRACT
							</IQButton>
						}

						{/* {
							postChangeAndLock?.show && <IQButton
								disabled={postChangeAndLock?.disable}
								className='btn-post-contract'
								onClick={handlePostChangeAndLockAction}
							>
								POST CHANGE & LOCK
							</IQButton>
						} */}
						{
							lockContract?.show && <IQButton
								disabled={lockContract?.disable || disableBlockchainActionButtons}
								className='btn-post-contract'
								onClick={handleRoutForApproval}
							>
								ROUTE FOR APPROVAL
							</IQButton>
						}
						{
							SCActions?.show && <>
								{
									SCActions?.decline?.show && <IQButton
										disabled={SCActions?.decline?.disable || disableBlockchainActionButtons}
										className='btn-cancel-contract'
										onClick={() => setContractDialog({show: true, type: 'decline'})}
									>
										DECLINE CONTRACT
									</IQButton>
								}
								{
									SCActions?.revise?.show && <IQButton
										disabled={SCActions?.revise?.disable || disableBlockchainActionButtons}
										className='btn-save-changes'
										variant="outlined"
										onClick={() => setContractDialog({show: true, type: 'revise'})}
									>
										REVISE & RESUBMIT
									</IQButton>
								}
								{
									SCActions?.accept?.show && <IQButton
										disabled={SCActions?.accept?.disable || disableBlockchainActionButtons}
										className='btn-post-contract'
										onClick={() => setContractDialog({show: true, type: 'sign'})}
									>
										SIGN & ACCEPT CONTRACT
									</IQButton>
								}
							</>
						}
						{
							!isUserGCForCC(appInfo) && selectedRecord?.status == 'OnHold' && <div className="estimated-bid-cls">
								<span className="common-icon-Pause"></span><span className="text">You will not be able to take any action, as the contract is being revised by the Creator. You will be notified once updated.</span></div>
						}

					</div>
				</Stack>
				{contractDialog?.show && <ContractSignModal
					open={contractDialog?.show}
					formType={contractDialog?.type}
					userName={appInfo?.currentUserInfo?.name}
					onModalClose={() => {setContractDialog({...contractDialog, show: false});}}
					onSubmit={(value: any) => {handleContractorResponse(value);}}
				></ContractSignModal>}
				{
					showAlert?.show && <SUIAlert
						open={showAlert?.show}
						onClose={() => {
							setShowAlert({show: false, message: ''});
						}}
						DailogClose={true}
						contentText={
							showAlert?.message
						}
						title={'Confirmation'}
						onAction={(e: any, type: string) => handleAlert(type)}
						showActions={true}
						modelWidth={'610px'}
					/>
				}
				{
					toast?.show && <Toast message={toast.message} interval={5000} />
				}
				{
					showLockSuccessMsg?.show && <Alert severity="success" className='floating-toast-cls' onClose={() => {setShowLockSuccessMsg({show: false, msg1: '', msg: 2});}}>
						<span className="toast-text-cls toast-line-cls">
							<b>1</b>{showLockSuccessMsg?.msg1}</span>
						<span className="toast-text-cls toast-line-cls">
							<b>2</b>{showLockSuccessMsg?.msg2}</span>
					</Alert>
				}
			</SUIDrawer>
		)}

		{minMaxStatus.minMax && (<SUIDrawer
			className='forecast-drawer-container'
			PaperProps={{style: {position: 'absolute', minWidth: '60em', width: '65vw', borderRadius: '0.5em', boxShadow: '-2px 1px 8px #0000001a', padding: '5px 15px'}}}
			anchor='right'
			variant='permanent'
			elevation={8}
			open={false}
		>
			<span onClick={onMinimizeDrawer} style={{marginLeft: 'auto', cursor: 'pointer'}}> {minimizeIcon}</span>
			{minMaxStatus.forecast && (<ForecastTransactions />)}
			{minMaxStatus.transactions && (< CommittedTransaction />)}
			{minMaxStatus.paymentLedger && (< PaymentLedger />)}
		</SUIDrawer>)}
	</>;
};

export default ClientContractsContent;