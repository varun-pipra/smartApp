import React from "react";
import Box from "@mui/material/Box";
import "./StackedBarChart.scss";
import { useAppSelector, useAppDispatch } from "app/hooks";
import Typography from "@mui/material/Typography";
import {
  ComposedChart,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts";
import { fetchStackedbarcharts } from "../../operations/chartSlice";

const CustomCursorBackground = (props: any) => {
  const { points, height } = props;
  let { x, y } = points[0];
  return (
    <>
      <Rectangle
        fill="transparent"
        x={x - 20}
        y={y}
        width={20}
        height={height}
        className="re"
      />
    </>
  );
};

const StackedBarChart = () => {
  const dispatch = useAppDispatch();
  const { stackedbarcharts } = useAppSelector((state) => state.stackedbarchart);

  React.useEffect(() => {
    dispatch(fetchStackedbarcharts());
  }, []);

  return (
    <>
      <Box
        className="container"
        sx={{
          border: "1px solid black",
          width: "90%",
          margin: "10px",
          marginLeft: "40px",
          height: "650px",
          borderRadius: "25px",
          paddingLeft: "15px",
        }}
      >
        {" "}
        <Typography variant="h5" sx={{ textAlign: "left", marginTop: "20px" }}>
          Rented Vs. Owned
        </Typography>
        {/* <Typography variant="h3" sx={{ marginLeft: "70px", marginTop: "20px" }}>
          10,488
        </Typography>
        <Typography variant="body1" sx={{ marginLeft: "80px" }}>
          Total Tools
        </Typography> */}
        <div className="chartWrapper">
          <div className="chartAreaWrapper">
            <ComposedChart
              width={1800}
              height={400}
              data={stackedbarcharts}
              margin={{ left: 60, bottom: 0, top: 10 }}
            >
              <CartesianGrid vertical={false} />
              <YAxis axisLine={false} tickLine={false} type="number" />
              <Legend
                verticalAlign="top"
                align="center"
                iconType={"Circle"}
                iconSize={22}
              />
              <Tooltip cursor={<CustomCursorBackground />} />

              <Bar
                background={{ fill: "lightblue", radius: [20, 20, 20, 20] }}
                dataKey="Rented"
                stackId="a"
                fill="darkblue"
                barSize={20}
                radius={[0, 0, 20, 20]}
              />
              <Bar
                dataKey="Owned"
                stackId="a"
                fill="blue"
                barSize={20}
                radius={[20, 20, 0, 0]}
              />
            </ComposedChart>
            <Box
              className="container1"
              display="flex"
              marginTop="20px"
              marginBottom="30px"
            >
              <img
                alt="Chart"
                className="img1"
                src="https://png.pngtree.com/png-clipart/20200701/original/pngtree-construction-tool-electric-drill-png-image_5404155.jpg"
              />
              <img
                alt="Chart"
                className="img"
                src="https://cdn3.vectorstock.com/i/thumb-large/41/92/drill-cartoon-isolated-design-vector-32074192.jpg"
              />
              <img
                alt="Chart"
                className="img3"
                src="https://png.pngtree.com/png-clipart/20190921/original/pngtree-cartoon-red-electric-drill-illustration-png-image_4748036.jpg"
              />
              <img
                alt="Chart"
                className="img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo9vHZ0AOzNL0gmn-w8Q2nPVwyvjTJs1MCoqP_Ebbp&s"
              />
              <img
                alt="Chart"
                className="img5"
                src="https://png.pngtree.com/png-clipart/20220622/original/pngtree-electric-drill-icon-isolated-tool-png-image_8182137.png"
              />

              <img
                alt="Chart"
                className="img"
                src="https://d1b5h9psu9yexj.cloudfront.net/13147/Bosch-PS31-2A-12-Volt-Max-Drill-Driver-Kit_20181127-194416_full.jpg"
              />
              <img
                alt="Chart"
                className="img"
                src="https://png.pngtree.com/png-clipart/20220112/original/pngtree-orange-grey-mechanical-drill-flat-design-png-image_7101361.png"
              />

              <img
                alt="Chart"
                className="img8"
                src="https://png.pngtree.com/png-clipart/20200701/original/pngtree-construction-tool-electric-drill-png-image_5404155.jpg"
              />

              <img
                alt="Chart"
                className="img8"
                src="https://cdn3.vectorstock.com/i/thumb-large/41/92/drill-cartoon-isolated-design-vector-32074192.jpg"
              />
              <img
                alt="Chart"
                className="img8"
                src="https://png.pngtree.com/png-clipart/20190921/original/pngtree-cartoon-red-electric-drill-illustration-png-image_4748036.jpg"
              />
            </Box>
          </div>
        </div>
      </Box>
    </>
  );
};

export default StackedBarChart;
