import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSmartSubmitalGridList, fetchSubmittalById } from "./SmarSubmitalAPI";

export interface SmartSubmitalState {
  loading: boolean;
  gridData: Array<any>;
  detailsGridData: Array<any>;
  SSBrenaOpen: boolean;
  selectedRecord: any;
  selectedBrenaFilter?: any;
  selectedRecordsData?: Array<any>;
  specDropdownValue?: String;
  resumeLaterDlg?:Boolean;
  submittalData?:any;
  ssRightPanelData?:any;
  rightPanelUpdated?:boolean;
  rightPanelNavCount?:any;
  rightPanelNavFlag?:any;
  showManageSubmittalsAI?:boolean;
}

const initialState: SmartSubmitalState = {
  loading: false,
  gridData: [],
  detailsGridData: [],
  SSBrenaOpen: false,
  selectedRecord: {},
  selectedBrenaFilter: {},
  selectedRecordsData: [],
  specDropdownValue: "",
  resumeLaterDlg:false,
  submittalData: {},
  ssRightPanelData:{},
  rightPanelUpdated:false,
  rightPanelNavCount: {startPage: 0,endPage: 0},
  rightPanelNavFlag: 0,
  showManageSubmittalsAI:true,
};
export const getSmartSubmitalGridList = createAsyncThunk<any, any>(
  "smartSubmitalList",
  async (payload) => {
    const response = await fetchSmartSubmitalGridList(payload);
    return response;
  }
);
export const getSubmitalById = createAsyncThunk<any, any>(
  "getSubmitalById",
  async (payload) => {
    const response = await fetchSubmittalById(payload);
    return response;
  }
);
const smartSubmitalSlice = createSlice({
  name: "smartSubmital",
  initialState,
  reducers: {
    setSSBrenaStatus: (state, action: PayloadAction<boolean>) => {
      state.SSBrenaOpen = action.payload;
    },
    setSelectedRecord: (state, action: PayloadAction<any>) => {
      state.selectedRecord = action.payload;
    },
    setSelectedBrenaFilters: (state, action: PayloadAction<any>) => {
      state.selectedBrenaFilter = action.payload;
    },
    setSelectedRecordsData: (state, action: PayloadAction<any>) => {
      state.selectedRecordsData = action.payload;
    },
    setSpecDropdownValue: (state, action: PayloadAction<any>) => {
      state.specDropdownValue = action.payload;
    },
    setResumeLaterDlg: (state, action: PayloadAction<any>) => {
      state.resumeLaterDlg = action.payload;
    },
    setSSRightPanelData: (state, action: PayloadAction<any>) => {
      state.ssRightPanelData = action.payload;
    },
    setRightPanelUpdated: (state, action: PayloadAction<boolean>) => {
      state.rightPanelUpdated = action.payload;
    },
    setRightPanelNavFlag: (state, action: PayloadAction<any>) => {
      state.rightPanelNavFlag = action.payload;
    },
    setRightPanelNavCount: (state, action: PayloadAction<any>) => {
      state.rightPanelNavCount = action.payload;
    },
    setShowManageSubmittalsAI: (state, action: PayloadAction<any>) => {
      state.showManageSubmittalsAI = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSmartSubmitalGridList.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getSmartSubmitalGridList.fulfilled,
        (state, action: PayloadAction<Array<any>>) => {
          state.loading = false;
          state.gridData = action.payload;
        }
      )
      .addCase(getSmartSubmitalGridList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSubmitalById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getSubmitalById.fulfilled,
        (state, action: PayloadAction<Array<any>>) => {
          state.loading = false;
          state.submittalData = action.payload;
        }
      )
      .addCase(getSubmitalById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setSSBrenaStatus,
  setSelectedRecord,
  setSelectedBrenaFilters,
  setSelectedRecordsData,
  setSpecDropdownValue,
  setResumeLaterDlg,
  setSSRightPanelData,
  setRightPanelUpdated,
  setRightPanelNavCount,
  setRightPanelNavFlag,
  setShowManageSubmittalsAI
} = smartSubmitalSlice.actions;

export default smartSubmitalSlice.reducer;
