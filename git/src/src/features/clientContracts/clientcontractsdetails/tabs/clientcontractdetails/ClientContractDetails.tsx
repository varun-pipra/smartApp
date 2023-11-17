import React, { useRef, useEffect, useCallback, memo } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { useAppDispatch, useAppSelector } from "app/hooks";
import "./ClientContractDetails.scss";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import convertDateToDisplayFormat, { formatPhoneNumber } from "utilities/commonFunctions";
import { getServer } from "app/common/appInfoSlice";
import DatePickerComponent from "components/datepicker/DatePicker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import SUINote from "sui-components/Note/Note";
import { InputAdornment, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { updateClientContractDetails } from "features/clientContracts/stores/gridAPI";
import { setEnablePostAndLockBtn, setSelectedRecord } from "features/clientContracts/stores/ClientContractsSlice";
import { getClientContractsList } from "features/clientContracts/stores/gridSlice";
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

interface ClientContractDetailsProps { readOnly?: boolean; }

const ClientContractDetails = (props: ClientContractDetailsProps) => {
	const dispatch = useAppDispatch();
	const { selectedRecord } = useAppSelector(state => state.clientContracts);

	const [formData, setFormData] = React.useState<any>({
		...selectedRecord,
	});
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);

	React.useEffect(() => {
		setFormData(selectedRecord);
	}, [selectedRecord]);

	const gridIcon = React.useMemo<React.ReactElement>(() => {
		return <div className="common-icon-info-icon common-icon-Budgetcalculator"></div>;
	}, []);

	const handleChange = (name: any, value: any) => {
		const formDataClone = { ...formData, [name]: value };
		setFormData({ ...formData, [name]: value });
		if (['startDate', 'endDate']?.includes(name)) {
			const payload = { startDate: new Date(formDataClone?.startDate)?.toISOString(), endDate: new Date(formDataClone?.endDate)?.toISOString() }
			formDataClone?.startDate && formDataClone?.endDate && updateClientContractDetails(appInfo, selectedRecord?.id, payload, (response: any) => {
				dispatch(setSelectedRecord(response));
				dispatch(getClientContractsList(appInfo));
				dispatch(setEnablePostAndLockBtn(true));
			})
		} else {
			name != 'poNumber' && updateClientContractDetails(appInfo, selectedRecord?.id, { [name]: value }, (response: any) => {
				dispatch(setSelectedRecord(response));
				dispatch(getClientContractsList(appInfo));
				dispatch(setEnablePostAndLockBtn(true));
			})
		}
	}

	const handleOnBlur = (key: string, value: any) => {
		updateClientContractDetails(appInfo, selectedRecord?.id, { [key]: value }, (response: any) => {
			dispatch(setSelectedRecord(response));
			dispatch(getClientContractsList(appInfo));
			dispatch(setEnablePostAndLockBtn(true));
		})

	};

	return (
		<div className="client-contract-details-box">
			<div className="client-contract-details-header">
				<div className="title-action">
					<span className="title">Client Company Details</span>
				</div>
			</div>
			<div className="client-contract-details-content">
				<span className="client-contract-info-tile">
					<div className="client-contract-info-label">Company Name</div>
					<div className='contract-info-data-box'>
						<span className="common-icon-companies"></span>
						{formData?.client?.image?.downloadUrl && (
							<>
								<span className="contract-info-company-icon">
									<img src={formData?.client?.image?.downloadUrl} style={{ height: '100%', width: '100%', border: '1px solid #ccc', borderRadius: "50%" }} />
								</span>
							</>
						)}
						<span className='contract-info-data' style={{ marginLeft: '0.5em' }}>
							{formData?.client?.name}
						</span>
					</div>
				</span>
				<span className="client-contract-info-tile">
					<div className="client-contract-info-label">Vendor ID</div>
					<div className="client-contract-info-data-box">
						<span className="common-icon-email-message"></span>
						<span className="client-contract-info-data">
							{formData?.client?.vendorId}
						</span>
					</div>
				</span>
				<span className="client-contract-info-tile">
					<div className="client-contract-info-label">Company Phone</div>
					<div className="client-contract-info-data-box">
						<span className="common-icon-telephone-gray"></span>
						<span className="client-contract-info-data">{formData?.client?.phone}</span>
					</div>
				</span>
			</div>
			<div className="client-contract-details-header">
				<div className="title-action">
					<span className="title">Client Company Point of Contact</span>
				</div>
			</div>
			<div className='client-contract-details-content'>
				<span className='client-contract-info-tile'>
					<div className='client-contract-info-label'>Name</div>
					{formData?.client?.pointOfContacts?.map((row: any) => (
						<div className='client-contract-info-data-box'>
							<span className="common-icon-name"></span>
							{row?.image?.downloadUrl && (
								<>
									<span className="contract-info-company-icon">
										<img src={row?.image?.downloadUrl} style={{ height: '100%', width: '100%', borderRadius: "50%" }} />
									</span>
								</>
							)
							}
							<span className='client-contract-info-data'>{row?.name}</span>
						</div>
					))}
				</span>

				<span className='client-contract-info-tile'>
					<div className='client-contract-info-label'>Email</div>
					{formData?.client?.pointOfContacts?.map((row: any) => (
						<div className='client-contract-info-data-box'>
							<span className="common-icon-email-message"></span>
							<span className='client-contract-info-data'>{row?.email}</span>
						</div>
					))}
				</span>

				<span className='client-contract-info-tile'>
					<div className='client-contract-info-label'>Phone Number</div>
					{formData?.client?.pointOfContacts?.map((row: any) => (
						<div className='client-contract-info-data-box'>
							<span className="common-icon-telephone-gray"></span>
							<span className='client-contract-info-data'>{formatPhoneNumber(row?.phone)}</span>
						</div>
					))}
				</span>
			</div>
			<div className="client-contract-details-header">
				<div className="title-action">
					<span className="title">Contract Details</span>
				</div>
			</div>
			<div className="client-contract-details-content" id="client-contract-details-content">
				<span className="client-contract-info-tile date-field">
					<div className="client-contract-info-label">Contract Start Date</div>
					{props?.readOnly ? <div>
						<span style={{ verticalAlign: 'sub' }} className='common-icon-DateCalendar contract-info-data'></span>
						<span style={{ marginLeft: '10px' }}>{convertDateToDisplayFormat(formData?.startDate)}</span>
					</div>
						: <div className='contract-info-data-box'>
							<span className='contract-info-data'>
								<DatePickerComponent
									containerClassName='iq-customdate-cont'
									defaultValue={convertDateToDisplayFormat(formData?.startDate)}
									onChange={(val: any) => handleChange('startDate', new Date(val)?.toISOString())}
									minDate={new Date()}
									maxDate={formData?.endDate ? new Date(formData?.endDate) : new Date('12/31/9999')}
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

				<span className="client-contract-info-tile date-field">
					<div style={{ verticalAlign: 'sub' }} className="client-contract-info-label">Contract End Date</div>
					{props?.readOnly ? <div>
						<span className='common-icon-DateCalendar' style={{ verticalAlign: 'sub' }}></span>
						<span style={{ marginLeft: '10px' }}>{convertDateToDisplayFormat(formData?.endDate)}</span>
					</div>
						: <div className='contract-info-data-box'>
							<span className='contract-info-data'>
								<DatePickerComponent
									containerClassName='iq-customdate-cont'
									defaultValue={convertDateToDisplayFormat(formData?.endDate)}
									onChange={(val: any) => handleChange('endDate', new Date(val)?.toISOString())}
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

				<span className="client-contract-info-tile">
					<div className="client-contract-info-label"></div>
					<div className="client-contract-info-data-box">
						<span className="client-contract-info-data">

						</span>
					</div>
				</span>

				<span className="client-contract-info-tile">
					<div className="client-contract-info-label">PO Number</div>
					{props?.readOnly ? <div>
						<span className='common-icon-post-contract'></span>
						<span style={{ marginTop: '-10px', marginLeft: '10px' }}>{formData?.poNumber}</span>
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

				<span className="client-contract-info-tile">
					<div className="client-contract-info-label">Total Paid to Date</div>
					<div className="client-contract-info-data-box">
						<span className="common-icon-contract-amount"></span>
						{amountFormatWithSymbol(formData?.totalPaidToDate)}
					</div>
				</span>

				<span className="client-contract-info-tile">
					<div className="client-contract-info-label"></div>
					<div className="client-contract-info-data-box">
						<span className="budget-info-icon budget-Date-1"></span>
						<span className="client-contract-info-data"></span>
					</div>
				</span>
			</div>

			<Grid item sm={11.9} className="client-conttract-notes">
				<InputLabel className="inputlabel" style={{ marginBottom: "5px", fontWeight: "bold", textAlign: "left" }}>
					<span className="common-icon-adminNote" style={{ fontSize: "1.25rem" }}></span>
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
						onNotesChange={(value: any) => { handleChange("coveringLetter", value) }}
					/>}
			</Grid>
			<Grid item sm={11.9} className="client-conttract-notes">
				<InputLabel className="inputlabel" style={{ marginBottom: "5px", fontWeight: "bold", textAlign: "left" }}>
					<span className="common-icon-adminNote" style={{ fontSize: "1.25rem" }}></span>
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
						onNotesChange={(value: any) => { handleChange("inclusions", value) }}
					/>}
			</Grid>
			<Grid item sm={11.9} className="client-conttract-notes">
				<InputLabel className="inputlabel" style={{ marginBottom: "5px", fontWeight: "bold", textAlign: "left" }}>
					<span className="common-icon-adminNote" style={{ fontSize: "1.25rem" }}></span>
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
						onNotesChange={(value: any) => { handleChange("exclusions", value) }}
					/>}
			</Grid>
		</div>
	);
};
export default memo(ClientContractDetails);