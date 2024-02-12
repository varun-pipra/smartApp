import { ReactNode } from 'react';
import { DialogProps } from '@mui/material';
import { Nullable } from 'app/common/types';

export interface IQBaseWindowToolsProp {
	closable?: boolean;
	resizable?: boolean;
	openInNewTab?: boolean;
	customTools?: ReactNode;
};

export interface IQBaseWindowPresenceProp {
	presenceId?: any;
	showBrena?: boolean;
	showPrint?:boolean;
	showLiveSupport?: boolean;
	showLiveLink?: boolean;
	showStreams?: boolean;
	showComments?: boolean;
	showChat?: boolean;
	hideProfile?: boolean;
};

type IQBaseWindowCloseReason = 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick' | 'programmatic';

export type IQBaseWindowProps = DialogProps & {
	appType?: string;
	appInfo?: any;
	iFrameId?: string;
	isFromHelpIcon?: any;
	tabName?:any;
	className?: string;
	isFullView?: boolean;
	iconCls?: string;
	title?: string | any;
	zIndex?: number;
	tools?: IQBaseWindowToolsProp;
	presenceProps?: IQBaseWindowPresenceProp;
	righPanelPresenceProps?: IQBaseWindowPresenceProp;
	maxByDefault?: boolean;
	inlineModule?: boolean;
	showBrena?: boolean;
	moduleColor?: string;
	onIconClick?: any;
	onMaximize?: (event: any, maximizeState: boolean) => void;
	onClose?: (event: any, reason?: IQBaseWindowCloseReason) => void;
	toast?: string;
	toastTimeout?: number;
	actions?: ReactNode;
	centerPiece?: ReactNode;
	titleInfo?: Nullable<{ imgSrc: string, text: string; }>;
	isBrenaOpen?: boolean;
	withInModule?:boolean;	
	rightSideText?:any;
};