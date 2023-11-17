import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { useAppSelector, useAppDispatch } from "app/hooks";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";

import { fetchDonutcharts } from "../../operations/donutChartSlice";
import "./DonutChart.scss";

interface DonutDataType {
  name: string;
  value: number;
  color: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

const DonutChart = () => {
  const dispatch = useAppDispatch();
  const { donutcharts } = useAppSelector((state) => state.donutchart);
  const [age, setAge] = useState("2022");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  useEffect(() => {
    dispatch(fetchDonutcharts());
  }, []);

  return (
    <Box
      className="barChart-Container"
      sx={{
        border: "1px solid black",
        margin: "25px 0px 0px 35px",
        height: "400px",
        borderRadius: "25px",
        paddingLeft: "15px",
      }}
    >
      <div className="chart-content">
        <div className="">
          <Typography
            variant="h6"
            sx={{ textAlign: "left", marginTop: "20px" }}
          >
            Status
          </Typography>
        </div>
        <div className="">
          <FormControl sx={{ m: 1, width: 150, mt: 3 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
              MenuProps={MenuProps}
              input={<OutlinedInput />}
            >
              <MenuItem value={"2022"}>2022</MenuItem>
              <MenuItem value={"2021"}>2021</MenuItem>
              <MenuItem value={"2020"}>2020</MenuItem>
              <MenuItem value={"2019"}>2019</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <PieChart width={550} height={300}>
        <Pie
          data={donutcharts}
          cx={120}
          cy={160}
          innerRadius={80}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
        >
          {donutcharts.map((entry: DonutDataType, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          payload={donutcharts.map((item) => ({
            id: item.name,
            type: "circle",
            value: `${item.name} (${item.value})`,
            color: item.color,
          }))}
          wrapperStyle={{
            top: 70,
          }}
        />
      </PieChart>
    </Box>
  );
};

export default DonutChart;
