import { Theme } from "@mui/material/styles/createTheme";
import { createStyles, makeStyles, useTheme, withStyles } from "@mui/styles";
import SmartDropDown from "components/smartDropdown";
import PropTypes from 'prop-types';
import React from "react";

type MyProps = {
	options: any;
	value: any;
	classes: any;
};

type MyState = {
	value: number;
};

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     menuPaper: {
//         //maxHeight: 300,
//         maxWidth: '160px !important',
//         minWidth: 'fit-content !important',
//         marginLeft: '18px'
//     },
//     dropDown: {
//         position: "absolute",
//         width: "100%",
//         height: "100%"
//     }
//   }),
// );

const styles = (theme?: any) => ({
	menuPaper: {
		//maxHeight: 300,
		maxWidth: '160px !important',
		minWidth: 'fit-content !important',
		marginLeft: '18px'
	},
	dropDown: {
		position: "absolute",
		width: "100%",
		height: "100%"
	}
})

class DropdownEditor extends React.Component<MyProps, MyState> {
	// private inputRef: RefObject<HTMLInputElement>;

	state: MyState = {
		value: 0
	}

	constructor(props: any) {
		super(props);

		// this.inputRef = createRef();

		this.state = {
			value: parseInt(this.props.value)
		};

	}

	componentDidMount() {
		// this.inputRef?.current?.focus();

	}

	/* Component Editor Lifecycle methods */
	// the final value to send to the grid, on completion of editing
	getValue() {
		return this.state?.value * 2;
	}

	// Gets called once before editing starts, to give editor a chance to
	// cancel the editing before it even starts.
	isCancelBeforeStart() {
		return false;
	}

	// Gets called once when editing is finished (eg if Enter is pressed).
	// If you return true, then the result of the edit will be ignored.
	isCancelAfterEnd() {

		// our editor will reject any value greater than 1000
		return this.state?.value > 1000;
	}

	handleOnChange(event: any) {

		this.setState({ value: event.target.value });
	}

	render() {
		// const { classes } = this.props;
		return (
			<SmartDropDown
				// className={classes.dropDown}
				options={this.props.options}
				dropDownLabel=""
				isSearchField={false}
				isFullWidth={true}
				selectedValue={this.props.value}
				// selectedValue={params.data ? params.data.costType : ""}
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
			// menuProps={classes.menuPaper}
			/>
		);
	}
}

// DropdownEditor.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default DropdownEditor;