import React, { useState } from 'react';
import { IconButton, InputAdornment, InputLabel, TextField } from "@mui/material";
import './CreateEstimateNewForm.scss';
import IQButton from "components/iqbutton/IQButton";
import IQTooltip from "components/iqtooltip/IQTooltip";
import SmartDialog from "components/smartdialog/SmartDialog";
import CostCodeSelect from "sui-components/CostCodeSelect/costCodeSelect";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { CostCodeFilterData, DivisionCostCodeDropdownData } from 'data/MultiLevelFilterData';

const defaultValue = {
	name:'',
	description:'',
	copy:"",
}
const checkAllValuesNotEmpty = (myObject:any) => {
	 const result  = Object.values(myObject).every(value => value !== '');
	 return !result
};
const CreateEstimateNewForm = (props: any) => {
	const [formData, setFormData] = React.useState<any>(defaultValue);
	const [enableAdd, setEnableAdd] = React.useState<boolean>(true);

	const handleOnChange = (value: any, name: any) => {
		const formDataClone = { ...formData, [name]: value };
		setEnableAdd(checkAllValuesNotEmpty(formDataClone))
		setFormData({ ...formDataClone });
	};


	return (
		<SmartDialog
			open={true}
			className='budgetRoom-addForm-cls'
			// isFullView={isFullView}
			disableEscapeKeyDown={true}
			PaperProps={{
				sx: { height: '50%', width: '550px', minWidth: '10%' },
			}}

			custom={{
				closable: true,
				resizable: false,
				title: props?.title,
				buttons: <>
					<IQButton
						className='btn-add-line-items cancel'
						onClick={() => { props?.onClose && props?.onClose(false); }}
					>
						CANCEL
					</IQButton>

					<IQButton
						disabled={enableAdd}
						className='btn-add-line-items'
						onClick={() => { props?.onAdd && props?.onAdd(formData); props?.onClose && props?.onClose(false); }}
					>
						SAVE
					</IQButton>
				</>,
				//tools: [],
				zIndex: 100,
				fullScreen: (props?.fullScreen || location?.pathname?.includes('home')),
			}}
			onClose={(event, reason) => {
				props?.onClose && props?.onClose(false);
			}}
		>
			<div className='create-form'>
					<div className='form_textfield'>
						<InputLabel className='inputlabel'>Estimate Name</InputLabel>
						<TextField
							id="name"
							fullWidth
							disabled={false}
							InputProps={{
								startAdornment: (
									<span className='common-icon-contract-amount' style={{paddingBottom:'5px'}}></span>
								)
							}}
							size='small'
							name="name"
							variant="standard"
							value={formData?.name}
							placeholder={'Enter Name of the Estimate'}
							onChange={(e)=>handleOnChange(e.target.value,'name')}
						/>
					</div>
					<div className='form_textfield'>
							<InputLabel className='inputlabel' >
								<span className='common-icon-Description iconSize'/>
								Description
							</InputLabel>
							<TextField
								id="description"
								variant='outlined'
								fullWidth
								multiline
								minRows={2}
								maxRows={10}
								placeholder='Enter Description'
								name='description'
								value={formData?.description}
								onChange={(e: any) => handleOnChange(e.target?.value,'description')}
							/>
					</div>
					<div className='form_textfield'>
						<CostCodeSelect
							label="copy"
							options={DivisionCostCodeDropdownData?.length > 0 ? DivisionCostCodeDropdownData : []}
							onChange={(value:any) => handleOnChange(value, 'copy')}
							required={false}
							startIcon={<div className='common-icon-iql-copy' style={{ fontSize: '1.25rem' }}></div>}
							checkedColor={'#0590cd'}
							showFilter={true}
							selectedValue={''}
							Placeholder={'Select'}
							outSideOfGrid={true}
							showFilterInSearch={true}
							filteroptions={CostCodeFilterData.length > 0 ? CostCodeFilterData : []}
							onFiltersUpdate={(filters:any) => console.log(filters)}
							defaultFilters={''}
						/>

					</div>
			</div>

		</SmartDialog >
	);
};
export default CreateEstimateNewForm;