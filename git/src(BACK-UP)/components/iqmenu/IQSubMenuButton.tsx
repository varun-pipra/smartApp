import React, { useState } from "react";
import "./IQSubMenuButton.scss";
import { Popover } from "@mui/material";
import { PopoverSelect } from "components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu";
import IQButton from "components/iqbutton/IQButton";

const IQSubMenuButton = (props: any) => {
  const { menuOptions, handleMenuChange, handleSubMenuChange, ...others } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openDrpDn = Boolean(anchorEl);
  const id = openDrpDn ? "submenu-popover" : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (childItem: any, parentItem?:any) => {
      handleClose();
      handleMenuChange(childItem);
  };

  return (
    <div>
      <IQButton
				color='blue'
				id='iq-menu-button'
				aria-controls={openDrpDn ? 'iq-menu-button' : undefined}
				aria-haspopup='true'
				aria-expanded={openDrpDn ? 'true' : undefined}
				variant='contained'
				disableElevation
				onClick={handleClick}
				startIcon={props?.startIcon || ''}
				endIcon={props?.endIcon || ''}
				disabled={props?.disabled || false}
			>
				{props?.label}
			</IQButton>
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
          options={menuOptions}
          allowSubMenu={true}
          defaultValue={{}}
          open={open}
          onChange={handleChange}
        />
      </Popover>
    </div>
  );
};
export default IQSubMenuButton;
