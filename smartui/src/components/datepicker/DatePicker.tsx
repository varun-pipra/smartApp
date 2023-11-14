import { useEffect, useState } from "react";
import DatePicker, { CalendarProps, DatePickerProps } from "react-multi-date-picker";
import Toolbar from "react-multi-date-picker/plugins/toolbar";
// import { Input } from "react-input-mask";
import type { Value } from "react-multi-date-picker";

import "./DatePicker.scss";
import convertDateToDisplayFormat from "utilities/commonFunctions";

interface DatePickerComponent extends DatePickerProps, CalendarProps {
	defaultValue?: any;
	onChange?: (value: any) => void;
	format?: string;
	containerClassName?: any;
	outSideGrid?: Boolean;
	disabled?: boolean;
	allowInLineEdit?: Boolean;
}

const DatePickerComponent = (props: DatePickerComponent) => {
	const { defaultValue, format = 'MM/DD/YYYY', onChange, outSideGrid = false, containerClassName, disabled = false, zIndex = 100, onOpenPickNewDate = true, allowInLineEdit = false, ...rest } = props;
	const [value, setValue] = useState<Value>(defaultValue);
	const [dateDisable, setDateDisable] = useState<boolean>(false)
	useEffect(() => { setValue(defaultValue) }, [defaultValue])
	useEffect(() => { setDateDisable(disabled) }, [disabled])
	const handleDateChange = (e: any) => {
		if (dateDisable == false && e) {
			const newDate = convertDateToDisplayFormat(e);
			setValue(newDate);
			if (onChange) onChange(newDate);
		}
		else {
			!allowInLineEdit && e.preventDefault()
		}

	}
	/* const handleChangeRaw = (date: any) => {
		const newRaw: Date = new Date(date.currentTarget.value);
		if (newRaw instanceof Date) {
			setValue(newRaw);
			if (onChange) onChange(newRaw);
		}
	}; */

	return (
		<>
			<DatePicker
				zIndex={zIndex}
				value={value}
				onChange={(e) => handleDateChange(e)}
				// onChangeRaw={(e) => handleChangeRaw(e)}
				portal
				disabled={dateDisable}
				readOnly={dateDisable}
				hideOnScroll
				containerClassName={containerClassName}
				className={"iq-custom-datapicker"}
				arrow={false}
				onOpenPickNewDate={false}
				format={format}
				weekDays={["S", "M", "T", "W", "T", "F", "S"]}
				// render={<InputMask />}
				months={[
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				]}
				{...rest}
				plugins={[<Toolbar position="bottom" sort={["today"]} />]}
			/>{" "}
		</>
	);
};
/* const InputMask = (props: any) => {
	return (
		<Input
			className="rmdp-input"
			mask="9999/99/99"
			maskChar="-"
			onFocus={props.openCalendar}
			onChange={props.handleValueChange}
			value={props.value}
		/>
	);
} */
export default DatePickerComponent;
