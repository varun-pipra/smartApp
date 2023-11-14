import "./BaseDropdown.scss";
import * as React from "react";
import { useRef } from "react";
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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import plusround from "resources/images/common/plusround.svg";
import PlusRoundDisable from "resources/images/common/PlusRoundDisable.svg";
import IconMenu from "components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu";
import SUICompanyCard from "sui-components/CompanyCard/CompanyCard";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

interface SUIBaseDropdownSelectorProps {
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
	companyImageWidth?: any;
	companyImageHeight?: any;
	addCompany?: any;
	basecustomline?: any;
	image?: any;
	hideTooltip?: any;
	showSuggested?: boolean;
	suggestedDropdownOptions?: any;
	handleAdd?: Function;
	displayChips?: boolean;
	suggestedText?: any;
	dynamicClose?: boolean;
	enforcedRelationship?: boolean;
	chipEventTrigger?: boolean;
	paperpropsclassName?: any;
	suggestedDefaultText?:string;
    moduleName?:any;
	insideGridCellEditor?: boolean;
	handleListOpen?: Function;
	handleListClose?: Function;
}

const SUIBaseDropdownSelector = (props: SUIBaseDropdownSelectorProps) => {
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
		sortOrder = 'asc',
		companyImageWidth = "20px",
		companyImageHeight = "20px",
		addCompany = true,
		basecustomline = true,
		image = true,
		hideTooltip = false,
		showSuggested = false,
		suggestedDropdownOptions,
		handleAdd = () => { },
		displayChips = false,
		suggestedText,
		dynamicClose = false,
		enforcedRelationship = false,
		chipEventTrigger = false,
		paperpropsclassName,
		suggestedDefaultText= "All:",
        moduleName = 'userDetails',
		insideGridCellEditor = false,
		handleListOpen= () => { },
		handleListClose= () => { },
	} = props;

	const [selectedOptions, setSelectedOptions] = React.useState<any[]>(value);
	const [filteredData, setFilteredData] = React.useState<any[]>([]);
	const [menuOption, setMenuOption] = React.useState(dropdownOptions);
	const [search, setSearch] = React.useState<string>("");
	const [filters, setFilters] = React.useState({});
	const [openCompanyCard, setOpenCompanyCard] = React.useState<any>(false);
	const [hoverItem, setHoverItem] = React.useState<any>({});
	const [open, setOpen] = React.useState(false);
	const [suggestedTextVal, setSuggestedTextVal] = React.useState<any>(suggestedText);
	const [suggestedDefaultTextVal, setSuggestedDefaultTextVal] = React.useState<any>(suggestedDefaultText);

	const getSortedData = (array: any) => {
		return array.sort((a: any, b: any) => a?.name?.localeCompare(b?.name));
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
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 5.2 + ITEM_PADDING_TOP,
				minHeight: ITEM_HEIGHT * 5.2 + ITEM_PADDING_TOP,
				width: menuWidth
			},
			className: paperpropsclassName
		},
	};
	React.useEffect(() => {
		if (dynamicClose && open) {
			handleClose();
			if (search !== '') {
				setSearch('');
			};
		}
	}, [dynamicClose])
	React.useEffect(() => {
		setSelectedOptions([value?.[0]?.displayField]);
	}, [value]);

	React.useEffect(() => {
		if (
			dropdownOptions &&
			Array.isArray(dropdownOptions) &&
			dropdownOptions.length > 0
		) {
			const sortedOptions: any = [...dropdownOptions].sort((recOne: any, recTwo: any) => {
				const strOneConverted = recOne?.displayField?.toLowerCase();
				const strTwoConverted = recTwo?.displayField?.toLowerCase();
				if (sortOrder === "asc") {
					if (strOneConverted < strTwoConverted) return -1;
					if (strOneConverted > strTwoConverted) return 1;
					return 0;
				} else {
					if (strOneConverted < strTwoConverted) return 1;
					if (strOneConverted > strTwoConverted) return -1;
					return 0;
				}
			});
			setMenuOption(sortedOptions);
		} else {
			setMenuOption(dropdownOptions);
		}
	}, [dropdownOptions]);
	React.useEffect(() => {
		if (showSuggested && suggestedDropdownOptions.length > 0 && suggestedText && moduleName === 'userDetails') {
			let removeDuplicates;
			let dataValues;
			if (menuOption?.length === dropdownOptions?.length) dataValues = menuOption;
			else if (menuOption?.length > 0) dataValues = menuOption;
			else if (dropdownOptions?.length > 0) dataValues = dropdownOptions;
			if (suggestedText.includes('trade')) {
				removeDuplicates = dataValues.filter((item: any) => { return !suggestedDropdownOptions.some((value: any) => value.id === item.id) });
			} else {
				removeDuplicates = dataValues.filter((item: any) => { return !suggestedDropdownOptions.some((value: any) => value.uniqueId === item.uniqueId) });
			};
			if (enforcedRelationship) {
				setMenuOption(suggestedDropdownOptions);
			} else {
				if (removeDuplicates.length > 0) {
					removeDuplicates.forEach((item: any) => {
						if ((item?.isSuggested ?? false)) {
							delete item?.isSuggested
						}
					});
				};
				let combineData = [...suggestedDropdownOptions, ...removeDuplicates];
				setMenuOption(combineData);
			};
		} else if (showSuggested && (suggestedDropdownOptions?.length > 0 ?? []) && suggestedText) {
			let removeDuplicates = menuOption.filter((item: any) => { return !suggestedDropdownOptions.some((value: any) => value.id === item.id) });
			setMenuOption(getSortedData([...suggestedDropdownOptions, ...removeDuplicates]));
		};
	}, [showSuggested, suggestedDropdownOptions, suggestedText])
	const handleChange = (event: SelectChangeEvent<any[]>) => {
		event.stopPropagation();
		const { target: { value }, } = event;
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
			// handleSingleSelect(value);
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
		}
	};

	const handleSearch = (searchValue: string) => {
		setSearch(searchValue);
		if (filteredData && filteredData.length === 0) {
			let searchedData: any[] = dropdownOptions.filter((d: any) => {
				let v = d?.displayField
					.toLowerCase()
					.includes(searchValue.toLowerCase());
				return v;
			});
			if (showSuggested) {
				let searchedSuggestedData: any[] = [...suggestedDropdownOptions].filter((d: any) => {
					let v = d?.displayField
						.toLowerCase()
						.includes(searchValue.toLowerCase());
					return v;
				});
				setMenuOption([...searchedData, ...searchedSuggestedData]);
				if (searchedSuggestedData.length > 0) {
					setSuggestedTextVal(suggestedText)
				}
				else {
					setSuggestedTextVal(null)
				};
			} else {
				setMenuOption([...searchedData]);
			};
		} else {
			let searchedData: any[] = filteredData.filter((d: any) => {
				let v = d?.displayField
					.toLowerCase()
					.includes(searchValue.toLowerCase());
				return v;
			});
			setFilteredData([...searchedData]);
		}
	};
	const filterChange = (filterValues: any) => {
		if (!filterValues) {
			setFilters({});
			if (moduleName == 'bidManager') {
				setMenuOption([...suggestedDropdownOptions, ...dropdownOptions]);
				setSuggestedDefaultTextVal(suggestedDefaultText);
				setSuggestedTextVal(suggestedText);
			}
			props?.onFilterChange({ ...filters, ...filterValues });
		}
		else {
			// props?.onFilterChange({ ...filters, ...filterValues }); 
			const filterData = { ...filters, ...filterValues }
			const filteredData: any = [];
			[...suggestedDropdownOptions, ...dropdownOptions]?.map((companyObj: any) => {
				Object.keys(filterData)?.map((key: any) => {
					if (key == 'scope') {
						if (filterData[key]?.includes('all')) {
							filteredData.push(companyObj);
							setMenuOption([...suggestedDropdownOptions, ...dropdownOptions]);
							setSuggestedDefaultTextVal(suggestedDefaultText);
							setSuggestedTextVal(suggestedText);
						} else {
							if ((filterData[key]?.includes('This Project'))) {
								!companyObj['isOrgCompany'] ? filteredData.push(companyObj) : null
								setSuggestedTextVal(null);
							} else {
								setSuggestedTextVal(suggestedText);
							};
							if ((filterData[key]?.includes('Organizational'))) {
								companyObj['isOrgCompany'] ? filteredData.push(companyObj) : null
								setSuggestedDefaultTextVal(null);
								setSuggestedTextVal(suggestedText);
							} else {
								setSuggestedDefaultTextVal(suggestedDefaultText);
							};
							if ((filterData[key]?.includes('Organizational' && 'This Project'))) {
								setSuggestedDefaultTextVal(suggestedDefaultText);
							}
						}
					}
					else if (key == 'diverseSupplier') {
						companyObj?.diverseCategories?.map((obj: any) => {
							console.log("name", obj)
							filterData['diverseSupplier']?.includes(obj?.name) ? filteredData.push(companyObj) : null
						})
					}
					else {
						if (filterData[key]?.includes(companyObj[key])) {
							filteredData.push(companyObj)
							console.log("fffff", filterData[key], companyObj[key], filteredData)
						}
					}
				})
			})
			console.log("filterData", filterData, filteredData);
			if (filterData?.scope?.length || filterData?.diverseSupplier?.length || filterData?.complianceStatus?.length) setMenuOption(getSortedData(filteredData));
			else if (showSuggested) {
				setMenuOption(getSortedData([...suggestedDropdownOptions, ...dropdownOptions]));
			}
			else setMenuOption(dropdownOptions);

			setFilters((prevFilters) => {
				return { ...prevFilters, ...filterValues };
			})
		};
	}
	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
		setOpenCompanyCard(event.currentTarget);
		setHoverItem(item)
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
				disabled={
					props?.disableOptionsList &&
						props?.disableOptionsList?.includes(item?.id)
						? true
						: false
				}
				className="base-dropdown-custom-menu-item"
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
					{basecustomline && <div className={multiSelect ? "base-custom-line" : "base-custom-line2"} style={{ backgroundColor: `#${item.color}` }}></div>}
					{/* {!!item.thumbnailUrl && image && ( previous line */}
					{image && (						
						<CompnayCardTooltip
							enterDelay={700}
							{...props}
							title={<SUICompanyCard companyDetails={item} />}
							disableHoverListener={hideTooltip}
						>
							{item?.thumbnailUrl ? <img
								src={item?.thumbnailUrl}
								alt="Avatar"
								style={{ width: "24px", height: "24px", padding: "1px" }}
								className="base-custom-img"
							/> : <Avatar sx={{ backgroundColor: `#${item.color}`, width: "24px", height: "24px", padding: "1px", marginRight: '10px', fontSize: '13px' }}>{item?.displayField?.[0]?.toUpperCase()}</Avatar> }
						</CompnayCardTooltip>
					)}
					<ListItemText
						primary={item?.displayField}
						className={
							!outSideOfGrid
								? "base-custome-styles"
								: "base-custom-outsidegrid"
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
			};
		}
	};
	const handleSuggestedItemsChange = (event: any) => {
		event.stopPropagation();
		const { target: { textContent }, } = event;
		let duplicateRemoved: any[] = [];
		duplicateRemoved.push(textContent);

		setSelectedOptions(duplicateRemoved);
		const selectedOption = [...menuOption].find((obj: any) => {
			return obj.displayField === textContent;
		});
		if (selectedOption) {
			handleSingleSelect(selectedOption);
			handleClose();
		}
	};
	const SuggestedMenuItems = (item: any, idx: any) => {
		return (
			<MenuItem
				key={item + idx}
				value={item.displayField}
				className="base-dropdown-custom-menu-item"
				style={{ background: selectedOptions.includes(item.displayField) ? '#fffad2' : 'transparent' }}
				onClick={(e: any) => handleSuggestedItemsChange(e)}
			>
				<>
					{basecustomline && <div className={multiSelect ? "base-custom-line" : "base-custom-line2"} style={{ backgroundColor: `#${item.color}` }}></div>}
					{image && (
						<CompnayCardTooltip
							enterDelay={700}
							{...props}
							title={<SUICompanyCard companyDetails={item} />}
							disableHoverListener={hideTooltip}
						>
							{!!item?.thumbnailUrl ? <img
								src={item?.thumbnailUrl}
								alt="Avatar"
								style={{ width: "24px", height: "24px", padding: "1px" }}
								className="base-custom-img"
							/> : <Avatar sx={{ backgroundColor: `#${item.color}`, width: "24px", height: "24px", padding: "1px", marginRight: '10px', fontSize: '13px' }}>{item?.displayField?.[0]?.toUpperCase()}</Avatar> }
						</CompnayCardTooltip>
					)}
					<ListItemText
						primary={item?.displayField}
						className={
							!outSideOfGrid
								? "base-custome-styles"
								: "base-custom-outsidegrid"
						}
					/>
				</>
			</MenuItem>
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
						className={(outSideOfGrid ? "base-custom-outsidegrid" : "base-custome-styles") + (insideGridCellEditor ? ' inside-grid-cell-cls': '')}
						labelId="demo-multiple-checkbox-label"
						id="demo-multiple-checkbox"
						multiple={multiSelect}
						variant="standard"
						displayEmpty={false}
						value={selectedOptions}
						onChange={handleChange}
						open={open}
						onClose={handleClose}
						onOpen={handleOpen}
						renderValue={(selected: any) => {
							if (selected?.length === 0 && selectedOptions?.length === 0) {
								return <div>{placeHolder}</div>;
							} else if (selectedOptions && selectedOptions?.length > 0) {
								return (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										{[...menuOption].filter((x: any) => selected.includes(x?.displayField)).map((x: any, index: any) => (
											<>
												{displayChips ?
													<Chip
														key={x.displayField + index}
														className="smart-dropdown-chip-cls"
														onDelete={(e: any) => handleChipDelete(e, x?.displayField)}
														label={x?.isPrimary ? `${x.displayField} *` : x.displayField}
														deleteIcon={
															<span
																className="smart-dropdown-chip-close-cls"
																onMouseDown={(event) => event.stopPropagation()}
															>
																+
															</span>
														}
													/>
													:
													<div key={x.displayField + index} className="dropdown-without-chip-cls">
														{/*x?.thumbnailUrl && <img src={x?.thumbnailUrl} key={x.displayField + index} alt="Avatar" style={{ width: companyImageWidth, height: companyImageHeight, verticalAlign: 'middle', padding: '1px' }} className="base-custom-img" />*/}
														{x.displayField}
													</div>
												}
											</>

										))}
									</Box>
								);
							};
							return selected?.map((x: any) => x?.displayField).join(", ");
						}}
						MenuProps={MenuProps}
						IconComponent={undefined}
						style={{ width: width }}
						startAdornment={
							icon ? <InputAdornment position="start">{icon}</InputAdornment> : value?.thumbnailUrl ? <InputAdornment position="start"><img
								src={value?.thumbnailUrl}
								alt="Avatar"
								style={{ width: '28px', height: '28px' }}
								className="base-custom-img"
							/></InputAdornment> : null
						}
						endAdornment={
							<>
								{showFilter && (
									<InputAdornment position="end">
										<Button
											// onClick={handleClickFilter}
											sx={{
												border: `solid 1px ${filteredData.length > 0
													? "#0590cd"
													: "rgba(0,0,0,0.6)"
													} !important`,
												borderRadius: 50,
												color: `${filteredData.length > 0
													? "#0590cd"
													: "rgba(0,0,0,0.6)"
													} !important`,
												// marginRight: "10px",
												padding: "1px",
												height: "24px",
												minWidth: "24px",
											}}
										>
											<div
												className={`common-icon-Filter ${filteredData.length == 0
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
									'& .MuiSelect-select .notranslate::after': placeHolder
										? {
											content: `"${placeHolder}"`,
										}
										: {},
								}
								: {
									".MuiSelect-icon": {
										// display: "none",
									},
									'& .MuiSelect-select .notranslate::after': placeHolder
										? {
											content: `"${placeHolder}"`,
										}
										: {},
								}
						}
					>
						<ListSubheader sx={{ padding: '0px' }}>
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
														options={props?.filterOptions}
														defaultValue={filters}
														allowSubMenu={true}
														onChange={filterChange}
														menuProps={{
															open: true,
															header: 'Filter By',
															placement: 'bottom-end',
														}}
														buttonProps={{
															'aria-label': 'Filter menu',
															className: 'filter-menu',
															disableRipple: true,
															sx: {
																border: `solid 1px ${filteredData.length > 0
																	? "#0590cd"
																	: "rgba(0,0,0,0.6)"
																	} !important`,
																borderRadius: 50,
																color: `${filteredData.length > 0
																	? "#0590cd"
																	: "rgba(0,0,0,0.6)"
																	} !important`,
																marginRight: "10px",
																padding: "1px",
																height: "24px",
																minWidth: "24px",
															},
															startIcon: filteredData?.length ? <span className='budget-Filter-blue' /> : <span className='common-icon-Filter' />
														}}
													/>
												)}

												{showSearchInSearchbar && (
													<SearchIcon className="search-btn" />
												)}
												{addCompany &&
													<IconButton aria-label="Add" disabled={menuOption.length > 0 ? true : false} onClick={() => handleAddIconClick()}
														sx={{
															'.Mui-disabled': {
																pointerEvents: 'none',
																color: '#EEEEEE',
															}
														}}
													>
														{/* <AddCircleOutlineIcon className="add-btn" /> */}
														<span className='common-icon-add'></span>
														{/*<Box component='img' src={menuOption.length > 0 ? PlusRoundDisable : plusround} className='image' width={24} height={24} />*/}
													</IconButton>
												}
											</InputAdornment>
										),
									}}
								></TextField>
							</Box>
						</ListSubheader>
						{/* <Box className="base-menu-wrapper">                 */}
						{(showSuggested && suggestedDropdownOptions.length > 0 && menuOption && menuOption.length > 0 && filteredData.length == 0) && (
							<div>
								{(showSuggested && suggestedDropdownOptions.length > 0 && moduleName !== 'userDetails' && (suggestedTextVal ?? false)) && (
									<InputLabel className="comp-drop-header"
										style={{
											padding: '8px 16px',
											background: '#fff',
											font: "bold 14px/15px 'roboto-regular'",
											color: "#333"
										}}
									>
										{suggestedTextVal}
									</InputLabel>
								)}
								{(showSuggested && suggestedDropdownOptions.length > 0 && moduleName === 'userDetails') && (
									<InputLabel className="comp-drop-header"
										style={{
											padding: '8px 16px',
											background: '#fff',
											font: "bold 14px/15px 'roboto-regular'",
											color: "#333"
										}}
									>
										{suggestedTextVal}
									</InputLabel>
								)}
								{menuOption.filter((item: any, idx: number) => item.isSuggested).map((item: any, idx: number) =>
									SuggestedMenuItems(item, idx))}
								{(showSuggested && suggestedDropdownOptions.length > 0 && moduleName === 'userDetails') && menuOption.some((item: any) => !item.isSuggested) && (
									<InputLabel className="comp-drop-header"
										style={{
											padding: '8px 16px',
											background: '#fff',
											font: "bold 14px/15px 'roboto-regular'",
											color: "#333"
										}}
									>
										{suggestedDefaultText}
									</InputLabel>
								)}
							</div>
						)}
						{((menuOption.length > 0 ?? false) && moduleName !== 'userDetails' && (suggestedDefaultTextVal ?? false)) && (
							<InputLabel className="comp-drop-header"
								style={{
									padding: '8px 16px',
									background: '#fff',
									font: "bold 14px/15px 'roboto-regular'",
									color: "#333"
								}}
							>
								{suggestedDefaultText}
							</InputLabel>
						)}
						{menuOption && menuOption.length > 0 && filteredData.length == 0 ? (
							menuOption.filter((item: any, idx: any) => !item.isSuggested).map((item: any, idx: number) => {
								return dropdownMenuItems(item, idx);
							})
						) :
							filteredData && filteredData.length > 0 ? (
								filteredData.map((item: any, idx: number) => {
									return dropdownMenuItems(item, idx);
								})
							) : (
								<div className="base-no-data">{noDataFoundMsg}</div>
							)}
					</Select>
				</span>
				{/* </CustomTooltip> */}
			</FormControl>
		</div>
	);
};

export default SUIBaseDropdownSelector;
