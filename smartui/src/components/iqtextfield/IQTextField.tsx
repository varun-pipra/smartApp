import * as React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

import './IQTextField.scss';

const IQTextField = (props: TextFieldProps) => {
	return <TextField {...props} className={`iqtextfield ${props.className}`} />
};

export default IQTextField;