import SmartDropDown from "components/smartDropdown";

export default (props: any) => (
    <SmartDropDown
        options={props.options}
        dropDownLabel=""
        isSearchField={false}
        isFullWidth={true}
        selectedValue={props.value }
        // handleChange={(value: any) => handleOnChange(value, params)}
        sx={{
            fontSize: "13px",
            "&:before": {
                border: "none",
            },
            "&:after": {
                border: "none",
            },
            ".MuiSelect-icon": {
                display: "none",
            },
        }}
        menuProps={props.menuPaper}
    />
);