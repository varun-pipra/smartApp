import React from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import SmartDialog from 'components/smartdialog/SmartDialog'
import { MenuItem, Box, Card, Grid, Input, InputLabel, Stack, ToggleButton, ToggleButtonGroup, Button, TextField } from '@mui/material';
import './AvailabilityCalendar.scss'
import IQTextField from 'components/iqtextfield/IQTextField';
import IQButton from 'components/iqbutton/IQButton';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import ResevationDetails from './reservationdetails/ReservationDetails'
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
export interface AvailabilityCalendarProps {
	toolData: any
}
const AvailabilityCalendar = (props: AvailabilityCalendarProps) => {
	const [openResevationDetails, setOpenReservationDetails] = React.useState<boolean>(true)
	const [reservationObj, setReservationObj] = React.useState<any>({
		fromDate: new Date(),
		toDate: new Date(),
		fromTime: '',
		toTime: '',
		reservedFor: '',
		locationType: '',
		location: '',
		reason: '',
		multiDay: false
	})
	const [events, setEvents] = React.useState<any>([])

	function handleEventClick({ event, el }: any) {
		setOpenReservationDetails(true)
	};
	function tConvert(time: any) {
		time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

		if (time.length > 1) { // If time format correct
			time = time.slice(1);  // Remove full string match value
			time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
			time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join(''); // return adjusted time or original string
	}

	const handleClose = (val: boolean) => {
		setOpenReservationDetails(false);
	}
	const handleSave = (values: any) => {
		const startTime = values.fromTime.toString().split(' ')[4]
		const endTime = values.toTime.toString().split(' ')[4]
		const obj = {
			id: events.length + 1,
			title: tConvert(startTime) + '-' + tConvert(endTime),
			start: values.fromDate.toISOString().slice(0, 10) + 'T' + startTime,
			end: values.toDate.toISOString().slice(0, 10) + 'T' + endTime,
			name: values.reservedFor,
			reservationDetails: values
		}
		setEvents([...events, obj])
	}
	const handleInputChange = () => { }
	const EventDetail = ({ event, el }: any) => {
		setReservationObj(event.extendedProps.reservationDetails)
		return <>
			<p>{event.title}</p>
			<div style={{ position: 'absolute', bottom: '2px', right: '5px', marginTop: '2px' }}>
				<TextField variant='outlined' value={event.extendedProps.name} style={{ border: '1px solid white' }} size='small'
					InputProps={{
						endAdornment: (
							<EditIcon onClick={handleEventClick} />
						),
						startAdornment: (
							<AccountCircleIcon />
						),
					}}>
				</TextField>
			</div>
		</>
	};
	const handleDatePicker = () => {

	}
	return (<>
		<SmartDialog
			open={true}
			PaperProps={{
				sx: {
					height: '90%',
					width: '85%'
				}
			}}
			custom={{
				closable: true,
				resizable: true,
				title: 'Availability Calendar'
			}}

		>

			<Grid container className='main-conatiner'>
				<Grid sm={3} className='left-section'>
					<InputLabel>Tools</InputLabel>
					<Card className='image-card'>
						<div className='image'>
							<Box component='img' className='tool-image' src={props.toolData.image} alt='image' />
						</div>
						<InputLabel className='toll-name'>{props.toolData.name}</InputLabel>
						<div className='toll-content'>
							<div className='toll-content-right'>
								<TextField variant='outlined' value={'hhhhhhhh'} size='small'></TextField>
								<div className='toll-rtlc'>
									<WifiTetheringIcon />
									<InputLabel className='rtls-name'>{props.toolData.rtlsId}</InputLabel>
								</div>
							</div>
							<div className='toll-content-left'>
								<Box className="qr-code-img" component="img" alt="QR Code" src={'https://betaimg.smartappbeta.com/barcode/generatebarcode?bfrmt=QR&val=2222222&w=240&h=243'} />
							</div>
						</div>
					</Card>
				</Grid>
				<Grid sm={9} >
					<Grid container>
						<Grid sm={12} className='right-section'>
							{/* <DatePicker /> */}
							{/* {"swathi"} */}
							{/* <Card variant='outlined' style={{ height: '10%', width: '100%' }}>
									<Stack direction='row' spacing={2} mt={3} ml={2}>
										<CalendarTodayOutlinedIcon />
										<InputLabel color='error' style={{ color: 'blue' }}>Today</InputLabel>
										<KeyboardArrowLeftOutlinedIcon />
										<InputLabel style={{ color: 'blue' }}>{'Feb 09 2022'}</InputLabel>
										<KeyboardArrowRightOutlinedIcon />
										<ToggleButtonGroup exclusive size='small' color="error" style={{ alignItems: 'end', marginTop: '-6px' }}>
											<ToggleButton value='week' color='primary'> Week </ToggleButton>
											<ToggleButton value='day'> Day </ToggleButton>
										</ToggleButtonGroup>
									</Stack>
								</Card> */}
							<Card variant='outlined' className='toolkit-card'>
								<Stack direction='row' spacing={1} ml={20}>
									<Card variant='outlined' style={{ height: '5%', width: '5%' }}>
										<Box component='img' style={{ height: '20%', width: '90%' }} src={props.toolData.image} alt='image' />
									</Card>
									<Stack direction='column'>
										<InputLabel className='toolname'>{props.toolData.name}</InputLabel>
										<Stack direction='row'>
											<InputLabel className='model-number-label'>Model:</InputLabel>
											<InputLabel className='model-number'>{props.toolData.modelNumber}</InputLabel>
											<InputLabel className='rtlc-tag-label'>RTLS Tag No:</InputLabel>
											<InputLabel className='rtlc-tag-no'>{props.toolData.rtlsId}</InputLabel>
										</Stack>
									</Stack>
								</Stack>
							</Card>
							<div className="filterBox">
								<TextField variant='outlined' value={'Filter by : All'} onChange={handleInputChange} size='small'></TextField>
							</div>
							<div className='calendarSection'>
								<CalendarTodayIcon fontSize='small' />
							</div>
							<FullCalendar
								plugins={[dayGridPlugin, timeGridPlugin]}
								customButtons={{
									myCustomButton: {
										icon: 'chevron-left',
										click: () => { handleDatePicker() }
									}

								}}
								headerToolbar={{
									left: 'today prev title next',
									center: 'timeGridWeek,timeGridDay',
									right: ''
								}}
								initialView='timeGridDay'
								editable={true}
								nowIndicator={true}
								selectable={true}
								selectMirror={true}
								dayMaxEvents={true}
								weekends={true}
								events={events}
								height={470}
								// eventClick={handleEventClick}
								// eventOrder={EventDetail}
								eventContent={EventDetail} // custom render function
							// select={this.handleDateSelect}
							// eventClick={this.handleEventClick}
							// eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
							/* you can update a remote database when these fire:
							eventAdd={function(){}}
							eventChange={function(){}}
							eventRemove={function(){}}
							*/
							/>
						</Grid>
					</Grid>
					<Grid container className='footer-card'>
						<Grid sm={6} className='legend'>
							Legend : Blocked
						</Grid>
						<Grid sm={6} className='add-button'>
							<Button variant="contained" color="primary">Add</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</SmartDialog>
		{
			openResevationDetails ?
				<ResevationDetails reservationData={reservationObj} onClose={(val) => handleClose(val)} onSave={(values) => handleSave(values)} />
				: <></>
		}
	</>)
}

export default AvailabilityCalendar;