import { Button} from "@mui/material";
import { memo } from "react";
import "./SpecBookPublishContent.scss";

export const SpecBookPublishButtons  = (props : any) => {
  const {handleAction, ...rest} = props;
  return (
    <div className="confirm-btn-cls">
      <div>
        <Button
          className="resume-later-cls"
          onClick={(e) => handleAction(e, "discard")}
        >
          DISCARD
        </Button>
      </div>
      <div>
        <Button
          className="publish-generate-cls"
          onClick={(e) => handleAction(e, "resumeLater")}
        >
          RESUME LATER
        </Button>
      </div>
      <div>
        <Button
          className="publish-spec-cls" 
          onClick={(e) => handleAction(e, "publishSpecs")}
        >
          PUBLISH SPECS
        </Button>
      </div>
    </div>
  );
};
export const PublishDialogButtons = (props : any) => {
  const {handleAction, ...rest} = props;
  return(
  <div  className="confirm-btn-cls">
    <Button
        onClick={(e) => handleAction(e, "resumeLater")}
        className="resume-later-cls">
        RESUME LATER
      </Button>

    <Button
      onClick={(e) => handleAction(e, 'publishSpecsAndGenerateSubmittals')}
      className="publish-generate-cls">
      PUBLISH SPECS AND GENERATE SUBMITTALS
    </Button>
    <Button
      onClick={(e) => handleAction(e, 'publishSpecs')}
      className="publish-spec-cls" >
      PUBLISH SPECS
    </Button>
</div>
  )
};
const SpecBookPublishContent = () => {
  return (
    <>
      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <div>You have not published Spec what would you like</div>
      </div>
    </>
  );
};
export default memo(SpecBookPublishContent);