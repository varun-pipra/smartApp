import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const  StackedBarChart = (props:any) => {
	return (
		<BarChart width={500} height={500} data={props.chartData} >
			<XAxis dataKey="name" />
			<Legend />
			<Bar dataKey="Avaliable" stackId="a" fill="#80ff80"  />
			<Bar dataKey="Assigned" stackId="a" fill="#6666ff" />
		</BarChart>
	);
}

export default StackedBarChart;
