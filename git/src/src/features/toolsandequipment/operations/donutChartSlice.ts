import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDonutChartData } from "./donutChartAPI";

export type AnalyticalTabPageTypes = "donutchart" | "chart";

export interface AnalyticalTabState {
  loadingDonutchart: boolean;
  donutcharts: any[];
}

const initialState: AnalyticalTabState = {
  loadingDonutchart: false,
  donutcharts: [],
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchDonutcharts = createAsyncThunk(
  "donutchart/Chart",
  async () => {
    const donutcharts = await fetchDonutChartData();

    // The value we return becomes the `fulfilled` action payload
    return donutcharts;
  }
);

export const donutchartSlice = createSlice({
  name: "donutChart",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    //
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonutcharts.pending, (state) => {
        state.loadingDonutchart = true;
      })
      .addCase(fetchDonutcharts.fulfilled, (state, action) => {
        state.loadingDonutchart = false;
        state.donutcharts = action.payload;
      })
      .addCase(fetchDonutcharts.rejected, (state, action) => {
        state.loadingDonutchart = false;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const getPageType = (state: RootState) => state.inventoryCategory;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default donutchartSlice.reducer;
