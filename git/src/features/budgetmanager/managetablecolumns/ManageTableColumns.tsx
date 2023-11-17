import React from "react";
import './ManageTableColumns.scss';
import CustomColumns from './customcolumns/CustomColumns';
import TableColumnCard from './tablecolumncard/TableColumnCard';
import SmartDialog from "components/smartdialog/SmartDialog";
import ButtonMenu, { ButtonMenuOption } from "components/buttonmenu/ButtonMenu";

import { Button, Label, Table, TableColumn } from "@ui5/webcomponents-react";
import { KeyboardAlt } from '@mui/icons-material';
import { Box, } from "@mui/material";


import "@ui5/webcomponents-icons/dist/AllIcons";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { fetchTableColumns, setShowTableColumnsPopup, getHostAppInfo } from "../operations/tableColumnsSlice";
import { getServer } from "app/common/appInfoSlice";

const displayWidth: string = "12rem";
const actionWidth: string = "10rem";


const custom_columns = [{ name: "Pending Cost", enableToggle: true, enabled: true, column1: "", column2: "", operation: "+" }]
const standard_columns = [
	{ name: "Budget ID", enableToggle: false },
	{ name: "Division/Cost Code", enableToggle: false },
	{ name: "Cost Type", enableToggle: false },
	{ name: "Original Budget Amount", enableToggle: false },
	{ name: "Budget Modifications", enableToggle: false },
	{ name: "Approved COs", enableToggle: true, enabled: true },
	{ name: "DIrect Cost", enableToggle: true, enabled: true },
	{ name: "Projected Cost", enableToggle: true, enabled: false }
]
const ManageTableColumns = () => {
	const dispatch = useAppDispatch();
	const { tableColumns } = useAppSelector((state) => state.tableColumns);
	const [showAddColumnPane, setShowAddColumnPane] = React.useState<boolean>(false);
	const [customColumns, setCustomColumns] = React.useState<any>(custom_columns);
	const [standardColumns, setstandardColumns] = React.useState(standard_columns);
	const hostAppInfo = useAppSelector(getServer);

	const nestedOptions: ButtonMenuOption[] = [
		{
			text: "My views", value: "My views",
			options: [{ text: "Basic Budget View", value: "Basic Budget View", },
			{ text: "My View ||", value: "My View ||", }, { text: "My View |||", value: "My View |||", },]
		},
		{
			text: "Public Views", value: "Public Views",
			options: [{ text: "Basic View", value: "Basic View" },
			{ text: "Commitment and Savings", value: "Commitment and Savings" },
			{ text: "Public View |", value: "Public View |" }
			]
		},
	];
	const onBudgetViewChange = (budgetView: string) => {
		//
	};
	const submitCustomColumn = (data: any) => {
		setCustomColumns([...customColumns, data])
	}
	const handleDelete = (index: number) => {
		const customcolumnsclone = customColumns;
		customcolumnsclone.splice(index, 1);
		setCustomColumns([...customcolumnsclone])
	}

	const [val, setVal] = React.useState<any>(false);

	const titleEl = (
		<>
			Manage Table Columns &nbsp;&nbsp;&nbsp;{" "}
			<ButtonMenu
				onChange={onBudgetViewChange}
				options={nestedOptions}
				value="Basic View"
				useNestedOptions={true}
				buttonStyle={{ padding: '0px 10px 0px 10px', color: 'gray', border: '1px solid gray' }}
				startIcon={<KeyboardAlt />}
			></ButtonMenu>
		</>
	);


	const buttonsEl = (
		<Box display={"flex"} gap={2} className='button-Section'>
			<Button className='saveViewAs_button'>SAVE VIEW AS</Button>
			<Button design="Emphasized" className='saveView_button'>SAVE VIEW</Button>
		</Box>
	);

	const addCustomColumn = (event: React.SyntheticEvent) => {
		event.stopPropagation();
		setShowAddColumnPane(true);
	};


	React.useEffect(() => {
		dispatch(fetchTableColumns(hostAppInfo));
	}, []);


	return (
		<SmartDialog
			open={true}
			custom={{
				title: titleEl,
				closable: true,
				buttons: buttonsEl,
			}}
			PaperProps={{
				sx: { height: "70%", width: "50%", minWidth: '50%', minHeight: '70%' },
			}}
			onClose={() => dispatch(setShowTableColumnsPopup(false))}
		>
			<Table
				columns={
					<>
						<TableColumn >
							<Label style={{ fontWeight: "bold" }}>Column Name</Label>
						</TableColumn>
						<TableColumn style={{ width: displayWidth }}>
							<Label style={{ fontWeight: "bold" }}>Display</Label>
						</TableColumn>
						<TableColumn style={{ width: actionWidth }}>
							<Label style={{ fontWeight: "bold" }}>Action</Label>
						</TableColumn>
					</>
				}
				hideNoData
			></Table>
			{customColumns && customColumns?.length ? (
				<TableColumnCard
					label="Custom Columns"
					columns={customColumns}
					isCustom={true}
					handleAddnew={(e) => { addCustomColumn(e) }}
					handleDelete={(index) => { handleDelete(index) }}
				/>
			) : null}
			{standardColumns && standardColumns?.length ? (
				<TableColumnCard
					label="Standard Columns"
					columns={standardColumns}
					handleAddnew={(e) => { addCustomColumn(e) }}
					handleDelete={(index) => { handleDelete(index) }}
				/>
			) : null}
			{showAddColumnPane && (
				<CustomColumns listdata={tableColumns} close={(value) => { setShowAddColumnPane(value) }} submit={(data) => { submitCustomColumn(data) }} />
			)}
		</SmartDialog>
	);
};

export default ManageTableColumns;