import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCostCode, fetchCostCodeDivision } from './costcodeAPI';
import _ from 'lodash';

export interface BudgetManagerCostcodeOptionsState {
	loading: boolean;
	costcodeOptions: any;
}

const initialState: BudgetManagerCostcodeOptionsState = {
	loading: false,
	costcodeOptions: [],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchCostcodeOptions = createAsyncThunk(
	'costcodeOptions',
	async () => {
		const response = await fetchCostCodeDivision();
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);

export const costcodeOptionsSlice = createSlice({
	name: 'costcodeOptions',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		// 
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: (builder) => {
		builder
			.addCase(fetchCostcodeOptions.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCostcodeOptions.fulfilled, (state, action) => {
				state.loading = false;
				const flatList = action.payload;
				const grouped = _.groupBy(flatList, 'keyValue');
				let groupedList: any = [];
				_.each(grouped, (optionList, costCode) => {
					groupedList.push({ id: optionList[0].keyValueItemId, name: costCode, options: optionList.map(opt => { return { id: opt.id, name: opt.value } }) });
				});
				state.costcodeOptions = groupedList;
			})
			.addCase(fetchCostcodeOptions.rejected, (state) => {
				state.loading = false;
			});
	}
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
// 	(amount: number): AppThunk =>
// 		(dispatch, getState) => {
// 			const currentValue = selectCount(getState());
// 			if (currentValue % 2 === 1) {
// 				dispatch(incrementByAmount(amount));
// 			}
// 		};

export default costcodeOptionsSlice.reducer;
