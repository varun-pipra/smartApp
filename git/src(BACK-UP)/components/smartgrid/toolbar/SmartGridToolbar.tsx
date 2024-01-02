import * as React from 'react';
import PropTypes from 'prop-types';
import { Toolbar } from '@mui/material';

import './SmartGridToolbar.scss';

const SmartGridToolbar = (props: any) => {
	return <Toolbar>
		{props.children}
	</Toolbar>
};

SmartGridToolbar.propTypes = {
	children: PropTypes.element
};

export default SmartGridToolbar;