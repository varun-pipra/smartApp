import { memo, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import "./SMLeftToolbar.scss";
import SMSpecLeftForm from "./SMSpecLeftForm";
import { postMessage } from "app/utils";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { useAppDispatch, useAppSelector, useLocalFileUpload } from "app/hooks";
import {
  getSMList,
  setBulkUpdateDialog,
  setSMBrenaStatus,
  setSelectedRecsData,
  setSpecSessionDlg,
} from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { getServer } from "app/common/appInfoSlice";
import { SpeckBookButtons } from "../../specbookdailogcontent/SpecBookDailogContent";
import SpecBookDialogContent from "../../specbookdailogcontent/SpecBookDailogContent";
import SMSpecBookDailog from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import {
  callUploadedCloudUrl,
  getSignedUrl,
  getUIDForLocalFiles,
  getUploadStatus,
  saveSpecDocument,
  validateSheetName,
} from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import RTHelper from "utilities/realtime/RTHelper";
import { setUploadQueue } from "features/field/specificationmanager/stores/FilesSlice";
import IQButton from "components/iqbutton/IQButton";
import { setSSBrenaStatus } from "features/field/smartsubmittals/stores/SmartSubmitalSlice";

export const SMLeftButtons = memo((props: any) => {
  const rtHelperIns = new RTHelper();
  const { handleDeleteAction, selectedRecIds,setManualLIDOpen, ...rest } = props;
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = useState(false);
  const [color, setColor] = useState(false);
  const inputRef = useRef<any>();
  const appInfo = useAppSelector(getServer);
  const [openSpecDlg, setOpenSpecDlg] = useState(false);
  const [validatedSheetData, setValidatedSheetData] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<any>({});
  const [specDlgData, setSpecDlgData] = useState<any>({});
  const [uuidForSpec, setUUIDForSpec] = useState(rtHelperIns.getUuid());
  const { selectedRecsData , unpublishedCount, specStartNewSession} = useAppSelector((state) => state.specificationManager);
  const disableField = selectedRecsData?.length > 0;
  const handleOpen = () => {
    setOpen(true);
    setColor(true);
  };
  const handleClose = () => {
    setOpen(false);
    setColor(false);
  };

  const refreshSMGrid = () => {
    dispatch(getSMList());
    dispatch(setSelectedRecsData([]));
  };

  const openDrive = (folderType: string) => {
    let params: any = {
      // iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType
    };

    if (folderType) {
      params.folderType = folderType;
      params.toExtractSpecs = true;
      // setFileType(getTypeValue(folderType))
    }

    postMessage({
      event: "getdrivefiles",
      body: params,
    });
  };

  const onItemClick = (selectedItem: any) => {
    // if(unpublishedCount?.lastUnpublishedCount > 0) {
      // dispatch(setSMBrenaStatus(true))
    //   dispatch(setSpecSessionDlg(true));
    // } else {
    // console.log("selectedItem", selectedItem);
    // if (selectedItem?.type === "local") {
    //   localFileUpload();
    // }
    // if (selectedItem?.type === "project") {
      openDrive("SpecBooks");
    // }
    // };
  };

  const localFileUpload = () => {
    if (inputRef.current) {
      inputRef?.current?.click();
    }
  };

  const handleFileChange = (event: any) => {
    event.preventDefault();
    setSelectedFile({ file: event.target.files[0] });

    let filename = event.target.files[0].name;
    let payload = {
      _dc: Math.floor(Math.random() * 10000000), //to fix the cache
      name: filename,
    };

    validateSheetName(payload)
      .then((res) => {
        console.log("validateSheetName", res);
        setValidatedSheetData(res);
        event.target.value = null;
        getSignedUrlForLocal();
      })
      .catch((error: any) => {
        console.log("error", error);
        event.target.value = null;
      });
  };

  const getSignedUrlForLocal = () => {
    let fileId = uuidForSpec + ".pdf";
    let payload: any = [fileId];

    getSignedUrl(payload)
      .then((res) => {
        console.log("getSignedUrl", res);
        callCloudUrl(res);
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  const callCloudUrl = (res: any) => {
    let fileId = uuidForSpec + ".pdf";
    let cUrl = res[fileId];
    callUploadedCloudUrl(cUrl)
      .then((res) => {
        console.log("callCloudUrl", res);
        setOpenSpecDlg(true);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onDlgDatachange = (formData: any) => {
    setSpecDlgData(formData);
  };

  const onExtract = () => {
    let filename = selectedFile?.file?.name;
    let payload = {
      [filename]: {
        id: 1,
        fileCategory: "Document",
        contentTypeId: appInfo?.SpecBookFolder?.contentTypeId,
        fileName: filename,
        destinationId: appInfo?.SpecBookFolder?.folderId, //17131181,
        fileExtension: ".pdf",
        folderId: appInfo?.SpecBookFolder?.folderId, //17131181,
        tempFileUId: uuidForSpec, //"c628d3ea-c042-4928-ce70-42587fb6338b",
        projectId: appInfo?.SpecBookFolder?.projectId, //531979,
        itemIdToVersion: validatedSheetData?.data?.sheetData?.itemIdToRevision,
        isVersion: validatedSheetData?.data?.isSheetExist,
        tags: [],
        displayName: specDlgData?.displayName,
        receivedDate: specDlgData?.receivedDate, //"09/25/2023 12:00:00 AM",
        dateIssued: specDlgData?.issuedDate, //"09/25/2023 12:00:00 AM",
      },
    };
    saveSpecDocument(payload, selectedFile.file)
      .then((res) => {
        console.log("res", res);
        pollForGetStatus();
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  const pollForGetStatus = () => {
    let payload = [uuidForSpec];
    getUploadStatus(payload)
      .then((res) => {
        console.log("getUploadStatus", res);
        if (typeof res?.data[uuidForSpec] === "boolean") {
          setTimeout(() => {
            pollForGetStatus();
          }, 2000);
        } else {
          getUID(res.data[uuidForSpec]);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getUID = (fileId: any) => {
    let payload = [fileId];
    getUIDForLocalFiles(payload)
      .then((res) => {
        console.log("getUIDForLocalFiles", res);
        dispatch(setUploadQueue([{ id: res[fileId] }]));
        setOpenSpecDlg(false);
        dispatch(setSMBrenaStatus(true));
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const handleEditClick = () => {
    if(selectedRecsData?.length >= 2) {
      dispatch(setBulkUpdateDialog(true))
    } else if(selectedRecsData?.length === 1) {
      setManualLIDOpen(true);
    };
  };
  return (
    <>
      <div className="sm-left-toolbar-cont">
        {isOpen && <SMSpecLeftForm arrow={true} onClose={handleClose} />}
        <IQTooltip title="Refresh" placement="bottom">
          <IconButton onClick={refreshSMGrid} aria-label="Refresh Spec Manager">
            <span className="common-icon-refresh"></span>
          </IconButton>
        </IQTooltip>
        <IQTooltip title="Add" placement="bottom">
          <IconButton
            data-action="add"
            className={color ? "add-color" : " "}
            onClick={handleOpen}
          >
            <span className="common-icon-add" />
          </IconButton>
        </IQTooltip>
        <IQTooltip title="Edit" placement="bottom">
          <IconButton data-action="edit" onClick={() => handleEditClick()} disabled={!disableField}>
            <span className="common-icon-feather-edit" />
          </IconButton>
        </IQTooltip>
        {/* <IQTooltip title="Upload" placement="bottom">
          <IconButton data-action="Upload">
            <span className="common-icon-upload-up-arrow" />
          </IconButton>
        </IQTooltip>
        <IQTooltip title="Print" placement="bottom">
          <IconButton>
            <span className="common-icon-print" />
          </IconButton>
        </IQTooltip> */}
        <IQTooltip title="Delete" placement="bottom">
          <IconButton
            aria-label="Delete Bid response Line Item"
            disabled={!disableField}
            onClick={() => handleDeleteAction()}
          >
            <span className="common-icon-delete"></span>
          </IconButton>
        </IQTooltip>
        {/* <UploadMenu
          showDriveOption={true}
          showContractOption={false}
          //startIcon={<span className="common-icon-brena" />}
          label={"Extract Specs. AI"}
          folderType={"Files"}
          dropdownLabel={"Select Type"}
          onItemClick={onItemClick}
          // disabled={!disableField}
        /> */}

         <IQButton
          className="smart-spec-left-spec-ai"
          startIcon={<span className="common-icon-brena" />}
          onClick={onItemClick}
        >
          Extract Specs. AI
        </IQButton>

        <input
          multiple
          style={{ display: "none" }}
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>
      <SMSpecBookDailog
        open={openSpecDlg}
        contentText={
          <SpecBookDialogContent
            specRecord={[]}
            specBookText={selectedFile?.file?.name}
            onDatachange={onDlgDatachange}
          />
        }
        title={""}
        showActions={false}
        dialogClose={true}
        helpIcon={true}
        iconTitleContent={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>Spec Book</div>
          </div>
        }
        onAction={() => {
          setOpenSpecDlg(false);
        }}
        customButtons={true}
        customButtonsContent={<SpeckBookButtons onExtract={onExtract} />}
      />
    </>
  );
});
