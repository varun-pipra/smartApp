import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';

export interface ScheduleOfValuesProps {
	loading: boolean;
	unLockedSov: boolean;
}

const initialState: ScheduleOfValuesProps = {
	loading: false,
	unLockedSov: false,
};
// export const getVendorContractsList = createAsyncThunk<any, any>(
// 	'gridData',
// 	async (appInfo) => {
// 		const response = await fetchVendorContractsList(appInfo);
// 		return response;
// 	}
// );
// export const getBudgetItemsByPackage = createAsyncThunk<any, any>(
// 	'budgetItems',
// 	async (payload) => {
// 		const response = await fetchBudgetItemsByPackage(payload?.appInfo, payload?.packageId, payload?.bidderId);
// 		return response;
// 	}
// );


export const scheduleOfValuesSlice = createSlice({
	name: 'VCScheduleOfValues',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setUnlockedSov: (state, action: PayloadAction<any>) => {
			console.log("unLockedSov", action.payload)
			state.unLockedSov = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// .addCase(getVendorContractsList.pending, (state) => {
			// 	state.loading = true;
			// })
			// .addCase(getVendorContractsList.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.gridData = action.payload;
			// 	state.gridOriginalData = action.payload
			// })
			// .addCase(getVendorContractsList.rejected, (state) => {
			// 	state.loading = false;
			// })
		
	}

});

export const { setUnlockedSov } = scheduleOfValuesSlice.actions;

export default scheduleOfValuesSlice.reducer;