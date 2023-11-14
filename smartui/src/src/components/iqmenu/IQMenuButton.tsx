import {IconButton} from '@mui/material';
import {useState, useEffect, MouseEvent} from 'react';

import './IQMenuButton.scss';

import IQMenu from './IQMenu';
import IQButton from 'components/iqbutton/IQButton';

const IQMenuButton = (props: any) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		props.onOpen && props.onOpen();
	};

	const handleClose = () => {
		setAnchorEl(null);
		props.onClose && props.onClose();
	};

	useEffect(() => {
		setAnchorEl(null);
	}, [props.close]);

	return (
		<div className={`iq-menu-button${props.className ? ' ' + props.className : ''}`}>
			{props.type === 'icon' ? <IconButton onClick={handleClick}>
				{props.icon}
			</IconButton> : <IQButton
				color='blue'
				id='iq-menu-button'
				aria-controls={open ? 'iq-menu-button' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				variant='contained'
				disableElevation
				onClick={handleClick}
				startIcon={props.startIcon || ''}
				endIcon={props.endIcon || ''}
				disabled={props.disabled || false}
			>
				{props.label}
			</IQButton>}
			<IQMenu
				id='iq-custom-menu'
				MenuListProps={{'aria-labelledby': 'iq-custom-menu', sx: {width: props?.menuWidth ?? 'initial'}}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				className='iq-custom-menu-list'
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				{...props.menuProps}
			>
				{props.children}
			</IQMenu>
		</div>
	);
};

export default IQMenuButton;