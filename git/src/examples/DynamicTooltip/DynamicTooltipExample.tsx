import React from "react";

import DynamicTooltip from "sui-components/DynamicTooltip/DynamicTooltip";
import SUIGrid from "sui-components/Grid/Grid";

const DynamicTooltipExample = () => {
  /**
   * Wherever we use this component, create and pass the component which needs to be shown inside the tooltip.
   * @returns Template to render inside the tooltip
   */
  const getCustomChildTemplate = () => {
    return (
      <div className="example-tooltip-child">
        <div>Contract Contract Revised & Resubmitted</div>
        <input type="text" />
        <button type="button">Submit</button>
      </div>
    );
  };

  const getGridAsChild = ()=>{
    return (
        <div style={{height: 200, width: 400}}>
        <SUIGrid
			headers={[
                {
                    headerName: "Budget Line Item",
                    field: "budgetLine"
                },
                {
                    headerName: "Budget Estimate",
                    field: "estimate"
                },
            ]}
			data={[
                {
                    budgetLine: "0001 - 00010-Accountant-L - Labor",
                    estimate: '$ 12,000',
                },
                {
                    budgetLine: "0004 - 02000-Site Construction-OC - Owner Cost",
                    estimate: '$ 10,000',
                },
                {
                    budgetLine: "0006 - 03050-Concrete Materials-M - Materials",
                    estimate: '$5,000',
                },
            ]}
		></SUIGrid>
        </div>
    )
  };

  /**
   * We can pass down an other mui tooltip props needed
   */
  return (
    <>
      <DynamicTooltip title={getCustomChildTemplate()} placement="left">
        <p>Show Tooltip</p>
      </DynamicTooltip>

      <DynamicTooltip title={getGridAsChild()} placement="top">
        <p style={{margin: 30}}>Show Grid In tooltip</p>
      </DynamicTooltip>
    </>
  );
};

export default DynamicTooltipExample;
