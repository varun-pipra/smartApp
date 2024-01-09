import {Close, ExpandLess, ExpandMore, PushPinOutlined as PushPin} from '@mui/icons-material';
import {IconButton, Paper, Stack} from '@mui/material';
import {useAppDispatch, useAppSelector, useHotLink} from 'app/hooks';
import React, {useState, useRef, useEffect} from 'react';
import 'utilities/presence/PresenceManager.css';
import './LineItemDetails.scss';
import {setLineItemDescription, showRightPannel} from '../operations/tableColumnsSlice';
import BalanceModification from 'resources/images/budgetManager/BalanceModification.svg';
import BudgetModification from 'resources/images/budgetManager/BudgetModification.svg';
import DirectCost from 'resources/images/budgetManager/DirectCost.png';
import TransferIn from 'resources/images/budgetManager/TransferIn.svg';
import TransferOut from 'resources/images/budgetManager/TransferOut.svg';
import {amountFormatWithOutSymbol} from 'app/common/userLoginUtils';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import Toast from 'components/toast/Toast';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import PresenceManager from 'utilities/presence/PresenceManager.js';
import {AddDescription} from '../headerPinning/AddDescription';
import CommittedTransaction from './tabs/committed/CommittedTransaction';
import BudgetDetails from './tabs/details/BudgetDetails';
import ForecastTransactions from './tabs/forecast/ForecastTransactions';
import CreateBudgetTransfer from './transactionForms/budgettransfer/BudgetTransferForm';
import AddDirectCostForm from './transactionForms/directcost/DirectCostForm';

import {getServer} from 'app/common/appInfoSlice';
import {postMessage} from 'app/utils';
import {setOpenBudgetTransferForm, setOpenCostForm, setOpenTransactionList, fetchRollupTaskData, fetchCompanyList} from 'features/budgetmanager/operations/rightPanelSlice';
import {stringToUSDateTime2} from 'utilities/commonFunctions';
import {SUIToast} from 'sui-components/Toast/Suitoast';
import {fetchTransactionsData} from 'features/budgetmanager/operations/transactionsSlice';
import {fetchForecastData} from 'features/budgetmanager/operations/forecastSlice';
import {fetchLineItemData} from '../operations/gridSlice';

export interface headerprops {
	image: any;
	close: () => void;
	budgetdetailsdata: (data: any) => void;
}

const LineItemDetails = (props: headerprops) => {
	const dispatch = useAppDispatch();
	const ref = React.useRef<HTMLDivElement | null>(null);
	const {selectedRow} = useAppSelector(state => state.rightPanel);
	const {transactionsData} = useAppSelector(state => state.transactionsData);
	const {forecastData} = useAppSelector(state => state.forecast);
	const {lineItemDescription} = useAppSelector(state => state?.tableColumns);
	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const {openCostForm, openBudgetTransferForm} = useAppSelector(state => state.rightPanel);
	const [showFullHeader, setShowFullHeader] = React.useState<boolean>(true);
	const presenceRef = React.useRef(false);
	const presenceId = 'budgetmanager-lineitem-presence';
	const presenceId1 = 'budgetmanager-lineitem-presence1';
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(true);
	const [tabSelected, setTabSelected] = React.useState<any>('budget-details');
	const [showToast, setShowToast] = React.useState<any>({displayToast: false, message: ''});
	const rightPannel = useAppSelector(showRightPannel);
	const tabid = useRef('budget-details');

	const presenceTools = <React.Fragment>{
		<>
			<div id={presenceId} className='budgetmanager-presence'></div>
		</>
	}</React.Fragment>;

	setTimeout(() => {
		showToast?.displayToast && setShowToast({displayToast: false, message: ''});
	}, 1000);

	const [transactionHeader, setTransactionHeader] = React.useState<any>();
	const iconObj: any = {
		1: DirectCost,
		2: BudgetModification,
		3: BalanceModification,
		4: TransferIn,
		5: TransferOut
	};

	const header = `${selectedRow?.name} - ${selectedRow.division} - ${selectedRow.costCode} : ${selectedRow.costType}`;

	React.useEffect(() => {presenceRef.current = false;}, [selectedRow, showFullHeader]);

	React.useEffect(() => {
		if(presenceRef.current) return;
		presenceRef.current = true;
		// postMessage({
		// 	event: 'exitroom',
		// 	body: { iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem' }
		// });
		renderPresence();
		renderPresence1();
	}, [selectedRow, showFullHeader]);

	React.useEffect(() => {
		if(selectedRow?.id) {
			dispatch(fetchRollupTaskData({'appInfo': appInfo}));
			dispatch(fetchCompanyList({'appInfo': appInfo}));
			dispatch(setLineItemDescription(selectedRow.description));
			dispatch(fetchTransactionsData({'appInfo': appInfo, id: selectedRow.id}));
			dispatch(fetchForecastData({'appInfo': appInfo, id: selectedRow.id}));
			dispatch(fetchLineItemData({'appInfo': appInfo, id: selectedRow.id}));

			const interval = setInterval(() => {
				if(rightPannel) {
					dispatch(fetchTransactionsData({'appInfo': appInfo, id: selectedRow.id}));
					dispatch(fetchForecastData({'appInfo': appInfo, id: selectedRow.id}));
					dispatch(fetchLineItemData({'appInfo': appInfo, id: selectedRow.id}));
				}
			}, 10000);
			return () => clearInterval(interval);
		}
	}, [selectedRow?.id]);

	const budgetDetailsOnChange = (data: any) => {
		props.budgetdetailsdata(data);
	};

	const addPresenceListener = (presenceManager: any) => {

		if(presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;
			participantCtrl.addEventListener('livelinkbtnclick', function (e: any) {
				postMessage({
					event: 'launchcommonlivelink',
					body: {iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('livesupportbtnclick', function (e: any) {
				help(true);
			});
			participantCtrl.addEventListener('streambuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommonstream',
					body: {iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommoncomment',
					body: {iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem'},
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
					body: {iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem'},
					livechatData: {participantsIds: participantids}
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: {iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem'},
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
					body: {iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem'},
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'hover'
					}
				});
			});
			document.addEventListener('updateparticipants', function (event: any) {
				if(participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if(event.detail.appType === 'BudgetManagerLineItem') {
					// console.log('Right panel presence',event);
					participantCtrl.updateParticipants(event.detail.data);
				}
			});
			document.addEventListener('updatecommentbadge', function (event: any) {
				if(participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if(event.detail.appType === 'BudgetManagerLineItem') {
					let chatCount = event.detail.data,
						animation = (chatCount.eventType === 'commentReceived') ? true : false;
					participantCtrl.setButtonBadge('comment', chatCount.count, animation);
				}
			});
			postMessage({
				event: 'joinroom',
				body: {iframeId: 'budgetManagerIframe', roomId: selectedRow.id, appType: 'BudgetManagerLineItem', roomTitle: selectedRow?.name}
			});
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager);
		}, 1000);
	};

	const help = (isFromHelpIcon: any) => {
		const body = {iframeId: "budgetManagerIframe", roomId: selectedRow.id, appType: "BudgetManagerLineItem", tabName: tabid.current, isFromHelpIcon: isFromHelpIcon};
		postMessage({
			event: "help",
			body: body
		});
	};

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
	const renderPresence1 = () => {
		let presenceManager = new PresenceManager({
			domElementId: presenceId1,
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

	const tabConfig = [{
		tabId: 'budget-details',
		label: 'Budget Details',
		showCount: false,
		// icon: (tabSelected === 'budget-details' ? <span className='common-icon-budget-manager tabicon tabicon_orange' /> : <span className='common-icon-budget-manager tabicon' />),
		iconCls: 'common-icon-budget-manager',
		content: <div><BudgetDetails onFormSubmit={(value) => budgetDetailsOnChange(value)} tabSelectedValue={tabSelected} toast={(value: any) => (setShowToast(value))} /></div>
	}, {
		tabId: 'transactions',
		showCount: true,
		count: transactionsData.length,
		label: 'Transactions',
		// icon: (tabSelected === 'transactions' ? <span className='common-icon-transactions tabicon tabicon_orange' /> : <span className='common-icon-transactions tabicon' />),
		iconCls: 'common-icon-transactions',
		content: <CommittedTransaction transactiondata={(value: any) => setTransactionHeader(value)} />
	}, {
		tabId: 'forecast',
		label: 'Forecast',
		showCount: true,
		count: forecastData.length,
		// icon: (tabSelected === 'forecast' ? <span className='common-icon-ForecastNew tabicon tabicon_orange' /> : <span className='common-icon-ForecastNew tabicon' />),
		iconCls: 'common-icon-ForecastNew',
		content: <ForecastTransactions />
	},
		// {
		// 	tabId: 'analysis',
		// 	label: 'Analysis',
		// 	showCount: false,
		// 	// icon: (tabSelected === 'analysis' ? <span className='common-icon-ReportsAnalyticsNew tabicon tabicon_orange' /> : <span className='common-icon-ReportsAnalyticsNew tabicon' />),
		// 	iconCls: 'common-icon-ReportsAnalyticsNew',
		// 	content: <div style={{padding: '1em 0', fontWeight: "bold"}}>{"Analysis"}</div>
		// }
	];

	return (
		<div className='budget-lineitem-detail-panel' ref={ref}>
			<div className='details-header'>
				<span className='title'>{header}</span>
				<IconButton className='closebutton' aria-label='Close Right Pane' onClick={() => props.close()}>
					<Close />
				</IconButton>
			</div>
			<div className='presence-section'>
				<div className='presence-tools'>
					{[presenceTools].map((presenceTool: any) => presenceTool)}
				</div>
			</div>
			<div className='kpi-section'>
				{collapsed === true ? <div className='kpi-horizontal-container'>
					<span className='kpi-tile'><span className='kpi-name'>Original Budget</span><span className='bold'>{currencySymbol} <span className='amount'>{amountFormatWithOutSymbol(selectedRow?.originalAmount)}</span></span></span>
					<span className='kpi-tile'><span className='kpi-name'>Revised Budget</span><span className='bold'>{currencySymbol} <span className='amount'>{amountFormatWithOutSymbol(selectedRow?.revisedBudget)}</span></span></span>
					<span className='kpi-tile'><span className='kpi-name'>Remaining Balance</span><span className='bold'>{currencySymbol} <span className={`amount ${selectedRow.balance >= 0 ? 'positive' : 'negative'}`}>{amountFormatWithOutSymbol(selectedRow.balance)}</span></span></span>
				</div> :
					<div className='kpi-vertical-container'>
						<div className='lid-details-container'>
							<AddDescription value={!lineItemDescription ? '' : lineItemDescription} showicon={false} />
							<span className='budgetid-label grey-font'>Budget ID:</span><span className='grey-font'> {selectedRow?.name}</span>
							<span className='last-modified-label grey-font'>Last Modified:</span><span className='grey-font'> {stringToUSDateTime2(selectedRow.modifiedDate)} by {selectedRow.modifiedBy?.displayName}</span>
						</div>
						<span className='kpi-right-container'>
							<span className='kpi-name'>Original Budget <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(selectedRow?.originalAmount)}</span>
							<span className='kpi-name'>Revised Budget <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(selectedRow?.revisedBudget)}</span>
							<span className='kpi-name'>Remaining Balance <span className='bold'>{currencySymbol}</span></span><span className={`bold amount ${selectedRow.balance >= 0 ? 'positive' : 'negative'}`}>{amountFormatWithOutSymbol(selectedRow?.balance)}</span>
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
			<div className='tab-panel-container' style={{maxHeight: (collapsed ? 'calc(100% - 9.5em)' : 'calc(100% - 12.5em)')}}>
				<IQObjectPage
					tabs={tabConfig}
					scroll={(value: any) => onScroll(value)}
					onTabChange={(value: any) => tabSelectedValue(value)}
				/>
			</div>
			{showToast.displayToast ? <Toast message={showToast.message} interval={1000} /> : null}
			{selectedRow?.source === 1 && <SUIToast
				message={
					<div className='message-content'>
						<p>New Budget Line Item automatically created by the System due to the approval of a recent Change Event.</p>
						<p>Change Event ID: <a
							onClick={() => window.open(useHotLink(`change-event-requests/home?id=${selectedRow.changeEvent?.id}`), '_blank')}
						>{selectedRow.changeEvent?.code}</a></p>
					</div>
				}
				showclose={true} />}
			{(openBudgetTransferForm || openCostForm) &&
				<SUIDrawer
					PaperProps={{style: {position: 'absolute', height: 'fit-content', display: 'block', overflow: 'auto', marginTop: '6.2%', marginRight: '20px', boxShadow: '0 4px 8px 1px rgb(0 0 0 / 25%)'}}}
					anchor='right'
					variant='permanent'
				>
					<Paper
						sx={{width: '58vw', height: '99.5%', paddingBottom: '15px', border: '1px solid rgba(0, 0, 0, 0.12) !important'}}
						role='presentation'
						elevation={24}
					>
						<Stack direction="row" alignItems="center" style={{padding: '10px 10px 10px 20px'}} className='mainadditem'>
							<Stack direction="row" alignItems="center" style={{width: '95%', }}>
								<img src={iconObj[transactionHeader.type]} style={{width: '30px'}} />
								<span className='addTranscation_heading'>{transactionHeader.primaryHeader}</span>
								<span className='addTransscation_subheading'>{openCostForm ? '(' + transactionHeader.secondaryHeader + ')' : null}</span>
							</Stack>
							<Stack direction="row" alignItems="center">
								<IQTooltip title='' placement={'bottom'}>
									<IconButton aria-label='Close Right Pane'
										onClick={() => {dispatch(setOpenCostForm(false)); dispatch(setOpenBudgetTransferForm(false)); dispatch(setOpenTransactionList(false));}}>
										<Close fontSize={'small'} />
									</IconButton>
								</IQTooltip>
							</Stack>
						</Stack>
						<div style={{height: '35%'}}>
							{
								openCostForm ? <AddDirectCostForm type={transactionHeader.type} /> : <CreateBudgetTransfer type={transactionHeader.type} />
							}
						</div>
					</Paper>
				</SUIDrawer>
			}
		</div >
	);
};

export default LineItemDetails;