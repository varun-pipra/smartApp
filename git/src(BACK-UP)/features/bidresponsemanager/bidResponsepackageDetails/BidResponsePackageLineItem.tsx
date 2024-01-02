import './BidResponsePackageLineItem.scss';

import { getServer } from 'app/common/appInfoSlice';
import { hideLoadMask, useAppDispatch, useAppSelector } from 'app/hooks';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import { ReferenceFiles } from 'features/bidresponsemanager/bidResponsepackageDetails/tabs/referenceFiles/ReferenceFiles';
import { setFiles } from 'features/bidresponsemanager/stores/FilesSlice';
import _ from 'lodash';
import { postMessage } from 'app/utils';
import PresenceManager from 'utilities/presence/PresenceManager.js';
import 'utilities/presence/PresenceManager.css';

import React, { useEffect, useState } from 'react';
import SUICountDownTimer from 'sui-components/CountDownTimer/CountDownTimer';
import { BidResponseStatus, BidResponseStatusColor } from 'utilities/bid/enums';
import { getResponseStatusIcons, getTabId } from 'utilities/bidResponse/enums';
import { formatDate } from 'utilities/datetime/DateTimeUtils';

import { Close, ExpandLess, ExpandMore, Lock, PushPinOutlined as PushPin } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { loadBidQueriesByPackageAndBidder } from 'features/bidmanager/stores/BidQueriesSlice';
import { fetchBidResponseDetailsData } from 'features/bidresponsemanager/stores/BidResponseManagerSlice';
import { fetchBidResponsedata } from 'features/bidresponsemanager/stores/BidResponseSlice';
import BidDetailsRO from '../../bidmanager/bidpackagedetails/tabs/biddetails/BidDetailsReadOnly';
import { setSelectedTabName } from '../stores/BidResponseManagerSlice';
import BidResponse from './tabs/bidResponse/BidResponse';
import BidQueries from './tabs/bidqueries/BidQueries';

var tinycolor = require('tinycolor2');

const BidResponsePackageLineItem = (props: any) => {
	const dispatch = useAppDispatch();
	const ref = React.useRef<HTMLDivElement | null>(null);
	const presenceId = 'bid-manager-lineitem-presence';
	const presenceTools = <div id={presenceId} className='bid-manager-presence'></div>;

	const [pinned, setPinned] = useState(true);
	const [collapsed, setCollapsed] = useState(false);
	const [tabSelected, setTabSelected] = useState('bid-details');
	const presenceRef = React.useRef(false);
	const [fileCount, setFileCount] = useState(0);
	const [queryCount, setQueryCount] = useState(0);
	const [intentEndDate, setIntentEndDate] = useState<any>();

	const { bidId, tab, bidderId, selectedRecord, bidDetails } = useAppSelector((state) => state.bidResponseManager);
	const { BidQueriesData } = useAppSelector((state) => state.bidQueries);	
	const tabid = React.useRef('bid-details');
	const appInfo = useAppSelector(getServer);
	const [isFromHelpIcon, setIsFromHelpIcon] = React.useState(false);

	useEffect(() => {
		if (bidId) {
			const callList: Array<any> = [
				dispatch(fetchBidResponseDetailsData({ appInfo: appInfo, responseId: bidId })),
				dispatch(fetchBidResponsedata({ appInfo: appInfo, bidderId: bidderId })),
				dispatch(loadBidQueriesByPackageAndBidder({ appInfo: appInfo, packageId: bidId, bidderId: bidderId }))
			];

			Promise.all(callList).then(() => {
				hideLoadMask();
			});
		}
	}, [appInfo, bidId]);

	useEffect(() => {
		if (bidDetails) {
			if (bidDetails.intendToBidCountdown) {
				const currentDate = new Date();
				currentDate.setHours(0, 0, 0, 0);
				currentDate.setDate(currentDate.getDate() + bidDetails.intendToBidCountdown);
				setIntentEndDate(currentDate?.toISOString());
			}
			setQueryCount(bidDetails.bidderQueryCount);
			setFileCount(bidDetails.refFileCount);
			dispatch(setFiles(bidDetails?.referenceFiles || []));
		}
		if (presenceRef.current) return;
		else {
			presenceRef.current = true;
			renderPresence();
		}
	}, [bidDetails]);

	const tabSelectedValue = (value: any) => {
		tabid.current = value;
		setTabSelected(value);
		dispatch(setSelectedTabName(value));
	};

	const onScroll = (value: any) => {
		if (pinned == false) {
			setCollapsed(value);
		}
	};

	const addPresenceListener = (presenceManager: any) => {
		if (presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;
			participantCtrl.addEventListener('livelinkbtnclick', function (e: any) {
				postMessage({
					event: 'launchcommonlivelink',
					body: { iframeId: 'bidManagerIframe', roomId: selectedRecord?.id, appType: 'BidManagerLineItem' },
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('livesupportbtnclick', function (e: any) {
				help(true);
			});
			participantCtrl.addEventListener('streambuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommonstream',
					body: { iframeId: 'bidManagerIframe', roomId: selectedRecord?.id, appType: 'BidManagerLineItem' },
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommoncomment',
					body: { iframeId: 'bidManagerIframe', roomId: selectedRecord?.id, appType: 'BidManagerLineItem' },
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('presencecountclick', function (e: any) {
				let participantsjson = participantCtrl.getParticipants(),
					participantids = [];
				if (participantsjson) {
					for (var i = 0; i < participantsjson.length; i++) {
						participantids.push((participantsjson[i].userid));
					}
				}
				postMessage({
					event: 'launchlivechat',
					body: { iframeId: 'bidManagerIframe', roomId: selectedRecord?.id, appType: 'BidManagerLineItem' },
					livechatData: { participantsIds: participantids }
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: { iframeId: 'bidManagerIframe', roomId: selectedRecord?.id, appType: 'BidManagerLineItem' },
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
					body: { iframeId: 'bidManagerIframe', roomId: selectedRecord?.id, appType: 'BidManagerLineItem' },
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'hover'
					}
				});
			});
			document.addEventListener('updateparticipants', function (event: any) {
				console.log('updateparticipants', event.detail)
				if (participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if (event.detail.appType === 'BidManagerLineItem') {
					participantCtrl.updateParticipants(event.detail.data);
				}
			});
			document.addEventListener('updatecommentbadge', function (event: any) {
				if (participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if (event.detail.appType === 'BidManagerLineItem') {
					let chatCount = event.detail.data,
						animation = (chatCount.eventType === 'commentReceived') ? true : false;
					participantCtrl.setButtonBadge('comment', chatCount.count, animation);
				}
			});
			postMessage({
				event: 'joinroom',
				body: { iframeId: 'bidManagerIframe', roomId: selectedRecord?.id, appType: 'BidManagerLineItem', roomTitle: selectedRecord?.name }
			});
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager);
		}, 1000);
	};

	const renderPresence = () => {
		let presenceManager = new PresenceManager({
			domElementId: presenceId,
			initialconfig: {
				'showLiveSupport': true,
				'showLiveLink': false,
				'showStreams': false,
				'showComments': false,
				'showChat': false,
				'hideProfile': false,
				'participants': [appInfo.currentUserInfo]
			}
		});
		addPresenceListener(presenceManager);
	};

	const bidResponseTabReadOnly = () => {
		return [5].includes(selectedRecord?.responseStatus);
	};

	const tabConfig = [
		{
			tabId: 'bid-details',
			label: 'Bid Details',
			showCount: false,
			icon: (tabSelected === 'bid-details' ? <span className='common-icon-Biddetailsgray tabicon tabicon_orange' /> : <span className='common-icon-Biddetailsgray tabicon' />),
			content: <BidDetailsRO data={bidDetails} isResponseManager={true} responseStatus={selectedRecord?.responseStatus} />
		}, {
			tabId: 'reference-files',
			label: 'Reference Files',
			showCount: true,
			count: fileCount,
			icon: (tabSelected === 'reference-files' ? <span className='common-icon-contract-files tabicon tabicon_orange' /> : <span className='common-icon-contract-files tabicon' />),
			content: <ReferenceFiles />
		}, {
			tabId: 'bid-queries',
			label: 'Bid Queries',
			showCount: true,
			count: BidQueriesData?.length,
			disabled: [0, 1, 4].includes(selectedRecord?.responseStatus),
			icon: (tabSelected === 'bid-queries' ? <span className='common-icon-BidQueries bidqueries_tabicon tabicon_orange ' /> : <span className='common-icon-BidQueries bidqueries_tabicon' />),
			content: <BidQueries />,

		}, {
			tabId: 'bidResponse',
			label: <>Bid Response {[0, 1, 4].includes(selectedRecord?.responseStatus) ? <Lock style={{ opacity: 0.5 }} /> : ''}</>,
			showCount: false,
			disabled: [0, 1, 4].includes(selectedRecord?.responseStatus),
			icon: (tabSelected === 'bidResponse' ? <span className='common-icon-biddersgray tabicon tabicon_orange' /> : <span className='common-icon-biddersgray tabicon' />),
			content: <BidResponse
				key={JSON.stringify(bidResponseTabReadOnly())}
				readOnly={bidResponseTabReadOnly()}
				iFrameId='bidResponseManagerIframe'
				appType='BidResponseManager'
			/>
		}
	];

	React.useEffect(() => {
		if (tabSelected) {
			help(false)
		}
	}, [tabSelected]);



	const help = (isFromHelpIcon: any) => {
		const body = { iframeId: "bidResponseManagerIframe", roomId: selectedRecord?.id, appType: "BidResponseManager", tabName: getTabId(tabid.current), isFromHelpIcon: isFromHelpIcon }
		console.log('help', body)
		postMessage({
			event: "help",
			body: body
		});
	}

	return <div className='bidResponse-package-lineitem-detail' ref={ref}>
		<div className='details-header'>
			<span className='title'>{selectedRecord?.name}</span>
			<div style={{ gap: '6px', top: '2px' }}>
				<IconButton className='closebutton' aria-label='Close Right Pane' onClick={() => props.close()}>
					<Close />
				</IconButton>
			</div>
		</div>
		<div className='presence-section'>
			<div className='presence-tools'>
				{[presenceTools].map((presenceTool: any) => presenceTool)}
			</div>
		</div>
		<div className='page-header-section'>
			<div className='collapsible-section'>
				<span className='left-box'>
					<div className='head-info-box'>
						<div className='head-info-box'>
							<span className='submit-by-label'><span className='common-icon-briefcaseclockoutline'></span>Submit by</span>
							<span className='submit-by-date'>{formatDate(bidDetails?.endDate)}</span>
						</div>
					</div>
					{collapsed === false ? <div className='head-info-box'>
						<span className='status-label'>Status:</span>
						<span className='status-pill' style={{
							backgroundColor: `${BidResponseStatusColor[selectedRecord?.responseStatus]}`,
							color: tinycolor(BidResponseStatusColor[selectedRecord?.responseStatus]).isDark() ? 'white' : 'black',
						}}>
							<span className={getResponseStatusIcons(selectedRecord?.responseStatus)} />
							{BidResponseStatus[selectedRecord?.responseStatus]}
						</span>
					</div> : ''}
				</span>
				<span className='right-box'>
					{selectedRecord?.responseStatus === 0 && intentEndDate ? <div className='head-info-box'>
						<span className='timer-label'><span className='common-icon-CurrentTime'></span>Time left for Bid Intend</span>
						<span><SUICountDownTimer targetDate={intentEndDate} /></span>
					</div> : ''}
					{[2, 3].includes(selectedRecord?.responseStatus) ? <div className='head-info-box'>
						<span className='timer-label'>Time left to Bid</span>
						<span><SUICountDownTimer targetDate={bidDetails?.endDate} /></span>
					</div> : ''}
					{selectedRecord?.responseStatus === 5 && !_.isEmpty(selectedRecord?.respondedOn) ? <div className='head-info-box'>
						<span className='responded-label'>Responded on</span>
						<span className='responded-value'>{formatDate(selectedRecord?.respondedOn)}</span>
					</div> : ''}
				</span>
			</div>
			<div className='header-buttons-container'>
				<IconButton className={`header-button`} aria-label={collapsed === true ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(pCollapsed => !pCollapsed)}>
					{collapsed === true ? <ExpandMore fontSize='small' /> : <ExpandLess fontSize='small' />}
				</IconButton>
				{!collapsed && <IconButton className={`header-button ${pinned === true ? 'btn-focused' : ''}`} aria-label={pinned === true ? 'Pinned' : 'Not Pinned'} onClick={() => setPinned(pPinned => !pPinned)}>
					{<PushPin fontSize='small' className={`pin ${pinned === true ? 'focused' : ''}`} {...(pinned === true ? { color: 'primary' } : {})} />}
				</IconButton>}
			</div>
		</div>
		<div className='tab-panel-container' style={{ maxHeight: (collapsed ? 'calc(100% - 4.5em)' : 'calc(100% - 7em)') }}>
			<IQObjectPage
				tabs={tabConfig}
				defaultTabId={tab}
				scroll={(value: any) => onScroll(value)}
				onTabChange={(value: any) => tabSelectedValue(value)}
				tabPadValue={10}
			/>
		</div>
	</div>;
};

export default BidResponsePackageLineItem;