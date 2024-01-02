import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {Button, FormControlLabel, Grid, InputAdornment, Radio, RadioGroup, TextField} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector, useHotLink} from 'app/hooks';
import DatePickerComponent from 'components/datepicker/DatePicker';
import IQButton from 'components/iqbutton/IQButton';
import {lockAndPostContract} from 'features/vendorcontracts/stores/VCButtonActionsAPI';
import {setLockAndPostContractResponseClick, setSelectedRecord} from 'features/vendorcontracts/stores/VendorContractsSlice';
import {updateContractDetails} from 'features/vendorcontracts/stores/gridAPI';
import {getVendorContractsList} from 'features/vendorcontracts/stores/gridSlice';
import React, {memo} from 'react';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import SUIAlert from 'sui-components/Alert/Alert';
import DynamicTooltip from "sui-components/DynamicTooltip/DynamicTooltip";
import SUIGrid from "sui-components/Grid/Grid";
import SUINote from 'sui-components/Note/Note';
import convertDateToDisplayFormat, {formatPhoneNumber} from 'utilities/commonFunctions';
import {errorMsg, errorStatus, getAmountAlignment, isUserGC} from 'utilities/commonutills';
import {primaryIconSize} from "../../../../budgetmanager/BudgetManagerGlobalStyles";
import './ContractDetails.scss';
// import { lockAndPostContract } from 'features/vendorcontracts/stores/VendorContractsAPI';
import {postMessage} from 'app/utils';
import Toast from 'components/toast/Toast';
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';

interface ContractDetailsProps {
	readOnly: boolean;
}

const ContractDetails = (props: ContractDetailsProps) => {
	const dispatch = useAppDispatch();
	const {selectedRecord} = useAppSelector(state => state.vendorContracts);
	const {budgetItems} = useAppSelector((state) => state.vendorContractsGrid);
	const [formData, setFormData] = React.useState<any>({});
	const [alert, setAlert] = React.useState<any>({show: false, alertMsg: ''});
	const [showLockAlert, setShowLockAlert] = React.useState<boolean>(false);
	const [showLockSuccessMsg, setShowLockSuccessMsg] = React.useState<boolean>(false);
	const [toast, setToast] = React.useState<any>({show: false, message: ''});
	const [upfrontPaymentType, setUpfrontPaymentType] = React.useState<any>('');

	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const submitContractDetailsResponseClick = useAppSelector((state) => state?.vendorContracts?.submitContractDetailsResponseClick);

	React.useEffect(() => {
		console.log("selec", selectedRecord, formData, {...selectedRecord, upfrontPaymentAmount: selectedRecord?.upfrontPaymentAmount?.toLocaleString('en-US'), makeUpfrontPayment: formData?.makeUpfrontPayment ? formData?.makeUpfrontPayment : selectedRecord?.makeUpfrontPayment, hasPaymentRetainage: formData?.hasPaymentRetainage ? formData?.hasPaymentRetainage : selectedRecord?.hasPaymentRetainage});
		setFormData({...selectedRecord, upfrontPaymentAmount: selectedRecord?.upfrontPaymentAmount?.toLocaleString('en-US'), makeUpfrontPayment: formData?.makeUpfrontPayment ? formData?.makeUpfrontPayment : selectedRecord?.makeUpfrontPayment, hasPaymentRetainage: formData?.hasPaymentRetainage ? formData?.hasPaymentRetainage : selectedRecord?.hasPaymentRetainage});
	}, [selectedRecord]);

	React.useEffect(() => {submitContractDetailsResponseClick && setShowLockAlert(true);}, [submitContractDetailsResponseClick]);
	React.useEffect(() => {setTimeout(() => {setShowLockSuccessMsg(false);}, 5000);}, [showLockSuccessMsg]);

	React.useEffect(() => {
		toast?.show && setTimeout(() => {
			setToast({show: false, message: ''});
		}, 5000);
	}, [toast?.show]);

	const gridIcon = React.useMemo<React.ReactElement>(() => {
		return <div className='common-icon-info-icon common-icon-Budgetcalculator'></div>;
	}, []);

	const GetGridAsChild = () => {
		return (
			<div className='bidPackage_tooltip_content'>
				<label className='bidPackage_tooltip_label'>Bid Package Details</label>
				<div className='bidPackage_tooltip_grid' style={{height: 200, width: 600}}>
					<SUIGrid
						headers={[
							{
								headerName: "Work Items",
								field: "name",
								minWidth: 270,
								menuTabs: [],
								cellRenderer: (params: any) => {
									if(params?.node?.rowPinned == "bottom") {
										return (
											'Grand Total'
										);
									}
									else {
										return (
											<span>{`${params?.data?.name} - ${params?.data?.costCode} - ${params?.data?.costType}`}</span>
										);
									}
								}
							},
							{
								headerName: "Unit Cost",
								field: "unitCost",
								minWidth: 120,
								menuTabs: [],
								cellRenderer: (params: any) => {
									if(params?.node?.rowPinned == "bottom") {
										return '';
									}
									else {
										return (
											<span>{amountFormatWithSymbol(params?.data?.unitCost)}</span>
										);
									}
								}
							},
							{
								headerName: "UOM",
								field: "unitOfMeasure",
								minWidth: 85,
								menuTabs: [],
								cellRenderer: (params: any) => {
									if(params?.node?.rowPinned == "bottom") {
										return '';
									}
									else {
										return (
											<span>{params?.data?.quantity && getAmountAlignment(params?.data?.quantity)} {params?.data?.unitOfMeasure && params?.data?.unitOfMeasure}</span>
										);
									}
								}
							},
							{
								headerName: "Bid Value",
								field: "bidValue",
								minWidth: 120,
								type: "rightAligned",
								aggFunc: 'sum',
								menuTabs: [],
								cellRenderer: (params: any) => {
									return (
										<span>{amountFormatWithSymbol(params.data.bidValue)}</span>
									);
								}
							}
						]}
						data={budgetItems}
						groupIncludeTotalFooter={false}
						pinnedBottomRowConfig={{
							aggregateFields: ["bidValue"],
							displayFields: {
								name: "Grand Total",
							},
						}}
					></SUIGrid>
				</div>
				<div className='bidPackage_tooltip_footer'>
					<IQButton className='contract-details-tooltip-button'
						endIcon={<span className='common-icon-external' />}
						onClick={() => {window.open(useHotLink(`bid-manager/home?id=${formData?.bidPackage?.id}`), "_blank");}}
					>
						OPEN BID PACKAGE
					</IQButton>
				</div>
			</div>
		);
	};

	const handleDropdownChange = (value: any, name: any) => {
		setFormData({...formData, [name]: value});
	};
	const handleChange = (key: string, value: any) => {
		// console.log("keyyyyy", key, value);
		let formDataClone: any = {};
		if(key == 'upfrontPaymentAmount' && Number(value?.replaceAll(',', '')) > formData?.amount) {
			setAlert({show: true, alertMsg: 'Upfornt Payment should not be more than the Original Contract Amount.'});
		} else if(key == 'retainagePercentage' && Number(value) > 100) {
			setAlert({show: true, alertMsg: 'Retainage Percentage Should not be more than the 100'});
		} else if(['makeUpfrontPayment', 'hasPaymentRetainage'].includes(key)) {
			const amountKey = key == 'makeUpfrontPayment' ? 'upfrontPaymentAmount' : 'retainagePercentage';
			!value ? setFormData({...formData, [key]: value, [amountKey]: 0}) : setFormData({...formData, [key]: value});
			!value && updateContractDetails(appInfo, {[key]: value, [amountKey]: 0}, selectedRecord?.id).then((data: any) => {
				// console.log("updateContractDetails dataaa", data);
				if(errorStatus?.includes(data?.status)) setToast({show: true, message: errorMsg});
				else {
					dispatch(setSelectedRecord(data));
					dispatch(getVendorContractsList(appInfo));
				};
				// else ['ActiveUnlocked', 'AwaitingAcceptanceUnlocked']?.includes(selectedRecord?.status) && dispatch(setEnablePostAndLockBtn(true));
			});
		} else if(['startDate', 'endDate'].includes(key)) {
			setFormData({...formData, [key]: value});
			formDataClone = {...formData, [key]: value};
			const payload = {startDate: new Date(formDataClone?.startDate)?.toISOString(), endDate: new Date(formDataClone?.endDate)?.toISOString()};
			formDataClone?.startDate && formDataClone?.endDate && updateContractDetails(appInfo, payload, selectedRecord?.id).then((data: any) => {
				// console.log("updateContractDetails dataaa date", data);
				if(errorStatus?.includes(data?.status)) setToast({show: true, message: errorMsg});
				else {
					dispatch(setSelectedRecord(data));
					dispatch(getVendorContractsList(appInfo));
				};
				// ['ActiveUnlocked', 'AwaitingAcceptanceUnlocked']?.includes(selectedRecord?.status) && dispatch(setEnablePostAndLockBtn(true));				
			});
		} else if(key == 'upfrontPaymentOption') {
			setFormData({...formData, [key]: value});
			updateContractDetails(appInfo, {[key]: value}, selectedRecord?.id).then((data: any) => {
				if(errorStatus?.includes(data?.status)) setToast({show: true, message: errorMsg});
				else {
					dispatch(setSelectedRecord(data));
				};
			});
		} else {
			setFormData({...formData, [key]: value});
		}
	};

	const handleOnBlur = (key: string, value: any) => {
		setFormData({...formData, [key]: value});
		// console.log("handleOnBlur", key, value, selectedRecord?.[ key ]);
		let callUpdatApi = ['upfrontPaymentAmount', 'retainagePercentage']?.includes(key) ? selectedRecord?.[key] != Number(value?.replaceAll(',', '')) ? true : false : true;
		const payload = key == 'upfrontPaymentAmount' ?
			{'makeUpfrontPayment': true, [key]: value == '' ? 0 : value}
			: key == 'retainagePercentage' ? {'hasPaymentRetainage': true, [key]: value == '' ? 0 : value}
				: {[key]: value};
		callUpdatApi && updateContractDetails(appInfo, payload, selectedRecord?.id).then((data: any) => {
			if(errorStatus?.includes(data?.status)) setToast({show: true, message: errorMsg});
			else {
				// dispatch(setSelectedRecord(data));	
				dispatch(getVendorContractsList(appInfo));
			}
			// ['ActiveUnlocked', 'AwaitingAcceptanceUnlocked']?.includes(selectedRecord?.status) && dispatch(setEnablePostAndLockBtn(true));			
		});
	};

	const preventMinus = (e: any) => {
		if(e.code === 'Minus') {
			e.preventDefault();
		}
	};

	const preventPasteNegative = (e: any) => {
		const clipboardData = e.clipboardData;
		const pastedData = parseFloat(clipboardData.getData('text'));
		if(pastedData < 0) {
			e.preventDefault();
		}
	};

	const handleLockAndPostConfirmation = (type: any) => {
		if(type == 'yes') {
			lockAndPostContract(appInfo, selectedRecord?.id, (response: any) => {
				if(errorStatus?.includes(response?.status)) setToast({show: true, message: errorMsg});
				else {
					console.log("lock response", response);
					dispatch(setSelectedRecord(response));
					dispatch(getVendorContractsList(appInfo));
					setShowLockAlert(false);
					setShowLockSuccessMsg(true);
					dispatch(setLockAndPostContractResponseClick(false));
				}
			});
		} else {
			setShowLockAlert(false);
			dispatch(setLockAndPostContractResponseClick(false));
		}
	};

	const openCompanyRecordModel = (data: any) => {
		postMessage({
			event: "common",
			body: {
				evt: "editcompany",
				companyId: selectedRecord?.vendor?.id,
				readOnly: true
			}
		});
	};

	const tooltipData = formData?.vendor?.pendingCompliances?.map((cert: any) => cert?.name);
	const CompanyComplianceTooltip = (props: any) => {
		const {data, label, ...others} = props;
		return (
			<div className='bidPackage_tooltip_content' style={{margin: '0.5em'}}>
				<label className='bidPackage_tooltip_label'>{label}</label>
				<div style={{width: '100%', display: 'flex', alignItems: 'center', gap: '1em'}}>
					<div>
						<ErrorIcon className="contract_details_errorIcon" />
					</div>
					<div style={{display: 'grid', gap: '5px'}}>
						{data.map((item: any, index: any) => {
							return <div key={index}>{item}</div>;
						})}
					</div>

				</div>
				<div className='bidPackage_tooltip_footer' style={{marginTop: '10px'}}>
					<IQButton className='contract-details-tooltip-button'
						endIcon={<span className='common-icon-external' />}
						onClick={() => openCompanyRecordModel(data)}
					>
						OPEN COMPANY RECORD
					</IQButton>
				</div>
			</div>
		);
	};

	return (
		<div className='contract-details-box' style={{height: 'fit-content !important'}}>
			<div className='contract-details-header'>
				<div className='title-action'>
					<span className='title'>Vendor Details</span>
				</div>
			</div>
			<div className='contract-details-content'>
				<span className='contract-info-tile'>
					<div className='contract-info-label'>
						Vendor Name
						{
							(formData?.status === "ReadyToSubmit" && formData?.vendor?.pendingCompliances?.length) ? (
								<DynamicTooltip title={<CompanyComplianceTooltip data={tooltipData} label={'Pending Company Compliance Verification'} />}
									placement="bottom"
									sx={{
										"& .MuiTooltip-tooltip": {
											background: '#333333'
										}
									}}
								>
									<WarningAmberIcon fontSize={primaryIconSize} style={{color: 'red'}} />
								</DynamicTooltip>
							) : ''}
					</div>
					<div className='contract-info-data-box'>
						<span className="common-icon-companies"></span>
						{formData?.vendor?.image?.downloadUrl && (
							<>
								<span className="contract-info-company-icon">
									<img src={formData?.vendor?.image?.downloadUrl} style={{height: '100%', width: '100%', borderRadius: "50%"}} />
								</span>
							</>
						)}
						<span className='contract-info-data'>
							{formData?.vendor?.name}
						</span>
					</div>
				</span>
				<span className='contract-info-tile'>
					<div className='contract-info-label'>Vendor Email</div>
					<div className='contract-info-data-box'>
						<span className="common-icon-email-message"></span>
						<span className='contract-info-data'>
							{formData?.vendor?.email}
						</span>
					</div>
				</span>
				<span className='contract-info-tile'>
					<div className='contract-info-label'>Vendor Phone
					</div>
					<div className='contract-info-data-box'>
						<span className="common-icon-telephone-gray"></span>
						<span className='contract-info-data'>
							{formatPhoneNumber(formData?.vendor?.phone)}
						</span>
					</div>
				</span>
			</div>
			<div className='contract-details-header'>
				<div className='title-action'>
					<span className='title'>Vendor Point of Contact</span>
				</div>
			</div>
			{/* {formData?.vendor?.pointOfContacts?.map((row: any) => ( */}
			<div className='contract-details-content'>
				<span className='contract-info-tile'>
					<div className='contract-info-label'>Name</div>
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
							<span className='contract-info-data'>{row?.name}</span>
						</div>
					))}
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label'>Email</div>
					{formData?.vendor?.pointOfContacts?.map((row: any) => (
						<div className='contract-info-data-box'>
							<span className="common-icon-email-message"></span>
							<span className='contract-info-data'>{row?.email}</span>
						</div>
					))}
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label'>Phone Number</div>
					{formData?.vendor?.pointOfContacts?.map((row: any) => (
						<div className='contract-info-data-box'>
							<span className="common-icon-telephone-gray"></span>
							<span className='contract-info-data'>{formatPhoneNumber(row?.phone)}</span>
						</div>
					))}
				</span>
			</div>
			{/* // ))} */}
			<div className='contract-details-header'>
				<div className='title-action'>
					<span className='title'>Contract Details</span>
				</div>
			</div>
			<div className='contract-details-content'>
				<span className='contract-info-tile'>
					<div className='contract-info-label'>Bid Package</div>
					<div className='contract-info-data-box'>
						<span className="common-icon-bid-lookup"></span>
						<DynamicTooltip
							title={isUserGC(appInfo) ? <GetGridAsChild /> : null}
							placement="top-start"
							sx={{
								"& .MuiTooltip-tooltip": {
									background: '#333333'
								}
							}}

						>
							<span className={isUserGC(appInfo) ? 'contract-info-data hotlink' : 'contract-info-data'}>{formData?.bidPackage?.name}</span>
						</DynamicTooltip>
						{/* <span className='contract-info-data contract-bid-pack-lbl'>Wind 1 Painting and Interior</span> */}
					</div>
				</span>

				<span className='contract-info-tile date-field'>
					<InputLabel
						required
						className="contract-info-label"
						style={{fontSize: '15px'}}
						sx={{
							"& .MuiFormLabel-asterisk": {
								color: "red",
							},
						}}
					>
						Contract Start Date
					</InputLabel>
					{props?.readOnly ? <div>
						<span style={{verticalAlign: 'sub'}} className='common-icon-DateCalendar contract-info-data'></span>
						<span style={{marginLeft: '10px'}}>{convertDateToDisplayFormat(formData?.startDate)}</span>
					</div>
						: <div className='contract-info-data-box'>
							<span className='contract-info-data'>
								<DatePickerComponent
									containerClassName='iq-customdate-cont'
									defaultValue={convertDateToDisplayFormat(formData?.startDate)}
									onChange={(val: any) => handleChange('startDate', val ? new Date(val)?.toISOString() : val)}
									minDate={new Date()}
									maxDate={formData.endDate ? new Date(formData.endDate) : new Date('12/31/9999')}
									render={
										<InputIcon
											placeholder="MM/DD/YYYY"
											className="custom-input rmdp-input"
										/>
									}
								/>
							</span>
						</div>
					}
				</span>

				<span className='contract-info-tile date-field'>
					<InputLabel
						required
						className="contract-info-label"
						style={{fontSize: '15px'}}
						sx={{
							"& .MuiFormLabel-asterisk": {
								color: "red",
							},
						}}
					>
						Contract End Date
					</InputLabel>
					{props?.readOnly ? <div>
						<span style={{verticalAlign: 'sub'}} className='common-icon-DateCalendar'></span>
						<span style={{marginLeft: '10px'}}>{convertDateToDisplayFormat(formData?.endDate)}</span>
					</div>
						: <div className='contract-info-data-box'>
							<span className='contract-info-data'>
								<DatePickerComponent
									containerClassName='iq-customdate-cont'
									defaultValue={convertDateToDisplayFormat(formData?.endDate)}
									onChange={(val: any) => handleChange('endDate', val ? new Date(val).toISOString() : val)}
									minDate={formData?.startDate ? new Date(formData?.startDate) < new Date() ? new Date() : new Date(formData?.startDate) : new Date()}
									render={
										<InputIcon
											placeholder="MM/DD/YYYY"
											className="custom-input rmdp-input"
										/>
									}
								/>
							</span>
						</div>
					}
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label'>PO Number</div>
					{props?.readOnly ? <div>
						<span className='common-icon-post-contract'></span>
						<span style={{marginTop: '-10px', marginLeft: '10px'}}>{formData?.poNumber}</span>
					</div>
						: <div className='contract-info-data-box'>
							<span className="common-icon-post-contract"></span>
							<TextField
								variant="standard"
								value={formData?.poNumber}
								onChange={(e: any) => handleChange("poNumber", e.target.value)}
								onBlur={(e: any) => handleOnBlur("poNumber", e.target.value)}
							/>
						</div>
					}
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label'>Total Paid to Date</div>
					<div className='contract-info-data-box'>
						<span className="common-icon-contract-amount"></span>
						{amountFormatWithSymbol(formData?.totalPaidToDate)}
					</div>
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label'></div>
					<div className='contract-info-data-box'>
						<span className='budget-info-icon budget-Date-1'></span>
						<span className='contract-info-data'>
						</span>
					</div>
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label' style={{textAlign: "left"}}>Would you like to make Upfront Payment?</div>
				</span>

				<span className='contract-info-tile span-2 division-cost-code-field'>
					<div className='budget-info-label'>
						<RadioGroup value={formData?.makeUpfrontPayment ? 'yes' : 'no'} onChange={(event: any) => handleChange('makeUpfrontPayment', event.target.value == 'yes' ? true : false)}>
							<span>
								<FormControlLabel value={'yes'} control={<Radio />} label="Yes" disabled={props?.readOnly} />
								<FormControlLabel value={'no'} control={<Radio />} label="No" disabled={props?.readOnly} />
								{(formData?.makeUpfrontPayment) && (<><span className='textfield-space-cls'>Enter an Upfront Payment Amount?</span>
									<TextField
										sx={{
											".MuiInputBase-root": {
												// ":before": {
												// 	width: "70%",
												// },
												// ":after": {
												// 	width: "70%",
												// },
												"& .MuiInputBase-input": {
													padding: "8px 0 0px",
												},
											},
										}}
										variant="standard"
										// type='number'
										disabled={props?.readOnly}
										InputProps={{
											inputProps: {min: 0, max: selectedRecord?.amount},
											startAdornment: (
												<InputAdornment position="start">
													<span style={{color: '#333333', marginTop: '6px'}}>{currencySymbol}</span>
												</InputAdornment>
											),

											onKeyPress: (event) => {
												// Allowing only numeric input
												const charCode = event.which ? event.which : event.keyCode;
												if(charCode > 31 && (charCode < 48 || charCode > 57)) {
													event.preventDefault();
												}
											},

										}}
										value={formData?.upfrontPaymentAmount}
										onKeyPress={preventMinus}
										onPaste={preventPasteNegative}

										onChange={(event: any) => {
											console.log("event.target.value", event.target.value, Number(event.target.value?.toLocaleString('en-US')));
											const data = event?.target?.value != '' ? Number(event.target.value.replace(/\,/g, ''))?.toLocaleString('en-US') : '';
											handleChange("upfrontPaymentAmount", data);
										}}
										onBlur={(event: any) => {
											const data = event?.target?.value != '' ? Number(event.target.value.replace(/\,/g, ''))?.toLocaleString('en-US') : '';
											handleOnBlur("upfrontPaymentAmount", data);
										}}
									/>
								</>
								)}
							</span>
						</RadioGroup>
					</div>
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label' style={{textAlign: "left"}}>Upfront Payment Settings</div>
				</span>

				<span className='contract-info-tile span-2 division-cost-code-field'>
					<div className='budget-info-label'>
						<RadioGroup value={formData?.makeUpfrontPayment ? formData?.upfrontPaymentOption : ''} onChange={(event: any) => handleChange('upfrontPaymentOption', event.target.value)}>
							<span>
								<FormControlLabel value={'SplitEquallyOverAllScheduledPayments'} control={<Radio />} label="Split the Upfront amount equally over allSchedule of Value (SOV) payments" disabled={!formData?.makeUpfrontPayment || props?.readOnly} />
								<FormControlLabel value={'DeductFromLastPayment'} control={<Radio />} label="Deduct the Upfront amount from the Last Payment" disabled={!formData?.makeUpfrontPayment || props?.readOnly} />
							</span>
						</RadioGroup>
					</div>
				</span>

				<span className='contract-info-tile'>
					<div className='contract-info-label' style={{textAlign: "left"}}>Is there Payment Retainage?</div>
				</span>

				<span className='contract-info-tile span-2 division-cost-code-field'>
					<div className='budget-info-label'>
						<RadioGroup value={formData?.hasPaymentRetainage ? 'yes' : 'no'} onChange={(event: any) => handleChange("hasPaymentRetainage", event?.target?.value == 'yes' ? true : false)}>
							<span>
								<FormControlLabel value={'yes'} control={<Radio />} label="Yes" disabled={props?.readOnly} />
								<FormControlLabel value={'no'} control={<Radio />} label="No" disabled={props?.readOnly} />
								{(formData?.hasPaymentRetainage) && (
									<>
										<span
											style={{marginRight: '4.25em'}}
										>Enter Retainage Percentage</span>
										<TextField
											sx={{
												".MuiInputBase-root": {
													":before": {
														width: "40%",
													},
													":after": {
														width: "40%",
													},
													"& .MuiInputBase-input": {
														padding: "8px 0 0px",
													},
												},
											}}
											variant="standard"
											type={'number'}
											disabled={props?.readOnly}
											value={formData?.retainagePercentage}
											onKeyPress={preventMinus}
											onPaste={preventPasteNegative}
											InputProps={{
												// min: 0,												
												inputProps: {min: 0, max: 100},
												endAdornment: (
													<InputAdornment position="end">
														<span style={{color: '#333333', marginTop: '6px'}}>{'%'}</span>
													</InputAdornment>
												),
											}}
											onChange={(event: any) =>
												handleChange(
													"retainagePercentage",
													event?.target?.value
												)
											}
											onBlur={(event: any) => {
												handleOnBlur("retainagePercentage", event?.target?.value);
											}}
										/>
									</>
								)}
							</span>
						</RadioGroup>
					</div>
					{
						alert?.show && <SUIAlert
							open={alert}
							onClose={() => {
								setAlert({...alert, show: false});
							}}
							contentText={
								<div>
									<span>{alert?.alertMsg}</span><br />
									<div style={{textAlign: 'right', marginTop: '10px'}}>
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
											onClick={(e: any) => setAlert({...alert, show: false})}>OK</Button>
									</div>
								</div>
							}
							title={'Warning'}
							showActions={false}
						/>
					}
				</span>
			</div>

			<Grid item sm={11.9} className="conttract-notes">
				<InputLabel className='inputlabel' style={{marginBottom: '5px', textAlign: "left"}}>
					<span className='common-icon-adminNote' style={{fontSize: '1.25rem'}}></span>
					Contract Cover Letter
				</InputLabel>
				{props?.readOnly ?
					<span
						dangerouslySetInnerHTML={{
							__html: formData?.coveringLetter,
						}}
					></span>
					: <SUINote
						notes={formData?.coveringLetter}
						onNotesChange={(value: any) => {handleOnBlur("coveringLetter", value);}}
					/>}
			</Grid>
			<Grid item sm={11.9} className="conttract-notes">
				<InputLabel className='inputlabel' style={{marginBottom: '5px', textAlign: "left"}}>
					<span className='common-icon-adminNote' style={{fontSize: '1.25rem'}}></span>
					Inclusions
				</InputLabel>
				{props?.readOnly ?
					<span
						dangerouslySetInnerHTML={{
							__html: formData?.inclusions,
						}}
					></span>
					: <SUINote
						notes={formData?.inclusions}
						onNotesChange={(value: any) => {
							handleOnBlur("inclusions", value);
						}}
					/>}
			</Grid>
			<Grid item sm={11.9} className="conttract-notes">
				<InputLabel className='inputlabel' style={{marginBottom: '5px', textAlign: "left"}}>
					<span className='common-icon-adminNote' style={{fontSize: '1.25rem'}}></span>
					Exclusions
				</InputLabel>
				{props?.readOnly ?
					<span
						dangerouslySetInnerHTML={{
							__html: formData?.exclusions,
						}}
					></span>
					: <SUINote
						notes={formData?.exclusions}
						onNotesChange={(value: any) => {handleOnBlur("exclusions", value);}}
					/>}
			</Grid>
			{
				showLockAlert && <SUIAlert
					open={showLockAlert}
					onClose={() => {
						setShowLockAlert(false);
					}}
					contentText={
						<span>The Vendor You are trying to make a Contract has Pending Company compliance's verification.<br /><br /> Would you still want to go ahead and post the Contract to the vendor?</span>
					}
					title={'Confirmation'}
					onAction={(e: any, type: string) => handleLockAndPostConfirmation(type)}
					showActions={true}
				/>}
			{/* {
				showLockSuccessMsg && <Alert severity="success" className='floating-toast-cls' onClose={() => { setShowLockSuccessMsg(false); }}>
					<span className="toast-text-cls toast-line-cls">
						<b>1</b> Posted Contract and Locked.</span>
					<span className="toast-text-cls toast-line-cls">
						<b>2</b> Notified the response to the Vendor.</span>
				</Alert>

			} */}
			{
				toast?.show && <Toast message={toast?.message} interval={5000} />
			}
		</div>
	);
};

export default memo(ContractDetails);