import {memo} from 'react';
import {Box, BoxProps} from '@mui/material';

import './IQGridWrapper.scss';

// Project files and internal support import
import {TableGridProps} from 'sui-components/Grid/Grid-copy';
import {IQGridToolbarProps} from './iqgridtoolbar/IQGridToolbar';

export interface IQGridWrapperProps extends BoxProps {
	toolbar?: IQGridToolbarProps;
	grid?: TableGridProps;
};

// Component definition
const IQGridWrapper = ({children, className}: IQGridWrapperProps) => {
	return <Box className={`iqgridwrapper-root${className ? ` ${className}` : ''}`}>
		{children}
	</Box>;
};

export default memo(IQGridWrapper);