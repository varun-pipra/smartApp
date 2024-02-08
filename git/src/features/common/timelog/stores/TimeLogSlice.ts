import { RootState } from 'app/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchWorkTeamData , fetchWorkTeamGridData} from './TimeLogAPI';
import { errorMsg } from 'utilities/commonutills';

export interface TimeLogRequestState {
	loading: boolean;
	sourceList: Array<any>;
	selectedTimeLogDetails?: any;
	timeLogDetails?: any;
	toast: string;
	workTeamData:any;
	workTeamGridData:any;
};
const initialState: TimeLogRequestState = {
	loading: false,
	toast: '',
	sourceList: [],
	selectedTimeLogDetails: [],
	timeLogDetails: null,
	workTeamData:[],
	workTeamGridData:[]
}

export const getWorkTeamData = createAsyncThunk<any>(
	"getWorkTeamData",
	async (appId: any) => {
	  const response = await fetchWorkTeamData();
	  return response;
	}
  );

  export const getWorkTeamGridData = createAsyncThunk<any>(
	"getWorkTeamGridData",
	async () => {
		console.log('response')
	  const response = await fetchWorkTeamGridData();
	  console.log(response,'response')
	  return response;
	}
  );

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
		setToast: (state, action: PayloadAction<any>) => {
			state.toast = action.payload;
		},
		setSourceList: (state, action: PayloadAction<any>) => {
			state.sourceList = action.payload;
		},
		setSelectedTimeLog: (state, action: PayloadAction<any>) => {
			state.selectedTimeLogDetails = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
		.addCase(getWorkTeamData.pending, (state) => {
			state.loading = true;
		}).addCase(getWorkTeamData.fulfilled, (state, action) => {
			state.loading = false;
			state.workTeamData = action.payload;
		}).addCase(getWorkTeamData.rejected, (state) => {
			state.toast = errorMsg;
			state.loading = false;
		})
		.addCase(getWorkTeamGridData.pending, (state) => {
			state.loading = true;
		}).addCase(getWorkTeamGridData.fulfilled, (state, action) => {
			state.loading = false;
			state.workTeamGridData = action.payload;
		}).addCase(getWorkTeamGridData.rejected, (state) => {
			state.toast = errorMsg;
			state.loading = false;
		})
	}
})


export const { setSelectedTimeLog, setToast } = timeLogRequest.actions;
export default timeLogRequest.reducer;