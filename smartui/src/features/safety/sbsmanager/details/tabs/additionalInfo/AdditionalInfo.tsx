import { RadioGroup, FormControlLabel, Radio, InputLabel } from "@mui/material"
import { appsData } from "data/sbsManager/appsList"
import React from "react"
import SUIBaseDropdownSelector from "sui-components/BaseDropdown/BaseDropdown"

export const AdditionalInfo = () => {

  return (
    <div className="sbs-details">
      <div className="eventrequest-details-box">
        <div className="eventrequest-details-header">
          <div className="title-action">
            <span className="title">
              Additional Info
            </span>
          </div>
        </div>
        <div className="eventrequest-info-tile">
          <InputLabel className='inputlabel'>
            Do you want to configure supplemental info?
          </InputLabel>
          <RadioGroup
            row
            name="markupFee"
            className="associated-to"
            // value={formData?.addMarkupFee}
            onChange={(e: any) => { }}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="No"
            />
          </RadioGroup>
        </div>
        <div className="eventrequest-details-content">
          <div style={{
            width: '150%',
            padding: 'unset',
          }} className='vendor-field'>
            <InputLabel>
              Select an App to configure supplemental info

            </InputLabel>
            <SUIBaseDropdownSelector
              // value={formData?.vendor ? formData?.vendor : []}
              width="150%"
              menuWidth="200px"
              icon={<span className="common-icon-smartapp-logo"> </span>}
              placeHolder={'Select App'}
              dropdownOptions={appsData?.data}
              // handleValueChange={(value: any, params: any) => handleOnChange(value, 'vendor')}
              showFilterInSearch={false}
              multiSelect={false}
              companyImageWidth={'17px'}
              companyImageHeight={'17px'}
              showSearchInSearchbar={true}
              addCompany={false}
            ></SUIBaseDropdownSelector>
          </div>

        </div>
        <div className="eventrequest-info-tile">
          <InputLabel className='inputlabel'>
            Click the add field button to select a field from the dependent app that you want to pre-populate. Once you select the field, define how you want to pre-populate the fields - pick a token or use a mapping expression for more complicated pre-populated data.
          </InputLabel>
        </div>
      </div>
    </div>

  )
}