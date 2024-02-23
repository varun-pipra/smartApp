import 'utilities/presence/PresenceManager.css';
import './BidResponseManagerWindow.scss';

import {
	getServer, setAppWindowMaximize, setCostUnitList, setCurrencySymbol, setFullView, setServer
} from 'app/common/appInfoSlice';
import {hideLoadMask, useAppDispatch, useAppSelector, useHomeNavigation} from 'app/hooks';
import {currency, isLocalhost, postMessage} from 'app/utils';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import Toast from 'components/toast/Toast';
import {appInfoData} from 'data/appInfo';
import _ from 'lodash';
import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {triggerEvent} from 'utilities/commonFunctions';

import {IconButton} from '@mui/material';

import BidResponseManagerGrid from './bidresponsemanagergrid/BidResponseManagerGrid';
import BidResponseManagerToolbar from './bidresponsemanagertoolbar/BidResponseManagerToolbar';
import {
	getSelectedRecord, setSelectedRecord, getToastMessage, setBidId, setBidderId,
	setShowLineItemDetails, setTab, fetchBidResponseDetailsData
} from './stores/BidResponseManagerSlice';
import {fetchBidResponsedata, setResponseRecord} from 'features/bidresponsemanager/stores/BidResponseSlice';
import {uploadReferenceFile} from './stores/FilesAPI';
import {getUploadQueue, setUploadQueue} from './stores/FilesSlice';
import IQWindow from 'components/iqbasewindow/IQBaseWindow';
import SUIAlert from 'sui-components/Alert/Alert';
import {isBidResponseManager} from 'app/common/userLoginUtils';
import { fetchBidResponseGridData } from './stores/gridSlice';
import { fetchConnectors } from 'features/budgetmanager/operations/gridSlice';

const BidResponseManagerWindow = () => {
	const dispatch = useAppDispatch();

	const location = useLocation();
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const [isFullView, setIsFullView] = useState(false);
	const [responseGridRef, setResponseGridRef] = useState(null);
	const [isInline, setInline] = useState(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);

	const presenceId = 'bid-response-manager-presence';
	const showToastMessage = useAppSelector(getToastMessage);
	const bidResponseRecord = useAppSelector(getSelectedRecord);
	const fileQueue = useAppSelector(getUploadQueue);
	const [toastMessage, setToastMessage] = useState<any>({displayToast: false, message: ''});
	const {selectedRecord} = useAppSelector((state) => state.bidResponseManager);
	const tabEnum: any = {
		bidQuery: 'bid-queries',
		bidResponse: 'bidResponse'
	};

	useEffect(() => {
		setTimeout(() => {
			setToastMessage({displayToast: false, message: ''});
		}, 3000);
		setToastMessage({...showToastMessage});
	}, [showToastMessage]);

	const queryParams: any = new URLSearchParams(location.search);

	useEffect(() => {
		const {pathname, search} = location;
		if(pathname.includes('home')) {
			setIsFullView(true);
			dispatch(setFullView(true));
		}
		if(queryParams?.size > 0) {
			// const params: any = new URLSearchParams(search);
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');
			setIsFullView(queryParams?.get('inlineModule') === 'true');

			if(queryParams?.get('id')) {
				dispatch(setBidId(queryParams?.get('id')));
				dispatch(setBidderId(queryParams?.get('bidderId')));
				dispatch(setShowLineItemDetails(true));

				if(queryParams?.get('tab')) {
					dispatch(setTab(tabEnum[queryParams?.get('tab')]));
				}
			} else hideLoadMask();
		} else hideLoadMask();
	}, [location]);

	useEffect(() => {
		if(localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
		} else {
			if(!appInfo) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == 'string' ? JSON.parse(data) : data;
					data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
					if(data) {
						switch(data.event || data.evt) {
							case 'hostAppInfo':
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								break;
							case 'getdrivefiles':
								try {
									dispatch(setUploadQueue(data.data));
								} catch(error) {
									console.error('Error in adding Bid response from Drive', error);
								}
								break;
							case 'updateparticipants':
								triggerEvent('updateparticipants', {data: data.data, appType: data.appType});
								break;
							case 'updatecommentbadge':
								triggerEvent('updatecommentbadge', {data: data.data, appType: data.appType});
								break;
							case 'updatechildparticipants':
								break;
							case "frame-active":
								console.log("frame-active", data);
								data?.data?.name == "bidresponses" && dispatch(fetchBidResponseGridData(appInfo));
								break;
						}
					}
				};
				postMessage({
					event: 'hostAppInfo',
					body: {iframeId: 'bidResponseManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidResponseManager'}
				});
			}
		}
	}, [localhost, appData]);

	useEffect(() => {
		if(fileQueue && fileQueue.length > 0)
			saveSupportiveDocuments(fileQueue);
		//dispatch(setUploadQueue([]));
	}, [fileQueue]);

	useEffect(() => {
		dispatch(fetchConnectors(appInfo))
	}, [appInfo]);

	const handleNewTab = () => {
		postMessage({
			event: 'openinnewtab',
			body: {iframeId: 'bidResponseManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidResponseManager'}
		});
	};

	const handleWindowMaximize = (event: any, value: boolean) => {
		dispatch(setAppWindowMaximize(value));
	};

	const saveSupportiveDocuments = (files: any) => {
		const fileList = files?.map((item: any) => {
			return {
				driveObjectId: item.id,
				name: item.name,
				fileType: 1
			};
		});
		uploadReferenceFile(appInfo, {referenceFiles: {add: fileList}}, bidResponseRecord?.bidderUID)
			.then((bidResponseDetail: any) => {
				dispatch(setUploadQueue([]));
				dispatch(fetchBidResponseDetailsData({appInfo: appInfo, responseId: selectedRecord?.id})).then((bidResponse: any) => {
					dispatch(setSelectedRecord({...selectedRecord}));
				});
				dispatch(fetchBidResponsedata({appInfo: appInfo, bidderId: selectedRecord?.bidderUID})).then((response) => {
					setResponseRecord(response?.payload);
				});
			});
	};

	const handleIconClick = () => {
		if(isInline) useHomeNavigation('bidResponseManagerIframe', 'BidResponseManager');
	};

	const optionalTools = <>{!isFullView && <IQTooltip title='Open in new Tab' placement={'bottom'}>
		<IconButton key={'open-in-new-tab'} aria-label='Open in new Tab' onClick={handleNewTab}>
			<span className='common-icon-external'></span>
		</IconButton>
	</IQTooltip>}</>;

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		appInfo && (isBidResponseManager() ?
			<IQWindow
				open={true}
				className='bidResponse-manager-window custom-style'
				iconCls='common-icon-bid-response'
				title='Bid Response Manager'
				appInfo={appInfo}
				appType={'BidResponseManager'}
				iFrameId={'bidResponseManagerIframe'}
				isFromHelpIcon={true}
				isFullView={isFullView}
				disableEscapeKeyDown={true}
				onMaximize={handleWindowMaximize}
				maxByDefault={isMaxByDefault}
				showBrena={appInfo?.showBrena}
				moduleColor='#00e5b0'
				inlineModule={isInline}
				onIconClick={handleIconClick}
				zIndex={100}
				PaperProps={{
					sx: maxSize ? {
						height: '100%',
						minWidth: '100vw',
						minHeight: '100vh',
						borderRadius: 0
					} : {
						width: '95%',
						height: '90%'
					},
				}}
				tools={{
					closable: true,
					resizable: true,
					customTools: optionalTools
				}}
				presenceProps={{
					presenceId: presenceId,
					showBrena: false,
					showLiveSupport: true,
					showLiveLink: true,
					showStreams: true,
					showComments: true,
					showChat: false,
					hideProfile: false,
					// participants: [ appInfoData.currentUserInfo ]
				}}
				onClose={(event, reason) => {
					if(reason && reason == 'closeButtonClick') {
						postMessage({
							event: 'closeiframe',
							body: {iframeId: 'bidResponseManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidResponseManager'}
						});
					}
				}}
			>
				<BidResponseManagerToolbar gridRef={responseGridRef} />
				<BidResponseManagerGrid onRefChange={(ref: any) => setResponseGridRef(ref)} />
				{toastMessage.displayToast ? <Toast message={toastMessage.message} interval={3000} /> : null}
			</IQWindow >
			:
			<SUIAlert
				open={true}
				DailogClose={true}
				onClose={() => {
					postMessage({
						event: 'closeiframe',
						body: {iframeId: 'bidResponseManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidResponseManager'}
					});
				}}
				contentText={"You Are Not Authorized"}
				title={'Warning'}
				onAction={(e: any, type: string) => {
					type == 'close' && postMessage({
						event: 'closeiframe',
						body: {iframeId: 'bidResponseManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidResponseManager'}
					});
				}}
				showActions={false}
			/>
		)
	);
};

export default BidResponseManagerWindow;