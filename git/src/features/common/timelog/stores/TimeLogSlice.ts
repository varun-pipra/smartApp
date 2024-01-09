import { RootState } from 'app/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { fetchTimeLog } from './TimeLogApi';
import { errorMsg } from 'utilities/commonutills';

export interface TimeLogRequestState {
	loading: boolean;
	sourceList: Array<any>;
	selectedTimeLogDetails?: any;
	timeLogDetails?: any;
	toast: string;
};
const initialState: TimeLogRequestState = {
	loading: false,
	toast: '',
	sourceList: [],
	selectedTimeLogDetails: [],
	timeLogDetails: null,
}

// export const getTimeLogList = createAsyncThunk<any>('TimeLogList',
// 	async () => {
// 		const response = await fetchTimeLog();
// 		return response;
// 	}
// );

export const timeLogRequest = createSlice({
	name: 'timeLogRequest',
	initialState,
	reducers: {
		setSourceList: (state, action: PayloadAction<any>) => {
			state.sourceList = action.payload;
		},
		setSelectedTimeLog: (state, action: PayloadAction<any>) => {
			state.selectedTimeLogDetails = action.payload;
		},
	},
	extraReducers: (builder) => {
		// builder.addCase(getTimeLogList.pending, (state) => {
		// 	state.loading = true;
		// }).addCase(getTimeLogList.fulfilled, (state, action) => {
		// 	state.loading = false;
		// 	state.sourceList = action.payload;
		// }).addCase(getTimeLogList.rejected, (state) => {
		// 	state.toast = errorMsg;
		// 	state.loading = false;
		// })
	}
})


export const { setSelectedTimeLog } = timeLogRequest.actions;
export default timeLogRequest.reducer;