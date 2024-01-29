import { Box, IconButton, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';
// Project files and internal support import
import CSV from 'resources/images/bidManager/CSV.svg';
import BidDetails from 'resources/images/bidManager/BidDetails.svg';
//import Delete from 'resources/images/bidManager/Delete.svg';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getClientPayAppsList } from 'features/clientpayapplications/stores/GridSlice';
import PaymentDetailsForm from 'features/vendorpayapplications/vendorpayapplicationscontent/paymentdetailsform/PaymentDetailsForm';
import PaymentReceivedForm from 'features/vendorpayapplications/vendorpayapplicationscontent/paymentreceivedForm/PaymentReceivedForm';
import SUIAlert from 'sui-components/Alert/Alert';
import { isUserGCForCPA } from 'features/clientpayapplications/utils';
import { deletePayApp } from 'features/clientpayapplications/stores/GridAPI';
import { getServer } from 'app/common/appInfoSlice';
import { paymentReceived, paymentSent } from 'features/clientpayapplications/stores/ButtonAPI';
import { getClientPayAppDetailsById, setRefreshed, setSelectedRecord } from 'features/clientpayapplications/stores/ClientPayAppsSlice';
import { setToastMessage } from 'features/clientpayapplications/stores/ClientPayAppsSlice';
import { getAttachments as getSentAttachments } from 'features/vendorpayapplications/stores/payment/PayAppPaymentSentSlice';
import { getAttachments as getReceivedAttachments } from 'features/vendorpayapplications/stores/payment/PayAppPaymentReceivedSlice';
import { getClientCompanies } from 'features/clientContracts/stores/ClientContractsSlice';
import { postMessage } from 'app/utils';

// Component definition
const ClientPayAppToolbarLeftButtons = () => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { selectedRows } = useAppSelector((state) => state.clientPayAppsGrid);
	const { selectedRecord } = useAppSelector((state) => state.clientPayApps);
	const [disableDelete, setDisableDelete] = React.useState<boolean>(true);
	const [disablePrint, setDisablePrint] = React.useState<boolean>(true);
	const [disablePaymentSent, setDisablePaymentSent] = React.useState<boolean>(true);
	const [disablePaymentReceive, setDisablePaymentReceive] = React.useState<boolean>(true);
	const [paymentSentClick, setPaymentSentClick] = React.useState<boolean>(false);
	const [paymentReceiveClick, setPaymentReceiveClick] = React.useState<boolean>(false);
	const sentAttachments = useAppSelector(getSentAttachments);
	const receivedAttachments = useAppSelector(getReceivedAttachments);
	const [paymentSentData, setPaymentSentData] = React.useState<any>({});
	const [warningMessage, setWarningMessage] = React.useState<boolean>(false);
	const [alert, setAlert] = React.useState<boolean>(false)

	React.useEffect(() => {
		selectedRows.length > 0 ? setDisableDelete(false) : setDisableDelete(true);
		selectedRows.length > 0 ? setDisablePrint(false) : setDisablePrint(true);
		selectedRows.length > 0 && selectedRows[0]?.status == 'PaymentAuthorized' ? setDisablePaymentSent(false) : setDisablePaymentSent(true);
		selectedRows.length > 0 && selectedRows[0]?.status == 'PaymentSent' ? setDisablePaymentReceive(false) : setDisablePaymentReceive(true)
	}, [selectedRows])

	const handleListChanges = (val: string) => {
		if (val == 'yes') {
			const selectedRowIds = selectedRows?.map((row: any) => row.id);

			// console.log('selectedRows', selectedRows);
			deletePayApp(appInfo, selectedRowIds[0], (response: any) => {
				dispatch(getClientPayAppsList(appInfo));
				dispatch(setToastMessage('Selected Record Deleted Successfully'));
			});
			setDisableDelete(true);
			setAlert(false);
		}
		else {
			setAlert(false);
		}
	};

	const handlePaymentSent = (data: any) => {
		//console.log('handlePaymentSent data', data, selectedRows)
		const sentDate = new Date(data?.sentOn);
		const sentDateISO: any = sentDate?.toISOString();
		const payload = {
			'notes': data?.notes,
			'sentOn': sentDateISO,
			'amount': data?.amount,
			'invoiceNumber': data?.invoiceNumber,
			'modeOfPayment': data?.modeOfPayment[0],
			'attachments': sentAttachments
		}
		paymentSent(appInfo, payload, selectedRows[0]?.id, (response: any) => {
			dispatch(setSelectedRecord(response));
			dispatch(getClientPayAppsList(appInfo));
			setDisablePaymentSent(true)
			setPaymentSentClick(false)
			dispatch(setToastMessage('Updated Payment Status Successfully'));
		});
	};

	const handlePaymentRecive = (data: any) => {
		console.log('ddd', data)
		const receivedDate = new Date(data?.receivedOn);
		const receivedDateISO: any = receivedDate?.toISOString();
		const payload = {
			'notes': data?.notes,
			'receivedOn': receivedDateISO,
			'amount': data?.amount,
			'attachments': receivedAttachments
		};

		paymentReceived(appInfo, payload, selectedRows[0]?.id, (response: any) => {
			dispatch(setSelectedRecord(response));
			dispatch(getClientPayAppsList(appInfo));
			setDisablePaymentReceive(true);
			setPaymentReceiveClick(false)
			dispatch(setToastMessage('Updated Payment Status Successfully'));
		});
	};

	const getData = (obj: any) => {
		let data = { ...obj }
		dispatch(getClientPayAppDetailsById({ appInfo: appInfo, id: obj?.id })).then((resp: any) => {
			data = resp
		});
		return data;
	}
	const deleteMethod = () => {

		const userType = isUserGCForCPA(appInfo);
		const otherStatus = ['AutoGeneratedWaitingForBothParties', 'Rejected', 'AwaitingAcceptance', 'SubmittedWaitingForOtherParty', 'PaymentAuthorized'].includes(selectedRows[0]?.status);
		const sentReceivedStatus = ['PaymentSent', 'PaymentReceived'].includes(selectedRows[0]?.status);

		if (userType == true && sentReceivedStatus == true) {///Vendor Pay Manager
			setAlert(true);
			setWarningMessage(true);
		}
		else if (userType == false && (sentReceivedStatus == true || otherStatus == true)) {///Sub Contract Pay Manager
			setAlert(true);
			setWarningMessage(true);
		}
		else {
			setAlert(true);
			setWarningMessage(false);
		}
	}
	const PrintOnclick = (event: any) => {
		postMessage({
			event: 'openitemlevelreport',
			body: {
				targetLocation: {
					x: event.pageX,
					y: event.pageY
				}
			}
		});
	};

	return <>
		<IQTooltip title='Refresh' placement='bottom'>
			<IconButton
				aria-label='Refresh Vendor Pay Apps List'
				onClick={() => {
					dispatch(getClientPayAppsList(appInfo));
					isUserGCForCPA(appInfo) && dispatch(getClientCompanies(appInfo));
					dispatch(setRefreshed(true))
				}}
			>
				<span className="common-icon-refresh"></span>
			</IconButton>
		</IQTooltip>
		{/* <IQTooltip title='Export CSV' placement='bottom'>
			<IconButton>
				<span className='common-icon-Export'/>
			</IconButton>
		</IQTooltip> */}
		<IQTooltip title='Print' placement='bottom'>
			<IconButton disabled={disablePrint} onClick={(e: any) => { PrintOnclick(e) }}>
				<span className='common-icon-print' />
			</IconButton>
		</IQTooltip>
		<IQTooltip title='Delete' placement='bottom'>
			<IconButton aria-label='Delete Bid response Line Item'
				disabled={disableDelete}
				onClick={() => deleteMethod()}
			>
				<span className='common-icon-delete'></span>
			</IconButton>
		</IQTooltip>

		{!isUserGCForCPA(appInfo) && <IconButton className='text-btn-cls' aria-label='Mark Payment Sent' disabled={disablePaymentSent} onClick={() => { setPaymentSentClick(true) }}>
			<span className='common-icon-tickmark'></span>
			Mark Payment Sent
		</IconButton>}

		{isUserGCForCPA(appInfo) && <IconButton className='text-btn-cls' disabled={disablePaymentReceive} aria-label='Mark Payment Received' onClick={() => {
			setPaymentReceiveClick(true);
			dispatch(getClientPayAppDetailsById({ appInfo: appInfo, id: selectedRows[0]?.id })).then((resp: any) => { console.log("resp", resp); setPaymentSentData(resp?.payload) })

		}}>
			<span className='common-icon-tickmark'></span>
			Mark Payment Received
		</IconButton>}
		<SUIAlert
			open={alert}
			contentText={
				warningMessage ?
					<div>
						<span>{'This Pay app item cant be deleted.'}</span>
						<div style={{ textAlign: 'right', marginTop: '10px' }}>
							<Button
								className="cancel-cls"
								style={{
									backgroundColor: '#666',
									color: '#fff',
									padding: '12px',
									height: '37px',
									borderRadius: '2px',
									marginRight: '0px',
									boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
									display: 'initial'
								}}
								onClick={(e: any) => { setAlert(false); }}>OK</Button>
						</div>
					</div>
					:
					<div>
						<span>Are you sure you want to delete the selected Pay App(s)?</span>
						<br /><br />
						<span>This action cannot be reverted.</span>
					</div>
			}
			title={warningMessage ? 'Warning' : 'Confirmation'}
			onAction={(e: any, type: string) => handleListChanges(type)}
			showActions={warningMessage ? false : true}
		/>
		{
			paymentSentClick && <PaymentDetailsForm iframeId='clientPayIframe' appType='ClientPayApps' data={selectedRows[0]} onClose={() => { setPaymentSentClick(false) }} onAdd={(formData: any) => { handlePaymentSent(formData) }} />
		}
		{
			paymentReceiveClick && <PaymentReceivedForm iframeId='clientPayIframe' appType='ClientPayApps' data={paymentSentData} onClose={() => { setPaymentReceiveClick(false); setPaymentSentData({}) }} onAdd={(formData: any) => { handlePaymentRecive(formData) }} />
		}
	</>;
};

export default ClientPayAppToolbarLeftButtons;