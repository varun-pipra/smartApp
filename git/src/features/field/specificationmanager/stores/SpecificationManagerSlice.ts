import { RootState } from "app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	fetchSpecManagerList,
	fetchSpecBrenaList,
	fetchSpecBookPages,
	fetchSpecSectionById,
	fetchDivisionList,
  GetUnpublishedCount
} from "./SpecificationManagerAPI";

export interface SpecificationManagerState {
  loading: boolean;
  toast: string;
  SMData: Array<any>;
  openBrena: boolean;
  searchFilterSMspec: any;
  brenaData: Array<any>;
  specBookpages: any;
  specBookSection: any;
  brenaSearchText: any;
  selectedRecsIds?: any;
  smSelectedBrenaIds?: any;
  resizeBrenaPanel: boolean;
  toastMessageForSM: any;
  gridWinTitleMsg: any;
  bulkUpdateDialog: boolean;
  bidPackageDropdownValues:any;
  bulkUpdateBtnDisabled?:boolean;
  bulkUpdateFormValues?: any;
  selectedRecsData?:any;
  rightPanelData?:any;
  divisionList?:any;
  unpublishedCount?:any;
  specSessionDlg?:boolean;
  specStartNewSession?:boolean;
  workingSectionsId?:any;
  sectionsDlg?:boolean;
  specBrenaFilters?:any;
  changedSMDetailsValue?:any;
  smEnableButton?:any,
  showExtractSpecAI?:boolean;
  smBrenaRaightPanelMarkups:any
}

const initialState: SpecificationManagerState = {
  loading: false,
  toast: "",
  SMData: [],
  openBrena: false,
  searchFilterSMspec: "",
  brenaData: [],
  specBookpages: "",
  specBookSection: [],
  brenaSearchText: "",
  selectedRecsIds: [],
  smSelectedBrenaIds: [],
  resizeBrenaPanel: false,
  toastMessageForSM: "",
  gridWinTitleMsg: false,
  bulkUpdateDialog : false,
  bidPackageDropdownValues : [],
  bulkUpdateBtnDisabled: true,
  bulkUpdateFormValues: {},
  selectedRecsData:[],
  rightPanelData : {},
  divisionList:[],
  unpublishedCount:{},
  specSessionDlg: false,
  specStartNewSession: true,
  workingSectionsId: "",
  sectionsDlg: false,
  specBrenaFilters: {},
  changedSMDetailsValue:[],
  smEnableButton:false,
  showExtractSpecAI:true,
  smBrenaRaightPanelMarkups:{}
};

export const getSMList = createAsyncThunk<any>(
  "specificationManagerList",
  async () => {
    const response = await fetchSpecManagerList();
    return response;
  }
);

export const getBrenaList = createAsyncThunk<any, any>(
  "brenaList",
  async (payload) => {
    const response = await fetchSpecBrenaList(payload);
    return response;
  }
);

export const getSpecBookPages = createAsyncThunk<any, any>(
  "specBookPages",
  async (payload) => {
    const response = await fetchSpecBookPages(payload);
    return response;
  }
);
export const getSpecSectionById = createAsyncThunk<any, any>(
  "specSectionById",
  async (payload) => {
    const response = await fetchSpecSectionById(payload);
    return response;
  }
);
export const getDivisionList = createAsyncThunk<any>(
  "divisionList",
  async () => {
    const response = await fetchDivisionList();
    return response;
  }
);
export const getUnpublishedCount = createAsyncThunk<any>(
  "unpublishedCount",
  async () => {
    const response = await GetUnpublishedCount();
    return response;
  }
);
export const SpecificationManagerSlice = createSlice({
  name: "specificationManager",
  initialState,
  reducers: {
    setToast: (state, action: PayloadAction<any>) => {
      state.toast = action.payload;
    },
    setSMData: (state, action: PayloadAction<any>) => {
      state.SMData = action.payload;
    },
    setSMBrenaStatus: (state, action: PayloadAction<boolean>) => {
      state.openBrena = action.payload;
    },
    setSearchFilterSMspec: (state, action: PayloadAction<string>) => {
      state.searchFilterSMspec = action.payload;
    },
    setSpecSectionById: (state, action: PayloadAction<string>) => {
      state.specBookSection = action.payload;
    },
    resetSpecBookPages: (state, action: PayloadAction<any>) => {
      state.specBookpages = action.payload;
    },
    setBrenaSearchText: (state, action: PayloadAction<any>) => {
      state.brenaSearchText = action.payload;
    },
    setSelectedRecsIds: (state, action: PayloadAction<any>) => {
      state.selectedRecsIds = action.payload;
    },
    setSmSelectedBrenaIds: (state, action: PayloadAction<any>) => {
      state.smSelectedBrenaIds = action.payload;
    },
    setResizeBrenaPanel: (state, action: PayloadAction<boolean>) => {
      state.resizeBrenaPanel = action.payload;
    },
    setToastMessageForSM: (state, action: PayloadAction<any>) => {
      state.toastMessageForSM = action.payload;
    },
    setGridWinTitleMsg: (state, action: PayloadAction<any>) => {
      state.gridWinTitleMsg = action.payload;
    },
    setBulkUpdateDialog: (state, action: PayloadAction<boolean>) => {
      state.bulkUpdateDialog = action.payload;
    },
    setBidPackageDropdownValues: (state, action: PayloadAction<any>) => {
      state.bidPackageDropdownValues = action.payload;
    },
    setBulkUpdateBtnDisabled: (state, action: PayloadAction<boolean>) => {
      state.bulkUpdateBtnDisabled = action.payload;
    },
    setBulkUpdateFormValues: (state, action: PayloadAction<any>) => {
      state.bulkUpdateFormValues = action.payload;
    },
    setSelectedRecsData: (state, action: PayloadAction<any>) => {
      state.selectedRecsData = action.payload;
    },
    setRightPanelData: (state, action: PayloadAction<any>) => {
      state.rightPanelData = action.payload;
    },
    setSpecSessionDlg: (state, action: PayloadAction<boolean>) => {
      state.specSessionDlg = action.payload;
    },
    setSpecStartNewSession: (state, action: PayloadAction<boolean>) => {
      state.specStartNewSession = action.payload;
    },
    setWorkingSectionsId: (state, action: PayloadAction<any>) => {
      state.workingSectionsId = action.payload;
    },
    setSectionsDlg: (state, action: PayloadAction<any>) => {
      state.sectionsDlg = action.payload;
    },
    setSpecBrenaFilters: (state, action: PayloadAction<any>) => {
      state.specBrenaFilters = action.payload;
    },
    setChangedSMDetailsValue: (state, action: PayloadAction<any>) => {
      state.changedSMDetailsValue = action.payload;
    },
    setEnableSaveButton: (state, action: PayloadAction<any>) => {
      state.smEnableButton = action.payload;
    },
    setShowExtractSpecAI: (state, action: PayloadAction<any>) => {
      state.showExtractSpecAI = action.payload;
    },
    setSmBrenaRaightPanelMarkups: (state, action: PayloadAction<any>) => {
      console.log(action.payload,'action.payload')
      state.smBrenaRaightPanelMarkups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSMList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSMList.fulfilled, (state, action) => {
        state.loading = false;
        state.SMData = action.payload;
      })
      .addCase(getSMList.rejected, (state) => {
        state.loading = false;
      })

      // for handling Brena data
      .addCase(getBrenaList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBrenaList.fulfilled, (state, action) => {
        state.loading = false;
        state.brenaData = action.payload;
      })
      .addCase(getBrenaList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSpecBookPages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSpecBookPages.fulfilled, (state, action) => {
        state.loading = false;
        state.specBookpages = action.payload;
      })
      .addCase(getSpecBookPages.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSpecSectionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSpecSectionById.fulfilled, (state, action) => {
        state.loading = false;
        state.specBookSection = action.payload;
      })
      .addCase(getSpecSectionById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDivisionList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDivisionList.fulfilled, (state, action) => {
        state.loading = false;
        let data: any = [];
        action?.payload?.forEach((ele: any, idx: any) => {
          const index = data?.findIndex((item: any) => {
            return item.name === action.payload[idx].keyValue;
          });
          action.payload[idx].name = action?.payload?.[idx]?.value;
          if (index === -1) {
            data.push({
              	text: ele.keyValue,
			  	      value: ele.keyValue,
				        name: ele.keyValue,
                id: ele.id,
                options: [action.payload[idx]],
            });
          } else {
            data[index].options.push(action.payload[idx]);
          }
        });
        state.divisionList = data;
      })
      .addCase(getDivisionList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUnpublishedCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnpublishedCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unpublishedCount = action.payload;
      })
      .addCase(getUnpublishedCount.rejected, (state) => {
        state.loading = false;
      })
  },
});

export const getSMBrenaStatus = (state: RootState) =>
  state.specificationManager.openBrena;

export const getSearchFilterSMspec = (state: RootState) =>
  state.specificationManager.searchFilterSMspec;

export const getBrenaData = (state: RootState) =>
  state.specificationManager.brenaData;

export const getspecSectionById = (state: RootState) =>
  state.specificationManager.specBookSection;

export const getResizeBrenaPanel = (state: RootState) =>
  state.specificationManager.resizeBrenaPanel;

export const getToastMessageForSM = (state: RootState) =>
  state.specificationManager.toastMessageForSM;

export const {
  setToast,
  setSMData,
  setSMBrenaStatus,
  setSearchFilterSMspec,
  setSpecSectionById,
  resetSpecBookPages,
  setBrenaSearchText,
  setSelectedRecsIds,
  setSmSelectedBrenaIds,
  setResizeBrenaPanel,
  setToastMessageForSM,
  setGridWinTitleMsg,
  setBulkUpdateDialog,
  setBidPackageDropdownValues,
  setBulkUpdateFormValues,
  setBulkUpdateBtnDisabled,
  setSelectedRecsData,
  setRightPanelData,
  setSpecSessionDlg,
  setSpecStartNewSession,
  setWorkingSectionsId,
  setSectionsDlg,
  setSpecBrenaFilters,
  setChangedSMDetailsValue,
  setEnableSaveButton,
  setShowExtractSpecAI,
  setSmBrenaRaightPanelMarkups
} = SpecificationManagerSlice.actions;

export default SpecificationManagerSlice.reducer;
