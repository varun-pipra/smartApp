import { Button, ButtonDesign, StandardListItem, ListSeparators } from '@ui5/webcomponents-react';
import "@ui5/webcomponents-icons/dist/expense-report.js";
import React from 'react';
import { Stack, Typography, Divider, List, ListItem, ListItemText, ListItemIcon, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import './General.scss';
import IQToggle from 'components/iqtoggle/IQToggle';
import CostCodeDropdown from "components/costcodedropdown/CostCodeDropdown";
import SmartDropDown from "components/smartDropdown";
import { getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { addSettings } from '../../../operations/settingsAPI';
import { fetchSettings, setDivisionOrCostTypeChanged, setOpenAlert } from "../../../operations/settingsSlice";
import { settingcostcodetypeData } from 'data/SettingsCosttypeData';
import { makeStyles, createStyles } from '@mui/styles';

import { isLocalhost } from "app/utils";
import SUIAlert from 'sui-components/Alert/Alert';
import AlertDialog from '../../Alert';
import { fetchGridData } from 'features/budgetmanager/operations/gridSlice';

const planningSettingsArray = [
	{ label: 'Show Cost', enabled: true },
	{ label: 'Show Balance', enabled: true },
	{ label: 'Show Budget', enabled: true }
];

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 'calc(100% - 350px) !important',
			maxWidth: '315px !important',
			minWidth: '315px !important',
		}
	})
);

const useStyles3: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxHeight: 'calc(100% - 350px) !important',
			maxWidth: '120px !important',
			minWidth: 'fit-content !important',
		}
	})
);
const GeneralSettings = (props: any) => {
	const classes = useStyles();
	const classes3 = useStyles3();
	const appInfo = useAppSelector(getServer);
	const dispatch = useAppDispatch();
	const { gridData, originalGridApiData } = useAppSelector((state: any) => state.gridData);
	const [openBudgetTransfer, setOpenBudgetTransfer] = React.useState<boolean>(false);
	const [checked, setChecked] = React.useState<any>({});
	const { settingsData, CostCodeAndTypeData, defaultData, openAlert, divisionOrCostTypeChanged } = useAppSelector(state => state.settings);
	const [planningSettings, setPlanningSettings] = React.useState<any>(planningSettingsArray);
	const [formData, setFormData] = React.useState<any>(settingsData);

	// console.log('formData', formData);
	const [localhost] = React.useState(isLocalhost);
	const [costTypeListData, setCostTypeListData] = React.useState<any>([]);
	const [costCodeListData, setCostCodeListData] = React.useState<any>([]);

	React.useEffect(() => {
		const costCodeList: any = [];
		const costTypeList: any = [];
		if (localhost) {
			if (settingcostcodetypeData.values && settingcostcodetypeData.values.length > 0) {
				const newOptions = settingcostcodetypeData.values.map((type: any) => {
					type?.listCategories?.length && type?.listCategories.forEach((obj: any) => {
						if (obj.id === 2) costCodeList.push({ label: type.name, value: type.id });
						if (obj.id === 4) costTypeList.push({ label: type.name, value: type.id });

					})
					return { label: type.name, value: type.id };
				});
				// setCostTypeListData(newOptions);
			}
		} else {

			if (CostCodeAndTypeData.values && CostCodeAndTypeData.values.length > 0) {

				const newOptions = CostCodeAndTypeData.values.map((type: any) => {
					type?.listCategories?.length && type?.listCategories.forEach((obj: any) => {
						if (obj.id === 2) costCodeList.push({ label: type.name, value: type.id });
						if (obj.id === 4) costTypeList.push({ label: type.name, value: type.id });
					})
					return { label: type.name, value: type.id };
				});
				// console.log('setting costtype', newOptions)
				// setCostTypeListData(newOptions);
			}
		}
		// console.log('costCodeList', costCodeList)
		setCostCodeListData(costCodeList)
		setCostTypeListData(costTypeList);

		return () => { };
	}, [])

	const handleOnClose = () => {
		setOpenBudgetTransfer(false)
	}
	React.useEffect(() => {
		if (openAlert === false) {
			if (divisionOrCostTypeChanged) {
				updateSettings(formData)
				setTimeout(() => {
					dispatch(fetchGridData(appInfo))
				},5000)
			}
			else { setFormData({ ...formData, divisionCostCodeId: settingsData.divisionCostCodeId, costTypeId: settingsData.costTypeId }) }
		}
	}, [openAlert]);

	const updateSettings = (fromDataClone: any) => {
		const payload = {
			allowMultipleLineItems: fromDataClone?.allowMultipleLineItems ? fromDataClone?.allowMultipleLineItems : false,
			allowMarkupFee: fromDataClone?.allowMarkupFee ? fromDataClone?.allowMarkupFee : false,	
			providerSource: fromDataClone?.providerSource ? fromDataClone?.providerSource : 0,	
			showBalance: fromDataClone?.showBalance ? fromDataClone?.showBalance : false,
			showBudget: fromDataClone?.showBudget ? fromDataClone?.showBudget : false,
			showCost: fromDataClone?.showCost ? fromDataClone?.showCost : false,
			costTypeId: fromDataClone.costTypeId,
			divisionCostCodeId: fromDataClone.divisionCostCodeId,
			changeOrderApp: { id: fromDataClone.changeOrderApp?.id },
			contractsApp: { id: fromDataClone.contractsApp?.id },
			invoicesApp: { id: fromDataClone.invoicesApp?.id },
			estimateApp: { id: fromDataClone.estimateApp?.id },
			bidApp: { id: fromDataClone.bidApp?.id },
			tmApp: { id: fromDataClone.tmApp?.id }
		}
		// console.log('payload', payload)
		addSettings(appInfo, payload, (response: any) => {
			dispatch(fetchSettings(appInfo));
		});
	}

	const handleInputChange = (value: any, name: string) => {
		// console.log('handleInputChange', value, name)
		let fromDataClone;

		if (name === 'changeOrderApp' || name === 'contractsApp' || name === 'invoicesApp' || name === 'estimateApp' || name === 'bidApp' || name === 'tmApp') {
			const extract = ({ ...formData[name], 'id': value });
			fromDataClone = ({ ...formData, [name]: extract })
			updateSettings(fromDataClone);
		}
		else if (name === 'divisionCostCodeId' || name === 'costTypeId') {
			// console.log("else if")
			fromDataClone = ({ ...formData, [name]: value })
			settingsData[name] != value ? originalGridApiData.length ? dispatch(setOpenAlert(true)) : updateSettings(fromDataClone) : null;
		}
		else {
			// console.log("else");
			fromDataClone = ({ ...formData, [name]: value })
			updateSettings(fromDataClone);
		}
		setFormData(fromDataClone);
	}

	const handlePlannerChange = (value: any, index: any) => {
		const DataClone = [...planningSettings]
		DataClone[index].enabled = value;
		setPlanningSettings([...DataClone]);
	}
	const handleListChanges = (val: string) => {
		// console.log("value in popup", val)
		dispatch(setOpenAlert(false));
		dispatch(setDivisionOrCostTypeChanged(val === 'yes' ? true : false));
	}

	return (
		<Stack className='General-settings'>
			<Stack className='generalSettings-Sections'>
				<Typography variant="h6" component="h6" className='budgetSetting-heading'>General Settings</Typography>
				<List className='generalSettings-list'>
					<ListItem className='generalSettings-listitem'>
						<ListItemText primary="Allow multiples of the same Cost Code" className='generalsettingtext' />
						<ListItemIcon>
							<IQToggle
								checked={formData.allowMultipleLineItems}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleInputChange(value, 'allowMultipleLineItems') }}
								edge={'end'}
							/>
						</ListItemIcon>
					</ListItem>
					<ListItem className='generalSettings-listitem'>
						<ListItemText primary="Allow to add Line Item Mark-up Fee" className='generalsettingtext' />
						<ListItemIcon>
							<IQToggle
								checked={formData?.allowMarkupFee}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleInputChange(value, 'allowMarkupFee') }}
								edge={'end'}
							/>
						</ListItemIcon>
					</ListItem>
				</List>
			</Stack>
			<Stack className='generalSettings-Sections'>
				<Typography variant="h6" component="h6" className='budgetSetting-heading'>Provider Source</Typography>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					value={formData?.providerSource == 1 ? 'self' : 'trade'}
        			onChange={(e) => { handleInputChange(e.target.value == 'self' ? 1 : 0, 'providerSource') }}
				>
					<FormControlLabel value="self" control={<Radio />} label="Self Perform" />
					<FormControlLabel value="trade" control={<Radio />} label="Trade Partner" />
				</RadioGroup>
			</Stack>
			<Stack className='generalSettings-Sections'>
				<Typography variant="h6" component="h6" className='budgetSetting-heading'>Billable in Client Contract</Typography>
				<RadioGroup
					row
					aria-labelledby="demo-row-radio-buttons-group-label"
					name="row-radio-buttons-group"
					value={formData?.billableInCC == 0 ? 'nonBillable' : 'billable'}
        			onChange={(e) => { handleInputChange(e.target.value == 'billable' ? 1 : 0, 'billableInCC') }}
				>
					<FormControlLabel value="billable" control={<Radio />} label="Billable" />
					<FormControlLabel value="nonBillable" control={<Radio />} label="Non-Billable" />
				</RadioGroup>
			</Stack>
			<Divider />
			<Stack className='BudgetSettings-Sections'>
				<Typography variant="h6" component="h6" className='budgetSetting-heading '>Budget List Value Settings</Typography><br />
				<Stack className='BudgetSettings-list'>
					<SmartDropDown
						LeftIcon={<></>}
						options={costCodeListData?.length > 0 ? costCodeListData : []}
						Placeholder={'Select'}
						dropDownLabel="Default Division/Cost Code List"
						isSearchField
						required={false}
						selectedValue={formData.divisionCostCodeId ? formData.divisionCostCodeId : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value, 'divisionCostCodeId')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important'
							}
						}}
						menuProps={classes.menuPaper}
					/>
					<br />
					<SmartDropDown
						LeftIcon={<></>}
						options={costTypeListData?.length > 0 ? costTypeListData : []}
						Placeholder={'Select'}
						dropDownLabel="Default Cost Type"
						isSearchField
						required={false}
						selectedValue={formData.costTypeId ? formData.costTypeId : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value, 'costTypeId')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important'
							}
						}}
						menuProps={classes.menuPaper}
					/>
				</Stack>
			</Stack>
			<Divider />
			<Stack className='BudgetSettings-Sections2'>
				<Stack className='BudgetSettings-list2'>
					<SmartDropDown
						LeftIcon={formData.changeOrderApp && formData.changeOrderApp.id ? <></> :
							<img
								src={'https://www.smartapp.com/assets/images/logos/logo64x64.png'}
								alt="Avatar"
								style={{ width: "24px", height: "19px", borderRadius: '50%', marginRight: '5px', marginLeft: '6px', filter: 'grayscale(100%)' }}
								className="custom-img"
							/>
						}
						options={defaultData?.length > 0 ? defaultData : []}
						dropDownLabel="Select default App for Change Orders"
						isSearchField
						required={false}
						selectedValue={formData.changeOrderApp && formData.changeOrderApp.id ? formData.changeOrderApp.id : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value[0], 'changeOrderApp')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important',
								display: 'flex !important'
							}
						}}
						displayEmpty={true}
						Placeholder={'Select App'}
						optionImage={true}
						menuProps={classes3.menuPaper}
					/>
					<br />
					<SmartDropDown
						LeftIcon={formData.contractsApp && formData.contractsApp.id ? <></> :
							<img
								src={'https://www.smartapp.com/assets/images/logos/logo64x64.png'}
								alt="Avatar"
								style={{ width: "24px", height: "19px", borderRadius: '50%', marginRight: '5px', marginLeft: '6px', filter: 'grayscale(100%)' }}
								className="custom-img"
							/>
						}
						options={defaultData?.length > 0 ? defaultData : []}
						dropDownLabel="Select default App for Contracts"
						isSearchField
						required={false}
						selectedValue={formData.contractsApp && formData.contractsApp.id ? formData.contractsApp.id : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value[0], 'contractsApp')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important',
								display: 'flex !important'
							}
						}}
						displayEmpty={true}
						Placeholder={'Select App'}
						optionImage={true}
						menuProps={classes3.menuPaper}
					/>
					<br />
					<SmartDropDown
						LeftIcon={formData.invoicesApp && formData.invoicesApp.id ? <></> :
							<img
								src={'https://www.smartapp.com/assets/images/logos/logo64x64.png'}
								alt="Avatar"
								style={{ width: "24px", height: "19px", borderRadius: '50%', marginRight: '5px', marginLeft: '6px', filter: 'grayscale(100%)' }}
								className="custom-img"
							/>
						}
						options={defaultData?.length > 0 ? defaultData : []}
						dropDownLabel="Select default App for Invoices"
						isSearchField
						required={false}
						selectedValue={formData.invoicesApp && formData.invoicesApp.id ? formData.invoicesApp.id : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value[0], 'invoicesApp')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important',
								display: 'flex !important'
							}
						}}
						displayEmpty={true}
						Placeholder={'Select App'}
						optionImage={true}
						menuProps={classes3.menuPaper}
					/>
					<br />
					<SmartDropDown
						LeftIcon={formData.estimateApp && formData.estimateApp.id ? <></> :
							<img
								src={'https://www.smartapp.com/assets/images/logos/logo64x64.png'}
								alt="Avatar"
								style={{ width: "24px", height: "19px", borderRadius: '50%', marginRight: '5px', marginLeft: '6px', filter: 'grayscale(100%)' }}
								className="custom-img"
							/>
						}
						options={defaultData?.length > 0 ? defaultData : []}
						dropDownLabel="Select default App for Estimates"
						isSearchField
						required={false}
						selectedValue={formData.estimateApp && formData.estimateApp.id ? formData.estimateApp.id : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value[0], 'estimateApp')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important',
								display: 'flex !important'
							}
						}}
						displayEmpty={true}
						Placeholder={'Select App'}
						optionImage={true}
						menuProps={classes3.menuPaper}
					/>
					<br />
					<SmartDropDown
						LeftIcon={formData.bidApp && formData.bidApp.id ? <></> :
							<img
								src={'https://www.smartapp.com/assets/images/logos/logo64x64.png'}
								alt="Avatar"
								style={{ width: "24px", height: "19px", borderRadius: '50%', marginRight: '5px', marginLeft: '6px', filter: 'grayscale(100%)' }}
								className="custom-img"
							/>
						}
						options={defaultData?.length > 0 ? defaultData : []}
						dropDownLabel="Select default App for Bid"
						isSearchField
						required={false}
						selectedValue={formData.bidApp && formData.bidApp.id ? formData.bidApp.id : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value[0], 'bidApp')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important',
								display: 'flex !important'
							}
						}}
						displayEmpty={true}
						Placeholder={'Select App'}
						optionImage={true}
						menuProps={classes3.menuPaper}
					/>
					<br />
					<SmartDropDown
						LeftIcon={formData.tmApp && formData.tmApp.id ? <></> :
							<img
								src={'https://www.smartapp.com/assets/images/logos/logo64x64.png'}
								alt="Avatar"
								style={{ width: "24px", height: "19px", borderRadius: '50%', marginRight: '5px', marginLeft: '6px', filter: 'grayscale(100%)' }}
								className="custom-img"
							/>
						}
						options={defaultData?.length > 0 ? defaultData : []}
						dropDownLabel="Select default App for T & M"
						isSearchField
						required={false}
						selectedValue={formData.tmApp && formData.tmApp.id ? formData.tmApp.id : ''}
						isFullWidth
						handleChange={(value: any) => handleInputChange(value[0], 'tmApp')}
						variant={'outlined'}
						sx={{
							'& .MuiInputBase-input': {
								padding: '4px 25px 4px 0px !important',
								display: 'flex !important'
							}
						}}
						displayEmpty={true}
						Placeholder={'Select App'}
						optionImage={true}
						menuProps={classes3.menuPaper}
					/>
				</Stack>
			</Stack>
			<Divider />
			<Stack className='PlannerSettings-Sections'>
				<Typography variant="h6" component="h6" className='budgetSetting-heading'>Planner Settings</Typography>
				<List className='PlannerSettings-list'>
					<ListItem className='PlannerSettings-listitem' key={'key1'}>
						<ListItemText primary={'Show Cost'} className='PlannerSettingstext' />
						<ListItemIcon>
							<IQToggle
								checked={formData.showCost}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleInputChange(value, 'showCost') }}
								edge={'end'}
							/>
						</ListItemIcon>
					</ListItem>
					<ListItem className='PlannerSettings-listitem' key={'key1'}>
						<ListItemText primary={'Show Balance'} className='PlannerSettingstext' />
						<ListItemIcon>
							<IQToggle
								checked={formData.showBalance}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleInputChange(value, 'showBalance') }}
								edge={'end'}
							/>
						</ListItemIcon>
					</ListItem>
					<ListItem className='PlannerSettings-listitem' key={'key1'}>
						<ListItemText primary={'Show Budget'} className='PlannerSettingstext' />
						<ListItemIcon>
							<IQToggle
								checked={formData.showBudget}
								switchLabels={['ON', 'OFF']}
								onChange={(e, value) => { handleInputChange(value, 'showBudget') }}
								edge={'end'}
							/>
						</ListItemIcon>
					</ListItem>
				</List>
			</Stack>
			<SUIAlert open={openAlert} contentText={<span>The existing budget line items will have to be updated to the new values.<br /><br /> Are you sure want to continue?</span>}

				title={'Confirmation'} onAction={(e: any, type: string) => handleListChanges(type)} />
			{/* <Divider /> */}
			{/* <Stack className='BudgetReport-Sections'>
				<Typography variant="h6" component="h6" className='budgetSetting-heading'>Budget Report</Typography>
				<List className='BudgetReport-list'>
					<ListItem className='BudgetReport-listitem'>
						<ListItemText primary="Budget Modifications" className='BudgetReporttext' />
					</ListItem>
					<ListItem className='BudgetReport-listitem'>
						<ListItemText primary="Buyout Summary Report" className='BudgetReporttext' />
					</ListItem>
				</List>
			</Stack> */}
		</Stack>
	)

}

export default GeneralSettings;