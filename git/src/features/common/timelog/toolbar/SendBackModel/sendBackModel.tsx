import React, { useState, useRef, useCallback, useMemo } from 'react';
import "./sendBackModel.scss";
import { IconButton, InputAdornment, InputLabel, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector, useLocalFileUpload, useFilePreview } from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import SmartDialog from 'components/smartdialog/SmartDialog';
import { getServer } from 'app/common/appInfoSlice';
import DialogContent from "@mui/material/DialogContent";
import IQSignature from 'components/iqsignature/IQSignature';

import SendBackGrid from './grid';

const PaymentDetailsForm = (props: any) => {

	const [reasonVal, setReasonVal] = useState<any>('');
	const sendBackSignRef = useRef<any>();
	const [reviseSign, setReviseSign] = useState(true);

	const handleOnEnd = (ref: any) => {
		setReviseSign(ref?.current?.isEmpty());
	};
	const clearSignature = (ref: any) => {
		if (ref?.current) {
			ref.current.clear();
			setReviseSign(true);
		}
	};
	const getreviseSign = () => {
		return sendBackSignRef?.current?.getTrimmedCanvas().toDataURL("image/png");
	};

	return (
		<SmartDialog
			open={true}
			className="sendback-details-cls"
			disableEscapeKeyDown={true}
			PaperProps={{
				sx: { height: '90%', width: '80%', minWidth: '60%' },
			}}
			custom={{
				closable: true,
				resizable: true,
				title: 'Send Back Time Log Entries',
				buttons: <>
					<IQButton
						className='btn-add-line-items cancel'
						onClick={() => { props?.onClose && props?.onClose(false); }}
					>
						CANCEL
					</IQButton>
					<IQButton
						disabled={false}
						className='btn-add-line-items'
						onClick={() => { props?.onSubmit && props?.onSubmit(); }}
					>
						Submit
					</IQButton>
				</>,
				// tools: [],
				zIndex: 100,
				fullScreen: (props?.fullScreen || location?.pathname?.includes('home'))
			}}
			onClose={(event, reason) => {
				props?.onClose && props?.onClose(false);
			}}
		>
			<div className='sendback-wrap'>
				<div className='grid-section'>
					<SendBackGrid 
						groupkey='createdBy'
						griddata = {[]} 
					/>
				</div>
				<div className='bottom-section'>
					<div className='reason-section'>
						<DialogContent className="contracts-sign-modal_content">
							<div className="contracts-sign-modal_decline-title">
								<span className="common-icon-Description"></span> Reason for Sending Back the Time Log Entries
							</div>
							<TextField
								id="description"
								variant='outlined'
								fullWidth
								multiline
								minRows={6}
								maxRows={10}
								placeholder='Enter Reason for Delcining the Contract'
								name='reason'
								value={reasonVal}
								onChange={(event) => {
									setReasonVal(event.target.value);
								}}
							/>
						</DialogContent>
					</div>
					<div className='signature-section'>
						<IQSignature
							signRef={sendBackSignRef}
							value={''}
							title={'Signature'}
							onEnd={() => handleOnEnd('sendBackSignRef')}
							onClear={() => clearSignature('sendBackSignRef')}
						/>
					</div>
				</div>
			</div>
		</SmartDialog >
	);
};

export default PaymentDetailsForm;