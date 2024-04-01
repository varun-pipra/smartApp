import React, { useState, useEffect } from 'react';
import {
	Box, Stack, IconButton, ToggleButton,
	ToggleButtonGroup,
	Button
} from '@mui/material';
import { GridOn, TableRows, Lock } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from 'app/hooks';

import './VendorContractsToolbar.scss';
import { postMessage } from 'app/utils';

import { getServer, getShowSettingsPanel, setShowSettingsPanel } from 'app/common/appInfoSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import IQSearch from "components/iqsearchfield/IQSearchField";
//import Deletedisabled from 'resources/images/bidManager/Delete.svg';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SUIAlert from 'sui-components/Alert/Alert';
import { getVendorContractsList, setGridData, setActiveMainGridGroupKey, setActiveMainGridFilters, setSelectedRows, setMainGridSearchText } from "../../stores/gridSlice";
import { errorMsg, errorStatus, getConnectorType, isUserGC } from 'utilities/commonutills';
import { setShowTableViewType, getTableViewType } from 'features/budgetmanager/operations/tableColumnsSlice';
import { deleteContract, postVendorContractsToConnector } from 'features/vendorcontracts/stores/gridAPI';
import { vendorContractsResponseStatusFilterOptions, vendorContractsStatusFilterOptions } from 'utilities/vendorContracts/enums';
import { activateContract } from '../../stores/VCButtonActionsAPI';
import { fetchCompanyList, getBidLookup, setToastMessage, setSelectedRecord } from 'features/vendorcontracts/stores/VendorContractsSlice';
import _ from "lodash";
import { ReportAndAnalyticsToggle } from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';
import ViewBuilder from 'sui-components/ViewBuilder/ViewBuilder';
import { ViewBuilderOptions } from "sui-components/ViewBuilder/utils";
import { deleteView, addNewView, updateViewItem } from "sui-components/ViewBuilder/Operations/viewBuilderAPI";
import { fetchViewBuilderList, fetchViewData } from "sui-components/ViewBuilder/Operations/viewBuilderSlice";

import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQToggle from 'components/iqtoggle/IQToggle';
import {moduleType, blockchainStates, setShowBlockchainDialog, doBlockchainAction} from 'app/common/blockchain/BlockchainSlice';
import {blockchainAction} from 'app/common/blockchain/BlockchainAPI';
import SapButton from 'sui-components/SAPButton/SAPButton';
import SmartDropDown from 'components/smartDropdown';
import {settingsHelper} from 'utilities/commonFunctions';
import { checkGUID } from 'features/common/timelog/utils';
import { addSettings } from 'features/budgetmanager/operations/settingsAPI';
import { fetchSettings } from 'features/budgetmanager/operations/settingsSlice';

const VendorContractsToolbar = (props: any) => {
	const dispatch = useAppDispatch();
	const modName = 'vendorcontract';
	const tableViewType = useAppSelector(getTableViewType);
	const { selectedRows, gridData } = useAppSelector((state) => state.vendorContractsGrid);
	const { loginUserData } = useAppSelector((state) => state.vendorContracts);
	const appInfo = useAppSelector(getServer);
	const { connectors } = useAppSelector((state) => state.gridData);
	const [disablePrint, setDisablePrint] = useState<boolean>(true);
	const [disableDelete, setDisableDelete] = React.useState<boolean>(true);
	const [disablePostContract, setDisablePostContract] = React.useState<boolean>(true);
	const [alert, setAlert] = React.useState<any>({ show: false, message: '', type: '' })
	const { gridOriginalData, vendorsList, activeMainGridDefaultFilters, activeMainGridFilters, activeMainGridGroupKey } = useAppSelector((state) => state.vendorContractsGrid);
	const { selectedNode, selectedRecord, selectedTabName, selectedVendorInCreateForm } = useAppSelector((state) => state.vendorContracts);

	const { viewData, viewBuilderData } = useAppSelector(state => state.viewBuilder);
	const { defaultData, settingsData } = useAppSelector(state => state.settings);	

	const [showAlertForPendingCompliance, setShowAlertForPendingCompliance] = React.useState<any>({ show: false, message: '', type: '' })

	const showSettingsPanel = useAppSelector(getShowSettingsPanel);
	const [toggleChecked, setToggleChecked] = React.useState(false);
	const { blockchainEnabled } = useAppSelector((state) => state.blockchain);

	const groupOptions = [
		{ text: "Vendors", value: "vendor.name" },
		{ text: appInfo && isUserGC(appInfo) ? "Status" : 'Response Status', value: "status" },
	];

	const disableBlockchainActionButtons = (blockchainEnabled && blockchainStates.indexOf(selectedRows?.[0]?.blockChainStatus) === -1);	
	const isSingleSelected = selectedRows?.length === 1;
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
					{ text: 'Percent Complete', id: 'PercentComplete', key: 'PercentComplete', value: 'PercentComplete', },
					{ text: 'Unit Of Measure', id: 'UnitOfMeasure', key: 'UnitOfMeasure', value: 'UnitOfMeasure', },
					{ text: 'Dollar Amount', id: 'DollarAmount', key: 'DollarAmount', value: 'DollarAmount', },
					{ text: 'Through Date', id: 'ThroughDate', key: 'ThroughDate', value: 'ThroughDate', },
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

	const [workFlowDropDowOptions, setWorkFlowDropDowOptions] = React.useState<any>([]);
	const [selectedOption, setSelectedOption] = React.useState((settingsData?.contractsApp?.id && checkGUID(settingsData?.contractsApp?.id)) ? settingsData?.contractsApp?.name :'Built In');
	let defaultSelection = (settingsData?.contractsApp?.id && checkGUID(settingsData?.contractsApp?.id)) ? {"Apps": [settingsData?.contractsApp?.name]} : {"Built In": ['Built In']};

	useEffect(() => {
		const data = settingsHelper(defaultData);
		setWorkFlowDropDowOptions(data);
	},[defaultData]);

	useEffect(() => {
		setSelectedOption((settingsData?.contractsApp?.id && checkGUID(settingsData?.contractsApp?.id)) ? settingsData?.contractsApp?.name :'Built In');
		defaultSelection = (settingsData?.contractsApp?.id && checkGUID(settingsData?.contractsApp?.id)) ? {"Apps": [settingsData?.contractsApp?.name]} : {"Built In": ['Built In']};
		
	}, [settingsData])

	const handleInputChange = (value:any) => {
		const Key = Object.keys(value);
		if(Key?.length && !_.isString(value)) {
			setSelectedOption(value[Key?.toString()].label);
		} else {
			setSelectedOption(value);
		};
		addSettings(appInfo, {...settingsData, contractsApp: {id: value[Key?.toString()]?.id}}, (response: any) => {
			dispatch(fetchSettings(appInfo));
		});
	};

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
			if (item?.contractFor == 2) adhocBidsList.push(
				{ text: item?.bidPackage?.name, id: item?.bidPackage?.name, key: item?.bidPackage?.name, value: item?.bidPackage?.name, },
			);
		});
		return adhocBidsList;
	};

	React.useEffect(() => {
		if (selectedRows.length > 0) { setDisableDelete(false); setDisablePrint(false); }
		else { setDisableDelete(true); setDisablePrint(true); }
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
		if (val == 'yes') {
			const selectedRowIds = selectedRows.map((row: any) => row.id);
			if (alert.type == 'Delete') {
				selectedRowIds?.map((id:any) => {

					deleteContract(appInfo, id).then((resp: any) => {
						if (errorStatus?.includes(resp?.status)) dispatch(setToastMessage({ displayToast: true, message: errorMsg }));
						else {
							// dispatch(getVendorContractsList(appInfo));
							dispatch(setToastMessage({ displayToast: true, message: `Selected Record Deleted Successfully` }));
							setDisableDelete(true);
						}
						
					});
				})
			}
			else {
				activateContract(appInfo, selectedRows?.[0]?.id, (response: any) => {
					dispatch(getVendorContractsList(appInfo));
					selectedRecord?.id == selectedRows[0]?.id && dispatch(setSelectedRecord(response));
					setDisablePostContract(true);
					if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
						dispatch(setShowBlockchainDialog(true));
					} 
					else dispatch(setToastMessage({displayToast: true, message: `Posted Contract and Locked. Notified the response to the Vendor.`}));
				});
			}

			setAlert({ show: false, type: '', message: '' });
		}
		else {
			setAlert({ show: false, type: '', message: '' });
		}
	};

	const handleOnSearchChange = (searchText: string) => {
		if (gridOriginalData !== undefined && searchText !== ' ') {
			const firstResult = gridOriginalData.filter((obj: any) => {
				return JSON.stringify(obj).toLowerCase().includes(searchText);
			});
			dispatch(setGridData(firstResult));
		} else {
			dispatch(setGridData(gridOriginalData));
		}
	};

	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if (value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};

	const handlePostContract = (lock: boolean) => {
		if (selectedRows?.[0]?.vendor?.pendingCompliances?.length && !lock) {
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
			})
			setShowAlertForPendingCompliance({ show: false, message: '' })
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


	const handleDropDown = (value: any, data: any) => {
		if (value === "save") {
			saveViewHandler(data);
			dispatch(setToastMessage({ displayToast: true, message: `${viewData?.viewName} Saved Successfully` }));
		}
		else if (value === "delete") {
			DeleteViewHandler();
			dispatch(setToastMessage({ displayToast: true, message: `${viewData?.viewName} Deleted Successfully` }));
		}
	}

	const saveNewViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(activeMainGridFilters);
		const payload = { ...value, viewFor: modName, filters: FilterValue ? FilterValue : '{}', groups: activeMainGridGroupKey ? [activeMainGridGroupKey] : ['None'] };
		console.log('payload', payload);
		addNewView(appInfo, payload, modName, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'VendorContract' }));
			dispatch(getVendorContractsList(appInfo));
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewData.viewId }));
		});
	}

	const saveViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(activeMainGridFilters);
		const payload = { ...value, filters: FilterValue ? FilterValue : '{}', groups: activeMainGridGroupKey ? [activeMainGridGroupKey] : ['None'] };
		console.log('payload', payload);
		updateViewItem(appInfo, viewData.viewId, payload, (response: any) => {
			dispatch(getVendorContractsList(appInfo));
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewData.viewId }));
		});
	}

	const DeleteViewHandler = () => {
		deleteView(appInfo, viewData.viewId, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'VendorContract' }));
		});
	}

	const viewListOnChange = (data: any) => {
		console.log('get')
		dispatch(getVendorContractsList(appInfo));
	}

	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setToggleChecked(event.target.checked);
		const typeValue: number = moduleType['VendorContracts'];
		// blockchainAction(event.target.checked, typeValue);
		dispatch(doBlockchainAction({ enable: event.target.checked, typeString: 'VendorContracts' }));		
	};
	const PrintOnclick = (event: any) => {
		postMessage({
			event: 'openitemlevelreport',
			body: {
				targetLocation: {
					x: event.pageX,
					y: event.pageY
				}
			}
		});
	};

	const handlePostTo = () => {
		console.log("connector")
		const type = getConnectorType(connectors?.[0]?.name)
		postVendorContractsToConnector(appInfo, type, (response:any) => {
			console.log("vendor contracts connectors resp", response);
		})
	}

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
							dispatch(getBidLookup({ appInfo: appInfo, objectId: selectedVendorInCreateForm }));
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
				<IQTooltip title='Print' placement='bottom'>
					<IconButton
						aria-label='Print Bid Line Item'
						disabled={disablePrint}
						onClick={(e: any) => { PrintOnclick(e) }}
					>
						<span className="common-icon-Print1"></span>
					</IconButton>
				</IQTooltip>
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
						disabled={!isSingleSelected && (disablePostContract || disableBlockchainActionButtons)}>
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
				placeholder={viewData && viewData?.viewName}
				filters={isUserGC(appInfo) ? filters : [filters[1]]}
				onSearchChange={(text: string) => dispatch(setMainGridSearchText(text))}
				filterHeader=''
				defaultFilters={activeMainGridDefaultFilters}
				defaultGroups={activeMainGridGroupKey == 'None' ? 'undefined' : activeMainGridGroupKey}
				onGroupChange={(selectedVal: any) => { dispatch(setActiveMainGridGroupKey(selectedVal)) }}
				onFilterChange={(filters: any) => {
					if (filters) {
						let filterObj = filters;
						Object.keys(filterObj).filter((item) => {
							if (filterObj[item]?.length === 0) {
								delete filterObj[item];
							};
						});
						if (!_.isEqual(activeMainGridFilters, filterObj)) {
							dispatch(setActiveMainGridFilters(filterObj));
						};
					};
				}}
				viewBuilderapplied={true}
			/>
			<ViewBuilder
				moduleName={modName}
				appInfo={appInfo}
				dropDownOnChange={(value: any, data: any) => { handleDropDown(value, data) }}
				griddata={viewData?.columnsForLayout}
				viewData={viewData}
				saveView={(data: any) => { saveViewHandler(data) }}
				deleteView={() => { DeleteViewHandler() }}
				saveNewViewData={(data: any) => { saveNewViewHandler(data) }}
				viewList={viewBuilderData}
				requiredColumns={['title', 'status']}
				viewListOnChange={(data: any) => { viewListOnChange(data) }}
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
			{isUserGC(appInfo) && connectors?.length ? <SapButton imgSrc={connectors?.[0]?.primaryIconUrl} onClick={() =>handlePostTo()}/> : <></>}
			{/* <ToggleButtonGroup
				exclusive
				value={tableViewType}
				size="small"
				onChange={handleView}
				aria-label="Inventory tab view buttons"
			>
				<ToggleButton value={"Calendar"} aria-label="Budget details tab">
					<CalendarViewMonth />
					<GridOn />
				</ToggleButton>
				<ToggleButton value={"Chart"} aria-label="Analytics tab">
					<Leaderboard />
					<AssessmentOutlinedIcon />
				</ToggleButton>
			</ToggleButtonGroup> */}
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
				className='settings-rightpanel-cls'
				variant='permanent'
				elevation={8}
				open={false}
			>
				<Box>
					<Stack direction="row" sx={{ justifyContent: "end", height: "2em" }}>
						<IconButton className="Close-btn" aria-label="Close Right Pane"
							onClick={() => dispatch(setShowSettingsPanel(false))}
						>
							<span className="common-icon-Declined"></span>
						</IconButton>
					</Stack>
					{isUserGC(appInfo) && <Stack className='General-settings'>
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
											onChange={(e) => { handleToggleChange(e); }}
											edge={'end'}
										/>
									</ListItemIcon>
								</ListItem>}
							</List>
							<Typography variant="h6" component="h6" className='budgetSetting-heading'>Work Flow Settings</Typography>	
							<SmartDropDown
								options={workFlowDropDowOptions || []}
								dropDownLabel="Vendor Contract"
								isSearchField
								required={false}
								outSideOfGrid={true}
								selectedValue={selectedOption}
								isFullWidth
								ignoreSorting={true}
								handleChange={(value: any) => handleInputChange(value)}
								variant={'outlined'}
								sx={{
									'& .MuiInputBase-input': {
										padding: '8px 25px 6px 4px !important'
									}
								}}
								optionImage={true}
								isSubMenuSearchField={true}
								isDropdownSubMenu={true}
								defaultSubMenuSelection={defaultSelection}
								handleSearchProp={(items: any, key: any) => {}}
								subMenuModuleName={'vendor-contracts'}
							/>						
						</Stack>
					</Stack>}
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
					setShowAlertForPendingCompliance({ show: false, message: '' });
				}}
				contentText={
					showAlertForPendingCompliance?.message
				}
				title={'Confirmation'}
				onAction={(e: any, type: string) => {
					type == 'yes' ? handlePostContract(true) :
						setShowAlertForPendingCompliance({ show: false, message: '' });
				}}
				showActions={true}
				modelWidth={'610px'}
			/>
		}
	</Stack>;
};

export default VendorContractsToolbar;