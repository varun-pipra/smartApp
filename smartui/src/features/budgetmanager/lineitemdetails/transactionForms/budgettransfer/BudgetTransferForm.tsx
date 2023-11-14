import React from "react";
import { GridView } from "@mui/icons-material";
import { Box, Grid, InputAdornment, InputLabel, Stack, TextField } from "@mui/material";
import IQTextArea from "components/iqtextarea/IQTextArea";
import IQTextField from "components/iqtextfield/IQTextField";
import SmartDialog from "components/smartdialog/SmartDialog"
import SmartDropDown from "components/smartDropdown";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import './BudgetTransferForm.scss';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Button, ButtonDesign } from "@ui5/webcomponents-react";
import globalStyles, { primaryIconSize } from "features/budgetmanager/BudgetManagerGlobalStyles";
import { getCostCodeDivisionList, getCostTypeList, getServer } from "app/common/appInfoSlice";
import CostCodeDropdown from "components/costcodedropdown/CostCodeDropdown";
import { Validate } from "./BudgetTransferFormValidation";
import Toast from "components/toast/Toast";
import { addTransaction } from "features/budgetmanager/operations/transactionsApi";
import { fetchTransactionsData } from "features/budgetmanager/operations/transactionsSlice";

const CreateBudgetTransfer = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const costCodeDivisionOpts: any = useAppSelector(getCostCodeDivisionList);
	const { gridData, originalGridApiData } = useAppSelector((state) => state.gridData);
	const { selectedRow } = useAppSelector((state) => state.rightPanel);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const defaultData = {
		fromBudgetLineItem: '',
		toBudgetLineItem: `${selectedRow.division} - ${selectedRow.costCode} - ${selectedRow.costType}`,
		transferAmount: '',
		notes: '',
		type: 4,
	}
	const [formData, setFormData] = React.useState<any>(defaultData)
	const [options, setOptions] = React.useState<any>();
	const [availableBalance, setAvailableBalances] = React.useState<any>({
		fromAvailableBalc: 0,
		fromId: '',
	});
	const [disableCreate, setDisableCreate] = React.useState<boolean>(true);
	const [toast, setToast] = React.useState<any>({ displayToast: false, text: '' });

	React.useEffect(() => {
		const divisionsList: any = []
		const filteredGriData = originalGridApiData.map((obj: any, index: number) => {
			if (!(divisionsList.includes(obj.division)) && obj.name !== selectedRow.name) {
				// console.log("indexxxx", index)
				const nestedOptions = originalGridApiData.map((row: any, index: number) => {
					if (row.division === obj.division && row.name !== selectedRow.name) {
						return { id: index + 1, name: `${row.division} - ${row.costCode} - ${row.costType}` };
					}
				});
				const nestedOptionsData = nestedOptions.filter(function (element: any) {
					return element !== undefined;
				});
				divisionsList.push(obj.division);
				return {
					id: obj.name,
					name: `${obj.division}`,
					options: nestedOptionsData
				}
			}
		})
		const data = filteredGriData.filter(function (element: any) {
			return element !== undefined;
		});

		data.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
		setOptions(data);
	}, [originalGridApiData, selectedRow]);

	const handleSubmit = () => {
		const data = {
			amount: Math.abs(Number(formData.transferAmount.replace(',', ''))),
			type: formData.type,
			vendorId: null,
			description: formData.notes,
			invoicePONumber: '',
			attachment: [],
			status: 1,
			transferredFrom: props.type === 4 ? availableBalance.fromId : selectedRow.id,
		}

		addTransaction(appInfo, data, props.type === 4 ? selectedRow.id : availableBalance.fromId, (response: any) => {
			dispatch(fetchTransactionsData({ "appInfo": appInfo, id: selectedRow.id }));
			setFormData({ ...defaultData, fromBudgetLineItem: formData.fromBudgetLineItem });
		});
		setToast({
			displayToast: true,
			text: `${amountFormatWithSymbol(formData?.transferAmount)} gets 
			${props.type === 5 ? 'deducted from' : 'added to'}  the Revised Budget and Remaining Balance.`
		});
		// setFormData(defaultData)
		setDisableCreate(true);

	}
	const checkTransferAmountIsGreaterThenAvailable = (availableBalc: any, transferBalc: any) => {
		if (formData.fromBudgetLineItem !== '' && transferBalc !== '') {
			if (Number(availableBalc) < Number(transferBalc.replaceAll(",", ''))) {
				setToast((previousInputs: any) => ({ ...toast, text: 'The transfer amount cannot be greater than the Available Balance', displayToast: true }))
			}
		}
	}

	const handleOnChange = (value: any, key: string) => {
		const val = key === 'transferAmount' ? !isNaN(value.replaceAll(',', '')) ? value : formData.transferAmount : value
		const formDataClone: any = { ...formData, [key]: val }
		setToast({ ...toast, text: 'None', displayToast: false })
		setToast((previousInputs: any) => ({ ...previousInputs, text: 'None', displayToast: false }))

		setFormData(formDataClone);
		if (['fromBudgetLineItem', 'transferAmount'].includes(key)) {
			if (key === 'fromBudgetLineItem') {
				const selecedItem = originalGridApiData.filter((row: any) => `${row.division} - ${row.costCode} - ${row.costType}` === val);
				setAvailableBalances({ fromAvailableBalc: selecedItem[0].balance, fromId: selecedItem[0].id });
				checkTransferAmountIsGreaterThenAvailable(selecedItem[0].balance, formData.transferAmount);
				setDisableCreate(Validate(formDataClone, selecedItem[0].balance))
			}
			else {
				// setTimeout(() => {
				// 	checkTransferAmountIsGreaterThenAvailable(availableBalance.fromAvailableBalc, val)
				// },
				// 	1000)
				// setDisableCreate(Validate(formDataClone, availableBalance.fromAvailableBalc))
				if (props.type == 5) {
					checkTransferAmountIsGreaterThenAvailable(selectedRow?.balance, val) // added line
					setDisableCreate(Validate(formDataClone, selectedRow.balance))
				}
				else {
					checkTransferAmountIsGreaterThenAvailable(availableBalance.fromAvailableBalc, val);
					setDisableCreate(Validate(formDataClone, availableBalance.fromAvailableBalc))
				}
				//setDisableCreate(Validate(formDataClone, availableBalance.fromAvailableBalc))
			}
		}
	}

	return (
		<>
			<Grid container className='main-grid' pl={3.5} pr={3.5}>
				<Grid item sm={12}>
					<CostCodeDropdown
						label={props.type === 4 ? "From Budget Line Item" : "To Budget Line Item"}
						options={options?.length > 0 ? options : []}
						required={true}
						selectedValue={formData.fromBudgetLineItem !== null && formData.division && formData.costCode ? formData.division + '|' + formData.costCode : ''}
						startIcon={<GridView fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />}
						checkedColor={'#0590cd'}
						onChange={(value: any) => handleOnChange(value?.split('|')[1], 'fromBudgetLineItem')}
						showFilter={true}
						sx={{
							".MuiSelect-icon": {
								display: "none",
							}
						}}
					/>
				</Grid>
				<Stack direction='row' ml={3} mt={1}>
					<InputLabel className='inputlabel'>Available Balance:</InputLabel>
					{
						formData.fromBudgetLineItem !== '' ?
							<InputLabel className='balanceTag'>{amountFormatWithSymbol(availableBalance?.fromAvailableBalc)}</InputLabel>
							: <></>
					}
				</Stack>
				<Grid item sm={11} mt={2}>
					<InputLabel className='inputlabel'>{props.type === 4 ? "To Budget Line Item" : "From Budget Line Item"}</InputLabel>
					<Stack direction="row" mt={1} spacing={1}>
						<GridView
							fontSize={primaryIconSize}
							style={{ color: globalStyles.primaryColor }}
						/>
						<InputLabel style={{ fontWeight: '540' }}>
							{`${selectedRow.division} - ${selectedRow.costCode} - ${selectedRow.costType}`}
						</InputLabel>
					</Stack>
				</Grid>
				{
					<Stack direction='row' ml={3} mt={0.5}>
						<InputLabel className='inputlabel'>Available Balance:     </InputLabel>
						<InputLabel className='balanceTag'>{amountFormatWithSymbol(selectedRow?.balance)}</InputLabel>
					</Stack>
				}

				<Grid container spacing={1} mt={1}>
					<Grid item sm={6}>
						<InputLabel required className='inputlabel' sx={{
							'& .MuiFormLabel-asterisk': {
								color: 'red'
							}
						}}>Transfer Amount</InputLabel>
						<IQTextField fullWidth variant="standard" label="" InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<GridView fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor, marginRight: '5px' }}
									/>
									<span>{currencySymbol}</span>
								</InputAdornment>
							)
						}}
							value={!['', '-'].includes(formData.transferAmount) ? amountFormatWithOutSymbol(Number(formData.transferAmount?.replace(/\,/g, ''))) : formData.transferAmount}
							onChange={(e: any) => handleOnChange(`${e.target.value?.toLocaleString("en-US")}`, 'transferAmount')}
						/>
					</Grid>
					<Grid item sm={12} mt={3}>
						<InputLabel className='inputlabel' style={{ marginBottom: '5px' }}>
							<DescriptionOutlinedIcon style={{ marginBottom: '-4px' }} fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />
							Notes
						</InputLabel>
						<TextField
							id="notes"
							variant='outlined'
							fullWidth
							multiline
							maxRows={10}
							placeholder='Enter Notes'
							name='notes'
							value={formData.notes}
							onChange={(e: any) => handleOnChange(`${e.target.value}`, 'notes')}

						/>
					</Grid>
				</Grid>
			</Grid>
			<Stack mr={3.3} mt={1}>
				<Box display="flex" justifyContent="end" alignItems="end" >
					<Button design={ButtonDesign.Attention} onClick={handleSubmit} disabled={disableCreate} style={{ border: `1px solid ${globalStyles.primaryColor}`, color: globalStyles.primaryColor }}>SUBMIT</Button>
				</Box>
				{
					toast.displayToast ?
						<Toast message={toast.text} interval={3000} />
						: null
				}
			</Stack>
		</>
	)
}

export default CreateBudgetTransfer;