import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { Writable } from 'stream';
import _ from 'lodash';
import { fetchBiddersList } from './BiddersAPI';

export interface BiddersState {
	loading: boolean;
	BiddersGridData: any;
	newCompany: any;
	newBidder: any;
};

const initialState: BiddersState = {
	loading: false,
	BiddersGridData: [],
	newCompany: null,
	newBidder: {}
};

export const fetchBiddersGriddata = createAsyncThunk<any, any>(
	'biddersData',
	async (appInfo) => {
		const response = await fetchBiddersList(appInfo?.appInfo, appInfo?.packageId);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);

export const biddersSlice = createSlice({
	name: 'bidders',
	initialState,
	reducers: {
		setNewCompany: (state, action: PayloadAction<any>) => {
			state.newCompany = action.payload;
		},
		setNewBidder: (state, action: PayloadAction<any>) => {
			state.newBidder = action.payload;
		},
		setBiddersData: (state, action: PayloadAction<any>) => {
			state.BiddersGridData = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBiddersGriddata.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchBiddersGriddata.fulfilled, (state, action) => {
				state.BiddersGridData = action.payload;
			})
			.addCase(fetchBiddersGriddata.rejected, (state) => {
				state.loading = false;
			})
	}
});

export const { setNewCompany, setBiddersData, setNewBidder } = biddersSlice.actions;

export const getBiddersData = (state: RootState) => state.bidders.BiddersGridData;

export default biddersSlice.reducer;