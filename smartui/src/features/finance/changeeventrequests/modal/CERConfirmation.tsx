import { ColDef } from 'ag-grid-community';
import { useAppSelector } from 'app/hooks';
import { IQBaseWindowProps } from 'components/iqbasewindow/IQBaseWindowTypes';
import IQButton from 'components/iqbutton/IQButton';
import { ChangeEvent, MouseEventHandler, memo, useCallback, useRef, useState } from 'react';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { confirmationDescriptionMap } from '../CERUtils';

import './CERConfirmation.scss';
import SignatureWithGrid from 'features/common/modal/signaturewithgrid/SignatureWithGrid';
import SignatureWithReason from 'features/common/modal/signaturewithreason/SignatureWithReason';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import SUIAlert from 'sui-components/Alert/Alert';

type CERConfirmationProps = IQBaseWindowProps & {
	type?: 'submit' | 'reject' | 'revise' | 'requestQuote' | 'verifyAuthorize';
	itemStatus?: string;
	showTitleMessage?: boolean;
	fundingSource?:string;
	contractOption?: string;
	onCancel?: MouseEventHandler<HTMLButtonElement>;
	onSubmitRequest?: Function;
	onAuthorize?: Function;
	
};

export default memo(({ className, type = 'submit', showTitleMessage = false, itemStatus,fundingSource,
	contractOption, onCancel, onSubmitRequest, onAuthorize, ...props }: CERConfirmationProps) => {
	const gcSignRef = useRef<any>();
	const clientSignRef = useRef<any>();
	const reviseSignRef = useRef<any>();
	const { server, currencySymbol } = useAppSelector(state => state.appInfo);
	const { confirmationBudgetList, confirmationGCSign } = useAppSelector(state => state.changeEventRequest);

	const [declaration, setDeclaration] = useState(false);
	const [reasonText, setReasonText] = useState('');
	const [reviseSign, setReviseSign] = useState('');
	const [gcSignature, setGCSignature] = useState('');
	const [clientSignature, setClientSignature] = useState('');
	const [submitAlert, setSubmitAlert] = useState<boolean>(false);
	const [authorizeAlert, setAuthorizeAlert] = useState<boolean>(false);

	const isSubmitDisabled = !declaration || gcSignature === '';
	const isAuthorizeDisabled = !declaration || clientSignature === '';

	const currencyRenderer = useCallback((context: any) => `${currencySymbol} ${context.value?.toLocaleString('en-US') || 0}`, []);

	const columns: Array<ColDef> = [{
		headerName: 'Work Item',
		//field: 'costCode',
		suppressMenu: true,
		minWidth: type !== 'requestQuote' ? 650 : 420,
		cellClass: 'work-item-cell',
		cellRenderer: (context: any) => {
			if (context?.node?.rowPinned === 'bottom') {
				return <span style={{ display: 'block', width: '100%', textAlign: 'end' }}>Summary</span>
			}
			else {
				return context?.data?.name + '-' + context?.data?.division + '-' + context?.data?.costCode + '-' + context?.data?.costType
			}
		}
	}, {
		headerName: 'Contract Amount',
		field: 'contractAmount',
		type: 'rightAligned',
		suppressMenu: true,
		minWidth: type !== 'requestQuote' ? 130 : 160,
		cellRenderer: currencyRenderer
	}, {
		headerName: 'Est.Change Event Amount',
		field: 'estimatedAmount',
		type: 'rightAligned',
		suppressMenu: true,
		minWidth: 220,
		hide: type === 'requestQuote',
		cellRenderer: currencyRenderer
	}, {
		headerName: 'Revised Amount',
		field: 'revisedAmount',
		type: 'rightAligned',
		suppressMenu: true,
		minWidth: 120,
		hide: type === 'requestQuote',
		cellRenderer: currencyRenderer
	}, {
		headerName: 'Vendor Name',
		field: 'vendorDetails',
		suppressMenu: true,
		minWidth: 250,
		hide: type !== 'requestQuote',
		cellClass: 'info-cell',
		cellRenderer: (context: any) => {
			if (context.value) {
				const { name, image } = context.value;
				return <div className='info-cell-box'>
					{image?.downloadUrl && <img className='info-icon' src={image.downloadUrl} />}
					{name || ''}
				</div>;
			}
		}
	}, {
		headerName: 'Vendor Point Of Contact',
		field: 'vendorDetails.pointOfContacts',
		suppressMenu: true,
		minWidth: 220,
		hide: type !== 'requestQuote',
		cellClass: 'info-cell',
		cellRenderer: (context: any) => {
			if (context.value?.length > 0) {
				const { name = '', image = '' } = context.value[0];
				return <div className='info-cell-box'>
					{image?.downloadUrl && <img className='info-icon' src={image.downloadUrl} />}
					{name || ''}
				</div>;
			}
		}
	}, {
		headerName: 'Submit By',
		field: 'submitBy',
		suppressMenu: true,
		minWidth: 80,
		hide: type !== 'requestQuote',
		cellRenderer: (context: any) => formatDate(context.value, { year: 'numeric', month: '2-digit', day: '2-digit' })
	}];

	const onGCSign = () => {
		const gcSign = gcSignRef?.current?.getTrimmedCanvas().toDataURL('image/png');
		setGCSignature(gcSign);
	};

	const onClientSign = () => {
		const clientSign = clientSignRef?.current?.getTrimmedCanvas().toDataURL('image/png');
		setClientSignature(clientSign);
	};

	const onReviseSign = () => {
		const revSign = reviseSignRef?.current?.getTrimmedCanvas().toDataURL('image/png');
		setReviseSign(revSign);
	};

	const updateBudgetClickEvent = (eventType: string) => {
		const data: any = {
			contractOption: eventType,
			signature: (type === 'verifyAuthorize') ? clientSignature : gcSignature
		};
		setSubmitAlert(false);
		setAuthorizeAlert(false);
		onSubmitRequest && onSubmitRequest(type, data);
	};

	const reviseOrReject = () => {
		const data: any = {
			contractOption: 'CreateNew',
			description: reasonText,
			signature: reviseSign
		};
		setSubmitAlert(false);
		setAuthorizeAlert(false);
		onSubmitRequest && onSubmitRequest(type, data);
	};

	return <>
		{['submit', 'requestQuote', 'verifyAuthorize'].includes(type) ?
			<SignatureWithGrid
				{...props}
				title={type === 'verifyAuthorize' ? 'Verify & Authorize' : 'Confirmation'}
				centerPiece={showTitleMessage ? `Budget will not be affected when Funding Source 'General Contractor' has been selected.` : ''}
				className={`cer-confirmation${className ? ` ${className}` : ''}`}
				tools={{ closable: true }}
				PaperProps={{
					sx: {
						width: '60%',
						height: '85%'
					}
				}}
				gridProps={{
					headers: columns,
					data: confirmationBudgetList,
					pinnedBottomRowConfig: (type !== 'requestQuote' ? {
						displayFields: {},
						aggregateFields: ['contractAmount', 'estimatedAmount', 'revisedAmount']
					} : null)
				}}
				leftSign={{
					signRef: gcSignRef,
					value: confirmationGCSign,
					title: 'General Contractor Signature',
					onEnd: onGCSign,
					onClear: () => setGCSignature('')
				}}
				rightSign={(type === 'verifyAuthorize' ? {
					signRef: clientSignRef,
					title: 'Client Signature',
					onEnd: onClientSign,
					onClear: () => setClientSignature('')
				} : undefined)}
				onDeclarationCheckChange={(check: boolean) => setDeclaration(check)}
				declarationText={<>I, <b>{server?.currentUserInfo?.name}</b>, {confirmationDescriptionMap[type]}</>}
				actions={<>
					<IQButton color='lightGrey' onClick={onCancel}>CANCEL</IQButton>
					{type === 'verifyAuthorize' ?
						<IQButton
							color='blue'
							className='iq-blue'
							disabled={isAuthorizeDisabled}
							onClick={() => {
								if (contractOption === 'CreateNew') setAuthorizeAlert(true);
								else updateBudgetClickEvent('UpdateExisting');
							}}
						>
							AUTHORIZE
						</IQButton>
						: <IQButton
							color='blue'
							className='iq-blue'
							disabled={isSubmitDisabled}
							onClick={() => {
								if (type === 'requestQuote' || itemStatus === 'Rejected' || itemStatus === 'Revise')
									onSubmitRequest && onSubmitRequest(type, {
										contractOption: 'CreateNew',
										signature: gcSignature
									});
								else setSubmitAlert(true);
							}}
						>
							SUBMIT
						</IQButton>
					}
				</>}
			/> : <SignatureWithReason
				{...props}
				title={`${type === 'revise' ? 'Revise & Resubmit' : 'Reject'} Change Event Request`}
				reasonLabel={`Reason for ${type === 'revise' ? 'sending back' : 'Rejecting'} the Change Event`}
				leftSign={{
					signRef: reviseSignRef,
					title: 'Signature',
					onEnd: onReviseSign,
					onClear: () => setReviseSign('')
				}}
				onReasonChange={(text: string) => setReasonText(text)}
				onDeclarationCheckChange={(check: boolean) => setDeclaration(check)}
				declarationText={<>I, <b>{server?.currentUserInfo?.name}</b>, {confirmationDescriptionMap[type]}</>}
				actions={<>
					<IQButton color='lightGrey' onClick={onCancel}>CANCEL</IQButton>
					{type === 'reject' ?
						<IQButton
							color='blue'
							className='iq-blue'
							disabled={reasonText === '' || reviseSign === '' || !declaration}
							onClick={reviseOrReject}
						>
							REJECT
						</IQButton>
						: <IQButton
							color='blue'
							className='iq-blue'
							disabled={reasonText === '' || reviseSign === '' || !declaration}
							onClick={reviseOrReject}
						>
							SUBMIT
						</IQButton>
					}
				</>}
			/>
		}
		{submitAlert && <SubmitConfirmation
			onClose={() => setSubmitAlert(false)}
			onSubmit={updateBudgetClickEvent}
		/>}
		{authorizeAlert && <UpdateBudgetAuthorize
			isBudgetUpdate={!showTitleMessage}
			onClose={() => setAuthorizeAlert(false)}
			onSubmit={() => updateBudgetClickEvent(showTitleMessage ? 'UpdateExisting' : 'CreateNew')}
		/>}
	</>;
});

const SubmitConfirmation = memo(({ onClose, onSubmit }: { onClose: any; onSubmit: any; }) => {
	const [eventType, setEventType] = useState<string>('CreateNew');

	return <SUIAlert
		open
		title={'Confirmation'}
		showActions={false}
		DailogClose={true}
		onClose={onClose}
		modelWidth={'560px !important'}
		className='confirmation-type-selector'
		contentText={
			<div className='type-selector-context'>
				<p className='conformation-paragraph'>On Approval Of This Change Event By Client, How Wolud you like to Manage Vendor & Client Contracts?</p>
				<RadioGroup
					name='eventSource'
					className='wi-type-radio'
					value={eventType}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setEventType(e.target.value)}
				>
					<div className={eventType == 'CreateNew' ? 'radio-group-section active' : 'radio-group-section'}>
						<FormControlLabel
							value={'CreateNew'}
							control={<Radio />}
							label='System Creates New Contracts for the Revised Change Event'
							labelPlacement="start"
							sx={{
								marginLeft: '0px !important',
								marginRight: '0px !important',
								display: 'flex !important',
								justifyContent: 'space-between',
								'& .MuiTypography-root': {
									paddingLeft: '0px !important',
									fontWeight: 'bold'
								}
							}}
						/>
						<span className='paragraph'>Have the system create new Client and Vendor Contracts for the revised Change Event amount</span>
					</div>
					<div className={eventType == 'UpdateExisting' ? 'radio-group-section active' : 'radio-group-section'}>
						<FormControlLabel
							value={'UpdateExisting'}
							control={<Radio />}
							label='Manually Update Existing Contracts'
							labelPlacement="start"
							sx={{
								marginLeft: '0px !important',
								marginRight: '0px !important',
								display: 'flex !important',
								justifyContent: 'space-between',
								'& .MuiTypography-root': {
									paddingLeft: '0px !important',
									fontWeight: 'bold'
								}
							}}
						/>
						<span className='paragraph'>Manually update the existing Client and Vendor Contracts Schedule of Value (SOV) to match the revised Change Event amount</span>
					</div>
				</RadioGroup>
				<div className='updatebudget-button-section'>
					<IQButton
						color='blue'
						onClick={() => onSubmit(eventType)}
					>
						SUBMIT CHANGE EVENT
					</IQButton>
				</div>
			</div>
		}
	/>;
});

const UpdateBudgetAuthorize = memo(({ isBudgetUpdate, onClose, onSubmit }: { isBudgetUpdate: boolean; onClose: any; onSubmit: any; }) => {
	return <SUIAlert
		open
		onClose={onClose}
		title={'Confirmation'}
		DailogClose={true}
		showActions={false}
		modelWidth={'30em'}
		className='confirmation-authorize'
		contentText={
			isBudgetUpdate ? <>
				<p>On Approval of this Change Event, new Budget Line items will be created for the work items list</p>
				<p>Are you sure you want to update?</p>
				<div className='updatebudget-button-section'>
					<IQButton
						color='orange'
						onClick={onSubmit}
					>
						UPDATE BUDGET & APPROVE CHANGE EVENT
					</IQButton>
				</div>
			</> : <>
				<p>Funding Source of this Change Event Request is '<b>General Contractor</b>' Hence there will not be any changes in Budget and the work items.</p>
				<p>Wolud you like to approve this Change Event Request?</p>
				<div className='updatebudget-button-section'>
					<IQButton
						color='orange'
						onClick={onSubmit}
					>
						YES, I APPROVE
					</IQButton>
				</div>
			</>
		}
	/>;
});