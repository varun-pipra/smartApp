import React, { useState, useMemo, useRef, useEffect } from "react";
import SUIGrid from "sui-components/Grid/Grid";
import { InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import "./ScheduleOfValues.scss";

interface ScheduleOfValuesProps {
  label?: any;
  required?: boolean;
  cmpWidth?: any;
  gridData?: any;
  gridColumn?: any;
  selectedRecs?: any;
  getReference?:any;
}

const SUIScheduleOfValues = (props: ScheduleOfValuesProps) => {
  const { label, required, cmpWidth, gridData, gridColumn, selectedRecs, getReference } =
    props;
  const [rowData, setRowData] = React.useState(gridData);
  const [columnDefs, setColumnDefs] = React.useState(gridColumn);
  // const scheduleCmpMenuRef:any = useRef(null);
  // const scheduleCmpSelectRef:any = useRef(null);

  // const [selectedOption, setSelectedOption] = useState([]);
  // const [selectOpen, setSelectOpen] = useState(false);
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "13.4em" }),
    []
  );
  React.useEffect(() => {setRowData(gridData)}, [gridData])
  React.useEffect(() => {setColumnDefs(gridColumn)}, [gridColumn])
  

  // const handleSelectChange = (event: any) => {
  //   setSelectedOption(event.target.value);
  // };

  // useEffect(() => {
  //   const closeOpenMenus = (e:any)=>{
  //     if(scheduleCmpSelectRef.current && selectOpen && scheduleCmpSelectRef.current.contains(e.target)){
  //       setSelectOpen(false);
  //     } else if(scheduleCmpSelectRef.current && !selectOpen && scheduleCmpSelectRef.current.contains(e.target)){
  //       setSelectOpen(true);
  //     }else if(scheduleCmpMenuRef.current && scheduleCmpMenuRef.current.contains(e.target)){
  //       setSelectOpen(true);
  //     } else if(scheduleCmpMenuRef.current && !scheduleCmpMenuRef.current.contains(e.target)){
  //       setSelectOpen(false);
  //     } else {
  //       setSelectOpen(true);
  //     }
  //   };
  //   document.addEventListener('mousedown',closeOpenMenus);
  // },[scheduleCmpSelectRef,scheduleCmpMenuRef]);

  return (
    <div className="schedule-container" style={{ width: cmpWidth }}>
      <InputLabel className="inputlabel">
        {label}
        {label && required && <span className="required_color"> *</span>}
      </InputLabel>

      <Select
        style={{ width: "100%" }}
        value={selectedRecs}
        multiple={true}
        className="schedule-select"
        // onChange={handleSelectChange}
        // open={selectOpen}
        // onOpen={() => setSelectOpen(true)}
        // ref={scheduleCmpSelectRef}
        renderValue={() => {
          return (
            <span>
              {selectedRecs.length === 0
                ? "Selected"
                : `${selectedRecs.length} Selected`}
            </span>
          );
        }}
        startAdornment={
          <InputAdornment position="start">
            {
              <div
                className="common-icon-schedule-values"
                style={{ fontSize: "1.25rem" }}
              ></div>
            }
          </InputAdornment>
        }
        sx={{
          "& .MuiSelect-select": {
            color: "#333333 !important",
            fontFamily: "Roboto-Regular !important",
            padding: "4px 25px 4px 0px",
          },
          "& .MuiSelect-select .notranslate::after": "Select"
            ? {
                content: `"Select"`,
              }
            : {},
        }}
      >
        <MenuItem value="option1" className="schedule-menu-item">
          <div style={containerStyle} className="schedule-grid-cls">
            <SUIGrid
              headers={columnDefs}
              data={rowData}
              realTimeDocPrefix="scheduleofvalues@"              
              getReference={getReference}
              suppressRowClickSelection={true}
            />
          </div>
        </MenuItem>
      </Select>
    </div>
  );
};
export default SUIScheduleOfValues;
