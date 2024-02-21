import IQBrenaWindow from "components/iqbrenawindow/IQBrenaWindow";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import SSBrenalLeftPanel from "./content/leftpanel/SSBrenalLeftPanel";
import SSBrenalRightPanel from "./content/rightpanel/SSBrenalRightPanel";
import { useAppDispatch,useAppSelector } from "app/hooks";
import {
  getSmartSubmitalGridList,
  setResumeLaterDlg,
  setSSBrenaStatus,
  setSelectedRecordsData,
} from "../stores/SmartSubmitalSlice";
import { resetSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { setSketchMarkup } from "app/common/appInfoSlice";
import BrenaSubmittals from "resources/images/brena/Brena-Submittal-Registry-3x.png";
import SmartSubmitalDailog from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import SSCommitedContent, {
  SSCommitedBtns,
} from "../content/ssdailogcommitedcontent/SSDailogCommitedContent";
import SSUnCommitedContent, {
  SSUnCommitedBtns,
} from "../content/ssdailoguncommitedcontent/SSDailogUncommitedContent";

const SSBrenaWindow = (props: any) => {
  const dispatch = useAppDispatch();
  const { sectionsCardsData } = useAppSelector((state: any) => state.smartSubmitalsLeftToolbar);
  const { resumeLaterDlg,SSBrenaOpen } = useAppSelector((state: any) => state.smartSubmittals);
  const refData = useRef<any>([]);
  refData.current = sectionsCardsData;
  const handleClose = (data: any) => {
    let idx = [...data].filter(
      (x: any) => x.status === "SuggestedDraft" || x.status === "Draft"
    );
    if (idx.length > 0) {
      dispatch(setResumeLaterDlg(true));
    } else {
      dispatch(setSelectedRecordsData([]));
      dispatch(setSSBrenaStatus(false));
      dispatch(getSmartSubmitalGridList({type : 'default'}));
      dispatch(resetSpecBookPages(""));
      dispatch(setSketchMarkup(null));
    }
  };
  const handleApply = (e:any, val: any) => {
    if (val == "discard") {
     
    } else if (val === "resumeLater") {
    
    } else if(val === 'commitSubmittals') {

    };
    dispatch(setSSBrenaStatus(false));
    dispatch(setResumeLaterDlg(false));
  };
  const handleDialogActions = (val: any) => {
    if (val == "ok") {
      
    } else if (val === "close") {
      dispatch(setResumeLaterDlg(false));
    }
  };
    return (
      <>
        <IQBrenaWindow
          open={true}
          mainWindowClsName="ss-brena"
          leftPanel={<SSBrenalLeftPanel />}
          rightPanel={<SSBrenalRightPanel />}
          onClose={() => handleClose(refData?.current)}
          brenaLogo={BrenaSubmittals}
          isBrenaOpen={SSBrenaOpen}
          withInModule={true}
        ></IQBrenaWindow>

        <SmartSubmitalDailog
          open={resumeLaterDlg}
          onClose={() => {
            dispatch(setResumeLaterDlg(false))
            //   handleNotAllowedUserActions("cancel");
          }}
          contentText={<SSCommitedContent />}
          width={519}
          title={""}
          showActions={false}
          dialogClose={true}
          // showSession={false}
          customButtons={true}
          customButtonsContent={<SSCommitedBtns handleApply={(e:any, type:any) => handleApply(e, type)} />}
          iconTitleContent={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>Confirmation</div>
            </div>
          }
          onAction={(e: any, type: string) => handleDialogActions(type)}
        />
        
        <SmartSubmitalDailog
          open={false}
          onClose={() => {
            //   handleNotAllowedUserActions("cancel");
          }}
          contentText={<SSUnCommitedContent />}
          width={519}
          title={""}
          showActions={false}
          dialogClose={true}
          // showSession={false}
          customButtons={true}
          customButtonsContent={<SSUnCommitedBtns />}
          iconTitleContent={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>Confirmation</div>
            </div>
          }
        />
      </>
    );
};

export default SSBrenaWindow;
