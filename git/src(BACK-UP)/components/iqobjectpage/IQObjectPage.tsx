import {Box, BoxProps, Icon, Tab, Tabs} from '@mui/material';
import {memo, ReactNode, useEffect, useState} from 'react';

import './IQObjectPage.scss';

export interface IQObjectSectionProps {
	tabId: string;
	label: string | ReactNode;
	icon?: string | ReactNode;
	iconCls?: string;
	showCount?: boolean;
	count?: number;
	iconPosition?: 'top' | 'end' | 'bottom' | 'start';
	content: ReactNode;
	disabled?: boolean;
	showTabIndicator?: boolean;
	tabIndicatorContent?: ReactNode;
	showTab?: boolean;
};

interface IQObjectPageProps extends BoxProps {
	tabs: Array<IQObjectSectionProps>;
	scroll?: Function;
	onTabChange?: (value: any) => void;
	TabBarProps?: BoxProps;
	ContentBoxProps?: BoxProps;
	defaultTabId?: any;
	continuous?: boolean;
	tabPadValue?: number;
	defaultSpacing?: boolean;
};

const IQObjectPage = ({
	tabs, scroll, onTabChange, TabBarProps, ContentBoxProps, defaultTabId,
	tabPadValue = 0, continuous = true, defaultSpacing = false, ...props
}: IQObjectPageProps) => {
	const [value, setValue] = useState(defaultTabId ? formattedTabId(defaultTabId) : (tabs?.length > 0 && tabs[0].tabId));

	const handleTabClick = (tabId: any) => {
		// document.getElementById(tabId)?.scrollIntoView();
		const el: any = document.getElementById(tabId);
		const parentEl = el.parentElement;
		parentEl.scrollTo({top: el.offsetTop - parentEl.offsetTop});
		// el?.scrollIntoViewIfNeeded();
		setValue(tabId);
		onTabChange && onTabChange(tabId);
	};

	function formattedTabId(tabId: any) {
		if(tabId && tabId.includes('&')) {
			return tabId.split('&')[0];
		}
		return tabId;
	};

	useEffect(() => {
		if(defaultTabId) {
			const tabId = formattedTabId(defaultTabId);
			const el: any = document.getElementById(tabId);
			const parentEl = el.parentElement;
			parentEl.scrollTo({top: el.offsetTop - parentEl.offsetTop});
			setValue(tabId);
			// setTimeout(() => {
			// 	const el: any = document.getElementById(tabId);
			// 	// document.getElementById(tabId)?.scrollIntoView();
			// 	el?.scrollIntoViewIfNeeded();
			// });
		}
	}, [defaultTabId]);

	const scrollHandle = (event: any) => {
		const container = event.target,
			innerNodes = container.children,
			containerRect = container.getBoundingClientRect();

		scroll && scroll(event.target.scrollTop !== 0);

		for(let node of innerNodes) {
			const nodeRect = node.getBoundingClientRect();
			const originalTop = Math.floor(containerRect.top) - Math.floor(nodeRect.top) + (tabPadValue || 0);
			if((originalTop > -1 && originalTop < Math.floor(nodeRect.height))) {
				setValue(node.id);
				onTabChange && onTabChange(node.id);
			}
		}
	};

	return <Box {...props} className='iqobjectpage-main-container'>
		<Box className='iqobjectpage-tabbar-outer' {...TabBarProps}>
			<Tabs
				className='iqobjectpage-tabbar'
				value={value}
				variant='scrollable'
				scrollButtons='auto'
				allowScrollButtonsMobile
			>
				{tabs?.length && tabs?.map((tab, index) => {
					const {showTabIndicator = false, tabIndicatorContent = null, showTab = true, ...others} = tab;
					let iconProp = {};
					if(tab.iconCls) {
						iconProp = {
							icon: <Icon key={`tab-icon-${index}`} className='icon-container'>
								<span key={`tab-icon-${index}`} className={`icon-cls ${tab.iconCls} ${value === tab.tabId ? 'selected' : ''}`}></span>
							</Icon>,
							iconPosition: (tab.iconPosition || 'start')
						};
					} else if(tab.icon) {
						iconProp = {
							icon: typeof tab.icon == 'string' ? <Icon key={`tab-icon-${index}`} className='icon-container'>
								<img key={`tab-icon-image-${index}`} className={`icon-cls ${value === tab.tabId ? 'selected' : ''}`} src={tab.icon} />
							</Icon> : tab.icon,
							iconPosition: (tab.iconPosition || 'start')
						};
					}
					const showBadge = (tab.count && tab.count > 0);
					if(showTab) {
						return <Tab
							disabled={tab.disabled || false}
							disableRipple
							disableFocusRipple
							key={`tab-${index}`}
							onClick={() => handleTabClick(tab.tabId)}
							className={`iqobjectpage-tab${tab.disabled ? ' disabled' : ''}`}
							label={<span key={`tab-label-${index}`} className='label-cls'>
								{tab.label} {showBadge ? <span key={`tab-label-counter-${index}`} className='counter-cls'>{showBadge ? tab.count : ''}</span> : null}
								{showTabIndicator ?
									<>{tabIndicatorContent}</>
									: null}
							</span>}
							value={tab.tabId}
							{...iconProp}
						/>;
					}
				})}
			</Tabs>
		</Box>
		<Box className={`iqobjectpage-content-outer ${defaultSpacing ? 'default-spacing' : ''}`} onScroll={scrollHandle} {...ContentBoxProps}>
			{tabs?.length > 0 && tabs?.filter((el) => el.disabled !== true)
				?.map((tab: any, index) => {
					const {showTab = true} = tab;
					if(showTab) {
						return <div
							id={tab.tabId} key={`tab-content-${index}`}
							className='iqobjectpage-section'
							style={(!continuous ? {display: (tab.tabId === value ? 'initial' : 'none')} : {})}
						>
							{tab.content}
						</div>;
					}
				}
				)}
		</Box>
	</Box>;
};

export default memo(IQObjectPage);