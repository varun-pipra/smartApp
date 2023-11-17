import React from 'react';
import { Box, IconButton, Tab } from '@mui/material';
import { Close } from '@mui/icons-material';

import './BMSettings.scss';

import IQTabPanel from 'components/iqtabpanel/IQTabPanel';
import General from './tabs/general/General';
import Security from './tabs/security/Security';

interface BMSettingProps {
	onClose?: () => void;
};

const tabList = [{
	label: 'General',
	component: <General />
}
// , {
// 	label: 'Security',
// 	component: <Security />
// }
];

const BMSettings = (props: BMSettingProps) => {

	return <div className='bm-settings-box'>
		<div className='bm-settings-header'>
			<IconButton
				className='bm-settings-close-btn'
				color='default'
				size='small'
				aria-label='Close Settings'
				onClick={props.onClose}
			>
				<Close sx={{ fontSize: '1rem !important' }} />
			</IconButton>
		</div>
		<div className='bm-settings-content'>
			<IQTabPanel id='bm-settings' tabs={tabList} />
		</div>
	</div>;
};

export default BMSettings;