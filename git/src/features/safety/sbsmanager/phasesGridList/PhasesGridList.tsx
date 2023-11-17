import React, { useState, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "./PhasesGridList.scss";
import PhasesColorPicker from "../phasesColorPicker/PhasesColorPicker";
import { Button, IconButton } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import SUIAlert from "sui-components/Alert/Alert";
import { getPhaseDropdownValues } from "../operations/sbsManagerSlice";
import { useAppDispatch } from 'app/hooks';
import { TextField } from "@mui/material";
import { deletePhase, createOrUpdatePhases } from "../operations/sbsManagerAPI";

const PhasesGridList = (props: any) => {
  const dispatch = useAppDispatch()
  const [rowData] = useState(props.data || []);
  const gridRef = useRef<any>();
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [newPhase, setNewPhase] = useState<any>('');
  const [alert, setAlert] = React.useState<any>({
    open: false,
    contentText: "",
    title: "",
    handleAction: "",
    actions: true,
    dailogClose: false,
  });

  const [columnDefs] = useState([
    {
      field: "name",
      flex: 1,
      editable: true,
      cellRenderer: (params: any) => (
        <div className="phases-name-cell">{params?.data?.name}</div>
      ),
    },
    {
      field: "color",
      width: 70,
      cellRenderer: (params: any) => (
        <div className="phases-color-picker-cell">
          <PhasesColorPicker
            selectedColor={params?.data?.color}
            onColorCodeChange={(color: any) => {
              if (rowData.findIndex((rec: any) => rec.color === color) !== -1) {
                setAlert({
                  open: true,
                  title: "Confirmation",
                  contentText: (
                    <div>
                      Color you have selected is already in use.
                      <div style={{ fontWeight: 600 }}>
                        Are you sure you want to use the same color?
                      </div>
                    </div>
                  ),
                  handleAction: (event: any, type: any) => {
                    setAlert({
                      open: false,
                    });
                    if (type === "yes") {
                      params.node.setData({ ...params.data, color: color });
                      setAlert({ open: false });
                    }
                  },
                });
              } else {
                params.node.setData({ ...params.data, color: color });
              }
            }}
          ></PhasesColorPicker>
        </div>
      ),
    },
    { field: "sequence", width: 70, rowDrag: true, cellRenderer: () => "" },
  ]);

  const onRowDragEnd = useCallback((e: any) => {
    console.log("onRowDragEnd", getUpdatedRowDataWithSequence());
  }, []);

  /**
   * On dragEnd or on save call this method to get the updated data with re-arranged sequence
   * @author Srinivas Nadendla
   */
  const getUpdatedRowDataWithSequence = () => {
    const rowsToDisplay = gridRef.current?.api?.rowModel?.rowsToDisplay || [];
    let formattedRows: any = [];
    rowsToDisplay.forEach((rec: any, index: any) => {
      if (rec?.data) {
        let obj = { ...rec.data, sequence: index + 1 };
        formattedRows.push(obj);
      }
    });
    return formattedRows;
  };

  const onSaveBtnClick = () => {
    const updatedData: any = getUpdatedRowDataWithSequence();
    //TODO: Check with BE team for API's changes - as current implementattion not supporting array of objects save.
    if (newPhase?.length >0) {
      //Add it to the last as new record and hit api
    }
    //TODO: createOrUpdatePhases()
    console.log(updatedData);
  };

  const onRefreshButtonClick = ()=> {
    dispatch(getPhaseDropdownValues());
  };

  /**
   * 
   * @param records Array of objects
   * @returns Array of id's
   * @author Srinivas Nadendla
   */
  const pullOutIdsFromPhases = (records: any)=> {
    let ids: any = [];
    (records || []).forEach((item: any)=>ids.push(item.uniqueId))
    return ids;
  };

  /**
   * Triggers once user clicks on yes button from confirmation modal.
   * Calling an api with list of id's as payload.
   * @author Srinivas Nadendla
   */
  const onDeleteConfirm = () => {
    const payload: any = pullOutIdsFromPhases(selectedRows);
    deletePhase(payload)
      .then((res: any) => {
        setAlert({ open: false });
        dispatch(getPhaseDropdownValues());
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };

  /**
   * Triggers when user clicks on delete button. 
   * If user selects atleast one record then showing a conformation modal
   */
  const onDeleteBtnClick = () => {
    if (selectedRows?.length > 0) {
      setAlert({
        open: true,
        title: "Confirmation",
        contentText: <div>Are you sure you want to delete the phase?</div>,
        handleAction: (event: any, type: any) => {
          setAlert({
            open: false,
          });
          if (type === "yes") {
            onDeleteConfirm();
          }
        },
      });
    }
  };

  /**
   * On Grid selection change setting the selected records to local state.
   * Same can be utilized while save
   * @param e 
   * @author Srinivas Nadendla
   */
  const onGridSelectionChanged = (e: any) => {
    const selectedRowItems = e?.api?.getSelectedRows() || [];
    setSelectedRows(selectedRowItems);
  };

  return (
    <>
      <div className="phases-grid-wrapper ag-theme-alpine">
        <div className="phases-grid-wrapper_toolbar">
          <IQTooltip title="Refresh" placement="bottom">
            <IconButton aria-label="Refresh" onClick={() => {onRefreshButtonClick()}}>
              <span className="common-icon-refresh"></span>
            </IconButton>
          </IQTooltip>
          <IQTooltip title="Delete" placement="bottom">
            <IconButton
              aria-label="Delete"
              onClick={() => onDeleteBtnClick()}
              disabled={selectedRows?.length === 0}
            >
              <span className="common-icon-delete"></span>
            </IconButton>
          </IQTooltip>
        </div>
        <div className="phases-grid-wrapper_text-field">
        <TextField
            id="phaseId"
            placeholder={"Add new phase here..."}
            variant="standard"
            value={newPhase}
            onChange={(e: any) => setNewPhase(e.target.value)}
          />
        </div>
        <div className="phases-grid">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            rowDragManaged={true}
            animateRows={true}
            suppressMoveWhenRowDragging={true}
            onRowDragEnd={onRowDragEnd}
            //singleClickEdit={true}
            stopEditingWhenCellsLoseFocus={true}
            rowSelection={"single"}
            //rowMultiSelectWithClick={true}
            onSelectionChanged={(e) => {
              onGridSelectionChanged(e);
            }}
          ></AgGridReact>
        </div>
        <div className="phases-grid-wrapper_footer">
          <Button variant="contained" onClick={() => onSaveBtnClick()}>
            SAVE
          </Button>
        </div>
        <SUIAlert
          open={alert.open}
          contentText={alert.contentText}
          title={alert.title}
          onAction={alert.handleAction}
          showActions={alert.actions}
          DailogClose={alert.dailogClose}
          className="phases-color-change-alert"
        />
      </div>
    </>
  );
};

export default PhasesGridList;
