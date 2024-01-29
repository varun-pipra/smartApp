import React, { useRef, useState, useMemo, useEffect } from "react";
import "./ReferenceFiles.scss";
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import {
  useDriveFileBrowser,
  useAppSelector,
  useLocalFileUpload,
  fileDownload,
  useAppDispatch,
} from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import { IconButton, Button } from "@mui/material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQSearch from "components/iqsearchfield/IQSearchField";
import SUIGrid from "sui-components/Grid/Grid";
import { formatDate } from "utilities/datetime/DateTimeUtils";
import {
  AddFiles,
  deleteFiles,
} from "features/safety/sbsmanager/operations/sbsManagerAPI";
import { getSBSDetailsById } from "features/safety/sbsmanager/operations/sbsManagerSlice";
import _ from "lodash";
import { findAndUpdateFiltersData } from "features/safety/sbsmanager/utils";
const referenceData = [
  {
    id: 1,
    name: "Ground Floor Plan",
    description: "test",
    createdby: "Andrew Peterson",
    date: "2023-12-29T18:30:00Z",
    type: "Drawing",
    phase: "Post Construction",
  },
  {
    id: 2,
    name: "Ground Floor Plan",
    description: "test",
    createdby: "Andrew Simmons",
    date: "2023-12-29T18:30:00Z",
    type: "Sketch",
    phase: "Operations & Maintance",
  },
];
const filterOptions = [
  {
    text: "Phase",
    value: "phase",
    key: "phase",
    keyValue: "phase",
    children: {
      type: "checkbox",
      items: [],
    },
  },
  {
    text: "Type",
    value: "folderType",
    key: "folderType",
    keyValue: "folderType",
    children: {
      type: "checkbox",
      items: [],
    },
  },
];

const UploadFileMethod = (props: any) => {
  const inputRef = useRef<any>();
  const onItemClick = (selectedItem: any) => {
    if (selectedItem?.type === "local") {
      localFileUpload();
    }
    if (selectedItem?.type === "project") {
      projectFileUpload();
    }
  };
  const localFileUpload = () => {
    if (inputRef.current) {
      inputRef?.current?.click();
    }
  };
  const projectFileUpload = () => {
    props.onProjectFile(props?.folderType);
  };
  const handleFileChange = (event: any) => {
    event.preventDefault();
    props.localFileClick(event.target.files);
    event.target.value = null;
  };

  return (
    <>
      <UploadMenu
        showDriveOption={true}
        showContractOption={false}
        label={"Add Files"}
        folderType={props?.folderType}
        onItemClick={onItemClick}
        dropdownLabel={"Select Type"}
      />
      <input
        multiple
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
      />
    </>
  );
};

const ReferenceFiles =(props: any) => {
  const { selectedRec, ...rest } = props;
  const appInfo = useAppSelector(getServer);
  const { detailsData } = useAppSelector((state) => state.sbsManager);
  const [showDownloadButton, setShowDownloadButton] = useState<boolean>(true);
  const [disableDownloadBtn, setDisableDownloadBtn] = useState<boolean>(true);
  const [disableDeleteBtn, setDisableDeleteBtn] = useState<boolean>(true);
  const [selected, setSelected] = useState<any>();
  const [gridSearchText, setGridSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<any>();
  const [modifiedList, setModifiedList] = useState<Array<any>>([]);
  const [filters, setFilters] = React.useState<any>(filterOptions);
  const dispatch = useAppDispatch();

  var tinycolor = require("tinycolor2");
  const [gridData, setGridData] = useState<any>([]);
  const [refFiles, setRefFiles] = useState<any>([]);
  React.useEffect(() => {
    if((detailsData?.referencefiles?.length ?? [])) {
      const data: any = (detailsData?.referencefiles || []).map((item: any) => ({
				...item,
        phaseValue : item.phase.name === null || item.phase.name === undefined || item.phase.name === '' ? 'NA' : item.phase.name,
        creationDateValue : item?.createdDate ? formatDate(item?.createdDate) : "",
        folderType : (typeof item?.folderType === 'number') ? item?.folderType?.toString() : item?.folderType
			}));
      setModifiedList(data);
      setGridData(data);
      setFilters(findAndUpdateFiltersData(filterOptions, data, "phase", true, "name"));
      setFilters(findAndUpdateFiltersData(filterOptions, data, "folderType"));
    } else if((detailsData?.referencefiles?.length === 0 ?? false)){
      setModifiedList([]);
      setGridData([]);
      setFilters(findAndUpdateFiltersData(filterOptions, detailsData?.referencefiles, "phase", true, "name"));
      setFilters(findAndUpdateFiltersData(filterOptions, detailsData?.referencefiles, "folderType"));
    }
  }, [detailsData?.referencefiles]);

  const headers = useMemo(
    () => [
      {
        headerName: "Name",
        suppressMenu: true,
        pinned: "left",
        field: "name",
        sort: "asc",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 300,
        valueGetter: (params: any) => params.data?.name,
        comparator: (valueA: any, valueB: any) =>
          valueA?.toLowerCase().localeCompare(valueB?.toLowerCase()),
        cellRenderer: (params: any) => {
          return (
            params.data && (
              <div className={`app-items-cell-contentt`}>
                <span className="ref-name-icon">
                  <span className="common-icon-drawings"></span>
                </span>
                <span
                  className="ref-name-tag"
                  style={{ color: params.data?.smartAppId ? "#059CDF" : "" }}
                >
                  {params.value}
                </span>
              </div>
            )
          );
        },
      },
      {
        headerName: "Description",
        field: "description",
        minWidth: 180,
        suppressMenu: true,
      },
      {
        headerName: "Created By",
        field: "createdBy",
        minWidth: 150,
        suppressMenu: true,
        valueGetter: (params: any) =>  params?.data?.createdBy?.name || "",
        keyCreator: (params: any) => params.data?.createdBy?.name || 'None'
      },
      {
        headerName: "Creation Date",
        field: "createdDate",
        valueGetter: (params: any) =>
          params.data?.createdDate ? formatDate(params.data?.createdDate) : "",
      },
      {
        headerName: "Type",
        maxWidth: 120,
        field: "folderType",
      },
      {
        headerName: "Phases",
        field: "phase.name",
        minWidth: 250,
        suppressMenu: true,
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
              ) : 'NA'}
            </>
          );
        },
      },
    ],
    []
  );

  const projectFileUpload = (folderType: string) => {
    console.log("folderType", folderType);
    useDriveFileBrowser({
      iframeId: "sbsManagerIFrame",
      roomId: appInfo && appInfo.presenceRoomId,
      appType: "SBSManager",
      folderType: folderType,
    });
  };

  const localFileUpload = (data: any) => {
    console.log("localFileUpload", data);
    useLocalFileUpload(appInfo, data).then((fileList: any) => {
      const structuredFiles = fileList?.map((file: any) => {
        return {
          type: "local",
          name: file.name,
          id: file.id,
        };
      });
      console.log("structuredFiles", structuredFiles);

      AddFiles(detailsData?.id, structuredFiles, (response: any) => {
        dispatch(getSBSDetailsById(selectedRec?.uniqueid))
      });
      // .then((res: any) => {
      // 	dispatch(setAdditionalFiles(res?.additional));
      // 	dispatch(setContractFilesCount((res?.standard?.length || 0) + (res?.additional?.length || 0)));
      // 	dispatch(getClientContractDetails({ appInfo: appInfo, contractId: currentContract.id }));
      // });
    });
  };
  const onSelectedFilesDownload = () => {
    console.log("onSelectedFilesDownload", selected);
    const ids = selected?.map((item: any) => item.id);
    const filename = detailsData?.name + " - " + "files";
    fileDownload(ids, filename);
  };
  const onSelectedFilesDelete = () => {
    console.log("onSelectedFilesDelete", selected);
    deleteFiles(
      detailsData?.id,
      selected?.map((file: any) => file.fileId),
      (response: any) => {
        dispatch(getSBSDetailsById(detailsData?.uniqueid))
      }
    );
  };
  const rowSelected = (sltdRows: any) => {
    const selectedRowData = sltdRows.api.getSelectedRows();
    if (selectedRowData?.length > 0) {
      setDisableDeleteBtn(false);
      setDisableDownloadBtn(false);
    } else {
      setDisableDeleteBtn(true);
      setDisableDownloadBtn(true);
    }
    setSelected(selectedRowData);
  };

  useEffect(() => {
    if (gridSearchText || selectedFilters) {
      const data = searchAndFilter([...modifiedList]);
      setGridData(data);
    }
  }, [gridSearchText, selectedFilters]);
  
  const searchAndFilter = (list: any) => {
    return list.filter((item: any) => {
      const regex = new RegExp(gridSearchText, "gi");
      const searchVal = Object.keys(item).some((field) => {
        if (Array.isArray(item[field])) {
          if (item[field]?.length > 0) {
            for (let i = 0; i < item[field].length; i++) {
              return Object.keys(item?.[field]?.[i])?.some((objField) => {
                return item?.[field]?.[i]?.[objField]?.toString()?.match(regex);
              });
            }
          } else return false;
        } else if ((item[field] ?? false) && typeof item[field] === "object") {
          return Object.keys(item?.[field])?.some((objField) => {
            return item?.[field]?.[objField]?.toString()?.match(regex);
          });
        } else return item?.[field]?.toString()?.match(regex);
      });
      const filterVal =
        _.isEmpty(selectedFilters) ||
        (!_.isEmpty(selectedFilters) &&
          (_.isEmpty(selectedFilters.folderType) ||
            selectedFilters.folderType?.length === 0 ||
            selectedFilters.folderType?.indexOf(item.folderType) > -1) &&
          (_.isEmpty(selectedFilters.phase) ||
            selectedFilters.phase?.length === 0 ||
            selectedFilters.phase?.indexOf(item.phaseValue) > -1));
      return searchVal && filterVal;
    });
  };
  const onFilterChange = (filterValues: any) => {
    setSelectedFilters(filterValues);
  };
  const onGridSearch = (searchTxt: string) => {
    setGridSearchText(searchTxt);
  };

  return (
    <div className="sbs-referenceFile">
      <div className="header-text">Reference Files</div>
      <div className="toolbar">
        <div className="left-Section">
          <UploadFileMethod
            folderType={"files"}
            onProjectFile={(folderType: any) => {
              projectFileUpload(folderType);
            }}
            localFileClick={(value: any) => {
              localFileUpload(value);
            }}
          />
          <div className="icon-section">
            {/* {showDownloadButton && <IQTooltip title="Download" placement="bottom">
							<IconButton
								className="ref-download-btn"
								disabled={disableDownloadBtn}
								onClick={() => { onSelectedFilesDownload(); }}
							><span className="common-icon-download"></span>
							</IconButton>
						</IQTooltip>
						} */}
            {/* <IQTooltip title="sketch" placement="bottom">
							<IconButton
								className="ref-sketch-btn"
								disabled={false}
								onClick={() => { console.log('sketchclick'); }}
							><span className="common-icon-sketch"></span>
							</IconButton>
						</IQTooltip> */}
            <IQTooltip title="Delete" placement="bottom">
              <IconButton
                className="ref-delete-btn"
                disabled={disableDeleteBtn}
                onClick={() => {
                  onSelectedFilesDelete();
                }}
              >
                <span className="common-icon-delete"></span>
              </IconButton>
            </IQTooltip>
          </div>
        </div>
        <div className="right-section">
          <IQSearch
            placeholder={"Search"}
            filters={filters}
            filterHeader=""
            showGroups={false}
            onFilterChange= {onFilterChange}
            onSearchChange= {onGridSearch}
          />
          {/* <IQTooltip title="Gallery" placement="bottom">
						<IconButton
							className="gallery-btn"
							disabled={false}
							onClick={() => { console.log('Gallery btn click') }}
						>
							<span className="common-icon-image_write_24dp"></span>
						</IconButton>
					</IQTooltip> */}
        </div>
      </div>
      <div className="grid">
        <SUIGrid
          headers={headers}
          data={gridData}
          rowSelected={(e: any) => rowSelected(e)}
          getRowId={(record: any) => record?.data?.fileId ?? record?.data?.objectId}
        />
      </div>
    </div>
  );
};
export default ReferenceFiles;
