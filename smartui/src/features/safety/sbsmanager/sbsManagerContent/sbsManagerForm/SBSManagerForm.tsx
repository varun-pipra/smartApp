import React from "react";
import { TextField, InputLabel } from "@mui/material";
import InputIcon from "react-multi-date-picker/components/input_icon";
import IQButton from "components/iqbutton/IQButton";
import DatePickerComponent from "components/datepicker/DatePicker";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import SmartDropDown from "components/smartDropdown";
import {
  getPhaseDropdownValues,
  setToastMessage,
} from "features/safety/sbsmanager/operations/sbsManagerSlice";
import { AddDescription } from "features/budgetmanager/headerPinning/AddDescription";
import "./SBSManagerForm.scss";
import {
  getTradeData,
  fetchTradesData,
} from "features/projectsettings/projectteam/operations/ptDataSlice";

const defaultFormData = {
  title: "",
  client: "",
  type: "",
  startDate: "",
  endDate: "",
};

const SBSManagerForm = (props: any) => {
  // Redux State Variable
  const dispatch = useAppDispatch();
  const appInfo = useAppSelector(getServer);

  const tradesData: any = useAppSelector(getTradeData);
  const { phaseDropDownOptions } = useAppSelector((state) => state.sbsManager);
  // Local state vaiables
  const [formData, setFormData] = React.useState<any>(defaultFormData);
  const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);

  // Effects
  React.useEffect(() => {
    setDisableAddButoon(
      formData?.title !== "" && formData?.type !== "" ? false : true
    );
  }, [formData]);

  React.useEffect(() => {
    if (formData.startDate != "") {
      // console.log('startdate', formDatClone)
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setDisableAddButoon(true);
        dispatch(
          setToastMessage({
            displayToast: true,
            message: "Start Date should not be greater than End Date",
          })
        );
      } else {
        if (formData?.title !== "" && formData?.type !== "") {
          setDisableAddButoon(false);
        }
      }
    }
  }, [formData.startDate]);

  React.useEffect(() => {
    if (formData.endDate != "") {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setDisableAddButoon(true);
        dispatch(
          setToastMessage({
            displayToast: true,
            message: "End Date Should Not be less Than start Date",
          })
        );
      } else {
        if (formData?.title !== "" && formData?.type !== "") {
          setDisableAddButoon(false);
        }
      }
    }
  }, [formData.endDate]);

  React.useEffect(() => {
    dispatch(fetchTradesData(appInfo));
    dispatch(getPhaseDropdownValues());
  }, []);

  const getTradesOptions = () => {
    let groupedList: any = [];
    tradesData.map((data: any, index: any) => {
      groupedList.push({
        ...data,
        displayField: data.name,
      });
    });
    return groupedList;
  };

  // onchange methods

  const handleOnChange = (value: any, name: any) => {
    console.log("val", value, name);
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    const payload = {
      title: formData?.title,
      client: {
        id: formData.client[0]["id"],
      },
      type: formData?.type,
      startDate: formData.startDate != "" ? formData?.startDate : null,
      endDate: formData.endDate != "" ? formData?.endDate : null,
    };
  };

  return (
    <>
      <div className="sbs-title-description-container">
        <span className="title-text">SBS Manager</span>
        <AddDescription value={""} />
        <p className="right-spacer"></p>
      </div>
      <div className="sbs-manager-lineitem-form">
        <div className="title-field">
          <InputLabel
            required
            className="inputlabel"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Name
          </InputLabel>
          <TextField
            id="title"
            InputProps={{
              startAdornment: <span className="common-icon-title"> </span>,
            }}
            placeholder={"SBS Name"}
            name="title"
            variant="standard"
            value={formData?.title}
            onChange={(e: any) => handleOnChange(e.target.value, "title")}
          />
        </div>
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
            options={[
              { id: 1, label: "Proposal/Quote", value: "Proposal" },
              { id: 1, label: "Contract", value: "Contract" },
            ]}
            outSideOfGrid={true}
            isSearchField={false}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={formData?.type}
            // menuProps={classes.menuPaper}
            handleChange={(value: any) => handleOnChange(value[0], "type")}
          />
        </div>
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
            Phase
          </InputLabel>
          <SmartDropDown
            LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
            options={phaseDropDownOptions || []}
            outSideOfGrid={true}
            isSearchField={true}
            showRightIcon={true}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={formData?.type}
            handleChange={(value: any) => handleOnChange(value[0], "type")}
            ignoreSorting={true}
          />
        </div>
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
            options={getTradesOptions() || []}
            outSideOfGrid={true}
            isSearchField={false}
            
            isFullWidth
            Placeholder={"Select"}
            selectedValue={formData?.type}
            // menuProps={classes.menuPaper}
            handleChange={(value: any) => handleOnChange(value[0], "type")}
          />
        </div>
        <div className="start-date-field">
          <InputLabel className="inputlabel">Est. Start Date</InputLabel>
          <DatePickerComponent
            defaultValue={formData.startDate}
            onChange={(val: any) =>
              handleOnChange(new Date(val)?.toISOString(), "startDate")
            }
            maxDate={
              formData.endDate !== ""
                ? new Date(formData.endDate)
                : new Date("12/31/9999")
            }
            containerClassName={"iq-customdate-cont"}
            render={
              <InputIcon
                placeholder={"Select"}
                className={"custom-input rmdp-input"}
                style={{ background: "#f7f7f7" }}
              />
            }
          />
        </div>
        <div className="end-date-field">
          <InputLabel className="inputlabel">Est. End Date</InputLabel>
          <DatePickerComponent
            defaultValue={formData.endDate}
            onChange={(val: any) =>
              handleOnChange(new Date(val)?.toISOString(), "endDate")
            }
            minDate={new Date(formData.startDate)}
            containerClassName={"iq-customdate-cont"}
            render={
              <InputIcon
                placeholder={"Select"}
                className={"custom-input rmdp-input"}
                style={{ background: "#f7f7f7" }}
              />
            }
          />
        </div>
        <IQButton
          color="orange"
          sx={{ height: "2.5em" }}
          disabled={disableAddButton}
          onClick={handleAdd}
        >
          + ADD
        </IQButton>
      </div>
    </>
  );
};
export default SBSManagerForm;
