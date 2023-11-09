import './BidPackageLineItem.scss';
import 'utilities/presence/PresenceManager.css';

import {getServer} from 'app/common/appInfoSlice';
import {hideLoadMask, useAppDispatch, useAppSelector} from 'app/hooks';
import {postMessage} from 'app/utils';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import React, {useEffect, useState} from 'react';
import SUICountDownTimer from 'sui-components/CountDownTimer/CountDownTimer';
import {getBidStatus, StatusColors, StatusIcons} from 'utilities/bid/enums';
import {formatDate} from 'utilities/datetime/DateTimeUtils';
import PresenceManager from 'utilities/presence/PresenceManager.js';

import {Close, ExpandLess, ExpandMore, PushPinOutlined as PushPin} from '@mui/icons-material';
import {IconButton} from '@mui/material';

import {fetchVendorData} from '../../budgetmanager/operations/vendorInfoSlice';
import {fetchBiddersGriddata} from '../stores/BiddersSlice';
import {
	fetchBidPackageDetails, fetchCompanyList, fetchTeammembersByProject,
	getCompanyFilters, getSelectedRecord, setSelectedTabName
} from '../stores/BidManagerSlice';
import {loadBidQueriesByPackage} from '../stores/BidQueriesSlice';
import {setFiles} from '../stores/FilesSlice';
import AwardBid from './tabs/awardbid/AwardBid';
import Bidders from './tabs/bidders/Bidders';
import BidDetails from './tabs/biddetails/BidDetails';
import BidDetailsRO from './tabs/biddetails/BidDetailsReadOnly';
import BidQueries from './tabs/bidqueries/BidQueries';
import {ReferenceFiles} from './tabs/referencefiles/ReferenceFiles';

var tinycolor = require('tinycolor2');

const BidPackageLineItem = (props: any) => {
	const dispatch = useAppDispatch();
	const ref = React.useRef<HTMLDivElement | null>(null);
	const presenceRef = React.useRef(false);
	const presenceId = 'bid-manager-lineitem-presence';
	const presenceTools = <div id={presenceId} className='bid-manager-presence'></div>;

	const [pinned, setPinned] = useState(true);
	const [collapsed, setCollapsed] = useState(false);
	const [tabSelected, setTabSelected] = useState('bid-details');
	const [endsOn, setEndsOn] = useState<any>();
	const [fileCount, setFileCount] = useState(0);
	const [bidderCount, setBidderCount] = useState(0);
	const [queryCount, setQueryCount] = useState(0);

	const {bidId, tab} = useAppSelector((state) => state.bidManager);
	const bidLineItem: any = useAppSelector(getSelectedRecord);

	const appInfo = useAppSelector(getServer);

	useEffect(() => {
		if(bidLineItem) {
			setFileCount(bidLineItem.refFileCount);
			setBidderCount(bidLineItem.bidderCount);
			setQueryCount(bidLineItem.bidderQueryCount);

			// Do not remove the following line
			dispatch(setFiles(bidLineItem?.referenceFiles || []));
			const endDate = bidLineItem?.endDate;
			setEndsOn(formatDate(endDate));
		}

		if(presenceRef.current) return;
		else {
			presenceRef.current = true;
			renderPresence();
		}
	}, [bidLineItem]);

	useEffect(() => {
		if(bidId) {
			const payload = {appInfo: appInfo, packageId: bidId},
				callList: Array<any> = [
					dispatch(fetchBidPackageDetails(payload)),
					dispatch(fetchBiddersGriddata(payload)),
					dispatch(fetchVendorData(appInfo)),
					dispatch(fetchCompanyList(appInfo)),
					dispatch(fetchTeammembersByProject(appInfo)),
					dispatch(getCompanyFilters({appInfo: appInfo, name: 'Diverse Supplier Categories'})),
					dispatch(loadBidQueriesByPackage(payload))
				];

			Promise.all(callList).then(() => {
				hideLoadMask();
			});
		}
	}, [appInfo, bidId]);

	const tabSelectedValue = (value: any) => {
		setTabSelected(value);
		dispatch(setSelectedTabName(value));
	};

	const onScroll = (value: any) => {
		if(pinned == false) {
			setCollapsed(value);
		}
	};

	const addPresenceListener = (presenceManager: any) => {
		if(presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;
			participantCtrl.addEventListener('livelinkbtnclick', function (e: any) {
				postMessage({
					event: 'launchcommonlivelink',
					body: {iframeId: 'bidManagerIframe', roomId: bidLineItem?.id, appType: 'BidManagerLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('streambuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommonstream',
					body: {iframeId: 'bidManagerIframe', roomId: bidLineItem?.id, appType: 'BidManagerLineItem'},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
				postMessage({
					event: 'launchcommoncomment',
					body: {iframeId: 'bidManagerIframe', roomId: bidLineItem?.id, appType: 'BidManagerLineItem'},
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
					body: {iframeId: 'bidManagerIframe', roomId: bidLineItem?.id, appType: 'BidManagerLineItem'},
					livechatData: {participantsIds: participantids}
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: 'launchcontactcard',
					body: {iframeId: 'bidManagerIframe', roomId: bidLineItem?.id, appType: 'BidManagerLineItem'},
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
					body: {iframeId: 'bidManagerIframe', roomId: bidLineItem?.id, appType: 'BidManagerLineItem'},
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
				if(participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if(event.detail.appType === 'BidManagerLineItem') {
					participantCtrl.updateParticipants(event.detail.data);
				}
			});
			document.addEventListener('updatecommentbadge', function (event: any) {
				if(participantCtrl && participantCtrl.id && !(document.getElementById(participantCtrl.id))) {
					return;
				}
				if(event.detail.appType === 'BidManagerLineItem') {
					let chatCount = event.detail.data,
						animation = (chatCount.eventType === 'commentReceived') ? true : false;
					participantCtrl.setButtonBadge('comment', chatCount.count, animation);
				}
			});
			postMessage({
				event: 'joinroom',
				body: {iframeId: 'bidManagerIframe', roomId: bidLineItem?.id, appType: 'BidManagerLineItem', roomTitle: bidLineItem?.name}
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
				'showLiveSupport': false,
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
	const biddersReadOnly = () => {
		return [2, 3, 4, 5, 6, 7, 8].includes(bidLineItem?.status);
	};

	const tabConfig: any = [
		{
			tabId: "bid-details",
			label: "Bid Details",
			showCount: false,
			icon: (tabSelected === "bid-details" ? <span className='common-icon-Biddetailsgray tabicon tabicon_orange' /> : <span className='common-icon-Biddetailsgray tabicon' />),
			content: [2, 3, 4, 5, 6, 7, 8].includes(bidLineItem?.status) ? (
				<BidDetailsRO data={bidLineItem} />
			) : (
				<BidDetails />
			),
		},
		{
			tabId: "reference-files",
			label: "Reference Files",
			showCount: (fileCount > 0),
			count: fileCount,
			icon: (tabSelected === "reference-files" ? <span className='common-icon-contract-files tabicon tabicon_orange' /> : <span className='common-icon-contract-files tabicon' />),
			content: (
				<ReferenceFiles
					iFrameId="bidManagerIframe"
					appType="BidManagerLineItem"
					readOnly={[2, 3, 4, 5, 6, 7, 8].includes(bidLineItem?.status)}
				/>
			),
		},
		{
			tabId: "bidders",
			label: "Bidders",
			showCount: (bidderCount > 0),
			count: bidderCount,
			icon: (tabSelected === "bidders" ? <span className='common-icon-biddersgray tabicon tabicon_orange' /> : <span className='common-icon-biddersgray tabicon' />),
			content: (
				<Bidders
					key={JSON.stringify(biddersReadOnly())}
					readOnly={biddersReadOnly()}
				/>
			),
		},
		{
			tabId: "award-bid",
			label: "Award Bids",
			showCount: false,
			icon: (tabSelected === "award-bid" ? <span className='common-icon-awarded-gray tabicon tabicon_orange' /> : <span className='common-icon-awarded-gray tabicon' />),
			content: <AwardBid />,
			disabled: [3, 5, 6, 8].includes(bidLineItem?.status) ? false : true,
		},
		{
			tabId: "bid-queries",
			label: "Bid Queries",
			showCount: (queryCount > 0),
			count: queryCount,
			icon: (tabSelected === "bid-queries" ? <span className='common-icon-BidQueries bidqueries_tabicon tabicon_orange ' /> : <span className='common-icon-BidQueries bidqueries_tabicon' />),
			content: <BidQueries readOnly={[4, 5, 6, 7, 8].includes(bidLineItem?.status)} />,
			disabled: [3, 4, 5, 6, 8].includes(bidLineItem?.status) ? false : true,
		}
	];

	return (
		<div className='bid-package-lineitem-detail' ref={ref}>
			<div className='details-header'>
				<span className='title'>{bidLineItem?.name || ''}</span>
				<IconButton
					className='closebutton'
					aria-label='Close Right Pane'
					onClick={() => props.close()}
				>
					<Close />
				</IconButton>
			</div>
			<div className='presence-section'>
				<div className='presence-tools'>
					{[presenceTools].map((presenceTool: any) => presenceTool)}
				</div>
			</div>
			<div className='page-header-section'>
				<div className='collapsible-section'>
					<span className='left-box'>
						<p className='head-info-box'>
							<span className='bid-id-label'>Bid ID:</span><span className='bid-id'>{bidLineItem?.displayId}</span>
						</p>
						{collapsed === false ? <p className='head-info-box'>
							<span className='status-label'>Status:</span>
							<span className='status-pill' style={{
								backgroundColor: `#${StatusColors[bidLineItem?.status]}`,
								color: tinycolor(StatusColors[bidLineItem?.status]).isDark() ? 'white' : 'black',
							}}>
								<span className={StatusIcons[bidLineItem?.status]} />
								{getBidStatus(bidLineItem?.status)}
							</span>
						</p> : ''}
					</span>
					<span className='right-box'>
						{[3, 4, 6].includes(bidLineItem?.status) && collapsed === false ? <p className='head-info-box'>
							<span className='ends-on-label'><span className="common-icon-briefcaseclockoutline"></span>Ends on</span>
							<span className='ends-on-date'>{endsOn}</span>
						</p> : ''}
						{bidLineItem?.status === 3 ? <p className='head-info-box'>
							<span className='timer-label'><span className="common-icon-CurrentTime"></span>Time left to Bid</span>
							<span className=''><SUICountDownTimer targetDate={bidLineItem?.endDate} /></span>
						</p> : ''}
					</span>
				</div>
				<div className='header-buttons-container'>
					<IconButton
						className={`header-button`}
						aria-label={collapsed === true ? 'Expand' : 'Collapse'}
						onClick={() => setCollapsed((pCollapsed) => !pCollapsed)}
					>
						{collapsed === true ? (
							<ExpandMore fontSize='small' />
						) : (
							<ExpandLess fontSize='small' />
						)}
					</IconButton>
					{!collapsed && (
						<IconButton
							className={`header-button ${pinned === true ? 'btn-focused' : ''
								}`}
							aria-label={pinned === true ? 'Pinned' : 'Not Pinned'}
							onClick={() => setPinned((pPinned) => !pPinned)}
						>
							{
								<PushPin
									fontSize='small'
									className={`pin ${pinned === true ? 'focused' : ''}`}
									{...(pinned === true ? {color: 'primary'} : {})}
								/>
							}
						</IconButton>
					)}
				</div>
			</div>
			<div
				className='tab-panel-container'
				style={{maxHeight: (collapsed ? 'calc(100% - 7.5em)' : 'calc(100% - 10em)')}}
			>
				{tabConfig?.length > 0 && (
					<IQObjectPage
						tabs={tabConfig}
						defaultTabId={tab}
						scroll={(value: any) => onScroll(value)}
						onTabChange={(value: any) => tabSelectedValue(value)}
						tabPadValue={5}
					/>
				)}
			</div>
			{/* {showToast.displayToast ? <Toast message={showToast.message} interval={2000} /> : null} */}
		</div>
	);
};

export default BidPackageLineItem;