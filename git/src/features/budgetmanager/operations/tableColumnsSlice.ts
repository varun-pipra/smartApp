import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ColDef } from "ag-grid-community";
import { RootState } from "app/store";
import { fetchBudgetIsLockedOrUnlocked, fetchBudgetManagerDownloadTemplete, fetchTableColumnList } from "./tableColumnsAPI";

export interface BudgetManagerTableColumnState {
	loading: boolean;
	tableColumns: any;
	showTableColumnsPopup: boolean;
	tableViewType: string;
	showSettingPopup: boolean;
	showViewFilter: boolean;
	showViewPopup: boolean;
	showImportPopup: boolean;
	showRightPannel: boolean;
	hostAppInfo: any;
	columnDefsFieldsArray: any;
	showSettingPopup2: boolean;
	isBudgetLocked: boolean;
	showDescriptionModal: boolean;
	lineItemDescription: string;
	columnDefs: any;
	showSettingPopup3: boolean;
	showHideGridColumn: any;
	showToastMessage: any
	budgetTemplate:any;
	openNotification:boolean;
	importStatus:any
}

const initialState: BudgetManagerTableColumnState = {
	loading: false,
	tableColumns: null,
	showTableColumnsPopup: false,
	tableViewType: "Calendar",
	showSettingPopup: false,
	showViewPopup: false,
	showViewFilter: false,
	showImportPopup: false,
	showRightPannel: false,
	hostAppInfo: null,
	columnDefsFieldsArray: [],
	showSettingPopup2: false,
	isBudgetLocked: false,
	showDescriptionModal: false,
	lineItemDescription: '',
	columnDefs: <ColDef[]>([]),
	showSettingPopup3: false,
	showHideGridColumn: [],
	showToastMessage: { displayToast: false, message: '' },
	budgetTemplate: null,
	openNotification: false,
	importStatus:null
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchTableColumns = createAsyncThunk<any, any>("tableColumns", async (appInfo) => {
	const tableColumns = await fetchTableColumnList(appInfo);
	// The value we return becomes the `fulfilled` action payload
	return tableColumns;
});

export const fetchBudgetLock = createAsyncThunk<any, any>("lock", async (appInfo) => {
	const budgetLockDetails = await fetchBudgetIsLockedOrUnlocked(appInfo);
	// The value we return becomes the `fulfilled` action payload
	return budgetLockDetails;
});

export const getTemplateForBudget = createAsyncThunk<any, any>("BMTemplate", async (appInfo) => {
	const budgetTemplateURL = await fetchBudgetManagerDownloadTemplete(appInfo);
	// The value we return becomes the `fulfilled` action payload
	return budgetTemplateURL;
});

export const tableColumnSlice = createSlice({
	name: "tableColumns",
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setShowTableColumnsPopup: (state, action: PayloadAction<boolean>) => {
			state.showTableColumnsPopup = action.payload;
		},
		setShowTableViewType: (state, action: PayloadAction<string>) => {
			state.tableViewType = action.payload;
		},
		setShowSettingPopup: (state, action: PayloadAction<boolean>) => {
			state.showSettingPopup = action.payload;
		},
		setImportPopup: (state, action: PayloadAction<boolean>) => {
			state.showImportPopup = action.payload;
		},
		setRightPannel: (state, action: PayloadAction<boolean>) => {
			state.showRightPannel = action.payload;
		},
		setHostAppInfo: (state, action: PayloadAction<boolean>) => {
			state.hostAppInfo = action.payload;
		},
		setColumnDefsFields: (state, action: PayloadAction<any>) => {
			state.columnDefsFieldsArray = action.payload;
		},
		setShowSettingPopup2: (state, action: PayloadAction<boolean>) => {
			state.showSettingPopup2 = action.payload;
		},
		setShowSettingPopup3: (state, action: PayloadAction<boolean>) => {
			state.showSettingPopup3 = action.payload;
		},
		setShowViewPopup: (state, action: PayloadAction<boolean>) => {
			state.showViewPopup = action.payload;
		},
		setGridColumnHide: (state, action: PayloadAction<any>) => {
			state.showHideGridColumn = action.payload;
		},
		setBudgetLocked: (state, action: PayloadAction<boolean>) => {
			state.isBudgetLocked = action.payload;
		},
		setDescriptionModal: (state, action: PayloadAction<boolean>) => {
			state.showDescriptionModal = action.payload;
		},
		setShowViewFilter: (state, action: PayloadAction<boolean>) => {
			state.showViewFilter = action.payload;
		},
		setLineItemDescription: (state, action: PayloadAction<string>) => {
			state.lineItemDescription = action.payload;
		},
		setColumnDefsHeaders: (state, action: PayloadAction<ColDef[]>) => {
			state.columnDefs = action.payload;
		},
		setToastMessage: (state, action: PayloadAction<any>) => {
			state.showToastMessage = action.payload;
		},
		setOpenNotification: (state, action: PayloadAction<boolean>) => {
			state.openNotification = action.payload
		},
		setImportBudgetsStatus: (state, action: PayloadAction<any>) => {
			state.importStatus = action.payload
		},
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: (builder) => {
		builder
			.addCase(fetchTableColumns.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTableColumns.fulfilled, (state, action) => {
				state.loading = false;
				state.tableColumns = action.payload;
			})
			.addCase(fetchTableColumns.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchBudgetLock.fulfilled, (state, action) => {
				state.isBudgetLocked = action.payload.status === 2 ? true : false;
			})
			.addCase(getTemplateForBudget.pending, (state) => {
				state.loading = true;
			})
			.addCase(getTemplateForBudget.fulfilled, (state, action) => {
				state.loading = false;
				state.budgetTemplate = action.payload;
			})
			.addCase(getTemplateForBudget.rejected, (state) => {
				state.loading = false;
			})
	},
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const {
	setShowTableColumnsPopup,
	setShowTableViewType,
	setShowSettingPopup,
	setImportPopup,
	setRightPannel,
	setHostAppInfo,
	setColumnDefsFields,
	setShowSettingPopup2,
	setBudgetLocked,
	setDescriptionModal,
	setLineItemDescription,
	setColumnDefsHeaders,
	setShowSettingPopup3,
	setShowViewPopup,
	setShowViewFilter,
	setGridColumnHide,
	setToastMessage,
	setOpenNotification,
	setImportBudgetsStatus,
} = tableColumnSlice.actions;

export const getTableViewType = (state: RootState) =>
	state.tableColumns.tableViewType;
export const getShowSettingPopup = (state: RootState) =>
	state.tableColumns.showSettingPopup;
export const getImportPopup = (state: RootState) =>
	state.tableColumns.showImportPopup;
export const showRightPannel = (state: RootState) =>
	state.tableColumns.showRightPannel;
export const getHostAppInfo = (state: RootState) =>
	state.tableColumns.hostAppInfo;
export const getShowSettingPopup2 = (state: RootState) =>
	state.tableColumns.showSettingPopup2;
export const getViewBuilderPopup = (state: RootState) =>
	state.tableColumns.showSettingPopup3;
export const getShowViewPopup = (state: RootState) =>
	state.tableColumns.showViewPopup;
export const getGridColumnHide = (state: RootState) =>
	state.tableColumns.showHideGridColumn;
export const getColumnDefsHeaders = (state: RootState) =>
	state.tableColumns.columnDefs;
export const getShowViewFilter = (state: RootState) =>
	state.tableColumns.showViewFilter;
export const getToastMessage = (state: RootState) =>
	state.tableColumns.showToastMessage;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
// 	(amount: number): AppThunk =>
// 		(dispatch, getState) => {
// 			const currentValue = selectCount(getState());
// 			if (currentValue % 2 === 1) {
// 				dispatch(incrementByAmount(amount));
// 			}
// 		};

export default tableColumnSlice.reducer;
