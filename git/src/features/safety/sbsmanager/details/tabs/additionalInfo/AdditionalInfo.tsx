import "./AdditionalInfo.scss";
import { RadioGroup, FormControlLabel, Radio, InputLabel } from "@mui/material";
import { appsData } from "data/sbsManager/appsList";
import SUIBaseDropdownSelector from "sui-components/BaseDropdown/BaseDropdown";
import { AdditionalInfoGrid } from "./AdditionalInfoGrid";
import React from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { getAppDependentFields } from "features/safety/sbsmanager/operations/sbsManagerSlice";
import { deleteSupplementalAppFields, updateSupplementalAppFields } from "features/safety/sbsmanager/operations/sbsManagerAPI";

export const AdditionalInfo = () => {
  const dispatch = useAppDispatch();
  const { detailsData, appsList, appDependentFields  } = useAppSelector(state => state.sbsManager)
  const [additionalInfo, setAdditionalInfo] = React.useState<any>();
  React.useEffect(() => {console.log("setAdditionalInfo", additionalInfo, detailsData); setAdditionalInfo(detailsData)}, [detailsData]);
  const handleOnChange = (name: string, value: any) => {
    console.log("value", value)
    setAdditionalInfo({...additionalInfo, [name]: value})
  }
  React.useEffect(() => {dispatch(getAppDependentFields(additionalInfo?.supplementalInfoAppId))}, [additionalInfo?.supplementalInfoAppId]);
  
  const handleOnAddRow = (obj:any) => {
    console.log("obj", obj, additionalInfo)
    const payload = {details: {
      sbsId: additionalInfo?.uniqueid,
      smartItemId: obj?.dependentAppFields,
      fieldId: obj?.mappingExpression,
    }}
    updateSupplementalAppFields(payload, (response:any) => {console.log("update fileds resp", response)})
    // { "details":{ "smartItemId":25,"fieldId": "fldDesDel","sbsId": 8, "phaseId": 12}}
  }
  const handleOnDeleteRows = (rows:any) => {
    console.log("rowss", rows)
    deleteSupplementalAppFields(rows?.filter((row:any) => row?.id), (response:any) => {
      console.log("delete response", response)
    })
  }
  return (
    <div className="sbs-details">
      <div className="eventrequest-details-box">
        <div className="eventrequest-details-header">
          <div className="title-action">
            <span className="title">Additional Info</span>
          </div>
        </div>

        <div className="additional-info-tile">
          <div className="inputlabel">
            Do you want to configure supplemental info?
          </div>
          <div className="additional-info-radio-group">
            <RadioGroup
              row
              name="configureSupplementalInfo"
              className="associated-to"
              value={additionalInfo?.configureSupplementalInfo ? 'yes' : "no"}
              onChange={(e: any) => handleOnChange('configureSupplementalInfo', e.target.value == 'yes' ? true :  false)}
            >
              <FormControlLabel value={'yes'} control={<Radio />} label="Yes" />
              <FormControlLabel value={'no'} control={<Radio />} label="No" />
            </RadioGroup>
          </div>
        </div>
        <div className="additional-info-details-content">
          <div
            style={{
              width: "150%",
              padding: "unset",
            }}
            className="vendor-field"
          >
            <InputLabel>
              Select an App to configure supplemental info
            </InputLabel>
            <SUIBaseDropdownSelector
              value={appsList?.filter((obj:any) => obj?.id==additionalInfo?.supplementalInfoAppId)} 
              width="150%"
              menuWidth="200px"
              icon={<span className="common-icon-smartapp-logo"> </span>}
              placeHolder={"Select App"}
              dropdownOptions={appsList}
              disabled={!additionalInfo?.configureSupplementalInfo}
              handleValueChange={(value: any, params: any) => handleOnChange('supplementalInfoAppId', value[0]?.id)}
              showFilterInSearch={false}
              multiSelect={false}
              companyImageWidth={"17px"}
              companyImageHeight={"17px"}
              showSearchInSearchbar={true}
              addCompany={false}
            ></SUIBaseDropdownSelector>
          </div>
        </div>
        <div className="additional-info-tile">
          <InputLabel className="inputlabel">
            Click the add field button to select a field from the dependent app
            that you want to pre-populate. Once you select the field, define how
            you want to pre-populate the fields - pick a token or use a mapping
            expression for more complicated pre-populated data.
          </InputLabel>
        </div>
        <div>
          <div>
            <AdditionalInfoGrid 
              disabled={!(additionalInfo?.configureSupplementalInfo && additionalInfo?.supplementalInfoAppId)}
              fieldsList={appDependentFields}
              gridData={additionalInfo?.additionalInfo ? additionalInfo?.additionalInfo : []}
              onAdd={(row:any) => handleOnAddRow(row)}
              onDelete={(rows:any) => handleOnDeleteRows(rows)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
