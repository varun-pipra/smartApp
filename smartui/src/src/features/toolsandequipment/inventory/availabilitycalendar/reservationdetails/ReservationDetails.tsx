
import React, { useState } from 'react';
import SmartDialog from 'components/smartdialog/SmartDialog';
import { Stack, Grid, FormControlLabel, Checkbox, NativeSelect, FormControl, InputLabel, TextField, Box, Button } from '@mui/material';

import './ReservationDetails.scss';
import IQTextArea from 'components/iqtextarea/IQTextArea';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker, DateRange } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
export interface ResevationObject {
	fromDate: any;
	toDate:any;
	fromTime: any;
	toTime: any;
	reservedFor: any;
	locationType: any;
	location: any;
	reason: any;
	multiDay: boolean;
}
export interface ResevationDetailsProps {
	onClose?: (val: boolean) => void;
	onSave?: (values: any) => void;
	reservationData?: ResevationObject;
}
export default function ResevationDetails(props: ResevationDetailsProps) {
	const [inputValues, setInputValues] = React.useState<ResevationObject>(props.reservationData ? props.reservationData :
		{
			fromDate: new Date(),
			toDate: new Date(),
			fromTime: '',
			toTime: '',
			reservedFor: '',
			locationType: '',
			location: '',
			reason: '',
			multiDay: false
		}
	)

	const onChangeEvent = (e: any) => {
		const { checked } = e.target;
		setInputValues({ ...inputValues, multiDay: checked })
	}

	const handleOnChange = (event: any) => {
		const { name, value } = event.target;
		const updatedvalues = { ...inputValues, [name]: value }
		setInputValues(updatedvalues);
	};

	const handleClose = () => {
		if (props.onClose) props.onClose(false);

	}

	const handleSave = () => {
		
		if (props.onClose) props.onClose(false);
		if (props.onSave) props.onSave(inputValues);

	}
	const handleTimeChange = (e: any, type: string) => {
		if(type === 'fromDate') {			
			 setInputValues({ ...inputValues, [type]: e, toDate: e })
		}
		else if(type === 'range') {
			setInputValues({ ...inputValues, fromDate: e[0], toDate: e[1] })		
		}
		else {
			setInputValues({ ...inputValues, [type]: e})			
		}
	}
	return (
		<div className="reservationDetails">
			<SmartDialog
				className='resevationmodel'
				open={true}
				PaperProps={{
					sx: { height: "72%", width: "30%", minWidth: '45%', minHeight: '72%' },
				}}
				custom={{
					closable: true,
					title: 'Reservation Details',
				}}
				onClose={handleClose}
			>
				<Grid container spacing={1} className='reservation-container'>
					<Grid item xs={12} sm={6} md={6} lg={6} >
						{
							inputValues.multiDay ?
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateRangePicker
										// calendars={1}
										value={[inputValues.fromDate, inputValues.toDate]}
										onChange={(e) => { handleTimeChange(e, 'range') }}
										renderInput={(startProps:any, endProps:any) => (
											<React.Fragment>
												<TextField size='small'{...startProps} />
												<Box > to </Box>
												<TextField size='small' {...endProps} />
											</React.Fragment>
										)}
									/>
								</LocalizationProvider>
							:
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								renderInput={(params) => <TextField variant="filled"
									InputProps={{
										name: 'date'
									}}
									size='small' {...params} />}
								value={inputValues.fromDate}
								onChange={(e) => { handleTimeChange(e, 'fromDate') }}
							/>
						</LocalizationProvider>
					}

					</Grid>
					<Grid item xs={12} sm={6} md={3} lg={3} >
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<MobileTimePicker
								renderInput={(params) => <TextField variant="filled" size='small' {...params} />}
								value={inputValues.fromTime}
								label={inputValues.fromTime == '' ? "from" : ''}
								// views={['hours', 'minutes' ,'']}
								// inputFormat="hh:mm"
								maxTime={inputValues.toTime}

								onChange={(e) => {
									handleTimeChange(e, 'fromTime')
								}}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12} sm={6} md={3} lg={3} >
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<MobileTimePicker
								renderInput={(params) => <TextField variant="filled" size='small' {...params} />}
								value={inputValues.toTime}
								label={inputValues.toTime == '' ? "to" : ''}
								minTime={inputValues.fromTime}
								onChange={(e) => {
									handleTimeChange(e, 'toTime')
								}}
							/>
						</LocalizationProvider>

					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={12} >
						<FormControlLabel
							className="checkbox"
							value="end"
							control={<Checkbox onChange={(e) => { onChangeEvent(e) }} checked={inputValues.multiDay} />}
							label={'Multi Day'}
							labelPlacement="end"
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={12} >
						<InputLabel variant="standard" htmlFor="uncontrolled-native">Reserved For</InputLabel>
						<NativeSelect

							value={inputValues.reservedFor}
							inputProps={{
								name: 'reservedFor',
								id: 'uncontrolled-native',
							}}
							className='locationtype'
							onChange={(e) => { handleOnChange(e) }}
							required
						>
							<option value={''}>Select</option>
							<option value={'James'}>James</option>
							<option value={'Newton'}>Newton</option>
							<option value={'Sairly'}>Sairly</option>

						</NativeSelect>
					</Grid>
					<Grid item xs={12} sm={12} md={6} lg={5} >
						{inputValues.locationType != '' ? <InputLabel variant="standard" htmlFor="uncontrolled-native">Location Type</InputLabel> : <InputLabel style={{ padding: inputValues.locationType == '' ? '11px' : '' }} variant="standard" htmlFor="uncontrolled-native"></InputLabel>}
						<LocationOnIcon sx={{ margin: '0px -25px 0px 0px' }} />
						<NativeSelect

							value={inputValues.locationType}
							inputProps={{
								name: 'locationType',
								id: 'uncontrolled-native',
							}}
							sx={{ padding: '0px 0px 0px 33px' }}
							className='locationtype'
							onChange={(e) => { handleOnChange(e) }}
							required
						>
							<option value={''}>Location Type</option>
							<option value={'Jobsite'}>Jobsite</option>
							<option value={'Building'}>Building</option>
							<option value={'Floor'}>Floor</option>
							<option value={'Room'}>Room</option>
							<option value={'None'}>None</option>
							<option value={'GPS'}>GPS</option>
							<option value={'Custom'}>Custom</option>
						</NativeSelect>
					</Grid>
					<Grid item xs={12} sm={12} md={6} lg={7} >
						{inputValues.location != '' ? <InputLabel variant="standard" htmlFor="uncontrolled-native">Location</InputLabel> : <InputLabel style={{ padding: inputValues.location == '' ? '11px' : '' }} variant="standard" htmlFor="uncontrolled-native"></InputLabel>}
						<LocationOnIcon sx={{ margin: '0px -25px 0px 0px' }} />
						<NativeSelect

							value={inputValues.location}
							inputProps={{
								name: 'location',
								id: 'uncontrolled-native',
							}}
							sx={{ padding: '0px 0px 0px 33px' }}
							className='location'
							onChange={(e) => { handleOnChange(e) }}
							required
						>
							<option value={''}>Location</option>
							<option value={'North Block-First Floor-Room 10'}>North Block-First Floor-Room 10</option>
							<option value={'South Block-First Floor-Room 10'}>South Block-First Floor-Room 10</option>
							<option value={'East Block-First Floor-Room 10'}>East Block-First Floor-Room 10</option>
							<option value={'West Block-First Floor-Room 10'}>West Block-First Floor-Room 10</option>
						</NativeSelect>
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={12} className='reason'>
						<IQTextArea value={inputValues.reason} label={'Reason'} name='reason' onChange={(e) => { handleOnChange(e) }} />
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={12} className="savebutton">
						<Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
					</Grid>
				</Grid>
			</SmartDialog>
		</div>
	)
}