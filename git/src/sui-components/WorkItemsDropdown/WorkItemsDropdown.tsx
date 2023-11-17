import React from 'react';
import SmartDropDown from 'components/smartDropdown';
import { Box } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 'calc(100% - 450px) !important',
			width: '650px !important',
			'max-width': '650px !important'
		},
		workItemsMenuPaper: {
			maxHeight: "calc(100% - 450px) !important",
			width: '60% !important',
			'max-width': '60% !important'
		},
	})
);

interface WorkItemsDropdownProps {
	options: any;
	lineItemlabel?: any;
	handleInputChange?: any;
	multiSelect?: boolean;
	selectedValue?: any;
	dropDownListExtraColumns?: any;
	ignoreSorting?: boolean;
	showExtraColumns?:boolean;
	isDropDownPosition?:boolean;
	columnBasedOptions?:boolean;
	showDescription?:boolean;
};

const WorkItemsDropdown = (props: WorkItemsDropdownProps) => {
	const {showExtraColumns,isDropDownPosition = false, columnBasedOptions = false, showDescription=false, ...rest} = props;
	const classes = useStyles();
	const [selectedVal, setSelectedVal] = React.useState<string>(props.selectedValue);
	const handleInputChange = (val: any) => {
		setSelectedVal(val)
		props.handleInputChange(val);
	};
	React.useEffect(() => {
		setSelectedVal(props.selectedValue);
	}, [props.selectedValue]);

	return (
		<SmartDropDown
			LeftIcon={<span className='common-icon-smartapp'></span>}
			dropDownLabel={props.lineItemlabel}
			dropDownListExtraColumns={props.dropDownListExtraColumns || []}
			options={props.options || []}
			selectedValue={selectedVal}
			Placeholder={'Search'}
			isSearchField
			required={false}
			outSideOfGrid={true}
			ignoreSorting={props?.ignoreSorting ? props?.ignoreSorting : false}
			isFullWidth
			handleChange={(value: any) => handleInputChange(value)}
			sx={{
				'& .MuiInputBase-input': {
					padding: '4px 25px 4px 0px !important',
				},
			}}
			showFilterIcon={false}
			reduceMenuHeight={true}
			showExtraColumns={showExtraColumns}
			menuProps={isDropDownPosition ? classes.workItemsMenuPaper : classes.menuPaper}
			isDropDownPosition={isDropDownPosition}
			columnBasedOptions={columnBasedOptions}
			showDescription={showDescription}			
		/>
	);
};

WorkItemsDropdown.defaultProps = {
	options: [],
	selectedValue: [],
};

export default WorkItemsDropdown;
