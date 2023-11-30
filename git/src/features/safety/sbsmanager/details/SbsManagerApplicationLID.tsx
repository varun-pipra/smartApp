import { useAppDispatch, useAppSelector } from "app/hooks";
import IQButton from "components/iqbutton/IQButton";
import IQGridLID from "components/iqgridwindowdetail/IQGridWindowDetail";
import React, { memo, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import './SbsManagerApplicationLID.scss';
import ReferenceFiles from './tabs/referencefiles/ReferenceFiles';
import SBSDetailsTab from "./tabs/SBSDetails/SBSDetails";
import Links from './tabs/links/Links';
import moment from "moment";
import { AdditionalInfo } from "./tabs/additionalInfo/AdditionalInfo";

import {getSBSDetailsById, getSBSGridList, setEnableSaveButton, setSaveDetailsObj} from "../operations/sbsManagerSlice"
import { saveRightPanelData } from "../operations/sbsManagerAPI";
import { getServer } from "app/common/appInfoSlice";
const SbsManagerApplicationLID = memo(({ data, ...props }: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
  const { smEnableButton } = useAppSelector(
    (state) => state.specificationManager
  );
  const { detailsData,sbsSaveEnableBtn,sbsDetailsPayload } = useAppSelector((state) => state.sbsManager);
  const [lidTitle, setLidTitle] = useState(data?.category?.name);

  const loadData = (id: any) => {
		dispatch(getSBSDetailsById(id));
	};

  useEffect(() => {
		// To show the grid data if GET Api fails
		if (data?.uniqueid) {
			loadData(data.uniqueid);
		}
	}, [data?.uniqueid]);

  const tabConfig = [
    {
      tabId: "SBSDetails",
      label: "Details",
      showCount: false,
      iconCls: "common-icon-SBS",
      content: <SBSDetailsTab selectedRec={data} />,
    },
    {
      tabId: "SBSAdditionalInfo",
      label: "Additional Info",
      showCount: false,
      iconCls: "common-icon-orgconsole-project-supplemental-info",
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
	  content: <Links></Links>
    },
  ];
  const handleSave = () => {
    saveRightPanelData(sbsDetailsPayload)
			.then((res: any) => {
				if(res) {
					dispatch(setEnableSaveButton(false));
					dispatch(setSaveDetailsObj([]));
          			dispatch(getSBSGridList());
					loadData(data.uniqueid);
				}
			})
			.catch((err: any) => {
				console.log("error", err);
				dispatch(setEnableSaveButton(false));
				dispatch(setSaveDetailsObj([]));
        		dispatch(getSBSGridList());
			});
  };
  const lidProps = {
    title: (
      <TextField
        className="textField"
        variant="outlined"
        onChange={(e: any) => {
			setLidTitle(e.target?.value);
			dispatch(setEnableSaveButton(true));
			if(sbsDetailsPayload.length === 0) {
				let payload = {
					name : e.target.value,
					uniqueID : detailsData?.uniqueid
				};
				dispatch(setSaveDetailsObj([payload]));
			} else {
				dispatch(setSaveDetailsObj([{...sbsDetailsPayload?.[0], name : e.target.value}]));
			};
		}}
        value={lidTitle}
      />
    ),
    defaultTabId: "SBSDetails",
    // defaultSpacing: true,
    tabPadValue:10,
    headContent: {
      showCollapsed: true,
      regularContent: <HeaderContent data={detailsData} />,
      collapsibleContent: <CollapseContent data={detailsData} />,
    },
    tabs: tabConfig,
    footer: {
      hideNavigation: false,
      rightNode: (
        <>
          <IQButton
            className="ce-buttons"
            color="blue"
            disabled={!sbsSaveEnableBtn}
            onClick={() => handleSave()}
          >
            SAVE
          </IQButton>
        </>
      ),
      leftNode: <></>,
		},
		appInfo: appInfo,
		iFrameId: "sbsManagerIFrame",
		appType: "SBSManagerLineItem",
		isFromHelpIcon: true,
		presenceProps: {
			presenceId: 'SBSManager-LineItem-presence',
			showLiveSupport: true,
			showLiveLink: false,
			showStreams: true,
			showComments: false,
			showChat: false,
			hideProfile: false
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
						style={{ backgroundColor: data?.phase?.[0]?.color, color: "#fff" }}
					>
						<span className="common-icon-phase"></span>
						{data?.phase?.[0]?.name}
					</span>
					<span className="last-modified-label grey-font">Last Modified:</span>
					<span className="budgetid-label grey-fontt">
						{`${moment(data?.modifiedOn).format("MM/DD/YYYY hh:mm A")} by`}{" "}
						{`${data?.modifiedBy?.name ?? ""}`}
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
					<span className="budgetid-label grey-font">Phase:</span>
					<span
						className="status-pill"
						style={{ backgroundColor: data?.phase?.[0]?.color, color: "#fff" }}
					>
						<span className="common-icon-phase"></span>
						{data?.phase?.[0]?.name}
					</span>
				</div>
				<span className="kpi-right-container">
					<span className="kpi-name">Last Modified:</span>
					<span
						className="budgetid-label grey-fontt"
						style={{ marginTop: "4px" }}
					>
						{`${moment(data?.modifiedOn).format("MM/DD/YYYY hh:mm A")} by`}{" "}
						{`${data?.modifiedBy?.name ?? ""}`}
					</span>
				</span>
			</div>
		</div>
	);
});

export default SbsManagerApplicationLID;
