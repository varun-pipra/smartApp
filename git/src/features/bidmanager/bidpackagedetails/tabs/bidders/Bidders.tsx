import './Bidders.scss';

import { getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { postMessage } from 'app/utils';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { CreateBidders, deleteBidders } from 'features/bidmanager/stores/BiddersAPI';
import { fetchBiddersGriddata, setBiddersData } from 'features/bidmanager/stores/BiddersSlice';
import {
	fetchBidPackageDetails, fetchCompanyList, fetchContactPersonsList, getCompanyData,
	getContactPerson, setSelectedRecord
} from 'features/bidmanager/stores/BidManagerSlice';
import { patchBidPackage } from 'features/bidmanager/stores/gridAPI';
import { fetchGridData } from 'features/bidmanager/stores/gridSlice';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import infoicon from 'resources/images/common/infoicon.svg';
import SUIAlert from 'sui-components/Alert/Alert';
import SUIBaseDropdownSelector from 'sui-components/BaseDropdown/BaseDropdown';
import SUILineItem from 'sui-components/LineItem/LineItem';
import { getBidProcessType, getBidType } from 'utilities/bid/enums';
import { formatPhoneNumber } from 'utilities/commonFunctions';

import {
	Box, Button, Grid, InputLabel, Stack, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import _ from 'lodash';
import SUIPagingDropdown from 'sui-components/PagingDropdown/SUIPagingDropdown';
import { fetchBidderCompanyData } from 'features/bidmanager/stores/BidManagerAPI';
interface BiddersProps {
	readOnly?: boolean;
};

const noDataFoundMsg_company = (
	<div>
		<span className="common-icon-building icon"></span>
		<h4>No Company Exist</h4>
		<div>Click on the + add button to add</div>
		<div>this company to the list</div>
	</div>
);

const noDataFoundMsg_Contact = (
	<div>
		<span className="common-icon-Bidders icon"></span>
		<h4>No Contact Exist</h4>
		<div>Click on the + add button to add</div>
		<div>this contact to the list</div>
	</div>
);

const Bidders = (props: BiddersProps) => {
	const emptyBiddersRow = [{
		company: { id: '', value: '', color: '' }, contactPerson: { id: '', displayId: '' }, email: '', phoneNo: ''
	}];
	const { BiddersGridData } = useAppSelector((state) => state.bidders);
	const { companyList, contactPersonsList, BudgetLineItems, selectedRecord, companyFiltersList } = useAppSelector((state:any) => state.bidManager);
	let filterOptions = useMemo(() => {
		var filterMenu = [{
			text: 'Scope',
			key: 'scope',
			value: 'scope',
			icon: <span className='common-icon-scope' />,
			children: {
				type: 'checkbox',
				items: [{
					id : 1,
					text: 'This Project',
					key: 'scope',
					value: 'This Project'
				}, {
					id : 2,
					text: 'Organizational',
					value: 'Organizational',
					key: 'scope',
				},]
			}
		},
		{
			text: 'Diverse Supplier',
			key: 'diverseCategories',
			value: 'diverseCategories',
			icon: <span className='common-icon-diverse-supplier' />,
			children: {
				type: 'checkbox',
				items: [...companyFiltersList]
			}
		},
		{
			text: 'Compliance Status',
			key: 'complianceStatus',
			value: 'complianceStatus',
			icon: <span className='common-icon-compliance-Status' />,
			children: {
				type: 'checkbox',
				items: [{
					text: 'Compliant',
					key: 'complianceStatus',
					value: 'Compliant'
				}, {
					text: 'Not Verified',
					value: 'Not Verified',
					key: 'complianceStatus',
				},
				{
					text: 'Non Compliant',
					value: 'N/A',
					key: 'complianceStatus',
				},
				{
					text: 'Expired',
					value: 'Expired',
					key: 'complianceStatus',
				}
				]
			}
		}];
		return filterMenu;
	}, []);
	const CompanyData = useAppSelector(getCompanyData)
	const appInfo = useAppSelector(getServer);
	// const { BudgetLineItems, selectedRecord } = useAppSelector((state) => state.bidManager);
	// const containerStyle = useMemo(() => ({ width: "100%", height: "300px" }), []);
	const dispatch = useAppDispatch();
	const [enableAddbtn, setEnableAddbtn] = useState(false);
	const [showAddRow, setShowAddRow] = useState(true);
	const [newRecord, setNewRecord] = useState({});
	const [toggleBtnsData, setToggleBtnsData] = useState<any>({});
	const [rowData, setRowData] = useState<any>([]);
	const [selectedBidder, setSelectedBidder] = useState<any>(emptyBiddersRow[0])
	const gridRef = useRef<any>(null);
	const [selectedPerson, setSelectedPerson] = useState({
		id: '', email: '', phoneNumber: ''
	})
	const [contactperson, setContactPerson] = useState<any>([]);
	const [existedCompanies, setExistedCompanies] = useState<any>([]);
	const [openAlert, setOpenAlert] = useState<any>(false);
	const [companyOptions, setCompanyOptions] = useState([]);
	const [contactPersonOptions, setContactPersonOptions] = useState([]);
	const [suggestCompanyValues, setSuggestCompanyValues] = useState([]);
	const [suggestContactPersons, setSuggestContactPersons] = useState([]);
	const [companyData, setCompanyData] = useState<any>([]);
	const [closeBaseDropdown, setCloseBaseDropdown] = useState<boolean>(false);
	const [groupedCompanyList, setGroupedCompanyList] = useState<any>([]);
	const [newlyAddedCompany, setNewlyAddedCompany] = useState<any>(null);
	const { newCompany, newBidder } = useAppSelector((state) => state.bidders);
	const [bidPackageId, setBidPackageId] = useState();
	const [selectedCompany, setSelectedCompany] = useState<any>();

	/*Below state's are used for server side pagination for the company Dropdown. */
	
	const [pageSize, setPageSize] = React.useState(50);
  	const [companyFilters, setCompanyFilters] = React.useState({});
	const [companySearch, setCompanySearch] = React.useState("");
	const pageRef = useRef(1);
	const companySearchRef =  useRef("");
	const companyFiltersRef = useRef({});
	const groupedCompanyRef = useRef<any>();
	const existedCompanyRef = useRef<any>();
	const suggestedCompanyRef = useRef<any>();
	const oldPayload = useRef<any>();
	const filterMenuOptionsRef = useRef<any>(filterOptions);
	const isMakeApi = useRef(true);
	const defaultPayloadRef = useRef({
		"projectId": appInfo?.uniqueId,
		"sortBy":"name",
		"sortDirection":"ASC",
		"start": 0,
		"limit": pageSize,
		"orgStart" : 0,
		"orgLimit" : 0,
		"page" : 1,
		"searchText": companySearchRef.current,
		"filters": companyFiltersRef.current
	});
	useEffect(() => {
		if(appInfo && companyFiltersList) {
			filterMenuOptionsRef.current = filterOptions;
		}
	},[]);

	useEffect(() => {
		console.log('newCompany', newCompany)
		setNewlyAddedCompany(newCompany);
		const company = { company: { id: newCompany?.id, value: newCompany?.name, color: newCompany?.colorCode } };
		setSelectedBidder({ ...selectedBidder, ...company });
	}, [newCompany]);

	useEffect(() => {
		ContactPersonFetch(selectedCompany)
		setSelectedBidder({ ...selectedBidder, ...newBidder });
	}, [newBidder]);

	useEffect(() => {
		console.log('selectedBidder', selectedBidder)
	}, [selectedBidder]);

	useEffect(() => {
		setToggleBtnsData(selectedRecord);
		if (selectedRecord?.id && bidPackageId !== selectedRecord?.id) {
			setBidPackageId(selectedRecord?.id);
			dispatch(fetchBiddersGriddata({ appInfo: appInfo, packageId: selectedRecord?.id }));
		}
	}, [selectedRecord]);

	useEffect(() => {
		setCompanyData(companyList);
	}, [companyList]);

	useEffect(() => {
		if (props.readOnly) {
			setRowData([...BiddersGridData]);
		} else {
			if (toggleBtnsData?.type == 0 && BiddersGridData?.length > 0) {
				setRowData([...BiddersGridData]);
				setShowAddRow(false);
			} else {
				const companyIds = BiddersGridData?.map((row: any) => { return row?.company?.objectId });
				existedCompanyRef.current = companyIds;
				setExistedCompanies(companyIds);
				setRowData([...emptyBiddersRow, ...BiddersGridData]);
				setShowAddRow(true);
			}
		}
	}, [BiddersGridData, props.readOnly, toggleBtnsData]);
	const GetScopeFilter = (params:any) => {
		if(!!params) {
			let scope:any;
			let values = ['This Project', 'Organizational'];
			if(values?.every((x:any) => params?.includes(x))) {
				scope = 0; // All
			} else if(params?.includes('This Project')) {
				scope = 1; // This Project
			} else if(params?.includes('Organizational')) {
				scope = 2; // Organization
			};
			return scope;
		};
	};
	const ApiCall = (info:any, payload:any, scroll?:boolean) => {
		let params = _.cloneDeep(payload);
			if(Object.keys(params?.filters)?.length) {
				Object.keys(params?.filters).map((item:any, index:any) => {
					if(item === 'diverseCategories') return	params.filters[item] = ([...companyFiltersList] || [])?.filter((rec:any) => params?.filters?.[item]?.includes(rec?.value))?.map((x:any)  => x?.id);
					else if(item === 'scope') {
						params = {...params, ['scope'] : GetScopeFilter(params?.filters?.[item])};
						delete params?.filters?.[item];
					};
					if(params?.filters[item] === 'complianceStatus' && params?.filters[item]?.includes('all')) return	params.filters[item] = params?.filters?.complianceStatus.shift();
				});
			};
			fetchBidderCompanyData(info,params).then((res: any) => {
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
	useEffect(() => {
		if (companyData?.length) {
			ApiCall(appInfo, defaultPayloadRef.current);
		}
	}, [companyData, companySearch]);
	const RemoveDuplicates = (array:any) => {
		return Array.from(new Set(array.map((a:any) => a.uniqueId)))
		.map((uniqueId:any) => {
		  return array.find((a:any) => a.uniqueId === uniqueId)
		})
	};
	const getCompanyOptions = (array:any) => {
		let groupedList: any = [];
		([...array] || [])?.map((data: any) => {
			groupedList.push({
				...data,
				color: data.colorCode,
				id: data.id ?? data?.objectId,
				displayField: data.name,
				thumbnailUrl: data.thumbnailUrl,
				scope: data.isOrgCompany ? 'Organizational' : 'This Project',
				isSuggested: data.isOrgCompany
			});
		});
		if (groupedList.length > 0) {
			let filterOrgCompanies: any = [...groupedList].filter((item: any) => item.isSuggested);
			let filterThisProjectCompanies: any = [...groupedList]?.filter((item: any) => { return !item.isSuggested });
			let mergeSuggestCompany = suggestedCompanyRef.current?.length > 0 ? RemoveDuplicates([...suggestedCompanyRef.current, ...filterOrgCompanies]) : filterOrgCompanies;
			let mergeGroupedCompany = groupedCompanyRef.current?.length > 0 ? RemoveDuplicates([...groupedCompanyRef.current,...filterThisProjectCompanies]) : filterThisProjectCompanies; 
			groupedCompanyRef.current = mergeGroupedCompany;
			suggestedCompanyRef.current = mergeSuggestCompany;
			setCompanyOptions(filterThisProjectCompanies);
			setSuggestCompanyValues(suggestedCompanyRef.current);
			setGroupedCompanyList(groupedCompanyRef.current);
		} else {
			setCompanyOptions([]);
			setSuggestCompanyValues([]);
			setGroupedCompanyList(groupedList);
			groupedCompanyRef.current = [];
			suggestedCompanyRef.current = [];
		};
		gridRef?.current?.setColumnDefs(headers);
	};

	useEffect(() => {
		if (newlyAddedCompany) {
			console.log('newlyAddedCompany', newlyAddedCompany)
			const companyObj = {
				id: newlyAddedCompany?.id,
				value: newlyAddedCompany?.name,
				name: newlyAddedCompany?.name,
				color: newlyAddedCompany?.colorCode,
			};
			setSelectedBidder({
				...selectedBidder,
				company: companyObj,
			});
			setNewlyAddedCompany(null);
		}
	}, [groupedCompanyList]);

	useEffect(() => {
		if ((contactPersonsList?.length > 0 ?? false)) {
			let filterDataAndMap: any = [...contactPersonsList]?.filter((item: any) => { return item.isSuggested });
			let removeDuplicates: any = [...contactPersonsList]?.filter((item: any) => { return !item.isSuggested });
			setSuggestContactPersons(filterDataAndMap);
			setContactPersonOptions(removeDuplicates);
		};
	}, [contactPersonsList]);
	
	const searchAndFilter = (list: any, selectedFilters?:any, searchVal?:any) => {
		return (list || []).filter((item: any) => {
			const regex = new RegExp(searchVal, 'gi');
			const diverseSupplierArray = item?.diverseCategories?.map((x: any) => x?.name?.toString());
			return (!searchVal || (searchVal && (item.displayField?.match(regex))))
				&& (_.isEmpty(selectedFilters) || (!_.isEmpty(selectedFilters)
					&& (_.isEmpty(selectedFilters?.complianceStatus) || selectedFilters?.complianceStatus?.length === 0 || selectedFilters?.complianceStatus?.indexOf(item.complianceStatus) > -1)
					&& (_.isEmpty(selectedFilters?.diverseSupplier) || selectedFilters?.diverseSupplier?.length === 0 || _.intersection(selectedFilters?.diverseSupplier, diverseSupplierArray).length > 0)
					&& (_.isEmpty(selectedFilters?.scope) || selectedFilters?.scope?.length === 0 || selectedFilters?.scope?.indexOf(item.scope) > -1)));
		});
	};
	
	const onCompnayAddButtonClick = (options: any, searchVal: any) => {
		postMessage({
			event: "common",
			body: {
				evt: "addcompany",
				searchValue: searchVal,
			},
		});
	};

	const onContactPersonAddButtonClick = () => {
		console.log("selectedBidder", selectedBidder?.company)
		postMessage({
			event: "common",
			body: {
				evt: "adduser",
				data: {
					companyId: selectedBidder?.company?.objectId
				}
			},
		});
	};
	const handleContactSearchChange = (list: any, selectedFilters?:any, searchVal?:any) => {
		return searchAndFilter(list, selectedFilters, searchVal)
	};
	const ResetValues = () => {
		groupedCompanyRef.current = [];
		suggestedCompanyRef.current = [];
		pageRef.current = 1;
	};
	const debounce = useCallback(_.debounce((val, key) => {
		if(key === 'search'){
			companySearchRef.current = val;
			defaultPayloadRef.current = {...defaultPayloadRef.current, ['searchText'] : val};
			setCompanySearch(val);
			ResetValues();
		};
	}, 1000), []);
	const handleCompanyFilterChange = (filterValues:any) => {
		if(!_.isEqual(companyFiltersRef.current, filterValues)) {
			companyFiltersRef.current = filterValues;
			defaultPayloadRef.current = {...defaultPayloadRef.current, ['filters'] : filterValues};
			setCompanyFilters(filterValues);
			ApiCall(appInfo, defaultPayloadRef.current);
			ResetValues();
		} else if(_.isEqual(companyFiltersRef.current, filterValues)) {
			companyFiltersRef.current = filterValues;
			defaultPayloadRef.current = {...defaultPayloadRef.current, ['filters'] : filterValues};
			setCompanyFilters(filterValues);
			ApiCall(appInfo, defaultPayloadRef.current);
			ResetValues();
		};
	};
	const handleCompanySearchChange = (searchVal?:any) => {
		debounce(searchVal, 'search');
	};
	const handleScrollEvent = useCallback((e:any) => {
		if(isMakeApi.current) {
			let payload:any;
			let page = pageRef.current;
			let previousPayload = oldPayload?.current?.values;
			let startPage = page * (pageSize);
			let params:any = _.cloneDeep(companyFiltersRef.current);
			payload = {
				"projectId": appInfo?.uniqueId,
				"sortBy":"name",
				"sortDirection":"ASC",
				"start": previousPayload?.orgStart > 0 ? previousPayload?.start : startPage,
				"limit": previousPayload?.orgStart > 0 ? previousPayload?.limit : pageSize,
				"orgStart" : previousPayload?.orgStart > 0 ? previousPayload?.orgStart : 0,
				"orgLimit" : previousPayload?.orgStart > 0 ? previousPayload?.orgLimit : pageSize,
				"searchText": companySearchRef.current,
				"filters": params,
			};
			isMakeApi.current = false;
			ApiCall(appInfo, payload, true);
		}
	}, [oldPayload, companyFiltersRef, companySearchRef]);
	const headers = useMemo(() => [
		{
			headerName: "Company",
			field: 'company',
			minWidth: 250,
			flex: 2,
			cellStyle:
			{
				display: 'flex',
				alignItems: 'center',
			},
			cellRenderer: (params: any) => {
				return !props.readOnly && showAddRow && params.node?.level == 0 && params.node.rowIndex === 0 ? (
					<SUIPagingDropdown
						value={[selectedBidder?.company]}
						width="100%"
						menuWidth="450px"
						placeHolder={'Select'}
						dropdownOptions={groupedCompanyRef.current || []}
						noDataFoundMsg={noDataFoundMsg_company}
						handleValueChange={companyHandleValueChange}
						disableOptionsList={existedCompanyRef.current}
						showFilterInSearch={true}
						filterOptions={filterOptions ?? filterMenuOptionsRef?.current}
						onFilterChange={(values:any) => handleCompanyFilterChange(values)}
						onSearchChange={(values:any) => handleCompanySearchChange(values)}
						paperpropsclassName={'companyMenu-dropdown-cls'}
						suggestedDropdownOptions={suggestedCompanyRef.current || []}
						suggestedText={'Organizational (Org Console)'}
						suggestedDefaultText={'This Project'}
						handleAdd={(options: any, searchVal: any) => onCompnayAddButtonClick(options, searchVal)}
						handleScrollEvent= {(e:any) => handleScrollEvent(e)}
						totalCount = {oldPayload?.current?.totalCount}
					/>
				) : (
					<>
						{params?.data?.company?.thumbnailUrl ?
							<Box component='img' alt='Export' src={params?.data?.company?.thumbnailUrl} className='image' width={30} height={30} color={'#666666'} style={{ borderRadius: '50%' }} />
							: <Box component='span' width={30} height={30} />
						}
						<span style={{ paddingLeft: '4px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{params?.data?.company?.name}</span>
					</>
				);
			},
		},
		{
			headerName: "Contact Person",
			field: 'contactPerson',
			minWidth: 250,
			flex: 2,
			cellStyle:
			{
				display: 'flex',
				alignItems: 'center',
			},
			cellRenderer: (params: any) => {
				return !props.readOnly && showAddRow && params.node?.level == 0 && params.node?.rowIndex === 0 ? (
					<SUIBaseDropdownSelector
						value={[selectedBidder?.contactPerson]}
						width="100%"
						menuWidth="450px"
						placeHolder={`Contact Person's Name`}
						dropdownOptions={contactPersonOptions ?? []}
						noDataFoundMsg={noDataFoundMsg_Contact}
						showSearchInSearchbar={true}
						showFilterInSearch={false}
						handleValueChange={contactHandleValueChange}
						showSuggested={(suggestContactPersons.length === 0 ? false : true)}
						suggestedDropdownOptions={suggestContactPersons ? suggestContactPersons : []}
						paperpropsclassName={'companyMenu-dropdown-cls'}
						suggestedText={'Bid Response Manager'}
						suggestedDefaultText={'Others'}
						moduleName={'bidManager'}
						handleAdd={onContactPersonAddButtonClick}
						onSearchChange={handleContactSearchChange}
					></SUIBaseDropdownSelector>
				) : (
					<>
						{params?.data?.contactPerson?.thumbnail ?
							<Box component='img' alt='Export' src={params.data?.contactPerson?.thumbnail} className='image' width={30} height={30} color={'#666666'} style={{ borderRadius: '50%' }} />
							: <Box component='span' width={30} height={30} />
						}
						<span style={{ paddingLeft: '4px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{params.data?.contactPerson?.displayField ? params.data?.contactPerson?.displayField : params.data?.contactPerson?.firstName + ' ' + params.data?.contactPerson?.lastName}</span>
					</>
				);
			},
		},
		{
			headerName: "Email",
			field: 'email',
			minWidth: 250,
			flex: 2,
			cellRenderer: (params: any) => {
				return !props.readOnly && showAddRow && params.node?.level == 0 && params.node.rowIndex === 0 ? (
					<TextField value={selectedBidder?.email} InputProps={{ readOnly: true }} placeholder={`Contact's Email`} onChange={(event: any) => { emailChange(event, params) }} variant="standard" sx={{ marginTop: '5px' }} />
				) : (
					params.data?.contactPerson?.email
				);
			},
		},
		{
			headerName: "Phone No.",
			field: 'phoneNo',
			minWidth: 115,
			flex: 1,
			edit: true,
			cellRenderer: (params: any) => {
				return !props.readOnly && showAddRow && params.node?.level == 0 && params.node.rowIndex === 0 ? (
					<TextField value={formatPhoneNumber(selectedBidder?.phoneNo)} placeholder={`Contact's Phone`} variant="standard" sx={{ marginTop: '5px' }} />
				) : (
					formatPhoneNumber(params?.data?.contactPerson?.phone)
				);
			},
		}
	], [groupedCompanyRef, contactPersonOptions])
	const [columnDefs, setColumnDefs] = useState(headers);

	useEffect(() => {
		setColumnDefs(headers)
		if (selectedBidder?.company?.value != '' && selectedBidder?.contactPerson?.displayId != '') setEnableAddbtn(true)
	}, [selectedBidder, toggleBtnsData, showAddRow]);

	const onItemAdd = (data: any) => {
		const payload = {
			email: data?.contactPerson?.email,
			company: {
				objectId: data?.companyObj?.id,
				isOrgCompany: data?.companyObj?.isOrgCompany
			},
			isOrgCompany: data?.isOrgCompany,
			name: data?.name,
			contactPerson: {
				"objectId": data?.contactPerson?.id,
				"phone": data?.contactPerson?.phone,
				projectZonePermissions: data?.contactPerson?.projectZonePermissions,
			}
		}

		setSelectedBidder(emptyBiddersRow[0]);
		setEnableAddbtn(false);
		CreateBidders(appInfo, selectedRecord?.id, payload).then((data: any) => {
			dispatch(fetchGridData(appInfo));
			dispatch(fetchBidPackageDetails({ appInfo: appInfo, packageId: selectedRecord?.id }));
			dispatch(fetchBiddersGriddata({ appInfo: appInfo, packageId: selectedRecord?.id }));
		});
	};

	const onRemoveItem = (id: any) => {
		deleteBidders(appInfo, selectedRecord?.id, id).then((data: any) => {
			dispatch(fetchGridData(appInfo));
			dispatch(fetchBidPackageDetails({ appInfo: appInfo, packageId: selectedRecord?.id }));
			dispatch(fetchBiddersGriddata({ appInfo: appInfo, packageId: selectedRecord?.id }));
		});
	};

	const companyHandleValueChange = (value: any) => {
		setSelectedCompany(value);
		setSelectedBidder({ company: value[0], contactPerson: { id: '', displayId: '' }, email: '', phoneNo: '' });
		ContactPersonFetch(value)
	};

	const ContactPersonFetch = (value: any) => {
		if (value && value?.length > 0) {
			const id = value[0]?.id;
			dispatch(fetchContactPersonsList({ appInfo: appInfo, companyid: id })).then((data: any) => {
				const contactPersonsList: any = data?.payload;
				if (contactPersonsList?.length) {
					setSelectedBidder({ ...selectedBidder, company: value[0], contactPerson: contactPersonsList[0], email: contactPersonsList[0]?.emailId, phoneNo: contactPersonsList[0]?.phNo })
					setNewRecord({ ...newRecord, companyObj: value[0], company: { name: value[0]?.displayField }, contactPerson: { email: contactPersonsList[0]?.emailId, phone: contactPersonsList[0]?.phNo, id: contactPersonsList[0]?.id, displayField: contactPersonsList[0]?.displayField, projectZonePermissions: contactPersonsList[0]?.projectZonePermissions } })
				} else {
					setContactPersonOptions(contactPersonsList);
					setSuggestContactPersons([]);
					setSelectedBidder({ ...selectedBidder, company: value[0], contactPerson: { id: '', displayId: '' }, email: '', phoneNo: '' });
					setNewRecord({ ...newRecord, companyObj: value[0], company: { name: value[0]?.displayField }, contactPerson: { email: '', phone: '', id: '', displayField: '', projectZonePermissions: null } });
				}
			});
		}
	}

	const contactHandleValueChange = (value: any) => {
		setSelectedBidder({ ...selectedBidder, contactPerson: value[0], email: value[0]?.emailId, phoneNo: value[0]?.phNo });
		setNewRecord({ ...newRecord, contactPerson: { email: value[0]?.emailId, phone: value[0]?.phNo, id: value[0]?.id, displayField: value[0]?.displayField, projectZonePermissions: value[0]?.projectZonePermissions } })
	};

	const emailChange = (e: any, params: any) => {
		setSelectedPerson(prevState => ({
			...prevState,
			email: e.target.value
		}));
	};

	const TogglehandleChange = (e: any, value: string, key: string) => {
		if (value == "0" && key == 'type' && rowData?.length > 2) setOpenAlert(true);
		else setToggleBtnsData({ ...toggleBtnsData, [key]: Number(value) });

		patchBidPackage(appInfo, selectedRecord?.id, { [key]: Number(value) })
			.then((response: any) => {
				dispatch(fetchGridData(appInfo));
				dispatch(setSelectedRecord(response));
			});
	};

	return (
		<Stack className="Bidders_Section">
			<Stack className='Togglesection' direction="row" justifyContent='space-between'>
				<Stack>
					<InputLabel className='header_label'>
						Type of Bid
						<IQTooltip title={`'Single Party' allows addition of only one bidder while 'Multi Party' allows adding or more than one bidder`} arrow={true} >
							<Box component='img' alt='New View' src={infoicon} className='image' width={12} height={12} style={{ marginLeft: '4px' }} />
						</IQTooltip>
					</InputLabel>
					<ToggleButtonGroup
						color="info"
						value={toggleBtnsData?.type?.toString()}
						exclusive
						onChange={(e: any, value: any) => TogglehandleChange(e, value, 'type')}
						aria-label="Platform"
						size={'small'}
						disabled={props.readOnly}
					>
						<ToggleButton value="0">Single Party</ToggleButton>
						<ToggleButton value="1">Multi Party</ToggleButton>
					</ToggleButtonGroup>
				</Stack>
				<Stack>
					<InputLabel className='header_label'>
						Bid Process
						<IQTooltip title={`At the end of the bid ,'Open bid' discloses bid values to other bidders while in case of 'Closed Bid' the bid values are never disclosed.`} arrow={true} >
							<Box component='img' alt='New View' src={infoicon} className='image' width={12} height={12} style={{ marginLeft: '4px' }} />
						</IQTooltip>
					</InputLabel>
					<ToggleButtonGroup
						color="primary"
						value={toggleBtnsData?.processType?.toString()}
						exclusive
						onChange={(e: any, value: any) => TogglehandleChange(e, value, 'processType')}
						aria-label="Platform"
						size={'small'}
						disabled={props.readOnly}
					>
						<ToggleButton value="0">Open</ToggleButton>
						<ToggleButton value="1">Closed</ToggleButton>
					</ToggleButtonGroup>
				</Stack>
			</Stack>
			<SUIAlert
				open={openAlert}
				onClose={() => {
					setOpenAlert(false);
				}}
				contentText={
					<div>
						<span>There are Multiple Bidders You cannot change to Single Party.</span><br />
						<div style={{ textAlign: 'right', marginTop: '10px' }}>
							<Button
								className="cancel-cls"
								style={{
									backgroundColor: '#666',
									color: '#fff',
									padding: '12px',
									height: '37px',
									borderRadius: '2px',
									marginRight: '0px',
									boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
									display: 'initial'
								}}
								onClick={(e: any) => setOpenAlert(false)}>OK</Button>
						</div>
					</div>
				}
				title={'Warning'}
				showActions={false}
			/>
			<Stack className="bidders_table">
				<InputLabel style={{ fontWeight: 'bold' }}>{` ${selectedRecord?.type == 0 ? 'Add Bidder' : 'Add Bidders'} (${selectedRecord?.bidderCount ? selectedRecord?.bidderCount : 0})`}</InputLabel>
				<SUILineItem
					tableref={(e:any) => gridRef.current = e}
					headers={columnDefs}
					data={rowData}
					enbleAddBtn={enableAddbtn}
					onAdd={onItemAdd}
					onRemove={onRemoveItem}
					newRecord={newRecord}
					readOnly={props.readOnly}
					actionheaderprop={{
						minWidth: 30,
						maxWidth: 80,
					}}
					showAddRow={showAddRow}
					rowMessageIcon={'common-icon-biddersgray'}
					//nowRowsMsg={'<div>No Bidders Added</div>'}
					rowMessageHeading={'<br/><div>No Bidders Added</div>'}
				// columnsToRefresh={['contactPerson', 'email', 'phoneNo']}
				// ref={gridRef}
				/>
			</Stack>
		</Stack>
	);
};

export default Bidders;