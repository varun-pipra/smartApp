import * as React from 'react';
import { Button, ButtonProps, ListItemIcon, ListItemText, ListSubheader, ListItem, Popper, MenuList, ListItemProps, Paper } from '@mui/material';
import PopupState, { bindTrigger, bindMenu, bindHover } from 'material-ui-popup-state';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import _ from 'lodash';

import './IQMenuListItem.scss';
import { ContentCut } from '@mui/icons-material';

export interface IQMenuListItemOption {
	text: string;
	value: number | string;
};

export interface IQMenuListItemProps extends ListItemProps {
	menu?: React.ReactNode;
	options?: Array<IQMenuListItemOption>;
};

const IQMenuListItem = (props: IQMenuListItemProps) => {
	const [el, setEl] = React.useState();
	const [open, setOpen] = React.useState(false);
	const [hover, setHover] = React.useState(false);

	const onParentHover = (e: any) => {
		e.stopPropagation();
		e.preventDefault();
		const target = e.currentTarget;
		setTimeout(() => {
			setOpen(e.type != 'mouseleave');
			setEl(target);
		}, 500);
	};

	const onSelfHover = (e: any) => {
		e.stopPropagation();
		e.preventDefault();
		setHover(e.type != 'mouseleave');
	};

	return <React.Fragment>
		<ListItem
			{..._.omit(props, ['menu', 'options'])}
			onMouseEnter={onParentHover}
			onMouseLeave={onParentHover}
			onTouchStart={onParentHover}
		>
			{props.children}
		</ListItem>
		{props.menu && <Popper
			anchorEl={el}
			placement="right-start"
			className="search-group-filter-menu"
			open={open || hover}
			sx={{ zIndex: 9999 }}
			onMouseEnter={onSelfHover}
			onMouseLeave={onSelfHover}
			onTouchStart={onSelfHover}
		>
			<Paper elevation={3}>
				{props.menu}
			</Paper>
		</Popper>}
	</React.Fragment>
};

export default IQMenuListItem;