import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'app/store';
import {fetchClientCompanies, fetchUserRoles} from './ClientContractsAPI';
import {fetchClientContractsDetailById} from './gridAPI';

export interface ClientContractsState {
	loading: boolean;
	showLineItemDetails: boolean;
	selectedRecord: object | undefined | any;
	selectedNode: any;
	presenceData: any;
	selectedTabName: string;
	loginUserData: any;
	companiesData: any;
	minMaxDrawer: any;
	cCDetailsGetCall: boolean;
	showToastMessage: any;
	showContractAttachments: boolean;
	enablePostAndLockBtn: boolean;
	contractId?: string | undefined;
	tab?: string | undefined;
};

const initialState: ClientContractsState = {
	loading: false,
	showLineItemDetails: false,
	selectedRecord: undefined,
	selectedNode: {},
	presenceData: undefined,
	selectedTabName: '',
	loginUserData: {},
	companiesData: [],
	cCDetailsGetCall: false,
	minMaxDrawer: {minMax: false, forecast: false, transactions: false, paymentLedger: false},
	showToastMessage: {displayToast: false, message: ''},
	showContractAttachments: false,
	enablePostAndLockBtn: false,

};

export const getUserRoleDetails = createAsyncThunk<any, any>(
	'loginUserDetails',
	async (appInfo) => {
		const response = await fetchUserRoles(appInfo);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);
export const getClientCompanies = createAsyncThunk<any, any>(
	'clientCompanies',
	async (appInfo) => {
		const response = await fetchClientCompanies(appInfo);
		return response?.filter((obj: any) => obj?.companyType == 4);
		// return response;
	}
);
export const getClientContractDetails = createAsyncThunk<any, any>(
	'CCDetails',
	async (obj) => {
		const response = await fetchClientContractsDetailById(obj?.appInfo, obj?.contractId);
		return response;
	}
);

export const clientContractsSlice = createSlice({
	name: 'clientContracts',
	initialState,
	reducers: {
		setContractId: (state, action: PayloadAction<string>) => {
			state.contractId = action.payload;
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
		setMinMaxDrawerStatus: (state, action: PayloadAction<any>) => {
			state.minMaxDrawer = action.payload;
		},
		setShowContractAttachments: (state, action: PayloadAction<boolean>) => {
			state.showContractAttachments = action.payload;
		},
		setToastMessage: (state, action: PayloadAction<any>) => {
			state.showToastMessage = action.payload;
		},
		setEnablePostAndLockBtn: (state, action: PayloadAction<boolean>) => {
			state.enablePostAndLockBtn = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserRoleDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(getUserRoleDetails.fulfilled, (state, action) => {
				state.loginUserData = action.payload;
			})
			.addCase(getUserRoleDetails.rejected, (state) => {
				state.loading = false;
			})
			.addCase(getClientCompanies.pending, (state) => {
				state.loading = true;
			})
			.addCase(getClientCompanies.fulfilled, (state, action) => {
				state.companiesData = action.payload;
			})
			.addCase(getClientCompanies.rejected, (state) => {
				state.loading = false;
			})
			.addCase(getClientContractDetails.pending, (state) => {
				state.loading = true;
				state.cCDetailsGetCall = false;
			})
			.addCase(getClientContractDetails.fulfilled, (state, action) => {
				state.selectedRecord = action.payload;
				state.cCDetailsGetCall = true;
			})
			.addCase(getClientContractDetails.rejected, (state) => {
				state.loading = false;
				state.cCDetailsGetCall = false;
			});
	}
});

export const {setShowLineItemDetails, setPresenceData, setSelectedNode, setSelectedTabName, setSelectedRecord,
	setMinMaxDrawerStatus, setShowContractAttachments, setToastMessage, setEnablePostAndLockBtn,
	setContractId, setTab} = clientContractsSlice.actions;

export const getShowLineItemDetails = (state: RootState) => state.clientContracts.showLineItemDetails;
export const getSelectedRecord = (state: RootState) => state.clientContracts.selectedRecord;
export const getPresenceData = (state: RootState) => state.clientContracts.presenceData;
export const getMinMaxDrawerStatus = (state: RootState) => state.clientContracts.minMaxDrawer;
export const getShowContractAttachments = (state: RootState) => state.clientContracts.showContractAttachments;
export const getToastMessage = (state: RootState) => state.clientContracts.showToastMessage;
export default clientContractsSlice.reducer;