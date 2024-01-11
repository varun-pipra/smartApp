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
	const [filterOptions, setFilterOptions] = React.useState(getFilterMenuOptions());
	const [budgetlineitem, setBudgetLineItem] = React.useState([]);
	const kpiData = useAppSelector(getKpiData);
	const originalTransactions = useAppSelector(getOriginalTransactions);
	const [groupAndFilterData, setGroupAndFilterData] = React.useState<any>({ group: 'budgetLineItem', filter: [] });
	const minMaxStatus: any = useAppSelector(getMinMaxDrawerStatus);

	React.useEffect(() => {
		let uniqueVendors: any = [];
		originalTransactions?.map((item: any) => {
			item?.budgetLineItem && !uniqueVendors?.map((a: any) => a.value)?.includes(item?.budgetLineItem) && uniqueVendors.push({
				text: item?.budgetLineItem,
				key: item?.budgetLineItem,
				value: item?.budgetLineItem
			});
		});
		setBudgetLineItem(uniqueVendors);
	}, [originalTransactions]);

	React.useEffect(() => {
		const filtersCopy = [...filterOptions];
		let vendorItem = filtersCopy.find((rec: any) => rec.value === "budgetLineItem");
		if (vendorItem) vendorItem.children.items = budgetlineitem;
		setFilterOptions(filtersCopy);
	}, [budgetlineitem]);


	useEffect(() => {
		const filteredList: any = filterAction(originalTransactions || [], filters, searchText);
		dispatch(setModifiedTransactions(filteredList));
	}, [searchText, filters, originalTransactions]);

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
		const data = group == null || group == 'undefined' ? 'None' : group;
		setGroupAndFilterData({ ...groupAndFilterData, group: data });
	};

	const searchHandler = (searchText: string) => {
		setSearchText(searchText);
	};

	const filterHandler = (filters: any) => {
		if (_.isEmpty(filters.budgetLineItem)) setFilters({ budgetLineItem: [] });
		else setFilters(filters);
	};


	const filterAction = (list: Array<any>, filters: any = {}, searchText: string = '') => {
		let filteredTransactions = [...list];
		if (!_.isEmpty(filters.budgetLineItem)) {
			filteredTransactions = filteredTransactions.filter((item) => {
				const budgetLineItem = item.budgetLineItem ? item.budgetLineItem : '';
				return (filters.budgetLineItem.includes(item.budgetLineItem) || filters?.budgetLineItem.length === 0);
			});
		}
		if (searchText) {
			const filteredIds = originalTransactions?.map((obj: any) => obj?.id);
			filteredTransactions = filteredTransactions.filter((obj: any) => {
				return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(searchText?.toLowerCase());
			});
		}
		return filteredTransactions;
	};

	const onMaximizeTransactions = () => {
		dispatch(setMinMaxDrawerStatus({ minMax: true, forecast: false, transactions: true }));
	};

	return <Box className='vc-committed-transaction-box'>
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
					filters={filterOptions}
					onGroupChange={groupHandler}
					onSearchChange={searchHandler}
					onFilterChange={filterHandler}
					defaultGroups={'budgetLineItem'}
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
	}];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'Budget Line Item',
		key: 'budgetLineItem',
		value: 'budgetLineItem',
		children: {
			type: 'checkbox',
			items: []
		}
	}]
};