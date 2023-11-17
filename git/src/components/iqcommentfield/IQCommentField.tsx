import React, { useEffect, useState } from 'react';
import { Divider, Paper, IconButton, InputBase, InputBaseProps, PaperProps } from '@mui/material';
import { Reply } from '@mui/icons-material';

import './IQCommentField.scss';

type IQCommentFieldProps = PaperProps & {
	inputFieldProps?: InputBaseProps,
	onButtonClick?: any
	placeholder?:any;
	value?:any;
};

const IQCommentField = ({ className, inputFieldProps, onButtonClick, placeholder, value, ...otherProps }: IQCommentFieldProps) => {

	return <Paper
		elevation={0}
		className={`iq-commentfield${className ? ` ${className}` : ''}`}
		{...otherProps}
	>
		<InputBase className='iq-commentfield-input' value={value} placeholder={placeholder} {...inputFieldProps} />
		<Divider className='iq-commentfield-divider' sx={{ height: 28, m: 0.5 }} orientation='vertical' />
		<IconButton className='iq-commentfield-reply-btn' aria-label='Comment/Reply' onClick={onButtonClick}>
			<Reply />
		</IconButton>
	</Paper>;
};

export default IQCommentField;