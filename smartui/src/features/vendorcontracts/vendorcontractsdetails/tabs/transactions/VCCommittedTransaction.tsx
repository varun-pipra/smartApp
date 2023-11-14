import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Box } from '@mui/material';
import { Add, Close, KeyboardArrowDown } from '@mui/icons-material';

import './VCCommittedTransaction.scss';

import { getTransactionTypeText } from 'utilities/commonFunctions';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import TypeMenu from './typeMenu/TypeMenu';
import TransactionGrid from './VCTransactionGrid';
import { getMinMaxDrawerStatus, setMinMaxDrawerStatus } from 'features/vendorcontracts/stores/VendorContractsSlice';
import { getKpiData, getOriginalTransactions, setModifiedTransactions } from 'features/vendorcontracts/stores/tabs/transactions/TransactionTabSlice';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';

const CommittedTransaction = (props: any) => {
	const dispatch = useAppDispatch();
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState({});
	const kpiData = useAppSelector(getKpiData);
	const originalTransactions = useAppSelector(getOriginalTransactions);
	const [groupAndFilterData, setGroupAndFilterData] = React.useState<any>({ group: 'None', filter: [] });
	const minMaxStatus: any = useAppSelector(getMinMaxDrawerStatus);

	const gridIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
	}, []);

	const maximizeIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-maximise' style={{ fontSize: '1.25rem' }}></div>
	}, []);

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
		// console.log("filters", filters);
		if (_.isEmpty(filters.transactionType)) setFilters({ transactionType: [] });
		else setFilters(filters);
	};

	useEffect(() => {
		const filteredList: any = filterAction(originalTransactions || [], filters, searchText);
		dispatch(setModifiedTransactions(filteredList));
	}, [searchText, filters, originalTransactions]);

	const filterAction = (list: Array<any>, filters: any = {}, searchText: string = '') => {
		let filteredTransactions = [...list];

		if (!_.isEmpty(filters.transactionType) || searchText) {
			const exp = searchText ? new RegExp(searchText, 'gi') : undefined;
			filteredTransactions = filteredTransactions.filter((item) => {
				const typeText = getTransactionTypeText(item.transactionType);
				const vendorName = item.vendor ? item.vendor.name : '';
				// console.log("filtersssss", filters, typeText, searchText, exp)

				return (filters.transactionType.includes(typeText) || filters?.transactionType.length === 0)
					&& (!exp || (exp && (exp.test(item.name)
						|| exp.test(item.stageName)
						|| exp.test(typeText)
						|| exp.test(vendorName)
						|| exp.test(item.invoicePONumber))));
			});
		}

		return filteredTransactions;
	};

	const onMaximizeTransactions = () => {
		dispatch(setMinMaxDrawerStatus({ minMax: true, forecast: false, transactions: true }));
	};

	return <Box className='committed-transaction-box'>
		<div className='committed-transaction-header'>
			<div className='title-action'>
				<span className='title'>Committed Transactions</span>
				{!minMaxStatus.minMax && (<span style={{ cursor: 'pointer' }} onClick={onMaximizeTransactions}> {maximizeIcon}</span>)}
			</div>
			<div className='committed-transaction-kpi-fields'>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Refund Amount</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiData.totalRefundAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Transfer Amount</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiData.totalTransferAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Approved COs</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiData.totalApprovedChangeOrders)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Transaction Amount</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiData.totalTransactionAmount)}
						</span>
					</div>
				</span>
			</div>
			<div className='search-action'>
				{/* <TypeMenu onItemClick={(values: any) => handleTransactionItemClick(values)} /> */}
				<div></div>
				<IQSearch sx={{ height: '2em', width: '16rem' }}
					groups={getGroupMenuOptions()}
					filters={getFilterMenuOptions()}
					onGroupChange={groupHandler}
					onSearchChange={searchHandler}
					onFilterChange={filterHandler}
				/>
			</div>
		</div>
		<div className='committed-transaction-list'>
			<TransactionGrid groupAndFilterData={groupAndFilterData} />
		</div>
	</Box>;
};

export default CommittedTransaction;

const getGroupMenuOptions = () => {
	return [{
		text: 'Budget Line Item',
		value: 'budgetLineItem'
	}, {
		text: 'Trade',
		value: 'trade'
	}];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'Budget Line Item',
		key: 'budgetLineItem',
		value: 'budgetLineItem',
		children: {
			type: 'checkbox',
			items: [{
				text: '0001 - General Contracts - 01 - Airports - Equipment',
				value: '00027'
			}]
		}
	}, {
		text: 'Trade',
		key: 'trade',
		value: 'trade',
		children: {
			type: 'checkbox',
			items: [{
				text: 'Masonary',
				value: 136879
			}, {
				text: 'Woodwork',
				value: 136880
			}]
		}
	}]
};