import { Box, TextField, Tooltip } from '@mui/material';
import react from 'react';
import { buildIconsForTextBox } from '../smartappTextFeildIcons/smartappTextFeildIcons';
import { useState } from 'react';
import { TextValidator } from 'utilities/textValidator';


export interface BoxTextFeildProps {
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	name?: string;
	type?: 'text' | 'textarea' | 'email' | 'password' | 'number';
	multiline?: boolean;
	required?: boolean;
	value?: string;
	id?: string | number | undefined;
	label?: string;
	placeholder?: string;
	icons?: 'email' | 'cell' | 'website' | 'fax' | 'repair';
	variant?: "standard" | "filled" | "outlined" | undefined;
	helperText?: string;
	error?: string;
	validators?: string | any;
}

export const CustomizedBoxTextFeild = (props: any) => {
	const [flg, setFlg] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const [errMessage, seterrMessage] = useState('');
	let errorMessage: any;
	let erorr: any;
	const onchangeValueForTextFeild = (validationtype: any, event: any) => {
		errorMessage = TextValidator.validate(validationtype, event.target.value);
		if (errorMessage != null) {
			seterrMessage(errorMessage);
		} else {
			seterrMessage('');
		}
	}

	return (

		<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
			{buildIconsForTextBox(props.type)}
			<Tooltip title="These Field Is Required" open={!flg && isHover}>
				<TextField
					fullWidth
					size="small"
					disabled={props?.disabled}
					name={props?.name}
					type={props?.type}
					multiline={props?.type === 'textarea' ? true : false}
					rows={2}
					required={props?.required}
					label={props?.label}
					value={props?.value}
					helperText={errMessage}
					// error={errMessage}
					variant={props?.variant}
					onChange={(event: any) => onchangeValueForTextFeild(props.validators, event)}
					onClick={() => setFlg(!flg)}
					onMouseOver={() => setIsHover(true)}
					onMouseLeave={() => setIsHover(false)}
				/>
			</Tooltip>
		</Box>
	)
}