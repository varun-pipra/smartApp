import {
	InputAdornment,
	Popover,
	TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker/StaticTimePicker";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import "./Clock.scss";
//import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface ClockProps {
	defaultTime?: any;
	disabled?: boolean;
	onTimeSelection?: any;
	placeholder?: any;
	actions?: any;
	ampmInClock?:boolean;
	pickerDefaultTime?:any;
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
				let currentTime = convertTimetoDate(props.pickerDefaultTime ? props.pickerDefaultTime : dayjs(new Date()).format("hh:mm A"));
				setPickerTime(currentTime);
				setTime('');
			}
		} else {
			let currentTime = convertTimetoDate(dayjs(new Date()).format("hh:mm A"));
			setPickerTime(currentTime);
			setTime(dayjs(currentTime).format("hh:mm A"));
		};
	}, [defaultTime])

	useEffect(()=> {
		if (open) {
      let currentTime = convertTimetoDate(
        props.pickerDefaultTime
          ? props.pickerDefaultTime
          : dayjs(new Date()).format("hh:mm A")
      );
      setPickerTime(currentTime);
    }
		
	}, [props?.pickerDefaultTime, open]);

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
		if (time) {
			const timeDt = convertTimetoDate(time);
			setPickerTime(timeDt);
			onTimeSelection(timeDt);
		} else {
			setPickerTime(new Date());
		}
		!disabled && setAnchorEl(event.currentTarget);
	};

	const onAcceptFn = (value: any) => {
		const selectedTime = dayjs(value).format("hh:mm A");
		setTime(selectedTime);
		handleClose();
		onTimeSelection(value.$d);
	};

	const hanldeKeyDown = (event: any) => {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			// Get the current value of the input field
			let currentTime: any = event.target.value;
			if (currentTime) {
				const timeDt = convertTimetoDate(currentTime);
				if (isNaN(timeDt)) {
					setTime('');
					return;
				}
				// Parse the current time into hours, minutes, and AM/PM parts
				let [hours, minutes, ampm] = currentTime.split(/:|\s/);

				// Convert hours and minutes to integers
				hours = parseInt(hours, 10);
				minutes = parseInt(minutes, 10);
				if (isNaN(hours) || isNaN(minutes)) {
					setTime('');
					return;
				}

				// Handle the arrow key events
				if (event.key === "ArrowUp") {
					// Increment time
					minutes += 5;
					if (minutes >= 60) {
					minutes -= 60;
					hours = (hours + 1) % 12;
					}
				} else if (event.key === "ArrowDown") {
					// Decrement time
					minutes -= 5;
					if (minutes < 0) {
					minutes += 60;
					hours = (hours - 1 + 12) % 12;
					}
				}
				// Format the new time
				hours = hours === 0 ? 12 : hours; // Handle midnight (0 hours)
				if (hours === 12 && minutes === 0) {
				ampm = ampm?.toLowerCase() === "am" ? "PM" : "AM";
				}
				let newTime = `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;

				// Update the input field with the new time
				setTime(newTime);
			} else {
				setTime('12:00 AM');
			}
	}
		
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
				onChange={(e: any)=> setTime(e.target.value)}
				onKeyDown={(e: any)=> hanldeKeyDown(e)}
				onBlur={(e: any)=> {
					const time = e.target.value;
					if (time) {
						const timeDt = convertTimetoDate(time);
						if (isNaN(timeDt)) {
							setTime('');
							onTimeSelection('');
						} else {
							onTimeSelection(timeDt);
						}
						
					}
				}}
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
