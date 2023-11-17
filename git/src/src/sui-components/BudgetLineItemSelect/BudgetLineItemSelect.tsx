import React from "react";
import SmartDropDown from "components/smartDropdown";
import { Box } from '@mui/material';
import { makeStyles, createStyles } from "@mui/styles";
//import BudgetLineItem from 'resources/images/bidManager/BudgetLineItem.svg';

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: "calc(100% - 450px) !important",
			width: "650px !important",
			'max-width': "650px !important"
		},
		workItemsMenuPaper: {
			maxHeight: "calc(100% - 450px) !important",
			width: "990px !important",
			'max-width': "990px !important"
		},
	})
);

interface SUIBudgetLineItemSelectProps {
	name?: string | unknown;
	options: any;
	lineItemlabel?: any;
	handleInputChange?: any;
	multiSelect?: boolean;
	selectedValue?: any;
	required?: boolean;
	disabled?: boolean;
	dropDownListExtraColumns?: any;
	handleClose?:any;
	showColumnHeader?:boolean;
	showDropDownHeaderTitle?:boolean;
	dropDownHeaderTitle?:string;
	showHeaderCloseIcon?:boolean;
	showExtraColumns?:boolean;
	isDropDownPosition?:boolean;
	showDescription?:boolean;
	disableOptionsList?:any;
};

const SUIBudgetLineItemSelect = (props: SUIBudgetLineItemSelectProps) => {
	const { multiSelect = true, required = false, disabled = false, showColumnHeader = true, showDropDownHeaderTitle = false, dropDownHeaderTitle = '',showHeaderCloseIcon = false, showExtraColumns = false, isDropDownPosition = false,showDescription=false, disableOptionsList=[] } = props
	const classes = useStyles();
	const [selectedVal, setSelectedVal] = React.useState<string>(props.selectedValue);

	const handleInputChange = (val: any) => {
		setSelectedVal(val);
		props.handleInputChange(val);
	};

	React.useEffect(() => {
		setSelectedVal(props.selectedValue);
	}, [props.selectedValue]);

	return (
		<SmartDropDown
			name={props.name}
			LeftIcon={
				<span className="common-icon-smartapp"></span>
			}
			dropDownLabel={props.lineItemlabel}
			showColumnHeader={showColumnHeader}
			columnName='Estimated Budget'
			options={props.options || []}
			selectedValue={selectedVal}
			showToolTipForDisabledOption={true}
			Placeholder={"Select"}
			isSearchField
			disabled={disabled}
			required={required}
			isMultiple={multiSelect}
			dropDownListExtraColumns={props?.dropDownListExtraColumns}
			useNestedOptions={true}
			outSideOfGrid={true}
			isFullWidth
			handleChange={(value: any) => handleInputChange(value)}
			sx={{
				"& .MuiInputBase-input": {
					padding: "4px 25px 4px 0px !important",
				},
			}}
			menuProps={isDropDownPosition ? classes.workItemsMenuPaper : classes.menuPaper}
			showFilterIcon={true}
			reduceMenuHeight={true}
			handleListClose={(values:any) => props?.handleClose(true)}
			showDropDownHeaderTitle={showDropDownHeaderTitle}
			dropDownHeaderTitle={dropDownHeaderTitle}
			showHeaderCloseIcon={showHeaderCloseIcon}
			showExtraColumns={showExtraColumns}
			isDropDownPosition={isDropDownPosition}
			showDescription={showDescription}
			disableOptionsList={disableOptionsList}
		/>
	);
};

SUIBudgetLineItemSelect.defaultProps = {
	options: [],
	selectedValue: [],
};

export default SUIBudgetLineItemSelect;
