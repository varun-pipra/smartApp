import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { styled, alpha, Box, Button, Paper, Stack, IconButton, Menu, MenuItem, Divider, MenuProps } from '@mui/material';
import { Add, Close, KeyboardArrowDown } from '@mui/icons-material';

import './Contracts.scss';

import { getTransactionTypeText } from 'utilities/commonFunctions';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import ContractsGrid from './ContractsGrid';
import BalanceModification from 'resources/images/budgetManager/BalanceModification.svg';
import BudgetModification from 'resources/images/budgetManager/BudgetModification.svg';
import DirectCost from 'resources/images/budgetManager/DirectCost.png';
import TransferIn from 'resources/images/budgetManager/TransferIn.svg';
import TransferOut from 'resources/images/budgetManager/TransferOut.svg';
import {
	fetchUserImage, setOpenBudgetTransferForm,
	setOpenCostForm, setOpenTransactionList
} from 'features/budgetmanager/operations/rightPanelSlice';
import {
	setTransactionData, getTransactionData,
	getFilteredRecords, setFilteredRecords
} from 'features/budgetmanager/operations/transactionsSlice';

const Contracts = (props: any) => {
	const dispatch = useAppDispatch();
	const [data, setData] = useState<Array<any>>([]);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState({});
	const transactionList = useAppSelector(getTransactionData);
	const [groupAndFilterData, setGroupAndFilterData] = React.useState<any>({ group: 'None', filter: [] });
	const gridIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
	}, []);
	const {
		openCostForm,
		selectedRow,
		openTransactionList,
		openBudgetTransferForm
	} = useAppSelector(state => state.rightPanel);

	const handleTransactionItemClick = (values: any) => {
		props.transactiondata(values)
	};

	const groupHandler = (group: string) => {

		setGroupAndFilterData({ ...groupAndFilterData, group: group });
	};

	const searchHandler = (searchText: string) => {
		setSearchText(searchText);
	};

	const filterHandler = (filters: any) => {

		if (_.isEmpty(filters)) setFilters({ stageName: 'all' });
		else setFilters(filters);
	};

	useEffect(() => {
		const filteredList = filterAction(transactionList, filters, searchText);
		dispatch(setFilteredRecords(filteredList));
	}, [searchText, filters]);

	const filterAction = (list: Array<any>, filters: any = {}, searchText: string = '') => {
		let filteredTransactions = [...list];

		if (!_.isEmpty(filters) || searchText) {
			const exp = searchText ? new RegExp(searchText, 'gi') : undefined;
			filteredTransactions = filteredTransactions.filter((item) => {
				const typeText = item.smartItemId ? 'App Item' : getTransactionTypeText(item.transactionType);
				const vendorName = item.vendor ? item.vendor.name : '';

				return (filters.stageName && (filters.stageName === 'all' || (filters.stageName !== 'all' && (item.stageName === filters.stageName))))
					&& (!exp || (exp && (exp.test(item.name)
						|| exp.test(item.stageName)
						|| exp.test(typeText)
						|| exp.test(vendorName)
						|| exp.test(item.invoicePONumber))));
			});
		}

		return filteredTransactions;
	};

	return <Box className='contracts-box'>
		<div className='contracts-header'>
			<div className='title-action'>
				<span className='title'>Contracts</span>
			</div>
			<div className='contracts-kpi-fields'>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Quantity of Vendors</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							&nbsp;{0}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Number of Contracts</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							&nbsp;{0}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Contract Value</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{currencySymbol}{' 0.00'}
						</span>
					</div>
				</span>
			</div>
			<div className='search-action'>
				<IQSearch sx={{ height: '2em', width: '16rem' }}
					groups={getGroupMenuOptions()}
					filters={getFilterMenuOptions()}
					onGroupChange={groupHandler}
					onSearchChange={searchHandler}
					onFilterChange={filterHandler}
				/>
			</div>
		</div>
		<div className='contracts-list'>
			<ContractsGrid groupAndFilterData={groupAndFilterData} />
		</div>
	</Box>;
};

export default Contracts;

const getGroupMenuOptions = () => {
	return [{
		text: 'Transaction Type',
		value: 'transactionType'
	}];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'All Transaction',
		key: 'stageName',
		value: 'all'
	}, {
		text: 'Posted Transactions',
		key: 'stageName',
		value: 'Posted'
	}, {
		text: 'Pending Transactions',
		key: 'stageName',
		value: 'Pending'
	}];
};