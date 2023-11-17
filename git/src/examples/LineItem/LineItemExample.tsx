import React, { useMemo, useState, useRef, useEffect } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import SUILineItem from "../../sui-components/LineItem/LineItem";
import SUIBudgetLineItemSelect from "sui-components/BudgetLineItemSelect/BudgetLineItemSelect";
import { InputAdornment, TextField } from "@mui/material";

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			//maxHeight: 300,
			maxWidth: "160px !important",
			minWidth: "fit-content !important",
			marginLeft: "18px",
		},
	})
);

const LineItemExample = (props: any) => {
	const classes = useStyles();
	const [newRecord, setNewRecord] = useState<any>({});
	const recRef = useRef<any>();
	const budgetLineItems: any = [
		{
			value: 1239,
			label: "01 - General Requirement",
			options: [
				{
					value: 1256,
					label:
						"General Contractor 1001 Test Test Test Test Test TEst Test Test Test Test TEstTestTestTestTest TEst Test Test",
					colVal: "$400",
				},
				{
					value: 1257,
					label: "General Contractor- Airports 1002",
					colVal: "$800",
				},
				{
					value: 1258,
					label: "General Contractor- Churches 1003",
					colVal: "$400",
				},
				{
					value: 1259,
					label: "General Contractor- Commercial 1004",
					colVal: "$300",
				},
				{
					value: 1298,
					label: "Construction Cleaning Services 1710",
					colVal: "$400",
				},
				{
					value: 1299,
					label: "Insurance and Bonding 1905",
					colVal: "$500",
				},
			],
		},
		{
			value: 1191,
			label: "02 - Existing Conditions",
			options: [
				{
					value: 1300,
					label: "Site Work Supplier 2010",
					colVal: "$400",
				},
				{
					value: 1301,
					label: "Aggregate Manufacture Supplier 2040",
					colVal: "$200",
				},
				{
					value: 1335,
					label: "Fences & Gates 2830",
					colVal: "$300",
				},
				{
					value: 1336,
					label: "Landscaping and Irrigation 2900",
					colVal: "$600",
				},
			],
		},
		{
			value: 1241,
			label: "03 - Concrete",
			options: [
				{
					value: 1337,
					label: "Concrete Contractor 3010",
					colVal: "$400",
				},
				{
					value: 1338,
					label: "Concrete Supplier 3050",
					colVal: "$900",
				},
				{
					value: 1354,
					label: "Concrete Restoration and Cleaning 3700",
					colVal: "$1000",
				},
			],
		},
		{
			value: 1193,
			label: "04 - Masonry",
			options: [
				{
					value: 1355,
					label: "Masonry 4200",
					colVal: "$400",
				},
				{
					value: 1361,
					label: "Masonry Restoration and Cleaning 4500",
					colVal: "$50",
				},
				{
					value: 1362,
					label: "Special Masonry Installations 4550",
					colVal: "$200",
				},
			],
		},
	];

	let data = [
		{
			budgetLine: "",
			estimate: null,
		},
		{
			budgetLine: "0001 - 00010-Accountant-L - Labor",
			estimate: 12000,
		},
		{
			budgetLine: "0004 - 02000-Site Construction-OC - Owner Cost",
			estimate: 10000,
		},
		{
			budgetLine: "0006 - 03050-Concrete Materials-M - Materials",
			estimate: 5000,
		},
	];
	useEffect(() => {
    recRef.current = newRecord;
  }, [newRecord]);

	var [rowData, setRowData] = React.useState(data);

	const handleInputChange = (value: any) => {
		if (typeof value === 'number' || typeof value === 'string') {
			for (let optionList of budgetLineItems || []) {
				const selectedRec = optionList.options.find(
					(childOption: any) => childOption.value === value
				);
				if (selectedRec) {
					setNewRecord({
					...selectedRec,
					budgetLine: selectedRec?.label,
					estimate: Number(selectedRec?.colVal?.replace('$','')),
					});
				}
			}
		}
	};

	const columns = [
		{
			headerName: "Budget Line Item",
			field: "budgetLine",
			cellRenderer: (params: any) => {
				return params.node?.level == 0 && params.node.rowIndex === 0 ? (
					<SUIBudgetLineItemSelect
						lineItemlabel=""
						options={budgetLineItems}
						handleInputChange={handleInputChange}
						multiSelect={false}
						//selectedValue={recRef?.current?.value || []}
					></SUIBudgetLineItemSelect>
				) : (
					params.data.budgetLine
				);
			},
		},
		{
			headerName: "Budget Estimate",
			field: "estimate",
			cellRenderer: (params: any) => {
				return (
					<TextField
						className="custome-label"
						required
						type="text"
						variant="standard"
						value={params.node?.level == 0 && params.node.rowIndex === 0 ? recRef?.current?.estimate :  params.data.estimate}
						InputProps={{
							readOnly: true,
							startAdornment: (
								<InputAdornment position="start">
									<span style={{ color: '#333333' }}>$</span>
								</InputAdornment>
							),
						}}
					/>
				);
			},
		},
	];
	const [columnDefs, setColumnDefs] = React.useState(columns);

	const containerStyle = useMemo(
		() => ({ width: "100%", height: "640px" }),
		[]
	);

	var summaryDataConfig = {
		displayFields: {
			budgetLine: "Grand Total",
		},
		aggregateFields: ["estimate"],
	};

	const onRemove = (idx: any) => {
		// console.log("Index removed: ", idx);
	};

	const onAdd = (data: any) => {
		recRef.current = {};
		setNewRecord({});
		// console.log("Data added: ", data);
	};

	return (
		<div style={containerStyle} className="budget-grid-cls">
			<SUILineItem
				headers={columnDefs}
				data={rowData}
				pinnedBottomRowConfig={summaryDataConfig}
				onAdd={onAdd}
				onRemove={onRemove}
				newRecord={newRecord}
				canAddEmptyRecords={false}
				columnsToRefresh={['estimate']}
			/>
		</div>
	);
};

export default LineItemExample;
