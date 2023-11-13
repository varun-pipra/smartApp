import { useAppDispatch, useAppSelector } from "app/hooks";
import IQButton from "components/iqbutton/IQButton";
import IQGridLID from "components/iqgridwindowdetail/IQGridWindowDetail";
import React, { memo, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import './SbsManagerApplicationLID.scss';
import ReferenceFiles from './tabs/referencefiles/ReferenceFiles';
import SBSDetailsTab from "./tabs/SBSDetails/SBSDetails";
import moment from "moment";
import { AdditionalInfo } from "./tabs/additionalInfo/AdditionalInfo";

import {getChangeSbsById} from "../operations/sbsManagerSlice"
const SbsManagerApplicationLID = memo(({ data, ...props }: any) => {
  const dispatch = useAppDispatch();
  const { smEnableButton } = useAppSelector(
    (state) => state.specificationManager
  );
  const [lidTitle, setLidTitle] = useState(data?.category?.name);

  const loadData = (id: any) => {
		dispatch(getChangeSbsById(id));
	};

  useEffect(() => {
		// To show the grid data if GET Api fails
		if (data?.id) {
			loadData(data.id);
		}
	}, [data?.id]);
  const tabConfig = [
    {
      tabId: "SBSDetails",
      label: "Details",
      showCount: false,
      iconCls: "common-icon-smart-submittals",
      content: <SBSDetailsTab selectedRec={data} />,
    },
    {
      tabId: "SBSAdditionalInfo",
      label: "Additional Info",
      showCount: false,
      iconCls: "common-icon-referance",
			content: <AdditionalInfo />
      
    },
    {
      tabId: "SBSReferenceFiles",
      label: "Reference Files",
      showCount: false,
	  iconCls: "common-icon-referance",
	  content:(<ReferenceFiles/>)
    },
    {
      tabId: "SBSLink",
      label: "Links",
      showCount: false,
      iconCls: "common-icon-Links",
    },
  ];
  const handleSave = () => {};
  const lidProps = {
    title: (
      <TextField
        className="textField"
        variant="outlined"
        onChange={(e: any) => setLidTitle(e.target?.value)}
        value={lidTitle}
      />
    ),
    defaultTabId: "SBSDetails",
    defaultSpacing: true,
    headContent: {
      showCollapsed: true,
      regularContent: <HeaderContent data={data} />,
      collapsibleContent: <CollapseContent />,
    },
    tabs: tabConfig,
    footer: {
      hideNavigation: true,
      rightNode: (
        <>
          <IQButton
            className="ce-buttons"
            color="blue"
            disabled={!smEnableButton}
            onClick={() => handleSave()}
          >
            SAVE
          </IQButton>
        </>
      ),
      leftNode: <></>,
    },
  };

  return (
    <div className="sbs-lineitem-detail">
      <IQGridLID {...lidProps} {...props} />
    </div>
  );
});

const HeaderContent = memo((props: any) => {
  const { data, ...rest } = props;

  return (
    <div className="kpi-section">
      <div className="kpi-vertical-container">
        <div className="lid-details-container">
          <span className="budgetid-label grey-font">ID:</span>
          <span className="grey-fontt">{data?.displayId || ""}</span>
          <span className="budgetid-label grey-font">Phase:</span>
          <span
            className="status-pill"
            style={{ backgroundColor: data?.phase?.color, color: "#fff" }}
          >
            <span className="common-icon-phase"></span>
            {data?.phase?.name}
          </span>
          <span className="last-modified-label grey-font">Last Modified:</span>
          <span className="budgetid-label grey-fontt">
            {`${moment(data?.modifiedOn).format("MM/DD/YYYY hh:mm A")} by`}{" "}
            {`${data?.modifiedBy?.lastName}, ${data?.modifiedBy?.firstName}`}
          </span>
        </div>
      </div>
    </div>
  );
});

const CollapseContent = memo((props: any) => {
  const { data, ...rest } = props;
  return (
    <div className="kpi-section">
      <div className="kpi-vertical-container">
        <div className="lid-details-container">
          <span className="budgetid-label grey-font">Status:</span>
          <span
            className="status-pill"
            style={{ backgroundColor: data?.phase?.color, color: "#fff" }}
          >
            <span className="common-icon-phase"></span>
            {data?.phase?.name}
          </span>
        </div>
        <span className="kpi-right-container">
          <span className="kpi-name">Last Modified:</span>
          <span
            className="budgetid-label grey-fontt"
            style={{ marginTop: "4px" }}
          >
            {`${moment(data?.modifiedOn).format("MM/DD/YYYY hh:mm A")} by`}{" "}
            {`${data?.modifiedBy?.lastName}, ${data?.modifiedBy?.firstName}`}
          </span>
        </span>
      </div>
    </div>
  );
});

export default SbsManagerApplicationLID;
