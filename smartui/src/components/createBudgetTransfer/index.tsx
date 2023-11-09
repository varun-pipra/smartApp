import React from "react";
import { GridView } from "@mui/icons-material";
import { Grid, InputAdornment, InputLabel, Stack } from "@mui/material";
import IQTextArea from "components/iqtextarea/IQTextArea";
import IQTextField from "components/iqtextfield/IQTextField";
import SmartDialog from "components/smartdialog/SmartDialog"
import SmartDropDown from "components/smartDropdown";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import './styles.scss';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Button, ButtonDesign } from "@ui5/webcomponents-react";
import globalStyles, { primaryIconSize } from "features/budgetmanager/BudgetManagerGlobalStyles";
import { getCostCodeDivisionList, getCostTypeList } from "app/common/appInfoSlice";
import CostCodeDropdown from "components/costcodedropdown/CostCodeDropdown";
import { Validate } from "./validation";


interface IProps {
	open: boolean;
	handleClose: () => void;
}
const defaultData = {
	fromBudgetLineItem: '',
	toBudgetLineItem: '',
	transferAmount: '',
	notes: ''
}

const CreateBudgetTransfer = (props: IProps) => {
	const dispatch = useAppDispatch();
	const costCodeDivisionOpts: any = useAppSelector(getCostCodeDivisionList);
	const { gridData } = useAppSelector((state) => state.gridData);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { open } = props;
	const [formData, setFormData] = React.useState<any>(defaultData)
	const [options, setOptions] = React.useState<any>();
	const [availableBalances, setAvailableBalances] = React.useState<any>({
		'fromBudgetLineItem': 0,
		'toBudgetLineItem': 0,
	});
	const [disableCreate, setDisableCreate] = React.useState<boolean>(true);

	React.useEffect(() => {
		const divisionsList: any = []
		const options = gridData.map((obj: any, index: number) => {
			if (!(divisionsList.includes(obj.division))) {
				const nestedOptions = gridData.map((row: any, index: number) => {
					if (row.division === obj.division) {
						return { id: index + 1, name: `${row.division} - ${row.costCode} - ${row.costType}` };
					}
				});
				const nestedOptionsData = nestedOptions.filter(function (element: any) {
					return element !== undefined;
				});
				divisionsList.push(obj.division);
				return {
					id: index + 1,
					name: `${obj.division}`,
					options: nestedOptionsData
				}
			}
		})
		const data = options.filter(function (element: any) {
			return element !== undefined;
		});
		data.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
		setOptions(data);
	}, [gridData]);

	const handleClose = () => {
		if (props.handleClose) props.handleClose();
	}
	const handleCreate = () => {

	}
	const handleOnChange = (value: any, key: string) => {
		const formDataClone: any = { ...formData, [key]: value }
		setFormData(formDataClone);
		if (['fromBudgetLineItem', 'toBudgetLineItem'].includes(key)) {
			setAvailableBalances({ ...availableBalances, [key]: gridData.filter((row: any) => `${row.division} - ${row.costCode} - ${row.costType}` === value)[0].revisedBudget })
		}
		setDisableCreate(Validate(formDataClone))
	}

	return (<SmartDialog open={props.open}
		PaperProps={{
			sx: { height: '20%', width: '20%', minWidth: '37%', minHeight: '55%' },
		}}
		custom={{
			closable: true,
			title: 'Create Budget Transfer',
			// tools: optionalTools
		}}
		onClose={handleClose}
	>
		<Grid container >
			<Grid item ml={2} sm={11}>
				<CostCodeDropdown
					label="From Budget Line Item"
					options={options?.length > 0 ? options : []}
					required={true}
					selectedValue={formData.division + '|' + formData.costCode}
					startIcon={<GridView fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />}
					checkedColor={'#0590cd'}
					onChange={(value: any) => handleOnChange(value?.split('|')[1], 'fromBudgetLineItem')}
					showFilter={false}
				/>
			</Grid>
			{
				formData.fromBudgetLineItem !== '' ?
					<InputLabel style={{ marginLeft: '15px', marginTop: '5px' }} className='inputlabel'>{`Available Balance: ${currencySymbol} ${availableBalances?.fromBudgetLineItem?.toLocaleString("en-US")}`}</InputLabel>
					: <></>
			}
			<Grid item ml={2} sm={11} mt={3}>
				<CostCodeDropdown
					label="To Budget Line Item"
					options={options?.length > 0 ? options : []}
					required={true}
					selectedValue={formData.division + '|' + formData.costCode}
					startIcon={<GridView fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />}
					checkedColor={'#0590cd'}
					onChange={(value: any) => handleOnChange(value?.split('|')[1], 'toBudgetLineItem')}
					showFilter={false}
				/>
			</Grid>
			{
				formData.toBudgetLineItem !== '' ?
					<InputLabel style={{ marginLeft: '15px', marginTop: '5px' }} className='inputlabel'>{`Available Balance: ${currencySymbol} ${availableBalances?.toBudgetLineItem?.toLocaleString("en-US")}`}</InputLabel>
					: <></>
			}
		</Grid>
		<Grid container spacing={1} mt={1} className='main-grid'>
			<Grid item ml={2} sm={6} mt={2}>
				<InputLabel required className='inputlabel'>Transfer Amount</InputLabel>
				<IQTextField fullWidth variant="standard" label="" InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<GridView fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }}
							/>
						</InputAdornment>
					)
				}}
					value={formData.transferAmount}
					onChange={(e: any) => handleOnChange(`${e.target?.value?.toLocaleString("en-US")}`, 'transferAmount')}
				/>
			</Grid>
			<Grid item sm={5.5}>
				<InputLabel className='inputlabel'>
					<DescriptionOutlinedIcon fontSize={primaryIconSize} sx={{ color: globalStyles.primaryColor }} />
					Notes
				</InputLabel>
				<IQTextArea fullWidth
					// style={{ paddingBottom: '5px' }}
					label=' '
					value={formData.notes}
					onChange={(e: any) => handleOnChange(e.target.value, 'notes')}
				/>
			</Grid>
		</Grid>
		<Grid container spacing={1} mt={1} className='import-button'>
			<Button
				design={ButtonDesign.Emphasized} onClick={handleCreate}
				disabled={disableCreate}
			>
				CREATE
			</Button>
		</Grid>
	</SmartDialog>
	)
}

export default CreateBudgetTransfer;