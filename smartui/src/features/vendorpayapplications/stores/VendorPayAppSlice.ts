import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { fetchVendorPayAppDetails } from './gridApi';

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
	selectedVendorInCreateForm: any;
	vPayAppId?: string | undefined;
	tab?: string | undefined;
};

const initialState: VendorPayAppsState = {
	loading: false,
	showLineItemDetails: false,
	selectedRecord: {},
	selectedNode: {},
	presenceData: undefined,
	selectedTabName: '',
	eableSubmitPayAppBtn: false,
	signature: null,
	showToastMessage: '',
	selectedVendorInCreateForm: '',
};

export const getPayAppDetails = createAsyncThunk<any, any>(
	'payAppDetails',
	async (obj) => {
		const response = await fetchVendorPayAppDetails(obj?.appInfo, obj?.id);
		return response;
	}
);

export const vendorPayAppsSlice = createSlice({
	name: 'vendorPayApps',
	initialState,
	reducers: {
		setVPayAppId: (state, action: PayloadAction<string>) => {
			state.vPayAppId = action.payload;
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
		setSelectedVendorInCreateForm: (state, action: PayloadAction<any>) => {
			state.selectedVendorInCreateForm = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getPayAppDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(getPayAppDetails.fulfilled, (state, action) => {
				state.selectedRecord = action.payload;
			})
			.addCase(getPayAppDetails.rejected, (state) => {
				state.loading = false;
			})
	}
});

export const { setShowLineItemDetails, setPresenceData, setSelectedNode,setToastMessage, setSelectedTabName, setSelectedRecord, setEnableSubmitPayApp, setSignatureToAuthorize, setSelectedVendorInCreateForm, setVPayAppId, setTab } = vendorPayAppsSlice.actions;

export const getShowLineItemDetails = (state: RootState) => state.vendorPayApps.showLineItemDetails;
export const getSelectedRecord = (state: RootState) => state.vendorPayApps.selectedRecord;
export const getPresenceData = (state: RootState) => state.vendorPayApps.presenceData;
export const getToastMessage = (state: RootState) => state.vendorPayApps.showToastMessage;
export default vendorPayAppsSlice.reducer;