import React from "react";
import './CustomColumns.scss';
import { Button, Label, Table, TableColumn } from "@ui5/webcomponents-react";
import { KeyboardAlt } from '@mui/icons-material';
import { Box, Button as MuiButton, Drawer, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Add, Close, GridView, Remove } from "@mui/icons-material";

import ToggleField from "components/togglefield/ToggleField";
import IQTooltip from "components/iqtooltip/IQTooltip";
import SmartDropDown from "components/smartDropdown";
import globalStyles, { primaryIconSize } from "features/budgetmanager/BudgetManagerGlobalStyles";
import SUIDrawer from "sui-components/Drawer/Drawer";

import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import DescriptionIcon from '@mui/icons-material/Description';
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';


type OperationButtonProps = {
	icon: any; isActive?: boolean; onClick: () => any;
};

const OperationButton = ({ icon, onClick, isActive = false }: OperationButtonProps) => {

	const style: any = {};
	if (isActive) {
		style.color = "#0590cd";
		style["&:hover"] = {
			backgroundColor: 'none',
		};
	}

	return (
		<IconButton
			sx={{
				...style,
				padding: "2px 4px 2px 4px",

			}}
			onClick={onClick}
		>
			{icon}
		</IconButton>
	);
};


export interface addnewprops {
	listdata: any;
	close(value: any): void;
	submit(value: any): void
}

const CustomColumns = ({ listdata, close, submit }: addnewprops) => {
	const initialState = {
		name: "",
		column1: "",
		column2: "",
		operation: "+",
		enableToggle: true,
		enabled: false,
	};

	const [customColumn, setCustomColumn] = React.useState<any>(initialState);

	const [val, setVal] = React.useState<any>(false);

	const addCustomColumnData = () => {
		submit(customColumn);
		setCustomColumn({ ...initialState });
	}

	const handleInputChange = (key: string, value: string | boolean): void => {
		const data = { ...customColumn, [key]: value };
		setCustomColumn(data);
	};
	var columnsList: any = [];

	if (listdata) {
		Object.values(listdata).forEach((value: any) => {
			value.forEach((v: any) => {
				columnsList.push({ label: v.name, value: v.name });
			});
		});
	}

	const isDisabledAddColumnBtn: boolean = customColumn.name === "" || customColumn.column1 === "" || customColumn.column2 === "";

	const getcolumnslist = () => {
		return [
			{ text: `Budger ID`, value: 'Budger ID', },
			{ text: `Division/Cost Code`, value: 'Division/Cost Code', },
			{ text: `Cost Type`, value: 'Cost Type', },
			{ text: `Original Budget Amount`, value: 'Budger ID', },
			{ text: `Budget Modification`, value: 'Division/Cost Code', },
			{ text: `Approved COs`, value: 'Cost Type', },
		];
	};

	return (

		<SUIDrawer
			PaperProps={{ style: { position: "absolute" } }}
			anchor="right"
			variant="permanent"
			elevation={8}
			open={false}
		>
			<Box sx={{ width: "30vw", height: "100%" }} className="custom-calculated-window" p={3} role="presentation">
				<Stack
					direction="row"
					justifyContent={"space-between"}
					alignItems="center"
					style={{ height: "42px" }}
				>
					<Typography fontWeight={600}>New Custom Calculated Column</Typography>
					<Stack direction="row" sx={{ justifyContent: "end" }}>
						<IQTooltip title="Close" placement={"bottom"}>
							<IconButton
								aria-label="Close Right Pane"
								onClick={() => close(false)}
							>
								<Close />
							</IconButton>
						</IQTooltip>
					</Stack>
				</Stack>
				<Box mt={4}>
					<TextField
						required
						fullWidth
						label="Column Name"
						variant="standard"
						value={customColumn.name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleInputChange("name", e.target.value)
						}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<GridView fontSize="small" style={{ color: globalStyles.primaryColor }} />
								</InputAdornment>
							),
						}}
						sx={{
							'& .MuiFormLabel-asterisk': {
								color: 'red'
							}
						}}
					/>
					<Box mt={4}>
						<Typography className="head-title">Define Your Column Calculated Equation</Typography>
						<Stack direction={"column"} mt={1} className='columnCalculated'>
							<Stack direction={"row"} mt={1} className='buttontab-section'>
								<IconMenu
									options={getcolumnslist()}
									//onChange={handleSettings}
									menuProps={{
										open: true,
										placement: 'bottom-start',
										sx: {
											width: 'fit-content',
											lineheight: '1.5',

											fontSize: '18px !important',
											'& .MuiListItem-root': {
												height: '2.5em !important',
											},
											'& .css-1jxx3va-MuiTypography-root': {
												fontSize: '0.96rem !important',
												color: '#333 !important',
											}
										}
									}}
									buttonProps={{
										className: 'preview-button',
										startIcon: <CalendarViewWeekIcon style={{ fontSize: '20px', color: '#5b5b5b' }} />,
										// <Stack component='img' alt='Views' src={EyeIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)' }} />,
										disableRipple: true
									}}
								/>
								{/* <OperationButton
									// icon={<Add />}
									icon={<CalendarViewWeekIcon />}
									onClick={() => handleInputChange("operation", "+")}
									isActive={customColumn.operation === "+"}
								/> */}
								<OperationButton
									icon={<Remove />}
									onClick={() => handleInputChange("operation", "-")}
									isActive={customColumn.operation === "-"}
								/>
								<OperationButton
									icon={<AppRegistrationIcon />}
									onClick={() => handleInputChange("operation", "*")}
									isActive={customColumn.operation === "*"}
								/>
								<OperationButton
									icon={<UndoIcon />}
									onClick={() => handleInputChange("operation", "/")}
									isActive={customColumn.operation === "/"}
								/>
								<OperationButton
									icon={<RedoIcon />}
									onClick={() => handleInputChange("operation", "%")}
									isActive={customColumn.operation === "%"}
								/>
								<OperationButton
									icon={<DescriptionIcon />}
									onClick={() => handleInputChange("operation", "=")}
									isActive={customColumn.operation === "="}
								/>
							</Stack>
							<Stack direction={"row"} className='formula-section'>

							</Stack>
						</Stack>
					</Box>
					<Box mt={4} textAlign="right">
						<MuiButton
							variant="contained"
							className='add-btn'							
							disabled={isDisabledAddColumnBtn}
							onClick={() => addCustomColumnData()}
						>
							ADD
						</MuiButton>
					</Box>
				</Box>
			</Box>
		</SUIDrawer>
	)
};

export default CustomColumns;