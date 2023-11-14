import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'app/store';

export interface BidFileState {
	files?: any;
	fileObject?: any;
	uploadQueue?: Array<any>;
	specificationFiles?: Array<any>;
};

const initialState: BidFileState = {
	files: [],
	fileObject: {},
	uploadQueue: [],
	specificationFiles: []
};

export const prepareFileList = (files: any, type: number) => {
	const list = files.filter((item: any) => item.fileType === type).map((file: any) => { return { fileName: file.name, ...file } });
	return list.length > 0 ? list : [];
};

export const bidFileSlice = createSlice({
	name: 'bidFile',
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
		setSpecificationFiles: (state, action: PayloadAction<any>) => {
			state.specificationFiles = action.payload;
		}
	}
});

export const { setFiles, setUploadQueue } = bidFileSlice.actions;

export const getFiles = (state: RootState) => state.bidFile.files;
export const getFileObject = (state: RootState) => state.bidFile.fileObject;
export const getUploadQueue = (state: RootState) => state.bidFile.uploadQueue;
export const getSpecificationFiles = (state: RootState) => state.bidFile.specificationFiles

export default bidFileSlice.reducer;