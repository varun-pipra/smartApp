import IQButton from "components/iqbutton/IQButton";
import React, { memo, useRef } from "react";
import { useMemo } from "react";
import "./SplitTimeSegmentDialog.scss";
import _ from "lodash";
import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import { InputLabel, TextField } from "@mui/material";
import WorkerTimeLog from "../workerDailog/WorkerTimeLog/WorkerTimeLog";

const SplitTimeSegmentDialog = (props: any) => {
  interface ChangeEventFormProps {
    name?: string;
    description?: string;
    clientContract?: any;
    budgetItems?: Array<any>;
    fundingSource?: any;
    duration?: any;
  }

  const defaultValues: ChangeEventFormProps = useMemo(() => {
    return {
      name: "",
      description: "",
      clientContract: "",
      budgetItems: [],
      fundingSource: "",
      duration: "0 Hrs 00 Mins",
    };
  }, []);
  const rowObj = { startTime: "", endTime: "", notes: "", duration: "" };
  const [changeEvent, setChangeEvent] =
    React.useState<ChangeEventFormProps>(defaultValues);
  const [logEntries, setLogEntries] = React.useState<any>([
    { ...rowObj, id: Date.now() },
  ]);

  return (
    <IQBaseWindow
      open={true}
      className="split-time-segment-window"
      title="Split Time Segment"
      // isFullView={isFullView}
      disableEscapeKeyDown={true}
      PaperProps={{
        sx: { height: "65%", width: "30%" },
      }}
      // onMaximize={handleWindowMaximize}
      // moduleColor='#0e5b0'
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
          <IQButton
            disabled={false}
            // color=""
            // onClick={() => handleSelectedRows()}
          >
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
              <div className="summary_header-text time">9:00 AM</div>
            </div>
            <div>
              <InputLabel className="summary_inputlabel">End Time</InputLabel>
              <div className="summary_header-text time">6:00 PM</div>
            </div>
            <div>
              <InputLabel className="summary_inputlabel">Duration</InputLabel>
              <div className="summary_header-text time" style={{ color: "#ed7431" }}>
                9 Hrs 00 Mins
              </div>
            </div>
          </div>
        </div>
        <div className="summary_header-text split-cls">Split Time Entry</div>
        <div  className="summary-field-cls">
          <WorkerTimeLog
            name="time"
            onDurationChange={(duration: any) =>
              setChangeEvent({ ...changeEvent, duration: duration })
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
            // value={selectedRecData?.description}
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            maxRows={10}
            placeholder="Enter Note"
            name="description"
            // onChange={(e: any) => handleOnChange(e.target.value, "description")}
          />
        </div>
      </div>
    </IQBaseWindow>
  );
};

export default SplitTimeSegmentDialog;
