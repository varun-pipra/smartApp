import {memo, useEffect} from 'react';
import {hideLoadMask} from 'app/hooks';
import BaseWindow from 'components/iqbasewindow/IQBaseWindow';
import {IQBaseWindowProps} from 'components/iqbasewindow/IQBaseWindowTypes';
import IQObjectPage, {IQObjectSectionProps} from 'components/iqobjectpage/IQObjectPage';

import './IQTabbedWindow.scss';

type IQTabbedWindowProps = IQBaseWindowProps & {
	tabs: Array<IQObjectSectionProps>;
	onTabChange?: any;
};

const IQTabbedWindow = memo(({
	className, tabs, presenceProps, onTabChange, ...props
}: IQTabbedWindowProps) => {

	useEffect(() => {
		hideLoadMask();
	}, []);

	return <BaseWindow
		className={`iq-tabbedwindow${className ? ` ${className}` : ''}`}
		presenceProps={presenceProps}
		{...props}
	>
		<IQObjectPage
			continuous={false}
			tabs={tabs}
			onTabChange={onTabChange}
		/>
	</BaseWindow>;
});

export default IQTabbedWindow;