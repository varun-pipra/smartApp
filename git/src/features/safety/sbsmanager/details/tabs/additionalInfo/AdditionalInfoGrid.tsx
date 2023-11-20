import SUILineItem from "sui-components/LineItem/LineItem";
import IQTooltip from "components/iqtooltip/IQTooltip";
import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import SmartDropDown from "components/smartDropdown";
import SUIGrid from 'sui-components/Grid/Grid';
import { mappingExpressionsList } from "./mappingExpressionsList";

export const AdditionalInfoGrid = (props:any) => {
  const initialRecord = [{ rowId: Math.random(), dependentAppFields: "", mappingExpression: "" }];
  const [tableData, setTableData] = React.useState<any>([...props?.gridData, initialRecord]);
  const [newRecord, setNewRecord] = React.useState<any>(initialRecord[0]);
  const [mappingExpression, setMappingExpression] = React.useState<any>();
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  console.log("fieldsList", props?.fieldsList)
  

  const AIColumns = [
    {
      headerName: "Dependent App Fields",
      field: "dependentAppFields",
      minWidth: 200,
      checkboxSelection: true,
      ignoreDefaultTooltip: true,
      headerCheckboxSelection: true,
      cellRenderer: (params: any) => {
        return (
          <div style={{ textAlign: "start" }}>
            <SmartDropDown
              disabled={props?.disabled}            
              // LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
              options={props?.fieldsList}
              selectedValue={[params?.data?.dependentAppFields]}
              handleChange={(val:any) => handleOnUpdate(params, val, 'dependentAppFields')}              
              outSideOfGrid={true}
              isSearchField={false}
              isFullWidth
              Placeholder={"Select"}
            />
          </div>
        );
      },
    },
    {
      headerName: "Mapping Expression",
      field: "mappingExpression",
      minWidth: 200,
      ignoreDefaultTooltip: true,
      cellRenderer: (params: any) => {
        return (
          <div style={{ textAlign: "start" }}>
            <SmartDropDown
              disabled={props?.disabled}
              options={mappingExpressionsList}
              outSideOfGrid={true}
              isSearchField={false}
              isMultiple={false}
              selectedValue={[params?.data?.mappingExpression]}
              handleChange={(val:any) => handleOnUpdate(params, val, 'mappingExpression')}
              //  checkboxSelection={true}
              isFullWidth
              Placeholder={"Select"}
            />
          </div>
        );
      },
    },
  ];

  const onGridRecordAdd = () => {
    let data = [
      ...tableData,
      { rowId: Math.random(), dependentAppFields: "", mappingExpression: "" },
    ];
    setTableData(data);
  };

  const handleOnUpdate = (params:any, value: any, key: string) => {
    console.log("va", params, value)
    let updatedRow:any;
    const updatedData = tableData?.map((row:any) => {
      if(row?.id && row?.id == params?.data?.id) {
        updatedRow = {...row, [key]: value[0]};        
        return {...row, [key]: value[0]}
      } 
      else if (row?.rowId == params?.data?.rowId)  { 
        updatedRow = {...row, [key]: value[0]};
        return {...row, [key]: value[0]} 
      }
      return {...row};
    })
    console.log("data", updatedData, updatedRow)
    setTableData([...updatedData])
    if(updatedRow?.dependentAppFields && updatedRow?.mappingExpression) props?.onAdd(updatedRow);
  }
  const handleRowSelected = (row:any) => {
    console.log("dart", row);
    let selectedRowsClone:any = [...selectedRows]
			const selectedRowData = row?.data;
			if(selectedRowData !== undefined) {
				const selected: boolean = row?.node?.selected;
				if(selected === true) {
					selectedRowsClone = [...selectedRowsClone, selectedRowData];
				}
				else {
					selectedRowsClone.map((row: any, index: number) => {
						if(row.id === selectedRowData.id) {
							selectedRowsClone.splice(index, 1);
						}
					});
				}
      }
      setSelectedRows([...selectedRowsClone])
    
			// if(action.payload?.length === 0) {
			// 	state.selectedRows = action.payload;
			// }
  }

  return (
    <div className={props?.disabled ? 'disable-cls' : ''}>
      <div className="additional-info-header">
        <IQTooltip title="sketch" placement="bottom">
          <IconButton
            className="common-icon-Add"
            disabled={props?.disabled}
            onClick={() => onGridRecordAdd()}
          ></IconButton>
        </IQTooltip>
        <IQTooltip title="Delete" placement="bottom">
          <IconButton className="ref-delete-btn" 
            disabled={props?.disabled || !selectedRows?.length}
            onClick={() =>props?.onDelete(selectedRows)}
          >
            <span className="common-icon-delete"></span>
          </IconButton>
        </IQTooltip>
      </div>
      <div style={{ width: "100%", height: "220px" }}>
        <SUIGrid
          headers={AIColumns}
          data={tableData}
          rowSelected={(value:any) => handleRowSelected(value)}
          // onAdd={(value: any, updatedRecords: any) =>
          // onGridRecordAdd(value, updatedRecords)
          // }
          // onRemove={(value: any, updatedRecords: any) =>
          // 	onGridRecordRemove(value, updatedRecords)
          // }
          // addRowPosition={"bottom"}
          // adddisable={true}
          // readOnly={true}
          // actionheaderprop={{
          //   minWidth: 80,
          //   maxWidth: 80,
          // }}
          // deleteConfirmationRequired={true}
        />
      </div>
    </div>
  );
};
