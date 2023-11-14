import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "app/store";
import {fetchBidResponseList} from "./gridAPI";

export interface BidResponseManagerGridProps {
	loading: boolean;
	bidResponseData: any;
	originalBidResponseData: any;
	selectedRows: any;
	liveData: any;
	activeMainGridFilters: any;
	activeMainGridGroupKey: any;
	activeMainGridDefaultFilters: any;
	mainGridSearchText: any;
	searchText: any;
	selectedFilters: any;
};

const initialState: BidResponseManagerGridProps = {
	loading: false,
	bidResponseData: [],
	originalBidResponseData: [],
	selectedRows: [],
	liveData: {},
	activeMainGridFilters: {},
	activeMainGridGroupKey: null,
	activeMainGridDefaultFilters: {},
	mainGridSearchText: '',
	searchText: undefined,
	selectedFilters: {}
};

export const fetchBidResponseGridData = createAsyncThunk<any, any>(
	'bidResponseGridData',
	async (appInfo) => {
		const response = await fetchBidResponseList(appInfo);
		return response;
	}
);

export const bidResponseManagerGridSlice = createSlice({
	name: 'bidResponseManagerGrid',
	initialState,
	reducers: {
		setBidResponseGridData: (state, action: PayloadAction<any>) => {
			state.bidResponseData = action.payload;
		},
		setLiveData: (state, action: PayloadAction<any>) => {
			state.liveData = action.payload;
		},
		setActiveMainGridFilters: (state, action: PayloadAction<any>) => {
			state.activeMainGridFilters = action.payload;
		},
		setActiveMainGridGroupKey: (state, action: PayloadAction<any>) => {
			state.activeMainGridGroupKey = action.payload;
		},
		setSelectedRows: (state, action: PayloadAction<any>) => {
			const selectedRowData = action.payload?.data;
			if(selectedRowData !== undefined) {
				const selected: boolean = action.payload.node?.selected;
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
			if(action.payload?.length === 0) {
				state.selectedRows = action.payload;
			}
		},
		setActiveMainGridDefaultFilters: (state, action: PayloadAction<any>) => {
			state.activeMainGridDefaultFilters = action.payload;
		},
		setMainGridSearchText: (state, action: PayloadAction<any>) => {
			state.mainGridSearchText = action.payload;
		},
		setSelectedFilters: (state, action: PayloadAction<any>) => {
			state.selectedFilters = action.payload;
		},
		setSearchText: (state, action: PayloadAction<any>) => {
			state.searchText = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBidResponseGridData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchBidResponseGridData.fulfilled, (state, action) => {
				state.loading = false;
				state.bidResponseData = action.payload;
				state.originalBidResponseData = action.payload;
			})
			.addCase(fetchBidResponseGridData.rejected, (state) => {
				state.loading = false;
			});
	}

});

export const getBidResponseData = (state: RootState) => state.bidResponseManagerGrid.bidResponseData;

export const {setBidResponseGridData, setSelectedRows, setLiveData,
	setActiveMainGridFilters, setActiveMainGridGroupKey, setMainGridSearchText,
	setActiveMainGridDefaultFilters, setSearchText, setSelectedFilters} = bidResponseManagerGridSlice.actions;


export default bidResponseManagerGridSlice.reducer;