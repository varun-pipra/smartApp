import {memo, useEffect, useRef, useState} from 'react';
import {Box, BoxProps} from '@mui/material';
import IQGridToolbar from 'components/iqbasewindow/iqgridwrapper/iqgridtoolbar/IQGridToolbar';
import SUIGrid from 'sui-components/Grid/Grid-copy';

import './TabbedWindowContent.scss';

import {TableGridProps} from 'sui-components/Grid/Grid-copy';
import {IQGridToolbarProps} from 'components/iqbasewindow/iqgridwrapper/iqgridtoolbar/IQGridToolbar';
import {IQBaseWindowPresenceProp} from 'components/iqbasewindow/IQBaseWindowTypes';
import {AgGridReact} from 'ag-grid-react';

export interface TabbedWindowContentProps extends BoxProps {
	lidCondition?: any;
	detailView?: any;
	manualLIDOpen?: boolean;
	onDetailClose?: any;
	defaultTabId?: any;
	presenceProps?: IQBaseWindowPresenceProp;
	toolbar?: IQGridToolbarProps;
	grid?: TableGridProps;
	onPreviousNavigation?: any;
	onNextNavigation?: any;
	detailGridNavigation?: boolean;
	navigationFlag?:any;
	navigationCount?:any;
};

// Component definition
const TabbedWindowContent = ({
	className, detailView, lidCondition, manualLIDOpen, onDetailClose, navigationFlag, navigationCount,
	defaultTabId, presenceProps, toolbar, grid, onPreviousNavigation, onNextNavigation, detailGridNavigation = false, ...props
}: TabbedWindowContentProps) => {
	const gridRef = useRef<AgGridReact>();
	const [openLID, setOpenLID] = useState(false);
	const [details, setDetails] = useState(undefined);
	const [navFlag, setNavFlag] = useState(0);
	const [gridNavigationCount, setGridNavigationCount] = useState({
		startPage: 0,
		endPage: 0
	});

	const LineItemWindow = detailView;
	useEffect(() => {
		setNavFlag(navigationFlag);
		setGridNavigationCount(navigationCount);
	},[navigationFlag,	navigationCount])
	useEffect(() => {
		if(manualLIDOpen === true) {
			setOpenLID(true);
		} else {
			setOpenLID(false);
			setDetails(undefined);
		}
	}, [manualLIDOpen]);

	const handleGridRowDoubleClick = (row: any) => {
		const result = lidCondition ? lidCondition(row.data) : '';
		if(!lidCondition || result === true) {
			setOpenLID(true);
			setDetails(row.data);
		}
	};

	const handleCloseLID = () => {
		setOpenLID(false);
		onDetailClose && onDetailClose();
		setDetails(undefined);
	};
	const handleNavigation = (direction?: string) => {
		const grid = gridRef?.current;
		const node = grid?.api?.getSelectedNodes()[0];
		const rowIndex = node?.rowIndex || 0;
		const totalCount = grid?.api?.getDisplayedRowCount() || 0;
		let currentRecord:any;

		if(direction === '-') {
			currentRecord = grid?.api?.getDisplayedRowAtIndex(rowIndex - 1);
			if((rowIndex - 1) === 0) setNavFlag(-1);
			else setNavFlag(0);
		} else if(direction === '+') {
			currentRecord = grid?.api?.getDisplayedRowAtIndex(rowIndex + 1);
			if((rowIndex + 1) === (totalCount - 1)) setNavFlag(1);
			else setNavFlag(0);
		} else if(direction === undefined) {
			currentRecord = grid?.api?.getDisplayedRowAtIndex(rowIndex);
			if(rowIndex === 0) setNavFlag(-1);
			else if(rowIndex === (totalCount - 1)) setNavFlag(1);
			else setNavFlag(0);
			
		};

		if(currentRecord) {
			currentRecord.setSelected(true, true);
			setDetails(currentRecord.data);
		};
		setGridNavigationCount({
			startPage: currentRecord ? (currentRecord?.rowIndex + 1)  : rowIndex + 1,
			endPage: totalCount
		});
	};
	return <Box className={`tabbed-window-content${className ? ` ${className}` : ''}`}>
		<IQGridToolbar {...toolbar} />
		<SUIGrid
			gridRef={gridRef}
			animateRows={true}
			onRowDoubleClicked={handleGridRowDoubleClick}
			{...grid}
			isMainGrid={true}
		/>
		{openLID ? <LineItemWindow
			data={details}
			onClose={handleCloseLID}
			onNavigation={handleNavigation}
			navigationDisableFlag={navFlag}
			// appType={props?.appType}
			// iFrameId={props?.iFrameId}
			defaultTabId={defaultTabId}
			onPrevious={onPreviousNavigation}
			onNext={onNextNavigation}
			presenceProps={{
				showStreams: true,
				presenceId: (presenceProps?.presenceId && presenceProps?.presenceId + '-lid') || ''
			}}
			navigationPages={gridNavigationCount}
		/> : ''}
	</Box>;
};

export default memo(TabbedWindowContent);