import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useMemo, useState } from 'react';

import './CommittedTransaction.scss';
import { amountFormatWithSymbol} from 'app/common/userLoginUtils';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import { getTransactionData, setFilteredRecords } from 'features/budgetmanager/operations/transactionsSlice';
import { getTransactionTypeText } from 'utilities/commonFunctions';
import TransactionGrid from './TransactionGrid';
import TypeMenu from './typeMenu/TypeMenu';

const CommittedTransaction = (props: any) => {
	const dispatch = useAppDispatch();
	const [data, setData] = useState<Array<any>>([]);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState({});
	const [filterOptions, setFilterOptions] = React.useState(getFilterMenuOptions());
	const [vendorList, setVendorsList] = React.useState([]);
	const transactionList = useAppSelector(getTransactionData);
	const [groupAndFilterData, setGroupAndFilterData] = React.useState<any>({ group: 'None', filter: [] });
	const gridIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>;
	}, []);
	const {
		openCostForm,
		selectedRow,
		openTransactionList,
		openBudgetTransferForm
	} = useAppSelector(state => state.rightPanel);

	const handleTransactionItemClick = (values: any) => {
		props.transactiondata(values);
	};

	const groupHandler = (group: string) => {
		setGroupAndFilterData({ ...groupAndFilterData, group: group });
	};

	const searchHandler = (searchText: string) => {
		setSearchText(searchText);
	};

	React.useEffect(() => {
		let uniqueVendors: any = [];
		transactionList?.map((item: any) => {
			item?.vendor?.name && item?.vendor?.id && !uniqueVendors?.map((a: any) => a.value)?.includes(item?.vendor?.id) && uniqueVendors.push({
				text: item?.vendor?.name,
				key: item?.vendor?.id,
				value: item?.vendor?.id
			});
		});
		// const uniqueVendors: any = Array.from(new Map((transactionList || []).map((item: any) =>
		// 	[item?.vendor?.id, { text: item?.vendor?.name, key: item?.vendor?.id, value: item?.vendor?.id }])).values());
		setVendorsList(uniqueVendors);
	}, [transactionList]);

	React.useEffect(() => {
		const filtersCopy = [...filterOptions];
		let vendorItem = filtersCopy.find((rec: any) => rec.value === "vendor");
		if (vendorItem) vendorItem.children.items = vendorList;
		setFilterOptions(filtersCopy);
	}, [vendorList]);

	const filterHandler = (filters: any) => {
		// console.log("filters", filters);
		if (isEmpty(filters.transactionType)) setFilters({ ...filters, transactionType: [] });
		else setFilters(filters);
	};

	useEffect(() => {
		const filteredList = filterAction(transactionList, filters, searchText);
		dispatch(setFilteredRecords(filteredList));
	}, [searchText, filters]);

	const filterAction = (list: Array<any>, filters: any = {}, searchText: string = '') => {
		let filteredTransactions = [...list];
		if (!isEmpty(filters?.vendor)) {
			filteredTransactions = filteredTransactions.filter((item: any) => {
				return filters?.vendor?.includes(item?.vendor?.id);
			});
		}

		if (!isEmpty(filters.transactionType) || searchText) {
			const exp = searchText ? new RegExp(searchText, 'gi') : undefined;
			filteredTransactions = filteredTransactions.filter((item) => {
				const typeText = getTransactionTypeText(item.transactionType);
				const vendorName = item.vendor ? item.vendor?.name : '';
				console.log("filtersssss", filters, typeText, searchText, exp);

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

	return <Box className='committed-transaction-box'>
		<div className='committed-transaction-header'>
			<div className='title-action'>
				<span className='title'>Committed Transactions</span>
			</div>
			<div className='committed-transaction-kpi-fields'>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Refund Amount</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(selectedRow?.totalRefundAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Transfer Amount</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(selectedRow.totalTransferAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Approved COs</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(selectedRow?.totalChangeOrders)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Transaction Amount</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(selectedRow?.totalTransactionAmount)}
						</span>
					</div>
				</span>
			</div>
			<div className='search-action'>
				<TypeMenu onItemClick={(values: any) => handleTransactionItemClick(values)} />
				<IQSearch sx={{ height: '2em', width: '16rem' }}
					groups={getGroupMenuOptions()}
					filters={filterOptions}
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
		text: 'Transactions Type',
		value: 'transactionType'
	},
	{
		text: 'Vendor',
		value: 'vendor.name'
	}
	];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'Transaction Type',
		key: 'stageName',
		value: 'transactionType',
		children: {
			type: 'checkbox',
			items: [{
				text: 'Direct Cost',
				value: 'Direct Cost'
			}, {
				text: 'Modifications',
				value: 'Modification'
			},
			{
				text: 'Refunds',
				value: 'Refund'
			},
			{
				text: 'Transfer In',
				value: 'Transfer In'
			},
			{
				text: 'Transfer Out',
				value: 'Transfer Out'
			}]
		}
	},
	{
		text: 'Vendor',
		key: 'vendor',
		value: 'vendor',
		children: {
			type: 'checkbox',
			items: []
		}
	}
	];
};