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
import { getForecastList, setFilteredRecords } from 'features/budgetmanager/operations/forecastSlice';
import _ from 'lodash';
import { getMinMaxDrawerStatus, setMinMaxDrawerStatus } from 'features/vendorcontracts/stores/VendorContractsSlice';
import { getVendorContractsForecasts, setForecasts } from 'features/vendorcontracts/stores/ForecastsSlice';
import { getServer } from 'app/common/appInfoSlice';
import { amountFormatWithSymbol ,amountFormatWithOutSymbol} from 'app/common/userLoginUtils';

const ForecastTransactions = (props: any) => {
	const dispatch = useAppDispatch();
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedRecord } = useAppSelector(state => state.vendorContracts);
	const appInfo = useAppSelector(getServer);	
	// const { lineItem } = useAppSelector(state => state.gridData);
	const [searchText, setSearchText] = React.useState('');
	const [filters, setFilters] = React.useState({});
	const forecastList = useAppSelector(getForecastList);
	const [kpiFieldsData, setKpiFieldsData] = React.useState<any>(selectedRecord);
	const [groupAndFilterData, setGroupAndFilterData] = React.useState<any>({ group: 'None', filter: [] });
	const minMaxStatus: any = useAppSelector(getMinMaxDrawerStatus);
	const gridIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
	}, []);

	const maximizeIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-maximise' style={{ fontSize: '1.25rem' }}></div>
	}, []);

	const groupHandler = (group: string) => {
		// console.log(group);
		setGroupAndFilterData({ ...groupAndFilterData, group: group });
	};
	// React.useEffect(() => {
	// 	setKpiFieldsData(selectedRecord);
	// }, [selectedRecord]);

	React.useEffect(() => {
		dispatch(getVendorContractsForecasts({ 'appInfo': appInfo, contractId: selectedRecord?.id })).then((response) => {
			setKpiFieldsData(response?.payload)
			// dispatch(setForecasts(response?.payload))
		});
	}, [selectedRecord]);	

	const searchHandler = (searchText: string) => {
		setSearchText(searchText);
	};

	const filterHandler = (filters: any) => {
		if (_.isEmpty(filters)) setFilters({ transactionType: [] });
		else setFilters(filters);
	};

	React.useEffect(() => {
		const filteredList = filterAction(forecastList, filters, searchText);
		dispatch(setFilteredRecords(filteredList));
	}, [searchText, filters, forecastList]);

	const filterAction = (list: Array<any>, filters: any = {}, searchText: string = '') => {
		let filteredTransactions = [...list];

		if (!_.isEmpty(filters.transactionType) || searchText) {
			const exp = searchText ? new RegExp(searchText, 'gi') : undefined;
			filteredTransactions = filteredTransactions.filter((item) => {
			
				const typeText = item.type == 'Planner Tag' ? 'Summary Tag' : item.type
				const vendorName = item.vendor ? item.vendor.name : '';
				return (filters.transactionType.length === 0 || filters.transactionType.includes(typeText))
					&& (!exp || (exp && (exp.test(item.name)
						|| exp.test(item.stageName)
						|| exp.test(typeText)
						|| exp.test(vendorName))));
			});
		}

		return filteredTransactions;
	};

	const onMaximizeForecast = ()=>{
		dispatch(setMinMaxDrawerStatus({ minMax:true, forecast:true, transactions:false}));
	}

	return <Box className='forecast-transaction-box'>
		<div className='forecast-transaction-header'>
			<div className='title-action'>
				<span className='title'>Forecast Transactions </span>
				{!minMaxStatus.minMax && (<span style={{cursor:'pointer'}} onClick={onMaximizeForecast}> {maximizeIcon}</span>)}
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
					filters={getFilterMenuOptions()}
					onGroupChange={groupHandler}
					onSearchChange={searchHandler}
					onFilterChange={filterHandler}
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
		text: 'Transactions Type',
		value: 'type'
	}];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'All Transaction',
		value: 'transactionType',
		key: 'stageName',
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
			},]
		}
	}];
};