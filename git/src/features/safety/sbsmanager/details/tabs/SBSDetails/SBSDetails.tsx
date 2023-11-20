import React from "react";
import "./SBSDetails.scss";
import SmartDropDown from "components/smartDropdown";
import { InputLabel, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import globalStyles, {
  primaryIconSize,
} from "features/budgetmanager/BudgetManagerGlobalStyles";
import { formatDate } from "utilities/datetime/DateTimeUtils";

import { useEffect } from "react";

import { getTradeData } from "features/projectsettings/projectteam/operations/ptDataSlice";

const SBSDetailsTab = (props: any) => {
  const { selectedRec, ...rest } = props;
  const tradesData: any = useAppSelector(getTradeData);
  const dispatch = useAppDispatch();

  const { phaseDropDownOptions, categoryDropDownOptions, detailsData } =
    useAppSelector((state) => state.sbsManager);

  const [selectedRecData,setSelectedRecordData] = React.useState<any>({});  
  React.useEffect(()=>{
    setSelectedRecordData(detailsData);
  },[detailsData])
  
  const handleOnChange = (value: any, name: any) => {
    setSelectedRecordData({...selectedRecData, [name]: value});
  };

  const getTradesOptions = () => {
    let localTradList = [
      {
        objectId: 1,
        status: 1,
        isPrimary: !1,
        companyId: null,
        uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
        name: "Capentry",
        description: "Capentry",
        color: "#1D2899",
        isDrawingDiscipline: !0,
        isImportedFromOrg: !1,
        label: "Capentry",
        value: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
        displayLabel: "Capentry",
      },
    ];
    let groupedList: any = [];
    tradesData.map((data: any, index: any) => {
      groupedList.push({
        ...data,
        label: data.name,
        value: data.uniqueId,
        displayLabel: data.name,
      });
    });
    return groupedList.length ? groupedList : localTradList;
  };

  return (
    <div className="sbs-details">
      <div className="eventrequest-details-box">
        <div className="eventrequest-details-header">
          <div className="title-action">
            <span className="title">
              System Breakdown Structure (SBS) Details
            </span>
          </div>
        </div>
        <div className="eventrequest-info-tile">
          <InputLabel
            className="inputlabel"
            style={{ marginBottom: "5px", marginTop: "25px" }}
          >
            <DescriptionOutlinedIcon
              style={{ marginBottom: "-4px", marginRight: "7px" }}
              fontSize={primaryIconSize}
              sx={{ color: globalStyles.primaryColor }}
            />
            Description
          </InputLabel>
          <TextField
            id="description"
            value={selectedRecData?.description}
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            maxRows={10}
            placeholder="Enter Description"
            name="description"
            onChange={(e: any) => handleOnChange(e.target.value, "description")}
          />
        </div>
        <div className="eventrequest-details-content">
          <span className="eventrequest-info-tile">
            <div className="type-field">
              <InputLabel
                required
                className="inputlabel"
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              >
                Category
              </InputLabel>
              <SmartDropDown
                LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
                options={categoryDropDownOptions || []}
                selectedValue={
                  selectedRecData?.category ? selectedRecData?.category?.name || selectedRecData?.category?.value : ""
                }
                handleChange={(value: any) => {
                  const selRec: any = categoryDropDownOptions.find(
                    (rec: any) => rec.value === value[0]
                  );
                  handleOnChange(selRec, "category");
                }}
                outSideOfGrid={true}
                isSearchField={false}
                isFullWidth
                Placeholder={"Select"}
              />
            </div>
          </span>
          <span className="eventrequest-info-tile">
            <div className="type-field">
              <InputLabel
                required
                className="inputlabel"
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              >
                Current Phase
              </InputLabel>
              <SmartDropDown
                LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
                options={phaseDropDownOptions || []}
                selectedValue={selectedRecData?.phase ? selectedRecData?.phase?.name : ""}
                handleChange={(value: any) => {
                  const selRec: any = phaseDropDownOptions.find(
                    (rec: any) => rec.value === value[0]
                  );
                  handleOnChange(selRec, "phase");
                }}
                outSideOfGrid={true}
                isSearchField={true}
                isFullWidth
                Placeholder={"Select"}
                ignoreSorting={true}
                showIconInOptionsAtRight={true}
              />
            </div>
          </span>
          <span className="eventrequest-info-tile">
            <div className="type-field">
              <InputLabel
                required
                className="inputlabel"
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }}
              >
                Trade
              </InputLabel>
              <SmartDropDown
                LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
                options={getTradesOptions()}
                outSideOfGrid={true}
                selectedValue={selectedRecData?.trades || []}
                handleChange={(value: any) => {console.log("value",value)}}
                isSearchField={true}
                Placeholder={"Select"}
                ignoreSorting={true}
                isFullWidth
                required={true}
                doTextSearch={true}
                isMultiple={true}
                sx={{ fontSize: "18px" }}
                isSearchPlaceHolder={"Search"}
                showCheckboxes={true}
                showAddButton={false}
                reduceMenuHeight={true}
              />
            </div>
          </span>
        </div>
        <div className="eventrequest-details-content">
          <div className="eventrequest-info-data-box">
            <InputLabel className="inputlabel">Est. Start Date</InputLabel>
            <DatePickerComponent
              containerClassName={"iq-customdate-cont"}
              defaultValue={formatDate(selectedRecData?.startDate, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              onChange={(val: any) => handleOnChange(val, 'startDate')}
              render={
                <InputIcon
                  placeholder={"Select"}
                  className={"custom-input rmdp-input"}
                  style={{ background: "#f7f7f7" }}
                />
              }
            />
          </div>

          <div className="eventrequest-info-data-box">
            <InputLabel className="inputlabel">Est. End Date</InputLabel>
            <DatePickerComponent
              containerClassName={"iq-customdate-cont"}
              defaultValue={formatDate(selectedRecData?.endDate, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
              onChange={(val: any) => handleOnChange(val, 'endDate')}
              render={
                <InputIcon
                  placeholder={"Select"}
                  className={"custom-input rmdp-input"}
                  style={{ background: "#f7f7f7" }}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SBSDetailsTab;
