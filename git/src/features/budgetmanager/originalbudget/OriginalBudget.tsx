import React, { FC } from "react";

import { Box, Typography, InputLabel, TextField, InputAdornment, MenuItem } from "@mui/material";
import Popover from "@mui/material/Popover";
import MUIGrid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import GridViewIcon from "@mui/icons-material/GridView";
import MUIButton from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalculateIcon from "@mui/icons-material/Calculate";
import "./OriginalBudget.scss";
import globalStyles, { primaryIconSize } from "../BudgetManagerGlobalStyles";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
interface PopoverOrigin {
	vertical: "top" | "center" | "bottom" | number;
	horizontal: "left" | "center" | "right" | number;
}

interface BasicPopoverProps {
	iconColor?: string;
	defaultValue?: string;
	onSubmit?: (value: any) => void;
	unitList?: [];
	sx?: any
	clearBudgetFields?: boolean;
}

export const OriginalBudgetCalculator: FC<BasicPopoverProps> = ({ iconColor, onSubmit, defaultValue, unitList, sx, clearBudgetFields }) => {
	// console.log("defaultValuedefaultValue", defaultValue)
	const [unitOfMeasure, setUnitOfMeasure] = React.useState<string>("");
	const [quantity, setQuantity] = React.useState<string>("");
	const [cost, setCost] = React.useState<string>("");
	const [budgetCost, setBudgetCost] = React.useState(defaultValue);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
	const [button, setButton] = React.useState(true)
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);

	const handleDropdownChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setUnitOfMeasure(e.target.value);
	};

	React.useEffect(() => {
		if (clearBudgetFields) {
			setUnitOfMeasure("");
			setQuantity('');
			setCost('');
		}
	}, [clearBudgetFields])

	React.useEffect(() => { setBudgetCost(defaultValue) }, [defaultValue])

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setQuantity(e.target.value);
	};

	const handleCalculate = () => {
		const c = parseInt(cost);
		const q = parseInt(quantity);
		const amount = c * q;
		setBudgetCost(amount.toString());
		if (onSubmit) onSubmit({
			unitOfMeasure: unitOfMeasure,
			quantity: quantity,
			cost: cost,
			amount: amount
		})
		setAnchorEl(null);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
		setCost(e.target.value);
	};

	const handleOriginalBudgetChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setUnitOfMeasure('');
		setQuantity('');
		setCost('');
		setBudgetCost(Number(e.target.value.replace(/\,/g, ''))?.toLocaleString('en-US'));
		if (onSubmit) onSubmit({
			unitOfMeasure: unitOfMeasure,
			quantity: quantity,
			cost: cost,
			amount: Number(e.target.value.replace(/\,/g, ''))?.toLocaleString('en-US'),
		});

	};

	const handleOpenBudgetCalculator = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	React.useEffect(() => {
		if (unitOfMeasure && quantity && cost) {
			// console.log('if')
			setButton(false);
		}
		else {
			// console.log('else')
			setButton(true);
		}
	}, [unitOfMeasure, quantity, cost]);

	return (
		<div className='originalbudget'>
			<InputLabel className="inputlabel">Original Budget<span className="required_color">*</span></InputLabel>
			<TextField
				className="custome-label"
				required
				id="standard-basic"
				type="text"
				variant="standard"
				name="budgetCost"
				value={budgetCost}
				onChange={(e) => handleOriginalBudgetChange(e)}
				onClick={(e) => e.detail === 2 && handleOpenBudgetCalculator(e)}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<MUIButton
								onClick={(e) => handleOpenBudgetCalculator(e)}
								className="custom-budget-icon-cuttons"
							>
								{/* <CalculateIcon fontSize={primaryIconSize} style={{  }} /> */}
								<div className='common-icon-Cost' style={{ fontSize: '1.25rem' }}></div>
							</MUIButton>
							<span style={{ color: '#333333' }}>{currencySymbol}</span>
						</InputAdornment>
					),
				}}
				sx={sx}
			/>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={close}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				PaperProps={{
					style: {
						backgroundColor: "white",
						borderRadius: 5,
						width: "609px",
						zIndex: "108px",
						marginTop: "10px",
					},
				}}
			>
				<MUIGrid container justifyContent="space-between" className="orginalbudgetheader">
					<MUIGrid item sm={6}>
						<Typography variant="h6" className="heading">
							Budget Calculator
						</Typography>
					</MUIGrid>
					<MUIGrid item sm={6}>
						<div onClick={handleClose} className="popper-close-button">
							<CloseIcon fontSize="medium" style={{ cursor: 'pointer' }} />
						</div>
					</MUIGrid>
				</MUIGrid>
				<MUIGrid
					container
					justifyContent="space-between"
					className="activity-content"
				>
					<MUIGrid item sm={3}>
						<InputLabel className="inputlabel">Unit of Measure</InputLabel>
						<TextField
							required
							fullWidth
							id="standard-basic"
							select
							name="category"
							value={unitOfMeasure}
							onChange={(e) => handleDropdownChange(e)}
							variant="standard"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										{/* <GridViewIcon fontSize={primaryIconSize} style={{ color: iconColor ? iconColor : 'gray' }} /> */}
										<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
									</InputAdornment>
								),
							}}
							SelectProps={{ displayEmpty: true }}
						>
							<MenuItem value={""}>Select</MenuItem>
							{unitList?.map((option: any) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</MUIGrid>
					<MUIGrid item sm={3}>
						<div className="grid-content-margin">
							<InputLabel className="inputlabel">Unit Quantity</InputLabel>
							<TextField
								required
								id="standard-basic"
								type="text"
								variant="standard"
								name="cost"
								value={quantity}
								onChange={(e) => handleQuantityChange(e)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											{/* <GridViewIcon style={{ color: iconColor ? iconColor : 'gray' }} fontSize={primaryIconSize} /> */}
											<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
										</InputAdornment>
									),
								}}
							/>
						</div>
					</MUIGrid>
					<MUIGrid item sm={3}>
						<div className="grid-content-margin">
							<InputLabel className="inputlabel">Unit Cost</InputLabel>
							<TextField
								required
								id="standard-basic"
								type="text"
								variant="standard"
								name="cost"
								value={cost}
								onChange={(e) => handleCostChange(e)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											{/* <GridViewIcon style={{ color: iconColor ? iconColor : 'gray' }} fontSize={primaryIconSize} /> */}
											<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
										</InputAdornment>
									),
								}}
							/>
						</div>
					</MUIGrid>
					<MUIGrid item sm={3}>
						<div className="popper-button-container">
							<MUIButton
								onClick={handleCalculate}
								variant="outlined"
								className="custome-button"
								disabled={button}
							>
								Calculate
							</MUIButton>
						</div>
					</MUIGrid>
				</MUIGrid>
			</Popover>
		</div>
	);
};

export default OriginalBudgetCalculator;
