import React, { useEffect, useState } from "react";
import PhasesColorPicker from "features/safety/sbsmanager/phasesColorPicker/PhasesColorPicker";
import { hideLoadMask } from "app/hooks";

const PhasesColorPickerExample = () => {
  const [colorCode, setColorCode] = useState<any>("#9C27B0");
  useEffect(() => {
    hideLoadMask();
  }, []);
  return (
    <PhasesColorPicker
      selectedColor={colorCode}
      onColorCodeChange={(color: any) => {
        setColorCode(color); //Add logic to show confirm modal
      }}
    ></PhasesColorPicker>
  );
};

export default PhasesColorPickerExample;
