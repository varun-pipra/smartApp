import React, { useEffect, useState } from "react";
import './ProjectLocation.scss';
import { TextField, InputAdornment, Select, Chip, InputLabel, IconButton, ListItemText, ListItem, MenuItem, Checkbox, Menu, ListItemIcon, Popover, Autocomplete } from '@mui/material';

import { useAppSelector, useAppDispatch } from 'app/hooks';

import { getServer, } from "app/common/appInfoSlice";
import SmartDropDown from "components/smartDropdown";
import { makeStyles, createStyles } from '@mui/styles';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


export interface IProjectLocation {
	label?: any;
	Placeholder?: any;
	isMultiple?: any;
	tagOptions?: any;
	selectedTagValue?: any;
	tagStage_handler?: any;
	LevelOptions?: any;
	selectedLevelValue?: any;
	LevelStage_handler?: any;
	SelectFieldsx?: any;
	limitTags?: any
}
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 48 * 5.2 + 8, //ITEM_HEIGHT = 48 ,ITEM_PADDING_TOP = 8;
			maxWidth: '160px !important',
		},
	})
);
const ProjectLocation = (props: any) => {
	const appInfo = useAppSelector(getServer);
	const { Placeholder = 'Select', label, limitTags = false, isMultiple = false, showCheckboxes = false, selectedTagValue, tagOptions, tagStage_handler, LevelOptions, selectedLevelValue, LevelStage_handler, SelectFieldsx } = props;
	const classes = useStyles();
	const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
	const checkedIcon = <CheckBoxIcon fontSize="small" />;
	const selectRef = React.useRef<HTMLInputElement | null>(null);
	const [TagmenuItems, setTagMenuItems] = React.useState<any>([]);
	const [SingleTagmenuItems, setSingleTagMenuItems] = React.useState<any>([]);
	const [selectedTagOption, setSelectedTagOption] = React.useState<any>(selectedTagValue || []);
	const [inputValue, setInputValue] = React.useState<any>();
	const [optionOpen, setOptionOpen] = React.useState<any>(false);
	/** level tags Start */
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [postion, setPosition] = React.useState<any>({ top: null, left: null });
	const open = Boolean(anchorEl);
	const [levelMenuOptions, setLevelMenuOptions] = React.useState<any>([]);
	const [selectedLevelOptions, setSelectedLevelOptions] = useState<any>();
	/** level tags Start End */


	useEffect(() => {
		if (tagOptions) {
			if (isMultiple) {
				setTagMenuItems(tagOptions)
			}
			else {
				const data = tagOptions.map((data: any) => {
					return data.text
				})
				setSingleTagMenuItems(data)
			}
		}
	}, [tagOptions]);

	//getting a text name from respective tag uniqueid
	const getTagtextName = (id: any, array: any) => {
		let result: any = [];
		if (array.length > 0) {
			array?.map((value: any) => {
				if (value.uniqueId == id) {
					result.push(value?.text)
				}
				else if (value.text == id) {
					result.push(value?.text)
				}
			})
			return result[0];
		}
	}

	const getTagTextId = (text: any, array: any) => {
		let result: any = [];
		if (array.length > 0) {
			array?.map((value: any) => {
				if (value.text == text) {
					result.push(value?.uniqueId)
				}
			})
			if (isMultiple) {
				return result;
			}
			return result[0];
		}
	}

	React.useEffect(() => {
		if (selectedTagValue) {
			if (isMultiple) {
				setSelectedTagOption(selectedTagValue)
			}
			else {
				setSelectedTagOption(getTagtextName(selectedTagValue, tagOptions))
			}
		} else {
			setSelectedTagOption('');
		}
	}, [selectedTagValue, tagOptions])

	React.useEffect(() => {

		if (LevelOptions && LevelOptions.length > 0) {
			setLevelMenuOptions([...LevelOptions]);
		}
	}, [LevelOptions])

	useEffect(() => {
		if (selectedLevelValue && selectedLevelValue != undefined) {
			setSelectedLevelOptions(selectedLevelValue);
		}
	}, [selectedLevelValue]);


	const CaretIconHandle = (event: React.MouseEvent<HTMLElement>) => {
		const el: HTMLElement | null = event?.currentTarget?.parentElement || null;
		setAnchorEl(el);
		setPosition({ top: (event?.pageY - 280), left: (event?.pageX - 400) })
	}

	const handleOnChange = (value: any) => {
		if (isMultiple) {
			setSelectedTagOption(value)
			if (tagStage_handler) tagStage_handler(getTagTextId(value, tagOptions))
		}
	}
	const Single_handleOnChange = (value: any) => {
		setSelectedTagOption(value)
		if (tagStage_handler) tagStage_handler(getTagTextId(value, tagOptions))
	}
	const deleteHandler = (e: any) => {
		setSelectedTagOption('')
		if (tagStage_handler) tagStage_handler('')
	}
	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const levelStage_HandleChange = (e: any, value: any) => {
		e.stopPropagation();
		const data = value;
		setSelectedLevelOptions(data?.levelId);
		if (LevelStage_handler) LevelStage_handler(value)
		handlePopoverClose();
		setTimeout(() => { setOptionOpen(true) }, 600)
	}

	const filterOptions = (options: any, state: any) => {
		let newOptions: any = [];
		options.forEach((element: any) => {
			if (JSON.stringify(element).toLowerCase().includes(state.inputValue.toLowerCase())) {
				newOptions.push(element);
			}
		});
		return newOptions;
	};
	const CustomInputComponent = (props: any) => {
		const { value = '', ...rest } = props;
		return (
			<Chip
				key={value}
				className="smart-dropdown-chip-cls"
				//onDelete={(e: any) => handleChipDelete(e, x?.displayField)}
				label={value}
				deleteIcon={
					<span
						className="smart-dropdown-chip-close-cls"
						onMouseDown={(event) => event.stopPropagation()}
					>
						+
					</span>
				}
			/>
		)
	};
	return (
		<div className='ProjectLocation'>
			<InputLabel className='inputlabel' >{label}</InputLabel>
			{isMultiple ?
				<Autocomplete
					open={optionOpen}
					onOpen={() => setOptionOpen(true)}
					onClose={() => setOptionOpen(false)}
					onFocus={() => setOptionOpen(true)}
					limitTags={limitTags ? 1 : -1}
					options={TagmenuItems}
					className={'projectLocation_autocompleteMultiple'}
					multiple={isMultiple}
					value={selectedTagOption}
					freeSolo
					onChange={(event: any, newValue: any) => { handleOnChange(newValue); }}
					classes={classes}
					forcePopupIcon={false}
					filterOptions={filterOptions}
					renderInput={params => {
						return (
							<TextField
								{...params}
								variant="standard"
								placeholder={selectedTagOption ? '' : Placeholder}
								fullWidth
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<InputAdornment position="end" onClick={(e: any) => { CaretIconHandle(e) }} style={{ cursor: 'pointer' }}>
											<span className='common-icon-down-arrow userdetails_icons ' />
										</InputAdornment>
									)
								}}
							/>
						);
					}}
					renderTags={(value: any, getTagProps) =>
						value.map((option: any, index: number) => (
							<Chip
								label={option?.text}
								{...getTagProps({ index })}
								className="email-dropdown-chip-cls"
							/>
						))
					}
					renderOption={(props, option: any, { selected }) => {
						const highlightStyle = {
							fontWeight: selected ? 'bold' : 'normal',
							backgroundColor: selected ? '#e8e8e8' : 'inherit',
						};
						return (
							<li
								{...props}
								key={option?.uniqueId}
								style={highlightStyle}
							>
								{isMultiple &&
									<Checkbox
										icon={icon}
										checkedIcon={checkedIcon}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
								}
								{option.text}
							</li>
						)
					}}

				/>
				:
				<Autocomplete
					open={optionOpen}
					onOpen={() => setOptionOpen(true)}
					onClose={() => setOptionOpen(false)}
					onFocus={() => setOptionOpen(true)}
					options={SingleTagmenuItems}
					className={'projectLocation_autocomplete'}
					value={selectedTagOption}
					getOptionLabel={(option) => option?.label ?? option}
					freeSolo
					onChange={(event: any, newValue: any) => { Single_handleOnChange(newValue); }}
					classes={classes}
					forcePopupIcon={false}
					renderInput={params => {
						return (
							<TextField
								{...params}
								variant="standard"
								placeholder={selectedTagOption ? '' : Placeholder}
								fullWidth
								InputProps={{
									...params.InputProps,
									// inputComponent: ()=>{
									// 	return (
									// 		<CustomInputComponent value={selectedTagOption}/>
									// 	)
									// },
									endAdornment: (
										<>
											{selectedTagOption != '' ?
												<InputAdornment position="end" onClick={(e: any) => { deleteHandler(e) }} style={{ cursor: 'pointer' }}>
													<span className='common-icon-Cancel userdetails_icons ' />
												</InputAdornment>
												: <></>
											}
											<InputAdornment position="end" onClick={(e: any) => { CaretIconHandle(e) }} style={{ cursor: 'pointer' }}>
												<span className='common-icon-down-arrow userdetails_icons ' />
											</InputAdornment>
										</>
									)
								}}
							/>
						);
					}}
				/>
			}






			<Popover
				open={open}
				onClose={handlePopoverClose}
				anchorReference="anchorEl"
				// anchorPosition={{ top: postion.top, left: postion.left }}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				sx={{
					'.MuiPopover-paper': {
						width: '60% !important',
						maxHeight: 230,
					}
				}}
			>
				{levelMenuOptions.length > 0 && levelMenuOptions?.map((data: any, i: any) => {
					return (
						<ListItem
							className='location-listItem'
							id='location-listItem'
							key={i}
							onClick={(e) => { levelStage_HandleChange(e, data) }}
							disabled={data?.disable}
							sx={{
								paddingTop: '0px !important',
								paddingBottom: '0px !important',
								paddingRight: '0px !important',
								paddingLeft: '0px !important'
							}}
						>
							<ListItemText key={i + '_text'}
								style={{
									background: `${data?.levelId === selectedLevelOptions ? '#fffad2' : null}`,
									padding: '6px 10px',

								}}
								sx={{
									marginTop: '0px !important',
									marginBottom: '0px !important'
								}}
							>
								{data.name}
							</ListItemText>
							{data?.levelId === selectedLevelOptions ?
								<ListItemIcon className='menuItem-trick-icon' style={{
									background: `${data?.levelId === selectedLevelOptions ? '#fffad2' : null}`,
									padding: `${data?.levelId === selectedLevelOptions ? '10px' : null}`
								}}>
									<span className={'common-icon-tick selected'}></span>
								</ListItemIcon>
								: null
							}
						</ListItem>
					)
				})}
			</Popover>
		</div>
	)
}


export default ProjectLocation;