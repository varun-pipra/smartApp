import React, { useState } from 'react';
import { Box, Tab, Tabs, TabProps } from '@mui/material';

import './IQTabPanel.scss';

interface IQTabProps extends TabProps {
	component: string | React.ReactElement;
};

interface IQTabPanelProps {
	id: string;
	activeIndex?: number;
	tabs: Array<IQTabProps>;
};

const IQTabPanel = ({ activeIndex, tabs, ...other }: IQTabPanelProps) => {
	const [currentIndex, setCurrentIndex] = useState(activeIndex || 0);
	let tabButtons = [], tabContents = [];

	const handleTabChange = (e: any, value: any) => {
		setCurrentIndex(value);
	};

	for (let i = 0; i < tabs.length; i++) {
		let tab = tabs[i];
		const { component, ...others } = tab;
		tabButtons.push(<Tab key={`tab-button-${i}`} className={currentIndex === i ? 'selected' : ''} {...others} />);
		tabContents.push(<Box className='iq-tabcontent' key={`tab-content-${i}`} hidden={currentIndex !== i}>{component}</Box>);
	}

	return <Box className='iq-tabpanel-root'>
		{/* <Tabs value={currentIndex} onChange={handleTabChange}>{tabButtons}</Tabs> */}
		{tabContents}
	</Box>;
};

export default IQTabPanel;