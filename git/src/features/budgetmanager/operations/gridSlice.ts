import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchGridDataList, fetchLineItem, fetchPostToConnector} from './gridAPI';

export interface BudgetManagerGridDataState {
	loading: boolean;
	originalGridApiData: any;
	gridData: any;
	selectedRows: any;
	lineItem: any;
	liveData: any;
	presenceData: any;
	bidPackagesList: any;
	vendorContractsList: any;
	clientContractsList: any;
	selectedGroupKey: any;
	selectedFilters: any;
	searchText: any;
	connectors:any;
	scrollToNewRowId: any;
};

const initialState: BudgetManagerGridDataState = {
	loading: false,
	originalGridApiData: [],
	gridData: [],
	lineItem: {},
	selectedRows: [],
	liveData: null,
	presenceData: {},
	bidPackagesList: [],
	vendorContractsList: [],
	clientContractsList: [],
	selectedGroupKey: 'division',
	selectedFilters: {},
	searchText: undefined,
	connectors:{},
	scrollToNewRowId: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchGridData = createAsyncThunk<any, any>(
	'gridData',
	async (appInfo) => {
		const response = await fetchGridDataList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return {...row, rowId: index + 1};
		});
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchLineItemData = createAsyncThunk<any, any>(
	'lineItem',
	async (appInfo) => {
		const response = await fetchLineItem(appInfo.appInfo, appInfo.id);
		// The value we return becomes the `fulfilled` action payload
		return response;
	}
);
export const fetchConnectors = createAsyncThunk<any, any>(
	'connectors',
	async (appInfo) => {
		const response = await fetchPostToConnector(appInfo);
		return response;
	}
);

export const gridDataSlice = createSlice({
	name: 'gridData',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setGridData: (state, action: PayloadAction<any>) => {
			state.gridData = action.payload;
		},
		setOriginalGridApiData: (state, action: PayloadAction<any>) => {
			state.originalGridApiData = action.payload;
		},
		updateGridData: (state, action: PayloadAction<any>) => {
			const updatedRow = action.payload;
			const gridDataClone = state.gridData;
			gridDataClone.map((row: any, index: number) => {
				if(row && row.id === updatedRow.id) gridDataClone[index] = updatedRow;
			});
			state.gridData = gridDataClone;
		},
		updateOriginalGridApiData: (state, action: PayloadAction<any>) => {
			const updatedRow = action.payload;
			const gridDataClone = state.originalGridApiData;
			gridDataClone.map((row: any, index: number) => {
				if(row && row.id === updatedRow.id) gridDataClone[index] = updatedRow;
			});
			state.originalGridApiData = gridDataClone;
			state.gridData = gridDataClone;
		},
		deleteGridData: (state, action: PayloadAction<any>) => {
			const deleteRecordIds = action.payload;
			const data = state.gridData;
			data.map((row: any, index: number) => {
				if(deleteRecordIds.includes(row.id)) data.splice(index, 1);
			});
			state.gridData = data;
		},
		deleteOriginalGridApiData: (state, action: PayloadAction<any>) => {
			const deleteRecordIds = action.payload;
			const data = state.originalGridApiData;
			data.map((row: any, index: number) => {
				if(deleteRecordIds.includes(row.id)) data.splice(index, 1);
			});
			state.originalGridApiData = data;
		},
		setLiveData: (state, action: PayloadAction<any>) => {
			state.liveData = action.payload;
		},
		setSelectedRows: (state, action: PayloadAction<any>) => {
			const selectedRowData = action.payload.data;
			if(selectedRowData !== undefined) {
				const selected: boolean = action.payload.node.selected;
				if(selected === true) {
					state.selectedRows = [...state.selectedRows, selectedRowData];
				}
				else {
					state.selectedRows.map((row: any, index: number) => {
						if(row.id === selectedRowData.id) {
							state.selectedRows.splice(index, 1);
						}
					});
				}
			}
			if(action.payload.length === 0) {
				state.selectedRows = action.payload;
			}
		},
		setPresenceData: (state, action: PayloadAction<any>) => {
			state.presenceData = action.payload;
		},
		setBidPackagesList: (state, action: PayloadAction<any>) => {
			state.bidPackagesList = action.payload;
		},
		setVendorContractsList: (state, action: PayloadAction<any>) => {
			state.vendorContractsList = action.payload;
		},
		setClientContractsList: (state, action: PayloadAction<any>) => {
			state.clientContractsList = action.payload;
		},
		setSelectedGroupKey: (state, action: PayloadAction<any>) => {
			state.selectedGroupKey = action.payload;
		},
		setSelectedFilters: (state, action: PayloadAction<any>) => {
			state.selectedFilters = action.payload;
		},
		setSearchText: (state, action: PayloadAction<any>) => {
			state.searchText = action.payload;
		},
		setScrollToNewRowId: (state, action: PayloadAction<any>) => {
			console.log('action.payload', action.payload)
			state.scrollToNewRowId = action.payload;
		},
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: (builder) => {
		builder
			.addCase(fetchGridData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchGridData.fulfilled, (state, action) => {
				state.loading = false;
				state.gridData = action.payload;
				state.originalGridApiData = action.payload;
			})
			.addCase(fetchGridData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchLineItemData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchLineItemData.fulfilled, (state, action) => {
				state.loading = false;
				state.lineItem = action.payload;
			})
			.addCase(fetchLineItemData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchConnectors.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchConnectors.fulfilled, (state, action) => {
				state.loading = false;
				state.connectors = action.payload;
			})
			.addCase(fetchConnectors.rejected, (state) => {
				state.loading = false;
			});
	}
});

export const {
	setSelectedRows,
	setGridData,
	setLiveData,
	setOriginalGridApiData,
	updateGridData,
	updateOriginalGridApiData,
	deleteGridData,
	deleteOriginalGridApiData,
	setPresenceData,
	setBidPackagesList,
	setVendorContractsList,
	setClientContractsList,
	setSelectedGroupKey,
	setSelectedFilters,
	setSearchText,
	setScrollToNewRowId
} = gridDataSlice.actions;

export default gridDataSlice.reducer;