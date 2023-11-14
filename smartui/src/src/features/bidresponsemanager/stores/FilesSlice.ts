import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { Writable } from 'stream';
import _ from 'lodash';

export interface BidResponseFileState {
	files?: any;
	fileObject?: any;
	uploadQueue?: Array<any>;
	supportiveFiles?: Array<any>;
};

const initialState: BidResponseFileState = {
	files: [],
	fileObject: {},
	uploadQueue: [],
	supportiveFiles: []
};

export const prepareFileList = (files: any, type: number) => {
	const list = files.filter((item: any) => item.fileType === type).map((file: any) => { return { fileName: file.name, ...file } });
	return list.length > 0 ? list : [];
};

export const bidResponseFileSlice = createSlice({
	name: 'bidResponseFile',
	initialState,
	reducers: {
		setFiles: (state, action: PayloadAction<any>) => {
			const filesObject = {
				drawings: prepareFileList(action.payload, 0),
				documents: prepareFileList(action.payload, 1),
				specs: prepareFileList(action.payload, 20)
			};
			state.fileObject = filesObject;
			state.files = action.payload;
		},
		setUploadQueue: (state, action: PayloadAction<any>) => {
			state.uploadQueue = action.payload;
		},
		setSupportiveFiles: (state, action: PayloadAction<any>) => {
			state.supportiveFiles = action.payload;
		}
	}
});

export const { setFiles, setUploadQueue } = bidResponseFileSlice.actions;
export const getFiles = (state: RootState) => state.bidResponseFile.files;
export const getFileObject = (state: RootState) => state.bidResponseFile.fileObject;
export const getUploadQueue = (state: RootState) => state.bidResponseFile.uploadQueue;
export const getSupportiveFiles = (state: RootState) => state.bidResponseFile.supportiveFiles;

export default bidResponseFileSlice.reducer;