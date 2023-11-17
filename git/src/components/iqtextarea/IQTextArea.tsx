import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { TextField, TextFieldProps, FormControl, InputLabel, InputBase } from '@mui/material';

// import './IQTextField.scss';

const CustomInput = styled(InputBase)(({ theme }) => ({
	'label + &': {
		marginTop: theme.spacing(3),
	},
	'& .MuiInputBase-input': {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
		border: '1px solid #ced4da',
		// fontSize: 16,
		width: 'auto',
		padding: '10px 12px',
		transition: theme.transitions.create([
			'border-color',
			'background-color',
			'box-shadow',
		]),
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:focus': {
			boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
			borderColor: theme.palette.primary.main,
		},
	},
}));

const IQTextArea = (props: TextFieldProps) => {
	return <FormControl variant="standard">
		<InputLabel shrink htmlFor="bootstrap-input">
			{props.label ? props.label : "Bootstrap"}
		</InputLabel>
		<CustomInput  className={`iqtextarea ${props.className}`}/>
	</FormControl>
};

export default IQTextArea;