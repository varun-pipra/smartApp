import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import "./SSBrenalRightPanel.scss";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import { getSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { getSketchPageInfo } from "app/common/appInfoSlice";
import { getMarkupsByPageForSubmittals } from "features/field/specificationmanager/stores/SpecificationManagerAPI";

const SSBrenalRightPanel = () => {
  const dispatch = useAppDispatch();
  const { uploadQueue } = useAppSelector((state) => state.SMFile);
  const {SSBrenaOpen, selectedRecord } = useAppSelector((state:any)=> state.smartSubmittals);
  const { specBookpages } = useAppSelector(
    (state) => state.specificationManager
  );
  const docViewElementId = "ss-canvasWrapper-right-panel";
  const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");
  const [specBookPagesData, setSpecBookPagesData] = useState("");
  const sketchPageinfo= useAppSelector(getSketchPageInfo);

  useEffect(()=>{
    if(selectedRecord && SSBrenaOpen) {
      let payload = {
        id : selectedRecord?.specBook?.id
      };
      dispatch(getSpecBookPages(payload));
    }
  },[SSBrenaOpen,selectedRecord])

  useEffect(() => {
    setSpecBookPagesData(specBookpages);
  }, [specBookpages]);

  useEffect(() => {
    if (search.length > 0) {
      setShowSearchpanel(true);
    } else {
      setShowSearchpanel(false);
    }
  }, [search]);

  useEffect(() => {
    if(sketchPageinfo){
      getMarkupsPerpage();
    }    
  }, [sketchPageinfo]);

  const getMarkupsPerpage = ()=>{
    let payload = {
      specbookId:selectedRecord?.specBook?.id,
      pageNo:sketchPageinfo?.currentPage?.page
    }
    getMarkupsByPageForSubmittals(payload)
      .then((res:any)=>{
        let updatedRes = res.map((item:any) => { return {...item, locked: true} })
        let data = {
          "extractionAreas": updatedRes
        };
        sketchPageinfo.callback(data);
      })
      .catch((error:any)=>{
        console.log('error',error);
      })
  }

  return (
    <div className="ss-right-panel">
      <div
        className="ss-doc-cont"
        style={{ width: showSearchpanel ? "60%" : "100%" }}
      >
        <div className="iq-brena-search-cont">
          <IQSearchField
            placeholder={"Search Text"}
            showGroups={false}
            showFilter={false}
            filterHeader=""
            onSearchChange={(searchText: any) => setSearch(searchText)}
          />
        </div>
        <IQBrenaDocViewer
          docViewElementId={docViewElementId}
          sketchData={specBookPagesData}
          defaultPageToNavigate={selectedRecord?.startPage}
        />
      </div>
      {showSearchpanel && (
        <div className="ss-search-cont">
          <SMBrenaSearch
            renderModel={false}
            open={showSearchpanel}
            handleClose={() => setShowSearchpanel(false)}
            readonly={false}
          />
        </div>
      )}
    </div>
  );
};

export default memo(SSBrenalRightPanel);
