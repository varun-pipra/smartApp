import './ChangeEventDetails.scss';
import React from 'react';
import SUINote from 'sui-components/Note/Note';
import {formatPhoneNumber} from 'utilities/commonFunctions';

import {
	FormControlLabel, InputLabel, Radio, RadioGroup, Alert
} from '@mui/material';
import {useAppDispatch, useAppSelector, useHotLink} from 'app/hooks';
import {updateChangeEventDetails} from 'features/finance/changeeventrequests/stores/ChangeEventAPI';
import {setChangeRequestDetails} from 'features/finance/changeeventrequests/stores/ChangeEventSlice';
import {isChangeEventClient, isChangeEventSC} from 'app/common/userLoginUtils';


const ChangeEventsDetails = (props: any) => {
	const dispatch = useAppDispatch();
	const {currencySymbol, server} = useAppSelector((state) => state.appInfo);
	const {currentChangeEventId, changeRequestDetails} = useAppSelector(state => state.changeEventRequest);
	const [fundingCheckbox, setFundingCheckbox] = React.useState('ChangeOrder');
	const [showChangeEventToastMsg, setShowChangeEventToastMsg] = React.useState<boolean>(false);
	const isReadOnly = isChangeEventClient() || isChangeEventSC() ? true : !['Draft', 'SentBackForRevision', 'Revise', 'Rejected']?.includes(changeRequestDetails?.status);

	React.useEffect(() => {
		console.log("changeRequestDetails?.fundingSource", changeRequestDetails?.fundingSource, changeRequestDetails);
		changeRequestDetails?.fundingSource && setFundingCheckbox(changeRequestDetails?.fundingSource);
	}, [changeRequestDetails?.fundingSource]);

	const handleOnDetailsChange = (key: string, value: any) => {
		updateChangeEventDetails(currentChangeEventId, {[key]: value}, (response: any) => {dispatch(setChangeRequestDetails(response));});
	};
	const GetRadioValue = (val: any) => {
		if(val === "ChangeOrder") return "Change Order";
		else if(val === "Contingency") return "Contingency";
		else if(val === "GeneralContractor") return "General Contractor";
	};
	return (
		<div className='event-details'>
			<div className='eventrequest-details-box'>
				<div className='eventrequest-details-header'>
					<div className='title-action'>
						<span className='common-icon-change-event-details iconmodify'></span>
						<span className='title' style={{marginLeft: '6px'}}>Change Event Details</span>
					</div>
				</div>
				<div className='eventrequest-details-content'>
					<span className='eventrequest-info-tile'>
						<div className='eventrequest-info-label'>Contract Name</div>
						<div className='eventrequest-info-data-box'>
							<span className="common-icon-contract-details iconmodify"></span>
							<span className='eventrequest-info-data'
								onClick={() => window.open(useHotLink(`client-contracts/home?id=${changeRequestDetails?.clientContract?.id}`), '_blank')}
								style={{color: '#059CDF'}}>{changeRequestDetails?.clientContract?.title ? changeRequestDetails?.clientContract?.title : ''}</span>
						</div>
					</span>
					<span className='eventrequest-info-tile'>
						<div className='eventrequest-info-label'>Company Name</div>
						<div className='eventrequest-info-data-box'>
							<span className="common-icon-companies"></span>
							<>
								<span className="contract-info-company-icon">
									<img src={changeRequestDetails?.clientContract?.client?.image?.downloadUrl} style={{height: '28px', width: '28px', borderRadius: "50%"}} />
								</span>
							</>
							<span className='eventrequest-info-data'>
								{changeRequestDetails?.clientContract?.client?.name ? changeRequestDetails?.clientContract?.client?.name : ''}
							</span>
						</div>
					</span>
				</div>
				<div className='eventrequest-details-header'>
					<div className='title-action'>
						<span className='title'>Client Company Point of Contact</span>
					</div>
				</div>
				<div className='eventrequest-details-content'>
					<span className='eventrequest-info-tile'>
						<div className='eventrequest-info-label'>Name</div>
						{changeRequestDetails?.clientContract?.client?.pointOfContacts?.map((row: any) => (
							<div className='eventrequest-info-data-box'>
								<span className="common-icon-name"></span>
								{row?.image?.downloadUrl && (
									<>
										<span className="contract-info-company-icon">
											<img src={row?.image?.downloadUrl} style={{height: '100%', width: '100%', borderRadius: "50%"}} />
										</span>
									</>
								)
								}
								<span className='client-contract-info-data'>{row?.name}</span>
							</div>
						))}
						{/* <div className='eventrequest-info-data-box'>
							<span className="common-icon-name"></span>
							<>
								<span className="contract-info-company-icon">
									<img src='' style={{ height: '100%', width: '100%', borderRadius: "50%" }} />
								</span>
							</>
							<span className='eventrequest-info-data'>Philp Parker</span>
						</div> */}
					</span>

					<span className='eventrequest-info-tile'>
						<div className='eventrequest-info-label'>Email</div>
						{changeRequestDetails?.clientContract?.client?.pointOfContacts?.map((row: any) => (
							<div className='eventrequest-info-data-box'>
								<span className="common-icon-email-message"></span>
								<span className='client-contract-info-data'>{row?.email}</span>
							</div>
						))}
						{/* <div className='eventrequest-info-data-box'>
							<span className="common-icon-email-message"></span>
							<span className='contract-info-data'>philp@gmail.com</span>
						</div> */}
					</span>

					<span className='eventrequest-info-tile'>
						<div className='eventrequest-info-label'>Phone Number</div>
						{changeRequestDetails?.clientContract?.client?.pointOfContacts?.map((row: any) => (
							<div className='eventrequest-info-data-box'>
								<span className="common-icon-telephone-gray"></span>
								<span className='contract-info-data'>{formatPhoneNumber(row?.phone)}</span>
							</div>
						))}
						{/* <div className='eventrequest-info-data-box'>
							<span className="common-icon-telephone-gray"></span>
							<span className='contract-info-data'>{formatPhoneNumber('1234456788')}</span>
						</div> */}
					</span>
				</div>
			</div>
			<div className='description'>
				<InputLabel className="inputlabel" style={{textAlign: "left"}}>
					<span className="common-icon-adminNote"></span>
					Detailed Description for Change Event Request
				</InputLabel>
				{!isReadOnly ? (
					<SUINote
						notes={changeRequestDetails?.description}
						onNotesChange={(value: any) => {handleOnDetailsChange("description", value);}}
					/>
				) : (
					<span
						dangerouslySetInnerHTML={{
							__html: changeRequestDetails?.description
						}}
						className='eventrequest-info-data'></span>
				)}
			</div>
			<div className='findingsource'>
				<span className='title'>Funding Source</span>
				{!isReadOnly ? (
					<RadioGroup row name="findingsource-buttons-group"
						value={fundingCheckbox}
						onChange={(e) => {setFundingCheckbox(e.target.value); handleOnDetailsChange("fundingSource", e.target.value);}}
					>
						<FormControlLabel value={"ChangeOrder"} disabled={changeRequestDetails?.status == 'Rejected'} control={<Radio />} label="Change Order" />
						<FormControlLabel value={"Contingency"} control={<Radio />} label="Contingency" />
						<FormControlLabel value={"GeneralContractor"} control={<Radio />} label="General Contractor" />
					</RadioGroup>
				) : (
					<div className='eventrequest-info-data' style={{marginTop: '10px'}}>{GetRadioValue(fundingCheckbox)}</div>
				)}
			</div>
			{showChangeEventToastMsg && <Alert
				severity='success'
				className='ec-floating-toast-cls'
				sx={{background: 'red'}}
			>
				<span className='ec-toast-text-cls'>
					<b>1</b> The Change Event updated has been notified to the General Contractor
				</span>
				<span className='ec-toast-text-cls'>
					<b>2</b> Budget has been updated due to the approval of the change Event
				</span>
			</Alert>}
		</div>
	);
};

export default ChangeEventsDetails;