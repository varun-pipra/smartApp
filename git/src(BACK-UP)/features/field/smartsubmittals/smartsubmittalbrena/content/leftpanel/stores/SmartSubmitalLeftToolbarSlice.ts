import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DeleteBrenaSubmittals,
  fetchSectionCardsList,
  fetchSmartSubmitalType,
  UpdateStatusCommit,
} from "./SmartSubmitalLeftToolbarApi";

export interface SmartSubmitalLeftToolbar {
  loading: boolean;
  sectionsCardsData: Array<any>;
  updateStatusVal?: boolean;
  deleteBrenaSubmittalsVal?: boolean;
  selectedCardsIds : Array<any>;
  submitalTypeValues?: Array<any>;
}

const initialState: SmartSubmitalLeftToolbar = {
  loading: false,
  sectionsCardsData: [],
  updateStatusVal: false,
  deleteBrenaSubmittalsVal: false,
  selectedCardsIds : [],
  submitalTypeValues : []
};
export const getSectionsCardsDataList = createAsyncThunk<any, any>(
  "sectionsCardsData",
  async (payload) => {
    const response = await fetchSectionCardsList(payload);
    return response;
  }
);
export const updateStatusCommit = createAsyncThunk<any, any>(
  "updateStatusCommit",
  async (payload) => {
    const response = await UpdateStatusCommit(payload);
    return response;
  }
);
export const deleteBrenaSubmittals = createAsyncThunk<any, any>(
  "deleteSubmittals",
  async (payload) => {
    const response = await DeleteBrenaSubmittals(payload);
    return response;
  }
);
export const getSubmittalType = createAsyncThunk<any>(
  "getSubmittalType",
  async () => {
    const response = await fetchSmartSubmitalType();
    return response;
  }
);
const smartSubmitalLeftToolbarSlice = createSlice({
  name: "smartSubmitalLeftToolbar",
  initialState,
  reducers: {
    setSelectedCardsIds : (state, action: PayloadAction<any>) => {
      state.selectedCardsIds = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSectionsCardsDataList.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getSectionsCardsDataList.fulfilled,
        (state, action: PayloadAction<Array<any>>) => {
          state.loading = false;
          state.sectionsCardsData = action.payload;
        }
      )
      .addCase(getSectionsCardsDataList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateStatusCommit.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateStatusCommit.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.updateStatusVal = action.payload;
        }
      )
      .addCase(updateStatusCommit.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteBrenaSubmittals.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteBrenaSubmittals.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.deleteBrenaSubmittalsVal = action.payload;
        }
      )
      .addCase(deleteBrenaSubmittals.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getSubmittalType.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubmittalType.fulfilled,(state, action: PayloadAction<Array<any>>) => {
          state.loading = false;
          state.submitalTypeValues = action.payload;
        }
      )
      .addCase(getSubmittalType.rejected, (state) => {
        state.loading = false;
      })
  },
});
export const {setSelectedCardsIds} = smartSubmitalLeftToolbarSlice.actions;
export default smartSubmitalLeftToolbarSlice.reducer;
