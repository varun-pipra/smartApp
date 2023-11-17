import { Button } from "@mui/material";
import { memo } from "react";

export const SSUnCommitedBtns = (props:any) => {
  const {handleApply = () => {}, ...rest} = props;
  const handleAction = (e:any, type:any) => {
      handleApply(e, type)
  };
  return (
    <>
      <Button
        className="cancel-cls"
        onClick={(e) => handleAction(e, "resume")}
        style={{
          backgroundColor: "#fff",
          color: "#059cdf ",
          border: "1px solid #059cdf",
        }}
      >
        RESUME PREVIOUS SESSION
      </Button>
      <Button
        className="cancel-cls"
        onClick={(e) => handleAction(e, "startFresh")}
        style={{
          backgroundColor: "#059cdf",
          color: "#fff",
          padding: "12px",
          height: "36px",
          borderRadius: "2px",
        }}
      >
        START FRESH
      </Button>
    </>
  );
};
export const SMSessionDialogContent = () => {
  return (
    <>
      <div>
        <div>You have unpublished Spec Sections from the previous session</div>
        <br />
        <div>What would you like to do?</div>
      </div>
    </>
  );
};
const SSUnCommitedContent = () => {
  return (
    <>
      <div>
        <div>You have uncommitted Submittal from the previous session</div>
        <br />
        <div>What would you like to do?</div>
      </div>
    </>
  );
};
export default memo(SSUnCommitedContent);
