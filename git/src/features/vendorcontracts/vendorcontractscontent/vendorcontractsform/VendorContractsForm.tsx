import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import SUIPagingDropdown from 'sui-components/PagingDropdown/SUIPagingDropdown';
import _ from 'lodash';
import { fetchBidderCompanyData } from 'features/bidmanager/stores/BidManagerAPI';
import { getCompanyFilterOptions } from 'utilities/bid/enums';
import { RemoveCompanyOptionDuplicates, noDataFoundMsg_company } from 'features/bidmanager/bidpackagedetails/tabs/bidders/Bidders';

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
	const [clearAdhocBid, setClearAdhocBid] = useState<any>(false);

	const [pageSize, setPageSize] = React.useState(50);
  	const pageRef = useRef(1);
	const companySearchRef =  useRef("");
	const oldPayload = useRef<any>();
	const isMakeApi = useRef(true);
	const groupedCompanyRef = useRef<any>([]);
	const suggestedCompanyRef = useRef<any>([]);
	const [groupedCompany, setGroupedCompany] = useState<any>([]);
	const [suggestedCompany, setSuggestedCompany] = useState<any>([]);
	const defaultPayloadRef = useRef({
		"projectId": appInfo?.uniqueId,
		"sortBy":"name",
		"sortDirection":"ASC",
		"start": 0,
		"limit": pageSize,
		"orgStart" : 0,
		"orgLimit" : 0,
		"page" : 1,
		"searchText": companySearchRef.current
	});
	const CompanyDropdownApiCall = (info:any, payload:any, scroll?:boolean) => {
			fetchBidderCompanyData(info, payload).then((res: any) => {
				if(!!res) {
					isMakeApi.current = true;
					if(scroll) {
						pageRef.current = (pageRef.current + 1);
					};
					oldPayload.current = res;
					getCompanyOptions(res?.values?.companies);
				}
			})
			.catch((error: any) => {
				console.log("error", error);
				return;
			});
	};
	const getCompanyOptions = (array:any) => {
		let groupedList: any = [];
		([...array] || [])?.map((data: any) => {
			groupedList.push({
				...data,
				objectId: data.id,
				id:data.uniqueId,
				color: data.colorCode,
				displayField: data.name,
				thumbnailUrl: data.thumbnailUrl,
				scope: data.isOrgCompany ? 'Organizational' : 'This Project',
				isSuggested: data.isOrgCompany
			});
		});
		if (groupedList.length > 0) {
			let filterOrgCompanies: any = [...groupedList].filter((item: any) => item.isSuggested);
			let filterThisProjectCompanies: any = [...groupedList]?.filter((item: any) => { return !item.isSuggested });
			let mergeSuggestCompany = suggestedCompanyRef.current?.length > 0 ? RemoveCompanyOptionDuplicates([...suggestedCompanyRef.current, ...filterOrgCompanies]) : filterOrgCompanies;
			let mergeGroupedCompany = groupedCompanyRef.current?.length > 0 ? RemoveCompanyOptionDuplicates([...groupedCompanyRef.current,...filterThisProjectCompanies]) : filterThisProjectCompanies; 
			groupedCompanyRef.current = mergeGroupedCompany;
			suggestedCompanyRef.current = mergeSuggestCompany;
			setGroupedCompany(groupedCompanyRef.current);
			setSuggestedCompany(suggestedCompanyRef.current);
		} else {
			groupedCompanyRef.current = [];
			suggestedCompanyRef.current = [];
			setGroupedCompany([]);
			setSuggestedCompany([]);
		};
	};
	useEffect(() => {
		if(appInfo) {
			CompanyDropdownApiCall(appInfo, defaultPayloadRef.current);
		}
	},[appInfo]);
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
			setClearAdhocBid(true);						
		}
		else if (name == 'bidLookup') {
			console.log("bbidLookup", value)
			setClearAdhocBid(false);									
			if(value?.isAdhoc) setIsAdhocBid(true); 
			else setIsAdhocBid(false);
		}

		else {
			setDisableAddButoon(formDataClone?.title !== '' && formDataClone?.vendor?.length > 0 && formDataClone?.amount !== '' ? false : true);
			setClearAdhocBid(false);			
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
				setClearAdhocBid(true);
				// dispatch(getVendorContractsList(appInfo));
				dispatch(setToastMessage({ displayToast: true, message: 'New Vendor Contract created successfully' }));
			}
		});
	};


	const ResetValues = () => {
		groupedCompanyRef.current = [];
		suggestedCompanyRef.current = [];
		setGroupedCompany([]);
		setSuggestedCompany([]);
	};
	const debounce = useCallback(_.debounce((val, key) => {
		if(key === 'search'){
			defaultPayloadRef.current = {...defaultPayloadRef.current, ['searchText'] : val};
			CompanyDropdownApiCall(appInfo, defaultPayloadRef.current);
			ResetValues();
		};
	}, 1000), []);
	const handleCompanySearchChange = (searchVal?:any) => {
		companySearchRef.current = searchVal;
		debounce(searchVal, 'search');
	};
	const handleScrollEvent = useCallback((e:any) => {
		if(isMakeApi.current) {
			let payload:any;
			let page = pageRef.current;
			let previousPayload = oldPayload?.current?.values;
			let startPage = page * (pageSize);
			payload = {
				"projectId": appInfo?.uniqueId,
				"sortBy":"name",
				"sortDirection":"ASC",
				"start": previousPayload?.orgStart > 0 ? previousPayload?.start : startPage,
				"limit": previousPayload?.orgStart > 0 ? previousPayload?.limit : pageSize,
				"orgStart" : previousPayload?.orgStart > 0 ? previousPayload?.orgStart : 0,
				"orgLimit" : previousPayload?.orgStart > 0 ? previousPayload?.orgLimit : pageSize,
				"searchText": companySearchRef.current
			};
			isMakeApi.current = false;
			CompanyDropdownApiCall(appInfo, payload, true);
		}
	}, [oldPayload, companySearchRef]);
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
			<SUIPagingDropdown
						value={formData?.vendor}
						width="100%"
						menuWidth="200px"
						icon={<span className="common-icon-Companies"> </span>}
						placeHolder={'Select Vendor'}
						dropdownOptions={groupedCompany || []}
						suggestedDropdownOptions={suggestedCompany || []}
						noDataFoundMsg={noDataFoundMsg_company}
						handleValueChange={(value: any) => handleOnChange(value, 'vendor')}
						showFilterInSearch={false}
						onSearchChange={(values:any) => handleCompanySearchChange(values)}
						paperpropsclassName={'companyMenu-dropdown-cls'}
						showSearchInSearchbar={false}
						addCompany={false}
						handleScrollEvent= {(e:any) => handleScrollEvent(e)}
						totalCount = {oldPayload?.current?.totalCount}
						// retainSearch={companySearchRef.current}
						enableGrouping={false}
					/>
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
			<AssociatedBidDropdown onSelectionChange={(rec: any)=> handleOnChange(rec, 'bidLookup')} options={lookUpData ? lookUpData : []} bidNamesList={bidNamesList} clearSelectedValue={clearAdhocBid}></AssociatedBidDropdown>
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
				placeholder={'Enter Amount'}
				InputProps={{
					startAdornment: (
						<span className="common-icon-contract-amount"> </span>
					),
					readOnly: true,
					disableUnderline: true
				}}
				name='name'
				variant='standard' //currencySymbol
				value={`${formData?.amount ? amountFormatWithSymbol(formData?.amount) : 'Enter Amount'}`}

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