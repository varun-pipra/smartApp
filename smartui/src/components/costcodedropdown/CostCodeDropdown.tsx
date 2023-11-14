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
import './CostCodeDropdown.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';
export interface OptionListProps {
	id: number;
	name: string;
}

export interface OptionProps {
	id: number;
	name: string;
	options: OptionListProps[];
}

export interface CostCodeDropdownProps {
	label: string;
	options: OptionProps[];
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

export default function CostCodeDropdown({ label, options, onChange, required, startIcon, selectedValue, checkedColor, showFilter = false, sx, isFullWidth = true, tooltipShow = true, variant = "standard", Placeholder, displayEmpty = false, outSideOfGrid = true, filteringValue, showFilterInSearch = false }: CostCodeDropdownProps) {
	const classes = useStyles();
	const [items, setItems] = useState<OptionProps[]>([...options]);
	const [value, setValue] = useState<any>(selectedValue);
	const [tooltip, setTooltip] = useState('');
	const [ellipsis, setEllipsis] = useState<any>();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement | null>(null);
	const [filterPopupEl, setFilterPopupEl] = React.useState<HTMLButtonElement | null>(null);
	const showFilterPopup = Boolean(filterPopupEl);
	const [filtered, setFiltered] = useState<number[]>([]);
	React.useEffect(() => {
		setValue(selectedValue)
		const str = selectedValue.split("|");
		setTooltip(str[1]);
		const div = document.querySelector('.css-1rxz5jq-MuiSelect-select-MuiInputBase-input-MuiInput-input.MuiSelect-select')
		setEllipsis(isEllipsisActive(div));
	}, [selectedValue])

	React.useEffect(() => {
		//on load fitering the selectbox options
		const filteredArray = filteringValue ? items.filter(item => item.name.includes(filteringValue)) : [];
		if (filteredArray && filteredArray.length > 0) {
			setFiltered([filteredArray[0]['id']]);
		}
	}, [filteringValue])

	const handleChange = (event: any) => {
		const str = event.target.value.split("|");
		setTooltip(str[1])
		setValue(event.target.value);

		if (onChange) onChange(event.target.value);
	};

	const handleSearch = (searchValue: string) => {
		setSearch(searchValue);

		if (searchValue !== '') {
			const firstResult = options.filter((obj: any) => {
				const data = JSON.stringify(obj).toLowerCase().includes(searchValue.toLowerCase());
				return data;
			});
			if (firstResult && firstResult.length > 0) {
				const secondResult = firstResult.map((obj2: any) => {
					const dataresult = obj2.options.filter((data: any) => {
						return JSON.stringify(data).toLowerCase().includes(searchValue.toLowerCase());
					})
					return { ...obj2, options: dataresult };
				})
				if (secondResult && secondResult.length > 0) {
					const finalResult = secondResult.filter((data) => {
						return data.options && data.options.length > 0 ? true : false;
					})
					//console.log('finalResult', finalResult)
					finalResult.length > 0 ? setItems(secondResult) : setItems(firstResult);
				}
			}
			else {
				setItems(firstResult);
			}
		} else {
			setItems(options);
		}

		// const firstResult = options.filter((obj: any) => {
		// 	const data = JSON.stringify(obj).toLowerCase().includes(searchValue.toLowerCase());
		// 	return data;
		// });
		// console.log('firstResult', firstResult)
		// setItems(firstResult);
	};

	const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
		setFilterPopupEl(event.currentTarget);
	};

	const handleFilterPopupClose = () => {
		setFilterPopupEl(null);
	};

	const handleFilterChange = (value: number) => {
		if (filtered.includes(value)) {
			let index: number = filtered.indexOf(value);
			filtered.splice(index, 1);
		}
		else {
			filtered.push(value);
		}
		setFiltered([...filtered]);
	}

	useEffect(() => {
		setItems([...options]);
	}, [options]);

	const isEllipsisActive = (e: any) => {
		if (e) return (e.clientWidth < e.scrollWidth);
	}


	const onOpenChange = (e: any) => {
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
		setItems(options);
	}
	return (
		<>
			<Box className='cost-code-field-box'>
				<Box>
					<InputLabel className={outSideOfGrid ? "inputlabel" : "inputlabel1"}
					>{label}{(label && required) && <span className="required_color">*</span>}
					</InputLabel>
					<IQTooltip title={ellipsis && tooltipShow ? tooltip : ''} arrow={true} >
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
							onChange={handleChange}
							onFocus={() => {
								if (searchRef?.current) {
									setTimeout(() => {
										searchRef.current?.focus();
									}, 400);
								}
							}}
							// renderValue={value => value?.length ? Array.isArray(value) ? value.join(', ') : value : Placeholder}
							startAdornment={
								<InputAdornment position="start">{startIcon}</InputAdornment>
							}
							endAdornment={
								<>
									{showFilter && <InputAdornment position="end">
										<Button
											onClick={handleClickFilter}
											sx={{
												border: `solid 1px ${filtered.length > 0 ? "#0590cd" : "rgba(0,0,0,0.6)"} !important`,
												borderRadius: 50,
												color: `${filtered.length > 0 ? "#0590cd" : "rgba(0,0,0,0.6)"} !important`,
												// marginRight: "30px",
												padding: "1px",
												height: "24px",
												width: "24px",
												minWidth: "24px",
											}}
										>
											<div className={`common-icon-Filter ${filtered.length == 0 ? 'common-icon-Filter' : 'common-icon-Filter-blue'}`}></div>
											{/* <div className="budget-Filter"></div> */}

										</Button>
									</InputAdornment>}
								</>
							}
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
							}}
							displayEmpty={displayEmpty}
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
												{showFilterInSearch && <Button
													onClick={handleClickFilter}
													sx={{
														border: `solid 1px ${filtered.length > 0 ? "#0590cd" : "rgba(0,0,0,0.6)"} !important`,
														borderRadius: 50,
														color: `${filtered.length > 0 ? "#0590cd" : "rgba(0,0,0,0.6)"} !important`,
														// marginRight: "30px",
														padding: "1px",
														height: "24px",
														width: "24px",
														minWidth: "24px",
														marginRight: "10px",
													}}
												>
													<div className={`common-icon-Filter ${filtered.length == 0 ? 'common-icon-Filter' : 'common-icon-Filter-blue'}`}></div>

												</Button>
												}
												{search == '' ? <SearchIcon /> : <ClearIcon onClick={handleSearchClear} style={{ cursor: 'pointer' }} />}
											</InputAdornment>
										),
									}}
								></TextField>
							</Box>
							{/* {Placeholder && <MenuItem disabled value="">{Placeholder}</MenuItem>} */}
							{items.length > 0 ?
								items?.map((item: OptionProps, index: number) => {
									if (filtered.length === 0 || filtered.includes(item.id)) {
										return [

											<ListSubheader
												sx={{
													fontWeight: "bold",
													lineHeight: 1.8,
													marginTop: "5px",
												}}
											>
												{item.name}
											</ListSubheader>,

											item.options.map((option: OptionListProps, i: number) => (

												<MenuItem
													key={index + "-" + i}
													value={item.name + "|" + option.name}
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
													{option.name}
												</MenuItem>
											))
										];
									}
								})
								: <MenuItem>No records found</MenuItem>
							}

						</Select>
					</IQTooltip>
					<Popover
						open={showFilterPopup}
						anchorEl={filterPopupEl}
						onClose={handleFilterPopupClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
					>
						<Box padding={1}>
							<ListSubheader
								sx={{
									fontWeight: "600",
									lineHeight: 1.8,
									paddingLeft: '6px'
								}}
							>
								Filter By
							</ListSubheader>
							<MenuItem
								sx={{ marginTop: 1, marginBottom: 1, paddingLeft: '6px' }}
								onClick={() => setFiltered([])}
							>
								<em>Clear</em>
							</MenuItem>
							{options.map((option: OptionProps, index: number) => (
								<MenuItem key={index}>
									<FormControlLabel
										control={<Checkbox
											checked={filtered.includes(option.id)}
											onChange={() => handleFilterChange(option.id)}
											sx={{
												[`&.${checkboxClasses.checked}`]: {
													color: checkedColor ? checkedColor : 'gray',
												},
												padding: 0, marginRight: 1
											}}
										/>}
										label={option.name}
									/>
								</MenuItem>
							))}
						</Box>
					</Popover>
				</Box>
			</Box>
		</>
	);
}
