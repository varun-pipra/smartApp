import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import React from "react";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Icon from "@mui/material/Icon";
import createTheme from "@mui/material/styles/createTheme";
import { AccountCircle } from "@mui/icons-material";
import { DateValidationError } from "@mui/x-date-pickers/internals";
import { InputAdornment, InputLabel, Stack } from "@mui/material";
import './SmartDatePicker.scss'


export interface SmartDatePickerProps extends DatePickerProps<Date, Date> {
    label?: string;
    value: Date | null;
    iconName?: string;
    required?: boolean;
    disableMonth?: number;
    /**
     * Dates between this range will disabled
     */
    disableDateRange?: string[] | Date[];
    placeholder?: string;
    disableYear?: number;
    /**
     * Dates in the array will be disabled
     */
    disableDatesArray?: Date[] | string[];
    onError?: any;
};


export default function SmartDatePicker({
    label, value = null, onChange, placeholder, iconName, required, disableMonth,
    disableYear, disableDateRange = [], disableDatesArray = [], renderInput, ...rest }: SmartDatePickerProps) {

    const [date, setDate] = React.useState<any>(null)
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const [disableDates, setDisableDates] = React.useState<string[]>([])
    const [error, setError] = React.useState<boolean>(false);

    React.useEffect(() => {
        value === null ? setDate(null) : setDate(value);
        if (onChange) onChange(value)
    }, [value, onChange])


    React.useEffect(() => {
        const dates: any = []
        disableDatesArray.map(ele => {
            const specificDate = new Date(ele)
            const particularDay = (specificDate.getMonth() + 1) + '-' + specificDate.getDate() + '-' + specificDate.getFullYear();
            dates.push(particularDay);
        })
        setDisableDates(dates);

    }, [])

    function disableSpecificDays(date: Date) {
        const day = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
        return disableDates.includes(day) ? true : (new Date(day) > new Date(disableDateRange[0])) && (new Date(day) < new Date(disableDateRange[1])) ? true : false;
    }

    function disableParticularMonth(date: Date) {
        return date.getMonth() + 1 === disableMonth;
    }

    function disableParticularYear(date: Date) {
        return date.getFullYear() === disableYear;
    }

    function onMouseEnter(event: any) {
        setIsHovered(true);
    }

    function onMouseLeave(event: any) {
        setIsHovered(false);
    }

    function onFocus(event: any) {
        setIsFocused(true)
    }

    function onBlur(event: any) {
        setIsFocused(false)
    }

    function handleValidation(reason: any, val: any) {
        reason != null ? setError(true) : setError(false);
    }


    return (
        <Stack direction={'column'} className='date-picker-main'>
            {date || isFocused ? <InputLabel className={'datepicker-label'} required={required}>{label}</InputLabel> : ''}
            <Stack direction={'row'}>

                <Icon data-testid={'icon'} className={error ? 'error' : isFocused ? 'focus' : isHovered ? 'hover' : 'normal'}>
                    {iconName}
                </Icon>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label={date || isFocused ? '' : placeholder ? placeholder : label}
                        value={date}
                        onChange={(newValue) => {
                            setDate(newValue);
                            if (onChange) onChange(newValue);
                        }}
                        shouldDisableDate={disableSpecificDays}
                        shouldDisableMonth={disableParticularMonth}
                        shouldDisableYear={disableParticularYear}
                        renderInput={(params: any) => <TextField
                            data-testid={'datePicker'}
                            required={required}
                            onMouseEnter={(e) => onMouseEnter(e)}
                            onMouseLeave={(e) => onMouseLeave(e)}
                            onFocus={e => onFocus(e)}
                            onBlur={e => onBlur(e)}
                            sx={{
                                svg: { marginTop: "1px", color: "#ED7532" }
                            }}
                            {...params} variant={'filled'} {...renderInput} />}
                        onError={handleValidation}
                        {...rest}
                    />
                </LocalizationProvider>
            </Stack>
        </Stack>
    )
}