import { useState } from 'react';
import { IconButton, InputAdornment, InputLabel, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector, useLocalFileUpload, useFilePreview } from 'app/hooks';
import DatePickerComponent from "components/datepicker/DatePicker";
import IQButton from "components/iqbutton/IQButton";
import IQTooltip from "components/iqtooltip/IQTooltip";
import SmartDialog from "components/smartdialog/SmartDialog";
import React from "react";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DocUploader from "sui-components/DocUploader/DocUploader";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import { getServer } from 'app/common/appInfoSlice';
import { getAttachments, setAttachments } from 'features/vendorpayapplications/stores/payment/PayAppPaymentReceivedSlice';
import pdfimage from 'resources/pdf.png';

const PaymentReceivedForm = (props: any) => {
	const dispatch = useAppDispatch();
	const [formData, setFormData] = React.useState<any>(props?.data);
	const [enableAdd, setEnableAdd] = React.useState<boolean>(false);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [fileList, setFileList] = useState<any>([]);
	const appInfo = useAppSelector(getServer);
	const attachments = useAppSelector(getAttachments);

	React.useEffect(() => { console.log("props in received form", props?.data); setFormData(props?.data); }, [props?.data]);
	const optionalTools = <>{
		<>
			{<IQTooltip title='Open in new Tab' placement={'bottom'}>
				<IconButton key={'open-in-new-tab'} aria-label='Open in new Tab' onClick={() => { }}>
					<span className='common-icon-external'></span>
				</IconButton>
			</IQTooltip>}
		</>
	}</>;

	const handleOnChange = (value: any, name: any) => {
		console.log("key", value, name);
		const formDataClone = { ...formData, [name]: value };
		setFormData({ ...formDataClone });
		if (formDataClone?.receivedOn && formDataClone?.amount && formDataClone?.amount != '') setEnableAdd(true);
	};

	const localFileUpload = (selectedFiles: any) => {
		const file = selectedFiles[0];
		if (file) {
			if (file?.type == 'application/pdf') {
				setFileList([{ id: 1, fileName: file?.name, thumbnail: pdfimage }]);
			}
			else {
				const reader = new FileReader();
				reader.onload = (e: any) => { setFileList([{ id: 1, fileName: file?.name, thumbnail: e.target.result }]); };
				reader.readAsDataURL(file);
			}
		}
		useLocalFileUpload(appInfo, selectedFiles).then((uploadedFiles) => {
			const structuredFileList = uploadedFiles?.map((file: any) => {
				return {
					name: file.name,
					stream: {
						fileId: file.id
					}
				};
			});
			// const viewFileList = uploadedFiles?.map((file: any) => {
			// 	return { fileName: file.name, ...file, thumbnail: `${appInfo?.hostUrl}/EnterpriseDesktop/thumbnail/getThumbnailUrl?objectid=${file.id}&iconname=5` };
			// });

			// setFileList(viewFileList);
			dispatch(setAttachments(structuredFileList));
		});
	};

	const onDeleteFile = (item: any) => {
		const remainingFiles = fileList.filter((file: any) => file.id !== item.id);
		const updatedAttachmentList = attachments.filter((file: any) => file.id !== item.id);
		setFileList(remainingFiles);
		dispatch(setAttachments(updatedAttachmentList));
	};

	const openPreview = (files: Array<any>, index: number) => {
		useFilePreview(props.iframeId, appInfo, props.appType, files, index);
	};

	return (
		<SmartDialog
			open={true}
			className='payment-details-cls'
			// isFullView={isFullView}
			disableEscapeKeyDown={true}
			PaperProps={{
				sx: { height: '90%', width: '600px', minWidth: '10%' },
			}}

			custom={{
				closable: true,
				resizable: true,
				title: 'Payment Details',
				buttons: <>
					<IQButton
						// disabled={selectedRows?.length > 0 ? false : true}
						className='btn-add-line-items cancel'
						// color='white'
						onClick={() => { props?.onClose && props?.onClose(false); }}
					>
						CANCEL
					</IQButton>

					<IQButton
						disabled={!enableAdd}
						className='btn-add-line-items'
						// color='white'
						onClick={() => { props?.onAdd && props?.onAdd(formData); props?.onClose && props?.onClose(false); }}
					>
						CONFIRM
					</IQButton>
				</>,
				tools: [optionalTools],
				// presenceTools: [presenceTools],
				zIndex: 100,
				fullScreen: (props?.fullScreen || location?.pathname?.includes('home')),
				// onMaximize: handleWindowMaximize
			}}
			onClose={(event, reason) => {
				props?.onClose && props?.onClose(false);
				// if (reason && reason == 'closeButtonClick') {
				//     postMessage({
				//         event: 'closeiframe',
				//         body: { iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts' }
				//     });
				// }

			}}
		>
			<div className='payment-details-wrap'>
				<div className='ponumber-invoice-cls'>
					<div className='ponumber-cls'>
						<div className='ponumber-label'>PO Number</div>
						<TextField
							id="name"
							fullWidth
							disabled={true}
							InputProps={{
								readOnly: true,
								disabled: true,
							}}
							size='small'
							name="name"
							variant="outlined"
							value={formData?.poNumber}
						/>
					</div>
					<div className='invoice-cls'>
						<div className='invoice-label'>Invoice #</div>
						<TextField
							id="invoice"
							fullWidth
							InputProps={{
								readOnly: true,
								disabled: true,
							}}
							name="name"
							size='small'
							placeholder={"Enter"}
							variant="outlined"
							value={formData?.paymentSent?.invoiceNumber}
						// onChange={(e: any) => handleOnChange(e.target.value, 'invoiceNumber')}
						/>
					</div>
				</div>


				<div className="date-sent-cls">
					<InputLabel className="inputlabel">Date Sent</InputLabel>
					{/* <span className='budget-Date-1'></span> */}
					<DatePickerComponent
						readOnly
						disabled
						containerClassName='iq-customdate-cont'
						defaultValue={convertDateToDisplayFormat(formData?.paymentSent?.sentOn)}
						onChange={(val: any) => handleOnChange(val, 'sentOn')}
						maxDate={new Date()}
						render={
							<InputIcon
								placeholder="MM/DD/YYYY"
								className="custom-input rmdp-input"
							/>
						}
					/>
				</div>
				<div className="date-sent-cls">
					<InputLabel className="inputlabel">Date Received</InputLabel>
					<DatePickerComponent
						containerClassName='iq-customdate-cont'
						defaultValue={convertDateToDisplayFormat(formData?.receivedOn)}
						onChange={(val: any) => handleOnChange(val, 'receivedOn')}
						// maxDate={new Date(formData.endDate)}
						render={
							<InputIcon
								placeholder="MM/DD/YYYY"
								className="custom-input rmdp-input"
							/>
						}
						maxDate={new Date()}
					/>
				</div>
				<div className="mode-payment-cls">
					<InputLabel className="inputlabel">Amount Received</InputLabel>
					<TextField
						id="amount"
						fullWidth
						size='small'
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<span style={{ color: '#333333' }}>{currencySymbol}</span>
								</InputAdornment>
							)
						}}
						name="amount"
						placeholder={"Enter"}
						variant="outlined"
						value={formData?.amount?.toLocaleString("en-US")}
						onChange={(e: any) => handleOnChange(e.target.value, 'amount')}
					/>
				</div>
				<div className="start-date-field">
					<InputLabel className="inputlabel">Notes</InputLabel>
					<TextField
						id="notes"
						variant='outlined'
						fullWidth
						multiline
						maxRows={10}
						minRows={2}
						placeholder='Enter Notes'
						name='notes'
						value={formData?.notes}
						onChange={(e: any) => handleOnChange(e.target.value, 'notes')}

					/>
				</div>
				<div>
					<DocUploader
						width={'1070px'}
						height={'200px'}
						folderType='File'
						docLabel={'Attachments'}
						imgData={fileList}
						readOnly={false}
						onImageClick={openPreview}
						onImageDelete={onDeleteFile}
						showDriveOption={false}
						localFileClick={(data: any) => { localFileUpload(data); }}
					></DocUploader>
				</div>
			</div>

		</SmartDialog >
	);
};
export default PaymentReceivedForm;