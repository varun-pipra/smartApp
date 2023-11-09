import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "app/hooks";
import "./AwardBidCompareBarChart.scss";

const AwardBidCompareBarChart = (props: any) => {
  const { currencySymbol } = useAppSelector((state) => state.appInfo);
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    if (props.chartData) {
      let data = [...props.chartData];
      const mappedData = data.map((rec: any) => {
        return { ...rec, fill: "#" + rec?.company.colorCode };
      });
      setChartData(mappedData);
    }
  }, [props.chartData]);

  const renderLegend = () => {
    return (
      <ul className="award-bid-chart-legend">
        {(chartData || []).map((rec: any) => (
          <li key={`item-${rec?.id}`} className="award-bid-chart-legend_list">
            <div
              className="award-bid-chart-legend_color-box"
              style={{
                backgroundColor: "#" + rec?.company?.colorCode,
                border: `2px soild #${rec?.company?.colorCode}`,
              }}
            ></div>
            <div className="award-bid-chart-legend_name">
              {rec?.company?.name}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const RenderTooltip = (data: any) => {
    return (
      <div className="award-bid-chart_tooltip">
        <div>
          {currencySymbol +
            " " +
            data?.payload?.[0]?.value?.toLocaleString("en-US")}
        </div>
      </div>
    );
  };

  return (
    <BarChart
      width={500}
      height={500}
      data={chartData}
      margin={{
        top: 5,
        right: 5,
        left: 25,
        bottom: 5,
      }}
    >
      <YAxis
        axisLine={false}
        label={{
          value: "BID AMOUNT",
          angle: -90,
          position: "insideBottomLeft",
          offset: -10,
        }}
        tickLine={false}
        tickFormatter={(value: any) => {
          return currencySymbol + value?.toLocaleString("en-US");
        }}
      />
      <Tooltip cursor={false} content={<RenderTooltip />} />
      <Legend content={renderLegend} margin={{ bottom: -20 }} />
      <Bar dataKey="totalBidValue" barSize={30} fill="#80ff80" />
    </BarChart>
  );
};

export default AwardBidCompareBarChart;
