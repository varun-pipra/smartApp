import {RootState} from 'app/store';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {errorMsg} from 'utilities/commonutills';
import {fetchBudgetItems} from './BudgetManagerAPI';

export interface ChangeEventRequestState {
	loading: boolean;
	toast: string;
	sourceList: Array<any>;
	settings: any,
	currentBudgetId?: string;
	showLineItemDetails?: boolean;
	selectedBudget?: any;
	selectedBudgetCount?: number;
	budgetDetails?: any;
	curveList: Array<any>;
};

const initialState: ChangeEventRequestState = {
	loading: false,
	toast: '',
	sourceList: [],
	settings: {},
	currentBudgetId: undefined,
	showLineItemDetails: false,
	selectedBudget: undefined,
	selectedBudgetCount: 0,
	budgetDetails: undefined,
	curveList: [
		{label: "Back Loaded", value: 2},
		{label: "Front Loaded", value: 0},
		{label: "Linear", value: 3}
	]
};

export const getBudgetItems = createAsyncThunk<any>('budgetItems',
	async () => {
		const response = await fetchBudgetItems();
		return response;
	}
);

export const changeEventRequest = createSlice({
	name: 'budgetManager',
	initialState,
	reducers: {
		setToast: (state, action: PayloadAction<string>) => {
			state.toast = action.payload;
		},
		setSourceList: (state, action: PayloadAction<Array<any>>) => {
			state.sourceList = action.payload;
		},
		setCurrentBudgetId: (state, action: PayloadAction<string>) => {
			state.currentBudgetId = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getBudgetItems.pending, (state) => {
			state.loading = true;
		}).addCase(getBudgetItems.fulfilled, (state, action) => {
			state.loading = false;
			state.sourceList = action.payload;
		}).addCase(getBudgetItems.rejected, (state) => {
			state.toast = errorMsg;
			state.loading = false;
			state.sourceList = [];
		});
	}
});

const formatFileList = (list: Array<any>) => {
	const formattedList = list?.map((file: any) => {
		const thumbnailEl = file?.stream?.thumbnails?.find((el: any) => el.size === 5);
		return {
			id: file.id,
			thumbnail: thumbnailEl?.downloadUrl,
			fileName: file?.name
		};
	});

	return formattedList;
};

export const getSourceList = (state: RootState) => state.changeEventRequest.sourceList;
export const getReferenceFiles = (state: RootState) => state.changeEventRequest.referenceFiles;

export const {setToast, setSourceList, setCurrentBudgetId} = changeEventRequest.actions;

export default changeEventRequest.reducer;