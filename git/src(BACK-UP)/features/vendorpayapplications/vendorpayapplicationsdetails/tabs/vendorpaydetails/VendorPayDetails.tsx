import React, {memo} from 'react';
import {useAppDispatch, useAppSelector, useFilePreview, useHotLink} from 'app/hooks';
import './VendorPayDetails.scss';
import convertDateToDisplayFormat, {formatPhoneNumber} from 'utilities/commonFunctions';
import {getServer} from 'app/common/appInfoSlice';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';

interface VendorPayDetailsProps {

}

const VendorPayDetails = (props: VendorPayDetailsProps) => {
	const iFrameId = 'vendorPayAppIframe';
	const appType = 'VendorPayApp';
	const dispatch = useAppDispatch();
	const {selectedRecord} = useAppSelector(state => state.vendorPayApps);
	const [formData, setFormData] = React.useState<any>({
		...selectedRecord,
	});
	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const [paymentSentAttachments, setPaymentSentAttachments] = React.useState<any>([]);
	const [paymentRecivedAttachments, setPaymentRecivedAttachments] = React.useState<any>([]);

	React.useEffect(() => {
		setFormData(selectedRecord);
	}, [selectedRecord]);

	const formatAdditionalFileList = (list: Array<any>) => {
		const formattedList = list?.map((file: any) => {
			const thumbnailEl = file?.stream?.thumbnails.find((el: any) => el.size === 5);
			return {
				id: file?.id,
				fileName: file?.name,
				thumbnail: thumbnailEl?.downloadUrl
			};
		});
		return formattedList;
	};

	React.useEffect(() => {
		if(formData?.paymentSent != null) {
			if(formData?.paymentSent?.attachments?.length > 0) {
				const result = formatAdditionalFileList(formData?.paymentSent?.attachments);
				setPaymentSentAttachments(result);
			}
		}
		if(formData?.paymentReceived != null) {
			if(formData?.paymentReceived?.attachments?.length > 0) {
				const result = formatAdditionalFileList(formData?.paymentReceived?.attachments);
				setPaymentRecivedAttachments(result);
			}
		}
	}, [formData]);

	const openPreview = (files: Array<any>, index: number) => {
		useFilePreview(iFrameId, appInfo, appType, files, index);
	};

	const gridIcon = React.useMemo<React.ReactElement>(() => {
		return <div className='common-icon-info-icon common-icon-Budgetcalculator'></div>;
	}, []);

	return (
		<div className='vendorpay-contract-details-box'>
			<div className='vendorpay-contract-details-header'>
				<div className='title-action'>
					<span className='title'>Vendor Details</span>
				</div>
			</div>
			<div className='vendorpay-contract-details-content'>
				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Vendor Name</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-companies"></span>
						{formData?.vendor?.image?.downloadUrl && (
							<>
								<span className="contract-info-company-icon">
									<img src={formData?.vendor?.image?.downloadUrl} style={{height: '28px', width: '28px', borderRadius: "50%"}} />
								</span>
							</>
						)}

						<span className='vendorpay-contract-info-data'>
							{formData?.vendor?.name}
						</span>
					</div>
				</span >
				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Vendor Email</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-email-message"></span>
						<span className='vendorpay-contract-info-data'>
							{formData?.vendor?.email}
						</span>
					</div>
				</span>
				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Vendor Phone
					</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-telephone-gray"></span>
						<span className='vendorpay-contract-info-data'>
							{formatPhoneNumber(formData?.vendor?.phone)}
						</span>
					</div>
				</span>
			</div >
			<div className='vendorpay-contract-details-header'>
				<div className='title-action'>
					<span className='title'>Vendor Point of Contact</span>
				</div>
			</div>
			<div className='vendorpay-contract-details-content'>
				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Name</div>
					{formData?.vendor?.pointOfContacts?.map((row: any) => (
						<div className='contract-info-data-box'>
							<span className="common-icon-name"></span>
							{row?.image?.downloadUrl && (
								<>
									<span className="contract-info-company-icon">
										<img src={row?.image?.downloadUrl} style={{height: '100%', width: '100%', borderRadius: "50%"}} />
									</span>
								</>
							)
							}
							<span className='vendorpay-contract-info-data'>{row?.name}</span>
						</div>
					))}
					{/* <div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-name"></span>
						<span className='vendorpay-contract-info-data'>Philip Parker</span>
					</div> */}
				</span>

				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Email</div>
					{formData?.vendor?.pointOfContacts?.map((row: any) => (
						<div className='contract-info-data-box'>
							<span className="common-icon-email-message"></span>
							<span className='contract-info-data'>{row?.email}</span>
						</div>
					))}
				</span >

				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Phone Number</div>
					{formData?.vendor?.pointOfContacts?.map((row: any) => (
						<div className='contract-info-data-box'>
							<span className="common-icon-telephone-gray"></span>
							<span className='contract-info-data'>{formatPhoneNumber(row?.phone)}</span>
						</div>
					))}
				</span>
			</div >
			<div className='vendorpay-contract-details-header'>
				<div className='title-action'>
					<span className='title'>Contract Summary</span>
				</div>
			</div>
			<div className='vendorpay-contract-details-content'>
				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>PO Number</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-post-contract"></span>
						<span className='vendorpay-contract-info-data'>{formData?.poNumber}</span>
					</div>
				</span>

				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Invoice Amount</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-contract-amount"></span>
						<span className='vendorpay-contract-info-data'>{amountFormatWithSymbol(formData?.invoiceAmount)}</span>
					</div >
				</span >

				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Retainage %</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-contract-amount"></span>
						<span className='vendorpay-contract-info-data'>{formData?.retainagePercentage}</span>
					</div >
				</span >

				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Retainage Amount</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-contract-amount"></span>
						<span className='vendorpay-contract-info-data'>{amountFormatWithSymbol(formData?.retainageAmount)}</span>
					</div >
				</span >

				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Pay Application Amount</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-contract-amount"></span>
						<span className='vendorpay-contract-info-data'>{amountFormatWithSymbol(formData?.amount)}</span>
					</div>
				</span>

				<span className='vendorpay-contract-info-tile date-field'>
					<div className='vendorpay-contract-info-label'>Submitted Date</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-DateCalendar"></span>
						<span className='vendorpay-contract-info-data'>
							{convertDateToDisplayFormat(formData?.submittedOn)}
						</span>
					</div>
				</span>


				<span className='vendorpay-contract-info-tile'>
					<div className='vendorpay-contract-info-label'>Contract Name</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-contracts"></span>
						<span className='contract-info-data hotlink' onClick={() => window.open(useHotLink(`vendor-contracts/home?id=${formData?.contract?.id}`), '_blank')}>{formData?.contract?.title}</span>
					</div>
				</span>

				{/* <span className='vendorpay-contract-info-tile date-field'>
					<div className='vendorpay-contract-info-label'>Through Date</div>
					<div className='vendorpay-contract-info-data-box'>
						<span className="common-icon-DateCalendar"></span>
						<span className='vendorpay-contract-info-data'>
							06/30/2023
						</span>
					</div>
				</span> */}
			</div >

			{(formData?.status == 'PaymentSent' || formData?.status == 'PaymentReceived') && <>
				<div className='vendorpay-contract-details-header'>
					<div className='title-action'>
						<span className='title'>Payment Sent</span>
					</div>
				</div>
				<div className='vendorpay-contract-details-content'>
					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Invoice Number</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-post-contract"></span>
							<span className='vendorpay-contract-info-data'>{formData?.paymentSent?.invoiceNumber}</span>
						</div>
					</span>
					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Date Sent</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-DateCalendar"></span>
							<span className='vendorpay-contract-info-data'>{convertDateToDisplayFormat(formData?.paymentSent?.sentOn)}</span>
						</div >
					</span >
					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Amount Sent</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-payment-sent"></span>
							<span className='vendorpay-contract-info-data'>{amountFormatWithSymbol(formData?.paymentSent?.amount)}</span>
						</div>
					</span>
					<span className='vendorpay-contract-info-tile date-field'>
						<div className='vendorpay-contract-info-label'>Mode Of Payment</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-bank-transfer"></span>
							<span className='vendorpay-contract-info-data'>
								{formData?.paymentSent?.modeOfPayment}
							</span>
						</div>
					</span>
					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Notes</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-Description"></span>
							<span className='contract-info-data contract-bid-pack-lbl'>{formData?.paymentSent?.notes}</span>
						</div>
					</span>
				</div >
				{paymentSentAttachments?.length > 0 &&
					<div className='vendorpay-contract-attachment'>
						<div className='vendorpay-contract-attachment-label'>Attachments</div>
						<ImageList
							sx={{
								width: '100%',
							}}
							className="doc-img-item-contt"
							cols={10}
						>
							{paymentSentAttachments?.map((item: any, index: number) => {
								return <ImageListItem
									key={index}
									style={{width: '110px', height: '110px', margin: '2px'}}
									className="doc-img-item"
									onClick={() => openPreview(paymentSentAttachments, index)}
								>
									<img
										src={item.thumbnail}
										alt={item.fileName}
										loading="lazy"
									/>
									<ImageListItemBar title={item.fileName} position="below" />
								</ImageListItem>;
							})}
						</ImageList>
					</div>
				}
			</>
			}
			{formData?.status == 'PaymentReceived' && <>
				<div className='vendorpay-contract-details-header'>
					<div className='title-action'>
						<span className='title'>Payment Received</span>
					</div>
				</div>
				<div className='vendorpay-contract-details-content'>
					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Invoice Number</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-post-contract"></span>
							<span className='vendorpay-contract-info-data'>{formData?.paymentReceived?.invoiceNumber}</span>
						</div>
					</span>

					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Date Sent</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-DateCalendar"></span>
							<span className='vendorpay-contract-info-data'>{convertDateToDisplayFormat(formData?.paymentReceived?.sentOn)}</span>
						</div >
					</span >
					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Date Received</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-DateCalendar"></span>
							<span className='vendorpay-contract-info-data'>{convertDateToDisplayFormat(formData?.paymentReceived?.receivedOn)}</span>
						</div>
					</span>

					<span className='vendorpay-contract-info-tile date-field'>
						<div className='vendorpay-contract-info-label'>Amount Received</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-payment-received"></span>
							<span className='vendorpay-contract-info-data'>
								{amountFormatWithSymbol(formData?.paymentReceived?.amount)}
							</span>
						</div>
					</span>


					<span className='vendorpay-contract-info-tile'>
						<div className='vendorpay-contract-info-label'>Notes</div>
						<div className='vendorpay-contract-info-data-box'>
							<span className="common-icon-Description"></span>
							<span className='contract-info-data contract-bid-pack-lbl'>{formData?.paymentReceived?.notes}</span>
						</div>
					</span>

					{/* <span className='vendorpay-contract-info-tile date-field'>
						<div className='vendorpay-contract-info-label'>Attachments</div>
						{formData?.paymentReceived?.attachments?.map((row: any) => (
							<div className='contract-info-data-box'>
								<span className="common-icon-email-message"></span>
								<span className='contract-info-data'>{row?.filename?.pdf}</span>
							</div>
						))}
					</span> */}
				</div >
				{paymentRecivedAttachments?.length > 0 &&
					<div className='vendorpay-contract-attachment'>
						<div className='vendorpay-contract-attachment-label'>Attachments</div>
						<ImageList
							sx={{width: '100%'}}
							className="doc-img-item-contt"
							cols={10}
						>
							{paymentRecivedAttachments?.map((item: any, index: number) => {
								return <ImageListItem
									key={index}
									style={{width: '110px', height: '110px', margin: '2px'}}
									className="doc-img-item"
									onClick={() => openPreview(paymentRecivedAttachments, index)}
								>
									<img
										src={item.thumbnail}
										alt={item.fileName}
										loading="lazy"
									/>
									<ImageListItemBar title={item.fileName} position="below" />
								</ImageListItem>;
							})}
						</ImageList>
					</div>
				}
			</>
			}
		</div >
	);
};
export default memo(VendorPayDetails);
