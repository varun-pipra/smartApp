import { Button } from "@mui/material";
import { memo } from "react";

export const SSCommitedBtns = (props:any) => {
  const {handleApply = () => {}, ...rest} = props;
  const handleAction = (e:any, type:any) => {
        handleApply(e, type);
  };
  return (
    <div style={{ display: "flex", gap: "30px" }}>
      <div>
        <Button
          className="cancel-cls"
          onClick={(e) => handleAction(e, "discard")}
          style={{
            backgroundColor: "#666",
            color: "#fff",
            padding: "12px",
            height: "36px",
            borderRadius: "2px",
          }}
        >
          DISCARD
        </Button>
      </div>
      <div>
        <Button
          className="cancel-cls"
          onClick={(e) => handleAction(e, "resumeLater")}
          style={{
            backgroundColor: "#fff",
            color: "#059cdf ",
            border: "1px solid #059cdf",
          }}
        >
          RESUME LATER
        </Button>
      </div>
      <div>
        <Button
          className="cancel-cls"
          onClick={(e) => handleAction(e, "commitSubmittals")}
          style={{
            backgroundColor: "#059cdf",
            color: "#fff",
            padding: "12px",
            height: "36px",
            borderRadius: "2px",
          }}
        >
          COMMIT SUBMITTALS
        </Button>
      </div>
    </div>
  );
};

const SSCommitedContent = () => {
  return (
    <>
      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <div>
          You have not committed one or more Submittal, what would you like to
          do?
        </div>
      </div>
    </>
  );
};
export default memo(SSCommitedContent);
