import React, { useEffect, useState } from "react";
import './ManageTableColumns.scss';
import { Label, Table, TableColumn } from "@ui5/webcomponents-react";
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, Radio, RadioGroup, Stack, TextField, Typography, } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import SUIGrid from "sui-components/Grid/Grid";

import "@ui5/webcomponents-icons/dist/AllIcons";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ColDef, Column, IRowDragItem, RowNode } from "ag-grid-community";
import ToggleField from "components/togglefield/ToggleField";
import SmartDialog from "components/smartdialog/SmartDialog";
import { Add, GridView } from "@mui/icons-material";
import CustomColumns from "./customcolumns/CustomColumns";
import { Helpers } from "sui-components/Grid/Helpers";
import { shallowEqual } from "react-redux";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { setColumnDefsHeaders, setGridColumnHide, getColumnDefsHeaders } from "../operations/tableColumnsSlice";
import SUIDialog from "sui-components/Dialog/Dialog";
import globalStyles from "../BudgetManagerGlobalStyles";
import { addNewView, updateViewItem } from "sui-components/ViewBuilder/Operations/viewBuilderAPI";
import { getServer } from "app/common/appInfoSlice";
import IQButton from "components/iqbutton/IQButton";
import IQToggle from "components/iqtoggle/IQToggle";
import { fetchViewBuilderList } from "sui-components/ViewBuilder/Operations/viewBuilderSlice";
import { fetchGridData } from "../operations/gridSlice";
import { string } from "prop-types";
import { Params } from "react-router-dom";
import Toast from 'components/toast/Toast';
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';

const displayWidth: string = "12rem";
const actionWidth: string = "10rem";

interface ViewBuilderGridProps {
	moduleName? : any;
	open: boolean;
	onClose?: (value: boolean) => void;
	newAddLineItemBtn: boolean;
}

const ViewBuilderGrid = (props: ViewBuilderGridProps) => {
	console.log('moduleName ViewBuilderGrid', props.moduleName)
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const [showAddColumnPane, setShowAddColumnPane] = React.useState<boolean>(false);
	const { columnDefs } = useAppSelector((state) => state.tableColumns);

	const { viewData } = useAppSelector((state) => state.viewBuilder);

	const [tableHeadersData, setTableHeadersData] = useState(columnDefs.filter((x: any) => x.field != 'division'));
	const [modifiedData, setModifiedData] = useState([]);
	const [openSave, setOpenSave] = useState(false);
	const [newViewChanged, setNewViewChanged] = useState(false);
	const [storeToggleRowIdx, setStoreToggleRowIdx] = useState<any>([])
	const [updatedColumns, setUpdatedColumns] = useState<any>([])
	const [showToast, setShowToast] = React.useState<any>({ displayToast: false, message: '' });
	const [showToast2, setShowToast2] = React.useState<any>({ displayToast: false, message: '' });
	const [columnsDataClone, setColumnsDataClone] = useState<any>([...tableHeadersData]);

	const [showHideValues, setShowHideValues] = useState<any>({
		show: tableHeadersData.filter((x: any) => x.hide == false),
		hide: tableHeadersData.filter((x: any) => x.hide == true),
		total: tableHeadersData
	})

	const initialState = {
		viewName: "",
		viewType: "",
		columnsForLayout: []
	};
	const Timeinterval = 2000;
	const [customColumn, setCustomColumn] = React.useState<any>(initialState);

	React.useEffect(() => {
		if (typeof (viewData.columnsForLayout) !== 'string' && viewData.columnsForLayout?.length) {
			setTableHeadersData(viewData.columnsForLayout.filter((x: any) => x.field != 'division'));
		}
	}, [viewData])

	const handleInputChange = (key: string, value: any): void => {
		const data = { ...customColumn, [key]: value };
		setCustomColumn(data);
	};

	React.useEffect(() => {
		if (customColumn?.viewName != '' && customColumn.viewType != '') {
			setNewViewChanged(true)
		}
		else {
			setNewViewChanged(false)
		}
	}, [customColumn])

	const Switchsx = {
		'& .Mui-checked+.MuiSwitch-track': {
			backgroundColor: '#0590cd !important',
			color: ' #fff !important',
			opacity: 'inherit !important'
		},
		'& .MuiSwitch-track:before': {
			paddingTop: '4px',
			fontSize: '8px !important',
			textAlign: 'center'
		},
		'.MuiSwitch-track:after': {
			paddingTop: '4px',
			fontSize: '8px !important',
			textAlign: 'center !important',
			right: '12px !important'
		},
	}
	const handleOnClose = () => {
		if (props.onClose) {
			props.onClose(false)
		};
	}
	const handleOnCloseSave = () => {
		setOpenSave(false);
		setCustomColumn(initialState);
	}

	const handleToggleChange = (value: any, params: any) => {
		// let obj = [{ value: value, rowIdx: params.rowIndex }];
		// let data: any = []
		// data = [...storeToggleRowIdx, ...obj];
		// setStoreToggleRowIdx(data)
		// columnsDataClone = [...tableHeadersData];
		columnsDataClone.map((data: any, index: any) => {
			if (data.field == params.field) {
				let new_obj = {};
				if (value == false) {
					new_obj = { ...data, hide: true }
				} else {
					new_obj = { ...data, hide: false }
				}
				columnsDataClone[index] = new_obj
			}
		})

	}

	const [itemsToUpdate, setItemsToUpdate] = useState<any>([])
	const onRowDragEnd = (params: any) => {
		// console.log("params",params);

		let gridApi: any = params.api;
		// console.log("gridApi",gridApi);

		gridApi.forEachNodeAfterFilterAndSort(function (rowNode: any) {
			// console.log("rowNode",rowNode);
			itemsToUpdate.push(rowNode.data);
			// setColumnsDataClone([...columnsDataClone,rowNode.data])
			// itemsToUpdate.map(obj => ({
			//  ...obj,
			//  order: rowNode.rowIndex,
			// }))
			//  itemsToUpdate.forEach(function (element) {
			//  element.order = rowNode.rowIndex;
			//   });
			// itemsToUpdate.forEach(e => e.order = rowNode.childIndex);
		});
		// setColumnsDataClone(itemsToUpdate)
	}

	const saveView = () => {
		let finalColumnsData: any = [];
		if (itemsToUpdate.length > 0) {
			finalColumnsData = [];
			itemsToUpdate.forEach((rearrangeObj: any) => {
				let obj = rearrangeObj;
				let filteredData = columnsDataClone.filter((x: any) => x.headerName === obj.headerName)
				// console.log("filteredData", filteredData);
				finalColumnsData.push(filteredData[0]);
				// setFinalColumnsData(filteredData[0])
				// finalColumnsData.push({
				// 	headerName: filteredData.headerName,
				// 	field: filteredData.field,
				// 	hide: filteredData.hide
				// })
			});
		}

		dispatch(setGridColumnHide(itemsToUpdate.length > 0 ? finalColumnsData : columnsDataClone))
		const payload = {
			viewId: viewData.viewId,
			viewName: viewData.viewName,
			viewType: viewData.viewType,
			columnsForLayout: itemsToUpdate.length > 0 ? finalColumnsData : columnsDataClone,
		}
		updateViewItem(appInfo, viewData.viewId, payload, (response: any) => {
			// dispatch(fetchGridData(appInfo));

		});
		setShowToast2({ displayToast: true, message: 'View is Saved ' })
		setTimeout(() => { handleOnClose(); }, Timeinterval);
	}

	const saveAsNewView = () => {
		setOpenSave(true)
	}

	const save = () => {
		customColumn.columnsForLayout = [...tableHeadersData]
		addNewView(appInfo, customColumn, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: props?.moduleName }));
		});
		setOpenSave(false)
		setShowToast({ displayToast: true, message: ` ${customColumn.viewName} view is created ` })
		setCustomColumn(initialState);
	}

	const getViewFilters = () => {
		return [
			{ text: `Show All(${showHideValues.total.length})`, value: 'showAll', },
			{ text: `Show Selected Columns(${showHideValues.total.length}/${showHideValues.show.length})`, value: 'showSelectedColumns', },
			{ text: `Show Hide Columns(${showHideValues.total.length}/${showHideValues.hide.length})`, value: 'showHideColumns', },
		];
	};
	const handleSettings = (value: any) => {
		if (value == 'showAll') {
			setTableHeadersData(showHideValues.total)
		}
		else if (value == 'showSelectedColumns') {
			setTableHeadersData(showHideValues.show)
		}
		else {
			setTableHeadersData(showHideValues.hide)
		}

	}

	const headerData = [
		{
			headerName: 'Column Name',
			rowDrag: true,
			suppressMovable: true,
			rowDragText: (params: any) => { return params.data.headerName },
			menuTabs: [],
			cellStyle: (params: any) => {
				if (params.data.field === "division") {
					return { display: "none" };
				}
				return null;
			},
			cellRenderer: (params: any) => {
				if (params.data.field === "division") {
					return null;
				} else {
					return <div>{params.data.headerName}</div>
				}
			}
		},
		{
			headerName: 'Show/Hide Column',
			menuTabs: [],
			suppressMovable: true,
			headerComponent: (params: any) => {
				return (
					<div className="custom-header">
						<span className='hideshow'>{params ? params.displayName : ''}</span>
						{props.newAddLineItemBtn == false && <IconMenu
							options={getViewFilters()}
							onChange={handleSettings}
							menuProps={{
								open: true,
								placement: 'bottom-start',
								sx: {
									width: 'fit-content',
									lineheight: '1.5',
									fontSize: '18px !important',
									'& .css-1jxx3va-MuiTypography-root': {
										fontSize: '0.96rem !important',
										color: '#333 !important'
									}
								}
							}}
							buttonProps={{
								className: 'preview-button',
								startIcon: <span className='common-icon-down-arrow' style={{ color: '#5b5b5b' }} />,
								// <Stack component='img' alt='Views' src={EyeIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)' }} />,
								disableRipple: true
							}}
						/>}
					</div>
				);
			},
			cellStyle: (params: any) => {
				if (!params.value) {
					return { border: "none" };
				}
				return null;
			},
			cellRenderer: (params: any) => {
				if (params.data.field === "costCode" || params.data.field === "costType" || params.data.field === "originalAmount" || params.data.field === "division") {
					return null;
				} else {
					return (
						<IQToggle
							defaultChecked={!params.data.hide}
							switchLabels={['ON', 'OFF']}
							onChange={(e, value) => { handleToggleChange(value, params.data) }}
							edge={'end'}
						/>
					)
				}

			}
		}
	];

	const buttonsEl = (

		<Grid container className='button-Section' style={{ width: 'auto !important' }}>
			<Grid item xs={6}>
				{props.newAddLineItemBtn == false && <IQButton className='deleteView_button_vb'>DELETE VIEW</IQButton>}
			</Grid>
			<Grid item xs={6}>
				<Box display={"flex"} gap={4} style={{ justifyContent: "flex-end" }}>
					{props.newAddLineItemBtn == false && <IQButton color='blue' onClick={() => { saveAsNewView() }} className='saveViewAs_button_vb'>SAVE AS NEW VIEW</IQButton>}
					<IQButton color='blue' onClick={() => { saveView() }} className='saveView_button_vb'>SAVE VIEW</IQButton>
				</Box>
			</Grid>

		</Grid>

	);
	const buttonsEl1 = (
		<Box display={"flex"} gap={4} className='button-Section'>
			<IQButton color='blue' className='saveView_button_vb' onClick={() => { save() }} disabled={newViewChanged == true ? false : true}> SAVE </IQButton>
		</Box>
	);

	const addCustomColumn = (event: React.SyntheticEvent) => {
		event.stopPropagation();
		setShowAddColumnPane(true);
	};
	return (
		<div className='viewbuilder-window'>
			<SUIDialog
				open={true}
				headerTitle='View Builder'
				toolsOpts={{
					closable: true,
				}}
				buttons={buttonsEl}
				onClose={handleOnClose}
				style={{
					color: '#333333',
					fontSize: '1.12rem',
					fontWeight: 'bolder',
					fontFamily: 'Roboto-regular',
				}}
				background='#F2F2F2'
				borderRadius='3px'
			>
				{props.newAddLineItemBtn == true ?
					<Button
						variant="outlined"
						// startIcon={<Add />}
						// className="lockbuget-button"
						onClick={(e) => { addCustomColumn(e) }}
						style={{
							margin: '6px 6px 6px 20px',
							padding: "2px",
						}}
					>
						<Add />Add NewCalculated Column
					</Button> :
					<Grid container>
						<Grid item xs={5} style={{ margin: '10px 0px', border: '1px solid #babfc7', borderRadius: '4px', padding: '5px 10px' }}>
							{viewData ? viewData?.viewName : 'Basic View'}
						</Grid>
					</Grid>
				}
				<div style={{ height: '425px' }}>
					<SUIGrid
						headers={headerData}
						data={tableHeadersData}
						suppressRowClickSelection={true}
						onRowDragEnd={onRowDragEnd}
					/>
				</div>

				{showAddColumnPane && (
					<CustomColumns listdata={[]} close={(value) => { setShowAddColumnPane(value); }} submit={function (value: any): void {
						throw new Error("Function not implemented.");
					}} />
				)}
				{openSave == true &&
					<SUIDialog
						open={true}
						headerTitle='Save View'
						toolsOpts={{
							closable: true,
						}}
						buttons={buttonsEl1}
						onClose={handleOnCloseSave}
						style={{
							color: '#333333',
							fontSize: '1.12rem',
							fontWeight: 'bolder',
							fontFamily: 'Roboto-regular',
							padding: '4px !important'
						}}
						// background='#F2F2F2'
						// padding='0.3em'
						minWidth='33% !important'
						height='50px'
						borderRadius='3px !important'
						padding='4 !important'

					>
						<Stack style={{ margin: "25px", marginTop: '18px' }}>
							<TextField
								required
								style={{ width: '100%' }}
								label="View Name"
								variant="standard"
								value={customColumn.viewName}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									handleInputChange("viewName", e.target.value)
								}
								sx={{
									'.MuiFormLabel-asterisk': {
										color: 'red'
									}
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start" >
											<GridView fontSize="small" style={{ color: globalStyles.primaryColor, marginLeft: '4px' }} />
										</InputAdornment>
									),
								}}
								InputLabelProps={{ style: { fontSize: "21px", marginTop: '-7px' } }}
							/>
							<FormControl style={{ marginTop: "18px", fontSize: "15px" }}>
								<FormLabel id="demo-row-radio-buttons-group-label" style={{ marginBottom: "6px" }}>View Type :</FormLabel>
								<RadioGroup
									row
									aria-labelledby="demo-row-radio-buttons-group-label"
									name="row-radio-buttons-group"
									value={customColumn.viewType}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleInputChange("viewType", e.target.value)
									}
								>
									<FormControlLabel value={1} control={<Radio style={{ marginTop: "-2px" }} />} label="Public Views" />
									<FormControlLabel value={0} control={<Radio style={{ marginTop: "-2px" }} />} label="Private Views" />
								</RadioGroup>
							</FormControl>
						</Stack>
					</SUIDialog>
				}
				{showToast.displayToast ? <Toast message={showToast.message} interval={Timeinterval} /> : null}
				{showToast2.displayToast ? <Toast message={showToast2.message} interval={Timeinterval} /> : null}
			</SUIDialog>
		</div >
	);
};

export default ViewBuilderGrid;

