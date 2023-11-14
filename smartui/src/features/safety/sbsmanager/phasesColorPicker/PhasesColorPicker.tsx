import React, { useState } from "react";
import { PhasesColors } from "../utils";
import "./PhasesColorPicker.scss";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const PhasesColorPicker = (props: any) => {
  const [showTooltip, setShowTooltip] = useState<any>(false);

  /**
   * On color code item selection passing the value to parent
   * @param colorCode 
   * @author Srinivas Nadendla
   */
  const onColorItemClick = (colorCode: any) => {
    props.onColorCodeChange(colorCode);
  };

  /**
   * Mapping with phaseColors and generating html with colors
   * @returns Tooltip content
   * @author Srinivas Nadendla
   */
  const getTooltipTmpl = () => {
    return (
      <div className="phases-color-picker">
        {PhasesColors.map((color: any) => {
          return (
            <div
              style={{ backgroundColor: color }}
              className={
                "phases-color-picker_item " +
                (props.selectedColor === color ? "selected" : "")
              }
              onClick={(e)=> onColorItemClick(color)}
            >
               { props.selectedColor === color && <span className="common-icon-tick"></span>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
      <div>
        <Tooltip
          title={getTooltipTmpl()}
          arrow
          open={showTooltip}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          id="phases-color-picker-tooltip"
          onClose={() => setShowTooltip(false)}
        >
          <div
            className="phases-color"
            style={{ backgroundColor: props.selectedColor }}
            onClick={() => setShowTooltip(true)}
          > <span className="common-icon-phase"></span></div>
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default PhasesColorPicker;
