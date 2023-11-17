import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export interface SMFileState {
  uploadQueue?: Array<any>;
}

const initialState: SMFileState = {
  uploadQueue: [],
};

export const SMFileSlice = createSlice({
  name: "SMFile",
  initialState,
  reducers: {
    setUploadQueue: (state, action: PayloadAction<any>) => {
      state.uploadQueue = action.payload;
    },
  },
});

export const { setUploadQueue } = SMFileSlice.actions;

export const getUploadQueue = (state: RootState) => state.SMFile.uploadQueue;

export default SMFileSlice.reducer;
