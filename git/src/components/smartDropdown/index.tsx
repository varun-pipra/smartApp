import * as React from "react";
import { FormControl, Select, InputLabel, MenuItem, TextField, Icon, InputAdornment, Box, ListItemText, IconButton, Input, SelectChangeEvent, ListSubheader, Checkbox, Chip, OutlinedInput, Button, Popover, FormControlLabel, checkboxClasses, Tooltip, Typography, ListItemIcon, ListItem, MenuList } from "@mui/material";
import FuzzySearch from "fuzzy-search";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/ControlPoint';
import './styles.scss';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { useAppSelector } from 'app/hooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DynamicTooltip from "sui-components/DynamicTooltip/DynamicTooltip";
import { Close } from "@mui/icons-material";
import { primaryIconSize } from "features/budgetmanager/BudgetManagerGlobalStyles";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// import { TreeView } from "@mui/x-tree-view/TreeView";
// import {TreeItem,TreeItemProps,treeItemClasses} from "@mui/x-tree-view/TreeItem";
import { PopoverSelect } from "components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu";
type TOption = {
	id?: any,
	label: string,
	value: string | number;
	img?: string,
	colVal?: string | number,
	description?: string,
	color?:string,
	options?: Array<{ label: string, value: string | number, colVal?: string | number, description?: string; }>;
	iconCls?:any;
};
// type StyledTreeItemProps = TreeItemProps & {
// 	nodeId:any;
// 	labelIcon: React.ReactElement;
// 	labelText: string;
//   };
export interface ISmartDropDown {
	name?: string | unknown;
	required?: boolean;
	disabled?: boolean;
	isSearchField?: boolean;
	showIconInOptionsAtRight?:boolean;
	hideNoRecordMenuItem?: boolean;
	handleChange?: (selected: string | Array<string> | undefined, nodes?:any) => void;
	handleChipDelete?: (selected: string | Array<string> | undefined) => void;
	options: Array<TOption>;
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
	doTextSearch?: boolean;
	isCustomSearchField?: boolean;
	handleAddCategory?: any;
	isReadOnly?: boolean;
	endAdornment_Handler?: any;
	SelectInputProps?: any;
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
	disableOptionsList?: any;
	showToolTipForDisabledOption?: boolean;
	showCustomHeader?: boolean;
	customHeaderContent?: React.ReactNode;
	handleSearchProp?: any;
	columnBasedOptions?: boolean;
	defaultValue?: any;

	isTreeView?:boolean;
	treeDataOptions?:Array<any>;
	isTreeMultiSelect?:boolean;
    showCustomTreeIcon?:boolean;
	TreeIcon?:React.ReactElement;
	selectedNodes?:any;
	isDropdownSubMenu?:boolean;
	filterRef?:any;
	isSubMenuSearchField?:boolean;
	defaultSubMenuSelection?:any;
	subMenuModuleName?:string;
}

const SmartDropDown = (props: ISmartDropDown): JSX.Element => {
	const {
		required = false,
		hideNoRecordMenuItem = false,
		RightIcon,
		useNestedOptions = false,
		outSideOfGrid = true,
		isSearchField = true,
		showIconInOptionsAtRight = false,
		showSearchRightIcon = false,
		handleChange,
		options,
		selectedValue,
		dropDownLabel,
		isMultiple,
		LeftIcon,
		isFullWidth,
		iconClickHandler,
		sx,
		menuProps,
		variant = "standard",
		optionImage = false,
		displayEmpty = false,
		Placeholder,
		showColumnHeader,
		columnName,
		showFilterIcon,
		reduceMenuHeight = false,
		sortOrder = "asc",
		dropDownListExtraColumns = [],
		showCheckboxes = false,
		isSearchPlaceHolder = 'Select',
		doTextSearch,
		isCustomSearchField = false,
		handleAddCategory,
		isReadOnly = false,
		endAdornment_Handler,
		SelectInputProps,
		ignoreSorting = false,
		insideGridCellEditor = false,
		noDataFoundMsg = 'No records found',
		showAddButton = false,
		dynamicClose = false,
		handleListOpen = () => { },
		handleListClose = () => { },
		showDropDownHeaderTitle,
		dropDownHeaderTitle,
		showHeaderCloseIcon = false,
		showExtraColumns = false,
		isDropDownPosition = false,
		showDescription = false,
		showToolTipForDisabledOption = false,
		showCustomHeader = false,
		customHeaderContent = <></>,
		disableOptionsList = [],
		handleSearchProp,
		columnBasedOptions = false,
		defaultValue,

		isTreeView = false,
		treeDataOptions = [],
		isTreeMultiSelect=false,
        showCustomTreeIcon=false,
		TreeIcon = <></>,
		selectedNodes = [],
		isDropdownSubMenu = false,
		isSubMenuSearchField = false,
		defaultSubMenuSelection = {},
		subMenuModuleName='others',
		...rest
	} = props;

	const searchRef = React.useRef<HTMLInputElement | null>(null);
	const [menuItems, setMenuItems] = React.useState(options);
	const [searchValue, setSearchValue] = React.useState<string>("");
	const [selectedOption, setSelectedOption] = React.useState<any>(isMultiple ? [] : selectedValue);
	const [ellipsis, setEllipsis] = React.useState<any>(false);
	const [tooltip, setTooltip] = React.useState<any>('');
	const selectRef = React.useRef<HTMLInputElement | null>(null);

	const [filtered, setFiltered] = React.useState<number[]>([]);
	const [filterPopupEl, setFilterPopupEl] = React.useState<HTMLButtonElement | null>(null);
	const showFilterPopup = Boolean(filterPopupEl);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		if (!useNestedOptions && options && Array.isArray(options) && options?.length > 0 && !ignoreSorting) {
			const sortedOptions: any = [...options].sort((recOne: any, recTwo: any) => {
				const strOneConverted = recOne?.label?.toLowerCase();
				const strTwoConverted = recTwo?.label?.toLowerCase();
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
			setMenuItems([...sortedOptions]);
		} else {
			setMenuItems([...options]);
		}
		setTooltip(selectedOption);
		const div = document.querySelector('.MuiSelect-select');
		setEllipsis(isEllipsisActive(div));
	}, [options]);

	React.useEffect(() => {
		if (isMultiple && selectedValue?.length === 0) {
			setSelectedOption(selectedValue);
		} else if (isMultiple && (selectedValue?.length > 0)) {
			setSelectedOption(selectedValue);
		} else if(isTreeView && !isMultiple) {
			setSelectedOption(selectedValue ?? selectedValue?.[0]);
		} else if(isDropdownSubMenu) {
			setSelectedOption(selectedValue ?? selectedValue?.[0]);
		}
	}, [selectedValue]);

	const isEllipsisActive = (e: any) => {
		if (e) return (e.clientWidth < e.scrollWidth);
	};

	const _handleChange = (e: SelectChangeEvent) => {
		const { target: { value } } = e;
		const name: any = typeof value === 'string' ? value.split(',') : value;
		setSelectedOption(name);
		if (handleChange) handleChange(name);
	};

	const onOpenChange = (e: any) => {
		const { target } = e;

		const element = target.offsetParent;
		setOpen(!open);
		if (handleListOpen) {
			handleListOpen(true);
		}
		if(searchValue !== "") {
			handleSearchClear();
		};
		setTimeout(() => {
			const dPopover: any = document.querySelector('#menu-.MuiModal-root .MuiPaper-root');
			const width = `${element.offsetWidth + element.offsetLeft}px`;

			// Search Wrapper max width
			const searchInput = dPopover.querySelector('.search-wrapper');
			// searchInput.style.maxWidth = width;

			dPopover.style.maxWidth = width;
			// dPopover.style.left = `calc(${dPopover.style.left} + 12px)`;
		}, 100);
	};
	const handleClose = () => {
		setOpen(false);
		if (handleListClose) {
			handleListClose(selectedOption);
		}
	};
	const handleSearch = (e: any) => {
		let keyword = e?.target?.value;
		setSearchValue(keyword);
		if (keyword !== '') {
			keyword = keyword?.toLowerCase();
			if (useNestedOptions) {
				const firstResult = JSON.parse(JSON.stringify(options)).filter(
					(obj: any) => {
						let filteredItems = (obj?.options || []).filter((childObj: any) =>
							childObj?.label?.toLowerCase()?.includes(keyword)
						) || [];
						if (filteredItems.length > 0) {
							obj.options = filteredItems;
							return obj;
						}
						if (obj?.label?.toLowerCase()?.includes(keyword)) {
							return obj;
						}
					}
				);
				setMenuItems(firstResult);
			} else if (doTextSearch) {
				const firstResult = options.filter((obj: any) => {
					return obj.label && JSON.stringify(obj.label).toLowerCase().includes(keyword);
				});
				setMenuItems(firstResult);
				handleSearchProp(firstResult, keyword);
			} else {
				const firstResult = options.filter((obj: any) => {
					return JSON.stringify(obj).toLowerCase().includes(keyword);
				});
				setMenuItems(firstResult);
				handleSearchProp(firstResult, keyword);
			}
		} else {
			setMenuItems(options);
			handleSearchProp(options, keyword);
		}
	};
	const handleSearchClear = () => {
		setSearchValue('');
		setMenuItems(options);
		if (searchRef?.current) {
			setTimeout(() => {
				searchRef.current?.focus();
			}, 100);
		}
		handleSearchProp(options, '');
	};

	const handleAdd = () => {
		// console.log("handle Add")
		handleAddCategory(searchValue);
	};
	const handleFilterPopupClose = () => {
		setFilterPopupEl(null);
	};
	const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
		// console.log('dddd')
		setFilterPopupEl(event.currentTarget);
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
	};

	/**
	 * Triggers when user clicks on close icon in the multi select chip.
	 * Removing the clicked item and updating the selectedOption state.
	 * @param e MouseEvent
	 * @param value Selected value from the dropdown
	 * @author Srinivas Nadendla
	 */
	const handleDelete = (e: React.MouseEvent, value: any, treeValue?:any) => {
		e.preventDefault();
		let itemToDelete = value;
		if(isTreeView && treeValue) {
			let activeOptions = [...selectedOption];
			const index = activeOptions.indexOf(treeValue?.name);
			if (index > -1) activeOptions.splice(index, 1);
			setSelectedOption(activeOptions);

			if (props?.handleChipDelete) {
				props?.handleChipDelete(activeOptions);
			}
		} else {
		if (itemToDelete) {
			let activeOptions = [...selectedOption];
			const index = activeOptions.indexOf(itemToDelete);
			if (index > -1) activeOptions.splice(index, 1);
			setSelectedOption(activeOptions);

			if (props?.handleChipDelete) {
				props?.handleChipDelete(activeOptions);
			}
		}
	};
	};
	const getColumnsBasedSelectRenderTmpl = (selectedOptions: any) => {
		const selectedItems: any = [];
		if (selectedOptions) {
			options.forEach((optionList: any) => {
				if (optionList.value === selectedOptions) selectedItems.push(optionList);
			});
		};
		if (selectedItems.length > 0) {
			return (
				<Box sx={{ display: "flex", alignItems: 'center', gap: '2px', width: '100%' }}>
					{selectedItems?.map((rec: any, index: any) => (
						<>
							{dropDownListExtraColumns?.length > 0 && (
								<>
									{dropDownListExtraColumns.map((colRec: any) => (
										<span className={"sd-label-extra-column-cell-cls"}
											style={{ width: colRec?.name === 'label' ? '80%' : 'auto', padding: '0px' }}
										>
											{getColsBasedOptionsRenderVal(colRec, rec, index, colRec?.showRenderColVal)}
										</span>
									))}
								</>
							)}
						</>
					))}

				</Box>
			);
		}
	};
	/**
 * Triggers when renderedValue callback is called for multiselect dropdown
 * @param selectedOptions Array of items which are selected
 * @returns array of chips
 * @author Srinivas Nadendla
 */
	const getMultiSelectRenderTmpl = (selectedOptions: any) => {
		const selectedItems: any = [];
		if (Array.isArray(selectedOptions) && useNestedOptions) {
			(selectedOptions || []).forEach((item: any) => {
				options.forEach((optionList: any) => {
					const selectedRec = optionList?.options?.find(
						(childOption: any) => childOption.value === item
					);
					if (selectedRec) selectedItems.push(selectedRec);
				});
			});
		} else if (Array.isArray(selectedOptions) && showCheckboxes) {
			(selectedOptions || []).forEach((item: any) => {
				const selectedRec = options?.find(
					(childOption: any) => childOption.value === item
				);
				if (selectedRec) selectedItems.push(selectedRec);
			});
		} else if(selectedOptions && isTreeView) {
			let data = Array.isArray(selectedOptions) ? selectedOptions : selectedOptions.split();
			(data || []).forEach((item: any) => {
				const getSelectedNodeIds:any = (val: any, arr: any) => {
					return (arr || []).reduce((a: any, item: any) => {
					  if (a) return a;
					  if (item.label === val) return item;
					  if (item.children) return getSelectedNodeIds(val, item.children);
					}, null);
				  };
				const selectedRec = getSelectedNodeIds(item, treeDataOptions);
				if (selectedRec) selectedItems.push(selectedRec);
			});
		} else {
			options.forEach((optionList: any) => {
				const selectedRec = optionList?.options?.find(
					(childOption: any) => childOption.value === selectedOptions
				);
				if (selectedRec) selectedItems.push(selectedRec);
			});
		}

		if (selectedItems.length > 0) {

			const dropDownWidth = selectRef?.current?.clientWidth || 0;
			const availableWidth = dropDownWidth - 100;//Substracting left/right icons width + count div width;
			let renderItems: any = [];
			if (selectedItems.length === 1) {
				renderItems = [...selectedItems];
			} else {
				let itemsWidth = 0;
				selectedItems.forEach((item: any) => {
					let itemLen = item?.label?.length * 10;
					if (itemLen >= availableWidth) {
						itemLen = availableWidth - 10;
					}
					itemsWidth += itemLen;
					if (availableWidth > itemsWidth) {
						renderItems.push(item);
					}
				});
			}
			if (isMultiple && insideGridCellEditor) {
				return (
					<span className="smart-dropdown-without-chip-cls">{selectedItems.map((x: any) => x.label).join(", ")}</span>
				);
			}
			return (
				<>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
						{isMultiple &&
							<>
								{renderItems?.map((rec: any) => (
									<Chip
										key={rec?.value}
										label={(rec?.displayLabel ?? false) ? rec?.displayLabel : rec?.label}
										className="smart-dropdown-chip-cls"
										onDelete={(e) => handleDelete(e, rec?.value, rec)}
										sx={{ maxWidth: availableWidth }}
										deleteIcon={
											<span
												className="smart-dropdown-chip-close-cls"
												onMouseDown={(event) => event.stopPropagation()}
											>
												+
											</span>
										}
									/>
								))}
								{selectedItems?.length > 1 && selectedItems?.length - renderItems?.length !== 0 && (
									<div className="smart-dropdown-multi-select-count-cls">
										<span>+ {selectedItems.length - renderItems.length}</span>
									</div>
								)}
							</>
						}
						{isTreeView && !isTreeMultiSelect && (renderItems.map((rec: any) => (
									<div key={rec?.value} style={{ display: "flex" }}>{rec?.label}</div>
						)))}
						{!isMultiple && !isTreeView && (renderItems.map((rec: any) => (
							<Chip
								key={rec?.value}
								label={rec?.label}
								className="smart-dropdown-chip-cls"
								sx={{ maxWidth: availableWidth }}
							/>
						)))}
					</Box>
				</>
			);
		} else {
			return <div style={{ display: "flex" }}>{Placeholder}</div>;
		}

	};
	let dynamicProps: any = {};
	if (useNestedOptions) {
		dynamicProps.renderValue = (selectedOptions: any) => getMultiSelectRenderTmpl(isMultiple ? selectedOptions : selectedValue);
	} else if (showCheckboxes) {
		dynamicProps.renderValue = (selectedOptions: any) => getMultiSelectRenderTmpl(isMultiple ? selectedOptions : selectedValue);
	} else if (columnBasedOptions) {
		dynamicProps.renderValue = (selectedOptions: any) => getColumnsBasedSelectRenderTmpl(selectedOptions);
	} else if(isTreeView) {
		dynamicProps.renderValue = (selectedOptions: any) => getMultiSelectRenderTmpl(selectedOptions);
	} else if(isDropdownSubMenu) {
		dynamicProps.renderValue = (selectedOption: any) => {return <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}> {selectedOption} </Typography>}
	}

	/**
	 * 
	 * @param colRec @object - columns object - place where we have all column configs
	 * @param currentOption @object - List item
	 * @param index @number - using it to determine the currenmt record number
	 * @returns column cell value based on column type
	 * @author Srinivas Nadendla
	 */
	const getDynamicColRenderVal = (
		colRec: any,
		currentOption: any,
		index: number
	) => {
		let colHtml: any = "";
		switch (colRec.name) {
			case "status":
				if (colRec.showIcon && currentOption[colRec.dataKey]) {
					if (currentOption[colRec.dataKey] === "completed") {
						colHtml = <CheckCircleIcon className="completed" />;
					} else if (currentOption[colRec.dataKey] !== "completed") {
						colHtml = <ErrorIcon className="pending" />;
					}
				} else {
					colHtml = (
						<span
							className={"status-col " + currentOption[colRec.dataKey]}
						></span>
					);
				}
				if (
					colRec.showTooltip &&
					colRec.tooltipData &&
					currentOption[colRec.dataKey]
				) {
					colHtml = (
						<DynamicTooltip
							placement="bottom"
							title={colRec.tooltipData[currentOption[colRec.dataKey]]}
						>
							{colHtml}
						</DynamicTooltip>
					);
				}
				break;
			case "warning":
				colHtml = (
					<WarningAmberIcon fontSize={primaryIconSize} style={{ color: 'red' }} />
				);
				break;
			case "pagination":
				colHtml = (
					<span className="pagination-col">
						{" "}
						{index + 1} of {options.length}
					</span>
				);
				break;
			case "amount":
				colHtml = (
					<span className="amount-col">
						{amountFormatWithSymbol(currentOption[colRec.dataKey])}
					</span>
				);
				break;
			case "bidValue":
				colHtml = (
					<span className="amount-col">
						{amountFormatWithSymbol(currentOption[colRec?.dataKey])}
					</span>
				);
				break;
			case "changeOrderAmount":
				colHtml = (
					<span className="amount-col">
						{amountFormatWithSymbol(currentOption[colRec?.dataKey])}
					</span>
				);
				break;
			case "revisedBidValue":
				colHtml = (
					<span className="amount-col">
						{amountFormatWithSymbol(currentOption[colRec?.dataKey])}
					</span>
				);
				break;
			default:
				colHtml = "";
		}
		return colHtml;
	};
	const getWorkItemsDynamicColRenderVal = (colRec: any, currentOption: any, index: number) => {
		let colHtml: any = "";
		switch (colRec.name) {
			case "text":
				colHtml = (
					<span style={{ float: currentOption[colRec.align] ?? 'right', marginRight: '20px' }}>
						{["unitOfMeasure"]?.includes(colRec?.field) ? currentOption[colRec.field] : amountFormatWithOutSymbol(currentOption[colRec.field])}
					</span>
				);
				;
				break;
			case "amount":
				colHtml = (
					<span style={{ float: currentOption[colRec.align] ?? 'right', marginRight: '10px' }}>
						{amountFormatWithSymbol(currentOption[colRec.field])}
					</span>
				);
				break;
			default:
				colHtml = null;
		}
		return colHtml;
	};
	const getColsBasedOptionsRenderVal = (colRec: any, currentOption: any, index: number, show?: any) => {
		let colHtml: any = "";
		switch (colRec.name) {
			case "label":
				colHtml = (
					<span>
						{currentOption[colRec.dataKey]?.toLocaleString("en-US")}
					</span>
				);
				break;
			case "warning":
				colHtml = (
					show ? <WarningAmberIcon fontSize={primaryIconSize} style={{ color: 'red' }} /> : null
				);
				break;
			case "pagination":
				colHtml = (
					show ? <span className="col-based-pagination-col">
						{" "}
						{index + 1} of {options.length}
					</span> : null
				);
				break;
			case "amount":
				colHtml = (
					show ? <span className="col-based-amount-col"
						style={{ float: currentOption[colRec.align] ?? 'right' }}
					>
						{amountFormatWithSymbol(currentOption[colRec.dataKey])}
					</span> : null
				);
				break;
			default:
				colHtml = null;
		}
		return colHtml;
	};
	React.useEffect(() => {
		if (!open) return;
		if (searchValue !== "") {
			setSearchValue("");
			handleSearchClear();
		};
		handleClose();
	}, [dynamicClose]);

	const CustomTooltip = (props: any) => {
		const { title = "", children, ...rest } = props;
		return (
			<Tooltip
				title={title}
				arrow
				placement="bottom-start"
				enterDelay={500}
			>
				<span>{children}</span>
			</Tooltip>
		);
	};
	//Breadth First Search algorithm to find node by his ID
	const bfsSearch = (graph:any, targetId:any) => {
    const queue = [...graph];
    while (queue.length > 0) {
      const currNode = queue.shift();
      if (currNode?.id?.toString() === targetId?.toString()) {
        return currNode;
      }
      if (currNode.children) {
        queue.push(...currNode.children);
      }
    }
    return [];
  };
	const getAllIds = (node:any, idList:any = []) => {
		idList.push(node?.id);
		if (node.children) {
		node.children.forEach((child:any) => getAllIds(child, idList));
		}
		return idList;
	}
	const getAllChildNodes = (id:any) => {
    	return getAllIds(bfsSearch(treeDataOptions, id));
  	};
  	const getAllParentNodes:any = (id:any, list:any = []) => {
    	const node = bfsSearch(treeDataOptions, id);
		if (node.parent) {
		list.push(node.parent);

		return getAllParentNodes(node.parent, list);
		}
		return list;
  	};
	const getNodeIds = (items:any) => {
		return (items || [])?.reduce((ids:any, item:any) => {
		  ids.push(item.id);
		  if (item.children) {
			ids = ids.concat(getNodeIds(item.children));
		  }
		  return ids;
		}, []);
	};
	const isAllChildrenChecked = (node:any, list:any) => {
		const allChild = getAllChildNodes(node.id);
		const nodeIdIndex = allChild.indexOf(node.id);
		allChild.splice(nodeIdIndex, 1);
	
		return allChild.every((nodeId:any) =>
		  selectedNodes.concat(list).includes(nodeId)
		);
	};
	const getAllChildLabels = (node:any, idList:any = []) => {
		if (node.children) {
		  node.children.forEach((child:any) => {
			if(!Array.isArray(child.children)) {
				idList.push(child?.name);
			}
			getAllChildLabels(child, idList);
		  })
		} else if(node){
			idList.push(node?.name);
		};
		return idList;
	};
	const onlyUnique = (value:any, index:any, array:any) => {
		return array.indexOf(value) === index;
	};
	let allNodeIds = getNodeIds(treeDataOptions);
	// const StyledTreeItem = (props: StyledTreeItemProps) => {
    // const { nodeId, labelIcon: LabelIcon, labelText, ...other } = props;
    // const handleMultipleTreeView = (event: any, nodeIds: any) => {
    //   event.stopPropagation();
    //   const allChild = getAllChildNodes(nodeIds);
    //   const allParent = getAllParentNodes(nodeIds);	 
	// const keys = getAllChildLabels(bfsSearch(treeDataOptions, nodeIds));
	// if(selectedOption.length === 1 && selectedOption?.[0] == '') {
	// 		delete selectedOption[0];
	// };
	//   let nodes:any;
	//   let labels:any;
    //   if (selectedNodes.includes(nodeIds)) {
	// 	nodes = [...selectedNodes].filter((id: any) => !allChild.concat(allParent).includes(id));
	// 	labels = [...selectedOption].filter((id: any) => !keys.includes(id));
    //   } else {
    //     const ToBeChecked = allChild;
    //     for (let i = 0; i < allParent.length; i++) {
    //       if (isAllChildrenChecked(bfsSearch(treeDataOptions, allParent[i]),ToBeChecked)) {
    //         ToBeChecked.push(allParent[i]);
    //       }
    //     }
	// 	nodes = [...selectedNodes].concat(ToBeChecked);
	// 	labels = selectedOption.concat(keys);
    //   };
	//   if(nodes.length) {
	// 		labels = labels.filter(onlyUnique);
	// 		nodes = nodes.filter(onlyUnique);
	// 	  	setSelectedOption(labels);
    // 	  	if (handleChange) handleChange(labels, nodes);
	//   } else if(nodes.length === 0) {
	// 		setSelectedOption([]);
	// 		if (handleChange) handleChange([], nodes);
	//   }
    // };
    // // return (
    // //   <TreeItem
    // //     nodeId={nodeId}
    // //     label={
    // //       <Box
    // //         sx={{
    // //           display: "flex",
    // //           alignItems: "center",
    // //           p: 0.5,
    // //           pr: 0,
    // //         }}
    // //       >
    // //         {isTreeMultiSelect && (
    // //           <Checkbox
    // //             size="small"
    // //             checked={selectedNodes.indexOf(nodeId) !== -1}
    // //             tabIndex={-1}
    // //             disableRipple
    // //             onClick={(event) => isTreeMultiSelect ? handleMultipleTreeView(event, nodeId) : null}
    // //           />
    // //         )}
    // //         {showCustomTreeIcon && (
	// // 			<InputAdornment position="start">{LabelIcon}</InputAdornment>
    // //         )}
    // //         <Typography
    // //           variant="body2"
    // //           sx={{ fontWeight: "inherit", flexGrow: 1 }}
    // //         >
    // //           {labelText}
    // //         </Typography>
    // //       </Box>
    // //     }
    // //     {...other}
    // //   	/>
    // // 	   );
  	//   };  
	  const renderTree = (treeItems: any) => {
		return (treeItems || []).map((treeItemData: any) => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = renderTree(treeItemData.children);
      }
    //   return (
    //     <StyledTreeItem
    //       nodeId={treeItemData?.nodeId}
    //       labelText={treeItemData?.label}
    //       labelIcon={TreeIcon}
    //       children={children}
    //     />
    //   );
    });
	  };
	  const handleSingleTreeView = (event: any, nodeIds: any) => {
		event.stopPropagation();
		if((getAllChildLabels(bfsSearch(treeDataOptions, nodeIds))?.length === 1 ?? false)) {
			const target = event.target?.['innerText'] ?? '';
			const name: any = typeof target === 'string' ? target.split(',') : target;
			setSelectedOption(name);
			if (handleChange) handleChange(name, [nodeIds]);
		}
    };
	const handleSubMenuChange = (parentName:any, selectedValue?: any) => {
		if(props?.handleChange) {
			props?.handleChange(parentName, selectedValue);
			setOpen(false);
		};
	};
	const moveFocusToInput = (e:any) => {
		console.log("move")
		if (e.key === "Tab" || e.key === "ArrowRight") {
		  e.stopPropagation();
		  e.preventDefault();
		  rest?.filterRef.current.focus();
		}
	  };
	return (
		<>
			<InputLabel
				id="demo-multiple-checkbox-label"
				style={{ textAlign: "left" }}
				className={outSideOfGrid ? "inputlabel" : "inputlabel1"}
			>
				{dropDownLabel}
				{dropDownLabel && required && <span className="required_color">*</span>}
			</InputLabel>
			<IQTooltip title={ellipsis ? tooltip : ""} arrow={true}>
				<Select
					defaultValue={defaultValue}
					name={props.name}
					disabled={props.disabled}
					ref={selectRef}
					className={
						(outSideOfGrid ? "selectdropdown" : "selectdropdownnew") +
						(dropDownListExtraColumns?.length > 0
							? " extra-columns-drop-down "
							: "") + (insideGridCellEditor ? ' inside-grid-cell-cls' : '')
					}
					labelId="demo-simple-select-standard-label"
					id="demo-simple-select-standard"
					variant={variant}
					fullWidth={isFullWidth}
					value={isMultiple ? selectedOption : selectedValue?.toString()}
					onOpen={onOpenChange}
					open={open}
					onClose={handleClose}
					onChange={_handleChange}
					// label={dropDownLabel}
					multiple={isMultiple}
					readOnly={isReadOnly}
					MenuProps={{
						classes: { paper: menuProps },
						autoFocus: false,
						className:
							dropDownListExtraColumns?.length > 0
								? columnBasedOptions ? "smartdropdown" : "multi-columns-dropdown smartdropdown"
								: "smartdropdown",
						/* Positioning of menu items to under select*/
						anchorOrigin: {
							vertical: "bottom",
							// horizontal: isDropDownPosition ? "left" : null
						},
						transformOrigin: {
							// vertical: isDropDownPosition ? "top" : null,
							horizontal: "left"
						},
					}}
					startAdornment={
						LeftIcon && (
							<InputAdornment position="start">{LeftIcon}</InputAdornment>
						)
					}
					onClick={iconClickHandler}
					endAdornment={
						RightIcon && (
							<InputAdornment position="start" onClick={(e) => { endAdornment_Handler && endAdornment_Handler(e); }}>
								<IconButton>{RightIcon}</IconButton>
							</InputAdornment>
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
					displayEmpty={displayEmpty}
					inputProps={SelectInputProps}
					{...rest}
					{...dynamicProps}
				>
					{showDropDownHeaderTitle && (
						<Box className="smart-dropdown-header-title-cls">
							<div className='title-cls'>{dropDownHeaderTitle}</div>
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
						<ListSubheader sx={{ padding: '0px' }} className="search-wrapper-main-cls">
							<Box className="search-wrapper skill-search">
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
												{showFilterIcon && (
													<Button
														onClick={handleClickFilter}
														sx={{
															borderRadius: 50,
															border: `solid 1px ${filtered.length > 0
																? "#0590cd"
																: "rgba(0,0,0,0.6)"
																} !important`,
															color: `${filtered.length > 0
																? "#0590cd"
																: "rgba(0,0,0,0.6)"
																} !important`,
															padding: "1px",
															height: "24px",
															width: "24px",
															minWidth: "24px",
															marginRight: "10px",
														}}
													>
														<div
															className={`common-icon-Filter ${filtered.length == 0
																? "common-icon-Filter"
																: "common-icon-Filter-blue"
																}`}
														></div>
													</Button>
												)}
												{searchValue == "" && !isCustomSearchField ? (
													<SearchIcon />
												) : (
													isCustomSearchField ? null :
														<ClearIcon
															onClick={handleSearchClear}
															style={{ cursor: "pointer" }}
														/>
												)}
												{showAddButton && <IconButton aria-label="Add" disabled={menuItems?.length > 0 ? true : false} onClick={() => handleAdd()}
													sx={{
														'.Mui-disabled': {
															pointerEvents: 'none',
															color: '#EEEEEE',
														}
													}}
												>
													<span className='common-icon-add skill-add'></span>
												</IconButton>}
											</InputAdornment>
										),
									}}
								/>
								{isCustomSearchField && (
									<AddIcon style={{ cursor: 'pointer', marginRight: '10px', padding: 0, color: '#333' }} onClick={() => handleAdd()} />
								)}
							</Box>
						</ListSubheader>
					)}
					{showCustomHeader && (
						<div style={{ width: '100%' }}>
							{customHeaderContent}
						</div>
					)}
					{showColumnHeader && (
						<Box className="column-header-cls">
							<div className="column-header-inner-cls">{columnName}</div>
						</Box>
					)}
					{/* TODO: Render column header names from dropDownListExtraColumns */}
					{dropDownListExtraColumns && dropDownListExtraColumns.length > 0 ? (
						<Box className="column-header-extra-cells-cls">

							{dropDownListExtraColumns.map((item: any) => {
								return <div className="column-header-inner-cls" style={{ width: item.width, marginRight: '0px' }}>{item.headerName}</div>;
							})}
						</Box>
					) : null}
					{/* {Placeholder && <InputLabel htmlFor="name-multiple">Placeholder</InputLabel>} */}
					{useNestedOptions && menuItems.length > 0 ? (
						menuItems.map((option: TOption, index: number) => {
							if (filtered.length === 0 || filtered.includes(option.id)) {
								return [
									<ListSubheader
										key={"key" + index}
										sx={{
											fontWeight: "bold",
											lineHeight: 1.8,
											marginTop: "5px",
										}}
									>
										{option.label}
									</ListSubheader>,
									option.options &&
									option.options.map((_option: TOption, i: number) => (
										<MenuItem
											key={index + "-" + i}
											// button={false}
											onKeyDown={_option?.id == 'adhoc' ? moveFocusToInput : undefined}
											value={_option.value}
											disabled={disableOptionsList?.includes(option?.value)}
											sx={{
												fontWeight: "100 !important",
												lineHeight: 1.8,
												position: "relative",
												marginTop: "5px",
												" &.Mui-selected": {
													backgroundColor:
														selectedOption != ""
															? "#fff9cc !important"
															: "#fff !important",
												},
												height: showDescription ? '46px' : '36px'
											}}
											className={
												reduceMenuHeight ? "budgetline-item-height" : ""
											}
										>
											{isMultiple && (
												<Checkbox
													checked={
														selectedOption?.indexOf(_option.value) > -1
													}
												/>
											)}
											{showDescription ? (
												<span style={{ display: 'grid', width: '84%' }}>
													<IQTooltip
														arrow={true}
														placement="bottom"
														title={_option.label && _option.label.length >= 40 ? _option.label : null}
													>
														<span className={"sd-label-extra-column-cell-cls"}
															style={{ width: showDescription ? '100%' : '50%' }}
														>
															{_option.label}
														</span>
													</IQTooltip>
													{(showDescription && _option.description !== '') && (
														<IQTooltip
															arrow={true}
															placement="bottom"
															title={_option.description && _option.description.length >= 53 ? _option.description : null}
														>
															<span className={"sd-desc-cell-cls"}
																style={{ width: showDescription ? '100%' : '60%' }}
															>
																{_option.description}
															</span>
														</IQTooltip>
													)}
												</span>
											) : (
												<IQTooltip
													arrow={true}
													placement="bottom"
													title={_option.label && _option.label.length >= 40 ? _option.label : null}
												>
													<span className={showExtraColumns ? "sd-label-extra-column-cell-cls" : "sd-label-cell-cls"}
														style={{ width: '50%' }}
													>
														{_option.label}
													</span>
												</IQTooltip>
											)}
											{showColumnHeader && columnName && (
												<span className="sd-column-cell-cls">
													{amountFormatWithSymbol(_option?.colVal)}
												</span>
											)}
											{dropDownListExtraColumns?.length > 0 && (
												<>
													{dropDownListExtraColumns.map((colRec: any) => (
														<span className="custom-sd-label-cell-cls">
															{getWorkItemsDynamicColRenderVal(colRec, _option, i)}
														</span>
													))}
												</>
											)}
										</MenuItem>
									)),
								];
							}
						})
					) :
						showCheckboxes && isMultiple ? (
							menuItems.length > 0 ? menuItems.map((option: TOption, index: number) => {
								return <MenuItem key={"key" + index} value={option.value}
									disabled={disableOptionsList?.includes(option?.value)}

									sx={{
										fontWeight: "100 !important",
										lineHeight: 1.8,
										position: "relative",
										marginTop: "5px",
										" &.Mui-selected": {
											backgroundColor:
												selectedOption != ""
													? "#fff9cc !important"
													: "#fff !important",
										},
									}}
									className={
										reduceMenuHeight ? "safetyLineItem-item-height" : ""
									}
								>
									{
										(isMultiple && showCheckboxes) && (
											<Checkbox
												checked={
													selectedOption?.indexOf(option.value) > -1
												}
											/>
										)
									}
									{option?.img ? (
										<img
											src={option.img ? option.img : ""}
											style={{
												width: "24px",
												height: "24px",
												borderRadius: "50%",
												marginRight: "10px",
											}}
										/>
									) : null}
									{option?.iconCls ? <span className={option?.iconCls}></span> : null}
									<span className="sd-label-cell-cls">
										{option.label}
									</span>
								</MenuItem>;
							}) : !hideNoRecordMenuItem && (<div className="base-no-data">{noDataFoundMsg}</div>)
							) : 
							isDropdownSubMenu ? (
								<PopoverSelect
									showNone={true}
									options={menuItems}
									allowSubMenu={true}
									defaultValue={defaultSubMenuSelection}
									open={true}
									onChange={handleSubMenuChange}
									className={'no-border'}
									isSearchField={isSubMenuSearchField}
									moduleName={subMenuModuleName}
							  	/>
							) :
							menuItems && menuItems.length > 0 ? (
								menuItems.map((option: TOption, index: number) => {
									if (showToolTipForDisabledOption && disableOptionsList?.includes(option?.value)) {
										return <div>
											<CustomTooltip
												arrow={true}
												placement="bottom-start"
												title={option.description}
											>
												<MenuItem
													key={"index " + index}
													sx={{
														fontWeight: "100 !important",
														fontSize: outSideOfGrid ? "16px" : "14px",
														" &.Mui-selected": {
															backgroundColor:
																selectedOption != ""
																	? "#fff9cc !important"
																	: "#fff !important",
														},
													}}
													disabled={disableOptionsList?.includes(option?.value)}
													value={option.value}
												>
													<span className={'sd-label-cell-cls ' + (dropDownListExtraColumns?.length > 0 ? 'extra-col-label-cls' : '')}>{option.label}</span>
												</MenuItem>
											</CustomTooltip>
										</div>;
									} else if (columnBasedOptions) {
										return <MenuItem
											key={"index " + index}
											sx={{
												fontWeight: "100 !important",
												fontSize: outSideOfGrid ? "16px" : "14px",
												" &.Mui-selected": {
													backgroundColor:
														selectedOption != ""
															? "#fff9cc !important"
															: "#fff !important",
												},
											}}
											value={option.value}
										>
											<IQTooltip
												arrow={true}
												placement="bottom"
												title={option.label && option.label.length >= 70 ? option.label : null}
											>
												<span className={showExtraColumns ? "sd-label-extra-column-cell-cls" : "sd-label-cell-cls"}
													style={{ width: '50%' }}
												>
													{option.label}
												</span>
											</IQTooltip>


											{showColumnHeader && (
												<span className="sd-column-cell-cls">{option.colVal}</span>
											)}
											{/* Render column values based on dropDownListExtraColumns*/}
											{dropDownListExtraColumns?.length > 0 && (
												<>
													{dropDownListExtraColumns.map((colRec: any) => (
														<>
															{colRec?.name === 'label' ? null :
																<span className="custom-sd-label-cell-cls"
																	style={{ width: colRec?.colWidth }}
																>
																	{getColsBasedOptionsRenderVal(colRec, option, index, colRec?.showCol)}
																</span>
															}
														</>

													))}
												</>
											)}
										</MenuItem>;
									} else {
										return <MenuItem
											key={"index " + index}
											sx={{
												fontWeight: "100 !important",
												fontSize: outSideOfGrid ? "16px" : "14px",
												" &.Mui-selected": {
													backgroundColor:
														selectedOption != ""
															? "#fff9cc !important"
															: "#fff !important",
												},
											}}
											value={option.value}
										>
											{optionImage && option.img ? (
												<img
													src={option.img ? option.img : ""}
													style={{
														width: "24px",
														height: "24px",
														borderRadius: "50%",
														marginRight: "10px",
													}}
												/>
											) : null}
											{showDescription ? (
												<span className="sd-desc-option-cell-wrapper-cls">
													<span className={'sd-label-cell-cls ' + (dropDownListExtraColumns?.length > 0 ? 'extra-col-label-cls' : '')}>{option.label}</span>
													{(showDescription && option.description !== '') && (
														<IQTooltip
															arrow={true}
															placement="bottom"
															title={option.description && option.description.length >= 70 ? option.description : null}
														>
															<span className={"sd-desc-cell-cls sd-desc-option-cell-cls"} style={{ display: 'block' }}>
																{option.description}
															</span>
														</IQTooltip>
													)}
												</span>
											) : (
												<>
													<span className={'sd-label-cell-cls ' + (dropDownListExtraColumns?.length > 0 ? 'extra-col-label-cls' : '')}>{option.label}</span>
													{showIconInOptionsAtRight && (<div className="sd-icon-at-right" style={{backgroundColor:option.color}}><span className="common-icon-phase"></span></div>)}
												</>
											)}
											{/* <span className={'sd-label-cell-cls ' + (dropDownListExtraColumns?.length > 0 ? 'extra-col-label-cls' : '')}>{option.label}</span> */}
											{showColumnHeader && (
												<span className="sd-column-cell-cls">{option.colVal}</span>
											)}
											{/* Render column values based on dropDownListExtraColumns*/}
											{dropDownListExtraColumns?.length > 0 && (
												<div className="drop-down-list-extra-cols">
													{dropDownListExtraColumns.map((colRec: any) => (
														<span
															className={
																"drop-down-list-extra-cols_cell " +
																(!colRec.showValueOnTop
																	? "drop-down-list-extra-cols_cell-hidden"
																	: "")
															}
														>
															{getDynamicColRenderVal(colRec, option, index)}
														</span>
													))}
												</div>
											)}
										</MenuItem>;
									}
								}
								)
							) 
							// :
							// isTreeView ? (
							// 	<TreeView
							// 		aria-label="gmail"
							// 		defaultExpanded={allNodeIds || []}
							// 		defaultCollapseIcon={<ArrowDropDownIcon />}
							// 		defaultExpandIcon={<ArrowRightIcon />}
							// 		defaultEndIcon={<div style={{ width: 24 }} />}
							// 		multiSelect={isTreeMultiSelect}
							// 		onNodeSelect={!isTreeMultiSelect ? handleSingleTreeView : undefined}
							// 		selected={selectedNodes || []}
							// 	>
							// 			{renderTree(treeDataOptions)}
							// 	</TreeView>
							// )
							: !hideNoRecordMenuItem && (<div className="base-no-data">{noDataFoundMsg}</div>)
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
							paddingLeft: "6px",
						}}
					>
						Filter By
					</ListSubheader>
					<MenuItem
						sx={{ marginTop: 1, marginBottom: 1, paddingLeft: "6px" }}
						onClick={() => setFiltered([])}
					>
						<em>Clear</em>
					</MenuItem>
					{options?.map((option: any, index: number) => {
						return (
							option.label &&
							option.label != "null" && (
								<MenuItem key={index}>
									<FormControlLabel
										control={
											<Checkbox
												checked={filtered.includes(option.id)}
												onChange={() => handleFilterChange(option.id)}
												sx={{
													[`&.${checkboxClasses.checked}`]: {
														color: "#0590cd",
													},
													padding: 0,
													marginRight: 1,
												}}
											/>
										}
										label={option.label}
									/>
								</MenuItem>
							)
						);
					})}
				</Box>
			</Popover>
			{/* } */}
		</>
	);
};

SmartDropDown.defaultProps = {
	isSearchField: false,
	options: [],
	isFullWidth: false
};

export default SmartDropDown;