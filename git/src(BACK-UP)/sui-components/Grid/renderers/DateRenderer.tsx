import DatePickerComponent from "components/datepicker/DatePicker";
import convertDateToDisplayFormat from "utilities/commonFunctions";

export default (props: any) => {

    return (
    <DatePickerComponent
        defaultValue={convertDateToDisplayFormat(props.value)}
        // onChange={(val: any) => handleOnChange(val, params)}
        minDate={new Date(props.value)}
        style={{
            width: '170px',
            border: 'none',
            background: 'transparent'
        }}

    />
    )
}