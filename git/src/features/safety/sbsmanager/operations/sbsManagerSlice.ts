import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "app/store";
import {
  fetchCategoryList,
  fetchPhaseDropdownData,
  fetchDataList,
  fetchGridDetailsDataByID,
  fetchAppsList,
  fetchDependentAppFields,
} from "./sbsManagerAPI";
export interface SBSManagerState {
  loading: boolean;
  showToastMessage: any;
  phaseDropDownOptions: any;
  categoryDropDownOptions: any;
  sbsGridData: any;
  showSbsPanel: boolean;
  detailsData: any;
  appsList:any;
  appDependentFields:any;
  selectedNodes:any;
}

const initialState: SBSManagerState = {
  loading: false,
  showToastMessage: { displayToast: false, message: "" },
  phaseDropDownOptions: [],
  categoryDropDownOptions: [],
  sbsGridData: [],
  showSbsPanel: false,
  detailsData: {},
  appsList: [],
  appDependentFields: [],
  selectedNodes:[]
};

export const getSBSGridList = createAsyncThunk<any>(
  "getSBSGridList",
  async () => {
    const response = await fetchDataList();
    return response;
  }
);

export const getPhaseDropdownValues = createAsyncThunk<any>(
  "phaseDropdownValues",
  async () => {
    const response = await fetchPhaseDropdownData();
    return response;
  }
);
export const getCategoryDropDownOptions = createAsyncThunk<any>(
  "categoryDropDownOptions",
  async () => {
    const response = await fetchCategoryList();
    return response;
  }
);

export const getSBSDetailsById = createAsyncThunk<any, any>(
  "changeSbsById",
  async (sbsId: any) => {
    const response = await fetchGridDetailsDataByID(sbsId);
    return response;
  }
);

export const getAppsList = createAsyncThunk<any>(
  "getApps",
  async () => {
    const response = await fetchAppsList();
    return response;
  }
);

export const getAppDependentFields = createAsyncThunk<any, any>(
  "getAppDependentFields",
  async (appId:any) => {
    const response = await fetchDependentAppFields(appId);
    return response;
  }
);

export const SBSManagerSlice = createSlice({
  name: "sbsManager",
  initialState,
  reducers: {
    setToastMessage: (state, action: PayloadAction<any>) => {
      state.showToastMessage = action.payload;
    },
    setShowSbsPanel: (state, action: PayloadAction<boolean>) => {
      state.showSbsPanel = action.payload;
    },
    setSelectedNodes:(state, action: PayloadAction<any>)=>{
      state.selectedNodes = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhaseDropdownValues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPhaseDropdownValues.fulfilled, (state, action) => {
        state.loading = false;
        let data: any = [];
        action?.payload?.forEach((ele: any, idx: any) => {
          data.push({ ...ele, label: ele.name, value: ele.name });
        });
        state.phaseDropDownOptions = data;
      })
      .addCase(getPhaseDropdownValues.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSBSDetailsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSBSDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.detailsData = action?.payload;
      })
      .addCase(getSBSDetailsById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getCategoryDropDownOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryDropDownOptions.fulfilled, (state, action) => {
        state.loading = false;
        let data: any = [];
        action?.payload?.forEach((ele: any, idx: any) => {
          data.push({ ...ele, label: ele.value });
        });
        state.categoryDropDownOptions = data;
      })
      .addCase(getCategoryDropDownOptions.rejected, (state) => {})
      .addCase(getSBSGridList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSBSGridList.fulfilled, (state, action) => {
        state.loading = false;
        state.sbsGridData = action.payload;
      })
      .addCase(getSBSGridList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAppsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppsList.fulfilled, (state, action) => {
        state.loading = false;
        state.appsList = action.payload?.map((appObj:any) => 	{ return {
          id: appObj?.appid,
          objectId: appObj?.id,
          thumbnailUrl: appObj?.iconUrl,
          name: appObj?.name,
          displayField: appObj?.name,
        }});
      })
      .addCase(getAppsList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAppDependentFields.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppDependentFields.fulfilled, (state, action) => {
        state.loading = false;
        state.appDependentFields = action.payload?.MainItemCollections?.[0]?.Fields?.map((obj:any) => {
          return {id: obj?.Id, value: obj?.Id, label: obj?.Label}
        });
      })
      .addCase(getAppDependentFields.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setToastMessage, setShowSbsPanel, setSelectedNodes } = SBSManagerSlice.actions;

export default SBSManagerSlice.reducer;
