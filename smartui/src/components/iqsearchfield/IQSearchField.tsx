import './IQSearchField.scss';

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import FilterIcon from 'resources/images/common/FilterIcon.svg';
import FilterIconBlue from 'resources/images/common/FilterIconBlue.svg';
import GroupIcon from 'resources/images/common/GroupIcon.svg';
import GroupIconBlue from 'resources/images/common/GroupIconBlue.svg';

import { Clear, Search } from '@mui/icons-material';
import { Divider, Box, IconButton, InputAdornment, InputBase, ListSubheader, MenuItem, Popover, Stack, SxProps, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import IconMenu from './iqiconbuttonmenu/IQIconButtonMenu';
import DynamicTooltip from 'sui-components/DynamicTooltip/DynamicTooltip';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
export interface IQSearchFieldProps {
	sx?: SxProps;
	value?: unknown;
	groupHeader?: string | React.ReactNode;
	filterHeader?: string | React.ReactNode;
	groups?: Array<any>;
	filters?: Array<any>;
	onGroupChange?: any;
	onFilterChange?: any;
	onSearchChange?: any;
	onSettingsChange?: (value: any) => void;
	placeholder?: string;
	showGroups?: boolean;
	searchText?: string | undefined;
	showFilter?: boolean;
	onFilterMenuClose?: Function;
	defaultFilters?: any;
	defaultGroups?: any;
	defaultSearchText?: any;
	headerStatusFilters?: any;
	filterAllowSubMenu?: boolean;
	isShowDropdown?: boolean;
	dropDownListExtraColumns?: Array<any>;
	dropdownValues?: any;
	isSearchPlaceHolder?: string;
	showExtraColumns?: boolean;
	onSelectionChange?: any;
};

const IQSearchField = (props: IQSearchFieldProps) => {
	const { showGroups = true, showFilter = true, onFilterMenuClose = () => { }, defaultFilters, defaultSearchText = "", defaultGroups = "", headerStatusFilters,
		isShowDropdown = false, dropDownListExtraColumns = [], dropdownValues, filterAllowSubMenu = true, isSearchPlaceHolder = 'Search', onSelectionChange = () => { }, showExtraColumns = true, ...rest
	} = props;
	const [filters, setFilters] = useState<any>({});
	const [group, setGroup] = useState({ name: '' });
	const [search, setSearch] = useState({ text: (props.searchText || '') });
	const [placeholder, setPlaceholder] = useState(props.placeholder || 'Search');
	const [grouped, setGrouped] = useState(false);
	const [filtered, setFiltered] = useState(false);
	const [isNone, setIsNone] = useState(false);

	/* These below states are used for to store dropdown values */
	const [isTextFieldOpen, setTextFieldOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedOption, setSelectedOption] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [menuItems, setMenuItems] = React.useState<any>([]);
	/* End */
	useEffect(() => { props.placeholder && setPlaceholder(props.placeholder); }, [props.placeholder]);
	React.useEffect(() => {
		if (dropdownValues) {
			setMenuItems(dropdownValues);
		};
	}, [dropdownValues]);
	React.useEffect(() => {
		if (defaultSearchText !== "") {
			setSearch({ text: defaultSearchText });
		};
	}, []);
	React.useEffect(() => {
		if (defaultGroups !== "") {
			setGroup({ name: defaultGroups });
		};
	}, [defaultGroups]);
	const updateFilters = (filterEl: any, text: any) => {
		if (text === 'None') {
			setIsNone(true);
			setFilters({});
		};
		if (!filterEl) { setFilters({}) }
		else {
			if (filterAllowSubMenu == true) {
				setFilters((prevFilters: any) => {
					if (headerStatusFilters?.names?.length === 0 && prevFilters?.safetyStatus?.length > 0) {
						return filterEl;
					} else {
						return { ...prevFilters, ...filterEl };
					};
				});
			}
			else {
				setFilters(filterEl)
			}
		}
	};

	useEffect(() => {

		if (props.searchText != '' && props.searchText != undefined) {
			setSearch({ text: (props.searchText || '') });
		}
	}, [props.searchText]);

	useEffect(() => {
		const isFiltered = !_.isEmpty(_.findKey(filters, function (value: []) { return value.length > 0; }));
		setFiltered(isFiltered);
		if (isNone) {
			props.onFilterChange && props.onFilterChange(filters, isNone);
			setIsNone(false);
		} else {
			props.onFilterChange && props.onFilterChange(filters);
		};
	}, [filters]);

	useEffect(() => {
		if ((defaultFilters ?? false) && Object.keys(defaultFilters).length === 0) setFiltered(false);
	}, [defaultFilters]);

	const updateGroup = (groupName: string) => {
		setGroup({ name: groupName });
	};

	useEffect(() => {
		const isGrouped = !_.isEmpty(group.name);
		setGrouped(isGrouped);
		props.onGroupChange && props.onGroupChange(group.name);
	}, [group]);

	const updateSearch = (e: any) => {
		const searchString = e.currentTarget?.value;
		setSearch({ text: searchString });
	};

	useEffect(() => {
		props.onSearchChange && props.onSearchChange(search.text);
	}, [search]);

	useEffect(() => {
		const text = (grouped || filtered) ? `${grouped ? 'Grouping ' : ''}${(grouped && filtered) ? '& ' : ''}${filtered ? 'Filter ' : ''}Applied` : (props.placeholder || 'Search');
		setPlaceholder(text);
	}, [grouped, filtered]);

	const handleSearchClear = () => {
		setSearch({ text: '' });
	};
	const handleOpenTextField = (event: any) => {
		setTextFieldOpen(true);
		setAnchorEl(event.currentTarget);
	};
	const handleCloseTextField = () => {
		setTextFieldOpen(false);
		setAnchorEl(null);
	};
	const getDynamicColRenderVal = (colRec: any, currentOption: any, index: number) => {
		let colHtml: any = "";
		switch (colRec.name) {
			case "label":
				if (currentOption[colRec.dataKey].length >= 50) {
					colHtml = (
						<DynamicTooltip
							PopperProps={{
								disablePortal: true,
								popperOptions: {
									modifiers: [
										{
											name: 'flip',
											enabled: false
										}
									]
								}
							}}
							placement="bottom"
							title={currentOption[colRec.dataKey]?.toLocaleString("en-US")}
						>
							<span style={{ fontSize: '14px', color: '#059cdf' }}>
								{currentOption[colRec.dataKey]?.toLocaleString("en-US")}
							</span>
						</DynamicTooltip>
					);
				} else {
					colHtml = (
						<span style={{ fontSize: '14px', color: '#059cdf' }}>
							{currentOption[colRec.dataKey]?.toLocaleString("en-US")}
						</span>
					);
				}
				break;
			case "status":
				colHtml = (
					<>
						{colRec?.showTooltip ?
							<DynamicTooltip
								placement="bottom-end"
								title={currentOption[colRec.tooltipDataKey]}
							>
								<span className={"status-col " + currentOption[colRec.dataKey]} />
							</DynamicTooltip>
							: <span className={"status-col " + currentOption[colRec.dataKey]} />
						}
					</>
				)
				break;
			default:
				colHtml = null;
		}
		return colHtml;
	};
	const handleSearch = (e: any) => {
		let keyword = e?.target?.value;
		setSearchValue(keyword);
		if (keyword !== '') {
			keyword = keyword?.toLowerCase();
			const firstResult = [...dropdownValues].filter((obj: any) => {
				return JSON.stringify(obj).toLowerCase().includes(keyword);
			});
			setMenuItems(firstResult);
		} else {
			setMenuItems([...dropdownValues]);
		}
	};
	const handleSelectSearchClear = () => {
		setSearchValue('');
		setMenuItems([...dropdownValues]);
	};
	const handleOptionChange = (e: any) => {
		const { target: { innerText } } = e;
		onSelectionChange(innerText);
		// const name: any = typeof innerText === 'string' ? innerText.split(',') : innerText;
		if (innerText === selectedOption) {
			setSelectedOption('');
			handleCloseTextField();
		} else {
			const name: any = innerText;
			setSelectedOption(name);
			handleCloseTextField();
		}
	};
	return (
		<>
			{isShowDropdown && (
				<Popover
					anchorEl={anchorEl}
					open={isTextFieldOpen}
					onClose={handleCloseTextField}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					PaperProps={{
						style: {
							minWidth: "30em",
							height: "20em",
							margin: '0.5em 0em 0em 2em'
						},
					}}
				>
					<div>
						<ListSubheader sx={{ padding: '0px' }}>
							<Box className="search-wrapper skill-search">
								<TextField
									variant={'outlined'}
									autoFocus
									value={searchValue}
									onChange={handleSearch}
									size="small"
									fullWidth
									tabIndex={1}
									className={"smart-dropdown-search-box search-field "}
									onKeyDown={(e) => {
										if (e.key !== "Escape") {
											// Prevents autoselecting item while typing (default Select behaviour)
											e.stopPropagation();
										}
									}}
									placeholder={isSearchPlaceHolder}
									InputProps={{
										endAdornment: (
											<InputAdornment position="start">
												{searchValue == "" ? (
													<SearchIcon />
												) : (
													<ClearIcon
														onClick={handleSelectSearchClear}
														style={{ cursor: "pointer" }}
													/>
												)}
											</InputAdornment>
										),
									}}
								/>
							</Box>
						</ListSubheader>

						{/* TODO: Render column header names from dropDownListExtraColumns */}
						{dropDownListExtraColumns && dropDownListExtraColumns.length > 0 ? (
							<Box className="column-header-extra-cells-cls">
								{dropDownListExtraColumns.map((item: any) => {
									return <div className="column-header-inner-cls" style={{ width: item.width, marginRight: '0px' }}>{item.headerName}</div>
								})}
							</Box>
						) : null}

						{menuItems.map((option: any, index: any) => (
							<MenuItem
								key={"index " + index}
								sx={{
									fontWeight: "100 !important",
									fontSize: "16px",
									" &.Mui-selected": {
										backgroundColor: selectedOption != "" ? "#fff9cc !important" : "#fff !important",
									},
								}}
								selected={selectedOption === option.value}
								value={option.value}
								onClick={(e: any) => handleOptionChange(e)}
							>
								<div className={showExtraColumns ? "sd-label-extra-column-cell-cls" : "sd-label-cell-cls"}
									style={{ width: '75%' }}
								>
									{option.label}
								</div>
								<div className="drop-down-list-extra-cols" style={{ width: '25%' }}>
									{dropDownListExtraColumns.map((colRec: any) => (
										<span className={"drop-down-list-extra-cols_cell"}>
											{getDynamicColRenderVal(colRec, option, index)}
										</span>
									))}
								</div>
							</MenuItem>
						))}
					</div>
				</Popover>
			)}
			<Stack className='iqsearch-field' direction={'row'} sx={props.sx}>
				{!showGroups ? <></>
					: <IconMenu
						showNone={true}
						options={props.groups}
						defaultValue={group.name ? { [group.name]: true } : {}}
						defaultGroups={defaultGroups}
						onChange={updateGroup}
						menuProps={{
							open: true,
							header: (props.groupHeader || 'Group By'),
							placement: 'bottom-start'
						}}
						buttonProps={{
							'aria-label': 'Group menu',
							className: 'group-menu',
							disableRipple: true,
							startIcon: <Box component='img' alt='Group by' className='group-menu-icon' src={grouped ? GroupIconBlue : GroupIcon} />
						}}
					/>}
				<InputBase
					placeholder={placeholder}
					value={search?.text}
					onChange={updateSearch}
					inputProps={{ 'aria-label': 'Search' }}
				/>
				{
					search.text !== '' ? <IconButton
						className='search-trigger'
						aria-label='Clear search result'
						onClick={handleSearchClear}
						disableRipple>
						<Clear />
					</IconButton> :
						<IconButton
							className='search-trigger'
							aria-label='Search'
							disableRipple>
							<Search />
						</IconButton>
				}
				{isShowDropdown && (
					<IconButton
						className='select-icon-trigger'
						aria-label='Select'
						disableRipple>
						<span
							style={{ color: selectedOption !== '' ? 'red !important' : 'rgb(108, 108, 108)' }}
							// className={selectedOption !== '' ? 'common-icon-down-arrow-primary' : 'common-icon-down-arrow1'}
							className={'common-icon-down-arrow1'}
							onClick={handleOpenTextField}
						/>
					</IconButton>
				)}
				{!showFilter ? <></> :
					<IconMenu
						showNone={true}
						options={props.filters}
						defaultValue={filters}
						allowSubMenu={filterAllowSubMenu}
						onChange={updateFilters}
						onClose={onFilterMenuClose}
						defaultFilters={defaultFilters}
						headerStatusFilters={headerStatusFilters}
						menuProps={{
							open: true,
							header: props.filterHeader ? props.filterHeader : 'Filter By',
							placement: 'bottom-end',
						}}
						buttonProps={{
							'aria-label': 'Filter menu',
							className: 'filter-menu',
							disableRipple: true,
							startIcon: <Box component='img' alt='Filter By' className='filter-menu-icon' src={filtered ? FilterIconBlue : FilterIcon} />
						}}
					/>
				}
			</Stack>
		</>
	);
};

export default IQSearchField;