import React, { useEffect } from "react";
import PhasesGridList from "features/safety/sbsmanager/phasesGridList/PhasesGridList";
import { PhasesData } from "data/sbsManager/sbsData";
import { hideLoadMask } from "app/hooks";

const PhasesGridListExample = () => {

  useEffect(() => {
    hideLoadMask();
  }, []);

  return (
    <div style={{ width: 400, height: 300, margin: '100px 0' }}>
      <PhasesGridList data={PhasesData}></PhasesGridList>
    </div>
  );
};

export default PhasesGridListExample;
