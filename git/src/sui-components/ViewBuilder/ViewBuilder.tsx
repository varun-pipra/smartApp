import React, { useEffect, useState, useMemo } from "react";
import './ViewBuilder.scss';
import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';
import SUIGrid from "sui-components/Grid/Grid";
import "@ui5/webcomponents-icons/dist/AllIcons";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Add } from "@mui/icons-material";
import SUIDialog from "sui-components/Dialog/Dialog";
import { getServer } from "app/common/appInfoSlice";
import IQButton from "components/iqbutton/IQButton";
import GridIcon from "resources/images/common/Grid.svg"
import Toast from 'components/toast/Toast';
import EyeIcon from "resources/images/common/Eye.svg";
import CustomColumns from './customcolumns/CustomColumns';
import NewViewBuilderDailog from './newView/NewView';
import IQToggle from "components/iqtoggle/IQToggle";
import { fetchViewBuilderList, fetchViewData, setViewData } from "./Operations/viewBuilderSlice";
import { ViewBuilderOptions } from "./utils";
import ViewdropDown from './viewdropdown/ViewDropdown';

const displayWidth: string = "12rem";
const actionWidth: string = "10rem";

interface ViewBuilderButtonProps {
	data: any;
	dropDownOnChange: (value: any) => void;
}

interface ViewBuilderListProps {
	data: any;
	value: any
	viewListOnChange: (value: any) => void;
}

interface ViewBuilderProps {
	appInfo?: any;
	moduleName?: any;
	dropDownList?: any;
	dropDownOnChange: (value: any, data: any) => void;
	dailogOpen?: boolean;
	dailogClose?: (value: boolean) => void;
	mode?: boolean;
	griddata?: any;
	headerData?: any;
	onRowDragEnd?: (value: any) => void
	viewData?: any;
	saveView?: any;
	saveNewViewData?: any;
	viewList?: any;
	viewListOnChange?: (value: any) => void;
	searchGroupList?: any;
	deleteView?: any;
	requiredColumns?: any;
	dataList?: any
}


const ViewBuilderButton = (props: ViewBuilderButtonProps) => {

	return (
		<IconMenu
			options={props.data}
			// defaultValue={group.name ? { [group.name]: true } : {}}
			onChange={(value: any) => props.dropDownOnChange(value)}
			menuProps={{
				open: true,
				// header: (props.groupHeader || 'Group By'),
				placement: 'bottom-start',
				sx: {
					width: '170px', lineheight: '1.5', fontSize: '18px !important',
					'& .css-1jxx3va-MuiTypography-root': {
						fontSize: '0.96rem !important',
						color: '#333 !important'
					}
				}
			}}
			buttonProps={{
				className: 'preview-button',
				startIcon: <Stack component='img' alt='Views' src={EyeIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)', marginLeft: '10px' }} />,
				// endIcon: <KeyboardArrowDown className="group-menu-icon" />,
				"aria-label": "Group menu",
				disableRipple: true
			}}
		/>
	)
}

const ViewBuilderList = (props: ViewBuilderListProps) => {

	const [selectedValue, setSelectedValue] = useState({ name: '' });

	React.useEffect(() => {
		if (props.value !== "") setSelectedValue({ name: props.value });
	}, [props.value]);

	const handleViewClick = (viewObj: any) => {
		console.log('viewObj', viewObj)
		setSelectedValue({ name: viewObj });
		props.viewListOnChange(viewObj);
	}

	return (
		<>
			{/* <IconMenu
				options={props.data}
				onChange={handleViewClick}
				defaultValue={selectedValue.name ? { [selectedValue.name]: true } : {}}
				menuProps={{
					open: true,
					// header: (props.groupHeader || 'Group By'),
					placement: 'bottom-start',
					sx: {
						width: '220px', lineheight: '1.5', fontSize: '18px !important',
						'& .css-1jxx3va-MuiTypography-root': {
							fontSize: '0.96rem !important',
							color: '#333 !important'
						}
					},
				}}
				buttonProps={{
					startIcon: <Stack component='img' alt='Views' src={GridIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)', marginLeft: '10px' }} />,
					"aria-label": "Group menu",
					disableRipple: true
				}}
			/> */}
			<ViewdropDown
				options={props.data}
				menuProps={{
					open: true,
					placement: 'bottom-start',
					sx: {
						width: '220px', lineheight: '1.5', fontSize: '18px !important',
						'& .css-1jxx3va-MuiTypography-root': {
							fontSize: '0.96rem !important',
							color: '#333 !important'
						}
					},
				}}
				buttonProps={{
					startIcon: <Stack component='img' alt='Views' src={GridIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)', marginLeft: '10px' }} />,
					"aria-label": "Group menu",
					disableRipple: true
				}}
				optionOnChange={(value: any) => { handleViewClick(value) }}
			/>
		</>
	)
}

const ViewBuilder = (props: ViewBuilderProps) => {
	const { dailogOpen = false } = props;
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const [showToast2, setShowToast2] = useState<any>({ displayToast: false, message: '' });
	const [addNewCalculatedColumn, setAddNewCalculatedColumn] = useState<boolean>(false);
	const [ViewBuilder_DailogOpen, setViewBuilder_DailogOpen] = useState<boolean>(false);
	const [modeStatus, setModeStatus] = React.useState<boolean>(false);
	const [newViewBuilder_DailogOpen, setNewViewBuilder_DailogOpen] = useState<boolean>(false);
	const [newViewBuilder_DailogOpen1, setNewViewBuilder_DailogOpen1] = useState<boolean>(false);
	const [ViewBuilder_list, setViewBuilder_list] = useState<any>([]);
	const [tableHeadersData, setTableHeadersData] = useState<any>([]);
	const [showHideValues, setShowHideValues] = useState<any>();
	const itemsToUpdate: any = [];
	const [viewName, setViewName] = useState<any>('Basic View');
	const [ViewBuilder_options, setViewBuilder_options] = useState<any>([]);
	const { viewBuilderData, viewData } = useAppSelector(state => state.viewBuilder);

	useEffect(() => {
		if (props?.appInfo && props?.moduleName) {
			dispatch(fetchViewBuilderList({ appInfo: props?.appInfo, modulename: props?.moduleName }));
		}
	}, [props?.appInfo]);


	useEffect(() => {
		if (viewData.viewName) {
			const updatedArrayOfObjects = ViewBuilderOptions?.map(obj => {
				if (obj.value === 'delete' || obj.value === 'save') {
					return { ...obj, disabled: viewData.viewName == 'Basic View' ? true : false, };
					//return { ...obj }
				}
				return obj;
			});
			setViewBuilder_options(updatedArrayOfObjects);
		}
		else {
			setViewBuilder_options(ViewBuilderOptions);
		}
	}, [viewData, ViewBuilderOptions]);

	useEffect(() => {
		if (props.dropDownList && props.dropDownList?.length > 0) {
			setViewBuilder_options([...ViewBuilder_options, ...props.dropDownList])
		}
	}, [props.dropDownList])

	useEffect(() => {
		if (viewData && viewData?.columnsForLayout?.length > 0) {
			setTableHeadersData(viewData?.columnsForLayout)
			itemsToUpdate.push(viewData?.columnsForLayout)
			setShowHideValues({
				show: viewData?.columnsForLayout && viewData?.columnsForLayout?.filter((x: any) => x.hide == false),
				hide: viewData?.columnsForLayout && viewData?.columnsForLayout?.filter((x: any) => x.hide == true),
				total: viewData?.columnsForLayout
			})
		}
	}, [viewData?.columnsForLayout])

	useEffect(() => {
		if (viewData) {
			props.dataList && props.dataList(viewData);
			setViewName(viewData.viewName)
		}
	}, [viewData])

	useEffect(() => {
		if (viewBuilderData) {
			console.log('viewBuilderData', viewBuilderData)
			const data = viewBuilderData?.map((el: any, i: any) => {
				return { text: el.text, value: el.text, data: el.value, disabled: false }
			})
			setViewBuilder_list(data)
		}
	}, [viewBuilderData])

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
	const Timeinterval = 2000;

	const getViewFilters = () => {
		return [
			{ text: `Show All(${showHideValues?.total?.length})`, value: 'showAll', },
			{ text: `Show Selected Columns(${showHideValues?.total?.length}/${showHideValues?.show?.length})`, value: 'showSelectedColumns', },
			{ text: `Show Hide Columns(${showHideValues?.total?.length}/${showHideValues?.hide?.length})`, value: 'showHideColumns', },
		];
	};

	const headerData = [
		{
			headerName: 'Column Name',
			rowDrag: true,
			suppressMovable: true,
			rowDragText: (params: any) => { return params.data.headerName },
			menuTabs: [],
			// cellStyle: (params: any) => {
			// 	if (params.data.field === "division") {
			// 		return { display: "none" };
			// 	}
			// 	return null;
			// },
			cellRenderer: (params: any) => {
				return <div>{params.data.headerName}</div>
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
						{modeStatus == false && <IconMenu
							options={getViewFilters()}
							onChange={handleFilter}
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
				if (props?.requiredColumns?.includes(params.data.field)) return null
				else return (<div>
					<IQToggle
						defaultChecked={!params.data.hide}
						switchLabels={['ON', 'OFF']}
						onChange={(e, value) => { handleToggleChange(value, params.data) }}
						edge={'end'}
					/>
				</div>
				)
			}
		}
	];


	const onGridRowDragEnd = (params: any) => {
		let finalColumnsData: any = [];
		const duplicatearry: any = [];
		let gridApi: any = params.api;
		gridApi.forEachNodeAfterFilterAndSort(function (rowNode: any) {
			duplicatearry.push(rowNode.data);
		});
		if (duplicatearry.length > 0) {
			finalColumnsData = [];
			duplicatearry.forEach((rearrangeObj: any) => {
				let obj = rearrangeObj;
				let filteredData = tableHeadersData.filter((x: any) => x.headerName === obj.headerName)
				finalColumnsData.push(filteredData[0]);
			});
			setTableHeadersData(finalColumnsData);
		}
	}

	const handleToggleChange = (value: any, params: any) => {
		const duplicateArray: any = [];
		duplicateArray.push(...tableHeadersData);
		duplicateArray && duplicateArray.map((data: any, index: any) => {
			if (data.field == params.field) {
				let new_obj = {};
				if (value == false) {
					new_obj = { ...data, hide: true }
				} else {
					new_obj = { ...data, hide: false }
				}
				duplicateArray[index] = new_obj
			}
		})
		setTableHeadersData(duplicateArray);
	}

	const handleFilter = (value: any) => {
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

	const viewBuilderClose = () => {
		setViewBuilder_DailogOpen(false);
		if (props.dailogClose) {
			props.dailogClose(false)
		};
	}

	const buttonsEl = (

		<Grid container className='viewBuilder-button-Section' style={{ width: 'auto !important' }}>
			<Grid item xs={6}>
				{modeStatus == false &&
					<IQButton
						className={viewData.viewName == 'deleteView_button_vb' ? '' : 'deleteView_button_vb'}
						onClick={() => { deleteViewHandler() }}
						disabled={viewData.viewName == 'Basic View' ? true : false}>
						DELETE VIEW
					</IQButton>
				}
			</Grid>
			<Grid item xs={6}>
				<Box display={"flex"} gap={4} style={{ justifyContent: "flex-end" }}>
					{modeStatus == false && <IQButton color='blue' onClick={() => { setNewViewBuilder_DailogOpen(true) }} className='saveViewAs_button_vb'>SAVE AS NEW VIEW</IQButton>}
					<IQButton color='blue' disabled={viewData.viewName == 'Basic View' ? true : false} onClick={() => { saveViewHandler() }} className='saveView_button_vb'>SAVE VIEW</IQButton>
				</Box>
			</Grid>

		</Grid>

	);

	const addCustomColumn = (event: React.SyntheticEvent) => {
		event.stopPropagation();
		setAddNewCalculatedColumn(true);
	};

	const saveNewViewHandler = (value: any) => {
		const payload = {
			viewName: value.viewName,
			viewType: value.viewType,
			columnsForLayout: tableHeadersData
		}
		if (props.saveNewViewData) {
			props.saveNewViewData(payload)
		}
	}

	const saveViewHandler = () => {
		const payload = {
			viewId: viewData.viewId,
			viewName: viewName,
			viewType: viewData.viewType,
			columnsForLayout: tableHeadersData,
		}
		if (props.saveView) {
			props.saveView(payload);
		}
		setShowToast2({ displayToast: true, message: 'View is Saved ' })
		setTimeout(() => {
			viewBuilderClose();
			setShowToast2({ displayToast: false, message: '' })
		}, Timeinterval);
	}

	const deleteViewHandler = () => {
		if (props.deleteView) {
			props.deleteView();
		}
		setShowToast2({ displayToast: true, message: 'View is Deleted ' })
		setTimeout(() => {
			viewBuilderClose();
			setShowToast2({ displayToast: false, message: '' })
		}, Timeinterval);
	}

	const viewBuilderList_OnChange = (data: any) => {
		const resultObject = ViewBuilder_list.find((obj: any) => obj.value === data);
		dispatch(fetchViewData({ appInfo: appInfo, viewId: resultObject?.data?.viewId }))
		props.viewListOnChange && props.viewListOnChange(resultObject?.data);
	}

	const viewBuilderOption_onChange = (value: any) => {

		if (value == 'edit') {
			setViewBuilder_DailogOpen(true)
			setModeStatus(false)
		}
		else if (value == 'saveAs') {
			setNewViewBuilder_DailogOpen1(true);
		}
		else if (value == 'save') {
			const payload = {
				viewId: viewData.viewId,
				viewName: viewData.viewName,
				viewType: viewData.viewType,
				columnsForLayout: tableHeadersData,
			}
			props.dropDownOnChange(value, payload)
		}
		else if (value == 'new') {
			setViewBuilder_DailogOpen(true);
			setModeStatus(true);
		}
		else {
			props.dropDownOnChange(value, viewData.viewId)
		}

	}

	return (
		<>
			<Stack direction={'row'} >
				<ViewBuilderButton
					data={ViewBuilder_options && ViewBuilder_options?.length > 0 ? ViewBuilder_options : []}
					dropDownOnChange={(value: any) => { viewBuilderOption_onChange(value) }}
				/>
			</Stack>
			<Stack direction={'row'} >
				<ViewBuilderList
					data={ViewBuilder_list && ViewBuilder_list?.length > 0 ? ViewBuilder_list : []}
					value={viewData.viewName}
					viewListOnChange={(obj) => { viewBuilderList_OnChange(obj) }}
				/>
			</Stack>
			<div className='viewbuilder-window'>
				{ViewBuilder_DailogOpen &&
					<SUIDialog
						open={true}
						onClose={viewBuilderClose}
						headerTitle='View Builder'
						toolsOpts={{
							closable: true,
						}}
						buttons={buttonsEl}
						style={{
							color: '#333333',
							fontSize: '1.12rem',
							fontWeight: 'bolder',
							fontFamily: 'Roboto-regular',
						}}
						background='#F2F2F2'
						borderRadius='3px'
					>
						{modeStatus == true ?
							<Button variant="outlined" className='add-new-calculated-btn' onClick={(e) => { addCustomColumn(e) }}>
								<Add />Add NewCalculated Column
							</Button> :
							<Grid container>
								<Grid item xs={5} mb={2}>
									{viewName &&
										<TextField
											id="viewbuildername"
											fullWidth
											placeholder='Enter ViewBuilder Name'
											name='viewname'
											variant="outlined"
											value={viewName}
											onChange={(e: any) => setViewName(e.target?.value)}
											disabled={viewData.viewName == 'Basic View' ? true : false}
										/>
									}
								</Grid>
							</Grid>
						}
						<div style={{ height: '425px' }}>
							<SUIGrid
								headers={headerData}
								data={tableHeadersData}
								suppressRowClickSelection={true}
								onRowDragEnd={onGridRowDragEnd}
								animateRows={true}
							/>
						</div>

						{addNewCalculatedColumn && (
							<CustomColumns listdata={[]} close={(value) => { setAddNewCalculatedColumn(value); }} submit={function (value: any): void {
								throw new Error("Function not implemented.");
							}} />
						)}


						{newViewBuilder_DailogOpen == true &&
							<NewViewBuilderDailog
								newViewDailogClose={(value) => { setNewViewBuilder_DailogOpen(false) }}
								saveButton={(value: any) => { saveNewViewHandler(value) }}
							/>
						}


						{showToast2.displayToast ? <Toast message={showToast2.message} interval={Timeinterval} /> : null}
					</SUIDialog>
				}
			</div >
			{newViewBuilder_DailogOpen1 == true &&
				<NewViewBuilderDailog
					newViewDailogClose={(value) => { setNewViewBuilder_DailogOpen1(false) }}
					saveButton={(value: any) => { saveNewViewHandler(value) }}
				/>
			}
		</>
	);
};

export default ViewBuilder;

