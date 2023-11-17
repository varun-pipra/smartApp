import React from 'react';
import {TextField, InputLabel} from '@mui/material';
import InputIcon from 'react-multi-date-picker/components/input_icon';

import './ClientContractsForm.scss';

import IQButton from 'components/iqbutton/IQButton';
import DatePickerComponent from 'components/datepicker/DatePicker';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {getServer} from 'app/common/appInfoSlice';
import SUIBaseDropdownSelector from 'sui-components/BaseDropdown/BaseDropdown';
import SmartDropDown from 'components/smartDropdown';
import {createClientContract} from 'features/clientContracts/stores/gridAPI';
import {getClientContractsList} from 'features/clientContracts/stores/gridSlice';
import {setToastMessage} from 'features/clientContracts/stores/ClientContractsSlice';

const defaultFormData = {
	title: '',
	client: '',
	type: '',
	startDate: '',
	endDate: '',
};

const ClientContractsForm = (props: any) => {
	// Redux State Variable
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const {companiesData} = useAppSelector(state => state.clientContracts);

	// Local state vaiables
	const [formData, setFormData] = React.useState<any>(defaultFormData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);

	// Effects
	React.useEffect(() => {
		setDisableAddButoon(formData?.title !== '' && formData?.type !== '' ? false : true);
	}, [formData]);

	React.useEffect(() => {
		if(formData.startDate != '') {
			// console.log('startdate', formDatClone)
			if(new Date(formData.startDate) > new Date(formData.endDate)) {
				setDisableAddButoon(true);
				dispatch(setToastMessage({displayToast: true, message: 'Start Date should not be greater than End Date'}));
			}
			else {
				if(formData?.title !== '' && formData?.type !== '') {
					setDisableAddButoon(false);
				}
			}
		}
	}, [formData.startDate]);
	React.useEffect(() => {
		if(formData.endDate != '') {
			if(new Date(formData.endDate) < new Date(formData.startDate)) {
				setDisableAddButoon(true);
				dispatch(setToastMessage({displayToast: true, message: 'End Date Should Not be less Than start Date'}));
			}
			else {
				if(formData?.title !== '' && formData?.type !== '') {
					setDisableAddButoon(false);
				}
			}
		}
	}, [formData.endDate]);

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
		return groupedList;
	};

	React.useEffect(() => {
		if(companiesData?.length == 1) setFormData({
			...formData, client: [{
				...companiesData[0],
				color: companiesData[0].colorCode,
				id: companiesData[0].uniqueId,
				displayField: companiesData[0].name,
				thumbnailUrl: companiesData[0].thumbnailUrl,
			}]
		});

	}, [companiesData]);

	// onchange methods

	const handleOnChange = (value: any, name: any) => {
		console.log("val", value, name);
		setFormData({...formData, [name]: value});
	};

	const handleAdd = () => {
		const payload = {
			title: formData?.title,
			client: {
				id: formData.client[0]['id']
			},
			type: formData?.type,
			startDate: formData.startDate != '' ? formData?.startDate : null,
			endDate: formData.endDate != '' ? formData?.endDate : null,
		};
		// console.log('payload', payload)
		createClientContract(appInfo, payload, (response: any) => {
			setDisableAddButoon(true);
			setFormData(defaultFormData);
			dispatch(getClientContractsList(appInfo));
			dispatch(setToastMessage({displayToast: true, message: 'New Client Contract Created Successfully'}));
		});
	};


	return <div className='client-contract-lineitem-form'>
		<div className='title-field'>
			<InputLabel required className='inputlabel' sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}}>Title</InputLabel>
			<TextField
				id='title'
				fullWidth
				InputProps={{
					startAdornment: (
						<span className="common-icon-title"> </span>
					)
				}}
				placeholder={'Enter Contract Title'}
				name='title'
				variant='standard'
				value={formData?.title}
				onChange={(e: any) => handleOnChange(e.target.value, 'title')}
			/>
		</div>
		<div style={{
			width: '30%',
			padding: 'unset',
		}} className='company-field'>
			<InputLabel required className='inputlabel' sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}}>Client Company</InputLabel>
			<SUIBaseDropdownSelector
				value={formData?.client}
				width="100%"
				menuWidth="200px"
				icon={<span className="common-icon-Companies"> </span>}
				placeHolder={'Select Vendor'}
				dropdownOptions={getCompanyOptions()}
				handleValueChange={(value: any, params: any) => handleOnChange(value, 'client')}
				showFilterInSearch={false}
				multiSelect={false}
				companyImageWidth={'17px'}
				companyImageHeight={'17px'}
				showSearchInSearchbar={true}
				addCompany={false}
			></SUIBaseDropdownSelector>
		</div>
		<div className='type-field'>
			<InputLabel required className='inputlabel' sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}}>Type</InputLabel>
			<SmartDropDown
				LeftIcon={<div className='common-icon-Budgetcalculator'></div>}
				options={[{id: 1, label: 'Proposal/Quote', value: 'Proposal'}, {id: 1, label: 'Contract', value: 'Contract'}]}
				outSideOfGrid={true}
				isSearchField={false}
				isFullWidth
				Placeholder={'Select'}
				selectedValue={formData?.type}
				// menuProps={classes.menuPaper}
				handleChange={(value: any) => handleOnChange(value[0], 'type')}
			/>
		</div>
		<div className='start-date-field'>
			<InputLabel className='inputlabel'>Contract Start Date</InputLabel>
			<DatePickerComponent
				defaultValue={formData.startDate}
				onChange={(val: any) => handleOnChange(new Date(val)?.toISOString(), 'startDate')}
				maxDate={formData.endDate !== '' ? new Date(formData.endDate) : new Date('12/31/9999')}
				containerClassName={'iq-customdate-cont'}
				render={
					<InputIcon
						placeholder={"Select"}
						className={'custom-input rmdp-input'}
						style={{background: '#f7f7f7'}}
					/>
				}
			/>
		</div>
		<div className='end-date-field'>
			<InputLabel className='inputlabel'>Contract End Date</InputLabel>
			<DatePickerComponent
				defaultValue={formData.endDate}
				onChange={(val: any) => handleOnChange(new Date(val)?.toISOString(), 'endDate')}
				minDate={new Date(formData.startDate)}
				containerClassName={'iq-customdate-cont'}
				render={
					<InputIcon
						placeholder={"Select"}
						className={'custom-input rmdp-input'}
						style={{background: '#f7f7f7'}}
					/>
				}
			/>
		</div>
		<IQButton
			color='orange'
			sx={{height: '2.5em'}}
			disabled={disableAddButton}
			onClick={handleAdd}
		>
			+ ADD
		</IQButton>
	</div>;
};
export default ClientContractsForm;