import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchBudgetData} from './CCSovAPI';

export interface CCSovProps {
	loading: boolean;
	budgetManagerData: any;
	sovBudgetData: any;
}

const initialState: CCSovProps = {
	loading: false,
	budgetManagerData: [],
	sovBudgetData: [],
};

export const getBudgets = createAsyncThunk<any, any>(
	'getBudgetManagerData',
	async (appInfo) => {
		console.log("getBudgetManagerData");
		const response = await fetchBudgetData(appInfo);
		return response;
	}
);


export const cCSovSlice = createSlice({
	name: 'cCSov',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setSovBudgetData: (state, action: PayloadAction<any>) => {
			state.sovBudgetData = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getBudgets.pending, (state) => {
				state.loading = true;
			})
			.addCase(getBudgets.fulfilled, (state, action) => {
				console.log("Forecasts in slice");
				state.loading = false;
				state.budgetManagerData = action.payload;
			})
			.addCase(getBudgets.rejected, (state) => {
				state.loading = false;
			});
	}

});

export const {setSovBudgetData} = cCSovSlice.actions;
// export const getForecastsCount = (state: RootState) => state.cCSov.forecastsCount;


export default cCSovSlice.reducer;