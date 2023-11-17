import React from 'react';
import { Grid, InputLabel, TextField, ClickAwayListener, MenuItem, InputAdornment, Checkbox, FormControlLabel, Card, checkboxClasses, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import SmartDialog from 'components/smartdialog/SmartDialog';
import GridViewIcon from '@mui/icons-material/GridView';
import SmartDropDown from 'components/smartDropdown';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, ButtonDesign } from '@ui5/webcomponents-react';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
import globalStyles, { primaryIconSize } from 'features/budgetmanager/BudgetManagerGlobalStyles';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { postMessage } from 'app/utils';
import { addTransaction } from 'features/budgetmanager/operations/transactionsApi';
import { fetchTransactionsData, setUploadedFilesFromDrive, setUploadedFilesFromLocal } from 'features/budgetmanager/operations/transactionsSlice';
import { getServer } from 'app/common/appInfoSlice';
import VendorList from "features/budgetmanager/aggrid/vendor/Vendor";
import { AddDirectCostFormValidation } from './DirectCostFormValidation';
import IQTextArea from 'components/iqtextarea/IQTextArea';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Toast from 'components/toast/Toast';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import './DirctCostForm.scss';

interface AddDirectCostFormProps {
	type?: number;
}

const AddDirectCostForm = (props: AddDirectCostFormProps) => {
	const dispatch = useAppDispatch();
	const defaultData = {
		amount: '',
		vendorId: null,
		description: '',
		invoicePONumber: '',
		attachment: [],
		status: 1,
		type: props.type
	}
	const [openFileAttachOptions, setOpenFileAttachOptions] = React.useState<boolean>(false);
	const [formData, setFormData] = React.useState<any>(defaultData);
	const { selectedRow } = useAppSelector(state => state.rightPanel);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { uploadedFilesFromLocal, uploadedFilesFromDrive } = useAppSelector(state => state.transactionsData)
	const appInfo = useAppSelector(getServer);
	const [disableSubmit, setDisableSubmit] = React.useState<boolean>(true);
	const [uploadedFileNames, setUploadedFileNames] = React.useState<string>('');
	const [toast, setToast] = React.useState<any>({ displayToast: false, text: '' });

	const getFileNames = (files: any) => {
		let fileNames = '';
		files.map((file: any) => {
			fileNames = fileNames + file.name + ', '
		})

		return fileNames;
	}

	React.useEffect(() => {
		const files = [...uploadedFilesFromLocal, ...uploadedFilesFromDrive];
		setFormData({ ...formData, 'attachment': files });

		setUploadedFileNames(getFileNames(files));
	}, [uploadedFilesFromDrive, uploadedFilesFromLocal])

	React.useEffect(() => {
		if (uploadedFileNames) {

			setOpenFileAttachOptions(false);
		}

	}, [uploadedFileNames])

	const handleOnChange = (e: any) => {
		const { name, value } = e.target;

		const formDataClone = { ...formData, [name]: name === 'amount' ? !isNaN(value.replaceAll(',', '')) ? value : formData.amount : value }

		setFormData(formDataClone);
		setDisableSubmit(AddDirectCostFormValidation(formDataClone));
		setToast({ ...toast, displayToast: false })
	}
	const handleSelectFromLocal = () => {
		postMessage({ event: 'getlocalfiles', body: {} });

	}
	const handleSelectFromDrive = () => {
		postMessage({ event: 'getdrivefiles', body: {} });
	};
	const handleAttachFileButton = () => {
		setOpenFileAttachOptions(true);
	}
	const handleDropdownChange = (value: any, name: string) => {

		const formDataClone = { ...formData, [name]: value }
		setFormData(formDataClone);

		setDisableSubmit(AddDirectCostFormValidation(formDataClone));
		setToast({ ...toast, displayToast: false });
	};
	const handleSubmit = () => {
		const payload = { ...formData, 'amount': props.type === 1 ? -(Number(formData.amount.replace(',', ''))) : Number(formData.amount.replace(',', '')), vendorId: formData.vendorId[0] };

		addTransaction(appInfo, payload, selectedRow.id, (response: any) => {
			dispatch(fetchTransactionsData({ "appInfo": appInfo, id: selectedRow.id }));
			setFormData({ ...defaultData, vendorId: formData.vendorId });
		});
		setDisableSubmit(true);
		setUploadedFileNames('');
		setToast({
			displayToast: true,
			text: `${amountFormatWithSymbol(formData?.amount)} gets 
			${props.type === 1 ? 'deducted from' : 'added to'} the Remaining Balance.`
		});
		dispatch(setUploadedFilesFromLocal([]));
		dispatch(setUploadedFilesFromDrive([]));

	}
	return (<>
		<Stack direction='column' ml={3.5} mt={1}>
			<Grid container spacing={2}>
				<Grid item sm={6}>
					<InputLabel required className='inputlabel' sx={{
						'& .MuiFormLabel-asterisk': {
							color: 'red'
						}
					}}>Amount</InputLabel>
					<TextField
						id="amount"
						fullWidth
						placeholder={`Enter Amount`}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<MonetizationOnRoundedIcon fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor, marginRight: '5px' }} />
									<span>{currencySymbol}</span>
								</InputAdornment>
							)
						}}
						name='amount'
						variant="standard"
						value={!['', '-'].includes(formData.amount) ? amountFormatWithOutSymbol(Number(formData?.amount?.replace(/\,/g, ''))) : formData.amount}
						onChange={handleOnChange}
					/>
				</Grid>
				<Grid item sm={5.7}>
					<InputLabel required className='inputlabel'
						sx={{
							'& .MuiFormLabel-asterisk': {
								color: 'red'
							}
						}}>Vendor Name</InputLabel>
					<VendorList
						multiSelect={false}
						width={'100%'}
						value={formData.vendorId !== null ? formData.vendorId : ''}
						handleVendorChange={(value: any, params: any) => handleDropdownChange(value, 'vendorId')}
						outSideOfGrid={true}
						icon={<AccountBalanceOutlinedIcon fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor }} />}
						showFilter={true}
					/>
				</Grid>

			</Grid>
			<Grid container mt={3}>
				<Grid item sm={11.7}>
					<InputLabel className='inputlabel' style={{ marginBottom: '5px' }}>
						<DescriptionOutlinedIcon style={{ marginBottom: '-4px' }} fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />
						Description
					</InputLabel>
					<TextField
						id="description"
						variant='outlined'
						fullWidth
						multiline
						maxRows={10}
						placeholder='Enter Description'
						name='description'
						value={formData.description}
						onChange={handleOnChange}
						style={{ width: '100%' }}
					/>
				</Grid>
			</Grid>
			<Grid container spacing={2} mt={1}>
				<Grid item sm={6}>
					<InputLabel className='inputlabel'>Invoice/PO No.</InputLabel>
					<TextField
						id="invoice"
						fullWidth
						placeholder='Invoice\PO.No'
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<GridViewIcon fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor }} />
								</InputAdornment>

							)
						}}
						name='invoicePONumber'
						variant="standard"
						value={formData.invoicePONumber}
						onChange={handleOnChange}
					/>
				</Grid>
				<Grid item sm={5.7}>
					<InputLabel className='inputlabel'>Attach File</InputLabel>
					<TextField
						id="attachFile"
						placeholder='Attach File'
						fullWidth
						// select
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AddBoxRoundedIcon fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor }}
										onClick={handleAttachFileButton}
									/>
								</InputAdornment>
							)
						}}
						SelectProps={{ IconComponent: () => null }}
						name='attachment'
						variant="standard"
						value={uploadedFileNames}
						onClick={handleAttachFileButton}
					>
					</TextField>
					{
						openFileAttachOptions ?
							<ClickAwayListener onClickAway={(e: any) => setOpenFileAttachOptions(false)}>

								<Card className='attach-file-cls'>
									<InputLabel className='inputlabel option-cls' onClick={handleSelectFromLocal}>Select From Local</InputLabel>
									<InputLabel className='inputlabel option-cls' onClick={handleSelectFromDrive}>Select From Drive</InputLabel>
								</Card>
							</ClickAwayListener>
							: <></>
					}
				</Grid>
				{/* <Grid item sm={4} mt={2.5}>
					<Checkbox name='isChangeOrder' checked={formData.isChangeOrder} onChange={(e) => setFormData({ ...formData, 'isChangeOrder': e.target.checked })} sx={{
						[`&.${checkboxClasses.checked}`]: {
							color: '#0590cd',
						},
					}} />
					<InputLabel className='inputlabel' style={{marginLeft:'35px', marginTop: '-30px'}}>Add as Budget change order Modification</InputLabel>					
				</Grid> */}

			</Grid>
			<Stack mr={2.5} mt={1}>
				<Box display="flex" justifyContent="end" alignItems="end" >
					<Button design={ButtonDesign.Attention} onClick={handleSubmit} disabled={disableSubmit} style={{ border: `1px solid ${globalStyles.primaryColor}`, color: globalStyles.primaryColor }}>SUBMIT</Button>
				</Box>
				{
					toast.displayToast ?
						<Toast message={toast.text} interval={3000} />
						: null
				}
			</Stack>
		</Stack>

	</>)

}

export default AddDirectCostForm;