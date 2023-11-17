import IQTooltip from "components/iqtooltip/IQTooltip";
import { memo } from "react";
import "./SMRightToolbar.scss";
import { TableRows } from "@mui/icons-material";
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import {
  Button,
  IconButton
} from "@mui/material";

// Component definition
export const SMRightButtons = memo(() => {
  return (
    <div className="sm-right-toolbar-cont">
      <div
        key="spacer"
        className="toolbar-item-wrapper toolbar-group-button-wrapper sm-right-toolbar-cont"
      >
        {/* <UploadMenu
          showDriveOption={true}
          showContractOption={false}
          label={"Submittal Registry AI"}
          folderType={'Files'}
          dropdownLabel={"Select Type"}
        /> */}

        {/* <IQTooltip title="Settings" placement={"bottom"}>
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
