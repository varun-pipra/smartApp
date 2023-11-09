import "./SMReferencefiles.scss";
import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import React, { useEffect, useState } from "react";
import { getSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getSketchPageInfo } from "app/common/appInfoSlice";
import { getMarkupsByPageForSections } from "features/field/specificationmanager/stores/SpecificationManagerAPI";


const SMReferenceFiles = (props: any) => {
  const { selectedRec, ...rest } = props;
  const dispatch = useAppDispatch();
  const { specBookpages,selectedRecsData } = useAppSelector(
    (state) => state.specificationManager
  );
  const sketchPageinfo= useAppSelector(getSketchPageInfo);
  const docViewElementId = "canvasWrapper-ref-files";
  const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");
  const [specBookPagesData, setSpecBookPagesData] = useState("");
  
  useEffect(() => {
    if (search.length > 0) {
      setShowSearchpanel(true);
    } else {
      setShowSearchpanel(false);
    }
  }, [search]);

  useEffect(() => {
    if(selectedRec ?? false){
      let payload = {
        id:selectedRec?.specBook?.id
      }
      dispatch(getSpecBookPages(payload));
    } else if(selectedRecsData?.[0]?.data?.specBook?.id ?? false) {
      let payload = {
        id:selectedRecsData?.[0]?.data?.specBook?.id
      }
      dispatch(getSpecBookPages(payload));
    }
  }, [selectedRec])

  useEffect(() => {
    setSpecBookPagesData(specBookpages);
  }, [specBookpages]);

  useEffect(() => {
    if(sketchPageinfo){
      getMarkupsPerpage();
    }    
  }, [sketchPageinfo]);

  const getMarkupsPerpage = ()=>{
    let payload = {
      specbookId: selectedRecsData?.[0]?.data?.specBook?.id ?? selectedRec?.specBook?.id,
      pageNo:sketchPageinfo?.currentPage?.page
    }
    getMarkupsByPageForSections(payload)
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
    <div className="sm-referencefiles">
      <div className="eventrequest-details-box">
        <div className="eventrequest-details-header">
          <div className="title-action">
            <span className="common-icon-contract-files iconmodify"></span>
            <span className="title" style={{ marginLeft: "6px" }}>
              Reference Files
            </span>
          </div>
        </div>
      </div>
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
        showToolbar={false}
        docViewElementId={docViewElementId}
        sketchData={specBookPagesData}
        stopFocus={true}
        defaultPageToNavigate={selectedRec?.startPage}
      />
      {showSearchpanel && (
        <SMBrenaSearch
          renderModel={true}
          open={showSearchpanel}
          handleClose={() => setShowSearchpanel(false)}
          readonly={false}
        />
      )}
    </div>
  );
};
export default SMReferenceFiles;
