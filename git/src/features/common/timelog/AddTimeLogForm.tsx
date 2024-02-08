import React from 'react';
import { ChangeEvent, memo, useMemo, useState, useEffect } from "react";
import "./AddTimeLogForm.scss";
import { getServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQButton from "components/iqbutton/IQButton";
import SmartDropDown from "components/smartDropdown";
import _ from "lodash";
import {
	InputAdornment,
	InputLabel,
	TextField,
	TextFieldProps,
} from "@mui/material";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import TimeLogPicker from "sui-components/TimeLogPicker/TimeLogPicker";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import WorkerDailog from "./workerDailog/WorkerDailog";
import { makeStyles, createStyles } from "@mui/styles";
interface TimeLogFormProps {
	resource?: string;
	date?: any;
	time?: string;
	duration?: any;
	smartItems?: any;
}
const AddLinksData = [
	{
		"text": "New Smart Item",
		"value": "New Smart Item",
		"id": 1,
		"type": "Custom",
		iconCls: "common-icon-new-smart-item",
		children: []
	},
	{
		"text": "Existing Smart Items",
		"value": "Existing Smart Items",
		"id": 2,
		"type": "Custom",
		children: [],
		iconCls: "common-icon-existing-smart-items",
	}
];
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxWidth: "auto !important"
		},
		".user-menu-items": {
			border: 'none'
		}
	})
);
const AddTimeLogForm = (props: any) => {
	const dispatch = useAppDispatch();
	const classes = useStyles();
	const defaultValues: TimeLogFormProps = useMemo(() => {
		return {
			resource: "",
			date: "",
			time: "",
			duration: "0 Hrs 00 Mins",
			smartItems: "",
		};
	}, []);

	const fundingSourceOptions = [
		{ id: 1, label: "Change Order", value: "ChangeOrder" },
		{ id: 2, label: "Contingency", value: "Contingency" },
		{ id: 3, label: "General Contractor", value: "GeneralContractor" },
	];
	const resource = [
		{ id: 1, label: "Me", value: "Me" },
		{ id: 1, label: "Work Team", value: "workteam" },
	];
	const [timelog, setTimeLog] = useState<TimeLogFormProps>(defaultValues);
	const [isBudgetDisabled, setBudgetDisabled] = useState<boolean>(true);
	const [isAddDisabled, setAddDisabled] = useState<boolean>(true);
	const [contractOptions, setContractOptions] = useState<any>([]);
	const [resourceOptions, setResourceOptions] = useState<any>(resource);
	const [budgetsList, setBudgetsList] = useState<any>([]);
	const [disableOptionsList, setDisableOptionsList] = useState<any>([]);
	const [isDescExists, setIsDescExists] = useState(false);
	const [openWorkerDialog, setOpenWorkerDialog] = useState(false);
	const appInfo = useAppSelector(getServer);
	const [addLinksOptions, setAddLinksOptions] = React.useState<any>(AddLinksData);
	const { appsList } = useAppSelector(state => state.sbsManager);
	const [selectedSmartItem, setSelectedSmartItem] = React.useState("");
	const [selectedWorkers , setSelectedWorkers] = React.useState<Boolean>(false);

	useEffect(() => {
		const addLinksOptionsCopy = [...addLinksOptions];
		let newSmartItem = addLinksOptionsCopy.find((rec: any) => rec.value === "New Smart Item");
		let existingSmartItem = addLinksOptionsCopy.find((rec: any) => rec.value === "Existing Smart Items");

		const appsForNew = appsList?.map((obj: any) => {
			return {
				...obj,
				isNew: true,
				"text": obj?.name,
				"value": obj?.name,
				"id": obj?.id,
				icon: obj?.thumbnailUrl,
				"appid": obj?.objectId,
				"type": "Document"
			};
		});
		const appsForExisting = appsList?.map((obj: any) => {
			return {
				...obj,
				isNew: false,
				"text": obj?.name,
				"value": obj?.name,
				"id": obj?.id,
				icon: obj?.thumbnailUrl,
				"appid": obj?.objectId,
				"type": "Document"
			};
		});
		newSmartItem.children = appsForNew;
		existingSmartItem.children = appsForExisting;
		setAddLinksOptions(addLinksOptionsCopy);
	}, [appsList]);
	const handleFieldChange = (event: any, name: any) => {
		if(name === 'resource') setSelectedWorkers(event === "workteam" ? true : false)
		console.log("event", event);
		console.log("name", name);
		setTimeLog((currentState) => {
			const newState = { ...currentState, ...{ [name]: event } };
			console.log("newState", newState);
			checkFormValidity(newState);
			return newState;
		});
	};

	const checkFormValidity = (record: TimeLogFormProps) => {
		setAddDisabled(
			_.isEmpty(record?.resource) ||
			_.isEmpty(record?.date) ||
			_.isEmpty(record?.time)
		);
	};

	const handleAdd = () => {
		//
	};
	const handleMenu = (e: any, value: any) => {
		// let sendMsg = {
		// 	event: "common",
		// 	body: {
		// 		evt: "smartitemlink",
		// 		isNew: e.isNew,
		// 		data:{
		// 			"Id": e.id,
		// 			"smartAppId": e.appid,
		// 			"Text": e.text,
		// 			"Type": e.type,
		// 		}
		// 	}
		// }
		// postMessage(sendMsg);
		setSelectedSmartItem(e?.displayField);
		console.log("Menu Item Selected", e, value);
	};
	return (
		<>
			<form className="timelog-form">
				<p className="form-title">Add Time</p>
				<div className="spacer"></div>
				<div className="field-section ">
					<div className="resource-field">
						<InputLabel
							required
							className="inputlabel"
							sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}
						>
							Resource
						</InputLabel>
						{/* <TextField
					InputProps={{ startAdornment: (<span className='common-icon-title'></span>) }}
					name='resource' variant='standard' value={timelog.resource}
					onChange={(value:any)=>handleFieldChange(value, "resource")}
				/> */}
						<SmartDropDown
							name="resource"
							LeftIcon={
								<span className="common-icon-ContactPicker resourcedropdown">
									{" "}
								</span>
							}
							options={resourceOptions}
							outSideOfGrid={true}
							isSearchField={false}
							isFullWidth
							Placeholder={"Select"}
							selectedValue={timelog?.resource}
							isMultiple={false}
							handleChange={(value: any) =>
								handleFieldChange(value[0], "resource")
							}
						/>
					</div>
					<div className="date-field">
						<InputLabel
							required
							className="inputlabel"
							sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}
						>
							Date
						</InputLabel>
						<DatePickerComponent
							containerClassName={"iq-customdate-cont"}
							render={
								<InputIcon
									placeholder={"MM/DD/YYYY"}
									className={"custom-input rmdp-input"}
								/>
							}
							defaultValue={
								timelog?.date ? convertDateToDisplayFormat(timelog?.date) : ""
							}
							onChange={(val: any) => handleFieldChange(val, "date")}
						/>
					</div>
					<div className="time-field">
						<InputLabel required className="inputlabel" sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}>{!selectedWorkers ? 'Time' : 'Workers'}</InputLabel>
						{!selectedWorkers ? 
							<TimeLogPicker
								name="time"
								onDurationChange={(value: any) =>
									handleFieldChange(value, "duration")
								}
							></TimeLogPicker>
							: 
							<TextField
								InputProps={{
									startAdornment: <span className="common-icon-Team-Members workers-team-icon"></span>,
								}}
								name="name"
								variant="standard"
								//   value={}
								onClick={(e: any) => setOpenWorkerDialog(true)}
								placeholder='Select'
							/>
						}
					</div>
					<div className="duration-field">
						<InputLabel className="inputlabel">{!selectedWorkers ? 'Duration' : 'Total Hours'}</InputLabel>
						<span className="common-icon-monthly"></span> {timelog.duration}
					</div>
					<div className="smart-item-field">
						<InputLabel className="inputlabel">
							Smart Item (Optional){" "}
						</InputLabel>
						<SmartDropDown
							name='smartItems'
							LeftIcon={<span className='common-icon-smartapp'> </span>}
							options={addLinksOptions || []}
							outSideOfGrid={false}
							isSearchField={false}
							isFullWidth
							Placeholder={'Select'}
							selectedValue={selectedSmartItem}
							isMultiple={false}
							handleChange={handleMenu}
							isDropdownSubMenu={true}
							menuProps={classes.menuPaper}
						/>
					</div>
					<IQButton
						color="orange"
						sx={{ height: "2.5em", width: "fit-content" }}
						disabled={isAddDisabled}
						onClick={handleAdd}
					>
						+ ADD
					</IQButton>
				</div>
			</form>
			{openWorkerDialog ? (
				<WorkerDailog
					open={true}
					closeWorkersDlg={() => setOpenWorkerDialog(false)}
				/>
			) : (
				<></>
			)}
		</>
	);
};

export default memo(AddTimeLogForm);

const DescriptionField = memo((props: TextFieldProps) => {
	return (
		<TextField
			fullWidth
			variant="standard"
			placeholder="Enter Description"
			sx={{
				"& .MuiInputBase-input": {
					overflow: "hidden",
					textOverflow: "ellipsis",
				},
			}}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<div
							className="common-icon-adminNote"
							style={{ fontSize: "1.25rem" }}
						></div>
					</InputAdornment>
				),
				endAdornment: (
					<InputAdornment position="end">
						<div
							className="common-icon-Edit"
							style={{ fontSize: "1.25rem" }}
						></div>
					</InputAdornment>
				),
			}}
			{...props}
		/>
	);
});
