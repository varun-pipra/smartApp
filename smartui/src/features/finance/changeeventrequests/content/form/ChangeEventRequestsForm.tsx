import './ChangeEventRequestsForm.scss';

import {getServer} from 'app/common/appInfoSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import IQButton from 'components/iqbutton/IQButton';
import SmartDropDown from 'components/smartDropdown';
import _ from 'lodash';
import {ChangeEvent, memo, useMemo, useState} from 'react';
import SUIBudgetLineItemSelect from 'sui-components/BudgetLineItemSelect/BudgetLineItemSelect';

import {InputAdornment, InputLabel, TextField, TextFieldProps} from '@mui/material';

import {getClientContractsList} from 'features/clientContracts/stores/gridSlice';
import React from 'react';
import {errorMsg, errorStatus} from 'utilities/commonutills';
import {formatBudgetItems} from '../../CERUtils';
import {addChangeEvent, fetchBudgetsByContractId} from '../../stores/ChangeEventAPI';
import {getAllActiveClientContracts, getChangeEventList, setChangeEventsListRefreshed, setToast} from '../../stores/ChangeEventSlice';

interface ChangeEventFormProps {
	name?: string;
	description?: string;
	clientContract?: any;
	budgetItems?: Array<any>;
	fundingSource?: any;
};

const ChangeEventRequestsForm = (props: any) => {
	const dispatch = useAppDispatch();
	const { changeEventsListRefreshed } = useAppSelector(state => state.changeEventRequest)
	const defaultValues: ChangeEventFormProps = useMemo(() => {
		return {
			name: '',
			description: '',
			clientContract: '',
			budgetItems: [],
			fundingSource: ''
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

	const getActiveClientContracts = () => {
		const contractsList: any = [];
		dispatch(getAllActiveClientContracts())?.then((resp) => {
			resp?.payload?.map((obj: any) => {
				contractsList?.push({id: obj?.id, label: obj?.title, value: obj?.id});
			});
			setContractOptions(contractsList);
		});
		dispatch(setChangeEventsListRefreshed(false));					
	};
	const getBudgets = (id: any) => {
		fetchBudgetsByContractId(id).then((resp: any) => {
			const workItems = formatBudgetItems(resp);
			let disableOptions:any = []
			resp?.map((obj:any) => {
				console.log("obj", obj?.hasVendorContract, obj)
				if(!obj?.hasVendorContract) disableOptions = [...disableOptions, obj?.id]
			})
			setDisableOptionsList([...disableOptions])
			console.log("resp", resp, workItems);
			for(let i = 0;i < workItems.length;i++) {
				for(let j = 0;j < workItems[i]?.options?.length;j++) {
					if(workItems[i]?.options[j]?.description ?? false) {
						setIsDescExists(true);
						break;
					}
				}
			}
			setBudgetsList(workItems);
		});
	};

	React.useEffect(() => {
		getActiveClientContracts();
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

	const handleDropdownChange = (value: any, fieldName: string) => {
		let contractEmpty = true,
			assignableValue = value;

		if(fieldName === 'clientContract') {
			const contractEmpty = _.isEmpty(value);
			getBudgets(value[0]);
			setBudgetDisabled(contractEmpty);
			if(!contractEmpty) assignableValue = value[0];
		} else if(fieldName === 'fundingSource') {
			assignableValue = value[0];
		}
		setChangeEvent((currentState) => {
			let newState = {...currentState, ...{[fieldName]: assignableValue}};
			if(fieldName === 'clientContract' && contractEmpty) {
				newState['budgetItems'] = [];
			}
			checkFormValidity(newState);
			return newState;
		});
	};

	const checkFormValidity = (record: ChangeEventFormProps) => {
		setAddDisabled(_.isEmpty(record?.name) || _.isEmpty(record?.clientContract) || _.isEmpty(record?.fundingSource));
	};

	const handleAdd = () => {
		const payload = {...changeEvent, clientContract: {id: changeEvent?.clientContract}, budgetItems: changeEvent?.budgetItems?.map((val: any) => {return {id: val, estimate: null, estimateSource: "EstimatedChangeAmount"};})};
		addChangeEvent(payload, (response: any) => {
			if(errorStatus?.includes(response?.status)) dispatch(setToast(errorMsg));
			else {
				setChangeEvent(defaultValues);
				dispatch(setToast('Created Change Event Request Sucessfully.'));
				setAddDisabled(true);
				dispatch(getChangeEventList());
				getActiveClientContracts();
			}
		});
	};

	return <form className='change-event-request-form'>
		<p className='form-title'>Create New Change Event</p>
		<DescriptionField
			name='description'
			className='description-field'
			value={changeEvent.description}
			onChange={handleFieldChange}
		/>
		<div className='spacer'></div>
		<div className='name-field'>
			<InputLabel
				required
				className='inputlabel'
				sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red',
					},
				}}
			>
				Name
			</InputLabel>
			<TextField
				fullWidth
				InputProps={{
					startAdornment: (
						<span className='common-icon-title'></span>
					)
				}}
				placeholder={'Enter Name Of the Request'}
				name='name'
				variant='standard'
				value={changeEvent.name}
				onChange={handleFieldChange}
			/>
		</div>
		<div className='client-contract-field'>
			<InputLabel
				required
				className='inputlabel'
				sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red',
					},
				}}
			>
				Client Contract
			</InputLabel>
			<SmartDropDown
				name='clientContract'
				LeftIcon={<span className='common-icon-contracts'> </span>}
				options={contractOptions}
				outSideOfGrid={true}
				isSearchField={false}
				isFullWidth
				Placeholder={'Select'}
				selectedValue={changeEvent?.clientContract}
				isMultiple={false}
				handleChange={(value: any) => handleDropdownChange(value, 'clientContract')}
			/>
		</div>
		<div className='work-item-field'>
			<SUIBudgetLineItemSelect
				name='budgetItems'
				disabled={isBudgetDisabled}
				lineItemlabel='Work Items'
				options={budgetsList}
				dropDownListExtraColumns={[
					{headerName: 'Work Item', field: 'label', name: 'label', width: '38em'},
					{headerName: 'Contract Amount', field: 'contractAmount', name: 'amount', width: '9em', align: 'right'},
					{headerName: 'UOM', field: 'unitOfMeasure', name: 'text', width: '2em', align: 'right', textAlign: 'right'},
					{headerName: 'Unit Quantity', field: 'quantity', name: 'text', width: '6em', align: 'right'},
					{headerName: 'Unit Cost', field: 'unitCost', name: 'amount', width: '5em', align: 'right'}
				]}
				selectedValue={changeEvent?.budgetItems ?? []}
				handleInputChange={(value: any) => handleDropdownChange(value, 'budgetItems')}
				showColumnHeader={false}
				showDropDownHeaderTitle={true}
				dropDownHeaderTitle={'Select Work Items'}
				showHeaderCloseIcon={true}
				disableOptionsList={disableOptionsList}
				showExtraColumns={true}
				isDropDownPosition={true}
				showDescription={isDescExists}
			></SUIBudgetLineItemSelect>
		</div>
		<div className='funding-resource-field'>
			<InputLabel
				required
				className='inputlabel'
				sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red',
					},
				}}
			>
				Funding Resource
			</InputLabel>
			<SmartDropDown
				name='fundingSource'
				LeftIcon={<span className='common-icon-funding-source'> </span>}
				options={fundingSourceOptions}
				outSideOfGrid={true}
				isSearchField={false}
				isFullWidth
				Placeholder={'Select'}
				isMultiple={false}
				selectedValue={changeEvent?.fundingSource}
				handleChange={(value: any) => handleDropdownChange(value, 'fundingSource')}
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

export default memo(ChangeEventRequestsForm);

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