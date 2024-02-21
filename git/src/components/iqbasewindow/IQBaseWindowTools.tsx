import { memo, ReactNode } from 'react';
import { IconButton } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { postMessage} from "app/utils";
// Project files and internal support import
import { IQBaseWindowToolsProp } from './IQBaseWindowTypes';
import IQTooltip from 'components/iqtooltip/IQTooltip';

interface SupportingProps extends IQBaseWindowToolsProp {
	maximized: boolean;
	appType: string;
	appInfo: any;
	iFrameId: string;
	setMaximized: any;
	onClose: any;
	setOpen: any;
	customTools?: ReactNode;
	isBrenaOpen?:boolean;
	isWithInModule?:boolean;
};

export const WindowTools = ({ maximized, appType, appInfo, iFrameId, setOpen, setMaximized, onClose, customTools, isBrenaOpen = false, isWithInModule=false, ...tools }: SupportingProps) => {
	const handleOpenInNewTab = () => {
		const body = { iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType }
		console.log('openinnewtab',body);
		postMessage({
			event: 'openinnewtab',
			body: body
		});
	};

	const handleClose = (event: any, reason: any) => {
		isBrenaOpen ? null : setOpen(false);
		onClose && onClose(event, 'closeButtonClick');
		if (reason && reason === 'closeButtonClick' && !isWithInModule) {
			postMessage({
				event: 'closeiframe',
				body: { iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType }
			});
		}
	};
	return <>
		{customTools || null}
		{tools?.openInNewTab && <IQTooltip title='Open in new Tab' placement={'bottom'}>
			<IconButton key={'open-in-new-tab'} aria-label='Open in new Tab' onClick={handleOpenInNewTab}>
				<span className='common-icon-external'></span>
			</IconButton>
		</IQTooltip>}
		{tools?.resizable && <>
			{!maximized ? <IQTooltip title='Maximize' placement={'bottom'}>
				<IconButton aria-label='Fullscreen control' onClick={(e) => setMaximized(true)}>
					<span className='common-icon-maximise'></span>
				</IconButton>
			</IQTooltip> : <IQTooltip title='Minimize' placement={'bottom'}>
				<IconButton aria-label='Exit fullscreen control' onClick={(e) => setMaximized(false)}>
					<span className='common-icon-minimize'></span>
				</IconButton>
			</IQTooltip>}
		</>}
		{tools?.closable && <IQTooltip title='' placement={'bottom'}>
			<IconButton aria-label='Close'
				onClick={(e) => { handleClose(e, 'closeButtonClick'); }}>
				<span className='common-icon-close'></span>
			</IconButton>
		</IQTooltip>}
	</>;
};

export default memo(WindowTools);