import React from "react";
import SUIAwardedBidderTooltip from "sui-components/AwardedBidderTooltip/AwardedBidderTooltip";


const SUIAwardedBidderTooltipExample = () => {
    const rowsContent = [
        {
          id: 1,
          company: "Rochester Painting & Company",
          amount: "$1,200",
          logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
          isAwarded: false,
        },
        {
          id: 2,
          company: "Florida Compnay",
          amount: "$1,150",
          logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
        },
        {
          id: 3,
          company: "Asian Paints",
          amount: "$1,100",
          logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
        },
        {
          id: 1,
          company: "American Paintings & Company",
          amount: "1,200",
          logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
          isAwarded: true,
        },
        {
          id: 2,
          company: "EIPSano Interirors",
          amount: "1,100",
          logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
        },
        {
          id: 3,
          company: "Tata Birla",
          amount: "1,000",
          logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
        },
      ];
  return (
    <div >
      <SUIAwardedBidderTooltip tooltipData={rowsContent}
      ></SUIAwardedBidderTooltip>
    </div>
  );
};
export default SUIAwardedBidderTooltipExample