import { Popover, Box, ListSubheader, MenuItem, FormControlLabel, Checkbox, checkboxClasses } from '@mui/material';
import { OptionProps } from 'components/costcodedropdown/CostCodeDropdown';
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import Awarded from 'resources/images/bidManager/AwardedColor.svg';
import Draft from 'resources/images/bidManager/DraftColor.svg';
import Expired from 'resources/images/bidManager/ExpiredColor.svg';
import Active from 'resources/images/bidManager/ActiveColor.svg';
import Paused from 'resources/images/bidManager/PausedColor.svg';
import Scheduled from 'resources/images/bidManager/ScheuduledColor.svg';
import ReadyToPost from 'resources/images/bidManager/ReadyToPostColor.svg';
import Cancelled from 'resources/images/bidManager/CancelledColor.svg';
import Closed from 'resources/images/bidManager/ClosedColor.svg';
import Lock from 'resources/images/Lock.svg';
import Play from 'resources/images/Play.svg';
import Pause from 'resources/images/Pause (1).svg';
import BidDetails from 'resources/images/bidManager/BidDetails.svg';
import BidQueries from 'resources/images/bidManager/BidQueries.svg';
import BRDraft from 'resources/images/bidManager/BRDraft.svg';
import Declined from 'resources/images/bidManager/Declined.svg';
import NotResponded from 'resources/images/bidManager/NotResponded.svg';
import ReadyToSubmit from 'resources/images/bidManager/ReadyToSubmit.svg';

interface FilterProps {
	options: any;
	showFilter: boolean;
	filteredIds?: any;
	filterChanged?: (values: any) => void;
	onFilterClosed?: (val: boolean) => void;
	popupPostion?: any;
	clearFilters?:any;
}
const Filter = (props: FilterProps) => {
	const [filtered, setFiltered] = useState<any>(props.filteredIds ? props.filteredIds : { ids: [], names: [] });
	const [filterPopupEl, setFilterPopupEl] = React.useState<HTMLButtonElement | null>(null);
	const [showFilterPopup, setShowFilterPopup] = React.useState<boolean>(true);
	// console.log("filteredfiltered", props.filteredIds)
	React.useEffect(() => {props?.clearFilters && setFiltered({ ids: [], names: [] })}, [props?.clearFilters])

	const handleFilterPopupClose = () => {
		setFilterPopupEl(null);
		setShowFilterPopup(false)
		if (props.onFilterClosed) props.onFilterClosed(false)
	};
	const handleFilterChange = (id: any, name: any) => {
		if (filtered.ids.includes(id)) {
			let index: number = filtered.ids.indexOf(id);
			filtered.ids.splice(index, 1);
			filtered.names.splice(index, 1);
		}
		else {
			filtered.ids.push(id);
			filtered.names.push(name);

		}
		// console.log("id, value", id, name, filtered)
		setFiltered({ ...filtered });
	}

	useEffect(() => {
		if (props.filterChanged) props.filterChanged(filtered);
	}, [filtered]);

	return (

		<Popover
			open={props.showFilter}
			anchorEl={filterPopupEl}
			onClose={handleFilterPopupClose}
			anchorReference="anchorPosition"
			anchorPosition={{ top: props.popupPostion.clientY, left: props.popupPostion.clientX }}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
		>
			<Box padding={1}>
				<ListSubheader
					sx={{
						fontWeight: "600",
						lineHeight: 1.8,
						paddingLeft: '6px'
					}}

				>
					Filter By
				</ListSubheader>
				<MenuItem
					sx={{ marginTop: 1, marginBottom: 1, paddingLeft: '6px' }}
					onClick={() => setFiltered({ ids: [], names: [] })}
				>
					<em>Clear</em>
				</MenuItem>
				{props.options.map((option: any, index: number) => (
					<MenuItem key={index}>
						<FormControlLabel
							control={<Checkbox
								checked={filtered?.ids?.includes(option?.id)}
								onChange={() => handleFilterChange(option?.id, option?.name)}
								sx={{
									[`&.${checkboxClasses.checked}`]: {
										// color: checkedColor ? checkedColor : 'gray',
										// color: 'blue',
									},
									padding: 0, marginRight: 1
								}}
							/>}
							label={<div>
								{option?.iconType ? <span className={option?.icon} style ={{color: `#${option?.color}`, marginRight: '8px', marginBottom: '-1px'}}/> : <Box component='img' src={option.icon} style={{ height: "15px", width: '15px', marginRight: '4px', marginBottom: '-1px' }} />}
								<span style={{ color: `#${option.color}` }}>{option.name}</span></div>}
						/>
					</MenuItem>
				))}
			</Box>
		</Popover>
	)
};
export default Filter;
