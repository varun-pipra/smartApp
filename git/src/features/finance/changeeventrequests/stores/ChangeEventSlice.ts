import { RootState } from 'app/store';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchBudgetsByChangeEvent, fetchChangeEventDetails, fetchChangeEvents, addChangeEventFiles, fetchChangeEventFiles, fetchLinks, fetchActiveClientContracts } from './ChangeEventAPI';
import { errorMsg } from 'utilities/commonutills';

export interface ChangeEventRequestState {
	loading: boolean;
	toast: string;
	sourceList: Array<any>;
	currentChangeEventId?: string;
	showLineItemDetails?: boolean;
	selectedChangeEvents?: any;
	selectedChangeEventsCount?: number;
	changeRequestDetails?: any;
	budgetListItems?: Array<any>;
	sourceBudgetListItems?: Array<any>;
	referenceFiles?: Array<any>;
	links?: Array<any>;
	confirmationBudgetList?: Array<any>;
	confirmationGCSign?: string;
	workItemDropdownData?: Array<any>;
	linksGridData?: any;
	driveFiles: Array<any>;
	changeEventsListRefreshed: boolean;
	tab?: string | undefined;
};

const initialState: ChangeEventRequestState = {
	loading: false,
	toast: '',
	sourceList: [],
	selectedChangeEventsCount: 0,
	changeRequestDetails: null,
	confirmationBudgetList: [],
	confirmationGCSign: '',
	workItemDropdownData: [],
	linksGridData: [],
	driveFiles: [],
	selectedChangeEvents: [],
	changeEventsListRefreshed: false,
};

export const getAllActiveClientContracts = createAsyncThunk<any>('activeClientContracts',
	async () => {
		const response = await fetchActiveClientContracts();
		return response;
	}
);

export const getChangeEventList = createAsyncThunk<any>('changeEventRequestList',
	async () => {
		const response = await fetchChangeEvents();
		return response;
	}
);

export const getChangeEventById = createAsyncThunk<any, string>('changeEventRequestById',
	async (changeEventId) => {
		const response = await fetchChangeEventDetails(changeEventId);
		return response;
	}
);

export const getBudgetLineItems = createAsyncThunk<any, any>('budgetLineItems',
	async (changeEventId) => {
		const response = await fetchBudgetsByChangeEvent(changeEventId);
		return response;
	}
);

export const addReferenceFiles = createAsyncThunk<any, any>('files', async ({ appInfo, changeEventId, files }) => {
	const response = await addChangeEventFiles(appInfo, changeEventId, files);
	return response;
});

export const getChangeEventFiles = createAsyncThunk<any, any>('Getfiles', async ({ appInfo, changeEventId }) => {
	// console.log('getChangeEventFiles', changeEventId);
	const response = await fetchChangeEventFiles(appInfo, changeEventId);
	// console.log('getChangeEventFiles response', response);
	return response;
});
export const getLinks = createAsyncThunk<any, any>('Links',
	async (changeEventId) => {
		// console.log("links slice", changeEventId);
		const response = await fetchLinks(changeEventId);
		return response;
	}
);

export const changeEventRequest = createSlice({
	name: 'changeEventRequest',
	initialState,
	reducers: {
		setTab: (state, action: PayloadAction<string>) => {
			state.tab = action.payload;
		},
		setToast: (state, action: PayloadAction<any>) => {
			state.toast = action.payload;
		},
		setSourceList: (state, action: PayloadAction<any>) => {
			state.sourceList = action.payload;
		},
		setSelectedChangeEvents: (state, action: PayloadAction<any>) => {
			// console.log("selected", action.payload);
			const selectedRowData = action.payload?.data;
			if (selectedRowData !== undefined) {
				const selected: boolean = action.payload.node?.selected;
				if (selected === true) {
					const selectedRows = [...state.selectedChangeEvents, selectedRowData];
					state.selectedChangeEvents = [...selectedRows];
					state.selectedChangeEventsCount = selectedRows?.length;
				}
				else {
					state.selectedChangeEvents.map((row: any, index: number) => {
						if (row.id === selectedRowData.id) {
							state.selectedChangeEvents.splice(index, 1);
						}
					});
					state.selectedChangeEventsCount = state.selectedChangeEvents?.length;
				}
			}
			if (action.payload?.length === 0) {
				state.selectedChangeEvents = action.payload;
				state.selectedChangeEventsCount = 0;
			}
		},
		setShowLineItemDetails: (state, action: PayloadAction<boolean>) => {
			state.showLineItemDetails = action.payload;
		},
		setCurrentChangeEventId: (state, action: PayloadAction<any>) => {
			state.currentChangeEventId = action.payload;
		},
		setChangeRequestDetails: (state, action: PayloadAction<any>) => {
			state.changeRequestDetails = action.payload;
			state.budgetListItems = action.payload?.budgetItems;
			state.sourceBudgetListItems = action.payload?.budgetItems;
			state.referenceFiles = action.payload?.files;
		},
		setBudgetListItems: (state, action: PayloadAction<any>) => {
			state.budgetListItems = action.payload;
		},
		setSourceBudgetListItems: (state, action: PayloadAction<any>) => {
			state.sourceBudgetListItems = action.payload;
		},
		setReferenceFiles: (state, action: PayloadAction<any>) => {
			// console.log('setReferenceFiles', action.payload);
			state.referenceFiles = formatFileList(action.payload);
		},
		setLinks: (state, action: PayloadAction<any>) => {
			state.links = action.payload;
		},
		setConfirmationBudgetList: (state, action: PayloadAction<any>) => {
			state.confirmationBudgetList = action.payload;
		},
		setConfirmationGCSign: (state, action: PayloadAction<any>) => {
			state.confirmationGCSign = action.payload;
		},
		setDriveFiles: (state, action: PayloadAction<any>) => {
			state.driveFiles = action.payload;
		},
		setChangeEventsListRefreshed: (state, action: PayloadAction<boolean>) => {
			state.changeEventsListRefreshed = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getChangeEventList.pending, (state) => {
			state.loading = true;
		}).addCase(getChangeEventList.fulfilled, (state, action) => {
			state.loading = false;
			state.sourceList = action.payload;
		}).addCase(getChangeEventList.rejected, (state) => {
			state.toast = errorMsg;
			state.loading = false;
		}).addCase(getChangeEventById.fulfilled, (state, action) => {
			state.changeRequestDetails = action.payload;
			state.budgetListItems = action.payload.budgetItems;
			state.sourceBudgetListItems = action.payload.budgetItems;
			state.referenceFiles = action.payload.files;
		}).addCase(getChangeEventById.rejected, (state, action) => {
			state.toast = errorMsg;
			state.loading = false;
		}).addCase(getBudgetLineItems.fulfilled, (state, action) => {
			state.workItemDropdownData = action.payload;
		}).addCase(getBudgetLineItems.rejected, (state, action) => {
			state.toast = errorMsg;
			state.loading = false;
		}).addCase(addReferenceFiles.pending, (state) => {
			state.loading = true;
		}).addCase(addReferenceFiles.fulfilled, (state, action) => {
			state.referenceFiles = formatFileList(action.payload);
		}).addCase(addReferenceFiles.rejected, (state) => {
			state.loading = false;
		}).addCase(getChangeEventFiles.pending, (state) => {
			state.loading = true;
		}).addCase(getChangeEventFiles.fulfilled, (state, action) => {
			state.referenceFiles = formatFileList(action.payload);
		}).addCase(getChangeEventFiles.rejected, (state) => {
		}).addCase(getLinks.pending, (state) => {
			state.loading = true;
		}).addCase(getLinks.fulfilled, (state, action) => {
			state.loading = false;
			const modifiedData = action?.payload?.map((link: any, index: number) => {
				const name = link?.budgetItem?.name ? link?.budgetItem?.name : '';
				const division = link?.budgetItem?.division ? link?.budgetItem?.division : '';
				const costCode = link?.budgetItem?.costCode ? link?.budgetItem?.costCode : '';
				const costType = link?.budgetItem?.costType ? link?.budgetItem?.costType : '';
				const budgetName = `${name} - ${division} - ${costCode} - ${costType}`;
				console.log("budgetName", budgetName);

				return {
					...link,
					rowId: index,
					budgetLineItem: budgetName,
				};
			});
			console.log("modifiedData", modifiedData);
			state.linksGridData = [...modifiedData];
		}).addCase(getLinks.rejected, (state) => {
			state.loading = false;
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

export const { setToast, setSourceList, setSelectedChangeEvents, setShowLineItemDetails, setCurrentChangeEventId, setDriveFiles,
	setChangeRequestDetails, setBudgetListItems, setReferenceFiles, setLinks, setConfirmationBudgetList, setConfirmationGCSign, setChangeEventsListRefreshed, setTab } = changeEventRequest.actions;

export default changeEventRequest.reducer;