import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchClientContractChangeEvents } from "./PaymentLedgerAPI";
export interface ChangeEventProps {
	loading:boolean;
	changeEventsList:any;
	changeEventsCount: number;
}
const initialState: ChangeEventProps = {
	loading: false,	
	changeEventsList: [],
	changeEventsCount: 0,
}

export const getCCChangeEventsList = createAsyncThunk<any, any>(
	'ccChangeEvents',
	async (obj) => {
		const response = await fetchClientContractChangeEvents(obj?.appInfo, obj?.id);
		return response;
	}
);

export const ccChangeEventSlice = createSlice({
	name: 'ccChangeEvents',
	initialState,
	reducers: {
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCCChangeEventsList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getCCChangeEventsList.fulfilled, (state, action) => {
				state.loading = false;
				const modifiedEvents:any = [];
				action?.payload?.events?.map((event:any) => {
                    const changeEvent = {
                        name: event?.name,
						code: event?.code,
						id: event?.id
					}
					event?.budgetItems?.map((item:any, index: number) => {
                        modifiedEvents?.push({changeEvent: changeEvent, ...item, rowId: index+event?.id});
					})
				})
                state.changeEventsCount = modifiedEvents?.length || 0;
				state.changeEventsList = {noofEvents: action.payload?.noofEvents, totalChangeEventAmount: action?.payload?.totalChangeEventAmount, events: [...modifiedEvents] };
			})
			.addCase(getCCChangeEventsList.rejected, (state) => {
				state.loading = false;
			})
	}
})

export const {  } = ccChangeEventSlice.actions;
export default ccChangeEventSlice.reducer;

