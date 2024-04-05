import React, { useState } from "react";
import { Button, IconButton } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import EstimateForm from "./createEstimateNewForm/CreateEstimateNewForm";
import EstimateRoomPublishBudget from "./estimateRoomPublishBudget/EstimateRoomPublishBudget";
import { useAppSelector } from "app/hooks";

const LeftSideToolBarButtons = (props: any) => {
  const { refreshHandler, ...rest } = props;
  const [addForm, setAddForm] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { selectedRows } = useAppSelector((state) => state.estimateRoom);
  const isSingleSelected = selectedRows?.length === 1;
  const CreateNew = (data: any) => {
    console.log("data", data);
  };

  const onPublishBudgetClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IQTooltip title="Refresh" placement="bottom">
        <IconButton
          aria-label="Refresh Budget Room List"
          onClick={() => {
            refreshHandler();
          }}
        >
          <span className="common-icon-refresh"></span>
        </IconButton>
      </IQTooltip>
      <IQTooltip title="Add" placement="bottom">
        <IconButton onClick={() => setAddForm(true)}>
          <span className="common-icon-Add icon-size" />
        </IconButton>
      </IQTooltip>
      <IQTooltip title="Copy" placement="bottom">
        <IconButton disabled={!isSingleSelected}>
          <span className="common-icon-copy icon-size" />
        </IconButton>
      </IQTooltip>
      <IconButton className="divider-line-cls"></IconButton>
      <IQTooltip title={"Deactivate"} placement="bottom">
        <IconButton disabled={!isSingleSelected} data-action="act-dect">
          <span className="common-icon-Deactivate icon-size" />
        </IconButton>
      </IQTooltip>
      <IconButton className="divider-line-cls"></IconButton>
      <IQTooltip title="Import" placement={"bottom"}>
        <IconButton
          aria-label="Import Budget Items"
          disabled={!isSingleSelected}
          // onClick={() => setImportVisible(true)}
        >
          <span className="common-icon-budget-import icon-size"></span>
        </IconButton>
      </IQTooltip>
      <IconButton className="divider-line-cls"></IconButton>
      <IQTooltip title="Delete" placement="bottom">
        <IconButton
          aria-label="Delete"
          disabled={!isSingleSelected}
          // onClick={() => deleteChangeEvent()}
        >
          <span className="common-icon-delete icon-size"></span>
        </IconButton>
      </IQTooltip>
      <Button
        disabled={!isSingleSelected}
        variant="outlined"
        startIcon={<span className="common-icon-budget-manager"></span>}
        className="sap-button"
        onClick={() => setOpen(true)}
      >
        <span className="postto">Publish to Budget</span>
      </Button>
      {addForm && (
        <EstimateForm
          title={"Create New Estimate"}
          onClose={() => {
            setAddForm(false);
          }}
          onAdd={(data: any) => {
            CreateNew(data);
          }}
        />
      )}
      {open && (
        <EstimateRoomPublishBudget
          setOpen={open}
          onPublishBudgetClose={onPublishBudgetClose}
        />
      )}
    </>
  );
};

export default LeftSideToolBarButtons;
