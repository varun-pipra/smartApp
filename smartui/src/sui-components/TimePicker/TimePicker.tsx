import React, { useState } from 'react';
import './TimerPicker.scss';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Autocomplete, TextField, Box, InputAdornment } from "@mui/material";

import { createFilterOptions } from '@mui/material/Autocomplete';

import { Timedata } from './data'

export interface TimerPickerProps {
	defaultValue?: any;
	getTimedata?: (value: any) => void;
	disabled?:boolean;
}

const TimePicker = (props: TimerPickerProps) => {
	const [open, setOpen] = useState<boolean>(false);
	const [timevalue, settimevalue] = useState(props?.defaultValue ? props?.defaultValue : '');
	React.useEffect(() =>{settimevalue(props?.defaultValue)}, [props?.defaultValue])

	const Validation = (value: any) => {
		var regex = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i;
		return regex.test(value)
	}
	const onChange = (event: any, values: any) => {
		var isValid = Validation(values)
		if (isValid) {
			const data = values.toUpperCase()
			settimevalue(data)
			if (props.getTimedata) props.getTimedata(data)
		}
		else {
			settimevalue('');
			if (props.getTimedata) props.getTimedata('')
		}
		setOpen(false);
	}
	const onBlur = (event: any) => {
		var isValid = Validation(event.target.value)
		if (isValid) {
			const data = event.target.value.toUpperCase()
			settimevalue(data)
			if (props.getTimedata) props.getTimedata(data)
		}
		else {
			settimevalue('')
			if (props.getTimedata) props.getTimedata('')
		}
		setOpen(false);
	}
	const filterOptions = createFilterOptions({
		matchFrom: 'start',
	});
	return (
		<div className='TimePicker_main'>

			<Autocomplete
				id="free-solo-demo"
				freeSolo
				options={Timedata.map((option: any) => option.title)}
				// defaultValue={''}
				onChange={onChange}
				value={timevalue}
				disabled={props?.disabled}
				readOnly={props?.disabled}
				// openOnFocus={true}
				open={open}
				disableClearable
				disableCloseOnSelect={false}
				renderInput={(params) => {
					return (
						<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
							{/* <AccessTimeIcon sx={{ borderBottom: '1px solid gray', color: '#ed7532', height: '1.2em', paddingBottom: '4px', paddingRight: '4px' }} onClick={() => { setOpen(true) }} /> */}
							<TextField
								{...params}
								disabled={props?.disabled}
								variant={'standard'} placeholder="HH:MM"
								onClick={() => { setOpen(true) }}
								onBlur={(event) => { onBlur(event) }}
								onChange={(event) => { settimevalue(event.target.value) }}
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<InputAdornment position="start">
											<AccessTimeIcon sx={{ color: '#ed7532', fontSize: '1.28rem' }} onClick={() => { setOpen(true) }} />
										</InputAdornment>
									)
								}}
							/>
						</Box>
					)
				}}
				filterOptions={filterOptions}
			/>


		</div>
	)
}
export default TimePicker