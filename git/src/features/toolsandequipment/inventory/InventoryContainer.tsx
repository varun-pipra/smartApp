import * as React from 'react';
import { Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from 'app/hooks';

// import './InventoryContainer.scss';
import InventoryList from './InventoryList';
import InventoryAnalytics from './InventoryAnalytics';
import InventoryRTLS from './InventoryRTLSList';
import { getInventoryTab, setShowAddInventoryPopup } from '../operations/inventorySlice';
import AddInventory from './addinventory/Inventory';

const InventoryContainer = (props: any) => {
	const dispatch = useAppDispatch();
	const tab = useAppSelector(getInventoryTab);
	const { showAddInventoryPopup } = useAppSelector(
		(state) => state.inventory
	);

	return <Box height={'100%'}>
		{showAddInventoryPopup && <AddInventory onClose={() => dispatch(setShowAddInventoryPopup(false))} />}
		{tab === 0 ? <InventoryList /> : ''}
		{tab === 1 ? <InventoryAnalytics /> : ''}
		{tab === 2 ? <InventoryRTLS /> : ''}
	</Box>
};

export default InventoryContainer;