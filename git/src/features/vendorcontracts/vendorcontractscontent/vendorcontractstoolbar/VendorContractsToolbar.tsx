import React, {useState, useEffect} from 'react';
import {
	Box, Stack, IconButton, ToggleButton,
	ToggleButtonGroup,
	Button
} from '@mui/material';
import {GridOn, TableRows, Lock} from '@mui/icons-material';
import {useAppSelector, useAppDispatch} from 'app/hooks';

import './VendorContractsToolbar.scss';

import {getServer, getShowSettingsPanel, setShowSettingsPanel} from 'app/common/appInfoSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import IQSearch from "components/iqsearchfield/IQSearchField";
//import Deletedisabled from 'resources/images/bidManager/Delete.svg';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SUIAlert from 'sui-components/Alert/Alert';
import {getVendorContractsList, setGridData, setActiveMainGridGroupKey, setActiveMainGridFilters, setSelectedRows, setMainGridSearchText} from "../../stores/gridSlice";
import {errorMsg, errorStatus, isUserGC} from 'utilities/commonutills';
import {setShowTableViewType, getTableViewType} from 'features/budgetmanager/operations/tableColumnsSlice';
import {deleteContract} from 'features/vendorcontracts/stores/gridAPI';
import {vendorContractsResponseStatusFilterOptions, vendorContractsStatusFilterOptions} from 'utilities/vendorContracts/enums';
import {activateContract} from '../../stores/VCButtonActionsAPI';
import {fetchCompanyList, getBidLookup, setToastMessage, setSelectedRecord} from 'features/vendorcontracts/stores/VendorContractsSlice';
import _ from "lodash";
import {ReportAndAnalyticsToggle} from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';

import {List, ListItem, ListItemIcon, ListItemText, Typography} from '@mui/material';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQToggle from 'components/iqtoggle/IQToggle';
import {moduleType} from 'app/common/blockchain/BlockchainSlice';
import {blockchainAction} from 'app/common/blockchain/BlockchainAPI';

const VendorContractsToolbar = (props: any) => {
	const dispatch = useAppDispatch();
	const tableViewType = useAppSelector(getTableViewType);
	const {selectedRows, gridData} = useAppSelector((state) => state.vendorContractsGrid);
	const {loginUserData} = useAppSelector((state) => state.vendorContracts);
	const appInfo = useAppSelector(getServer);
	const [disableDelete, setDisableDelete] = React.useState<boolean>(true);
	const [disablePostContract, setDisablePostContract] = React.useState<boolean>(true);
	const [alert, setAlert] = React.useState<any>({show: false, message: '', type: ''});
	const {gridOriginalData, vendorsList, activeMainGridDefaultFilters, activeMainGridFilters} = useAppSelector((state) => state.vendorContractsGrid);
	const {selectedNode, selectedRecord, selectedTabName, selectedVendorInCreateForm} = useAppSelector((state) => state.vendorContracts);
	const [showAlertForPendingCompliance, setShowAlertForPendingCompliance] = React.useState<any>({show: false, message: '', type: ''});

	const showSettingsPanel = useAppSelector(getShowSettingsPanel);
	const [toggleChecked, setToggleChecked] = React.useState(true);
	const {blockchainEnabled} = useAppSelector((state) => state.blockchain);

	const groupOptions = [
		{text: "Vendors", value: "vendor.name"},
		{text: appInfo && isUserGC(appInfo) ? "Status" : 'Response Status', value: "status"},
	];

	const filterOptions = [
		{
			text: "Vendors",
			value: "vendor",
			key: "vendor",
			// iconCls: "common-icon-name-id",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: appInfo && isUserGC(appInfo) ? "Status" : 'Response Status',
			value: "status",
			key: "status",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: isUserGC(appInfo) ? vendorContractsStatusFilterOptions : vendorContractsResponseStatusFilterOptions,
			},
		},
		{
			text: "SOV Type",
			value: "sovType",
			key: "sovType",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{text: 'Percent Complete', id: 'PercentComplete', key: 'PercentComplete', value: 'PercentComplete', },
					{text: 'Unit Of Measure', id: 'UnitOfMeasure', key: 'UnitOfMeasure', value: 'UnitOfMeasure', },
					{text: 'Dollar Amount', id: 'DollarAmount', key: 'DollarAmount', value: 'DollarAmount', },
					{text: 'Through Date', id: 'ThroughDate', key: 'ThroughDate', value: 'ThroughDate', },
				],
			},
		},
		{
			text: 'Adhoc Bid',
			value: "bidPackage",
			key: "bidPackage",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [],
			},
		},
	];
	const [filters, setFilters] = useState<any>(filterOptions);

	const handleDelete = () => {
		setAlert({
			show: true,
			type: 'Delete',
			message: <span>Are you sure you want to delete the selected Contract(s)?<br /> This action cannot be reverted.</span>
		});
	};

	const getAdhocBids = (contractsList: any) => {
		let adhocBidsList: any = [];
		contractsList?.map((item: any) => {
			if(item?.contractFor == 2) adhocBidsList.push(
				{ text: item?.bidPackage?.name, id: item?.bidPackage?.name, key: item?.bidPackage?.name, value: item?.bidPackage?.name, },
			);
		});
		return adhocBidsList;
	};

	React.useEffect(() => {
		console.log('selectedRows', selectedRows);
		selectedRows.length > 0 ? setDisableDelete(false) : setDisableDelete(true);
		selectedRows[0]?.status == 'ReadyToSubmit' ? setDisablePostContract(false) : setDisablePostContract(true);
	}, [selectedRows]);

	useEffect(() => {
		const filtersCopy = [...filters];
		let vendorItem = filtersCopy.find((rec: any) => rec.value === "vendor");
		vendorItem.children.items = vendorsList;
		let adhocBidItem = filtersCopy.find((rec: any) => rec.value === "bidPackage");
		adhocBidItem.children.items = getAdhocBids(gridData);
		setFilters(filtersCopy);
	}, [vendorsList, gridData]);

	const handleListChanges = (val: string) => {
		if(val == 'yes') {
			const selectedRowIds = selectedRows.map((row: any) => row.id);
			if(alert.type == 'Delete') {
				deleteContract(appInfo, selectedRowIds[0]).then((resp: any) => {
					if(errorStatus?.includes(resp?.status)) dispatch(setToastMessage({displayToast: true, message: errorMsg}));
					else {
						// dispatch(getVendorContractsList(appInfo));
						dispatch(setToastMessage({displayToast: true, message: `Selected Record Deleted Successfully`}));
						setDisableDelete(true);
					}

				});
			}
			else {
				activateContract(appInfo, selectedRecord?.id, (response: any) => {
					dispatch(getVendorContractsList(appInfo));
					selectedRecord?.id == selectedRows[0]?.id && dispatch(setSelectedRecord(response));
					dispatch(setToastMessage({displayToast: true, message: `Posted Contract and Locked. Notified the response to the Vendor.`}));
					setDisablePostContract(true);
				});
			}

			setAlert({show: false, type: '', message: ''});
		}
		else {
			setAlert({show: false, type: '', message: ''});
		}
	};

	const handleOnSearchChange = (searchText: string) => {
		if(gridOriginalData !== undefined && searchText !== ' ') {
			const firstResult = gridOriginalData.filter((obj: any) => {
				return JSON.stringify(obj).toLowerCase().includes(searchText);
			});
			dispatch(setGridData(firstResult));
		} else {
			dispatch(setGridData(gridOriginalData));
		}
	};

	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if(value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};

	const handlePostContract = (lock: boolean) => {
		if(selectedRows?.[0]?.vendor?.pendingCompliances?.length && !lock) {
			setShowAlertForPendingCompliance({
				show: true,
				type: 'pendingCompliance',
				message: <span>The Vendor You are trying to make a Contract has pending company Compliance verification.<br /><br />Would you still want to go ahead and post the Contract to the vendor?</span>
			});
		}
		else {
			setAlert({
				show: true,
				type: 'lock',
				message: <div>
					<span>Are you sure you want to Lock & Post the Contract?</span> <br /><br /><br />
					<span>By doing so, the contract will become Active immediately and the other party will be able to see the contract Active.</span>
				</div>
			});
			setShowAlertForPendingCompliance({show: false, message: ''});
		}
		// setShowAlertForPendingCompliance({ show: false, message: '' })
		// {
		// 	activateContract(appInfo, selectedRecord?.id, (response: any) => {
		// 		dispatch(getVendorContractsList(appInfo));
		// 		selectedRecord?.id == selectedRows[0]?.id && dispatch(setSelectedRecord(response));
		// 		dispatch(setToastMessage({ displayToast: true, message: `Posted Contract and Locked` }));
		// 		setDisablePostContract(true);
		// 	});
		// }
	};

	useEffect(() => {
		setToggleChecked(blockchainEnabled);
	}, [blockchainEnabled]);

	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setToggleChecked(event.target.checked);
		const typeValue: number = moduleType['VendorContracts'];
		blockchainAction(event.target.checked, typeValue);
	};
	return <Stack direction='row' className='toolbar-root-container-vendor-contracts'>
		<div key='toolbar-buttons' className='toolbar-item-wrapper options-wrapper'>
			<>
				<IQTooltip title='Refresh' placement='bottom'>
					<IconButton
						aria-label='Refresh Vendor Contracts List'
						onClick={() => {
							dispatch(getVendorContractsList(appInfo));
							// dispatch(setRefreshed(true))
							dispatch(setSelectedRows([]));
							// dispatch(setActiveMainGridGroupKey(null))
							// dispatch(setActiveMainGridFilters({}))
							// dispatch(setActiveMainGridDefaultFilters({}))
							isUserGC(appInfo) && dispatch(fetchCompanyList(appInfo));
							dispatch(getBidLookup({appInfo: appInfo, objectId: selectedVendorInCreateForm}));
						}}
					>
						<span className="common-icon-refresh"></span>
					</IconButton>
				</IQTooltip>
				{/* <IQTooltip title="Export" placement={"bottom"}>
					<IconButton
						aria-label="Export Vendor Contracts"
					onClick={() => {
						dispatch(setImportPopup(true));
					}}
					>
						<Box component='img' alt='Export' src={ExportIcon} className='image' width={30} height={30} color={'#666666'} />
					</IconButton>
				</IQTooltip>
				<IQTooltip title='Print' placement='bottom'>
					<IconButton>
						<span className='common-icon-print' style={{ fontSize: '1.5rem' }} />
					</IconButton>
				</IQTooltip> */}
				<IQTooltip title='Delete' placement='bottom'>
					<IconButton
						aria-label='Delete Vendor Contract Item'
						disabled={disableDelete}
						onClick={handleDelete}
					>
						<span className="common-icon-delete"></span>
					</IconButton>
				</IQTooltip>
				{isUserGC(appInfo) &&
					<Button variant="outlined"
						className='post-contract-btn'
						color={disablePostContract ? 'inherit' : 'success'}
						onClick={() => handlePostContract(false)}
						startIcon={<span className='common-icon-post-contract' />}
						disabled={disablePostContract}>
						Post Contract
					</Button>}
				{/* <IQTooltip title='Post Contract' placement='bottom'>
					<Button
						aria-label='Delete Vendor Contract Item'
						// onClick={handleDelete}
					>
						<Box component='img' alt='Delete' src={Deletedisabled} className='image' width={22} height={22} />
                        Post Contract
					</Button>
				</IQTooltip> */}
			</>
		</div>
		<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
			<IQSearch
				groups={isUserGC(appInfo) ? groupOptions : [groupOptions[1]]}
				placeholder={'Search'}
				filters={isUserGC(appInfo) ? filters : [filters[1]]}
				onSearchChange={(text: string) => dispatch(setMainGridSearchText(text))}
				filterHeader=''
				defaultFilters={activeMainGridDefaultFilters}
				// onSettingsChange={handleSettings}
				// onViewFilterChange={handleViewFilter}
				onGroupChange={(selectedVal: any) => {dispatch(setActiveMainGridGroupKey(selectedVal));}}
				// onSearchChange={searchHandler}
				onFilterChange={(filters: any) => {
					if(filters) {
						let filterObj = filters;
						Object.keys(filterObj).filter((item) => {
							if(filterObj[item]?.length === 0) {
								delete filterObj[item];
							};
						});
						if(!_.isEqual(activeMainGridFilters, filterObj)) {
							dispatch(setActiveMainGridFilters(filterObj));
						};
					};
				}}
			/>
			{/* <Stack direction={'row'} >
				<IconMenu
					// options={getViewFilters()}
					// defaultValue={group.name ? { [group.name]: true } : {}}
					// onChange={handleSettings}
					menuProps={{
						open: true,
						// header: (props.groupHeader || 'Group By'),
						placement: 'bottom-start',
						sx: {
							width: '170px', lineheight: '1.5', fontSize: '18px !important',
							'& .css-1jxx3va-MuiTypography-root': {
								fontSize: '0.96rem !important',
								color: '#333 !important'
							}
						}
					}}
					buttonProps={{
						className: 'preview-button',
						startIcon: <Stack component='img' alt='Views' src={EyeIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)', marginLeft: '10px' }} />,
						// endIcon: <KeyboardArrowDown className="group-menu-icon" />,
						"aria-label": "Group menu",
						disableRipple: true
					}}
				/>
			</Stack>
			<Stack direction={'row'} >
				<IconMenu
					// options={viewBuilderData}
					// defaultValue={group.name ? { [group.name]: true } : {}}
					// onChange={handleViewClick}
					menuProps={{
						open: true,
						// header: (props.groupHeader || 'Group By'),
						placement: 'bottom-start',
						sx: {
							width: '220px', lineheight: '1.5', fontSize: '18px !important',
							'& .css-1jxx3va-MuiTypography-root': {
								fontSize: '0.96rem !important',
								color: '#333 !important'
							}
						}
					}}
					buttonProps={{
						className: 'preview-button',
						startIcon: <Stack component='img' alt='Views' src={GridIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)', marginLeft: '10px' }} />,
						// endIcon: <KeyboardArrowDown className="group-menu-icon" />,
						"aria-label": "Group menu",
						disableRipple: true
					}}
				/></Stack> */}
			{/* <Box component='img' alt='New View' src={GridIcon} className='preview-button' sx={{ color: 'rgb(108 108 108)', marginLeft: '10px' }}/> */}
		</div>
		<div key="spacer" className="toolbar-item-wrapper toolbar-group-button-wrapper" >
			{<ReportAndAnalyticsToggle />}
			<ToggleButtonGroup
				exclusive
				value={tableViewType}
				size="small"
				onChange={handleView}
				aria-label="Inventory tab view buttons"
			>
				<ToggleButton value={"Calendar"} aria-label="Budget details tab">
					{/* <CalendarViewMonth /> */}
					<GridOn />
				</ToggleButton>
				<ToggleButton value={"Chart"} aria-label="Analytics tab">
					{/* <Leaderboard /> */}
					<AssessmentOutlinedIcon />
				</ToggleButton>
			</ToggleButtonGroup>
			{/* <Button
				variant="outlined"
				startIcon={<Lock />}
				className="lock-button"
				onClick={handleLockBudget}
			>
				{'Lock Contract'}
			</Button> */}
			<IQTooltip title="Settings" placement={"bottom"}>
				<IconButton
					className='settings-button'
					aria-label="settings budgetmanager"
					onClick={() => dispatch(setShowSettingsPanel(true))}
				>
					<TableRows />
				</IconButton>
			</IQTooltip>

		</div>
		{showSettingsPanel ?
			<SUIDrawer
				PaperProps={{
					style: {
						borderRadius: "4px",
						boxShadow: "-6px 0px 10px -10px",
						border: "1px solid rgba(0, 0, 0, 0.12) !important",
						position: "absolute",
						top: '95px',
						bottom: '0px',
						width: '25em',
						height: 'inherit',
						overflow: 'auto'
					},
				}}
				anchor='right'
				variant='permanent'
				elevation={8}
				open={false}
			>
				<Box>
					<Stack direction="row" sx={{justifyContent: "end", height: "5em"}}>
						<IconButton className="Close-btn" aria-label="Close Right Pane"
							onClick={() => dispatch(setShowSettingsPanel(false))}
						>
							<span className="common-icon-Declined"></span>
						</IconButton>
					</Stack>
					<Stack className='General-settings'>
						<Stack className='generalSettings-Sections'>
							<Typography variant="h6" component="h6" className='budgetSetting-heading'>Settings</Typography>
							<List className='generalSettings-list'
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									alignSelf: 'center',
									textWrap: 'nowrap'
								}}
							>
								{(window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled && <ListItem className='generalSettings-listitem'>
									<ListItemText primary="Blockchain Two Factor Authentication" className='generalsettingtext' />
									<ListItemIcon key={`iqmenu-item-icon-common-icon-sketch`}>
										<span className="common-icon-Project-Info"></span>
									</ListItemIcon>
									<ListItemIcon>
										<IQToggle
											checked={toggleChecked}
											switchLabels={['ON', 'OFF']}
											onChange={(e) => {handleToggleChange(e);}}
											edge={'end'}
										/>
									</ListItemIcon>
								</ListItem>}
							</List>
						</Stack>
					</Stack>
				</Box>
			</SUIDrawer>
			: null}
		{alert?.show && <SUIAlert
			open={alert.show}
			DailogClose={true}
			contentText={<span>{alert?.message}</span>}
			title={'Confirmation'}
			onAction={(e: any, type: string) => handleListChanges(type)}
		/>}
		{
			showAlertForPendingCompliance?.show && <SUIAlert
				open={showAlertForPendingCompliance?.show}
				DailogClose={true}
				onClose={() => {
					setShowAlertForPendingCompliance({show: false, message: ''});
				}}
				contentText={
					showAlertForPendingCompliance?.message
				}
				title={'Confirmation'}
				onAction={(e: any, type: string) => {
					type == 'yes' ? handlePostContract(true) :
						setShowAlertForPendingCompliance({show: false, message: ''});
				}}
				showActions={true}
				modelWidth={'610px'}
			/>
		}
	</Stack>;
};

export default VendorContractsToolbar;