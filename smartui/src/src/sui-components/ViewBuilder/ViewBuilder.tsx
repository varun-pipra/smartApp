import React, { useEffect, useState } from "react";
import './ViewBuilder.scss';
import { Box, Button, Grid, Stack } from "@mui/material";
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

const displayWidth: string = "12rem";
const actionWidth: string = "10rem";

interface ViewBuilderButtonProps {
	data: any;
	dropDownOnChange: (value: any) => void;
}

interface ViewBuilderListProps {
	data: any;
	viewListOnChange: (value: any) => void;
}

interface ViewBuilderProps {
	dropDownList: any;
	dropDownOnChange: (value: any) => void;
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
	viewListOnChange: (value: any) => void;
	searchGroupList?: any;
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
	const handleViewClick = (viewObj: any) => {
		props.viewListOnChange(viewObj)
	}
	return (
		<IconMenu
			options={props.data}
			onChange={handleViewClick}
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
				}
			}}
			buttonProps={{
				className: 'preview-button',
				startIcon: <Stack component='img' alt='Views' src={GridIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)', marginLeft: '10px' }} />,
				// endIcon: <KeyboardArrowDown className="group-menu-icon" />,
				"aria-label": "Group menu",
				disableRipple: true
			}}
		/>
	)
}

const ViewBuilder = (props: ViewBuilderProps) => {
	const { dailogOpen = false, viewData } = props;

	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);

	const [showToast2, setShowToast2] = useState<any>({ displayToast: false, message: '' });

	const [addNewCalculatedColumn, setAddNewCalculatedColumn] = useState<boolean>(false);
	const [newViewBuilder_DailogOpen, setNewViewBuilder_DailogOpen] = useState<boolean>(false);
	const [newViewBuilder_Data, setnewViewBuilder_Data] = useState<any>();

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

	const viewBuilderClose = () => {
		if (props.dailogClose) {
			props.dailogClose(false)
		};
	}

	const saveViewHandler = () => {
		if (props.saveView) {
			props.saveView();
		}
		setShowToast2({ displayToast: true, message: 'View is Saved ' })
		setTimeout(() => {
			viewBuilderClose();
			setShowToast2({ displayToast: false, message: '' })
		}, Timeinterval);
	}

	const buttonsEl = (

		<Grid container className='button-Section' style={{ width: 'auto !important' }}>
			<Grid item xs={6}>
				{props.mode == false && <IQButton className='deleteView_button_vb'>DELETE VIEW</IQButton>}
			</Grid>
			<Grid item xs={6}>
				<Box display={"flex"} gap={4} style={{ justifyContent: "flex-end" }}>
					{props.mode == false && <IQButton color='blue' onClick={() => { setNewViewBuilder_DailogOpen(true) }} className='saveViewAs_button_vb'>SAVE AS NEW VIEW</IQButton>}
					<IQButton color='blue' onClick={() => { saveViewHandler() }} className='saveView_button_vb'>SAVE VIEW</IQButton>
				</Box>
			</Grid>

		</Grid>

	);

	const addCustomColumn = (event: React.SyntheticEvent) => {
		event.stopPropagation();
		setAddNewCalculatedColumn(true);
	};

	useEffect(() => {
		if (newViewBuilder_Data) {
			props.saveNewViewData(newViewBuilder_Data)
		}
	}, [newViewBuilder_Data])
	return (
		<>
			<Stack direction={'row'} >
				<ViewBuilderButton data={props.dropDownList} dropDownOnChange={props.dropDownOnChange} />
			</Stack>
			<Stack direction={'row'} >
				<ViewBuilderList data={props.viewList} viewListOnChange={(obj) => { props.viewListOnChange(obj) }} />
			</Stack>
			<div className='viewbuilder-window'>
				{dailogOpen &&
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
						{props.mode == true ?
							<Button variant="outlined" onClick={(e) => { addCustomColumn(e) }} style={{ margin: '6px 6px 6px 20px', padding: "2px", }}>
								<Add />Add NewCalculated Column
							</Button> :
							<Grid container>
								<Grid item xs={5} style={{ margin: '10px', border: '1px solid #babfc7', borderRadius: '4px', padding: '5px' }}>
									{viewData ? viewData?.viewName : 'Basic View'}
								</Grid>
							</Grid>
						}
						<div style={{ height: '425px' }}>
							<SUIGrid
								headers={props.headerData}
								data={props.griddata}
								suppressRowClickSelection={true}
								onRowDragEnd={props.onRowDragEnd}
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
								saveButton={(value: any) => { setnewViewBuilder_Data(value) }}
							/>
						}


						{showToast2.displayToast ? <Toast message={showToast2.message} interval={Timeinterval} /> : null}
					</SUIDialog>
				}
			</div >
		</>
	);
};

export default ViewBuilder;

