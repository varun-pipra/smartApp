import 'utilities/presence/PresenceManager.css';
import './BidManagerWindow.scss';

import {
	getServer, setAppWindowMaximize, setCostUnitList, setCurrencySymbol, setFullView, setServer
} from 'app/common/appInfoSlice';
import { hideLoadMask, useAppDispatch, useAppSelector, useHomeNavigation } from 'app/hooks';
import { currency, isLocalhost, postMessage } from 'app/utils';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { appInfoData } from 'data/appInfo';
import { setNewBidder, setNewCompany } from 'features/bidmanager/stores/BiddersSlice';
import {
	fetchBidPackageDetails, fetchCompanyList, getSelectedRecord, getShowContracts,
	setBidId,
	setPresenceData,
	setSelectedRecord, setShowContracts,
	setShowLineItemDetails,
	setTab
} from 'features/bidmanager/stores/BidManagerSlice';
import { uploadReferenceFile } from 'features/bidmanager/stores/FilesAPI';
import ContractAttachments from 'features/supplementalcontracts/SupplementalContractsWindow';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { triggerEvent } from 'utilities/commonFunctions';

import { IconButton } from '@mui/material';

import IQWindow from 'components/iqbasewindow/IQBaseWindow';
import BidManagerContent from './bidmanagercontent/BidManagerContent';
import { setUploadQueue } from './stores/FilesSlice';
import SUIAlert from 'sui-components/Alert/Alert';
import { isBidManager } from 'app/common/userLoginUtils';

const BidManagerWindow = () => {
	const dispatch = useAppDispatch();

	const location = useLocation();
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const openSpecifications = useAppSelector(getShowContracts);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isFullView, setIsFullView] = useState(false);
	const [isInline, setInline] = useState(false);
	const presenceId = 'bid-manager-presence';
	const bidPackage = useAppSelector(getSelectedRecord);
	let appInfoReference: any = useRef({});

	const tabEnum: any = {
		bidders: 'bidders',
		bidQuery: 'bid-queries',
		awardBid: 'award-bid'
	};

	const queryParams: any = new URLSearchParams(location.search);

	useEffect(() => {
		const { pathname, search } = location;
		if (pathname.includes('home')) {
			setIsFullView(true);
			dispatch(setFullView(true));
		}
		if (queryParams?.size > 0) {
			// const params: any = new URLSearchParams(search);
			setMaxByDefault(queryParams?.get('maximizeByDefault') === 'true');
			setInline(queryParams?.get('inlineModule') === 'true');
			setIsFullView(queryParams?.get('inlineModule') === 'true');

			if (queryParams?.get('id')) {
				dispatch(setBidId(queryParams?.get('id')));
				dispatch(setShowLineItemDetails(true));

				if (queryParams?.get('tab')) {
					dispatch(setTab(tabEnum[queryParams?.get('tab')]));
				}
			} else hideLoadMask();
		} else hideLoadMask();
	}, []);

	useEffect(() => { appInfoReference.current = appInfo }, [appInfo])

	useEffect(() => {
		if (localhost) {
			const { DivisionCost, ...others } = appData;
			dispatch(setServer(others));
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCostUnitList(DivisionCost?.CostUnit));
		} else {
			if (!appInfo) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == 'string' ? JSON.parse(data) : data;
					data = data.hasOwnProperty('args') && data.args[0] ? data.args[0] : data;
					if (data) {
						switch (data.event || data.evt) {
							case 'hostAppInfo':
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case 'getdrivefiles':
								try {
									dispatch(setUploadQueue(data.data));
								} catch (error) {
									console.log('Error in adding Bid Reference file from Drive', error);
								}
								break;
							case 'updateparticipants':
								triggerEvent('updateparticipants', { data: data.data, appType: data.appType });
								break;
							case 'updatecommentbadge':
								triggerEvent('updatecommentbadge', { data: data.data, appType: data.appType });
								break;
							case 'updatechildparticipants':
								dispatch(setPresenceData(data.data));
								break;
							case "useradded":
								dispatch(setNewBidder({ contactPerson: data.userInfo?.[0] }));
								break;
							case "companyadded":
								console.log("companyadded", appInfoReference.current, data)
								dispatch(fetchCompanyList(appInfoReference.current));
								dispatch(setNewCompany(data.companyInfo));
								break;
						}
					}
				};
				postMessage({
					event: 'hostAppInfo',
					body: { iframeId: 'bidManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidManager' }
				});
			}
		}
	}, [localhost, appData]);

	const handleNewTab = () => {
		postMessage({
			event: 'openinnewtab',
			body: { iframeId: 'bidManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidManager' }
		});
	};

	const handleWindowMaximize = (event: any, value: boolean) => {
		dispatch(setAppWindowMaximize(value));
	};

	const saveContractAttachments = (contracts: any) => {
		const files = contracts.map((file: any) => {
			return {
				driveObjectId: file.uniqueId,
				name: file.displayName,
				fileType: 1
			};
		});

		uploadReferenceFile(appInfo, { referenceFiles: { add: files } }, bidPackage.id)
			.then((bidPackageItem: any) => {
				dispatch(setSelectedRecord(bidPackageItem));
				dispatch(fetchBidPackageDetails({ appInfo: appInfo, packageId: bidPackage?.id }));
			});
	};

	const handleIconClick = () => {
		if (isInline) useHomeNavigation('bidManagerIframe', 'BidManager');
	};

	const optionalTools = <>{!isFullView && <IQTooltip title='Open in new Tab' placement={'bottom'}>
		<IconButton key={'open-in-new-tab'} aria-label='Open in new Tab' onClick={handleNewTab}>
			<span className='common-icon-external'></span>
		</IconButton>
	</IQTooltip>}</>;

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		appInfo && (isBidManager() ?
			<IQWindow
				open={true}
				className='bid-manager-window custom-style'
				iconCls='common-icon-bid-lookup'
				title='Bid Manager'
				appInfo={appInfo}
				appType={'BidManager'}
				iFrameId={'bidManagerIframe'}
				isFromHelpIcon={true}
				isFullView={isFullView}
				disableEscapeKeyDown={true}
				onMaximize={handleWindowMaximize}
				maxByDefault={isMaxByDefault}
				moduleColor='#00e5b0'
				inlineModule={isInline}
				showBrena={appInfo?.showBrena}
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
					}
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
					if (reason && reason == 'closeButtonClick') {
						postMessage({
							event: 'closeiframe',
							body: { iframeId: 'bidManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidManager' }
						});
					}
				}}
			>
				<BidManagerContent />
				{openSpecifications ? <ContractAttachments
					open={true}
					categories={[4, 6]}
					onAdd={(list) => saveContractAttachments(list)}
					onClose={() => dispatch(setShowContracts(false))}
				/>
					: ''
				}
			</IQWindow> : <SUIAlert
				open={true}
				DailogClose={true}
				onClose={() => {
					postMessage({
						event: 'closeiframe',
						body: { iframeId: 'bidManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidManager' }
					});
				}}
				contentText={"You Are Not Authorized"}
				title={'Warning'}
				onAction={(e: any, type: string) => {
					type == 'close' && postMessage({
						event: 'closeiframe',
						body: { iframeId: 'bidManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BidManager' }
					});
				}}
				showActions={false}
			/>
		)
	);
};

export default BidManagerWindow;