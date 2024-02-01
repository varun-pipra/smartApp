import "./SMReferencefiles.scss";
import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import React, { useCallback, useEffect, useState } from "react";
import { getSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getSketchPageInfo } from "app/common/appInfoSlice";
import { getMarkupsByPageForSections } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import { modifyMarkupData } from "utilities/commonFunctions";
import { getTextOccurences } from "features/bidresponsemanager/stores/BidResponseManagerAPI";
import { setSpecRefMarkups } from "features/field/smartsubmittals/stores/SmartSubmitalSlice";
import _ from "lodash";

const SMReferenceFiles = (props: any) => {
  const { selectedRec, ...rest } = props;
  const dispatch = useAppDispatch();
  const { specBookpages, selectedRecsData } = useAppSelector(
    (state) => state.specificationManager
  );
  const { specRefMarkups } = useAppSelector(
    (state: any) => state.smartSubmittals
  );

  const sketchPageinfo = useAppSelector(getSketchPageInfo);
  const docViewElementId = "canvasWrapper-ref-files";
  // const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");
  const [specBookPagesData, setSpecBookPagesData] = useState("");
  const [smRefPUId, setSmRefPUId] = useState();

  const debounceOnSearch = useCallback(
    _.debounce((search,pageId) => {
      setSearch(search);
      if (search.length) {
        console.log(smRefPUId)
        handelSearchChange(search,pageId);
      } else {
        console.log(specRefMarkups, "markupsByPageForBidResp");
        sketchPageinfo?.callback(specRefMarkups || {});
      }
    }, 2000),
    [search]
  );

  useEffect(() => {
    if (selectedRec ?? false) {
      let payload = {
        id: selectedRec?.specBook?.id,
      };
      dispatch(getSpecBookPages(payload));
    } else if (selectedRecsData?.[0]?.data?.specBook?.id ?? false) {
      let payload = {
        id: selectedRecsData?.[0]?.data?.specBook?.id,
      };
      dispatch(getSpecBookPages(payload));
    }
  }, [selectedRec]);

  useEffect(() => {
    setSpecBookPagesData(specBookpages);
  }, [specBookpages]);

  useEffect(() => {
    if (sketchPageinfo) {
      getMarkupsPerpage();
    }
  }, [sketchPageinfo]);

  const getMarkupsPerpage = () => {
    let payload = {
      specbookId:
        selectedRecsData?.[0]?.data?.specBook?.id ?? selectedRec?.specBook?.id,
      pageNo: sketchPageinfo?.currentPage?.page,
    };
    getMarkupsByPageForSections(payload)
      .then((res: any) => {
        console.log(res[0]?.data?.pageUId)
        setSmRefPUId(res[0]?.data?.pageUId);
        let updatedRes = res.map((item: any) => {
          return { ...item, locked: true };
        });
        let data = {
          extractionAreas: updatedRes,
        };
        dispatch(setSpecRefMarkups(data));
        if (search.length) {
          handelSearchChange(search,res[0]?.data?.pageUId);
        } else {
          sketchPageinfo.callback(data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  const handelSearchChange = (searchText:any,pageId:any) => {
    console.log("selectedRecsData", searchText, pageId);
    if (
      (pageId && selectedRecsData?.[0]?.data?.specBook?.id) ||
      selectedRec?.specBook?.id
    ) {
      let params = `searchText=${searchText}&pageId=${pageId}&contentId=${
        selectedRecsData?.[0]?.data?.specBook?.id || selectedRec?.specBook?.id
      }`;
      getTextOccurences(params).then((resp: any) => {
        console.log(
          modifyMarkupData(resp.data),
          specRefMarkups,
          "markupsByPageForBidResp"
        );
        let updatedRes = [
          ...modifyMarkupData(resp.data),
          ...specRefMarkups?.extractionAreas || [],
        ];
        let data = {
          extractionAreas: updatedRes,
        };
        console.log("udated markup data", data, sketchPageinfo);
        sketchPageinfo?.callback(data);
      });
    }
  };

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
          onSearchChange={(searchText: any) => debounceOnSearch(searchText,smRefPUId)}
        />
      </div>
      <IQBrenaDocViewer
        showToolbar={false}
        docViewElementId={docViewElementId}
        sketchData={specBookPagesData}
        stopFocus={true}
        defaultPageToNavigate={selectedRec?.startPage}
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
  );
};
export default SMReferenceFiles;
