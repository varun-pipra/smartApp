import {
	setCurrencySymbol,
	setServer,
} from "app/common/appInfoSlice";
import {useAppDispatch, useAppSelector, useHomeNavigation} from "app/hooks";
import {currency, isLocalhost, postMessage} from "app/utils";
import {appInfoData} from "data/appInfo";
import _ from "lodash";
import {memo, useEffect, useMemo, useState, useRef, useCallback} from "react";
import {triggerEvent} from "utilities/commonFunctions";
import "./SmartSubmittalsWindow.scss";
import {Button} from "@mui/material";
import {SSLeftToolbar} from "./content/toolbar/sslefttoolbar/SSLeftToolbar";
import {SSRightToolbar} from "./content/toolbar/ssrighttoolbar/SSRightToolbar";
import {
	getSubmittalsStatus,
	getSubmittalsStatusLabel,
} from "utilities/smartSubmittals/enums";
import {
	getSmartSubmitalGridList,
	setRightPanelNavCount,
	setRightPanelNavFlag,
	setRightPanelUpdated,
	setSSBrenaStatus,
	setSSRightPanelData,
	setSelectedRecord,
	setSelectedRecordsData,
} from "./stores/SmartSubmitalSlice";
import {fetchSmartSubmitalDetailGridList} from "./stores/SmarSubmitalAPI";
import SSBrenaWindow from "./smartsubmittalbrena/SSBrenaWindow";
import {getSubmittalType} from "./smartsubmittalbrena/content/leftpanel/stores/SmartSubmitalLeftToolbarSlice";
import {
	getUploadQueue,
	setUploadQueue,
} from "../specificationmanager/stores/FilesSlice";
import React from "react";
import SmartSubmittalLID from "./details/SmartSubmittalLID";
import TabbedWindowContent from "components/iqtabbedwindow/tab/TabbedWindowContent";
interface SmartSubmittalWindowProps {
	activeTab?: String;
}
const SmartSubmittalsTab = ({activeTab, ...props}: SmartSubmittalWindowProps) => {

	const dispatch = useAppDispatch();
	const [localhost] = useState(isLocalhost);
	const [appData] = useState(appInfoData);
	const {gridData, rightPanelUpdated, rightPanelNavCount, rightPanelNavFlag} = useAppSelector(
		(state: any) => state.smartSubmittals
	);
	const {server, currencySymbol} = useAppSelector((state) => state.appInfo);
	const [manualLIDOpen, setManualLIDOpen] = useState<boolean>(false);
	const [modifiedList, setModifiedList] = useState<Array<any>>([]);
	const {resumeLaterDlg, SSBrenaOpen} = useAppSelector((state) => state.smartSubmittals);
	const [rowData, setRowData] = useState([]);
	const gridTooltipRef = useRef<any>();
	const [gridSearchText, setGridSearchText] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<any>();
	const [defaultType, setDefaultType] = useState<any>();
	const gridApi = useRef<any>();
	const [defaultGroupValue, setDefaultGroupValue] = useState(
		"divisionSubmitalType"
	);
	const [currentSelectedDetailIndex, setCurrentSelectedDetailIndex] = useState('');

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
				keyCreator: (params: any) =>
					((params.data?.sectionStatus ?? params.data?.status) &&
						(getSubmittalsStatusLabel(params.data?.sectionStatus) ??
							getSubmittalsStatusLabel(params.data?.status))) ||
					"None",
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
				keyCreator: (params: any) => params.data?.sectionTitle || "None",
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
						return `${params?.data?.startPage} - ${params?.data?.endPage ?? params?.data?.startPage
							}`;
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
			},
			{
				headerName: "Status",
				field: "status",
				hide: true,
				show: false,
				minWidth: 250,
				suppressMenu: true,
				resizable: true,
				keyCreator: (params: any) => params.data?.status || "None",
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
				cellRenderer: "agGroupCellRenderer",
				minWidth: 540,
				resizable: true,
				keyCreator: (params: any) => params.data?.title || "None",
				valueGetter: (params: any) =>
					`${params?.data?.number} - ${params?.data?.title}`,
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
					} else return "";
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
						return `${params?.data?.startPage} - ${params?.data?.endPage ?? params?.data?.startPage
							}`;
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
				valueGetter: (params: any) =>
					params.data?.bidPackageName === null ||
						params.data?.bidPackageName === ""
						? "NA"
						: params.data?.bidPackageName,
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
					} else return "";
				},
			},
		],
		[]
	);
	const submittalGroupOptions = useMemo(() => {
		var groupingMenu = [
			{text: "Division  ", value: "division"},
			{text: "Submittal Type  ", value: "type"},
			{text: "Submittal Status ", value: "status"},
			{text: "Spec Section", value: "sectionTitle"},
			{text: "Bid Package", value: "bidPackageName"},
			{text: "Division & Spec Section", value: "divisionSubmitalType"},
			{text: "Spec Book", value: "specBook"},
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
		customKey?: any
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
			else
				return {
					text: rec?.[key] === "" ? "NA" : rec?.[key],
					value: rec?.[key] === "" ? "NA" : rec?.[key],
					id: rec?.id,
				};
		});
		const filtersCopy: any = [...submittalFilterOptions];
		let currentItem: any = filtersCopy.find((rec: any) => rec?.value === key);
		currentItem.children.items = GetUniqueList(formattedData, "text");
	};

	/**
	 * All initial APIs will be called here
	 * Grid API
	 * Dropdown APIs that supports adding a new record
	 */
	useEffect(() => {
		if(server) dispatch(getSubmittalType());
		if(defaultType && server)
			dispatch(getSmartSubmitalGridList({type: defaultType}));
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
				sectionTitle: item.sectionTitle ? item.sectionTitle : item.title,
			}));
			findAndUpdateFiltersData("submittals", data, "sectionTitle");
			findAndUpdateFiltersData("submittals", data, "bidPackageName");
			findAndUpdateFiltersData(
				"submittals",
				data,
				"specBook",
				true,
				"displayName"
			);
			findAndUpdateFiltersData("submittals", data, "type");
			setRowData(data);
			setModifiedList(data);
			setColDefs(colDefs);
		} else  {
			setRowData(gridData);
			setModifiedList(gridData);
		}
	}, [gridData]);

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
		if(defaultType && server)
			dispatch(getSmartSubmitalGridList({type: defaultType}));
	}, [defaultType]);
	const handleDetailRowDoubleClick = (selectedRow: any) => {
		setManualLIDOpen(true);
		dispatch(setSSRightPanelData(selectedRow.data));
		gridApi.current.api.detailGridInfoMap = _.pickBy(gridApi?.current?.api?.detailGridInfoMap);
		const detailGrid = gridApi?.current?.api?.detailGridInfoMap;
		Object.entries(gridApi?.current?.api?.detailGridInfoMap).filter(([key]) => {
          let nodes = detailGrid?.[key]?.api?.getSelectedNodes();
          if (nodes.length > 0) {
            nodes.forEach((element: any) => {
              if (element.data.uniqueid === selectedRow.data.uniqueid) {
                const grid = gridApi?.current?.api?.detailGridInfoMap?.[key]?.api;
                const rowIndex = grid?.getSelectedNodes()?.[0]?.rowIndex || 0;
                const totalCount = grid?.getDisplayedRowCount() || 0;
                let currentRecord;
                currentRecord = grid?.getDisplayedRowAtIndex(rowIndex + 1);

                if (rowIndex === 0) dispatch(setRightPanelNavFlag(-1));
                else if (rowIndex === totalCount - 1) dispatch(setRightPanelNavFlag(1));
                else dispatch(setRightPanelNavFlag(0));
                dispatch(setRightPanelNavCount({
                    startPage: currentRecord ? currentRecord?.rowIndex : totalCount === 1 ? totalCount : rowIndex,
                    endPage: totalCount,
                  })
                );
                setCurrentSelectedDetailIndex(key);
                element.setSelected(true);
              } else {
                element.setSelected(false);
              }
            });
          }
        }
      );
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
					const getDetailRows =
						selectedNode?.detailNode?.detailGridInfo?.api?.getRenderedNodes();
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
	const onFilterChange = useCallback((filterValues: any) => {
		setSelectedFilters(filterValues);
	}, []);
	const onGroupingChange = useCallback((groupValue: any) => {
		let updatedColumns: any;
		setDefaultGroupValue(groupValue);
		if((groupValue ?? false) && groupValue !== "") {
			setDefaultType((prev: any) => {
				if(prev === "none") {
					dispatch(setSelectedRecordsData([]));
					return "default";
				}
				return "default";
			});
			updatedColumns = [...colDefs].map((rec: any) => {
				if(rec.hide && !rec.show)
					return {...rec, hide: true, rowGroup: false, sort: null};
				if(groupValue) return {...rec, rowGroup: rec.field === groupValue};
				else if(rec?.key === "colorDiv")
					return {...rec, rowGroup: false, sort: null, hide: true};
				else return {...rec, rowGroup: false, sort: null, hide: false};
			});
			setColDefs(updatedColumns);
		} else if(groupValue === undefined) {
			dispatch(setSelectedRecordsData([]));
			setDefaultType("none");
			let updatedColumns: any = [...colDefs].map((rec: any) => {
				if(rec.show) return {...rec, rowGroup: false, hide: true};
				else if(!rec.show)
					return {...rec, hide: false, rowGroup: false, sort: null};
				else return {...rec, rowGroup: false, hide: true};
			});
			setColDefs(updatedColumns);
		}
	}, []);
	const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(gridSearchText, "gi");
			const searchVal = Object.keys(item).some((field) => {
				if((item[field] ?? false) && typeof item[field] === "object") {
					return Object.keys(item?.[field])?.some((objField) => {
						return item?.[field]?.[objField]?.toString()?.match(regex);
					});
				} else {
					return item?.[field]?.toString()?.match(regex);
				}
			});
			const filterVal =
				_.isEmpty(selectedFilters) ||
				(!_.isEmpty(selectedFilters) &&
					(_.isEmpty(selectedFilters.sectionTitle) ||
						selectedFilters.sectionTitle?.length === 0 ||
						selectedFilters.sectionTitle?.indexOf(item.sectionTitle) > -1) &&
					(_.isEmpty(selectedFilters.title) ||
						selectedFilters.title?.length === 0 ||
						selectedFilters.title?.indexOf(item.title) > -1) &&
					(_.isEmpty(selectedFilters.status) ||
						selectedFilters.status?.length === 0 ||
						selectedFilters.status?.indexOf(item.status) > -1) &&
					(_.isEmpty(selectedFilters.specBook) ||
						selectedFilters.specBook?.length === 0 ||
						selectedFilters.specBook?.indexOf(item.specBook?.displayName) >
						-1) &&
					(_.isEmpty(selectedFilters.bidPackageName) ||
						selectedFilters.bidPackageName?.length === 0 ||
						selectedFilters.bidPackageName?.indexOf(item?.bidPackageName)) >
					-1);
			return searchVal && filterVal;
		});
	};
	const CustomGroupHeader = memo((props: any) => {
		const {label, params, childCount, level, ...rest} = props;
		const width = 500;
		const style = {width: width, minWidth: width, maxWidth: width};
		return (
			<div className="custom-group-header-cls" style={style}>
				<div
					className="custom-group-header-label-cls"
					style={{width: "97%", overflow: "hidden", textOverflow: "ellipsis"}}
				>
					<span>{label} </span>
					<span>{`(${childCount})`}</span>
				</div>
				<div style={{width: "3%"}}>
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
					<CustomGroupHeader
						params={data}
						label={node?.key}
						childCount={node?.allChildrenCount}
						level={node?.level}
					/>
				</>
			);
		}
	};
	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: true,
			suppressGroupRowsSticky: true,
			innerRenderer: GroupRowInnerRenderer,
		};
	}, []);
	useEffect(() => {
		if(gridSearchText || selectedFilters) {
			const data = searchAndFilter([...modifiedList]);
			setRowData(data);
		}
	}, [gridSearchText, selectedFilters]);
	// const modifiedData = searchAndFilter(rowData);
	const componentPropsChanged = useCallback(
		(params: any) => {
			if(defaultType === "default") {
				const cols: any = params.api.getColumnDefs();
				let updatedCols: any;
				updatedCols = [...cols].map((rec: any) => {
					if(rec.hide && rec.checkboxSelection) return {...rec, hide: false};
					else return {...rec};
				});
				if(!_.isEqual(cols, updatedCols)) {
					params.api.setColumnDefs(updatedCols);
				}
			} else if(defaultType === "none") {
				const cols: any = params.api.getColumnDefs();
				let updatedCols: any;
				updatedCols = [...cols].map((rec: any) => {
					if(rec.headerName === "Submittal Title" && rec.pinned === "left")
						return {...rec, pinned: null};
					else return {...rec};
				});
				if(!_.isEqual(cols, updatedCols)) {
					params.api.setColumnDefs(updatedCols);
				}
			}
		},
		[colDefs, activeTab]
	);
	const onFirstDataRendered = useCallback((params: any) => {
		gridApi.current = params;
	}, []);
	useEffect(() => {
		if(rightPanelUpdated) {
			let getDetailRows = gridApi.current.api
				.getRenderedNodes()
				.filter((x: any) => x.master && x.expanded);
			if(getDetailRows.length > 0) {
				getDetailRows.map((row: any) => {
					gridApi.current.api
						.getDisplayedRowAtIndex(row.rowIndex)
						.setExpanded(false);
					setTimeout(() => {
						gridApi.current.api
							.getDisplayedRowAtIndex(row.rowIndex)
							.setExpanded(true);
					}, 500);
				});
			}
			dispatch(setRightPanelUpdated(false));
		}
	}, [rightPanelUpdated]);
	useEffect(() => {
		if(activeTab === 'submittals') {
			dispatch(getSmartSubmitalGridList({type: defaultType}));
			gridApi?.current?.api?.deselectAll();
			dispatch(setSelectedRecord({}));
			dispatch(setSelectedRecordsData([]));
			setManualLIDOpen(false);
		};
	}, [activeTab]);

	const onPrevious = () => {
			const detailGrid = gridApi?.current?.api?.detailGridInfoMap?.[currentSelectedDetailIndex];
			const node = detailGrid.api.getSelectedNodes()[0];
			const rowIndex = node?.rowIndex || 0;
			const totalCount = detailGrid?.api?.getDisplayedRowCount() || 0;
			let currentRecord;
			currentRecord = detailGrid?.api?.getDisplayedRowAtIndex(rowIndex - 1);
			currentRecord.setSelected(true, true);

			if((rowIndex - 1) === 0) dispatch(setRightPanelNavFlag(-1));
			else dispatch(setRightPanelNavFlag(0));
			 dispatch(setRightPanelNavCount({
				startPage: currentRecord ? (currentRecord?.rowIndex + 1)  : rowIndex + 1,
				endPage: totalCount
			}));
			dispatch(setSSRightPanelData(currentRecord?.data));
	};

	const onNext = () => {
			const detailGrid = gridApi?.current?.api?.detailGridInfoMap?.[currentSelectedDetailIndex];
			const node = detailGrid.api.getSelectedNodes()[0];
			const rowIndex = node?.rowIndex || 0;
			const totalCount = detailGrid?.api?.getDisplayedRowCount() || 0;
			let currentRecord;
			currentRecord = detailGrid?.api?.getDisplayedRowAtIndex(rowIndex + 1);
			currentRecord.setSelected(true, true);	
			
			if((rowIndex + 1) === (totalCount - 1)) dispatch(setRightPanelNavFlag(1));
			else dispatch(setRightPanelNavFlag(0));
			dispatch(setRightPanelNavCount({
				startPage: currentRecord ? (currentRecord?.rowIndex + 1)  : rowIndex + 1,
				endPage: totalCount
			}));
			dispatch(setSSRightPanelData(currentRecord?.data));	
	};
	useEffect(() => {
		if(activeTab === 'submittals' && !resumeLaterDlg) {
			dispatch(getSmartSubmitalGridList({type: defaultType}));
			gridApi?.current?.api?.deselectAll();
			dispatch(setSelectedRecord({}));
			dispatch(setSelectedRecordsData([]));
			setManualLIDOpen(false);
		};
	},[resumeLaterDlg])
	return (
		<>
			<TabbedWindowContent
				onPreviousNavigation={defaultType === "default" ? onPrevious : undefined}
				onNextNavigation={defaultType === "default" ? onNext : undefined}
				manualLIDOpen={manualLIDOpen}
				onDetailClose={() => {
					setManualLIDOpen(false);
				}}
				lidCondition={(rowData: any) => {
					return defaultType === "default" ? false : true;
				}}
				navigationFlag= {rightPanelNavFlag}
				navigationCount = {rightPanelNavCount}
				detailGridNavigation={true}
				detailView={SmartSubmittalLID}
				toolbar={{
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
						defaultGroups: defaultGroupValue,
					},
				}}
				grid={{
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
					groupDisplayType: "groupRows",
					groupRowRendererParams: groupRowRendererParams,
					detailCellRendererParams: detailCellRendererParams,
					isRowMaster: isRowMaster,
					masterDetail: true,
					componentPropsChanged: componentPropsChanged,
					onFirstDataRendered: onFirstDataRendered,
					activeTab: activeTab
				}}
			/>
			<div
				ref={gridTooltipRef}
				id="grid-cell-tooltip-id"
				className="sui-grid-cell-ellipisis-tooltip"
				style={{display: "none"}}
			></div>
			{SSBrenaOpen && <SSBrenaWindow />}
		</>
	);
};

export default memo(SmartSubmittalsTab);