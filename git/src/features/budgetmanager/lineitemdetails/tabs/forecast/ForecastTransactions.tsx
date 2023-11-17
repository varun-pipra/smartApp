import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Box, InputLabel, InputAdornment, TextField, Stack } from '@mui/material';
import { GridView, WarningAmber } from '@mui/icons-material';
import './ForecastTransactions.scss';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
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
import { getServer } from 'app/common/appInfoSlice';
import { fetchLineItemData } from 'features/budgetmanager/operations/gridSlice';
import { fetchForecastData, setCallForecastApi } from 'features/budgetmanager/operations/forecastSlice';

const ForecastTransactions = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedRow } = useAppSelector(state => state.rightPanel);
	const { callForecastApi } = useAppSelector(state => state.forecast)
	const { lineItem } = useAppSelector(state => state.gridData);
	const [searchText, setSearchText] = React.useState('');
	const [filters, setFilters] = React.useState({});
	const [filterOptions, setFilterOptions] = React.useState(getFilterMenuOptions());
	const [vendorList, setVendorsList] = React.useState([]);			
	const forecastList = useAppSelector(getForecastList);
	const [kpiFieldsData, setKpiFieldsData] = React.useState<any>(selectedRow);
	const [groupAndFilterData, setGroupAndFilterData] = React.useState<any>({ group: 'None', filter: [] });
	const gridIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
	}, []);

	const groupHandler = (group: string) => {
		// console.log(group);
		setGroupAndFilterData({ ...groupAndFilterData, group: group });
	};
	React.useEffect(() => {
		setKpiFieldsData(selectedRow);
	}, [selectedRow]);

	React.useEffect(() => {
		let uniqueVendors:any = [];
		forecastList?.map((item:any) => {
				item?.vendor?.name && item?.vendor?.id && !uniqueVendors?.map((a:any) => a.value)?.includes(item?.vendor?.id) && uniqueVendors.push({
					text: item?.vendor?.name,
					key: item?.vendor?.id,
					value: item?.vendor?.id
				})
			})
		// const uniqueVendors: any = Array.from(new Map((forecastList || []).map((item: any) =>
		// 	[item?.vendor?.id, { text: item?.vendor?.name, key: item?.vendor?.id, value: item?.vendor?.id }])).values());
			setVendorsList(uniqueVendors)
		}, [forecastList]);

	React.useEffect(() => {
		setKpiFieldsData(lineItem);
	}, [lineItem]);

	React.useEffect(() => {
		const filtersCopy = [...filterOptions];
		let vendorItem = filtersCopy.find((rec: any) => rec?.value === "vendor");
		if(vendorItem) vendorItem.children.items = vendorList;
		setFilterOptions(filtersCopy);
	}, [vendorList]);

	const searchHandler = (searchText: string) => {
		setSearchText(searchText);
	};

	const filterHandler = (filters: any) => {
		if (_.isEmpty(filters)) setFilters({ ...filters, transactionType: [] });
		else setFilters(filters);
	};

	React.useEffect(() => {
		const filteredList = filterAction(forecastList, filters, searchText);
		dispatch(setFilteredRecords(filteredList));
	}, [searchText, filters, forecastList]);

	React.useEffect(() => {
		// if (rightPannel && selectedRow?.id === updateData?.id) {
		// 	dispatch(setSelectedRowData(updateData));
		// }
		if (callForecastApi) {
			console.log('budgetmager callForecastApi', callForecastApi)
			dispatch(fetchForecastData({ 'appInfo': appInfo, id: selectedRow.id }));
			dispatch(fetchLineItemData({ 'appInfo': appInfo, id: selectedRow.id }));
			dispatch(setCallForecastApi(false));
		}
	}, [callForecastApi]);


	const filterAction = (list: Array<any>, filters: any = {}, searchText: string = '') => {
		let filteredTransactions = [...list];
		if( !_.isEmpty(filters?.vendor)) {
			filteredTransactions = filteredTransactions?.filter((item:any) => {
				return filters?.vendor?.includes(item?.vendor?.id); 
			})
		}

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

	return <Box className='forecast-transaction-box'>
		<div className='forecast-transaction-header'>
			<div className='title-action'>
				<span className='title'>Forecast Transactions</span>
			</div>
			<div className='forecast-kpi-fields'>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Pending Refund</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiFieldsData.pendingRefundAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Pending Change Order</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiFieldsData.pendingChangeOrderAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Pending Transactions</div>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className='kpi-value'>
							{amountFormatWithSymbol(kpiFieldsData.pendingTransactionAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-stack'>
					<span className='kpi-label'>Forecast Budget <span className='bold'>{currencySymbol}</span></span><span className='bold amount'>{amountFormatWithOutSymbol(kpiFieldsData.budgetForecast)}</span>
					<span className='kpi-label'>Forecast Balance <span className='bold'>{currencySymbol}</span></span><span className={`bold amount ${kpiFieldsData.balanceForecast >= 0 ? 'positive' : 'negative'}`}>{amountFormatWithOutSymbol(kpiFieldsData.balanceForecast)}</span>
				</span>
				{/* <span className='kpi-item-tile'>
					<Stack direction="row" spacing={1}>
						<div className='kpi-label'>Budget Forecast</div>
						{kpiFieldsData.balance < 0 || Number(kpiFieldsData.budgetForecast) - Number(kpiFieldsData.balance) < 0 ?
							<IQTooltip title="Your Budget Modification Forecast is more than the Current Budget" placement={"bottom"} arrow={true} >
								<WarningAmber fontSize={primaryIconSize}
									style={{ color: '#f4e39f' }} />
							</IQTooltip>
							: null
						}
					</Stack>
					<div className='kpi-field-container'>
						{gridIcon}
						<span className="form-data">
							{`${currencySymbol} ${kpiFieldsData.budgetForecast ? kpiFieldsData.budgetForecast.toLocaleString('en-US') : 0}`}
						</span>
					</div >
				</span >
				<span className='kpi-item-tile'>
					<Stack direction="row" spacing={1}>
						<div className='kpi-label'>Balance Forecast</div>
						{kpiFieldsData.balanceForecast < 0 ?
							<IQTooltip title="Your Forecast Remaining Balance is Negative" placement={"bottom"} arrow={true} >
								<WarningAmber fontSize={primaryIconSize}
									style={{ color: '#f4e39f' }} />
							</IQTooltip>
							: null
						}
					</Stack >
					<div className='kpi-field-container'>
						{gridIcon}
						<span className="form-data">
							{`${currencySymbol} ${kpiFieldsData.balanceForecast ? kpiFieldsData.balanceForecast.toLocaleString('en-US') : 0}`}
						</span>
					</div >
				</span > */}
			</div >
			<div className='search-action'>
				<IQSearch sx={{ height: '2em', width: '16rem' }}
					groups={getGroupMenuOptions()}
					filters={filterOptions}
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
	}, {
		text: 'Vendor',
		value: 'vendor.name'
	}];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'Transaction Type',
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
	},
	{
		text: 'Vendor',
		value: 'vendor',
		key: 'vendor',
		children: {
			type: 'checkbox',
			items: []
		}
	}];
};