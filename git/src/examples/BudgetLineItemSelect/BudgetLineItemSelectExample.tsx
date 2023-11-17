import React from "react";

import SUIBudgetLineItemSelect from "sui-components/BudgetLineItemSelect/BudgetLineItemSelect";
import { Box } from "@mui/material";

const SUIBudgetLineItemSelectExample = () => {
  const budgetLineItems: any = [
    {
      value: 1239,
      label: "01 - General Requirement",
      options: [
        {
          value: 1256,
          label: "General Contractor 1001 Test Test Test Test Test TEst Test Test Test Test TEstTestTestTestTest TEst Test Test",
          colVal: '$400'
        },
        {
          value: 1257,
          label: "General Contractor- Airports 1002",
          colVal: '$800'
        },
        {
          value: 1258,
          label: "General Contractor- Churches 1003",
          colVal: '$400'
        },
        {
          value: 1259,
          label: "General Contractor- Commercial 1004",
          colVal: '$300'
        },
        {
          value: 1298,
          label: "Construction Cleaning Services 1710",
          colVal: '$400'
        },
        {
          value: 1299,
          label: "Insurance and Bonding 1905",
          colVal: '$500'
        },
      ],
    },
    {
      value: 1191,
      label: "02 - Existing Conditions",
      options: [
        {
          value: 1300,
          label: "Site Work Supplier 2010",
          colVal: '$400'
        },
        {
          value: 1301,
          label: "Aggregate Manufacture Supplier 2040",
          colVal: '$200'
        },
        {
          value: 1335,
          label: "Fences & Gates 2830",
          colVal: '$300'
        },
        {
          value: 1336,
          label: "Landscaping and Irrigation 2900",
          colVal: '$600'
        },
      ],
    },
    {
      value: 1241,
      label: "03 - Concrete",
      options: [
        {
          value: 1337,
          label: "Concrete Contractor 3010",
          colVal: '$400'
        },
        {
          value: 1338,
          label: "Concrete Supplier 3050",
          colVal: '$900'
        },
        {
          value: 1354,
          label: "Concrete Restoration and Cleaning 3700",
          colVal: '$1000'
        },
      ],
    },
    {
      value: 1193,
      label: "04 - Masonry",
      options: [
        {
          value: 1355,
          label: "Masonry 4200",
          colVal: '$400'
        },
        {
          value: 1361,
          label: "Masonry Restoration and Cleaning 4500",
          colVal: '$50'
        },
        {
          value: 1362,
          label: "Special Masonry Installations 4550",
          colVal: '$200'
        },
      ],
    },
  ];
  return (
    <div style={{ width: 600 }}>
    <Box>
      <SUIBudgetLineItemSelect
        lineItemlabel = 'Budget Line Item'
        options={budgetLineItems}
      ></SUIBudgetLineItemSelect>
    </Box>
    </div>
  );
};
export default SUIBudgetLineItemSelectExample;
