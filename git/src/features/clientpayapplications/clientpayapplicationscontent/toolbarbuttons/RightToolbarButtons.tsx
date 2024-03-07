import React, {useEffect} from 'react';
import {Box, Stack, IconButton, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {GridOn, TableRows} from '@mui/icons-material';

// Project files and internal support import
import IQTooltip from 'components/iqtooltip/IQTooltip';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import {setShowTableViewType, getTableViewType} from 'features/budgetmanager/operations/tableColumnsSlice';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {ReportAndAnalyticsToggle} from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';
import {List, ListItem, ListItemIcon, ListItemText, Typography} from '@mui/material';
import SUIDrawer from 'sui-components/Drawer/Drawer';
import IQToggle from 'components/iqtoggle/IQToggle';
import {getServer, getShowSettingsPanel, setShowSettingsPanel} from 'app/common/appInfoSlice';
import {doBlockchainAction, moduleType} from 'app/common/blockchain/BlockchainSlice';
import {blockchainAction} from 'app/common/blockchain/BlockchainAPI';
import SapButton from 'sui-components/SAPButton/SAPButton';
import SmartDropDown from 'components/smartDropdown';
import { postClientPayAppsToConnector } from 'features/clientpayapplications/stores/GridAPI';
import { getConnectorType } from 'utilities/commonutills';

// Component definition
const ClientPayAppToolbarRightButtons = () => {
	const dispatch = useAppDispatch();
	const tableViewType = useAppSelector(getTableViewType);
	const { connectors } = useAppSelector((state) => state.gridData);
	const { defaultData } = useAppSelector(state => state.settings);			

	const showSettingsPanel = useAppSelector(getShowSettingsPanel);
	const [toggleChecked, setToggleChecked] = React.useState(false);
	const {blockchainEnabled} = useAppSelector((state: any) => state.blockchain);
	const appInfo = useAppSelector(getServer);

	useEffect(() => {
		setToggleChecked(blockchainEnabled);
	}, [blockchainEnabled]);

	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if(value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};
	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setToggleChecked(event.target.checked);
		const typeValue: number = moduleType['ClientPayApplication'];
		// blockchainAction(event.target.checked, typeValue);
		dispatch(doBlockchainAction({ enable: event.target.checked, typeString: 'ClientPayApplication' }));		
	};
	const handlePostTo = () => {
		console.log("dataa")
		const type = getConnectorType(connectors?.[0]?.name)
		postClientPayAppsToConnector(appInfo, type, (response:any) => {
			console.log("client pay apps connector resp", response);
		})
	}

	return <>
		<div key="spacer" className="toolbar-item-wrapper toolbar-group-button-wrapper" >
			{<ReportAndAnalyticsToggle />}
			{connectors?.length ? <SapButton imgSrc={connectors?.[0]?.primaryIconUrl} onClick={() => handlePostTo()}/> : <></>}
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
					// onClick={handleLockBudget}
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
							<Typography variant="h6" component="h6" className='budgetSetting-heading'>Work Flow Settings</Typography>	
							<SmartDropDown
								options={defaultData?.length > 0 ? [{label: 'Built In', id: 'built', value: 'builtIn'}, {label: 'Apps', id: 'apps', value: 'apps', options: [...defaultData]}] : []}
								dropDownLabel="Client Pay Invoices"
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
						</Stack>
					</Stack>
				</Box>
			</SUIDrawer>
			: null}
	</>;
};

export default ClientPayAppToolbarRightButtons;