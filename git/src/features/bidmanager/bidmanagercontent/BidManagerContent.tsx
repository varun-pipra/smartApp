import './BidManagerContent.scss';

import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import Toast from 'components/toast/Toast';
import {
	fetchBidPackageDetails, fetchBudgetLineItems, fetchCompanyList, fetchTeammembersByProject, getCompanyFilters, getSelectedRecord, getShowLineItemDetails,
	getToastMessage, getToastMessage2, setSelectedNode, setSelectedRecord, setShowLineItemDetails,
	setToastMessage2
} from 'features/bidmanager/stores/BidManagerSlice';
import {useEffect, useRef, useState} from 'react';
import Award from 'resources/images/bidManager/Awarded.svg';
import SUIAlert from 'sui-components/Alert/Alert';
import SUIDrawer from 'sui-components/Drawer/Drawer';
// Realtime imports
import {postMessage} from 'app/utils';
import {
	ExpandLess, ExpandMore, Gavel, KeyboardArrowLeft, KeyboardArrowRight, PushPinOutlined as PushPin
} from '@mui/icons-material';
import {Box, IconButton, Stack} from '@mui/material';

import {fetchVendorData} from '../../budgetmanager/operations/vendorInfoSlice';
import BidPackageLineItem from '../bidpackagedetails/BidPackageLineItem';
import {updateBudget} from '../stores/awardBidAPI';
import {
	setAwardBidClick, setAwardBidDetailsData, setOpenUpdateBudgetDialog
} from '../stores/awardBidSlice';
import {patchBidPackage} from '../stores/gridAPI';
import {fetchGridData} from '../stores/gridSlice';
import BidLineItemForm from './bidlineitemform/BidLineItemForm';
import BidManagerGrid from './bidmanagergrid/BidManagerGrid';
import BidToolbar from './bidmanagertoolbar/BidManagerToolbar';
import {blockchainStates, setShowBlockchainDialog} from 'app/common/blockchain/BlockchainSlice';
import { fetchConnectors } from 'features/budgetmanager/operations/gridSlice';
import { fetchdefaultdrodown, fetchSettings } from 'features/budgetmanager/operations/settingsSlice';

const BidManagerContent = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const {gridData, originalGridData} = useAppSelector((state) => state.bidManagerGrid);
	const {selectedNode, selectedRecord, selectedTabName} = useAppSelector((state) => state.bidManager);
	const {awardBidSelectedRecord, awardBidDetailData, viewType} = useAppSelector((state) => state.awardBid);

	// Redux state extraction
	const showRightPanel = useAppSelector(getShowLineItemDetails);
	const lineItem: any = useAppSelector(getSelectedRecord);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);

	// State declarations
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [showLeftButton, setShowLeftButton] = useState(false);
	const [showRightButton, setShowRightButton] = useState(false);
	const [api, setApi] = useState<any>('');
	const [postBid, setPostBid] = useState<any>({show: true, disable: true});
	const [declineBid, setDeclineBid] = useState<any>({show: true, disable: false});
	const [awardBid, setAwardBid] = useState<any>({show: false, award: {show: false, disable: true}, updateBudget: {show: false, disable: false}});

	const [toastMessage, setToastMessage] = useState<any>({displayToast: false, message: ''});
	const [RightPanel_ToastMessage, setRightPanel_ToastMessage] = useState<any>({displayToast: false, message: ''});
	const showToastMessage = useAppSelector(getToastMessage);
	const showToastMessage2 = useAppSelector(getToastMessage2);
	const [showAlert, setShowAlert] = useState<any>(false);
	const gridRT = useRef<boolean>(false);
	const [exampletoast, setexample] = useState<any>(true);
	const {blockchainEnabled} = useAppSelector((state) => state.blockchain);

	useEffect(() => {
		setTimeout(() => {
			setToastMessage({displayToast: false, message: ''});
		}, 3000);
		setToastMessage({...showToastMessage});
	}, [showToastMessage]);

	useEffect(() => {
		if(showToastMessage2?.displayToast == true) {
			setRightPanel_ToastMessage({...showToastMessage2});
		}
	}, [showToastMessage2]);

	useEffect(() => {
		if(RightPanel_ToastMessage?.displayToast == true) {
			setTimeout(() => {
				setRightPanel_ToastMessage({displayToast: false, message: ''});
			}, 3000);
		}
	}, [RightPanel_ToastMessage]);

	// Effect definitions
	useEffect(() => {
		dispatch(fetchBudgetLineItems(appInfo));
		dispatch(fetchGridData(appInfo));
		dispatch(fetchVendorData(appInfo));
		dispatch(fetchCompanyList(appInfo));
		dispatch(fetchTeammembersByProject(appInfo));
		dispatch(getCompanyFilters({appInfo: appInfo, name: 'Diverse Supplier Categories'}));
		dispatch(fetchConnectors(appInfo));
		dispatch(fetchdefaultdrodown(appInfo));
		dispatch(fetchSettings(appInfo));
		// Real time
		// if (gridRT.current) return;
		// else {
		// 	gridRT.current = true;
		// 	const documentId = `${appInfo.urlAppZoneID}_${appInfo.uniqueId}`;

		// 	setTimeout(() => {
		// 		initRTDocument(appInfo, `bidManager@${appInfo?.uniqueId}`, documentId, mainGridRTListener);
		// 		initRTDocument(appInfo, `bidQuery@${appInfo?.uniqueId}`, documentId, bidQueryRTListener);
		// 		initRTDocument(appInfo, `bidManager_awardbids@${appInfo?.uniqueId}`, documentId, awardBidRTListener);
		// 	}, 3000);
		// }
	}, []);

	useEffect(() => {
		setShowLeftButton(selectedNode?.firstChild ? true : false);
		setShowRightButton(selectedNode?.lastChild ? true : false);
	}, [gridData, selectedNode, originalGridData]);

	useEffect(() => {
		setPostBid({...postBid, show: selectedTabName !== 'award-bids' && [0, 1, 2].includes(selectedRecord?.status) ? true : false, disable: selectedRecord?.status == 1 ? false : true});
		setDeclineBid({...declineBid, show: [0, 1, 2].includes(selectedRecord?.status) ? false : selectedTabName !== 'award-bids' ? true : false});
		setAwardBid({
			...awardBid,
			show: selectedTabName == 'award-bids' && selectedRecord?.status == 3 ? true : false,
			award: {...awardBid?.award, disable: awardBidSelectedRecord?.length > 0 && awardBidSelectedRecord[0]?.submissionStatus == 3 && awardBidDetailData?.bidAmount == awardBidDetailData?.totalBudget ? false : true}
		});
	}, [selectedRecord, selectedTabName, awardBidSelectedRecord, awardBidDetailData]);

	// Handler method definitions
	const onRightPanelClose = () => {
		dispatch(setShowLineItemDetails(false));
		dispatch(setSelectedRecord({}));
		postMessage({
			event: "help",
			body: {iframeId: "bidManagerIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "BidManager", isFromHelpIcon: false}
		});
	};

	const handleRef = (ref: any) => {
		setApi(ref.current.api);
	};

	const handleLeftArrow = () => {
		api.forEachNode(function (node: any) {
			if(selectedNode?.rowIndex - 1 === node.rowIndex && node?.data !== undefined) {
				node.setSelected(true, true);
				dispatch(fetchBidPackageDetails({appInfo: appInfo, packageId: node?.data?.id}));
				dispatch(setSelectedNode(node));
				dispatch(setAwardBidDetailsData({}));
			}
		});
	};

	const handleRightArrow = () => {
		api.forEachNode(function (node: any) {
			if(selectedNode?.rowIndex + 1 === node?.rowIndex) {
				node.setSelected(true, true);
				dispatch(fetchBidPackageDetails({appInfo: appInfo, packageId: node?.data?.id}));
				dispatch(setSelectedNode(node));
				dispatch(setAwardBidDetailsData({}));
			}
		});
	};

	const handlePostBid = () => {
		patchBidPackage(appInfo, selectedRecord?.id, {status: 3}).then((response: any) => {
			dispatch(fetchGridData(appInfo));
			dispatch(setSelectedRecord(response));
			if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
				dispatch(setShowBlockchainDialog(true));
			} else {
				dispatch(setToastMessage2({displayToast: true, message: 'Bid Posted Successfully'}));
			}
		});
	};

	const handleAwardBid = () => {
		dispatch(setAwardBidClick(true));
	};

	const handleUpdateBudget = () => {
		dispatch(setOpenUpdateBudgetDialog(true));
		setShowAlert(true);
	};

	const handleAlert = (type: string) => {
		type == 'close' && setShowAlert(false);
		if(type == 'yes') {
			updateBudget(appInfo, selectedRecord?.id, awardBidDetailData?.bidderUID, (response: any) => {
				dispatch(setAwardBidDetailsData(response));
			});
			setRightPanel_ToastMessage({displayToast: true, message: 'Budget updated successfully and Bid can now be awarded to the Vendor'});
		}

		setShowAlert(false);
	};

	const disableBlockchainActionButtons = (blockchainEnabled && blockchainStates.indexOf(selectedRecord?.blockChainStatus) === -1);

	return <>
		<Box className='bid-manager-content'>
			<div className='collapsible-section'>
				{collapsed === false ? <div className='bid-lineitem-form-box'>
					<p className='bid-lineitem-form-title'>Create New Bid Line Item</p>
					<BidLineItemForm />
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
			<div className='bid-manager-grid-box check-box-customize'>
				<BidToolbar />
				<BidManagerGrid onRefChange={(ref: any) => handleRef(ref)} />
				{toastMessage.displayToast ? <Toast message={toastMessage.message} interval={3000} /> : null}
				{/* {exampletoast && <SUIToast
					message={
						// <div>
						// 	Budget has been updated from $74000 to $90000 due to an approval of a  recent Change Event Request.<br />
						// 	Change Event ID: CER001
						// </div>
						<div className='message-content'>
							<p>Due to the recent Change Event approval, the Schedule of Values for this</p>
							<p>Contracts needs to be updated.Change Event ID: <a>CER001</a></p>
							<p>Original Contract Amount: <b>$200,000</b></p>
							<p>Change Order Amount: <b className='bold-oa'>$62,000</b></p>
						</div>
					}
					showclose={true} />
				} */}
			</div>
		</Box>
		{showRightPanel && (
			<SUIDrawer
				PaperProps={{style: {position: 'absolute', minWidth: '60em', width: '65vw', borderRadius: '0.5em', boxShadow: '-2px 1px 8px #0000001a'}}}
				anchor='right'
				variant='permanent'
				elevation={8}
				open={false}
			>
				<Stack className='rightpanel-content-section'>
					<BidPackageLineItem
						close={onRightPanelClose}
						showBCInfo={disableBlockchainActionButtons}
					/>
				</Stack>
				<Stack direction='row' className='rightpanel-footer' >
					{
						/*selectedTabName !== 'award-bids' && */
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
							{/* <div className='footer-lineitem-counter'>
						<span className='toastmessage'>{lineItem?.name || ''}</span>
					</div> */}
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
						postBid?.show && <IQButton
							disabled={postBid?.disable || disableBlockchainActionButtons}
							className='btn-post-bid'
							color='green'
							onClick={handlePostBid}
							startIcon={<Gavel />}>
							POST BID
						</IQButton>
					}
					{
						awardBid?.show && awardBidSelectedRecord[0]?.submissionStatus == 3 && viewType == 'grid' &&
						<Stack direction='row' spacing={2}>
							{awardBidSelectedRecord?.length ? <div className='estimated-bid-cls'>
								<span className='common-icon-info-white'></span>
								{/* <span className='text'> */}
								{awardBidDetailData?.bidAmount == awardBidDetailData?.totalBudget ?
									<span className='text'> Estimated Bid Value of {currencySymbol} {awardBidDetailData?.bidAmount?.toLocaleString('en-US')} matches Budget Value</span> :
									awardBidDetailData?.bidAmount > awardBidDetailData?.totalBudget ?
										<span className='text'>Estimated Bid Value of {currencySymbol} {awardBidDetailData?.bidAmount?.toLocaleString('en-US')} is greater than projected Budget value (  {<p style={{color: 'red'}}>{`${currencySymbol} ${(awardBidDetailData?.bidAmount - awardBidDetailData?.totalBudget)?.toLocaleString('en-US')}`}</p>})</span>
										: <span className='text'>Estimated Bid Value of {currencySymbol} {awardBidDetailData?.bidAmount?.toLocaleString('en-US')} is lesser than projected Budget value ( {<p style={{color: 'green'}}>{`${currencySymbol} ${(awardBidDetailData?.totalBudget - awardBidDetailData?.bidAmount)?.toLocaleString('en-US')}`}</p>})</span>
								}
								{/* </span> */}
								{awardBidDetailData?.bidAmount !== awardBidDetailData?.totalBudget && <IQButton
									disabled={declineBid?.disable || disableBlockchainActionButtons}
									className='btn-award-update'
									// color='secondary'
									onClick={handleUpdateBudget}>
									UPDATE BUDGET
								</IQButton>}
							</div> : null}


						</Stack>
					}
					{
						awardBid?.show && viewType == 'grid' && <IQButton
							disabled={awardBid?.award?.disable || disableBlockchainActionButtons}
							className='btn-post-bid award-bid-cls'
							color='green'
							startIcon={<Box component='img' src={Award} style={{height: '20px', width: '20px'}} />}
							onClick={handleAwardBid}>
							AWARD BID
						</IQButton>
					}
				</Stack>
				{
					showAlert && <SUIAlert
						open={showAlert}
						onClose={() => {
							setShowAlert(false);
						}}
						contentText={
							<span>Are you sure want to update the Budget from <span>{currencySymbol} {awardBidDetailData?.totalBudget?.toLocaleString('en-US')}</span> to <span>{currencySymbol} {awardBidDetailData?.bidAmount?.toLocaleString('en-US')}</span> </span>
						}
						DailogClose={true}
						title={'Confirmation'}
						onAction={(e: any, type: string) => handleAlert(type)}
						showActions={true}
					/>
				}
				{RightPanel_ToastMessage.displayToast ? <Toast message={RightPanel_ToastMessage.message} interval={3000} /> : null}

			</SUIDrawer>
		)}
	</>;
};

export default BidManagerContent;