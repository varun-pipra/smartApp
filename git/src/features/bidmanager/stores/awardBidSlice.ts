import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { Writable } from 'stream';
import _ from 'lodash';
import { fetchAwardBidDetails } from './awardBidAPI';

export interface AwardBidProps {
	loading: boolean;
	awardBidSelectedRecord: any;
	awardBidClick: boolean;
	openUpdateBudgetDialog: boolean;
	awardBidDetailData: any;
	expandedRows: any;
	files: Array<any>;
	activeAwardBidFilters: any;
	viewType: string;
};

const initialState: AwardBidProps = {
	loading: false,
	awardBidSelectedRecord: [],
	awardBidClick: false,
	openUpdateBudgetDialog: false,
	awardBidDetailData: {},
	expandedRows: [],
	files: [],
	activeAwardBidFilters: {},
	viewType: 'grid'
};

export const fetchAwardBidDetailsData = createAsyncThunk<any, any>(
	'awardBidDetails',
	async (obj) => {
		const response = await fetchAwardBidDetails(obj?.appInfo, obj?.packageId, obj?.bidderUniqueId);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);

export const awardBidSlice = createSlice({
	name: 'awardBid',
	initialState,
	reducers: {
		setAwardBidSelectedRecord: (state, action: PayloadAction<any>) => {
			state.awardBidSelectedRecord = action.payload;
		},
		setAwardBidClick: (state, action: PayloadAction<any>) => {
			state.awardBidClick = action.payload;
		},
		setAwardBidDetailsData: (state, action: PayloadAction<any>) => {
			state.awardBidDetailData = action.payload;
		},
		setOpenUpdateBudgetDialog: (state, action: PayloadAction<boolean>) => {
			state.openUpdateBudgetDialog = action.payload;
		},
		setExpandedRows: (state, action: PayloadAction<any>) => {
			state.expandedRows = action.payload;
		},
		setActiveAwardBidFilters: (state, action: PayloadAction<any>) => {
			state.activeAwardBidFilters = action.payload;
		},
		setViewType: (state, action: PayloadAction<any>) => {
			state.viewType = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAwardBidDetailsData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAwardBidDetailsData.fulfilled, (state, action) => {
				const { referenceFiles, ...otherData } = action.payload;
				state.awardBidDetailData = otherData;
				state.files = formatSupportiveFileList(referenceFiles);
			})
			.addCase(fetchAwardBidDetailsData.rejected, (state) => {
				state.loading = false;
			})
	}
});

const formatSupportiveFileList = (list: Array<any>) => {
	const formattedList = list?.map((file: any) => {
		const { id, name, thumbnail, downloadUrl, objectId } = file;
		return {
			id,
			name,
			fileName: name,
			thumbnail,
			downloadUrl,
			objectId
		};
	});

	return formattedList;
};

export const { setAwardBidSelectedRecord, setAwardBidClick, setAwardBidDetailsData, setOpenUpdateBudgetDialog, setExpandedRows, setActiveAwardBidFilters, setViewType } = awardBidSlice.actions;

export default awardBidSlice.reducer;