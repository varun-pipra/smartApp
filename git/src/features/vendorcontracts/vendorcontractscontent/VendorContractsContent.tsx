import React, {useMemo, useRef, useState} from 'react';
import {Box, Stack, IconButton, Alert} from '@mui/material';
import {ExpandMore, ExpandLess, PushPinOutlined as PushPin, KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';
import {useAppSelector, useAppDispatch} from 'app/hooks';
import {postMessage} from 'app/utils';
import './VendorContractsContent.scss';

import IQTooltip from 'components/iqtooltip/IQTooltip';
import SUIDrawer from 'sui-components/Drawer/Drawer';

import {getServer} from 'app/common/appInfoSlice';
import {fetchVendorData} from '../../budgetmanager/operations/vendorInfoSlice';
import IQButton from 'components/iqbutton/IQButton';
import VendorContractsForm from './vendorcontractsform/VendorContractsForm';
import VendorContractsLineItem from '../vendorcontractsdetails/VendorContractsLineItem';
import VendorContractsToolbar from './vendorcontractstoolbar/VendorContractsToolbar';
import VendorContractsGrid from './vendorcontractsgrid/VendorContractsGrid';
import {
	getSelectedRecord, fetchCompanyList, getShowLineItemDetails, setSelectedNode, setSelectedRecord,
	setShowLineItemDetails, getContractDetailsById, getMinMaxDrawerStatus, setMinMaxDrawerStatus
} from '../stores/VendorContractsSlice';
import ContractSignModal from 'sui-components/ContractSignModal/ContractSignModal';
import {ContractorResponse} from '../vendorcontractsdetails/ContractorResponse/ContractorResponse';
import {getVendorContractsList} from '../stores/gridSlice';
import {errorMsg, errorStatus, isUserGC} from 'utilities/commonutills';
import {getVCChangeEventsList} from '../stores/VCChangeEventsSlice';
import ForecastTransactions from '../vendorcontractsdetails/tabs/forecast/ForecastTransactions';
import CommittedTransaction from '../vendorcontractsdetails/tabs/transactions/VCCommittedTransaction';
import {unLockContract, declineContract, cancelAndLockContract, reviseContract, acceptContract, lockAndPostContract, activateContract} from '../stores/VCButtonActionsAPI';
import SUIAlert from 'sui-components/Alert/Alert';
import Toast from 'components/toast/Toast';

// Realtime imports
import {initRTDocument} from 'utilities/realtime/Realtime';
import {mainGridRTListener} from '../VendorContractsRT';
import {SUIToast} from 'sui-components/Toast/Suitoast';

const VendorContractsContent = ({gridRef, ...props}: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const {loginUserData} = useAppSelector((state) => state.vendorContracts);
	const {selectedNode, selectedRecord, selectedTabName, enablePostAndLockBtn} = useAppSelector((state) => state.vendorContracts);
	// console.log('selectedRecord', selectedRecord)
	// Redux state extraction
	const showRightPanel = useAppSelector(getShowLineItemDetails);
	const lineItem: any = useAppSelector(getSelectedRecord);
	const {unLockedSov} = useAppSelector((state) => state.VCScheduleOfValues);
	const {budgetItems} = useAppSelector((state) => state.vendorContractsGrid);

	// State declarations
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [showLeftButton, setShowLeftButton] = useState(false);
	const [showRightButton, setShowRightButton] = useState(false);
	const [api, setApi] = React.useState<any>('');
	const [saveContract, setSaveContract] = React.useState<any>({show: false, disable: false});
	const [lockContract, setLockAndPostContract] = React.useState<any>({show: false, disable: true});
	const [unlockContract, setUnlockContract] = React.useState<any>({show: false, disable: false});
	const [cancelAndLock, setCancelAndLock] = React.useState<any>({show: false, disable: false});
	const [saveChanges, setSaveChanges] = React.useState<any>({show: false, disable: false});
	const [postChangeAndLock, setPostChangeAndLock] = React.useState<any>({show: false, disable: false});
	const [contractDialog, setContractDialog] = React.useState<any>({show: false, type: ''});
	const [contractorResponse, setContractorResponse] = React.useState<any>({show: false, type: 2});
	const [showAlert, setShowAlert] = React.useState<any>({show: false, message: '', type: ''});
	const [toast, setToast] = React.useState<any>({show: false, message: ''});
	const [SCActions, setSCActions] = React.useState<any>({show: false, decline: {show: true, disable: false}, revise: {show: true, disable: false}, accept: {show: true, disable: false}});
	const minMaxStatus: any = useAppSelector(getMinMaxDrawerStatus);
	const responseTypeObj: any = {'Accepted': 2, 'Declined': 0, 'SentBackForRevision': 1, 'LockedAndPosted': 2, };
	const gridRT = useRef<boolean>(false);
	const [toast2, setToast2] = React.useState<any>({changeeventid: '', orginalAmount: '', changeOrderAmount: ''});
	const {changeEventsList} = useAppSelector((state) => state?.changeEvents);
	const [showLockSuccessMsg, setShowLockSuccessMsg] = React.useState<any>({show: false, msg1: '', msg2: ''});
	const [showAlertForPendingCompliance, setShowAlertForPendingCompliance] = React.useState<any>({show: false, message: '', type: ''});

	// Effect definitions
	React.useEffect(() => {
		// dispatch(fetchBudgetLineItems(appInfo));
		// dispatch(fetchGridData(appInfo));
		dispatch(fetchVendorData(appInfo));
		// dispatch(getBidLookup(appInfo));
		dispatch(fetchCompanyList(appInfo));
		dispatch(getVendorContractsList(appInfo));
		// dispatch(fetchTeammembersByProject(appInfo));

		// Real time
		if(gridRT.current) return;
		else {
			gridRT.current = true;
			const path = `vendorContract@${appInfo?.uniqueId}`;
			const documentId = `${appInfo.urlAppZoneID}_${appInfo.uniqueId}`;

			setTimeout(() => {
				initRTDocument(appInfo, path, documentId, mainGridRTListener);
			}, 3000);
		}
	}, []);

	React.useEffect(() => {
		unLockedSov && setToast({show: true, message: "You are now allowed to change the Schedule of Values."});
	}, [unLockedSov]);

	React.useEffect(() => {
		if(toast?.show ?? false) {
			setTimeout(() => {setToast({show: false, message: ""});}, 7000);
		}
	}, [toast]);

	React.useEffect(() => {setTimeout(() => {setShowLockSuccessMsg({show: false, msg1: '', msg2: ''});}, 5000);}, [showLockSuccessMsg]);

	const minimizeIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-minimize' style={{fontSize: '1.25rem'}}></div>;
	}, []);

	React.useEffect(() => {
		if(Object.keys(appInfo)?.length) {
			setContractorResponse({...contractorResponse, show: ["Declined", "Active", "SentBackForRevision"]?.includes(selectedRecord?.status), type: responseTypeObj[selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.type]});
			if(isUserGC(appInfo)) {
				['AwaitingAcceptance', 'Active', 'SentBackForRevision', 'ActivePendingSOVUpdate'].includes(selectedRecord?.status) ? setUnlockContract({show: true, disable: false}) : setUnlockContract({show: false, disable: false});
				// ['Draft', 'ReadyToSubmit'].includes(selectedRecord?.status) ? setLockAndPostContract({ show: true, disable: selectedRecord?.status == 'Draft' ? true : false }) : setLockAndPostContract({ show: false, disable: false });
				// ['Draft', 'ReadyToSubmit'].includes(selectedRecord?.status) ? setSaveContract({ show: true, disable: false }) : setSaveContract({ show: false, disable: false });
				if(['ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status)) {
					setCancelAndLock({show: true, disable: false});
					// setSaveChanges({ show: true, disable: false })
					console.log("budgetLineItemsWithValidSOV", selectedRecord?.budgetLineItemsWithValidSOV, budgetItems?.length);
					setPostChangeAndLock({show: true, disable: selectedRecord?.budgetLineItemsWithValidSOV != budgetItems?.length ? true : false});
				}
				else {
					setCancelAndLock({show: false, disable: false});
					// setSaveChanges({ show: false, disable: false });
					setPostChangeAndLock({show: false, disable: false});
				}
				['Draft', 'ReadyToSubmit', 'ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'ActiveUnlockedPendingSOVUpdate'].includes(selectedRecord?.status) ? setLockAndPostContract({show: true, disable: selectedRecord?.status == 'Draft' ? true : selectedRecord?.budgetLineItemsWithValidSOV != budgetItems?.length ? true : false}) : setLockAndPostContract({show: false, disable: false});
			}
			else {
				if(['AwaitingAcceptance'].includes(selectedRecord?.status)) {setSCActions({...SCActions, show: true}); setContractorResponse({...contractorResponse, show: false});}
				else {
					setSCActions({...SCActions, show: false});
					// setContractorResponse({ ...contractorResponse, show: ["Declined", "Active", "SentBackForRevision"]?.includes(selectedRecord?.status),  type: responseTypeObj[selectedRecord?.responses?.[selectedRecord?.responses?.length -1]?.type] }) 
				}
			}
		}
	}, [selectedRecord, appInfo, budgetItems]);

	React.useEffect(() => {
		dispatch(getVCChangeEventsList({appInfo: appInfo, id: selectedRecord?.id}));
	}, [selectedRecord]);

	React.useEffect(() => {
		console.log('changeEventsList', changeEventsList);
	}, [changeEventsList]);

	React.useEffect(() => {
		console.log("enablePostAndLockBtn in VC", enablePostAndLockBtn);
		enablePostAndLockBtn && setPostChangeAndLock({show: true, disable: selectedRecord?.budgetLineItemsWithValidSOV != budgetItems?.length ? true : false});
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
				dispatch(getContractDetailsById({appInfo: appInfo, id: node?.data?.id}));
				dispatch(setSelectedNode(node));
			}
		});
	};
	const handleRightArrow = () => {
		api.forEachNode(function (node: any) {
			if(selectedNode?.rowIndex + 1 === node?.rowIndex) {
				node.setSelected(true, true);
				dispatch(setSelectedRecord(node?.data));
				dispatch(getContractDetailsById({appInfo: appInfo, id: node?.data?.id}));
				dispatch(setSelectedNode(node));
			}
		});
	};

	const onMinimizeDrawer = () => {
		dispatch(setMinMaxDrawerStatus({minMax: false, forecast: false, transactions: false}));
	};


	// Start of action button handlers

	const handleLockAndPostContractAction = (lock: boolean) => {
		// dispatch(setLockAndPostContractResponseClick(true))
		selectedRecord?.vendor?.pendingCompliances?.length && selectedRecord?.status === "ReadyToSubmit" && !lock ? setShowAlertForPendingCompliance({show: true, type: 'lockPendingCompliance', message: <span>The Vendor You are trying to make a Contract has pending company compliance's verification.<br /><br /> Would you still want to go ahead and post the Contract to the vendor?</span>})
			: ["AwaitingAcceptanceUnlocked", "ActiveUnlocked", "ActiveUnlockedPendingSOVUpdate"]?.includes(selectedRecord?.status) ? handlePostChangeAndLockAction('lock') : setShowAlert({
				show: true, type: 'lock', message:
					<div>
						<span>Are you sure you want to Lock & Post the Contract?</span> <br /><br /><br />
						<span>By doing so, the contract will become Active immediately and the other party will be able to see the contract Active.</span>
					</div>
			});
		// : lockAndPostContract(appInfo, selectedRecord?.id, afterItemAction);
	};

	const handleRouteForApproval = (lock: boolean) => {
		selectedRecord?.vendor?.pendingCompliances?.length && selectedRecord?.status === "ReadyToSubmit" && !lock ? setShowAlertForPendingCompliance({show: true, type: 'routePendingCompliance', message: <span>The Vendor You are trying to make a Contract has pending company compliance's verification.<br /><br /> Would you still want to go ahead and post the Contract to the vendor?</span>})
			: ["AwaitingAcceptanceUnlocked", "ActiveUnlocked", "ActiveUnlockedPendingSOVUpdate"]?.includes(selectedRecord?.status) ? handlePostChangeAndLockAction('route')
				: setShowAlert({
					show: true, type: 'route', message:
						<div>
							<span>Are you sure you want to Route & Post the contract?</span> <br /><br /><br />
							<span>By doing so, the contract will be Routed to the other party and has to be signed & acknowledged.</span>
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

	const afterItemAction = (response: any) => {
		if(errorStatus?.includes(response?.status)) setToast({show: true, message: errorMsg});
		else {
			dispatch(setSelectedRecord(response));
			!isUserGC(appInfo) && setToast({show: true, message: 'Contract Status has been updated and notified the response to the Contract Manager'});
			dispatch(getVendorContractsList(appInfo));
		}
		// dispatch(getContractDetailsById({ appInfo: appInfo, id: selectedRecord?.id }));
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

	const handleContractorResponse = (response: any) => {
		console.log("response", response);
		const payload = {reason: response?.reason, signature: response?.signature};
		response?.type == 'decline' ? declineContract(appInfo, selectedRecord?.id, payload, afterItemAction)
			: response?.type == 'revise' ? reviseContract(appInfo, selectedRecord?.id, payload, afterItemAction) : acceptContract(appInfo, selectedRecord?.id, {signature: response?.signature}, afterItemAction);
		setContractDialog({...contractDialog, show: false});
	};
	const handleAlert = (type: string) => {
		if(type == 'yes') {
			showAlert?.type == 'cancel' && cancelAndLockContract(appInfo, selectedRecord?.id, afterItemAction);
			if(showAlert?.type == 'route') {
				lockAndPostContract(appInfo, selectedRecord?.id, afterItemAction);
				setShowLockSuccessMsg({show: true, msg1: 'Contract Routed, Posted and Locked.', msg2: 'Notified the response to the Vendor.'});
			}
			if(showAlert?.type == 'lock') {
				activateContract(appInfo, selectedRecord?.id, afterItemAction);
				setShowLockSuccessMsg({show: true, msg1: 'Posted Contract and Locked.', msg2: 'Notified the response to the Vendor.'});
			}
			// if(showAlert?.type == 'lockPendingCompliance') {
			// 	console.log("lockPendingCompliance")
			// 	// setShowAlert({show: false, msg1: '', msg2: ''})
			// 	setShowAlert({
			// 		show: true, type: 'lock', message:
			// 			<div>
			// 				<span>Are you sure you want to Lock & Post the Contract?</span> <br /><br /><br />
			// 				<span>By doing so, the contract will become Active immediately and the other party will be able to see the contract Active.</span>
			// 			</div>		
			// 		})
			// }
			// if(showAlert?.type == 'routePendingCompliance') {
			// 	setShowAlert({
			// 		show: true, type: 'route', message:
			// 		<div>
			// 			<span>Are you sure you want to Route & Post the contract?</span> <br /><br /><br />
			// 			<span>By doing so, the contract will be Routed to the other party and has to be signed & acknowledged.</span>
			// 		</div>		
			// 		})
			// }			
			if(showAlert?.type == 'unlock') {
				unLockContract(appInfo, selectedRecord?.id, afterItemAction);
				setToast({show: true, message: "Contract Unlocked. Changes made in the contracts will be notified to the Vendor on click of Post Change & Lock"});
			}
			setShowAlert({show: false, message: '', type: ''});

		} else {
			setShowAlert({show: false, message: '', type: ''});
		}

	};
	const handlePendingCompliance = (type: string) => {
		if(type == 'yes') {
			showAlertForPendingCompliance?.type == 'lockPendingCompliance' && handleLockAndPostContractAction(true);
			showAlertForPendingCompliance?.type == 'routePendingCompliance' && handleRouteForApproval(true);
			setShowAlertForPendingCompliance({show: false, message: '', type: ''});
		}
		else setShowAlertForPendingCompliance({show: false, message: '', type: ''});
	};
	// End of action button handlers
	const rightPanelClose = () => {
		dispatch(setShowLineItemDetails(false));
		postMessage({
			event: "help",
			body: {iframeId: "vendorContractsIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "VendorContracts", isFromHelpIcon: false}
		});
	};

	return <>
		<Box className='bid-manager-content'>
			{isUserGC(appInfo) ?
				<div className='collapsible-section'>
					{collapsed === false ? <div className='bid-lineitem-form-box'>
						<p className='bid-lineitem-form-title'>Create New Vendor Contract</p>
						<VendorContractsForm />
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
				<VendorContractsToolbar />
				<VendorContractsGrid onRefChange={(ref: any) => handleRef(ref)} />
			</div>
		</Box>
		{showRightPanel && (
			<SUIDrawer
				className='vendor-contracts-lid'
				PaperProps={{style: {position: 'absolute', minWidth: '60em', width: '65vw', borderRadius: '0.5em', boxShadow: '-2px 1px 8px #0000001a'}}}
				anchor='right'
				variant='permanent'
				elevation={8}
				open={false}
			>
				<Stack className='rightpanel-content-section'>
					<VendorContractsLineItem close={() => {rightPanelClose();}} />
				</Stack>
				{selectedRecord?.status == 'ActivePendingSOVUpdate' && isUserGC(appInfo) && <SUIToast
					message={
						<div className='message-content'>
							<p>Due to the recent Change Event approval, the Schedule of Values for this</p>
							<p>Contract needs to be updated.
								{/* <a onClick={() => window.open(useHotLink(`change-event-requests/home?id=${selectedRecord?.id}`), '_blank')}>CER001</a> */}
							</p>
							{/* <p>Original Contract Amount: <b>$200,000</b></p>
							<p>Change Order Amount: <b className='bold-oa'>$62,000</b></p> */}
						</div>
					}
					showclose={true} />
				}
				<Stack direction='row' className='rightpanel-footer' >
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
						contractorResponse?.show && selectedRecord?.responses &&
						< ContractorResponse
							text={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.type == 'LockedAndPosted' ? 'Contract Locked & Posted By' : null}
							contractorName={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.by?.displayName}
							respondedOn={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.date}
							responseType={contractorResponse?.type}
							reason={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.reason}
							sign={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.signature}
							thumbNailImg={selectedRecord?.responses?.[selectedRecord?.responses?.length - 1]?.by?.image?.downloadUrl}
						/>
					}
					<div className='footer-button-container'>

						{
							cancelAndLock?.show && <IQButton
								disabled={cancelAndLock?.disable}
								className='btn-cancel-contract'
								color="inherit"
								onClick={handleCancelAndLock}
							// startIcon={<Gavel />}
							>
								CANCEL
							</IQButton>
						}
						{
							lockContract?.show && <IQButton
								disabled={lockContract?.disable}
								className='btn-post-contract  lock-post-btn'
								// color='white'
								// variant={'outlined'}
								onClick={() => handleLockAndPostContractAction(false)}
							// startIcon={<Gavel />}
							>
								LOCK & POST CONTRACT
							</IQButton>
						}


						{
							unlockContract?.show && <IQButton
								disabled={unlockContract?.disable}
								className='btn-post-contract'
								// color='white'
								onClick={handleUnlock}
							// startIcon={<Gavel />}
							>
								UNLOCK CONTRACT
							</IQButton>
						}

						{/* {
							saveChanges?.show && <IQButton
								disabled={saveChanges?.disable}
								className='btn-save-changes'
								variant="outlined"
							// color='white'
							// onClick={handlePostBid}
							// startIcon={<Gavel />}
							>
								SAVE CHANGES
							</IQButton>
						} */}
						{/* {
							postChangeAndLock?.show && <IQButton
								disabled={postChangeAndLock?.disable}
								className='btn-post-contract'
								// color='white'
								onClick={handlePostChangeAndLockAction}
							// startIcon={<Gavel />}
							>
								POST CHANGE & LOCK
							</IQButton>
						}												 */}
						{
							lockContract?.show && <IQButton
								disabled={lockContract?.disable}
								className='btn-post-contract'
								// color='white'
								onClick={() => handleRouteForApproval(false)}
							// startIcon={<Gavel />}
							>
								ROUTE FOR APPROVAL
							</IQButton>
						}
						{
							SCActions?.show && <>
								{
									SCActions?.decline?.show && <IQButton
										disabled={SCActions?.decline?.disable}
										className='btn-cancel-contract'
										onClick={() => setContractDialog({show: true, type: 'decline'})}
									// onClick={handleDecline}
									// startIcon={<Gavel />}
									>
										DECLINE CONTRACT
									</IQButton>
								}
								{
									SCActions?.revise?.show && <IQButton
										disabled={SCActions?.revise?.disable}
										className='btn-save-changes'
										variant="outlined"
										onClick={() => setContractDialog({show: true, type: 'revise'})}
									// startIcon={<Gavel />}
									>
										REVISE & RESUBMIT
									</IQButton>
								}
								{
									SCActions?.accept?.show && <IQButton
										disabled={SCActions?.accept?.disable}
										className='btn-post-contract'
										onClick={() => setContractDialog({show: true, type: 'sign'})}
									// startIcon={<Gavel />}
									>
										SIGN & ACCEPT CONTRACT
									</IQButton>
								}
							</>
						}
						{
							!isUserGC(appInfo) && selectedRecord?.status == 'OnHold' && <div className="estimated-bid-cls">
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
						DailogClose={true}
						onClose={() => {
							setShowAlert({show: false, message: ''});
						}}
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
					showAlertForPendingCompliance?.show && <SUIAlert
						open={showAlertForPendingCompliance?.show}
						DailogClose={true}
						onClose={() => {
							setShowAlertForPendingCompliance({show: false, message: ''});
						}}
						contentText={
							showAlertForPendingCompliance?.message
						}
						title={'Confirmation'}
						onAction={(e: any, type: string) => handlePendingCompliance(type)}
						showActions={true}
						modelWidth={'610px'}
					/>
				}
				{
					showLockSuccessMsg?.show && <Alert severity="success" className='floating-toast-cls' onClose={() => {setShowLockSuccessMsg({show: false, msg1: '', msg: 2});}}>
						<span className="toast-text-cls toast-line-cls">
							<b>1</b>{showLockSuccessMsg?.msg1}</span>
						<span className="toast-text-cls toast-line-cls">
							<b>2</b>{showLockSuccessMsg?.msg2}</span>
					</Alert>
				}
				{
					toast?.show && <Toast message={toast.message} interval={5000} />
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
			{minMaxStatus.transactions && (<CommittedTransaction />)}
		</SUIDrawer>)}
	</>;
};

export default VendorContractsContent;