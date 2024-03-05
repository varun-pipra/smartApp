import { RootState } from "app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTimeLog, fetchWorkTeamData, fetchWorkTeamGridData, fetchTimeLogDetails } from "./TimeLogAPI";
import { errorMsg } from "utilities/commonutills";

export interface TimeLogRequestState {
	loading: boolean;
	sourceList: Array<any>;
	selectedRowData?: any;
	selectedTimeLogDetails?: any;
	toast: string;
	access?: any;
	workTeamData: any;
	workTeamGridData: any;
	splitTimeSegmentBtn: boolean;
	TimeLogGridList:any;
	DetailspayloadSave:any;
	smartItemOptionSelected:any;
	WorkTeamDataFromExt:any;
	driveFile:any;
};
const initialState: TimeLogRequestState = {
	loading: false,
	toast: '',
	sourceList: [],
	selectedRowData: [],
	selectedTimeLogDetails: {},
	access: '',
	workTeamData: [],
	workTeamGridData: [],
	splitTimeSegmentBtn : false,
	TimeLogGridList: [],
	DetailspayloadSave:{},
	smartItemOptionSelected:{},
	WorkTeamDataFromExt:[],
	driveFile:''
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
		console.log("response");
		const response = await fetchWorkTeamGridData();
		console.log(response, "response");
		return response;
	}
);

export const getTimeLogList = createAsyncThunk<any,any>('TimeLogList',
	async (payload = {}) => {
		const data = {...payload}
		if(data?.hasOwnProperty('conflicting')){ delete data.conflicting }
		const response = await fetchTimeLog(data);
		const modifiedResp = response?.map((obj:any) => {
			return {
				...obj,
				startDate: obj?.startTime,
				endDate: obj?.endTime,
			}
		})
		return modifiedResp;
	}
);

export const getTimeLogDetails = createAsyncThunk<any, string>('TimeLogDetails',
	async (id) => {
		const response = await fetchTimeLogDetails(id);
		return {
			...response,
			startDate: response?.startTime,
			endDate: response?.endTime,
		}
	}
);

export const timeLogRequest = createSlice({
	name: "timeLogRequest",
	initialState,
	reducers: {
		setAccess: (state, action: PayloadAction<any>) => {
			state.access = action.payload;
		},
		setToast: (state, action: PayloadAction<any>) => {
			state.toast = action.payload;
		},
		setSourceList: (state, action: PayloadAction<any>) => {
			state.sourceList = action.payload;
		},
		setSelectedRowData: (state, action: PayloadAction<any>) => {
			const selectedRow = action.payload.data;
			if (selectedRow !== undefined) {
				const selected: boolean = action.payload.node.selected;
				if (selected === true) {
					state.selectedRowData = [...state.selectedRowData, selectedRow];
				}
				else {
					state.selectedRowData.map((row: any, index: number) => {
						if (row.id === selectedRow?.id) {
							state.selectedRowData.splice(index, 1);
						}
					});
				}
			}
			if (action.payload.length === 0) {
				state.selectedRowData = action.payload;
			}
		},
		setSelectedTimeLogDetails: (state, action: PayloadAction<any>) => {
			state.selectedTimeLogDetails = action.payload;
		},
		setSplitTimeSegmentBtn: (state, action: PayloadAction<boolean>) => {
			state.splitTimeSegmentBtn = action.payload;
		},
		setDetailsPayloadSave: (state, action: PayloadAction<any>) => {
			state.DetailspayloadSave = action.payload;
		},
		setSmartItemOptionSelected:(state,action:PayloadAction<any>)=>{
			state.smartItemOptionSelected = action.payload;
		},
		setWorkTeamFromExt:(state,action:PayloadAction<any>)=>{
			state.WorkTeamDataFromExt = action.payload;
		},
		setDriveFile: (state, action: PayloadAction<any>) => {
			state.driveFile = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getWorkTeamData.pending, (state) => {
				state.loading = true;
			})
			.addCase(getWorkTeamData.fulfilled, (state, action) => {
				state.loading = false;
				state.workTeamData = action.payload;
			})
			.addCase(getWorkTeamData.rejected, (state) => {
				state.toast = errorMsg;
				state.loading = false;
			})
			.addCase(getWorkTeamGridData.pending, (state) => {
				state.loading = true;
			})
			.addCase(getWorkTeamGridData.fulfilled, (state, action) => {
				state.loading = false;
				state.workTeamGridData = action.payload;
			})
			.addCase(getWorkTeamGridData.rejected, (state) => {
				state.toast = errorMsg;
				state.loading = false;
			})
			.addCase(getTimeLogList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getTimeLogList.fulfilled, (state, action) => {
				state.loading = false;
				state.TimeLogGridList = action.payload;
			})
			.addCase(getTimeLogList.rejected, (state) => {
				state.loading = false;
			})
			.addCase(getTimeLogDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(getTimeLogDetails.fulfilled, (state, action) => {
				state.loading = false;
				state.selectedTimeLogDetails = action.payload;
			})
			.addCase(getTimeLogDetails.rejected, (state) => {
				state.loading = false;
			});
	},
});

export const { setSelectedTimeLogDetails,setSelectedRowData,setSourceList, setToast, setAccess, setSplitTimeSegmentBtn,setDetailsPayloadSave,setSmartItemOptionSelected , setWorkTeamFromExt,setDriveFile} = timeLogRequest.actions;
export default timeLogRequest.reducer;
