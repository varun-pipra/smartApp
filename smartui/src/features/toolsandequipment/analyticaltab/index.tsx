import { Fragment } from "react";
import { Grid } from "@mui/material";
import DonutChart from "./donutChart/DonutChart";
import GroupedBarChart from "./groupedBarChart/GroupedBarChart";
import StackedBarChart from "./stackedBarChart/StackedBarChart";

const AnalyticalChart = () => {
  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DonutChart />
        </Grid>
        <Grid item xs={6}>
          <GroupedBarChart />
        </Grid>
        <Grid item xs={12} >
          <StackedBarChart />
        </Grid>
      </Grid>{" "}
    </Fragment>
  );
};

export default AnalyticalChart;
