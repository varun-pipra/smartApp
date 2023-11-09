import React, { useState, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import DatePicker, { CalendarProps, DatePickerProps } from "react-multi-date-picker";
import { FormControl, Select, InputLabel, MenuItem, TextField, Icon, InputAdornment, Box, IconButton, Input, SelectChangeEvent, ListSubheader } from "@mui/material";
import SmartDropDown from "components/smartDropdown";
import DatePickerComponent from "components/datepicker/DatePicker";
import convertDateToDisplayFormat from "utilities/commonFunctions";
const NumericComponent = forwardRef((props: any, ref: any) => {
	const [value, setValue] = useState<number>(props.value);
	const refInput = useRef(null);

	/* Component Editor Lifecycle methods */
	useImperativeHandle(ref, () => {
		return {
			// the final value to send to the grid, on completion of editing
			getValue() {
				return value; // this simple editor doubles any value entered into the input
			},

			// Gets called once before editing starts, to give editor a chance to
			// cancel the editing before it even starts.
			isCancelBeforeStart() {
				return false;
			},

			// Gets called once when editing is finished (eg if Enter is pressed).
			// If you return true, then the result of the edit will be ignored.
			isCancelAfterEnd() {
				// our editor will reject any value greater than 1000
				//return value > 1000;
			}
		};
	});
	const onChange = (event: any) => {
		if (isNaN(event.target.value)) {
			setValue(0);
			return false;
		}
		else {
			setValue(event.target.value);
			return true;
		}

	}
	return (
		<input type="text"
			ref={refInput}
			value={value}
			onChange={event => onChange(event)}
			style={{ width: "100%", border: 'none', }}
		/>
	);
});


const MakeSelector = forwardRef((props: any, ref: any) => {

	const [make, setMake] = useState(props);

	useImperativeHandle(ref, () => {
		return {
			getValue() {
				return make;
			},
			isCancelBeforeStart() {
				return false;
			},
		};
	});

	const handleMakeChange = (e: any) => {
		setMake(e.target.value);
	};

	return (

		<select onChange={e => handleMakeChange(e)} className="browser-default custom-select" >

			{props.options.map((data: any) => (
				<option key={data.label} value={data.value}>
					{data.label}
				</option>
			))}
		</select>
	);
});


const CustomDateComponent = forwardRef((props: any, ref: any) => {
	const [date, setDate] = useState(null);
	const [picker, setPicker] = useState(null);
	const refDatePicker = useRef();
	const refInput = useRef();

	const handleOnChange = (event: any) => {

		let valDateAsPerDBFormat: any = convertDateToDisplayFormat(event);
		// console.log('event', valDateAsPerDBFormat)
		setDate(event);
		props.onChange(event, props)
	};
	useImperativeHandle(ref, () => {
		return {
			getDate: () => {
				return date;
			},
			afterGuiAttached: () => {
				setDate(props.value);
			},
		};
	})

	return (
		<DatePickerComponent
			defaultValue={convertDateToDisplayFormat(props.data.estimatedStart)}
			onChange={(val: any) => handleOnChange(val)}
			maxDate={props.data.estimatedEnd !== '' ? new Date(props.data.estimatedEnd) : new Date('12/31/9999')}
			style={{
				width: '170px',
				border: 'none',
				background: 'transparent'
			}}
		/>
	);
});
export { MakeSelector, CustomDateComponent, NumericComponent };