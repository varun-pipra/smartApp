import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { Writable } from 'stream';
import _ from 'lodash';
import { fetchClientPayAppDetails } from './GridAPI';

export interface VendorPayAppsState {
	loading: boolean;
	showLineItemDetails: boolean;
	selectedRecord: object | undefined | any;
	selectedNode: any;
	presenceData: any;
	selectedTabName: string;
	eableSubmitPayAppBtn: boolean;
	signature: any;
	showToastMessage: any;
	refreshed: boolean;
	selectedClientInCreateForm: any,
	cPayAppId?: string | undefined;
	tab?: string | undefined;
};

const initialState: VendorPayAppsState = {
	loading: false,
	showLineItemDetails: false,
	selectedRecord: undefined,
	selectedNode: {},
	presenceData: undefined,
	selectedTabName: '',
	eableSubmitPayAppBtn: false,
	signature: null,
	showToastMessage: '',
	selectedClientInCreateForm: '',
	refreshed: false,
};

export const getClientPayAppDetailsById = createAsyncThunk<any, any>(
	'clientPayAppDetails',
	async (obj) => {
		const response = await fetchClientPayAppDetails(obj?.appInfo, obj?.id);
		return response;
	}
);

export const clientPayAppsSlice = createSlice({
	name: 'clientPayApps',
	initialState,
	reducers: {
		setCPayAppId: (state, action: PayloadAction<string>) => {
			state.cPayAppId = action.payload;
		},
		setTab: (state, action: PayloadAction<string>) => {
			state.tab = action.payload;
		},
		setShowLineItemDetails: (state, action: PayloadAction<boolean>) => {
			state.showLineItemDetails = action.payload;
		},
		setSelectedRecord: (state, action: PayloadAction<object>) => {
			state.selectedRecord = action.payload;
		},
		setPresenceData: (state, action: PayloadAction<any>) => {
			state.presenceData = action.payload;
		},
		setSelectedNode: (state, action: PayloadAction<any>) => {
			state.selectedNode = action.payload;
		},
		setSelectedTabName: (state, action: PayloadAction<any>) => {
			state.selectedTabName = action.payload;
		},
		setEnableSubmitPayApp: (state, action: PayloadAction<any>) => {
			state.eableSubmitPayAppBtn = action.payload;
		},
		setSignatureToAuthorize: (state, action: PayloadAction<any>) => {
			state.signature = action.payload;
		},
		setToastMessage: (state, action: PayloadAction<any>) => {
			state.showToastMessage = action.payload;
		},
		setRefreshed: (state, action: PayloadAction<boolean>) => {
			state.refreshed = action.payload;
		},
		setSelectedClientInCreateForm: (state, action: PayloadAction<any>) => {
			state.selectedClientInCreateForm = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getClientPayAppDetailsById.pending, (state) => {
				state.loading = true;
			})
			.addCase(getClientPayAppDetailsById.fulfilled, (state, action) => {
				state.selectedRecord = action.payload;
			})
			.addCase(getClientPayAppDetailsById.rejected, (state) => {
				state.loading = false;
			})
	}
});

export const { setShowLineItemDetails, setPresenceData, setSelectedNode, setSelectedTabName,
	setSelectedRecord, setEnableSubmitPayApp, setSignatureToAuthorize, setToastMessage, setRefreshed, setSelectedClientInCreateForm, setCPayAppId, setTab } = clientPayAppsSlice.actions;

export const getShowLineItemDetails = (state: RootState) => state.clientPayApps.showLineItemDetails;
export const getSelectedRecord = (state: RootState) => state.clientPayApps.selectedRecord;
export const getPresenceData = (state: RootState) => state.clientPayApps.presenceData;
export const getToastMessage = (state: RootState) => state.clientPayApps.showToastMessage;
export default clientPayAppsSlice.reducer;