import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import IQButton from "components/iqbutton/IQButton";
import { useRef, useMemo, useState, useCallback } from "react";
import SUIGrid from "sui-components/Grid/Grid";
import "./LaborSheet.scss";
import React from "react";
export const LaborSheetModel = (props: any) => {
  const { data, handleSubmit, btnText = "Pick", ...rest } = props;
  const [rowData, setRowData] = useState(data);
  const [disabled, setDisabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState<any>({});
  console.log("LaborSheetModel");

  React.useEffect(() => {
    if (!!selectedRow && Object.keys(selectedRow)?.length > 0) {
      const detailGrid = gridRef?.current?.api?.detailGridInfoMap;
      let selectedNode = selectedRow;
      Object.entries(detailGrid)?.filter(([key]) => {
        let nodes = detailGrid?.[key]?.api?.getSelectedNodes();
        if (nodes.length > 0) {
          nodes.forEach((element: any) => {
            if (element.data.trade === selectedNode?.trade) {
              element.setSelected(true);
              setDisabled(false);
            } else {
              element.setSelected(false);
            }
          });
        }
      });
    }
  }, [selectedRow]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Work Category",
        // pinned: 'left',
        field: "name",
        sort: "asc",
        cellStyle: { color: "#059cdf" },
        keyCreator: (params: any) => params.data?.name,
        cellRenderer: "agGroupCellRenderer",
      },
    ],
    []
  );
  const detailCellRendererParams = useMemo(() => {
    const details = {
      detailGridOptions: {
        headerHeight: 36,
        groupDefaultExpanded: 0,
        refreshStrategy: "everything",
        rowSelection: "single",
        onSelectionChanged: (params: any) => {
          let selectedNode = params?.api?.getSelectedNodes()?.[0];
          setSelectedRow(selectedNode?.data);
        },
        columnDefs: [
          { headerName: "Trade", field: "name", minWidth: 220 },
          { headerName: "Default Rate", field: "defaultHourlyRate" },
        ],
        defaultColDef: {
          flex: 1,
          resizable: true,
        },
      },
      getDetailRowData: (params: any) => {
        return params.successCallback(params?.data?.trades);
      },
    };
    return details;
  }, []);
  const gridRef: any = useRef();

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);
  const isRowMaster = (dataItem: any) => {
    return dataItem?.trades?.length > 0;
  };
  const handleSelect = () => {
    handleSubmit && handleSubmit(selectedRow);
  };
  const onFirstDataRendered = useCallback((params: any) => {
    gridRef.current = params;
  }, []);
  const onRowSelection = (e: any) => {
    return;
  };
  return (
    <IQBaseWindow
      open={true}
      title="Select From Labor Sheet"
      className="labor-sheet-dialog"
      PaperProps={{
        sx: { height: "85%", width: "30%" },
      }}
      tools={{
        closable: true,
      }}
      actions={
        <div>
          <IQButton
            color="orange"
            disabled={disabled}
            onClick={() => handleSelect()}
          >
            {btnText}
          </IQButton>
        </div>
      }
      withInModule={true}
      {...props}
    >
      <div className="grid">
        <SUIGrid
          ref={gridRef}
          data={rowData}
          rowSelected={(e: any) => onRowSelection(e)}
          detailCellRendererParams={detailCellRendererParams}
          headers={columnDefs}
          isRowMaster={isRowMaster}
          masterDetail={true}
          defaultColDef={defaultColDef}
          groupDefaultExpanded={0}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>
      {/* {showAlert?.show && <ConfirmationDialog handleAction={(type:string) => {handleAlertAction(type, importOption)}} content={showAlert?.msg}/>} */}
    </IQBaseWindow>
  );
};
