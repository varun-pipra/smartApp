import {
	getServer,
	setCurrencySymbol,
	setDetailInfoSelectionIndex,
	setServer,
} from "app/common/appInfoSlice";
// import { } from 'app/common/userLoginUtils';
import {useAppDispatch, useAppSelector, useHomeNavigation} from "app/hooks";
import {currency, isLocalhost, postMessage} from "app/utils";
import GridWindow from "components/iqgridwindow/IQGridWindow";
import {appInfoData} from "data/appInfo";
import _ from "lodash";
import {memo, useEffect, useMemo, useState, useRef, useCallback} from "react";
import {useLocation, useSearchParams} from "react-router-dom";
import {triggerEvent} from "utilities/commonFunctions";
import "./SmartSubmittalsWindow.scss";
import {Alert, Button} from "@mui/material";
import {SSLeftToolbar} from "./content/toolbar/sslefttoolbar/SSLeftToolbar";
import {SSRightToolbar} from "./content/toolbar/ssrighttoolbar/SSRightToolbar";
import {
	getSubmittalsStatus,
	getSubmittalsStatusLabel,
} from "utilities/smartSubmittals/enums";
import {
	getSmartSubmitalGridList,
	setRightPanelUpdated,
	setSSBrenaStatus,
	setSSRightPanelData,
	setSelectedRecord,
	setSelectedRecordsData,
} from "./stores/SmartSubmitalSlice";
import {fetchSmartSubmitalDetailGridList} from "./stores/SmarSubmitalAPI";
import SSBrenaWindow from "./smartsubmittalbrena/SSBrenaWindow";
import {getSubmittalType} from "./smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarSlice";
import SpecificationManagerLID from "../specificationmanager/details/SpecficationManagerLID";
import {SMLeftButtons} from "../specificationmanager/content/toolbar/smlefttoolbar/SMLeftToolbar";
import {SMRightButtons} from "../specificationmanager/content/toolbar/smrighttoolbar/SMRightToolbar";
import {deleteMultipleSpecSections, publishMultipleSpecSection} from "../specificationmanager/stores/SpecificationManagerAPI";
import {getDivisionList, getSMList, getToastMessageForSM, getUnpublishedCount, setBidPackageDropdownValues, setBulkUpdateBtnDisabled, setBulkUpdateDialog, setBulkUpdateFormValues, setRightPanelData, setSMBrenaStatus, setSelectedRecsData, setSpecSessionDlg, setSpecStartNewSession, setToastMessageForSM} from "../specificationmanager/stores/SpecificationManagerSlice";
import {fetchGridData} from "features/bidmanager/stores/gridSlice";
import {getUploadQueue, setUploadQueue} from "../specificationmanager/stores/FilesSlice";
import SMSpecBookDailog from "features/projectsettings/projectteam/projectteamapplicationsdetails/tabs/safetyViolation/SafetyViolationDialog";
import SpecBookStartSessionContent, {SpecBookStartSessionButtons} from "../specificationmanager/content/specbookstartsessioncontent/SpecBookStartSessionContent";
import {SpeckBookButtons} from "../specificationmanager/content/specbookdailogcontent/SpecBookDailogContent";
import SSUnCommitedContent, {SMSessionDialogContent, SSUnCommitedBtns} from "./content/ssdailoguncommitedcontent/SSDailogUncommitedContent";
import SMBrenaWindow from "../specificationmanager/smbrena/SMBrenaWindow";
import SpecBookPublishContent, {SpecBookPublishButtons} from "../specificationmanager/content/specbookpublishcontent/SpecBookPublishContent";
import SpecBookBulkContent from "../specificationmanager/content/specbookbulkupdate/SpecBookBulkUpdate";
import SpecBookDialogContent from "../specificationmanager/content/specbookdailogcontent/SpecBookDailogContent";
import React from "react";
import SmartSubmittalLID from "./details/SmartSubmittalLID";
var tinycolor = require("tinycolor2");

const SmartSubmittalsWindow = (props: any) => {
	// Spec Manger Filters, Groups, Columns 
	const specColumns = [
		{
			headerName: "Spec Number",
			pinned: "left",
			field: "number",
			cellClass: "sm-number",
			cellStyle: {color: "#059cdf"},
			// cellRenderer: "agGroupCellRenderer",
			sort: "asc",
			checkboxSelection: true,
			headerCheckboxSelection: true,
			resizable: true,
			minWidth: 200,
		},
		{
			headerName: "Spec Section Title",
			pinned: "left",
			field: "title",
			cellClass: "sm-title",
			resizable: true,
			minWidth: 350,
		},
		{
			headerName: "Spec Book",
			field: "specBook",
			minWidth: 150,
			suppressMenu: true,
			resizable: true,
			cellClass: "sm-specBookName",
			keyCreator: (params: any) => params.data?.specBook?.fileName || "None",
			valueGetter: (params: any) => `${params?.data?.specBook?.fileName}`
		},
		{
			headerName: "Display Name",
			field: "specBookDisplayName",
			cellClass: "sm-specBookDisplayName",
			minWidth: 200,
			suppressMenu: true,
			resizable: true,
			keyCreator: (params: any) => params.data?.specBook?.displayName || "None",
			valueGetter: (params: any) => `${params?.data?.specBook?.displayName}`
		},
		{
			headerName: "Division",
			field: "division",
			cellClass: "sm-division",
			minWidth: 250,
			rowGroup: true,
			resizable: true,
			suppressMenu: true,
			keyCreator: (params: any) => params.data.division && `${params.data.division.number} - ${params.data.division.text}` || "None",
			valueGetter: (params: any) => {
				const division = params?.data?.division;
				if(
					division &&
					division.number !== undefined &&
					division.text !== undefined
				) {
					return `${division.number} - ${division.text}`;
				}
			},
		},

		{
			headerName: "Pages",
			field: "pages",
			cellClass: "sm-pages",
			minWidth: 120,
			suppressMenu: true,
			resizable: true,
			cellStyle: {color: "#059cdf"},
			valueGetter: (params: any) => `${params?.data?.startPage} - ${params?.data?.endPage}`
		},
		{
			headerName: "Bid Package",
			field: "bidPackageName",
			cellClass: "sm-bidPackages",
			minWidth: 350,
			resizable: true,
			suppressMenu: true,
			keyCreator: (params: any) => params.data?.bidPackageName || "None",
			valueGetter: (params: any) => params.data?.bidPackageName === '' ? 'NA' : params.data?.bidPackageName
		},
		{
			headerName: "Type",
			field: "extractionType",
			cellClass: "sm-extractionType",
			minWidth: 100,
			suppressMenu: true,
			resizable: true,
		},
		// {
		//   headerName: "System Breakdown Structure (SBS)",
		//   field: "sbsName",
		//   cellClass: "sm-sbsName",
		//   minWidth: 270,
		//   suppressMenu: true,
		//   resizable: true,
		// },
		// {
		//   headerName: "Phase",
		//   field: "sbsPhase",
		//   cellClass: "sm-sbsPhase",
		//   minWidth: 180,
		//   suppressMenu: true,
		//   resizable: true,
		//   cellRenderer: (params: any) => {
		//     const phase = params?.data?.sbsPhase;
		//     const buttonStyle = {
		//       backgroundColor: params?.data?.sbsPhaseColor,
		//       color: "#fff",
		//     };

		//     return (
		//       <>
		//         <Button style={buttonStyle} className="phase-btn">
		//           <span className="common-icon-phase"></span>
		//           {phase}
		//         </Button>
		//       </>
		//     );
		//   },
		// },
		{
			headerName: "Spec Section Name",
			field: "sectionName",
			cellClass: "sm-sectionName",
			resizable: true,
			suppressMenu: true,
			valueGetter: (params: any) => {
				return params.data?.title;
			},
		},
	];
	const specGroupOptions = useMemo(() => {
		var groupingMenu = [
			{text: "Division ", value: "division"},
			{text: "Spec Book", value: "specBook"},
			{text: "Bid Package  ", value: "bidPackageName"},
		];
		return groupingMenu;
	}, []);
	const specFilterOptions = useMemo(() => {
		var filterMenu = [
			{
				text: "Division ",
				value: "division",
				key: "division",
				children: {
					type: "checkbox",
					items: [],
				},
			},
			{
				text: "Spec Book",
				value: "specBook",
				key: "specBook",
				children: {
					type: "checkbox",
					items: [],
				},
			},
			{
				text: "Bid Package",
				value: "bidPackageName",
				key: "bidPackageName",
				children: {
					type: "checkbox",
					items: [],
				},
			},
		];
		return filterMenu;
	}, []);
	//
	const dispatch = useAppDispatch();

	// Local mock
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);

	const location = useLocation();
	const {gridData, rightPanelUpdated} = useAppSelector((state: any) => state.smartSubmittals);
	const {server, currencySymbol} = useAppSelector((state) => state.appInfo);
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);
	const [isFullView, setFullView] = useState(false);
	const [toastMessage, setToastMessage] = useState<string>("");
	const [modifiedList, setModifiedList] = useState<Array<any>>([]);
	const [specModifiedList, setSpecModifiedList] = useState<Array<any>>([]);
	const {SSBrenaOpen} = useAppSelector((state) => state.smartSubmittals);
	const [rowData, setRowData] = useState([]);
	const gridTooltipRef = useRef<any>();
	const [gridSearchText, setGridSearchText] = useState('');
	const [selectedFilters, setSelectedFilters] = useState<any>();
	const [defaultType, setDefaultType] = useState<any>();
	const gridApi = useRef<any>();
	const [mainWindowActiveTab, setMainWindowActiveTab] = useState('');
	const [defaultGroupValue, setDefaultGroupValue] = useState('divisionSubmitalType');
	const GetUniqueList = (data: any, key?: any) => {
		let unique: any = [];
		data?.map((x: any) =>
			unique?.filter((a: any) => a?.[key] === x?.[key])?.length > 0
				? null
				: unique.push(x)
		);
		unique.sort((a: any, b: any) =>
			a?.[key].localeCompare(b?.[key], undefined, {numeric: true})
		);
		return unique;
	};
	const findAndUpdateFiltersData = (
		tab: any,
		data: any,
		key: string,
		nested?: boolean,
		nestedKey?: any,
		custom?: boolean,
		customKey?: any,
	) => {
		const formattedData = data?.map((rec: any) => {
			if(custom)
				return {
					text: `${rec?.[key]?.[customKey]} - ${rec?.[key]?.[nestedKey]}`,
					value: `${rec?.[key]?.[customKey]} - ${rec?.[key]?.[nestedKey]}`,
					id: rec?.id,
				};
			else if(nested)
				return {
					text: rec?.[key]?.[nestedKey],
					value: rec?.[key]?.[nestedKey],
					id: rec?.[key]?.id,
				};
			else return {text: rec?.[key] === '' ? 'NA' : rec?.[key], value: rec?.[key] === '' ? 'NA' : rec?.[key], id: rec?.id};
		});
		const filtersCopy: any = tab === 'submittals' ? [...submittalFilterOptions] : [...specFilterOptions];
		let currentItem: any = filtersCopy.find((rec: any) => rec?.value === key);
		currentItem.children.items = GetUniqueList(formattedData, "text");
	};
	/**
	 * This effect is to process the incoming query string and act accordingly
	 */
	useEffect(() => {
		const {search} = location;
		if(search) {
			const params: any = new URLSearchParams(search);
			setMaxByDefault(params?.get("maximizeByDefault") === "true");
			setInline(params?.get("inlineModule") === "true");
			setFullView(params?.get("inlineModule") === "true");
		}
	}, [location]);

	/**
	 * All initial APIs will be called here
	 * Grid API
	 * Dropdown APIs that supports adding a new record
	 */
	useEffect(() => {
		if(server) dispatch(getSubmittalType());
		if(defaultType && server) dispatch(getSmartSubmitalGridList({type: defaultType}));
	}, [server]);

	/**
	 * Grid data is set in this effect
	 *
	 * Search, Filters are applied to the source data and the result
	 * is set to the local state
	 */
	useEffect(() => {
		if(gridData?.length > 0) {
			const data = gridData.map((item: any) => ({
				...item,
				pages: `${item.startPage} - ${item.startPage}`,
				bidPackageName:
					item.bidPackageName === null || item.bidPackageName === ""
						? "NA"
						: item.bidPackageName,
				type: item.type === null || item.type === "" ? "NA" : item.type,
				sectionTitle: item.sectionTitle ? item.sectionTitle : item.title
			}));
			findAndUpdateFiltersData('submittals', data, "sectionTitle");
			findAndUpdateFiltersData('submittals', data, "bidPackageName");
			findAndUpdateFiltersData('submittals', data, "specBook", true, "displayName");
			findAndUpdateFiltersData('submittals', data, "type");
			setRowData(data);
			setModifiedList(data);
			setColDefs(colDefs);
		}
	}, [gridData]);

	const CustomCellRenderer = (params: any) => {
		let statusClr;
		let parentRec = params?.node?.level == 1;
		if(parentRec) {
			statusClr =
				params?.data?.submittalCountBySection ===
				params?.data?.committedCountBySection;
		} else {
			statusClr =
				params?.params?.submittalCountByDivision ===
				params?.params?.committedCountByDivision;
		}
		return (
			<div
				style={{
					backgroundColor: statusClr ? "green" : "#d6b335",
					borderRadius: "50%",
					height: "1em",
					width: "1em",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: "12px auto 0px auto",
				}}
			></div>
		);
	};

	useEffect(() => {
		if(localhost) {
			dispatch(setServer(_.omit(appData, ["DivisionCost"])));
			dispatch(setCurrencySymbol(currency["USD"]));
		} else {
			if(!server) {
				window.onmessage = (event: any) => {
					let data = event.data;
					data = typeof data == "string" ? JSON.parse(data) : data;
					data =
						data.hasOwnProperty("args") && data.args[0] ? data.args[0] : data;
					if(data) {
						switch(data.event || data.evt) {
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
									console.log("getdrivefiles", data?.data);
									dispatch(setUploadQueue(data.data));
								} catch(error) {
									console.log("Error in adding Files from Drive:", error);
								}
								break;
							case "updateparticipants":
								// console.log('updateparticipants', data)
								triggerEvent("updateparticipants", {
									data: data.data,
									appType: data.appType,
								});
								break;
							case "updatecommentbadge":
								// console.log('updatecommentbadge', data)
								triggerEvent("updatecommentbadge", {
									data: data.data,
									appType: data.appType,
								});
								break;
							case "updatechildparticipants":
								// console.log('updatechildparticipants', data)
								// dispatch(setPresenceData(data.data));
								break;
						}
					}
				};

				postMessage({
					event: "hostAppInfo",
					body: {
						iframeId: "smartSubmittalsIframe",
						roomId: server && server.presenceRoomId,
						appType: "SmartSubmittals",
					},
				});
			}
		}
	}, [localhost, appData]);

	useEffect(() => {
		if(defaultType && server) dispatch(getSmartSubmitalGridList({type: defaultType}));
	}, [defaultType]);

	const columns: any = useMemo(
		() => [
			{
				headerName: "Submittal ID",
				field: "submittalId",
				pinned: "left",
				minWidth: 250,
				hide: true,
				cellStyle: {color: "#059cdf"},
				show: false,
				keyCreator: (params: any) => params.data?.submittalId || "None",
			},

			{
				headerName: "Submittal Type",
				field: "type",
				pinned: "left",
				minWidth: 250,
				hide: true,
				show: false,
				keyCreator: (params: any) => params.data?.type || "None",
			},
			{
				headerName: "Submittal Status",
				field: "status",
				pinned: "left",
				minWidth: 250,
				hide: true,
				show: false,
				keyCreator: (params: any) => (params.data?.sectionStatus ?? params.data?.status) && (getSubmittalsStatusLabel(params.data?.sectionStatus) ?? getSubmittalsStatusLabel(params.data?.status)) || "None",
				cellRenderer: (params: any) => {
					const status = params?.data?.status;
					const buttonStyle = {
						backgroundColor: getSubmittalsStatus(status),
						color: "#000",
					};

					return (
						<>
							<Button style={buttonStyle}>
								{getSubmittalsStatusLabel(status)}
							</Button>
						</>
					);
				},
			},
			{
				headerName: "Submittal Title",
				field: "title",
				hide: true,
				show: false,
				keyCreator: (params: any) => params.data?.title || "None",
			},
			{
				headerName: "Submittal Summary",
				field: "title",
				hide: true,
				show: false,
				keyCreator: (params: any) => params.data?.title || "None",
			},
			{
				headerName: "Spec Section Title",
				field: "sectionTitle",
				hide: true,
				show: false,
				keyCreator: (params: any) => params.data?.sectionTitle || "None"
			},
			{
				headerName: "Page(s)",
				field: "pages",
				minWidth: 100,
				suppressMenu: true,
				resizable: true,
				hide: true,
				show: false,
				cellStyle: {color: "#059cdf"},
				valueGetter: (params: any): string => {
					if(params?.node?.level || !params?.node?.group) {
						return `${params?.data?.startPage} - ${params?.data?.endPage ?? params?.data?.startPage}`;
					}
					return "";
				},
			},
			{
				headerName: "Submittal Package",
				field: "submittalPackage",
				minWidth: 250,
				hide: true,
				show: false,
				suppressMenu: true,
				resizable: true,
				keyCreator: (params: any) => params.data?.submittalPackage || "None",
			}, {
				headerName: "Status",
				field: "status",
				hide: true,
				show: false,
				minWidth: 250,
				suppressMenu: true,
				resizable: true,
				keyCreator: (params: any) => params.data?.status || "None"
			},
			{
				headerName: "Spec Section Name",
				pinned: "left",
				field: "sectionTitle",
				sort: "asc",
				suppressMenu: false,
				checkboxSelection: true,
				headerCheckboxSelection: true,
				// minWidth: 250,
				show: true,
				cellRenderer: 'agGroupCellRenderer',
				minWidth: 540,
				resizable: true,
				keyCreator: (params: any) => params.data?.title || "None",
				valueGetter: (params: any) => `${params?.data?.number} - ${params?.data?.title}`
			},
			{
				headerName: "Spec Book",
				field: "specBook",
				minWidth: 160,
				suppressMenu: true,
				resizable: true,
				keyCreator: (params: any) => params.data?.specBook?.fileName || "None",
				valueGetter: (params: any) => {
					if(params?.node?.level || !params?.node?.group) {
						return `${params?.data?.specBook?.fileName}`;
					}
				},
			},
			{
				headerName: "Display Name",
				field: "displayName",
				minWidth: 200,
				suppressMenu: true,
				resizable: true,
				valueGetter: (params: any) => {
					if(params?.node?.level || !params?.node?.group) {
						return `${params?.data?.specBook?.displayName}`;
					}
				},
			},
			{
				headerName: "Division",
				field: "division",
				minWidth: 250,
				suppressMenu: true,
				resizable: true,
				keyCreator: (params: any): String => {
					return `${params?.data?.division?.number} - ${params?.data?.division?.text}`;
				},
				valueGetter: (params: any): String => {
					if(params?.node?.level || !params?.node?.group) {
						return `${params?.data?.division?.number} - ${params?.data?.division?.text}`;
					}
					else return "";
				},
			},
			{
				headerName: "",
				fieldName: "colorDiv",
				key: "colorDiv",
				pinned: "left",
				show: true,
				maxWidth: 54,
				cellRendererFramework: CustomCellRenderer,
			},
			{
				headerName: "Pages",
				field: "pages",
				minWidth: 100,
				suppressMenu: true,
				resizable: true,
				cellStyle: {color: "#059cdf"},
				valueGetter: (params: any): string => {
					if(params?.node?.level || !params?.node?.group) {
						return `${params?.data?.startPage} - ${params?.data?.endPage ?? params?.data?.startPage}`;
					}
					return "";
				},
			},
			{
				headerName: "Bid Package",
				field: "bidPackageName",
				minWidth: 250,
				suppressMenu: true,
				resizable: true,
				keyCreator: (params: any) => params.data?.bidPackageName || "None",
				valueGetter: (params: any) => params.data?.bidPackageName === null || params.data?.bidPackageName === '' ? 'NA'
					: params.data?.bidPackageName
			},
			{
				headerName: "",
				field: "divisionSubmitalType",
				hide: true,
				show: true,
				keyCreator: (params: any): String => {
					return `${`${params?.data?.division?.number} - ${params?.data?.division?.text}`}`;
				},
				valueGetter: (params: any): String => {
					if(params?.node?.level || !params?.node?.group) {
						return `${`${params?.data?.division?.number} - ${params?.data?.division?.text}`}`;
					}
					else return "";
				},
			},
		],
		[]
	);
	const handleClose = () => {
		postMessage({
			event: "closeiframe",
			body: {
				iframeId: "smartSubmittalsIframe",
				roomId: server && server.presenceRoomId,
				appType: "SmartSubmittals",
			},
		});
	};

	const handleIconClick = () => {
		if(isInline) useHomeNavigation("smartSubmittalsIframe", "SmartSubmittals");
	};
	const handleDetailRowDoubleClick = (selectedRow: any) => {
		const detailGrid = gridApi?.current?.api?.detailGridInfoMap;
		const CurrentSelectedDetailIndex = Object.entries(gridApi?.current?.api?.detailGridInfoMap).findIndex(([key]) => {
			let nodes = detailGrid?.[key]?.api.getSelectedNodes();
			if(nodes.length > 0) return nodes.find((x: any) => x.data.submittalId === selectedRow.data.submittalId);
		});
		if(CurrentSelectedDetailIndex !== -1) {
			dispatch(setDetailInfoSelectionIndex(Object.keys(detailGrid)[CurrentSelectedDetailIndex] + " " + new Date().getTime()));
			Object.entries(gridApi?.current?.api?.detailGridInfoMap).filter(([key]) => {
				let nodes = detailGrid?.[key]?.api.getSelectedNodes();
				if(nodes.length > 0) {
					nodes.forEach((element: any) => {
						if(element.data.submittalId === selectedRow.data.submittalId) {
							element.setSelected(true);
						} else {
							element.setSelected(false);
						}
					});
				}
			});
		};
		dispatch(setSSRightPanelData(selectedRow.data));
		setManualLIDOpen(true);
	};
	const detailCellRendererParams = useMemo(() => {
		return () => {
			var res: any = {};
			res.getDetailRowData = (params: any) => {
				let payload = params?.data;
				fetchSmartSubmitalDetailGridList(payload, (response: any) => {
					params.successCallback(response);
				});
			};
			res.detailGridOptions = {
				refreshStrategy: "everything",
				rowSelection: "multiple",
				onRowDoubleClicked: handleDetailRowDoubleClick,
				columnDefs: [
					{
						field: "submittalID",
						headerName: "Submittal ID",
						pinned: "left",
						cellStyle: {color: "#059cdf"},
						maxWidth: 163,
						valueGetter: (params: any) => params?.data?.submittalId,
					},
					{
						headerName: "Submittal Type",
						field: "type",
						minWidth: 180,
						pinned: "left",
						valueGetter: (params: any) => params?.data?.type,
					},
					{
						field: "status",
						headerName: "Submittal Status",
						minWidth: 100,
						pinned: "left",
						valueGetter: (params: any) => params?.data?.status,
						cellRenderer: (params: any) => {
							const status = params?.data?.status;
							const buttonStyle = {
								backgroundColor: getSubmittalsStatus(status),
								color: "#000",
							};

							return (
								<>
									<Button style={buttonStyle}>
										{getSubmittalsStatusLabel(status)}
									</Button>
								</>
							);
						},
					},
					{
						headerName: "Submittal Title",
						field: "title",
						minWidth: 200,
						valueGetter: (params: any) => params?.data?.title,
					},
					{
						headerName: "Spec Section Title",
						field: "sectionTitle",
						minWidth: 200,
						valueGetter: (params: any) => params?.data?.sectionTitle,
					},
					{
						headerName: "Submittal Package",
						field: "submittalPackage",
						minWidth: 200,
						valueGetter: (params: any) => params?.data?.submittalPackage,
					},
				],
				defaultColDef: {
					flex: 1,
					resizable: true,
				},
				onCellMouseOver: onCellMouseOver,
				onCellMouseOut: onCellMouseOut,
			};
			return res;
		};
	}, []);

	const onCellMouseOver = (params: any) => {
		const el = params.event.target;
		const boundingClient = el.getBoundingClientRect();
		const topPosition = boundingClient.y + 50 + "px";
		const leftPosition =
			boundingClient.width + boundingClient.left - 110 + "px";
		let tooltipText =
			typeof params.value === "string" ? params.value : el.innerText;
		let display = el.offsetWidth <= el.scrollWidth;
		if(el.lastElementChild) {
			display =
				el.lastElementChild.offsetWidth < el.lastElementChild.scrollWidth;
		}
		if(display) {
			toggleGridCellTooltip(display, topPosition, leftPosition, tooltipText);
		}
	};

	const onCellMouseOut = () => {
		if(gridTooltipRef?.current) {
			gridTooltipRef.current.style.display = "none";
		}
	};

	const toggleGridCellTooltip = (
		display: any,
		topPosition: any,
		leftPosition: any,
		tooltipText: any
	) => {
		if(gridTooltipRef?.current) {
			gridTooltipRef.current.style.top = topPosition;
			gridTooltipRef.current.style.left = leftPosition;
			gridTooltipRef.current.innerHTML = tooltipText;
			gridTooltipRef.current.style.display = display ? "block" : "none";
		}
	};

	const isRowMaster = (dataItem: any) => {
		return dataItem?.hasSubmittal;
	};
	const onRowSelection = (e: any) => {
		const SelectionService = e.api.getSelectedNodes();
		if(e.api.getSelectedNodes()?.length > 0) {
			e.api.getSelectedNodes()?.forEach((selectedNode: any) => {
				const node = selectedNode?.selected;
				const isMaster = selectedNode?.master;
				if(node && isMaster) {
					const getDetailRows = selectedNode?.detailNode?.detailGridInfo?.api?.getRenderedNodes();
					getDetailRows?.forEach((item: any) => {
						if(!item.selected) {
							item.setSelected(true);
						}
					});
				}
			});
		}
		dispatch(setSelectedRecord(SelectionService?.[0]?.data));
		dispatch(setSelectedRecordsData(SelectionService));
	};
	const onGridSearch = (searchTxt: string) => {
		setGridSearchText(searchTxt);
	};
	const [colDefs, setColDefs] = useState<any>(columns);
	const submittalGroupOptions = useMemo(() => {
		var groupingMenu = [
			{text: "Division  ", value: "division"},
			{text: "Submittal Type  ", value: "type"},
			{text: "Submittal Status ", value: "status"},
			{text: "Spec Section", value: "sectionTitle"},
			{text: "Bid Package", value: "bidPackageName"},
			{text: "Division & Spec Section", value: "divisionSubmitalType"},
			{text: "Spec Book", value: "specBook"}
		];
		return groupingMenu;
	}, []);
	const submittalFilterOptions = useMemo(() => {
		var filterMenu = [
			{
				text: "Submittal Type  ",
				value: "type",
				key: "type",
				children: {
					type: "checkbox",
					items: [],
				},
			},
			{
				text: "Submittal Status",
				value: "status",
				key: "status",
				children: {
					type: "checkbox",
					items: [
						{text: "Suggested Draft", value: "SuggestedDraft", id: 0},
						{text: "Draft", value: "Draft", id: 1},
						{text: "Committed", value: "Committed", id: 2},
						{text: "Deleted", value: "Deleted", id: 3},
					],
				},
			},
			{
				text: "Spec Section Title",
				value: "sectionTitle",
				key: "sectionTitle",
				children: {
					type: "checkbox",
					items: [],
				},
			},
			{
				text: "Bid Package",
				value: "bidPackageName",
				key: "bidPackageName",
				children: {
					type: "checkbox",
					items: [],
				},
			},
			{
				text: "Spec Book",
				value: "specBook",
				key: "specBook",
				nested: true,
				nestedKey: "displayName",
				children: {
					type: "checkbox",
					items: [],
				},
			},
		];
		return filterMenu;
	}, []);
	const onFilterChange = useCallback((filterValues: any) => {setSelectedFilters(filterValues);}, []);
	const onGroupingChange = useCallback((groupValue: any) => {
		let updatedColumns: any;
		setDefaultGroupValue(groupValue);
		if((groupValue ?? false) && groupValue !== "") {
			setDefaultType((prev: any) => {
				if(prev === 'none') {
					dispatch(setSelectedRecordsData([]));
					return 'default';
				};
				return 'default';
			});
			updatedColumns = [...colDefs].map((rec: any) => {
				if(rec.hide && !rec.show) return {...rec, hide: true, rowGroup: false, sort: null};
				if(groupValue) return {...rec, rowGroup: rec.field === groupValue};
				else if(rec?.key === 'colorDiv') return {...rec, rowGroup: false, sort: null, hide: true};
				else return {...rec, rowGroup: false, sort: null, hide: false};
			});
			setColDefs(updatedColumns);
		} else if(groupValue === undefined) {
			dispatch(setSelectedRecordsData([]));
			setDefaultType('none');
			let updatedColumns: any = [...colDefs].map((rec: any) => {
				if(rec.show) return {...rec, rowGroup: false, hide: true};
				else if(!rec.show) return {...rec, hide: false, rowGroup: false, sort: null, };
				else return {...rec, rowGroup: false, hide: true};
			});
			setColDefs(updatedColumns);
		}
	}, []);
	const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(gridSearchText, 'gi');
			const searchVal = Object.keys(item).some((field) => {
				if((item[field] ?? false) && typeof item[field] === "object") {
					return Object.keys(item?.[field])?.some((objField) => {
						return item?.[field]?.[objField]?.toString()?.match(regex);
					});
				} else {
					return item?.[field]?.toString()?.match(regex);
				}
			});
			const filterVal = (_.isEmpty(selectedFilters) || (!_.isEmpty(selectedFilters)
				&& (_.isEmpty(selectedFilters.sectionTitle) || selectedFilters.sectionTitle?.length === 0 || selectedFilters.sectionTitle?.indexOf(item.sectionTitle) > -1)
				&& (_.isEmpty(selectedFilters.title) || selectedFilters.title?.length === 0 || selectedFilters.title?.indexOf(item.title) > -1)
				&& (_.isEmpty(selectedFilters.status) || selectedFilters.status?.length === 0 || selectedFilters.status?.indexOf(item.status) > -1)
				&& (_.isEmpty(selectedFilters.specBook) || selectedFilters.specBook?.length === 0 || selectedFilters.specBook?.indexOf(item.specBook?.displayName) > -1)
				&& (_.isEmpty(selectedFilters.bidPackageName) || selectedFilters.bidPackageName?.length === 0 || selectedFilters.bidPackageName?.indexOf(item?.bidPackageName)) > -1));
			return searchVal && filterVal;
		});
	};
	const CustomGroupHeader = memo((props: any) => {
		const {label, params, childCount, level, ...rest} = props;
		const width = 500;
		const style = {width: width, minWidth: width, maxWidth: width};
		return (
			<div className='custom-group-header-cls' style={style}>
				<div className="custom-group-header-label-cls"
					style={{width: '97%', overflow: 'hidden', textOverflow: 'ellipsis'}}
				>
					<span>{label} </span>
					<span>{`(${childCount})`}</span>
				</div>
				<div style={{width: '3%'}}>
					<CustomCellRenderer params={params} />
				</div>
			</div>
		);
	});
	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if(node.group) {
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			return (
				<>
					<CustomGroupHeader params={data} label={node?.key} childCount={node?.allChildrenCount} level={node?.level} />
				</>
			);
		};
	};
	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: true,
			suppressGroupRowsSticky: true,
			innerRenderer: GroupRowInnerRenderer
		};
	}, []);
	useEffect(() => {
		if(gridSearchText || selectedFilters) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [gridSearchText, selectedFilters]);
	// const modifiedData = searchAndFilter(rowData);
	const componentPropsChanged = useCallback((params: any) => {
		if(defaultType === 'default') {
			const cols: any = params.api.getColumnDefs();
			let updatedCols: any;
			updatedCols = [...cols].map((rec: any) => {
				if(rec.hide && rec.checkboxSelection) return {...rec, hide: false};
				else return {...rec};
			});
			if(!_.isEqual(cols, updatedCols)) {
				params.api.setColumnDefs(updatedCols);
			};
		} else if(defaultType === 'none') {
			const cols: any = params.api.getColumnDefs();
			let updatedCols: any;
			updatedCols = [...cols].map((rec: any) => {
				if(rec.headerName === 'Submittal Title' && rec.pinned === 'left') return {...rec, pinned: null};
				else return {...rec};
			});
			if(!_.isEqual(cols, updatedCols)) {
				params.api.setColumnDefs(updatedCols);
			};
		}
	}, [colDefs, mainWindowActiveTab]);
	const onFirstDataRendered = useCallback((params: any) => {
		gridApi.current = params;
	}, []);
	useEffect(() => {
		if(rightPanelUpdated) {
			let getDetailRows = gridApi.current.api.getRenderedNodes().filter((x: any) => x.master && x.expanded);
			if(getDetailRows.length > 0) {
				getDetailRows.map((row: any) => {
					gridApi.current.api.getDisplayedRowAtIndex(row.rowIndex).setExpanded(false);
					setTimeout(() => {
						gridApi.current.api.getDisplayedRowAtIndex(row.rowIndex).setExpanded(true);
					}, 500);
				});
			};
			dispatch(setRightPanelUpdated(false));
		}
	}, [rightPanelUpdated]);
	/**
	   * Here is the initial level for the spec manager state, events and actions.
	   * Kindly pls add all spec manager related functions and events.
	   
	   * @author Ram Nadendla
	   */
	const {
		openBrena,
		bulkUpdateDialog,
		bulkUpdateBtnDisabled,
		bulkUpdateFormValues,
		bidPackageDropdownValues,
		unpublishedCount,
		specSessionDlg,
		SMData
	} = useAppSelector((state) => state.specificationManager);
	const selectedSpecRecIds = useRef([]);
	const selectedSpecRecData = useRef([]);
	const [specManualLIDOpen, setSpecManualLIDOpen] = useState<boolean>(false);
	const [gridSpecSearchText, setGridSpecSearchText] = useState('');
	const [specColDefs, setSpecColDefs] = useState<any>(specColumns);
	const [showSpecCenterPiece, setShowSpecCenterPiece] = useState(false);
	const [specRowData, setSpecRowData] = useState([]);
	const fileQueue = useAppSelector(getUploadQueue);
	const [selectedSpecFilters, setSelectedSpecFilters] = useState<any>();
	const {originalGridData} = useAppSelector((state) => state.bidManagerGrid);
	const [gridAlert, setGridAlert] = React.useState(false);
	const [gridAlertText, setGridAlertText] = React.useState(
		"No Spec Books uploaded to the Spec Books Drive Folder yet"
	);
	const [speckBookDialog, setSpeckBookDialog] = useState(false);
	const [specToastMessage, setSpecToastMessage] = useState<string>("");
	const toastMessageForSM = useAppSelector(getToastMessageForSM);

	useEffect(() => {
		if(originalGridData.length > 0) {
			let filterData = originalGridData.filter((x: any) => x.status === 3);
			if(filterData.length > 0) {
				let list: any = [];
				for(let i = 0;i < filterData.length;i++) {
					list.push({
						id: filterData?.[i]?.id,
						label: filterData?.[i]?.name,
						value: filterData?.[i]?.name,
						text: filterData?.[i]?.name,
					});
				}
				dispatch(setBidPackageDropdownValues(GetUniqueList(list, "label")));
			}
		}
	}, [originalGridData]);
	useEffect(() => {
		if(server) {
			dispatch(getSMList());
			// dispatch(fetchSettings(server));
			dispatch(fetchGridData(server));
			// dispatch(fetchSettingsCostCodeAndType(server));
			dispatch(getDivisionList());
			dispatch(getUnpublishedCount());
			return () => {};
		}
	}, [server]);
	useEffect(() => {
		if(SMData?.length > 0) {
			findAndUpdateFiltersData('specs', SMData, "division", true, "text", true, "number");
			findAndUpdateFiltersData('specs', SMData, "bidPackageName");
			findAndUpdateFiltersData('specs', SMData, "specBook", true, "displayName");
			const data: any = SMData.map((item: any) => ({
				...item, pages: `${item.startPage} - ${item.endPage}`,
				bidPackageValue: item.bidPackageName === null || item.bidPackageName === '' ? 'NA' : item.bidPackageName
			}));
			setSpecModifiedList(data);
			setSpecRowData(data);
		} else {
			setSpecModifiedList([]);
			setSpecRowData([]);
		}
	}, [SMData]);
	useEffect(() => {
		console.log("fileQueue smw", fileQueue);
		if(fileQueue?.length) {
			dispatch(setSSBrenaStatus(true));
			dispatch(setSMBrenaStatus(true));
		};
	}, [fileQueue]);

	useEffect(() => {
		if(unpublishedCount) {
			let show = unpublishedCount?.lastUnpublishedCount > 0;
			setShowSpecCenterPiece(show);
		}
	}, [unpublishedCount]);
	useEffect(() => {
		setSpecToastMessage(toastMessageForSM);
		setTimeout(() => {
			dispatch(setToastMessageForSM(""));
		}, 3000);
	}, [toastMessageForSM]);
	const onSpecFilterChange = useCallback((filterValues: any) => {setSelectedSpecFilters(filterValues);}, []);
	const onSpecGroupingChange = useCallback((groupValue: any) => {
		if(groupValue !== "") {
			let updatedColumns: any = [...specColDefs].map((rec: any) => {
				if(groupValue) return {...rec, rowGroup: rec.field === groupValue};
				else return {...rec, rowGroup: false, sort: null};
			});
			setSpecColDefs(updatedColumns);
		}
	}, []);
	const onSpecGridSearch = (searchTxt: string) => {
		setGridSpecSearchText(searchTxt);
	};
	const SpecSearchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(gridSpecSearchText, 'gi');
			const searchVal = Object.keys(item).some((field) => {
				if((item[field] ?? false) && typeof item[field] === "object") {
					return Object.keys(item?.[field])?.some((objField) => {
						return item?.[field]?.[objField]?.toString()?.match(regex);
					});
				} else {
					return item?.[field]?.toString()?.match(regex);
				}
			});
			const filterVal = (_.isEmpty(selectedSpecFilters) || (!_.isEmpty(selectedSpecFilters)
				&& (_.isEmpty(selectedSpecFilters.division) || selectedSpecFilters.division?.length === 0 || selectedSpecFilters.division?.indexOf(`${item.division.number} - ${item.division.text}`) > -1)
				&& (_.isEmpty(selectedSpecFilters.specBook) || selectedSpecFilters.specBook?.length === 0 || selectedSpecFilters.specBook?.indexOf(item.specBook?.displayName) > -1)
				&& (_.isEmpty(selectedSpecFilters.bidPackageName) || selectedSpecFilters.bidPackageName?.length === 0 || selectedSpecFilters.bidPackageName?.indexOf(item?.bidPackageValue)) > -1));
			return searchVal && filterVal;
		});
	};
	const specGroupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
			suppressGroupRowsSticky: true,
		};
	}, []);
	const onSpecRowSelection = (e: any) => {
		let ids: any = [];
		const SelectionService = e.api.getSelectedNodes();
		SelectionService.forEach((item: any) => {
			if(item?.selected) {
				ids.push(item.data.id);
			}
		});
		dispatch(setSelectedRecsData(SelectionService));
		selectedSpecRecData.current = SelectionService;
		selectedSpecRecIds.current = ids;
	};
	const handleSpecDeleteAction = () => {
		let payload = selectedSpecRecIds?.current?.map((recId) => {
			let specObj = {
				id: recId,
			};
			return specObj;
		});
		deleteMultipleSpecSections(payload)
			.then((res: any) => {
				dispatch(getSMList());
			})
			.catch((error: any) => {
				console.log("error", error);
			});
	};
	const handleBulkUpdateClose = () => {
		dispatch(setBulkUpdateDialog(false));
	};
	const handleBulkDialogApply = (val: any) => {
		if(val == "ok") {
			let payload: any = [];
			selectedSpecRecData?.current?.map((item: any) => {
				payload.push({
					id: item?.data?.id,
					// status: item?.data?.status,
					...bulkUpdateFormValues,
				});
			});
			publishMultipleSpecSection(payload)
				.then((res: any) => {
					if(res) {
						dispatch(getSMList());
						dispatch(setBulkUpdateBtnDisabled(true));
						dispatch(setBulkUpdateFormValues({}));
						dispatch(setBulkUpdateDialog(false));
					}
				})
				.catch((err: any) => {
					console.log("error", err);
					dispatch(setBulkUpdateBtnDisabled(true));
					dispatch(setBulkUpdateFormValues({}));
				});
		} else if(val === "close") {
			dispatch(setBulkUpdateDialog(false));
		}
	};
	const handleSpecDialogActions = (val: any) => {
		if(val == "ok") {

		} else if(val === "close") {
			dispatch(setSpecSessionDlg(false));
		}
	};
	const handleSpecSessionActions = (e: any, val: any) => {
		if(val === 'resume') {
			dispatch(setSMBrenaStatus(true));
			dispatch(setSSBrenaStatus(true));
		} else if(val === 'startFresh') {
			let params: any = {
				// iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType
			};
			params.folderType = "SpecBooks";
			params.toExtractSpecs = true;

			postMessage({
				event: "getdrivefiles",
				body: params,
			});
			dispatch(setSpecStartNewSession(false));
			dispatch(setSpecSessionDlg(false));
		}
	};
	useEffect(() => {
		if(gridSpecSearchText || selectedSpecFilters) {
			const data = SpecSearchAndFilter([...specModifiedList]);
			setSpecRowData(data);
		}
	}, [selectedSpecFilters, gridSpecSearchText]);
	const specComponentPropsChanged = useCallback((params: any) => {
		params.api.setColumnDefs(specColDefs);
	}, [specColDefs, mainWindowActiveTab]);
	const handleMainWindowTab = (e: any) => {
		setMainWindowActiveTab(e);
	};
	useEffect(() => {
		if(mainWindowActiveTab === 'specs') {
			dispatch(getSMList());
		} else if(mainWindowActiveTab === 'submittals') {
			dispatch(getSmartSubmitalGridList({type: defaultType}));
		}
	}, [mainWindowActiveTab]);
	return (
		<>
			<GridWindow
				centerPiece={(showSpecCenterPiece && mainWindowActiveTab === 'specs') && 'You have Unpublished specs  from the previous session, click Extract Spec AI button to resume.'}
				open={true}
				title="Smart Submittals"
				className="smart-submittals-window"
				iconCls="common-icon-smart-submittals"
				appType="SmartSubmittals"
				appInfo={server}
				iFrameId="smartSubmittalsIframe"
				zIndex={100}
				onClose={handleClose}
				manualLIDOpen={manualLIDOpen}
				moduleColor="#379000"
				inlineModule={isInline}
				isFullView={isFullView}
				maxByDefault={isMaxByDefault}
				onIconClick={handleIconClick}
				presenceProps={{
					presenceId: "smart-submittals-presence",
					showLiveSupport: true,
					showLiveLink: true,
					showStreams: true,
					showComments: true,
					showChat: false,
					hideProfile: false,
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
				onDetailClose={() => {
					setManualLIDOpen(false);
					setSpecManualLIDOpen(false);
				}}
				lidCondition={(rowData: any) => {
					return defaultType === 'default' ? false : true;
				}}
				handleMainWindowTab={(e: any) => handleMainWindowTab(e)}
				detailGridNavigation={true}
				content={{
					type: "tabs",
					tabs: [
						//   {
						//   tabId: "specs",
						//   label: "Specs",
						//   showCount: true,
						//   iconCls: "common-icon-spec-manager",
						//   content: {
						//     detailView: SpecificationManagerLID,
						//     toolbar: {
						//       leftItems: (
						//         <SMLeftButtons
						//         handleDeleteAction={handleSpecDeleteAction}
						//         setManualLIDOpen={setManualLIDOpen}
						//         />
						//       ),
						//       rightItems: <SMRightButtons />,
						//       searchComponent: {
						//         show: true,
						//         type: "regular",
						//         onSearchChange: onSpecGridSearch,
						//         groupOptions: specGroupOptions,
						//         filterOptions: specFilterOptions,
						//         onGroupChange: onSpecGroupingChange,
						//         onFilterChange: onSpecFilterChange,
						//         defaultGroups: "division",
						//       },
						//     },
						//     grid: {
						//       headers: specColDefs,
						//       data: specRowData,
						//       grouped: true,
						//       groupIncludeTotalFooter: false,
						//       groupSelectsChildren: true,
						//       groupIncludeFooter: false,
						//       rowSelection: "multiple",
						//       groupDefaultExpanded: 1,
						//       rowSelected: (e: any) => onSpecRowSelection(e),
						//       nowRowsMsg:
						//       "<div>Create New Change Event Request by Clicking the + Add button above</div>",
						//       animateRows: false,
						//       groupDisplayType: 'groupRows',
						//       groupRowRendererParams: specGroupRowRendererParams,
						//       componentPropsChanged : specComponentPropsChanged
						//     },
						//   },
						// },
						{
							tabId: "submittals",
							label: "Submittals",
							showCount: false,
							iconCls: "common-icon-smart-submittals",
							// detailView: SmartSubmittalLID,
							content: {
								detailView: SmartSubmittalLID,
								toolbar: {
									// leftItems: <SubmitalBrenaToolbar />,
									leftItems: <SSLeftToolbar defaultType={defaultType} />,
									rightItems: <SSRightToolbar />,
									searchComponent: {
										show: true,
										type: "regular",
										onSearchChange: onGridSearch,
										groupOptions: submittalGroupOptions,
										filterOptions: submittalFilterOptions,
										onGroupChange: onGroupingChange,
										onFilterChange: onFilterChange,
										defaultGroups: defaultGroupValue
									},
								},
								grid: {
									headers: colDefs,
									data: rowData,
									grouped: true,
									groupIncludeTotalFooter: false,
									groupSelectsChildren: true,
									groupIncludeFooter: false,
									rowSelection: "multiple",
									groupDefaultExpanded: 1,
									rowSelected: (e: any) => onRowSelection(e),
									nowRowsMsg:
										"<div>No Spec Sections found. Click here to get started</div>",
									animateRows: false,
									groupDisplayType: 'groupRows',
									groupRowRendererParams: groupRowRendererParams,
									detailCellRendererParams: detailCellRendererParams,
									isRowMaster: isRowMaster,
									masterDetail: true,
									componentPropsChanged: componentPropsChanged,
									onFirstDataRendered: onFirstDataRendered,
								},
							},
						},
						{
							tabId: "submittalPackage",
							label: "Submittal Package",
							showCount: true,
							iconCls: "common-icon-package",
							content: <>Submittal Package</>,
						},
					],
				}}
			/>
			<div
				ref={gridTooltipRef}
				id="grid-cell-tooltip-id"
				className="sui-grid-cell-ellipisis-tooltip"
				style={{display: "none"}}
			></div>

			{/* <SSSnackBar /> */}
			{SSBrenaOpen && <SSBrenaWindow />}
			<SMSpecBookDailog
				open={speckBookDialog}
				contentText={<SpecBookDialogContent specRecord={fileQueue} />}
				title={""}
				showActions={false}
				dialogClose={true}
				helpIcon={true}
				iconTitleContent={
					<div style={{display: "flex", alignItems: "center"}}>
						<div>Spec Book</div>
					</div>
				}
				onAction={() => {
					setSpeckBookDialog(false);
				}}
				customButtons={true}
				customButtonsContent={<SpeckBookButtons />}
			/>
			<SMSpecBookDailog
				open={false}
				onClose={() => {
					//   handleNotAllowedUserActions("cancel");
				}}
				contentText={<SpecBookStartSessionContent />}
				width={520}
				title={""}
				showActions={false}
				dialogClose={true}
				// showSession={false}
				customButtons={true}
				customButtonsContent={<SpecBookStartSessionButtons />}
				iconTitleContent={
					<div style={{display: "flex", alignItems: "center"}}>
						<div>Confirmation</div>
					</div>
				}
			/>

			<SMSpecBookDailog
				open={false}
				onClose={() => {
					//   handleNotAllowedUserActions("cancel");
				}}
				contentText={<SpecBookPublishContent />}
				width={535}
				title={""}
				showActions={false}
				dialogClose={true}
				// showSession={false}
				customButtons={true}
				customButtonsContent={<SpecBookPublishButtons />}
				iconTitleContent={
					<div style={{display: "flex", alignItems: "center"}}>
						<div>Confirmation</div>
					</div>
				}
			/>

			<SMSpecBookDailog
				open={bulkUpdateDialog}
				onClose={() => handleBulkUpdateClose()}
				contentText={<SpecBookBulkContent readOnly={true} />}
				width={470}
				title={""}
				showActions={true}
				dialogClose={true}
				positiveActionLabel={"APPLY"}
				iconTitleContent={
					<div style={{display: "flex", alignItems: "center"}}>
						<div>Bulk Update</div>
					</div>
				}
				onAction={(e: any, type: string) => handleBulkDialogApply(type)}
				disable={bulkUpdateBtnDisabled}
				showNegativeBtn={false}
			/>

			{gridAlert && (
				<Alert
					severity="success"
					className="floating-toast-cls in-lefttoolbar"
					onClose={() => {
						setGridAlert(false);
					}}
				>
					<span className="toast-text-cls">{gridAlertText}</span>
				</Alert>
			)}
			{/* <SpecBookSnackbar /> */}
			{openBrena && <SMBrenaWindow />}
			<SMSpecBookDailog
				open={specSessionDlg ?? false}
				onClose={() => {
					//   handleNotAllowedUserActions("cancel");
				}}
				contentText={<SMSessionDialogContent />}
				width={519}
				title={""}
				showActions={false}
				dialogClose={true}
				// showSession={false}
				customButtons={true}
				customButtonsContent={<SSUnCommitedBtns handleApply={(e: any, type: any) => handleSpecSessionActions(e, type)} />}
				iconTitleContent={
					<div style={{display: "flex", alignItems: "center"}}>
						<div>Confirmation</div>
					</div>
				}
				onAction={(e: any, type: string) => handleSpecDialogActions(type)}
			/>
		</>
	);
};

export default memo(SmartSubmittalsWindow);
