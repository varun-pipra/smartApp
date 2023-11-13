import React, { useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "./PhasesGridList.scss";
import PhasesColorPicker from "../phasesColorPicker/PhasesColorPicker";
import { Button, IconButton } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import SUIAlert from 'sui-components/Alert/Alert';

const PhasesGridList = (props: any) => {
  const [rowData] = useState(props.data || []);
  const gridRef = useRef<any>();
  const [alert, setAlert] = React.useState<any>({
		open: false,
		contentText: '',
		title: '',
		handleAction: '',
		actions: true,
		dailogClose: false
	});

  const [columnDefs] = useState([
    {
      field: "name",
      flex: 1,
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
              if (rowData.findIndex((rec: any)=> rec.color === color) !== -1) {
                setAlert({
                  open: true,
                  title: "Confirmation",
                  contentText: <div>Color you have selected is already in use.<div style={{fontWeight: 600}}>Are you sure you want to use the same color?</div></div>,
                  handleAction: (event: any, type: any) => {
                    setAlert({
                      open: false
                    });
                    if (type === 'yes') {
                      params.node.setData({...params.data, color: color});
                      setAlert({open: false});
                    }
                  }
                });
              } else {
                params.node.setData({...params.data, color: color});
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
    console.log(updatedData);
  };

  return (
    <>
    <div className="phases-grid-wrapper ag-theme-alpine">
      <div className="phases-grid-wrapper_toolbar">
        <IQTooltip title="Refresh" placement="bottom">
          <IconButton aria-label="Refresh" onClick={() => {}}>
            <span className="common-icon-refresh"></span>
          </IconButton>
        </IQTooltip>
        <IQTooltip title="Delete" placement="bottom">
          <IconButton aria-label="Delete">
            <span className="common-icon-delete"></span>
          </IconButton>
        </IQTooltip>
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
