import "./SMDetails.scss";
import React, { useState, useEffect } from "react";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import SmartDropDown from "components/smartDropdown";
import { InputLabel } from "@mui/material";
import { getSpecSectionById, getspecSectionById, setChangedSMDetailsValue, setEnableSaveButton, setRightPanelData } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import CostCodeDropdown from "components/costcodedropdown/CostCodeDropdown";
import { getCostCodeDivisionList } from "app/common/appInfoSlice";
const SMDetails = (props: any) => {
  const { selectedRec, ...rest } = props;
  const dispatch = useAppDispatch();
  const { specBookSection,selectedRecsData } = useAppSelector((state) => state.specificationManager);
  const [detailsData, setDetailsData] = useState<any>([]);
  const [dataValues, setDataValues] = useState<any>({ division: '', bidPackage: '', sbsValue: [], phase: [] });
  const { divisionList } = useAppSelector((state) => state.specificationManager);
  const { bidPackageDropdownValues,changedSMDetailsValue, smEnableButton } = useAppSelector((state) => state.specificationManager);
  useEffect(() => {
          if(selectedRec?.id ?? false) {
            dispatch(getSpecSectionById(selectedRec?.id));
          } else if(selectedRecsData?.[0]?.data?.id ?? false) {
            dispatch(getSpecSectionById(selectedRecsData?.[0]?.data?.id));
          }
  }, [selectedRec])
  useEffect(() => {
    if (Array.isArray(specBookSection) && specBookSection?.length > 0) {
      const data = specBookSection?.[0];
      setDataValues({
        division: data?.division?.text,
        bidPackage: data.bidPackageName,
        sbsValue: [data?.sbsName],
        phase: [data?.sbsPhase]
      });
      setDetailsData(data);
      dispatch(setRightPanelData(data));
    }
  }, [specBookSection])
  const GetDropdownGroupName = (val:any) => {
        if(val && divisionList?.length > 0) {
          const find = [...divisionList]?.filter((x) => x?.options?.find((item:any) => item.value === val));
          return find?.[0]?.name ?? find?.[0]?.text ?? find?.[0]?.value;
        }
  };
  const [updatePayload, setUpdatePayload] = useState({});
  useEffect(() => {
      if(!smEnableButton) {
        setUpdatePayload({});
      }
  },[smEnableButton]);
  useEffect(() => {
    if(updatePayload) {
      dispatch(setChangedSMDetailsValue([updatePayload]));
    }
},[updatePayload]);
  const handleChange = (val: any, name: any, rec?: any) => {
    dispatch(setEnableSaveButton(true));
    if (name === "division") {
      divisionList.findIndex((ele: any) => {
        if (ele.name === GetDropdownGroupName(val)) {
          ele.options.findIndex((data: any) => {
            if (data.name === val) {
              setUpdatePayload({
                ...updatePayload,
                id : selectedRec?.id ?? selectedRecsData?.[0]?.data?.id,
                "division" : { text: data.value, number: data.id.toString()}
              })
            }
          });
        }
      });
    } else if (name === "bidPackage") {
      setUpdatePayload({
       ...updatePayload,
      id : selectedRec?.id ?? selectedRecsData?.[0]?.data?.id,
      bidPackageId : rec.id,
      bidPackageName : rec.value
      })
    };
    const dataClone = { ...dataValues, [name]: val };
    setDataValues(dataClone);
  };
  console.log("updatePayload", updatePayload, changedSMDetailsValue)
  return (
    <div className="event-details">
      <div className="eventrequest-details-box">
        <div className="eventrequest-details-header">
          <div className="title-action">
            <span className="title">
              Spec Details
            </span>
          </div>
        </div>
        <div className="eventrequest-details-content">
          <span className="eventrequest-info-tile">
            <div className="eventrequest-info-label">Spec Book</div>
            <div className="eventrequest-info-data-box">
              <span className="common-icon-specbook iconmodify"></span>
              <span className="eventrequest-info-data">{detailsData?.specBook?.fileName}</span>
            </div>
          </span>
          <span className="eventrequest-info-tile">
            <div className="eventrequest-info-label">Display Name</div>
            <div className="eventrequest-info-data-box">
              <span className="common-icon-specbook iconmodify"></span>
              {/* <>
								<span className="contract-info-company-icon">
									<img src='' style={{ height: '28px', width: '28px', borderRadius: "50%" }} />
								</span>
							</> */}
              <span className="eventrequest-info-data">
                {detailsData?.specBook?.displayName}
              </span>
            </div>
          </span>
          <span className="eventrequest-info-tile">
            <div className="eventrequest-info-label">Received Date</div>
            <div className="eventrequest-info-data-box">
              <span className="common-icon-DateCalendar"></span>
              <span className="contract-info-data">{convertDateToDisplayFormat(detailsData?.specBook?.receivedDate)}</span>
            </div>
          </span>
        </div>
        {/* <div className='eventrequest-details-header'>
					<div className='title-action'>
						<span className='title'>Client Company Point of Contact</span>
					</div>
				</div> */}
        <div className="eventrequest-details-content">
          <span className="eventrequest-info-tile">
            <div className="eventrequest-info-label">Issued Date</div>
            <div className="eventrequest-info-data-box">
              <span className="common-icon-DateCalendar"></span>
              {/* <>
								<span className="contract-info-company-icon">
									<img src='' style={{ height: '100%', width: '100%', borderRadius: "50%" }} />
								</span>
							</> */}
              <span className="eventrequest-info-data">{convertDateToDisplayFormat(detailsData?.specBook?.issuedDate)}</span>
            </div>
          </span>

          <span className="eventrequest-info-tile">
            <div className="eventrequest-info-label">Spec Number</div>
            <div className="eventrequest-info-data-box">
              <span className="common-icon-spec-number iconmodify"></span>
              <span className="contract-info-data">{detailsData?.number}</span>
            </div>
          </span>

          <span className="eventrequest-info-tile">
            <div className="eventrequest-info-label">Pages</div>
            <div className="eventrequest-info-data-box">
              <span className="common-icon-pages iconmodify"></span>
              <span className="contract-info-data">{detailsData?.startPage} - {detailsData?.endPage}</span>
            </div>
          </span>
        </div>
        <div className="smdetails-dropdown">
          <div className="fields-spec">
              <CostCodeDropdown
              outSideOfGrid={true}
              label="Division"
              options={divisionList ?? []}
              required={true}
              selectedValue={GetDropdownGroupName(dataValues.division) + '|' + (dataValues?.division ?? '')}
              startIcon={
                <span
                  className="common-icon-division"
                  style={{ color: "#ed7532", fontSize: "1em" }}
                ></span>
              }
              checkedColor={'#0590cd'}
              onChange={(value) => handleChange(value?.split('|')?.[1], 'division')}
              showFilter={true}
              sx={{
                ".MuiSelect-icon": {
                  display: "none",
                }
              }}
              Placeholder={'Select'}
              filteringValue={GetDropdownGroupName(dataValues.division) ?? ''}
            />
          </div>
          <div>
            <InputLabel className="inputlabel">Bid Package</InputLabel>
            <div>
              <SmartDropDown
                LeftIcon={<span className="common-icon-bid-lookup iconmodify"> </span>}
                outSideOfGrid={true}
                isSearchField={false}
                isFullWidth
                required
                Placeholder={"Select"}
                // menuProps={classes.menuPaper}
                isMultiple={false}
                options={bidPackageDropdownValues || []}
                selectedValue={dataValues.bidPackage}
                handleChange={(value: any) => {
                  const selRec: any = [...bidPackageDropdownValues].find(
                    (rec: any) => rec.value === value.toString()
                  );
                  handleChange(selRec?.value, "bidPackage", selRec);
                }}
              />
            </div>
          </div>
          {/* <div>
            <InputLabel className="inputlabel">
              System Breakdown Structure(SBS)
            </InputLabel>
            <div>
              <SmartDropDown
                LeftIcon={<span className="common-icon-system-breakdown iconmodify"></span>}
                outSideOfGrid={true}
                isSearchField={false}
                isFullWidth
                Placeholder={"Select"}
                // menuProps={classes.menuPaper}
                isMultiple={false}
                options={SBSData}
                selectedValue={dataValues.sbsValue}
                handleChange={(val: any) => handleChange(val, 'sbsValue')}
              />
            </div>
          </div>
          <div>
            <InputLabel className="inputlabel">Phase</InputLabel>
            <div>
              <SmartDropDown
                LeftIcon={<span className="common-icon-phase iconmodify"></span>}
                outSideOfGrid={true}
                isSearchField={false}
                isFullWidth
                Placeholder={"Select"}
                options={PhaseData}
                selectedValue={dataValues.phase}
                handleChange={(val: any) => handleChange(val, 'phase')}
                isMultiple={false}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SMDetails;
