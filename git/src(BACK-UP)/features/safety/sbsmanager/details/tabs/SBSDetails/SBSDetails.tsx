import React from "react";
import "./SBSDetails.scss";
import SmartDropDown from "components/smartDropdown";
import { InputLabel, Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
//import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import globalStyles, {
  primaryIconSize,
} from "features/budgetmanager/BudgetManagerGlobalStyles";
import { formatDate } from "utilities/datetime/DateTimeUtils";

import { useEffect } from "react";

import { getTradeData } from "features/projectsettings/projectteam/operations/ptDataSlice";
import { setSaveDetailsObj, setEnableSaveButton } from "features/safety/sbsmanager/operations/sbsManagerSlice";
import IQTooltip from "components/iqtooltip/IQTooltip";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const SBSDetailsTab = (props: any) => {
  const { selectedRec, ...rest } = props;
  const tradesData: any = useAppSelector(getTradeData);
  const dispatch = useAppDispatch();

  const { phaseDropDownOptions, categoryDropDownOptions, detailsData,sbsDetailsPayload } =
    useAppSelector((state) => state.sbsManager);

  const [selectedRecData,setSelectedRecData] = React.useState<any>({});  
  const [selectedTradeIds, setSelectedTradeIds] = React.useState([]);
  const [payloadState,setPayloadState] = React.useState<any>({});  
  React.useEffect(()=>{
    setSelectedRecData(detailsData);
    const ids = detailsData?.trades?.map((a:any) => a?.id);
    setSelectedTradeIds(ids);
  },[detailsData])
  const handleOnChange = (value: any, name: any) => {
    setSelectedRecData({...selectedRecData, [name]: value});
    setPayloadState({...selectedRecData, [name]: value});
    dispatch(setEnableSaveButton(true));
  };
  React.useEffect(() => {
        if(Object.keys(payloadState)?.length > 0) {
          const {name, description, startDate, endDate, uniqueid, category, phase, trades} = payloadState;
        let payload: any = {
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
            uniqueID: uniqueid,
            category: { Id: category?.id },
            phase: [{ Id: phase?.[0]?.id }]
        };
          const filterData = trades?.filter((item: any) => {return item !== undefined && item !== null});
          const res = filterData?.map((b: any) => ({ Id : b?.id ? b?.id : b}));
          payload["trades"] = res;
          dispatch(setSaveDetailsObj([payload]));
      }
  },[payloadState])
  console.log("sbsDetailsPayload", sbsDetailsPayload)
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
        value: 1,
        displayLabel: "Capentry",
      },
      {
        objectId: 2,
        status: 2,
        isPrimary: !2,
        companyId: null,
        uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb272",
        name: "Capentry2",
        description: "Capentry2",
        color: "#1D2899",
        isDrawingDiscipline: !0,
        isImportedFromOrg: !1,
        label: "Capentry2",
        value: 2,
        displayLabel: "Capentry2",
      },
    ];
    let groupedList: any = [];
    tradesData.map((data: any, index: any) => {
      groupedList.push({
        ...data,
        label: data.name,
        value: data.objectId,
        displayLabel: data.name,
      });
    });
    return groupedList.length ? groupedList : [];
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
           <span className="common-icon-Description"></span>
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
              <div style={{display:'flex', alignItems: 'center'}}>
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
                {selectedRec?.hasDifferentCategory && (
                  <IQTooltip
                    title={
                      <Stack direction="row" className="tooltipcontent">
                        <p className="tooltiptext">
                          Category name needs to be updated.
                        </p>
                      </Stack>
                    }
                    placement={"bottom"}
                    arrow={true}
                  >
                    <WarningAmberIcon fontSize={"small"} style={{ color: "red" }} />
                  </IQTooltip>
                )}
              </div>
              <SmartDropDown
                LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
                options={categoryDropDownOptions || []}
                selectedValue={(selectedRecData?.category?.value ?? selectedRecData?.category?.name) ||  ""}
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
                selectedValue={selectedRecData?.phase?.length > 0 ? selectedRecData?.phase?.[0]?.name : ""}
                handleChange={(value: any) => {
                  const selRec: any = phaseDropDownOptions.find(
                    (rec: any) => rec.value === value[0]
                  );
                  handleOnChange([selRec], "phase");
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
                selectedValue={selectedTradeIds || []}
                handleChange={(value: any) => {handleOnChange(value, "trades")}}
                handleChipDelete={(value: any) => {handleOnChange(value, "trades")}}
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
