import React, { useEffect, useState } from "react";
import { Box, InputLabel, TextField, Button } from "@mui/material";
import "./SSAddForm.scss";
import CloseIcon from "@mui/icons-material/Close";
import SmartDropDown from "components/smartDropdown";
import { makeStyles, createStyles } from "@mui/styles";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getSketchIns, getSketchMarkup, setSketchMarkup } from "app/common/appInfoSlice";
import { AddSmartSubmitalBrena } from "features/field/smartsubmittals/stores/SmarSubmitalAPI";
import { getTextByBoundary } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import { getSectionsCardsDataList } from "features/field/smartsubmittals/smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarSlice";
import { updateStatusToCommit } from "features/field/smartsubmittals/smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarApi";
import { getSubmitalById, setRightPanelUpdated } from "features/field/smartsubmittals/stores/SmartSubmitalSlice";

const useStyles: any = makeStyles((theme: any) =>
  createStyles({
    menuPaper: {
      // maxWidth: "160px !important",
      // minWidth: "fit-content !important",
    },
  })
);
const SSMittalLeftForm = (props: any) => {
  const {
    onClose,
    userData,
    drawIcon,
    editCardData,
    editMode = false,
    customClass=false,
    ...others
  } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = React.useState<any>();
  const [docViewerins, setDocViewerins] = useState<any>({});
  const sketchInstance = useAppSelector(getSketchIns);
  const { selectedRecord, ssRightPanelData, selectedRecordsData} = useAppSelector(
    (state: any) => state.smartSubmittals
  );
  const { submitalTypeValues } = useAppSelector(
    (state: any) => state.smartSubmitalsLeftToolbar
  );
  const markupData: any = useAppSelector(getSketchMarkup);
  const [submitalTypeDropdownValues, setSubmitalTypeDropdownValues] = useState(
    []
  );
  const CardsApi = () => {
    const sectionIds = selectedRecordsData.map((rec: any) => rec?.data?.id);
    const sectionIdsStr = sectionIds.join("|");
    let payload = {
      id: sectionIdsStr,
      specBookId: selectedRecord?.specBook?.id,
    };
    dispatch(getSectionsCardsDataList(payload));
  };
  const GetValue = (array: any, value: any) => {
    const Obj = array.find((x: any) => x.id === value);
    return Obj?.value;
  };
  useEffect(() => {
    if (submitalTypeValues?.length) {
      let mapField = submitalTypeValues.map((item: any) => ({
        ...item,
        label: item.value,
      }));
      setSubmitalTypeDropdownValues(mapField);
    }
  }, [submitalTypeValues]);
  useEffect(() => {
    setDocViewerins(sketchInstance);
  }, [sketchInstance]);

  useEffect(() => {
    if (markupData != null) {
      extractText(markupData);
    }
  }, [markupData]);
  useEffect(() => {
    if (editMode) {
      let data = {
        sbsValue: GetValue(SBSData, editCardData?.sbsId),
        phase: GetValue(PhaseData, editCardData?.sbsPhaseId),
        title: editCardData?.title,
        type: editCardData?.type,
        summary: editCardData.summary,
      };
      setFormData(data);
    }
  }, [editMode]);
  const extractText = (mData: any) => {
    let makupType = mData?.markupValue?.type;
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

  const handleChange = (value: any, name: any) => {
    const formDataClone = { ...formData, [name]: value };
    setFormData(formDataClone);
  };
  const handleClose = () => {
    CardsApi();
    onClose();
  };

  const addMarkup = () => {
    console.log("sketchInstance", docViewerins);
    docViewerins.markNewExtractionArea({
      data: {
        type: "title",
      },
      stroke: "#efb239",
      showValidation: true,
    });
  };
  const addSummaryMarkup = () => {
    console.log("sketchInstance", docViewerins);
    docViewerins.markNewExtractionArea({
      data: {
        type: "summary",
      },
      stroke: "#efb239",
      showValidation: true,
    });
  };
  const GetId = (array: any, value: any) => {
    const id = array.findIndex((x: any) => x.value === value);
    return id;
  };
  const getDifference = (a: any, b: any) =>
    Object.fromEntries(
      Object.entries(b).filter(([key, val]) => key in a && a?.[key] !== val)
    );
  const handleSave = () => {
    let payloadObj = {
      specificationId: selectedRecord?.id ? selectedRecord?.id : "",
      title: formData.title,
      summary: formData.summary,
      // sessionId:"",
      sectionNumber: "",
      uniqueId: null,
      type: formData.type,
      typeId: GetId(submitalTypeDropdownValues, formData.type),
      status: "Draft",
      // sbsId: GetId(SBSData, formData?.sbsValue),
      // sbsPhaseId: GetId(PhaseData, formData?.phase),
      extractionType: "Manual",
      upperYIndex: drawIcon ? markupData?.coordinates?.y1 ?? 0 : 0,
      lowerYIndex: drawIcon ? markupData?.coordinates?.y2 ?? 0 : 0,
      leftXIndex: drawIcon ? markupData?.coordinates?.x1 ?? 0 : 0,
      rightXIndex: drawIcon ? markupData?.coordinates?.x2 ?? 0 : 0,
    };

    console.log("PayloadObj", payloadObj, drawIcon, markupData);
    console.log("selectedRecord", selectedRecord);
    if (editMode) {
      let editPayload = {
        specificationId: editCardData?.specificationId,
        // sessionId : editCardData?.specificationId,
        sectionNumber: editCardData?.sectionNo,
        status: "Draft",
        title: formData.title,
        summary: formData.summary,
        type: formData.type,
        typeId: GetId(submitalTypeDropdownValues, formData.type),
        // sbsId: GetId(SBSData, formData?.sbsValue),
        // sbsPhaseId: GetId(PhaseData, formData?.phase),
        upperYIndex:
          markupData ?? true
            ? editCardData?.upperYIndex
            : markupData?.coordinates?.y1 ?? 0,
        lowerYIndex:
          markupData ?? true
            ? editCardData?.lowerYIndex
            : markupData?.coordinates?.y2 ?? 0,
        leftXIndex:
          markupData ?? true
            ? editCardData?.leftXIndex
            : markupData?.coordinates?.x1 ?? 0,
        rightXIndex:
          markupData ?? true
            ? editCardData?.rightXIndex
            : markupData?.coordinates?.x2 ?? 0,
      };
      let difference = getDifference(editCardData, editPayload);
      difference.uniqueId = editCardData.uniqueid;
      let payload = [difference];
      updateStatusToCommit(payload)
        .then((res: any) => {
          if(customClass) {
            let payload = {
              specBookId : ssRightPanelData?.specBook?.id,
              submittalId : ssRightPanelData?.uniqueid
          };
            dispatch(getSubmitalById(payload));
            dispatch(setRightPanelUpdated(true));
          } else {
            let payload = {
              id: selectedRecord?.id,
              specBookId: selectedRecord?.specBook?.id,
            };
            dispatch(getSectionsCardsDataList(payload));
          };
          dispatch(setSketchMarkup(null));
          handleClose();
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    } else {
      AddSmartSubmitalBrena(payloadObj)
        .then((res: any) => {
          // let payload = {
          //   id: selectedRecord?.id,
          //   specBookId: selectedRecord?.specBook?.id
          // };
          // dispatch(getSectionsCardsDataList(payload));
          dispatch(setSketchMarkup(null));
          handleClose();
        })
        .catch((err: any) => {
          console.log("error", err);
        });
    }
  };
  const SBSData = [
    { id: 0, label: "Building Renovation", value: "Building Renovation" },
    {
      id: 1,
      label: "North Wing Construction",
      value: "North Wing Construction",
    },
    {
      id: 2,
      label: "Electrical & Mechanical Works",
      value: "Electrical & Mechanical Works",
    },
    {
      id: 3,
      label: "Project Design & Planning",
      value: "Project Design & Planning",
    },
  ];
  const PhaseData = [
    { id: 0, label: "Pre Construction", value: "Pre Construction" },
    { id: 1, label: "In Construction", value: "In Construction" },
    { id: 2, label: "Phase 1", value: "Phase 1" },
  ];
  console.log("Card Data", drawIcon, markupData, markupData?.coordinates);
  return (
    <Box
      className={
        customClass ? "smart-submittals-custom-container" :
        editMode ? "smart-submittals-container" : "smart-submittals-toolbar-tab"
      }
    >
      <div
        className={
          editMode
            ? "popover-smart-submittals-edit"
            : "popover-smart-submittals"
        }
      >
        <span
          style={{
            color: "red",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "-5px",
          }}
        >
          <CloseIcon className="popover-close" onClick={handleClose} />
        </span>

        <div className="add-smart-submittals">
          <div className="fields-spec" style={{ marginTop: "-11px" }}>
            {/* <IQTooltip
              title={formData?.type ? formData?.type : ""}
              placement={"bottom-start"}
            > */}
            <SmartDropDown
              dropDownLabel="Submittal Type"
              LeftIcon={
                <div
                  className="common-icon-Budgetcalculator"
                  style={{ fontSize: "1.25rem" }}
                ></div>
              }
              outSideOfGrid={true}
              isSearchField={false}
              menuProps={classes.menuPaper}
              sx={{ fontSize: "18px" }}
              isFullWidth
              Placeholder={"Select"}
              isMultiple={false}
              options={submitalTypeDropdownValues}
              selectedValue={formData?.type ?? ""}
              defaultValue={formData?.type ?? ""}
              handleChange={(value: any) => handleChange(value[0], "type")}
            />
            {/* </IQTooltip> */}
          </div>
          <InputLabel className="inputlabel">Submittal Title</InputLabel>
          <div className="reason-textfield-cls">
            <div
              className="common-icon-Budgetcalculator"
              style={{ fontSize: "1.25rem" }}
            ></div>
            <TextField
              name="title"
              value={formData?.title}
              onChange={(e: any) => handleChange(e.target.value, "title")}
              style={{ width: "100%" }}
              placeholder="Sumittal Title"
              id="outlined-multiline-static"
              multiline
              rows={2}
              // maxRows={3}
            />
            {drawIcon ? (
              <div onClick={addMarkup} className="text-extractor-icon">
                <span className="common-icon-extraction-area userdetails_icons" />
              </div>
            ) : (
              ""
            )}
          </div>
          <InputLabel className="inputlabel">Submittal Summary</InputLabel>
          <div className="reason-textfield-cls">
            <div
              className="common-icon-Budgetcalculator"
              style={{ fontSize: "1.25rem" }}
            ></div>
            <TextField
              name="summary"
              value={formData?.summary}
              onChange={(e: any) => handleChange(e.target.value, "summary")}
              style={{ width: "100%" }}
              placeholder="Sumittal Summary"
              id="outlined-multiline-static"
              multiline
              rows={2}
              // maxRows={3}
            />
            {/* {drawIcon ? (
              <div onClick={addSummaryMarkup} className="text-extractor-icon">
                <span className="common-icon-extraction-area userdetails_icons" />
              </div>
            ) : (
              ""
            )} */}
          </div>
          {/*<div className="fields-spec">
            <SmartDropDown
              dropDownLabel="Select System Breakdown Structure(SBS)"
              LeftIcon={
                <span
                  className="common-icon-system-breakdown"
                  // style={{ color: "#ed7532", fontSize: "1em" }}
                >
                  {" "}
                </span>
              }
              outSideOfGrid={true}
              isSearchField={true}
              menuProps={classes.menuPaper}
              sx={{ fontSize: "18px" }}
              isFullWidth
              Placeholder={"Select"}
              isMultiple={false}
              options={SBSData}
              selectedValue={formData?.sbsValue ?? ""}
              defaultValue={formData?.sbsValue ?? ""}
              handleChange={(value: any) => handleChange(value[0], "sbsValue")}
            />
          </div>
           <div className="fields-spec">
            <SmartDropDown
              dropDownLabel="Select Phase"
              LeftIcon={
                <span
                  className="common-icon-phase"
                  // style={{ color: "#ed7532", fontSize: "1em" }}
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
              options={PhaseData}
              selectedValue={formData?.phase ?? ""}
              defaultValue={formData?.phase ?? ""}
              handleChange={(value: any) => handleChange(value[0], "phase")}
            />
          </div> */}
        </div>
        <br />
        <div></div>
        <br></br>
        <div className="add-button-cls">
          <Button onClick={() => handleSave()}>Save</Button>
        </div>
      </div>
    </Box>
  );
};

export default SSMittalLeftForm;
