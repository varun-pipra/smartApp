import * as React from 'react';
import _ from 'lodash';
import { Dialog, DialogProps, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Fullscreen, FullscreenExit, Close, OpenInNew } from '@mui/icons-material';
import PresenceManager from "utilities/presence/PresenceManager";
import external from '../../resources/images/common/external.svg';
import minimize from '../../resources/images/common/minimize.svg';
import maximise from '../../resources/images/common/maximize.svg';

import './Dialog.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';

type SUIDialogCloseReason = 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick';

export interface SUIDialogProps extends DialogProps {
	onClose?: (event: any, reason?: SUIDialogCloseReason) => void;
	isFullView?: boolean;
	closable?: boolean;
	resizable?: boolean;
	presenceTools?: React.ReactNode[];
	headerTitle?: string;
	buttons?: React.ReactNode;
	zIndex?: number,
	presenceId?: string,
	background?: string;
	padding?: string;
	height?: string;
	width?: string;
	minWidth?: string;
	borderRadius?: string;
	presenceToolsOpts?: object,
	iframeId?: string,
	toolsOpts?: {
		closable?: boolean,
		resizable?: boolean,
		openInNewTab?: boolean
	}
};

const SUIDialog = (props: SUIDialogProps) => {
	const [open, setOpen] = React.useState(props.open);
	const [maximized, setMaximized] = React.useState(props.isFullView ? true : false);
	const presenceRef = React.useRef(false);

	React.useEffect(() => {
		if (presenceRef.current) return;
		presenceRef.current = true;
		renderPresence();
	}, []);

	React.useEffect(() => {
		if (props.isFullView) {
			setMaximized(props.isFullView);
		}
	}, [props.isFullView])

	const defaultProps: DialogProps = {
		open: false,
		maxWidth: false,
		PaperProps: {
			sx: {
				minWidth: maximized ? '100vw' : props.minWidth ? props.minWidth : '50%',
				minHeight: maximized ? '100vh' : '35%',
				borderRadius: maximized ? 0 : props.borderRadius ? '7px' : '4px',
				padding: props.padding ? props.padding : '0px'
			}
		}
	};

	const { onClose } = props;

	const handleHelp = () => {
		postMessage({
			event: "help",
			body: { iframeId: props?.iframeId }
		});
	}

	const handleNewTab = () => {
		postMessage({
			event: "openinnewtab",
			body: { iframeId: props?.iframeId }
		});
	}

	const addPresenceListener = (presenceManager: any) => {
		if (presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;
			participantCtrl.addEventListener('livesupportbtnclick', function (e: any) {
				handleHelp();
			});
			participantCtrl.addEventListener('livelinkbtnclick', function (e: any) {
				postMessage({
					event: "launchcommonlivelink",
					body: { iframeId: props?.iframeId },
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('streambuttonclick', function (e: any) {
				postMessage({
					event: "launchcommonstream",
					body: { iframeId: props?.iframeId },
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
				postMessage({
					event: "launchcommoncomment",
					body: { iframeId: props?.iframeId },
					data: participantCtrl.getParticipants()
				});
			});
			participantCtrl.addEventListener('presencecountclick', function (e: any) {
				let participantsjson = participantCtrl.getParticipants(),
					participantids = [];
				if (participantsjson) {
					for (var i = 0; i < participantsjson.length; i++) {
						participantids.push((participantsjson[i].userid))
					}
				}
				postMessage({
					event: "launchlivechat",
					body: { iframeId: props?.iframeId },
					livechatData: { participantsIds: participantids }
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: "launchcontactcard",
					body: { iframeId: props?.iframeId },
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
					body: { iframeId: props?.iframeId },
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'hover'
					}
				});
			});
			document.addEventListener("updateparticipants", function (event: any) {
				if (event.detail) {
					participantCtrl.updateParticipants(event.detail);
				}
			});
			document.addEventListener("updatecommentbadge", function (event: any) {
				if (event.detail) {
					let chatCount = event.detail,
						animation = (chatCount.eventType === "commentReceived") ? true : false;
					participantCtrl.setButtonBadge('comment', chatCount.count, animation);
				}
			});
			postMessage({
				event: "joinroom",
				body: { iframeId: props?.iframeId }
			});
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager);
		}, 1000);
	}

	const renderPresence = () => {
		let presenceManager = new PresenceManager({
			domElementId: props?.presenceId,
			initialconfig: props?.presenceToolsOpts
		});
		addPresenceListener(presenceManager);
	}

	const presenceTools = [<React.Fragment>{
		<>
			<div id={props?.presenceId} className="budgetmanager-presence"></div>
		</>
	}</React.Fragment>]

	const closeButton = <IQTooltip title="" placement={'bottom'}>
		<IconButton aria-label="Close"
			onClick={(e) => { setOpen(false); onClose && onClose(e, 'closeButtonClick'); }}>
			<Close />
		</IconButton>
	</IQTooltip>;

	const openInNewTabButton = <IQTooltip title="Open in new Tab" placement={"bottom"}>
		<IconButton key={"open-in-new-tab"} aria-label="Open in new Tab" onClick={handleNewTab}>
		<span className='common-icon-external'></span>
			{/* <img src={external} className="dailog-action-icons" /> */}
		</IconButton>
	</IQTooltip>;

	const defaultTools = props.headerTitle && <React.Fragment>
		{props.toolsOpts?.openInNewTab && openInNewTabButton}
		{props.toolsOpts?.resizable && <>
			{!maximized ? <IQTooltip title="Maximize" placement={'bottom'}>
				<IconButton aria-label="Fullscreen control" onClick={() => setMaximized(true)}>
					{/* <Fullscreen /> */}
					<img src={maximise} className="dailog-action-icons" />
				</IconButton>
			</IQTooltip> : <IQTooltip title="Minimize" placement={'bottom'}>
				<IconButton aria-label="Exit fullscreen control" onClick={() => setMaximized(false)}>
					{/* <FullscreenExit /> */}
					<img src={minimize} className="dailog-action-icons" />
				</IconButton>
			</IQTooltip>}
		</>}
		{props.toolsOpts?.closable && closeButton}
	</React.Fragment>;

	return (
		<Dialog
			{..._.merge(defaultProps, props)}
			className="SuiDialog"
			open={open}
			style={{ zIndex: props.zIndex ? props.zIndex : 1300 }}>
			{<React.Fragment>{
				props.headerTitle ? <DialogTitle>
					<div className="titlebar-inner-items title-text" style={props.style}>{props.headerTitle}</div>
					<div className="titlebar-inner-items title-tools">
						{!props.isFullView ? defaultTools : props.presenceId ?
							<div className="MuiDialog-Presence MuiDialog-PresenceTools">
								{presenceTools.map((presenceTool) => presenceTool)}
							</div>
							: null}
					</div>
				</DialogTitle> : (props.closable ? closeButton : null)
			}</React.Fragment>}
			{!props.isFullView && props.presenceId ? <React.Fragment>{
				<div className="MuiDialog-Presence NoTools">
					{presenceTools.map((presenceTool) => presenceTool)}
				</div>
			}</React.Fragment> : null}
			<DialogContent >{props.children}</DialogContent>
			{props.buttons ? <DialogActions style={{ background: props.background, height: props.height }}>
				{props.buttons}
			</DialogActions> : null}
		</Dialog>
	);
};

export default SUIDialog;