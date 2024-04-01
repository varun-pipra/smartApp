import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { fetchBidPackageList } from "./gridAPI";

export interface BidManagerGridProps {
	loading: boolean;
	gridData: any;
	originalGridData: any;
	showToastMessage: any;
	selectedRows: any;
	refreshed: boolean;
	liveData: any;
	activeMainGridFilters: any;
	activeMainGridGroupKey: any;
	activeMainGridDefaultFilters: any;
	mainGridSearchText: any;
	activeCompaniesList: any;
	selectedFilters: any;
	searchText: any;
	bidIframeActive: boolean;
};

const initialState: BidManagerGridProps = {
	loading: false,
	gridData: [],
	originalGridData: [],
	showToastMessage: { display: false, message: '' },
	selectedRows: [],
	refreshed: false,
	liveData: {},
	activeMainGridFilters: {},
	activeMainGridGroupKey: 'None',
	activeMainGridDefaultFilters: {},
	mainGridSearchText: '',
	activeCompaniesList: [],
	selectedFilters: {},
	searchText: undefined,
	bidIframeActive: false,
};

export const fetchGridData = createAsyncThunk<any, any>(
	'gridData',
	async (appInfo) => {
		const response = await fetchBidPackageList(appInfo);
		return response;
	}
);

export const bidManagerGridSlice = createSlice({
	name: 'bidManagerGrid',
	initialState,
	reducers: {
		setGridData: (state, action: PayloadAction<any>) => {
			state.gridData = action.payload;
		},
		setLiveData: (state, action: PayloadAction<any>) => {
			state.liveData = action.payload;
		},
		setRefreshed: (state, action: PayloadAction<boolean>) => {
			state.refreshed = action.payload;
		},
		setActiveMainGridFilters: (state, action: PayloadAction<any>) => {
			state.activeMainGridFilters = action.payload;
		},
		setActiveMainGridGroupKey: (state, action: PayloadAction<any>) => {
			state.activeMainGridGroupKey = action.payload;
		},
		setActiveMainGridDefaultFilters: (state, action: PayloadAction<any>) => {
			state.activeMainGridDefaultFilters = action.payload;
		},
		setMainGridSearchText: (state, action: PayloadAction<any>) => {
			state.mainGridSearchText = action.payload;
		},
		setActiveCompaniesList: (state, action: PayloadAction<any>) => {
			state.activeCompaniesList = action.payload;
		},
		setToastMessage: (state, action: PayloadAction<any>) => { state.showToastMessage = action.payload; },
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
					});
				}
			}
			if (action.payload?.length === 0) {
				state.selectedRows = action.payload;
			}

		},
		setSelectedFilters: (state, action: PayloadAction<any>) => {
			state.selectedFilters = action.payload;
		},
		setSearchText: (state, action: PayloadAction<any>) => {
			state.searchText = action.payload;
		},
		setBidIframeActive: (state, action: PayloadAction<any>) => {
			state.bidIframeActive = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchGridData.pending, (state) => {
			state.loading = true;
		}).addCase(fetchGridData.fulfilled, (state, action) => {
			state.loading = false;
			state.gridData = action.payload;
			state.originalGridData = action.payload;
		}).addCase(fetchGridData.rejected, (state) => {
			state.loading = false;
		});
	}
});

export const getBidGridData = (state: RootState) => state.bidManagerGrid.gridData;
export const { setToastMessage, setSelectedRows, setGridData, setLiveData, setRefreshed, setActiveMainGridFilters,
	setActiveMainGridGroupKey, setActiveMainGridDefaultFilters, setMainGridSearchText,
	setActiveCompaniesList, setSelectedFilters, setSearchText, setBidIframeActive } = bidManagerGridSlice.actions;

export default bidManagerGridSlice.reducer;