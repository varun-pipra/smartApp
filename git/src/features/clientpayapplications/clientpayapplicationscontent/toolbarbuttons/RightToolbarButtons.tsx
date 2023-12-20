import { Box, Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GridOn, Refresh, TableRows } from '@mui/icons-material';

// Project files and internal support import
import CSV from 'resources/images/bidManager/CSV.svg';
import BidDetails from 'resources/images/bidManager/BidDetails.svg';
import Delete from 'resources/images/bidManager/Delete.svg';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { setShowTableViewType, getTableViewType } from 'features/budgetmanager/operations/tableColumnsSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {ReportAndAnalyticsToggle} from 'sui-components/ReportAndAnalytics/ReportAndAnalyticsToggle';

// Component definition
const ClientPayAppToolbarRightButtons = () => {
	const dispatch = useAppDispatch();
	const tableViewType = useAppSelector(getTableViewType);
	const handleView = (event: React.MouseEvent<HTMLElement>, value: string) => {
		if (value !== null) {
			dispatch(setShowTableViewType(value));
		}
	};
	return <>
		<div key="spacer" className="toolbar-item-wrapper toolbar-group-button-wrapper" >
			{/*<ReportAndAnalyticsToggle />*/}
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
					// onClick={handleLockBudget}
				>
					{'Lock Contract'}
				</Button> */}
			<IQTooltip title="Settings" placement={"bottom"}>
				<IconButton
					className='settings-button'
					aria-label="settings budgetmanager"
				// onClick={() => dispatch(setShowSettingPopup2(true))}
				>
					<TableRows />
				</IconButton>
			</IQTooltip>

		</div>
	</>;
};

export default ClientPayAppToolbarRightButtons;