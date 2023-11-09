import React, { useState, useRef } from 'react';
import './ConformationModel.scss';
import { useAppSelector } from 'app/hooks';
import BaseWindow from 'components/iqbasewindow/IQBaseWindow';
import { IQBaseWindowProps } from 'components/iqbasewindow/IQBaseWindowTypes';
import IQButton from 'components/iqbutton/IQButton';
import { Checkbox, TextField, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import SUIGrid from 'sui-components/Grid/Grid';

import SignatureCanvas from "react-signature-canvas";
import SUIAlert from 'sui-components/Alert/Alert';
import CERConfirmation from '../modal/CERConfirmation';
import IQSignature from 'components/iqsignature/IQSignature';
import convertDateToDisplayFormat from 'utilities/commonFunctions';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

type ConformationModelProps = IQBaseWindowProps & {
	gridData?: Array<[]>;
	description?: boolean;
	checkBoxUserName?: any;
	checkboxdesc?: any;
	formType?: any;
	modelLabel?: any;
	modelWidth?: any;
	modelHeight?: any;
	descriptionlabel?: any;
	onClickHandler?: (data: any) => void;
	onCancelHandler?: () => void;
	buttonLabel?: any;
	updateBudgetHandler?: (type: any, data: any) => void;
	signatureLabel?: any;
	defaultSignature?: any;
	signatureHeight?: any;
	revisedBy?: any;
};

const ConformationModel = ({ gridData, description = false, descriptionlabel, revisedBy = null, signatureLabel, checkBoxUserName, checkboxdesc, formType, modelLabel, onClickHandler, onCancelHandler, buttonLabel, updateBudgetHandler, modelWidth = '70%', modelHeight = '100%', defaultSignature, signatureHeight = 100, ...props }: ConformationModelProps) => {
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [btnDisabled, setBtnDisable] = useState(false);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const [gridRef, setGridRef] = useState<any>('');
	const signaturePadRef = useRef<any>();
	const signaturePadRef2 = useRef<any>();
	const signaturePadRef3 = useRef<any>();
	const signaturePadRef4 = useRef<any>();
	const [signaturevalidation, setSignatureValidation] = useState<any>(true);
	const [alert, setAlert] = React.useState<boolean>(false);
	const [reasonVal, setReasonVal] = React.useState<any>('');
	const [testValue, setTestValue] = useState<boolean>(false);
	const [value, setValue] = React.useState<any>('CreateNew');
	const [submitAlert, setSubmitAlert] = React.useState<boolean>(false);
	const [contractOption, setContractOption] = React.useState<any>('CreateNew');

	const { confirmationBudgetList, confirmationGCSign } = useAppSelector(state => state.changeEventRequest);

	const columns = [
		{
			headerName: 'Work Item',
			field: 'workitem',
			minWidth: 400,
			maxWidth: 450,
			cellRenderer: (params: any) => params?.value != 'Summary' ? `${params.data?.name} - ${params?.data?.division} - ${params?.data?.costCode} - ${params?.data?.costType}` : params?.value,
		}, {
			headerName: 'Contract Amount',
			field: 'contractAmount',
			type: 'rightAligned',
			sum: 'aggFunc',
			minWidth: 250,
			cellRenderer: (params: any) => params.data?.contractAmount ? `${amountFormatWithSymbol(params.data?.contractAmount)}` : null,
		}, {
			headerName: 'Est.Change Event Amount',
			field: 'estimatedAmount',
			minWidth: 250,
			type: 'rightAligned',
			sum: 'aggFunc',
			valueGetter: (params: any) => params.data?.estimatedAmount ? `${amountFormatWithSymbol(params.data?.estimatedAmount)}` : null,
		}, {
			headerName: 'Revised Amount',
			field: 'revisedAmount',
			type: 'rightAligned',
			sum: 'aggFunc',
			minWidth: 150,
			valueGetter: (params: any) => params.data?.revisedAmount ? `${amountFormatWithSymbol(params.data?.revisedAmount)}` : null,
		}
	];

	const requestQuoteColumns = [
		{
			headerName: 'Vendor Name',
			field: 'vendor.name',
			minWidth: 250,
			// maxWidth: 450,
			cellRenderer: (params: any) => <div className='wi-vendor-detail-value'>
				<img src={params?.vendor?.image?.downloadUrl} />{params?.vendor?.name}</div>,
		},
		{
			headerName: 'Vendor Point Of Contact',
			field: 'vendor.pointOfContacts[0].name',
			minWidth: 250,
			// maxWidth: 450,
			cellRenderer: (params: any) => <div className='wi-vendor-detail-value'>
				<img src={params?.vendor?.pointOfContacts?.[0]?.image?.downloadUrl} />{params?.vendor?.pointOfContacts?.[0]?.name}</div>,
		},
		{
			headerName: 'Submit By',
			field: 'submitBy',
			minWidth: 400,
			maxWidth: 450,
			cellRenderer: (params: any) => params?.value ? convertDateToDisplayFormat(params?.value) : '',
		}

	];



	const getSignature = () => {
		return signaturePadRef?.current?.getTrimmedCanvas().toDataURL("image/png");
	};
	const getSignature2 = () => {
		return signaturePadRef2?.current?.getTrimmedCanvas().toDataURL("image/png");
	};
	const getSignature3 = () => {
		return signaturePadRef3?.current?.getTrimmedCanvas().toDataURL("image/png");
	};
	const getSignature4 = () => {
		return signaturePadRef4?.current?.getTrimmedCanvas().toDataURL("image/png");
	};

	const handleOnEnd = (ref: any) => {
		setSignatureValidation(ref?.current?.isEmpty());
	};

	const clearSignature = (ref: any) => {
		if (ref?.current) {
			ref.current.clear(); setSignatureValidation(true);
		}
	};

	const checkboxHandle = (event: any) => {
		if (event.target.checked) setIsChecked(true);
		else setIsChecked(false);
	};

	const validation = () => {
		let validate;
		if (formType == 'confirmation') {
			validate = !isChecked || signaturevalidation ? true : false;
		}
		else if (formType == 'reject') {
			validate = !isChecked || signaturevalidation || !testValue ? true : false;
		}
		else if (formType == 'revise') {
			console.log("revised by")
			validate = !isChecked || signaturevalidation || (revisedBy == 'GC' ? false : !testValue) ? true : false;
		}
		else if (formType == 'requestquote') {
			validate = !isChecked || signaturevalidation ? true : false;
		}
		else {
			validate = !isChecked || signaturevalidation ? true : false;
		}
		return validate;
	};

	const buttonHandler = () => {
		if (formType == 'confirmation') {
			if (onClickHandler) {
				const data = {
					signature: getSignature(),
					type: formType
				};
				setSubmitAlert(true);
			}
		}
		else if (formType == 'reject' || formType == 'revise') {
			if (onClickHandler) {
				const data = {
					signature: getSignature(),
					description: reasonVal,
					type: formType
				};
				onClickHandler(data);
			}
		}
		else if (formType == 'requestquote') {
			if (onClickHandler) {
				const data = {
					signature: getSignature2(),
					type: formType
				};
				onClickHandler(data);
			}
		}
		else {
			setAlert(true);
		}
	};

	const updateBudgetClickEvent = () => {
		setAlert(false);
		setSubmitAlert(false);
		const data = {
			contractOption: contractOption,
			signature: formType == 'verify' ? getSignature4() : getSignature()
		};
		if (updateBudgetHandler) updateBudgetHandler(formType, data);
	};

	const defaultProps = {
		title: modelLabel,
		tools: {
			closable: true,
			resizable: false
		},
		PaperProps: {
			sx: {
				width: modelWidth,
				height: modelHeight,
				minWidth: '30%',
			}
		},
		actions: <>
			<IQButton onClick={() => { if (onCancelHandler) onCancelHandler(); }} style={{ background: 'gray' }}>CANCEL</IQButton>
			<IQButton
				color='blue'
				disabled={validation()}
				onClick={() => { buttonHandler(); }}
				sx={{
					"&.Mui-disabled": {
						opacity: 0.4,
						background: "#059cdf",
					}
				}}
			>{buttonLabel}</IQButton>
		</>
	};


	return (
		<BaseWindow className='conformation-window' {...defaultProps} {...props}
			centerPiece={props?.centerPiece ? props?.centerPiece : ''}
		>
			{gridData && gridData?.length > 0 && <div className='grid-body-box'>
				<div className='grid-box'>
					<SUIGrid
						headers={formType == 'requestquote' ? [columns[0], columns[1], ...requestQuoteColumns] : [...columns]}
						data={gridData}
						getRowId={(record: any) => record.data.id}
						nowRowsMsg={'<div>No records to display</div>'}
						getReference={(value: any) => { setGridRef(value); }}
						pinnedBottomRowConfig={{
							displayFields: {
								workitem: 'Summary',
							},
							aggregateFields: ['contractAmount', 'estimatedAmount', 'revisedAmount'],
						}}
						suppressRowClickSelection={true}
					/>
				</div>
			</div>}
			{
				description && <div className='description-box'>
					<div className='description-header'>
						<span className="icon common-icon-Description"></span>
						<label className='label'>{descriptionlabel}</label>
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
							event.target.value ? setTestValue(true) : setTestValue(false);
							setReasonVal(event.target.value);
						}}
					/>
				</div>
			}
			{formType == 'confirmation' || formType == 'reject' || formType == 'revise' ?
				<div className='signature-box'>
					<div className="signature">
						<IQSignature
							signRef={signaturePadRef}
							title={signatureLabel}
							onEnd={() => handleOnEnd('signaturePadRef')}
							onClear={() => clearSignature('signaturePadRef')}
						/>
					</div>
				</div>

				: formType == 'requestquote' ?
					<div className='signature-box'>
						<div className="signature">
							<IQSignature
								signRef={signaturePadRef2}
								value={confirmationGCSign}
								title={signatureLabel}
								onEnd={() => handleOnEnd('signaturePadRef2')}
								onClear={() => clearSignature('signaturePadRef2')}
							/>
						</div>
					</div>
					:
					<div className='signature-box'>
						<div className='verify'>
							<div style={{ padding: '0px 5px 0px 0px' }}>
								<div className="signature">
									<IQSignature
										signRef={signaturePadRef3}
										value={confirmationGCSign}
										title='General Contractor Signature'
										onEnd={() => handleOnEnd('signaturePadRef3')}
										onClear={() => clearSignature('signaturePadRef3')}
									/>
								</div>
							</div>
							<div style={{ padding: '0px 0px 0px 5px' }}>
								<div className="signature">
									<IQSignature
										signRef={signaturePadRef4}
										title='Client Signature'
										onEnd={() => handleOnEnd('signaturePadRef4')}
										onClear={() => clearSignature('signaturePadRef4')}
									/>
								</div>
							</div>
						</div>
					</div>
			}

			<div className='validate-box'>
				<div>
					<Checkbox onChange={(event: any) => { checkboxHandle(event); }} value={isChecked} />
				</div>
				<div>
					<span className="agree-text">
						I, <b>{checkBoxUserName}, </b> {checkboxdesc}
					</span>
				</div>
			</div>

			<SUIAlert
				open={alert}
				title={'Confirmation'}
				contentText={
					props?.centerPiece == '' ?
						<>
							<span>On Approval Of this Change Event, new Budget Line items will be</span><br />
							<span>created for the work items list</span><br /><br />
							<span>Are you sure you want to update?</span><br /><br />
							<div className='updatebudget-button-section'>
								<IQButton
									className='updatebudget-button'
									variant="contained"
									size="medium"
									onClick={() => { updateBudgetClickEvent(); }}
								>UPDATE BUDGET & APPROVE CHANGE EVENT</IQButton>
							</div>
						</>
						: <>
							<span>Funding Source of this Change Event Request is </span><br />
							<span>General Contractor Hence there will not be any changes in Budget</span><br />
							<span>and the work items.</span><br />
							<span>Wolud you like to approve this Change Event Request?</span><br /><br />
							<div className='updatebudget-button-section'>
								<IQButton
									className='updatebudget-button'
									variant="contained"
									size="medium"
									onClick={() => { updateBudgetClickEvent(); }}
								>YES, I Approve</IQButton>
							</div>
						</>
				}
				onAction={(e: any, type: string) => { setAlert(false); }}
				DailogClose={true}
				showActions={false}
			/>
			{
				submitAlert &&
				<SUIAlert
					open={true}
					title={'Confirmation'}
					DailogClose={true}
					onClose={() => setSubmitAlert(false)}
					contentText={
						<div className='conformation2-section'>
							<div>
								<p className='conformation-paragraph'>On Approval Of This Change Event By Client, How Wolud you like to Manage Vendor & Client Contracts?</p>
							</div>
							<RadioGroup
								name='eventSource'
								className='wi-type-radio'
								value={contractOption}
								onChange={(e: any) => setContractOption(e.target.value)}
							>
								<div className={contractOption == 'CreateNew' ? 'radio-group-section active' : 'radio-group-section'}>
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
								<div className={value == 'Manual' ? 'radio-group-section active' : 'radio-group-section'}>
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
									className='updatebudget-button'
									variant="contained"
									size="medium"
									onClick={() => { updateBudgetClickEvent(); }}
								>SUBMIT CHANGE EVENT</IQButton>
							</div>
						</div>
					}
					// onAction={(e: any, type: string) => { props?.onSubmit(true) }}
					showActions={false}
					modelWidth={'560px !important'}
				/>
			}
		</BaseWindow>
	);
};

export default ConformationModel;