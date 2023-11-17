import React, { useState } from "react";
import { InputLabel, TextField, Box, IconButton } from "@mui/material";
import { ExpandMore, ExpandLess, PushPinOutlined as PushPin } from '@mui/icons-material';
import SmartDropDown from "components/smartDropdown";
import { Grid as MuiGrid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { isLocalhost } from 'app/utils';
import { getServer, getCostTypeList } from 'app/common/appInfoSlice';
import { makeStyles, createStyles } from '@mui/styles';

import {
	Button
} from "@ui5/webcomponents-react";
import './SafetyRequirementsForm.scss'
import globalStyles, { primaryIconSize } from "features/budgetmanager/BudgetManagerGlobalStyles";

interface SafetyRequirementsFormProps {
	onLineItemAdded?: (value: any) => void;
}
const defaultFormData = {
	name: '',
	category: '',
	trade: [],
	skills: [],
	systemBreakdownStructure: [],
};

const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			maxWidth: '160px !important',
			minWidth: 'fit-content !important',
		}
	})
);
const SafetyRequirementsForm = (props: SafetyRequirementsFormProps) => {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const [localhost] = React.useState(isLocalhost);
	const [collapsed, setCollapsed] = useState(false);
	const [pinned, setPinned] = useState(false);
	const [headerPageData, setHeaderPageData] = React.useState<any>(defaultFormData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);

	const handleOnChange = (value: any, name: string) => {
		const formDataClone = { ...headerPageData, [name]: value };
		if (formDataClone?.name != '' && formDataClone?.category !== '' && formDataClone?.trade?.length !== 0
		) {
			setDisableAddButoon(false);
		};
		console.log("changess", value, name)
		setHeaderPageData(formDataClone);
	}

	const handleAdd = () => {
		console.log('dataAfterAdd', headerPageData)
		setDisableAddButoon(true);
		setHeaderPageData(defaultFormData);
	};
	const handleAddCategory = (value: string) => {
		console.log("Add Category", value)
	};
	return (
		<Box className='safety-requirements-content'>
			<div className='collapsible-section'>
				{collapsed === false ? <div className='safety-requirements-form-box'>
					<p className='safety-requirements-form-title'>Create New Safety Requirement</p>
					<MuiGrid container spacing={2} className="headerContent" style={{ marginTop: '0px' }}>
						<MuiGrid item xl={3} lg={3} md={3} sm={6} xs={6}>
							<InputLabel required className='inputlabel' sx={{
								'& .MuiFormLabel-asterisk': {
									color: 'red'
								}
							}}>Hazard Name</InputLabel>
							<TextField
								id='name'
								fullWidth
								InputProps={{
									startAdornment: (
										<span className="common-icon-title"> </span>
									)
								}}
								placeholder={'Enter Cotegory Name'}
								name='name'
								variant='standard'
								value={headerPageData?.name}
								onChange={(e: any) => handleOnChange(e.target.value, 'name')}
							/>
						</MuiGrid>
						<MuiGrid item xl={2} lg={2} md={2} sm={6} xs={6}>
							<SmartDropDown
								LeftIcon={
									<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>
								}
								options={[
									{
										label: 'Personal Protective Equipment(PPE)', value: 'Personal Protective Equipment(PPE)'
									}
								]}
								dropDownLabel="Hazard Category"
								isSearchField={true}
								required
								selectedValue={headerPageData?.category}
								isFullWidth
								outSideOfGrid={false}
								handleChange={(value: any) => handleOnChange(value[0], 'category')}
								menuProps={classes.menuPaper}
								sx={{ fontSize: '18px' }}
								Placeholder={'Select'}
								isSearchPlaceHolder={"Search Group"}
								isCustomSearchField={true}
								handleAddCategory={handleAddCategory}
							/>
						</MuiGrid>

						<MuiGrid item xl={2} lg={2} md={2} sm={6} xs={6}>
							<div className='cost-code-field-box'>
								<SmartDropDown
									LeftIcon={
										<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.3rem' }}></div>
									}
									options={[{
										id: 1, value: '78902c55-ee09-4af7-9280-02f32c46c9h1', label: 'Architectural'
									}]}
									required
									dropDownLabel="Trade"
									isSearchField={true}
									isMultiple={true}
									selectedValue={headerPageData?.trade}
									isFullWidth
									outSideOfGrid={true}
									handleChange={(value: any) => handleOnChange(value, 'trade')}
									menuProps={classes.menuPaper}
									sx={{ fontSize: '18px' }}
									Placeholder={'Select'}
									showCheckboxes={true}
									reduceMenuHeight={true}
								/>
							</div>
						</MuiGrid>
						<MuiGrid item xl={2} lg={2} md={2} sm={6} xs={6}>
							<div className='cost-code-field-box'>
								<SmartDropDown
									LeftIcon={
										<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.3rem' }}></div>
									}
									options={[{
										id: 1, value: '78902c55-ee09-4af7-9280-02f32c46c9g1', label: 'General Construction'
									}]}
									dropDownLabel="Skills"
									isSearchField={true}
									isMultiple={true}
									selectedValue={headerPageData?.skills}
									isFullWidth
									outSideOfGrid={true}
									handleChange={(value: any) => handleOnChange(value, 'skills')}
									menuProps={classes.menuPaper}
									sx={{ fontSize: '18px' }}
									Placeholder={'Select'}
									showCheckboxes={true}
									reduceMenuHeight={true}
								/>
							</div>
						</MuiGrid>
						<MuiGrid item xl={2} lg={2} md={2} sm={6} xs={6}>
							<div className='cost-code-field-box'>
								<SmartDropDown
									LeftIcon={
										<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.3rem' }}></div>
									}
									options={[{
										id: 1, value: '78902c55-ee09-4af7-9280-02f32c46c9f1', label: '', options: [
											{ value: '78902c55-ee09-4af7-9280-02f32c46c9f1', label: '01 - General Requirement-L - Labor', colVal: 44 }]
									}, {
										id: 0, value: 'd3ef2c32-0aa2-4006-b21c-00739d448073', label: '01 - General Requirement',
										options: [
											{ value: 'd3ef2c32-0aa2-4006-b21c-00739d448073', label: 'General Contractor 1001-E - Equipment', colVal: 123 },
											{ value: '961a7fee-5a8f-4894-898f-0ea45dc7593e', label: 'General Contractor 1001-E - Equipment', colVal: 123456 },
											{ value: '310d49db-2b68-4654-ac30-1ca2c53f817c', label: 'General Contractor- Airports 1002-L - Labor', colVal: 1000 },

											{ value: '4e4ea0f1-2554-44fb-a696-11f7fb82acf8', label: 'General Contractor- Airports 1002-M - Materials', colVal: 100064 }
										]
									}]}
									dropDownLabel="System Breakdown Structure (SBS)"
									isSearchField={true}
									isMultiple={true}
									useNestedOptions={true}
									selectedValue={headerPageData?.systemBreakdownStructure}
									isFullWidth
									outSideOfGrid={true}
									handleChange={(value: any) => handleOnChange(value, 'systemBreakdownStructure')}
									menuProps={classes.menuPaper}
									sx={{ fontSize: '18px' }}
									Placeholder={'Select'}
									reduceMenuHeight={true}
									showSearchRightIcon={true}
									showFilterIcon={true}
								/>
							</div>
						</MuiGrid>
						<MuiGrid item xl={1} lg={1} md={1} sm={6} xs={6} style={{ textAlign: "right", margin: "9px 0px 0px 0px" }}>
							<Button
								className='add-button'
								design="Transparent"
								disabled={disableAddButton}
								onClick={handleAdd}
								style={{ background: globalStyles.primaryColor, color: "white" }}
							>
								+ Add
							</Button>
						</MuiGrid>
					</MuiGrid >
				</div> : ''}
				{/* <div className={`header-buttons-container${collapsed === true ? ' abs-position' : ''}`}>
					<IconButton className={`header-button`} aria-label={collapsed === true ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(pCollapsed => !pCollapsed)}>
						{collapsed === true ? <ExpandMore fontSize='small' /> : <ExpandLess fontSize='small' />}
					</IconButton>
					{!collapsed && <IconButton className={`header-button ${pinned === true ? 'btn-focused' : ''}`} aria-label={pinned === true ? 'Pinned' : 'Not Pinned'} onClick={() => setPinned(pPinned => !pPinned)}>
						{<PushPin fontSize='small' className={`pin ${pinned === true ? 'focused' : ''}`} {...(pinned === true ? { color: 'primary' } : {})} />}
					</IconButton>}
				</div> */}
			</div>
		</Box>
	)
}
export default SafetyRequirementsForm;