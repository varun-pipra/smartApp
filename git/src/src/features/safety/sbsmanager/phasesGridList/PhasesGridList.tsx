import React, { useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "./PhasesGridList.scss";
import PhasesColorPicker from "../phasesColorPicker/PhasesColorPicker";
import { Button, IconButton } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import SUIAlert from "sui-components/Alert/Alert";
import { getPhaseDropdownValues } from "../operations/sbsManagerSlice";
import { useAppDispatch, showLoadMask, hideLoadMask, useAppSelector } from 'app/hooks';
import { TextField } from "@mui/material";
import { deletePhase, createNewPhase, updatePhases } from "../operations/sbsManagerAPI";
import {PhasesColors} from '../utils';

const PhasesGridList = () => {
  const dispatch = useAppDispatch()
  const { phaseDropDownOptions } = useAppSelector((state) => state.sbsManager);
  const [rowData, setRowData] = useState(phaseDropDownOptions || []);
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

  useEffect(() => {
    setRowData(phaseDropDownOptions || []);
  }, [phaseDropDownOptions]);

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
        let obj = { ...rec.data, sequenceNo: index + 1 };
        formattedRows.push(obj);
      }
    });
    return formattedRows;
  };

  /**
   * Getting updated sequence based data and making patch api call
   * @author Srinivas Nadendla
   */
  const onSaveBtnClick = () => {
    const updatedData: any = getUpdatedRowDataWithSequence();
    const payload = {
      phases: updatedData,
    };
    showLoadMask();
    updatePhases(payload)
      .then((res: any) => {
        hideLoadMask();
        onRefreshButtonClick();
      })
      .catch((err: any) => {
        hideLoadMask();
        console.log("error", err);
      })
  };

  const onRefreshButtonClick = ()=> {
    dispatch(getPhaseDropdownValues());
    setSelectedRows([]);
    gridRef.current.api.deselectAll();
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
    showLoadMask();
    deletePhase(payload)
      .then((res: any) => {
        hideLoadMask();
        setAlert({ open: false });
        onRefreshButtonClick();
      })
      .catch((err: any) => {
        hideLoadMask();
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

  /**
   * 
   * @returns Unique color which is not present in the grid. If all are present, then returns existing color
   * @author Srinivas Nadendla
   */
  const getUniqueColor = ()=>{
    const updatedData = gridRef.current?.api?.rowModel?.rowsToDisplay || [];
    const usedColors = [...updatedData].map((rec: any)=> rec.color?.toUpperCase());
    const combined = [...PhasesColors, ...usedColors];
    const unUsedColors = combined.filter((item,pos)=> {
      return combined.indexOf(item) === pos;
    });
    return unUsedColors?.length > 0 ? unUsedColors[0] : usedColors[0];
  }

  /**
   * On enter firing an add api & on success refreshing the grid
   * @param val 
   * @author Srinivas Nadendla
   */
  const addNewRecord = (val: any) => {
    const payload = {
      phase: {
        name: val?.trim(),
        color: getUniqueColor(),
        sequenceNo: rowData?.length + 1,
      },
    };
    showLoadMask();
    createNewPhase(payload)
      .then((res: any) => {
        hideLoadMask();
        onRefreshButtonClick();
        setNewPhase("");
      })
      .catch((err: any) => {
        hideLoadMask();
        console.log("Failed to add new phase", err);
      });
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
            onKeyDown={(e: any) => {
              if (e.keyCode === 13 && e.target.value?.length > 0) {
                addNewRecord(e.target.value);
              }
            }}
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
