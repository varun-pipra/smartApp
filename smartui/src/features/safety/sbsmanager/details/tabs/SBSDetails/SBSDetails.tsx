import "./SBSDetails.scss";
import SmartDropDown from "components/smartDropdown";
import { InputLabel, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import globalStyles, { primaryIconSize } from "features/budgetmanager/BudgetManagerGlobalStyles";

const SBSDetailsTab = (props: any) => {
  const { selectedRec, ...rest } = props;
  const dispatch = useAppDispatch();
  const { phaseDropDownOptions,categoryDropDownOptions } = useAppSelector((state) => state.sbsManager);

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
          <InputLabel className='inputlabel' style={{ marginBottom: '5px', marginTop: '25px' }}>
            <DescriptionOutlinedIcon style={{ marginBottom: '-4px', marginRight: '7px' }} fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />
            Description
          </InputLabel>
          <TextField
            id="description"
            variant='outlined'
            fullWidth
            multiline
            minRows={2}
            maxRows={10}
            placeholder='Enter Description'
            name='description'
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
                options={[]}
                outSideOfGrid={true}
                isSearchField={true}
                Placeholder={"Select"}
                ignoreSorting={true}
                isFullWidth
              />
            </div>
          </span>
        </div>
        <div className="eventrequest-details-content">
          <div className="eventrequest-info-data-box">
            <InputLabel className="inputlabel">Est. Start Date</InputLabel>
            <DatePickerComponent
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

          <div className="eventrequest-info-data-box">
            <InputLabel className="inputlabel">Est. End Date</InputLabel>
            <DatePickerComponent
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
        </div>
      </div>
    </div>
  );
};

export default SBSDetailsTab;
