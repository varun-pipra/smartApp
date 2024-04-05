import { RootState } from "app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchEstimateRoomGridList } from "./EstimateRoomAPI";

export interface EstimateRoomState {
	loading: boolean;
	selectedRows?: any;
	estimateRoomGridList:any;
};
const initialState: EstimateRoomState = {
	loading: false,
	selectedRows: [],
	estimateRoomGridList: [],
}

export const getEstimateRoomList = createAsyncThunk<any,any>('BudgetRoomList',
	async (payload) => {
		const response = await fetchEstimateRoomGridList(payload);
		return response;
	}
);

export const estimateRoom = createSlice({
	name: "estimateRoom",
	initialState,
	reducers: {
		setSelectedRows: (state, action: PayloadAction<any>) => {
			const selectedRowData = action.payload?.data;
			if (selectedRowData !== undefined) {
				const selected: boolean = action.payload.node?.selected;
				if (selected === true) {
					state.selectedRows = [...state.selectedRows, selectedRowData];
				}
				else {
					state.selectedRows.map((row: any, index: number) => {
						if (row.id === selectedRowData.id) {
							state.selectedRows.splice(index, 1);
						}
					});
				}
			}
			if (action.payload?.length === 0) {
				state.selectedRows = action.payload;
			}

		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getEstimateRoomList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getEstimateRoomList.fulfilled, (state, action) => {
				state.loading = false;
				state.estimateRoomGridList = action.payload;
			})
			.addCase(getEstimateRoomList.rejected, (state) => {
				state.loading = false;
			})
	},
});

export const {setSelectedRows } = estimateRoom.actions;
export default estimateRoom.reducer;
