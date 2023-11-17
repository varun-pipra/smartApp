import './SmartDialog.scss';

import IQTooltip from 'components/iqtooltip/IQTooltip';
import _ from 'lodash';
import * as React from 'react';

import {Close, Fullscreen, FullscreenExit} from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import {
	Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, IconButton
} from '@mui/material';

export interface CustomDialogProps {
	closable?: boolean;
	resizable?: boolean;
	tools?: React.ReactNode[];
	presenceTools?: React.ReactNode[];
	title?: string | React.ReactNode;
	buttons?: React.ReactNode;
	zIndex?: number;
	fullScreen?: boolean;
	onMaximize?: (event: any, maximizeState: boolean) => void;
	maxByDefault?: boolean;
};

type SmartDialogCloseReason = 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick';

export interface SmartDialogProps extends DialogProps {
	custom?: CustomDialogProps;
	onClose?: (event: any, reason?: SmartDialogCloseReason) => void;
	isFullView?: boolean;
};

const SmartDialog = (props: SmartDialogProps) => {
	const [ open, setOpen ] = React.useState(props.open);
	const [ maximized, setMaximized ] = React.useState(props?.custom?.fullScreen || props?.custom?.maxByDefault ? true : false);

	React.useEffect(() => {
		if(props.isFullView) {
			setMaximized(props.isFullView);
			props.custom?.onMaximize && props.custom.onMaximize(null, true);
		}
	}, [ props.isFullView ]);

	React.useEffect(() => {
		// console.log("pros", props?.custom?.fullScreen)
		setMaximized(props?.custom?.fullScreen || props?.custom?.maxByDefault || props.isFullView ? true : false);
		props.custom?.onMaximize && props.custom.onMaximize(null, true);
	}, [ props?.custom?.fullScreen, props?.custom?.maxByDefault, props.isFullView ]);

	const defaultProps: DialogProps = {
		open: false,
		maxWidth: false,
		PaperProps: {
			sx: {
				minWidth: maximized ? '100vw' : '50%',
				minHeight: maximized ? '100vh' : '35%',
				borderRadius: maximized ? 0 : '4px',
			}
		}
	};

	const {onClose} = props;

	const closeButton = <IQTooltip title="" placement={'bottom'}>
		<IconButton aria-label="Close"
			onClick={(e) => {setOpen(false); onClose && onClose(e, 'closeButtonClick');}}>
			<span className="common-icon-close"></span>
		</IconButton>
	</IQTooltip>;

	const defaultTools = props.custom?.title && <React.Fragment>
		{props.custom?.resizable && <>
			{!maximized ? <IQTooltip title="Maximize" placement={'bottom'}>
				<IconButton aria-label="Fullscreen control" onClick={(e) => (setMaximized(true), props.custom?.onMaximize && props.custom.onMaximize(e, true))}>
					{/* <Fullscreen /> */}
					<div className='common-icon-maximise'></div>
				</IconButton>
			</IQTooltip> : <IQTooltip title="Minimize" placement={'bottom'}>
				<IconButton aria-label="Exit fullscreen control" onClick={(e) => (setMaximized(false), props.custom?.onMaximize && props.custom.onMaximize(e, false))}>
					<div className='common-icon-minimize'></div>
				</IconButton>
			</IQTooltip>}
		</>}
		{props.custom?.closable && closeButton}
	</React.Fragment>;

	return <Dialog
		{..._.merge(defaultProps, _.omit(props, 'custom'))}
		open={open}
		style={{zIndex: props.custom?.zIndex ? props.custom.zIndex : 1300}}>
		{<React.Fragment>{
			props.custom?.title ? <DialogTitle>
				<div className="titlebar-inner-items title-text">{props.custom?.title}</div>
				<div className="titlebar-inner-items title-tools">
					{props.custom?.tools?.length && props.custom?.tools.map((tool) => tool)}
					{!props.isFullView ? defaultTools : props.custom?.presenceTools?.length ?
						<div className="MuiDialog-Presence MuiDialog-PresenceTools">
							{props.custom?.presenceTools.map((presenceTool) => presenceTool)}
						</div>
						: null}
				</div>
			</DialogTitle> : (props.custom?.closable ? closeButton : null)
		}</React.Fragment>}
		{!props.isFullView && props.custom?.presenceTools?.length ? <React.Fragment>{
			<div className="MuiDialog-Presence NoTools">
				{props.custom?.presenceTools.map((presenceTool) => presenceTool)}
			</div>
		}</React.Fragment> : null}
		<DialogContent dividers>{props.children}</DialogContent>
		{props.custom?.buttons ? <DialogActions>
			{props.custom?.buttons}
		</DialogActions> : null}
	</Dialog>;
};

export default SmartDialog;