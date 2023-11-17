import IQTooltip from "components/iqtooltip/IQTooltip";
import { memo, useEffect, useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import "./SMBrenaToolbar.scss";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import SMSpecLeftForm from "features/field/specificationmanager/content/toolbar/smlefttoolbar/SMSpecLeftForm";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getUploadQueue } from "features/field/specificationmanager/stores/FilesSlice";
import { getBrenaList, setBrenaSearchText, setSpecBrenaFilters } from "features/field/specificationmanager/stores/SpecificationManagerSlice";

interface SMBrenaToolbarProps {
  deletedSections?: any;
}

export const SMBrenaToolbar = memo((props: SMBrenaToolbarProps) => {
  const { deletedSections } = props;
  const dispatch = useAppDispatch();
  const fileQueue = useAppSelector(getUploadQueue);
  const { smSelectedBrenaIds, brenaData} = useAppSelector((state:any) => state.specificationManager);
  const [isOpen, setOpen] = useState(false);
  const [color, setColor] = useState(false);
  const disableField = smSelectedBrenaIds.length > 0;
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
  const findAndUpdateFiltersData = (
    data: any,
    key: string,
    nested?: boolean,
    nestedKey?: any,
    custom?: boolean,
    customKey?: any,
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
          id: rec?.[key]?.id,
        };
        else return { text: rec?.[key] === '' ? 'NA' : rec?.[key], value: rec?.[key] === '' ? 'NA' : rec?.[key], id: rec?.id };
    });
    const filtersCopy: any = [...filters];
    let currentItem: any = filtersCopy.find((rec: any) => rec?.value === key);
    currentItem.children.items = GetUniqueList(formattedData, "text");
  };
  useEffect(() => {
      if(brenaData?.length) {
        findAndUpdateFiltersData(brenaData,"division",true,"text",true,"number");
      }
  },[brenaData])
  const handleOpen = () => {
    setOpen(true);
    setColor(true);
  };
  const handleClose = () => {
    setOpen(false);
    setColor(false);
  };

  const refreshSMBrenaGrid = () => {
    dispatch(getBrenaList(fileQueue?.[0]));
  };
  const filters = useMemo(() => {
    var filterMenu = [
      {
        text: "Division",
        value: "division",
        key: "division",
        children: {
          type: "checkbox",
          items: [],
        },
      },
    ];
    return filterMenu;
  }, []);
  const onFilterChange = (filterValues: any) => {
    if (
      Object.keys(filterValues)?.length > 0 &&
      (filterValues?.division?.length > 0 ?? false)
    ) {
      dispatch(setSpecBrenaFilters(filterValues));
    } else {
      dispatch(setSpecBrenaFilters({}));
    }
  };
  return (
    <>
      {isOpen && (
        <SMSpecLeftForm drawIcon={true} arrow={true} onClose={handleClose} />
      )}
      <div className="sm-brena-left-toolbar-cont">
        <div className="data">
          <IQTooltip title="Refresh" placement="bottom">
            <IconButton
              aria-label="Refresh Spec Manager"
              sx={{
                "& .MuiIconButton-root": {
                  margin: "0 -0.1em",
                },
              }}
              onClick={refreshSMBrenaGrid}
            >
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

          <IQTooltip title="Delete" placement="bottom">
            <IconButton
              aria-label="Delete Bid response Line Item"
              onClick={deletedSections}
              disabled={!disableField}
              sx={{
                "& .MuiIconButton-root": {
                  margin: "0 -0.1em",
                },
              }}
            >
              <span className="common-icon-delete"></span>
            </IconButton>
          </IQTooltip>
        </div>
        <div>
          <IQSearchField
            placeholder={"Search"}
            showGroups={false}
            filters={filters}
            onFilterChange={onFilterChange}
            filterHeader=""
            sx={{
              height: "2em",
              minWidth: "19em",
              marginTop: "5px",
              marginLeft: "3.3em",
            }}
            onSearchChange={(e:any) => dispatch(setBrenaSearchText(e))}
          />
        </div>
      </div>
    </>
  );
});
