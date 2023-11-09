import { FormControlLabel, FormGroup, makeStyles, Switch, SwitchProps } from "@mui/material";
import styled from '@emotion/styled'
import React, { ChangeEvent } from "react";

export interface ToggleFieldProps extends SwitchProps {
	switchLabels?: Array<string>;
	onChange?: ((event: ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined
	label?: string;
	checked: boolean;
}

export default function ToggleField(props: ToggleFieldProps) {
	const [checked, setChecked] = React.useState<boolean>(props.checked);

	const handleOnChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
		setChecked(checked);
		if (props.onChange) props.onChange(event, checked)
	};
	React.useEffect(() => {
		setChecked(props.checked);

	}, [props.checked])

	// const Android12Switch = styled(Switch)(({ theme }) => ({
	// 	padding: 8,
	// 	'& .MuiSwitch-track': {
	// 		borderRadius: 22 / 2,

	// 		'&:before, &:after': {
	// 			content: '""',
	// 			position: 'absolute',
	// 			top: '50%',
	// 			transform: 'translateY(-50%)',
	// 			width: 16,
	// 			height: 16,
	// 		},
	// 		'&:before': {
	// 			left: 12,
	// 			fontSize: '10px',
	// 			fontWeight: 'bold',
	// 			content: props.switchLabels ? "'" + props.switchLabels[0] + "'" : "''"
	// 		},
	// 		'&:after': {
	// 			// backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
	// 			//   theme.palette.getContrastText(theme.palette.primary.main),
	// 			// )}" d="M19,13H5V11H19V13Z" /></svg>')`,
	// 			right: 16,
	// 			fontSize: '10px',
	// 			fontWeight: 'bold',
	// 			color: 'white',
	// 			content: props.switchLabels ? "'" + props.switchLabels[1] + "'" : "''"
	// 		},
	// 	},
	// 	'& .MuiSwitch-thumb': {
	// 		boxShadow: 'none',
	// 		width: 16,
	// 		height: 16,
	// 		margin: 2,
	// 	},
	// }));




	return (<>
		<FormGroup>
			<FormControlLabel
				control={<Switch role="switch" data-testid='toggleField' {...props} onChange={handleOnChange} checked={checked} />}
				label={props.label ? props.label : ''}
			/>
		</FormGroup>
	</>
	)
}