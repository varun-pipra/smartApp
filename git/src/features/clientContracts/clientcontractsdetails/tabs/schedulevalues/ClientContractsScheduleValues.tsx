import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { Button, IconButton } from "@mui/material";
import "./ClientContractsScheduleValues.scss";
import { useAppDispatch, useAppSelector } from 'app/hooks';
import BudgetManagerRO from "sui-components/BudgetManager/BudgetManager";

import { updateClientContractDetails } from "features/clientContracts/stores/gridAPI";
import { getServer } from "app/common/appInfoSlice";
import { getClientContractDetails, setSelectedRecord } from "features/clientContracts/stores/ClientContractsSlice";
import SUIAlert from "sui-components/Alert/Alert";
import { getBudgets } from "features/clientContracts/stores/CCSovSlice";
import { addBudgets, deleteBudgets } from "features/clientContracts/stores/CCSovAPI";
import { BudgetGrid } from "./BudgetGrid";
import { deleteBillingScheduleByContract } from "features/clientContracts/stores/BillngScheduleAPI";
import InputAdornment from "@mui/material/InputAdornment";
import IQTooltip from 'components/iqtooltip/IQTooltip';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { isUserGCForCC } from "features/clientContracts/utils";
import { amountFormatWithSymbol,amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
import Toast from "components/toast/Toast";

const OpenBudgetManagerButton = styled(Button)({
	boxShadow: "none",
	textTransform: "none",
	backgroundColor: "#ed7532",
	borderRadius: 0,
	"&:hover": {
		backgroundColor: "#ed7532",
	},
});
export const AddBudgetLineItemButton = styled(Button)({
	padding: "6px 12px",
	textTransform: "none",
	lineHeight: 2.5,
	backgroundColor: "#059cdf",
	borderRadius: 3,
	"&:hover": {
		backgroundColor: "#059cdf",
	},
});

const ClientContractScheduleValues = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { selectedRecord } = useAppSelector(state => state.clientContracts);
	const { gridData } = useAppSelector(state => state.cCGrid);

	const { budgetManagerData } = useAppSelector(state => state.cCSov);
	const { settingsData } = useAppSelector(state => state.settings);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [contingencies, setContingencies] = React.useState("no");
	const [fee, setFee] = React.useState("no");
	const [payment, setPayment] = React.useState("no");
	const [contract, setContract] = React.useState("entireBudget");
	const [sovData, setSovData] = React.useState(selectedRecord);
	const [budgetValue, setBudgetValue] = React.useState(0);
	const [alert, setAlert] = React.useState<any>({ show: false, alertMsg: '' });
	const [selectedRows, setSelectedRows] = React.useState<any>([]);
	const [budgetAlert, setBudgetAlert] = React.useState<any>({show:false, type: ''});
	const [disableIncludeEntireBudget, setDisableIncludeEntireBudget] = React.useState<boolean>(false);
	const [toast, setToast] = React.useState<any>({show:false, msg: ''});
	const [openBudget, setOpenBudget] = React.useState<boolean>(false);

	
	React.useEffect(() => {
		if (selectedRecord?.id) {
			
			if (sovData?.addContingencies == true && selectedRecord?.addContingencies == false) {			
				setSovData({ ...sovData, 'addContingencies': true });
			}
			if (sovData?.addFee == true && selectedRecord?.addFee == false) {			
				setSovData({ ...sovData, 'addFee': true });
			}
			if (sovData?.hasDownPayment == true && selectedRecord?.hasDownPayment == false) {			
				setSovData({ ...sovData, 'hasDownPayment': true });
			}
			else {		
				setSovData(selectedRecord);
				dispatch(getBudgets(appInfo));
			}
		}
	}, [selectedRecord]);

	React.useEffect(() => {
		toast?.show && setTimeout(() => {setToast({show: false, msg: ''})}, 5000)
	}, [toast])


	const callUpdateApi = (payload: any, refreshState: boolean = true) => {
		updateClientContractDetails(appInfo, selectedRecord?.id, payload, (response: any) => { dispatch(setSelectedRecord(response)); });
	};

	const handleOnValueChange = (key: string, value: any) => {
		console.log("key, value", key, value);
		if (['contingencyAmount', 'feeAmount', 'downPaymentAmount'].includes(key)) {
			Number(value) > Number(sovData?.totalAmount) ? setAlert({ show: true, alertMsg: 'Amount Should Not be greater then Total contract value' }) : Number(value) < 0 ? setAlert({ show: true, alertMsg: 'Negative values are not allowed.' }) :
				setSovData({ ...sovData, [key]: Number(value) });
		}
		else {
			Number(value) > 100 ? setAlert({ show: true, alertMsg: 'Percentage Should be between 1 to 100.' }) : Number(value) < 0 ? setAlert({ show: true, alertMsg: 'Negative values are not allowed.' })
				: setSovData({ ...sovData, [key]: value });
		}
	};

	const handleRadioButtonChange = (event: any, key: string, type: string) => {
		// console.log("option", event.target.value); 
		if (event.target.value == 'true') {
			setSovData({ ...sovData, [key]: true });
		}
		else {
			const contingenicesObj = { contingencyValueType: 'Amount', contingencyAmount: 0, contingencyPercentage: 0, };
			const feeObj = { feeAmount: 0, feePrecentage: 0, feeValueType: 'Amount' };
			if (type == 'contingenices') {
				setSovData({ ...sovData, [key]: false, ...contingenicesObj });
				callUpdateApi({ [key]: false, ...contingenicesObj }, false);
			} false;
			if (type == 'fee') {
				setSovData({ ...sovData, [key]: false, ...feeObj });
				callUpdateApi({ [key]: false, ...feeObj }, false);

			}
			if (type == 'downPayment') {
				setSovData({ ...sovData, downPaymentAmount: 0, [key]: false });
				callUpdateApi({ [key]: false, downPaymentAmount: 0 }, false);
			}
		}
	};

	const handleTypeChange = (type: any, key: string) => {
		// console.log("type", type, key)
		if (key == 'contingencyValueType') {
			setSovData({ ...sovData, contingencyAmount: null, contingencyPercentage: null, [key]: type });
			// : setSovData({...sovData, contingencyPercentage: null, [key]: type }) 
		}
		else if (key == 'feeValueType') {
			setSovData({ ...sovData, feeAmount: null, feePercentage: null, [key]: type });
		}
	};

	const handleOnBlur = (type: any, key: string) => {
		// setSovData({...sovData, [key]: sovData?.[key]});
		if (type == 'contingenices') {
			sovData?.addContingencies && callUpdateApi({ addContingencies: true, contingencyValueType: sovData?.contingencyValueType, [key]: sovData?.[key] }, false);
		}
		else if (type == 'fee') {
			sovData?.addFee && callUpdateApi({ addFee: true, feeValueType: sovData?.feeValueType, [key]: sovData?.[key] }, false);
		}
		else {
			sovData?.downPaymentAmount && callUpdateApi({ hasDownPayment: true, [key]: sovData?.[key] }, false);
		}
	};
	const getBudgetIds = (data: any) => {
		const idsList = data?.map((obj: any) => {
			if (obj?.clientContract == null) return { id: obj?.id };
		});
		console.log("data", data, idsList);
		return idsList.filter(function (element: any) {
			return element !== undefined;
		});
	};

	const handleBudgetOptionChange = (e: any) => {
		console.log("budgetManagerData", budgetManagerData);
		const payload = getBudgetIds(budgetManagerData);
		e?.target.value == 'entireBudget' && addBudgets(appInfo, selectedRecord?.id, payload, (response: any) => {
			dispatch(setSelectedRecord(response));
		});

		if (selectedRecord?.billingSchedule?.payments?.length > 0) {
			setBudgetAlert({show: true, type:"budgetTypeChange"});
		}
		else {
			e?.target.value == 'entireBudget' ? callUpdateApi({ includeEntireBudget: true }) : callUpdateApi({ includeEntireBudget: false });
		}
	};

	const handlebudgetChange = (type: any) => {
		if (type == 'yes') {
			budgetAlert?.type == 'budgetTypeChange' && deleteBillingScheduleByContract(appInfo, selectedRecord?.id, (response: any) => {
				console.log("response in delete", response);
				selectedRecord?.includeEntireBudget ? callUpdateApi({ includeEntireBudget: false }) : callUpdateApi({ includeEntireBudget: true });
			});
			budgetAlert?.type == 'removeBudget' && deleteBudgets(appInfo, selectedRecord?.id, selectedRows, (response: any) => {
				dispatch(getClientContractDetails({ appInfo: appInfo, contractId: selectedRecord?.id }));
				setToast({show: true, msg: 'The budget line items for the contract have been modified. Please crosscheck the Schedule of Values data is accurate after the changes.'})
			});
			setBudgetAlert({show: false, type: ''});
		} else setBudgetAlert({show: false, type: ''});
	};

	const getHasChangeOrder = (items:any) => {
		let hasChangeOrder = false;
		items?.forEach((item:any) => {
			if(!hasChangeOrder) hasChangeOrder = item?.hasChangeOrder
		})
		return hasChangeOrder;
	}

	return (
		<div className="cc-schedule-values">
			<div className="cc-schedule-values_headers">
				<b>Schedule of Values</b>
			</div>
			<RadioGroup
				name="contract-group"
				value={sovData?.includeEntireBudget === null ? '' : sovData?.includeEntireBudget ? 'entireBudget' : 'subsetOfLineItems'}
				onChange={(event: any) => { handleBudgetOptionChange(event); }}
			>
				<ul className="cc-schedule-values_list">
					<li>
						<div className="cc-schedule-values_list-header">
							How would you like set Schedule of Values for this contract?
							{gridData?.length == 1 && <IQTooltip title="If the `Include Subset of Budget Line Items` option is used to create the first client contract, then all the subsequent client contracts also have to be created using the same option.'Include Entire Budget' Option will not be available from second contract." placement={"bottom"}>
								<span className='common-icon-infoicon' />
							</IQTooltip>}
						</div>
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel
							value="subsetOfLineItems"
							control={<Radio />}
							label="Include Subset of the Budget line items"
							disabled={props?.readOnly}
						/>
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel
							value="entireBudget"
							control={<Radio />}
							label="Include the entire Budget"
							disabled={props?.readOnly || gridData?.length > 1}
						/>
					</li>
				</ul>
			</RadioGroup>

			{sovData?.includeEntireBudget ? (
				<div className="cc-schedule-values_entire-manager">
					<div className="cc-schedule-values_entire-budget-wrap">
						<div>
							Total Number of Budget Line Items: <b>{selectedRecord?.budgetItems?.length}</b>
						</div>
						<div>
							<TextField variant={'outlined'} size={'small'} placeholder={'Search'} style={{ width: "280px" }} />
						</div>
						<div className="cc-schedule-values_entire-budget">
							Grand Total of Entire Budget <b>{amountFormatWithSymbol(sovData?.originalAmount)}</b>
						</div>
					</div>
					<div style={{ height: 250, width: '100%' }}>
						<BudgetGrid data={selectedRecord?.budgetItems ? selectedRecord?.budgetItems : []} checkbox={false} allowMarkupFee={settingsData?.allowMarkupFee} isUserGC={isUserGCForCC(appInfo)}/>
					</div>
				</div>
			)
				: sovData?.includeEntireBudget !== null && (
					<>
						<div className="cc-schedule-values_amount-manager">
							<div className="cc-schedule-values_amount-manager-left">
								<AddBudgetLineItemButton variant="contained" disabled={props?.readOnly || getHasChangeOrder(selectedRecord?.budgetItems)} disableRipple onClick={() => { setOpenBudget(true); dispatch(getBudgets(appInfo)); }}>
									+ Add Budget Line Item
								</AddBudgetLineItemButton>
								<IconButton
									aria-label='Delete Vendor Contract Item'
									disabled={!selectedRows?.length || props?.readOnly || getHasChangeOrder(selectedRecord?.budgetItems)}
									onClick={(e: any) => {
										setBudgetAlert({show: true, type:"removeBudget"});
									}}
								>
									<span className="common-icon-delete"></span>
								</IconButton>
							</div>
							<span className="cc-schedule-values_entire-budget">
								Total Budget Value of selected items <b>{amountFormatWithSymbol(sovData?.originalAmount)}</b>
							</span>
						</div>
						<div style={{ height: 250 }}>
							<BudgetGrid
								data={selectedRecord?.budgetItems ? selectedRecord?.budgetItems : []}
								onRowSelected={(rows: any) => setSelectedRows(rows)}
								checkbox={true}
								allowMarkUpFee={settingsData?.allowMarkupFee}
								isUserGC={isUserGCForCC(appInfo)}
							/>
						</div>
					</>
				)}
			<RadioGroup
				name="contigencies-group"
				value={sovData?.addContingencies ? sovData?.addContingencies : false}
				onChange={(event: any) => handleRadioButtonChange(event, 'addContingencies', 'contingenices')}
			>
				<ul className="cc-schedule-values_list">
					<li className="cc-schedule-values_list-item">
						<div className="cc-schedule-values_list-header">Do you want to add Contingencies</div>
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel value={true} control={<Radio />} label="Yes" disabled={props?.readOnly || !selectedRecord?.budgetItems?.length} />
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel value={false} control={<Radio />} label="No" disabled={props?.readOnly || !selectedRecord?.budgetItems?.length} />
					</li>
					{sovData?.addContingencies && (
						<>
							<li className="cc-schedule-values_list-item">
								<div>Enter Value</div>
							</li>
							<li className="cc-schedule-values_list-item">
								<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
									<Select
										labelId="demo-select-small"
										id="demo-select-small"
										value={sovData?.contingencyValueType}
										className="cc-schedule-values_select"
										disabled={props?.readOnly}
										onChange={(event: any) => handleTypeChange(event.target.value, 'contingencyValueType')}
									>
										<MenuItem value="Amount">Amount
										</MenuItem>
										<MenuItem value="Percentage">Percentage</MenuItem>
									</Select>
								</FormControl>
							</li>
							<li className="cc-schedule-values_list-item cc-schedule-values_tooltip-section">
								<TextField
									id="standard-basic"
									variant="standard"
									value={sovData?.contingencyValueType == 'Amount' ? amountFormatWithOutSymbol(sovData?.contingencyAmount) : sovData?.contingencyPercentage}
									onBlur={() => handleOnBlur('contingenices', sovData?.contingencyValueType == 'Amount' ? 'contingencyAmount' : 'contingencyPercentage')} disabled={props?.readOnly}
									onChange={(e: any) => handleOnValueChange(sovData?.contingencyValueType == 'Amount' ? 'contingencyAmount' : 'contingencyPercentage', e.target.value?.replaceAll(',', ''))}
									InputProps={{
										startAdornment: sovData?.contingencyValueType == 'Amount' && (
											<InputAdornment position='start'>
												<span style={{ color: '#333333' }}>{currencySymbol}</span>
											</InputAdornment>
										),
										endAdornment: sovData?.contingencyValueType == 'Percentage' && (
											<InputAdornment position="end">
												<span style={{ color: '#333333', marginTop: '6px' }}>{'%'}</span>
											</InputAdornment>
										),
									}}
									error={sovData?.contingencyValueType == 'Amount' ? sovData?.contingencyAmount > sovData?.totalAmount ? true : false : false}
									sx={{
										'.MuiInputBase-root:before': {
											borderBottom: sovData?.contingencyValueType == 'Amount' ? sovData?.contingencyAmount > sovData?.totalAmount ? '1px solid red	 !important' : '1px solid #ccc !important' : '1px solid #ccc !important'
										},
										'.MuiInputBase-root': {
											width: sovData?.contingencyValueType == 'Amount' ? sovData?.contingencyAmount > sovData?.totalAmount ? '160px' : '100%' : '100%'
										}
									}}
								/>
								{sovData?.contingencyValueType == 'Amount' ? sovData?.contingencyAmount > sovData?.totalAmount &&

									<IQTooltip
										title={<p className='tooltiptext'>Contingencies Amount should not be greater than Contract Amount.</p>}
										placement={'bottom'}
										arrow={true}
									>
										<WarningAmberIcon fontSize={'small'} style={{ color: 'red', marginTop: '10px' }} />
									</IQTooltip>
									: null}
							</li>
						</>
					)}
				</ul>
			</RadioGroup>
			{ isUserGCForCC(appInfo) && <RadioGroup
				name="fee-group"
				value={sovData?.addFee ? sovData?.addFee : false}
				onChange={(event: any) => handleRadioButtonChange(event, 'addFee', 'fee')}
			>
				<ul className="cc-schedule-values_list">
					<li className="cc-schedule-values_list-item">
						<div className="cc-schedule-values_list-header">Do you want to add a Contract Fee</div>
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel value={true} control={<Radio />} label="Yes" disabled={props?.readOnly || !selectedRecord?.budgetItems?.length} />
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel value={false} control={<Radio />} label="No" disabled={props?.readOnly || !selectedRecord?.budgetItems?.length} />
					</li>
					{sovData?.addFee && (
						<>
							<li className="cc-schedule-values_list-item">
								<div>Enter Value</div>
							</li>
							<li>
								<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
									<Select
										labelId="demo-select-small"
										id="demo-select-small"
										className="cc-schedule-values_select"
										value={sovData?.feeValueType}
										disabled={props?.readOnly}
										onChange={(event: any) => handleTypeChange(event.target.value, 'feeValueType')}
									>
										<MenuItem value="Amount">Amount</MenuItem>
										<MenuItem value="Percentage">Percentage
										</MenuItem>
									</Select>
								</FormControl>
							</li>
							<li className="cc-schedule-values_list-item">
								<TextField id="standard-basic" variant="standard" value={sovData?.feeValueType == 'Amount' ? `${amountFormatWithOutSymbol(sovData?.feeAmount)}` : sovData?.feePercentage}
									onBlur={() => handleOnBlur('fee', sovData?.feeValueType == 'Amount' ? 'feeAmount' : 'feePercentage')} disabled={props?.readOnly}
									onChange={(e: any) => handleOnValueChange(sovData?.feeValueType == 'Amount' ? 'feeAmount' : 'feePercentage', e.target.value?.replaceAll(',', ''))}
									InputProps={{
										startAdornment: sovData?.feeValueType == 'Amount' && (
											<InputAdornment position='start'>
												<span style={{ color: '#333333' }}>{currencySymbol}</span>
											</InputAdornment>
										),
										endAdornment: sovData?.feeValueType == 'Percentage' && (
											<InputAdornment position="end">
												<span style={{ color: '#333333', marginTop: '6px' }}>{'%'}</span>
											</InputAdornment>
										),
									}}
									sx={{
										'.MuiInputBase-root:before': {
											borderBottom: sovData?.feeValueType == 'Amount' ? sovData?.feeAmount > sovData?.totalAmount ? '1px solid red	 !important' : '1px solid #ccc !important' : '1px solid #ccc !important'
										},
										'.MuiInputBase-root': {
											width: sovData?.feeValueType == 'Amount' ? sovData?.feeAmount > sovData?.totalAmount ? '160px' : '100%' : '100%'
										}
									}}
									error={sovData?.feeValueType == 'Amount' ? sovData?.feeAmount > sovData?.totalAmount ? true : false : false}
								/>
								{sovData?.feeValueType == 'Amount' ? sovData?.feeAmount > sovData?.totalAmount &&

									<IQTooltip
										title={<p className='tooltiptext'>Fee Amount should not be greater than Contract Amount.</p>}
										placement={'bottom'}
										arrow={true}
									>
										<WarningAmberIcon fontSize={'small'} style={{ color: 'red', marginTop: '10px' }} />
									</IQTooltip>
									: null}
							</li>
						</>
					)}
				</ul>
			</RadioGroup>     
			}
			<RadioGroup
				name="pay-group"
				value={sovData?.hasDownPayment ? sovData?.hasDownPayment : false}
				onChange={(event: any) => handleRadioButtonChange(event, 'hasDownPayment', 'downPayment')}
			>
				<ul className="cc-schedule-values_list">
					<li className="cc-schedule-values_list-item">
						<div className="cc-schedule-values_list-header">Will there be a Down Payment?</div>
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel value={true} control={<Radio />} label="Yes" disabled={props?.readOnly || !selectedRecord?.budgetItems?.length} />
					</li>
					<li className="cc-schedule-values_list-item">
						<FormControlLabel value={false} control={<Radio />} label="No" disabled={props?.readOnly || !selectedRecord?.budgetItems?.length} />
					</li>
					{sovData?.hasDownPayment && (
						<>
							<li className="cc-schedule-values_list-item">
								<div>Enter Amount</div>
							</li>
							<li className="cc-schedule-values_list-item" style={{ marginLeft: 120 }}>
								<TextField id="standard-basic" variant="standard" value={amountFormatWithOutSymbol(sovData?.downPaymentAmount)}
									onBlur={() => handleOnBlur('downPayment', 'downPaymentAmount')} disabled={props?.readOnly}
									onChange={(e: any) => handleOnValueChange('downPaymentAmount', e.target.value?.replaceAll(',', ''))}
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												<span style={{ color: '#333333' }}>{currencySymbol}</span>
											</InputAdornment>
										)
									}}
									error={sovData?.downPaymentAmount > sovData?.totalAmount ? true : false} />
							</li>
						</>
					)}
				</ul>
			</RadioGroup>
			{
				alert?.show && <SUIAlert
					open={alert?.show}
					onClose={() => {
						setAlert({ ...alert, show: false });
					}}
					contentText={
						<div>
							<span>{alert?.alertMsg}</span><br />
							<div style={{ textAlign: 'right', marginTop: '10px' }}>
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
									onClick={(e: any) => setAlert({ ...alert, show: false })}>OK</Button>
							</div>
						</div>
					}
					title={'Warning'}
					showActions={false}
				/>
			}
			{
				budgetAlert?.show && <SUIAlert
					open={budgetAlert?.show}
					onClose={() => {
						setBudgetAlert({show: false, type: ''});
					}}
					contentText={
						budgetAlert?.type == 'budgetTypeChange' ?
						<div>
							<span>Changing the SOV will remove any Billing Schedules configured.</span>
							<br /> <br />
							<span> Are you sure you want to continue?</span>
						</div> : budgetAlert?.type == 'removeBudget' && <div>
							<span>Are you sure you want to remove the selected Budget Line Item(s)</span>
						</div>
					}
					title={'Confirmation'}
					onAction={(e: any, type: string) => handlebudgetChange(type)}
				/>
			}
			{
				openBudget && <BudgetManagerRO data={budgetManagerData}
					defaultRecords={selectedRecord?.budgetItems?.map((row: any) => row?.id)}
					onAdd={(rows: any) => {
						const existedIds:any = selectedRecord?.budgetItems?.map((row: any) => row?.id);
						const newlyAddedItems = rows?.filter((row:any) => !existedIds?.includes(row?.id))
						console.log("existedIds", existedIds, newlyAddedItems)
						addBudgets(appInfo, selectedRecord?.id, newlyAddedItems, (response: any) => {
							dispatch(setSelectedRecord(response));
						});
					}}
					allowMarkupFee={settingsData?.allowMarkupFee}					
					getBudgetValue={(value: any) => { setBudgetValue(value); }}
					onClose={(val: any) => setOpenBudget(val)} />
			}
			{
				toast?.show && <Toast message={toast.msg} interval={5000} />
			}
		</div>
	);
};
export default ClientContractScheduleValues;
