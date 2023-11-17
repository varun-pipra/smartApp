import React, {memo, useState, useEffect} from 'react';
import _ from 'lodash';
import {Box, BoxProps, IconButton} from '@mui/material';

import './DynamicPage.scss';

// Image imports
import Pinned from 'resources/images/common/Pinned.svg';
import UnPinned from 'resources/images/common/UnPinned.svg';
import Collapse from 'resources/images/common/UpArrow.svg';
import Expand from 'resources/images/common/DownArrow.svg';

// Project files and internal support import
import IQTooltip from 'components/iqtooltip/IQTooltip';

export interface IQDynamicPropsHeadContentProps {
	collapsibleContent?: React.ReactNode;
	regularContent?: React.ReactNode;
	};

export interface DynamicPageProps extends BoxProps {
	pinned?: boolean;
	showPinned?: boolean;
	collapsed?: boolean;
	showCollapsed?: boolean;
	headContent?: IQDynamicPropsHeadContentProps;
	bodyContent?: React.ReactNode;
	onPinClick?: any;
};

// Component definition
const DynamicPage = ({pinned, showPinned, collapsed, showCollapsed, headContent, bodyContent, onPinClick, className, ...boxProps}: DynamicPageProps) => {
	// Local variable declaration
	const [isHeadEmpty, setHeadEmpty] = useState(false);
	// Default props to be applied to the base window
	const defaultProps = {
		pinned: false,
		showPinned: true,
		collapsed: false,
		showCollapsed: true
	};

	// State declaration
	const [mergedProps, setMergedProps] = useState<any>({});
	const [isPinned, setPinned] = useState(pinned);
	const [isCollapsed, setCollapsed] = useState(collapsed);

	// Effect definitions
	useEffect(() => {
		const merged = _.merge(defaultProps, {pinned, showPinned, collapsed, showCollapsed, headContent, bodyContent});
		setMergedProps(merged);
		setHeadEmpty(_.isEmpty(headContent));
	}, [pinned, showPinned, collapsed, showCollapsed, headContent, bodyContent]);

	// Handler definitions
	const handlePinning = () => {
		setPinned(prev => !prev);
	};

	useEffect(() => {if(onPinClick) onPinClick(isPinned);}, [isPinned]);
	useEffect(() => {setCollapsed(collapsed);}, [collapsed]);

	const handleCollapse = () => {
		setCollapsed(prev => !prev);
	};

	return <Box className={`dynamic-page${className ? ` ${className}` : ''}`} {...boxProps}>
      {!isHeadEmpty ? <div className='dynamic-page-head'>
          <div className='head-content-box'>
            {/* <div className={`head-collapsible-content${isCollapsed === true ? ' collapsed' : ''}`}>
					{headContent?.collapsibleContent || ''}
				</div>
				<div className='head-non-collapsible-content'>
					{headContent?.regularContent || ''}
				</div> */}
            {isCollapsed === true ? <div className='head-content'>
                {headContent?.collapsibleContent || ''}
              </div> : <div className='head-content'>
                {headContent?.regularContent || ''}
              </div>}
          </div>
          <div className='head-control-box'>
            {mergedProps?.showCollapsed === true ? <IconButton className={`header-button`} aria-label={isCollapsed === true ? 'Expand' : 'Collapse'} onClick={handleCollapse}>
                <img src={isCollapsed === true ? Expand : Collapse} />
              </IconButton> : ''}
            {(mergedProps?.showPinned === true && !isCollapsed) ? <IconButton className={`header-button ${isPinned === true ? 'btn-focused' : ''}`} aria-label={isPinned === true ? 'Pinned' : 'Not Pinned'} onClick={handlePinning}>
                <img src={isPinned === true ? Pinned : UnPinned} />
              </IconButton> : ''}
        </div>
      </div> : ''}
      <div className='dynamic-page-body'>
        {<div className="dynamic-loading-container">
            <div className="dynamic-loading-indicator"></div>
          </div>}
        {bodyContent || ''}
      </div>
    </Box>;
};

export default memo(DynamicPage);