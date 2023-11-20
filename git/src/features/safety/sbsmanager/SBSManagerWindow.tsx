import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { Box, Button, IconButton, TextField, InputLabel, InputAdornment, Stack } from '@mui/material';
import { Close} from '@mui/icons-material';

// import './SBSManagerWindow.scss';

import { appInfoData } from 'data/appInfo';
import convertDateToDisplayFormat, { triggerEvent, stringToUSDateTime } from 'utilities/commonFunctions';
import GridWindow from 'components/iqgridwindow/IQGridWindow';
import { postMessage, isLocalhost, currency } from 'app/utils';
import { getServer, setServer, setFullView, setCurrencySymbol, setAppWindowMaximize, setCostUnitList } from 'app/common/appInfoSlice';
import './SBSManagerWindow.scss';
import SBSManagerForm from './sbsManagerContent/sbsManagerForm/SBSManagerForm';
import { SBSToolbarLeftButtons, SBSToolbarRightButtons } from './sbsManagerContent/toolbar/SBSManagerToolbar';
import SBSCategoryRightPanel from './SBSCategoryRightPanel/SBSCategoryRightPanel';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import { getTrades } from "./enums";
import { getAppsList, getCategoryDropDownOptions, getPhaseDropdownValues, getSBSGridList, setShowSbsPanel, setSelectedNodes } from "./operations/sbsManagerSlice";
import { formatDate } from "utilities/datetime/DateTimeUtils";
import _ from 'lodash';
import { fetchTradesData, getTradeData } from 'features/projectsettings/projectteam/operations/ptDataSlice';
import SbsManagerApplicationLID from "./details/SbsManagerApplicationLID";
import SBSManagePhasesModal from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import PhasesGridList from './phasesGridList/PhasesGridList';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import IQTooltip from 'components/iqtooltip/IQTooltip';

const SBSManagerWindow = (props: any) => {  
  const filterOptions = useMemo(() => {
		var filterMenu =  [
      {
        text: "Category",
        value: "category",
        key: "category",
        children: { type: "checkbox", items: [] },
      },
      {
        text: "Trade",
        value: "trade",
        key: "trade",
        children: { type: "checkbox", items: [] },
      },
      {
        text: "Phase",
        value: "phase",
        key: "phase",
        children: { type: "checkbox", items: [] },
      },
    ];
		return filterMenu;
	}, []);
  const GetUniqueList = (data: any, key?: any) => {
		let unique: any = [];
		data?.map((x: any) =>
			unique?.filter((a: any) => a?.[key] === x?.[key])?.length > 0
				? null
				: unique.push(x)
		);
		unique?.sort((a: any, b: any) =>
			a?.[key]?.localeCompare(b?.[key], undefined, {numeric: true})
		);
		return unique;
	};
  const findAndUpdateFiltersData = (data: any,key: string,nested?: boolean,nestedKey?: any) => {
		const formattedData = data?.map((rec: any) => {
		if(nested)
				return {
					text: rec?.[key]?.[nestedKey],
					value: rec?.[key]?.[nestedKey],
					id: rec?.[key]?.id,
				};
			else
				return {
					text: rec?.[key] === "" ? "NA" : rec?.[key] ?? rec?.['name'],
					value: rec?.[key] === "" ? "NA" : rec?.[key]?? rec?.['name'],
					id: rec?.id,
				};
		});
		const filtersCopy: any = [...filterOptions];
		let currentItem: any = filtersCopy.find((rec: any) => rec?.value === key);
		currentItem.children.items = GetUniqueList(formattedData, "text");
	};
  const dispatch = useAppDispatch();
  const [localhost] = React.useState(isLocalhost);
  const [appData] = React.useState(appInfoData);
  const appInfo = useAppSelector(getServer);
  const { currencySymbol } = useAppSelector((state) => state.appInfo);
  const { sbsGridData, showSbsPanel } = useAppSelector((state) => state.sbsManager);
  const [gridSearchText, setGridSearchText] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<any>();
  const [rowData, setRowData] = useState([]);
  const [modifiedList, setModifiedList] = useState<Array<any>>([]);
  const tradesData: any = useAppSelector(getTradeData);
  const iframeID = "sbsManagerIFrame";
  const appType = "SBSManager";
  const [showManagePhasesModal, setShowManagePhasesModal] = useState<any>(false);
  const [defaultTabId, setDefaultTabId] = useState<any>('');
  const [openRightPanel, setOpenRightPanel] = useState(false);
  const [currentRowSelection, setCurrentRowSelection] = useState<any>(null);
  const [driveFileQueue, setDriveFileQueue] = useState<any>([]);

  useEffect(() => {
		if (tradesData?.length && filterOptions?.length) {
			findAndUpdateFiltersData(tradesData, 'trade');
		}
	}, [tradesData]);
  
  useEffect(() => {
    if (appInfo) {
      dispatch(getSBSGridList());
      dispatch(fetchTradesData(appInfo));
      dispatch(getPhaseDropdownValues());
      dispatch(getCategoryDropDownOptions());
      dispatch(getAppsList());
      
    }
  }, [appInfo]);
  
  React.useEffect(() => {
      if(sbsGridData.length > 0) {
        setModifiedList(sbsGridData);
        setRowData(sbsGridData);
        findAndUpdateFiltersData(sbsGridData, 'phase',true, 'name');
        findAndUpdateFiltersData(sbsGridData, 'category',true,  'name');
      } else if(sbsGridData.length === 0){
        setModifiedList([]);
        setRowData([]);
        findAndUpdateFiltersData(sbsGridData, 'phase', true, 'name');
        findAndUpdateFiltersData(sbsGridData, 'category',true,  'name');
      }
  },[sbsGridData]);
  useEffect(() => {
    if (localhost) {
      dispatch(setServer(_.omit(appData, ['DivisionCost'])));
      dispatch(setCurrencySymbol(currency["USD"]));
      dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
    } else {
      if (!appInfo) {
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
                case 'getdrivefiles':
                  try {
                    setDriveFileQueue(data.data);
                  } catch (error) {
                    console.log('Error in adding Bid Reference file from Drive', error);
                  }
								break;
              case "updateparticipants":
                triggerEvent("updateparticipants", {
                  data: data.data,
                  appType: data.appType,
                });
                break;
              case "updatecommentbadge":
                triggerEvent("updatecommentbadge", {
                  data: data.data,
                  appType: data.appType,
                });
                break;
            }
          }
        };
        postMessage({
          event: "hostAppInfo",
          body: {
            iframeId: iframeID,
            roomId: appInfo && appInfo.presenceRoomId,
            appType: appType,
          },
        });
      }
    }
  }, [localhost, appData]);
  const saveFilesFromDrive = (appInfo: any, fileList: Array<any>) => {
		const structuredFiles = fileList.map((file: any) => {
			return {
				type: 'Additional',
				description: file.description,
				stream: {
					driveObjectId: file.id
				}
			};
		});
    console.log('structuredFiles',structuredFiles)
		// addContractFiles(appInfo, currentContract?.id, structuredFiles)
		// 	.then((res: any) => {
		// 		dispatch(setAdditionalFiles(res?.additional));
		// 		dispatch(setContractFilesCount((res?.standard?.length || 0) + (res?.additional?.length || 0)));
		// 		dispatch(getClientContractDetails({ appInfo: appInfo, contractId: currentContract.id }));
		// 	});
	};
  useEffect(() => {
		if (driveFileQueue?.length > 0) {
      console.log('driveFileQueue',driveFileQueue);
			saveFilesFromDrive(appInfo, [...driveFileQueue]);
			setDriveFileQueue([]);
		}
	}, [appInfo, driveFileQueue]);


  const columns = [
    {
      headerName: "Category",
      field: "category",
      suppressMenu: true,
      pinned: "left",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      keyCreator: (params: any) => params.data?.category?.name || "None",
      valueGetter: (params: any) => `${params?.data?.category?.name}`,
      minWidth: 350,
      cellRenderer: (params: any) => {
        return (
          <div className="sbs-category-cell">
            {(
              <IQTooltip
                title={
                  <Stack direction="row" className="tooltipcontent">
                    <p className="tooltiptext">
                      Category name needs to be updated.
                    </p>
                  </Stack>
                }
                placement={"bottom"}
                arrow={true}
              >
                <WarningAmberIcon
                  fontSize={"small"}
                  style={{ color: "red" }}
                />
              </IQTooltip>
            )}
            {params.data?.category?.name || "N/A"}
          </div>
        );
      },
    },
    {
      headerName: "Phase",
      field: "phase",
      pinned: "left",
      suppressMenu: true,
      // checkboxSelection: true,
      keyCreator: (params: any) => params.data?.phase?.name || "None",
      minWidth: 260,
      cellRenderer: (params: any) => {
        const phase = params.data?.phase?.name;
        const buttonStyle = {
          backgroundColor: params.data?.phase?.color ?? "red",
          color: "#fff",
          alignItems: "center",
        };

        return (
          <>
            {phase ? (
              <Button style={buttonStyle} className="phase-btn">
                <span className="common-icon-phase"></span>
                {phase}
              </Button>
            ) : null}
          </>
        );
      },
    },
    {
      headerName: "Trade",
      field: "trade",
      suppressMenu: true,
      keyCreator: (params: any) =>
        (params?.data?.trades && getTrades(params?.data?.trades)) || "None",
      valueGetter: (params: any) =>
        params?.data?.trades && getTrades(params?.data?.trades),
      minWidth: 300,
    },
    {
      headerName: "Est. Start Date",
      field: "startDate",
      suppressMenu: true,
      minWidth: 200,
      valueGetter: (params: any) =>
        params?.data
          ? formatDate(params?.data?.startDate, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "",
    },
    {
      headerName: "Est. End Date",
      field: "endDate",
      suppressMenu: true,
      minWidth: 200,
      valueGetter: (params: any) =>
        params?.data
          ? formatDate(params?.data?.endDate, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "",
    },
    {
      headerName: "Supplemental Info",
      field: "supplementalInfo",
      suppressMenu: true,
      minWidth: 200,
      cellRenderer: (params: any) => {
        return (
          <div
            className="sbs-suppli-info-cell"
            onClick={() => {
              setDefaultTabId("SBSAdditionalInfo");
              setOpenRightPanel(true);
              setCurrentRowSelection(params.data);
            }}
          >
            View/Update Info
          </div>
        );
      },
    },
  ];  
  const [colDefs, setColDefs] = React.useState(columns);

  const handleClose = () => {
    postMessage({
      event: "closeiframe",
      body: {
        iframeId: iframeID,
        roomId: appInfo && appInfo.presenceRoomId,
        appType: appType,
      },
    });
  };

  const onGroupingChange = useCallback((groupValue: any) => {
    if (groupValue !== "") {
      let updatedColumns: any = [...colDefs].map((rec: any) => {
        if (groupValue) return { ...rec, rowGroup: rec.field === groupValue };
        else return { ...rec, rowGroup: false, sort: null };
      });
      setColDefs(updatedColumns);
    }
  }, []);

  const groupRowRendererParams = useMemo(() => {
    return {
      checkbox: true,
      suppressCount: false,
      suppressGroupRowsSticky: true,
    };
  }, []);
  const handleSelectedCategory = (type:string) => {
    switch (type) {
			case 'sbs': {
				
				break;
			}
			case 'managerSbs': {
				setShowManagePhasesModal(true);
				break;
			}
			case 'supplemental': {
				
				break;
			}
			case 'dynamicHeatMap': {
				break;
			}
			default: {
				break;
			}
    };
      console.log('type', type);
  };
  const handleSbsCategoryChange = (val:string) => {
    console.log('Category val', val);
  };
  const onFilterChange = useCallback((filterValues: any) => {
		    setSelectedFilters(filterValues);
	}, []);
  const onGridSearch = (searchTxt: string) => {
		    setGridSearchText(searchTxt);
	};
  const onRowSelection = (e: any) => {
    const SelectionService = e.api.getSelectedRows();
    dispatch(setSelectedNodes(SelectionService))
  }
  const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
      const tradeNames = item.trades?.map((x: any) => x?.name?.toString());
			const regex = new RegExp(gridSearchText, "gi");
			const searchVal = Object.keys(item).some((field) => {
        if (Array.isArray(item[field])) {
            if(item[field]?.length > 0) {
              for (let i = 0; i < item[field].length; i++) {
                return Object.keys(item?.[field]?.[i])?.some((objField) => {
                  return item?.[field]?.[i]?.[objField]?.toString()?.match(regex);
                });
              }
            } else return false;
        } else if((item[field] ?? false) && typeof item[field] === "object") {
					  return Object.keys(item?.[field])?.some((objField) => {
						  return item?.[field]?.[objField]?.toString()?.match(regex);
					});
				} else return item?.[field]?.toString()?.match(regex);
			});
			const filterVal =
				_.isEmpty(selectedFilters) ||
				(!_.isEmpty(selectedFilters) &&
					(_.isEmpty(selectedFilters.category) ||
						selectedFilters.category?.length === 0 ||
						selectedFilters.category?.indexOf(item.category.name) > -1) &&
					(_.isEmpty(selectedFilters.phase) ||
						selectedFilters.phase?.length === 0 ||
						selectedFilters.phase?.indexOf(item.phase.name) > -1) 
            &&
            (_.isEmpty(selectedFilters.trade) ||
            selectedFilters.trade?.length === 0 ||
            _.intersection(selectedFilters.trade, tradeNames).length > 0)
        );
			return searchVal && filterVal;
		});
	};
  useEffect(() => {
		if(gridSearchText || selectedFilters) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [gridSearchText, selectedFilters]);
  return (
    <div className="sbs-manager-cls">
      <GridWindow
        open={true}
        title="System Breakdown Structure (SBS) Manager"
        iconCls='common-icon-SBS'
        className={'SBS-window-cls'}
        appType={appType}
        appInfo={appInfoData}
        iFrameId={iframeID}
        zIndex={100}
        onClose={handleClose}
        defaultTabId={defaultTabId}
        manualLIDOpen={openRightPanel}
        currentRowSelectionData={currentRowSelection}
        //showPinned={true}
        // isFullView={true}
        lidCondition={(rowData: any) => {
					return true;
				}}
        presenceProps={{
          presenceId: "sbs-manager-presence",
          showLiveSupport: true,
          showLiveLink: true,
          showStreams: true,
          showComments: true,
          showChat: false,
          hideProfile: false,
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
        content={{
          headContent: {
            regularContent: <SBSManagerForm />,
          },
          detailView: SbsManagerApplicationLID,
          gridContainer: {
            toolbar: {
              leftItems: <SBSToolbarLeftButtons />,
              rightItems: <SBSToolbarRightButtons />,
              searchComponent: {
                show: true,
                type: "regular",
                groupOptions: [
                  { text: "Category", value: "category" },
                  { text: "Trade", value: "trade" },
                  { text: "Phase", value: "phase" },
                ],
                filterOptions: filterOptions,
                onGroupChange: onGroupingChange,
                onFilterChange: onFilterChange,
                onSearchChange: onGridSearch,
                defaultGroups: "category",
              },
            },
            grid: {
              headers: colDefs,
              data: rowData,
              getRowId: (params: any) => params.data.id,
              groupIncludeTotalFooter: false,
              groupIncludeFooter: false,
              groupSelectsChildren: true,
              rowSelection: "multiple",
              groupDefaultExpanded: 1,
              grouped: true,
              groupRowRendererParams: groupRowRendererParams,
              groupDisplayType: "groupRows",
              // onRowDoubleClicked:onRowDoubleClick,
              rowSelected: (e: any) => onRowSelection(e),
              nowRowsMsg:
                "<div>Add new SBS item by clicking the + Add button above</div>",
            },
          },
        }}
      />
      {showSbsPanel && (
        <SUIDrawer
        PaperProps={{
          style: {
            position: "fixed",
            marginTop: "9%",
            marginRight: "2.5%",
            height: "76%",
            borderRadius: "10px",
            boxShadow: "-6px 0px 10px -10px",
            border: "1px solid rgba(0, 0, 0, 0.12) !important",
          },
        }}
        anchor="right"
        variant="permanent"
        elevation={2}
        open={false}
      >
        <Box sx={{ width: "20.5vw", height: "100%" }} role="presentation">
          <Stack direction="row" sx={{ justifyContent: "end", height: "5em" }}>
            <IconButton
              aria-label="Close Right Pane"
              onClick={() => dispatch(setShowSbsPanel(false))}
            >
              <Close />
            </IconButton>
          </Stack>
          <div style={{ height: "calc(100% - 5em)" }}>
            <SBSCategoryRightPanel
              handleSelectedCategory={(val: any) => handleSelectedCategory(val)}
              handleSbsCategoryChange={(val: any) => handleSbsCategoryChange(val)
              }
            />
          </div>
        </Box>
      </SUIDrawer>
      )}
        <SBSManagePhasesModal 
          open={showManagePhasesModal}
          className={'sbs-manage-phases-dialog'}
          contentText={<PhasesGridList></PhasesGridList>}
          title={""}
          showActions={false}
          dialogClose={true}
          helpIcon={true}
          iconTitleContent={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>Manage Phases</div>
            </div>
          }
          onAction={() => {
            setShowManagePhasesModal(false);
          }}
          customButtons={true}
          customButtonsContent={<></>}
        />
    </div>
  );
};

export default SBSManagerWindow;