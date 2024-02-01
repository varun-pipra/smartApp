import "./SSReferenceFiles.scss";
import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import React, { useCallback, useEffect, useState } from "react";
import { getSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getSketchPageInfo } from "app/common/appInfoSlice";
import { getMarkupsByPageForSubmitals } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { updateStatusToCommit } from "../../smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarApi";
import SSMittalLeftForm from "../../content/toolbar/sslefttoolbar/SSAddForm";
import { getSubmitalById, setRightPanelUpdated, setSSRefMarkups } from "../../stores/SmartSubmitalSlice";
import { getTextOccurences } from "features/bidresponsemanager/stores/BidResponseManagerAPI";
import { modifyMarkupData } from "utilities/commonFunctions";
import _ from "lodash";

const SSReferenceFiles = (props: any) => {
  const { selectedRec, ...rest } = props;
  const dispatch = useAppDispatch();
  const { specBookpages } = useAppSelector(
    (state) => state.specificationManager
  );
  const { submittalData, ssRightPanelData , ssRefMarkups} = useAppSelector((state) => state.smartSubmittals);
  const sketchPageinfo = useAppSelector(getSketchPageInfo);
  const docViewElementId = "ss-details-canvasWrapper-ref-files";
  const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");
  const [specBookPagesData, setSpecBookPagesData] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [smRefPUId, setSmRefPUId] = useState();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const debounceOnSearch = useCallback(
    _.debounce((search) => {
      setSearch(search)
      console.log(ssRefMarkups , 'markupsByPageForBidResp')
      if(search.length){
        handelSearchChange()
      }else{
        console.log(ssRefMarkups , 'markupsByPageForBidResp')
        sketchPageinfo?.callback(ssRefMarkups || {})
      }
    }, 2000),
    [search]
  );

  useEffect(() => {
    if (ssRightPanelData?.specBook?.id) {
      let payload = {
        id: ssRightPanelData?.specBook?.id,
      };
      dispatch(getSpecBookPages(payload));
    };
  }, [ssRightPanelData]);

  useEffect(() => {
    setSpecBookPagesData(specBookpages);
  }, [specBookpages]);

  useEffect(() => {
    if(sketchPageinfo){ 
      if((search.length)){
        handelSearchChange()
      }else{
        getMarkupsPerpage();
      }
    }    
  }, [sketchPageinfo]);

  const getMarkupsPerpage = () => {
    let payload = {
      specbookId: ssRightPanelData?.specBook?.id,
      pageNo: sketchPageinfo?.currentPage?.page,
    };
    getMarkupsByPageForSubmitals(payload)
      .then((res: any) => {
        setSmRefPUId(res[0]?.data?.pageUId)
        let updatedRes = res.map((item: any) => {
          return { ...item, locked: true };
        });
        let data = {
          extractionAreas: updatedRes,
        };
        dispatch(setSSRefMarkups(data))
        if (search.length) {
					handelSearchChange();
				} else{
          sketchPageinfo.callback(data);
				}
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  const handelSearchChange =() =>{
    if(smRefPUId && ssRightPanelData?.specBook?.id) {
      let params = `searchText=${search}&pageId=${smRefPUId}&contentId=${ssRightPanelData?.specBook?.id}`
      getTextOccurences(params).then((resp:any)=>{
        console.log(modifyMarkupData(resp.data),ssRefMarkups , 'markupsByPageForBidResp')
        let updatedRes = [...modifyMarkupData(resp.data) , ...ssRefMarkups.extractionAreas]
        let data = {
          "extractionAreas": updatedRes
        };
        console.log('udated markup data',data, sketchPageinfo);
        sketchPageinfo?.callback(data)
      })
    }   
  }
  
  const updateCardStatus = (rec: any) => {
    let payload = [{"uniqueId":ssRightPanelData?.uniqueid, 'Status': 2}];
    
    updateStatusToCommit(payload)
      .then((res: any) => {
        let payload = {
          specBookId : ssRightPanelData?.specBook?.id,
          submittalId : ssRightPanelData?.uniqueid
      };
        dispatch(getSubmitalById(payload));
        dispatch(setRightPanelUpdated(true));
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };
  const editCardSection = (e: any) => {
    handleOpen();
  };
  return (
    <>
    <div className="submittals-referencefiles">
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
      <div className="iq-brena-search-cont" style={{display:'flex'}}>
      <div className="ss-brena-card_header-left-commit"  style={{ cursor: "pointer",marginTop:'8px',marginRight:'15px' }}>
              <IQTooltip title="Commit" placement="bottom">
                <div
                  style={{pointerEvents : submittalData?.status === 'Committed' ? 'none' : 'auto', cursor: submittalData?.status === 'Committed' ? 'default' : 'pointer', opacity : submittalData?.status === 'Committed' ? 0.5 : 1}}
                  onClick={(e: any) => updateCardStatus(e)}
                >
                  <span className="common-icon-submit-check"></span>
                </div>
              </IQTooltip>
            </div>
            <div
              className="ss-brena-card_header-left-edit"
              style={{ cursor: "pointer",marginTop:'6px' }}
              onClick={(e: any) => editCardSection(e)}
            >
              <IQTooltip title="Edit" placement="bottom">
                <span className="common-icon-Edit"></span>
              </IQTooltip>
            </div>
        <IQSearchField
          placeholder={"Search Text"}
          showGroups={false}
          showFilter={false}
          filterHeader=""
          onSearchChange={(searchText: any) => debounceOnSearch(searchText)}
        />
      </div>
      <IQBrenaDocViewer
        showToolbar={false}
        docViewElementId={docViewElementId}
        sketchData={specBookPagesData}
        stopFocus={true}
        defaultPageToNavigate={ssRightPanelData?.startPage}
      />
      {/* {showSearchpanel && (
        <SMBrenaSearch
          renderModel={true}
          open={showSearchpanel}
          handleClose={() => setShowSearchpanel(false)}
          readonly={false}
        />
      )} */}
    </div>
      {isOpen && (
        <SSMittalLeftForm
          drawIcon={true}
          arrow={true}
          onClose={handleClose}
          editCardData={submittalData}
          editMode={true}
          customClass={true}
        />
      )}
      </>
  );
};
export default SSReferenceFiles;