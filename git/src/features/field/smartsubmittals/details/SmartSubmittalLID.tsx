import './SmartSubmittalLID.scss';
import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import IQGridLID from 'components/iqgridwindowdetail/IQGridWindowDetail';
import React, {memo, useEffect, useState} from 'react';

import { Button, TextField} from '@mui/material';
import moment from 'moment';
import SSDetails from './tabs/SSDetails';
import SSReferenceFiles from './tabs/SSReferenceFiles';
import { getSubmittalsStatus, getSubmittalsStatusLabel } from 'utilities/smartSubmittals/enums';

const SmartSubmittalLID = memo(({data, ...props}: any) => {
	const {submittalData, ssRightPanelData } = useAppSelector((state) => state.smartSubmittals);
	const [activeTab, setActiveTab] = React.useState('');
	const handleActiveTab = (value: any) => {
		setActiveTab(value);
	};
	const tabConfig = [
		{
			tabId: 'SSDetails',
			label: 'Details',
			showCount: false,
			iconCls: 'common-icon-smart-submittals',
			content: <SSDetails selectedRec={data} />
		}, {
			tabId: 'SSReferenceFiles',
			label: 'Reference Files',
			showCount: false,
			iconCls: 'common-icon-referance',
			content: <SSReferenceFiles selectedRec={data} />
		},
	];

	const lidProps = {
		title: submittalData?.submittalId ?? "",
		defaultTabId: 'SSDetails',
		headContent: {
			showCollapsed: true,
			regularContent: <HeaderContent data={submittalData}/>,
			collapsibleContent: <CollapseContent data={submittalData}/>,
		},
		tabs: tabConfig,
		footer: {
			hideNavigation : false,
			showNavigationCount : true,
			rightNode: <>
					{/* {activeTab === 'SMDetails' &&  ( */}
					{/* <IQButton
						className='ce-buttons'
						color='blue'
						disabled={true}
						// onClick={() => {submitClickEvent('authorize');}}
					>
						SAVE
					</IQButton> */}
				{/* )} */}
			</>,
			leftNode: <></>
		}
	};

	return (
		<div className='submittals-lineitem-detail'>
			<IQGridLID {...lidProps} {...props} handleActiveTab={handleActiveTab}/>
		</div>
	);
});

const HeaderContent = memo((props: any) => {
	const {data, ...rest} = props;
    const status = data?.status;
          const buttonStyle = {
            backgroundColor: getSubmittalsStatus(status),
            color: "#000",
          };

	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				<span className='budgetid-label grey-font'>Status:</span>
				<span className='budgetid-label grey-fontt'>
                <Button style={buttonStyle}>
                {getSubmittalsStatusLabel(status)}
              </Button>
                </span>
				<span className='last-modified-label grey-font'>Last Modified:</span>
				<span className='budgetid-label grey-fontt'>{`${moment(data?.modifiedOn).format('MM/DD/YYYY hh:mm A')} by`}{" "}{`${data?.modifiedBy?.lastName}, ${data?.modifiedBy?.firstName}`}</span>
			</div>
		</div>
	</div>;
});

const CollapseContent = memo((props: any) => {
	const {data, ...rest} = props;
	  const status = data?.status;
	  const buttonStyle = {
		backgroundColor: getSubmittalsStatus(status),
		color: "#000",
	  };
	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				<span className='budgetid-label grey-font'>Status:</span>
				<span className='status-pill'>
				<Button style={buttonStyle}>
                {getSubmittalsStatusLabel(status)}
              </Button>
				</span>
			</div>
			<span className='kpi-right-container'>
				<span className='kpi-name' >Last Modified:</span>
				<span className='budgetid-label grey-fontt' style={{marginTop:'4px'}}>{`${moment(data?.modifiedOn).format('MM/DD/YYYY hh:mm A')} by`}{" "}{`${data?.modifiedBy?.lastName}, ${data?.modifiedBy?.firstName}`}</span>
			</span>
		</div>
	</div>;
});

export default SmartSubmittalLID;