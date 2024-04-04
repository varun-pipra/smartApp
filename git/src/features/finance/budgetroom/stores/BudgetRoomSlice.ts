import { RootState } from "app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchBudgetRoomGridList } from "./BudgetRoomAPI";

export interface BudgetRoomState {
	loading: boolean;
	selectedRows?: any;
	budgetRoomGridList:any;
};
const initialState: BudgetRoomState = {
	loading: false,
	selectedRows: [],
	budgetRoomGridList: [],
}

export const getBudgetRoomList = createAsyncThunk<any,any>('BudgetRoomList',
	async (payload) => {
		const response = await fetchBudgetRoomGridList(payload);
		return response;
	}
);

export const budgetRoom = createSlice({
	name: "budgetRoom",
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
			.addCase(getBudgetRoomList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getBudgetRoomList.fulfilled, (state, action) => {
				state.loading = false;
				state.budgetRoomGridList = action.payload;
			})
			.addCase(getBudgetRoomList.rejected, (state) => {
				state.loading = false;
			})
	},
});

export const {setSelectedRows } = budgetRoom.actions;
export default budgetRoom.reducer;
