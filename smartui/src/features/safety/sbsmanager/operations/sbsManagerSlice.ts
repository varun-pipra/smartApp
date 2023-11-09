import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "app/store";

import { fetchPhaseDropdownData } from "./sbsManagerAPI";
export interface SBSManagerState {
  loading: boolean;
  showToastMessage: any;
  phaseDropDownOptions: any;
}

const initialState: SBSManagerState = {
  loading: false,
  showToastMessage: { displayToast: false, message: "" },
  phaseDropDownOptions: [],
};

export const getPhaseDropdownValues = createAsyncThunk<any>(
  "phaseDropdownValues",
  async () => {
    const response = await fetchPhaseDropdownData();
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhaseDropdownValues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPhaseDropdownValues.fulfilled, (state, action) => {
        state.loading = false;
        state.phaseDropDownOptions = action.payload;
      })
      .addCase(getPhaseDropdownValues.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setToastMessage } = SBSManagerSlice.actions;

export default SBSManagerSlice.reducer;
