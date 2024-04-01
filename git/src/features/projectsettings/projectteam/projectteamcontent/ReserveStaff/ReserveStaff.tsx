import React from "react";
import { makeStyles, createStyles } from "@mui/styles";
import SmartDropDown from "components/smartDropdown";
import { Avatar, InputLabel } from "@mui/material";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import './ReserveStaff.scss';
import IQButton from "components/iqbutton/IQButton";
const useStyles: any = makeStyles((theme: any) =>
  createStyles({
    menuPaper: {
      maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
      maxWidth: "160px !important",
    },
  })
);
const ReserveStaffContent = (props: any) => {
  const classes = useStyles();
  const { data,projectData, isReadOnly = false,handleChange, onSubmit= () => {}, ...rest } = props;
  const defaultFormData = {
    startDate: "",
    endDate: "",
    projects : []
  };
  const [formData, setFormData] = React.useState<any>(defaultFormData);
  const {startDate, endDate, projects} = formData;
  const handleOnChange = (key: any, value: any) => {
    let values = { ...formData, [key]: value };
    handleChange && handleChange(values);
    setFormData(values);
  };
  React.useEffect(() => {
      if(data?.length > 0) {
        const selectedProjects = [...data]?.map((item: any) => (item?.currentProjects || [])?.map((rec:any) => rec.id))?.flat();
        setFormData({...formData, ['projects'] : selectedProjects})
      }
  },[data]);
  const handleSubmit = () => {
    onSubmit(formData);
    setFormData(defaultFormData);
  };
  return (
    <div className="reserve-staff-container">
      <div className="reserve-staff-container_text">Reserved for</div>
      <div className="reserve-staff-container_content">
      {(data || [])?.map((item:any, index:any) => {
        return <div key={index} className="reserve-staff-container_imgContainer">
                  <Avatar src={item?.thumbnailUrl} className="base-custom-img" />
                  {/* <img src={item?.thumbnailUrl} alt="Avatar" className="base-custom-img"/> */}
                  <span className="reserve-text">{item?.displayName}</span>
              </div>
      })}
      </div>
      <div className="reserve-staff-container_projects">
        <SmartDropDown
          options={projectData}
          LeftIcon={
            <span className="common-icon-staff-projects userdetails_icons userdetails_icon_Color" />
          }
          dropDownLabel="Projects"
          doTextSearch={false}
          isSearchField={false}
          isMultiple={true}
          selectedValue={formData?.projects || []}
          isFullWidth
          outSideOfGrid={true}
          handleChange={(value: any) => handleOnChange("projects", value)}
          handleChipDelete={(value: any) => handleOnChange("projects", value)}
          menuProps={classes.menuPaper}
          sx={{ fontSize: "18px" }}
          Placeholder={"Select"}
          showCheckboxes={true}
          hideNoRecordMenuItem={true}
          reduceMenuHeight={true}
          isReadOnly={isReadOnly}
          optionImage={false}
        />
      </div>
      <div className="reserve-staff-container_dates">
        <div>
          <InputLabel
            required
            className="contract-info-label"
            style={{ fontSize: "14px" }}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Start Date
          </InputLabel>
          <DatePickerComponent
            zIndex={9999}
            containerClassName="iq-customdate-cont"
            defaultValue={convertDateToDisplayFormat(formData?.startDate)}
            onChange={(val: any) =>
              handleOnChange(
                "startDate",
                val ? new Date(val)?.toISOString() : val
              )
            }
            maxDate={formData?.endDate !== '' ? new Date(formData?.endDate) : new Date('12/31/9999')}
            render={
              <InputIcon
                placeholder="MM/DD/YYYY"
                className="custom-input rmdp-input"
              />
            }
          />
        </div>
        <div>
          <InputLabel
            required
            className="contract-info-label"
            style={{ fontSize: "14px" }}
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            End Date
          </InputLabel>
          <DatePickerComponent
            zIndex={9999}
            containerClassName="iq-customdate-cont"
            defaultValue={convertDateToDisplayFormat(formData?.end)}
            onChange={(val: any) =>
              handleOnChange(
                "endDate",
                val ? new Date(val)?.toISOString() : val
              )
            }
            minDate={new Date(formData?.startDate)}
            render={
              <InputIcon
                placeholder="MM/DD/YYYY"
                className="custom-input rmdp-input"
              />
            }
          />
        </div>
      </div>
      <div className="reserve-staff-container_btn">
						<IQButton
							disabled={!(startDate !== '' && endDate !=='' && projects?.length !== 0)}
							onClick={handleSubmit}
						>
							RESERVE STAFF
						</IQButton>
      </div>
    </div>
  );
};
export default ReserveStaffContent;
