import React from "react";
import { TextField, InputLabel } from "@mui/material";
import InputIcon from "react-multi-date-picker/components/input_icon";
import IQButton from "components/iqbutton/IQButton";
import DatePickerComponent from "components/datepicker/DatePicker";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import SmartDropDown from "components/smartDropdown";
import {
  getSBSGridList,
  setAddPhaseText,
  setShowPhaseModel,
  setToast,
  setToastMessage,
} from "features/safety/sbsmanager/operations/sbsManagerSlice";
import { AddDescription } from "features/budgetmanager/headerPinning/AddDescription";
import "./SBSManagerForm.scss";
import { getTradeData } from "features/projectsettings/projectteam/operations/ptDataSlice";
import { makeStyles, createStyles } from "@mui/styles";
import { AddSbsManagerForm } from "../../operations/sbsManagerAPI";
import RTHelper from "utilities/realtime/RTHelper";
import { setLineItemDescription } from "features/budgetmanager/operations/tableColumnsSlice";

const useStyles: any = makeStyles((theme: any) =>
  createStyles({
    menuPaper: {
      maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
      maxWidth: "160px !important",
    },
  })
);
const defaultFormData = {
  name: "",
  description: "",
  category: { id: "", name: "", value: "" },
  phase: { id: "", name: "" },
  trades: [],
  startDate: null,
  endDate: null,
};
const SBSManagerForm = (props: any) => {
  const rtHelperIns = new RTHelper();
  const classes = useStyles();
  // Redux State Variable
  const dispatch = useAppDispatch();
  const appInfo = useAppSelector(getServer);

  const tradesData: any = useAppSelector(getTradeData);
  const { phaseDropDownOptions, categoryDropDownOptions } = useAppSelector(
    (state) => state.sbsManager
  );
  const { lineItemDescription } = useAppSelector((state) => state.tableColumns);
  // Local state vaiables
  const [formData, setFormData] = React.useState<any>(defaultFormData);
  const [disableAddButton, setDisableAddButton] = React.useState<boolean>(true);
  const [uuidForSbs, setUUIDForSbs] = React.useState(rtHelperIns.getUuid());
  const [dynamicClose, setDynamicClose] = React.useState(false);
  const [showAddIcon, setShowAddIcon] = React.useState(false);
  // Effects
  React.useEffect(() => {
    setDisableAddButton(
      formData?.name !== "" &&
        formData?.category.id > 0 &&
        formData?.phase.id > 0 &&
        formData?.trades?.length > 0
        ? false
        : true
    );
    if (formData.startDate != "") {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        dispatch(
          setToastMessage({
            displayToast: true,
            message: "Start Date should not be greater than End Date",
          })
        );
      }
    };
    if (formData.endDate != "") {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        dispatch(
          setToastMessage({
            displayToast: true,
            message: "End Date Should Not be less Than start Date",
          })
        );
      };
    };
  }, [formData]);
  React.useEffect(() => {
    if (lineItemDescription) {
      handleOnChange(lineItemDescription, "description");
    }
  }, [lineItemDescription]);

  const GetDropDownId = (array: any, value: any, key: any) => {
    const obj = array.find((x: any) => x.label === value);
    return obj[key];
  };

  const getTradesOptions = () => {
    let groupedList: any = [];
    tradesData.map((data: any, index: any) => {
      groupedList.push({
        ...data,
        label: data.name,
        value: data.name,
        displayLabel: data.name,
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
    dispatch(setLineItemDescription(""));
    let data = formData;
    data.category = {
      Id: GetDropDownId(
        categoryDropDownOptions,
        formData.category.name || formData.category.value,
        "id"
      ),
    };
    data.phase = [
      {
        Id: GetDropDownId(phaseDropDownOptions, formData.phase.name, "id"),
      },
    ];

    data.trades = formData?.trades?.map((tid: any) => {
      return { Id: GetDropDownId(getTradesOptions(), tid, "objectId") };
    });

    const payload = {
      ...data,
      uniqueID: uuidForSbs,
    };
    AddSbsManagerForm(payload)
      .then((res: any) => {
        setFormData(defaultFormData);
        dispatch(getSBSGridList());
        dispatch(setToast('New SBS Item Created Successfully'));
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };
  const handlePhaseAdd = (item: any, val: any) => {
    dispatch(setShowPhaseModel(true));
    setDynamicClose(!dynamicClose);
    dispatch(setAddPhaseText(val));
    setShowAddIcon(false);
  };
  const handleSearchProp= (items:any, key:any) => {
    if(items?.length === 0) setShowAddIcon(true);
    else setShowAddIcon(false);
  };
  return (
    <>
      <div className="sbs-title-description-container">
        <span className="title-text">Create New SBS</span>
        <AddDescription
          value={!lineItemDescription ? "" : lineItemDescription}
        />
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
            id="name"
            InputProps={{
              startAdornment: <span className="common-icon-sbs-name"> </span>,
            }}
            placeholder={"SBS Name"}
            name="name"
            variant="standard"
            value={formData?.name}
            onChange={(e: any) => handleOnChange(e.target.value, "name")}
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
            options={categoryDropDownOptions || []}
            outSideOfGrid={true}
            isSearchField={false}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={formData?.category.name || formData?.category.value}
            menuProps={classes.menuPaper}
            handleChange={(value: any) => {
              const selRec: any = categoryDropDownOptions.find(
                (rec: any) => rec.value === value[0]
              );
              handleOnChange(selRec, "category");
            }}
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
            LeftIcon={<div className="common-icon-phase"></div>}
            options={phaseDropDownOptions || []}
            outSideOfGrid={true}
            isSearchField={true}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={formData?.phase.name}
            menuProps={classes.menuPaper}
            handleChange={(value: any) => {
              const selRec: any = phaseDropDownOptions.find(
                (rec: any) => rec.value === value[0]
              );
              handleOnChange(selRec, "phase");
            }}
            ignoreSorting={true}
            showIconInOptionsAtRight={true}
            handleAddCategory={(val:any) => handlePhaseAdd('phase', val)}
            isCustomSearchField={showAddIcon}
            dynamicClose={dynamicClose}
            handleSearchProp={(items:any, key:any) => handleSearchProp(items, key)}
          />
        </div>
        <div className="type-field">
          <SmartDropDown
            required={true}
            options={getTradesOptions()}
            LeftIcon={<div className="common-icon-trade"></div>}
            dropDownLabel="Trade"
            doTextSearch={true}
            isSearchField={true}
            isMultiple={true}
            selectedValue={formData?.trades}
            isFullWidth
            outSideOfGrid={true}
            handleChange={(value: any) => handleOnChange(value, "trades")}
            handleChipDelete={(value: any) => handleOnChange(value, "trades")}
            menuProps={classes.menuPaper}
            sx={{ fontSize: "18px" }}
            Placeholder={"Select"}
            isSearchPlaceHolder={"Search"}
            showCheckboxes={true}
            showAddButton={false}
            reduceMenuHeight={true}
          />
        </div>
        <div className="start-date-field">
          <InputLabel className="inputlabel">Est. Start Date</InputLabel>
          <DatePickerComponent
            defaultValue={formData.startDate}
            onChange={(val: any) => handleOnChange(val, "startDate")}
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
            onChange={(val: any) => handleOnChange(val, "endDate")}
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
