import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { VendorContractsGridData } from 'data/vendorContracts/gridData';
import { fetchVendorPayApps } from './gridApi';

export interface VendorPayAppsGridDataState {
	loading: boolean;
	gridData: any;
	gridOriginalData: any;
	selectedRows:any;
	refreshed:boolean;
	vpaIframeActive: boolean;
}

const initialState: VendorPayAppsGridDataState = {
	loading: false,
	gridData: [],
	gridOriginalData: [],
	selectedRows: [],
	refreshed: false,
	vpaIframeActive: false,
};

export const getVendorPayAppsLst = createAsyncThunk<any, any>(
	'VPAList',
	async (appInfo) => {
		const response = await fetchVendorPayApps(appInfo);
		return response;
	}
);

export const VPAGridSlice = createSlice({
	name: 'VPAGrid',
	initialState,
	reducers: {
		setGridData: (state, action: PayloadAction<any>) => {
			state.gridData = action.payload;
		},
		setRefreshed: (state, action: PayloadAction<boolean>) => {
			console.log("setRefreshed", action.payload)
			state.refreshed = action.payload;
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
		setVPAIframeActive: (state, action: PayloadAction<any>) => {
			state.vpaIframeActive = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
		.addCase(getVendorPayAppsLst.pending, (state) => {
			state.loading = true;
		})
		.addCase(getVendorPayAppsLst.fulfilled, (state, action) => {
			state.gridData = action.payload;
			state.gridOriginalData = action.payload;
		})
		.addCase(getVendorPayAppsLst.rejected, (state) => {
			state.loading = false;
		})
		// .addCase(getClientContractDetails.pending, (state) => {
		// 	state.loading = true;
		// })
		// .addCase(getClientContractDetails.fulfilled, (state, action) => {
		// 	state.companiesData = action.payload;
		// })
		// .addCase(getClientContractDetails.rejected, (state) => {
		// 	state.loading = false;
		// })
	}

});


export const { setGridData, setSelectedRows, setRefreshed, setVPAIframeActive } = VPAGridSlice.actions;

export default VPAGridSlice.reducer;