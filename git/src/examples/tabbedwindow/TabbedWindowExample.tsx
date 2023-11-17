import {memo, useMemo} from 'react';

import TabbedWindow from 'components/iqtabbedwindow/IQTabbedWindow';
import SpecTab from './SpecTab';
import SubmittalTab from './SubmittalTab';
import {useLocation} from 'react-router-dom';

const TabbedWindowExample = () => {
	const location = useLocation();
	const queryParams: any = new URLSearchParams(location.search);
	const presenceMap = useMemo(() => {
		return {
			presenceId: 'smart-submittals-presence',
			showLiveSupport: true,
			showLiveLink: true,
			showStreams: true,
			showComments: true,
			showChat: false,
			hideProfile: false,
		};
	}, []);

	const tabList = useMemo(() => [{
		tabId: 'specs',
		label: 'Specs',
		showCount: true,
		iconCls: 'common-icon-spec-manager',
		content: <SpecTab />
	}, {
		tabId: 'submittals',
		label: 'Submittals',
		showCount: false,
		iconCls: 'common-icon-smart-submittals',
		content: <SubmittalTab />
	}], []);

	const maxSize = queryParams?.size > 0 && (queryParams?.get('maximizeByDefault') === 'true' || queryParams?.get('inlineModule') === 'true');

	return <TabbedWindow
		open={true}
		tabs={tabList}
		title='Smart Submittals'
		className='smart-submittals-window'
		iconCls='common-icon-smart-submittals'
		appType='SmartSubmittals'
		iFrameId='smartSubmittalsIframe'
		zIndex={100}
		// onClose={handleClose}
		moduleColor='#379000'
		// inlineModule={isInline}
		// isFullView={isFullView}
		// maxByDefault={isMaxByDefault}
		// onIconClick={handleIconClick}
		// centerPiece={(showSpecCenterPiece && mainWindowActiveTab === 'specs') && 'You have Unpublished specs  from the previous session, click Extract Spec AI button to resume.'}
		presenceProps={presenceMap}
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
	/>;
};

export default memo(TabbedWindowExample);