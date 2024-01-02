import { ButtonProps, PopperProps } from '@mui/material';

export interface IQIconButtonMenuChildrenItem {
	text: string;
	key?: string;
	value: number | string;
	hidden?:boolean;
}

export interface IQIconButtonMenuChildren {
	type: 'checkbox' | 'radio' | 'custom';
	items?: Array<IQIconButtonMenuChildrenItem>;
	component?: React.ReactNode;
}

export interface IQIconButtonMenuOption {
	text: string;
	value: number | string;
	icon?: React.ReactElement;
	children?: IQIconButtonMenuChildren;
	hidden?:boolean;
}

export interface IQIconButtonMenuPaperProps extends PopperProps {
	open?: boolean;
	header?: string | React.ReactNode;
}

export interface IQIconButtonMenuProps {
	showNone?: boolean;
	noneText?: string;
	allowSubMenu?: boolean;
	defaultValue?: any;
	onChange?: any;
	options?: Array<IQIconButtonMenuOption>;
	menuProps?: IQIconButtonMenuPaperProps;
	buttonProps?: ButtonProps;
	extraMenuItem?: any;
	extraMenuItemShow?: boolean;
	onClose?:Function;
	defaultFilters?:any;
	defaultGroups?:any;
	headerStatusFilters?:any;
	showSearchField?:boolean;
}

export default IQIconButtonMenuProps;