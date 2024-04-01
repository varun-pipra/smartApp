import "./SUIPagingDropdown.scss";
import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconMenu from "components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu";
import SUICompanyCard from "sui-components/CompanyCard/CompanyCard";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import _ from "lodash";

interface SUIServerDropdownProps {
  value?: any;
  handleValueChange?: (value: string[], params: any) => void;
  params?: any;
  outSideOfGrid?: boolean;
  icon?: React.ReactElement;
  multiSelect?: boolean;
  width?: string;
  showFilter?: boolean;
  showFilterInSearch?: boolean;
  showSearchInSearchbar?: boolean;
  dropdownOptions?: any;
  placeHolder?: any;
  noDataFoundMsg?: any;
  menuWidth?: string;
  disableOptionsList?: any;
  sortOrder?: string;
  filterOptions?: any;
  onFilterChange?: any;
  onSearchChange?: any;
  companyImageWidth?: any;
  companyImageHeight?: any;
  addCompany?: any;
  basecustomline?: any;
  image?: any;
  hideTooltip?: any;
  suggestedDropdownOptions?: any;
  handleAdd?: Function;
  displayChips?: boolean;
  suggestedText?: any;
  dynamicClose?: boolean;
  enforcedRelationship?: boolean;
  chipEventTrigger?: boolean;
  paperpropsclassName?: any;
  suggestedDefaultText?: string;
  insideGridCellEditor?: boolean;
  handleListOpen?: Function;
  handleListClose?: Function;
  disabled?: boolean;
  showIconInField?: boolean;
  handleScrollEvent?: Function;
  totalCount?: any;
  retainSearch?:any;
  retainFilters?:any;
  enableGrouping?:boolean;
  enableSorting?:boolean;
  showSuggested?: boolean;
  moduleName?:any;
  isReverseGrouping?:any;
}

const SUIPagingDropdown = (props: SUIServerDropdownProps) => {
  const {
    value,
    handleValueChange,
    params,
    outSideOfGrid = true,
    icon,
    multiSelect = false,
    width = "100px",
    showFilter = false,
    showFilterInSearch = true,
    dropdownOptions,
    placeHolder,
    noDataFoundMsg,
    showSearchInSearchbar = false,
    menuWidth = 250,
    sortOrder = "asc",
    addCompany = true,
    basecustomline = true,
    image = true,
    hideTooltip = false,
    suggestedDropdownOptions,
    handleAdd = () => {},
    displayChips = false,
    suggestedText,
    chipEventTrigger = false,
    paperpropsclassName,
    suggestedDefaultText = "All:",
    insideGridCellEditor = false,
    disabled = false,
    showIconInField = false,
    onSearchChange = () => {},
    onFilterChange = () => {},
    handleScrollEvent = () => {},
    handleListClose = () => { },
    handleListOpen = () => { },
    totalCount,
    retainSearch = '',
    retainFilters = {},
    enableGrouping = true,
    enableSorting = false,
    showSuggested = false,
    enforcedRelationship = false,
    moduleName = 'userDetails',
    isReverseGrouping = false
  } = props;
  const filtersRef = React.useRef<any>({});
  const selectRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedOptions, setSelectedOptions] = React.useState<any[]>(value);
  const [menuOption, setMenuOption] = React.useState(dropdownOptions);
  const [search, setSearch] = React.useState<string>("");
  const [filters, setFilters] = React.useState(filtersRef.current);
  const [filteredData, setFilteredData] = React.useState<any>(Object.keys(filters)?.length);
  const filterOptions = React.useDeferredValue(props?.filterOptions);
  const [open, setOpen] = React.useState(false);
  const callFilterMethod = React.useRef<boolean>(false);
  const getSortedData = (array: any) => {
    return array.sort((a: any, b: any) => a?.name?.localeCompare(b?.name));
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      onScroll: (event: any) => {
        const { offsetHeight, scrollTop, scrollHeight } = event.target;
        if (offsetHeight + scrollTop + 5.2 >= scrollHeight && (totalCount >= (menuOption?.length + 1))) {
          event.stopPropagation();
          setTimeout(() => {
            handleScrollEvent && handleScrollEvent(event);
          }, 200);
        }
      },
      style: {
        maxHeight: ITEM_HEIGHT * 5.2 + ITEM_PADDING_TOP,
        minHeight: ITEM_HEIGHT * 5.2 + ITEM_PADDING_TOP,
        width: menuWidth,
      },
      className: paperpropsclassName,
    },
  };

  React.useEffect(() => {
    if(Object.keys(retainFilters)?.length) {
      filtersRef.current = retainFilters;
      setFilters(retainFilters);
    };
    if(retainSearch !== '') {
      setSearch(retainSearch);
    }
  },[retainFilters, retainSearch])
  React.useEffect(() => {
    setSelectedOptions([value?.[0]?.displayField]);
  }, [value]);

  React.useEffect(() => {
      if(enableSorting) {
        setMenuOption(getSortedData(dropdownOptions));
      } else {
        setMenuOption(dropdownOptions);
      };
  }, [dropdownOptions]);
  React.useEffect(() => {
    if ((suggestedDropdownOptions?.length > 0 ?? [])) {
      let removeDuplicates = ([...dropdownOptions] || [])?.filter((item: any) => {
        return !suggestedDropdownOptions.some(
          (value: any) => value.id === item.id
        );
      });
      setMenuOption([...suggestedDropdownOptions, ...removeDuplicates]);
    } else {setMenuOption(dropdownOptions)};
  }, [suggestedDropdownOptions]);
  const handleChange = (event:any) => {
    event.stopPropagation();
    const value = event.target?.value ?? event.target?.textContent;
    let duplicateRemoved: any[] = [];
    if (multiSelect) {
      if (Array.isArray(value)) {
        value.forEach((item: any) => {
          if (duplicateRemoved.findIndex((o) => o.id === item.id) >= 0) {
            duplicateRemoved = duplicateRemoved.filter((x) => x.id === item.id);
          } else {
            duplicateRemoved.push(item);
          }
        });
      }
    } else {
      duplicateRemoved.push(value);
    }
    setSelectedOptions(duplicateRemoved);
    const selectedOption = [...menuOption].find((obj: any) => {
      return obj.displayField === value;
    });
    if (selectedOption) {
      handleSingleSelect(selectedOption);
    }
  };

  const handleSingleSelect = (singleSelect: any) => {
    if (handleValueChange && singleSelect) {
      handleValueChange([singleSelect], params);
      handleClose();
    }
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    onSearchChange(searchValue);
  };

  const filterChange = (filterValues: any) => {
    if (!_.isEqual(filters, filterValues)) {
      if (Object.keys(filterValues).length !== 0) {
        let filterObj = filterValues;
        Object.keys(filterObj).filter((item) => {
          if (filterObj[item]?.length === 0) {
            delete filterObj[item];
            if (Object.keys(filtersRef.current)?.includes(item)) {
              delete filtersRef.current?.[item];
              callFilterMethod.current = true;
            }
          } else if (filterObj[item]?.length > 0 && !_.isEqual(filtersRef.current?.[item], filterObj?.[item])) {
            filtersRef.current = {...filtersRef.current,[item]: filterObj?.[item]};
          }
        });
        filterObj = { ...filterObj, ...filtersRef.current };
        setFilters(filterObj);
        filtersRef.current = filterObj;
        if(Object.keys(filterObj)?.length === 0 && !callFilterMethod?.current) return;
        else {onFilterChange(filtersRef.current); callFilterMethod.current = false};
      } else {
        if (Object.keys(filterValues).length === 0) {
          setFilters(filterValues);
          filtersRef.current = filterValues;
          onFilterChange(filtersRef.current);
        }
      };
    }
  };
  const CompnayCardTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "white",
      borderRadius: 5,
      width: "550px",
      zIndex: "108px",
      marginTop: "10px",
      maxWidth: 550,
    },
  });
  const dropdownMenuItems = (item: any, idx: number) => {
    return (
      <MenuItem
        key={item + idx}
        value={item.displayField}
        // autoFocus={selectedOptions?.includes(item?.displayField)}
        disabled={
          props?.disableOptionsList &&
          props?.disableOptionsList?.includes(item?.id)
            ? true
            : false
        }
        className="base-dropdown-custom-menu-item"
        style={{
          background: selectedOptions.includes(item.displayField)
            ? "#fffad2"
            : "transparent",
        }}
        onClick={(e: any) => handleChange(e)}
      >
        <>
          {multiSelect && (
            <Checkbox
              checked={
                selectedOptions.findIndex(
                  (selectedItem: any) => item?.id === selectedItem?.id
                ) >= 0
              }
            />
          )}
          {basecustomline && (
            <div
              className={multiSelect ? "base-custom-line" : "base-custom-line2"}
              style={{ backgroundColor: `#${item.color}` }}
            ></div>
          )}
          {image && (
            <CompnayCardTooltip
              enterDelay={700}
              {...props}
              title={<SUICompanyCard companyDetails={item} />}
              disableHoverListener={hideTooltip}
            >
              {!!item?.thumbnailUrl ? (
                <img
                  src={item?.thumbnailUrl}
                  alt="Avatar"
                  style={{ width: "24px", height: "24px", padding: "1px" }}
                  className="base-custom-img"
                />
              ) : (
                <Avatar
                  sx={{
                    backgroundColor: `#${item.color}`,
                    width: "24px",
                    height: "24px",
                    padding: "1px",
                    marginRight: "10px",
                    fontSize: "12px",
                  }}
                >
                  {item?.displayField?.[0]?.toUpperCase()}
                </Avatar>
              )}
            </CompnayCardTooltip>
          )}
          <ListItemText
            primary={item?.displayField}
            className={
              !outSideOfGrid ? "base-custome-styles" : "base-custom-outsidegrid"
            }
          />
        </>
      </MenuItem>
    );
  };
  const handleAddIconClick = () => {
    handleAdd(selectedOptions, search);
  };
  const handleChipDelete = (e: React.MouseEvent, value: any) => {
    let itemToDelete = value;

    if (itemToDelete) {
      let activeOptions: any = [...selectedOptions];
      const index = activeOptions.indexOf(itemToDelete);
      if (index > -1) activeOptions.splice(index, 1);
      setSelectedOptions(activeOptions);
      if (chipEventTrigger) {
        handleSingleSelect(activeOptions);
      }
    }
  };
  const handleClose = () => {
		setOpen(false);
		if (handleListClose) {
			handleListClose(true);
		}
	};
  const handleOpen = () => {
		setOpen(!open);
		if (handleListOpen) {
			handleListOpen(true);
		}
	};
  const InputRef = (props: any) => {
    const { label, ...rest } = props;
    return (
      <InputLabel
        className="comp-drop-header"
        style={{
          padding: "8px 16px",
          background: "#fff",
          font: "bold 14px/15px 'roboto-regular'",
          color: "#333",
        }}
      >
        {label}
      </InputLabel>
    );
  };
  return (
    <div className="base-container">
      <FormControl
        variant="standard"
        sx={{
          width: outSideOfGrid ? "100%" : 210,
          maxWidth: outSideOfGrid ? "100%" : 210,
        }}
      >
        <span>
          <Select
            ref={selectRef}
            className={
              (outSideOfGrid
                ? "base-custom-outsidegrid"
                : "base-custome-styles") +
              (insideGridCellEditor ? " inside-grid-cell-cls" : "")
            }
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple={multiSelect}
            variant="standard"
            displayEmpty={false}
            value={selectedOptions}
            onChange={handleChange}
            open={open}
            disabled={disabled}
            onClose={handleClose}
            onOpen={handleOpen}
            renderValue={(selected: any) => {
              if (selected?.filter((x:any) => !!x)?.length === 0) {
                return <div>{placeHolder}</div>;
              } else if (selectedOptions && selectedOptions?.length > 0) {
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {[...menuOption]
                      .filter((x: any) => selected.includes(x?.displayField))
                      .map((x: any, index: any) => (
                        <>
                          {displayChips ? (
                            <Chip
                              key={x.displayField + index}
                              className="smart-dropdown-chip-cls"
                              onDelete={(e: any) =>
                                handleChipDelete(e, x?.displayField)
                              }
                              label={
                                  x.displayField
                              }
                              deleteIcon={
                                <span
                                  className="smart-dropdown-chip-close-cls"
                                  onMouseDown={(event) =>
                                    event.stopPropagation()
                                  }
                                >
                                  +
                                </span>
                              }
                            />
                          ) : (
                            <div
                              key={x.displayField + index}
                              className="dropdown-without-chip-cls"
                            >
                              {showIconInField && (
                                <>
                                  {!!x?.thumbnailUrl ? (
                                    <img
                                      src={x?.thumbnailUrl}
                                      alt="Avatar"
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        padding: "1px",
                                      }}
                                      className="base-custom-img"
                                    />
                                  ) : (
                                    <Avatar
                                      sx={{
                                        backgroundColor: `#${x.color}`,
                                        width: "24px",
                                        height: "24px",
                                        padding: "1px",
                                        marginRight: "10px",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {x?.displayField?.[0]?.toUpperCase()}
                                    </Avatar>
                                  )}
                                </>
                              )}
                              {x?.displayField}
                            </div>
                          )}
                        </>
                      ))}
                  </Box>
                );
              }
              else return selected?.map((x: any) => x?.displayField).join(", ");
            }}
            MenuProps={MenuProps}
            IconComponent={undefined}
            style={{ width: width }}
            startAdornment={
              icon ? (
                <InputAdornment position="start">{icon}</InputAdornment>
              ) : value?.thumbnailUrl ? (
                <InputAdornment position="start">
                  <img
                    src={value?.thumbnailUrl}
                    alt="Avatar"
                    style={{ width: "28px", height: "28px" }}
                    className="base-custom-img"
                  />
                </InputAdornment>
              ) : null
            }
            endAdornment={
              <>
                {showFilter && (
                  <InputAdornment position="end">
                    <Button
                      sx={{
                        border: `solid 1px ${
                          filteredData.length > 0
                            ? "#0590cd"
                            : "rgba(0,0,0,0.6)"
                        } !important`,
                        borderRadius: 50,
                        color: `${
                          filteredData.length > 0
                            ? "#0590cd"
                            : "rgba(0,0,0,0.6)"
                        } !important`,
                        padding: "1px",
                        height: "24px",
                        minWidth: "24px",
                      }}
                    >
                      <div
                        className={`common-icon-Filter ${
                          filteredData.length == 0
                            ? "common-icon-Filter"
                            : "budget-Filter-blue"
                        }`}
                      ></div>
                    </Button>
                  </InputAdornment>
                )}
              </>
            }
            sx={
              !outSideOfGrid
                ? {
                    "&:before": {
                      border: "none",
                    },
                    "&:after": {
                      border: "none",
                    },
                    ".MuiSelect-icon": {
                      display: "none",
                    },
                    "& .MuiSelect-select .notranslate::after": placeHolder
                      ? {
                          content: `"${placeHolder}"`,
                        }
                      : {},
                  }
                : {
                    ".MuiSelect-icon": {
                      // display: "none",
                    },
                    "& .MuiSelect-select .notranslate::after": placeHolder
                      ? {
                          content: `"${placeHolder}"`,
                        }
                      : {},
                  }
            }
          >
            <ListSubheader sx={{ padding: "0px" }}>
              <Box p={1} className="search-wrapper">
                <TextField
                  size="small"
                  fullWidth
                  tabIndex={1}
                  value={search}
                  onChange={(event: any) => handleSearch(event.target.value)}
                  placeholder="Search"
                  className="base-search-text-field"
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                      e.stopPropagation();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {showFilterInSearch && (
                          <IconMenu
                            showNone={true}
                            options={filterOptions}
                            defaultValue={filters}
                            allowSubMenu={true}
                            onChange={filterChange}
                            menuProps={{
                              open: true,
                              header: "Filter By",
                              placement: "bottom-end",
                            }}
                            buttonProps={{
                              "aria-label": "Filter menu",
                              className: "filter-menu",
                              disableRipple: true,
                              sx: {
                                border: `solid 1px ${
                                  filteredData.length > 0
                                    ? "#0590cd"
                                    : "rgba(0,0,0,0.6)"
                                } !important`,
                                borderRadius: 50,
                                color: `${
                                  filteredData.length > 0
                                    ? "#0590cd"
                                    : "rgba(0,0,0,0.6)"
                                } !important`,
                                marginRight: "10px",
                                padding: "1px",
                                height: "24px",
                                minWidth: "24px",
                              },
                              startIcon: filteredData?.length ? (
                                <span className="budget-Filter-blue" />
                              ) : (
                                <span className="common-icon-Filter" />
                              ),
                            }}
                          />
                        )}

                        {showSearchInSearchbar && (
                          <SearchIcon className="search-btn" />
                        )}
                        {addCompany && (
                          <IconButton
                            aria-label="Add"
                            disabled={menuOption.length > 0 ? true : false}
                            onClick={() => handleAddIconClick()}
                            sx={{
                              ".Mui-disabled": {
                                pointerEvents: "none",
                                color: "#EEEEEE",
                              },
                            }}
                          >
                            <span className="common-icon-add"></span>
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              </Box>
            </ListSubheader>
            {!isReverseGrouping && menuOption && menuOption?.length > 0 ? (
              <div>
                {(enableGrouping && menuOption?.some((item: any) => !item.isSuggested)) && (
                    <InputRef label={suggestedDefaultText} />
                  )}
                {menuOption
                  .filter((item: any, idx: any) => !item.isSuggested)
                  .map((item: any, idx: number) => {
                    return dropdownMenuItems(item, idx);
                  })}
                {(enableGrouping && menuOption?.some((item: any) => item.isSuggested)) && (
                  <InputRef label={suggestedText} />
                )}
                {menuOption
                  .filter((item: any, idx: number) => item.isSuggested)
                  .map((item: any, idx: number) => {
                    return dropdownMenuItems(item, idx);
                })}
              </div>
            ) : <div>
              {isReverseGrouping && menuOption && menuOption?.length > 0 ? (
              <div>
                {(enableGrouping && menuOption?.some((item: any) => item.isSuggested)) && (
                    <InputRef label={suggestedDefaultText} />
                  )}
                {menuOption
                  .filter((item: any, idx: any) => item.isSuggested)
                  .map((item: any, idx: number) => {
                    return dropdownMenuItems(item, idx);
                  })}
                {(enableGrouping && menuOption?.some((item: any) => !item.isSuggested)) && (
                  <InputRef label={suggestedText} />
                )}
                {menuOption
                  .filter((item: any, idx: number) => !item.isSuggested)
                  .map((item: any, idx: number) => {
                    return dropdownMenuItems(item, idx);
                })}
              </div>
            ): (
              <div className="base-no-data">{noDataFoundMsg}</div>
             )}
            </div>}
            </Select>
        </span>
      </FormControl>
    </div>
  );
};

export default React.memo(SUIPagingDropdown);
