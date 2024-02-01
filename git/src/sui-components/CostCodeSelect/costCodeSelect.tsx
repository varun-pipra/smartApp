import React, { useEffect, useRef, useState } from "react";
import {
	ListSubheader,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	Button,
	Box,
	TextField,
	Popover,
	FormControlLabel,
	Checkbox,
	checkboxClasses
} from "@mui/material";

import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import { makeStyles, createStyles } from '@mui/styles';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SUIFilterInfiniteMenu from "sui-components/FilterInfiniteMenu/SUIFilterInfiniteMenu";

export interface CostCodeSelectProps {
	label?: string;
	options?: any;
	selectedValue?: any;
	onChange?: (value: any) => any;
	required?: boolean;
	startIcon?: React.ReactElement;
	checkedColor?: string;
	showFilter?: boolean;
	sx?: any;
	isFullWidth?: boolean;
	tooltipShow?: boolean;
	variant?: any;
	Placeholder?: any;
	displayEmpty?: boolean;
	outSideOfGrid?: boolean;
	filteringValue?: any;
	showFilterInSearch?: boolean;
	filteroptions?: any;
	onFiltersUpdate?:any;
	defaultFilters?:any;
	hiddenOptions?: any;
	disabled?:boolean;
}
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120
		},
		selectEmpty: {
			marginTop: theme.spacing(2)
		},
		menuPaper: {
			//maxHeight: 300
			maxWidth: '170px !important',
			minWidth: 'fit-content !important',

		}
	})
);

export default function CostCodeSelect({ label, options, onChange, required, startIcon, selectedValue, checkedColor, showFilter, sx, isFullWidth = true, tooltipShow = true, variant = "standard", Placeholder = 'Select', displayEmpty = false, outSideOfGrid = true, filteringValue, showFilterInSearch = false, filteroptions, onFiltersUpdate, defaultFilters = [], hiddenOptions = [], disabled= false }: CostCodeSelectProps) {
	const classes = useStyles();
	const [items, setItems] = useState(options);
	const [value, setValue] = useState<any>(selectedValue);
	const [tooltip, setTooltip] = useState('');
	const [ellipsis, setEllipsis] = useState<any>();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement | null>(null);
	const [toggleDropDown, setToggleDropDown] = useState<any>(false);
	const [filterIconPos, setFilterIconPos] = useState<any>({ clientX: 0, clientY: 0 });
	const [selectedFilters, setSelectedFilters] = useState<any>([]);
	const [filteredData, setFilteredData] = useState<any>([]);
	// console.log("options in cost code select", options, filteroptions)

	React.useEffect(() => {
		defaultFilters?.length && setSelectedFilters(defaultFilters);
	}, [defaultFilters])

	React.useEffect(() => {
		setValue(selectedValue);
	}, [selectedValue])

	const handleChange = (event: any) => {
		console.log("eventtt", event.target.value)
		const str = event.target.value.split("|");
		setTooltip(str[1])
		setValue(event.target.value);
		if (onChange) onChange(event.target.value);
	};

	const handleSearch = (searchValue: string) => {
		setSearch(searchValue);

		if (searchValue !== '') {
			let searchData = filteredData.length > 0 ? filteredData : options;
			const firstResult = searchData && searchData.filter((obj: any) => {
				const data = JSON.stringify(obj).toLowerCase().includes(searchValue.toLowerCase());
				return data;
			});
			if (firstResult && firstResult.length > 0) {
				const secondResult = firstResult.map((obj2: any) => {
					const dataresult = obj2.children.filter((data: any) => {
						return JSON.stringify(data).toLowerCase().includes(searchValue.toLowerCase());
					})
					return { ...obj2, children: dataresult };
				})
				if (secondResult && secondResult.length > 0) {
					const finalResult = secondResult.filter((data: any) => {
						return data.children && data.children.length > 0 ? true : false;
					})
					//console.log('finalResult', finalResult)
					finalResult.length > 0 ? setItems(secondResult) : setItems(firstResult);
				}
			}
			else {
				setItems(firstResult ? firstResult : []);
			}
		} else {
			if (selectedFilters?.length === 0) setItems(options ? options : []);
		}

		// const firstResult = options.filter((obj: any) => {
		// 	const data = JSON.stringify(obj).toLowerCase().includes(searchValue.toLowerCase());
		// 	return data;
		// });
		// console.log('firstResult', firstResult)
		// setItems(firstResult);
	};

	useEffect(() => {
		if (search != '' && selectedFilters.length) handleSearch(search);
	}, [search, selectedFilters]);

	useEffect(() => {
		setItems(options ? options : []);
	}, [options]);

	useEffect(() => {
		selectedFilters?.length && onFilterChange(selectedFilters, {}, true)
	}, [selectedFilters]);

	const isEllipsisActive = (e: any) => {
		if (e) return (e.clientWidth < e.scrollWidth);
	}


	const onOpenChange = (e: any) => {
		// console.log("eee", e)
		setToggleDropDown(false)
		setEllipsis(false)
		const { target } = e;

		const element = target.offsetParent;

		setTimeout(() => {
			const dPopover: any = document.querySelector('#menu-.MuiModal-root .MuiPaper-root');
			const width = `${element.offsetWidth + element.offsetLeft}px`;

			// Search Wrapper max width
			const searchInput = dPopover.querySelector('.search-wrapper');
			// searchInput.style.maxWidth = width;

			dPopover.style.minWidth = width;
			dPopover.style.left = `calc(${dPopover.style.left} + 12px)`;
		}, 100);
	}
	const handleSearchClear = () => {
		setSearch('');
		setItems(options ? options : [])
	}

	// Changing the FilterIDs to required format
	const changeFilterFormat = (filteredIds: any) => {
		let dataSet = {};
		filteredIds?.forEach((ele: any) => {
			const ids = ele.toString().split(';');
			if (ids.length > 1) {
				const values: any = []
				filteredIds.forEach((ele1: any) => {
					const ele1Ids = ele1.toString().split(";")
					if (ele1Ids.length > 1 && ele1Ids.includes(ids[0])) { values.push(ele1) }
				})
				if (values.length > 0) dataSet = { ...dataSet, [ids[0]]: values }
			}
			else {
				dataSet = { ...dataSet, [ele]: [ele] }
			}
		})
		return dataSet;
	}

	const onFilterChange = (data: any, updatedList: any, defaultFilters:boolean=false) => {
    if(!defaultFilters) {
		setSelectedFilters(data);
		onFiltersUpdate && onFiltersUpdate(data)
	}
    let filteredData: any = [];
    // const filteredIds = ["1239;1231;1232;1233", "1241;1355", "1239;1231;1232;1234","1239;1231;1232;1235", "1241;1337", "1241;1354", "1239;1231;1232;1236"]
    // I need this format {"1239": ["1239"], "1241": ["1241;1337", "1241;1354"]}
    const filterIds: any = changeFilterFormat(data);
    data.forEach((key: any) => {
      // const value = filterIds[key];
      options.forEach((option: any) => {
        let children: any = [];
        if (option?.hierarchy?.includes(key?.replaceAll(";", ","))) {
          filteredData?.push(option);
        }
        // if (value[0].toString().split(";").length > 1) {
        // 	option.children.forEach((childOption: any) => {
        // 		value.forEach((val: any) => {
        // 			if (childOption.hierarchy.includes(val)) children.push(childOption)
        // 		})
        // 	})
        // }
        // else {
        // 	if (option.id == key) children = [...option.children]
        // }
        // if (option.id == key) {
        // 	const obj = {
        // 		id: option?.id,
        // 		value: option?.value,
        // 		hierarchy: option?.hierarchy,
        // 		children: children
        // 	}
        // 	filteredData.push(obj)
        // }
      });
    });
    // console.log("filteredDatafilteredData", filteredData);
    if (filteredData?.length) {
      setItems(filteredData);
      setFilteredData(filteredData);
    }
    data?.length == 0 && setItems(options);
  };

	return (
    <>
      <Box className='cost-code-field-box'>
        <Box>
          <InputLabel className={outSideOfGrid ? "inputlabel" : "inputlabel1"}
					>{label}{(label && required) && <span className="required_color">*</span>}
          </InputLabel>

          <Select
            // className="selectcostcode"
            multiple={false}
            className={outSideOfGrid ? "selectcostcode" : "selectcostcodenew"}
            variant={variant}
            style={{
              backgroundColor: "transparent !important",
            }}
            fullWidth={isFullWidth}
            value={value}
            onOpen={onOpenChange}
            MenuProps={{
              classes: { paper: classes.menuPaper },
              PaperProps: { sx: { maxHeight: 500 } },
              autoFocus: false,
              className: 'costcodedropdown'
            }}
            onChange={(e: any) => handleChange(e)}
            onFocus={() => {
              if (searchRef?.current) {
                setTimeout(() => {
                  searchRef.current?.focus();
                }, 400);
              }
            }}

            startAdornment={
              <InputAdornment position="start">{startIcon}</InputAdornment>
            }
            // endAdornment={
            // 	<>
            // 		{showFilter && <SUIFilterInfiniteMenu
            // 			menusData={filteroptions ? filteroptions : []}
            // 			onSelectionChange={onFilterChange}
            // 			identifier={'hierarchy'}
            // 			selectedFilterVals={selectedFilters}

            // 		></SUIFilterInfiniteMenu>}
            // 	</>
            // }
            sx={{
              ...sx,
              '& .MuiSelect-select': {
                color: '#333333 !important',
                fontFamily: 'Roboto-Regular !important',
              },
              '& .MuiSelect-select .notranslate::after': Placeholder
                ? {
                    content: `"${Placeholder}"`,
                  }
                : {},
              // '& .MuiSvgIcon-root': {
              // 	display: 'none'
              // }
            }}
			displayEmpty={displayEmpty}
			disabled={disabled}
          >
            <Box p={1} className="search-wrapper">
              <TextField
                size="small"
                fullWidth tabIndex={1}
                inputRef={searchRef}
                value={search}
                onChange={(event: any) => handleSearch(event.target.value)}
                placeholder="Search"
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    // Prevents autoselecting item while typing (default Select behaviour)
                    e.stopPropagation();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      
											{search == '' ? <SearchIcon /> : <ClearIcon onClick={handleSearchClear} style={{ cursor: 'pointer' }} />}
                      {showFilterInSearch &&
                        <> <Button
                            sx={{
                              border: `solid 1px ${selectedFilters?.length > 0 ? "#0590cd" : "rgba(0,0,0,0.6)"} !important`,
                              borderRadius: 50,
                              color: `${selectedFilters?.length > 0 ? "#0590cd" : "rgba(0,0,0,0.6)"} !important`,
                              padding: "1px",
                              width: "24px",
                              minWidth: "24px",
                              height: "24px",
                            }}
                            onClick={(e) => { setToggleDropDown(Date.now()); setFilterIconPos(e) }}
                          >
                            <div className={`common-icon-Filter ${selectedFilters?.length == 0 ? 'common-icon-Filter' : 'common-icon-Filter-blue'}`}></div>
                          </Button>
                          <SUIFilterInfiniteMenu
                            menusData={filteroptions ? filteroptions : []}
                            onSelectionChange={(ids: any, ops: any) => { onFilterChange(ids, ops); }}
                            identifier="hierarchy"
                            toggleDropDown={toggleDropDown}
                            filterIconPos={filterIconPos}
                            selectedFilterVals={selectedFilters}
                          ></SUIFilterInfiniteMenu>
                        </>
                      }
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </Box>

            {items.length > 0 ?
              items?.map((item: any, index: number) => {
                return [

                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      lineHeight: 1.8,
                      marginTop: "5px",
                    }}
                    disableSticky={true}
                  >
                    {item?.value}
                  </ListSubheader>,

                  item?.children?.map((option: any, i: number) => (

                    <MenuItem
                      key={i}
                      value={item.value + '|' + option.value}
                      sx={{
                        backgroundColor: "white",
                        fontWeight: "100 !important",
                        paddingLeft: 4,
                        fontSize: outSideOfGrid ? '16px' : '14px',
                        lineHeight: 1.3,
                        " &.Mui-selected": {
                          backgroundColor: value != '' ? "#fff9cc !important" : "#fff !important",
                        },
                        // "&:hover, &:focus, &.Mui-selected": {
                        // 	backgroundColor: "#fff9cc !important",
                        // },
                      }}
                    >
                      {option.value}
                    </MenuItem>
                  )),
                ];
              })
             : (
              <MenuItem>No records found</MenuItem>
            )}
            {hiddenOptions?.length > 0 && hiddenOptions.map((rec: any) => {
              return (
                <MenuItem
                  className="cost-code-select-menu-item-hidden"
                  key={rec.id}
                  value={rec.value}
                >
                  {rec.value}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
      </Box>
    </>
  );
}
