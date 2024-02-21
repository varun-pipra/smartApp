import React, { memo } from 'react';
import { Box, Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GridOn, Refresh, TableRows } from '@mui/icons-material';
import './toolbar.scss';
// Project files and internal support import
import CSV from 'resources/images/bidManager/CSV.svg';
import BidDetails from 'resources/images/bidManager/BidDetails.svg';
import Delete from 'resources/images/bidManager/Delete.svg';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { setShowTableViewType, getTableViewType } from 'features/budgetmanager/operations/tableColumnsSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
	getServer
} from "app/common/appInfoSlice";
import { postMessage, isLocalhost } from "app/utils";

// Component definition
const ProjectTeamToolbarRightButtons = (props: any) => {
	// const { safetyTracking, ...rest } = props;
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const canShowUserGroups = (!appInfo?.isMTA && appInfo?.projectId > 0 && !appInfo?.gblConfig?.isZoneProject);
	const isFromOrgStaff = window.location.href?.includes('staff');
	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if (value !== null) {
			props.rightButtonsToggleChange(value);
		}

	};

	return <>
		<div key="spacer" style={{width: isFromOrgStaff ? 'auto' : '238px'}} className={`toolbar-item-wrapper toolbar-group-button-wrapper showusergroup-${canShowUserGroups}`} >
			<IconButton onClick={(e: any) => { props.QRCodeEvent(e) }}>
				<span className='common-icon-QR-Code icon-size' />
			</IconButton>
			{isFromOrgStaff ? null : 
				<ToggleButtonGroup
					exclusive
					value={props?.toggleValue || 'member'}
					size='small'
					onChange={handleView}
					className='toggle-wrap project-team-toggler'
					aria-label='Project Team toggle viewer'
				>
					<ToggleButton value={'member'} aria-label='Project Team' className='team-member-cls'>
						<span className='common-icon-team-member icon-size' />
					</ToggleButton>
					{canShowUserGroups && <ToggleButton value={'usergroups'} aria-label='User Groups' className='user-group-cls'>
						<span className='common-icon-no-group-available icon-size' />
					</ToggleButton>}
					{(isLocalhost || appInfo?.rtlsConnectorType == 1 || appInfo?.rtlsConnectorType == 3) && <ToggleButton value={'rtls'} aria-label='RTLS' className='rtls-tab-cls'>
						<span className='common-icon-connecting icon-size' />
					</ToggleButton>}
					{(isLocalhost || appInfo?.gblConfig?.currentProjectInfo?.safetyTracking) && <ToggleButton value={'safety'} aria-label='Safety' className='safety-tab-cls'>
						<span className='common-icon-SafetyPermit icon-size'/>
					</ToggleButton>}
				</ToggleButtonGroup>
			}
		</div>
	</>;
};

export default memo(ProjectTeamToolbarRightButtons);