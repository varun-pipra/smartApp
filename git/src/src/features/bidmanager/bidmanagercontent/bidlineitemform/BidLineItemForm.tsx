import React from 'react';
import { Box, IconButton, TextField, InputLabel, InputAdornment } from '@mui/material';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import InputIcon from 'react-multi-date-picker/components/input_icon';

import './BidLineItemForm.scss';

import globalStyles, { primaryIconSize } from 'features/budgetmanager/BudgetManagerGlobalStyles';
import IQButton from 'components/iqbutton/IQButton';
import DatePickerComponent from 'components/datepicker/DatePicker';
import CostCodeDropdown from 'components/costcodedropdown/CostCodeDropdown';
import BidPackageName from 'resources/images/bidManager/BidPackageName.svg';
import BudgetLineItem from 'resources/images/bidManager/BudgetLineItem.svg';
import SUIBudgetLineItemSelect from 'sui-components/BudgetLineItemSelect/BudgetLineItemSelect';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { getFormattedBudgetLineItems, getISOTime } from 'utilities/commonFunctions';
import { fetchBudgetLineItems, setToastMessage } from 'features/bidmanager/stores/BidManagerSlice';
import { createBidPackage } from 'features/bidmanager/stores/gridAPI';
import { getServer } from 'app/common/appInfoSlice';
import { fetchGridData } from 'features/bidmanager/stores/gridSlice';

const defaultFormData = {
	name: '',
	startDate: '',
	endDate: '',
	budgetIds: []
};

const BidLineItemForm = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { BudgetLineItems } = useAppSelector((state) => state.bidManager);
	const [budgetLineItems, setBudgetLineItems] = React.useState<any>([])
	const [formData, setFormData] = React.useState<any>(defaultFormData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);
	const [dateStatus, setDateStatus] = React.useState<boolean>(false);
	const [showToast, setShowToast] = React.useState<any>({ display: false, message: '' })


	React.useEffect(() => {
		if (BudgetLineItems?.length) {
			const data = getFormattedBudgetLineItems(BudgetLineItems);
			setBudgetLineItems(data);
		}
	}, [BudgetLineItems]);

	const handleOnChange = (value: any, name: any) => {
		const formDatClone = { ...formData, [name]: value };
		if (name == 'startDate' && formDatClone.startDate != '') {
			if (new Date(formDatClone.startDate) > new Date(formDatClone.endDate)) {
				setDisableAddButoon(true)
				setDateStatus(true)
				dispatch(setToastMessage({ displayToast: true, message: 'Start Date should not be greater than End Date' }))
			}
			else {
				if (formDatClone.name != '') {
					setDisableAddButoon(false)
					setDateStatus(false)
				}
			}
		}
		else if (name == 'endDate' && formDatClone.endDate != '') {
			if (new Date(formDatClone.endDate) < new Date(formDatClone.startDate)) {
				setDisableAddButoon(true)
				setDateStatus(true)
				dispatch(setToastMessage({ displayToast: true, message: 'End Date Should Not be less Than start Date' }))
			}
			else {
				if (formDatClone.name != '') {
					setDisableAddButoon(false)
					setDateStatus(false)
				}
			}
		}
		else {
			if (formDatClone.name != '' && dateStatus == false) {
				setDisableAddButoon(false)
			}
			else {
				setDisableAddButoon(true)
			}
		}
		setFormData(formDatClone);
	};

	const getBudgetIds = (data: any) => {
		var ids: any = [];
		data?.forEach((id: any, index: number) => {
			ids = [...ids, { id: id }];
		})
		return ids;
	}

	const handleAdd = () => {
		var ids: any = [];
		formData?.budgetIds?.forEach((obj: any, index: number) => {
			if (Object.keys(obj).includes('id')) ids = [...ids, { id: obj?.id }];
		})
		const EnddateTimeString = `${formData?.endDate} ${'11:59 PM'}`;
		const payload = {
			name: formData?.name,
			startDate: formData?.startDate !== '' ? new Date(formData?.startDate)?.toISOString() : null,
			endDate: formData?.endDate !== '' ? new Date(EnddateTimeString)?.toISOString() : null,
			budgetItems: [...getBudgetIds(formData?.budgetIds)],
		};
		console.log('payload', payload)
		createBidPackage(appInfo, payload).then((response: any) => {
			dispatch(fetchGridData(appInfo));
			setDisableAddButoon(true);
			setFormData(defaultFormData);
			dispatch(setToastMessage({ displayToast: true, message: 'New Bid Package Added Successfully' }));
			dispatch(fetchBudgetLineItems(appInfo));
		});
	};

	return <div className='bid-lineitem-form'>
		<div className='bid-name-field'>
			<InputLabel required className='inputlabel' sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}}>Bid Package Name</InputLabel>
			<TextField
				id='name'
				fullWidth
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<Box component='img' alt='Delete' src={BidPackageName} className='image' width={22} height={22} color={'#666666'} />
						</InputAdornment>
					)
				}}
				placeholder={'Enter Bid Package Name'}
				name='name'
				variant='standard'
				value={formData.name}
				onChange={(e: any) => handleOnChange(e.target.value, 'name')}
			/>
		</div>
		<div className='cost-code-field-box'>
			<SUIBudgetLineItemSelect
				lineItemlabel="Budget Line Item"
				options={budgetLineItems}
				showDescription={true}
				handleInputChange={(values: any) => handleOnChange(values, 'budgetIds')}
				selectedValue={formData?.budgetIds?.length ? formData.budgetIds : []}
			></SUIBudgetLineItemSelect>
		</div>
		<div className='bid-start-date-field'>
			<InputLabel className='inputlabel'>Start Date</InputLabel>
			<DatePickerComponent
				defaultValue={formData.startDate}
				onChange={(val: any) => handleOnChange(val, 'startDate')}
				maxDate={formData.endDate !== '' ? new Date(formData.endDate) : new Date('12/31/9999')}
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
		<div className='bid-end-date-field'>
			<InputLabel className='inputlabel'>End Date</InputLabel>
			<DatePickerComponent
				defaultValue={formData.endDate}
				onChange={(val: any) => handleOnChange(val, 'endDate')}
				minDate={new Date(formData.startDate)}
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
		<IQButton
			color='orange'
			sx={{ height: '2.5em' }}
			disabled={disableAddButton}
			onClick={handleAdd}
		>
			+ ADD
		</IQButton>
	</div>;
};

export default BidLineItemForm;