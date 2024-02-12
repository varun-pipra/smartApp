import React from 'react';
import { ChangeEvent, memo, useMemo, useState, useEffect } from "react";
import "./AddTimeLogForm.scss";
import { getServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQButton from "components/iqbutton/IQButton";
import SmartDropDown from "components/smartDropdown";
import _ from "lodash";
import { postMessage } from "app/utils";
import { InputAdornment, InputLabel, TextField, TextFieldProps, } from "@mui/material";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import TimeLogPicker from "sui-components/TimeLogPicker/TimeLogPicker";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import WorkerDailog from "./workerDailog/WorkerDailog";
import { makeStyles, createStyles } from "@mui/styles";
import { setToast } from './stores/TimeLogSlice';
import { AppList, AppList_PostMessage } from './utils';

interface TimeLogFormProps {
	resource?: string;
	date?: any;
	time?: string;
	duration?: any;
	smartItems?: any;
}

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
	const appInfo = useAppSelector(getServer);
	const classes = useStyles();
	const { appsList } = useAppSelector(state => state.sbsManager);
	const { access } = useAppSelector(state => state.timeLogRequest);
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
		{ id: 2, label: "Work Team", value: "workteam" },
		{ id: 3, label: "My Company", value: "mycompany" },
		{ id: 4, label: "Ad-hoc Users", value: "Ad-hoc-users" },
	];
	const [timelog, setTimeLog] = useState<TimeLogFormProps>(defaultValues);
	const [isBudgetDisabled, setBudgetDisabled] = useState<boolean>(true);
	const [isAddDisabled, setAddDisabled] = useState<boolean>(true);
	const [contractOptions, setContractOptions] = useState<any>([]);
	const [resourceOptions, setResourceOptions] = useState<any>([]);
	const [budgetsList, setBudgetsList] = useState<any>([]);
	const [disableOptionsList, setDisableOptionsList] = useState<any>([]);
	const [isDescExists, setIsDescExists] = useState(false);
	const [openWorkerDialog, setOpenWorkerDialog] = useState(false);
	const [addLinksOptions, setAddLinksOptions] = React.useState<any>();
	const [selectedSmartItem, setSelectedSmartItem] = React.useState("");
	const [selectedWorkers, setSelectedWorkers] = React.useState<Boolean>(false);

	useMemo(() => {
		const addLinksOptionsCopy = AppList(appsList);
		setAddLinksOptions(addLinksOptionsCopy);
	}, [appsList]);

	useMemo(() => {
		if (resource && resource.length > 0) {
			const companyArray = ['Me', 'mycompany'];
			const workerArray = ['Me', 'workteam'];

			const updatedarray = resource?.filter((data: any) => {
				return access == 'Company' ? companyArray?.includes(data.value)
					: access == 'Workers' ? workerArray?.includes(data.value)
						: data
			});
			console.log('updatedarray', updatedarray)
			setResourceOptions(updatedarray);
		}
	}, [access]);

	const handleFieldChange = (event: any, name: any) => {
		setSelectedWorkers(event === "workteam" ? true : false)
		setTimeLog((currentState) => {
			const newState = { ...currentState, ...{ [name]: event } };
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
		const payload = { ...timelog, smartItems: selectedSmartItem };
		console.log('payload', payload)

		dispatch(setToast('Time Logged Sucessfully.'));
	};

	const smartItemOnClick = (e: any) => {
		AppList_PostMessage(e);
		setSelectedSmartItem(e?.displayField);
	};
	return (
		<>
			<form className="timelog-form">
				<p className="form-title">Add Time</p>
				<div className="spacer"></div>
				<div className="field-section ">
					<div className="resource-field">
						<InputLabel required className="inputlabel" sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}>
							Resource
						</InputLabel>
						{/* <TextField
							InputProps={{ startAdornment: (<span className='common-icon-title'></span>) }}
							name='resource' variant='standard' value={timelog.resource}
							onChange={handleFieldChange}
						/> */}
						<SmartDropDown
							name="resource"
							LeftIcon={
								<span className="common-icon-ContactPicker resourcedropdown">
									{" "}
								</span>
							}
							options={resourceOptions}
							ignoreSorting={true}
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
								TimeonChange={(data: any) => { handleFieldChange(data, 'time') }}
							></TimeLogPicker>
							:
							<TextField
								InputProps={{
									startAdornment: <span className="common-icon-Team-Members resourcedropdown"></span>,
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
							outSideOfGrid={true}
							isSearchField={false}
							isFullWidth
							Placeholder={'Select'}
							selectedValue={selectedSmartItem}
							isMultiple={false}
							handleChange={(e: any) => { smartItemOnClick(e) }}
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
