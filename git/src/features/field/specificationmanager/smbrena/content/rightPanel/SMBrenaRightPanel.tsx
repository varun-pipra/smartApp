import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import { memo, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import "./SMBrenaRightPanel.scss";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import {
  getSpecBookPages,
  setResizeBrenaPanel,
  setSmBrenaRaightPanelMarkups,
} from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { getUploadQueue } from "features/field/specificationmanager/stores/FilesSlice";
import { getMarkupsByPageForSections } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import { getSketchIns, getSketchPageInfo } from "app/common/appInfoSlice";
import { getTextOccurences } from "features/bidresponsemanager/stores/BidResponseManagerAPI";
import { modifyMarkupData } from "utilities/commonFunctions";
import _ from "lodash";

const SMBrenaRightPanel = (props: any) => {
  const dispatch = useAppDispatch();
  const { uploadQueue } = useAppSelector((state) => state.SMFile);
  const fileQueue = useAppSelector(getUploadQueue);
  const { specBookpages, smBrenaRaightPanelMarkups } = useAppSelector(
    (state) => state.specificationManager
  );
  const [docViewImg, setDocViewImg] = useState(
    "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/8f55be2adf864ace8c8c0243eb53f010%2F2023_4%2F76eb6c2afdecf1113e590d954717e597%2FLarge.png?generation=1680680517961357&alt=media"
  );
  const docViewElementId = "canvasWrapper-right-panel";

  const [search, setSearch] = useState("");
  const [specBookPagesData, setSpecBookPagesData] = useState("");
  const sketchInstance = useAppSelector(getSketchIns);
  const sketchPageinfo = useAppSelector(getSketchPageInfo);
  const [docViewerins, setDocViewerins] = useState<any>({});
  const [smRefPUId, setSmRefPUId] = useState();

  useEffect(() => {
    dispatch(getSpecBookPages(fileQueue?.[0]));
  }, [fileQueue]);

  useEffect(() => {
    setSpecBookPagesData(specBookpages);
  }, [specBookpages]);

  const debounceOnSearch = useCallback(
    _.debounce((search) => {
      setSearch(search);
    }, 2000),
    []
  );

  useEffect(() => {
    if (search.length) {
      docViewerins?.rerenderCanvas();
      dispatch(setResizeBrenaPanel(true));
      handelSearchChange(search, smRefPUId);
    } else {
      dispatch(setResizeBrenaPanel(false));
      console.log(smBrenaRaightPanelMarkups, "markupsByPageForBidResp");
      sketchPageinfo?.callback(smBrenaRaightPanelMarkups || {});
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
    if (sketchPageinfo) {
      getMarkupsPerpage();
    }
  }, [sketchPageinfo]);

  const getMarkupsPerpage = () => {
    let payload = {
      specbookId: fileQueue?.[0]?.id,
      pageNo: sketchPageinfo?.currentPage?.page,
    };
    getMarkupsByPageForSections(payload)
      .then((res: any) => {
        console.log("res", res);
        setSmRefPUId(res[0]?.data?.pageUId);
        let updatedRes = res.map((item: any) => {
          return { ...item, locked: true };
        });
        let data = {
          extractionAreas: updatedRes,
        };
        dispatch(setSmBrenaRaightPanelMarkups(data));
        if (search.length) {
          handelSearchChange(search,res[0]?.data?.pageUId , data);
        } else {
          sketchPageinfo.callback(data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  const handelSearchChange = (searchText:any,pageId:any ,updatedMData?:any) => {
    if (pageId && fileQueue?.[0]?.id) {
      let params = `searchText=${searchText}&pageId=${pageId}&contentId=${fileQueue?.[0]?.id}`;
      getTextOccurences(params).then((resp: any) => {
        console.log(
          modifyMarkupData(resp.data),
          smBrenaRaightPanelMarkups,
          "markupsByPageForBidResp"
        );
        let updatedRes = [
          ...modifyMarkupData(resp.data),
          ...updatedMData?.extractionAreas || smBrenaRaightPanelMarkups.extractionAreas || [],
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
    <div className="sm-right-panel">
      <div className="sm-doc-cont" style={{ width: "100%" }}>
        <div className="iq-brena-search-cont">
          <IQSearchField
            placeholder={"Search Text"}
            showGroups={false}
            showFilter={false}
            filterHeader=""
            onSearchChange={(searchText: any) => debounceOnSearch(searchText)}
          />
        </div>
        <IQBrenaDocViewer
          imageUrl={docViewImg}
          docViewElementId={docViewElementId}
          sketchData={specBookPagesData}
        />
      </div>
      {/* {showSearchpanel && (
        <div className="sm-search-cont">
          <SMBrenaSearch
            renderModel={false}
            open={showSearchpanel}
            handleClose={() => {setShowSearchpanel(false); dispatch(setResizeBrenaPanel(false));}}
            readonly={false}
          />
        </div>
      )} */}
    </div>
  );
};

export default memo(SMBrenaRightPanel);
