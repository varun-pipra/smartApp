import React, { useState, useEffect, useMemo } from 'react';
import {
	Box, Stack, IconButton, ToggleButton,
	ToggleButtonGroup,
	Button
} from '@mui/material';
import {
	Refresh, PauseCircleOutline, DoNotDisturb, ContentPasteGoOutlined,
	PrintOutlined, GridOn, AssessmentOutlined, TableRows, Lock
} from '@mui/icons-material';
import {useAppSelector, useAppDispatch} from 'app/hooks';
import { postMessage } from 'app/utils';
import './ClientContractsToolbar.scss';
import DeleteIcon from 'resources/images/common/Delete.svg';

import { getServer, getAppWindowMaximize, getShowSettingsPanel, setShowSettingsPanel } from 'app/common/appInfoSlice';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';
import IQSearch from "components/iqsearchfield/IQSearchField";
import Add from 'resources/images/bidManager/Add.svg';
import Pause from 'resources/images/bidManager/Pause.svg';
import CSV from 'resources/images/bidManager/CSV.svg';
import Import from 'resources/images/bidManager/File.svg';
import Block from 'resources/images/bidManager/Block.svg';
//import Deletedisabled from 'resources/images/bidManager/Delete.svg';
import EyeIcon from "resources/images/common/Eye.svg";
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ExportIcon from "resources/images/common/Export.svg";
import { deleteBidPackages } from 'features/bidmanager/stores/gridAPI';
import SUIAlert from 'sui-components/Alert/Alert';
import GridIcon from "resources/images/common/Grid.svg";
import { getClientContractsList, setActiveMainGridDefaultFilters, setActiveMainGridFilters, setActiveMainGridGroupKey, setGridData, setMainGridSearchText } from "../../stores/gridSlice";
import { getConnectorType, isUserGC } from 'utilities/commonutills';
import { setShowTableViewType, getTableViewType } from 'features/budgetmanager/operations/tableColumnsSlice';
import { deleteClientContract, postClientContractsToConnector } from 'features/clientContracts/stores/gridAPI';
import { getClientCompanies, setToastMessage, setSelectedRecord } from 'features/clientContracts/stores/ClientContractsSlice';
import { vendorContractsResponseStatusFilterOptions, vendorContractsStatusFilterOptions } from 'utilities/vendorContracts/enums';
import { isUserGCForCC } from 'features/clientContracts/utils';
import { activateClientContract, lockAndPostContract } from '../../stores/CCButtonActionsAPI';
import _ from "lodash";
import { ReportAndAnalyticsToggle } from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQToggle from 'components/iqtoggle/IQToggle';
import {moduleType, blockchainStates, setShowBlockchainDialog, doBlockchainAction} from 'app/common/blockchain/BlockchainSlice';
import {blockchainAction} from 'app/common/blockchain/BlockchainAPI';
import SapButton from 'sui-components/SAPButton/SAPButton';


import ViewBuilder from 'sui-components/ViewBuilder/ViewBuilder';
import { ViewBuilderOptions } from "sui-components/ViewBuilder/utils";
import { deleteView, addNewView, updateViewItem } from "sui-components/ViewBuilder/Operations/viewBuilderAPI";
import { fetchViewBuilderList, fetchViewData } from "sui-components/ViewBuilder/Operations/viewBuilderSlice";
import SmartDropDown from 'components/smartDropdown';

const ClientContractsToolbar = (props: any) => {
	const modName = 'clientcontract';
	const dispatch = useAppDispatch();
	const tableViewType = useAppSelector(getTableViewType);
	// const { selectedRows } = useAppSelector((state) => state.cCGrid);
	const { loginUserData, selectedRecord, companiesData } = useAppSelector((state) => state.clientContracts)
	const { gridData, gridOriginalData, selectedRows, clientsList, activeMainGridDefaultFilters, activeMainGridGroupKey, activeMainGridFilters } = useAppSelector((state) => state.cCGrid);
	const appInfo = useAppSelector(getServer);
	const { connectors } = useAppSelector((state) => state.gridData);
	const [disableDelete, setDisableDelete] = React.useState<boolean>(true);
	const [disablePrint, setDisablePrint] = React.useState<boolean>(true);
	const [disableSubmitContract, setDisableSubmitContract] = React.useState<boolean>(true);
	const [alert, setAlert] = React.useState<any>({ show: false, message: '', type: '' });
	const [disablePostContract, setDisablePostContract] = React.useState<boolean>(true);
	const [groupValue, setGroupValue] = useState<any>();
	const { viewData, viewBuilderData } = useAppSelector(state => state.viewBuilder);

	const { blockchainEnabled } = useAppSelector((state) => state.blockchain);
	const showSettingsPanel = useAppSelector(getShowSettingsPanel);
	const [toggleChecked, setToggleChecked] = React.useState(false);
	const groupOptions = [
		{ text: "Client Company", value: "client.name" },
		{ text: appInfo && isUserGCForCC(appInfo) ? "Status" : 'Response Status', value: "status" },
	];
	const { defaultData } = useAppSelector(state => state.settings);		

	const disableBlockchainActionButtons = (blockchainEnabled && blockchainStates.indexOf(selectedRows?.[0]?.blockChainStatus) === -1);	
	console.log("IsBlockChainEnabled", blockchainEnabled, (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled)		

	const filterOptions = [
		{
			text: "Client Company",
			value: "client",
			key: "client",
			// iconCls: "common-icon-name-id",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: appInfo && isUserGCForCC(appInfo) ? "Status" : 'Response Status',
			value: "status",
			key: "status",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: isUserGCForCC(appInfo) ? vendorContractsStatusFilterOptions : vendorContractsResponseStatusFilterOptions,
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
					{ text: 'Dollar Amount', id: 'DollarAmount', key: 'DollarAmount', value: 'DollarAmount', },
					{ text: 'Pay When Paid', id: 'ThroughDate', key: 'ThroughDate', value: 'ThroughDate', },
				],
			},
		},
	];

	const [filters, setFilters] = React.useState<any>(filterOptions);

	const handleDelete = () => {
		setAlert({
			show: true,
			type: 'Delete',
			message: <span>Are you sure you want to delete the selected Contract(s)? <br /> This action cannot be reverted.</span>
		});
	};
	React.useEffect(() => {
		if (selectedRows.length > 0) { setDisableDelete(false); setDisablePrint(false); }
		else { setDisableDelete(true); setDisablePrint(true); }
		selectedRows[0]?.status == 'ReadyToSubmit' ? setDisablePostContract(false) : setDisablePostContract(true);
	}, [selectedRows]);

	React.useEffect(() => {
		const filtersCopy = [...filters];
		let clientItem = filtersCopy.find((rec: any) => rec.value === "client");
		clientItem.children.items = clientsList;
		setFilters(filtersCopy);
	}, [clientsList]);

	useEffect(() => {
		setToggleChecked(blockchainEnabled);
	}, [blockchainEnabled]);

	useMemo(() => {
		if (activeMainGridGroupKey == 'None') { setGroupValue('undefined'); }
		else { setGroupValue(activeMainGridGroupKey) }
	}, [activeMainGridGroupKey]);

	const handleListChanges = (val: string) => {
		if (val == 'yes') {
			const selectedRowIds = selectedRows.map((row: any) => row.id);
			if (alert.type == 'Delete') {
				deleteClientContract(appInfo, selectedRowIds[0], (response: any) => {
					dispatch(getClientContractsList(appInfo));
					dispatch(setToastMessage({ displayToast: true, message: `The Selected Record Deleted Successfully` }));
					setDisableDelete(true);
				});
			}
			else {
				activateClientContract(appInfo, selectedRowIds[0], (response: any) => {
					dispatch(getClientContractsList(appInfo));
					selectedRecord?.id == selectedRows[0]?.id && dispatch(setSelectedRecord(response));
					setDisablePostContract(true);
					if(blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
						dispatch(setShowBlockchainDialog(true));
					}
					else dispatch(setToastMessage({displayToast: true, message: `The Selected Contract became Active Successfully.`}));
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
		}
		else {
			dispatch(setGridData(gridOriginalData));
		}
	};
	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if (value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};
	const handlePostContract = () => {
		setAlert({
			show: true,
			type: 'lock',
			message: <div>
				<span>Are you sure you want to Lock & Post the Contract?</span> <br /><br /><br />
				<span>By doing so, the contract will become Active immediately and the Client will be able to see the contract Active.</span>
			</div>
		})
	}


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
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'ClientContract' }));
			dispatch(getClientContractsList(appInfo));
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewData.viewId }));
		});
	}
	const saveViewHandler = (value: any) => {
		const FilterValue = JSON.stringify(activeMainGridFilters);
		const payload = { ...value, filters: FilterValue ? FilterValue : '{}', groups: activeMainGridGroupKey ? [activeMainGridGroupKey] : ['None'] };
		console.log('payload', payload);
		updateViewItem(appInfo, viewData.viewId, payload, (response: any) => {
			dispatch(getClientContractsList(appInfo));
			dispatch(fetchViewData({ appInfo: appInfo, viewId: viewData.viewId }));
		});
	}
	const DeleteViewHandler = () => {
		deleteView(appInfo, viewData.viewId, (response: any) => {
			dispatch(fetchViewBuilderList({ appInfo: appInfo, modulename: 'ClientContract' }));
		});
	}


	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setToggleChecked(event.target.checked);
		const typeValue: number = moduleType['ClientContracts'];
		// blockchainAction(event.target.checked, typeValue);
		dispatch(doBlockchainAction({ enable: event.target.checked, typeString: 'ClientContracts' }));
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

	const viewListOnChange = (data: any) => {
		console.log('get')
		dispatch(getClientContractsList(appInfo));
	}

	const handlePostTo = () => {
		const type = getConnectorType(connectors?.[0]?.name)
		postClientContractsToConnector(appInfo, type, (response:any) => {
			console.log("client contracts connector resp", response);
		})
	}

	return <Stack direction='row' className='toolbar-root-container-client-contracts'>
		<div key='toolbar-buttons' className='toolbar-item-wrapper options-wrapper'>
			<>
				<IQTooltip title='Refresh' placement='bottom'>
					<IconButton
						aria-label='Refresh Vendor Contracts List'
						onClick={() => {
							dispatch(getClientContractsList(appInfo));
							// dispatch(setActiveMainGridFilters({}))
							// dispatch(setActiveMainGridGroupKey(null))
							// dispatch(setActiveMainGridDefaultFilters({}))
							isUserGCForCC(appInfo) && dispatch(getClientCompanies(appInfo));
							// dispatch(setRefreshed(true))
						}}
					>
						<span className="common-icon-refresh"></span>
					</IconButton>
				</IQTooltip>
				{/* <IQTooltip title="Export" placement={"bottom"}>
					<IconButton
						aria-label="Export budgetmanager"
					onClick={() => {
						dispatch(setImportPopup(true));
					}}
					>
						<Box component='img' alt='Export' src={ExportIcon} className='image' width={30} height={30} color={'#666666'} />
					</IconButton>
				</IQTooltip>
				<IQTooltip title='Export CSV' placement='bottom'>
					<IconButton>
						<Box component='img' alt='CSV' src={CSV} className='image' width={22} height={22} />
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
						onClick={() => { handleDelete(); }}
					>
						<span className="common-icon-delete"></span>
					</IconButton>
				</IQTooltip>
				{!isUserGC(appInfo) && <Button variant="outlined" color={disableSubmitContract ? 'inherit' : 'success'} onClick={() => {}} startIcon={<span className='common-icon-submitted-waiting-party' />} disabled={disableSubmitContract || disableBlockchainActionButtons}>
					Submit Contract
				</Button>}
				{isUserGC(appInfo) &&
					<Button variant="outlined"
						className='post-contract-btn'
						color={disablePostContract ? 'inherit' : 'success'}
						onClick={() => handlePostContract()}
						startIcon={<span className='common-icon-post-contract' />}
						disabled={disablePostContract || disableBlockchainActionButtons}>
						Post Contract
					</Button>
				}
			</>
		</div>
		<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
			<IQSearch
				groups={isUserGCForCC(appInfo) ? groupOptions : [groupOptions[1]]}
				placeholder={viewData && viewData?.viewName}
				filters={isUserGCForCC(appInfo) ? filters : [filterOptions[1]]}
				onSearchChange={(text: string) => dispatch(setMainGridSearchText(text))}
				filterHeader=''
				defaultFilters={activeMainGridDefaultFilters}
				defaultGroups={groupValue}
				viewBuilderapplied={true}
				onGroupChange={(selectedVal: any) => { dispatch(setActiveMainGridGroupKey(selectedVal)); }}
				onFilterChange={(filters: any) => {
					console.log('onchange', activeMainGridFilters)
					if (filters) {
						let filterObj = filters;
						console.log('filterObj', filterObj)
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
		</div>
		<div key="spacer" className="toolbar-item-wrapper toolbar-group-button-wrapper" >
			{<ReportAndAnalyticsToggle />}
			{connectors?.length ? <SapButton imgSrc={connectors?.[0]?.primaryIconUrl} onClick={handlePostTo}/> : <></>}
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
				variant='permanent'
				elevation={8}
				open={false}
			>
				<Box>
					<Stack direction="row" sx={{ justifyContent: "end", height: "5em" }}>
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
											onChange={(e) => { handleToggleChange(e); }}
											edge={'end'}
										/>
									</ListItemIcon>
								</ListItem >}
							</List >
							<Typography variant="h6" component="h6" className='budgetSetting-heading'>Work Flow Settings</Typography>	
							<SmartDropDown
								options={defaultData?.length > 0 ? [{label: 'Built In', id: 'built', value: 'builtIn'}, {label: 'Apps', id: 'apps', value: 'apps', options: [...defaultData]}] : []}
								dropDownLabel="Client Contract"
								isSearchField
								required={false}
								useNestedOptions
								// selectedValue={[{label: 'Built In', id: 'built', value: 'builtIn'}]}
								isFullWidth
								ignoreSorting={true}
								// handleChange={(value: any) => handleInputChange(value[0], 'contractsApp')}
								variant={'outlined'}
								optionImage={true}
								// menuProps={classes3.menuPaper}
							/>	
						</Stack >
					</Stack >
				</Box >
			</SUIDrawer >
			: null}
		{
			alert?.show && <SUIAlert
				open={alert?.show}
				contentText={<span>{alert?.message}</span>}
				title={'Confirmation'}
				onAction={(e: any, type: string) => handleListChanges(type)}
			/>
		}
	</Stack >;
};

export default ClientContractsToolbar;