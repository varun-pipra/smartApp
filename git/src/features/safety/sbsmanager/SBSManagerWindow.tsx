import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";
import {
	Box,
	Button,
	IconButton,
	TextField,
	InputLabel,
	InputAdornment,
	Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";

// import './SBSManagerWindow.scss';

import { appInfoData } from "data/appInfo";
import convertDateToDisplayFormat, {
	triggerEvent,
	stringToUSDateTime,
} from "utilities/commonFunctions";
import GridWindow from "components/iqgridwindow/IQGridWindow";
import { postMessage, isLocalhost, currency } from "app/utils";
import {
	getServer,
	setServer,
	setFullView,
	setCurrencySymbol,
	setAppWindowMaximize,
	setCostUnitList,
} from "app/common/appInfoSlice";
import "./SBSManagerWindow.scss";
import SBSManagerForm from "./sbsManagerContent/sbsManagerForm/SBSManagerForm";
import {
	SBSToolbarLeftButtons,
	SBSToolbarRightButtons,
} from "./sbsManagerContent/toolbar/SBSManagerToolbar";
import SBSCategoryRightPanel from "./SBSCategoryRightPanel/SBSCategoryRightPanel";
import SUIDrawer from "sui-components/Drawer/Drawer";
import { getTrades } from "./enums";
import {
	getAppsList,
	getCategoryDropDownOptions,
	getPhaseDropdownValues,
	getSBSGridList,
	setShowSbsPanel,
	setSelectedNodes,
	setShowPhaseModel,
	setToast,
	getSettingsCategoriesList,
	getSbsSettings,
	getSBSDetailsById,
} from "./operations/sbsManagerSlice";
import { formatDate } from "utilities/datetime/DateTimeUtils";
import _ from "lodash";
import {
	fetchTradesData,
	getTradeData,
} from "features/projectsettings/projectteam/operations/ptDataSlice";
import SbsManagerApplicationLID from "./details/SbsManagerApplicationLID";
import SBSManagePhasesModal from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import PhasesGridList from "./phasesGridList/PhasesGridList";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import IQTooltip from "components/iqtooltip/IQTooltip";
import { AddFiles, saveLinksData } from "./operations/sbsManagerAPI";
import { findAndUpdateFiltersData } from "./utils";

const SBSManagerWindow = (props: any) => {
	let filterOptions = useMemo(() => {
		var filterMenu = [
			{
				text: "Category",
				value: "category",
				key: "category",
				keyValue: "category",
				children: { type: "checkbox", items: [] },
			},
			{
				text: "Trade",
				value: "trade",
				key: "trade",
				keyValue: "trades",
				children: { type: "checkbox", items: [] },
			},
			{
				text: "Phase",
				value: "phase",
				key: "phase",
				keyValue: "phase",
				children: { type: "checkbox", items: [] },
			},
		];
		return filterMenu;
	}, []);
	const dispatch = useAppDispatch();
	const [localhost] = React.useState(isLocalhost);
	const [appData] = React.useState(appInfoData);
	const appInfo = useAppSelector(getServer);
	const { detailsData } = useAppSelector((state) => state.sbsManager);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const {
		sbsGridData,
		showSbsPanel,
		showPhaseModel,
		toast,
		sbsSettings,
		settingsCategoryList,
	} = useAppSelector((state) => state.sbsManager);
	const [gridSearchText, setGridSearchText] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<any>();
	const [rowData, setRowData] = useState([]);
	const [modifiedList, setModifiedList] = useState<Array<any>>([]);
	const tradesData: any = useAppSelector(getTradeData);
	const iframeID = "sbsManagerIFrame";
	const appType = "SBSManager";
	const [showManagePhasesModal, setShowManagePhasesModal] =
		useState<any>(false);
	const [defaultTabId, setDefaultTabId] = useState<any>("");
	const [openRightPanel, setOpenRightPanel] = useState(false);
	const [currentRowSelection, setCurrentRowSelection] = useState<any>(null);
	const [driveFileQueue, setDriveFileQueue] = useState<any>([]);
	const [smartItemLink, setSmartItemLink] = useState<any>({});
	const [toastMessage, setToastMessage] = useState<string>("");
	const [selectedSettingsCat, setSelectedSettingsCat] = useState<any>({});
	const [isRightPanelOpened, setIsRightPanelOpened] = React.useState(false);
	const [filters, setFilters] = useState<any>([]);
	const isAppMaximized = useAppSelector(
		(state) => state.appInfo.isAppMaximized
	);
	const gridApi = useRef<any>();
	const [gridApiRef, setGridApiRef] = useState<any>();
	useEffect(() => {
		setShowManagePhasesModal(showPhaseModel);
	}, [showPhaseModel]);
	useEffect(() => {
		if (
			sbsSettings &&
			sbsSettings?.categoryId &&
			settingsCategoryList?.length > 0
		) {
			let value = [...settingsCategoryList].find(
				(rec: any) => rec.id === sbsSettings.categoryId
			)?.name;
			dispatch(
				getCategoryDropDownOptions(
					value ?? "System Breakdown Structure Categories (SBS)"
				)
			);
		} else if (sbsSettings?.length === 0) {
			dispatch(
				getCategoryDropDownOptions(
					"System Breakdown Structure Categories (SBS)"
				)
			);
		}
	}, [sbsSettings, settingsCategoryList]);
	useEffect(() => {
		if (appInfo) {
			dispatch(getSBSGridList());
			dispatch(fetchTradesData(appInfo));
			dispatch(getPhaseDropdownValues());
			// dispatch(getCategoryDropDownOptions("System Breakdown Structure Categories (SBS)"));
			dispatch(getAppsList());
			dispatch(getSettingsCategoriesList());
			dispatch(getSbsSettings());
		}
	}, [appInfo]);

	React.useEffect(() => {
		if (sbsGridData.length > 0) {
			setModifiedList(sbsGridData);
			setRowData(sbsGridData);
			setTimeout(() => {
				console.log('refreshCells test');
				gridApiRef.refreshCells({ force: true });
			}, 500);
			setFilters(
				findAndUpdateFiltersData(
					filterOptions,
					sbsGridData,
					"phase",
					true,
					"name"
				)
			);
			setFilters(
				findAndUpdateFiltersData(
					filterOptions,
					sbsGridData,
					"category",
					true,
					"name"
				)
			);
			setFilters(
				findAndUpdateFiltersData(
					filterOptions,
					sbsGridData,
					"trades",
					true,
					"name"
				)
			);
		} else if (sbsGridData.length === 0) {
			setModifiedList([]);
			setRowData([]);
			setFilters(
				findAndUpdateFiltersData(
					filterOptions,
					sbsGridData,
					"phase",
					true,
					"name"
				)
			);
			setFilters(
				findAndUpdateFiltersData(
					filterOptions,
					sbsGridData,
					"category",
					true,
					"name"
				)
			);
			setFilters(
				findAndUpdateFiltersData(
					filterOptions,
					sbsGridData,
					"trades",
					true,
					"name"
				)
			);
		}
	}, [sbsGridData]);
	useEffect(() => {
		if (localhost) {
			dispatch(setServer(_.omit(appData, ["DivisionCost"])));
			dispatch(setCurrencySymbol(currency["USD"]));
			dispatch(setCostUnitList(appData?.DivisionCost?.CostUnit));
		} else {
			if (!appInfo) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof data == "string" ? JSON.parse(data) : data;
					data =
						data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
					if (data) {
						switch (data.event || data.evt) {
							case "hostAppInfo":
								const structuredData = data.data;
								dispatch(setServer(structuredData));
								dispatch(
									setCurrencySymbol(
										currency[
										structuredData?.currencyType as keyof typeof currency
										]
									)
								);
								break;
							case "getlocalfiles":
								const localUploadedFiles = data.data;
								// dispatch(setUploadedFilesFromLocal(localUploadedFiles));
								break;
							case "getdrivefiles":
								try {
									setDriveFileQueue(data.data);
								} catch (error) {
									console.log(
										"Error in adding Bid Reference file from Drive",
										error
									);
								}
								break;
							case "updateparticipants":
								triggerEvent("updateparticipants", {
									data: data.data,
									appType: data.appType,
								});
								break;
							case "updatecommentbadge":
								triggerEvent("updatecommentbadge", {
									data: data.data,
									appType: data.appType,
								});
								break;
							case "smartitemlink":
								console.log("smartitemlink data", data);
								setSmartItemLink(data);
								break;
							case "savesupplementalinfo":
								console.log("savesupplementalinfo data", data);
								dispatch(getSBSGridList());
								break;
						}
					}
				};
				postMessage({
					event: "hostAppInfo",
					body: {
						iframeId: iframeID,
						roomId: appInfo && appInfo.presenceRoomId,
						appType: appType,
					},
				});
			}
		}
	}, [localhost, appData]);
	const saveFilesFromDrive = (appInfo: any, fileList: Array<any>) => {
		const structuredFiles = fileList.map((file: any) => {
			return {
				type: "drive",
				name: file.name,
				id: file.id,
			};
		});
		console.log("structuredFiles drive", structuredFiles);
		AddFiles(detailsData?.id, structuredFiles, (response: any) => {
			console.log("respone in drive", response);
			dispatch(getSBSDetailsById(detailsData?.uniqueid));
		});
	};

	const saveSmartItemLink = (smartData: any) => {
		let payload = {
			details: {
				sbsId: detailsData?.id,
				LinkType: 0,
				Link: smartData?.smartItemId,
			},
		};
		saveLinksData(payload, (response: any) => {
			dispatch(getSBSDetailsById(detailsData?.uniqueid));
			setSmartItemLink({});
		});
	};

	useEffect(() => {
		if (Object.keys(smartItemLink).length) {
			saveSmartItemLink(smartItemLink);
		}
	}, [smartItemLink]);

	useEffect(() => {
		if (driveFileQueue?.length > 0) {
			console.log("driveFileQueue", driveFileQueue);
			saveFilesFromDrive(appInfo, [...driveFileQueue]);
			setDriveFileQueue([]);
		}
	}, [appInfo, driveFileQueue]);

	const columns = [
		{
			headerName: "Category",
			field: "category",
			suppressMenu: true,
			pinned: "left",
			checkboxSelection: true,
			headerCheckboxSelection: true,
			keyCreator: (params: any) => params.data?.category?.name || "None",
			valueGetter: (params: any) => `${params?.data?.category?.name}`,
			minWidth: 350,
			cellRenderer: (params: any) => {
				return (
					<div className="sbs-category-cell">
						{params?.data?.hasDifferentCategory ? (
							<IQTooltip
								title={
									<Stack direction="row" className="tooltipcontent">
										<p className="tooltiptext">
											Category name needs to be updated.
										</p>
									</Stack>
								}
								placement={"bottom"}
								arrow={true}
							>
								<WarningAmberIcon fontSize={"small"} style={{ color: "red" }} />
							</IQTooltip>
						) : null}
						{params.data?.name || "N/A"}
					</div>
				);
			},
		},
		{
			headerName: "Phase",
			field: "phase",
			pinned: "left",
			suppressMenu: true,
			// checkboxSelection: true,
			keyCreator: (params: any) => params.data?.phase?.[0]?.name || "None",
			minWidth: 260,
			cellRenderer: (params: any) => {
				const phase = params.data?.phase?.[0]?.name;
				const buttonStyle = {
					backgroundColor: params.data?.phase?.[0]?.color ?? "red",
					color: "#fff",
					alignItems: "center",
				};

				return (
					<>
						{phase ? (
							<Button style={buttonStyle} className="phase-btn">
								<span className="common-icon-phase"></span>
								{phase}
							</Button>
						) : null}
					</>
				);
			},
		},
		{
			headerName: "Trade",
			field: "trade",
			suppressMenu: true,
			keyCreator: (params: any) =>
				(params?.data?.trades && getTrades(params?.data?.trades)) || "None",
			valueGetter: (params: any) =>
				params?.data?.trades && getTrades(params?.data?.trades),
			minWidth: 300,
		},
		{
			headerName: "Est. Start Date",
			field: "startDate",
			suppressMenu: true,
			minWidth: 200,
			valueGetter: (params: any) =>
				params?.data
					? formatDate(params?.data?.startDate, {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
					})
					: "",
		},
		{
			headerName: "Est. End Date",
			field: "endDate",
			suppressMenu: true,
			minWidth: 200,
			valueGetter: (params: any) =>
				params?.data
					? formatDate(params?.data?.endDate, {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
					})
					: "",
		},
		{
			headerName: "Supplemental Info",
			field: "supplementalInfo",
			suppressMenu: true,
			minWidth: 200,
			cellRenderer: (params: any) => {
				return (
					<>
						{!!params?.data?.supplementalInfoItemId ? (
							<div
								className="sbs-suppli-info-cell"
								onClick={() => {
									postMessage({
										event: "openitem",
										body: { smartItemId: params?.data?.supplementalInfoItemId },
									});
									// setDefaultTabId("SBSAdditionalInfo");
									// setOpenRightPanel(true);
									// setCurrentRowSelection(params.data);
								}}
							>
								View/Update Info
							</div>
						) : null}
					</>
				);
			},
		},
	];
	const [colDefs, setColDefs] = React.useState(columns);

	const handleClose = () => {
		postMessage({
			event: "closeiframe",
			body: {
				iframeId: iframeID,
				roomId: appInfo && appInfo.presenceRoomId,
				appType: appType,
			},
		});
	};

	const onGroupingChange = useCallback((groupValue: any) => {
		if (groupValue !== "") {
			let updatedColumns: any = [...colDefs].map((rec: any) => {
				if (groupValue) return { ...rec, rowGroup: rec.field === groupValue };
				else return { ...rec, rowGroup: false, sort: null };
			});
			setColDefs(updatedColumns);
		}
	}, []);

	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
			suppressGroupRowsSticky: true,
		};
	}, []);
	const handleSelectedCategory = (type: string) => {
		console.log("managerr", type)
		switch (type) {
			case "sbs": {
				break;
			}
			case "managerSbs": {
				console.log("managerr1")
				setShowManagePhasesModal(true);
				break;
			}
			case "supplemental": {
				postMessage({
					event: "opensupplementalinfo",
					body: {
						iframeId: iframeID,
						appType: appType,
						dataEntity: 9,
						category: selectedSettingsCat?.name || 'System Breakdown Structure Categories (SBS)',
					},
				});
				break;
			}
			case "dynamicHeatMap": {
				break;
			}
			default: {
				break;
			}
		}
		console.log("type", type);
	};
	const handleSbsCategoryChange = (val: string) => {
		console.log("Category val", val);
		setSelectedSettingsCat(val);
	};
	const onFilterChange = (filterValues: any) => {
		setSelectedFilters(filterValues);
	};
	const onGridSearch = (searchTxt: string) => {
		setGridSearchText(searchTxt);
	};
	const onRowSelection = (e: any) => {
		const SelectionService = e.api.getSelectedRows();
		dispatch(setSelectedNodes(SelectionService));
	};
	const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const tradeNames = item.trades?.map((x: any) => x?.name?.toString());
			const phaseNames = item.phase?.map((x: any) => x?.name?.toString());
			const regex = new RegExp(gridSearchText, "gi");
			const searchVal = Object.keys(item).some((field) => {
				if (Array.isArray(item[field])) {
					if (item[field]?.length > 0) {
						for (let i = 0; i < item[field].length; i++) {
							return Object.keys(item?.[field]?.[i])?.some((objField) => {
								return item?.[field]?.[i]?.[objField]?.toString()?.match(regex);
							});
						}
					} else return false;
				} else if ((item[field] ?? false) && typeof item[field] === "object") {
					return Object.keys(item?.[field])?.some((objField) => {
						return item?.[field]?.[objField]?.toString()?.match(regex);
					});
				} else return item?.[field]?.toString()?.match(regex);
			});
			const filterVal =
				_.isEmpty(selectedFilters) ||
				(!_.isEmpty(selectedFilters) &&
					(_.isEmpty(selectedFilters.category) ||
						selectedFilters.category?.length === 0 ||
						selectedFilters.category?.indexOf(item.category.name) > -1) &&
					(_.isEmpty(selectedFilters.phase) ||
						selectedFilters.phase?.length === 0 ||
						_.intersection(selectedFilters.phase, phaseNames).length > 0) &&
					(_.isEmpty(selectedFilters.trade) ||
						selectedFilters.trade?.length === 0 ||
						_.intersection(selectedFilters.trade, tradeNames).length > 0));
			return searchVal && filterVal;
		});
	};
	useEffect(() => {
		if (gridSearchText || selectedFilters) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [gridSearchText, selectedFilters]);
	useEffect(() => {
		setToastMessage(toast);
		setTimeout(() => {
			setToastMessage("");
			dispatch(setToast(""));
		}, 3000);
	}, [toast]);
	React.useEffect(() => {
		if (isRightPanelOpened && showSbsPanel) {
			dispatch(setShowSbsPanel(false));
		}
	}, [isRightPanelOpened]);
	const onFirstDataRendered = useCallback((params: any) => {
		gridApi.current = params;
	}, []);
	const leftToolBarHandler = (e: any) => {
		debugger;
		const action = e.currentTarget.getAttribute("data-action");
		switch (action) {
			case "exportCsv": {
				// gridApi.current.api.exportDataAsCsv();
				break;
			}
			default: {
				break;
			}
		}
	};
	return (
		<div className="sbs-manager-cls">
			<GridWindow
				open={true}
				title="System Breakdown Structure (SBS) Manager"
				iconCls="common-icon-SBS"
				className={"SBS-window-cls"}
				appType={appType}
				appInfo={appInfoData}
				iFrameId={iframeID}
				zIndex={100}
				onClose={handleClose}
				defaultTabId={defaultTabId}
				manualLIDOpen={openRightPanel}
				currentRowSelectionData={currentRowSelection}
				showPinned={true}
				// isFullView={true}
				lidCondition={(rowData: any) => {
					return true;
				}}
				getLIDOpen={(val: boolean) => setIsRightPanelOpened(val)}
				presenceProps={{
					presenceId: "sbs-manager-presence",
					showLiveSupport: true,
					showLiveLink: true,
					showStreams: false,
					showComments: true,
					showChat: false,
					hideProfile: false,
				}}
				righPanelPresenceProps={{
					presenceId: "sbs-manager-presence",
					showLiveSupport: true,
					showStreams: false,
					showPrint:true,
				}}
				tools={{
					closable: true,
					resizable: true,
					openInNewTab: true,
				}}
				PaperProps={{
					sx: {
						width: "95%",
						height: "90%",
					},
				}}
				toast={toastMessage}
				content={{
					headContent: {
						regularContent: <SBSManagerForm />,
					},
					detailView: SbsManagerApplicationLID,
					gridContainer: {
						toolbar: {
							leftItems: (
								<SBSToolbarLeftButtons clickHandler={leftToolBarHandler} />
							),
							rightItems: <SBSToolbarRightButtons />,
							searchComponent: {
								show: true,
								type: "regular",
								groupOptions: [
									{ text: "Category", value: "category" },
									{ text: "Trade", value: "trade" },
									{ text: "Phase", value: "phase" },
								],
								filterOptions: filters,
								onGroupChange: onGroupingChange,
								onFilterChange: onFilterChange,
								onSearchChange: onGridSearch,
								defaultGroups: "category",
								showNone: false,
							},
						},
						grid: {
							headers: colDefs,
							data: rowData,
							getRowId: (params: any) => params.data.id,
							groupIncludeTotalFooter: false,
							groupIncludeFooter: false,
							groupSelectsChildren: true,
							rowSelection: "multiple",
							groupDefaultExpanded: 1,
							grouped: true,
							groupRowRendererParams: groupRowRendererParams,
							groupDisplayType: "groupRows",
							// onRowDoubleClicked:onRowDoubleClick,
							rowSelected: (e: any) => onRowSelection(e),
							emptyMsg: 'No items available yet',
							nowRowsMsg: "<div>click on + add button to create your first SBS item from above pane</div>",
							onFirstDataRendered: onFirstDataRendered,
							tableref: (val: any) => setGridApiRef(val),
						},
					},
				}}
			/>
			{showSbsPanel && (
				<SUIDrawer
					PaperProps={{
						style: {
							position: "fixed",
							marginTop: "9%",
							marginRight: isAppMaximized ? "0%" : "2.5%",
							height: isAppMaximized ? "80%" : "76%",
							borderRadius: "4px",
							boxShadow: "-6px 0px 10px -10px",
							border: "1px solid rgba(0, 0, 0, 0.12) !important",
						},
					}}
					anchor="right"
					variant="permanent"
					elevation={2}
					open={false}
				>
					<Box
						sx={{ width: "20.5vw", height: "100%" }}
						role="presentation"
						className="general-window-cls"
					>
						<Stack
							direction="row"
							sx={{ justifyContent: "end", height: "5em" }}
						>
							<IconButton
								className="Close-btn"
								aria-label="Close Right Pane"
								onClick={() => dispatch(setShowSbsPanel(false))}
							>
								<span className="common-icon-Declined"></span>
							</IconButton>
						</Stack>
						<div style={{ height: "calc(100% - 5em)" }}>
							<SBSCategoryRightPanel
								handleSelectedCategory={(val: any) =>
									handleSelectedCategory(val)
								}
								handleSbsCategoryChange={(val: any) =>
									handleSbsCategoryChange(val)
								}
							/>
						</div>
					</Box>
				</SUIDrawer>
			)}
			<SBSManagePhasesModal
				open={showManagePhasesModal}
				className={"sbs-manage-phases-dialog"}
				contentText={<PhasesGridList></PhasesGridList>}
				title={""}
				showActions={false}
				dialogClose={true}
				helpIcon={true}
				helpModule={'SBS'}
				iconTitleContent={
					<div style={{ display: "flex", alignItems: "center" }}>
						<div>Manage Phases</div>
					</div>
				}
				onAction={() => {
					setShowManagePhasesModal(false);
					if (showPhaseModel) dispatch(setShowPhaseModel(false));
				}}
				customButtons={true}
				onHelpOpen={(value: any) => setShowManagePhasesModal(false)}
				customButtonsContent={<></>}
			/>
		</div>
	);
};

export default SBSManagerWindow;
