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

interface TimeLogFormProps {
  resource?: string;
  date?: any;
  time?: string;
  duration?: any;
  smartItems?: any;
}

const AddTimeLogForm = (props: any) => {
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    //
  }, [appInfo]);

  const handleFieldChange = (event: any, name: any) => {
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
              outSideOfGrid={true}
              isSearchField={false}
              isFullWidth
              Placeholder={"Select"}
              selectedValue={timelog?.resource}
              isMultiple={false}
              handleChange={(value: any) =>
                handleFieldChange(value, "resource")
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
            <InputLabel
              required
              className="inputlabel"
              sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}
            >
              Time
            </InputLabel>
            <TimeLogPicker
              name="time"
              onDurationChange={(value: any) =>
                handleFieldChange(value, "duration")
              }
            ></TimeLogPicker>
          </div>
          <div className="resource-field">
            <InputLabel
              required
              className="inputlabel"
              sx={{
                "& .MuiFormLabel-asterisk": {
                  color: "red",
                },
              }}
            >
              Workers
            </InputLabel>
            <TextField
              InputProps={{
                startAdornment: <span className="common-icon-name"></span>,
              }}
              name="name"
              variant="standard"
            //   value={}
              onClick={(e: any) => setOpenWorkerDialog(true)}
            />
          </div>
          <div className="duration-field">
            <InputLabel className="inputlabel">Duration</InputLabel>
            <span className="common-icon-monthly"></span> {timelog.duration}
          </div>
          <div className="smart-item-field">
            <InputLabel className="inputlabel">
              Smart Item (Optional){" "}
            </InputLabel>
            <SmartDropDown
              name="smartItems"
              LeftIcon={<span className="common-icon-smartapp"> </span>}
              options={contractOptions}
              outSideOfGrid={true}
              isSearchField={false}
              isFullWidth
              Placeholder={"Select"}
              selectedValue={timelog?.smartItems}
              isMultiple={false}
              handleChange={(value: any) =>
                handleFieldChange(value, "smartItems")
              }
            />
          </div>
          <IQButton
            color="orange"
            sx={{ height: "2.5em" }}
            disabled={isAddDisabled}
            onClick={handleAdd}
          >
            + ADD
          </IQButton>
        </div>
      </form>
      ;
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
