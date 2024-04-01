import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import IQButton from "components/iqbutton/IQButton";
import { useRef, useMemo, useState, useCallback } from "react";
import SUIGrid from "sui-components/Grid/Grid";
import "./LaborSheet.scss";
import React from "react";
import { amountFormatWithSymbol } from "app/common/userLoginUtils";
export const LaborSheetModel = (props: any) => {
  const { data, handleSubmit, btnText = "Pick", ...rest } = props;
  const [rowData, setRowData] = useState(data);
  const [disabled, setDisabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState<any>({});
  console.log("LaborSheetModel");

  React.useEffect(() => {
    if (!!selectedRow && Object.keys(selectedRow)?.length > 0) {
      const detailGrid = gridRef?.current?.api?.detailGridInfoMap;
      console.log('detailGrid',detailGrid)
      let selectedNode = selectedRow;
      Object.entries(detailGrid)?.filter(([key]) => {
        let nodes = detailGrid?.[key]?.api?.getSelectedNodes();
        if (nodes?.length > 0) {
          console.log('nodes',nodes)
          nodes?.forEach((element: any) => {
            console.log('element',element)
            if (element?.data?.trade === selectedNode?.trade) {
                if(element?.data?.defaultHourlyRate !== null){
                    element?.setSelected(true);
                    setDisabled(false);
                }
                else{
                  element?.setSelected(false);
                  setDisabled(true);
                }
            } else {
              element?.setSelected(false);
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
          { headerName: "Default Rate(per Hour)", field: "defaultHourlyRate",
           valueGetter:(params:any) => params?.data?.defaultHourlyRate && amountFormatWithSymbol(params?.data?.defaultHourlyRate)},
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
    console.log('selectedRow',selectedRow)
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
        sx: { height: "85%", width: "25%" },
      }}
      tools={{
        closable: true,
      }}
      actions={
        <div>
          <IQButton
            color="orange"
            className="pick-btn-cls"
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
