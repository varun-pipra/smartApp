import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRolesDataList, fetchTradesDataList, fetchEmailSuggestionsList, fetchCompaniesDataList, fetchShiftDataList, fetchActiveCalendarList, fetchSkillsDataList, fetchCategoriesDataList, fetchPendingDocsData, fetchSafetyManualsData, fetchSafetyCertificationData, fetchWorkTeamsDataList, upsertProbationData } from './ptDataAPI';
import { triggerEvent } from 'utilities/commonFunctions';
import { RootState, AppThunk } from 'app/store';

export interface ProjectTeamDataState {
	loading: boolean;
	rolesData: any;
	tradesData: any;
	emailSuggestions: any;
	companiesData: any;
	shiftsData: any;
	activeCalendars: any;
	skillsData: any;
	categoriesData: any;
	pendingDocs: any;
	safetyManuals: any;
	safetyCertifications: any;
	workTeams: any;
	safetyProbationData: any;
	safetyViolationActions?:any;
	triggerSafetyViolationApis?:boolean;
}

const initialState: ProjectTeamDataState = {
	loading: false,
	rolesData: [],
	tradesData: [],
	emailSuggestions: [],
	companiesData: [],
	shiftsData: [],
	activeCalendars: [],
	skillsData: [],
	categoriesData: [],
	pendingDocs: {},
	safetyManuals: [],
	safetyCertifications: [],
	workTeams: [],
	safetyProbationData: {},
	safetyViolationActions:{
		triggered : false,
		actionButton : ''
	},
	triggerSafetyViolationApis : false
};


export const fetchRolesData = createAsyncThunk<any, any>(
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
export const fetchTradesData = createAsyncThunk<any, any>(
	'tradesData',
	async (appInfo) => {
		const response = await fetchTradesDataList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchWorkTeamsData = createAsyncThunk<any, any>(
	'workTeams',
	async (appInfo) => {
		const response = await fetchWorkTeamsDataList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchEmailSuggestions = createAsyncThunk<any, any>(
	'emailSuggestions',
	async (appInfo) => {
		const response = await fetchEmailSuggestionsList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchCompaniesData = createAsyncThunk<any, any>(
	'companiesData',
	async (appInfo) => {
		const response = await fetchCompaniesDataList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchShiftsData = createAsyncThunk<any, any>(
	'shiftsData',
	async (appInfo) => {
		const response = await fetchShiftDataList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchActiveCalendars = createAsyncThunk<any, any>(
	'activeCalendars',
	async (appInfo) => {
		const response = await fetchActiveCalendarList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchSkillsData = createAsyncThunk<any, any>(
	'skillsData',
	async (appInfo) => {
		const response = await fetchSkillsDataList(appInfo);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
export const fetchCategoriesData = createAsyncThunk<any, any>(
	'categoriesData',
	async ({ appInfo, tradeId }: { appInfo: any, tradeId: any }) => {
		const response = await fetchCategoriesDataList(appInfo, tradeId);
		// This adding rowId is to handle the item navigation and showing Toast.
		const modifiedRespone = response.map((row: any, index: number) => {
			return { ...row, rowId: index + 1 }
		})
		// The value we return becomes the `fulfilled` action payload
		return modifiedRespone;
	}
);
// export const fetchPendingDocs = createAsyncThunk<any, any>(
// 	'pendingDocs',
// 	async ({ appInfo, payload }: { appInfo: any, payload: any }) => {
// 		const response = await fetchPendingDocsData(appInfo, payload);

// 		return response;
// 	}
// );
// export const fetchSafetyManuals = createAsyncThunk<any, any>(
// 	'safetyManuals',
// 	async ({ appInfo, payload }: { appInfo: any, payload: any }) => {
// 		const response = await fetchSafetyManualsData(appInfo, payload);

// 		return response;
// 	}
// );
// export const fetchSafetyCertifications = createAsyncThunk<any, any>(
// 	'safetyCertifications',
// 	async ({ appInfo, payload }: { appInfo: any, payload: any }) => {
// 		const response = await fetchSafetyCertificationData(appInfo, payload);

// 		return response;
// 	}
//);
// export const upsertProbation = createAsyncThunk<any, any>(
// 	'safetyProbationData',
// 	async ({ appInfo, payload }: { appInfo: any, payload: any }) => {
// 		const response = await upsertProbationData(appInfo, payload);

// 		return response;
// 	}
// );
export const projectTeamDataSlice = createSlice({
	name: 'projectTeamData',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setRolesData: (state, action: PayloadAction<any>) => {

			state.rolesData = action.payload;
		},
		setTradesData: (state, action: PayloadAction<any>) => {

			state.tradesData = action.payload;
		},
		setEmailSuggestions: (state, action: PayloadAction<any>) => {

			state.emailSuggestions = action.payload;
		},
		setCompaniesData: (state, action: PayloadAction<any>) => {

			state.companiesData = action.payload;
		},
		setShiftsData: (state, action: PayloadAction<any>) => {

			state.shiftsData = action.payload;
		},
		setActiveCalendars: (state, action: PayloadAction<any>) => {

			state.activeCalendars = action.payload;
		},
		setSkillsData: (state, action: PayloadAction<any>) => {

			state.skillsData = action.payload;
		},
		setCategoriesData: (state, action: PayloadAction<any>) => {

			state.categoriesData = action.payload;
		},
		setPendingDocs: (state, action: PayloadAction<any>) => {

			state.pendingDocs = action.payload;
		},
		setSafetyManuals: (state, action: PayloadAction<any>) => {

			state.safetyManuals = action.payload;
		},
		setSafetyCertifications: (state, action: PayloadAction<any>) => {

			state.safetyCertifications = action.payload;
		},
		setWorkTeams: (state, action: PayloadAction<any>) => {

			state.workTeams = action.payload;
		},
		setViolationActionsFired: (state, action: PayloadAction<any>) => {

			state.safetyViolationActions = action.payload;
	
		},
		setTriggerSafetyViolationApis: (state, action: PayloadAction<any>) => {

			state.triggerSafetyViolationApis = action.payload;
	
		}

	},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	extraReducers: (builder) => {
		builder
			.addCase(fetchRolesData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchRolesData.fulfilled, (state, action) => {
				state.loading = false;
				state.rolesData = action.payload;
			})
			.addCase(fetchRolesData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchTradesData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchTradesData.fulfilled, (state, action) => {
				state.loading = false;
				state.tradesData = action.payload;
			})
			.addCase(fetchTradesData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchEmailSuggestions.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchEmailSuggestions.fulfilled, (state, action) => {
				state.loading = false;
				state.emailSuggestions = action.payload;
			})
			.addCase(fetchEmailSuggestions.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchCompaniesData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCompaniesData.fulfilled, (state, action) => {
				state.loading = false;
				state.companiesData = action.payload;
			})
			.addCase(fetchCompaniesData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchShiftsData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchShiftsData.fulfilled, (state, action) => {
				state.loading = false;
				state.shiftsData = action.payload;
			})
			.addCase(fetchShiftsData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchActiveCalendars.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchActiveCalendars.fulfilled, (state, action) => {
				state.loading = false;
				state.activeCalendars = action.payload;
			})
			.addCase(fetchActiveCalendars.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchSkillsData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchSkillsData.fulfilled, (state, action) => {
				state.loading = false;
				state.skillsData = action.payload;
			})
			.addCase(fetchSkillsData.rejected, (state) => {
				state.loading = false;
			})
			.addCase(fetchCategoriesData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchCategoriesData.fulfilled, (state, action) => {
				state.loading = false;
				state.categoriesData = action.payload;
			})
			.addCase(fetchCategoriesData.rejected, (state) => {
				state.loading = false;
			})
			// .addCase(fetchPendingDocs.pending, (state) => {
			// 	state.loading = true;
			// })
			// .addCase(fetchPendingDocs.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.pendingDocs = action.payload;
			// })
			// .addCase(fetchPendingDocs.rejected, (state) => {
			// 	state.loading = false;
			// })
			// .addCase(fetchSafetyManuals.pending, (state) => {
			// 	state.loading = true;
			// })
			// .addCase(fetchSafetyManuals.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.safetyManuals = action.payload;
			// })
			// .addCase(fetchSafetyManuals.rejected, (state) => {
			// 	state.loading = false;
			// })
			// .addCase(fetchSafetyCertifications.pending, (state) => {
			// 	state.loading = true;
			// })
			// .addCase(fetchSafetyCertifications.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.safetyCertifications = action.payload;
			// })
			// .addCase(fetchSafetyCertifications.rejected, (state) => {
			// 	state.loading = false;
			// })
			.addCase(fetchWorkTeamsData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchWorkTeamsData.fulfilled, (state, action) => {
				state.loading = false;
				state.workTeams = action.payload;
			})
			.addCase(fetchWorkTeamsData.rejected, (state) => {
				state.loading = false;
			})
			// .addCase(upsertProbation.pending, (state) => {
			// 	state.loading = true;
			// })
			// .addCase(upsertProbation.fulfilled, (state, action) => {
			// 	state.loading = false;
			// 	state.safetyProbationData = action.payload;
			// })
			// .addCase(upsertProbation.rejected, (state) => {
			// 	state.loading = false;
			// })
	}
});



export const { setRolesData, setTradesData,setViolationActionsFired,setTriggerSafetyViolationApis } = projectTeamDataSlice.actions;

export const getCompanyData = (state: RootState) => state.projectTeamData.companiesData;
export const getTradeData = (state: RootState) => state.projectTeamData.tradesData;
export const getRolesData = (state: RootState) => state.projectTeamData.rolesData;
export const getSkillsData = (state: RootState) => state.projectTeamData.skillsData;
export const getCalendarData = (state: RootState) => state.projectTeamData.activeCalendars;
export const getShiftsData = (state: RootState) => state.projectTeamData.shiftsData;
export const getEmailData = (state: RootState) => state.projectTeamData.emailSuggestions;
export const getcategoriesData = (state: RootState) => state.projectTeamData.categoriesData;
export const getWorkTeams = (state: RootState) => state.projectTeamData.workTeams;

export default projectTeamDataSlice.reducer;