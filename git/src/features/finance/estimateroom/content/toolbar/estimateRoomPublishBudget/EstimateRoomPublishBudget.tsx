import {
  Button,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  Radio,
  TextField,
} from "@mui/material";
import "./EstimateRoomPublishBudget.scss";
import SMSpecBookDailog from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import { useEffect, useState } from "react";
import SmartDropDown from "components/smartDropdown";
import { useAppSelector } from "app/hooks";
export const budgetList = [
  { label: "Budget3", value: "Budget3", id: 0, status: "Active" },
  { label: "Budget2", value: "Budget1", id: 1, status: "Draft" },
  { label: "Zone 4 Budget ", value: "Budget2", id: 2, status: "Draft" },
];
const EstimateRoomPublishBudget = (props: any) => {
  const { setOpen, onPublishBudgetClose, ...res } = props;
  const [checkBoxValue, setCheckBoxValue] = useState("createNewBudget");
  const [budgetName, setBudgetName] = useState("");

  useEffect(() => {
    console.log(checkBoxValue);
  }, [checkBoxValue]);
  const publishBudgetContent = () => {
    return (
      <>
        <div>
          <p>How do you want to Publish the selected Estimate to the Budget?</p>
        </div>
        <div className="estimate-room-radio-options">
          <div
            className={`estimate-room-radio-option  ${
              checkBoxValue === "createNewBudget"
                ? "active-radio-contaner"
                : "inactive-radio-container"
            }`}
          >
            <FormControlLabel
              value={"UpdateExisting"}
              control={
                <Radio
                  checked={checkBoxValue === "createNewBudget"}
                  onChange={(value: any) => setCheckBoxValue("createNewBudget")}
                  value="a"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "A" }}
                />
              }
              label="Create New Budget"
              labelPlacement="start"
              sx={{
                marginLeft: "0px !important",
                marginRight: "0px !important",
                display: "flex !important",
                justifyContent: "space-between",
                "& .MuiTypography-root": {
                  paddingLeft: "0px !important",
                  fontWeight: "bold",
                },
              }}
            />
          </div>
          <div
            style={{ marginLeft: "30px" }}
            className={`estimate-room-radio-option ${
              checkBoxValue === "AddToExistingBudget"
                ? "active-radio-contaner"
                : "inactive-radio-container"
            }`}
          >
            <FormControlLabel
              // value={'UpdateExisting'}
              // control={<Radio />}
              label="Add to Existing Budget"
              labelPlacement="start"
              control={
                <Radio
                  checked={checkBoxValue === "AddToExistingBudget"}
                  onChange={(value: any) =>
                    setCheckBoxValue("AddToExistingBudget")
                  }
                  value="a"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "A" }}
                />
              }
              sx={{
                marginLeft: "0px !important",
                marginRight: "0px !important",
                display: "flex !important",
                justifyContent: "space-between",
                "& .MuiTypography-root": {
                  paddingLeft: "0px !important",
                  fontWeight: "bold",
                },
              }}
            />
          </div>
        </div>
        <div className="estimate-room-droup-down-field-contaner">
          <div>
            {checkBoxValue === "AddToExistingBudget" ? (
              <>
                <div>Budget</div>
                <span>
                  <SmartDropDown
                    LeftIcon={
                      <div
                        className="common-icon-budget-manager"
                        style={{ fontSize: "1rem", color: "#ee7433" }}
                      ></div>
                    }
                    options={budgetList}
                    isSearchField={false}
                    outSideOfGrid={true}
                    isFullWidth
                    displayEmpty={true}
                    Placeholder={"Select"}
                    ignoreSorting={true}
                  />
                </span>
              </>
            ) : (
              <div>
                <div>Budget Name</div>
                <TextField
                  id="name"
                  fullWidth
                  placeholder={"Enter Name of the Budget"}
                  name="name"
                  variant="standard"
                  value={budgetName}
                  onChange={(e: any) => setBudgetName(e.target?.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <div
                          className="common-icon-budget-manager"
                          style={{ fontSize: "1rem", color: "#ee7433" }}
                        ></div>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const onActionClick = (action: any) => {
    onPublishBudgetClose();
  };

  const customBtns = () => {
    return (
      <>
        <Button className="cancel-cls" onClick={onPublishBudgetClose}>
          CANCEL
        </Button>
        <Button
          className="yes-cls"
          variant="contained"
          autoFocus
          disabled={
            checkBoxValue === "createNewBudget" && budgetName.length < 1
          }
        >
          PUBLISH
        </Button>
      </>
    );
  };

  return (
    <SMSpecBookDailog
      open={setOpen}
      contentText={publishBudgetContent()}
      title={""}
      showActions={false}
      dialogClose={true}
      helpIcon={false}
      iconTitleContent={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>Publish to Budget</div>
        </div>
      }
      onAction={(type: any, action: any) => {
        onActionClick(action);
      }}
      customButtons={true}
      customButtonsContent={customBtns()}
    />
  );
};

export default EstimateRoomPublishBudget;
