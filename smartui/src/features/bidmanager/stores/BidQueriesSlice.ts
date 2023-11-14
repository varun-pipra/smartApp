import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { Writable } from 'stream';
import _ from 'lodash';
import { fetchBidQueriesByPackageAndBidder, fetchBidQueriesByPackage } from './BidQueriesAPI';

export interface BidManagerState {
	loading: boolean;
	BidQueriesData: any;
};

const initialState: BidManagerState = {
	loading: false,
	BidQueriesData: [],
};

export const loadBidQueriesByPackageAndBidder = createAsyncThunk<any, any>(
	'bidQueriesItems',
	async ({ appInfo, packageId, bidderId }: { appInfo: any, packageId: any, bidderId: any }) => {
		const response = await fetchBidQueriesByPackageAndBidder(appInfo, packageId, bidderId);
		return response;
	}
);

export const loadBidQueriesByPackage = createAsyncThunk<any, any>(
	'bidQueriesItems',
	async ({ appInfo, packageId }: { appInfo: any, packageId: any }) => {
		const response = await fetchBidQueriesByPackage(appInfo, packageId);
		return response;
	}
);

export const bidQueriesSlice = createSlice({
	name: 'bidQueries',
	initialState,
	reducers: {
		setBidQueriesData: (state, action: PayloadAction<boolean>) => {
			state.BidQueriesData = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadBidQueriesByPackageAndBidder.pending, (state) => {
				state.loading = true;
			})
			.addCase(loadBidQueriesByPackageAndBidder.fulfilled, (state, action) => {
				state.BidQueriesData = action.payload;
			})
			.addCase(loadBidQueriesByPackageAndBidder.rejected, (state) => {
				state.loading = false;
			})
	}
});

export const { setBidQueriesData } = bidQueriesSlice.actions;

export default bidQueriesSlice.reducer;