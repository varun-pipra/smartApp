import './IQGridWindowDetail.scss';

import { IQBaseWindowPresenceProp } from 'components/iqbasewindow/IQBaseWindowTypes';
import IQButton from 'components/iqbutton/IQButton';
import IQGridLID from 'components/iqgridwindowdetail/IQGridWindowDetail';
import IQObjectPage from 'components/iqobjectpage/IQObjectPage';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import DynamicPage, {
	DynamicPageProps, IQDynamicPropsHeadContentProps
} from 'components/ui5/dynamicpage/DynamicPage';
import { appInfoData } from 'data/appInfo';
import AwardBid from 'features/bidmanager/bidpackagedetails/tabs/awardbid/AwardBid';
import Bidders from 'features/bidmanager/bidpackagedetails/tabs/bidders/Bidders';
import React, { memo, useEffect, useRef, useState } from 'react';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import { renderPresence } from 'utilities/presence/Presence';
import { Close } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, InputLabel, Stack, TextField } from '@mui/material';
import { postMessage } from 'app/utils';
import BlockchainIB from 'features/common/informationBubble/BlockchainIB';

interface IQGridWindowDetailFooterProps {
	hideNavigation?: boolean;
	leftNode?: React.ReactNode;
	centerNode?: React.ReactNode;
	rightNode?: React.ReactNode;
	toast?: React.ReactNode;
	showNavigationCount?: boolean;
};

export interface IQGridWindowDetailProps {
	data?: any;
	appType?: string;
	appInfo?: any;
	iFrameId?: string;
	isFromHelpIcon?: any;
	onClose?: any;
	presenceProps?: IQBaseWindowPresenceProp;
	headContent?: IQDynamicPropsHeadContentProps;
	defaultTabId?: any;
	tabPadValue?: number;
	iframeEventData?: any;
	tabs?: Array<any>;
	title?: string;
	subtitle?: React.ReactNode;
	showSubTitle?: boolean;
	footer?: IQGridWindowDetailFooterProps;
	onNavigation?: any;
	navigationDisableFlag?: -1 | 0 | 1;
	handleActiveTab?: any;
	hideNavigation?: boolean;
	navigationPages?: any;
	defaultSpacing?: boolean;
	onPrevious?: any;
	onNext?: any;
	handleHelp?: any;
	showHepIcon?: boolean;
	enableHelp?: boolean;
};

const IQGridWindowDetail = ({
	appType, appInfo, data, presenceProps, title, subtitle, showSubTitle = false, handleHelp, showHepIcon = false, enableHelp = true,
	iFrameId, isFromHelpIcon, onClose, headContent, defaultTabId, tabPadValue = 0, tabs, footer, onNavigation, handleActiveTab, hideNavigation = false,
	navigationDisableFlag, defaultSpacing = false, onPrevious, onNext, ...props
}: IQGridWindowDetailProps) => {
	const [tabSelected, setTabSelected] = useState(defaultTabId);
	const [prevBtnDisabled, setPrevBtnDisabled] = useState(navigationDisableFlag === -1);
	const [nextBtnDisabled, setNextBtnDisabled] = useState(navigationDisableFlag === 1);
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(true);
	const presenceRef = useRef(false);
	const tabid = useRef(defaultTabId);

	const tabSelectedValue = (value: any) => {
		tabid.current = value;
		setTabSelected(value);
		handleActiveTab(value);
	};

	useEffect(() => {
		if (tabSelected) {
			renderPresence(presenceProps, appInfo, iFrameId || '', appType || '', isFromHelpIcon, tabid.current, data?.id, data?.code);
			if (enableHelp) {
				help(false);
			};
		}
	}, [tabSelected]);

	const help = (isFromHelpIcon: any) => {
		const body = { iframeId: iFrameId, roomId: data?.id, appType: appType, tabName: tabid.current, isFromHelpIcon: isFromHelpIcon };
		postMessage({
			event: "help",
			body: body
		});
	};

	useEffect(() => {
		if (appInfo) {
			if (presenceRef.current) return;
			else {
				presenceRef.current = true;
				renderPresence(presenceProps, appInfo, iFrameId || '', appType || '', isFromHelpIcon, tabid.current, data?.id, data?.code);
			}
		}
	}, [data, appInfo]);


	useEffect(() => {
		setPrevBtnDisabled(navigationDisableFlag === -1);
		setNextBtnDisabled(navigationDisableFlag === 1);
	}, [navigationDisableFlag]);

	const onScroll = (value: any) => {
		if (pinned == false) { setCollapsed(value); }
	};

	const presenceId = presenceProps?.presenceId || '';

	const dynamicPageProps: DynamicPageProps = {
		pinned: pinned,
		headContent: headContent,
		collapsed: collapsed,
		onPinClick: (value: any) => { setPinned(value); },
		bodyContent: <IQObjectPage
			tabs={tabs || []}
			defaultTabId={defaultTabId}
			tabPadValue={tabPadValue}
			onTabChange={(value: any) => tabSelectedValue(value)}
			scroll={(value: any) => onScroll(value)}
			defaultSpacing={defaultSpacing}
		/>
	};
	const rigthpanelClose = () => {
		onClose();
		const body = { iframeId: iFrameId, roomId: data?.id, appType: appType, isFromHelpIcon: false };
		postMessage({
			event: "help",
			body: body
		});
	};
	return <SUIDrawer
		className='iqgrid-window-details-root'
		PaperProps={{ style: { position: 'absolute', minWidth: '60em', width: '65vw', borderRadius: '0.5em', boxShadow: '-2px 1px 8px #0000001a' } }}
		anchor='right'
		variant='permanent'
		elevation={8}
		open={false}
	>
		<Stack direction='row' className='title-bar'>
			<span className='title'>{title || ''}</span>
			{showSubTitle && (
				<span>{subtitle || <></>}</span>
			)}
			<Stack direction='row' style={{ gap: '4px' }}>
				{showHepIcon && (
					<IconButton
						className="close-btn live-support-cls"
						aria-label="Close Right Pane"
						onClick={handleHelp}
					>
						<span className="common-icon-Live-Support-Help header_icon"></span>
					</IconButton>
				)}
				<IconButton
					className='close-btn'
					aria-label='Close Right Pane'
					onClick={() => { rigthpanelClose(); }}
				>
					<Close />
				</IconButton>
			</Stack>
		</Stack>
		{dynamicPageProps?.headContent?.showBCInfo && <BlockchainIB />}
		{presenceId && <Stack id={presenceId} className='presence-box'></Stack>}
		<Stack className='body'>
			<DynamicPage className='body-content' {...dynamicPageProps} />
		</Stack>
		<Stack direction='row' className='footer'>
			{footer?.hideNavigation ? '' : <>
				<span className='footer-left'>
					<IQTooltip title='Previous Record' placement={'top'} arrow>
						<IconButton
							aria-label='Previous Record'
							className='footer-icons'
							size='small'
							disabled={prevBtnDisabled}
							onClick={() => {
								if (onPrevious) onPrevious();
								else
									onNavigation && onNavigation('-');
							}}
						>
							<span className='nav-icon common-icon-left-arrow'></span>
						</IconButton>
					</IQTooltip>
					{footer?.showNavigationCount && (
						<span className="footer-left-count">
							{props?.navigationPages?.startPage} of {props?.navigationPages?.endPage}
						</span>
					)}
					<IQTooltip title='Next Record' placement={'top'} arrow>
						<IconButton
							aria-label='Next Record'
							className='footer-icons'
							size='small'
							disabled={nextBtnDisabled}
							onClick={() => {
								if (onNext) onNext();
								else
									onNavigation && onNavigation('+');
							}}
						>
							<span className='nav-icon common-icon-Right-arrow'></span>
						</IconButton>
					</IQTooltip>
				</span>
			</>}
			{footer?.leftNode}
			<span className='footer-center'>{footer?.centerNode}</span>
			<span className='footer-right'>{footer?.rightNode}</span>
			{footer?.toast}
		</Stack>
	</SUIDrawer>;
};

export default memo(IQGridWindowDetail);