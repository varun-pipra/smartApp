import React, { FC } from "react";
import {
	Typography,
	InputLabel,
	TextField,
	InputAdornment,
	MenuItem,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import MUIGrid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import MUIButton from "@mui/material/Button";

interface textFieldReadonlyProps {
	unitofMeasure: boolean;
	quantity: any;
	cost: any;
}
interface BasicPopoverProps {
	onSubmit?: (value: any) => void;
	unitList?: any;
	clearCalculator?: boolean;
	openCalculator?: any;
	closeCalculator?: any;
	calculatorTitle?: any;
	textFieldReadonly?: textFieldReadonlyProps;
	data?: any,
	hideCalculateButton?: boolean;
}
const readonlydata = {
	unitofMeasure: false,
	quantity: false,
	cost: false
}
export const SUICalculator: FC<BasicPopoverProps> = ({
	onSubmit,
	unitList,
	clearCalculator,
	openCalculator,
	closeCalculator,
	calculatorTitle,
	data,
	hideCalculateButton = false,
	textFieldReadonly = { ...readonlydata }
}) => {
	const [unitOfMeasure, setUnitOfMeasure] = React.useState<string>("");
	const [quantity, setQuantity] = React.useState<string>("");
	const [cost, setCost] = React.useState<string>("");
	const [button, setButton] = React.useState(true);
	const open = Boolean(openCalculator);
	const id = open ? "simple-calculator" : undefined;


	React.useEffect(() => {
		if (data) {
			setUnitOfMeasure(data.unitOfMeasure);
			setQuantity(data.quantity);
			setCost(data.cost);
		}
	}, [data])

	const handleDropdownChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setUnitOfMeasure(e.target.value);
	};

	React.useEffect(() => {
		if (clearCalculator) {
			setUnitOfMeasure("");
			setQuantity("");
			setCost("");
		}
	}, [clearCalculator]);

	const handleQuantityChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setQuantity(e.target.value);
	};

	const handleCalculate = () => {
		const c = parseInt(cost);
		const q = parseInt(quantity);
		const amount = c * q;
		if (onSubmit)
			onSubmit({
				unitOfMeasure: unitOfMeasure,
				quantity: quantity,
				cost: cost,
				amount: amount,
			});
		closeCalculator("test");
	};

	const handleCostChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | any>
	) => {
		setCost(e.target.value);
	};

	React.useEffect(() => {
		if (unitOfMeasure && quantity && cost) {
			setButton(false);
		} else {
			setButton(true);
		}
	}, [unitOfMeasure, quantity, cost]);

	return (
		<div className="calculator">
			<Popover
				id={id}
				open={open}
				anchorEl={openCalculator}
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
						width: "500px",
						zIndex: "108px",
						marginTop: "10px",
					},
				}}
			>
				<MUIGrid
					container
					justifyContent="space-between"
					className="orginalbudgetheader"
				>
					<MUIGrid item sm={6}>
						<Typography variant="h6" className="heading">
							{calculatorTitle}
						</Typography>
					</MUIGrid>
					<MUIGrid item sm={6}>
						<div onClick={closeCalculator} className="popper-close-button">
							<CloseIcon fontSize="medium" style={{ cursor: "pointer" }} />
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
										<div
											className="common-icon-Budgetcalculator"
											style={{ fontSize: "1.25rem" }}
										></div>
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
											<div
												className="common-icon-Budgetcalculator"
												style={{ fontSize: "1.25rem" }}
											></div>
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
								value={cost}
								onChange={(e) => handleCostChange(e)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											{/* <GridViewIcon style={{ color: iconColor ? iconColor : 'gray' }} fontSize={primaryIconSize} /> */}
											<div
												className="common-icon-Budgetcalculator"
												style={{ fontSize: "1.25rem" }}
											></div>
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
		</div>
	);
};

export default SUICalculator;
