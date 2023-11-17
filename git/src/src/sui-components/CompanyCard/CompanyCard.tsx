import React, { FC } from "react";
import "./CompanyCard.scss";
import { Avatar, Typography } from "@mui/material";
import MUIGrid from "@mui/material/Grid";
//import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
//import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
//import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
//import InfoIcon from "@mui/icons-material/Info";
import { COMPANY_TYPES } from "utilities/constant";
import DynamicTooltip from "sui-components/DynamicTooltip/DynamicTooltip";
import { formatPhoneNumber } from "utilities/commonFunctions";
interface CompanyCardProps {
  companyDetails?: any;
}

export const SUICompanyCard: FC<CompanyCardProps> = ({ companyDetails }) => {
  const getDeviceSupplierTooltip = (categories = []) => {
    return (
      <div className="device-supplier-tooltip-cats">
        {categories.map((rec: any) => {
          return (
            <div className="device-supplier-tooltip-cats_item">
              {rec.name}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="company-card-container">
      <MUIGrid
        container
        justifyContent="space-between"
        className="orginalbudgetheader"
      >
        <MUIGrid item sm={10}>
          <Typography variant="h6" className="company-header">
            {companyDetails?.name}
          </Typography>
          <Typography variant="h6" className="company-sub-header">
            {COMPANY_TYPES[companyDetails?.companyType]}
          </Typography>
        </MUIGrid>
        <MUIGrid item sm={2}>
          {/* <div onClick={closeCalculator} className="popper-close-button">
              <CloseIcon fontSize="medium" style={{ cursor: "pointer" }} />
            </div> */}
          { companyDetails?.thumbnailUrl ? <img
            src={companyDetails?.thumbnailUrl}
            alt="Avatar"
            style={{ width: "70px", height: "70px" }}
            className="company-logo"
          /> : <Avatar sx={{ backgroundColor: `#${companyDetails?.color}`, width: "24px", height: "24px", padding: "1px", marginRight: '10px' }}>{companyDetails?.displayField?.[0]?.toUpperCase()}</Avatar> }
        </MUIGrid> 
      </MUIGrid>
      <MUIGrid
        container
        justifyContent="space-between"
        className="company-content"
      >
        <MUIGrid
          item
          sm={10}
          className="company-wrap-card-details"
          style={{ borderLeft: `10px solid #${companyDetails?.colorCode}` }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="common-icon-telephone-gray company-icon-btn"></span>
            <Typography variant="h6" className="company-call-content">
						  {formatPhoneNumber(companyDetails?.phone)}
            </Typography>
          </div>
			<div style={{ display: "flex", alignItems: "center" }}>
				<span className="common-icon-email-message company-icon-btn"></span>
				<Typography variant="h6" className="company-call-content">
					{companyDetails?.email}
				</Typography>
			</div>
          <div style={{ display: "flex", alignItems: "center" }}>
        <span className="common-icon-Location-outlined company-icon-btn"></span>
        <Typography variant="h6" className="company-location-content">
              {companyDetails?.address}
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="common-icon-portfolio-newtag company-icon-btn"></span>
            <div>
              <Typography variant="h6" className="company-work-content">
                Latest Project :{" "}
                <span className="company-work-tag">
                  {" "}
                  {companyDetails?.companyProject ? companyDetails?.companyProject : 'No Data Available'}
                </span>
              </Typography>
              <Typography variant="h6" className="company-history-content">
                <span className="company-history-tag">
                  Historical :{" "}
                  <span className="company-history-sub-tag">
                  {companyDetails?.historyProject ? companyDetails?.historyProject : 'No Data Available'}
                  </span>
                </span>
              </Typography>
            </div>
          </div>
        </MUIGrid>
      </MUIGrid>

      <MUIGrid container justifyContent="space-between">
        <MUIGrid item sm={8}></MUIGrid>
        <MUIGrid item sm={4}>
          {companyDetails?.isDiverseSupplier && (
            <div
              style={{ backgroundColor: `#${companyDetails.colorCode}` }}
              className="suppier-tag">
              <span className="common-icon-diverse-supplier"></span>
              Diverse Suppier{" "}
              <DynamicTooltip title={getDeviceSupplierTooltip(companyDetails?.diverseCategories)} placement="right">
              <span className="common-icon-info-white"></span>
              </DynamicTooltip>
            </div>
          )}
          {companyDetails?.complianceStatus == "Verified" && (
            <div
              style={{
                backgroundColor: "green",
              }}
              className="compliance-tag"
            >
              {companyDetails?.complianceStatus}{" "}
              <span className="common-icon-info-white"></span>
            </div>
          )}
        </MUIGrid>
      </MUIGrid>
    </div>
  );
};

export default SUICompanyCard;
