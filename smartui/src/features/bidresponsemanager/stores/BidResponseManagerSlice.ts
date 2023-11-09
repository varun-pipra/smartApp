import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'app/store';
import {fetchBidResponseDetails} from './gridAPI';

export interface bidResponseManagerState {
	loading: boolean;
	bidId: string | unknown;
	tab: string | unknown;
	bidderId: string | unknown;
	showLineItemDetails: boolean;
	selectedRecord: any;
	bidDetails: any;
	selectedNode: any;
	presenceData: any;
	selectedTabName: any;
	showToastMessage: any;
};

const initialState: bidResponseManagerState = {
	loading: true,
	bidId: undefined,
	tab: undefined,
	bidderId: undefined,
	showLineItemDetails: false,
	selectedRecord: {},
	bidDetails: {},
	selectedNode: {},
	presenceData: undefined,
	selectedTabName: null,
	showToastMessage: {displayToast: false, message: ''},
};

export const fetchBidResponseDetailsData = createAsyncThunk<any, any>(
	'bidResponseDetails',
	async (obj) => {
		const response = await fetchBidResponseDetails(obj?.appInfo, obj?.responseId);
		return response;
	}
);

export const bidResponseManagerSlice = createSlice({
	name: 'bidResponseManager',
	initialState,
	reducers: {
		setBidId: (state, action: PayloadAction<string | unknown>) => {
			state.bidId = action.payload;
		},
		setTab: (state, action: PayloadAction<string | unknown>) => {
			state.tab = action.payload;
		},
		setBidderId: (state, action: PayloadAction<string | unknown>) => {
			state.bidderId = action.payload;
		},
		setShowLineItemDetails: (state, action: PayloadAction<boolean>) => {
			state.showLineItemDetails = action.payload;
		},
		setSelectedRecord: (state, action: PayloadAction<object>) => {
			state.selectedRecord = action.payload;
		},
		setSelectedNode: (state, action: PayloadAction<any>) => {
			state.selectedNode = action.payload;
		},
		setBidDetails: (state, action: PayloadAction<any>) => {
			state.bidDetails = action.payload;
		},
		setSelectedTabName: (state, action: PayloadAction<any>) => {
			state.selectedTabName = action.payload;
		},
		setPresenceData: (state, action: PayloadAction<any>) => {
			state.presenceData = action.payload;
		},
		setToastMessage: (state, action: PayloadAction<any>) => {
			state.showToastMessage = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchBidResponseDetailsData.pending, (state) => {
			state.loading = true;
		}).addCase(fetchBidResponseDetailsData.fulfilled, (state, action) => {
			state.loading = false;
			state.bidDetails = action.payload;
		})
			.addCase(fetchBidResponseDetailsData.rejected, (state) => {
				state.loading = false;
			});
	}
});

export const {setBidId, setTab, setBidderId, setShowLineItemDetails, setSelectedRecord, setPresenceData,
	setSelectedTabName, setSelectedNode, setToastMessage, setBidDetails} = bidResponseManagerSlice.actions;

export const getShowLineItemDetails = (state: RootState) => state.bidResponseManager.showLineItemDetails;
export const getSelectedRecord = (state: RootState) => state.bidResponseManager.selectedRecord;
export const getPresenceData = (state: RootState) => state.bidResponseManager.presenceData;
export const getToastMessage = (state: RootState) => state.bidResponseManager.showToastMessage;

export default bidResponseManagerSlice.reducer;