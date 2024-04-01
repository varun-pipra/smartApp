import {useState, useEffect, useRef, Fragment} from 'react';
import {useAppDispatch, useAppSelector, hideLoadMask} from 'app/hooks';
import {Button, IconButton, TextField} from '@mui/material';
import {Close, ExpandMore, ExpandLess, PushPinOutlined as PushPin} from '@mui/icons-material';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import './VendorContractsLineItem.scss';
import PresenceManager from 'utilities/presence/PresenceManager.js';
import VendorContractsScheduleValues from './tabs/schedulevalues/VendorContractsScheduleValues';
import {postMessage} from 'app/utils';
import 'utilities/presence/PresenceManager.css';

import {getServer} from 'app/common/appInfoSlice';
import {
	getSelectedRecord, getContractDetailsById, getUserRoleDetails,
	getBidLookup, fetchCompanyList, setContractDetailsGetCall,
} from 'features/vendorcontracts/stores/VendorContractsSlice';
import {stringToUSDateTime2} from 'utilities/commonFunctions';
import ContractDetails from './tabs/contractdetails/ContractDetails';
import CommittedTransaction from './tabs/transactions/VCCommittedTransaction';
import ForecastTransactions from './tabs/forecast/ForecastTransactions';
import {
	vendorContractsStatus, vendorContractsStatusColors, vendorContractsStatusIcons,
	vendorContractsResponseStatusIcons, vendorContractsResponseStatusColors, vendorContractsResponseStatus
} from 'utilities/vendorContracts/enums';
import VendorContractFiles from './tabs/vendorcontractfiles/VendorContractFiles';
import ChangeEvents from './tabs/changeevents/VCChangeEvents';
import PaymentLedger from './tabs/paymentledger/VCPaymentLedger';
import {connectorImages, getAmountAlignment, isUserGC} from 'utilities/commonutills';
import {getBudgetItemsByPackage, setBudgetItemsGetCall} from '../stores/gridSlice';
import {fetchTransactions, getTransactionCount} from '../stores/tabs/transactions/TransactionTabSlice';
import {updateContractDetails} from '../stores/gridAPI';
import {getVendorContractsForecasts, getForecastsCount} from '../stores/ForecastsSlice';
import {getContractFilesCount} from '../stores/tabs/contractfiles/VCContractFilesTabSlice';
import {getVCPaymentLedgerList, getPaymentLedgeCount} from '../stores/PaymentLedgerSlice';
import {getVCChangeEventsList} from '../stores/VCChangeEventsSlice';
import {amountFormatWithOutSymbol} from 'app/common/userLoginUtils';
import {getBudgets} from 'features/clientContracts/stores/CCSovSlice';
import BlockchainIB from 'features/common/informationBubble/BlockchainIB';
import { sapLinksObj } from 'utilities/sapLink';

const tinycolor = require('tinycolor2');

export interface headerprops {
	close: () => void;
	showBCInfo: boolean;
};

const VendorContractsLineItem = (props: headerprops) => {
	const dispatch = useAppDispatch();
	const presenceId = 'vendor-contracts-lineitem-presence';
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(true);
	const [tabSelected, setTabSelected] = useState('contract-details');

	const presenceRef = useRef(false);
	const appInfo = useAppSelector(getServer);
	const txnCount = useAppSelector(getTransactionCount);
	const forecastsCount = useAppSelector(getForecastsCount);
	const paymetLedgerCount = useAppSelector(getPaymentLedgeCount);
	const vendorLineItem: any = useAppSelector(getSelectedRecord);
	const [title, setTitle] = useState(vendorLineItem?.title);
	const {contractId, tab} = useAppSelector((state) => state.vendorContracts);
	const {unLockedSov} = useAppSelector((state) => state.VCScheduleOfValues);
	const {changeEventsCount} = useAppSelector((state) => state.changeEvents);
	const filesCount = useAppSelector(getContractFilesCount);
	const tabid = useRef('contract-details');
	const { connectors } = useAppSelector((state) => state.gridData);
	useEffect(() => {setTitle(vendorLineItem?.title);}, [vendorLineItem?.title]);

	const presenceTools = <Fragment>{
		<>
			<div id={presenceId} className='vendor-contracts-presence'></div>
		</>
	}</Fragment>;

	useEffect(() => {dispatch(getBudgetItemsByPackage({appInfo: appInfo, contractId: vendorLineItem?.id})); dispatch(getBudgets(appInfo));}, [vendorLineItem?.id]);

	const tabSelectedValue = (value: any) => {
		tabid.current = value;
		setTabSelected(value);
	};

	useEffect(() => {
		if(tabSelected) {
			help(false);
		}
	}, [tabSelected]);

	const onScroll = (value: any) => {
		if(pinned == false) {
			setCollapsed(value);
		}
	};

	useEffect(() => {presenceRef.current = false;}, [vendorLineItem]);

	useEffect(() => {
		if(presenceRef.current) return;
		presenceRef.current = true;

		renderPresence();
	}, [vendorLineItem]);

	useEffect(() => {
		if(contractId) {
			dispatch(setContractDetailsGetCall(false));
			dispatch(setBudgetItemsGetCall(false));
			const payload = {appInfo: appInfo, packageId: contractId},
				callList: Array<any> = [
					dispatch(getContractDetailsById({appInfo: appInfo, id: contractId})),
					dispatch(getBudgetItemsByPackage(payload)),
					dispatch(getUserRoleDetails(appInfo)),
					dispatch(getBidLookup({appInfo: appInfo, objectId: contractId})),
					dispatch(fetchCompanyList(appInfo)),
					dispatch(fetchTransactions(payload)),
					dispatch(getVCPaymentLedgerList({appInfo: appInfo, id: contractId})),
					dispatch(getVCChangeEventsList({appInfo: appInfo, id: contractId})),
					dispatch(getVendorContractsForecasts(payload))
				];

			Promise.all(callList).then(() => {
				hideLoadMask();
			});
		}
	}, [appInfo, contractId]);

	const renderPresence = () => {
		let presenceManager = new PresenceManager({
			domElementId: presenceId,
			initialconfig: {
				'showLiveSupport': true,
				'showPrint': true,
				'showLiveLink': false,
				'showStreams': true,
				'showComments': false,
				'showChat': false,
				'hideProfile': false,
				'participants': [appInfo.currentUserInfo]
			}
		});
		addPresenceListener(presenceManager);
	};

	const addPresenceListener = (presenceManager: any) => {
		if(presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;
			participantCtrl.addEventListener('livelinkbtnclick', function (e: any) {
				postMessage({
					event: 'launchcommonlivelink',
					body: {iframeId: 'vendorContractsIframe', roomId: vendorLineItem?.id, appType: 'VendorContractsLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('livesupportbtnclick', function (e: any) {
				help(true);
			});
			participantCtrl.addEventListener('streambuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommonstream',
					body: {iframeId: 'vendorContractsIframe', roomId: vendorLineItem?.id, appType: 'VendorContractsLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('printbuttonclick', function (e: any) {
				console.log('printbuttonclick', e.event);
				postMessage({
					event: 'openitemlevelreport',
					body: {
						targetLocation: {
							x: e.event.pageX,
							y: e.event.pageY
						}
					}
				});
			});
			participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommoncomment',
					body: {iframeId: 'vendorContractsIframe', roomId: vendorLineItem?.id, appType: 'VendorContractsLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('presencecountclick', function (e: any) {
				let participantsjson = participantCtrl.getParticipants(),
					participantids = [];
				if(participantsjson) {
					for(var i = 0;i < participantsjson.length;i++) {
						participantids.push((participantsjson[i].userid));
					}
				}
				postMessage({
					event: 'launchlivechat',
					body: {iframeId: 'vendorContractsIframe', roomId: vendorLineItem?.id, appType: 'VendorContractsLineItem'},
					livechatData: {participantsIds: participantids}
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: {iframeId: 'vendorContractsIframe', roomId: vendorLineItem?.id, appType: 'VendorContractsLineItem'},
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'click'
					}
				});
			});
			participantCtrl.addEventListener('presenceuserhover', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: {iframeId: 'vendorContractsIframe', roomId: vendorLineItem?.id, appType: 'VendorContractsLineItem'},
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'hover'
					}
				});
			});
			document.addEventListener('updateparticipants', function (event: any) {
				console.log('updateparticipants', event.detail);
				if(participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if(event.detail.appType === 'VendorContractsLineItem') {
					// console.log('Right panel presence',event);
					participantCtrl.updateParticipants(event.detail.data);
				}
			});
			document.addEventListener('updatecommentbadge', function (event: any) {
				if(participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if(event.detail.appType === 'VendorContractsLineItem') {
					let chatCount = event.detail.data,
						animation = (chatCount.eventType === 'commentReceived') ? true : false;
					participantCtrl.setButtonBadge('comment', chatCount.count, animation);
				}
			});
			postMessage({
				event: 'joinroom',
				body: {iframeId: 'vendorContractsIframe', roomId: vendorLineItem?.id, appType: 'VendorContractsLineItem', roomTitle: vendorLineItem?.title}
			});
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager);
		}, 1000);
	};
	const help = (isFromHelpIcon: any) => {
		console.log('useref', tabid.current);
		const body = {iframeId: "vendorContractsIframe", roomId: vendorLineItem?.id, appType: "VendorContractsLineItem", tabName: tabid.current, isFromHelpIcon: isFromHelpIcon};
		console.log('help', body);
		postMessage({
			event: "help",
			body: body
		});
	};

	const tabConfig = [
		{
			tabId: 'contract-details',
			label: 'Contract Details',
			showCount: false,
			icon: (tabSelected === 'contract-details' ? <span className='common-icon-contracts tabicon tabicon_orange' /> : <span className='common-icon-contracts tabicon' />),
			content: <ContractDetails readOnly={props.showBCInfo || (isUserGC(appInfo) ? (['Draft', 'ReadyToSubmit', 'AwaitingAcceptanceUnlocked', 'ActiveUnlocked', 'ActiveUnlockedPendingSOVUpdate']?.includes(vendorLineItem?.status) ? false : true) : true)}></ContractDetails>
		}, {
			tabId: 'schedule-of-Values',
			label: 'Schedule of Values',
			icon: (tabSelected === 'schedule-of-Values' ? <span className='common-icon-schedule-values tabicon tabicon_orange' /> : <span className='common-icon-schedule-values tabicon' />),
			content: <VendorContractsScheduleValues readOnly={props.showBCInfo || (isUserGC(appInfo) ? ['Draft', 'ReadyToSubmit']?.includes(vendorLineItem?.status) || unLockedSov ? false : true : true)}></VendorContractsScheduleValues>
		}, {
			tabId: 'contract-Files',
			label: 'Contract Files',
			showCount: (filesCount > 0),
			count: filesCount,
			icon: (tabSelected === 'contract-Files' ? <span className='common-icon-contract-files tabicon tabicon_orange' /> : <span className='common-icon-contract-files tabicon' />),
			content: <VendorContractFiles readOnly={props.showBCInfo || (isUserGC(appInfo) ? ['Draft', 'ReadyToSubmit', 'AwaitingAcceptanceUnlocked', 'ActiveUnlocked', 'ActiveUnlockedPendingSOVUpdate']?.includes(vendorLineItem?.status) ? false : true : true)} />
		}, {
			tabId: 'change-Events',
			label: 'Change Events',
			icon: (tabSelected === 'change-Events' ? <span className='common-icon-change-events tabicon tabicon_orange' /> : <span className='common-icon-change-events tabicon' />),
			content: <ChangeEvents />,
			count: changeEventsCount,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(vendorLineItem?.status) ? true : false,
		}, {
			tabId: 'payment-Ledger',
			label: 'Payment Ledger',
			count: paymetLedgerCount,
			icon: (tabSelected === 'payment-Ledger' ? <span className='common-icon-payment-ledger tabicon tabicon_orange' /> : <span className='common-icon-payment-ledger tabicon' />),
			content: <PaymentLedger />,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(vendorLineItem?.status) ? true : false,
		}, {
			tabId: 'transactions',
			label: 'Transactions',
			showCount: (txnCount > 0),
			count: txnCount,
			icon: (tabSelected === 'transactions' ? <span className='common-icon-transactions tabicon tabicon_orange' /> : <span className='common-icon-transactions tabicon' />),
			content: <CommittedTransaction />,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(vendorLineItem?.status) ? true : false,
		},
		{
			tabId: 'forecast',
			label: 'Forecast',
			showCount: (forecastsCount > 0),
			count: forecastsCount,
			icon: (tabSelected === 'forecast' ? <span className='common-icon-forecast tabicon tabicon_orange' /> : <span className='common-icon-forecast tabicon' />),
			content: <ForecastTransactions />,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(vendorLineItem?.status) ? true : false,
		}
	];

	return (
		<div className='Vendor-lineitem-detail-panel'>
			<div className='details-header'>
				{isUserGC(appInfo) && ['ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'Draft', 'ReadyToSubmit'].includes(vendorLineItem?.status) ? <TextField className='textField' variant='outlined' value={title}
					onChange={(e: any) => setTitle(e.target?.value)} onBlur={(e) => {updateContractDetails(appInfo, {title: title}, vendorLineItem?.id);}} />
					: <span className='textField'>{vendorLineItem?.title || ''}</span>
				}
				<IconButton className='closebutton' aria-label='Close Right Pane' onClick={() => props.close()}>
					<Close />
				</IconButton>
			</div>
			<div className='presence-section'>
				{props.showBCInfo && <BlockchainIB />}
				<div className='presence-tools'>
					{[presenceTools].map((presenceTool: any) => presenceTool)}
				</div>
			</div>
			<div className='kpi-section'>
				{collapsed === true ?
					<div className='kpi-horizontal-container'>
						<span className='kpi-tile'><span className='kpi-name'>Original Contract Amount</span><span className='bold'>{currencySymbol} <span className='amount'>{amountFormatWithOutSymbol(vendorLineItem?.amount)}</span></span></span>
						<span className='kpi-tile'><span className='kpi-name'>Change Order Amount</span><span className='bold'>{currencySymbol} <span className='amount'>{amountFormatWithOutSymbol(vendorLineItem?.changeOrderAmount)}</span></span></span>
						<span className='kpi-tile'><span className='kpi-name'>Remaining Amount</span><span className='bold'>{currencySymbol} <span className={`amount`} style={{backgroundColor: Number(vendorLineItem?.remainingAmount) >= 0 ? '#c9e59f' : '#f7adad'}}>{amountFormatWithOutSymbol(vendorLineItem?.remainingAmount)}</span></span></span>
					</div>
					:
					<div className='kpi-vertical-container'>
						<div className='lid-details-container'>
							{/* <span className='budgetid-label grey-font'>Contract ID:</span><span className='grey-fontt'>{vendorLineItem?.code}</span> */}
							<span className='budgetid-label grey-font'>Contract ID:</span>
								<span className='vendor-content'>
									<span className='grey-fontt'>{vendorLineItem?.code}</span>
									{connectors?.length && vendorLineItem?.connectorItemData ? <img
										className="sapnumber"
										src={connectorImages?.[vendorLineItem?.connectorItemData?.type]}
										alt="connector Image"
									/> : ''}
									{connectors?.length && vendorLineItem?.connectorItemData ? <span className='sapnumber hot-link' onClick={()=>{vendorLineItem?.connectorItemData?.url && window.open(vendorLineItem?.connectorItemData?.url)}}>{vendorLineItem?.connectorItemData?.name}</span> : ''}
								</span>
							<span className='budgetid-label grey-font'>Status:</span>

							{/* <span className='status-pill' style={{ backgroundColor: `${vendorContractsStatusColors[vendorLineItem?.status]}`, color: tinycolor(StatusColors[vendorLineItem?.status]).isDark() ? 'white' : 'black', }}>
								<span className={vendorContractsStatusIcons[vendorLineItem?.status]} />
								{vendorContractsStatus[vendorLineItem?.status]}
							</span> */}
							<Button
								disabled
								variant='contained'
								startIcon={<span className={isUserGC(appInfo) ? vendorContractsStatusIcons[vendorLineItem?.status] : vendorContractsResponseStatusIcons[vendorLineItem?.status]} style={{color: 'white'}} />}
								style={{
									backgroundColor: `${isUserGC(appInfo) ? vendorContractsStatusColors[vendorLineItem?.status] : vendorContractsResponseStatusColors[vendorLineItem?.status]}`,
									color: tinycolor(vendorContractsStatusColors[vendorLineItem?.status] ? vendorContractsStatusColors[vendorLineItem?.status] : vendorContractsResponseStatusColors[vendorLineItem?.status]).isDark() ? 'white' : 'black',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									width: 'fit-content',
									paddingLeft: '10px',
									paddingRight: '10px',
									minWidth: '50px',
									height: '28px',
									textOverflow: 'ellipsis',
								}}>{isUserGC(appInfo) ? vendorContractsStatus[vendorLineItem?.status] : vendorContractsResponseStatus[vendorLineItem?.status]}
							</Button>
							<span className='last-modified-label grey-font'>Last Modified:</span><span className='grey-fontt'> {vendorLineItem?.modifiedOn ? stringToUSDateTime2(vendorLineItem?.modifiedOn) : ''} by {vendorLineItem?.modifiedBy?.displayName}</span>
						</div>
						<span className='kpi-right-container'>
							<span className='kpi-name'>Original Contract Amount <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(vendorLineItem?.amount)}</span>
							<span className='kpi-name'>Change Order Amount <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(vendorLineItem?.changeOrderAmount)}</span>
							<span className='kpi-name'>Remaining Amount <span className='bold'>{currencySymbol}</span></span><span className='bold amount' style={{backgroundColor: Number(vendorLineItem?.remainingAmount) >= 0 ? '#c9e59f' : '#f7adad'}}>{vendorLineItem?.remainingAmount ? getAmountAlignment(vendorLineItem?.remainingAmount) : 0}</span>
						</span>
					</div>}
				<div className='header-buttons-container'>
					<IconButton className={`header-button`} aria-label={collapsed === true ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(pCollapsed => !pCollapsed)}>
						{collapsed === true ? <ExpandMore fontSize='small' /> : <ExpandLess fontSize='small' />}
					</IconButton>
					{!collapsed && <IconButton className={`header-button ${pinned === true ? 'btn-focused' : ''}`} aria-label={pinned === true ? 'Pinned' : 'Not Pinned'} onClick={() => setPinned(pPinned => !pPinned)}>
						{<PushPin fontSize='small' className={`pin ${pinned === true ? 'focused' : ''}`} {...(pinned === true ? {color: 'primary'} : {})} />}
					</IconButton>}
				</div>
			</div>
			<div className='tab-panel-container' style={{maxHeight: (collapsed ? 'calc(100% - 9.75em)' : 'calc(100% - 12.5em)')}}>
				<IQObjectPage
					tabs={tabConfig}
					defaultTabId={tab}
					scroll={(value: any) => onScroll(value)}
					onTabChange={(value: any) => tabSelectedValue(value)}
					tabPadValue={10}
				/>
			</div>
		</div >
	);
};

export default VendorContractsLineItem;