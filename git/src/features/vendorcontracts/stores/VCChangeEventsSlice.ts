import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchVendorContractChangeEvents } from "./PaymentLedgerAPI";
export interface ChangeEventProps {
	loading:boolean;
	submitPostChangeAndLockResponseClick: boolean;
	changeEventsList:any;
	changeEventsCount: number;
}
const initialState: ChangeEventProps = {
	loading: false,	
	submitPostChangeAndLockResponseClick: false,
	changeEventsList: [],
	changeEventsCount: 0,
}

export const getVCChangeEventsList = createAsyncThunk<any, any>(
	'vcChangeEvents',
	async (obj) => {
		const response = await fetchVendorContractChangeEvents(obj?.appInfo, obj?.id);
		return response;
	}
);

export const vcChangeEventSlice = createSlice({
	name: 'vcChangeEvents',
	initialState,
	reducers: {
		setPostAndLockResponseClick: (state, action: PayloadAction<any>) => {
			state.submitPostChangeAndLockResponseClick = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getVCChangeEventsList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getVCChangeEventsList.fulfilled, (state, action) => {
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
			.addCase(getVCChangeEventsList.rejected, (state) => {
				state.loading = false;
			})
	}
})

export const { setPostAndLockResponseClick } = vcChangeEventSlice.actions;
export default vcChangeEventSlice.reducer;

