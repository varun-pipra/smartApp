import React from "react";
import {
	Box,
	InputLabel,
	TextField,
	Button,
} from "@mui/material";
import "./SafetyViolationForm.scss";
import CloseIcon from "@mui/icons-material/Close";
import SmartDropDown from "components/smartDropdown";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { makeStyles, createStyles } from "@mui/styles";
import { useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import { addSafetyViolation } from "features/projectsettings/projectteam/operations/ptGridAPI";
import { isLocalhost } from "app/utils";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { formatDate } from "utilities/datetime/DateTimeUtils";
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			//maxWidth: "160px !important",
			//minWidth: "fit-content !important",
		},
	})
);
const defaultFormData = {
	category: "",
	type: "",
	description: "",
	date: '',
};
const SafetyViolationForm = (props: any) => {
	const [localhost] = React.useState(isLocalhost);
	let SafetyViolationCategoryOptions = [
		{
			"id": 2241,
			"listId": 73,
			"value": "Critical",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 1,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2242,
			"listId": 73,
			"value": "Fatality",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2243,
			"listId": 73,
			"value": "Marginal",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 3,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2244,
			"listId": 73,
			"value": "Near-miss",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 4,
			"listValues": null,
			"isSystem": true
		}
	];
	let SafetyViolationTypeOptions = [
		{
			"id": 2245,
			"listId": 74,
			"value": "Behaviour",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 1,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2246,
			"listId": 74,
			"value": "Equipment",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2247,
			"listId": 74,
			"value": "No PPE",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 3,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2248,
			"listId": 74,
			"value": "Harassment",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 4,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2249,
			"listId": 74,
			"value": "Violent",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 5,
			"listValues": null,
			"isSystem": true
		},
		{
			"id": 2250,
			"listId": 74,
			"value": "Not Following Safety Protocols",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 6,
			"listValues": null,
			"isSystem": true
		}
	];
	const { onClose, userData, ...others } = props;
	const classes = useStyles();
	const [formData, setFormData] = React.useState<any>(defaultFormData);
	const appInfo = useAppSelector(getServer);
	const [disabled, setDisabled] = React.useState(true);
	const [categoryOptions, setCategoryOptions] = React.useState<any>([]);
	const [typeOptions, setTypeOptions] = React.useState<any>([]);
	React.useEffect(() => {
		let catgryOpt = [], typeOpt = [];
		if (!localhost) {
			catgryOpt = appInfo?.ViolationList?.ViolationCategory;
			typeOpt = appInfo?.ViolationList?.ViolationType;
		} else {
			catgryOpt = SafetyViolationCategoryOptions;
			typeOpt = SafetyViolationTypeOptions;
		}
		catgryOpt = catgryOpt.map((item: any) =>
			Object.assign({}, item, { label: item.value })
		)
		typeOpt = typeOpt.map((item: any) =>
			Object.assign({}, item, { label: item.value })
		)
		setTypeOptions(typeOpt);
		setCategoryOptions(catgryOpt);
	}, [localhost, appInfo]);
	const handleChange = (value: any, name: any) => {
		const formDataClone = { ...formData, [name]: value };
		setFormData(formDataClone);
	};
	React.useEffect(() => {
		if (formData?.category !== "" &&
			formData?.type !== "" &&
			formData?.date !== "") {
			setDisabled(false);
		};
	}, [formData])
	const handleClose = () => {
		onClose(formData);
	};
	const handleAdd = (e: any) => {
		setDisabled(true);
		let categoryId = categoryOptions.find((item: any) => item.value === formData?.category)?.id;
		let typeId = typeOptions.find((item: any) => item.value === formData?.type)?.id;
		let formValues = {
			"category": {
				"id": categoryId,
				"name": formData?.category
			},
			"type": {
				"id": typeId,
				"name": formData?.type
			},
			// "violationDate": formData?.date && new Date(formData?.date).toLocaleDateString(),
			"violationDate": formData?.date && formatDate(formData?.date, { year: 'numeric', month: '2-digit', day: '2-digit' }),
			"reason": formData?.description,
			"createdBy": {
				"id": appInfo?.gblConfig?.user?.uniqueId
			},
			"modifiedBy": {
				"id": appInfo?.gblConfig?.user?.uniqueId
			}
		};
		let payload = {
			userUniqueId: userData?.id,
			data: formValues
		}
		console.log("Form Payload", payload);
		addSafetyViolation(appInfo, payload, (response: any) => {
			if (response?.ok === false) {
				setDisabled(false);
			} else {
				onClose(formData);
				setFormData(defaultFormData);
			};
		});
	};
	return (
		<Box className="safety-violation-container safety-violation-popup">
			<div className="popover-container">
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<InputLabel className="inputlabel header"
						style={{ fontWeight: "bold", fontSize: "16px", color: '#333' }}
					>
						Add Saftey Violation
					</InputLabel>
					<CloseIcon
						style={{
							verticalAlign: "top",
							cursor: "pointer",
							fontSize: "20px",
							color: '#333'
						}}
						onClick={handleClose}
					/>
				</div>
				<div className="fields-container">
					<div className="fields">
						<IQTooltip title={formData?.category ? formData?.category : ''}
							arrow={true}
							describeChild
							placement={"bottom-start"}>
							<SmartDropDown
								dropDownLabel="Violation Category"
								required
								LeftIcon={<span className="common-icon-warning-medal"> </span>}
								options={categoryOptions ?? []}
								outSideOfGrid={true}
								isSearchField={false}
								menuProps={classes.menuPaper}
								sx={{ fontSize: "18px" }}
								isFullWidth
								Placeholder={"Select"}
								isMultiple={false}
								selectedValue={formData?.category}
								handleChange={(value: any) =>
									handleChange(value[0], "category")
								}
							/>
						</IQTooltip>
					</div>
					<div className="fields">
						<IQTooltip title={formData?.type ? formData?.type : ''}
							arrow={true}
							describeChild
							placement={"bottom-start"}
						>
							<SmartDropDown
								dropDownLabel="Violation Type"
								required
								LeftIcon={<span className="common-icon-warning-medal"> </span>}
								options={typeOptions ?? []}
								outSideOfGrid={true}
								isSearchField={false}
								menuProps={classes.menuPaper}
								sx={{ fontSize: "18px" }}
								isFullWidth
								Placeholder={"Select"}
								isMultiple={false}
								selectedValue={formData?.type}
								handleChange={(value: any) => handleChange(value[0], "type")}
							/>
						</IQTooltip>
					</div>
					<div className="fields" style={{ marginTop: '4px' }}>
						<InputLabel required className="inputlabel">Violation Date</InputLabel>
						<DatePickerComponent
							defaultValue={formData?.date}
							onChange={(val: any) => handleChange(val, "date")}
							maxDate={new Date()}
							// minDate={new Date()}
							containerClassName={"iq-customdate-cont"}
							render={
								<InputIcon
									placeholder={"MM/DD/YYYY"}
									className={"custom-input rmdp-input"}
									style={{ background: "#f7f7f7" }}
								/>
							}
						/>
					</div>
				</div>
				<br></br>
				<InputLabel className="inputlabel">Reason</InputLabel>
				<div className='reason-textfield-cls'>
					<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
					<TextField
						name='description'
						value={formData?.description}
						onChange={(e: any) => handleChange(e.target.value, 'description')}
						style={{ width: "100%" }}
						placeholder="Enter Reason"
					/>
				</div>
				<div className="add-button-cls">
					<Button
						disabled={disabled}
						onClick={(e: any) => handleAdd(e)}>Add</Button>
				</div>
			</div>
		</Box >
	);
};

export default SafetyViolationForm;
