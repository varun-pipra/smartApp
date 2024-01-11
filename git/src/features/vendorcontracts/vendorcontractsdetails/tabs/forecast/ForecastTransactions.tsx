import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Box, InputLabel, InputAdornment, TextField, Stack } from '@mui/material';
import { GridView, WarningAmber } from '@mui/icons-material';

import './ForecastTransactions.scss';

import globalStyles, { primaryIconSize } from 'features/budgetmanager/BudgetManagerGlobalStyles';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import ForecastGrid from './ForecastGrid';
import {
	fetchUserImage, setOpenBudgetTransferForm,
	setOpenCostForm, setOpenTransactionList, setSelectedRowData
} from 'features/budgetmanager/operations/rightPanelSlice';
import _ from 'lodash';
import { getMinMaxDrawerStatus, setMinMaxDrawerStatus } from 'features/vendorcontracts/stores/VendorContractsSlice';
import { getVendorContractsForecasts, setForecasts, getForecastList, getOrginalForecastList } from 'features/vendorcontracts/stores/ForecastsSlice';
import { getServer } from 'app/common/appInfoSlice';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';

const ForecastTransactions = (props: any) => {
	const dispatch = useAppDispatch();
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedRecord } = useAppSelector(state => state.vendorContracts);
	const appInfo = useAppSelector(getServer);
	// const { lineItem } = useAppSelector(state => state.gridData);
	const [searchText, setSearchText] = React.useState('');
	const [filters, setFilters] = React.useState({});
	const [filterOptions, setFilterOptions] = React.useState(getFilterMenuOptions());
	const [budgetlineitem, setBudgetLineItem] = React.useState([]);
	const orginalForecastList = useAppSelector(getOrginalForecastList);
	const [kpiFieldsData, setKpiFieldsData] = React.useState<any>(selectedRecord);
	const [groupAndFilterData, setGroupAndFilterData] = React.useState<any>({ group: 'budgetLineItem', filter: [] });
	const minMaxStatus: any = useAppSelector(getMinMaxDrawerStatus);

	const gridIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
	}, []);

	const maximizeIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-maximise' style={{ fontSize: '1.25rem' }}></div>
	}, []);


	React.useEffect(() => {
		let uniqueVendors: any = [];
		orginalForecastList?.map((item: any) => {
			item?.budgetLineItem && !uniqueVendors?.map((a: any) => a.value)?.includes(item?.budgetLineItem) && uniqueVendors.push({
				text: item?.budgetLineItem,
				key: item?.budgetLineItem,
				value: item?.budgetLineItem
			});
		});
		setBudgetLineItem(uniqueVendors);
	}, [orginalForecastList]);

	React.useEffect(() => {
		const filtersCopy = [...filterOptions];
		let vendorItem = filtersCopy.find((rec: any) => rec.value === "budgetLineItem");
		if (vendorItem) vendorItem.children.items = budgetlineitem;
		setFilterOptions(filtersCopy);
	}, [budgetlineitem]);


	React.useEffect(() => {
		dispatch(getVendorContractsForecasts({ 'appInfo': appInfo, contractId: selectedRecord?.id })).then((response) => {
			setKpiFieldsData(response?.payload)
		});
	}, [selectedRecord]);

	const groupHandler = (group: string) => {
		const data = group == null || group == 'undefined' ? 'None' : group;
		setGroupAndFilterData({ ...groupAndFilterData, group: data });
	};

	const searchHandler = (searchText: string) => {
		setSearchText(searchText);
	};

	const filterHandler = (filters: any) => {
		if (_.isEmpty(filters)) setFilters({ transactionType: [] });
		else setFilters(filters);
	};

	React.useEffect(() => {
		const filteredList = filterAction(orginalForecastList, filters, searchText);
		dispatch(setForecasts(filteredList));
	}, [searchText, filters, orginalForecastList]);

	const filterAction = (list: Array<any>, filters: any = {}, searchText: string = '') => {
		let filteredTransactions = [...list];
		if (!_.isEmpty(filters.budgetLineItem)) {
			filteredTransactions = filteredTransactions.filter((item) => {
				const budgetLineItem = item.budgetLineItem ? item.budgetLineItem : '';
				return (filters.budgetLineItem.includes(item.budgetLineItem) || filters?.budgetLineItem.length === 0);
			});
		}
		if (searchText) {
			const filteredIds = orginalForecastList?.map((obj: any) => obj?.id);
			filteredTransactions = filteredTransactions.filter((obj: any) => {
				return filteredIds?.includes(obj?.id) && JSON.stringify(obj)?.toLowerCase()?.includes(searchText?.toLowerCase());
			});
		}
		return filteredTransactions;
	};

	const onMaximizeForecast = () => {
		dispatch(setMinMaxDrawerStatus({ minMax: true, forecast: true, transactions: false }));
	}

	return <Box className='vc-forecast-transaction-box'>
		<div className='forecast-transaction-header'>
			<div className='title-action'>
				<span className='title'>Forecast Transactions </span>
				{!minMaxStatus.minMax && (<span style={{ cursor: 'pointer' }} onClick={onMaximizeForecast}> {maximizeIcon}</span>)}
			</div>
			<div className='forecast-kpi-fields'>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Pending Refund</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiFieldsData?.totalPendingRefund)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Pending Change Order</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiFieldsData?.totalPendingChangeOrder)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Pending Transactions</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiFieldsData?.totalPendingTransactions)}
						</span>
					</div>
				</span>
				<span className='kpi-stack'>
					<span className='kpi-label'>Forecast Contract <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(kpiFieldsData?.forecastContract)}</span>
					<span className='kpi-label'>Forecast Balance <span className='bold'>{currencySymbol}</span></span><span className={`bold amount ${kpiFieldsData?.forecastBalance >= 0 ? 'positive' : 'negative'}`}>{amountFormatWithOutSymbol(kpiFieldsData?.forecastBalance)}</span>
				</span>
			</div >
			<div className='search-action'>
				<IQSearch sx={{ height: '2em', width: '16rem' }}
					groups={getGroupMenuOptions()}
					filters={filterOptions}
					onGroupChange={groupHandler}
					onSearchChange={searchHandler}
					onFilterChange={filterHandler}
					defaultGroups={'budgetLineItem'}
				/>
			</div>
		</div >
		<div className='forecast-transaction-list'>
			<ForecastGrid groupAndFilterData={groupAndFilterData} />
		</div>
	</Box >;
};

export default ForecastTransactions;

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