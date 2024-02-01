import { getServer, getSketchPageInfo } from "app/common/appInfoSlice";
import {
  useAppDispatch,
  useAppSelector,
  useFilePreview,
  useLocalFileUpload,
} from "app/hooks";
import { postMessage } from "app/utils";
import {
  getSelectedRecord,
  setSelectedRecord,
  setShowContracts,
  setMarkupsByPageForBid,
} from "features/bidmanager/stores/BidManagerSlice";
import { uploadReferenceFile } from "features/bidmanager/stores/FilesAPI";
import {
  getFileObject,
  getUploadQueue,
  setUploadQueue,
} from "features/bidmanager/stores/FilesSlice";
import { useEffect, useMemo, useState } from "react";
import DocUploader from "sui-components/DocUploader/DocUploader";
import { fileDownload } from "app/hooks";

import SUIGrid from "sui-components/Grid/Grid";
import {
  getSMList,
  getSpecBookPages,
  resetSpecBookPages,
} from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import IQButton from "components/iqbutton/IQButton";
import "./ReferenceFiles.scss";
import AddSpecificationsDialog from "./AddSepcDialog/AddSpecificationsDialog";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SpecDocViewer from "./SpecificationDocviewer/SpecDocViewer";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { modifyMarkupData } from "utilities/commonFunctions";
import { getTextOccurences } from "features/bidresponsemanager/stores/BidResponseManagerAPI";
import { getMarkupsByPageForSubmittals } from "features/field/specificationmanager/stores/SpecificationManagerAPI";

export const ReferenceFiles = ({ iFrameId, appType, readOnly }: any) => {
  const onImagePreview = (event: any) => {
    const { data } = event;
    handelFileClick(data);
  };

  const specColumns = [
    {
      headerName: "Spec Number",
      field: "number",
      cellClass: "sm-number",
      cellRenderer: "agGroupCellRenderer",
      sort: "asc",
      checkboxSelection: !readOnly,
      headerCheckboxSelection: !readOnly,
      resizable: true,
      minWidth: 200,
      pinned: "left",
    },
    {
      headerName: "Spec Section Title",
      field: "title",
      cellClass: "sm-title",
      resizable: true,
      minWidth: 250,
      pinned: "left",
    },
    {
      headerName: "Spec Book",
      field: "specBook",
      minWidth: 150,
      suppressMenu: true,
      resizable: true,
      cellClass: "sm-specBookName",
    },
    {
      headerName: "Division",
      field: "division",
      cellClass: "sm-division",
      minWidth: 250,
      resizable: true,
      suppressMenu: true,
    },

    {
      headerName: "Pages",
      field: "pages",
      cellClass: "sm-pages",
      minWidth: 120,
      suppressMenu: true,
      resizable: true,
      cellStyle: { color: "#059cdf" },
      valueGetter: (params: any) =>
        params?.data?.startPage
          ? `${params?.data?.startPage} - ${params?.data?.endPage}`
          : "NA",
    },
    {
      headerName: "File",
      field: "thumbnailUrl",
      menuTabs: [],
      minWidth: 50,
      flex: 1,
      onCellClicked: onImagePreview,
      cellStyle: {
        display: "flex",
        alignItems: "normal",
        justifyContent: "left",
        cursor: "pointer",
      },
      cellRenderer: (params: any) => {
        return (
          <img
            src={
              "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_8%2F0d3c3fc1ff62c1a29890817ac4ecb38c%2FLarge.png?generation=1692893852476902&alt=media"
            }
            className="thumbnailUrl-cls"
          />
        );
      },
    },
  ];

  const headers = useMemo(() => specColumns, [readOnly]);
  const dispatch = useAppDispatch();
  const appInfo = useAppSelector(getServer);
  const bidPackage = useAppSelector(getSelectedRecord);
  const fileObject = useAppSelector(getFileObject);
  const fileQueue = useAppSelector(getUploadQueue);
  const [selected, setSelected] = useState<any>([]);
  const [specModifiedList, setSpecModifiedList] = useState<Array<any>>([]);
  const [openAddSpecDlg, setOpenAddSpecDlg] = useState(false);
  const { SMData, specBookpages } = useAppSelector(
    (state) => state.specificationManager
  );
  const [openSpecDocViewer, setOpenSpecDocViewer] = useState(false);
  const [specBookPagesData, setSpecBookPagesData] = useState({});
  const [sepcSelectedRecord, setSepcSelectedRecord] = useState<any>({});
  const { specSelectedRecInAddSpecDlg, markupsByPageForBid, selectedRecord } =
    useAppSelector((state) => state.bidManager);
  const [specificationsData, setSpecificationsData] = useState(
    bidPackage?.specifications || []
  );
  const [divisionrecord, setDivisionRecord] = useState([]);
  const [searchText, setSearchText] = useState<any>("");
  const sketchPageinfo = useAppSelector(getSketchPageInfo);
  const [bidRefernceagePUId, setBidRefernceagePUId] = useState();

  useEffect(() => {
    console.log("selectedRecord", selectedRecord);
    const value = selectedRecord.budgetItems.map(
      (budget: any) => budget?.division
    );
    setDivisionRecord(value);
    console.log("data", value);
  }, [selectedRecord]);

  useEffect(() => {
    if (sketchPageinfo) {
      getMarkupsPerpage();
    }
  }, [sketchPageinfo]);

  useEffect(() => {
    if (searchText.length) {
      handelSearchChange(searchText, bidRefernceagePUId);
    } else {
      console.log(markupsByPageForBid, "markupsByPageForBidResp");
      sketchPageinfo?.callback(markupsByPageForBid || {});
    }
  }, [searchText]);

  const handelSearchChange = (search:any,pageId:any) => {
    console.log(search,pageId)
    if (
      (pageId && sepcSelectedRecord?.specBook.id) ||
      sepcSelectedRecord?.specBookId
    ) {
      let params = `searchText=${search}&pageId=${pageId}&contentId=${
        sepcSelectedRecord?.specBook.id || sepcSelectedRecord?.specBookId
      }`;
      getTextOccurences(params).then((resp: any) => {
        let updatedRes = [
          ...modifyMarkupData(resp.data),
          ...markupsByPageForBid.extractionAreas,
        ];
        let data = {
          extractionAreas: updatedRes,
        };
        console.log(data, "data");
        sketchPageinfo?.callback(data);
      });
    }
  };

  const getMarkupsPerpage = () => {
    let payload = {
      specbookId:
        sepcSelectedRecord?.specBook.id || sepcSelectedRecord?.specBookId,
      pageNo: sketchPageinfo?.currentPage?.page,
    };
    getMarkupsByPageForSubmittals(payload)
      .then((res: any) => {
        let updatedRes = res.map((item: any) => {
          return { ...item, locked: true };
        });
        let data = {
          extractionAreas: updatedRes,
        };
        console.log('pageId',res[0]?.data?.pageUId)
        dispatch(setMarkupsByPageForBid(data));
        setBidRefernceagePUId(res[0]?.data?.pageUId);
        if (searchText.length) {
          handelSearchChange(searchText, res[0]?.data?.pageUId);
        } else {
          sketchPageinfo.callback(data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    if (bidPackage?.specifications && bidPackage?.specifications?.length) {
      setSpecificationsData(bidPackage?.specifications);
    } else {
      setSpecificationsData([]);
    }
  }, [bidPackage?.specifications]);

  useEffect(() => {
    if (specBookpages.hasOwnProperty("totalCount")) {
      setSpecBookPagesData(specBookpages);
      setOpenSpecDocViewer(true);
    }
  }, [specBookpages]);

  useEffect(() => {
    console.log(specSelectedRecInAddSpecDlg, " specSelectedRecInAddSpecDlg");
    setSepcSelectedRecord(specSelectedRecInAddSpecDlg);
  }, [specSelectedRecInAddSpecDlg]);

  useEffect(() => {
    if (appInfo) {
      dispatch(getSMList());
    }
  }, [appInfo]);

  useEffect(() => {
    if (SMData?.length > 0) {
      const data: any = SMData.map((item: any) => ({
        ...item,
        pages: `${item.startPage} - ${item.endPage}`,
        bidPackageValue:
          item.bidPackageName === null || item.bidPackageName === ""
            ? "NA"
            : item.bidPackageName,
      }));
      setSpecModifiedList(data);
    } else {
      setSpecModifiedList([]);
    }
  }, [SMData]);

  let typeVariable: any;
  const handelDeleteSpecifications = () => {
    const files = selected.map((file: any) => {
      return {
        referenceId: file.id,
        fileType: 2,
      };
    });
    saveReferenceFiles({
      remove: files,
    });
  };
  const handelFileClick = (data: any) => {
    setSepcSelectedRecord(data);
    let payload = {
      id: data?.specBookId,
    };
    dispatch(getSpecBookPages(payload));
  };

  const addContractDocs = (type: any) => {
    setFileType(getTypeValue(type));
    dispatch(setShowContracts(true));
  };

  const rowSelected = (sltdRows: any) => {
    const selectedRowData = sltdRows.api.getSelectedRows();
    console.log(selectedRowData, "selectedRowData");
    setSelected(selectedRowData);
  };

  const [fileType, setFileType] = useState<number>();

  const getTypeValue = (type: string): number => {
    let fType = 0;
    switch (type) {
      case "Drawings":
        fType = 0;
        break;
      case "Files":
        fType = 1;
        break;
      case "SpecBooks":
        fType = 20;
        break;
    }

    return fType;
  };

  const openDrive = (folderType: string) => {
    let params: any = {
      iframeId: iFrameId,
      roomId: appInfo && appInfo.presenceRoomId,
      appType: appType,
      multiSelect: true,
    };
    if (folderType) {
      params.folderType = folderType;
      setFileType(getTypeValue(folderType));
    }

    postMessage({
      event: "getdrivefiles",
      body: params,
    });
  };

  const localFileUpload = (data: any) => {
    useLocalFileUpload(appInfo, data).then((res) => {
      saveReferenceFiles({ add: constructList(res) });
    });
  };

  const openPreview = (files: Array<any>, index: number) => {
    useFilePreview(iFrameId, appInfo, appType, files, index);
  };

  const saveReferenceFiles = (formattedList: any) => {
    uploadReferenceFile(
      appInfo,
      { referenceFiles: formattedList },
      bidPackage?.id
    ).then((bidPackageItem: any) => {
      typeVariable = undefined;
      setFileType(undefined);
      dispatch(setUploadQueue([]));
      dispatch(setSelectedRecord(bidPackageItem));
      setOpenAddSpecDlg(false);
    });
  };

  const deleteImage = (item: any) => {
    saveReferenceFiles({
      remove: [
        {
          objectId: item.objectId,
          id: item.driveObjectId || item.id,
          name: item.name,
        },
      ],
    });
  };

  const constructList = (list: Array<any>, fromDrive = false) => {
    const modifiedList = list?.map((item: any) => {
      if (fromDrive)
        return {
          driveObjectId: item.id,
          name: item.name,
          fileType: fileType,
        };
      else {
        return {
          id: item.id,
          name: item.name,
          fileType: typeVariable,
        };
      }
    });

    return modifiedList;
  };

  const closeSpecDocViewer = () => {
    setOpenSpecDocViewer(false);
    dispatch(resetSpecBookPages(""));
  };

  useEffect(() => {
    if (fileQueue && fileQueue.length > 0) {
      saveReferenceFiles({ add: constructList(fileQueue, true) });
    }
  }, [fileQueue]);

  const download = (imgData: any, fileType: any) => {
    const objectIds = imgData?.map((item: any) => item.objectId);
    const filename = bidPackage?.name + " - " + fileType;
    fileDownload(objectIds, filename);
  };

  return (
    <div className="referenceFile">
      {openAddSpecDlg ? (
        <AddSpecificationsDialog
          open={true}
          closeAddSpec={() => setOpenAddSpecDlg(false)}
          onAddRecord={(data: any) => saveReferenceFiles(data)}
          divisionrecord={divisionrecord}
        />
      ) : (
        <></>
      )}
      <div className="header-text">Reference Files</div>
      <DocUploader
        width={"1070px"}
        height={"200px"}
        folderType="Drawings"
        docLabel={"Drawings"}
        onImageClick={openPreview}
        onImageDelete={deleteImage}
        imgData={fileObject.drawings}
        readOnly={readOnly}
        onProjectFile={(type: any) => {
          typeVariable = 0;
          openDrive(type);
        }}
        localFileClick={(data: any) => {
          typeVariable = 0;
          localFileUpload(data);
        }}
        showDownloadButton={true}
        fileDownload={(data: any) => {
          download(data, "Drawings");
        }}
      ></DocUploader>
      <DocUploader
        width={"1070px"}
        height={"200px"}
        folderType="Files"
        docLabel={"Documents"}
        btnLabel={"Add Documents"}
        showContractOption={true}
        onImageClick={openPreview}
        onImageDelete={deleteImage}
        imgData={fileObject.documents}
        readOnly={readOnly}
        onProjectFile={(type: any) => {
          typeVariable = 1;
          openDrive(type);
        }}
        contractsClick={(type: any) => {
          typeVariable = 1;
          addContractDocs(type);
        }}
        localFileClick={(data: any) => {
          typeVariable = 1;
          localFileUpload(data);
        }}
        showDownloadButton={true}
        fileDownload={(data: any) => {
          download(data, "Files");
        }}
      ></DocUploader>
      <div className="doc-uploadd-header">
        <span className="doc-lbl-hdr-bold">Specifications</span>
      </div>
      {!readOnly && (
        <div className="specifications-container">
          <IQButton
            className="specifications-add-btn"
            onClick={() => setOpenAddSpecDlg(true)}
          >
            <span
              style={{ marginRight: "6px", fontSize: "19px" }}
              className="common-icon-Add"
            ></span>
            <span> Add Specifications</span>
          </IQButton>
          <div className="icon-section">
            <IQTooltip title="Delete" placement="bottom">
              <IconButton
                className="ref-delete-btn"
                disabled={selected.length === 0}
                onClick={handelDeleteSpecifications}
              >
                <span className="common-icon-delete"></span>
              </IconButton>
            </IQTooltip>
          </div>
        </div>
      )}
      <div className="grid">
        <SUIGrid
          headers={headers}
          data={specificationsData}
          rowSelected={(e: any) => rowSelected(e)}
          getRowId={(record: any) => record.data.id}
          nowRowsMsg={"Click on Add Specifications Button"}
        />
      </div>
      {openSpecDocViewer ? (
        <SpecDocViewer
          specBookPagesData={specBookPagesData}
          selectedRecord={sepcSelectedRecord}
          closeSpecDocViewer={closeSpecDocViewer}
          onDocSearch={(text: any) => setSearchText(text)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
