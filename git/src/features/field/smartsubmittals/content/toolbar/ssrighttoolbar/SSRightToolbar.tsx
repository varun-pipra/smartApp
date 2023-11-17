import IQTooltip from "components/iqtooltip/IQTooltip";
import { memo } from "react";
import "./SSRightToolbar.scss";
import { TableRows } from "@mui/icons-material";
import {
  Button,
  IconButton
} from "@mui/material";

// Component definition
export const SSRightToolbar = memo(() => {
  return (
    <div className="sm-right-toolbar-cont">
      <div
        key="spacer"
        className=" sm-right-toolbar-cont"
      >
        {/* <Button
          variant="outlined"
          // startIcon={<Lock />}
          className="submittal-create-pkg"
        >
            <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
          <span className="common-icon-add add" /> 
          <div>Create Submital Package</div>
            </div>
        </Button>

        <IQTooltip title="Settings" placement={"bottom"}>
          <IconButton
            className="settings-button"
            aria-label="Change Events Settings"
          >
            <TableRows />
          </IconButton>
        </IQTooltip> */}
      </div>
    </div>
  );
});