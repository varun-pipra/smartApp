import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { VendorContractsGridData } from 'data/vendorContracts/gridData';
import { fetchClientContracts } from './gridAPI';
export interface ClientContractsGridDataState {
	loading: boolean;
	gridData: any;
	gridOriginalData: any;
	selectedRows: any;
	activeMainGridFilters: any;
	activeMainGridGroupKey: any;
	clientsList: any;
	activeMainGridDefaultFilters: any;
	mainGridSearchText: any;
}

const initialState: ClientContractsGridDataState = {
	loading: false,
	gridData: [],
	gridOriginalData: [],
	selectedRows: [],
	activeMainGridFilters: {},
	activeMainGridGroupKey: 'None',
	clientsList: [],
	activeMainGridDefaultFilters: {},
	mainGridSearchText: '',
};

export const getClientContractsList = createAsyncThunk<any, any>(
	'CCList',
	async (appInfo) => {
		const response = await fetchClientContracts(appInfo);
		return response;
	}
);

export const CCGridSlice = createSlice({
	name: 'cCGrid',
	initialState,
	reducers: {
		setGridData: (state, action: PayloadAction<any>) => {
			state.gridData = action.payload;
		},
		setActiveMainGridFilters: (state, action: PayloadAction<any>) => {
			console.log('action', action.payload)
			state.activeMainGridFilters = action.payload;
		},
		setActiveMainGridGroupKey: (state, action: PayloadAction<any>) => {
			state.activeMainGridGroupKey = action.payload;
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
		setClientsList: (state, action: PayloadAction<any>) => {
			state.clientsList = action.payload;
		},
		setActiveMainGridDefaultFilters: (state, action: PayloadAction<any>) => {
			console.log('DefaultFilters', action.payload)
			state.activeMainGridDefaultFilters = action.payload;
		},
		setMainGridSearchText: (state, action: PayloadAction<any>) => {
			state.mainGridSearchText = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getClientContractsList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getClientContractsList.fulfilled, (state, action) => {
				state.gridData = action.payload;
				state.gridOriginalData = action.payload;
			})
			.addCase(getClientContractsList.rejected, (state) => {
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


export const { setGridData, setSelectedRows, setActiveMainGridFilters, setActiveMainGridGroupKey, setClientsList, setActiveMainGridDefaultFilters, setMainGridSearchText } = CCGridSlice.actions;

export default CCGridSlice.reducer;