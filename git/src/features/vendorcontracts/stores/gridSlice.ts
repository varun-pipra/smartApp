import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { VendorContractsGridData } from 'data/vendorContracts/gridData';
import { fetchVendorContractsList, fetchBudgetItemsByVendorContractId } from './gridAPI';

export interface VendorContractsGridProps {
	loading: boolean;
	gridData: any;
	gridOriginalData: any;
	selectedRows: any;
	budgetItems: any;
	budgetItemsGetCall:boolean;
	liveData: any;
	activeMainGridGroupKey: any;
	activeMainGridFilters: any;
	vendorsList: any;
	activeMainGridDefaultFilters: any;
	mainGridSearchText: any;
	vcIframeActive:boolean;
};

const initialState: VendorContractsGridProps = {
	loading: false,
	gridData: [],
	gridOriginalData: [],
	budgetItems: [],
	budgetItemsGetCall: false,
	selectedRows: [],
	liveData: {},
	activeMainGridGroupKey: 'None',
	activeMainGridFilters: {},
	vendorsList: [],
	activeMainGridDefaultFilters: {},
	mainGridSearchText: '',
	vcIframeActive: false
};

export const getVendorContractsList = createAsyncThunk<any, any>(
	'gridData',
	async (appInfo) => {
		const response = await fetchVendorContractsList(appInfo);
		return response;
	}
);

export const getBudgetItemsByPackage = createAsyncThunk<any, any>(
	'budgetItems',
	async (payload) => {
		const response = await fetchBudgetItemsByVendorContractId(payload?.appInfo, payload?.contractId);
		return response;
	}
);

export const vendorContractsGridSlice = createSlice({
	name: 'vendorContractsGrid',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setGridData: (state, action: PayloadAction<any>) => {
			state.gridData = action.payload;
		},
		setLiveData: (state, action: PayloadAction<any>) => {
			state.liveData = action.payload;
		},
		setBudgetItemsGetCall: (state, action: PayloadAction<any>) => {
			state.budgetItemsGetCall = action.payload;
		},
		setSelectedRows: (state, action: PayloadAction<any>) => {
			const selectedRowData = action.payload?.data;
			if (selectedRowData !== undefined) {
				const selected: boolean = action.payload.node?.selected;
				if (selected === true) {
					state.selectedRows = [...state.selectedRows, selectedRowData];
				}
				else {
					state.selectedRows.map((row: any, index: number) => {
						if (row.id === selectedRowData.id) {
							state.selectedRows.splice(index, 1);
						}
					})
				}
			}
			if (action.payload?.length === 0) {
				state.selectedRows = action.payload;
			}

		},
		setActiveMainGridGroupKey: (state, action: PayloadAction<any>) => {
			state.activeMainGridGroupKey = action.payload;
		},
		setActiveMainGridFilters: (state, action: PayloadAction<any>) => {
			state.activeMainGridFilters = action.payload;
		},
		setVendorsList: (state, action: PayloadAction<boolean>) => {
			state.vendorsList = action.payload;
		},
		setActiveMainGridDefaultFilters: (state, action: PayloadAction<any>) => {
			state.activeMainGridDefaultFilters = action.payload;
		},
		setMainGridSearchText: (state, action: PayloadAction<any>) => {
			state.mainGridSearchText = action.payload;
		},
		setVCIframeActive: (state, action: PayloadAction<any>) => {
			state.vcIframeActive=action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getVendorContractsList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getVendorContractsList.fulfilled, (state, action) => {
				// console.log("getVendorContractsList", action.payload)
				state.loading = false;
				state.gridData = action.payload;
				state.gridOriginalData = action.payload
			})
			.addCase(getVendorContractsList.rejected, (state) => {
				state.loading = false;
			})
			.addCase(getBudgetItemsByPackage.pending, (state) => {
				state.loading = true;
				state.budgetItemsGetCall = false;
			})
			.addCase(getBudgetItemsByPackage.fulfilled, (state, action) => {
				state.loading = false;
				state.budgetItems = action.payload
				state.budgetItemsGetCall = true;				
			})
			.addCase(getBudgetItemsByPackage.rejected, (state) => {
				state.loading = false;
				state.budgetItemsGetCall = false;				
			})
	}

});

export const { setGridData, setLiveData, setSelectedRows, setActiveMainGridGroupKey, setActiveMainGridFilters, setVendorsList, setActiveMainGridDefaultFilters, setMainGridSearchText, setBudgetItemsGetCall, setVCIframeActive } = vendorContractsGridSlice.actions;

export default vendorContractsGridSlice.reducer;