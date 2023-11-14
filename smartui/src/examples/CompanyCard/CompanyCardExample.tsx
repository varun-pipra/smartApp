import * as React from "react";
import SUICompanyCard from "sui-components/CompanyCard/CompanyCard";
import { Typography } from "@mui/material";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const CompanyCardExample = (props: any) => {
  const companyDetails = {
    "id": "3de2bda7-5ce7-4adf-b5f3-008568e26434",
    "objectId": 12462144,
    "isRestricted": false,
    "thumbnailUrl": "https://central.smartappbeta.com/skins/base/img/h_200dp.png",
    "calendarId": "557",
    "isImportedFromOrg": false,
    "name": "Horizon Engineering Services Co.",
    "phone": "4012846734",
    "website": "horizon-eservices.com",
    "colorCode": "F57F17",
    "vendorId": "",
    "hasSubCompany": false,
    "companyType": 1,
    "isDiverseSupplier": true,
    "complianceStatus": "Not Verified",
    "address": "street",
    "tradeName": null,
    "categories": [{category: "Minority-Owned Business"}, {category: "Small Business Enterprise"}]
  };
  const CompnayCardTooltip = styled(({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			      backgroundColor: "white",
            borderRadius: 5,
            width: "550px",
            zIndex: "108px",
            marginTop: "10px",
            maxWidth: 550,
		},
	});


  return (
    <>
    <CompnayCardTooltip enterDelay={700}
			{...props}
			title={<SUICompanyCard
        companyDetails={companyDetails}
      />}>
         <Typography>
        Hover with a Popover.
      </Typography>
      </CompnayCardTooltip>
      
    </>
  );
};

export default CompanyCardExample;
