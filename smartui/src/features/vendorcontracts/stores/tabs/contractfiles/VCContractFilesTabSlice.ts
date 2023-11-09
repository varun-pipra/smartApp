import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

import { addContractFiles as addFiles } from './VCContractFilesTabAPI';

export interface VCContractFilesTabState {
	loading: boolean;
	standard: Array<any>;
	additional: Array<any>;
	fileCount: number;
};

const initialState: VCContractFilesTabState = {
	loading: false,
	standard: [],
	additional: [],
	fileCount: 0
};

export const addContractFiles = createAsyncThunk<any, any>('files', async ({ appInfo, contractId, files }) => {
	const response = await addFiles(appInfo, contractId, files);
	return response;
});

export const vendorContractFilesTabData = createSlice({
	name: 'vendorContractFilesTabData',
	initialState,
	reducers: {
		setContractFilesCount: (state, action: PayloadAction<number>) => {
			state.fileCount = action.payload;
		},
		setAdditionalFiles: (state, action: PayloadAction<Array<any>>) => {
			state.additional = formatAdditionalFileList(action.payload);
		},
		setStandardFiles: (state, action: PayloadAction<Array<any>>) => {
			state.standard = formatStandardFileList(action.payload);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(addContractFiles.pending, (state) => {
			state.loading = true;
		}).addCase(addContractFiles.fulfilled, (state, action) => {
			if (!action.payload) return;
			const { standard, additional } = action.payload;
			state.standard = formatStandardFileList(standard);
			state.additional = formatAdditionalFileList(additional);
			state.fileCount = (standard?.length || 0) + (additional?.length || 0);
		}).addCase(addContractFiles.rejected, (state) => {
			state.loading = false;
		});
	}
});

const formatStandardFileList = (list: Array<any>) => {
	const formattedList = list?.map((file: any) => {
		let { stream, ...contract } = file;
		const thumbnailEl = stream?.thumbnails?.find((el: any) => el.size === 5);
		return {
			...contract,
			thumbnail: thumbnailEl?.downloadUrl
		};
	});

	return formattedList;
};

const formatAdditionalFileList = (list: Array<any>) => {
	const formattedList = list?.map((file: any) => {
		const thumbnailEl = file?.stream?.thumbnails.find((el: any) => el.size === 5);
		return {
			id: file.id,
			fileName: file?.name,
			thumbnail: thumbnailEl?.downloadUrl
		};
	});

	return formattedList;
};

export const { setContractFilesCount, setAdditionalFiles, setStandardFiles } = vendorContractFilesTabData.actions;

export const getContractFilesCount = (state: RootState) => state.vendorContractFilesTabData.fileCount;
export const getStandardFiles = (state: RootState) => state.vendorContractFilesTabData.standard;
export const getAdditionalFiles = (state: RootState) => state.vendorContractFilesTabData.additional;

export default vendorContractFilesTabData.reducer;