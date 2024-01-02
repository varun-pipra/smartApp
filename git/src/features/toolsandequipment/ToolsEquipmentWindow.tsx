import IconButton from '@mui/material/IconButton';
import {HeadsetMic} from '@mui/icons-material';
import {useAppSelector, useAppDispatch, hideLoadMask} from 'app/hooks';

import './ToolsEquipmentWindow.scss';

import {postMessage} from 'app/utils';
import CatalogList from './catalog/CatalogList';
import InverntoryContainer from './inventory/InventoryContainer';
import SmartDialog from 'components/smartdialog/SmartDialog';
import Menu from 'components/buttonmenu/ButtonMenu';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import {ToolsAndEquipmentPageTypes, getPageType, setPageType} from './operations/catalogSlice';
import {useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';

const handleHelp = () => {
	postMessage({
		event: "help",
		body: {iframeId: "toolsAndEquipment"},
	});
};

const optionalTools = [
	<IQTooltip title="Help" placement={'bottom'}>
		<IconButton key={'freshdesk-tool'} aria-label="Help" onClick={handleHelp}>
			<HeadsetMic />
		</IconButton>
	</IQTooltip>
];

const ToolsEquipmentWindow = (props: any) => {
	const pageType = useAppSelector(getPageType);
	const dispatch = useAppDispatch();

	const [isFullView, setIsFullView] = useState(false);
	const location = useLocation();

	const titleEl = <>Tools and Equipment &nbsp;&nbsp;&nbsp;<Menu
		width={'10rem'}
		value={pageType}
		options={getMenuOptions()}
		onChange={(selectedType: ToolsAndEquipmentPageTypes) => dispatch(setPageType(selectedType))} />
	</>;

	useEffect(() => {
		hideLoadMask();
	}, []);

	useEffect(() => {
		const pathName = location.pathname;
		if(pathName.includes('home')) {
			setIsFullView(true);
		}
	}, [location]);

	return <SmartDialog
		className="ToolsEquipment"
		open={true}
		PaperProps={{
			sx: {height: '80%', width: '90%'}
		}}
		custom={{
			closable: true,
			resizable: true,
			title: titleEl,
			tools: [optionalTools]
		}}
		onClose={() => {
			postMessage({event: 'closeiframe', body: {iframeId: 'toolsAndEquipment'}});
		}}
		isFullView={isFullView}
	>
		{pageType === 'catalog' ? <CatalogList /> : <InverntoryContainer />}
	</SmartDialog >;
};

const getMenuOptions = () => {
	return [{
		text: 'Catalog',
		value: 'catalog'
	}, {
		text: 'Inventory',
		value: 'inventory'
	}];
};

export default ToolsEquipmentWindow;