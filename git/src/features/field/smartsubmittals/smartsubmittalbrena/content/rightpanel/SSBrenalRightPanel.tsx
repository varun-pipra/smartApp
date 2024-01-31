import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import "./SSBrenalRightPanel.scss";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import { getSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { getSketchPageInfo } from "app/common/appInfoSlice";
import { getMarkupsByPageForSubmittals } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import { setBrenaMarkups } from "features/field/smartsubmittals/stores/SmartSubmitalSlice";
import { modifyMarkupData } from "utilities/commonFunctions";
import { getTextOccurences } from "features/bidresponsemanager/stores/BidResponseManagerAPI";

const SSBrenalRightPanel = () => {
  const dispatch = useAppDispatch();
  const { uploadQueue } = useAppSelector((state) => state.SMFile);
  const {SSBrenaOpen, selectedRecord , brenaMarkups} = useAppSelector((state:any)=> state.smartSubmittals);
  const { specBookpages } = useAppSelector(
    (state) => state.specificationManager
  );
  const docViewElementId = "ss-canvasWrapper-right-panel";
  const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");
  const [specBookPagesData, setSpecBookPagesData] = useState("");
  const sketchPageinfo= useAppSelector(getSketchPageInfo);
  const [smRefPUId, setSmRefPUId] = useState();

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
    if(search.length){
      handelSearchChange()
    }else{
      console.log(brenaMarkups , 'markupsByPageForBidResp')
      sketchPageinfo?.callback(brenaMarkups || {})
    }
  }, [search]);

  useEffect(() => {
    if(sketchPageinfo){
      if((search.length)){
        handelSearchChange()
      }else{
        getMarkupsPerpage();
      }
    } 
  }, [sketchPageinfo]);

  const getMarkupsPerpage = ()=>{
    let payload = {
      specbookId:selectedRecord?.specBook?.id,
      pageNo:sketchPageinfo?.currentPage?.page
    }
    getMarkupsByPageForSubmittals(payload)
      .then((res:any)=>{
        setSmRefPUId(res[0]?.data?.pageUId)
        let updatedRes = res.map((item:any) => { return {...item, locked: true} })
        let data = {
          "extractionAreas": updatedRes
        };
        dispatch(setBrenaMarkups(data))
        sketchPageinfo.callback(data);
      })
      .catch((error:any)=>{
        console.log('error',error);
      })
  }

  const handelSearchChange =() =>{
    if(smRefPUId && selectedRecord?.specBook?.id) {
      let params = `searchText=${search}&pageId=${smRefPUId}&contentId=${selectedRecord?.specBook?.id}`
      getTextOccurences(params).then((resp:any)=>{
        console.log(modifyMarkupData(resp.data),brenaMarkups , 'markupsByPageForBidResp')
        let updatedRes = [...modifyMarkupData(resp.data) , ...brenaMarkups.extractionAreas]
        let data = {
          "extractionAreas": updatedRes
        };
        console.log('udated markup data',data, sketchPageinfo);
        sketchPageinfo?.callback(data)
      })
    }
  }

  return (
    <div className="ss-right-panel">
      <div
        className="ss-doc-cont"
        style={{ width:"100%" }}
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
      {/* {showSearchpanel && (
        <div className="ss-search-cont">
          <SMBrenaSearch
            renderModel={false}
            open={showSearchpanel}
            handleClose={() => setShowSearchpanel(false)}
            readonly={false}
          />
        </div>
      )} */}
    </div>
  );
};

export default memo(SSBrenalRightPanel);
