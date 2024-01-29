import React from "react";
import { TextField, InputLabel } from "@mui/material";
import InputIcon from "react-multi-date-picker/components/input_icon";
import IQButton from "components/iqbutton/IQButton";
import DatePickerComponent from "components/datepicker/DatePicker";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getServer } from "app/common/appInfoSlice";
import SmartDropDown from "components/smartDropdown";
import {
  getSBSGridList,
  setAddPhaseText,
  setShowPhaseModel,
  setToast,
  setToastMessage,
} from "features/safety/sbsmanager/operations/sbsManagerSlice";
import { AddDescription } from "features/budgetmanager/headerPinning/AddDescription";
import "./SBSManagerForm.scss";
import { getTradeData } from "features/projectsettings/projectteam/operations/ptDataSlice";
import { makeStyles, createStyles } from "@mui/styles";
import { AddSbsManagerForm } from "../../operations/sbsManagerAPI";
import RTHelper from "utilities/realtime/RTHelper";
import { setLineItemDescription } from "features/budgetmanager/operations/tableColumnsSlice";

const useStyles: any = makeStyles((theme: any) =>
  createStyles({
    menuPaper: {
      maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
      maxWidth: "160px !important",
    },
  })
);
const defaultFormData = {
  name: "",
  description: "",
  category: { id: "", name: "", value: "" },
  phase: { id: "", name: "" },
  trades: [],
  startDate: "",
  endDate: "",
};
const SBSManagerForm = (props: any) => {
  const rtHelperIns = new RTHelper();
  const classes = useStyles();
  // Redux State Variable
  const dispatch = useAppDispatch();
  const appInfo = useAppSelector(getServer);

  const tradesData: any = useAppSelector(getTradeData);
  const { phaseDropDownOptions, categoryDropDownOptions } = useAppSelector(
    (state) => state.sbsManager
  );
  const { lineItemDescription } = useAppSelector((state) => state.tableColumns);
  // Local state vaiables
  const [formData, setFormData] = React.useState<any>(defaultFormData);
  const [disableAddButton, setDisableAddButton] = React.useState<boolean>(true);
  const [uuidForSbs, setUUIDForSbs] = React.useState(rtHelperIns.getUuid());
  const [dynamicClose, setDynamicClose] = React.useState(false);
  const [showAddIcon, setShowAddIcon] = React.useState(false);
  // Effects
  React.useEffect(() => {
    console.log(formData?.category.name)
    setDisableAddButton(
      formData?.name !== "" &&
        formData?.category.id > 0 &&
        formData?.phase.id > 0 &&
        formData?.trades?.length > 0
        ? false
        : true
    );
    if (formData.startDate != "") {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        dispatch(
          setToastMessage({
            displayToast: true,
            message: "Start Date should not be greater than End Date",
          })
        );
      }
    };
    if (formData.endDate != "") {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        dispatch(
          setToastMessage({
            displayToast: true,
            message: "End Date Should Not be less Than start Date",
          })
        );
      };
    };
  }, [formData]);
  React.useEffect(() => {
    if (lineItemDescription) {
      handleOnChange(lineItemDescription, "description");
    }
  }, [lineItemDescription]);

  const GetDropDownId = (array: any, value: any, key: any) => {
    const obj = array.find((x: any) => x.label === value);
    return obj[key];
  };

  const getTradesOptions = () => {
    let groupedList: any = [];
    let a = [
      {
          "objectId": 70,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "f3e2eb71-9d3c-464a-b088-adf99f00ea22",
          "name": "aDD ",
          "description": "",
          "color": "#3e2dbb",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 1,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "d02338c7-456b-4abf-adee-7ce609460bcd",
          "name": "Architectural",
          "description": "Architectural",
          "color": "#2E7D32",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 2,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "b931157f-208f-4afd-8876-b227b6dde462",
          "name": "Audio / Video",
          "description": "Audio / Video",
          "color": "#880E4F",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 3,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "c18a9f54-abb7-4b06-9535-4d0d71ab5552",
          "name": "Carpentry",
          "description": "Carpentry",
          "color": "#51927E",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 71,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "f04c23e6-ec29-486c-828f-ba02655f69cd",
          "name": "ccc- long test name checking in advance quick view drawing discipline filter dropdown",
          "description": "",
          "color": "#2b5b81",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 4,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "8ea457b3-b3d9-4ec1-9095-f5d0473094a7",
          "name": "Ceiling",
          "description": "Ceiling",
          "color": "#745125",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 5,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "47faf423-7f42-48e6-bd57-9ab8b9651dbc",
          "name": "Ceramic Tile",
          "description": "Ceramic Tile",
          "color": "#507E65",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 6,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "774f59dc-f28e-4048-bc85-31ccb2ae2be6",
          "name": "Civil",
          "description": "Civil",
          "color": "#C7F4E9",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 7,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "8c077a6f-fb85-41d3-a12c-0d9a8aaa908d",
          "name": "Cleaning",
          "description": "Cleaning",
          "color": "#F40C53",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 8,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "4537fb2c-77f6-4c18-a202-2150f09502d2",
          "name": "Concrete",
          "description": "Concrete",
          "color": "#7DBEB5B8",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 9,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "a33b32e5-1df1-4422-a05e-05a277e37973",
          "name": "Concrete Restoration",
          "description": "Concrete Restoration",
          "color": "#25A375",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 10,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "216eeaf7-e5b0-4d23-bb7a-67bdfd9f1f53",
          "name": "Concrete Surfacing",
          "description": "Concrete Surfacing",
          "color": "#C0AE14",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 11,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "bf054938-6ffc-4e40-82b8-fc0cbf4c7205",
          "name": "Construction Management",
          "description": "Construction Management",
          "color": "#407B16",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 12,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "60ad425f-9a7f-463f-8469-00aaa63c056a",
          "name": "Controls",
          "description": "Controls",
          "color": "#D4731E",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 13,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "56498b45-6486-40d5-a464-00ac077dabfd",
          "name": "Curtain Walls",
          "description": "Curtain Walls",
          "color": "#B2B7EA",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 14,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "d5a70569-6e1c-48e3-aec1-609b7752beb8",
          "name": "Demolition",
          "description": "Demolition",
          "color": "#1E2572",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 76,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "0ef34f1e-ccc8-40bf-a206-b034369d9c63",
          "name": "Disciplinary trade",
          "description": "aass",
          "color": "#c36492",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 15,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "2f618650-8b6e-4cea-b995-9a9c4ea46087",
          "name": "Doors, Frames & Hardware",
          "description": "Doors, Frames & Hardware",
          "color": "#D97DA5",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 16,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "b6983a59-374f-42b8-8eae-21cc631567dd",
          "name": "Drywall",
          "description": "Drywall",
          "color": "#7C82C5",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 17,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "02bfe389-cea3-42e9-96e9-c842aa17e1f3",
          "name": "Earthwork / Site Utility",
          "description": "Earthwork / Site Utility",
          "color": "#852626",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 18,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "48159365-f672-4ec7-bb6d-a672e963f399",
          "name": "Electrical",
          "description": "Electrical",
          "color": "#2472B1",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 19,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "001c117b-95f2-4e22-a844-5f784d6ce48c",
          "name": "Elevators",
          "description": "Elevators",
          "color": "#0F1872",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 20,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "cca73995-8bdd-4a1c-8bf5-d641034f1191",
          "name": "Enclosures",
          "description": "Enclosures",
          "color": "#721212",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 21,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "b96485e3-6736-4f22-ab19-c3d303866711",
          "name": "Equipment Operator",
          "description": "Equipment Operator",
          "color": "#394269",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 22,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "c6898b48-d493-4c41-8c3d-ad3b4cd10b56",
          "name": "Excavation",
          "description": "Excavation",
          "color": "#257420",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 23,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "1a949cbc-b544-4df5-8a51-c3a184658332",
          "name": "Fire Protection",
          "description": "Fire Protection",
          "color": "#E65100",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 24,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "56479658-0aa3-44df-b985-ce49f12b6331",
          "name": "Flooring",
          "description": "Flooring",
          "color": "#8DB5E2",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 25,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "a0b9df36-5afd-4bad-86de-3f6bcaa87d0d",
          "name": "Framing",
          "description": "Framing",
          "color": "#E7D3D3",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 26,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "c1f6c231-6ff2-4185-93be-194d89811013",
          "name": "General Contracting",
          "description": "General Contracting",
          "color": "#972753",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 27,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "e0949ca7-e2ed-4b03-bf91-f1a346cfe00d",
          "name": "General Trades",
          "description": "General Trades",
          "color": "#EADF79B3",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 28,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "a26e1c7c-5fa1-4ee8-9185-4b429bd7964d",
          "name": "Glass & Glazing",
          "description": "Glass & Glazing",
          "color": "#0B96EA78",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 29,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "e1c59674-e2ed-46a9-b98c-0dcf837fd430",
          "name": "HVAC",
          "description": "HVAC",
          "color": "#36E5CF",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 30,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "b2684fd1-c510-4618-8849-17c0e1e6aeb2",
          "name": "HVAC Piping",
          "description": "HVAC Piping",
          "color": "#792F06",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 31,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "75ced6d6-2008-4b31-b237-11a18bb45042",
          "name": "HVAC Sheet Metal",
          "description": "HVAC Sheet Metal",
          "color": "#ACB1E5",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 32,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "033fa145-3ee4-4d94-b412-94cb77305df5",
          "name": "Information Technology (IT)",
          "description": "Information Technology (IT)",
          "color": "#687685",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 33,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "78867d76-4198-4eb8-9133-56a28794f58f",
          "name": "Interior Architect",
          "description": "Interior Architect",
          "color": "#D1D4D0",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 66,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "971f2df4-0cdf-41ba-a1c0-863526c5da47",
          "name": "iOS Trade - 1",
          "description": "",
          "color": "#4c504c",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 67,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "a0c05bb1-3cb7-4180-b697-32baedf35fd1",
          "name": "iOS Trade - 2",
          "description": "",
          "color": "#C2C4E0",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 34,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "a5c6052d-bc3c-4f53-a97e-2a06f74b76c5",
          "name": "Iron Works",
          "description": "Iron Works",
          "color": "#CBC768",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 35,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "6432a7dd-fabb-469e-8ad0-9cc4379d72b7",
          "name": "Kitchen Equipment",
          "description": "Kitchen Equipment",
          "color": "#B1B6F1",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 36,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "a9f28c51-bf37-4806-8f5b-d3276bf75f27",
          "name": "Landscape",
          "description": "Landscape",
          "color": "#12E035",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 37,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "4a578597-9bc3-4fe1-a37a-02ad7456bb54",
          "name": "Life Safety",
          "description": "Life Safety",
          "color": "#C7A165",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 38,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "2dbc8f3f-8426-44e4-a73f-9e83523779cf",
          "name": "Lighting",
          "description": "Lighting",
          "color": "#A2BB34",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 39,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "2fd37f7c-5157-4a73-8a51-4f7108a03da2",
          "name": "Low Voltage",
          "description": "Low Voltage",
          "color": "#EF9651",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 40,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "cf758361-f554-409c-bd27-feb7accfbf11",
          "name": "Masonary",
          "description": "Masonary",
          "color": "#F58231",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 41,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "98c7545d-7727-448d-ab36-9ef1bd09480b",
          "name": "Mechanical",
          "description": "Mechanical",
          "color": "#E6BEFF",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 42,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "d96f4a93-0b26-4cf2-96aa-57cf697173ae",
          "name": "MEP Engineering",
          "description": "MEP Engineering",
          "color": "#899973",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 43,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "194e0145-b67c-4a6f-9786-65fdb8c5aa1f",
          "name": "Metal Lockers",
          "description": "Metal Lockers",
          "color": "#7E5858",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 44,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "539b1fe6-a8dd-4a23-a9da-11b16aa029ca",
          "name": "Metal Works",
          "description": "Metal Works",
          "color": "",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 45,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "9ecd4dfd-56a1-480b-988a-765bee449b90",
          "name": "Millwork",
          "description": "Millwork",
          "color": "#154F1F",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 77,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "2f8812e9-45c6-4f13-a888-f782a23b41db",
          "name": "new trade",
          "description": "test",
          "color": "#24b054",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 78,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "7e805f3b-e664-42a6-9517-4ffcf6b72891",
          "name": "new trade 1",
          "description": "test",
          "color": "#3b719a",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 79,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "62a6e43e-cd10-400e-9008-f8d61e9e192d",
          "name": "new trade 2",
          "description": "test",
          "color": "#10bfc7",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 46,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "f4a2b56c-5635-40e8-ba8b-d4dab575578a",
          "name": "Painting",
          "description": "Painting",
          "color": "#AAFFC3",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 47,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "2a759006-b10a-48ba-abf8-7424887473b9",
          "name": "Permitting",
          "description": "Permitting",
          "color": "#8F3707",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 48,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "90a34fec-9bc2-42a0-ac6b-aa2f2c887db3",
          "name": "Pipefitter",
          "description": "Pipefitter",
          "color": "#FFFAC8",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 49,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "733fb52f-5bba-42e7-a02f-22030771f244",
          "name": "Plastering",
          "description": "Plastering",
          "color": "#4363D8",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 50,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "9f27df20-55db-4b1e-87c6-3a9d6097e8c1",
          "name": "Plumbing",
          "description": "Plumbing",
          "color": "#FFE119",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 51,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "3abe5950-d4bb-482f-b7e9-6f41c58bc210",
          "name": "Pre-Cast Panels",
          "description": "Pre-Cast Panels",
          "color": "#638292",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 72,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "3cab5ea7-e06d-4cd1-a691-8075f116cc09",
          "name": "Project Manager",
          "description": "To Add Work Labour",
          "color": "#4d03e6",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 52,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "779c2197-8866-4dcf-ae4e-98408f960684",
          "name": "Roofing",
          "description": "Roofing",
          "color": "#0B0B10",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 53,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "c42ace88-d171-4b47-a96e-18cede79e46e",
          "name": "Security",
          "description": "Security",
          "color": "#9467BB",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 54,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "911f27dd-bed6-499b-b0a6-66c722898f03",
          "name": "Sheet Metal",
          "description": "Sheet Metal",
          "color": "#9A6324",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 55,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "87b5645e-5ab4-4621-8267-f7400ac07454",
          "name": "Site Work",
          "description": "Site Work",
          "color": "#9B8D0B",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 56,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "46406272-d953-4649-8884-84aa67f91c50",
          "name": "Specialties",
          "description": "Specialties",
          "color": "#3949F6",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 57,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "664bf5fb-b308-41e6-99a7-ea358002d596",
          "name": "Spray Fireproofing",
          "description": "Spray Fireproofing",
          "color": "#8A0404",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 58,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "2fdb21d6-b7b4-47f6-aef7-87261ae828fd",
          "name": "Steel Erection",
          "description": "Steel Erection",
          "color": "#85F9E5",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 59,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "280d1869-0283-44ce-ad68-f6bf9d74e073",
          "name": "Steel Fabrication",
          "description": "Steel Fabrication",
          "color": "#DBD6D5",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 60,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "634ddf8a-d030-4a10-bf74-b2a3126a4ad5",
          "name": "Structural",
          "description": "Structural",
          "color": "#827717",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 61,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "af117bfe-275b-4901-a5da-b2f56e3de1d6",
          "name": "Supply Chain",
          "description": "Supply Chain",
          "color": "#D6BFEA",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 62,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "779c9990-db45-4072-badb-36d6f943a69f",
          "name": "Telecommunications",
          "description": "Telecommunications",
          "color": "#CB83E0",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 69,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "d67afbbb-badc-4900-96ea-6c55bf10d4b5",
          "name": "Test Trade",
          "description": "",
          "color": "#861093",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 74,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "5d7eeaab-eaac-4f69-bf86-aff4a924954c",
          "name": "Test Trade Delete",
          "description": "Test Trade Delete",
          "color": "#e5a9dc",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 75,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "1e01d948-24b8-49cf-b2b6-73dfbf77f298",
          "name": "Test Trade DR Discipline",
          "description": "Test Trade DR Discipline",
          "color": "#68a31d",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 63,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "ea7e4104-5cd4-4fe8-8c79-63065f7220b3",
          "name": "Toilet Compartments",
          "description": "Toilet Compartments",
          "color": "#B4A629",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 80,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "e436ff8c-d312-4034-9b0e-aa8f41460990",
          "name": "trade 001",
          "description": "test",
          "color": "#a4f569",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 81,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "97d4dfac-e59e-420f-98d4-2524e83c786a",
          "name": "trade 002",
          "description": "test",
          "color": "#427172",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 64,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "2d65eb9b-6ea9-4e85-9087-d64af4f7135c",
          "name": "Waterproofing",
          "description": "Waterproofing",
          "color": "#A9A9A9",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 65,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "e0727254-8a95-4fc1-a14d-4d5c496635e3",
          "name": "Welding",
          "description": "Welding",
          "color": "#808000",
          "isDrawingDiscipline": true,
          "isImportedFromOrg": false
      },
      {
          "objectId": 82,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "0ead4d4b-d42e-4c45-a624-8131dd51ee65",
          "name": "Without Company",
          "description": "Without Company",
          "color": "#b18d36",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      }
  ]
    a.map((data: any, index: any) => {
      groupedList.push({
        ...data,
        label: data.name,
        value: data.name,
        displayLabel: data.name,
      });
    });
    return groupedList;
  };

  // onchange methods
  const handleOnChange = (value: any, name: any) => {
    console.log("val", value, name);
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    dispatch(setLineItemDescription(""));
    let data = formData;
    data.category = {
      Id: GetDropDownId(
        categoryDropDownOptions,
        formData.category.name || formData.category.value,
        "id"
      ),
    };
    data.phase = [
      {
        Id: GetDropDownId(phaseDropDownOptions, formData.phase.name, "id"),
      },
    ];

    data.trades = formData?.trades?.map((tid: any) => {
      return { Id: GetDropDownId(getTradesOptions(), tid, "objectId") };
    });

    const payload = {
      ...data,
      uniqueID: uuidForSbs,
    };
    AddSbsManagerForm(payload)
      .then((res: any) => {
        setFormData(defaultFormData);
        dispatch(getSBSGridList());
        dispatch(setToast('New SBS Item Created Successfully'));
      })
      .catch((err: any) => {
        console.log("error", err);
      });
  };
  const handlePhaseAdd = (item: any, val: any) => {
    dispatch(setShowPhaseModel(true));
    setDynamicClose(!dynamicClose);
    dispatch(setAddPhaseText(val));
    setShowAddIcon(false);
  };
  const handleSearchProp= (items:any, key:any) => {
    if(items?.length === 0) setShowAddIcon(true);
    else setShowAddIcon(false);
  };
  return (
    <>
      <div className="sbs-title-description-container">
        <span className="title-text">Create New SBS</span>
        <AddDescription
          value={!lineItemDescription ? "" : lineItemDescription}
        />
        <p className="right-spacer"></p>
      </div>
      <div className="sbs-manager-lineitem-form">
        <div className="title-field">
          <InputLabel
            required
            className="inputlabel"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Name
          </InputLabel>
          <TextField
            id="name"
            InputProps={{
              startAdornment: <span className="common-icon-sbs-name"> </span>,
            }}
            placeholder={"SBS Name"}
            name="name"
            variant="standard"
            value={formData?.name}
            onChange={(e: any) => handleOnChange(e.target.value, "name")}
          />
        </div>
        <div className="type-field">
          <InputLabel
            required
            className="inputlabel"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Category
          </InputLabel>
          <SmartDropDown
            LeftIcon={<div className="common-icon-Budgetcalculator"></div>}
            options={categoryDropDownOptions || []}
            outSideOfGrid={true}
            isSearchField={false}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={formData?.category.name || formData?.category.value}
            menuProps={classes.menuPaper}
            handleChange={(value: any) => {
              const selRec: any = categoryDropDownOptions.find(
                (rec: any) => rec.value === value[0]
              );
              handleOnChange(selRec, "category");
            }}
          />
        </div>
        <div className="type-field">
          <InputLabel
            required
            className="inputlabel"
            sx={{
              "& .MuiFormLabel-asterisk": {
                color: "red",
              },
            }}
          >
            Phase
          </InputLabel>
          <SmartDropDown
            LeftIcon={<div className="common-icon-phase"></div>}
            options={phaseDropDownOptions || []}
            outSideOfGrid={true}
            isSearchField={true}
            isFullWidth
            Placeholder={"Select"}
            selectedValue={formData?.phase.name}
            menuProps={classes.menuPaper}
            handleChange={(value: any) => {
              const selRec: any = phaseDropDownOptions.find(
                (rec: any) => rec.value === value[0]
              );
              handleOnChange(selRec, "phase");
            }}
            ignoreSorting={true}
            showIconInOptionsAtRight={true}
            handleAddCategory={(val:any) => handlePhaseAdd('phase', val)}
            isCustomSearchField={showAddIcon}
            dynamicClose={dynamicClose}
            handleSearchProp={(items:any, key:any) => handleSearchProp(items, key)}
          />
        </div>
        <div className="type-field">
          <SmartDropDown
            required={true}
            options={getTradesOptions()}
            LeftIcon={<div className="common-icon-trade"></div>}
            dropDownLabel="Trade"
            doTextSearch={true}
            isSearchField={true}
            isMultiple={true}
            selectedValue={formData?.trades}
            isFullWidth
            outSideOfGrid={true}
            handleChange={(value: any) => handleOnChange(value, "trades")}
            handleChipDelete={(value: any) => handleOnChange(value, "trades")}
            menuProps={classes.menuPaper}
            sx={{ fontSize: "18px" }}
            Placeholder={"Select"}
            isSearchPlaceHolder={"Search"}
            showCheckboxes={true}
            showAddButton={false}
            reduceMenuHeight={true}
          />
        </div>
        <div className="start-date-field">
          <InputLabel className="inputlabel">Est. Start Date</InputLabel>
          <DatePickerComponent
            defaultValue={formData.startDate}
            onChange={(val: any) => handleOnChange(val, "startDate")}
            maxDate={
              formData.endDate !== ""
                ? new Date(formData.endDate)
                : new Date("12/31/9999")
            }
            containerClassName={"iq-customdate-cont"}
            render={
              <InputIcon
                placeholder={"Select"}
                className={"custom-input rmdp-input"}
                style={{ background: "#f7f7f7" }}
              />
            }
          />
        </div>
        <div className="end-date-field">
          <InputLabel className="inputlabel">Est. End Date</InputLabel>
          <DatePickerComponent
            defaultValue={formData.endDate}
            onChange={(val: any) => handleOnChange(val, "endDate")}
            minDate={new Date(formData.startDate)}
            containerClassName={"iq-customdate-cont"}
            render={
              <InputIcon
                placeholder={"Select"}
                className={"custom-input rmdp-input"}
                style={{ background: "#f7f7f7" }}
              />
            }
          />
        </div>
        <IQButton
          color="orange"
          sx={{ height: "2.5em" }}
          disabled={disableAddButton}
          onClick={handleAdd}
        >
          + ADD
        </IQButton>
      </div>
    </>
  );
};
export default SBSManagerForm;
