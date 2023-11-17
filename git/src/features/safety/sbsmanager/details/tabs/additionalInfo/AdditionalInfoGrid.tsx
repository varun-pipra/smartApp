import SUILineItem from "sui-components/LineItem/LineItem";
import IQTooltip from "components/iqtooltip/IQTooltip";
import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import SmartDropDown from "components/smartDropdown";
import { additionalInfoGridDropdownOptions } from "data/sbsManager/sbsData";
import SUIGrid from 'sui-components/Grid/Grid';

export const AdditionalInfoGrid = () => {
  const initialRecord = [{ dependentAppFields: "", mappingExpression: "" }];
  const [tableData, setTableData] = React.useState<any>(initialRecord);
  const [newRecord, setNewRecord] = React.useState<any>(initialRecord[0]);
  const [mappingExpressionOptions, setMappingExpression] = React.useState<any>(
    []
  );

  useEffect(() => {
    let gridDrpDwnOptions: any = [];
    additionalInfoGridDropdownOptions.map((ele, idx) => {
      let object = { ...ele, label: ele.name };
      gridDrpDwnOptions[idx] = object;
    });
    setMappingExpression(gridDrpDwnOptions);
  }, [additionalInfoGridDropdownOptions]);

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
              // LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
              options={[]}
              selectedValue={"selected value"}
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
              // LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
              options={mappingExpressionOptions}
              selectedValue={""}
              //  showIconInOptionsAtLeft={true}
              outSideOfGrid={true}
              isSearchField={false}
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
      { dependentAppFields: "", mappingExpression: "" },
    ];
    setTableData(data);
  };

  return (
    <div>
      <div className="additional-info-header">
        <IQTooltip title="sketch" placement="bottom">
          <IconButton
            className="common-icon-Add"
            disabled={false}
            onClick={() => onGridRecordAdd()}
          ></IconButton>
        </IQTooltip>
        <IQTooltip title="Delete" placement="bottom">
          <IconButton className="ref-delete-btn">
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
