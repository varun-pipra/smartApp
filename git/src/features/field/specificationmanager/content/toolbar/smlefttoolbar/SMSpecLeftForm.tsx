import React, { useEffect, useState } from "react";
import { Box, InputLabel, TextField, Button } from "@mui/material";
import "./SMSpecLeftForm.scss";
import CloseIcon from "@mui/icons-material/Close";
import SmartDropDown from "components/smartDropdown";
import { makeStyles, createStyles } from "@mui/styles";
import {
  getSketchIns,
  getServer,
  getSketchMarkup,
  getCostCodeDivisionList,
  setSketchMarkup,
} from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { isLocalhost } from "app/utils";
import { appInfoData } from "data/appInfo";
import {
  addSpecSectionData,
  getTextByBoundary,
} from "../../../stores/SpecificationManagerAPI";
import { getUploadQueue } from "features/field/specificationmanager/stores/FilesSlice";
import { getBrenaList } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import CostCodeDropdown from "components/costcodedropdown/CostCodeDropdown";

const useStyles: any = makeStyles((theme: any) =>
  createStyles({
    menuPaper: {},
  })
);
const defaultFormData = {
  title: "",
  number: "",
  pageNumbers: "",
  sbs: {},
  phase: {},
  division: {},
  bidPackage: {},
};
const SMSpecLeftForm = (props: any) => {
  const { onClose, userData, drawIcon = false, ...others } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = React.useState<any>(defaultFormData);
  const [docViewerins, setDocViewerins] = useState<any>({});
  const sketchInstance = useAppSelector(getSketchIns);
  const server = useAppSelector(getServer);
  const [sbsData, setSbsData] = useState<any>([]);
  const [phaseData, setPhaseData] = useState<any>([]);
  const [localData, setLocalData] = useState<any>(appInfoData);
  const [disableAddBtn, setDisableAddBtn] = useState<any>(true);
  const [isPageNumFieldValid, setIsPageNumFieldValid] = useState<any>(true);
  const pageNumRegexPattern = /^[0-9]*([-][0-9]+)?$/;
  const fileQueue: any = useAppSelector(getUploadQueue);
  const markupData: any = useAppSelector(getSketchMarkup);
  const [titleMarkup, setTitleMarkup] = useState<any>({});
  const [bidPackageList, setBidPackageList] = useState([]);
  const { divisionList } = useAppSelector(
    (state) => state.specificationManager
  );
  const { gridData } = useAppSelector((state) => state.bidManagerGrid);
  const { selectedRecsData } = useAppSelector(
    (state) => state.specificationManager
  );

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
          });
        }
        let unique: any = [];
        list?.map((x: any) =>
          unique?.filter((a: any) => a?.label === x?.label)?.length > 0
            ? null
            : unique.push(x)
        );
        unique.sort((a: any, b: any) =>
          a?.label.localeCompare(b?.label, undefined, { numeric: true })
        );
        setBidPackageList(unique);
      }
    }
  }, [gridData]);
  useEffect(() => {
    const localSBS: any = [
      { label: "General SBS part 1", value: 21 },
      { label: "General SBS part 2", value: 22 },
    ];
    setSbsData(localSBS);

    const localPhases: any = [
      { label: "Phase 1", value: 1 },
      { label: "Phase 2", value: 2 },
    ];
    setPhaseData(localPhases);

    // } else {
    //   //TODO
    //   console.log('server', server);
    // }
  }, []);

  useEffect(() => {
    if (
      formData.title &&
      formData.number &&
      formData.pageNumbers &&
      formData.division
    ) {
      setDisableAddBtn(false);
    } else {
      setDisableAddBtn(true);
    }
  }, [formData]);

  useEffect(() => {
    if (markupData != null) {
      extractText(markupData);
    }
  }, [markupData]);

  const extractText = (mData: any) => {
    let makupType = mData?.markupValue?.type;
    if (makupType === "title") {
      setTitleMarkup(mData);
    }
    let payload = {
      url: mData?.currentPage?.imageUrl,
      x1: mData?.coordinates?.x1,
      x2: mData?.coordinates?.x2,
      y1: mData?.coordinates?.y1,
      y2: mData?.coordinates?.y2,
    };
    getTextByBoundary(payload)
      .then((res: any) => {
        setFormData({ ...formData, [makupType]: res });
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };

  const formatPageNumbers = (str: any) => {
    if (str.includes("-")) {
      const splitArr = str.split("-");
      return { startPage: Number(splitArr[0]), endPage: Number(splitArr[1]) };
    } else {
      return {
        startPage: Number(str),
        endPage: Number(str),
      };
    }
  };
  const getDivisionNumber = (data: any, value: any) => {
    let idx: any;
    data.options.findIndex((option: any, indx: any) => {
      if (option.value === value?.[1]) {
        idx = indx;
      }
    });
    return data.options[idx].id;
  };
  /**
   * Triggers on add button click. Preparing the payload object and hitting the api.
   * @author Srinivas Nadendla
   */
  const onAddSpecSec = () => {
    if (disableAddBtn) return;
    if (!pageNumRegexPattern.test(formData.pageNumbers)) {
      setIsPageNumFieldValid(false);
      return;
    } else {
      setIsPageNumFieldValid(true);
    }
    const formattedPageNumbers: any = formatPageNumbers(formData.pageNumbers);
    let formatDivision = formData.division.split("|");
    let divisionValue = formatDivision?.[1];
    let divisionNumber;
    divisionList.findIndex((ele: any) => {
      if (ele.name == formatDivision?.[0]) {
        divisionNumber = getDivisionNumber(ele, formatDivision);
      }
    });
    const payloadObj: any = {
      title: formData?.title,
      division: {
        text: divisionValue,
        number: divisionNumber + "", // convert to number
      },

      number: formData?.number,
      startPage: formattedPageNumbers?.startPage,
      endPage: formattedPageNumbers?.endPage,

      sbsName: formData?.sbs?.label,
      sbsId: formData?.sbs?.value,
      sbsPhase: formData?.phase?.label,
      sbsPhaseId: formData?.phase?.value,
      bidPackageId: formData?.bidPackage?.id ?? "",
      bidPackageName: formData?.bidPackage?.label ?? "",

      status: "Draft",
      extractionType: "Manual",
      specBook: {
        id: drawIcon ? fileQueue?.[0]?.id : "",
      },
      upperYIndex: drawIcon ? titleMarkup?.coordinates?.y1 : null,
      lowerYIndex: drawIcon ? titleMarkup?.coordinates?.y2 : null,
      leftXIndex: drawIcon ? titleMarkup?.coordinates?.x1 : null,
      rightXIndex: drawIcon ? titleMarkup?.coordinates?.x2 : null,
    };

    if (drawIcon) {
      payloadObj.specBook = {
        id: fileQueue?.[0]?.id,
      };
    } else {
      if (selectedRecsData.length) {
        payloadObj.specBook = {
          id: selectedRecsData[0]?.data?.id,
        };
      } else {
        payloadObj.specBook = null;
      }
    }

    addSpecSectionData(payloadObj)
      .then((res: any) => {
        //TODO: Once api is success refresh the grid
        console.log("add sec res", res);
        handleClose();
        dispatch(getBrenaList(fileQueue?.[0]));
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };

  useEffect(() => {
    setDocViewerins(sketchInstance);
  }, [sketchInstance]);

  const handleChange = (value: any, name: any) => {
    const formDataClone = { ...formData, [name]: value };
    setFormData(formDataClone);
  };

  const handleClose = () => {
    dispatch(setSketchMarkup(null));
    onClose();
  };

  const addMarkup = (markupName: any) => {
    docViewerins.markNewExtractionArea({
      data: {
        type: markupName,
      },
      stroke: "#efb239",
      showValidation: true,
    });
  };

  return (
    <Box className="smleft-toolbar-spec-container smleft-toolbar-spec-tab">
      <div className="popover-spec">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <InputLabel
            className="inputlabel header"
            style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
          >
            Add New Spec Section
          </InputLabel>
          <div>
            <CloseIcon
              style={{
                verticalAlign: "top",
                cursor: "pointer",
                fontSize: "20px",
                color: "#333",
                marginRight: "0px",
              }}
              onClick={handleClose}
            />
          </div>
        </div>
        <div className="add-spec">
          <div className="fields-spec">
            <InputLabel
              required
              className="inputlabel"
              sx={{
                "& .MuiFormLabel-asterisk": {
                  color: "red",
                },
              }}
            >
              Spec Section Title
            </InputLabel>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                id="title"
                fullWidth
                InputProps={{
                  startAdornment: <span className="common-icon-title"> </span>,
                }}
                placeholder={"Enter"}
                name="title"
                variant="standard"
                inputProps={{
                  style: {
                    color: "black",
                    marginLeft: "10px",
                  },
                }}
                onChange={(e: any) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                value={formData?.title}
              />
              {drawIcon ? (
                <div
                  onClick={() => {
                    addMarkup("title");
                  }}
                  className="text-extractor-icon"
                >
                  <span className="common-icon-extraction-area userdetails_icons" />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="fields-spec">
            <InputLabel
              required
              className="inputlabel"
              sx={{
                "& .MuiFormLabel-asterisk": {
                  color: "red",
                },
              }}
            >
              Spec Number
            </InputLabel>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                id="specNumber"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <span className="common-icon-spec-number"> </span>
                  ),
                }}
                sx={{ fontSize: "18px" }}
                placeholder={"Enter"}
                inputProps={{
                  style: {
                    color: "black",
                    marginLeft: "10px",
                  },
                }}
                name="number"
                variant="standard"
                value={formData?.number}
                onChange={(e: any) =>
                  setFormData({ ...formData, number: e.target.value })
                }
              />
              {drawIcon ? (
                <div
                  onClick={() => {
                    addMarkup("number");
                  }}
                  className="text-extractor-icon"
                >
                  <span className="common-icon-extraction-area userdetails_icons" />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="fields-spec" style={{ marginTop: "10px" }}>
            <CostCodeDropdown
              outSideOfGrid={true}
              label="Division"
              options={divisionList ?? []}
              required={true}
              selectedValue={formData?.division?.value ?? ""}
              startIcon={
                <span
                  className="common-icon-division"
                  style={{ color: "#ed7532", fontSize: "1em" }}
                ></span>
              }
              checkedColor={"#0590cd"}
              onChange={(value) => handleChange(value, "division")}
              showFilter={true}
              sx={{
                ".MuiSelect-icon": {
                  display: "none",
                },
              }}
              displayEmpty={true}
              Placeholder={"Select"}
            />
          </div>
          <div className="fields-spec">
            <SmartDropDown
              dropDownLabel="Bid Package"
              LeftIcon={
                <span
                  className="common-icon-bid-lookup"
                  style={{ color: "#ed7532", fontSize: "1em" }}
                >
                  {" "}
                </span>
              }
              outSideOfGrid={true}
              isSearchField={false}
              menuProps={classes.menuPaper}
              sx={{ fontSize: "18px" }}
              isFullWidth
              Placeholder={"Select"}
              isMultiple={false}
              selectedValue={formData?.bidPackage?.value}
              options={bidPackageList || []}
              handleChange={(value: any) => {
                const selRec: any = bidPackageList.find(
                  (rec: any) => rec.value === value.toString()
                );
                handleChange(selRec, "bidPackage");
              }}
            />
          </div>
        </div>
        <br />
        <div>
          <div className="common-icon-title-pages" style={{}}>
            <InputLabel required error={!isPageNumFieldValid}>
              Pages (e.g 1-5)
            </InputLabel>
            <TextField
              InputProps={{
                startAdornment: <span className="common-icon-pages"> </span>,
              }}
              inputProps={{
                style: {
                  color: "black",
                  marginLeft: "10px",
                },
              }}
              variant="standard"
              placeholder="Enter"
              value={formData?.pageNumbers}
              error={!isPageNumFieldValid}
              onChange={(e: any) =>
                setFormData({ ...formData, pageNumbers: e.target.value })
              }
            />
          </div>
          {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ marginTop: "8px", paddingTop: "10px" }}>
              <InputLabel className="inputlabel">
                System Breakdown Structure(SBS)
              </InputLabel>
              <div>
                <SmartDropDown
                  LeftIcon={
                    <span
                      className="common-icon-system-breakdown"
                      style={{ color: "#ed7532", fontSize: "1em" }}
                    ></span>
                  }
                  outSideOfGrid={true}
                  isSearchField={false}
                  isFullWidth
                  Placeholder={"Select"}
                  isMultiple={false}
                  options={sbsData}
                  selectedValue={formData?.sbs?.value}
                  handleChange={(value: any) => {
                    const selRec: any = sbsData.find(
                      (rec: any) => rec.value === value
                    );
                    handleChange(selRec, "sbs");
                  }}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: "8px",
                paddingTop: "10px",
                marginRight: "20px",
                width: "42%",
              }}
            >
              <InputLabel className="inputlabel">Phase</InputLabel>
              <div>
                <>
                  <SmartDropDown
                    LeftIcon={
                      <span
                        className="common-icon-phase"
                        style={{ color: "#ed7532", fontSize: "1.4em" }}
                      >
                        {" "}
                      </span>
                    }
                    outSideOfGrid={true}
                    isSearchField={false}
                    isFullWidth
                    options={phaseData}
                    Placeholder={"Select"}
                    // selectedValue={selectedPhase}
                    // handleChange={handlePhaseChange}
                    isMultiple={false}
                    selectedValue={formData?.phase?.value}
                    handleChange={(value: any) => {
                      const selRec: any = phaseData.find(
                        (rec: any) => rec.value === value
                      );
                      handleChange(selRec, "phase");
                    }}
                  />
                </>
              </div>
            </div>
          </div> */}
        </div>
        <br></br>
        <div className="add-button-cls">
          {disableAddBtn && <Button disabled>ADD</Button>}
          {!disableAddBtn && (
            <Button onClick={(e) => onAddSpecSec()}>ADD</Button>
          )}
        </div>
      </div>
    </Box>
  );
};

export default SMSpecLeftForm;
