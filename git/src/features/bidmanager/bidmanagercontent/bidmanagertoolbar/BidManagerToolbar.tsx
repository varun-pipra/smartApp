import './BidManagerToolbar.scss';

import { getServer, getShowSettingsPanel, setShowSettingsPanel } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { fetchBudgetLineItems, setToastMessage } from 'features/bidmanager/stores/BidManagerSlice';
import { deleteBidPackages, patchBidPackage } from 'features/bidmanager/stores/gridAPI';
import {
	fetchGridData, setActiveMainGridFilters, setActiveMainGridGroupKey, setMainGridSearchText, setRefreshed
} from 'features/bidmanager/stores/gridSlice';
import {
	getTableViewType, setShowTableViewType
} from 'features/budgetmanager/operations/tableColumnsSlice';
import { useCallback, useEffect, useState } from 'react';
import SUIAlert from 'sui-components/Alert/Alert';
import { statusFilterOptions } from 'utilities/bid/enums';
import { postMessage } from 'app/utils';
import { AssessmentOutlined, Gavel, GridOn, TableRows } from '@mui/icons-material';
import { Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ReportAndAnalyticsToggle } from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';
import React from 'react';
import _ from "lodash";
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQToggle from 'components/iqtoggle/IQToggle';
import { blockchainAction } from 'app/common/blockchain/BlockchainAPI';
import { doBlockchainAction, moduleType, setShowBlockchainDialog, blockchainStates } from 'app/common/blockchain/BlockchainSlice';

const BidManagerToolbar = (props: any) => {
	const dispatch = useAppDispatch();
	const tableViewType = useAppSelector(getTableViewType);
	const {
		gridData, selectedRows, activeMainGridFilters,
		activeMainGridDefaultFilters, activeCompaniesList
	} = useAppSelector((state) => state.bidManagerGrid);
	const { selectedRecord } = useAppSelector((state) => state.bidManager);
	const { blockchainEnabled } = useAppSelector((state) => state.blockchain);

	const appInfo = useAppSelector(getServer);
	const [disableDelete, setDisableDelete] = useState<boolean>(true);
	const [disablePrint, setDisablePrint] = useState<boolean>(true);
	const [disablePause, setDisablePause] = useState<boolean>(true);
	const [disableCancel, setDisableCancel] = useState<boolean>(true);
	const [disablePostBid, setDisablePostBid] = useState<boolean>(true);
	const [alert, setAlert] = useState<any>({
		open: false,
		contentText: '',
		title: '',
		method: ''
	});
	const disableBlockchainActionButtons = (blockchainEnabled && blockchainStates.indexOf(selectedRows?.[0]?.blockChainStatus) === -1);
	console.log("disableBlockchainActionButtons in tool", disableBlockchainActionButtons)
		
	const showSettingsPanel = useAppSelector(getShowSettingsPanel);
	const [toggleChecked, setToggleChecked] = React.useState(false);
	const groupOptions = [
		{ text: "Status", value: "status" },
		{ text: "Companies", value: "company" },
		{ text: "Bid Process", value: "processType" },
		{ text: "Bid Type", value: "type" },

	];

	const filterOptions = [
		{
			text: "Status",
			value: "status",
			key: "status",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: statusFilterOptions,
			},
		},
		{
			text: "Companies",
			value: "company",
			key: "company",
			// iconCls: "common-icon-name-id",
			children: {
				type: "checkbox",
				items: [],
			},
		},
		{
			text: "Submission Status",
			value: "submissionStatus",
			key: "submissionStatus",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Not Applicable', id: '0', key: '0', value: '0', },
					{ text: 'Not Submitted', id: '1', key: '1', value: '1', },
					{ text: 'Pending', id: '2', key: '2', value: '2', },
					{ text: 'Submitted', id: '3', key: '3', value: '3', },
				],
			},
		},
		{
			text: "Intend To Bid",
			value: "intendToBid",
			key: "intendToBid",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Undecided', id: '0', key: '0', value: '0', },
					{ text: 'No', id: '1', key: '1', value: '1', },
					{ text: 'Yes', id: '2', key: '2', value: '2', },
					{ text: 'Expired', id: '3', key: '3', value: '3', },
				],
			},
		},
		{
			text: "Bid Process",
			value: "processType",
			key: "processType",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Open', id: '0', key: '0', value: '0', },
					{ text: 'Closed', id: '1', key: '1', value: '1', },
				],
			},
		},
		{
			text: "Bid Type",
			value: "type",
			key: "type",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [
					{ text: 'Single Party', id: '0', key: '0', value: '0', },
					{ text: 'Multi Party', id: '1', key: '1', value: '1', },
				],
			},
		},
	];
	const [filters, setFilters] = React.useState<any>(filterOptions);

	useEffect(() => {
		if (selectedRows.length > 0) { setDisableDelete(false); setDisablePrint(false); }
		else { setDisableDelete(true); setDisablePrint(true); }

		selectedRows.length > 0 && selectedRows[0]?.status == 1 || selectedRecord?.status == 1 ? setDisablePostBid(false) : setDisablePostBid(true);
		selectedRows.length > 0 && selectedRows[0]?.status == 3 || selectedRows[0]?.status == 2 || selectedRecord?.status == 3 || selectedRecord?.status == 2 ? setDisablePause(false) : setDisablePause(true);
		selectedRows.length > 0 && selectedRows[0]?.status == 3 || selectedRecord?.status == 3 ? setDisableCancel(false) : setDisableCancel(true);
	}, [selectedRows, gridData, selectedRecord]);

	useEffect(() => {
		const filtersCopy = [...filters];
		let companyItem = filtersCopy.find((rec: any) => rec?.value === "company");
		companyItem.children.items = activeCompaniesList;
		setFilters(filtersCopy);
	}, [activeCompaniesList]);

	useEffect(() => {
		setToggleChecked(blockchainEnabled);
	}, [blockchainEnabled]);

	const handleDelete = () => {
		setAlert({
			open: true,
			contentText: 'Are you sure want to continue?',
			title: 'Confirmation',
			method: 'Delete'
		});
	};

	const handlePause = () => {
		setAlert({
			open: true,
			contentText: 'Are you sure you want to Pause the Bid?',
			title: 'Confirmation',
			method: 'Pause'
		});
	};

	const handleCancel = () => {
		setAlert({
			open: true,
			contentText: 'Are you sure you want to Cancel the Bid?',
			title: 'Confirmation',
			method: 'Cancel'
		});
	};

	const handleListChanges = useCallback((val: string, method: any) => {
		if (val == 'yes') {
			const selectedRowIds = selectedRows.map((row: any) => row.id);
			if (method == 'Delete') {
				deleteBidPackages(appInfo, selectedRowIds).then(() => {
					dispatch(fetchGridData(appInfo));
					dispatch(fetchBudgetLineItems(appInfo));
					dispatch(setToastMessage({ displayToast: true, message: `Selected Record Deleted Successfully` }));
					setDisableDelete(true);
				});
			} else {
				setDisablePause(true);
				setDisableCancel(true);
				patchBidPackage(appInfo, selectedRows[0]?.id, { status: method == 'Pause' ? 4 : 7 }).then(() => {
					dispatch(fetchGridData(appInfo));
					setDisablePause(true);
					setDisableCancel(true);
				});
			}
		}
		setAlert({ open: false });
	}, [appInfo, selectedRows]);

	const handlePostBid = () => {
		const selectedRowIds = selectedRows.map((row: any) => row.id);
		patchBidPackage(appInfo, selectedRows[0]?.id, { status: 3 }).then((response: any) => {
			dispatch(fetchGridData(appInfo));
			setDisablePostBid(true);
			if (blockchainEnabled && (window?.parent as any)?.GBL?.config?.currentProjectInfo?.blockchainEnabled) {
				dispatch(setShowBlockchainDialog(true));
			}
		});
	};

	const handleView = (event: any, value: string) => {
		if (value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};
	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setToggleChecked(event.target.checked);
		dispatch(doBlockchainAction({ enable: event.target.checked, typeString: 'BidManager' }));
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
	return <Stack direction='row' className='toolbar-root-container-bidmanager'>
		<div key='toolbar-buttons' className='toolbar-item-wrapper options-wrapper'>
			<>
				<IQTooltip title='Refresh' placement='bottom'>
					<IconButton
						aria-label='Refresh Bid Manager List'
						onClick={() => {
							dispatch(fetchGridData(appInfo));
							dispatch(setRefreshed(true));
							dispatch(fetchBudgetLineItems(appInfo));
						}}
					>
						<span className="common-icon-refresh"></span>
					</IconButton>
				</IQTooltip>
				{/* <IQTooltip title='Pause' placement='bottom'>
					<IconButton onClick={handlePause} disabled={disablePause}>
						<span className="common-icon-Pause"></span>
					</IconButton>
				</IQTooltip> */}
				<IQTooltip title='Cancel' placement='bottom'>
					<IconButton onClick={handleCancel} disabled={disableCancel}>
						<span className="common-icon-Cancelled"></span>
					</IconButton>
				</IQTooltip>
				{/* <IQTooltip title='Import' placement='bottom'>
					<IconButton>
						<Box component='img' alt='Import' src={Import} className='image' width={22} height={22} />
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
						aria-label='Delete Bid Line Item'
						disabled={disableDelete}
						onClick={handleDelete}
					>
						<span className="common-icon-delete"></span>
					</IconButton>
				</IQTooltip>

				<Button variant="outlined" color={disablePostBid ? 'inherit' : 'success'} onClick={handlePostBid} startIcon={<Gavel />} disabled={disablePostBid || disableBlockchainActionButtons}>
					Post Bid
				</Button>
			</>
		</div>
		<div key="toolbar-search" className="toolbar-item-wrapper search-wrapper">
			<IQSearch
				placeholder={'Search'}
				groups={groupOptions}
				filters={filters}
				filterHeader=''
				defaultFilters={activeMainGridDefaultFilters}
				onGroupChange={(selectedVal: any) => dispatch(setActiveMainGridGroupKey(selectedVal))}
				onSearchChange={(text: string) => dispatch(setMainGridSearchText(text))}
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
			/>
			{/* <Stack direction={'row'} >
				<IconMenu
					menuProps={{
						open: true,
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
						"aria-label": "Group menu",
						disableRipple: true
					}}
				/>
			</Stack>
			<Stack direction={'row'} >
				<IconMenu
					menuProps={{
						open: true,
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
						"aria-label": "Group menu",
						disableRipple: true
					}}
				/></Stack> */}
		</div>
		<div key='spacer' className='toolbar-item-wrapper toolbar-group-button-wrapper'>
			{<ReportAndAnalyticsToggle />}
			{/* <ToggleButtonGroup
				exclusive
				value={tableViewType}
				size='small'
				onChange={handleView}
				aria-label='Inventory tab view buttons'
			>
				<ToggleButton value={'Calendar'} aria-label='Budget details tab'>
					<CalendarViewMonth />
					<GridOn />
				</ToggleButton>
				<ToggleButton value={'Chart'} aria-label='Analytics tab'>
					<Leaderboard />
					<AssessmentOutlined />
				</ToggleButton>
			</ToggleButtonGroup> */}
			<IQTooltip title='Settings' placement={'bottom'}>
				<IconButton
					className='settings-button'
					aria-label='settings budgetmanager'
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
						top: '105px',
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
								</ListItem>}
							</List>
						</Stack>
					</Stack>
				</Box>
			</SUIDrawer>
			: null}
		<SUIAlert
			open={alert.open}
			contentText={<span>{alert.contentText}</span>}

			title={alert.title}
			onAction={(e: any, type: string) => handleListChanges(type, alert.method)}
		/>
	</Stack>;
};

export default BidManagerToolbar;