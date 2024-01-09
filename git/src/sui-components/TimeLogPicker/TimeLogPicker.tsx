import React, { useState, useEffect } from "react";
import {
  Popover,
  Input,
  InputLabel,
  TextField,
  IconButton,
} from "@mui/material";
import "./TimeLogPicker.scss";
import SUIClock from "sui-components/Clock/Clock";
import { getTime, addTimeToDate } from "utilities/datetime/DateTimeUtils";
import dayjs from "dayjs";

const TimeLogPicker = (props: any) => {
  const rowObj = { startTime: "", endTime: "", notes: "", duration: "" };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [logEntries, setLogEntries] = useState<any>([
    { ...rowObj, id: Date.now() },
  ]);
  const [overallDuration, setOverallDuration] = useState<any>("0 Hrs 00 Mins");
  const [timeLogVal, setTimeLogVal] = useState<any>("");
  const dateStr: any = '1/1/1970';

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;
  
  const onInputClick = (e: any) => {
        setAnchorEl(e.currentTarget);
    };

   /**
  * On add button click pushing one empty object to the local state, so that it will render new row.
  * @author Srinivas Nadendla
  */
  const onAddBtnClick = () => {
    setLogEntries([...logEntries, { ...rowObj, id: Date.now() }]);
  };

  /**
   * Triggers on each input change. 
   * When current field is time then calcaulting the duration in seconds and setting it to record level.
   * @param fieldName string
   * @param time string
   * @param rowIndex number
   * @author Srinivas Nadendla
   */
  const onDataChange = (fieldName: string, time: any, rowIndex: any) => {
    let updatedEntries = [...logEntries];
    updatedEntries[rowIndex][fieldName] = time;
    if (fieldName === "startTime" || fieldName === "endTime") {
      if (
        updatedEntries[rowIndex].startTime &&
        updatedEntries[rowIndex].endTime
      ) {
        const startDateTime: any = addTimeToDate(
          dateStr,
          updatedEntries[rowIndex].startTime
        );
        const endDateTime: any = addTimeToDate(
          dateStr,
          updatedEntries[rowIndex].endTime
        );
        const durationInSeconds =
          (new Date(endDateTime).getTime() -
            new Date(startDateTime).getTime()) /
          1000;
          if (durationInSeconds > 0) {
            updatedEntries[rowIndex].duration = durationInSeconds;
          } else {
            updatedEntries[rowIndex].duration = 0;
            if (fieldName === 'startTime') {
              updatedEntries[rowIndex].endTime = '';
            } else {
              updatedEntries[rowIndex].startTime = '';
            }
          }
        
      }
    }
    setLogEntries(updatedEntries);
  };

  /**
   * Triggers on delete button click, removeing the selected row form local state
   * @param rowIndex number
   * @author Srinivas Nadendla
   */
  const onDeleteBtnClick = (rowIndex: any) => {
    let updatedEnteris = [...logEntries];
    updatedEnteris.splice(rowIndex, 1);
    setLogEntries(updatedEnteris);
  };

  /**
   *Calculating the wholle duration and start/end time whenever logEntries state updates. 
   */
  useEffect(() => {
    let wholeDuration = 0;
    let minStartTime: any = "",
      maxEndTime: any = "";
    (logEntries || []).forEach((rec: any, index: any) => {
      if (rec.duration) {
        wholeDuration += rec.duration;
      }
      if (rec.startTime) {
        if (index === 0) {
          minStartTime = rec.startTime;
          maxEndTime = rec.endTime;
        } else {
          const currentStartTime: any = addTimeToDate(
            dateStr,
            rec.startTime
          );
          const prevStartTime: any = addTimeToDate(dateStr, minStartTime);
          const currentEndTime: any = addTimeToDate(dateStr, rec.endTime);
          const prevEndTime: any = addTimeToDate(dateStr, maxEndTime);
          if (
            new Date(currentStartTime).getTime() <
            new Date(prevStartTime).getTime()
          ) {
            minStartTime = rec.startTime;
          }
          if (
            new Date(currentEndTime).getTime() > new Date(prevEndTime).getTime()
          ) {
            maxEndTime = rec.endTime;
          }
        }
      }
    });
    if (wholeDuration > 0) {
      const hours = Math.floor(wholeDuration / (60 * 60));
      const minutes = Math.floor(wholeDuration / 60) % 60;
      setOverallDuration(`${hours} Hrs ${minutes} Mins`);
    } else {
      setOverallDuration(`0 Hrs 00 Mins`);
    }
    if (minStartTime && maxEndTime) {
      setTimeLogVal(`${minStartTime} - ${maxEndTime}`);
    } else if (minStartTime && !maxEndTime) {
      setTimeLogVal(`${minStartTime} - HH:MM`);
    } else if (!minStartTime && maxEndTime) {
      setTimeLogVal(`HH:MM - ${maxEndTime}`);
    } else {
      setTimeLogVal('');
    }
  }, [logEntries]);

  useEffect(() => {
    props.onDurationChange(overallDuration);
  }, [overallDuration]);

  const convertTimetoDate = (date: any) => {
		if (date === "") return null;
		let b: any = date ? dayjs(`1/1/1 ${date}`).format("HH:mm:00") : null; //checking AM or PM
		let a: any = dayjs(new Date()).set('hour', (b?.split(":")?.[0])).set('minute', (b?.split(":")?.[1]?.split(" ")?.[0]));
		return a.$d;
	};

  const getPickerDefaultTime = (time: any, incrementDecrement: any) => {
    let currentTime: any = convertTimetoDate(time);
    if (isNaN(currentTime)) {
      return '';
    }
    let [hours, minutes, ampm] = time.split(/:|\s/);
    hours = parseInt(hours, 10);
		minutes = parseInt(minutes, 10);
    if (isNaN(hours) && isNaN(minutes)) {
      return '';
    }
    if (incrementDecrement) {
					minutes += 5;
					if (minutes >= 60) {
            minutes -= 60;
            hours = (hours + 1) % 12;
					}
    } else {
          minutes -= 5;
					if (minutes < 0) {
            minutes += 60;
            hours = (hours - 1 + 12) % 12;
					}
    }
    // Format the new time
    hours = hours === 0 ? 12 : hours; // Handle midnight (0 hours)
    if (hours === 12 && minutes === 0) {
    ampm = ampm?.toLowerCase() === "am" ? "PM" : "AM";
    }
    let newTime = `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
    return newTime;
  }

  /**
   * 
   * @param rec object
   * @param index number
   * @returns HTML row with the fields based on record data.
   * @author Srinivas Nadendla
   */
  const generateFormRow = (rec: any, index: any) => {
    let pickerDefaultStartTime: any = '', pickerDefaultEndTime: any ='';
   
      if (rec.startTime || rec.endTime) {
        const startTime: any = (!rec.startTime && rec.endTime) ? getPickerDefaultTime(rec.endTime, false) : (rec.startTime || '');
        pickerDefaultStartTime = startTime;
        const endTime: any = (!rec.endTime && rec.startTime) ? getPickerDefaultTime(rec.startTime, true) : (rec.endTime || '');
        pickerDefaultEndTime = endTime;
      }
    return (
      <div className="time-log-modal_form-row">
        <div className="time-field">
          <InputLabel
            className="inputlabel"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Start Time
          </InputLabel>
          <SUIClock
            onTimeSelection={(value: any) => {
              onDataChange("startTime", getTime(value), index);
            }}
            disabled={false}
            defaultTime={rec?.startTime || ""}
            pickerDefaultTime={pickerDefaultStartTime}
            placeholder={"HH:MM"}
            // actions={[]}
            ampmInClock={true}
          ></SUIClock>
        </div>
        <div className="time-field">
          <InputLabel
            className="inputlabel"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            End Time
          </InputLabel>
          <SUIClock
            onTimeSelection={(value: any) => {
              onDataChange("endTime", getTime(value), index);
            }}
            disabled={false}
            defaultTime={rec?.endTime || ""}
            pickerDefaultTime={pickerDefaultEndTime}
            placeholder={"HH:MM"}
            // actions={[]}
            ampmInClock={true}
          ></SUIClock>
        </div>
        <div className="notes-field">
          <InputLabel
            className="inputlabel"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Notes
          </InputLabel>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: <span className="common-icon-Description"></span>,
            }}
            name="name"
            variant="standard"
            value={rec?.notes || ""}
            onChange={(e: any) => onDataChange("notes", e.target?.value, index)}
          />
        </div>
        {index !== 0 && (
          <IconButton
          className="action-btn-cls"
            data-action="delete"
            onClick={(e: any) => onDeleteBtnClick(index)}
          >
            <span className="common-icon-delete" />
          </IconButton>
        )}
        <IconButton  className="action-btn-cls" data-action="add" onClick={() => onAddBtnClick()}>
          <span className="common-icon-add" />
        </IconButton>
      </div>
    );
  };

  return (
    <>
      <Input
        id="timeLogPicker"
        fullWidth
        startAdornment={<span className="common-icon-CurrentTime"></span>}
        placeholder={"HH:MM - HH:MM"}
        name={props.name || "Time"}
        readOnly={true}
        value={timeLogVal}
        onClick={(e: any) => onInputClick(e)}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: 'left'
        }}
      >
        <div className="time-log-modal">
          <div className="time-log-modal-header">
            <span className="time-log-modal-header_title">
              Add Time Entries
            </span>
            <span className="time-log-modal-header_close" onClick={handleClose}>
              +
            </span>
          </div>
          <div className="time-log-modal_form">
            {logEntries.map((rec: any, index: any) => {
              return (
                <React.Fragment key={rec.id || index}>
                  {generateFormRow(rec, index)}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Popover>
    </>
  );
};

export default TimeLogPicker;
