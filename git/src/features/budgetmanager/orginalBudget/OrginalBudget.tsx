import React, { FC } from "react";

import { Box, Typography, InputLabel, TextField, InputAdornment, MenuItem } from "@mui/material";

import Popover from "@mui/material/Popover";
import MUIGrid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import GridViewIcon from "@mui/icons-material/GridView";
import MUIButton from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalculateIcon from "@mui/icons-material/Calculate";
import "./OrginalBudget.scss";
import globalStyles, { primaryIconSize } from "../BudgetManagerGlobalStyles";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import Calculator from "resources/images/common/Calculator.svg"
import { amountFormatWithOutSymbol } from 'app/common/userLoginUtils';

interface PopoverOrigin {
	vertical: "top" | "center" | "bottom" | number;
	horizontal: "left" | "center" | "right" | number;
}
interface textFieldReadonlyProps {
	unitofMeasure: boolean;
	quantity: any;
	cost: any;
}
interface BasicPopoverProps {
	iconColor?: string;
	label?: any;
	isRequired?: any;
	isIcon?: any;
	defaultValue?: string;
	onSubmit?: (value: any) => void;
	unitList?: [];
	sx?: any
	clearBudgetFields?: boolean;
	readOnly?: boolean;
	disabled?: boolean
	data?: any;
	onBlur?: (value: any) => void;
	disableUnderline?: boolean;
	textFieldReadonly?: textFieldReadonlyProps;
	hideCalculateButton?: boolean;
	cleartheValue?: boolean;
	placeholder?: string;
}
const readonlydata = {
	unitofMeasure: false,
	quantity: false,
	cost: false
}
export const OriginalBudgetPopover: FC<BasicPopoverProps> = ({
	iconColor, onSubmit, defaultValue, unitList, sx, clearBudgetFields,
	label = "Original Budget", isRequired = true, isIcon = true, disabled = false, readOnly = false, cleartheValue = true,
	data, onBlur, hideCalculateButton = false, disableUnderline = false, textFieldReadonly = { ...readonlydata }, placeholder = '', ...rest }) => {
	// console.log("defaultValuedefaultValue", defaultValue)
	const [unitOfMeasure, setUnitOfMeasure] = React.useState<any>("");
	const [quantity, setQuantity] = React.useState<any>("");
	const [cost, setCost] = React.useState<any>("");
	const [budgetCost, setBudgetCost] = React.useState(defaultValue);
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
	const [button, setButton] = React.useState(true)
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [option, setOptions] = React.useState([]);
	const handleDropdownChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {

		setUnitOfMeasure(e.target.value);
	};
	React.useEffect(() => {
		if (unitList) {
			setOptions([...unitList])
		}
	}, [unitList])
	React.useEffect(() => {
		if (clearBudgetFields) {
			setUnitOfMeasure("");
			setQuantity('');
			setCost('');
		}
	}, [clearBudgetFields])
	React.useEffect(() => {
		if (data) {
			setUnitOfMeasure(data.unitOfMeasure);
			setQuantity(data.quantity);
			setCost(data?.cost);
		}
	}, [data])
	React.useEffect(() => {
		setBudgetCost(defaultValue)
	}, [defaultValue])

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = e.target.value.replace(/\D/g, "");
		const data = Number(value.replace(/\,/g, ''))?.toLocaleString('en-US');
		setQuantity(data);
	};
	function decimalmultiply(a: any, b: any) {
		return parseFloat((a * b).toFixed(12));
	}
	const handleCalculate = () => {
		let c: any;
		let q: any;
		if (isNaN(cost)) { c = cost.replace(/,/g, ""); }
		else { c = cost }
		if (isNaN(quantity)) { q = quantity.replace(/,/g, ""); }
		else { q = quantity }
		const amount = decimalmultiply(c, q);
		setBudgetCost(amountFormatWithOutSymbol(amount));
		if (onSubmit) onSubmit({
			unitOfMeasure: unitOfMeasure,
			quantity: q,
			cost: c,
			amount: amount
		})
		setAnchorEl(null);
	};

	const handleonblur = (e: any) => {

		const data = {
			unitOfMeasure: unitOfMeasure,
			quantity: quantity,
			cost: cost,
			amount: e.target.value,
		}
		if (onBlur) onBlur({
			unitOfMeasure: unitOfMeasure,
			quantity: quantity,
			cost: cost,
			amount: e.target.value !== '' ? Number(e.target.value.replace(/\,/g, ''))?.toLocaleString('en-US') : e.target.value,
		});
	}

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>) => {
		const value = e.target.value.replace(/\D/g, "");
		const data = Number(value.replace(/\,/g, ''))?.toLocaleString('en-US');
		setCost(data);
	};

	const handleOriginalBudgetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (cleartheValue) {
			setUnitOfMeasure('');
			setQuantity('');
			setCost('');
		}
		if (e.target.value !== '') {
			const value = e.target.value.replace(/\D/g, "");
			setBudgetCost(Number(value.replace(/\,/g, ''))?.toLocaleString('en-US'))
		}
		else {
			setBudgetCost('');
		}

	};

	const handleOpenBudgetCalculator = (event: any) => {
		setAnchorEl(event.currentTarget);
	};
	const handleOnClickOrginalBudget = (e: any) => {
		if (e.detail === 2 && readOnly == false) {
			handleOpenBudgetCalculator(e)
		}
		else if (e.detail === 1 && readOnly == true) {
			handleOpenBudgetCalculator(e)
		}
	}
	React.useEffect(() => {
		if (unitOfMeasure && quantity && cost) {
			/* Remove comma from String values*/
			let convertQty = quantity
			let convertCost = cost
			if (typeof convertQty === 'string') {
				convertQty = convertQty?.replace(/,/g, "");
			};
			if (typeof convertCost === 'string') {
				convertCost = convertCost?.replace(/,/g, "")
			};
			if (Number(convertQty) > 0 && Number(convertCost) > 0) setButton(false);
			else setButton(true);
		}
		else {
			setButton(true);
		}
	}, [unitOfMeasure, quantity, cost]);

	function NumberWithCommas(number: any) {
		if (number) {
			const formattedNumber = number.toLocaleString();
			return formattedNumber
		}
	}

	return (
		<div className='originalbudget'>
			{label != '' ? <InputLabel className="inputlabel">{label}<span className={isRequired ? 'required_color' : ''}>*</span></InputLabel> : ''}
			<TextField
				className="custome-label"
				required
				id="standard-basic"
				type="text"
				variant="standard"
				name="budgetCost"
				value={amountFormatWithOutSymbol(budgetCost)}
				disabled={disabled}
				placeholder={placeholder}
				onChange={(e) => handleOriginalBudgetChange(e)}
				onClick={(e) => handleOnClickOrginalBudget(e)}
				onBlur={(value) => { handleonblur(value) }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<MUIButton
								onClick={(e) => handleOpenBudgetCalculator(e)}
								className="custom-budget-icon-cuttons" disabled={disabled}
							>
								{/* <CalculateIcon fontSize={primaryIconSize} style={{  }} /> */}
								{/* <div className='budget-Cost' style={{ fontSize: '1.25rem' }}></div> */}
								{isIcon ? <Box component='img' alt='New View' src={Calculator} className='image' width={25} height={25} color={'#666666'} /> : ''}
							</MUIButton>
							<span style={{ color: '#333333' }}>{currencySymbol}</span>
						</InputAdornment>
					),
					readOnly: readOnly,
					disableUnderline: disableUnderline,
					style: { textAlign: 'center' }
				}}
				sx={sx}
				{...rest}
			/>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
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
							select={!textFieldReadonly?.unitofMeasure}
							name="category"
							value={unitOfMeasure}
							onChange={(e) => handleDropdownChange(e)}
							variant="standard"
							//disabled={readOnly}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										{/* <GridViewIcon fontSize={primaryIconSize} style={{ color: iconColor ? iconColor : 'gray' }} /> */}
										<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
									</InputAdornment>
								),
								readOnly: textFieldReadonly.unitofMeasure,
								disableUnderline: textFieldReadonly.unitofMeasure,
							}}
							SelectProps={{ displayEmpty: true }}
							sx={{
								'.MuiSvgIcon-root': {
									display: textFieldReadonly.unitofMeasure ? 'none' : 'initial'
								}
							}}
						>
							<MenuItem value={""}>Select</MenuItem>
							{option?.map((option: any) => (
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
								disabled={disabled}
								name="cost"
								value={NumberWithCommas(quantity)}
								onChange={(e) => handleQuantityChange(e)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											{/* <GridViewIcon style={{ color: iconColor ? iconColor : 'gray' }} fontSize={primaryIconSize} /> */}
											<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
										</InputAdornment>
									),
									readOnly: textFieldReadonly.quantity,
									disableUnderline: textFieldReadonly.quantity,
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
								disabled={disabled}
								value={NumberWithCommas(cost)}
								onChange={(e) => handleCostChange(e)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											{/* <GridViewIcon style={{ color: iconColor ? iconColor : 'gray' }} fontSize={primaryIconSize} /> */}
											<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>

										</InputAdornment>
									),
									readOnly: textFieldReadonly.cost,
									disableUnderline: textFieldReadonly.cost,
								}}
							/>
						</div>
					</MUIGrid>
					{!hideCalculateButton &&
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
					}
				</MUIGrid>
			</Popover>
		</div >
	);
};

export default OriginalBudgetPopover;
