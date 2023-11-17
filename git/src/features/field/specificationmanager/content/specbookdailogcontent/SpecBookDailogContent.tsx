import InputIcon from "react-multi-date-picker/components/input_icon";
import DatePickerComponent from "components/datepicker/DatePicker";
import IQButton from "components/iqbutton/IQButton";
import IQTooltip from "components/iqtooltip/IQTooltip";
import infoicon from "resources/images/common/infoicon.svg";
import { Box, InputLabel, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import { setSMBrenaStatus } from "../../stores/SpecificationManagerSlice";
import { useAppDispatch } from "app/hooks";
import "./SpecBookDailogContent.scss";
import { setSSBrenaStatus } from "features/field/smartsubmittals/stores/SmartSubmitalSlice";

const defaultFormData = {
	displayName:'',
	receivedDate: '',
	issuedDate: '',
}

export const SpeckBookButtons = (props:any) => {
  const {onExtract} = props;
  const dispatch = useAppDispatch();
  
  const openBrena = ()=>{
    onExtract();
    // dispatch(setSMBrenaStatus(true))
  }
  return (
    <IQButton
      className="contract-details-tooltip-button"
      startIcon={<span className="common-icon-brena" />}
      onClick={openBrena}
    >
      EXTRACT SPECS
    </IQButton>
  );
};

const SpecBookDialogContent = (props: any) => {
  const {
    specBookText = "LAG Specs_1.pdf",
    displayName = "30% CD Spec Book",
    readOnly = false,
    onDatachange,
    ...rest
  } = props;
  const [formData,setFormData] = useState(defaultFormData);

  useEffect(()=>{
    if(onDatachange) onDatachange(formData);
  },[formData])

  const handleOnChange = (value: any, name: any) => {
    setFormData({...formData, [name]: value });    
	};

  return (
    <div style={{ gap: "14px", display: "grid" }} className="spec-book-content-cls">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <div style={{ width: "50%" }}>
          <InputLabel className="inputlabel title">Spec Book</InputLabel>
          <span className="common-icon-specbook"></span>
          <span className="input-data-cls">
            {specBookText}
          </span>
        </div>
        <div style={{ width: "50%" }}>
          <InputLabel
            required
            className="inputlabel title"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Display Name
          </InputLabel>
          {readOnly ? (
            <>
              <span className="common-icon-specbook"></span>
              <span className="input-data-cls">
              {displayName}
              </span>{" "}
            </>
          ) : (
            <TextField
              id="displayName"
              fullWidth
              className="display-name"
              InputProps={{
                startAdornment: <span className="common-icon-specbook"> </span>,
              }}
              placeholder={"Display Name"}
              name="displayName"
              variant="standard"
              onChange={(e: any) => handleOnChange(e.target.value, 'displayName')}
            />
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          //justifyContent: "space-between",
        }}
      >
        <div className="end-date-field" style={{ width: "50%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <InputLabel className="inputlabel">Received Date</InputLabel>
            <IQTooltip
              title={`Date the Team got the spec from Design Team`}
              arrow={true}
            >
              <Box
                component="img"
                alt="Info icon"
                src={infoicon}
                className="image"
                width={14}
                height={14}
                style={{ marginLeft: "6px", marginRight: 10, cursor: 'pointer' }}
              />
            </IQTooltip>
          </div>
          <DatePickerComponent
            zIndex={9999}
            containerClassName="iq-customdate-cont"
            // defaultValue={convertDateToDisplayFormat(specRecord[0]?.receivedDate)}
            onChange={(val: any) => handleOnChange(convertDateToDisplayFormat(val), 'receivedDate')}
            // minDate={new Date()}
            // maxDate={new Date('12/31/9999')}
            render={
              <InputIcon
                placeholder="MM/DD/YYYY"
                className="custom-input rmdp-input"
              />
            }
          />
        </div>

        <div className="end-date-field" style={{ width: "50%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <InputLabel className="inputlabel">Issued Date</InputLabel>
            <IQTooltip
              title={`Date the Drawing was issued to the Team`}
              arrow={true}
            >
              <Box
                component="img"
                alt="Info icon"
                src={infoicon}
                className="image"
                width={14}
                height={14}
                style={{ marginLeft: "6px", marginRight: 10, cursor: 'pointer' }}
              />
            </IQTooltip>
          </div>
          <DatePickerComponent
            zIndex={9999}
            containerClassName="iq-customdate-cont"
            // defaultValue={convertDateToDisplayFormat(specRecord[0]?.dateIssued)}
            onChange={(val: any) => handleOnChange(convertDateToDisplayFormat(val), 'issuedDate')}
            // minDate={new Date()}
            // maxDate={new Date('12/31/9999')}
            render={
              <InputIcon
                placeholder="MM/DD/YYYY"
                className="custom-input rmdp-input"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default memo(SpecBookDialogContent);
