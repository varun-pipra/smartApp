import React, { useState, useEffect } from "react";
import { InputLabel, TextField, IconButton } from "@mui/material";
import SUIClock from "sui-components/Clock/Clock";
import { getTime, addTimeToDate } from "utilities/datetime/DateTimeUtils";

import "./WorkerTimeLog.scss";
const WorkerTimeLog = (props: any) => {
  const {showDuration = false} = props;
  const rowObj = { startTime: "", endTime: "", notes: "", duration: "" };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [logEntries, setLogEntries] = useState<any>([
    { ...rowObj, id: Date.now() },
  ]);
  const [overallDuration, setOverallDuration] = useState<any>("0 Hrs 00 Mins");
  const [timeLogVal, setTimeLogVal] = useState<any>("");
  const dateStr: any = "1/1/1970";

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
          if (fieldName === "startTime") {
            updatedEntries[rowIndex].endTime = "";
          } else {
            updatedEntries[rowIndex].startTime = "";
          }
        }
      }
    }
    console.log(updatedEntries, "updatedEntries");
    setLogEntries(updatedEntries);
  };

  /**
   * Triggers on delete button click, removeing the selected row form local state
   * @param rowIndex number
   * @author Srinivas Nadendla
   */
  const onDeleteBtnClick = (rowIndex: any) => {
    console.log(rowIndex);
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
          const currentStartTime: any = addTimeToDate(dateStr, rec.startTime);
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
      };
      const hours = Math.floor(wholeDuration / (60 * 60));
      const minutes = Math.floor(wholeDuration / 60) % 60;
      if (rec.startTime !== '' && rec.endTime !== '') {
        rec.durationFormat = `${hours ?? 0} Hrs ${minutes ?? 0} Mins`;
      };
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
      setTimeLogVal("");
    }
  }, [logEntries]);

  useEffect(() => {
    props.onDurationChange(overallDuration);
  }, [overallDuration]);

  /**
   *
   * @param rec object
   * @param index number
   * @returns HTML row with the fields based on record data.
   * @author Srinivas Nadendla
   */
  const generateFormRow = (rec: any, index: any, showDuration?:any) => {
    return (
      <div className="time-log-modal_form-row time-log-container">
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
            // disabled={logEntries.length - 1 !== index}
            defaultTime={rec?.startTime || ""}
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
            // disabled={logEntries.length - 1 !== index}
            defaultTime={rec?.endTime || ""}
            placeholder={"HH:MM"}
            // actions={[]}
            ampmInClock={true}
          ></SUIClock>
        </div>
        {showDuration && (
          <div className="duration-field">
            <InputLabel
              className="inputlabel"
              sx={{
                "& .MuiFormLabel-asterisk": {
                  color: "red",
                },
              }}
            >
              Duration
            </InputLabel>
            <div style={{display:'flex', alignItems:'center', gap : '2px'}}>
                <span className="common-icon-monthly" />
                <div>{rec.durationFormat}</div>
            </div>
          </div>
        )}
        {!showDuration && (
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
            // disabled={logEntries.length - 1 !== index}
            InputProps={{
              startAdornment: <span className="common-icon-Description"></span>,
            }}
            name="name"
            variant="standard"
            value={rec?.notes || ""}
            onChange={(e: any) => onDataChange("notes", e.target?.value, index)}
          />
        </div>
        )}
        {index !== 0 && (
          <IconButton  className="delete-btn"
            data-action="delete"
            onClick={(e: any) => onDeleteBtnClick(index)}
          >
            <span className="common-icon-delete" />
          </IconButton>
        )}
        {logEntries.length - 1 === index && (
          <IconButton data-action="add" onClick={() => onAddBtnClick()}>
            <span className="common-icon-add" />
          </IconButton>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="worker-time-log-modal">
        <div className="time-log-modal_form">
          {logEntries.map((rec: any, index: any) => {
            return (
              <React.Fragment key={rec.id || index}>
                {generateFormRow(rec, index, showDuration)}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WorkerTimeLog;
