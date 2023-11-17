import IQTooltip from "components/iqtooltip/IQTooltip";
import { memo, useEffect, useMemo, useState } from "react";

import { IconButton } from "@mui/material";
import UploadMenu from "sui-components/DocUploader/UploadMenu/UploadMenu";
import "./SubmitalBrenaToolbar.scss";
//import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import SSMittalLeftForm from "./SSAddForm";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  setSelectedBrenaFilters,
  setSpecDropdownValue,
} from "features/field/smartsubmittals/stores/SmartSubmitalSlice";

export const SubmitalBrenaToolbar = memo((props: any) => {
  const {
    onCardsSearch,
    handleDeleteCards,
    handleStatusChecked,
    handleRefreshCards,
    ...rest
  } = props;
  const { selectedCardsIds } = useAppSelector(
    (state: any) => state.smartSubmitalsLeftToolbar
  );
  const { selectedRecordsData } = useAppSelector(
    (state: any) => state.smartSubmittals
  );
  const [dropdownValues, setDropdownValues] = useState([]);
  const dispatch = useAppDispatch();
  const [color, setColor] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const disableField = selectedCardsIds?.length > 0;
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const filters = useMemo(() => {
    var filterMenu = [
      {
        text: "Status",
        value: "status",
        key: "status",
        children: {
          type: "checkbox",
          items: [
            { id: 0, text: "Draft", value: "Draft" },
            { id: 1, text: "Suggested Draft", value: "SuggestedDraft" },
            { id: 2, text: "Committed", value: "Committed" },
          ],
        },
      },
    ];
    return filterMenu;
  }, []);
  const onFilterChange = (filterValues: any) => {
    if (
      Object.keys(filterValues)?.length > 0 &&
      (filterValues?.status?.length > 0 ?? false)
    ) {
      dispatch(setSelectedBrenaFilters(filterValues));
    } else {
      dispatch(setSelectedBrenaFilters({}));
    }
  };
  const GenerateDropdownData = (array: any) => {
    let dropdownArray: any[] = [];
    for (let i in array) {
      const ab: any = array?.[i]?.data;
      dropdownArray.push({
        id: ab?.id,
        value: ab?.title,
        label: ab?.title,
        status:
          ab?.submittalCountBySection === ab?.committedCountBySection
            ? "completed"
            : "unpublished",
        page: `${ab?.startPage} - ${ab?.startPage}`,
        desc:
          ab?.submittalCountBySection === ab?.committedCountBySection
            ? "All Submittals of this Section are Committed"
            : "All Submittals of this Section are not Committed",
      });
    }
    return dropdownArray;
  };
  useEffect(() => {
    if (selectedRecordsData?.length > 0) {
      const data: any = GenerateDropdownData(selectedRecordsData);
      setDropdownValues(data);
    }
  }, [selectedRecordsData]);
  const dropDownListExtraColumns = [
    { name: "", dataKey: "label", headerName: "Spec Section Name" },
    {
      name: "status",
      dataKey: "status",
      showTooltip: true,
      tooltipDataKey: "desc",
    },
    {
      name: "label",
      dataKey: "page",
      headerName: "Page No.",
    },
  ];

  const onSelection = (e: any) => {
    dispatch(setSpecDropdownValue(e));
  };

  return (
    <div className="sm-brena-left-toolbar-cont">
      <div className="data">
        <IQTooltip title="Refresh" placement="bottom">
          <IconButton
            aria-label="Refresh Spec Manager"
            onClick={handleRefreshCards}
            sx={{
              "& .MuiIconButton-root": {
                margin: "0 -0.1em",
              },
            }}
          >
            <span className="common-icon-refresh"></span>
          </IconButton>
        </IQTooltip>
        <IQTooltip title="Add" placement="bottom">
          <IconButton
            className={color ? "add-color" : " "}
            onClick={handleOpen}
            sx={{
              "& .MuiIconButton-root": {
                margin: "0 -0.1em",
              },
            }}
            data-action="add"
          >
            <span className="common-icon-add" />
          </IconButton>
        </IQTooltip>

        <IQTooltip title="Commit" placement="bottom">
          <IconButton
            data-action="edit"
            sx={{
              "& .MuiIconButton-root": {
                margin: "0 -0.1em",
              },
            }}
            onClick={handleStatusChecked}
            disabled={!disableField}
          >
            <span className="common-icon-tickmark"></span>
          </IconButton>
        </IQTooltip>

        <IQTooltip title="Delete" placement="bottom">
          <IconButton
            aria-label="Delete Bid response Line Item"
            sx={{
              "& .MuiIconButton-root": {
                margin: "0 -0.1em",
              },
            }}
            onClick={handleDeleteCards}
            disabled={!disableField}
          >
            <span className="common-icon-delete"></span>
          </IconButton>
        </IQTooltip>
      </div>
      <div className="left-search-cls">
        <IQSearchField
          placeholder={"Search for Spec Sections"}
          showGroups={false}
          showFilter={true}
          filters={filters}
          filterHeader=""
          sx={{ height: "2em", minWidth: "19em", marginTop: "5px" }}
          onFilterChange={onFilterChange}
          onSearchChange={(e: any) => onCardsSearch(e)}
          isShowDropdown={true}
          dropDownListExtraColumns={dropDownListExtraColumns}
          dropdownValues={dropdownValues}
          onSelectionChange={(e: any) => onSelection(e)}
        />
      </div>
      {isOpen && <SSMittalLeftForm drawIcon={true} onClose={handleClose} />}
    </div>
  );
});
