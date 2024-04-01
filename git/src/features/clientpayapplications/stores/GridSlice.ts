import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { VendorContractsGridData } from 'data/vendorContracts/gridData';
import { fetchClientPayApps } from './GridAPI';

export interface ClientPayAppsGridDataState {
	loading: boolean;
	gridData: any;
	gridOriginalData: any;
	selectedRows:any;
	cpaIframeActive:boolean;
}

const initialState: ClientPayAppsGridDataState = {
	loading: false,
	gridData: [],
	gridOriginalData: [],
	selectedRows: [],
	cpaIframeActive: false,
};

export const getClientPayAppsList = createAsyncThunk<any, any>(
	'CPAList',
	async (appInfo) => {
		const response = await fetchClientPayApps(appInfo);
		return response;
	}
);

export const CPAGridSlice = createSlice({
	name: 'clientPayAppsGrid',
	initialState,
	reducers: {
		setGridData: (state, action: PayloadAction<any>) => {
			state.gridData = action.payload;
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
		setCPAIframeActive: (state, action: PayloadAction<any>) => {
			state.cpaIframeActive = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
		.addCase(getClientPayAppsList.pending, (state) => {
			state.loading = true;
		})
		.addCase(getClientPayAppsList.fulfilled, (state, action) => {
			state.gridData = action.payload;
			state.gridOriginalData = action.payload;
		})
		.addCase(getClientPayAppsList.rejected, (state) => {
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


export const { setGridData, setSelectedRows, setCPAIframeActive } = CPAGridSlice.actions;

export default CPAGridSlice.reducer;