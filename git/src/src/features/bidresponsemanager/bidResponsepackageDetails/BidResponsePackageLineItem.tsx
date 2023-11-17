import './BidResponsePackageLineItem.scss';

import {getServer} from 'app/common/appInfoSlice';
import {hideLoadMask, useAppDispatch, useAppSelector} from 'app/hooks';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import {ReferenceFiles} from 'features/bidresponsemanager/bidResponsepackageDetails/tabs/referenceFiles/ReferenceFiles';
import {setFiles} from 'features/bidresponsemanager/stores/FilesSlice';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import SUICountDownTimer from 'sui-components/CountDownTimer/CountDownTimer';
import {BidResponseStatus, BidResponseStatusColor} from 'utilities/bid/enums';
import {getResponseStatusIcons} from 'utilities/bidResponse/enums';
import {formatDate} from 'utilities/datetime/DateTimeUtils';

import {Close, ExpandLess, ExpandMore, Lock, PushPinOutlined as PushPin} from '@mui/icons-material';
import {IconButton} from '@mui/material';

import {loadBidQueriesByPackageAndBidder} from 'features/bidmanager/stores/BidQueriesSlice';
import {fetchBidResponseDetailsData} from 'features/bidresponsemanager/stores/BidResponseManagerSlice';
import {fetchBidResponsedata} from 'features/bidresponsemanager/stores/BidResponseSlice';
import BidDetailsRO from '../../bidmanager/bidpackagedetails/tabs/biddetails/BidDetailsReadOnly';
import {setSelectedTabName} from '../stores/BidResponseManagerSlice';
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

	const [fileCount, setFileCount] = useState(0);
	const [queryCount, setQueryCount] = useState(0);
	const [intentEndDate, setIntentEndDate] = useState<any>();

	const {bidId, tab, bidderId, selectedRecord, bidDetails} = useAppSelector((state) => state.bidResponseManager);

	const appInfo = useAppSelector(getServer);

	useEffect(() => {
		if(bidId) {
			const callList: Array<any> = [
				dispatch(fetchBidResponseDetailsData({appInfo: appInfo, responseId: bidId})),
				dispatch(fetchBidResponsedata({appInfo: appInfo, bidderId: bidderId})),
				dispatch(loadBidQueriesByPackageAndBidder({appInfo: appInfo, packageId: bidId, bidderId: bidderId}))
			];

			Promise.all(callList).then(() => {
				hideLoadMask();
			});
		}
	}, [appInfo, bidId]);

	useEffect(() => {
		if(bidDetails) {
			if(bidDetails.intendToBidCountdown) {
				const currentDate = new Date();
				currentDate.setHours(0, 0, 0, 0);
				currentDate.setDate(currentDate.getDate() + bidDetails.intendToBidCountdown);
				setIntentEndDate(currentDate?.toISOString());
			}
			setQueryCount(bidDetails.bidderQueryCount);
			setFileCount(bidDetails.refFileCount);
			dispatch(setFiles(bidDetails?.referenceFiles || []));
		}
	}, [bidDetails]);

	const tabSelectedValue = (value: any) => {
		setTabSelected(value);
		dispatch(setSelectedTabName(value));
	};

	const onScroll = (value: any) => {
		if(pinned == false) {
			setCollapsed(value);
		}
	};

	const bidResponseTabReadOnly = () => {
		return [5].includes(selectedRecord?.responseStatus);
	};

	const tabConfig = [{
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
		count: queryCount,
		disabled: [0, 1, 4].includes(selectedRecord?.responseStatus),
		icon: (tabSelected === 'bid-queries' ? <span className='common-icon-BidQueries bidqueries_tabicon tabicon_orange ' /> : <span className='common-icon-BidQueries bidqueries_tabicon' />),
		content: <BidQueries />,

	}, {
		tabId: 'bidResponse',
		label: <>Bid Response {[0, 1, 4].includes(selectedRecord?.responseStatus) ? <Lock style={{opacity: 0.5}} /> : ''}</>,
		showCount: false,
		disabled: [0, 1, 4].includes(selectedRecord?.responseStatus),
		icon: (tabSelected === 'bidResponse' ? <span className='common-icon-biddersgray tabicon tabicon_orange' /> : <span className='common-icon-biddersgray tabicon' />),
		content: <BidResponse
			key={JSON.stringify(bidResponseTabReadOnly())}
			readOnly={bidResponseTabReadOnly()}
			iFrameId='bidResponseManagerIframe'
			appType='BidResponseManager'
		/>
	}];

	return <div className='bidResponse-package-lineitem-detail' ref={ref}>
		<div className='details-header'>
			<span className='title'>{selectedRecord?.name}</span>
			<IconButton className='closebutton' aria-label='Close Right Pane' onClick={() => props.close()}>
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
					{<PushPin fontSize='small' className={`pin ${pinned === true ? 'focused' : ''}`} {...(pinned === true ? {color: 'primary'} : {})} />}
				</IconButton>}
			</div>
		</div>
		<div className='tab-panel-container' style={{maxHeight: (collapsed ? 'calc(100% - 4.5em)' : 'calc(100% - 7em)')}}>
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