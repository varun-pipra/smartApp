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
	forecastsCount: number;
}

const initialState: VendorContractsForecastsProps = {
	loading: false,
	kpiData: {},
	forecasts: [],
	forecastsCount: 0,

};
export const getVendorContractsForecasts = createAsyncThunk<any, any>(
	'VCforecasts',
	async (obj) => {
		console.log("VCforecasts")
		const response = await fetchForecastsList(obj?.appInfo, obj?.contractId);
		console.log("VCforecasts1", response);
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
							budgetLineItem: `${txn.budgetItem.name} - ${txn.budgetItem.division} - ${txn.budgetItem.costCode}`
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
export const getForecastsCount = (state: RootState) => state.vendorContractsForecasts.forecastsCount;

export default vendorContractsForecastSlice.reducer;