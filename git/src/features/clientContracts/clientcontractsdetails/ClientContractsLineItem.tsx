import {Fragment, useEffect, useRef, useState} from 'react';
import {hideLoadMask, useAppDispatch, useAppSelector} from 'app/hooks';
import {postMessage} from 'app/utils';
import {Button, IconButton, TextField} from '@mui/material';
import {Close, ExpandMore, ExpandLess, PushPinOutlined as PushPin} from '@mui/icons-material';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import './ClientContractsLineItem.scss';
import PresenceManager from 'utilities/presence/PresenceManager.js';
import ClientContractScheduleValues from './tabs/schedulevalues/ClientContractsScheduleValues';
import CCBillingSchedule from './tabs/billingschedule/CCBillingSchedule';

import 'utilities/presence/PresenceManager.css';

import {getServer} from 'app/common/appInfoSlice';
import ClientContractDetails from './tabs/clientcontractdetails/ClientContractDetails';
import CommittedTransaction from './tabs/transactions/CCCommittedTransaction';
import ForecastTransactions from './tabs/forecast/ForecastTransactions';
import ChangeEvents from './tabs/changeevents/CCChangeEvents';
import PaymentLedger from './tabs/paymentledger/CCPaymentLedger';
import {vendorContractsStatus, vendorContractsStatusColors, vendorContractsStatusIcons, vendorContractsResponseStatus, vendorContractsResponseStatusColors, vendorContractsResponseStatusIcons} from 'utilities/vendorContracts/enums';
import {getClientContractDetails, getSelectedRecord, getUserRoleDetails, getClientCompanies} from 'features/clientContracts/stores/ClientContractsSlice';
import ClientContractFiles from './tabs/clientcontractfiles/ClientContractFiles';
import {getAmountAlignment} from 'utilities/commonutills';
import {updateClientContractDetails} from '../stores/gridAPI';
import {stringToUSDateTime2} from 'utilities/commonFunctions';
import {getClientContractsList} from '../stores/gridSlice';
import {getClientContractsForecasts, getForecastsCount} from '../stores/ForecastsSlice';
import {fetchTransactions, getTransactionCount} from '../stores/tabs/transactions/TransactionTabSlice';
import {getContractFilesCount} from '../stores/tabs/contractfiles/CCContractFilesTabSlice';
import {isUserGCForCC} from '../utils';
import {getCCPaymentLedgerList, getPaymentLedgerCount} from '../stores/PaymentLedgerSlice';
import {getCCChangeEventsList} from '../stores/CCChangeEventsSlice';
import {amountFormatWithOutSymbol} from 'app/common/userLoginUtils';
import BlockchainIB from 'features/common/informationBubble/BlockchainIB';

const tinycolor = require('tinycolor2');

export interface headerprops {
	close: () => void;
	showBCInfo: boolean;
}

const ClientContractsLineItem = (props: headerprops) => {
	const dispatch = useAppDispatch();
	const presenceId = 'clientcontract-lineitem-presence';
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const appInfo = useAppSelector(getServer);
	const contractLineItem: any = useAppSelector(getSelectedRecord);
	const {contractId, tab} = useAppSelector((state) => state.clientContracts);
	const forecastsCount = useAppSelector(getForecastsCount);
	const {unLockedSov} = useAppSelector((state) => state.cCBillingSchedule);
	const payMentLedgerCount = useAppSelector(getPaymentLedgerCount);
	const {changeEventsCount} = useAppSelector((state) => state.ccChangeEvents);
	// Use State 
	const presenceRef = useRef(false);
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(true);
	const [tabSelected, setTabSelected] = useState('contract-details');
	const [title, setTitle] = useState(contractLineItem?.title);
	const txnCount = useAppSelector(getTransactionCount);
	const filesCount = useAppSelector(getContractFilesCount);
	const tabid = useRef('contract-details');
	// console.log('contractLineItem', contractLineItem);
	const presenceTools = <Fragment>{
		<>
			<div id={presenceId} className='clientcontract-presence'></div>
		</>
	}</Fragment>;


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

	useEffect(() => {presenceRef.current = false;}, [contractLineItem]);
	useEffect(() => {setTitle(contractLineItem?.title);}, [contractLineItem?.title]);

	useEffect(() => {
		if(presenceRef.current) return;
		presenceRef.current = true;
		renderPresence();
	}, [contractLineItem]);

	useEffect(() => {
		if(contractId) {
			const payload = {appInfo: appInfo, packageId: contractId},
				callList: Array<any> = [
					dispatch(getClientContractDetails(payload)),
					dispatch(getUserRoleDetails(appInfo)),
					dispatch(getClientCompanies(appInfo)),
					dispatch(fetchTransactions(payload)),
					dispatch(getCCPaymentLedgerList({appInfo: appInfo, id: contractId})),
					dispatch(getCCChangeEventsList({appInfo: appInfo, id: contractId})),
					dispatch(getClientContractsForecasts(payload))
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
					body: {iframeId: 'clientContractsIframe', roomId: contractLineItem?.id, appType: 'ClientContractsLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('livesupportbtnclick', function (e: any) {
				help(true);
			});
			participantCtrl.addEventListener('streambuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommonstream',
					body: {iframeId: 'clientContractsIframe', roomId: contractLineItem?.id, appType: 'ClientContractsLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommoncomment',
					body: {iframeId: 'clientContractsIframe', roomId: contractLineItem?.id, appType: 'ClientContractsLineItem'},
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
					body: {iframeId: 'clientContractsIframe', roomId: contractLineItem?.id, appType: 'ClientContractsLineItem'},
					livechatData: {participantsIds: participantids}
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: {iframeId: 'clientContractsIframe', roomId: contractLineItem?.id, appType: 'ClientContractsLineItem'},
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
					body: {iframeId: 'clientContractsIframe', roomId: contractLineItem?.id, appType: 'ClientContractsLineItem'},
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
				if(event.detail.appType === 'ClientContractsLineItem') {
					// console.log('Right panel presence',event);
					participantCtrl.updateParticipants(event.detail.data);
				}
			});
			document.addEventListener('updatecommentbadge', function (event: any) {
				if(participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if(event.detail.appType === 'ClientContractsLineItem') {
					let chatCount = event.detail.data,
						animation = (chatCount.eventType === 'commentReceived') ? true : false;
					participantCtrl.setButtonBadge('comment', chatCount.count, animation);
				}
			});
			postMessage({
				event: 'joinroom',
				body: {iframeId: 'clientContractsIframe', roomId: contractLineItem?.id, appType: 'ClientContractsLineItem', roomTitle: contractLineItem?.title}
			});
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager);
		}, 1000);
	};
	const help = (isFromHelpIcon: any) => {
		console.log('useref', tabid.current);
		const body = {iframeId: "clientContractsIframe", roomId: contractLineItem?.id, appType: "ClientContractsLineItem", tabName: tabid.current, isFromHelpIcon: isFromHelpIcon};
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
			iconCls: 'common-icon-contracts',
			content: <ClientContractDetails readOnly={isUserGCForCC(appInfo) ? ['Draft', 'ReadyToSubmit', 'AwaitingAcceptanceUnlocked', 'ActiveUnlocked', 'ActiveUnlockedPendingSOVUpdate']?.includes(contractLineItem?.status) ? false : true : true} />
		}, {
			tabId: 'schedule-of-Values',
			label: 'Schedule of Values',
			iconCls: 'common-icon-schedule-values',
			content: <ClientContractScheduleValues readOnly={isUserGCForCC(appInfo) ? ['Draft', 'ReadyToSubmit', 'AwaitingAcceptanceUnlocked', 'ActiveUnlocked', 'ActiveUnlockedPendingSOVUpdate']?.includes(contractLineItem?.status) ? false : true : true} ></ClientContractScheduleValues>
		}, {
			tabId: 'billing-Schedule',
			label: 'Billing Schedule',
			iconCls: 'common-icon-billing-schedule',
			content: <CCBillingSchedule readOnly={isUserGCForCC(appInfo) ? contractLineItem?.includeEntireBudget == null || !contractLineItem?.budgetItems ? true : ['Draft', 'ReadyToSubmit']?.includes(contractLineItem?.status) || unLockedSov ? false : true : true}></CCBillingSchedule>
		}, {
			tabId: 'contract-Files',
			label: 'Contract Files',
			showCount: (filesCount > 0),
			count: filesCount,
			iconCls: 'common-icon-contract-files',
			content: <ClientContractFiles readOnly={isUserGCForCC(appInfo) ? ['Draft', 'ReadyToSubmit', 'AwaitingAcceptanceUnlocked', 'ActiveUnlocked', 'ActiveUnlockedPendingSOVUpdate']?.includes(contractLineItem?.status) || unLockedSov ? false : true : true} />
		}, {
			tabId: 'change-Events',
			label: 'Change Events',
			iconCls: 'common-icon-change-events',
			content: <ChangeEvents />,
			count: changeEventsCount,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(contractLineItem?.status) ? true : false,
		}, {
			tabId: 'payment-Ledger',
			label: 'Payment Ledger',
			iconCls: 'common-icon-payment-ledger',
			showCount: (payMentLedgerCount > 0),
			count: payMentLedgerCount,
			content: <PaymentLedger />,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(contractLineItem?.status) ? true : false,
		}, {
			tabId: 'transactions',
			label: 'Transactions',
			showCount: (txnCount > 0),
			count: txnCount,
			iconCls: 'common-icon-transactions',
			content: <CommittedTransaction />,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(contractLineItem?.status) ? true : false,
		}, {
			tabId: 'forecast',
			label: 'Forecast',
			showCount: (forecastsCount > 0),
			count: forecastsCount,
			iconCls: 'common-icon-forecast',
			content: <ForecastTransactions />,
			showTab: ['Active', 'ActiveUnlocked', 'ActivePendingSOVUpdate', 'ActiveUnlockedPendingSOVUpdate']?.includes(contractLineItem?.status) ? true : false,
		}
	];

	return (
		<div className='Client-lineitem-detail-panel'>
			<div className='details-header'>
				{isUserGCForCC(appInfo) && ['ActiveUnlocked', 'AwaitingAcceptanceUnlocked', 'Draft', 'ReadyToSubmit'].includes(contractLineItem?.status) ? <TextField className='textField' variant='outlined' value={title}
					onChange={(e: any) => setTitle(e.target?.value)} onBlur={(e) => {updateClientContractDetails(appInfo, contractLineItem?.id, {title: title}, (response: any) => {dispatch(getClientContractsList(appInfo));});}} />
					: <span className='textField'>{contractLineItem?.title || ''}</span>
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
						<span className='kpi-tile'><span className='kpi-name'>Contract Amount</span><span className='bold'>{currencySymbol} <span className='amount'>{amountFormatWithOutSymbol(contractLineItem?.totalAmount)}</span></span></span>
						<span className='kpi-tile'><span className='kpi-name'>Change Order Amount</span><span className='bold'>{currencySymbol} <span className='amount'>{amountFormatWithOutSymbol(contractLineItem?.changeOrderAmount)}</span></span></span>
						<span className='kpi-tile'><span className='kpi-name'>Remaining Amount</span><span className='bold'>{currencySymbol} <span className={`amount`} style={{backgroundColor: Number(contractLineItem?.remainingAmount) >= 0 ? '#c9e59f' : '#f7adad'}}>{amountFormatWithOutSymbol(contractLineItem?.remainingAmount)}</span></span></span>
					</div>
					:
					<div className='kpi-vertical-container'>
						<div className='lid-details-container'>
							<span className='budgetid-label grey-font'>Contract ID:</span><span className='grey-fontt'>{contractLineItem?.code}</span>
							<span className='budgetid-label grey-font'>Status:</span>
							<Button
								disabled
								variant='contained'
								startIcon={<span className={isUserGCForCC(appInfo) ? vendorContractsStatusIcons[contractLineItem?.status] : vendorContractsResponseStatusIcons[contractLineItem?.status]} style={{color: 'white'}} />}
								style={{
									backgroundColor: `${isUserGCForCC(appInfo) ? vendorContractsStatusColors[contractLineItem?.status] : vendorContractsResponseStatusColors[contractLineItem?.status]}`,
									color: tinycolor(vendorContractsStatusColors[contractLineItem?.status] ? vendorContractsStatusColors[contractLineItem?.status] : vendorContractsResponseStatusColors[contractLineItem?.status]).isDark() ? 'white' : 'black',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									width: 'fit-content',
									paddingLeft: '10px',
									paddingRight: '10px',
									minWidth: '50px',
									textOverflow: 'ellipsis',
								}}>{isUserGCForCC(appInfo) ? vendorContractsStatus[contractLineItem?.status] : vendorContractsResponseStatus[contractLineItem?.status]}
							</Button>
							<span className='last-modified-label grey-font'>Last Modified:</span><span className='grey-fontt'> {contractLineItem?.modifiedOn ? stringToUSDateTime2(contractLineItem?.modifiedOn) : ''} by {contractLineItem?.modifiedBy?.displayName}</span>
						</div>
						<span className='kpi-right-container'>
							<span className='kpi-name'>Contract Amount <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(contractLineItem?.totalAmount)}</span>
							<span className='kpi-name'>Change Order Amount <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(contractLineItem?.changeOrderAmount)}</span>
							<span className='kpi-name'>Remaining Amount <span className='bold'>{currencySymbol}</span></span><span className='bold amount' style={{backgroundColor: Number(contractLineItem?.remainingAmount) >= 0 ? '#c9e59f' : '#f7adad'}}>{amountFormatWithOutSymbol(contractLineItem?.remainingAmount)}</span>
						</span >
					</div >}
				<div className='header-buttons-container'>
					<IconButton className={`header-button`} aria-label={collapsed === true ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(pCollapsed => !pCollapsed)}>
						{collapsed === true ? <ExpandMore fontSize='small' /> : <ExpandLess fontSize='small' />}
					</IconButton>
					{!collapsed && <IconButton className={`header-button ${pinned === true ? 'btn-focused' : ''}`} aria-label={pinned === true ? 'Pinned' : 'Not Pinned'} onClick={() => setPinned(pPinned => !pPinned)}>
						{<PushPin fontSize='small' className={`pin ${pinned === true ? 'focused' : ''}`} {...(pinned === true ? {color: 'primary'} : {})} />}
					</IconButton>}
				</div>
			</div >
			<div className='tab-panel-container' style={{maxHeight: (collapsed ? 'calc(100% - 9.75em)' : 'calc(100% - 12.5em)')}}>
				<IQObjectPage
					tabs={tabConfig}
					defaultTabId={tab}
					scroll={(value: any) => onScroll(value)}
					onTabChange={(value: any) => tabSelectedValue(value)}
					tabPadValue={20}
				/>
			</div>
		</div >
	);
};
export default ClientContractsLineItem;