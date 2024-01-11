import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { VendorContractsGridData } from 'data/vendorContracts/gridData';
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
export const getClientContractsForecasts = createAsyncThunk<any, any>(
	'cCforecasts',
	async (obj) => {
		const response = await fetchForecastsList(obj?.appInfo, obj?.contractId);
		return response;
	}
);


export const clientContractsForecastSlice = createSlice({
	name: 'cCForecasts',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setForecasts: (state, action: PayloadAction<any>) => {
			state.forecasts = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getClientContractsForecasts.pending, (state) => {
				state.loading = true;
			})
			.addCase(getClientContractsForecasts.fulfilled, (state, action) => {
				const { forecasts, ...everythingElse } = action.payload;
				state.kpiData = everythingElse;
				state.forecastsCount = forecasts?.length || 0;
				state.forecasts = forecasts.map((txn: any) => {
					return {
						...txn, ...{
							budgetLineItem: `${txn.budgetItem.name ? txn.budgetItem.name : ""} ${txn.budgetItem.division ? " - " + txn.budgetItem.division : ""} ${txn.budgetItem.costCode ? " - " + txn.budgetItem.costCode : ""}`
						}
					};
				});
				state.orginalForecasts = forecasts.map((txn: any) => {
					return {
						...txn, ...{
							budgetLineItem: `${txn.budgetItem.name ? txn.budgetItem.name : ""} ${txn.budgetItem.division ? " - " + txn.budgetItem.division : ""} ${txn.budgetItem.costCode ? " - " + txn.budgetItem.costCode : ""}`
						}
					};
				});
			})
			.addCase(getClientContractsForecasts.rejected, (state) => {
				state.loading = false;
			})
	}

});

export const { setForecasts } = clientContractsForecastSlice.actions;
export const getForecastList = (state: RootState) => state.cCForecasts.forecasts;
export const getOrginalForecastList = (state: RootState) => state.cCForecasts.orginalForecasts;
export const getForecastsCount = (state: RootState) => state.cCForecasts.forecastsCount;


export default clientContractsForecastSlice.reducer;