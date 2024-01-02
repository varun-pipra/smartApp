// import './AddTimeLogForm.scss';

import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import SmartDropDown from 'components/smartDropdown';
import _ from 'lodash';
import {ChangeEvent, memo, useMemo, useState, useEffect} from 'react';
import SUIBudgetLineItemSelect from 'sui-components/BudgetLineItemSelect/BudgetLineItemSelect';

import {InputAdornment, InputLabel, TextField, TextFieldProps} from '@mui/material';
import DatePickerComponent from 'components/datepicker/DatePicker';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import TimeLogPicker from 'sui-components/TimeLogPicker/TimeLogPicker';

interface ChangeEventFormProps {
	name?: string;
	description?: string;
	clientContract?: any;
	budgetItems?: Array<any>;
	fundingSource?: any;
	duration?: any;
};

const AddTimeLogForm = (props: any) => {
	const dispatch = useAppDispatch();
	const {changeEventsListRefreshed} = useAppSelector(state => state.changeEventRequest);
	const defaultValues: ChangeEventFormProps = useMemo(() => {
		return {
			name: '',
			description: '',
			clientContract: '',
			budgetItems: [],
			fundingSource: '',
			duration: '0 Hrs 00 Mins'
		};
	}, []);

	const fundingSourceOptions = [
		{id: 1, label: 'Change Order', value: 'ChangeOrder'},
		{id: 2, label: 'Contingency', value: 'Contingency'},
		{id: 3, label: 'General Contractor', value: 'GeneralContractor'},
	];

	const [changeEvent, setChangeEvent] = useState<ChangeEventFormProps>(defaultValues);
	const [isBudgetDisabled, setBudgetDisabled] = useState<boolean>(true);
	const [isAddDisabled, setAddDisabled] = useState<boolean>(true);
	const [contractOptions, setContractOptions] = useState<any>([]);
	const [budgetsList, setBudgetsList] = useState<any>([]);
	const [disableOptionsList, setDisableOptionsList] = useState<any>([]);
	const [isDescExists, setIsDescExists] = useState(false);
	const appInfo = useAppSelector(getServer);

	useEffect(() => {
		//
	}, [appInfo, changeEventsListRefreshed]);

	const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {target} = event,
			{name, value} = target;

		setChangeEvent((currentState) => {
			const newState = {...currentState, ...{[name]: value}};
			checkFormValidity(newState);
			return newState;
		});
	};

	const checkFormValidity = (record: ChangeEventFormProps) => {
		setAddDisabled(_.isEmpty(record?.name) || _.isEmpty(record?.clientContract) || _.isEmpty(record?.fundingSource));
	};

	const handleAdd = () => {
		//
	};

	return <form className='change-event-request-form time-log-form'>
		<p className='form-title'>Add Time</p>
		{/* <DescriptionField
			name='description'
			className='description-field'
			value={changeEvent.description}
			onChange={handleFieldChange}
		/> */}
		<div className='spacer'></div>
		<div className='resource-field'>
			<InputLabel
				required
				className='inputlabel'
				sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red',
					},
				}}
			>
				Resource
			</InputLabel>
			<TextField
				InputProps={{
					startAdornment: (
						<span className='common-icon-name'></span>
					)
				}}
				name='name'
				variant='standard'
				value={changeEvent.name}
				onChange={handleFieldChange}
			/>
		</div>
		<div className='date-field'>
			<InputLabel
				required
				className='inputlabel'
				sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red',
					},
				}}
			>
				Date
			</InputLabel>
			<DatePickerComponent
				containerClassName={"iq-customdate-cont"}
				render={
					<InputIcon
						placeholder={"MM/DD/YYYY"}
						className={"custom-input rmdp-input"}
					/>
				}
			/>
		</div>
		<div className='time-field'>
			<InputLabel
				required
				className='inputlabel'
				sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red',
					},
				}}
			>
				Time
			</InputLabel>
			{/* <TextField
				InputProps={{
					startAdornment: <span className='common-icon-title'></span>
				}}
				name='name'
				variant='standard'
				value={changeEvent.name}
				onChange={handleFieldChange}
			/> */}
			<TimeLogPicker name='time' onDurationChange={(duration: any)=> setChangeEvent({...changeEvent, duration: duration})}></TimeLogPicker>
		</div>
		<div className='duration-field'>
			<InputLabel
				required
				className='inputlabel'
			>
				Duration
			</InputLabel>
			<span className='common-icon-monthly'></span> {changeEvent.duration}
		</div>
		<div className='smart-item-field'>
			<InputLabel
				required
				className='inputlabel'
			>
				Smart Item (Optional)
			</InputLabel>
			<SmartDropDown
				name='smartItems'
				LeftIcon={<span className='common-icon-smartapp'> </span>}
				options={contractOptions}
				outSideOfGrid={true}
				isSearchField={false}
				isFullWidth
				Placeholder={'Select'}
				selectedValue={changeEvent?.clientContract}
				isMultiple={false}
			/>
		</div>
		<IQButton
			color='orange'
			sx={{height: '2.5em'}}
			disabled={isAddDisabled}
			onClick={handleAdd}
		>
			+ ADD
		</IQButton>
	</form>;
};

export default memo(AddTimeLogForm);

const DescriptionField = memo((props: TextFieldProps) => {
	return <TextField
		fullWidth
		variant='standard'
		placeholder='Enter Description'
		sx={{
			'& .MuiInputBase-input': {
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			}
		}}
		InputProps={{
			startAdornment: <InputAdornment position='start'>
				<div className='common-icon-adminNote' style={{fontSize: '1.25rem'}}></div>
			</InputAdornment>,
			endAdornment: <InputAdornment position='end'>
				<div className='common-icon-Edit' style={{fontSize: '1.25rem'}}></div>
			</InputAdornment>
		}}
		{...props}
	/>;
});