import { Hardware, Phishing } from "@mui/icons-material";

export const getEmptyMessage: any = () => {
	return (
		<div className="empty-text-wrapper">
			<div className="empty-text-image-container">
				<Hardware className="empty-text-images" />
				<Phishing className="empty-text-images" />
			</div>
			<p className="empty-text-message primary-message">
				No Items Available
			</p>
			<p className="empty-text-message help-message">
				Create a new budget line item from the above
			</p>
		</div>
	);
};

const getColumnList: any = (commonProps: any) => {
	return [
		{
			// 	field: "costCodeGroup",
			// 	headerName: "Cost Code Group",
			// 	...commonProps,
			// 	width: 400,
			// 	sortable: false,
			// 	renderCell: (params: any) => (
			// 		<span className={"link-style-cell"}>{params.value}</span>
			// 	)
			// },
			// {
			field: "budgetId",
			headerName: "Budget ID",
			...commonProps,
		},
		{
			field: "costCode",
			headerName: "Division/Cost Code",
			...commonProps,
		},
		{
			field: "costType",
			headerName: "Cost Type",
			...commonProps,
		},
		{
			field: "originalBudgetAmount",
			headerName: "Original Budget Amount",
			...commonProps,
		},
		{
			field: "budgetModifications",
			headerName: "Budget Modifications",
			...commonProps,
		},
		{
			field: "approvedCO",
			headerName: "Approved COs",
			...commonProps,
		},
		{
			field: "revisedBudget",
			headerName: "Revised Budget",
			...commonProps,
		},
		{
			field: "estimatedStartDate",
			headerName: "Estimated Start Date",
			...commonProps,
		},
		{
			field: "estimatedEndDate",
			headerName: "Estimated End Date",
			...commonProps,
		},
		{
			field: "curve",
			headerName: "Curve",
			...commonProps,
		},
		{
			field: "projectedScheduleStart",
			headerName: "Projected Schedule Start",
			...commonProps,
		},
		{
			field: "projectedScheduleEnd",
			headerName: "Projected Schedule End",
			...commonProps,
		},
		{
			field: "actualScheduleStart",
			headerName: "Actual Schedule Start",
			...commonProps,
		},
		{
			field: "actualScheduleEnd",
			headerName: "Actual Schedule End",
			...commonProps,
		}
	];
};

export default getColumnList;
