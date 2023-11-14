import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";

import { getTradesData, setTrades } from "../../operations/vendorInfoSlice";
import { styled } from "@mui/material/styles";
import { PopperPlacementType } from "@mui/material/Popper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box/Box";
import TextField from "@mui/material/TextField/TextField";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import Button from "@mui/material/Button/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Popover from "@mui/material/Popover";
import ListSubheader from "@mui/material/ListSubheader/ListSubheader";
import CompanyType from "./CompanyType";
import Trades from "./Trades";

import "./Vendor.scss";

type VendorProps = {
	value?: any;
	handleVendorChange?: (value: string[], params: any) => void;
	params?: any;
	outSideOfGrid?: boolean;
	icon?: React.ReactElement;
	multiSelect?: boolean;
	width?: string;
	showFilter?: boolean;
	showFilterInSearch?: boolean;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 5.2 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		position: "relative",
		marginTop: "-6px !important",
		padding: "1em 1em",
		backgroundColor: "#333333",
		color: "#FFFFFF",
		borderRadius: "6px",
		fontSize: "14px",
		fontFamily: "Roboto-Regular",
	},
}));

const CompanyTypeData = [
	{
		name: "Prime Contractors",
		id: 1,
		checked: true,
		value: 2,
	},
	{
		name: "Sub Contractors",
		id: 2,
		checked: true,
		value: 1,
	},
	{
		name: "Suppliers",
		id: 3,
		checked: true,
		value: 0,
	},
];

const VendorList: React.FC<VendorProps> = ({
	value,
	handleVendorChange,
	params,
	outSideOfGrid = false,
	icon,
	multiSelect = true,
	width = "0px",
	showFilter = false,
	showFilterInSearch = false,

}) => {
	const dispatch = useAppDispatch();
	const { vendorData } = useAppSelector((state) => state.vendorData);
	// console.log('vendorData', vendorData)
	const [search, setSearch] = React.useState<string>("");
	const [searchTrade, setSearchTrade] = React.useState<string>("");
	const [vendor, setVendor] = React.useState(vendorData);
	const [vendorName, setVendorName] = React.useState<any[]>([]);
	const [filtered, setFiltered] = React.useState<number[]>([]);

	const [filterPopupEl, setFilterPopupEl] = React.useState<HTMLButtonElement | null>(null);
	const showFilterPopup = Boolean(filterPopupEl);

	const [anchorElForCompanyType, setAnchorElCompanyType] = React.useState<HTMLDivElement | null>(null);
	const [openCompanyType, setOpenComponnetType] = React.useState(false);

	const [placementCompanyType, setPlacementCompanyType] = React.useState<PopperPlacementType>();
	const [checkedItems, setCheckedItems] = useState<any>(CompanyTypeData);
	const [filteredData, setFilteredData] = React.useState<any[]>([]);

	const [anchorElForTrades, setAnchorElTrades] = React.useState<HTMLDivElement | null>(null);
	const openTrades = Boolean(anchorElForTrades);
	const trades = useAppSelector(getTradesData);
	const [tradeItems, setTradeItems] = React.useState<any[]>([]);

	const [componentTypeSearchString, setCompanyTypeSearchString] = React.useState<any[]>([]);
	const [tradeSearchString, setTradeSearchString] = React.useState<any[]>([]);

	React.useEffect(() => {
		dispatch(setTrades(vendorData));
	}, []);

	React.useEffect(() => {
		setVendor(vendorData)
	}, [vendorData]);

	React.useEffect(() => {
		handleInitialValueOfTradeItems()
	}, [trades]);

	const handleInitialValueOfTradeItems = () => {
		let updatedTradeItems = JSON.parse(JSON.stringify(trades));
		if (updatedTradeItems && updatedTradeItems.length > 0) {
			updatedTradeItems.forEach((element: any) => {
				element.checked = true;
			});
		}
		setTradeItems(updatedTradeItems);
	}
	React.useEffect(() => {
		if (value && value.length > 0) {
			let result = vendor.filter((o1: { uniqueId: string }) =>
				value.some((o2: { id: string }) => o1.uniqueId === o2.id)
			);
			setVendorName(result);
		}
		if (value && value.length === 0) {
			setVendorName([]);
		}
	}, []);

	if (outSideOfGrid) {
		React.useEffect(() => {
			if (value && value.length > 0) {
				let result = vendor.filter((o1: { uniqueId: string }) =>
					value.some((o2: string) => o1.uniqueId === o2)
				);
				if (result && result.length === 0) {
					result = vendor.filter((o1: { uniqueId: string }) =>
						value.some((o2: { id: string }) => o1.uniqueId === o2.id)
					);
				}
				setVendorName(result);
			}
			if (value && value.length === 0) {
				setVendorName([]);
			}
		}, [value]);
	}

	const handleChange = (event: SelectChangeEvent<any[]>) => {
		event.stopPropagation();
		const {
			target: { value },
		} = event;
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
			handleSingleVendor(value);
		}
		setVendorName(duplicateRemoved);
	};

	const handleSingleVendor = (singleVendor: any) => {
		if (handleVendorChange && singleVendor) {
			handleVendorChange([singleVendor.uniqueId], params);
		}
	};

	const handleVendorUniqeId = () => {
		if (handleVendorChange && vendorName && vendorName.length > 0) {
			let vendorIdArr: string[] = [];
			vendorName.forEach((item: any) => {
				vendorIdArr.push(item.uniqueId);
			});
			handleVendorChange(vendorIdArr, params);
		}
	};

	const handleClose = () => {
		if (multiSelect) {
			handleVendorUniqeId();
		}
		handleFilterPopupClose();
		checkedItems.map((item: any) => {
			item.checked = true;
		});
		setCheckedItems(checkedItems);
		setFilteredData([]);
	};

	const handleFilterPopupClose = () => {
		setFilterPopupEl(null);
		setAnchorElCompanyType(null);
		setOpenComponnetType(false);
		setPlacementCompanyType(undefined);

		setAnchorElTrades(null);
		handleSearchFilter();
	};
	const handleTradePopupClose = () => {
		setAnchorElTrades(null);
	}


	const handleVendorSearch = (searchValue: string) => {
		setSearch(searchValue);
		if (filteredData && filteredData.length === 0) {
			let searchedData: any[] = vendorData.filter((d: any) => {
				let v = d.name.toLowerCase().includes(searchValue.toLowerCase());
				return v;
			});
			setVendor([...searchedData]);
		} else {
			let searchedData: any[] = filteredData.filter((d: any) => {
				let v = d.name.toLowerCase().includes(searchValue.toLowerCase());
				return v;
			});
			setFilteredData([...searchedData]);
		}
	};

	const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
		setFilterPopupEl(event.currentTarget);
	};

	const handleCompanyType =
		(newPlacement: PopperPlacementType) =>
			(event: React.MouseEvent<HTMLDivElement>) => {
				setAnchorElTrades(null);

				setAnchorElCompanyType(event.currentTarget);
				setOpenComponnetType(
					(prev) => placementCompanyType !== newPlacement || !prev
				);
				setPlacementCompanyType(newPlacement);
			};

	const handleSearchFilter = () => {
		let searchedVendorData: any[] = [];
		if (vendor && vendor.length > 0) {
			vendor.map((vendorData: any) => {
				if (componentTypeSearchString && componentTypeSearchString.length > 0) {
					componentTypeSearchString.map((searchedItem: any) => {
						if (
							searchedItem.checked &&
							searchedItem.value === vendorData.companyType
						) {
							searchedVendorData.push(vendorData);
						}
					});
				}
			});
			if (searchedVendorData && searchedVendorData.length > 0) {
				searchedVendorData.map((vendorData: any) => {
					if (tradeSearchString && tradeSearchString.length > 0) {
						tradeSearchString.map((searchedItem: any) => {
							if (
								searchedItem.checked &&
								vendorData.trade &&
								vendorData.trade.length > 0
							) {
								vendorData.trade.map((item: any) => {
									if (item.name === searchedItem.name) {
										searchedVendorData.push(vendorData);
									}
								});
							}
						});
					}
				});
			} else if (searchedVendorData && searchedVendorData.length === 0) {
				vendor.map((vendorData: any) => {
					if (tradeSearchString && tradeSearchString.length > 0) {
						tradeSearchString.map((searchedItem: any) => {
							if (
								searchedItem.checked &&
								vendorData.trade &&
								vendorData.trade.length > 0
							) {
								vendorData.trade.map((item: any) => {
									if (item.name === searchedItem.name) {
										searchedVendorData.push(vendorData);
									}
								});
							}
						});
					}
				});
			}
		}
		setFilteredData([...searchedVendorData]);
	};

	const handleFilterComponetType = (searchString: any) => {
		setCompanyTypeSearchString(searchString);
	};

	const handleFilterTrade = (searchString: any) => {
		setTradeSearchString(searchString);
	};

	const handleTrade =
		(newPlacement: PopperPlacementType) =>
			(event: React.MouseEvent<HTMLDivElement>) => {
				setAnchorElCompanyType(null);
				setOpenComponnetType(false);
				setPlacementCompanyType(undefined);

				setAnchorElTrades(event.currentTarget);
			};

	const handleSearchTrade = (searchValue: string) => {
		setSearchTrade(searchValue);
		if (searchValue !== '') {
			let searchedData: any[] = tradeItems.filter((d: any) => {
				let v = d.name.toLowerCase().includes(searchValue.toLowerCase());
				return v;
			});
			setTradeItems([...searchedData]);
		}
		else {
			setTradeItems([...trades]);
		}
	};

	const handleSearchClear = () => {
		setSearch("");
		setVendor(vendorData);
	};

	const vedorMenuItems = (item: any, idx: number) => {
		return (
			<MenuItem
				key={item.uniqueId + idx}
				value={item}
				className="vendor-custom-menu-item"
			>
				<>
					{multiSelect && <Checkbox
						checked={
							vendorName.findIndex((vendor: any) => item.id === vendor.id) >= 0
						}
					/>}
					<div
						className={multiSelect ? "custom-line" : 'custom-line2'}
						style={{ backgroundColor: `#${item.colorCode}` }}
					></div>
					{!!item.thumbnailUrl && (
						<img
							src={item.thumbnailUrl}
							alt="Avatar"
							style={{ width: "28px", height: "28px" }}
							className="custom-img"
						/>
					)}
					<CustomTooltip
						arrow={true}
						title={item.name.length > 24 ? <div>{item.name}</div> : ""}
						className={"vendor-menuItem-tooltip-styles"}
					>
						<ListItemText
							primary={item.name}
							className={
								!outSideOfGrid
									? "vendor-custome-styles"
									: "vendor-custom-outsidegrid"
							}
						/>
					</CustomTooltip>
				</>
			</MenuItem>
		);
	};

	const handleClearAllFilter = () => {
		handleInitialValueOfTradeItems()
		checkedItems.map((item: any) => {
			item.checked = true;
		});
		setCheckedItems(checkedItems);
		setFiltered([])
	}

	return (
		<div>
			<FormControl
				variant="standard"
				sx={{
					width: outSideOfGrid ? "100%" : 210,
					maxWidth: outSideOfGrid ? "100%" : 210,
				}}
			>
				<CustomTooltip
					arrow={true}
					title={
						vendorName.map((x: any) => x.name).join(", ").length > 23
							? vendorName.map((x: any) => {
								return (
									<div key={x.name} className="vendor-tooltip">
										{x.name}
									</div>
								);
							})
							: ""
					}
					className={"vendor-custom-tooltip-styles"}
				>
					<span>
						<Select
							className={
								outSideOfGrid
									? "vendor-custom-outsidegrid"
									: "vendor-custome-styles"
							}
							labelId="demo-multiple-checkbox-label"
							id="demo-multiple-checkbox"
							multiple={multiSelect}
							variant="standard"
							displayEmpty
							value={vendorName}
							onChange={handleChange}
							onClose={handleClose}
							renderValue={(selected: any) => {
								if (selected.length === 0 && vendorName?.length === 0) {
									return <div>Select Vendor</div>;
								} else if (vendorName && vendorName.length > 0) {
									return <>{vendorName.map((x: any) => x.name).join(", ")}</>;
								}
								return selected.map((x: any) => x.name).join(", ");
							}}
							MenuProps={MenuProps}
							IconComponent={undefined}
							style={{ width: width }}
							startAdornment={
								icon && <InputAdornment position="start">{icon}</InputAdornment>
							}
							endAdornment={
								<>
									{showFilter && <InputAdornment position="end">
										<Button
											onClick={handleClickFilter}
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
											<div className={`common-icon-Filter ${filteredData.length == 0 ? 'common-icon-Filter' : 'budget-Filter-blue'}`}></div>
											{/* <div className="budget-Filter"></div> */}

										</Button>
									</InputAdornment>}
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
									}
									: {
										".MuiSelect-icon": {
											display: "none",
										}
									}
							}
						>
							{/* <span>vendor :  {vendor.length}</span><br />
							<span>filtered : {filteredData.length}</span><br /> */}
							<Box p={1} className="search-wrapper">
								<TextField
									size="small"
									fullWidth
									tabIndex={1}
									value={search}
									onChange={(event: any) => handleVendorSearch(event.target.value)}
									placeholder="Search"
									className="search-text-field"
									onKeyDown={(e) => {
										if (e.key !== "Escape") {
											e.stopPropagation();
										}
									}}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												{showFilterInSearch && <Button
													onClick={handleClickFilter}
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
														marginRight: "10px",
														padding: "1px",
														height: "24px",
														minWidth: "24px",
													}}
												>
													{/* <CalendarViewMonthIcon sx={{ width: "20px" }} /> */}
													<div className="common-icon-Filter"></div>
												</Button>
												}
												{vendor.length > 0 ? (
													<SearchIcon fontSize="small" />
												) : (
													<ClearIcon
														onClick={handleSearchClear}
														style={{ cursor: "pointer" }}
													/>
												)}
											</InputAdornment>
										),
									}}
								></TextField>
							</Box>

							{vendor && vendor.length > 0 && filteredData.length == 0 ? (
								vendor.map((item: any, idx: number) => {
									return vedorMenuItems(item, idx);
								})
							) : filteredData && filteredData.length > 0 ? (
								filteredData.map((item: any, idx: number) => {
									return vedorMenuItems(item, idx);
								})
							) : (
								<MenuItem>No records found</MenuItem>
							)}
						</Select>
					</span>
				</CustomTooltip>
			</FormControl>
			{showFilterPopup && (
				<Popover
					open={showFilterPopup}
					anchorEl={filterPopupEl}
					onClose={handleFilterPopupClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
				>
					<Box padding={1} className="filter_box">
						<ListSubheader
							sx={{
								fontWeight: "600",
								lineHeight: 1.8,
							}}
						>
							Filter By
						</ListSubheader>
						<MenuItem onClick={handleClearAllFilter}><em>Clear</em></MenuItem>
						<MenuItem>
							<div className="flex-container" onClick={handleCompanyType("right-start")}>
								<div className="flex-child filter_menu_item_1">Company Type</div>
								<div className="flex-child green"><PlayArrowIcon fontSize="small" className="play_icon" /></div>
							</div>
						</MenuItem>
						<MenuItem>
							<div className="flex-container" onClick={handleTrade("right-start")}>
								<div className="flex-child filter_menu_item_2">Trades</div>
								<div className="flex-child green"><PlayArrowIcon fontSize="small" className="play_icon" /></div>
							</div>
						</MenuItem>
					</Box>
				</Popover>
			)}
			{openCompanyType && (
				<CompanyType
					open={openCompanyType}
					anchor={anchorElForCompanyType}
					placement={placementCompanyType}
					handleFilterVendors={handleFilterComponetType}
					items={checkedItems}
				/>
			)}
			{openTrades && (
				<Trades
					open={openTrades}
					close={() => setAnchorElTrades(null)}
					anchor={anchorElForTrades}
					handleFilterVendors={handleFilterTrade}
					items={tradeItems}
					handleSearch={handleSearchTrade}
					search={searchTrade}
				/>
			)
			}
		</div >
	);
};

export default VendorList;
