// const BudgetCreateForm:any = () => {
//     return(<></>)
// }
// export default BudgetCreateForm;

import './BudgetCreateForm.scss';

import {getServer, getCostTypeList, getCostUnitList, setCostUnitList} from 'app/common/appInfoSlice';
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
import CostCodeSelect from 'sui-components/CostCodeSelect/costCodeSelect';
import { CostCodeFilterData, DivisionCostCodeDropdownData } from 'data/MultiLevelFilterData';
import globalStyles from 'features/budgetmanager/BudgetManagerGlobalStyles';
import OriginalBudget from 'features/budgetmanager/orginalBudget/OrginalBudget';
// import {formatBudgetItems} from '../../CERUtils';
// import {addChangeEvent, fetchBudgetsByContractId} from '../../stores/ChangeEventAPI';
// import {getAllActiveClientContracts, getChangeEventList, setChangeEventsListRefreshed, setToast} from '../../stores/ChangeEventSlice';
import { settingcostcodetypeData } from "data/SettingsCosttypeData";
import { validate } from 'features/budgetmanager/headerpage/Validation';
import { isLocalhost } from 'app/utils';

interface ChangeEventFormProps {
	name?: string;
	description?: string;
	clientContract?: any;
	budgetItems?: Array<any>;
	fundingSource?: any;
};

const BudgetCreateForm = (props: any) => {
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

	const defaultData = {
		costCode: '',
		costType: '',
		startDate: '',
		endDate: '',
		curve: null,
		originalBudgetAmount: {
			unitOfMeasure: '',
			quantity: '',
			cost: '',
			amount: ''
		}
	}
	const fundingSourceOptions = [
		{id: 1, label: 'Change Order', value: 'ChangeOrder'},
		{id: 2, label: 'Contingency', value: 'Contingency'},
		{id: 3, label: 'General Contractor', value: 'GeneralContractor'},
	];
    const costTypeOpts = useAppSelector(getCostTypeList);
	const [changeEvent, setChangeEvent] = useState<ChangeEventFormProps>(defaultValues);
	const [isBudgetDisabled, setBudgetDisabled] = useState<boolean>(true);
	const [isAddDisabled, setAddDisabled] = useState<boolean>(true);
	const [contractOptions, setContractOptions] = useState<any>([]);
	const [budgetsList, setBudgetsList] = useState<any>([]);
	const [disableOptionsList, setDisableOptionsList] = useState<any>([]);	
	const [isDescExists, setIsDescExists] = useState(false);
	const appInfo = useAppSelector(getServer);
    const costUnitOpts = useAppSelector(getCostUnitList);
    const [originalBudgetCatalogData, setOriginalBudgetCatalogData] = React.useState<any>({unitOfMeasure: '',quantity: '',cost: ''});
    const [originalBudgetCatalogReadOnly, setOriginalBudgetCatalogReadOnly] = React.useState<any>({unitofMeasure: false,quantity: false,cost: false});
	const [headerPageData, setHeaderPageData] = React.useState<any>(defaultData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);
	const [localhost] = React.useState(isLocalhost);
	const { settingsData, costCodeDropdownData, divisionCostCodeFilterData, CostCodeAndTypeData } = useAppSelector(state => state.settings);
	const { gridData } = useAppSelector((state) => state.gridData);

	const getActiveClientContracts = () => {
		const contractsList: any = [];
		// dispatch(getAllActiveClientContracts())?.then((resp) => {
		// 	resp?.payload?.map((obj: any) => {
		// 		contractsList?.push({id: obj?.id, label: obj?.title, value: obj?.id});
		// 	});
		// 	setContractOptions(contractsList);
		// });
		// dispatch(setChangeEventsListRefreshed(false));					
	};

	React.useEffect(() => {
		let costTypeTimeList: any = [];
		let costTypeQuantityList: any = [];
		setTimeout(() => {
			props.onLineItemAdded && props.onLineItemAdded({ displayToast: false, message: '' });
		}, 3000);
		setDisableAddButoon(validate(headerPageData));
		if (settingsData.allowMultipleLineItems === false &&
			checkCostCodeAndCostTypeCombinationExistedInGridData(headerPageData.division,
				headerPageData.costCode, headerPageData.costType).includes(true)
		) setDisableAddButoon(true);

		const listManagerData = localhost ? settingcostcodetypeData?.values : CostCodeAndTypeData?.values;

		if (listManagerData?.length > 0) {
			listManagerData?.map((type: any) => {
				if (type?.name == 'Unit of Measure - Quantity') costTypeQuantityList = [...type?.listValues];
				if (type?.name == 'Unit of Measure - Time') costTypeTimeList = [...type?.listValues];
			});
		}
		['L - Labor', 'SVC - Professional Services'].includes(headerPageData?.costType) ? dispatch(setCostUnitList(costTypeTimeList)) : dispatch(setCostUnitList(costTypeQuantityList))

	}, [headerPageData]);

	const checkCostCodeAndCostTypeCombinationExistedInGridData = (division: string, code: string, type: string) => {
		return gridData.map((row: any, index: number) => {
			return row.division === division && row.costCode === code && row.costType === type ? true : false
		})
	}

	const getBudgets = (id: any) => {
		// fetchBudgetsByContractId(id).then((resp: any) => {
		// 	const workItems = formatBudgetItems(resp);
		// 	let disableOptions:any = []
		// 	resp?.map((obj:any) => {
		// 		console.log("obj", obj?.hasVendorContract, obj)
		// 		if(!obj?.hasVendorContract) disableOptions = [...disableOptions, obj?.id]
		// 	})
		// 	setDisableOptionsList([...disableOptions])
		// 	console.log("resp", resp, workItems);
		// 	for(let i = 0;i < workItems.length;i++) {
		// 		for(let j = 0;j < workItems[i]?.options?.length;j++) {
		// 			if(workItems[i]?.options[j]?.description ?? false) {
		// 				setIsDescExists(true);
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	setBudgetsList(workItems);
		// });
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
		// addChangeEvent(payload, (response: any) => {
		// 	if(errorStatus?.includes(response?.status)) dispatch(setToast(errorMsg));
		// 	else {
		// 		setChangeEvent(defaultValues);
		// 		dispatch(setToast('Created Change Event Request Sucessfully.'));
		// 		setAddDisabled(true);
		// 		dispatch(getChangeEventList());
		// 		getActiveClientContracts();
		// 	}
		// });
	};

	return <form className='esitmate-budget-create-form'>
		<p className='form-title'>Create New Estimate Line Item</p>
		<DescriptionField
			name='description'
			className='description-field'
			value={changeEvent.description}
			onChange={handleFieldChange}
		/>
		<div className='spacer'></div>
		<div className='name-field'>
            <CostCodeSelect
                label="Division/Cost Code"
                options={DivisionCostCodeDropdownData?.length > 0 ? DivisionCostCodeDropdownData : []}
                // onChange={(value:any) => handleOnChange(value, 'copy')}
                required={true}
                startIcon={<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></div>}
                checkedColor={'#0590cd'}
                showFilter={false}
                selectedValue={''}
				outSideOfGrid={true}
				showFilterInSearch={true}
                Placeholder={'Select'}
                // onFiltersUpdate={(filters:any) => setDefaultFilters(filters)}
                filteroptions={CostCodeFilterData.length > 0 ? CostCodeFilterData : []}
                onFiltersUpdate={(filters:any) => console.log(filters)}
                defaultFilters={[]}
				displayEmpty={true}
            />

        </div>
		<div className='client-contract-field'>
        <SmartDropDown
					LeftIcon={
						<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.3rem' }}></div>
						// <GridView fontSize={primaryIconSize} style={{ color: globalStyles.primaryColor }} />
					}
					options={costTypeOpts?.length > 0 ? costTypeOpts : []}
					dropDownLabel="Cost Type"
					isSearchField
					required
					outSideOfGrid={true}
					selectedValue={headerPageData.costType}
					isFullWidth
					// handleChange={(value: any) => handleOnChange(value[0], 'costType')}
					// menuProps={classes.menuPaper}
					displayEmpty={true}
					Placeholder={'Select'}
					ignoreSorting={true}
					// disabled={isBudgetLocked}
				/>
		</div>
		<div className='work-item-field'>
        		<OriginalBudget
                    label={'Original Estimate'}
					defaultValue={headerPageData?.originalBudgetAmount?.amount?.toLocaleString('en-US')}
					iconColor={globalStyles.primaryColor}
					clearBudgetFields={false}
					unitList={costUnitOpts}
					readOnly={true}
					disabled={false}
					showCatalogBtn={['E - Equipment', 'M - Materials', 'M - Material']?.includes(headerPageData?.costType)}
					showLaborBtn={headerPageData?.costType === 'L - Labor'}				
					// handleCatalogSubmit={() => handleCatalogSubmit()}
					onSubmit={(value) => setHeaderPageData({ ...headerPageData, ['originalBudgetAmount']: value })}
					onBlur={(value) => setHeaderPageData({ ...headerPageData, ['originalBudgetAmount']: value })}
					data={originalBudgetCatalogData}
					textFieldReadonly={originalBudgetCatalogReadOnly}
				/>
		</div>
		<div className='funding-resource-field'>
		
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

export default memo(BudgetCreateForm);

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