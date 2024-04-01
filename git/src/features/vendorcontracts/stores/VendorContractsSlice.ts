import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'app/store';
import {fetchUserRoles, fetchBidLookup, fetchCompanyData} from './VendorContractsAPI';
import {fetchVendorContractDetailsById} from './gridAPI';

export interface VendorContractsState {
	loading: boolean;
	showLineItemDetails: boolean;
	selectedRecord: object | undefined | any;
	selectedNode: any;
	presenceData: any;
	selectedTabName: string;
	companyList: any;
	showToastMessage: any;
	BidLookupData: any;
	loginUserData: any;
	minMaxDrawer: any;
	submitContractDetailsResponseClick: boolean;
	contractDetailsGetCall: any;
	showContractAttachments: boolean;
	enablePostAndLockBtn: boolean;
	selectedVendorInCreateForm: any;
	contractId?: string | undefined;
	tab?: string | undefined;
};

const initialState: VendorContractsState = {
	loading: false,
	showLineItemDetails: false,
	selectedRecord: {},
	selectedNode: {},
	presenceData: undefined,
	selectedTabName: '',
	companyList: [],
	showToastMessage: {displayToast: false, message: ''},
	BidLookupData: [],
	loginUserData: {},
	minMaxDrawer: {minMax: false, forecast: false, transactions: false},
	submitContractDetailsResponseClick: false,
	contractDetailsGetCall: false,
	showContractAttachments: false,
	enablePostAndLockBtn: false,
	selectedVendorInCreateForm: '',
};

export const getUserRoleDetails = createAsyncThunk<any, any>(
	'userRoleDetails',
	async (appInfo) => {
		const response = await fetchUserRoles(appInfo);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);
export const getBidLookup = createAsyncThunk<any, any>(
	'BidLookup',
	async ({appInfo, objectId}) => {
		console.log('BidLookup', appInfo, objectId);
		const response = await fetchBidLookup(appInfo, objectId);
		return response;
	}
);

export const getContractDetailsById = createAsyncThunk<any, any>(
	'contractDetails',
	async (params) => {
		const response = await fetchVendorContractDetailsById(params?.appInfo, params?.id);
		return response;
	}
);

export const fetchCompanyList = createAsyncThunk<any, any>('companyList',
	async (appInfo) => {
		const response = await fetchCompanyData(appInfo);
		return response;
	}
);

export const vendorContractsSlice = createSlice({
	name: 'vendorContracts',
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
		setToastMessage: (state, action: PayloadAction<any>) => {
			state.showToastMessage = action.payload;
		},
		setMinMaxDrawerStatus: (state, action: PayloadAction<any>) => {
			state.minMaxDrawer = action.payload;
		},
		setLockAndPostContractResponseClick: (state, action: PayloadAction<any>) => {
			state.submitContractDetailsResponseClick = action.payload;
		},
		setShowContractAttachments: (state, action: PayloadAction<boolean>) => {
			state.showContractAttachments = action.payload;
		},
		setEnablePostAndLockBtn: (state, action: PayloadAction<boolean>) => {
			state.enablePostAndLockBtn = action.payload;
		},
		setSelectedVendorInCreateForm: (state, action: PayloadAction<any>) => {
			state.selectedVendorInCreateForm = action.payload;
		},
		setContractDetailsGetCall: (state, action: PayloadAction<any>) => {
			state.contractDetailsGetCall = action.payload;			
		},

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
				// state.contractDetailsGetCall = false;
			})
			.addCase(getContractDetailsById.pending, (state) => {
				state.loading = true;
				state.contractDetailsGetCall = false;
			})
			.addCase(getContractDetailsById.fulfilled, (state, action) => {
				state.selectedRecord = action.payload;
				state.contractDetailsGetCall = true;
			})
			.addCase(getContractDetailsById.rejected, (state) => {
				state.loading = false;
				state.contractDetailsGetCall = false;
			})
			.addCase(getBidLookup.pending, (state) => {
				state.loading = true;
			})
			.addCase(getBidLookup.fulfilled, (state, action) => {
				state.BidLookupData = action.payload;
			})
			.addCase(getBidLookup.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchCompanyList.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCompanyList.fulfilled, (state, action) => {
				state.companyList = action.payload;
			})
			.addCase(fetchCompanyList.rejected, (state) => {
				state.loading = false;
			});
	}
});

export const {setShowLineItemDetails, setPresenceData, setSelectedNode, setSelectedTabName,
	setSelectedRecord, setToastMessage, setLockAndPostContractResponseClick, setMinMaxDrawerStatus,
	setShowContractAttachments, setEnablePostAndLockBtn, setSelectedVendorInCreateForm,
	setContractId, setTab, setContractDetailsGetCall} = vendorContractsSlice.actions;

export const getShowLineItemDetails = (state: RootState) => state.vendorContracts.showLineItemDetails;
export const getSelectedRecord = (state: RootState) => state.vendorContracts.selectedRecord;
export const getPresenceData = (state: RootState) => state.vendorContracts.presenceData;
export const getCompanyData = (state: RootState) => state.vendorContracts.companyList;
export const getToastMessage = (state: RootState) => state.vendorContracts.showToastMessage;
export const getBidLookupData = (state: RootState) => state.vendorContracts.BidLookupData;
export const getloginUserData = (state: RootState) => state.vendorContracts.loginUserData;
export const getMinMaxDrawerStatus = (state: RootState) => state.vendorContracts.minMaxDrawer;
export const getShowContractAttachments = (state: RootState) => state.vendorContracts.showContractAttachments;

export default vendorContractsSlice.reducer;