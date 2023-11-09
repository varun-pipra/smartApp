import "./SSDetails.scss";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getSubmitalById } from "../../stores/SmartSubmitalSlice";
const SSDetails = (props: any) => {
  const { selectedRec, ...rest } = props;
  const dispatch = useAppDispatch();
  const { submittalData,ssRightPanelData } = useAppSelector((state) => state.smartSubmittals);
  const [detailsData, setDetailsData] = useState<any>({});
  useEffect(() => {
    if(selectedRec?.specificationId ?? false) {
      let payload = {
        specBookId : selectedRec?.specBook?.id,
        submittalId : selectedRec?.uniqueid
    };
      dispatch(getSubmitalById(payload));
    } else if (ssRightPanelData?.specificationId) {
      let payload = {
          specBookId : ssRightPanelData?.specBook?.id,
          submittalId : ssRightPanelData?.uniqueid
      };
      dispatch(getSubmitalById(payload));
    };
  }, [ssRightPanelData, selectedRec]);
  useEffect(() => {
    if (submittalData) {
      setDetailsData(submittalData);
    }
  }, [submittalData]);
  return (
    <div className="submittals-details">
      <div className="submittals-details-box">
        <div className="submittals-details-header">
          <div className="title-action">
            <span className="title">Submittal Details</span>
          </div>
        </div>
        <div className="submittals-details-content">
          <span className="submittals-info-tile">
            <div className="submittals-info-label">Submittal Type</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-Budgetcalculator iconmodify"></span>
              <span className="submittals-info-data">{detailsData?.type}</span>
            </div>
          </span>
          <span className="submittals-info-tile">
            <div className="submittals-info-label">Page(s)</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-pages iconmodify iconmodify"></span>
              <span className="submittals-info-data" style={{color: "#059cdf"}}>
                {detailsData?.startPage}
              </span>
            </div>
          </span>
        </div>
        <div className="submittals-details-content" style={{gridTemplateColumns: 'repeat(1, 100%)'}}>
          <div className="submittals-info-tile">
            <div className="submittals-info-label">Submittal Title</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-title iconmodify"></span>
              <span className="contract-info-data">{detailsData?.title}</span>
            </div>
          </div>
        </div>

        <div className="submittals-details-content" style={{gridTemplateColumns: 'repeat(1, 100%)'}}>
          <div className="submittals-info-tile">
            <div className="submittals-info-label">Submittal Summary</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-Submittal-Summary iconmodify"></span>
              <span className="contract-info-data">{detailsData?.summary}</span>
            </div>
          </div>
        </div>
        <div className="submittals-details-header">
          <div className="title-action">
            <span className="title">Associated Spec Details</span>
          </div>
        </div>
        <div className="submittals-details-content">
          <span className="submittals-info-tile">
            <div className="submittals-info-label">Spec Section Title</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-specbook iconmodify"></span>
              <span className="submittals-info-data">
                {detailsData?.sectionTitle}
              </span>
            </div>
          </span>

          <span className="submittals-info-tile">
            <div className="submittals-info-label">Spec Name</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-specbook iconmodify"></span>
              <span className="submittals-info-data">
                {detailsData?.specBook?.fileName}
              </span>
            </div>
          </span>

          <span className="submittals-info-tile">
            <div className="submittals-info-label">Spec Display Name</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-spec-number iconmodify"></span>
              <span className="submittals-info-data">
                {detailsData?.specBook?.displayName}
              </span>
            </div>
          </span>

          <span className="submittals-info-tile">
            <div className="submittals-info-label">Division</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-division iconmodify"></span>
              <span className="contract-info-data">{`${detailsData?.division?.number ?? ""} - ${detailsData?.division?.text ?? ""}`}</span>
            </div>
          </span>

          <span className="submittals-info-tile">
            <div className="submittals-info-label">Bid Package</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-bid-package iconmodify"></span>
              <span className="contract-info-data">
                {detailsData?.bidPackageName}
              </span>
            </div>
          </span>

          <span className="submittals-info-tile">
            <div className="submittals-info-label">Pages</div>
            <div className="submittals-info-data-box">
              <span className="common-icon-pages iconmodify"></span>
              <span className="contract-info-data" style={{color: "#059cdf"}}>
                {detailsData?.startPage}
              </span>
            </div>
          </span>
        </div>
        <br />
      </div>
    </div>
  );
};

export default SSDetails;
