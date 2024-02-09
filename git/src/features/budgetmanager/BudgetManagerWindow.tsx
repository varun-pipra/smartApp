import {Fragment, useEffect, useRef, useState} from "react";
import _ from 'lodash';
import './BudgetManagerWindow.scss';
import {IconButton, Paper, Snackbar} from "@mui/material";

import {postMessage, isLocalhost, currency, currencyCode} from "app/utils";
import SmartDialog from "components/smartdialog/SmartDialog";
import IQTooltip from "components/iqtooltip/IQTooltip";
import HeaderPinning from './headerPinning/HeaderPinning';
import ManageTableColumns from "./managetablecolumns/ManageTableColumns";
import {useAppSelector, useAppDispatch, useHomeNavigation} from "app/hooks";
import {useLocation} from 'react-router-dom';
import {appInfoData} from 'data/appInfo';
import {getToastMessage, setImportBudgetsStatus, setOpenNotification} from './operations/tableColumnsSlice';
import {setPresenceData} from './operations/gridSlice';
import {
	getServer, setServer, setCostCodeList, setFullView,
	setCostUnitList, setCurrencySymbol, setCurrencyCode, setAppWindowMaximize
} from 'app/common/appInfoSlice';
import {setUploadedFilesFromLocal, setUploadedFilesFromDrive} from "./operations/transactionsSlice";
import {triggerEvent} from 'utilities/commonFunctions';
import PresenceManager from "utilities/presence/PresenceManager.js";
import 'utilities/presence/PresenceManager.css';
import Toast from "components/toast/Toast";
import SUIAlert from "sui-components/Alert/Alert";
import {isBudgetManager} from "app/common/userLoginUtils";
import {initRTDocument} from 'utilities/realtime/Realtime';
import {budgetManagerMainGridRTListener} from './BudgetManagerRT';
import React from "react";

const BudgetManagerWindow = (props: any) => {
	const dispatch = useAppDispatch();
	const {showTableColumnsPopup, openNotification, importStatus} = useAppSelector((state: any) => state.tableColumns);
	const showToastMessage = useAppSelector(getToastMessage);
	const [isFullView, setIsFullView] = useState(false);
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const location = useLocation();
	const appInfo = useAppSelector(getServer);
	const [isMaximize, setMaximize] = useState(appInfo?.fullScreen);
	const [isInline, setInline] = useState(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [toastMessage, setToastMessage] = useState<any>({displayToast: false, message: ''});
	const gridRT = useRef<boolean>(false);
	const [open, setOpen] = React.useState(false);
	useEffect(() => {
		const loader = document.getElementById('smartapp-react-loader');
		if(loader) {
			loader.style.display = 'none';
		}
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setToastMessage({displayToast: false, message: ''});
		}, 3000);
		setToastMessage({...showToastMessage});
	}, [showToastMessage]);
	useEffect(() => {setOpen(openNotification)}, [openNotification])
	useEffect(() => {if(importStatus == 1) { setOpen(false); dispatch(setImportBudgetsStatus(null))}  }, [importStatus])
	


	const presenceRef = useRef(false);
	const presenceId = 'budgetmanager-presence';

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
		}
	}, [location]);

	useEffect(() => {
		if(localhost) {
			dispatch(setCostCodeList(appData?.DivisionCost?.CostCode));
			// dispatch(setCostTypeList(appData?.DivisionCost?.CostType));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
			// dispatch(setCostCodeDivisionList(appData?.DivisionCost?.Division));
			dispatch(setServer(_.omit(appData, ['DivisionCost'])));
			dispatch(setCurrencySymbol(currency['USD']));
			dispatch(setCurrencyCode(currencyCode['USD']));
		} else {
			if(!appInfo) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof (data) == "string" ? JSON.parse(data) : data;
					data = data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
					if(data) {
						switch(data.event || data.evt) {
							case "hostAppInfo":
								const structuredData = data.data;
								console.log("structuredData", structuredData, data);
								dispatch(setCostCodeList(structuredData?.DivisionCost?.CostCode));
								// dispatch(setCostTypeList(structuredData?.DivisionCost?.CostType));
								dispatch(setCostUnitList(structuredData?.DivisionCost?.CostUnit));
								// dispatch(setCostCodeDivisionList(structuredData?.DivisionCost?.Division));
								dispatch(setServer(_.omit(structuredData, ['DivisionCost'])));
								dispatch(setCurrencySymbol(currency?.[structuredData?.currencyType as keyof typeof currency]));
								dispatch(setCurrencyCode(currencyCode?.[structuredData?.currencyType as keyof typeof currency]));
								break;
							case 'getlocalfiles':
								const localUploadedFiles = data.data;
								dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case 'getdrivefiles':
								const driveUploadedFiles = data.data;
								dispatch(setUploadedFilesFromDrive(driveUploadedFiles));
								break;
							case "updateparticipants":
								// console.log("updateparticipants", data)
								triggerEvent('updateparticipants', {data: data.data, appType: data.appType});
								break;
							case "updatecommentbadge":
								// console.log("updatecommentbadge", data)
								triggerEvent('updatecommentbadge', {data: data.data, appType: data.appType});
								break;
							case "updatechildparticipants":
								// console.log("updatechildparticipants", data)
								dispatch(setPresenceData(data.data));
								break;
						}
					}
				};
				postMessage({
					event: "hostAppInfo",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "BudgetManager"}
				});
			}
		}
	}, [localhost, appData]);

	useEffect(() => {
		if(appInfo) {
			if(presenceRef.current) return;
			presenceRef.current = true;
			renderPresence(appInfo);
			setMaximize(appInfo?.fullScreen);
			if(gridRT.current) return;
			else {
				gridRT.current = true;
				const documentId = `${appInfo.urlAppZoneID}_${appInfo.uniqueId}`;
				setTimeout(() => {
					initRTDocument(appInfo, `budgetManagerLineItems@${appInfo?.uniqueId}`, documentId, budgetManagerMainGridRTListener);
				}, 3000);
			}
		}
	}, [appInfo]);

	const addPresenceListener = (presenceManager: any, appInfo: any) => {
		if(presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;

			participantCtrl.addEventListener('brenabtnclick', function (e: any) {
				postMessage({event: 'openbrena'});
			});
			participantCtrl.addEventListener('livesupportbtnclick', function (e: any) {
				handleHelp();
			});
			participantCtrl.addEventListener('livelinkbtnclick', function (e: any) {
				postMessage({
					event: "launchcommonlivelink",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo.presenceRoomId, appType: "BudgetManager"},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('streambuttonclick', function (e: any) {
				postMessage({
					event: "launchcommonstream",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo.presenceRoomId, appType: "BudgetManager"},
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
				postMessage({
					event: "launchcommoncomment",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo.presenceRoomId, appType: "BudgetManager"},
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
					event: "launchlivechat",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo.presenceRoomId, appType: "BudgetManager"},
					livechatData: {participantsIds: participantids}
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: "launchcontactcard",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo.presenceRoomId, appType: "BudgetManager"},
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
					event: "launchcontactcard",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo.presenceRoomId, appType: "BudgetManager"},
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'hover'
					}
				});
			});
			document.addEventListener("updateparticipants", function (event: any) {
				if(event.detail.appType === "BudgetManager") {
					// console.log("event in BM Window", event);
					participantCtrl.updateParticipants(event.detail.data);
				}
			});
			document.addEventListener("updatecommentbadge", function (event: any) {
				if(event.detail.appType === 'BudgetManager') {
					// console.log("updatecommentbadge in BM Window", event);
					let chatCount = event.detail.data,
						animation = (chatCount.eventType === "commentReceived") ? true : false;
					participantCtrl.setButtonBadge('comment', chatCount.count, animation);
				}
			});
			if(appInfo) {
				postMessage({
					event: "joinroom",
					body: {iframeId: "budgetManagerIframe", roomId: appInfo.presenceRoomId, appType: "BudgetManager", roomTitle: "Budget Manager"}
				});
			}
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager, appInfo);
		}, 1000);
	};

	const renderPresence = (appInfoData: any) => {
		// console.log("renderPresence", appInfo, appInfoData);
		let presenceManager = new PresenceManager({
			domElementId: presenceId,
			initialconfig: {
				"showBrena": false,
				"showLiveSupport": true,
				"showLiveLink": true,
				"showStreams": true,
				"showComments": true,
				"showChat": false,
				"hideProfile": false,
				"participants": [appInfoData.currentUserInfo]
			}
		});
		addPresenceListener(presenceManager, appInfoData);
	};

	const handleHelp = () => {
		postMessage({
			event: "help",
			body: {iframeId: "budgetManagerIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "BudgetManager", isFromHelpIcon: true}
		});
	};

	const handleNewTab = () => {
		postMessage({
			event: "openinnewtab",
			body: {iframeId: "budgetManagerIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "BudgetManager"}
		});
	};

	const handleBrena = () => {
		postMessage({event: 'openbrena'});
	};

	const handleWindowMaximize = (event: any, value: boolean) => {
		setMaximize(value);
		dispatch(setAppWindowMaximize(value));
	};

	const handleIconClick = () => {
		if(isInline) useHomeNavigation('budgetManagerIframe', 'BudgetManager');
	};

	const optionalTools = <Fragment>{
		<>
			{!isFullView && <IQTooltip title="Open in new Tab" placement={"bottom"}>
				<IconButton key={"open-in-new-tab"} aria-label="Open in new Tab" onClick={handleNewTab}>
					<span className='common-icon-external'></span>
				</IconButton>
			</IQTooltip>}
		</>
	}</Fragment>;

	const presenceTools = <>
		{isMaxByDefault && appInfo?.showBrena === true && <IQTooltip title='Brena AI' placement={'bottom'}>
			<IconButton className='brena-ai-btn' onClick={handleBrena}>
				<span className='common-icon-brena'></span>
			</IconButton>
		</IQTooltip>}
		<div id={presenceId} className="budgetmanager-presence"></div>
	</>;

	const maxSize = isMaximize !== false && queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');
	
	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
	  if (reason === 'clickaway') {
		return;
	  }
  
	  setOpen(false);
	  dispatch(setOpenNotification(false))
	};
	return (
		appInfo && (isBudgetManager() ?
			<>
			<SmartDialog
				open={true}
				className="budget-manager-window custom-style"
				isFullView={isFullView}
				disableEscapeKeyDown={true}
				PaperProps={{
					sx: maxSize ? {
						minWidth: '100vw',
						minHeight: '100vh',
						borderRadius: 0
					} : {
						width: '95%',
						height: '90%'
					},
				}}
				custom={{
					closable: true,
					resizable: true,
					title: <><span onClick={handleIconClick} className={isInline ? 'common-icon-home finance-home' : 'common-icon-budget-manager'}></span>Budget Manager</>,
					tools: [optionalTools],
					presenceTools: [presenceTools],
					zIndex: 100,
					fullScreen: (props?.fullScreen || location?.pathname?.includes('home')),
					onMaximize: handleWindowMaximize,
					maxByDefault: isMaxByDefault
				}}
				onClose={(event, reason) => {
					if(reason && reason == "closeButtonClick") {
						postMessage({
							event: "closeiframe",
							body: {iframeId: "budgetManagerIframe", roomId: appInfo && appInfo.presenceRoomId, appType: "BudgetManager"}
						});
					}
				}}
			>
				<HeaderPinning />
				{toastMessage.displayToast ? <Toast message={toastMessage.message} interval={3000} /> : null}
				{showTableColumnsPopup && <ManageTableColumns />}
			</SmartDialog >
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
				<Paper sx={{ width: 300, maxWidth: '100%' }}>
						<div className="bd-importer">
							<div className="bd-importer_progress">
								<div>Budget Import in progress</div>
								<span className="common-icon-close" style={{cursor:'pointer'}} onClick={handleClose}/>
							</div>
						
							<div className="bd-importer_template">
								<div className="common-icon-excel"></div>
								<div className="template-text-cls">Budget Importer Template</div>
								<div className="common-icon-Progress-Tick"></div>
							</div>
						</div>
				</Paper>
      		</Snackbar>
			</>
			:
			<SUIAlert
				open={true}
				DailogClose={true}
				onClose={() => {
					postMessage({
						event: 'closeiframe',
						body: {iframeId: 'budgetManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BudgetManager'}
					});
				}}
				contentText={"You Are Not Authorized"}
				title={'Warning'}
				onAction={(e: any, type: string) => {
					type == 'close' && postMessage({
						event: 'closeiframe',
						body: {iframeId: 'budgetManagerIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'BudgetManager'}
					});
				}}
				showActions={false}
			/>
		)
	);
};

export default BudgetManagerWindow;