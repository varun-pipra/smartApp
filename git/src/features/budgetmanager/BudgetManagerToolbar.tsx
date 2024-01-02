import {useState, useEffect} from "react";
import {
	IconButton,
	ToggleButton,
	ToggleButtonGroup,
	Stack,
	Button,
	Box
} from "@mui/material";
import {
	Lock, Close, GridOn, TableRows
} from "@mui/icons-material";
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import "./BudgetManagerToolbar.scss";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQSearch from "components/iqsearchfield/IQSearchField";
import {
	setShowTableViewType,
	getTableViewType,
	setShowSettingPopup,
	setImportPopup,
	getShowSettingPopup,
	getImportPopup,
	setRightPannel,
	setShowSettingPopup2, setBudgetLocked,
	fetchBudgetLock,
	getViewBuilderPopup,
	setShowSettingPopup3, setToastMessage
} from "./operations/tableColumnsSlice";
import {useAppSelector, useAppDispatch} from "app/hooks";
import ImportCSVData from "components/importcsv/ImportCSVData";
import BudgetTransferPanel from "./budgettransferpanel/BudgetTransferPanel";
import {fetchGridData, setSelectedGroupKey, setSelectedFilters, setSearchText} from "./operations/gridSlice";
import {deleteBudgetLineItem} from "./operations/gridAPI";
import {getServer, getCostCodeDivisionList, getCostTypeList} from "app/common/appInfoSlice";

import {lockAndUnlockBudget} from "./operations/tableColumnsAPI";
import SUIDrawer from "sui-components/Drawer/Drawer";
import ViewBuilderGrid from "./managetablecolumns/ViewBuilderGrid";
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SaveIcon from "resources/images/common/Save.svg";
import SaveAsIcon from "resources/images/common/Saveas.svg";
import EditIcon from "resources/images/common/Edit.svg";
import DeleteIcon from "resources/images/common/Delete.svg";
import NewviewIcon from "resources/images/common/Newgridview.svg";
import SUIAlert from "sui-components/Alert/Alert";
import {getBidStatusIdFromText, statusFilterOptions} from "utilities/bid/enums";
import {vendorContractsStatusFilterOptions} from "utilities/vendorContracts/enums";
import {ReportAndAnalyticsToggle} from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';

const BudgetManagerToolbar = (props: any) => {
	const dispatch = useAppDispatch();
	const {selectedRows, bidPackagesList, vendorContractsList, clientContractsList} = useAppSelector(state => state.gridData);
	const {selectedRow} = useAppSelector(state => state.rightPanel);
	const {isBudgetLocked} = useAppSelector(state => state.tableColumns);
	const tableViewType = useAppSelector(getTableViewType);
	const openSettingPopup = useAppSelector(getShowSettingPopup);
	const viewBuilderPopup = useAppSelector(getViewBuilderPopup);
	const openImportCSVPopup = useAppSelector(getImportPopup);
	const costCodeDivisionOpts = useAppSelector(getCostCodeDivisionList);
	const costTypeOpts = useAppSelector(getCostTypeList);
	const {gridData, originalGridApiData} = useAppSelector((state) => state.gridData);
	const appInfo = useAppSelector(getServer);
	const [disableDelete, setDisableDelete] = useState<boolean>(true);
	const [showNewAddLineItemBtn, setShowNewAddLineItemBtn] = useState<boolean>(false);
	const {viewData} = useAppSelector(state => state.viewBuilder);
	const [alert, setAlert] = useState<boolean>(false);
	// const [filteredRecords, setFilteredRecords] = useState<any>([]);
	// const [activeFilters, setActiveFilters] = useState<any>({});
	// const [searchText, setSearchText] = useState<string>('');
	// const [searchResults, setSearchResults] = useState<any>([]);
	const [locations, setLocations] = useState<any>([]);
	const [gridRefreshed, setGridRefreshed] = useState<any>(false);
	const [vendors, setVendors] = useState<any>([]);

	useEffect(() => {
		if(originalGridApiData?.length > 0) {
			let locationRecords: any = [];
			let vendorRecords : any = [];
			originalGridApiData.forEach((rec: any) => {
				if(rec.locations?.length > 0) {
					rec.locations.forEach((item: any) => {
						if(locationRecords.findIndex((obj: any) => obj.id === item.id) === -1) {
							locationRecords.push(item);
						}
					});
				} 
				if (rec.Vendors?.length > 0) {
					rec.Vendors.forEach((item: any) => {
						if(vendorRecords.findIndex((obj: any) => obj.id === item.id) === -1) {
							vendorRecords.push(item);
						}
					});
				}
			});
			setLocations(locationRecords);
			setVendors(vendorRecords);
		}
	}, [originalGridApiData]);


	useEffect(() => {
		dispatch(fetchBudgetLock(appInfo));
	}, []);

	const filterOptions = [
		{
			text: "Division / Cost Code",
			value: "costCode",
			key: "costCode",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: costCodeDivisionOpts,
			},
		},
		{
			text: "Cost Type",
			value: "costType",
			key: "costType",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: costTypeOpts,
			},
		},
		{
			text: "Curve",
			value: "curve",
			key: "curve",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{text: "Back Loaded", id: '2', value: '2', key: '2'},
					{text: "Front Loaded", id: '0', value: '0', key: '2'},
					{text: "Linear", id: '3', value: '3', key: '3'},
				],
			},
		},
		{
			text: "Bid Package Name",
			value: "bidPackage",
			key: "bidPackage",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: []
			},
		},
		{
			text: "Bid Status",
			value: "bidStatus",
			key: "bidStatus",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: statusFilterOptions
			},
		},
		{
			text: "Vendor Contract Name",
			value: "vendorContract",
			key: "vendorContract",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: []
			},
		},
		{
			text: "Vendor Contract Status",
			value: "vendorStatus",
			key: "vendorStatus",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: vendorContractsStatusFilterOptions
			},
		},
		{
			text: "Vendor",
			value: "Vendors",
			key: "Vendors",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: []
			},
		},

		{
			text: "Client Contract Name",
			value: "clientContract",
			key: "clientContract",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: []
			},
		},
		{
			text: "Client Contract Status",
			value: "clientStatus",
			key: "clientStatus",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: vendorContractsStatusFilterOptions
			},
		},
		{
			text: "Location",
			value: 'location',
			key: 'location',
			children: {
				type: "checkbox",
				items: []
			},
		}
	];

	const [filters, setFilters] = useState<any>(filterOptions);

	useEffect(() => {
		const filtersCopy = [...filters];
		let costCodeItem = filtersCopy.find((rec: any) => rec?.value === "costCode");
		let costTypeItem = filtersCopy.find((rec: any) => rec?.value === "costType");
		let bidItem = filtersCopy.find((rec: any) => rec?.value === "bidPackage");
		let vendorItem = filtersCopy.find((rec: any) => rec?.value === "vendorContract");
		let clientItem = filtersCopy.find((rec: any) => rec?.value === "clientContract");
		let locationItem = filtersCopy.find((rec: any) => rec?.value === "location");
		let vendorsItem = filtersCopy.find((rec: any) => rec?.value === "Vendors");
		const costTypeOptions = costTypeOpts?.map((opt: any) => {return {text: opt?.label, id: opt?.value, value: opt?.value, key: opt?.value};});
		const costCodeDivisionOptions = costCodeDivisionOpts?.map((opt: any) => {return {text: opt?.name, id: opt?.name, value: opt?.name, key: opt?.name};});
		const locationOptions = (locations || []).map((opt: any) => {
			return {
				text: opt.name,
				id: opt.id?.toString(),
				value: opt.id?.toString(),
				key: opt.id
			};
		});
		const vendorsOptions = (vendors || []).map((opt: any) => {
			return {
				text: opt.name,
				id: opt.id?.toString(),
				value: opt.id?.toString(),
				key: opt.id
			};
		});
		// console.log("costTypeOpts", costTypeOpts, costTypeOptions, costCodeDivisionOpts, costCodeDivisionOptions);
		costCodeItem.children.items = costCodeDivisionOptions;
		costTypeItem.children.items = costTypeOptions;
		bidItem.children.items = bidPackagesList;
		vendorItem.children.items = vendorContractsList;
		clientItem.children.items = clientContractsList;
		locationItem.children.items = locationOptions;
		vendorsItem.children.items = vendorsOptions;
		setFilters(filtersCopy);
	}, [bidPackagesList, vendorContractsList, clientContractsList, costTypeOpts, costCodeDivisionOpts, locations, vendors]);

	useEffect(() => {
		selectedRows.length > 0 ? setDisableDelete(false) : setDisableDelete(true);
	}, [selectedRows, gridData]);

	const handleUploadedFile = (file: any) => {};

	const handleView = (event: any, value: string) => {
		if(value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};

	const handleDelete = () => {
		setAlert(true);
	};

	const handleListChanges = (val: string) => {
		if(val == 'yes') {
			const selectedRowIds = selectedRows.map((row: any) => row.id);
			deleteBudgetLineItem(appInfo, selectedRowIds, (response: any) => {
				dispatch(fetchGridData(appInfo));
				dispatch(setToastMessage({displayToast: true, message: `Selected Record Deleted Successfully`}));
			});
			setDisableDelete(true);
			selectedRowIds.includes(selectedRow.id) && dispatch(setRightPannel(false));
			setAlert(false);
		}
		else {
			setAlert(false);
		}
	};

	const handleRefresh = () => {
		dispatch(fetchGridData(appInfo));
		setTimeout(() => {
			setGridRefreshed(true);
		}, 2000);
	};

	const handleOnSearchChange = (searchText: string) => {
		dispatch(setSearchText(searchText));
	};

	const handleFilterChange = (filters: any, text: any = null) => {
		dispatch(setSelectedFilters(filters));
	};

	const handleLockBudget = () => {
		const payload = isBudgetLocked ? {"status": 1} : {"status": 2};
		lockAndUnlockBudget(appInfo, payload, (response: any) => {
			dispatch(setBudgetLocked(!isBudgetLocked));
		});
	};

	const onGridGroupingChange = (selectedVal: any) => {
		dispatch(setSelectedGroupKey(selectedVal));
	};

	return (
		<Stack direction={"row"} className={"toolbar-root-container-budgetmanger"}>
			<div key="toolbar-buttons" className="toolbar-item-wrapper options-wrapper">
				<>
					<IQTooltip title="Refresh" placement={"bottom"}>
						<IconButton
							aria-label="Refresh budgetmanager list"
							onClick={handleRefresh}
						>
							<span className="common-icon-refresh"></span>
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Delete" placement={"bottom"}>
						<IconButton
							aria-label="Delete budgetmanager"
							disabled={disableDelete}
							onClick={handleDelete}
						>
							<span className="common-icon-delete"></span>
						</IconButton>
					</IQTooltip>
				</>
			</div>
			<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
				<IQSearch
					groups={getGroupMenuOptions()}
					filters={filters}
					filterHeader=''
					placeholder={viewData && viewData?.viewName}
					defaultGroups='division'
					onGroupChange={onGridGroupingChange}
					onSearchChange={(text: string) => handleOnSearchChange(text)}
					onFilterChange={(filters: any) => handleFilterChange(filters)}
				/>
			</div>
			<div key="spacer" className="toolbar-item-wrapper toolbar-group-button-wrapper" >
				{<ReportAndAnalyticsToggle />}
				<ToggleButtonGroup
					exclusive
					value={tableViewType}
					size="small"
					onChange={handleView}
					aria-label="Inventory tab view buttons"
				>
					<ToggleButton value={"Calendar"} aria-label="Budget details tab">
						{/* <CalendarViewMonth /> */}
						<GridOn />
					</ToggleButton>
					<ToggleButton value={"Chart"} aria-label="Analytics tab">
						{/* <Leaderboard /> */}
						<AssessmentOutlinedIcon />
					</ToggleButton>
				</ToggleButtonGroup>
				<Button
					variant="outlined"
					startIcon={isBudgetLocked ? <LockOpenTwoToneIcon /> : <Lock />}
					className="lockbuget-button"
					onClick={handleLockBudget}
				>
					{isBudgetLocked ? 'Unlock Budget' : 'Lock Budget'}
				</Button>
				<IQTooltip title="Settings" placement={"bottom"}>
					<IconButton
						className='settings-button'
						aria-label="settings budgetmanager"
						onClick={() => dispatch(setShowSettingPopup2(true))}
					>
						<TableRows />
					</IconButton>
				</IQTooltip>
				{/* <IQTooltip title="Tab" placement={"bottom"}>
					<IconButton
						aria-label="settings budgetmanager"
						onClick={() => dispatch(setShowSettingPopup(true))}
					>
						<Dehaze />
					</IconButton>
				</IQTooltip> */}
			</div>
			{openImportCSVPopup ? (
				<ImportCSVData
					open={true}
					onClose={() => {
						dispatch(setImportPopup(false));
					}}
					onFileUploaded={(file) => {
						handleUploadedFile(file);
					}}
				/>
			) : (
				<></>
			)}
			{openSettingPopup && (
				<SUIDrawer
					PaperProps={{
						style: {
							position: "fixed",
							marginTop: "8%",
							marginRight: "3%",
							height: "74%",
						},
					}}
					anchor="right"
					variant="permanent"
					elevation={2}
				// open={false}
				>
					<Box sx={{width: "18vw", height: "50%"}} role="presentation">
						<Stack
							direction="row"
							sx={{justifyContent: "end", height: "5em"}}
						>
							<IconButton
								aria-label="Close Right Pane"
								onClick={() => dispatch(setShowSettingPopup(false))}
							>
								<Close />
							</IconButton>
						</Stack>
						<div style={{height: "70%"}}>
							<BudgetTransferPanel />
						</div>
					</Box>
				</SUIDrawer>
			)}

			{viewBuilderPopup && (
				<ViewBuilderGrid
					open={true}
					newAddLineItemBtn={showNewAddLineItemBtn}
					onClose={(value: any) => {
						dispatch(setShowSettingPopup3(false));
					}}
				/>
			)}
			<SUIAlert
				open={alert}
				contentText={<span>Are you sure want to continue?</span>}

				title={'Confirmation'}
				onAction={(e: any, type: string) => handleListChanges(type)}
			/>
			{/* {openViewPopup && 
				
					
				} */}
			{/* {openViewFilter && (
				<Box sx={{ width: "18vw", height: "50%" }} role="presentation"
				>
					hiii
			</Box>
			)} */}
			{/* {openSettingPopup2 && (
				<SUIDrawer
					PaperProps={{
						style: {
							position: "absolute",
							width: "calc(100vw - 72vw)",
							height: budgetManagerMaximized ? 'calc(100% - 0px)' : 'calc(100% - 0px)',
							overflow: 'auto',
						}

					}}

					sx={{
						'& .MuiPaper-root': {
							border: "1px solid rgba(0, 0, 0, 0.12) !important"
						}
					}}
					anchor="right"
					variant="permanent"
					elevation={2}
				// open={false}
				>
					<>
						<Stack direction="row" sx={{ justifyContent: "end" }}>
							<IconButton
								color='default'
								size='small'
								aria-label="Close Right Pane"
								onClick={() => dispatch(setShowSettingPopup2(false))}
								sx={{
									background: "gray",
									borderRadius: '50px',
									padding: '2px !important',
									color: 'white',
									margin: '10px 5px 0px 0px',
									':hover': {
										background: 'transparent',
										color: 'gray'
									}
								}}
							>
								<Close sx={{ fontSize: '1rem !important' }} />
							</IconButton>
						</Stack>
						<BudgetSettings />
					</>
				</SUIDrawer>
			)} */}
		</Stack>
	);
};

export default BudgetManagerToolbar;

const getGroupMenuOptions = () => {
	return [{
		text: 'Division',
		value: 'costCode',
		iconCls: ''
	}, {
		text: 'Cost Type',
		value: 'costType',
		iconCls: ''
	}, {
		text: 'Cost Code',
		value: 'division',
		iconCls: ''
	},
	{
		text: 'Location',
		value: 'locations',
		iconCls: ''
	},
	{
		text: 'Vendor',
		value: 'Vendors',
		iconCls: ''
	},
		// {
		// 	text: 'Status',
		// 	value: 'status',
		// 	iconCls: ''
		// }
	];
};
const getViewFilters = () => {
	return [{
		text: 'New View',
		value: 'new',
		icon: <Box component='img' alt='New View' src={NewviewIcon} className='image' width={25} height={25} color={'#666666'} />
	}, {
		text: 'Save',
		value: 'save',
		icon: <Box component='img' alt='Save' src={SaveIcon} className='image' width={25} height={25} color={'#666666'} />
	},
	{
		text: 'Save As',
		value: 'saveAs',
		icon: <Box component='img' alt='Save As' src={SaveAsIcon} className='image' width={25} height={25} color={'#666666'} sx={{marginLeft: '-2px!important'}} />
	},
	{
		text: 'Edit',
		value: 'edit',
		icon: <Box component='img' alt='Edit' src={EditIcon} className='image' width={25} height={25} color={'#666666'} />
	},
	{
		text: 'Delete',
		value: 'delete',
		icon: <Box component='img' alt='Delete' src={DeleteIcon} className='image' width={25} height={25} color={'#666666'} />
	},
	];
};

const getFilterMenuOptions = () => {
	return [
		{
			text: 'Standard Views',
			value: 'type',
		},
		{
			text: 'Public  Views',
			value: 'type',
		},
		{
			text: 'Private Views',
			value: 'type',
		},
	];
};