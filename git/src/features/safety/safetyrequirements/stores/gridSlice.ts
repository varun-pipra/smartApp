import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { fetchSafetyRequirementList } from './gridAPI';

export interface SafetyRequiementGridProps {
	loading: boolean;
	gridData: any;
}

const initialState: SafetyRequiementGridProps = {
	loading: false,
	gridData: [],
};

export const getSafetyRequirementsList = createAsyncThunk<any, any>(
	'gridData',
	async (appInfo) => {
		const response = await fetchSafetyRequirementList(appInfo);
		console.log('slice response', response)
		return response;
	}
);


export const safetyRequirementsGridSlice = createSlice({
	name: 'SafetyRequirementGrid',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setGridData: (state, action: PayloadAction<any>) => {
			state.gridData = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getSafetyRequirementsList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getSafetyRequirementsList.fulfilled, (state, action) => {
				state.loading = false;
				state.gridData = action.payload;
			})
			.addCase(getSafetyRequirementsList.rejected, (state) => {
				state.loading = false;
			})
	}

});

export const { setGridData } = safetyRequirementsGridSlice.actions;

export default safetyRequirementsGridSlice.reducer;