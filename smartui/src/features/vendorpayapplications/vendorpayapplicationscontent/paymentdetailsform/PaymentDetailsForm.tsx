import { useState } from 'react';
import { IconButton, InputAdornment, InputLabel, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector, useLocalFileUpload, useFilePreview } from 'app/hooks';
import DatePickerComponent from 'components/datepicker/DatePicker';
import IQButton from 'components/iqbutton/IQButton';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import SmartDialog from 'components/smartdialog/SmartDialog';
import SmartDropDown from 'components/smartDropdown';
import React from 'react';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import convertDateToDisplayFormat from 'utilities/commonFunctions';
import { getAmountAlignment } from 'utilities/commonutills';
import { getServer } from 'app/common/appInfoSlice';
import { getAttachments, setAttachments } from 'features/vendorpayapplications/stores/payment/PayAppPaymentSentSlice';
import pdfimage from 'resources/pdf.png';

const PaymentDetailsForm = (props: any) => {
	const dispatch = useAppDispatch();
	const modeOfPaymentOptions = [
		{ id: 1, label: 'Cash', value: 'Cash' },
		{ id: 1, label: 'Checks', value: 'Checks' },
		{ id: 1, label: 'Electronic Bank Transfer', value: 'Electronic Bank Transfer' },
		{ id: 1, label: 'Credit Cards', value: 'Credit Cards' }
	];
	const [formData, setFormData] = React.useState<any>(props?.data);
	const [enableAdd, setEnableAdd] = React.useState<boolean>(false);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [fileList, setFileList] = useState<any>([]);
	const appInfo = useAppSelector(getServer);
	const attachments = useAppSelector(getAttachments);

	React.useEffect(() => { console.log("log", props?.data); setFormData(props?.data); }, [props?.data]);
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
		const formDataClone = { ...formData, [name]: value };
		if (formDataClone?.invoiceNumber && formDataClone?.sentOn && formDataClone?.amount && formDataClone?.amount != '' && formDataClone?.modeOfPayment) setEnableAdd(true);
		setFormData(formDataClone);
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
						className='btn-add-line-items cancel'
						onClick={() => { props?.onClose && props?.onClose(false); }}
					>
						CANCEL
					</IQButton>
					<IQButton
						disabled={!enableAdd}
						className='btn-add-line-items'
						onClick={() => { props?.onAdd && props?.onAdd(formData); props?.onClose && props?.onClose(false); }}
					>
						ADD
					</IQButton>
				</>,
				tools: [optionalTools],
				zIndex: 100,
				fullScreen: (props?.fullScreen || location?.pathname?.includes('home'))
			}}
			onClose={(event, reason) => {
				props?.onClose && props?.onClose(false);
			}}
		>
			<div className='payment-details-wrap'>
				<div className='ponumber-invoice-cls'>
					<div className='ponumber-cls'>
						<div className='ponumber-label'>PO Number</div>
						<TextField
							id='name'
							fullWidth
							size='small'
							disabled={true}
							InputProps={{
								readOnly: true,
								disabled: true,
							}}
							name='name'
							variant='outlined'
							value={formData?.poNumber}
						/>
					</div>
					<div className='invoice-cls'>
						<div className='invoice-label'>Invoice #</div>
						<TextField
							id='invoice'
							fullWidth
							size='small'
							name='name'
							placeholder={'Enter'}
							variant='outlined'
							value={formData?.invoiceNumber}
							onChange={(e: any) => handleOnChange(e.target.value, 'invoiceNumber')}
						/>
					</div>
				</div>
				<div className='date-sent-cls'>
					<InputLabel className='inputlabel'>Date Sent</InputLabel>
					<DatePickerComponent
						containerClassName='iq-customdate-cont'
						defaultValue={convertDateToDisplayFormat(formData?.sentOn)}
						onChange={(val: any) => handleOnChange(val, 'sentOn')}
						render={
							<InputIcon
								placeholder='MM/DD/YYYY'
								className='custom-input rmdp-input'
							/>
						}
						maxDate={new Date()}
					/>
				</div>
				<div className='amount-sent-cls'>
					<InputLabel className='inputlabel'>Amount Sent</InputLabel>
					<TextField
						id='amountSent'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<span style={{ color: '#333333' }}>{currencySymbol}</span>
								</InputAdornment>
							)
						}}
						fullWidth
						size='small'
						name='name'
						variant='outlined'
						value={getAmountAlignment(formData?.amount)}
						onChange={(e: any) => handleOnChange(e.target.value, 'amount')}
					/>
				</div>
				<div className='mode-payment-cls'>
					<InputLabel className='inputlabel'>Mode Of Payment</InputLabel>
					<SmartDropDown
						options={modeOfPaymentOptions}
						outSideOfGrid={true}
						// size='small'                
						isSearchField={false}
						isFullWidth
						Placeholder={'Select'}
						selectedValue={formData?.modeOfPayment}
						// menuProps={classes.menuPaper}
						isMultiple={false}
						variant='outlined'
						handleChange={(value: any) => handleOnChange(value, 'modeOfPayment')}
					/>
				</div>
				<div className='start-date-field'>
					<InputLabel className='inputlabel'>Notes</InputLabel>
					<TextField
						id='notes'
						variant='outlined'
						fullWidth
						multiline
						minRows={2}
						maxRows={10}
						placeholder='Enter Notes'
						name='notes'
						value={formData.notes}
						onChange={(e: any) => handleOnChange(e.target.value, 'notes')}
					/>
				</div>
				<div>
					<DocUploader
						width={'1070px'}
						height={'200px'}
						folderType='File'
						docLabel={'Attachments'}
						showDriveOption={false}
						imgData={fileList}
						readOnly={false}
						onImageClick={openPreview}
						onImageDelete={onDeleteFile}
						localFileClick={(data: any) => { localFileUpload(data); }}
					></DocUploader>
				</div>
			</div>
		</SmartDialog >
	);
};

export default PaymentDetailsForm;