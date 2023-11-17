import React from 'react';
import { Box, MenuItem, Paper, Typography } from '@mui/material';
import { Add, KeyboardArrowDown } from '@mui/icons-material';

import './TypeMenu.scss';

import { useAppDispatch } from 'app/hooks';
import IQMenuButton from 'components/iqmenu/IQMenuButton';
import BalanceModification from 'resources/images/budgetManager/BalanceModification.svg';
import BudgetModification from 'resources/images/budgetManager/BudgetModification.svg';
import DirectCost from 'resources/images/budgetManager/DirectCost.png';
import TransferIn from 'resources/images/budgetManager/TransferIn.svg';
import TransferOut from 'resources/images/budgetManager/TransferOut.svg';
import { setOpenBudgetTransferForm, setOpenCostForm } from 'features/budgetmanager/operations/rightPanelSlice';
import CloseIcon from '@mui/icons-material/Close';
import SUIDrawer from 'sui-components/Drawer/Drawer';
interface TypeMenuProps {
	onItemClick?: (object: any) => void;
}

const TypeMenu = (props: TypeMenuProps) => {
	const dispatch = useAppDispatch();
	const [close, setClose] = React.useState<any>(true);
	const onHeaderChange = (text1: string, text2: string, type: number) => {
		if (props.onItemClick) props.onItemClick({
			type: type,
			primaryHeader: text1,
			secondaryHeader: text2
		});
	};

	return <IQMenuButton
		className='transaction-type-menu'
		label='Create Pay Application'
		startIcon={<Add />}
		endIcon={<KeyboardArrowDown />}
		close={close}
	>
		<Typography style={{ fontSize: '16px', fontWeight: 'bolder', paddingLeft: '18px', margin: '6px', color: '#333333' }}>
			Select Transaction Type
			<span style={{ paddingLeft: '85px', paddingRight: '5px' }}>
				<CloseIcon style={{ verticalAlign: 'top', cursor: 'pointer' }} onClick={() => { setClose(!close) }} /></span>
		</Typography>
		<MenuItem onClick={() => { dispatch(setOpenCostForm(true)); onHeaderChange('Direct Cost', 'Decrements Budget', 1); setClose(!close) }}>
			<Box component='img' alt='Direct Cost Icon' src={DirectCost} className='image' width={30} height={30} color={'#666666'} />
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Direct Cost <span style={{ color: '#999999' }}>(Decrements Budget)</span></span>
		</MenuItem>
		<MenuItem disableRipple onClick={() => { dispatch(setOpenCostForm(true)); onHeaderChange('Budget Modification', 'Change Order', 2); setClose(!close) }}>
			<Box component='img' alt='Budget Modification Icon' src={BudgetModification} className='image' width={30} height={30} />
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Budget Modification <span style={{ color: '#999999' }}>(Change Order)</span></span>
		</MenuItem>
		<MenuItem disableRipple onClick={() => { dispatch(setOpenCostForm(true)); onHeaderChange('Balance Modification', 'Refund', 3); setClose(!close) }}>
			<Box component='img' alt='Balance Modification Icon' src={BalanceModification} className='image' width={30} height={30} />
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Balance Modification <span style={{ color: '#999999' }}>(Refund)</span></span>
		</MenuItem>
		<MenuItem disableRipple onClick={() => { dispatch(setOpenBudgetTransferForm(true)); onHeaderChange('Transfer In', '', 4); setClose(!close) }}>
			<Box component='img' alt='Transfer In Icon' src={TransferIn} className='image' width={30} height={30} />
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Transfer In</span>
		</MenuItem>
		<MenuItem disableRipple onClick={() => { dispatch(setOpenBudgetTransferForm(true)); onHeaderChange('Transfer Out', '', 5); setClose(!close) }}>
			<Box component='img' alt='Transfer Out Icon' src={TransferOut} className='image' width={30} height={30} />
			<span className='menu-text' style={{ fontSize: '15px', color: '#333333' }}>Transfer Out</span>
		</MenuItem>
	</IQMenuButton>;
};

export default TypeMenu;