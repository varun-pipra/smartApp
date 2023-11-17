import SUILineItem from "sui-components/LineItem/LineItem";
import IQTooltip from "components/iqtooltip/IQTooltip";
import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import SmartDropDown from "components/smartDropdown";
import SUIGrid from 'sui-components/Grid/Grid';
import { mappingExpressionsList } from "./mappingExpressionsList";

export const AdditionalInfoGrid = (props:any) => {
  const initialRecord = [{ id: Math.random(), dependentAppFields: "", mappingExpression: "" }];
  const [tableData, setTableData] = React.useState<any>(initialRecord);
  const [newRecord, setNewRecord] = React.useState<any>(initialRecord[0]);
  const [mappingExpression, setMappingExpression] = React.useState<any>();

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
              options={[{id: 1, value: 'SBS Phase Name', label: 'SBS Phase Name'}, {id: 2, value: 'SBS Phase Id', label: 'SBS Phase Id'}]}
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
      { id: Math.random(), dependentAppFields: "", mappingExpression: "" },
    ];
    setTableData(data);
  };

  const handleOnUpdate = (params:any, value: any, key: string) => {
    console.log("va", params, value)
    const updatedData = tableData?.map((row:any) => {
      if(row?.id == params?.data?.id) return {...row, [key]: value[0]}
      return {...row};
    })
    console.log("data", updatedData)
    setTableData([...updatedData])
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
            disabled={props?.disabled}
          >
            <span className="common-icon-delete"></span>
          </IconButton>
        </IQTooltip>
      </div>
      <div style={{ width: "100%", height: "220px" }}>
        <SUIGrid
          headers={AIColumns}
          data={tableData}
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
