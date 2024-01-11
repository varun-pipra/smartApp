import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { VendorContractsGridData } from 'data/vendorContracts/gridData';
import { fetchVendorContractsList } from './gridAPI';
import { fetchForecastsList } from './ForecastsAPI';
import { RootState, AppThunk } from 'app/store';
export interface VendorContractsForecastsProps {
	loading: boolean;
	kpiData: any;
	forecasts: any;
	orginalForecasts: any;
	forecastsCount: number;
}

const initialState: VendorContractsForecastsProps = {
	loading: false,
	kpiData: {},
	forecasts: [],
	orginalForecasts: [],
	forecastsCount: 0,

};
export const getVendorContractsForecasts = createAsyncThunk<any, any>(
	'VCforecasts',
	async (obj) => {
		const response = await fetchForecastsList(obj?.appInfo, obj?.contractId);
		return response;
	}
);


export const vendorContractsForecastSlice = createSlice({
	name: 'vendorContractsForecasts',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setForecasts: (state, action: PayloadAction<any>) => {
			state.forecasts = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getVendorContractsForecasts.pending, (state) => {
				state.loading = true;
			})
			.addCase(getVendorContractsForecasts.fulfilled, (state, action) => {
				const { forecasts, ...everythingElse } = action.payload;
				state.kpiData = everythingElse;
				state.forecastsCount = forecasts?.length || 0;
				state.forecasts = forecasts.map((txn: any) => {
					return {
						...txn, ...{
							// budgetLineItem: `${txn.budgetItem.name} - ${txn.budgetItem.division} - ${txn.budgetItem.costCode}`,
							budgetLineItem: `${txn.budgetItem.name ? txn.budgetItem.name : ""} ${txn.budgetItem.division ? " - " + txn.budgetItem.division : ""} ${txn.budgetItem.costCode ? " - " + txn.budgetItem.costCode : ""}`
						}
					};
				});
				state.orginalForecasts = forecasts.map((txn: any) => {
					return {
						...txn, ...{
							//budgetLineItem: `${txn.budgetItem.name} - ${txn.budgetItem.division} - ${txn.budgetItem.costCode}`
							budgetLineItem: `${txn.budgetItem.name ? txn.budgetItem.name : ""} ${txn.budgetItem.division ? " - " + txn.budgetItem.division : ""} ${txn.budgetItem.costCode ? " - " + txn.budgetItem.costCode : ""}`
						}
					};
				});
			})
			.addCase(getVendorContractsForecasts.rejected, (state) => {
				state.loading = false;
			})
	}

});

export const { setForecasts } = vendorContractsForecastSlice.actions;
export const getForecastList = (state: RootState) => state.vendorContractsForecasts.forecasts;
export const getOrginalForecastList = (state: RootState) => state.vendorContractsForecasts.orginalForecasts;
export const getForecastsCount = (state: RootState) => state.vendorContractsForecasts.forecastsCount;

export default vendorContractsForecastSlice.reducer;