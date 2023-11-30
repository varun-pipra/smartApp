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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import infoicon from 'resources/images/common/infoicon.svg';
import SUIAlert from 'sui-components/Alert/Alert';
import SUIBaseDropdownSelector from 'sui-components/BaseDropdown/BaseDropdown';
import SUILineItem from 'sui-components/LineItem/LineItem';
import { getBidProcessType, getBidType } from 'utilities/bid/enums';
import { formatPhoneNumber } from 'utilities/commonFunctions';

import {
	Box, Button, Grid, InputLabel, Stack, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';

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
	const { companyList, contactPersonsList, BudgetLineItems, selectedRecord } = useAppSelector((state) => state.bidManager);
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

	useEffect(() => {
		console.log('newCompany', newCompany)
		setNewlyAddedCompany(newCompany);
		const company = { company: { id: newCompany?.id, value: newCompany?.name, color: newCompany?.colorCode } };
		console.log('company',company)
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
				setExistedCompanies(companyIds);
				setRowData([...emptyBiddersRow, ...BiddersGridData]);
				setShowAddRow(true);
			}
		}
	}, [BiddersGridData, props.readOnly, toggleBtnsData]);

	useEffect(() => {
		if (companyData.length) {
			getCompanyOptions();
		}
	}, [companyData]);

	const getCompanyOptions = () => {
		let groupedList: any = [];
		companyData?.map((data: any) => {
			groupedList.push({
				...data,
				color: data.colorCode,
				id: data.objectId,
				displayField: data.name,
				thumbnailUrl: data.thumbnailUrl
			});
		});
		console.log('groupedList', groupedList)
		if (groupedList.length > 0) {
			let filterDataAndMap: any = [...groupedList].filter((item: any) => item.isOrgCompany).map((item: any) => ({ ...item, isSuggested: true }));
			let removeDuplicates: any = [...groupedList]?.filter((item: any) => { return !item.isOrgCompany });
			setCompanyOptions(removeDuplicates);
			setSuggestCompanyValues(filterDataAndMap);
			setGroupedCompanyList(groupedList);
		} else {
			setCompanyOptions([]);
			setSuggestCompanyValues([]);
			setGroupedCompanyList(groupedList);
		};
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
	}, [contactPersonsList])

	const handleFilterChange = (filters: any) => {
		const filteredData: any = [];
		companyData?.map((companyObj: any) => {
			Object.keys(filters)?.map((key: any) => {
				if (filters[key]?.includes(companyObj[key])) filteredData.push(companyObj)
			})
		});
	}

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
		postMessage({
			event: "common",
			body: {
				evt: "adduser"
			},
		});
	};

	const headers = [
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
					<SUIBaseDropdownSelector
						value={[selectedBidder?.company]}
						width="100%"
						menuWidth="450px"
						placeHolder={'Select'}
						dropdownOptions={groupedCompanyList || []}
						noDataFoundMsg={noDataFoundMsg_company}
						handleValueChange={companyHandleValueChange}
						disableOptionsList={existedCompanies}
						showFilterInSearch={true}
						filterOptions={getFilterMenuOptions()}
						onFilterChange={handleFilterChange}
						paperpropsclassName={'companyMenu-dropdown-cls'}
						showSuggested={(suggestCompanyValues.length === 0 ? false : true)}
						suggestedDropdownOptions={suggestCompanyValues ? suggestCompanyValues : []}
						suggestedText={'Organizational (Org Console)'}
						suggestedDefaultText={'This Project'}
						moduleName={'bidManager'}
						handleAdd={(options: any, searchVal: any) => onCompnayAddButtonClick(options, searchVal)}
					></SUIBaseDropdownSelector>
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
	]
	const [columnDefs, setColumnDefs] = useState(headers);

	useEffect(() => {
		setColumnDefs(headers)
		if (selectedBidder?.company?.value != '' && selectedBidder?.contactPerson?.displayId != '') setEnableAddbtn(true)
	}, [selectedBidder, toggleBtnsData, existedCompanies, showAddRow, groupedCompanyList]);

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
				<InputLabel style={{ fontWeight: 'bold' }}>{` Add Bidders (${props?.readOnly ? rowData?.length : rowData?.length - 1})`}</InputLabel>
				<SUILineItem
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

const getFilterMenuOptions = () => {
	const { companyFiltersList } = useAppSelector((state) => state.bidManager);
	return [{
		text: 'Scope',
		key: 'scope',
		value: 'scope',
		icon: <span className='common-icon-scope' />,
		children: {
			type: 'checkbox',
			items: [{
				text: 'This Project',
				key: 'scope',
				value: 'This Project'
			}, {
				text: 'Organizational',
				value: 'Organizational',
				key: 'scope',
			},]
		}
	},
	{
		text: 'Diverse Supplier',
		key: 'diverseSupplier',
		value: 'diverseSupplier',
		icon: <span className='common-icon-diverse-supplier' />,
		children: {
			type: 'checkbox',
			items: [...companyFiltersList]
			// 	[{
			// 		text: 'Minority-owned business',
			// 		value: 'Minority-owned business'
			// 	}, {
			// 		text: 'Women-owned business',
			// 		value: 'Women-owned business',
			// 	},
			// 	{
			// 		text: 'LGBT-owned business',
			// 		value: 'LGBT-owned business',
			// 		key: 'diverseSupplier',				
			// 	},
			// 	{
			// 		text: 'Veteran-owned business',
			// 		value: 'Veteran-owned business',
			// 		key: 'diverseSupplier',				
			// 	},
			// 	{
			// 		text: 'Service-disabled veteran-owned business',
			// 		value: 'Service-disabled veteran-owned business',
			// 		key: 'diverseSupplier',				
			// 	},
			// 	{
			// 		text: 'Historically underutilized business zones(HUBZone)',
			// 		value: 'Historically underutilized business zones(HUBZone)',
			// 		key: 'diverseSupplier',				
			// 	},
			// 	{
			// 		text: 'Small business enterprises',
			// 		value: 'Small business enterprises',
			// 		key: 'diverseSupplier',				
			// 	},
			// ]
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
};