import React from 'react';
import { Box, MenuItem, Paper, Typography } from '@mui/material';
import { Add, KeyboardArrowDown } from '@mui/icons-material';

import './UploadMenu.scss';
import IQMenuButton from 'components/iqmenu/IQMenuButton';
import BalanceModification from 'resources/images/budgetManager/BalanceModification.svg';
//import BudgetModification from 'resources/images/budgetManager/BudgetModification.svg';
//import DirectCost from 'resources/images/budgetManager/DirectCost.png';
import TransferIn from 'resources/images/budgetManager/TransferIn.svg';
import TransferOut from 'resources/images/budgetManager/TransferOut.svg';
import CloseIcon from '@mui/icons-material/Close';

interface UploadMenuProps {
	label?: string;
	folderType?: any;
	onItemClick?: (object: any) => void;
	showContractOption?: boolean;
	showDriveOption?: boolean;
	dropdownLabel?:any;
	disabled?:boolean;
};

const UploadMenu = ({ label, dropdownLabel = 'Select Transaction Type',disabled = false, ...props }: UploadMenuProps) => {
	const [close, setClose] = React.useState<any>(true);
	const onHeaderChange = (type: string) => {
		if (props.onItemClick) props.onItemClick({
			type: type
		});
	};
	
	return <IQMenuButton
		className='upload-type-menu'
		label={label ? label : (props.folderType == 'File' ? 'Add Documents' : 'Add Drawings')}
		startIcon={<span className="common-icon-Add" />}
		endIcon={<span className="common-icon-down-arrow1" />}
		close={close}
		disabled={disabled}
		sx={{ minWidth: '16em' }}
	>
		<Typography className='menu-header' style={{ fontSize: '16px', fontWeight: 'bolder', paddingLeft: '12px', margin: '6px', color: '#333333' }}>
			{dropdownLabel}
			<span style={{ float: 'right', paddingRight: '5px' }}>
				<CloseIcon style={{ verticalAlign: 'top', cursor: 'pointer' }} onClick={() => { setClose(!close) }} /></span>
		</Typography>
		{props.showContractOption && <MenuItem onClick={() => { onHeaderChange('Contract Files'); setClose(!close) }}>
			<span className='common-icon-post-contract'></span>
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Select Bid Package from Contract Files</span>
		</MenuItem>}
		{props.showDriveOption && <MenuItem onClick={() => { onHeaderChange('project'); setClose(!close) }}>
			<span className='common-icon-projects'></span>
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Select from Project files</span>
		</MenuItem>}
		<MenuItem disableRipple onClick={() => { onHeaderChange('local'); setClose(!close) }}>
			<span className='common-icon-browse-locally'></span>
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Browse Locally</span>
		</MenuItem>
	</IQMenuButton>;
};

export default UploadMenu;