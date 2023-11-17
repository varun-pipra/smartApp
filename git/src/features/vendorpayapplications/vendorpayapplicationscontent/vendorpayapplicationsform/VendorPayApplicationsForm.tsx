import React, { useEffect } from 'react';
import { Box, IconButton, TextField, InputLabel, InputAdornment } from '@mui/material';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InputIcon from 'react-multi-date-picker/components/input_icon';

import './VendorPayApplicationsForm.scss';

import globalStyles, { primaryIconSize } from 'features/budgetmanager/BudgetManagerGlobalStyles';
import IQButton from 'components/iqbutton/IQButton';
import DatePickerComponent from 'components/datepicker/DatePicker';
import CostCodeDropdown from 'components/costcodedropdown/CostCodeDropdown';
import BidPackageName from 'resources/images/bidManager/BidPackageName.svg';
import BudgetLineItem from 'resources/images/bidManager/BudgetLineItem.svg';
import SUIBudgetLineItemSelect from 'sui-components/BudgetLineItemSelect/BudgetLineItemSelect';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import convertDateToDisplayFormat, { getFormattedBudgetLineItems, getISOTime } from 'utilities/commonFunctions';
import { fetchGridData } from 'features/bidmanager/stores/gridSlice';
import { createBidPackage } from 'features/bidmanager/stores/gridAPI';
import { getServer } from 'app/common/appInfoSlice';
import SUIBaseDropdownSelector from 'sui-components/BaseDropdown/BaseDropdown';
import VendorList from 'features/budgetmanager/aggrid/vendor/Vendor';
import GridIcon from "resources/images/common/Grid.svg"
import SmartDropDown from 'components/smartDropdown';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import WorkItemsDropdown from "sui-components/WorkItemsDropdown/WorkItemsDropdown";
import SUIScheduleOfValues from 'sui-components/ScheduleOfValues/ScheduleOfValues';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getCompanyData, getContractDetailsById } from 'features/vendorcontracts/stores/VendorContractsSlice';
import { getBudgetItemsByPackage, getVendorContractsList } from 'features/vendorcontracts/stores/gridSlice';
import { getAmountAlignment } from 'utilities/commonutills';
import { isUserGCForVPA } from 'features/vendorpayapplications/utils';
import { createVendorPayApps } from 'features/vendorpayapplications/stores/gridApi';
import { getVendorPayAppsLst, setRefreshed } from 'features/vendorpayapplications/stores/gridSlice';
import { setSelectedVendorInCreateForm, setToastMessage } from 'features/vendorpayapplications/stores/VendorPayAppSlice';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
const defaultFormData = {
	company: '',
	contract: '',
	poNumber: '',
	submittedOn: new Date()
};

const VendorPayApplicationsForm = (props: any) => {
	// Redux State Variable
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const CompanyData = useAppSelector(getCompanyData)
	const { refreshed } = useAppSelector((state) => state.VPAGrid);
	const { selectedVendorInCreateForm } = useAppSelector((state) => state.vendorPayApps);

	// Local state vaiables
	const [budgetLineItems, setBudgetLineItems] = React.useState<any>([])
	const [formData, setFormData] = React.useState<any>(defaultFormData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);
	const [showToast, setShowToast] = React.useState<any>({ display: false, message: '' });
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [selectedRecs, setSelectedRecs] = React.useState<any>([]);
	const [contractsData, setContractsData] = React.useState<any>([])
	const [sov, setSovs] = React.useState<any>({})
	const [workItemOptions, setWorkItemOptions] = React.useState<any>([])
	const [gridData, setGridData] = React.useState<any>([])
	const [amount, setAmount] = React.useState<Number>(0)
	const [vendorContractsList, setVendorContractsList] = React.useState<any>([])
	const [sovRef, setSovRef] = React.useState<any>(null);
	React.useEffect(() => {
		dispatch(getVendorContractsList(appInfo)).then((data: any) => {
			setVendorContractsList(data?.payload)
		});
	}, [appInfo, refreshed])

	React.useEffect(() => {
		const id = !isUserGCForVPA(appInfo) ? appInfo?.gblConfig?.currentUserCompany?.uniqueId : refreshed && selectedVendorInCreateForm
		// if ()) {
		const contractsList: any = [];
		id && vendorContractsList?.filter((obj: any) => {
			if (obj?.vendor?.id == id && ['ActiveUnlocked', 'Active'].includes(obj?.status)) {
				contractsList?.push({ id: obj?.id, label: obj?.title, value: obj?.id, poNumber: obj?.poNumber })
			}
		})
		setContractsData(contractsList)
		dispatch(setRefreshed(false))
		// }
	}, [vendorContractsList, appInfo])

	const getCompanyOptions = () => {
		let groupedList: any = [];
		const vendorIds = vendorContractsList?.map((obj: any) => { if (['Active', 'ActiveUnlocked']?.includes(obj?.status)) return obj?.vendor?.id })
		CompanyData?.map((data: any) => {
			if (vendorIds?.includes(data?.id)) {
				groupedList.push({
					...data,
					color: data.colorCode,
					id: data.id,
					displayField: data.name,
					thumbnailUrl: data.thumbnailUrl,
				});
			}
		});
		return groupedList
	};

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
						<span className="balance-amt">{` of ${amountFormatWithSymbol(sov[formData?.workItem?.[0]]?.budgetItem?.bidValue)}`}</span>
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
							{selectedRecs.includes(params.data) ? "Selected For Payment" : "Ready to Payment"}
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
		valueGetter: (params: any) => `${getAmountAlignment(params?.data?.completionQuantity)} ${sov[formData?.workItem?.[0]]?.budgetItem?.unitOfMeasure && params?.data?.completionQuantity > 0 ? sov[formData?.workItem?.[0]]?.budgetItem?.unitOfMeasure : ''}`
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
		sov[formData?.workItem?.[0]]?.type != 'PercentComplete' && gridColumn.splice(2, 1);
		gridColumn.splice(1, 0, sov[formData?.workItem?.[0]]?.type == 'PercentComplete' ? percentColumn : sov[formData?.workItem?.[0]]?.type == 'UnitOfMeasure' ? uomColumn : dollarAmountColumn);
		setHeaders([...gridColumn]);
		setGridData(sov[formData?.workItem?.[0]]?.payments ? sov[formData?.workItem?.[0]]?.payments : [])
	}, [formData?.workItem])

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

	// Effects
	React.useEffect(() => {
		contractsData?.map((obj: any) => {
			if (obj?.id == formData?.contract?.[0]) {
				setFormData({ ...formData, poNumber: obj?.poNumber ? obj?.poNumber : '' })
			}
		})
	}, [formData?.contract])

	React.useEffect(() => {
		let amount = 0;
		selectedRecs?.map((obj: any) => {
			amount = amount + Number(obj?.payoutAmount)
		})
		setAmount(amount)
		if ((isUserGCForVPA(appInfo) ? formData?.company?.length : appInfo?.currentUserInfo?.company) && formData?.contract?.length && selectedRecs?.length) setDisableAddButoon(false)
	}, [formData, selectedRecs])

	const checkStatus = (sov: any) => {
		let status = false;
		sov?.payments?.map((obj: any) => {
			if (obj?.status == 'ReadyToBePaid') status = true;
		})
		return status;
	}


	// onchange methods
	const handleOnChange = (value: any, name: any) => {
		if (name == 'company') {
			dispatch(setSelectedVendorInCreateForm(value[0]?.id))
			// dispatch(getVendorContractsList(appInfo)).then((data:any) => {
			const contractsList: any = []
			vendorContractsList?.filter((obj: any) => {
				if (obj?.vendor?.id == value[0]?.id && ['ActiveUnlocked', 'Active'].includes(obj?.status)) {
					contractsList?.push({ id: obj?.id, label: obj?.title, value: obj?.id, poNumber: obj?.poNumber })
				}
			})
			setContractsData(contractsList);
			// })
		}
		if (name == 'contract') {
			let sovObj: any = {}
			setWorkItemOptions([])
			dispatch(getContractDetailsById({ appInfo: appInfo, id: value[0] })).then((data: any) => {
				const options = data?.payload?.scheduleOfValues?.map((obj: any) => {
					sovObj = { ...sovObj, [obj?.budgetItem?.id]: obj };
					const isReadyToBePaidFound = checkStatus(obj);
					return {
						value: obj?.budgetItem?.id,
						label: `${obj?.budgetItem?.name} - ${obj?.budgetItem?.costCode} - ${obj?.budgetItem?.costType}`,
						// status: sovObj[obj?.budgetItem?.id]?.status == 'ReadyToBePaid' ? 'completed' : 'pending',
						amount: obj?.budgetItem?.bidValue,
						status: isReadyToBePaidFound ? 'completed' : 'pending'
					}
				})
				setSovs(sovObj);
				setWorkItemOptions(options);
			})
			setGridData([]);
			setSelectedRecs([]);
			// dispatch(getBudgetItemsByPackage({appInfo: appInfo, packageId: value[0]})).then((data:any) => {
			// 	const options = data?.payload?.budgetItems?.map((obj:any) => {
			// 		return {
			// 			value: obj?.id,
			// 			label: `${obj?.name} - ${obj?.costCode} - ${obj?.costType}`,
			// 			status: sovObj[obj?.id]?.status == 'ReadyToPaid' ? 'completed' : 'pending',
			// 			amount: obj?.bidValue
			// 		}
			// 	})
			// })
		}
		setFormData({ ...formData, [name]: value })
	};

	const handleAdd = () => {
		const sov = selectedRecs?.map((obj: any) => { return { id: obj?.id } })
		const payload = {
			submittedOn: new Date(formData?.submittedOn)?.toISOString(),
			scheduleOfValues: [{ payments: [...sov] }]
		};
		createVendorPayApps(appInfo, payload, (response: any) => {
			dispatch(setToastMessage('Vendor Pay Item created Successfully'));
			setDisableAddButoon(true);
			dispatch(getVendorPayAppsLst(appInfo));
			setFormData(defaultFormData);
			setAmount(0);
			setWorkItemOptions([]);
			setSelectedRecs([]);
		})
	};
	return (
		<div className="vendor-pay-application-form">
			<p className="form-title">Create New Vendor Pay Applications</p>
			<div className="vendor-pay-apps-lineitem-form ">
				<div className="first-section">
					<div
						style={{
							width: "30%",
							padding: "unset",
						}}
						className="company-field"
					>
						<InputLabel
							required
							className="inputlabel"
							sx={{
								"& .MuiFormLabel-asterisk": {
									color: "red",
								},
							}}
						>
							Company
						</InputLabel>
						{isUserGCForVPA(appInfo) ? <SUIBaseDropdownSelector
							value={formData?.company}
							width="100%"
							menuWidth="200px"
							icon={<span className="common-icon-Companies"> </span>}
							placeHolder={'Select Vendor'}
							dropdownOptions={getCompanyOptions()}
							handleValueChange={(value: any, params: any) => handleOnChange(value, 'company')}
							showFilterInSearch={false}
							multiSelect={false}
							companyImageWidth={'17px'}
							companyImageHeight={'17px'}
							showSearchInSearchbar={true}
							addCompany={false}
						></SUIBaseDropdownSelector>
							: <div>
								<span className="common-icon-Companies"> </span>&nbsp;<span>{appInfo?.currentUserInfo?.company}</span>
							</div>}
					</div>
					<div className="contract-field">
						<InputLabel
							required
							className="inputlabel"
							sx={{
								"& .MuiFormLabel-asterisk": {
									color: "red",
								},
							}}
						>
							Contract
						</InputLabel>
						<SmartDropDown
							LeftIcon={<span className="common-icon-contracts"> </span>}
							options={contractsData ? contractsData : []}
							outSideOfGrid={true}
							isSearchField={false}
							isFullWidth
							Placeholder={'Select'}
							selectedValue={formData.contract}
							// menuProps={classes.menuPaper}
							isMultiple={false}
							handleChange={(value: any) => handleOnChange(value, 'contract')}
						/>
					</div>
					<div className="po-field">
						<InputLabel className="inputlabel">PO Number</InputLabel>

						<TextField
							id="name"
							fullWidth
							InputProps={{
								readOnly: true,
								startAdornment: (
									<span className="common-icon-post-contract"></span>
								),
							}}
							name="name"
							variant="standard"
							value={formData?.poNumber}
						// onChange={(e: any) => handleOnChange(e.target.value, 'poNumber')}
						/>
					</div>
					<div className="start-date-field">
						<InputLabel className="inputlabel">Submitted Date</InputLabel>
						{/* <span className='budget-Date-1'></span> */}
						<DatePickerComponent
							containerClassName='iq-customdate-cont'
							defaultValue={convertDateToDisplayFormat(formData?.submittedOn)}
							onChange={(val: any) => handleOnChange(val, 'submittedOn')}
							// maxDate={new Date(formData.endDate)}
							render={
								<InputIcon
									placeholder="MM/DD/YYYY"
									className="custom-input rmdp-input"
								/>
							}
						/>
					</div>
					<div className="amount-field">
						<InputLabel className="inputlabel">Amount</InputLabel>

						<TextField
							id="name"
							fullWidth
							InputProps={{
								readOnly: true,
								startAdornment: (
									<InputAdornment position="start">
										<span className="common-icon-contract-amount">&nbsp;</span>
										<span>{currencySymbol}</span>
									</InputAdornment>
								),
							}}
							name="name"
							variant="standard"
							value={amountFormatWithOutSymbol(amount)}
						// onChange={(e: any) => handleOnChange(e.target.value, 'name')}
						/>
					</div>
					<IQButton
						color="orange"
						sx={{ height: "2.5em" }}
						disabled={disableAddButton}
						onClick={handleAdd}
					>
						+ ADD
					</IQButton>
				</div>
				<div className="second-section">
					<div className="work-items">
						<WorkItemsDropdown
							lineItemlabel="Work Items"
							dropDownListExtraColumns={[
								{ name: "amount", showVlaueOnTop: false, dataKey: "amount" },
								{
									name: "status",
									showIcon: false,
									dataKey: "status",
									showValueOnTop: false,
									showTooltip: true,
									tooltipData: {
										completed:
											"One or more Schedule of Values are met and ready to be paid.",
										pending: "",
									},
								},
								{ name: "pagination", showValueOnTop: true },
							]}
							options={workItemOptions}
							handleInputChange={(val: any) => { handleOnChange(val, 'workItem') }}
							ignoreSorting={true}
							selectedValue={formData?.workItem}
						></WorkItemsDropdown>
					</div>
					<div className="schedule-values">
						{/* <SUIBudgetLineItemSelect
						required={true}
						lineItemlabel="Schedule Of Values"
						options={budgetLineItems}
					// handleInputChange={(values: any) => handleOnChange(values, 'budgetIds')}
					// selectedValue={formData?.budgetIds?.length ? formData.budgetIds : []}
					></SUIBudgetLineItemSelect> */}
						<SUIScheduleOfValues
							label={"Schedule of Values"}
							required={true}
							selectedRecs={selectedRecs}
							cmpWidth={"100%"}
							gridData={gridData}
							gridColumn={headers}
							getReference={(tabRef: any) => { setSovRef(tabRef) }}
						></SUIScheduleOfValues>
					</div>
				</div>
			</div>
		</div>
	);
};
export default VendorPayApplicationsForm;