import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { getServer } from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
	getSMList,
	getSpecBookPages,
} from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import { setSepcSelectedRecord } from "features/bidmanager/stores/BidManagerSlice";
import * as React from "react";
import IQSearch from "components/iqsearchfield/IQSearchField";
import SUIDialog from "sui-components/Dialog/Dialog";
import SUIGrid from "sui-components/Grid/Grid";
import "./AddSpecificationsDialog.scss";
import { GetUniqueList } from "features/safety/sbsmanager/utils";
import _ from "lodash";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SmartDialog from "components/smartdialog/SmartDialog";
import { HeadsetMic } from "@mui/icons-material";
import IQTooltip from "components/iqtooltip/IQTooltip";
import IQButton from "components/iqbutton/IQButton";

const AddSpecificationsDialog = (props: any) => {
	const { open = false, divisionrecord, ...rest } = props;
	const appInfo = useAppSelector(getServer);
	const [isFullView, setIsFullView] = React.useState(false);
	const presenceId = "add-specifications-presence";
	const dispatch = useAppDispatch();
	const { SMData, specBookpages } = useAppSelector((state) => state.specificationManager);
	const [specModifiedList, setSpecModifiedList] = React.useState<Array<any>>([]);
	const [selected, setSelected] = React.useState<any>([]);
	const [selectedFilters, setSelectedFilters] = React.useState<any>();
	const [rowData, setRowData] = React.useState([]);
	const [gridSearchText, setGridSearchText] = React.useState("");
	const [openSpecDocViewer, setOpenSpecDocViewer] = React.useState(false);
	const [specBookPagesData, setSpecBookPagesData] = React.useState({});
	const [defaultFilter, setDefaultFilter] = React.useState({ "division": ["1 - GENERAL"] })
	const onImagePreview = (event: any) => {
		const { data } = event;
		handelFileClick(data);
	};
	const filterOptions = React.useMemo(() => {
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
		];
		return filterMenu;
	}, []);

	React.useEffect(() => {
		if (specBookpages.hasOwnProperty("totalCount")) {
			console.log('specBookpages', specBookpages)
			setSpecBookPagesData(specBookpages);
			setOpenSpecDocViewer(true);
		}
	}, [specBookpages]);

	React.useEffect(() => {
		if (divisionrecord.length > 0) {
			console.log('divisionrecord', divisionrecord);
			setDefaultFilter({ "division": divisionrecord })	
		}
	}, [divisionrecord]);

	const specColumns = [
		{
			headerName: "Spec Number",
			pinned: "left",
			rowGroup: true,
			field: "number",
			cellClass: "sm-number",
			cellRenderer: "agGroupCellRenderer",
			// sort: "asc",
			checkboxSelection: true,
			headerCheckboxSelection: true,
			resizable: true,
			minWidth: 200,
		},

		{
			headerName: "Spec Section Title",
			field: "sectionName",
			cellClass: "sm-sectionName",
			resizable: true,
			suppressMenu: true,
			pinned: "left",
			valueGetter: (params: any) => {
				return params.data?.title;
			},
		},
		{
			headerName: "Spec Book",
			field: "specBook",
			minWidth: 150,
			suppressMenu: true,
			resizable: true,
			cellClass: "sm-specBookName",
			keyCreator: (params: any) => params.data?.specBook?.fileName || "None",
			valueGetter: (params: any) => `${params?.data?.specBook?.fileName}`,
		},
		{
			headerName: "Division",
			field: "division",
			cellClass: "sm-division",
			minWidth: 250,
			//   rowGroup: true,
			resizable: true,
			suppressMenu: true,
			keyCreator: (params: any) =>
				(params.data.division &&
					`${params.data.division.number} - ${params.data.division.text}`) || "None",
					// `${params.data.division.text}`) || "None",
			valueGetter: (params: any) => {
				const division = params?.data?.division;
				if (
					division &&
					division.number !== undefined &&
					division.text !== undefined
				)
					return `${division.number} - ${division.text}`;
					// return `${division.text}`;
			},
		},

		{
			headerName: "Bid Package",
			field: "bidPackageName",
			cellClass: "sm-bidPackages",
			minWidth: 250,
			resizable: true,
			suppressMenu: true,
			keyCreator: (params: any) => params.data?.bidPackageName || "None",
			valueGetter: (params: any) =>
				params.data?.bidPackageName === "" ? "NA" : params.data?.bidPackageName,
		},
		{
			headerName: "Pages",
			field: "pages",
			cellClass: "sm-pages",
			minWidth: 120,
			suppressMenu: true,
			resizable: true,
			cellStyle: { color: "#059cdf" },
			valueGetter: (params: any) =>
				params?.data?.startPage
					? `${params?.data?.startPage} - ${params?.data?.endPage}`
					: "NA",
		},
		{
			headerName: "File",
			field: "thumbnailUrl",
			menuTabs: [],
			minWidth: 50,
			flex: 1,
			onCellClicked: onImagePreview,
			cellStyle: {
				display: "flex",
				alignItems: "normal",
				justifyContent: "left",
				cursor: 'pointer'
			},
			cellRenderer: (params: any) => {
				return (
					<img
						src={params.data.specBook.icon}
						className="thumbnailUrl-cls"
					/>
				);
			},
		},
	];

	const findAndUpdateFiltersData = (data: any, key: string, nested?: boolean, nestedKey?: any, custom?: boolean, customKey?: any) => {
		const formattedData = data?.map((rec: any) => {
			if (custom)
				return {
					text: `${rec?.[key]?.[customKey]} - ${rec?.[key]?.[nestedKey]}`,
					// value: `${rec?.[key]?.[customKey]} - ${rec?.[key]?.[nestedKey]}`,
					value: `${rec?.[key]?.[nestedKey]}`,
					id: rec?.id,
				};
			else if (nested)
				return {
					text: rec?.[key]?.[nestedKey],
					value: rec?.[key]?.[nestedKey],
					id: rec?.id,
				};
			else
				return {
					text: rec?.[key] === "" ? "NA" : rec?.[key],
					value: rec?.[key] === "" ? "NA" : rec?.[key],
					id: rec?.id,
				};
		});
		const filtersCopy: any = [...filterOptions];
		let currentItem: any = filtersCopy.find((rec: any) => rec?.value === key);
		currentItem.children.items = GetUniqueList(formattedData, "text");
	};

	const [colDefs, setColDefs] = React.useState<any>(specColumns);

	const [filters, setFilters] = React.useState<any>(filterOptions);

	const onFilterChange = React.useCallback((filterValues: any) => {
		console.log('filterValues', filterValues);
		setSelectedFilters(filterValues);
	}, []);

	const onGroupingChange = React.useCallback((groupValue: any) => {
		if (groupValue !== "") {
			let updatedColumns: any = [...colDefs].map((rec: any) => {
				if (groupValue) return { ...rec, rowGroup: rec.field === groupValue };
				else return { ...rec, rowGroup: false, sort: null };
			});
			setColDefs(updatedColumns);
		}
	}, []);

	const groupOptions = React.useMemo(() => {
		var groupingMenu = [
			{ text: "Division ", value: "division" },
			{ text: "Spec Book", value: "specBook" },
			// { text: "Bid Package  ", value: "bidPackageName" },
		];
		return groupingMenu;
	}, []);

	const handelFileClick = (data: any) => {
		dispatch(setSepcSelectedRecord(data));
		let payload = {
			id: data?.specBook?.id,
		};
		dispatch(getSpecBookPages(payload));
		// setOpenSpecDocViewer(true)
	};

	const rowSelected = (sltdRows: any) => {
		const selectedRowData = sltdRows.api.getSelectedRows();
		setSelected(selectedRowData);
	};

	const addSpecRec = () => {
		const files = selected.map((file: any) => {
			return {
				referenceId: file.id,
				fileType: 2,
			};
		});
		props.onAddRecord({ add: files });
	};

	React.useEffect(() => {
		if (appInfo) {
			dispatch(getSMList());
		}
	}, [appInfo]);

	React.useEffect(() => {
		if (SMData?.length > 0) {
			//   setModifiedList(SMData);
			findAndUpdateFiltersData(SMData, "division", true, "text", true, "number");
			// findAndUpdateFiltersData(SMData, "bidPackageName");
			findAndUpdateFiltersData(SMData, "specBook", true, "displayName");
			const data: any = SMData.map((item: any) => ({
				...item,
				pages: `${item.startPage} - ${item.endPage}`,
				bidPackageValue: item.bidPackageName === null || item.bidPackageName === "" ? "NA" : item.bidPackageName,
			}));
			console.log('data', data)
			setRowData(data);
		} else {
			setRowData([]);
		}
	}, [SMData]);

	const handleHelp = () => {
		// console.log('useref', tabid.current);
		// const body = { iframeId: "bidManagerIframe", roomId: bidLineItem?.id, appType: "BidManagerLineItem", tabName: tabid.current, isFromHelpIcon: isFromHelpIcon };
		// console.log('help', body);
		// postMessage({
		// 	event: "help",
		// 	body: body
		// });
	};

	const optionalTools = [
		<IQTooltip title="Help" placement={"bottom"}>
			<IconButton key={"freshdesk-tool"} aria-label="Help" onClick={handleHelp}>
				<div className="spec-live-support-btn"></div>
			</IconButton>
		</IQTooltip>,
	];
	const refreshSMGrid = () => {
		dispatch(getSMList());
		// setSelected([])
	};
	const groupRowRendererParams = React.useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
			suppressGroupRowsSticky: true,
			// innerRenderer: GroupRowInnerRenderer
		};
	}, []);

	const searchAndFilter = (list: any) => {
		return list.filter((item: any) => {
			const regex = new RegExp(gridSearchText, "gi");
			const searchVal = Object.keys(item).some((field) => {
				if ((item[field] ?? false) && typeof item[field] === "object") {
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
					(_.isEmpty(selectedFilters.division) ||
						selectedFilters.division?.length === 0 ||
						// selectedFilters.division?.indexOf(`${item.division.number} - ${item.division.text}`) > -1) 
						selectedFilters.division?.indexOf(`${item.division.text}`) > -1) 
					&&
					(_.isEmpty(selectedFilters.specBook) ||
						selectedFilters.specBook?.length === 0 ||
						selectedFilters.specBook?.indexOf(item.specBook?.displayName) >
						-1) &&
					(_.isEmpty(selectedFilters.bidPackageName) ||
						selectedFilters.bidPackageName?.length === 0 ||
						selectedFilters.bidPackageName?.indexOf(item?.bidPackageValue)) >
					-1);
			return searchVal && filterVal;
		});
	};

	const onGridSearch = (searchTxt: string) => {
		setGridSearchText(searchTxt);
	};

	const closeSpecDocViewer = () => {
		setOpenSpecDocViewer(false);
	};
	const modifiedData = searchAndFilter(rowData);

	return (
		<div className="add-spec-dlg">
			<SmartDialog
				className={"barcode-model"}
				open={open}
				PaperProps={{
					sx: { height: "85%", width: "80%" },
				}}
				onClose={props.closeAddSpec}
				custom={{
					closable: true,
					resizable: true,
					tools: [optionalTools],
					title: "Select Specifications",
					buttons: (
						<>
							<IQButton
								disabled={selected.length === 0}
								onClick={() => {
									addSpecRec();
								}}
								variant="contained"
							>
								ADD
							</IQButton>
						</>
					),
				}}
			>
				<div className="spec-main-continer" style={{ height: "100%" }}>
					<div>
						<div className="spec-search-box">
							<div
								className="refresh"
								style={{ marginLeft: "18px", cursor: "pointer" }}
							>
								<IQTooltip title="Refresh" placement="bottom">
									<IconButton
										onClick={refreshSMGrid}
										aria-label="Refresh Spec Manager"
									>
										<span className="common-icon-refresh"></span>
									</IconButton>
								</IQTooltip>
							</div>
							<Box>
								<Stack direction="row">
									<IQSearch
										groups={groupOptions}
										filters={filters}
										onFilterChange={onFilterChange}
										onGroupChange={(selectedVal: any) =>
											onGroupingChange(selectedVal)
										}
										defaultGroups={"division"}
										defaultFilters={defaultFilter}
										onSearchChange={(text: string) => onGridSearch(text)}
									/>
								</Stack>
							</Box>
						</div>
					</div>
					<div
						style={{ height: "100%", width: "100%" }}
						className="doc-file-grid-view"
					>
						<SUIGrid
							grouped={true}
							headers={colDefs}
							groupRowRendererParams={groupRowRendererParams}
							data={modifiedData}
							rowSelected={(e: any) => rowSelected(e)}
							getRowId={(record: any) => record.data.id}
							groupDisplayType={"groupRows"}
							groupIncludeTotalFooter={false}
							groupIncludeFooter={false}
						/>
					</div>
				</div>
			</SmartDialog>
		</div>
	);
};

export default AddSpecificationsDialog;
