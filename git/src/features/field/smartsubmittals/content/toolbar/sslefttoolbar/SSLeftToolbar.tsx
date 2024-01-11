import IQTooltip from "components/iqtooltip/IQTooltip";
import { memo, useEffect, useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import "./SSLeftToolbar.scss";
import SSMittalLeftForm from "./SSAddForm";
import IQButton from "components/iqbutton/IQButton";
import { getSmartSubmitalGridList, setSSBrenaStatus, setSelectedRecord, setSelectedRecordsData } from "features/field/smartsubmittals/stores/SmartSubmitalSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { extractSubmittalFromSection } from "features/field/smartsubmittals/smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarApi";
export const SSLeftToolbar = memo((props:any) => {
  const {defaultType, ...rest} = props;
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = useState(false);
  const [color, setColor] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(true);
  const { selectedRecordsData, showManageSubmittalsAI } = useAppSelector((state:any) => state.smartSubmittals);
  const disabledField = ((defaultType === 'default') && selectedRecordsData?.length > 0);
  const handleOpen = () => {
    setOpen(true);
    setColor(true);
  };
  const handleClose = () => {
    setOpen(false);
    setColor(false);
  };

  const handleExtractSpecsAI = () => {
    let payload = selectedRecordsData.map((rec: any) => {
      return {
        id: rec?.data?.id,
        issubmittalextracted: 1,
      };
    });

    extractSubmittalFromSection(payload)
      .then((res) => {
        console.log("extractSubmittalFromSection res", res);
        dispatch(setSSBrenaStatus(true));
      })
      .catch((err) => {
        console.log("extractSubmittalFromSection err", err);
      });
  };
  const handleRefresh = () => {
    dispatch(getSmartSubmitalGridList({type : defaultType}));
    dispatch(setSelectedRecord({}));
    dispatch(setSelectedRecordsData([]));
  };
  return (
    <div className="sm-left-toolbar-cont">
      <IQTooltip title="Refresh" placement="bottom">
        <IconButton
          aria-label="Refresh Spec Manager"
          onClick={() => handleRefresh()}
        >
          <span className="common-icon-refresh"></span>
        </IconButton>
      </IQTooltip>
      <IQTooltip title="Add" placement="bottom">
        <IconButton
          data-action="add"
          className={color ? "add-color" : " "}
          onClick={handleOpen}
          disabled={!disabledField}
        >
          <span className="common-icon-add" />
        </IconButton>
      </IQTooltip>
      {/* <IQTooltip title="Edit" placement="bottom">
        <IconButton data-action="edit">
          <span className="common-icon-feather-edit" />
        </IconButton>
      </IQTooltip>
      <IQTooltip title="Upload" placement="bottom">
        <IconButton data-action="Upload">
          <span className="common-icon-cloud-upload" />
        </IconButton>
      </IQTooltip>
      <IQTooltip title="Print" placement="bottom">
        <IconButton>
          <span className="common-icon-print" />
        </IconButton>
      </IQTooltip> */}
      <IQTooltip title="Delete" placement="bottom">
        <IconButton
          aria-label="Delete Bid response Line Item"
          disabled={!disabledField}
        >
          <span className="common-icon-delete"></span>
        </IconButton>
      </IQTooltip>
      {showManageSubmittalsAI && (
        <IQButton
          className="smart-submital-left-spec-ai"
          startIcon={<span className="common-icon-brena" />}
          onClick={handleExtractSpecsAI}
          disabled={!disabledField}
        >
          Manage Submittals.AI
        </IQButton>
      )}
      {isOpen && <SSMittalLeftForm arrow={true} onClose={handleClose} />}
    </div>
  );
});

