import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import "./SMBrenaRightPanel.scss";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import { getSpecBookPages, setResizeBrenaPanel } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { getUploadQueue } from "features/field/specificationmanager/stores/FilesSlice";
import { getMarkupsByPageForSections } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import { getSketchIns, getSketchPageInfo } from "app/common/appInfoSlice";

const SMBrenaRightPanel = (props: any) => {
  const dispatch = useAppDispatch();
  const { uploadQueue } = useAppSelector((state) => state.SMFile);
  const fileQueue = useAppSelector(getUploadQueue);
  const { specBookpages } = useAppSelector(
    (state) => state.specificationManager
  );
  const [docViewImg, setDocViewImg] = useState(
    "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/8f55be2adf864ace8c8c0243eb53f010%2F2023_4%2F76eb6c2afdecf1113e590d954717e597%2FLarge.png?generation=1680680517961357&alt=media"
  );
  const docViewElementId = "canvasWrapper-right-panel";

  const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");
  const [specBookPagesData, setSpecBookPagesData] = useState("");
  const sketchInstance = useAppSelector(getSketchIns);
  const sketchPageinfo= useAppSelector(getSketchPageInfo);
  const [docViewerins, setDocViewerins] = useState<any>({});

  useEffect(() => {
    dispatch(getSpecBookPages(fileQueue?.[0]));
  }, [fileQueue]);

  useEffect(() => {
    setSpecBookPagesData(specBookpages);
  }, [specBookpages]);

  useEffect(() => {
    if (search.length > 0) {
      setShowSearchpanel(true);
        docViewerins?.rerenderCanvas();
      dispatch(setResizeBrenaPanel(true));
    } else {
      setShowSearchpanel(false);
      dispatch(setResizeBrenaPanel(false));
    }
  }, [search]);

  useEffect(() => {
    console.log("fileQueue smw rightpanel", uploadQueue);
    if (uploadQueue?.length) {
      setDocViewImg(uploadQueue[0]?.streamFullPath);
    }
  }, [uploadQueue]);

  useEffect(() => {
    setDocViewerins(sketchInstance);
  }, [sketchInstance]);

  useEffect(() => {
    if(sketchPageinfo){
      getMarkupsPerpage();
    }    
  }, [sketchPageinfo]);

  const getMarkupsPerpage = ()=>{
    let payload = {
      specbookId:fileQueue?.[0]?.id,
      pageNo:sketchPageinfo?.currentPage?.page
    }
    getMarkupsByPageForSections(payload)
      .then((res:any)=>{
        console.log('res',res);
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
    <div className="sm-right-panel">
      <div
        className="sm-doc-cont"
        style={{ width: showSearchpanel ? "65%" : "100%" }}
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
          imageUrl={docViewImg}
          docViewElementId={docViewElementId}
          sketchData={specBookPagesData}
        />
      </div>
      {showSearchpanel && (
        <div className="sm-search-cont">
          <SMBrenaSearch
            renderModel={false}
            open={showSearchpanel}
            handleClose={() => {setShowSearchpanel(false); dispatch(setResizeBrenaPanel(false));}}
            readonly={false}
          />
        </div>
      )}
    </div>
  );
};

export default memo(SMBrenaRightPanel);
