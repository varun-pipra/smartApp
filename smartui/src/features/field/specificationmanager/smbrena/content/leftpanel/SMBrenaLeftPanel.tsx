import { Box, Stack } from "@mui/material";
import { CellClickedEvent, ColDef } from "ag-grid-community";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Grid from "sui-components/Grid/Grid";
import { SMBrenaToolbar } from "./SMBrenaToolbar";
import IQButton from "components/iqbutton/IQButton";
import BrenaLoading from "resources/images/brena/brena-gif.gif";
import BrenaLoadingdot from "resources/images/brena/load-dot.gif";
import "./SMBrenaLeftPanel.scss";
import { useSelector } from "react-redux";
import {
  getBrenaList,
  getSMList,
  resetSpecBookPages,
  setGridWinTitleMsg,
  setSMBrenaStatus,
  setSectionsDlg,
  setSmSelectedBrenaIds,
  setSpecSessionDlg,
  setToastMessageForSM,
  setWorkingSectionsId,
} from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getUploadQueue } from "features/field/specificationmanager/stores/FilesSlice";
import {
  publishSpecSection,
  publishMultipleSpecSection,
  deleteMultipleSpecSections,
  fetchSectionsCommit,
  fetchSectionsNew,
  fetchSectionsRollBack,
} from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import PublishBrenaDailog from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import { PublishDialogButtons, SpecBookPublishButtons } from "features/field/specificationmanager/content/specbookpublishcontent/SpecBookPublishContent";
import { getSketchIns, setSketchMarkup } from "app/common/appInfoSlice";
import { extractSubmittalFromSection } from "features/field/smartsubmittals/smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarApi";
import { setSSBrenaStatus } from "features/field/smartsubmittals/stores/SmartSubmitalSlice";
import _ from "lodash";
import { isLocalhost } from "app/utils";
export interface LeftPanelProps {
  closeBrena?: any;
}

const SMBrenaLeftPanel = (props: LeftPanelProps) => {
  const { closeBrena } = props;

  const [data, setData] = useState<any>([]);
  const [gridRef, setGridRef] = useState<any>();
  const [showBrenaSuggestion, setShowBrenaSuggestion] = useState(true);
  const [selectedRecIds, setSelectedRecIds] = useState([]);
  const fileQueue = useAppSelector(getUploadQueue);
  const gridContainerStyle = useMemo(
    () => ({ height: "calc(100% - 55px)", width: "100%" }),
    []
  );

  const {specBrenaFilters, brenaData, brenaSearchText, smSelectedBrenaIds, unpublishedCount,specStartNewSession, workingSectionsId,sectionsDlg } = useAppSelector(
    (state: any) => state.specificationManager
  );
  const [modifiedList, setModifiedList] = useState<Array<any>>([]);
  const [publishDialog, setPublishDialog] = useState(false);
  const dispatch = useAppDispatch();
  const sketchInstance = useAppSelector(getSketchIns);
  const [docViewerins, setDocViewerins] = useState<any>({});
  const [rowData, setRowData] = useState([]);
  const isCompMountedOnce = useRef(false);
  const disableField =
    selectedRecIds.length > 0 || smSelectedBrenaIds.length > 0;

  useEffect(() => {
    // if (fileQueue?.length) {
      getBrenaData();
    // }
  }, [fileQueue]);

  useEffect(() => {
    console.log("brenadAta", brenaData);
    let intervalIns: any;
    if (brenaData.length) {
      setShowBrenaSuggestion(false);
      const data:any = brenaData.map((item:any) => ({
        ...item, divisionName : `${item?.division?.number} - ${item?.division?.text}`
      }));
      setRowData(data);
      setModifiedList(data);
      // dispatch(setWorkingSectionsId(brenaData?.[0].workingSessionId));
      // if (!isCompMountedOnce?.current) {
      // isCompMountedOnce.current = true;
      // fetchSectionsNew(brenaData?.[0].workingSessionId).then((res: any) => {}).catch((err: any) => {});
      // };
      if(intervalIns) clearInterval(intervalIns);
    } else {
      intervalIns = setTimeout(() => {
        getBrenaData();
        dispatch(setSpecSessionDlg(false));
      }, 2000);
    }
  }, [brenaData]);

  useEffect(() => {
    setDocViewerins(sketchInstance);
  }, [sketchInstance]);

  const getBrenaData = () => {
    // if (unpublishedCount?.lastUnpublishedCount > 0 && !specStartNewSession) {
    //   dispatch(getBrenaList({id: unpublishedCount?.lastSpecBookId}));
    //   dispatch(setSpecSessionDlg(false));
    // } else {
      dispatch(getBrenaList(fileQueue?.[0]));
    // }
  };

  const columns: ColDef[] = [
    {
      headerName: "Spec No.",
      field: "number",
      cellStyle: { color: "#059cdf"},
      checkboxSelection: true,
      headerCheckboxSelection: true,
      minWidth: 130,
    },
    {
      headerName: "Division",
      field: "division",
      rowGroup: true,
      hide: true,
      keyCreator: (params: any) => {
        return `${params?.data?.division?.number} - ${params?.data?.division?.text}`;
      },
      valueGetter: (params: any) => {
        if (params?.node?.level) {
          return `${params?.data?.division?.number} - ${params?.data?.division?.text}`;
        }
      },
    },
    {
      headerName: "Spec Section Title",
      menuTabs: [],
      field: "title",
      flex: 3,
    },
    {
      headerName: "Pages",
      // field: "pages",
      menuTabs: [],
      minWidth: 10,
      cellStyle: { color: "#059cdf", cursor: "pointer" },
      valueGetter: (params: any) => {
        if (params?.node?.level) {
          return `${params?.data?.startPage} - ${params?.data?.endPage}`;
        }
      },
      onCellClicked: (event: CellClickedEvent) => {
        docViewerins.navigateToPage(event?.data?.startPage);
      },
    },
  ];
  columns.forEach((item: any) => {
    if (!item.suppressMenu) item.suppressMenu = true;
  });
  const GroupRowInnerRenderer = (props: any) => {
    const node = props.node;
    if (node.group) {
      const data = node?.childrenAfterGroup?.[0]?.data || {};
      return `${data?.division?.number} - ${data?.division?.text}`;
    }
  };
  const groupRowRendererParams = useMemo(() => {
    return {
      checkbox: true,
      suppressCount: false,
      suppressGroupRowsSticky: true,
      innerRenderer: GroupRowInnerRenderer,
    };
  }, []);

  const onclosePopup = () => {
    setPublishDialog(false);
  };

  const PublishSpecButton = useCallback(() => {
    const publishSpec = () => {
      setPublishDialog(true);
    };

    return (
      <Stack>
        <IQButton color="blue" onClick={publishSpec} disabled={!disableField}>
          PUBLISH SPECS
        </IQButton>
      </Stack>
    );
  }, [disableField]);
  const PublishDialogContent = () => {
    return (
      <>
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <div>How do you want to proceed?</div>
        </div>
      </>
    );
  };

  const deleteSections = () => {
    let payload = selectedRecIds.map((recId) => {
      let specObj = {
        id: recId,
      };
      return specObj;
    });
    deleteMultipleSpecSections(payload)
      .then((res: any) => {
        console.log("res", res);
        dispatch(getBrenaList(fileQueue?.[0]));
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  const handleCloseAll = () => {
    setPublishDialog(false);
    closeBrena();
    dispatch(setSMBrenaStatus(false));
    dispatch(resetSpecBookPages(""));
    dispatch(getSMList());
    dispatch(setSketchMarkup(null));
    dispatch(setSpecSessionDlg(false));
    dispatch(setSectionsDlg(false));
    dispatch(setSSBrenaStatus(false));
  };

  const handleAction = (e: any, btn: any) => {
    console.log("Firing button events", e, btn);
    if (btn === "resumeLater") {
      handleCloseAll();
      dispatch(setGridWinTitleMsg(true));
    }
    if (btn === "publishSpecsAndGenerateSubmittals") {

      let payload = selectedRecIds.map((recId: any) => {
        return {
          id: recId,
          issubmittalextracted: 1,
          status: "Published"
        };
      });
  
      extractSubmittalFromSection(payload)
        .then((res) => {
          handleCloseAll();
          dispatch(setToastMessageForSM("Specs published & submittals generated successfully."));
          console.log("extractSubmittalFromSection res", res);
          // fetchSectionsCommit(workingSectionsId).then((res: any) => {}).catch((err: any) => {});
        })
        .catch((err) => {
          console.log("extractSubmittalFromSection err", err);
        });
    }
    if (btn === "publishSpecs") {
      let payload = selectedRecIds.map((recId) => {
        let specObj = {
          id: recId,
          status: "Published",
        };
        return specObj;
      });
      publishMultipleSpecSection(payload)
        .then((res: any) => {
          console.log("res", res);
          handleCloseAll();
          dispatch(setToastMessageForSM("Specs published successfully."));
          // fetchSectionsCommit(workingSectionsId).then((res: any) => {}).catch((err: any) => {});
        })
        .catch((err: any) => {
          console.log("error", err);
          handleCloseAll();
        });
    }
  };

  const onRowSelection = (e: any) => {
    let ids: any = [];
    const SelectionService = Object.entries(
      e.api.selectionService.selectedNodes
    ).map((e) => ({ [e[0]]: e[1] }));
    SelectionService.forEach((item: any) => {
      let getKey = Object.keys(item)[0];
      if (item?.[getKey]?.selected) {
        ids.push(item[getKey].data.id);
      }
    });
    setSelectedRecIds(ids);
    dispatch(setSmSelectedBrenaIds(ids));
  };
  const handleSpecAction = (e: any, btn: any) => {
    if (btn === "discard") {
      handleCloseAll();
      dispatch(setGridWinTitleMsg(true));
    }
    if (btn === "resumeLater") {
          // fetchSectionsRollBack(workingSectionsId).then((res: any) => {}).catch((err: any) => {});
          handleCloseAll();
    }
    if (btn === "publishSpecs") {
      let payload = selectedRecIds.map((recId) => {
        let specObj = {
          id: recId,
          status: "Published",
        };
        return specObj;
      });
      publishMultipleSpecSection(payload)
        .then((res: any) => {
          console.log("res", res);
          handleCloseAll();
          dispatch(setToastMessageForSM("Specs published successfully."));
          // fetchSectionsRollBack(workingSectionsId).then((res: any) => {}).catch((err: any) => {});
        })
        .catch((err: any) => {
          console.log("error", err);
          handleCloseAll();
        });
    };
  };
  const handleDialogActions = (val: any) => {
    if (val == "ok") {
      
    } else if (val === "close") {
      dispatch(setSectionsDlg(false));
      // handleCloseAll();
    }
  };
  useEffect(() => {
      if(brenaSearchText || specBrenaFilters) {
          const data = searchAndFilter([...modifiedList]);
          setRowData(data);
      }
  },[specBrenaFilters, brenaSearchText])
  const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(brenaSearchText, 'gi');
      const searchVal = Object.keys(item).some((field) => {
        if ((item[field] ?? false) && typeof item[field] === "object") {
          return Object.keys(item?.[field])?.some((objField) => {
            return item?.[field]?.[objField]?.toString()?.match(regex);
          });
        } else {
          return item?.[field]?.toString()?.match(regex);
        }
      });
      const filterVal = (_.isEmpty(specBrenaFilters) || (!_.isEmpty(specBrenaFilters)
      && (_.isEmpty(specBrenaFilters.division) || specBrenaFilters.division?.length === 0 || specBrenaFilters.division?.indexOf(item?.divisionName)) > -1));
       return searchVal && filterVal;
		});
	};
  const rowClassRules = useMemo(() => {
    return {
      'spec-sections-new': 'data.newSection ? true : false',
      'spec-sections-updated': 'data.updatedSection ? true : false',
      'spec-sections-removed': 'data.removedSection ? true : false',
    };
  }, []);
  const centerNodes = [
    { id: 1, name: "New", count: 1, color: "#F0FEDA" },
    { id: 2, name: "Updated", count: 2, color: "#FFEFCA" },
    { id: 3, name: "Removed", count: 3, color: "#FFF3F4" },
  ];
  return (
    <Box className="sm-brena-left-cont">
      {showBrenaSuggestion ? (
        <div className="brena-animate-cls">
          <div className="brena-gif">
            <img className="sm-brena-left-initial" src={BrenaLoading} />
          </div>
          <div className="brena-text">
            <p>
              <b>Brena</b> is automatically extracting the spec Section details
              from the uploaded document....
            </p>
          </div>
          <div className="brena-dot">
            {" "}
            <img src={BrenaLoadingdot} />
          </div>
        </div>
      ) : (
        <div className="sm-toolbar-grid">
          <Stack className="sm-brena-tool-cont" direction="row">
            <SMBrenaToolbar deletedSections={deleteSections} />
          </Stack>

          <div style={gridContainerStyle}>
            <Grid
              headers={columns}
              data={rowData}
              rowSelection={"multiple"}
              rowMultiSelectWithClick={true}
              // groupDisplayType="singleColumn"
              // getRowId={(record: any) => record.data.contentId}
              nowRowsMsg={"<div>No records to display</div>"}
              rowSelected={(e: any) => onRowSelection(e)}
              showOpenedGroup={true}
              groupSelectsChildren={true}
              getReference={(value: any) => {
                setGridRef(value);
              }}
              groupDisplayType="groupRows"
              groupRowRendererParams={groupRowRendererParams}
              grouped={true}
              groupIncludeTotalFooter={false}
              groupIncludeFooter={false}
              suppressRowClickSelection={true}
              rowClassRules={rowClassRules}
            />
          </div>
          <div className ='sm-brena-left-footer-container'>
          <div className="ss-brena-left-footer_center-footer" style={{border : 'none'}}>
              {isLocalhost && centerNodes.map((item) => {
                return (
                  <div className="ss-brena-left-footer_center-container-footer">
                    <span
                      className="ss-brena-left-footer_statusCircle"
                      style={{ color: item.color, backgroundColor: item.color }}
                    ></span>
                    <span>{`${item.count}` + " " + `${item.name}`}</span>
                  </div>
                );
              })}
            </div>
          <div className="iq-brena-footer-btn">
            <PublishSpecButton />
          </div>
          </div>
          <PublishBrenaDailog
            open={publishDialog}
            onAction={onclosePopup}
            contentText={<PublishDialogContent />}
            width={685}
            title={""}
            showActions={false}
            dialogClose={true}
            customButtons={true}
            customButtonsContent={
              <PublishDialogButtons
                handleAction={(e: any, btn: any) => handleAction(e, btn)}
              />
            }
            iconTitleContent={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>Confirmation</div>
              </div>
            }
          />
           <PublishBrenaDailog
            open={sectionsDlg}
            onAction={(e: any, type: string) => handleDialogActions(type)}
            contentText={<PublishDialogContent />}
            width={685}
            title={""}
            showActions={false}
            dialogClose={true}
            customButtons={true}
            customButtonsContent={
              <SpecBookPublishButtons
                handleAction={(e: any, btn: any) => handleSpecAction(e, btn)}
              />
            }
            iconTitleContent={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>Confirmation</div>
              </div>
            }
          />
        </div>
      )}
    </Box>
  );
};

export default memo(SMBrenaLeftPanel);