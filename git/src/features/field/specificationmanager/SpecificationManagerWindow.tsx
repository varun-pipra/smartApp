import {
  setCostCodeDivisionList,
  setCurrencySymbol,
  setServer,
} from "app/common/appInfoSlice";
// import { } from 'app/common/userLoginUtils';
import { useAppDispatch, useAppSelector, useHomeNavigation } from "app/hooks";
import { currency, isLocalhost, postMessage } from "app/utils";
import GridWindow from "components/iqgridwindow/IQGridWindow";
import { appInfoData } from "data/appInfo";
import _ from "lodash";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import TourIcon from "@mui/icons-material/Tour";
import { triggerEvent } from "utilities/commonFunctions";

import "./SpecificationManagerWindow.scss";
import { SMLeftButtons } from "./content/toolbar/smlefttoolbar/SMLeftToolbar";
import { SMRightButtons } from "./content/toolbar/smrighttoolbar/SMRightToolbar";
import {
  getSMList,
  getToastMessageForSM,
  setBidPackageDropdownValues,
  setBulkUpdateBtnDisabled,
  setBulkUpdateDialog,
  setBulkUpdateFormValues,
  setSMBrenaStatus,
  setSelectedRecsData,
  setToastMessageForSM,
  getDivisionList,
  getUnpublishedCount,
  setSpecSessionDlg,
  setSpecStartNewSession,
  setChangedSMDetailsValue,
  setEnableSaveButton
} from "./stores/SpecificationManagerSlice";
import SpecificationManagerLID from "./details/SpecficationManagerLID";
import React from "react";
import { Alert, Button, Stack } from "@mui/material";
import SMSpecBookDailog from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";

import { SpeckBookButtons } from "../specificationmanager/content/specbookdailogcontent/SpecBookDailogContent";
import SpecBookDialogContent from "../specificationmanager/content/specbookdailogcontent/SpecBookDailogContent";

import SpecBookStartSessionContent from "./content/specbookstartsessioncontent/SpecBookStartSessionContent";
import { SpecBookStartSessionButtons } from "./content/specbookstartsessioncontent/SpecBookStartSessionContent";

import SpecBookPublishContent from "./content/specbookpublishcontent/SpecBookPublishContent";
import { SpecBookPublishButtons } from "./content/specbookpublishcontent/SpecBookPublishContent";

import SpecBookBulkContent from "./content/specbookbulkupdate/SpecBookBulkUpdate";
import SpecBookSnackbar from "./content/specbooksnackbar/SpecBookSnackbar";
import { getUploadQueue, setUploadQueue } from "./stores/FilesSlice";
import SMBrenaWindow from "./smbrena/SMBrenaWindow";
import { getSpecPhaseStatus } from "utilities/specManager/enums";
import {
  GetUnpublishedCount,
  deleteMultipleSpecSections,
  publishMultipleSpecSection,
} from "./stores/SpecificationManagerAPI";
import { fetchGridData } from "features/bidmanager/stores/gridSlice";
import SSUnCommitedContent, { SMSessionDialogContent, SSUnCommitedBtns } from "../smartsubmittals/content/ssdailoguncommitedcontent/SSDailogUncommitedContent";
import SmartSubmittalLID from "../smartsubmittals/details/SmartSubmittalLID";

var tinycolor = require("tinycolor2");

const SpecificationManagerWindow = (props: any) => {
  const dispatch = useAppDispatch();

  // Local mock
  const [localhost] = useState(isLocalhost);
  const [appData] = useState(appInfoData);

  const [queryParams] = useSearchParams();
  const location = useLocation();
  const { toast, SMData } = useAppSelector(
    (state: any) => state.specificationManager
  );
  const { server, currencySymbol } = useAppSelector((state) => state.appInfo);
  const {
    openBrena,
    bulkUpdateDialog,
    bulkUpdateBtnDisabled,
    bulkUpdateFormValues,
    bidPackageDropdownValues,
    unpublishedCount,
    specSessionDlg
  } = useAppSelector((state) => state.specificationManager);
  const fileQueue = useAppSelector(getUploadQueue);
  const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
  const [isMaxByDefault, setMaxByDefault] = useState(false);
  const [isInline, setInline] = useState(false);
  const [isFullView, setFullView] = useState(false);
  const [modifiedList, setModifiedList] = useState<Array<any>>([]);
  const [toastMessage, setToastMessage] = useState<string>("");

  const [gridAlert, setGridAlert] = React.useState(false);
  const [gridAlertText, setGridAlertText] = React.useState(
    "No Spec Books uploaded to the Spec Books Drive Folder yet"
  );
  const [speckBookDialog, setSpeckBookDialog] = useState(false);
  const [open, setOpen] = React.useState(true);
  const selectedRecIds = useRef([]);
  const selectedRecData = useRef([]);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState<any>();
  const { settingsData, CostCodeAndTypeData } = useAppSelector(
    (state) => state.settings
  );
  const toastMessageForSM = useAppSelector(getToastMessageForSM);
  const { gridWinTitleMsg } = useAppSelector(
    (state) => state.specificationManager
  );
  const { gridData } = useAppSelector((state) => state.bidManagerGrid);
  const [gridSearchText, setGridSearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<any>();
  const [showCenterPiece, setShowCenterPiece] = useState(false);
  const findAndUpdateFiltersData = (
    data: any,
    key: string,
    nested?: boolean,
    nestedKey?: any,
    custom?: boolean,
    customKey?: any
  ) => {
    const formattedData = data?.map((rec: any) => {
      if (custom)
        return {
          text: `${rec?.[key]?.[customKey]} - ${rec?.[key]?.[nestedKey]}`,
          value: `${rec?.[key]?.[customKey]} - ${rec?.[key]?.[nestedKey]}`,
          id: rec?.id,
        };
      else if (nested)
        return {
          text: rec?.[key]?.[nestedKey],
          value: rec?.[key]?.[nestedKey],
          id: rec?.id,
        };
      else return { text: rec?.[key] === '' ? 'NA' : rec?.[key], value: rec?.[key] === '' ? 'NA' : rec?.[key], id: rec?.id };
    });
    const filtersCopy: any = [...filterOptions];
    let currentItem: any = filtersCopy.find((rec: any) => rec?.value === key);
    currentItem.children.items = GetUniqueList(formattedData, "text");
  };
  const GetUniqueList = (data: any, key?: any) => {
    let unique: any = [];
    data?.map((x: any) =>
      unique?.filter((a: any) => a?.[key] === x?.[key])?.length > 0
        ? null
        : unique.push(x)
    );
    unique.sort((a: any, b: any) =>
      a?.[key].localeCompare(b?.[key], undefined, { numeric: true })
    );
    return unique;
  };
  useEffect(() => {
    if (gridData.length > 0) {
      let filterData = gridData.filter((x: any) => x.status === 3);
      if (filterData.length > 0) {
        let list: any = [];
        for (let i = 0; i < filterData.length; i++) {
          list.push({
            id: filterData?.[i]?.id,
            label: filterData?.[i]?.name,
            value: filterData?.[i]?.name,
            text: filterData?.[i]?.name,
          });
        }
        dispatch(setBidPackageDropdownValues(GetUniqueList(list, "label")));
      }
    }
  }, [gridData]);
  useEffect(() => {
    setToastMessage(toastMessageForSM);
    setTimeout(() => {
      dispatch(setToastMessageForSM(""));
    }, 3000);
  }, [toastMessageForSM]);
  /**
   * This effect is to process the incoming query string and act accordingly
   */
  useEffect(() => {
    const { search } = location;
    if (search) {
      const params: any = new URLSearchParams(search);
      setMaxByDefault(params?.get("maximizeByDefault") === "true");
      setInline(params?.get("inlineModule") === "true");
      setFullView(params?.get("inlineModule") === "true");
    }
  }, [location]);

  /**
   * All initial APIs will be called here
   * Grid API
   * Dropdown APIs that supports adding a new record
   */
  useEffect(() => {
    if (server) {
      dispatch(getSMList());
      dispatch(fetchGridData(server));
      dispatch(getDivisionList());
      dispatch(getUnpublishedCount());
      return () => {};
    }
  }, [server]);
  useEffect(() => {
      if(unpublishedCount) {
        let show = unpublishedCount?.lastUnpublishedCount > 0;
        setShowCenterPiece(show);
      }
  },[unpublishedCount]);
  /**
   * Grid data is set in this effect
   *
   * Search, Filters are applied to the source data and the result
   * is set to the local state
   */
  // const modifiedList = SMData;
  useEffect(() => {
    if (SMData?.length > 0) {
      setModifiedList(SMData);
      findAndUpdateFiltersData(
        SMData,
        "division",
        true,
        "text",
        true,
        "number"
      );
      findAndUpdateFiltersData(SMData, "bidPackageName");
      findAndUpdateFiltersData(SMData, "specBook", true, "displayName");
     const data = SMData.map((item:any) => ({
        ...item, pages : `${item.startPage} - ${item.endPage}`,
        bidPackageValue: item.bidPackageName === null || item.bidPackageName === '' ? 'NA' : item.bidPackageName
    }))
    setRowData(data);
    } else {
      setRowData([]);
    }
  }, [SMData]);

  useEffect(() => {
    console.log("fileQueue smw", fileQueue);
    if (fileQueue?.length) dispatch(setSMBrenaStatus(true));
  }, [fileQueue]);

  useEffect(() => {
    if (localhost) {
      dispatch(setServer(_.omit(appData, ["DivisionCost"])));
      dispatch(setCurrencySymbol(currency["USD"]));
    } else {
      if (!server) {
        window.onmessage = (event: any) => {
          let data = event.data;
          data = typeof data == "string" ? JSON.parse(data) : data;
          data =
            data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
          if (data) {
            switch (data.event || data.evt) {
              case "hostAppInfo":
                const structuredData = data.data;
                dispatch(setServer(structuredData));
                dispatch(
                  setCurrencySymbol(
                    currency[
                      structuredData?.currencyType as keyof typeof currency
                    ]
                  )
                );
                break;
              case "getlocalfiles":
                const localUploadedFiles = data.data;
                // dispatch(setUploadedFilesFromLocal(localUploadedFiles));
                break;
              case "getdrivefiles":
                try {
                  console.log("getdrivefiles", data?.data);
                  dispatch(setUploadQueue(data.data));
                } catch (error) {
                  console.log("Error in adding Files from Drive:", error);
                }
                break;
              case "updateparticipants":
                // console.log('updateparticipants', data)
                triggerEvent("updateparticipants", {
                  data: data.data,
                  appType: data.appType,
                });
                break;
              case "updatecommentbadge":
                // console.log('updatecommentbadge', data)
                triggerEvent("updatecommentbadge", {
                  data: data.data,
                  appType: data.appType,
                });
                break;
              case "updatechildparticipants":
                // console.log('updatechildparticipants', data)
                // dispatch(setPresenceData(data.data));
                break;
            }
          }
        };

        postMessage({
          event: "hostAppInfo",
          body: {
            iframeId: "specManagerIframe",
            roomId: server && server.presenceRoomId,
            appType: "SpecManager",
          },
        });
      }
    }
    // dispatch(getSMList());
  }, [localhost, appData]);

  const columns = [
    {
      headerName: "Spec Number",
      pinned: "left",
      field: "number",
      cellClass: "sm-number",
      cellRenderer: "agGroupCellRenderer",
      sort: "asc",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      resizable: true,
      minWidth: 200,
    },
    {
      headerName: "Spec Section Title",
      pinned: "left",
      field: "title",
      cellClass: "sm-title",
      resizable: true,
      minWidth: 350,
    },
    {
      headerName: "Spec Book",
      field: "specBook",
      minWidth: 150,
      suppressMenu: true,
      resizable: true,
      cellClass: "sm-specBookName",
      keyCreator: (params: any) => params.data?.specBook?.fileName || "None",
      valueGetter: (params: any) => `${params?.data?.specBook?.fileName}`
    },
    {
      headerName: "Display Name",
      field: "specBookDisplayName",
      cellClass: "sm-specBookDisplayName",
      minWidth: 200,
      suppressMenu: true,
      resizable: true,
      keyCreator: (params: any) => params.data?.specBook?.displayName || "None",
      valueGetter: (params: any) => `${params?.data?.specBook?.displayName}`
    },
    {
      headerName: "Division",
      field: "division",
      cellClass: "sm-division",
      minWidth: 250,
      rowGroup: true,
      resizable: true,
      suppressMenu: true,
      keyCreator: (params: any) => params.data.division && `${params.data.division.number} - ${params.data.division.text}` || "None",
      valueGetter: (params: any) => {
        const division = params?.data?.division;
        if (
          division &&
          division.number !== undefined &&
          division.text !== undefined
        ) {
          return `${division.number} - ${division.text}`;
        }
      },
    },

    {
      headerName: "Pages",
      field: "pages",
      cellClass: "sm-pages",
      minWidth: 120,
      suppressMenu: true,
      resizable: true,
      cellStyle: { color: "#059cdf" },
      valueGetter: (params: any) => `${params?.data?.startPage} - ${params?.data?.endPage}`
    },
    {
      headerName: "Bid Package",
      field: "bidPackageName",
      cellClass: "sm-bidPackages",
      minWidth: 350,
      resizable: true,
      suppressMenu: true,
      keyCreator: (params: any) => params.data?.bidPackageName || "None",
      valueGetter:(params:any) => params.data?.bidPackageName === '' ? 'NA' : params.data?.bidPackageName
    },
    {
      headerName: "Type",
      field: "extractionType",
      cellClass: "sm-extractionType",
      minWidth: 100,
      suppressMenu: true,
      resizable: true,
    },
    // {
    //   headerName: "System Breakdown Structure (SBS)",
    //   field: "sbsName",
    //   cellClass: "sm-sbsName",
    //   minWidth: 270,
    //   suppressMenu: true,
    //   resizable: true,
    // },
    // {
    //   headerName: "Phase",
    //   field: "sbsPhase",
    //   cellClass: "sm-sbsPhase",
    //   minWidth: 180,
    //   suppressMenu: true,
    //   resizable: true,
    //   cellRenderer: (params: any) => {
    //     const phase = params?.data?.sbsPhase;
    //     const buttonStyle = {
    //       backgroundColor: params?.data?.sbsPhaseColor,
    //       color: "#fff",
    //     };

    //     return (
    //       <>
    //         <Button style={buttonStyle} className="phase-btn">
    //           <span className="common-icon-phase"></span>
    //           {phase}
    //         </Button>
    //       </>
    //     );
    //   },
    // },
    {
      headerName: "Spec Section Name",
      field: "sectionName",
      cellClass: "sm-sectionName",
      resizable: true,
      suppressMenu: true,
      valueGetter: (params: any) => {
        return params.data?.title;
      },
    },
  ];

  const handleClose = () => {
    postMessage({
      event: "closeiframe",
      body: {
        iframeId: "specManagerIframe",
        roomId: server && server.presenceRoomId,
        appType: "SpecManager",
      },
    });
  };

  // const rowSelected = (sltdRows: any) => {
  // 	dispatch(setCurrentChangeEventId(sltdRows));
  // };
  const handleIconClick = () => {
    if (isInline) useHomeNavigation("specManagerIframe", "SpecManager");
  };

  const GridWinTitleMsg = () => {
    return (
      <>
        <Stack direction="row" spacing={2}>
          <div>
            <span>
              You have Unpublished Specs from the previous session, click
              Extract Specs AI button to resume
            </span>
          </div>
        </Stack>
      </>
    );
  };
  const groupRowRendererParams = useMemo(() => {
    return {
      checkbox: true,
      suppressCount: false,
      suppressGroupRowsSticky: true,
    };
  }, []);
  const onRowSelection = (e: any) => {
    let ids: any = [];
    const SelectionService = e.api.getSelectedNodes();
    SelectionService.forEach((item: any) => {
      if (item?.selected) {
        ids.push(item.data.id);
      }
    });
    dispatch(setSelectedRecsData(SelectionService));
    selectedRecData.current = SelectionService;
    selectedRecIds.current = ids;
  };
  const onGridSearch = (searchTxt: string) => {
    setGridSearchText(searchTxt);
  };
  const handleDeleteAction = () => {
    let payload = selectedRecIds?.current?.map((recId) => {
      let specObj = {
        id: recId,
      };
      return specObj;
    });
    deleteMultipleSpecSections(payload)
      .then((res: any) => {
        dispatch(getSMList());
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };
  const handleBulkUpdateClose = () => {
    dispatch(setBulkUpdateDialog(false));
  };
  const handleApply = (val: any) => {
    if (val == "ok") {
      let payload: any = [];
      selectedRecData?.current?.map((item: any) => {
        payload.push({
          id: item?.data?.id,
          // status: item?.data?.status,
          ...bulkUpdateFormValues,
        });
      });
      publishMultipleSpecSection(payload)
        .then((res: any) => {
          if(res) {
            dispatch(getSMList());
            dispatch(setBulkUpdateBtnDisabled(true));
            dispatch(setBulkUpdateFormValues({}));
            dispatch(setBulkUpdateDialog(false));
          }
        })
        .catch((err: any) => {
          console.log("error", err);
          dispatch(setBulkUpdateBtnDisabled(true));
          dispatch(setBulkUpdateFormValues({}));
        });
    } else if (val === "close") {
      dispatch(setBulkUpdateDialog(false));
    }
  };
  const groupOptions = useMemo(() => {
    var groupingMenu = [
      { text: "Division ", value: "division" },
      { text: "Spec Book", value: "specBook" },
      { text: "Bid Package  ", value: "bidPackageName" },
    ];
    return groupingMenu;
  }, []);
  const filterOptions = useMemo(() => {
    var filterMenu = [
      {
        text: "Division ",
        value: "division",
        key: "division",
        children: {
          type: "checkbox",
          items: [],
        },
      },
      {
        text: "Spec Book",
        value: "specBook",
        key: "specBook",
        children: {
          type: "checkbox",
          items: [],
        },
      },
      {
        text: "Bid Package",
        value: "bidPackageName",
        key: "bidPackageName",
        children: {
          type: "checkbox",
          items: [],
        },
      },
    ];
    return filterMenu;
  }, []);
  const [colDefs, setColDefs] = useState<any>(columns);
  const onFilterChange = useCallback((filterValues: any) => {setSelectedFilters(filterValues)}, []);
  const onGroupingChange = useCallback((groupValue: any) => {
    if (groupValue !== "") {
      let updatedColumns: any = [...colDefs].map((rec: any) => {
        if (groupValue) return { ...rec, rowGroup: rec.field === groupValue };
        else return { ...rec, rowGroup: false, sort: null };
      });
      setColDefs(updatedColumns);
    }
  }, []);
  const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(gridSearchText, 'gi');
      const searchVal = Object.keys(item).some((field) => {
        if ((item[field] ?? false) && typeof item[field] === "object") {
          return Object.keys(item?.[field])?.some((objField) => {
            return item?.[field]?.[objField]?.toString()?.match(regex);
          });
        } else {
          return item?.[field]?.toString()?.match(regex);
        }
      });
      const filterVal = (_.isEmpty(selectedFilters) || (!_.isEmpty(selectedFilters)
      && (_.isEmpty(selectedFilters.division) || selectedFilters.division?.length === 0 || selectedFilters.division?.indexOf(`${item.division.number} - ${item.division.text}`) > -1)
      && (_.isEmpty(selectedFilters.specBook) || selectedFilters.specBook?.length === 0 || selectedFilters.specBook?.indexOf(item.specBook?.displayName) > -1)
      && (_.isEmpty(selectedFilters.bidPackageName) || selectedFilters.bidPackageName?.length === 0 || selectedFilters.bidPackageName?.indexOf(item?.bidPackageValue)) > -1));
       return searchVal && filterVal;
		});
	};
	const modifiedData = searchAndFilter(rowData);
  const [previousSession, setPreviousSessions] = useState(false);
  const handleSpecDialogActions = (val: any) => {
    if (val == "ok") {
      
    } else if (val === "close") {
        dispatch(setSpecSessionDlg(false));
    }
  };
  const handleSessionActions= (e:any, val:any) => {
      if(val === 'resume') {
        dispatch(setSMBrenaStatus(true))
      } else if(val === 'startFresh') {
        let params: any = {
          // iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType
        };
          params.folderType = "SpecBooks";
          params.toExtractSpecs = true;
    
        postMessage({
          event: "getdrivefiles",
          body: params,
        });
        dispatch(setSpecStartNewSession(false));
        dispatch(setSpecSessionDlg(false));
      }
  };
  return (
    <>
      <GridWindow
        // centerPiece={showCenterPiece && 'You have Unpublished specs  from the previous session, click Extract Spec AI button to resume.'}
        open={true}
        titleMessage={gridWinTitleMsg ? <GridWinTitleMsg /> : null}
        title="Specifications Manager"
        className="spec-manager-window"
        iconCls="common-icon-spec-manager"
        appType="SpecManager"
        appInfo={server}
        iFrameId="specManagerIframe"
        zIndex={100}
        onClose={handleClose}
        manualLIDOpen={manualLIDOpen}
        moduleColor="#379000"
        inlineModule={isInline}
        isFullView={isFullView}
        maxByDefault={isMaxByDefault}
        onIconClick={handleIconClick}
        presenceProps={{
          presenceId: "spec-manager-presence",
          showLiveSupport: true,
          showLiveLink: true,
          showStreams: true,
          showComments: true,
          showChat: false,
          hideProfile: false,
		}}
		righPanelPresenceProps={{
			presenceId: "spec-manager-presence",
			showLiveSupport: true,
			showStreams: true,
			showPrint:true,
		}}
        tools={{
          closable: true,
          resizable: true,
          openInNewTab: true,
        }}
        PaperProps={{
          sx: {
            width: "95%",
            height: "90%",
          },
        }}
        toast={toastMessage}
        onDetailClose={() => {
          setManualLIDOpen(false);
          dispatch(setEnableSaveButton(false));
		      dispatch(setChangedSMDetailsValue({}));
        }}
        content={{
          // headContent: { regularContent: <ChangeEventRequestsForm /> },
          detailView: SpecificationManagerLID,
          gridContainer: {
            toolbar: {
              leftItems: (
                <SMLeftButtons
                  handleDeleteAction={handleDeleteAction}
                  setManualLIDOpen={setManualLIDOpen}
                />
              ),
              rightItems: <SMRightButtons />,
              searchComponent: {
                show: true,
                type: "regular",
                onSearchChange: onGridSearch,
                groupOptions: groupOptions,
                filterOptions: filterOptions,
                onGroupChange: onGroupingChange,
                onFilterChange: onFilterChange,
                defaultGroups: "division",
              },
            },
            grid: {
              headers: colDefs,
              data: modifiedData,
              // getRowId: (params: any) => params.data?.id,
              grouped: true,
              groupIncludeTotalFooter: false,
              groupIncludeFooter: false,
              groupSelectsChildren: true,
              rowSelection: "multiple",
              groupDefaultExpanded: 1,
              // onRowDoubleClicked:onRowDoubleClick,
              rowSelected: (e: any) => onRowSelection(e),
              nowRowsMsg:
                "<div>Create New Change Event Request by Clicking the + Add button above</div>",
              groupRowRendererParams: groupRowRendererParams,
              groupDisplayType: "groupRows",
              tableref: (val: any) => setGridApi(val),
            },
          },
        }}
      />
      <SMSpecBookDailog
        open={speckBookDialog}
        contentText={<SpecBookDialogContent specRecord={fileQueue} />}
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
          setSpeckBookDialog(false);
        }}
        customButtons={true}
        customButtonsContent={<SpeckBookButtons />}
      />
      <SMSpecBookDailog
        open={false}
        onClose={() => {
          //   handleNotAllowedUserActions("cancel");
        }}
        contentText={<SpecBookStartSessionContent />}
        width={520}
        title={""}
        showActions={false}
        dialogClose={true}
        // showSession={false}
        customButtons={true}
        customButtonsContent={<SpecBookStartSessionButtons />}
        iconTitleContent={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>Confirmation</div>
          </div>
        }
      />

      <SMSpecBookDailog
        open={false}
        onClose={() => {
          //   handleNotAllowedUserActions("cancel");
        }}
        contentText={<SpecBookPublishContent />}
        width={535}
        title={""}
        showActions={false}
        dialogClose={true}
        // showSession={false}
        customButtons={true}
        customButtonsContent={<SpecBookPublishButtons />}
        iconTitleContent={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>Confirmation</div>
          </div>
        }
      />

      <SMSpecBookDailog
        open={bulkUpdateDialog}
        onClose={() => handleBulkUpdateClose()}
        contentText={<SpecBookBulkContent readOnly={true} />}
        width={470}
        title={""}
        showActions={true}
        dialogClose={true}
        positiveActionLabel={"APPLY"}
        iconTitleContent={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>Bulk Update</div>
          </div>
        }
        onAction={(e: any, type: string) => handleApply(type)}
        disable={bulkUpdateBtnDisabled}
        showNegativeBtn={false}
      />

      {gridAlert && (
        <Alert
          severity="success"
          className="floating-toast-cls in-lefttoolbar"
          onClose={() => {
            setGridAlert(false);
          }}
        >
          <span className="toast-text-cls">{gridAlertText}</span>
        </Alert>
      )}
      {/* <SpecBookSnackbar /> */}
      {openBrena && <SMBrenaWindow />}
      {/* <SMSpecBookDailog
          open={specSessionDlg ?? false}
          onClose={() => {
            //   handleNotAllowedUserActions("cancel");
          }}
          contentText={<SMSessionDialogContent />}
          width={519}
          title={""}
          showActions={false}
          dialogClose={true}
          // showSession={false}
          customButtons={true}
          customButtonsContent={<SSUnCommitedBtns handleApply={(e:any, type:any) => handleSessionActions(e, type)}/>}
          iconTitleContent={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>Confirmation</div>
            </div>
          }
          onAction={(e: any, type: string) => handleSpecDialogActions(type)}
        /> */}
    </>
  );
};

export default memo(SpecificationManagerWindow);
