import React from 'react';
import './WBS.scss';
import { Select, MenuItem, IconButton, InputAdornment, Box, TextField, SelectChangeEvent } from "@mui/material";
import { Close } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';

export interface WBS {
	name?: any;
	required?: boolean;
	disabled?: boolean;
	isSearchField?: boolean;
	hideNoRecordMenuItem?: boolean;
	handleChange?: (selected: string | Array<string> | undefined) => void;
	options?: any;
	selectedValue?: any;
	dropDownLabel?: string;
	Icon?: React.ElementType;
	isMultiple?: boolean;
	LeftIcon?: React.ReactElement;
	RightIcon?: React.ReactElement;
	isFullWidth?: boolean;
	iconColor?: string;
	showSearchRightIcon?: boolean;
	iconClickHandler?: () => void;
	useNestedOptions?: boolean;
	sx?: any;
	menuProps?: any;
	variant?: any;
	optionImage?: boolean;
	displayEmpty?: boolean;
	Placeholder?: any;
	outSideOfGrid?: boolean;
	showColumnHeader?: boolean;
	columnName?: string;
	showFilterIcon?: boolean;
	reduceMenuHeight?: boolean;
	sortOrder?: string;
	dropDownListExtraColumns?: Array<any>;
	ignoreSorting?: boolean;
	showCheckboxes?: boolean;
	isSearchPlaceHolder?: string;
	isCustomSearchField?: boolean;
	handleAddCategory?: any;
	isReadOnly?: boolean;
	endAdornment_Handler?: any;
	SelectInputProps?: any
	insideGridCellEditor?: boolean;
	noDataFoundMsg?: any;
	showAddButton?: boolean;
	dynamicClose?: boolean;
	handleListOpen?: Function;
	handleListClose?: Function;
	showDropDownHeaderTitle?: boolean;
	dropDownHeaderTitle?: string;
	showHeaderCloseIcon?: boolean;
	showExtraColumns?: boolean;
	isDropDownPosition?: boolean;
	showDescription?: boolean;
}

const WBSComponent = (props: WBS) => {
	const { showDropDownHeaderTitle = true, dropDownHeaderTitle, showHeaderCloseIcon, selectedValue, isSearchField, isCustomSearchField = false,
		isSearchPlaceHolder = 'Search', showAddButton, isFullWidth, isDropDownPosition, handleChange, menuProps, LeftIcon, Placeholder = 'Select', sx,

	} = props;
	const searchRef = React.useRef<HTMLInputElement | null>(null);
	const selectRef = React.useRef<HTMLInputElement | null>(null);

	const [searchValue, setSearchValue] = React.useState<any>('');
	const [selectedOption, setSelectedOption] = React.useState<any>(selectedValue);
	const handleClose = () => {

	}
	const handleSearch = () => {

	}
	const _handleChange = (e: SelectChangeEvent) => {
		const { target: { value } } = e;
		const name: any = typeof value === 'string' ? value.split(',') : value;
		setSelectedOption(name);
		if (handleChange) handleChange(name);
	}

	return (
		<div className='WBSComponent'>
			<Select
				name={props.name}
				disabled={props.disabled}
				ref={selectRef}
				className={'selectdropdown'}
				labelId="demo-simple-select-standard-label"
				id="demo-simple-select-standard"
				variant={'standard'}
				fullWidth={isFullWidth}
				value={''}
				onClose={handleClose}
				onChange={_handleChange}
				// label={dropDownLabel}
				MenuProps={{
					classes: { paper: menuProps },
					autoFocus: false,
					anchorOrigin: {
						vertical: "bottom",
						horizontal: "left"
					},
					transformOrigin: {
						vertical: "top",
						horizontal: "left"
					},
				}}
				startAdornment={
					LeftIcon && (
						<InputAdornment position="start">{LeftIcon}</InputAdornment>
					)
				}

				onFocus={() => {
					if (searchRef?.current) {
						setTimeout(() => {
							searchRef.current?.focus();
						}, 100);
					}
				}}
				sx={{
					...sx,
					"& .MuiSelect-select": {
						color: "#333333 !important",
						fontFamily: "Roboto-Regular !important",
					},
					"& .MuiSelect-select .notranslate::after": Placeholder
						? {
							content: `"${Placeholder}"`,
						}
						: {},
				}}


			>
				{showDropDownHeaderTitle && (
					<Box className="wbs-dropdown-header-title-cls">
						<div>{dropDownHeaderTitle}</div>
						{showHeaderCloseIcon && (
							<IconButton
								className='close-btn'
								aria-label='Close Right Pane'
								onClick={handleClose}
							>
								<Close />
							</IconButton>
						)}
					</Box>
				)}
				{isSearchField && (
					<Box className="wbs-search-wrapper skill-search">
						<TextField
							variant={isCustomSearchField ? 'standard' : 'outlined'}
							inputRef={searchRef}
							autoFocus
							value={searchValue}
							onChange={handleSearch}
							size="small"
							fullWidth
							tabIndex={1}
							className={"smart-dropdown-search-box search-field " + (showAddButton ? ' search-field-border-bottom' : '')}
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

										{searchValue == "" && !isCustomSearchField && (
											<SearchIcon />
										)}

									</InputAdornment>
								),
							}}
						/>
					</Box>
				)}

				<Box className="column-header-cls">
					<div className="column-header-inner-cls">{'None'}</div>
				</Box>

				<MenuItem>Building Renovation</MenuItem>
				<MenuItem>Building Renovation</MenuItem>
				<MenuItem>Building Renovation</MenuItem>
			</Select>
		</div>
	)
}
export default WBSComponent;