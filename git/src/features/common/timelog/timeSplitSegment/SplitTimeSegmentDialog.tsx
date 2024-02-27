import React from "react";
import IQButton from "components/iqbutton/IQButton";
import { useState } from "react";
import "./SplitTimeSegmentDialog.scss";
import _ from "lodash";
import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import { InputLabel, TextField } from "@mui/material";
import WorkerTimeLog from "../workerDailog/WorkerTimeLog/WorkerTimeLog";
import moment from "moment";
import { getDuration } from "../utils";
import { ConfirmationDialog } from "features/budgetmanager/import/ConfirmationDialog/ConfirmationDialog";

const SplitTimeSegmentDialog = (props: any) => {
  const {defaultRowData, data, handleSubmit, ...rest } = props;
  const [formData, setFormData] = useState<any>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAlert, setShowAlert] = useState<any>({
    msg: <div className="warning-text">
      <span>Multiple Time entries would be created and sent back to the user.<br /> Are 
            you sure you would like Split the Time Entries and Send Back?"</span>
      </div>
  });	
  const handleSplit = () => {
    setShowConfirmation(true)
    
  };
  const handleTimeEntries = (data: any) => {
    console.log("entries", data)
    setFormData({timeEntries: [...data], description: formData?.description});
  };
  const handleAlertAction =(type:string) => {
    if(type == 'yes') {setShowConfirmation(false); handleSubmit && handleSubmit(formData); if (props?.onClose) props?.onClose(false)}
    else if(type == 'no') {setShowConfirmation(false)};
  };
  return (
    <IQBaseWindow
      open={true}
      className="split-time-segment-window"
      title="Split Time Segment"
      disableEscapeKeyDown={true}
      PaperProps={{
        sx: { height: "85%", width: "25%" },
      }}
      zIndex={100}
      isFromHelpIcon={true}
      tools={{
        closable: true,
        resizable: false,
        customTools: <></>,
      }}
      onClose={(event, reason) => {
        if (reason && reason == "closeButtonClick") {
          if (props?.onClose) props?.onClose(false);
        }
      }}
      actions={
        <>
          <IQButton disabled={!((!_.values(formData?.timeEntries?.[0])?.every(_.isEmpty) && formData?.description && formData?.description !== ''))} onClick={() => handleSplit()}>
            SPLIT & SEND BACK
          </IQButton>
        </>
      }
      withInModule={true}
    >
      <div className="summary-wrap" style={{ overflow: "auto" }}>
        <div className="summary">
          <div className="summary_header-text">SUMMARY</div>
          <div className="summary_container">
            <div>
              <InputLabel className="summary_inputlabel">Start Time</InputLabel>
              <div className="summary_header-text time">{moment?.utc(data?.startTime)?.format('LT')}</div>
            </div>
            <div>
              <InputLabel className="summary_inputlabel">End Time</InputLabel>
              <div className="summary_header-text time">{moment?.utc(data?.endTime)?.format('LT')}</div>
            </div>
            <div>
              <InputLabel className="summary_inputlabel">Duration</InputLabel>
              <div
                className="summary_header-text time"
                style={{ color: "#ed7431" }}
              >
                {getDuration(data?.duration)}
              </div>
            </div>
          </div>
        </div>
        <div className="summary_header-text split-cls">Split Time Entry</div>
        <div className="summary-field-cls">
          <WorkerTimeLog
            name="time"
            // onDurationChange={(duration: any) =>
            //   setChangeEvent({ ...changeEvent, duration: duration })
            // }
            defaultData={defaultRowData}
            onTimeEntryChange={(timeEntries: any) =>
              handleTimeEntries(timeEntries)
            }
            showDuration={true}
          />
        </div>
        <div className="reason-textfield-cls">
          <div className="label-cls">
            <span
              className="common-icon-Description"
              style={{ fontSize: "1.25rem" }}
            />
            <InputLabel className="inputlabel">
              Reason for Splitting Time Segment Entry
            </InputLabel>
          </div>
          <TextField
            id="description"
            value={data?.description}
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            maxRows={10}
            placeholder="Enter Note"
            name="description"
            onChange={(e: any) => setFormData({...formData, description :  e.target.value})}
          />
        </div>
        {showConfirmation && (
          <ConfirmationDialog content={showAlert?.msg} handleAction={(type:string) => handleAlertAction(type)} />
        )}
      </div>
    </IQBaseWindow>
  );
};

export default SplitTimeSegmentDialog;
