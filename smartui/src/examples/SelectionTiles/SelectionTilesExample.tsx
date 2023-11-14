import React from "react";
import SUISelectionTiles from "sui-components/SelectionTiles/SUISelectionTiles";

const SelectionTilesExample = () => {
  const data = [
    {
      title: "Percent Complete",
      desc: "Payout based on Percentage Work Completion and set Percentage Payout.",
      recordId: 1,
    },
    {
      title: "Unit of Measure",
      desc: "Payout based on Percentage Work Completion and set Percentage Payout.",
      recordId: 2,
    },
    {
      title: "Dollar Amount",
      desc: "Payout based on Percentage Work Completion and set Percentage Payout.",
      recordId: 3,
    },
    {
      title: "Through Date",
      desc: "Payout based on Percentage Work Completion and set Percentage Payout.",
      recordId: 4,
    },
  ];

  const onSelectedTileChange = (tile: any) => {
    console.log(tile);
  };
  return (
    <SUISelectionTiles
      tilesData={data}
      readOnly={false}
      selectedTile={(tile: any) => onSelectedTileChange(tile)}
    ></SUISelectionTiles>
  );
};
export default SelectionTilesExample;
