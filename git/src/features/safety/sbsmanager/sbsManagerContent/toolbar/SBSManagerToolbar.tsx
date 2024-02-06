import { getServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
// Project files and internal support import
import IQTooltip from "components/iqtooltip/IQTooltip";
import { memo, useState } from "react";

import { GridOn, TableRows } from "@mui/icons-material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  getSBSGridList,
  setShowSbsPanel,
} from "../../operations/sbsManagerSlice";
import { deleteSBSGridRecs } from "../../operations/sbsManagerAPI";

// Component definition
export const SBSToolbarLeftButtons = memo((props:any) => {
  const { clickHandler,refreshHandler } = props;
  const dispatch = useAppDispatch();
  const appInfo = useAppSelector(getServer);

  const [disableDelete, setDisableDelete] = useState<boolean>(true);
  const [alert, setAlert] = useState<boolean>(false);
  const { selectedChangeEvents, selectedChangeEventsCount } = useAppSelector(
    (state) => state.changeEventRequest
  );
  const { selectedNodes } = useAppSelector((state) => state.sbsManager);

  const deleteChangeEvent = () => {
    console.log(selectedNodes);
    let selectedIds: any = [];
    selectedNodes.forEach((element: any) => {
      selectedIds.push(element.uniqueid);
    });
    deleteSBSGridRecs(selectedIds)
      .then((res: any) => {
        dispatch(getSBSGridList());
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  return (
    <>
      <IQTooltip title="Refresh" placement="bottom">
        <IconButton
          aria-label="Refresh"
          onClick={() => { refreshHandler() }}
        >
          <span className="common-icon-refresh"></span>
        </IconButton>
      </IQTooltip>
      {/* <IQTooltip title="Export CSV" placement="bottom">
        <IconButton data-action='exportCsv' onClick={clickHandler}>
          <span className="common-icon-Export" />
        </IconButton>
      </IQTooltip> */}
      <IQTooltip title="Delete" placement="bottom">
        <IconButton
          aria-label="Delete Bid response Line Item"
          disabled={selectedNodes.length === 0}
          onClick={() => deleteChangeEvent()}
        >
          <span className="common-icon-delete"></span>
        </IconButton>
      </IQTooltip>
    </>
  );
});

// Component definition
export const SBSToolbarRightButtons = memo(() => {
  const dispatch = useAppDispatch();

  const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
    if (value !== null) {
      // dispatch(setShowTableViewType(value));
    }
  };
  const handleSettings = () => {
    dispatch(setShowSbsPanel(true));
  };
  return (
    <>
      <div
        key="spacer"
        className="toolbar-item-wrapper toolbar-group-button-wrapper"
      >
        <ToggleButtonGroup
          exclusive
          value={"List"}
          size="small"
          onChange={handleView}
          aria-label="Inventory tab view buttons"
        >
          <ToggleButton value={"List"} aria-label="SBS List Tab">
            <GridOn />
          </ToggleButton>
          <ToggleButton value={"Chart"} aria-label="SBS Analytics Tab">
            <AssessmentOutlinedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <IQTooltip title="Settings" placement={"bottom"}>
          <IconButton
            className="settings-button"
            aria-label="SBS Settings"
            onClick={() => handleSettings()}
          >
            <TableRows />
          </IconButton>
        </IQTooltip>
      </div>
    </>
  );
});
