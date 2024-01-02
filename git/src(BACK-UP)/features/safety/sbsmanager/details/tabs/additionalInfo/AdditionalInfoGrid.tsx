import SUILineItem from "sui-components/LineItem/LineItem";
import IQTooltip from "components/iqtooltip/IQTooltip";
import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import SmartDropDown from "components/smartDropdown";
import SUIGrid from 'sui-components/Grid/Grid';
import { mappingExpressionsList } from "./mappingExpressionsList";
import { makeStyles, createStyles } from '@mui/styles';
import FolderIcon from '@mui/icons-material/Folder';
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
			maxWidth: '160px !important',
		},
	})
);
export const AdditionalInfoGrid = (props:any) => {
  console.log("gridData0", props?.gridData)
  const classes = useStyles();
  const initialRecord = [{ rowId: Math.random(), dependentAppFields: "", mappingExpression: "" }];
  const [tableData, setTableData] = React.useState<any>([]);
  const [newRecord, setNewRecord] = React.useState<any>(initialRecord[0]);
  const [mappingExpression, setMappingExpression] = React.useState<any>();
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [disableMappingFields, setDisableMappingFields] = React.useState<any>([]);
  // React.useEffect(() => {setTableData([...props?.gridData, ...initialRecord])}, [props?.gridData])

  React.useEffect(() => {
    console.log(props?.gridData,"tableData")
   console.log(prepareTableData(props?.gridData,true)) 
    
    // setDisableMappingFields([...fields])
  }, [props?.gridData]);

  const prepareTableData = (tabelData:any,addNewRecord:any) =>{
    console.log(tabelData,"tabelData")
    if(tabelData.length > 0) {
      let fields =  tabelData.map((row:any) => {
      return row?.mappingExpression
    })
    console.log(fields.length,mappingExpressionsList.length,"fields123");
    setDisableMappingFields(fields)
    let tableDataArr: any = [...tabelData].map((rec: any)=>{
      let clonedFields: any = [...fields];
      // let index: any = clonedFields.findIndex((item: any)=> rec.mappingExpression === item );
      // if(index> -1) {
        clonedFields.splice(clonedFields.findIndex((item: any)=> rec.mappingExpression === item ),1)
      // }
      console.log(clonedFields,"clonedFields")
      return {...rec, disabledOptions: clonedFields}
    })
    if(addNewRecord) setTableData([...tableDataArr, {...initialRecord, disabledOptions: fields}]);
    if(!addNewRecord) setTableData([...tableDataArr])
    // console.log("fields", fields)
  
    }
  }
 
  const AIColumns = [
    { headerName: '', field: 'dependentAppFieldsIds', hide:true },
    {
      headerName: "Dependent App Fields",
      field: "dependentAppFields",
      minWidth: 200,
      checkboxSelection: true,
      ignoreDefaultTooltip: true,
      headerCheckboxSelection: true,

      cellRenderer: (params: any) => {
        console.log(params?.data,"dependentAppFields")
        return (
          <div style={{ textAlign: "start" }}>
            <SmartDropDown
              disabled={props?.disabled}            
              // LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
              // options={props?.fieldsList}
              selectedValue={params?.data?.dependentAppFields}
              handleChange={(val:any, nodeIds?:any) => handleOnUpdate(params, val, 'dependentAppFields', nodeIds)}
              handleChipDelete={(val:any) => handleOnUpdate(params, val, 'dependentAppFields')} 
              outSideOfGrid={true}
              isSearchField={false}
              isFullWidth
              Placeholder={"Select"}
              isTreeView={true}
              treeDataOptions={props?.fieldsList  || []}
              isTreeMultiSelect={false}
              showCustomTreeIcon={true}
              isMultiple={false}
              menuProps={classes.menuPaper}
              selectedNodes={params?.data?.dependentAppFieldsIds || []}
              TreeIcon={<FolderIcon />}
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
        console.log("params?.data?.mappingExpression",params?.data)
        return (
          <div style={{ textAlign: "start" }}>
            <SmartDropDown
              disabled={props?.disabled}
              options={mappingExpressionsList}
              outSideOfGrid={true}
              isSearchField={false}
              isMultiple={false}
              selectedValue={params?.data?.mappingExpression}
              handleChange={(val:any, nodeIds?:any) => handleOnUpdate(params, val, 'mappingExpression',nodeIds)}
              //  checkboxSelection={true}
              isFullWidth
              Placeholder={"Select"}
              disableOptionsList={params?.data?.disabledOptions || []}
              showToolTipForDisabledOption={true}
            />
          </div>
        );
      },
    },
  ];

  const onGridRecordAdd = () => {
    // let data = [
    //   ...tableData,
    //   { rowId: Math.random(), dependentAppFields: "", mappingExpression: "" },
    // ];
    // setTableData(data);
    prepareTableData(tableData,true)
    // console.log("prepareTableData(props?.gridData)",prepareTableData(tableData))
  };

  const handleOnUpdate = (params:any, value: any, key: string, nodeIds?:any) => {
    console.log("va", tableData, value)
    let updatedRow:any;
  let updatedTableData: any = [...tableData];
  updatedTableData[params.rowIndex][key] = value[0];
  if(nodeIds) {
    updatedTableData[params.rowIndex].dependentAppFieldsIds = nodeIds;
  }

    // const updatedData = tableData?.map((row:any) => {
    //   if(row?.id && row?.id == params?.data?.id) {
    //       updatedRow = {...row, [key]: value[0]};      
    //       if(nodeIds) {
    //         updatedRow = {...updatedRow, ['dependentAppFieldsIds']: nodeIds}; 
    //       };
    //       return updatedRow;
    //   } else if (row?.rowId == params?.data?.rowId)  { 
    //       updatedRow = {...row, [key]: value[0]};
    //       if(nodeIds) {
    //         updatedRow = {...updatedRow, ['dependentAppFieldsIds']: nodeIds}; 
    //       };
    //       return updatedRow;
    //   }
    //   return {...row};
    // })
    console.log("data", updatedTableData)
    // setTableData(updatedTableData)
    prepareTableData(updatedTableData,false)
    let prepareArr = updatedTableData.map((ele:any)=>{
      return {"dependentAppFields":ele.dependentAppFields,"mappingExpression":ele.mappingExpression,}
    })
    console.log(prepareArr,"prepareArr")
    if(updatedRow?.dependentAppFields && updatedRow?.mappingExpression) props?.onAdd(updatedTableData);
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
            disabled={props?.disabled || mappingExpressionsList.length <= disableMappingFields.length }
            onClick={() => onGridRecordAdd()}
          ><span className="common-icon-add"></span></IconButton>
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
