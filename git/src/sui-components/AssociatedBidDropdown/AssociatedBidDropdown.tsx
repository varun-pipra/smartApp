import React, { useEffect, useState, useRef, Fragment } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import Select from "@mui/material/Select";
import { TextField, Button, InputAdornment } from "@mui/material";
//import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./AssociatedBidDropdown.scss";

const AssociatedBidDropdown = (props: any) => {
  const [selectedValue, setSelectedValue] = useState<any>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [adhocBidName, setAdhocBidName] = useState<any>("");
  const [isAdhocBidAlreadyExists, setIsAdhocBidAlreadyExists] = useState<boolean>(false);
  const inputRef = useRef<any>();

  const [options, setOptions] = useState<any>(props.options || []);

  React.useEffect(() => {setOptions([...props?.options])}, [props?.options])


  /**
   * Triggers when user clicks on menu item. Updating the local state and passing down the value to parent.
   * @param rec 
   * @author Srinivas Nadendla
   */
  const onMenuItemClick = (rec: any) => {
    setSelectedValue(rec.value);
    setMenuOpen(false);
    props.onSelectionChange(rec);
    setAdhocBidName('');
    setIsAdhocBidAlreadyExists(false);
  };

  const onOpenChange = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    if (menuOpen && selectedValue) {
      if (options.length > 0) {
        let updatedOptions = [...options];
        updatedOptions.forEach((rec: any) => {
          rec.isSelected = rec.value === selectedValue;
        });
        setOptions(updatedOptions);
      }
      const index = options.findIndex((rec: any)=> rec.value?.toLowerCase() === selectedValue?.toLowerCase() && !rec.isAdhoc);
      if (index === -1) {
          setAdhocBidName(selectedValue);
      }
    }
  }, [menuOpen]);

  const onCloseChange = () => {
    setMenuOpen(false);
  };

  /**
   * Checking whether to Show/Hide error message. And updates the local state for selection
   * @author Srinivas Nadendla
   */
  const onAddBtnClick = () => {
    const index = options.findIndex(
      (rec: any) => rec.value?.toLowerCase() === adhocBidName?.toLowerCase()
    );
    const isAlreadyExistsInGrid = (props.bidNamesList || []).includes(adhocBidName?.toLowerCase())
    if (index > -1 || adhocBidName === selectedValue || isAlreadyExistsInGrid) {
      setIsAdhocBidAlreadyExists(true);
    } else {
      setIsAdhocBidAlreadyExists(false);

      const adHocIndex = options.findIndex((rec: any) => rec.isAdhoc === true);
      let updatedOptions = [...options];
      const adHocObj = {
        value: adhocBidName,
        label: adhocBidName,
        id: Date.now(),
        isAdhoc: true,
      };
      if (adHocIndex > -1) {
        updatedOptions[adHocIndex] = adHocObj;
      } else {
        updatedOptions.push(adHocObj);
      }
      setOptions(updatedOptions);
      setSelectedValue(adhocBidName);
      setMenuOpen(false);
      props.onSelectionChange(adHocObj);
    }
  };

  return (
      <Select
        variant="standard"
        fullWidth={true}
        value={selectedValue}
        defaultValue={selectedValue}
        open={menuOpen}
        onOpen={onOpenChange}
        onClose={onCloseChange}
        startAdornment={
          <InputAdornment position="start">
            <span className="common-icon-bid-lookup"> </span>
          </InputAdornment>
        }
      >
        <ListSubheader className="award-bid-sub-header">
          Awarded Bids
        </ListSubheader>
        {options?.length > 0 && (
          <div className="award-bid-select-list-options">
            {options.map((rec: any) => {
              return (
                <Fragment key={rec.id}>
                  {rec.isAdhoc ? (
                    <></>
                  ) : (
                    <MenuItem
                      className={
                        "award-bid-select-menu-item " +
                        (rec.isSelected ? "Mui-selected" : "")
                      }
                      key={rec.id}
                      value={rec.value}
                      onClick={() => onMenuItemClick(rec)}
                    >
                      {rec.label}
                    </MenuItem>
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
        {options.length === 0 && (
          <div className="award-bid-empty-view">
            <div className="award-bid-empty-view_icon"></div>
            <div className="award-bid-empty-view_title">
              No Awarded Bids Found
            </div>
            <div className="award-bid-empty-view_desc">
              This vendor does not have any awarded bids available
            </div>
          </div>
        )}
        {/* Below options are duplicates will not be visible in the menu. Needed them to replicate selection. */}
        {options.map((rec: any) => {
          return (
            <MenuItem
              className="award-bid-select-menu-item-hidden"
              key={rec.id}
              value={rec.value}
            >
              {rec.label}
            </MenuItem>
          );
        })}
        <ListSubheader className="adhoc-bid-sub-header">Adhoc Bid</ListSubheader>
        <div className="ad-hoc-bid-input-btn-box">
          <TextField
            id="standard-full-width"
            fullWidth
            placeholder={"Enter name of the adhoc bid "}
            ref={inputRef}
            error={isAdhocBidAlreadyExists}
            helperText={
              isAdhocBidAlreadyExists ? "This Adhoc Bid already exists." : ""
            }
            value={adhocBidName}
            onChange={(e) => {
              setAdhocBidName(e.target.value);
              setIsAdhocBidAlreadyExists(e.target.value?.length > 0 ? selectedValue?.toLowerCase() === e.target.value?.toLowerCase() : false);
            }}
            variant="standard"
            onKeyDown={(e: any)=> e.stopPropagation()}
          />
          <Button className="add-btn-cls"
            onClick={() => onAddBtnClick()}
            disabled={adhocBidName?.length === 0 || isAdhocBidAlreadyExists}
          >
          <span className="common-icon-add-circle"></span>
          </Button>
        </div>
      </Select>
  );
};

export default AssociatedBidDropdown;
