import {
	InputAdornment,
	Popover,
	TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker/StaticTimePicker";
import dayjs from "dayjs";
import React from "react";
import "./Clock.scss";
//import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface ClockProps {
	defaultTime?: any;
	disabled?: boolean;
	onTimeSelection?: any;
	placeholder?: any;
	actions?: any;
	ampmInClock?:boolean;
}

const SUIClock = (props: ClockProps) => {
	const { defaultTime, onTimeSelection, disabled, placeholder } = props;
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [time, setTime] = React.useState<any>();
	const [pickerTime, setPickerTime] = React.useState<any>();

	// React.useEffect(() => {
	// 	setTime(defaultTime ? dayjs(defaultTime).format("hh:mm A") : dayjs(new Date()).format("hh:mm A"))
	// 	setPickerTime(defaultTime ? new Date(defaultTime) : new Date())
	// }, [defaultTime]);

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	React.useEffect(() => {
		// setTime(defaultTime ? dayjs(defaultTime).format("hh:mm A") : dayjs(new Date()).format("hh:mm A"))
		// setPickerTime(defaultTime ? new Date(defaultTime) : new Date())

		if (typeof defaultTime === 'string') {
			console.log('defaultTime', defaultTime)
			// let currentTime = convertTimetoDate(defaultTime);
			// setPickerTime(currentTime);
			// setTime(dayjs(currentTime).format("hh:mm A"));
			let currentTime = convertTimetoDate(defaultTime);
			console.log('currentTime', currentTime)
			if (currentTime != null) {
				setPickerTime(currentTime);
				setTime(dayjs(currentTime).format("hh:mm A"));
			} else {
				let currentTime = convertTimetoDate(dayjs(new Date()).format("HH:mm A"));
				setPickerTime(currentTime);
				setTime('');
			}
		} else {
			let currentTime = convertTimetoDate(dayjs(new Date()).format("HH:mm A"));
			setPickerTime(currentTime);
			setTime(dayjs(currentTime).format("hh:mm A"));
		};
	}, [defaultTime])

	const convertTimetoDate = (date: any) => {
		if (date === "") return null;
		let b: any = date ? dayjs(`1/1/1 ${date}`).format("HH:mm:00") : null; //checking AM or PM
		let a: any = dayjs(new Date()).set('hour', (b?.split(":")?.[0])).set('minute', (b?.split(":")?.[1]?.split(" ")?.[0]));
		return a.$d;
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onFieldClick = (event: any) => {
		!disabled && setAnchorEl(event.currentTarget);
	};

	const onAcceptFn = (value: any) => {
		const selectedTime = dayjs(value).format("hh:mm A");
		setTime(selectedTime);
		handleClose();
		onTimeSelection(value.$d);
	};

	return (
		<div className="clock-container">
			<TextField
				fullWidth
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<span className="common-icon-CurrentTime"></span>
						</InputAdornment>
					),
				}}
				name="name"
				variant="standard"
				placeholder={placeholder}
				value={time}
				disabled={disabled}
				onClick={onFieldClick}
			/>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<StaticTimePicker
						componentsProps={{
							actionBar: {
								actions: props.actions || ['accept'],
							},
						}}
						className="clock-picker"
						value={pickerTime}
						onChange={(value: dayjs.Dayjs | null) => {
							setPickerTime(value);
						}}
						renderInput={(params) => <></>}
						onAccept={onAcceptFn}
						ampmInClock={props.ampmInClock || false}
						minutesStep={5}
					/>
				</LocalizationProvider>
			</Popover>
		</div>
	);
};

export default SUIClock;
