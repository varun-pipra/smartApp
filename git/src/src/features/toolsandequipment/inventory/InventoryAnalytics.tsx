import * as React from "react";
import { Box, Stack } from "@mui/material";

import "./InventoryAnalytics.scss";
import InventoryToolbar from "./InventoryToolbar";
import AnalyticalChart from "../analyticaltab";

const InventoryAnalytics = (props: any) => {
  return (
    <Box className={"inventory-analytics-root"} height={"100%"}>
      <Stack className={"inventory-header"} direction={"row"} width={"100%"}>
        <InventoryToolbar />
      </Stack>
      <Stack>
        <AnalyticalChart />
      </Stack>
    </Box>
  );
};

export default InventoryAnalytics;
