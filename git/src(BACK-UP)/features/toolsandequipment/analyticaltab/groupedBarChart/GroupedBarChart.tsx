import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
// import "./styles.css";
import { useAppSelector, useAppDispatch } from "app/hooks";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { fetchGroupedbarcharts } from "../../operations/groupedBarChartSlice";

const GroupedBarChart = () => {
  const dispatch = useAppDispatch();
  const { groupedbarcharts } = useAppSelector((state) => state.groupedBarchart);

  useEffect(() => {
    dispatch(fetchGroupedbarcharts());
  }, []);

  return (
    <Box
      className=""
      sx={{
        border: "1px solid black",
        margin: "25px 25px 0px 0px",
        height: "400px",
        width: "642px",
        borderRadius: "25px",
        paddingLeft: "15px",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "left", marginTop: "35px", marginLeft: "10px" }}>
        Availability
      </Typography>

      <BarChart
        width={500}
        height={320}
        data={groupedbarcharts}
        margin={{
          top: 45,
          right: 10,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend layout="vertical" verticalAlign="top" align="right" />
        <Bar dataKey="Available" fill="#8884d8" width={"10px"} radius={50} />
        <Bar dataKey="Assigned" fill="#82ca9d" width={"10px"} radius={50} />
      </BarChart>
    </Box>
  );
};

export default GroupedBarChart;
