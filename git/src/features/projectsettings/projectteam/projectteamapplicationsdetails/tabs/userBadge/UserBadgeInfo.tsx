import React, { useEffect, useState } from "react";
import "./UserBadgeInfo.scss";
import { Button, FormControl, Popover } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { PopoverSelect } from "components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu";

const SUIUserBadgeInfo = (props: any) => {
  const {
    badgeOptions,
    defaultValue,
    handleChange,
    selectedValue,
    handleChildrenMenu,
    ...others
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openDrpDn = Boolean(anchorEl);
  const id = openDrpDn ? "simple-popover" : undefined;
  const [userBadgeValue, setUserBadgeValue] = useState("");

  useEffect(() => {
    setUserBadgeValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (selectedValue || selectedValue >= 0) {
      setUserBadgeValue(selectedValue);
      handleClose();
    }
  }, [selectedValue]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleValueChange = (item: any) => {
    setUserBadgeValue(item.text);
    handleClose();
    if (item?.type === "custom" ?? false) {
      handleChildrenMenu(item);
    } else {
      handleChange(item);
    }
  };

  return (
    <div className="user-badge-info-cont">
      <span style={{ lineHeight: "45px" }}>Badge Info</span>
      <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
        <Button
          variant="contained"
          disableElevation
          className="user-badge-drp-btn"
          onClick={handleClick}
          startIcon={<div className="common-icon-badge"></div>}
          endIcon={<KeyboardArrowDown />}
        >
          {userBadgeValue}
        </Button>

        <Popover
          id={id}
          open={openDrpDn}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <PopoverSelect
            showNone={true}
            options={badgeOptions}
            allowSubMenu={true}
            defaultValue={{}}
            open={open}
            onChange={handleValueChange}
          />
        </Popover>
      </FormControl>
    </div>
  );
};
export default SUIUserBadgeInfo;
