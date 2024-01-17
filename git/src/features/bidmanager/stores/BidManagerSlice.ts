import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'app/store';
import {
	fetchBudgetLineItemsData, fetchContactPersonsData, fetchCompanyData,
	fetchTeammembersByProjectData, fetchCompanyFilters
} from './BidManagerAPI';
import {fetchBidPackage} from './gridAPI';

export interface BidManagerState {
	loading: boolean;
	bidId: string | unknown;
	tab: string | unknown;
	showLineItemDetails: boolean;
	selectedRecord: object | undefined | any;
	selectedNode: any;
	presenceData: any;
	BudgetLineItems: any;
	contactPersonsList: any;
	companyList: any;
	companyFiltersList: any;
	teammembersByProjectData: any;
	selectedTabName: string;
	showToastMessage: any;
	showToastMessage2: any;
	showContracts: boolean;
	specSelectedRecInAddSpecDlg:any;
};

const initialState: BidManagerState = {
	loading: false,
	bidId: undefined,
	tab: undefined,
	showLineItemDetails: false,
	selectedRecord: undefined,
	selectedNode: {},
	presenceData: undefined,
	BudgetLineItems: [],
	contactPersonsList: [],
	companyList: [],
	companyFiltersList: [],
	teammembersByProjectData: {},
	selectedTabName: '',
	showToastMessage: {displayToast: false, message: ''},
	showToastMessage2: {displayToast: false, message: ''},
	showContracts: false,
	specSelectedRecInAddSpecDlg:{}
};

export const fetchBudgetLineItems = createAsyncThunk<any, any>(
	'budgetLineItems',
	async (appInfo) => {
		const response = await fetchBudgetLineItemsData(appInfo);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);

export const fetchContactPersonsList = createAsyncThunk<any, any>('contactPersonsList',
	async ({appInfo, companyid}: {appInfo: any, companyid: any;}) => {
		let groupedList: any = [];
		const response = await fetchContactPersonsData(appInfo, companyid);
		response.map((data: any) => {
			groupedList.push({
				id: data?.objectId,
				displayField: data.firstName + ' ' + data.lastName,
				thumbnailUrl: data.thumbnail,
				emailId: data.email,
				phNo: data?.phone,
				projectZonePermissions: data?.projectZonePermissions,
				isSuggested: (data?.projectZonePermissions?.some((x: any) => x?.name === 'Bid Response Manager') ?? false) ? true : false
			});
		});
		console.log('groupedList', groupedList);
		return groupedList;
	}
);
export const fetchCompanyList = createAsyncThunk<any, any>('companyList',
	async (appInfo) => {

		const response = await fetchCompanyData(appInfo);
		// console.log('fetchCompanyData', response)
		return response;
	}
);
export const fetchBidPackageDetails = createAsyncThunk<any, any>(
	'bidPackageDetails',
	async (obj) => {
		const response = await fetchBidPackage(obj.appInfo, obj.packageId);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);

export const fetchTeammembersByProject = createAsyncThunk<any, any>(
	'teammembersByProject',
	async (appInfo) => {
		const response = await fetchTeammembersByProjectData(appInfo);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);
export const getCompanyFilters = createAsyncThunk<any, any>(
	'companyFilters',
	async ({appInfo, name}: {appInfo: any, name: string;}) => {
		let modifiedFilters: any = [];
		const response = await fetchCompanyFilters(appInfo, name);
		response.map((data: any) => {
			modifiedFilters.push({
				text: data?.value,
				value: data?.value,
			});
		});
		return modifiedFilters;
	}
);

export const bidManagerSlice = createSlice({
	name: 'bidManager',
	initialState,
	reducers: {
		setBidId: (state, action: PayloadAction<string | unknown>) => {
			state.bidId = action.payload;
		},
		setTab: (state, action: PayloadAction<string | unknown>) => {
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
		setToastMessage2: (state, action: PayloadAction<any>) => {
			state.showToastMessage2 = action.payload;
		},
		setShowContracts: (state, action: PayloadAction<any>) => {
			state.showContracts = action.payload;
		},
		setSepcSelectedRecord:(state, action: PayloadAction<any>)=>{
			state.specSelectedRecInAddSpecDlg = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBudgetLineItems.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchBudgetLineItems.fulfilled, (state, action) => {
				state.BudgetLineItems = action.payload;
			})
			.addCase(fetchBudgetLineItems.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchContactPersonsList.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchContactPersonsList.fulfilled, (state, action) => {
				state.contactPersonsList = action.payload;
			})
			.addCase(fetchContactPersonsList.rejected, (state) => {
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
			})
			.addCase(fetchBidPackageDetails.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchBidPackageDetails.fulfilled, (state, action) => {
				state.selectedRecord = action.payload;
			})
			.addCase(fetchBidPackageDetails.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchTeammembersByProject.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTeammembersByProject.fulfilled, (state, action) => {
				state.teammembersByProjectData = action.payload;
			})
			.addCase(fetchTeammembersByProject.rejected, (state) => {
				state.loading = false;
			})
			.addCase(getCompanyFilters.pending, (state) => {
				state.loading = true;
			})
			.addCase(getCompanyFilters.fulfilled, (state, action) => {
				state.companyFiltersList = action.payload;
			})
			.addCase(getCompanyFilters.rejected, (state) => {
				state.loading = false;
			});
	}
});

export const {setBidId, setTab, setShowLineItemDetails, setPresenceData,
	setSelectedNode, setSelectedTabName, setSelectedRecord,
	setToastMessage, setToastMessage2, setShowContracts , setSepcSelectedRecord} = bidManagerSlice.actions;

export const getShowLineItemDetails = (state: RootState) => state.bidManager.showLineItemDetails;
export const getSelectedRecord = (state: RootState) => state.bidManager.selectedRecord;
export const getPresenceData = (state: RootState) => state.bidManager.presenceData;
export const getContactPerson = (state: RootState) => state.bidManager.contactPersonsList;
export const getCompanyData = (state: RootState) => state.bidManager.companyList;
export const getToastMessage = (state: RootState) => state.bidManager.showToastMessage;
export const getToastMessage2 = (state: RootState) => state.bidManager.showToastMessage2;
export const getShowContracts = (state: RootState) => state.bidManager.showContracts;

export default bidManagerSlice.reducer;