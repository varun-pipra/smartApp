import React, { useEffect } from 'react';
import {memo, useMemo, useState} from 'react';

import TabbedWindow from '../../../components/iqtabbedwindow/IQTabbedWindow';
import {useLocation} from 'react-router-dom';
import SpecificationManagerTab from '../specificationmanager/SpecificationManagerTab';
import SmartSubmittalsTab from './SmartSubmittalsTab';
import { useAppSelector, useHomeNavigation } from "app/hooks";
const SmartSubmittalTabbedWindow = () => {
	const location = useLocation();
	const queryParams: any = new URLSearchParams(location.search);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
  	const [isInline, setInline] = useState(false);
  	const [isFullView, setFullView] = useState(false);
	const { server } = useAppSelector((state) => state.appInfo);
	const [activeTab, setActiveTab] = useState('specs');
	
	useEffect(() => {
		const { search } = location;
		if (search) {
		  const params: any = new URLSearchParams(search);
		  setMaxByDefault(params?.get("maximizeByDefault") === "true");
		  setInline(params?.get("inlineModule") === "true");
		  setFullView(params?.get("inlineModule") === "true");
		}
	  }, [location]);
	const tabList = useMemo(() => [
		{
		tabId: 'specs',
		label: 'Specs',
		showCount: true,
		iconCls: 'common-icon-spec-manager',
		content: <SpecificationManagerTab activeTab={activeTab}/>
	}, {
		tabId: 'submittals',
		label: 'Submittals',
		showCount: false,
		iconCls: 'common-icon-smart-submittals',
		content: <SmartSubmittalsTab activeTab={activeTab}/>
	},{
		tabId: "submittalPackage",
		label: "Submittal Package",
		showCount: true,
		iconCls: "common-icon-package",
		content: <>Submittal Package</>,
	}], [activeTab]);

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');
	const handleClose = () => {
		postMessage({
		  event: "closeiframe",
		  body: {
			iframeId: "specManagerIframe",
			roomId: server && server.presenceRoomId,
			appType: "SpecManager",
		  },
		});
	  };
	  const handleIconClick = () => {
		if (isInline) useHomeNavigation("specManagerIframe", "SpecManager");
	  };
	  const onTabChange= (e:any) => {
		setActiveTab(e);
	  };
	return <TabbedWindow
		open={true}
		tabs={tabList}
		title='Smart Submittals'
		className='smart-submittals-window'
		iconCls='common-icon-smart-submittals'
		appType='SmartSubmittals'
		iFrameId='smartSubmittalsIframe'
		zIndex={100}
		onClose={handleClose}
		moduleColor='#379000'
		inlineModule={isInline}
		isFullView={isFullView}
		maxByDefault={isMaxByDefault}
		onIconClick={handleIconClick}
		presenceProps={{
			presenceId: 'smart-submittals-presence',
			showLiveSupport: true,
			showLiveLink: true,
			showStreams: true,
			showComments: true,
			showChat: false,
			hideProfile: false,
		}}
		tools={{
			closable: true,
			resizable: true,
			openInNewTab: true,
		}}
		PaperProps={{
			sx: maxSize ? {
				height: '100%',
				minWidth: '100vw',
				minHeight: '100vh',
				borderRadius: 0
			} : {
				width: '95%',
				height: '90%'
			}
		}}
		onTabChange={(e:any) => onTabChange(e)}
	/>;
};

export default memo(SmartSubmittalTabbedWindow);