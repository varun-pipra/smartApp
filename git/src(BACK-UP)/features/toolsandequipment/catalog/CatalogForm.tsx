import React, { useState, FC } from "react";
import ReactDOM from "react-dom";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import ConstructionIcon from "@mui/icons-material/Construction";
import CategoryIcon from "@mui/icons-material/Category";
import MenuItem from "@mui/material/MenuItem";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ApartmentIcon from "@mui/icons-material/Apartment";

import SmartDialog from "components/smartdialog/SmartDialog";
import logo from "../../../resources/images/DrillingMachine.png";
import "./CatalogForm.scss";

const title = <>Tools and Equipment - Catalog</>;

export interface ICatalogFom {
	open: boolean;
	onClose: () => void;
	openInventoryForm?: () => void;
}

const CatalogForm: FC<ICatalogFom> = ({ open, onClose, openInventoryForm }) => {
	const [openDialog, closeDialog] = useState(open);
	const [focusInput, setFocusInput] = useState({
		modelName: false,
		modelNumber: false,
	});
	const [state, setState] = useState({
		modelName: "",
		modelNumber: "",
		description: "",
		manufacturer: "",
		category: "",
		subCategory: "",
		supplementalApp: "",
		specifications: "",
		inspectionApp: "",
	});
	const [alignment, setAlignment] = React.useState("Tool");

	const handleFocus = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
		value: boolean
	) => {
		if (e.target.name == "modelName") {
			setFocusInput({
				...focusInput,
				modelName: value,
			});
		}
		if (e.target.name == "modelNumber") {
			setFocusInput({
				...focusInput,
				modelNumber: value,
			});
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		
		const { name, value } = e.currentTarget;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleChange = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: string
	) => {
		setAlignment(newAlignment);
	};

	const Form = (
		<React.Fragment>
			<SmartDialog
				className='catalog-form'
				open={openDialog}
				PaperProps={{
					sx: { height: "90%", width: "80%" },
				}}
				custom={{
					closable: true,
					title: title,
				}}
				onClose={onClose}
			>
				<Grid container spacing={0} className="grid_margin">
					<Grid item md={2} className="image_section">
						<div className="img-border">
							<img
								src={logo}
								alt="logo"
								width={130}
								height={130}
								className="img_padding"
							/>
						</div>
					</Grid>
					<Grid item md={10} className="form_section">
						<Grid container spacing={2} className="model_grid_margin">
							<Grid item md={6}>
								<div>
									<TextField
										required
										id="standard-basic"
										label="Model Name"
										type="text"
										variant="standard"
										name="modelName"
										value={state.modelName}
										onChange={handleInputChange}
										className={`form_field ${state.modelName !== ""
												? ""
												: !focusInput.modelName
													? "input_label_margin"
													: ""
											}`}
										onFocus={(e) => handleFocus(e, true)}
										onBlur={(e) => handleFocus(e, false)}
										InputLabelProps={{
											shrink:
												state.modelName !== "" ? true : focusInput.modelName,
										}}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<PlumbingIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
									/>
								</div>
							</Grid>
							<Grid item md={6}>
								<div>
									<TextField
										required
										id="standard-basic"
										label="Model Number"
										type="text"
										variant="standard"
										name="modelNumber"
										value={state.modelNumber}
										onChange={handleInputChange}
										className={`form_field ${state.modelNumber !== ""
												? ""
												: !focusInput.modelNumber
													? "input_label_margin"
													: ""
											}`}
										onFocus={(e) => handleFocus(e, true)}
										onBlur={(e) => handleFocus(e, false)}
										InputLabelProps={{
											shrink:
												state.modelNumber !== ""
													? true
													: focusInput.modelNumber,
										}}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<PlumbingIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
									/>
								</div>
							</Grid>
						</Grid>
						<Grid container spacing={2} className="grid_margin">
							<Grid item md={12}>
								<div>
									<InputLabel className="font-size font_bottom_margin">
										Description
									</InputLabel>
									<TextareaAutosize
										aria-label="minimum height"
										minRows={2}
										style={{ width: "100%" }}
									/>{" "}
								</div>
							</Grid>
						</Grid>
						<Grid container spacing={2} className="grid_margin">
							<Grid item md={6}>
								<div>
									<InputLabel className="font-size font_bottom_margin">
										Select Type<span className="theme_colour">*</span>
									</InputLabel>
									<ToggleButtonGroup
										color="primary"
										value={alignment}
										exclusive
										onChange={handleChange}
										className="select_type_height"
									>
										<ToggleButton value="Tool">
											<PlumbingIcon fontSize="small" />
										</ToggleButton>
										<ToggleButton value="Equipment">
											<ConstructionIcon fontSize="small" />
										</ToggleButton>
									</ToggleButtonGroup>
									<span className="span_margin">{alignment}</span>
								</div>
							</Grid>
							<Grid item md={6}>
								<div>
									<TextField
										fullWidth
										id="standard-basic"
										select
										label="Manufacturer"
										name="manufacturer"
										value={state.manufacturer}
										onChange={handleInputChange}
										variant="standard"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<ApartmentIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
										SelectProps={{ displayEmpty: true }}
									>
										<MenuItem value={""}>Select</MenuItem>
										{/* {manufacturer.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
									</TextField>
								</div>
							</Grid>
						</Grid>
						<Grid container spacing={2} className="grid_margin">
							<Grid item md={6}>
								<div>
									<TextField
										required
										fullWidth
										id="standard-basic"
										select
										label="Category"
										name="category"
										value={state.category}
										onChange={handleInputChange}
										variant="standard"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<CategoryIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
										SelectProps={{ displayEmpty: true }}
									>
										<MenuItem value={""}>Select</MenuItem>
										{/* {category.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
									</TextField>
								</div>
							</Grid>
							<Grid item md={6}>
								<div>
									<TextField
										required
										fullWidth
										id="standard-basic"
										select
										label="Sub Category"
										name="subCategory"
										value={state.subCategory}
										onChange={handleInputChange}
										variant="standard"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<CategoryIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
										SelectProps={{ displayEmpty: true }}
									>
										<MenuItem value={""}>Select</MenuItem>
										{/* {subCategory.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
									</TextField>
								</div>
							</Grid>
						</Grid>
						<Grid container spacing={2} className="grid_margin">
							<Grid item md={6}>
								<div>
									<TextField
										required
										fullWidth
										id="standard-basic"
										select
										label="Supplemental App"
										name="supplementalApp"
										value={state.supplementalApp}
										onChange={handleInputChange}
										variant="standard"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<PlumbingIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
										SelectProps={{ displayEmpty: true }}
									>
										<MenuItem value={""}>Select</MenuItem>
										{/* {supplementalApp.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
									</TextField>
								</div>
							</Grid>
							<Grid item md={6}>
								<div>
									<TextField
										fullWidth
										id="standard-basic"
										label="Specifications"
										name="specifications"
										value={state.specifications}
										onChange={handleInputChange}
										variant="standard"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<UploadFileIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
									></TextField>
								</div>
							</Grid>
						</Grid>
						<Grid container spacing={2} className="grid_margin">
							<Grid item md={6}>
								<div>
									<TextField
										required
										fullWidth
										id="standard-basic"
										select
										label="Inspection App"
										name="inspectionApp"
										value={state.inspectionApp}
										onChange={handleInputChange}
										variant="standard"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<PlumbingIcon fontSize="small" color="warning" />
												</InputAdornment>
											),
										}}
										SelectProps={{ displayEmpty: true }}
									>
										<MenuItem value={""}>Select</MenuItem>
										{/* {inspectionApp.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} */}
									</TextField>
								</div>
							</Grid>
						</Grid>
						<Grid container>
							<Grid item md={12}>
								<div className="button-container">
									<button
										className="add-inventory-button"
										onClick={openInventoryForm}
									>
										ADD INVENTORY
									</button>
									<button className="save-catalog-button">SAVE CATALOG</button>
								</div>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</SmartDialog>
		</React.Fragment>
	);

	return openDialog ? ReactDOM.createPortal(Form, document.body) : null;
};

export default CatalogForm;
