import React, { useEffect, useState } from "react";
import './NewView.scss';
import { Box, Button, Grid, Stack, TextField, InputAdornment, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';
import { GridView } from "@mui/icons-material";
import IQButton from "components/iqbutton/IQButton";
import SUIDialog from "sui-components/Dialog/Dialog";
import Toast from 'components/toast/Toast';

interface NewViewBuilderDailogProps {
	saveButton?: (value: any) => void;
	newViewDailogClose?: (value: Boolean) => any;
}

const NewViewBuilderDailog = (props: NewViewBuilderDailogProps) => {
	const [newViewChanged, setNewViewChanged] = useState(false);

	const initialState = {
		viewName: "",
		viewType: "",
	};

	const [customColumn, setCustomColumn] = React.useState<any>(initialState);
	const [showToast, setShowToast] = useState<any>({ displayToast: false, message: '' });


	const handleInputChange = (key: string, value: any): void => {
		const data = { ...customColumn, [key]: value };
		setCustomColumn(data);
	};

	const saveNewView = () => {
		setShowToast({ displayToast: true, message: ` ${customColumn.viewName} view is created ` })
		if (props.saveButton) {
			props.saveButton(customColumn)
			setTimeout(() => {
				onCloseHandler();
			}, 2000);
		}
	}

	const buttonsEl1 = (
		<Box display={"flex"} gap={4} className='button-Section'>
			<IQButton color='blue' className='saveView_button_vb' onClick={() => { saveNewView() }} disabled={customColumn?.viewName != '' && customColumn.viewType != '' ? false : true}> SAVE </IQButton>
		</Box>
	);

	const onCloseHandler = () => {
		if (props.newViewDailogClose) {
			props.newViewDailogClose(false)
			setCustomColumn(initialState);
		}
	}

	return (
		<SUIDialog
			open={true}
			headerTitle='Save View'
			toolsOpts={{
				closable: true,
			}}
			buttons={buttonsEl1}
			onClose={onCloseHandler}
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
								<GridView fontSize="small" style={{ color: '#ed7431', marginLeft: '4px' }} />
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
			{showToast.displayToast ? <Toast message={showToast.message} interval={2000} /> : null}
		</SUIDialog>
	)
}

export default NewViewBuilderDailog;