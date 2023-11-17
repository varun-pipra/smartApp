import * as React from 'react';
import {
	DataGridPremium,
	useGridApiRef,
	useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { useMovieData } from '@mui/x-data-grid-generator';
import { Box } from '@mui/material';
const SAPGrid = () => {
	const data = useMovieData();
	const apiRef = useGridApiRef();

	const initialState = useKeepGroupedColumnsHidden({
		apiRef,
		initialState: {
			rowGrouping: {
				model: ['costCode'],
			},
		},
	});

	return (

		<DataGridPremium
			columns={columns}
			rows={[]}
			apiRef={apiRef}
			rowGroupingColumnMode="single"
			initialState={initialState}
			hideFooter={true}

		/>
	);
}

export default SAPGrid;

const columns = [
	{
		"field": "costCodeGroup",
		"headerName": "Cost Code Group",
		"groupable": true
	},
	{
		"field": "budgetId",
		"headerName": "Budget ID"
	},
	{
		"field": "costCode",
		"headerName": "Division/Cost Code"
	},
	{
		"field": "costType",
		"headerName": "Cost Type"
	},
	{
		"field": "originalBudgetAmount",
		"headerName": "Original Budget Amount"
	},
	{
		"field": "budgetModifications",
		"headerName": "Budget Modifications"
	},
	{
		"field": "approvedCO",
		"headerName": "Approved COs"
	},
	{
		"field": "revisedBudget",
		"headerName": "Revised Budget"
	},
	{
		"field": "estimatedStartDate",
		"headerName": "Estimated Start Date"
	},
	{
		"field": "estimatedEndDate",
		"headerName": "Estimated End Date"
	},
	{
		"field": "curve",
		"headerName": "Curve"
	},
	{
		"field": "projectedScheduleStart",
		"headerName": "Projected Schedule Start"
	},
	{
		"field": "projectedScheduleEnd",
		"headerName": "Projected Schedule End"
	},
	{
		"field": "actualScheduleStart",
		"headerName": "Actual Schedule Start"
	},
	{
		"field": "actualScheduleEnd",
		"headerName": "Actual Schedule End"
	}
];