import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'app/store';
import {fetchBidResponseList} from './BidResponseAPI';

export interface BidResponseTabState {
	loading: boolean;
	BidResponseData: any;
	submitBidResponseClick: false;
	files: Array<any>;
	responseRecord: any;
	submitWait: boolean;
};

const initialState: BidResponseTabState = {
	loading: false,
	BidResponseData: [],
	submitBidResponseClick: false,
	files: [],
	responseRecord: {},
	submitWait: false
};

export const fetchBidResponsedata = createAsyncThunk<any, any>(
	'bidResponse',
	async ({appInfo, bidderId}: {appInfo: any, bidderId: any;}) => {
		const response = await fetchBidResponseList(appInfo, bidderId);
		return response;
	}
);

export const bidResponseSlice = createSlice({
	name: 'bidResponse',
	initialState,
	reducers: {
		setFiles: (state, action: PayloadAction<any>) => {
			state.files = action.payload;
		},
		setResponseRecord: (state, action: PayloadAction<any>) => {
			state.responseRecord = action.payload;
		},
		setBiddersData: (state, action: PayloadAction<any>) => {
			state.BidResponseData = action.payload;
			state.files = action.payload.referenceFiles;
		},
		setSubmitResponseClick: (state, action: PayloadAction<any>) => {
			state.submitBidResponseClick = action.payload;
		},
		setSubmitWait: (state, action: PayloadAction<boolean>) => {
			state.submitWait = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBidResponsedata.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchBidResponsedata.fulfilled, (state, action) => {
				const {referenceFiles, ...otherData} = action.payload;
				state.BidResponseData = otherData;
				state.files = formatSupportiveFileList(referenceFiles);
			})
			.addCase(fetchBidResponsedata.rejected, (state) => {
				state.loading = false;
			});
	}
});

const formatSupportiveFileList = (list: Array<any>) => {
	const formattedList = list?.map((file: any) => {
		const {id, name, thumbnail, downloadUrl, objectId} = file;
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

export const {setSubmitResponseClick, setResponseRecord, setFiles, setSubmitWait} = bidResponseSlice.actions;

export const getSupportDocuments = (state: RootState) => state.bidResponse.files;

export default bidResponseSlice.reducer;