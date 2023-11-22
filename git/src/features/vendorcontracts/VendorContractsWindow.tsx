import 'utilities/presence/PresenceManager.css';
import './VendorContractsWindow.scss';
import {
	getServer, setAppWindowMaximize, setCostUnitList, setCurrencySymbol, setFullView, setServer
} from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector, useHomeNavigation, hideLoadMask } from 'app/hooks';
import { currency, isLocalhost, postMessage } from 'app/utils';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import Toast from 'components/toast/Toast';
import { appInfoData } from 'data/appInfo';
import { setPresenceData } from 'features/bidmanager/stores/BidManagerSlice';
import ContractAttachments from 'features/supplementalcontracts/SupplementalContractsWindow';
import _ from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SUIAlert from 'sui-components/Alert/Alert';
import { triggerEvent } from 'utilities/commonFunctions';
import { isUserGC } from 'utilities/commonutills';

import { IconButton } from '@mui/material';

import IQWindow from 'components/iqbasewindow/IQBaseWindow';
import {
	getSelectedRecord, getShowContractAttachments, getToastMessage,
	setShowContractAttachments, getContractDetailsById, setTab,
	setContractId, setShowLineItemDetails
} from './stores/VendorContractsSlice';
import { setAdditionalFiles, setContractFilesCount, getStandardFiles } from './stores/tabs/contractfiles/VCContractFilesTabSlice';
import VendorContractsContent from './vendorcontractscontent/VendorContractsContent';
import { addContractFiles } from './stores/tabs/contractfiles/VCContractFilesTabAPI';

const VendorContractsWindow = () => {
	const dispatch = useAppDispatch();

	const location = useLocation();
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const openContractAttachments = useAppSelector(getShowContractAttachments);
	const [isFullView, setIsFullView] = useState(false);
	const [driveFileQueue, setDriveFileQueue] = useState([]);
	const standardFiles = useAppSelector(getStandardFiles);
	const [toastMessage, setToastMessage] = useState<any>({ displayToast: false, message: '' });
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const presenceRef = useRef(false);
	const presenceId = 'vendor-contracts-presence';
	const showToastMessage = useAppSelector(getToastMessage);
	const currentContract = useAppSelector(getSelectedRecord);

	const tabEnum: any = {
		sov: 'scheduleValues',
		files: 'contractFiles',
		changeEvent: 'changeEvent',
		paymentLedger: 'paymentLedger',
		transactions: 'transactions',
		forecast: 'forecast'
	};

	const contractAttachment_filterOptions = [
		{
			text: "Category",
			value: "Category",
			key: "Category",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Vendor Contract', id: 'VendorContract', key: 'VendorContract', value: 'VendorContract', },
					{ text: 'General', id: 'General', key: 'General', value: 'General', },
				],
			},
		},
	];

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
				dispatch(setContractId(queryParams?.get('id')));
				dispatch(setShowLineItemDetails(true));

				if (queryParams?.get('tab')) {
					dispatch(setTab(tabEnum[queryParams?.get('tab')]));
				}
			} else hideLoadMask();
		} else hideLoadMask();
	}, [location]);

	useEffect(() => {
		setTimeout(() => {
			setToastMessage({ displayToast: false, message: '' });
		}, 3000);
		setToastMessage({ ...showToastMessage });
	}, [showToastMessage]);

	useEffect(() => {
		if (localhost) {
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
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
								//dispatch(setCostUnitList(structuredData?.DivisionCost?.CostUnit));
								dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
								dispatch(setCurrencySymbol(currency[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case 'getdrivefiles':
								try {
									setDriveFileQueue(data.data);
								} catch (error) {
									console.log('Error in adding Vendor Contract Additional File from Drive:', error);
								}
								break;
							case 'updateparticipants':
								// console.log('updateparticipants', data)
								triggerEvent('updateparticipants', { data: data.data, appType: data.appType });
								break;
							case 'updatecommentbadge':
								// console.log('updatecommentbadge', data)
								triggerEvent('updatecommentbadge', { data: data.data, appType: data.appType });
								break;
							case 'updatechildparticipants':
								// console.log('updatechildparticipants', data)
								dispatch(setPresenceData(data.data));
								break;
						}
					}
				};
				postMessage({
					event: 'hostAppInfo',
					body: { iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts' }
				});
			}
		}
	}, [localhost, appData]);


	const saveContractAttachments = (contracts: any) => {
		const uniqueDocumentIds = new Set(standardFiles?.map((file: any) => file?.documentId));
		const filteredContracts = contracts?.filter((contract: any) => !uniqueDocumentIds.has(contract?.documentId));
		if (filteredContracts.length > 0) {
			const structuredFiles = filteredContracts?.map((file: any) => {
				return {
					type: 'Standard',
					category: file.category,
					documentId: file.documentId,
					description: file.description,
					stream: {
						driveObjectId: file.uniqueId
					}
				};
			});
			addContractFiles(appInfo, currentContract?.id, structuredFiles)
				.then((res: any) => {
					dispatch(setAdditionalFiles(res?.additional));
					dispatch(setContractFilesCount((res?.standard?.length || 0) + (res?.additional?.length || 0)));
					dispatch(getContractDetailsById({ appInfo: appInfo, id: currentContract.id }));
				});
		}
		else {
			console.log('else')
		}
	};

	const saveAdditionalFilesFromDrive = (appInfo: any, fileList: Array<any>) => {
		const structuredFiles = fileList.map((file: any) => {
			return {
				type: 'Additional',
				description: file.description,
				stream: {
					driveObjectId: file.id
				}
			};
		});

		//dispatch(addContractFiles({appInfo: appInfo, contractId: currentContract?.id, files: structuredFiles}));
		addContractFiles(appInfo, currentContract?.id, structuredFiles)
			.then((res: any) => {
				dispatch(setAdditionalFiles(res?.additional));
				dispatch(setContractFilesCount((res?.standard?.length || 0) + (res?.additional?.length || 0)));
				dispatch(getContractDetailsById({ appInfo: appInfo, id: currentContract.id }));
			});
	};

	useEffect(() => {
		if (driveFileQueue?.length > 0) {
			saveAdditionalFilesFromDrive(appInfo, [...driveFileQueue]);
			setDriveFileQueue([]);
		}
	}, [appInfo, driveFileQueue]);


	const handleHelp = () => {
		postMessage({
			event: 'help',
			body: { iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts' }
		});
	};

	const handleNewTab = () => {
		postMessage({
			event: 'openinnewtab',
			body: { iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts' }
		});
	};

	const handleWindowMaximize = (event: any, value: boolean) => {
		dispatch(setAppWindowMaximize(value));
	};

	const handleIconClick = () => {
		if (isInline) useHomeNavigation('vendorContractsIframe', 'VendorContracts');
	};

	const optionalTools = <>{
		<>
			{!isFullView && <IQTooltip title='Open in new Tab' placement={'bottom'}>
				<IconButton key={'open-in-new-tab'} aria-label='Open in new Tab' onClick={handleNewTab}>
					<span className='common-icon-external'></span>
				</IconButton>
			</IQTooltip>}
		</>
	}</>;

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return (
		appInfo && (isUserGC(appInfo) != 'Not Authorized' ?
			<IQWindow
				open={true}
				className='vendor-contracts-window custom-style'
				iconCls='common-icon-contracts'
				title='Vendor Contracts'
				appInfo={appInfo}
				appType={'VendorContracts'}
				iFrameId={'vendorContractsIframe'}
				isFromHelpIcon={true}
				titleInfo={isUserGC(appInfo) ? null : {
					text: appInfo?.currentUserInfo?.company,
					imgSrc: appInfo?.currentUserInfo?.profile
				}}
				centerPiece={!isUserGC(appInfo) && `Below are all open and valid Contracts for your company '${appInfo?.currentUserInfo?.company}' for the Project '${appInfo?.currentProjectInfo?.name}'.`}
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
							body: { iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts' }
						});
					}
				}}
			>
				<VendorContractsContent />
				{toastMessage.displayToast ? <Toast message={toastMessage.message} interval={3000} /> : null}
				{openContractAttachments ? <ContractAttachments
					open={true}
					categories={[2, 4]}
					selectedFiles={standardFiles && standardFiles.length > 0 ? standardFiles : []}
					onAdd={(list) => saveContractAttachments(list)}
					onClose={() => dispatch(setShowContractAttachments(false))}
					filterOptions={contractAttachment_filterOptions}
					Iframe={'vendorContractsIframe'}
					modules={'VendorContracts'}
				/> : ''}

			</IQWindow>
			: <SUIAlert
				open={true}
				DailogClose={true}
				onClose={() => {
					postMessage({
						event: 'closeiframe',
						body: { iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts' }
					});
				}}
				contentText={"You Are Not Authorized"}
				title={'Warning'}
				onAction={(e: any, type: string) => {
					type == 'close' && postMessage({
						event: 'closeiframe',
						body: { iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts' }
					});
				}}
				showActions={false}
			/>
		));
};

export default VendorContractsWindow;