import React, { useState } from "react";
import {
	IconButton,
	ToggleButton,
	ToggleButtonGroup,
	Stack,
	Button,
	Box,
	Drawer,
} from "@mui/material";
import {
	Refresh,
	Add,
	EditOutlined,
	Delete,
	CloudDownload,
	CloudUpload,
	Construction,
	CameraAlt,
	Settings,
	Dehaze,
	Leaderboard,
	Sensors,
	ManageAccounts,
	Lock,
	PictureAsPdfOutlined,
	CalendarViewMonth,
	Close,
	AccountTree,
	Factory,
	HistoryEdu,
	Lan,
	Phishing,
	LockOpen,
} from "@mui/icons-material";
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import "./Toolbar.scss";
import IQTooltip from "components/iqtooltip/IQTooltip";
import {
	// setShowTableColumnsPopup,
	setShowTableViewType,
	getTableViewType,
	setShowSettingPopup,
	setImportPopup,
	getShowSettingPopup,
	getImportPopup,
	setRightPannel,
	setShowSettingPopup2,
	getShowSettingPopup2,
	setBudgetLocked,
	fetchBudgetLock
} from "../../features/budgetmanager/operations/tableColumnsSlice";
import { useAppSelector, useAppDispatch } from "app/hooks";
import ImportCSVData from "components/importcsv/ImportCSVData";
import BudgetTransferPanel from "../../features/budgetmanager/budgettransferpanel/BudgetTransferPanel";
import { fetchGridData, setGridData } from "../../features/budgetmanager/operations/gridSlice";
import { deleteBudgetLineItem } from "../../features/budgetmanager/operations/gridAPI";
import { getServer } from "app/common/appInfoSlice";
import convertDateToDisplayFormat, {
	getCurveText,
} from "utilities/commonFunctions";
import ViewBuilder from "../../features/budgetmanager/viewbuilder";
// import BudgetSettings from '../../features/budgetmanager/budgetSettings/BudgetSettings'
import { lockAndUnlockBudget } from "../../features/budgetmanager/operations/tableColumnsAPI";
import SUIDrawer from "sui-components/Drawer/Drawer";

const Toolbar = (props: any) => {
	const dispatch = useAppDispatch();
	const { selectedRows } = useAppSelector(state => state.gridData)
	const { selectedRow } = useAppSelector(state => state.rightPanel);
	const { isBudgetLocked } = useAppSelector(state => state.tableColumns);
	const handleUploadedFile = (file: any) => {

	};

	const tableViewType = useAppSelector(getTableViewType);
	const openSettingPopup = useAppSelector(getShowSettingPopup);
	const openSettingPopup2 = useAppSelector(getShowSettingPopup2);
	const openImportCSVPopup = useAppSelector(getImportPopup);
	const { gridData, originalGridApiData } = useAppSelector((state) => state.gridData);
	const appInfo = useAppSelector(getServer);
	const [disableDelete, setDisableDelete] = React.useState<boolean>(true);

	React.useEffect(() => {
		dispatch(fetchBudgetLock(appInfo))
	}, [])

	React.useEffect(() => {
		selectedRows.length > 0 ? setDisableDelete(false) : setDisableDelete(true);
	}, [selectedRows, gridData]);

	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if (value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};
	const handleDelete = () => {
		const selectedRowIds = selectedRows.map((row: any) => row.id);
		deleteBudgetLineItem(appInfo, selectedRowIds, (response: any) => {
			dispatch(fetchGridData(appInfo));
		});
		setDisableDelete(true);
		selectedRowIds.includes(selectedRow.id) && dispatch(setRightPannel(false));
	}

	const handleOnSearchChange = (searchText: string) => {
		if (originalGridApiData !== undefined && searchText !== '') {
			// These should come dynamically from columnDefs
			const curveObj: any = { 0: "Back Loaded", 1: "Front Loaded", 2: "Linear", 3: "Bell" }
			const columnDefsArray = ['division', 'name', 'costCode', 'costType', 'originalAmount', 'approvedBudgetChange', 'revisedBudget', 'balanceModifications', 'balance', 'curve', 'Vendors', 'estimatedStart', 'estimatedEnd']

			const resultData = originalGridApiData.filter((obj: any) => {
				const valuesArray: any = [];
				columnDefsArray.map((field: any) => {
					const value: any = obj[field]
					if (field === 'curve') { valuesArray.push(curveObj[value]) };
					if (['estimatedStart', 'estimatedEnd'].includes(field)) { valuesArray.push(convertDateToDisplayFormat(value)) }

					['string', 'number'].includes(typeof value) ? valuesArray.push(value)
						: typeof value === 'object' && value.length > 0 ?
							value.map((nestedObj: any) => {
								field === 'Vendors' ? valuesArray.push(nestedObj.name) : null
							})
							: valuesArray.push(value)
				})
				const contains = valuesArray.some((val: any) => val.toString().includes(searchText))

				if (contains) return obj;
			})
			dispatch(setGridData(resultData))
		}
		else {
			dispatch(setGridData(originalGridApiData))
		}
	}

	const handleLockBudget = () => {
		const payload = isBudgetLocked ? { "status": 1 } : { "status": 2 };
		lockAndUnlockBudget(appInfo, payload, (response: any) => {
			dispatch(setBudgetLocked(!isBudgetLocked));
		});
	}


	return (
		<Stack direction={"row"} className={"toolbar-root-container-budgetmanger"}>
			<div key="toolbar-buttons" className="toolbar-item-wrapper">
				<>
					<IQTooltip title="Refresh" style={{ marginRight: '7px', marginLeft: '15px' }} placement={"bottom"}>
						<IconButton
							aria-label="Refresh budgetmanager list"
							onClick={() => {
								dispatch(fetchGridData(appInfo));
							}}
						>
							<span className="common-icon-refresh"></span>
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Export" style={{ marginRight: '7px', marginLeft: '7px' }} placement={"bottom"}>
						<IconButton
							aria-label="Export budgetmanager"
							onClick={() => {
								dispatch(setImportPopup(true));
							}}
						>
							<CloudUpload />
						</IconButton>
					</IQTooltip>
					<IQTooltip title="Delete" style={{ marginRight: '7px', marginLeft: '7px' }} placement={"bottom"}>
						<IconButton
							aria-label="Delete budgetmanager"
							disabled={disableDelete}
							onClick={handleDelete}
						>
							<Delete />
						</IconButton>
					</IQTooltip>
				</>
			</div>
			<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
				<ViewBuilder sx={{ height: "4vh", width: "20rem" }}
					groups={getGroupMenuOptions()}
					filters={getFilterMenuOptions()}
					onSearchChange={(text: string) => handleOnSearchChange(text)}
					lefticon={true}
					Righticon={true}
				/>
			</div>
			<div
				key="spacer"
				className="toolbar-item-wrapper toolbar-group-button-wrapper"
			>
				<ToggleButtonGroup
					exclusive
					value={tableViewType}
					size="small"
					onChange={handleView}
					aria-label="Inventory tab view buttons"
				>
					<ToggleButton value={"Calendar"} aria-label="Budget details tab">
						<CalendarViewMonth />
					</ToggleButton>
					<ToggleButton value={"Chart"} aria-label="Analytics tab">
						<Leaderboard />
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
						aria-label="settings budgetmanager"
						onClick={() => dispatch(setShowSettingPopup2(true))}
						style={{
							border: "1px solid #80808052",
							borderRadius: "4px",
							padding: "2px 4px 2px 4px",
							margin: "0px 8px 0px 8px",
						}}
					>
						<Settings />
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
					<Box sx={{ width: "18vw", height: "50%" }} role="presentation">
						<Stack
							direction="row"
							sx={{ justifyContent: "end", height: "5em" }}
						>
							<IconButton
								aria-label="Close Right Pane"
								onClick={() => dispatch(setShowSettingPopup(false))}
							>
								<Close />
							</IconButton>
						</Stack>
						<div style={{ height: "70%" }}>
							<BudgetTransferPanel />
						</div>
					</Box>
				</SUIDrawer>
			)}
			{openSettingPopup2 && (
				<SUIDrawer
					PaperProps={{
						style: {
							position: "absolute",
							width: "calc(100vw - 76vw)",
							height: '100%',
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
						{/* <BudgetSettings /> */}
					</>
				</SUIDrawer>
			)}
		</Stack>
	);
};

export default Toolbar;

const getGroupMenuOptions = () => {
	return [{
		text: 'Type',
		value: 'type',
		icon: <Phishing />
	}, {
		text: 'Category',
		value: 'category',
		icon: <AccountTree />
	}, {
		text: 'Sub Category',
		value: 'sub-category',
		icon: <Lan />
	}];
};

const getFilterMenuOptions = () => {
	return [{
		text: 'Type',
		value: 'type',
		icon: <Phishing />,
		children: {
			type: 'checkbox',
			items: [{
				text: 'Tools',
				value: 'tools'
			}, {
				text: 'Equipment',
				value: 'equipment'
			}]
		}
	}, {
		text: 'Category',
		value: 'category',
		icon: <AccountTree />
	}, {
		text: 'Manufacturer',
		value: 'manufacturer',
		icon: <Factory />
	}, {
		text: 'Model',
		value: 'model',
		icon: <HistoryEdu />
	}];
};