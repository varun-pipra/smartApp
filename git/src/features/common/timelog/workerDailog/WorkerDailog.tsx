
import './WorkerDailog.scss'
import { useMemo, useState } from "react";
import { useAppSelector } from "app/hooks";
import TabbedWindow from '../../../../components/iqtabbedwindow/IQTabbedWindow';
import WorkersGrid from './WorkerGrid';

const WorkerDailog = (props: any) => {
    const { open=false, ...rest } = props;
	const [isFullView, setIsFullView] = useState(false);
	const [isMaxByDefault, setMaxByDefault] = useState(false);
	const [isInline, setInline] = useState(false);

	const tabList = useMemo(() => [{
		tabId: 'my-company',
		label: 'My Company',
		showCount: true,
		iconCls: 'common-icon-spec-manager',
		content: <WorkersGrid />
	}], []);

	return (
		<TabbedWindow
		open={open}
		tabs={tabList}
		title='Select Resources'
		className='smart-submittals-window'
		iconCls='common-icon-smart-submittals'
		appType='TimeLog'
		iFrameId='timeLog'
		zIndex={100}
		onClose={props.closeWorkersDlg}
		moduleColor='#379000'
		inlineModule={isInline}
		withInModule={true}
		isFullView={isFullView}
		maxByDefault={isMaxByDefault}
		// onIconClick={handleIconClick}
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
			// openInNewTab: true,	
		}}
		PaperProps={{
			sx:  {
				width: '85%',
				height: '80%'
			}
		}}
		// onTabChange={(e:any) => onTabChange(e)}
	/>
	);
}

export default WorkerDailog;