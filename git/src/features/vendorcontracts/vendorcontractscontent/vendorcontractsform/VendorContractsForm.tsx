import React, {useEffect, useState} from 'react';
import { TextField, InputLabel, Button } from '@mui/material';
import InputIcon from 'react-multi-date-picker/components/input_icon';

import './VendorContractsForm.scss';

import IQButton from 'components/iqbutton/IQButton';
import DatePickerComponent from 'components/datepicker/DatePicker';
//import BidPackageName from 'resources/images/bidManager/BidPackageName.svg';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { setToastMessage, getBidLookupData, getBidLookup, getCompanyData, setSelectedVendorInCreateForm } from 'features/vendorcontracts/stores/VendorContractsSlice';
import { getServer } from 'app/common/appInfoSlice';
import SUIBaseDropdownSelector from 'sui-components/BaseDropdown/BaseDropdown';
import SmartDropDown from 'components/smartDropdown';
import { createVendorContracts } from '../../stores/gridAPI';
import { makeStyles, createStyles } from '@mui/styles';
import { errorMsg, errorStatus } from 'utilities/commonutills';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssociatedBidDropdown from 'sui-components/AssociatedBidDropdown/AssociatedBidDropdown';

const defaultFormData = {
	title: '',
	vendor: '',
	bidLookup: '',
	amount: '',
	startDate: '',
	endDate: '',
};
const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		menuPaper: {
			width: '200px'
		}
	})
);
const VendorContractsForm = (props: any) => {

	// Redux State Variable

	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { gridData } = useAppSelector(state=> state.vendorContractsGrid)

	// Local state vaiables

	const [budgetLineItems, setBudgetLineItems] = React.useState<any>([]);
	const [formData, setFormData] = React.useState<any>(defaultFormData);
	const [disableAddButton, setDisableAddButoon] = React.useState<boolean>(true);

	const BidLookupData = useAppSelector(getBidLookupData);
	const CompanyData = useAppSelector(getCompanyData);
	const [lookUpData, setLookUpData] = React.useState<any>([]);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const classes = useStyles();
	const [companyOptions, setCompanyOptions] = React.useState<any>([]);
	const filterRef = React.useRef();
	const [isAdhocBid, setIsAdhocBid] = React.useState<boolean>(false);	
	const [bidNamesList, setBidNamesList] = useState<any>([]);
	

	// Effects
	useEffect(() => {
		let bidsList: any = [];
		(gridData || []).forEach((rec: any) => {
		  if (rec.bidPackage?.name && !bidsList.includes(rec.bidPackage?.name)) {
			bidsList.push(rec.bidPackage.name?.toLowerCase());
		  }
		});
		BidLookupData?.map((data: any) => {
			if(!bidsList.includes(data?.name)) bidsList.push(data?.name?.toLowerCase());
		});
		setBidNamesList(bidsList);
	  }, [gridData, BidLookupData]);
	

	// onchange methods

	const handleOnChange = (value: any, name: any) => {
		console.log("valuee", name, value)
		const formDataClone = { ...formData, [name]: value };

		if (name == 'startDate' && formDataClone.startDate != '') {

			if (new Date(formDataClone.startDate) > new Date(formDataClone.endDate)) {
				setDisableAddButoon(true);
				dispatch(setToastMessage({ displayToast: true, message: 'Start Date should not be greater than End Date' }));
			}
			else {
				if (formDataClone?.title != '') {
					setDisableAddButoon(false);
				}
			}
		}
		else if (name == 'endDate' && formDataClone.endDate != '') {
			if (new Date(formDataClone.endDate) < new Date(formDataClone.startDate)) {
				setDisableAddButoon(true);
				dispatch(setToastMessage({ displayToast: true, message: 'End Date Should Not be less Than start Date' }));
			}
			else {
				if (formDataClone?.title != '') {
					setDisableAddButoon(false);
				}
			}
		}
		else if (name == 'vendor') {
			dispatch(setSelectedVendorInCreateForm(value[0]['objectId']));
			dispatch(getBidLookup({ appInfo: appInfo, objectId: value[0]['objectId'] }));
		}
		else if (name == 'bidLookup') {
			console.log("bbidLookup", value)
			if(value?.isAdhoc) setIsAdhocBid(true); 
			else setIsAdhocBid(false);
		}

		else {
			setDisableAddButoon(formDataClone?.title !== '' && formDataClone?.vendor?.length > 0 && formDataClone?.amount !== '' ? false : true);
		}

		setFormData(formDataClone);
	};
	const stopPropagation = (e:any) => {
		switch (e.key) {
		  case "ArrowDown":
		  case "ArrowUp":
		  case "Home":
		  case "End":
			break;
		  default:
			e.stopPropagation();
		}
	  };

	React.useEffect(() => {
		if (BidLookupData) {
			const array: any = [];
			BidLookupData?.map((data: any) => {
				array.push({ id: data.id, label: data.name, value: data.id });
			});
			setLookUpData([...array]);
		}

	}, [BidLookupData]);

	React.useEffect(() => {
		if (formData.bidLookup != '' && !isAdhocBid) {
			BidLookupData?.map((data: any) => {
				if (data.id == formData.bidLookup?.id) {
					setFormData({ ...formData, amount: data.estimatedBudget });
				}
			});
		}
		else setFormData({ ...formData, amount: 0 });
		
	}, [formData.bidLookup]);

	React.useEffect(() => {
		if (CompanyData) {
			console.log('CompanyData', CompanyData)
			let groupedList: any = [];
			CompanyData?.map((data: any) => {
				groupedList.push({
					...data,
					color: data.colorCode,
					id: data.id,
					displayField: data.name,
					thumbnailUrl: data.thumbnailUrl,
				});
			});
			setCompanyOptions(groupedList)
		}
	}, [CompanyData])

	React.useEffect(() => {
		setDisableAddButoon(formData?.title !== '' && formData?.vendor?.length > 0 && formData?.amount !== '' ? false : true);
	}, [formData.amount]);

	React.useEffect(() => {
		if (formData.vendor) {
			setFormData({ ...formData, amount: '' });
		}
	}, [formData.vendor]);

	const handleAdd = () => {
		// dispatch(setToastMessage({ displayToast: true, message: 'Vendor Contract Added Successfully' }));
		const payload = {
			title: formData.title,
			startDate: formData.startDate != '' ? formData?.startDate : null,
			endDate: formData.endDate != '' ? formData?.endDate : null,
			bidPackage: {
				id: isAdhocBid ? null : formData.bidLookup?.id,
				name: formData.bidLookup?.label,
				// If required send this key
				// isAdhoc: isAdhocBid
			},
			vendor: {
				id: formData.vendor[0]['id']
			}
		};
		console.log('payload', payload)
		createVendorContracts(appInfo, payload).then((response: any) => {
			console.log("error resp", response);
			if (errorStatus?.includes(response?.status)) dispatch(setToastMessage({ displayToast: true, message: errorMsg }));
			else {
				setDisableAddButoon(true);
				setFormData(defaultFormData);
				// dispatch(getVendorContractsList(appInfo));
				dispatch(setToastMessage({ displayToast: true, message: 'New Vendor Contract created successfully' }));
			}
		});
	};


	return <div className='vendor-contract-lineitem-form'>
		<div className='title-field'>
			<InputLabel required className='inputlabel' sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}}>Title</InputLabel>
			<TextField
				id='name'
				fullWidth
				InputProps={{
					startAdornment: (
						<span className="common-icon-title"> </span>
					)
				}}
				placeholder={'Enter Contract Title'}
				name='title'
				variant='standard'
				value={formData.title}
				onChange={(e: any) => handleOnChange(e.target.value, 'title')}
			/>
		</div>
		<div style={{
			width: '30%',
			padding: 'unset',
		}} className='vendor-field'>
			<InputLabel required className='inputlabel' sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}}>Vendor</InputLabel>
			<SUIBaseDropdownSelector
				value={formData?.vendor ? formData?.vendor : []}
				width="100%"
				menuWidth="200px"
				icon={<span className="common-icon-Companies"> </span>}
				placeHolder={'Select Vendor'}
				dropdownOptions={companyOptions}
				handleValueChange={(value: any, params: any) => handleOnChange(value, 'vendor')}
				showFilterInSearch={false}
				multiSelect={false}
				companyImageWidth={'17px'}
				companyImageHeight={'17px'}
				showSearchInSearchbar={true}
				addCompany={false}
			></SUIBaseDropdownSelector>
		</div>
		<div className='bid-lookup-field'>
			<InputLabel className='inputlabel' required sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}} >Associated Bid</InputLabel>
			{/* <SmartDropDown
				LeftIcon={<span className="common-icon-bid-lookup"> </span>}
				options={lookUpData ? lookUpData : []}
				outSideOfGrid={true}
				isSearchField={false}
				isFullWidth
				Placeholder={'Select'}
				useNestedOptions={true}
				filterRef={filterRef}
				// selectedValue={formData.curve}
				menuProps={classes.menuPaper}
				isMultiple={false}
				handleChange={(value: any) => handleOnChange(value, 'bidLookup')}
			/> */}
			<AssociatedBidDropdown onSelectionChange={(rec: any)=> handleOnChange(rec, 'bidLookup')} options={lookUpData ? lookUpData : []} bidNamesList={bidNamesList}></AssociatedBidDropdown>
		</div>
		<div className='amount-field'>
			<InputLabel required className='inputlabel' sx={{
				'& .MuiFormLabel-asterisk': {
					color: 'red'
				}
			}}>Contract Amount</InputLabel>

			<TextField
				id='name'
				fullWidth
				placeholder={'Contract Amount'}
				InputProps={{
					startAdornment: (
						<span className="common-icon-contract-amount"> </span>
					),
					readOnly: true,
					disableUnderline: true
				}}
				name='name'
				variant='standard' //currencySymbol
				value={`${formData?.amount ? amountFormatWithSymbol(formData?.amount) : 'Contract Amount'}`}

				onChange={(e: any) => handleOnChange(e.target.value, 'amount')}
			/>
		</div>
		<div className='start-date-field'>
			<InputLabel className='inputlabel'>Contract Start Date</InputLabel>
			{/* <span className='budget-Date-1'></span> */}
			<DatePickerComponent
				defaultValue={formData.startDate}
				onChange={(val: any) => handleOnChange(new Date(val)?.toISOString(), 'startDate')}
				maxDate={formData.endDate !== '' ? new Date(formData.endDate) : new Date('12/31/9999')}
				containerClassName={'iq-customdate-cont'}
				render={
					<InputIcon
						placeholder={"Select"}
						className={'custom-input rmdp-input'}
						style={{ background: '#f7f7f7' }}
					/>
				}
			/>
		</div>
		<div className='end-date-field'>
			<InputLabel className='inputlabel'>Contract End Date</InputLabel>
			{/* <span className='budget-Date-1'></span> */}
			<DatePickerComponent
				defaultValue={formData.endDate}
				onChange={(val: any) => handleOnChange(new Date(val)?.toISOString(), 'endDate')}
				minDate={new Date(formData.startDate)}
				containerClassName={'iq-customdate-cont'}
				render={
					<InputIcon
						placeholder={"Select"}
						className={'custom-input rmdp-input'}
						style={{ background: '#f7f7f7' }}
					/>
				}

			/>
		</div>
		<IQButton
			color='orange'
			sx={{
				height: '2.5em',
				backgroundColor: '#ed7431',
				'&.Mui-disabled': {
					opacity: '0.4'
				}
			}}
			disabled={disableAddButton}
			onClick={handleAdd}
		>
			+ ADD
		</IQButton>
	</div>;
};
export default VendorContractsForm;