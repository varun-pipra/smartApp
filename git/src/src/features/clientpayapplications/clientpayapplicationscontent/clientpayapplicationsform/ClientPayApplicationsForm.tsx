import React, { useEffect } from 'react';
import { Box, IconButton, TextField, InputLabel, InputAdornment } from '@mui/material';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InputIcon from 'react-multi-date-picker/components/input_icon';

import './ClientPayApplicationsForm.scss';

import globalStyles, { primaryIconSize } from 'features/budgetmanager/BudgetManagerGlobalStyles';
import IQButton from 'components/iqbutton/IQButton';
import DatePickerComponent from 'components/datepicker/DatePicker';
import CostCodeDropdown from 'components/costcodedropdown/CostCodeDropdown';
import BidPackageName from 'resources/images/bidManager/BidPackageName.svg';
import BudgetLineItem from 'resources/images/bidManager/BudgetLineItem.svg';
import SUIBudgetLineItemSelect from 'sui-components/BudgetLineItemSelect/BudgetLineItemSelect';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getFormattedBudgetLineItems, getISOTime } from 'utilities/commonFunctions';
import { getServer } from 'app/common/appInfoSlice';
import SUIBaseDropdownSelector from 'sui-components/BaseDropdown/BaseDropdown';
import VendorList from 'features/budgetmanager/aggrid/vendor/Vendor';
import GridIcon from "resources/images/common/Grid.svg"
import SmartDropDown from 'components/smartDropdown';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SUIScheduleOfValues from 'sui-components/ScheduleOfValues/ScheduleOfValues';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getClientContractsList } from 'features/clientContracts/stores/gridSlice';
import { getAmountAlignment } from 'utilities/commonutills';
import { getClientContractDetails } from 'features/clientContracts/stores/ClientContractsSlice';
import { setRefreshed, setSelectedClientInCreateForm, setToastMessage } from 'features/clientpayapplications/stores/ClientPayAppsSlice';
import { createClientPayApp } from 'features/clientpayapplications/stores/GridAPI';
import { getClientPayAppsList } from 'features/clientpayapplications/stores/GridSlice';
import { isUserGCForCPA } from 'features/clientpayapplications/utils';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';


const defaultFormData = {
	client: '',
	contract: '',
	amount: 0,
	poNumber: '',
	submittedOn: new Date(),
	billingSchedule: {},
}
const ClientPayApplicationsForm = (props: any) => {

	// Redux State Variable

	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { companiesData } = useAppSelector(state => state.clientContracts)
	const { selectedClientInCreateForm, refreshed } = useAppSelector(state => state.clientPayApps)

	// Local state vaiables

	const [budgetLineItems, setBudgetLineItems] = React.useState<any>([])
	const [formData, setFormData] = React.useState<any>(defaultFormData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);
	const [showToast, setShowToast] = React.useState<any>({ display: false, message: '' })
	const [selectedRecs, setSelectedRecs] = React.useState<any>([]);
	// const [clientContractsList, setClientContractsList] = React.useState<any>([]);
	const [contractsData, setContractsData] = React.useState<any>([]);
	const [billingSovData, setBillingSovData] = React.useState<any>({});
	const [amount, setAmount] = React.useState<Number>(0)
	const [sovRef, setSovRef] = React.useState<any>(null);

	React.useEffect(() => {
		dispatch(getClientContractsList(appInfo))?.then((data: any) => {
			const contractsList: any = [];
			const id = !isUserGCForCPA(appInfo) ? appInfo?.gblConfig?.currentUserCompany?.uniqueId : selectedClientInCreateForm
			console.log("dataaaaa", data?.payload)
			data?.payload?.map((obj: any) => {
				if (obj?.client?.id == id && ['ActiveUnlocked', 'Active'].includes(obj?.status)) {
					contractsList?.push({ id: obj?.id, label: obj?.title, value: obj?.id, poNumber: obj?.poNumber })
				}
			})
			console.log("contractsList", contractsList)
			setContractsData(contractsList)
			dispatch(setRefreshed(false))
			// setSelectedRecs([]);
			// setBillingSovData({});
			// setAmount(0);

		});
	}, [refreshed])

	React.useEffect(() => {
		console.log("AppInfo in VPA", appInfo);
		if (!isUserGCForCPA(appInfo)) {
			const contractsList: any = [];
			dispatch(getClientContractsList(appInfo))?.then((resp) => {
				resp?.payload?.filter((obj: any) => {
					if (obj?.client?.id == appInfo?.gblConfig?.currentUserCompany?.uniqueId && ['ActiveUnlocked', 'Active'].includes(obj?.status)) {
						contractsList?.push({ id: obj?.id, label: obj?.title, value: obj?.id, poNumber: obj?.poNumber })
					}
				})
				setContractsData(contractsList)
			})
		}
	}, [appInfo])

	const getCompanyOptions = () => {
		let groupedList: any = [];
		companiesData?.map((data: any) => {
			groupedList.push({
				...data,
				color: data.colorCode,
				id: data.uniqueId,
				displayField: data.name,
				thumbnailUrl: data.thumbnailUrl,
			});
		});
		return groupedList
	};

	React.useEffect(() => {
		console.log("formmm", formData, selectedRecs);
		let amount = 0;
		selectedRecs?.map((obj: any) => {
			amount = amount + Number(obj?.payoutAmount)
		})
		setAmount(amount)
		if ((isUserGCForCPA(appInfo) ? formData?.client?.length : appInfo?.currentUserInfo?.company) && formData?.contract?.length && selectedRecs?.length) setDisableAddButoon(false)
	}, [formData, selectedRecs])



	// React.useEffect(() => {
	// 	if (companiesData?.length == 1) setFormData({
	// 		...formData, client: [{
	// 			...companiesData[0],
	// 			color: companiesData[0].colorCode,
	// 			id: companiesData[0].uniqueId,
	// 			displayField: companiesData[0].name,
	// 			thumbnailUrl: companiesData[0].thumbnailUrl,
	// 		}]
	// 	})

	// }, [companiesData])

	let gridColumn: any = [
		{
			headerName: "",
			minWidth: 80,
			// type: "rightAligned",
			sortable: false,
			cellRenderer: (params: any) => {
				return props.readOnly ? (
					<div>
						<span className="vc-schedule-values_row-count">
							{params.node.rowIndex + 1}
						</span>
						<span>AT</span>
					</div>
				) : params.node.rowPinned === 'top' ? (
					<div>
						<span>AT</span>
					</div>
				) : (
					<div>
						<span className="vc-schedule-values_row-count">
							{params.node.rowIndex + 1}
						</span>
						<span>AT</span>
					</div>
				);
			},
		},
		{
			headerName: "",
			minWidth: 190,
			sortable: false,
			cellRenderer: (params: any) => {
				return <div>of Work Completion, Pay</div>;
			},
		},
		{
			headerName: "% Payout",
			type: "rightAligned",
			field: "payoutPercentage",
			minWidth: 150,
			menuTabs: [],
			cellStyle: { textAlign: "right" },
		},
		{
			headerName: "Payout Amount",
			field: "payoutAmount",
			type: "currency",
			minWidth: 160,
			menuTabs: [],
			cellStyle: { textAlign: "right" },
		},
		{
			headerName: "Blance Amount",
			field: "balanceAmount",
			type: "rightAligned",
			minWidth: 160,
			menuTabs: [],
			cellStyle: { textAlign: "right" },
			cellRenderer: (params: any) => {
				return (
					<div>
						<span className="balanceAmount">{amountFormatWithSymbol(params.data.balanceAmount)}</span>
						<span className="balance-amt">{` of ${amountFormatWithSymbol('10000')}`}</span>
					</div>
				);
			},
		},
		{
			headerName: "Payment Status",
			field: "status",
			minWidth: 225,
			menuTabs: [],
			cellStyle: { textAlign: "center" },
			cellRenderer: (params: any) => {
				const payStatus = params.data.status;

				if (payStatus === "Paid") {
					let styleOpts = {
						style: { color: payStatus === "Paid" ? "#008000c2" : "red" },
					};
					return <div {...styleOpts}>{payStatus}</div>;
				} else if (payStatus === "ReadyToBePaid") {
					const buttonStyles = {
						backgroundColor: selectedRecs.includes(params.data) ? "#059cdf" : "",
						color: selectedRecs.includes(params.data) ? "#fff" : "",
					};
					return (
						<IQButton className="reday-to-paid-btn"
							variant="outlined"
							color="primary"
							onClick={() => {
								onPaymentStatusClick(params.data);
							}}
							startIcon={
								selectedRecs.includes(params.data) ? (
									<span className="common-icon-tickmark"></span>
								) : (
									<span className="common-icon-add-circle"></span>
								)
							}
							style={buttonStyles}
						>
							{selectedRecs.includes(params.data) ? "Selected For Payment" : "Ready To Be Paid"}
						</IQButton>
					);
				} else if (payStatus === "SelectedForPayment") {
					return (
						<IQButton className="selected-btn"
							color="primary"
							// onClick={() => {
							// 	onPaymentStatusClick(params.data);
							// }}
							startIcon={<span className="common-icon-tickmark"></span>}
						>
							{"Selected For Payment"}
						</IQButton>
					);
				} else {
					return payStatus;
				}
			},
		},
	];

	const percentColumn = {
		headerName: "% Work Completion",
		field: "completionPercentage",
		cellStyle: { textAlign: "center" },
		minWidth: 180,
		menuTabs: [],
	};
	const uomColumn = {
		headerName: "Unit Quantity",
		field: "completionQuantity",
		cellStyle: { textAlign: "center" },
		minWidth: 180,
		menuTabs: [],
		// valueGetter: (params:any) => `${getAmountAlignment(params?.data?.completionQuantity)} ${sov[formData?.workItem?.[0]]?.budgetItem?.unitOfMeasure && params?.data?.completionQuantity > 0 ? sov[formData?.workItem?.[0]]?.budgetItem?.unitOfMeasure : ''}`
	};
	const dollarAmountColumn = {
		headerName: "Work Stage",
		field: "workStage",
		cellStyle: { textAlign: "left" },
		minWidth: 180,
		menuTabs: [],
	};
	const [headers, setHeaders] = React.useState<any>(gridColumn)

	React.useEffect(() => {
		console.log("ffffffff", billingSovData, formData,)
		billingSovData?.type != 'PercentComplete' && gridColumn.splice(2, 1);
		gridColumn.splice(1, 0, billingSovData?.type == 'PercentComplete' ? percentColumn : billingSovData?.type == 'UnitOfMeasure' ? uomColumn : dollarAmountColumn);
		setHeaders([...gridColumn]);
	}, [formData?.contract, billingSovData])

	const onPaymentStatusClick = (rec: any) => {
		const isFound = selectedRecs.indexOf(rec);
		isFound === -1 ? selectedRecs.push(rec) : selectedRecs.splice(isFound, 1);
		setSelectedRecs([...selectedRecs]);
		setHeaders([...gridColumn]);
	};

	useEffect(() => {
		if (sovRef) {
			sovRef?.current?.api.forEachNode((node: any) => {
				if (selectedRecs.findIndex((rec: any) => rec.id === node.data.id) > -1) {
					node.setSelected(true);
				} else {
					node.setSelected(false);
				}
			});
		}
	}, [gridColumn])

	// onchange methods

	const handleOnChange = (value: any, name: any) => {
		console.log("client,", name, value)
		if (name == 'client') {
			dispatch(setSelectedClientInCreateForm(value[0]?.id))
			dispatch(getClientContractsList(appInfo))?.then((data: any) => {
				const contractsList: any = [];
				// setClientContractsList(data?.payload)
				console.log("dataaaaa", data?.payload)
				data?.payload?.map((obj: any) => {
					if (obj?.client?.id == value[0]?.id && ['ActiveUnlocked', 'Active'].includes(obj?.status)) {
						contractsList?.push({ id: obj?.id, label: obj?.title, value: obj?.id, poNumber: obj?.poNumber })
					}
				})
				console.log("contractsList", contractsList)
				setContractsData(contractsList)
				setSelectedRecs([]);
				setBillingSovData({});
				setAmount(0);

			});
		}
		if (name == 'contract') {
			setSelectedRecs([]);
			setAmount(0)
			dispatch(getClientContractDetails({ appInfo: appInfo, contractId: value[0] })).then((data: any) => {
				console.log("contract", data?.payload)
				setBillingSovData(data?.payload?.billingSchedule);
				// setFormData({ ...formData, poNumber: data?.payload?.poNumber });

			})
		}
		setFormData({ ...formData, [name]: value });
	};

	const handleAdd = () => {

		const paymentIds = selectedRecs?.map((obj: any) => { return { id: obj?.id } })
		const payload = {
			submittedOn: new Date(formData?.submittedOn)?.toISOString(),
			billingSchedule: { payments: [...paymentIds] },
		};
		createClientPayApp(appInfo, payload, (response: any) => {
			dispatch(setToastMessage('Client Pay App Item created Successfully'))
			setDisableAddButoon(true);
			dispatch(getClientPayAppsList(appInfo));
			setFormData(defaultFormData);
			setAmount(0);
			setSelectedRecs([]);
		})
	};


	return <div className='client-pay-application-form'>
		<p className='form-title'>Create New Client Pay Applications</p>
		<div className='client-pay-apps-lineitem-form'>
			<div className='first-section'>
				<div style={{
					width: '30%',
					padding: 'unset',
				}} className='company-field'>
					<InputLabel required className='inputlabel' sx={{
						'& .MuiFormLabel-asterisk': {
							color: 'red'
						}
					}}>Client Company</InputLabel>
					{isUserGCForCPA(appInfo) ? <SUIBaseDropdownSelector
						value={formData?.client}
						width="100%"
						menuWidth="200px"
						icon={<span className="common-icon-Companies"> </span>}
						placeHolder={'Select'}
						dropdownOptions={getCompanyOptions()}
						handleValueChange={(value: any, params: any) => handleOnChange(value, 'client')}
						showFilterInSearch={false}
						multiSelect={false}
						companyImageWidth={'17px'}
						companyImageHeight={'17px'}
						showSearchInSearchbar={true}
						addCompany={false}
					></SUIBaseDropdownSelector>
						: <div>
							<span className="common-icon-Companies"> </span>&nbsp;<span>{appInfo?.currentUserInfo?.company}</span>
						</div>
					}
				</div>
				<div className='contract-field'>
					<InputLabel required className='inputlabel' sx={{
						'& .MuiFormLabel-asterisk': {
							color: 'red'
						}
					}}>Contract</InputLabel>
					<SmartDropDown
						LeftIcon={<span className='common-icon-contracts'></span>}
						options={contractsData ? contractsData : []}
						outSideOfGrid={true}
						isSearchField={false}
						isFullWidth
						Placeholder={'Select'}
						selectedValue={formData.contract}
						// menuProps={classes.menuPaper}
						handleChange={(value: any) => handleOnChange(value, 'contract')}
					/>
				</div>
				<div className='po-field'>
					<InputLabel className='inputlabel'>PO Number</InputLabel>

					<TextField
						id='name'
						fullWidth
						InputProps={{
							readOnly: true,
							startAdornment: (
								<span className='common-icon-post-contract'></span>
							)
						}}
						name='name'
						variant='standard'
						value={formData?.poNumber}
					// onChange={(e: any) => handleOnChange(e.target.value, 'name')}
					/>
				</div>
				<div className='start-date-field'>
					<InputLabel className='inputlabel'>Submitted Date</InputLabel>
					{/* <span className='budget-Date-1'></span> */}
					<DatePickerComponent
						defaultValue={formData?.submittedOn}
						onChange={(val: any) => handleOnChange(val, 'submittedOn')}

						minDate={new Date()}
						// maxDate={formData.endDate !== '' ? new Date(formData.endDate) : new Date('12/31/9999')}
						containerClassName={'iq-customdate-cont'}
						render={
							<InputIcon
								placeholder={"MM/DD/YYYY"}
								className={'custom-input rmdp-input'}
								style={{ background: '#f7f7f7' }}
							/>
						}
					/>
				</div>
				<div className='amount-field'>
					<InputLabel className='inputlabel'>Amount</InputLabel>
					<TextField
						id='name'
						fullWidth
						InputProps={{
							readOnly: true,
							startAdornment: (
								<span className='common-icon-contract-amount'></span>
							)
						}}
						name='name'
						variant='standard'
						value={getAmountAlignment(amount)}
					// onChange={(e: any) => handleOnChange(e.target.value, 'name')}
					/>
				</div>
				<IQButton
					color='orange'
					sx={{ height: '2.5em' }}
					disabled={disableAddButton}
					onClick={handleAdd}
				>
					+ ADD
				</IQButton>
			</div>
			<div className='second-section'>
				<div className='schedule-values'>
					<SUIScheduleOfValues
						label={"Schedule of Values"}
						required={true}
						selectedRecs={selectedRecs}
						cmpWidth={"60%"}
						gridData={billingSovData?.payments ? billingSovData?.payments : []}
						gridColumn={headers}
						getReference={(tabRef: any) => { setSovRef(tabRef) }}
					/>
				</div>
			</div>
		</div>
	</div>
};
export default ClientPayApplicationsForm;