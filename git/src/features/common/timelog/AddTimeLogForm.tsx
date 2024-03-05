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
import { setToast ,getTimeLogList,setSmartItemOptionSelected} from './stores/TimeLogSlice';
import { AppList, AppList_PostMessage } from './utils';
import { addTimeToDate, getTime } from 'utilities/datetime/DateTimeUtils';
import { addTimeLog } from './stores/TimeLogAPI';
import { canManageTimeForCompany, canManageTimeForWorkTeam, isWorker, canManageTimeForProject } from 'app/common/userLoginUtils';
import moment from 'moment';

interface TimeLogFormProps {
	resource?: string;
	date?: any;
	time?: any;
	workers?:any;
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
	const { access ,smartItemOptionSelected , WorkTeamDataFromExt} = useAppSelector(state => state.timeLogRequest);
	const defaultValues: TimeLogFormProps = useMemo(() => {
		return {
			resource: isWorker() ? "Me" : "",
			date: new Date()?.toISOString(),
			time: [],
			duration: "0 Hrs 00 Mins",
			smartItems: "",
			workers:0
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
		{ id: 4, label: "Ad-hoc Users", value: "adhocUser" },
	];
	const [timelogForm, setTimeLogForm] = useState<TimeLogFormProps>(defaultValues);
	const [isBudgetDisabled, setBudgetDisabled] = useState<boolean>(true);
	const [isAddDisabled, setAddDisabled] = useState<boolean>(true);
	const [contractOptions, setContractOptions] = useState<any>([]);
	const [resourceOptions, setResourceOptions] = useState<any>([]);
	const [budgetsList, setBudgetsList] = useState<any>([]);
	const [disableOptionsList, setDisableOptionsList] = useState<any>([]);
	const [isDescExists, setIsDescExists] = useState(false);
	const [openWorkerDialog, setOpenWorkerDialog] = useState(false);
	const [addLinksOptions, setAddLinksOptions] = React.useState<any>();
	const [selectedSmartItem, setSelectedSmartItem] = React.useState<any>("");
	const [selectedWorkers, setSelectedWorkers] = React.useState<Boolean>(false);
	const [clearTimeLogPickerData, setClearTimeLogPickerData] = useState<boolean>(false);

	useMemo(() => {
		const addLinksOptionsCopy = AppList(appsList);
		setAddLinksOptions(addLinksOptionsCopy);
	}, [appsList]);

	useMemo(() => {
		if(!_.isEmpty(smartItemOptionSelected) ){
			console.log('smartItemOptionSelected',smartItemOptionSelected)
			const duplicate = [{...smartItemOptionSelected}]
			const addLinksOptionsCopy = AppList([...appsList,...duplicate]);
			setAddLinksOptions(addLinksOptionsCopy);
			setSelectedSmartItem(smartItemOptionSelected.name)
			setTimeLogForm((currentState) => {
				const newState = { ...currentState, ...{ ['smartItems']: smartItemOptionSelected?.id } };
				return newState;
			});
		}
		else{
			const addLinksOptionsCopy = AppList([...appsList]);
			setAddLinksOptions(addLinksOptionsCopy);
			setSelectedSmartItem('')
		}
	}, [smartItemOptionSelected]);

	useEffect(()=>{
		if(WorkTeamDataFromExt.length > 0){
			let wholeDuration = 0;
			let OverallDuration = "0 Hrs 00 Mins"
			let timeLogData:any = []
			console.log(WorkTeamDataFromExt,'WorkTeamDataFromExt');
			WorkTeamDataFromExt.forEach((ele:any)=>{
				timeLogData = [...timeLogData , ...ele.timeLogData.map((data:any)=> {return {...data , userId : ele.userUId}} )]
				ele.timeLogData.forEach((item:any)=>{
					const durationInSeconds =
						(new Date(item.endTime).getTime() -
							new Date(item.startTime).getTime()) /
						1000;
					if (durationInSeconds > 0) {
						wholeDuration += durationInSeconds;
					  }
				})
				if (wholeDuration > 0) {
					const hours = Math.floor(wholeDuration / (60 * 60));
					const minutes = Math.floor(wholeDuration / 60) % 60;
					OverallDuration =`${hours} Hrs ${minutes} Mins`
				}

			})
			console.log('OverallDuration',OverallDuration)
			setTimeLogForm((currentState) => {
				const newState = { ...currentState, ...{ ['workers']: WorkTeamDataFromExt.length ,['duration']: OverallDuration ,['time']:timeLogData} };
				checkFormValidity(newState)
				return newState;
			})
		}
	},[WorkTeamDataFromExt])

	useMemo(() => {
		if (resource && resource.length > 0) {
			const companyArray = ['Me', 'mycompany'];
			const workerArray = ['Me', 'workteam'];
			const projectLevelArray = ['Me', 'mycompany', 'workteam', 'adhocUser']

			const updatedarray = resource?.filter((data: any) => {
				return canManageTimeForProject() ? projectLevelArray?.includes(data?.value)
					: canManageTimeForWorkTeam() ? workerArray?.includes(data.value)
					: canManageTimeForCompany() ? companyArray?.includes(data.value) : []
			});
			setResourceOptions(updatedarray);
		}
	}, [access]);

	const handleFieldChange = (event: any, name: any) => {
		console.log('event',event);
		console.log('name',name);
		if(name == 'resource'){	
			// setTimeLogForm((currentState) => {
			// 	const oldState =  { ...currentState, ...{ [name]: event } };
			// 	const newState =  { ...{ [name]: event} , ...{	time: [],duration: "0 Hrs 00 Mins",smartItems: currentState?.smartItems ,workers:'',date: currentState?.data }}
			// 	return currentState.resource != name ? newState :  oldState;
			// });
			if((event === "workteam") || (event === "mycompany")) {
				setSelectedWorkers(true)
			} 
			else {
				setSelectedWorkers(false)
			}
			setTimeLogForm((currentState) => {
				const newState =  { ...currentState, ...{ [name]: event } };
				checkFormValidity(newState);
				return newState;
			});
		}
		else{
			setTimeLogForm((currentState) => {
				const newState =  { ...currentState, ...{ [name]: event } };
				checkFormValidity(newState);
				return newState;
			});
		}
	};

	const checkFormValidity = (record: TimeLogFormProps) => {
	 	  if(record.resource == 'workteam' || record.resource == 'mycompany' ){
				setAddDisabled(record.workers > 0 ? false : true)
			}
			else if (timelogForm?.resource == 'Me' || timelogForm.resource == 'adhocUser') {
				if(!_.isEmpty(record?.time)){
					if (record?.time[0]['startTime'] !='' && record?.time[0]['endTime'] !='') setAddDisabled(false);
					else setAddDisabled(true);
				}
				else setAddDisabled(true);
			}
	}; 

	const handleAdd = () => {
		const timeEntries = timelogForm?.time?.map((obj:any) => {
			let startDate = addTimeToDate(timelogForm?.date,obj.startTime);
			let endDate = addTimeToDate(timelogForm?.date, obj?.endTime);
			if(timelogForm?.resource == "workteam" || timelogForm?.resource == "mycompany" ){
				return {
					startTime: obj?.startTime ? moment(startDate).format("MM/DD/yyyy h:mm A") : '',
                    endTime: obj?.endTime ? moment(endDate).format("MM/DD/yyyy h:mm A") : '',
					// startTime: obj?.startTime ? addTimeToDate(timelogForm?.date, obj?.startTime) : '',
					// endTime: obj?.endTime ? addTimeToDate(timelogForm?.date, obj?.endTime) : '',
					userId:obj.userId,
					notes : obj.notes
				}
			}else{
				return {
					startTime: obj?.startTime ? moment(startDate).format("MM/DD/yyyy h:mm A") : '',
					endTime: obj?.endTime ? moment(endDate).format("MM/DD/yyyy h:mm A"): '',
					userId: timelogForm?.resource == 'Me' ? appInfo?.currentUserInfo?.userid : '',
					notes : obj.notes
				}
			}
			
		})
		const payload = {
			smartItemId : timelogForm?.smartItems,
			workTeamId : '',
			source: 0,
			segments: [...timeEntries]
		};
		console.log('payload',payload);
		// setTimeLogForm(defaultValues);
		// setSelectedSmartItem('');
		setAddDisabled(true);
    //setClearTimeLogPickerData(true)
		addTimeLog(payload, (resp:any) => {
			dispatch(setSmartItemOptionSelected({}));
			dispatch(setToast('Time Logged Successfully.'));
			dispatch(getTimeLogList({}));
		});		

	};

	const smartItemOnClick = (e: any) => {
		AppList_PostMessage(e);
	};

	const openSelectResource = () => {
    	// setOpenWorkerDialog(true);
		let selectedOpt:any = {}
		if(timelogForm.resource === 'workteam'){
			selectedOpt={
				workteamUser:true,
				title:"Work Team"
			}
		}
		if(timelogForm.resource === 'mycompany'){
			selectedOpt={
				IQ9Accounts:true,
				Contacts:true,
				FilterByCompany:true,
				companyUser:true,
				title:"My Company"
			}
		}
		// if(timelogForm.resource === 'Ad-hoc-users'){
		// 	selectedOpt['Contacts'] = true
		// }
		let sendMsg = {
			event: "common",
			body: {
				evt: "resourcepicker",
				data: selectedOpt
			}
		}
		console.log('resouce sendMsg', sendMsg);
		postMessage(sendMsg);
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

						{
							isWorker() ? <span className='common-icon-ContactPicker resourcenodropdown'>{appInfo?.currentUserInfo?.name}</span> 
							: <SmartDropDown
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
								selectedValue={timelogForm?.resource}
								isMultiple={false}
								handleChange={(value: any) =>
									handleFieldChange(value[0], "resource")
								}
							/>
						}

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
							defaultValue={timelogForm?.date && convertDateToDisplayFormat(timelogForm?.date)}
							onChange={(val: any) => handleFieldChange(new Date(val)?.toISOString(), "date")}
						/>
					</div>
					<div className="time-field">
						<InputLabel required className="inputlabel" sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}>{!selectedWorkers ? 'Time' : 'Workers'}</InputLabel>
						{!selectedWorkers ?
							<TimeLogPicker
								name="time"
								onDurationChange={(value: any) =>handleFieldChange(value, "duration")}
								TimeonChange={(data: any) => { handleFieldChange(data, 'time') }}
								resetTimeLog={clearTimeLogPickerData}
                                resetDone={ (e:any)=> setClearTimeLogPickerData(e)}
							></TimeLogPicker>
							:
							<TextField
								InputProps={{
									startAdornment: <span className="common-icon-workers resourcedropdown"></span>,
								}}
								name="name"
								variant="standard"
								value={timelogForm?.workers > 0 ? timelogForm?.workers : ""}
								className="select-resource-cls"
								onClick={openSelectResource}
								placeholder='Select'
							/>
						}
					</div>
					<div className="duration-field">
						<InputLabel className="inputlabel">{!selectedWorkers ? 'Duration' : 'Total Hours'}</InputLabel>
						<span className="common-icon-monthly"></span> {timelogForm.duration}
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