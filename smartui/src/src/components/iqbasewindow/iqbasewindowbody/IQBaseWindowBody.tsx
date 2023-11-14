import './IQBaseWindowBody.scss';

import {DynamicPageProps} from 'components/ui5/dynamicpage/DynamicPage';
import {memo} from 'react';

// Project files and internal support import
import {IQGridWrapperProps} from '../iqgridwrapper/IQGridWrapper';

export interface IQBaseWindowBodyProps extends DynamicPageProps {
	type?: 'default' | 'tabs';
	tabs?: Array<any>;
	detailView?: any;
	gridRef?: any;
	gridContainer?: IQGridWrapperProps;
	handleGridRowDoubleClick?: Function;
};

// Component definition
const IQBaseWindowBody = ({children}: IQBaseWindowBodyProps) => {
	return <>{children}</>;
};

export default memo(IQBaseWindowBody);