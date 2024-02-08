import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import merge from 'lodash/merge';
import { memo, useEffect, useRef, useState } from 'react';

import 'utilities/presence/PresenceManager.css';
import './IQBaseWindow.scss';

// Project files and internal support import
import Toast from 'components/toast/Toast';
import { renderPresence } from 'utilities/presence/Presence';
import WindowTools from './IQBaseWindowTools';
import { IQBaseWindowProps } from './IQBaseWindowTypes';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { postMessage } from 'app/utils';
import { useAppDispatch } from "app/hooks";
import { setIsAppMaximized } from "app/common/appInfoSlice";

// Component definition
const IQBaseWindow = ({ open, appType, appInfo, actions, className, maxByDefault, moduleColor, onIconClick,
	inlineModule, isFullView, iconCls, title, tools, presenceProps, children, zIndex, centerPiece, titleInfo,
	onMaximize, onClose, iFrameId, isFromHelpIcon, tabName, toast, toastTimeout, PaperProps, showBrena = false, isBrenaOpen = false, withInModule=false, ...dialogProps }: IQBaseWindowProps) => {
	// State declaration
	const [isOpen, setOpen] = useState(open);
	const [showToast, setShowToast] = useState(false);
	const [maximized, setMaximized] = useState(isFullView || appInfo?.fullScreen || maxByDefault);
	const dispatch = useAppDispatch();

	const handleBrena = () => {
		postMessage({ event: 'openbrena' });
	};

	// Local variable declaration
	const presenceRef = useRef(false);
	const brenaAIButton = (maxByDefault && showBrena && <IQTooltip title='Brena AI' placement={'bottom'}>
		<IconButton className='brena-ai-btn' onClick={handleBrena}>
			<span className='common-icon-brena'></span>
		</IconButton>
	</IQTooltip>);

	// Effect definitions
	useEffect(() => {
		setMaximized(isFullView || appInfo?.fullScreen || maxByDefault);
	}, [isFullView, appInfo?.fullScreen, maxByDefault]);

	useEffect(() => {
		dispatch(setIsAppMaximized(maximized));
	}, [maximized]);

	useEffect(() => {
		if (toast != '' && toast != undefined) {
			setShowToast(true);
		} else {
			setShowToast(false);
		}
	}, [toast]);

	useEffect(() => {
		onMaximize && onMaximize(null, (maximized || false));
	}, [maximized]);

	useEffect(() => {
		if (appInfo) {
			if (presenceRef.current) return;
			presenceRef.current = true;
			renderPresence(presenceProps, appInfo, iFrameId || '', appType || '', isFromHelpIcon, tabName);
		}
	}, [appInfo]);

	return <Dialog
		maxWidth={false}
		PaperProps={merge({
			sx: {
				minWidth: maximized ? '100vw' : '50%',
				minHeight: maximized ? '100vh' : '35%',
				borderRadius: maximized ? 0 : '0.25em'
			}
		}, PaperProps)}
		open={isOpen}
		style={{ zIndex: zIndex ? zIndex : 1300 }}
		className={`iqbase-window${className ? ` ${className}` : ''}`}
		{...dialogProps}
	>
		<DialogTitle>
			{title ? <div className='titlebar-inner-items title-text'>
				{iconCls && <span
					onClick={onIconClick}
					style={{ color: inlineModule ? moduleColor : 'initial' }}
					className={`title-icon ${inlineModule ? 'common-icon-home' : iconCls}`}
				></span>}
				{title}
			</div> : null}
			<div className='titlebar-inner-items title-center-piece'>
				{centerPiece && <div className='message'>
					<span className='message-icon common-icon-info-white'></span>
					<span className='message-text'>{centerPiece}</span>
				</div>}
			</div>
			<div className='titlebar-inner-items title-tools'>
				{!isFullView ? <WindowTools
					{...tools}
					appType={appType || ''}
					appInfo={appInfo}
					maximized={maximized || false}
					iFrameId={iFrameId || ''}
					setOpen={setOpen}
					setMaximized={setMaximized}
					onClose={onClose}
					isBrenaOpen={isBrenaOpen}
					isWithInModule={withInModule}
				/> : (presenceProps?.presenceId && <div id={presenceProps.presenceId} className={`presence-box${isFullView ? ' full-view' : ''}`}></div>)}
			</div>
			<div className='titlebar-inner-items title-info'>
				{titleInfo && <span className='title-info-pill'>
					<img className='title-info-img' src={titleInfo.imgSrc} />
					{titleInfo.text}
				</span>}
			</div>
			<div className='titlebar-inner-items'></div>
			<div className='titlebar-inner-items'>
				{!isFullView && presenceProps?.presenceId && <div className='presence-container'>{brenaAIButton}<div id={presenceProps.presenceId} className={`presence-box${isFullView ? ' full-view' : ''}`}></div></div>}
			</div>
		</DialogTitle>
		<DialogContent dividers>{children}</DialogContent>
		{actions ? <DialogActions>{actions}</DialogActions> : ''}
		{showToast ? <Toast message={toast} interval={toastTimeout || 3000} onHide={() => { setShowToast(false); }} /> : ''}
	</Dialog>;
};

export default memo(IQBaseWindow);