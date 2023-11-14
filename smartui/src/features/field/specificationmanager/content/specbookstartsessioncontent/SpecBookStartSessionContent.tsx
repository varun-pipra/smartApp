import { Button} from "@mui/material";
import { memo } from "react";

const SpecBookStartSessionContent = () => {
  return (
    <>
      <div>
        <div>You have unpublished Spec Section from the previous session</div>
        <br />
        <div>What would you like to do?</div>
      </div>
    </>
  );
};

export const SpecBookStartSessionButtons = () => {
  return (
    <>
      <Button
        className="cancel-cls"
        // onClick={(e) => handleAction(e, "cancel")}
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
        // onClick={(e) => handleAction(e, "cancel")}
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

export default memo(SpecBookStartSessionContent);