import { RootState } from 'app/store';
import { createAsyncThunk, createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { fetchPtGridDataList, fetchRolesDataList, hasSupplementalInfo, fetchSafetyColumnsData, fetchRTLSUserData } from './ptGridAPI';
import { triggerEvent, setLoadMask } from 'utilities/commonFunctions';
import _ from 'lodash';

export interface ProjectTeamGridDataState {
	loading: boolean;
	ptGridData: any;
	hasSupplementalInfo: boolean;
	isRolesDataLoaded: boolean;
	rolesData: any;
	safetyColumns: any;
	RTLSUserData: any;
	// selectedRows: any;
	// selectedNode: any;
	safetyProbationPopOver?: any;
	gridMainPayload?: any;
	filtersPayload?: any;
	currentSelection?: any;
	selectedMembers?: Array<any>;
}

const initialState: ProjectTeamGridDataState = {
	loading: false,
	ptGridData: [],
	hasSupplementalInfo: false,
	isRolesDataLoaded: false,
	rolesData: [],
	safetyColumns: [],
	RTLSUserData: [],
	// selectedRows: [],
	// selectedNode: {},
	safetyProbationPopOver: false,
	gridMainPayload: {},
	filtersPayload: {},
	currentSelection: null,
	selectedMembers: []
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const fetchProjectTeamGridData = createAsyncThunk<any, any>(
// 	'ptGridData',
// 	async (appInfo) => {
// 		setLoadMask(true, 'project-team-gridcls');
// 		const response = await fetchPtGridDataList(appInfo);
// 		// This adding rowId is to handle the item navigation and showing Toast.
// 		const modifiedRespone = response.map((row: any, index: number) => {
// 			return { ...row, rowId: index + 1 }
// 		})
// 		// The value we return becomes the `fulfilled` action payload
// 		return modifiedRespone;

// 	}
// );
export const fetchProjectTeamRolesData = createAsyncThunk<any, any>(
	'rolesData',
	async (appInfo) => {
		const response = await fetchRolesDataList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchSafetyColumns = createAsyncThunk<any, any>(
	'safetyColumns',
	async (appInfo) => {
		// setLoadMask(true, 'project-team-gridcls');
		const response = await fetchSafetyColumnsData(appInfo);
		return response;
	}
);
export const fetchRTLSUsers = createAsyncThunk<any, any>(
	'RTLSUserData',
	async ({ appInfo, fromDate, filterFromDate, filterToDate }: { appInfo: any, fromDate: any, filterFromDate: any, filterToDate: any }) => {
		const response = await fetchRTLSUserData(appInfo, fromDate, filterFromDate, filterToDate);
		return response;
	}
);
export const fetchHasSupplementalInfo = createAsyncThunk<any, any>(
	'hasSupplementalInfo',
	async (appInfo) => {
		const response = await hasSupplementalInfo(appInfo);
		return response;
	}
);

export const ptGridDataSlice = createSlice({
	name: 'ptGridData',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setPtGridData: (state, action: PayloadAction<any>) => {
			state.ptGridData = action.payload;
			setLoadMask(false, 'project-team-gridcls');
		},
		setRolesData: (state, action: PayloadAction<any>) => {
			state.rolesData = action.payload;
			state.isRolesDataLoaded = true;
		},
		setHasSupplementalInfo: (state, action: PayloadAction<any>) => {
			state.hasSupplementalInfo = action.payload;
		},
		setSafetyColumns: (state, action: PayloadAction<any>) => {
			state.safetyColumns = action.payload?.filter((rec: any) => !rec.isHidden);
			// setLoadMask(false, 'project-team-gridcls');
		},
		setRTLSUserData: (state, action: PayloadAction<any>) => {
			state.RTLSUserData = action.payload?.filter((rec: any) => !rec.isHidden);
		},
		updatePtGridData: (state, action: PayloadAction<any>) => {
			const updatedRow = action.payload;
			const gridDataClone = state.ptGridData;
			gridDataClone.map((row: any, index: number) => {
				if (row && row.id === updatedRow.id) gridDataClone[index] = updatedRow;
			})
			state.ptGridData = gridDataClone;
		},
		deletePtGridData: (state, action: PayloadAction<any>) => {
			const deleteRecordIds = action.payload;
			const data = state.ptGridData;
			data.map((row: any, index: number) => {
				if (deleteRecordIds.includes(row.id)) data.splice(index, 1);
			})
			state.ptGridData = data;
		},
		setCurrentSelection: (state, action: PayloadAction<any>) => {
			// if (_.isEmpty(state.currentSelection) || action.payload?.objectId !== state.currentSelection?.objectId)
				state.currentSelection = action.payload;
		},
		setSelectedMembers: (state, action: PayloadAction<any>) => {
			state.selectedMembers = action.payload;
		},
		setSafetyProbationPopOver: (state, action: PayloadAction<any>) => {
			state.safetyProbationPopOver = action.payload;
		},
		setMainGridPayload: (state, action: PayloadAction<any>) => {
			state.gridMainPayload = action.payload;
		},
		setFiltersPayload: (state, action: PayloadAction<any>) => {
			state.filtersPayload = action.payload;
		}
	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: (builder) => {
		builder
			// .addCase(fetchProjectTeamGridData.pending, (state) => {
			// 	state.loading = true;
			// })
			// .addCase(fetchProjectTeamGridData.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.ptGridData = action.payload;
			// 	setLoadMask(false, 'project-team-gridcls');
			// })
			// .addCase(fetchProjectTeamGridData.rejected, (state) => {
			// 	state.loading = false;
			// 	setLoadMask(false, 'project-team-gridcls');
			// })
			.addCase(fetchProjectTeamRolesData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchProjectTeamRolesData.fulfilled, (state, action) => {
				state.loading = false;
				state.rolesData = action.payload;
				state.isRolesDataLoaded = true;
			})
			.addCase(fetchProjectTeamRolesData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchHasSupplementalInfo.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchHasSupplementalInfo.fulfilled, (state, action) => {
				state.loading = false;
				state.hasSupplementalInfo = action.payload;
			})
			.addCase(fetchHasSupplementalInfo.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchSafetyColumns.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchSafetyColumns.fulfilled, (state, action) => {
				state.loading = false;
				state.safetyColumns = action.payload;
				// setLoadMask(false, 'project-team-gridcls');
			})
			.addCase(fetchSafetyColumns.rejected, (state) => {
				state.loading = false;
				// setLoadMask(false, 'project-team-gridcls');
			})
			.addCase(fetchRTLSUsers.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchRTLSUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.RTLSUserData = action.payload;
			})
			.addCase(fetchRTLSUsers.rejected, (state) => {
				state.loading = false;
			})
	}
});

export const { setPtGridData, updatePtGridData, deletePtGridData, setRolesData, setSafetyColumns, setSafetyProbationPopOver,
	setMainGridPayload, setFiltersPayload, setCurrentSelection, setSelectedMembers } = ptGridDataSlice.actions;

export default ptGridDataSlice.reducer;