import './SpecficationManagerLID.scss';

import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import IQGridLID from 'components/iqgridwindowdetail/IQGridWindowDetail';
import React, {memo, useEffect, useState} from 'react';

import {TextField} from '@mui/material';
import SMDetails from './tabs/SMdetail/SMDetails';
import SMReferenceFiles from './tabs/SMReferencefiles/SMReferencefiles';
import moment from 'moment';
import {getSMList, setChangedSMDetailsValue, setEnableSaveButton} from '../stores/SpecificationManagerSlice';
import {publishMultipleSpecSection} from '../stores/SpecificationManagerAPI';

const conformationdata = [
	{
		id: 1,
		workitem: '0001-01-General Requirement-00020-Advertising / Public Relations - L-Labor',
		contractamount: 74000,
		eventAmount: 16000,
		revisedamount: 90000
	},
	{
		id: 2,
		workitem: '0002-01-General Requirement-00030 - Attorney - OC - Owner Cost',
		contractamount: 42000,
		eventAmount: 18000,
		revisedamount: 60000
	}
];

const SpecificationManagerLID = memo(({data, ...props}: any) => {
	const [activeTab, setActiveTab] = React.useState('');
	const dispatch = useAppDispatch();
	const {server} = useAppSelector(state => state.appInfo);
	const appInfo = useAppSelector(getServer);
	const {currentChangeEventId, changeRequestDetails} = useAppSelector(state => state.changeEventRequest);
	const [openModel, setOpenModel] = useState<boolean>(false);
	const [contractDialog, setContractDialog] = React.useState<any>({show: false, disable: false});
	const {rightPanelData, smEnableButton, changedSMDetailsValue} = useAppSelector((state) => state.specificationManager);
	const [modelData, setModelData] = useState<any>({
		label: '',
		modelWidth: '',
		modelHeight: '',
		buttonLabel: '',
		formType: '',
		checkBoxUserName: '',
		checkboxdesc: '',
		gridData: [],
		description: false,
		descriptionlabel: '',
		signatureLabel: '',
		defaultSignature: '',
		signatureHeight: ''
	});

	const {selectedRecsData} = useAppSelector((state) => state.specificationManager);
	const handleActiveTab = (value: any) => {
		setActiveTab(value);
	};

	const tabConfig = [
		{
			tabId: 'SMDetails',
			label: 'Details',
			showCount: false,
			iconCls: 'common-icon-smart-submittals',
			content: <SMDetails selectedRec={data} />
		}, {
			tabId: 'SMReferenceFiles',
			label: 'Reference Files',
			showCount: false,
			iconCls: 'common-icon-referance',
			content: <SMReferenceFiles selectedRec={data} />
		},
		//  {
		// 	tabId: 'SMlinks',
		// 	label: 'Links',
		// 	showCount: false,
		// 	iconCls: 'common-icon-Links',
		// 	disabled: false,
		// 	content: <SMLinks />
		// }
	];
	const handleSave = () => {
		publishMultipleSpecSection(changedSMDetailsValue)
			.then((res: any) => {
				if(res) {
					dispatch(getSMList());
					dispatch(setEnableSaveButton(false));
					dispatch(setChangedSMDetailsValue({}));
				}
			})
			.catch((err: any) => {
				console.log("error", err);
				dispatch(setEnableSaveButton(false));
				dispatch(setChangedSMDetailsValue({}));
			});
	};
	const lidProps = {
		title: <TextField className='textField' variant='outlined' value={data?.title} size='small' margin='normal' style={{width: '40%'}} />,
		defaultTabId: 'SMDetails',
		defaultSpacing: true,
		headContent: {
			showCollapsed: true,
			regularContent: <HeaderContent data={rightPanelData ?? data} />,
			collapsibleContent: <CollapseContent />
		},
		tabs: tabConfig,
		footer: {
			hideNavigation: true,
			rightNode: <>
				{/* {activeTab === 'SMDetails' &&  ( */}
				<IQButton
					className='ce-buttons'
					color='blue'
					disabled={!smEnableButton}
					onClick={() => handleSave()}
				>
					SAVE
				</IQButton>
				{/* )} */}
			</>,
			leftNode: <></>
		}
	};

	return (
		<div className='change-event-lineitem-detail'>
			<IQGridLID {...lidProps} {...props} handleActiveTab={handleActiveTab} />
		</div>
	);
});

const HeaderContent = memo((props: any) => {
	const {data, ...rest} = props;
	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				<span className='budgetid-label grey-font'>Spec Section name:</span>
				<span className='budgetid-label grey-fontt'>{`${data?.number} - ${data?.title}`}</span>
				<span className='last-modified-label grey-font'>Last Modified:</span>
				<span className='budgetid-label grey-fontt'>{`${moment(data?.modifiedOn).format('MM/DD/YYYY hh:mm A')} by`}{" "}{`${data?.modifiedBy?.lastName}, ${data?.modifiedBy?.firstName}`}</span>
			</div>
		</div>
	</div>;
});

const CollapseContent = memo((props: any) => {
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const {changeRequestDetails} = useAppSelector(state => state.changeEventRequest);

	const [stateObject, setStateObject] = useState<any>({});

	// useEffect(() => {
	// 	const state = stateMap[changeRequestDetails.status];
	// 	setStateObject(state);
	// }, [changeRequestDetails.status]);

	return <div className='kpi-section'>
		<div className='kpi-vertical-container'>
			<div className='lid-details-container'>
				<span className='budgetid-label grey-font'>Status:</span>
				<span className='status-pill' style={{backgroundColor: stateObject?.lightColor, color: stateObject?.bgColor}}>
					<span className={`status ${stateObject?.icon}`}></span>{stateObject?.text}
				</span>
			</div>
			<span className='kpi-right-container'>
				<span className='kpi-name' >Estimated Change Event Amount  <span className='bold'>{currencySymbol}</span></span>
				<span className='amount' style={{backgroundColor: '#c9e59f'}}>{changeRequestDetails?.estimatedChangeEventAmount?.toLocaleString('en-US')}</span>
			</span>
		</div>
	</div>;
});

export default SpecificationManagerLID;