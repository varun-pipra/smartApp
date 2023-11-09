import {memo} from 'react';
import {AgGridReact, AgGridReactProps} from 'ag-grid-react';

import './IQDataGrid.scss';

type IQDataGridProps = AgGridReactProps & {
	className?: string;
};

const IQDataGrid = ({className, ...props}: IQDataGridProps) => {
	return (
		<AgGridReact {...props} className={`iq-datagrid ${className}`} />
	);
};

export default memo(IQDataGrid);