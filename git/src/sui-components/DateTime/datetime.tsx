import React, { useState } from 'react';
import DatePickerComponent from 'components/datepicker/DatePicker';
import TimePickerComponent from 'sui-components/TimePicker/TimePicker';
import './datetime.scss';

export interface DateTimePickerProps {
	dateDefaultValue?: any;
	dateRender?: any;
	dateOnChange?: (value: any) => void;
	dateMax?: any;
	dateMin?: any;
	dateContainerClassName?: any;
	dateDisabled?: any;
	timeDefaultValue?: any;
	timeOnChange?: (value: any) => void;
	timeDisabled?: boolean;
}

const DateTimeComponent = (props: DateTimePickerProps) => {
	const { dateDefaultValue, dateRender, dateOnChange, dateMax, dateMin, dateContainerClassName, dateDisabled, timeDefaultValue, timeOnChange, timeDisabled } = props;

	const handleDateChange = (newDate: any) => {
		if (dateOnChange) dateOnChange(newDate);
	}
	const handleTimeChange = (newTime: any) => {
		if (timeOnChange) timeOnChange(newTime);
	}
	return (
		<div className='DateTimeSection'>
			<div className='dateSection'>
				<DatePickerComponent
					defaultValue={dateDefaultValue}
					onChange={(e) => handleDateChange(e)}
					maxDate={dateMax}
					minDate={dateMin}
					containerClassName={dateContainerClassName}
					render={dateRender}
					disabled={dateDisabled}
				/>
			</div>
			<div className='timeSection'>
				<TimePickerComponent
					defaultValue={timeDefaultValue}
					getTimedata={(e) => { handleTimeChange(e) }}
					disabled={timeDisabled}
				/>
			</div>
		</div>
	)
}
export default DateTimeComponent