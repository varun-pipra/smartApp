import IQBrenaWindow from "components/iqbrenawindow/IQBrenaWindow";
import { memo, useEffect, useState } from "react";
import SMBrenaLeftPanel from "./content/leftpanel/SMBrenaLeftPanel";
import SMBrenaRightPanel from "./content/rightPanel/SMBrenaRightPanel";
import { setSMBrenaStatus, resetSpecBookPages, getSMList, getResizeBrenaPanel, setSpecSessionDlg, setSectionsDlg } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { setSketchMarkup } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import CustomDrawer from "./content/CustomDrawer";
import BrenaSpec from "resources/images/brena/Brena-spec-logo-2X.png";
import { isLocalhost } from "app/utils";
const SMBrenaWindow = (props: any) => {
  const dispatch = useAppDispatch();
  const resizeBrenaPanel = useAppSelector(getResizeBrenaPanel);
  const [resizePanel, setResizePanel] = useState(false);
  const { SSBrenaOpen } = useAppSelector((state: any) => state.smartSubmittals);
  
  const hadleClose = () => {
    // dispatch(setSectionsDlg(true));
    dispatch(setSMBrenaStatus(false));
    dispatch(resetSpecBookPages(""));
    dispatch(getSMList());
    dispatch(setSketchMarkup(null));
    dispatch(setSpecSessionDlg(false));
  };

  useEffect(() => {
    dispatch(resetSpecBookPages(""));
  }, []);

  useEffect(() => {
    setResizePanel(resizeBrenaPanel);
  }, [resizeBrenaPanel]);

  return (
    <IQBrenaWindow
      open={true}
      brenaLogo={BrenaSpec}
      resize={resizePanel}
      onClose={hadleClose}
      leftPanel={<SMBrenaLeftPanel closeBrena={hadleClose}/>}
      rightPanel={<CustomDrawer resizePanel={resizePanel}/>}
      titleMessage={isLocalhost ? 'Highlighted are New and Updated Spec Sections.' : null}
      // isBrenaOpen={SSBrenaOpen}
    ></IQBrenaWindow>
  );
};

export default memo(SMBrenaWindow);
