import React, { useState } from "react";
import Box from "@mui/material/Box";
import Popper, { PopperPlacementType } from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import TextField from "@mui/material/TextField/TextField";
import FormGroup from "@mui/material/FormGroup/FormGroup";
import FormLabel from "@mui/material/FormLabel/FormLabel";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Popover from "@mui/material/Popover";

type TradesProps = {
	open: boolean;
	close: any;
	anchor?: HTMLDivElement | null;
	handleFilterVendors?: (searchText: any) => void;
	items: any;
	search?: string
	handleSearch: (searchString: any) => void;
};

const Trades: React.FC<TradesProps> = ({
	open,
	close,
	anchor,
	handleFilterVendors,
	items,
	search,
	handleSearch
}) => {
	const checkboxValues: any[] = [];
	items.forEach((element: any) => {
		checkboxValues.push(element.checked);
	});
	const [checkedState, setCheckedState] = useState(checkboxValues);
	const [allCheckedState, setAllCheckedState] = useState(true);

	const isCheckboxChecked = (event: React.ChangeEvent<HTMLInputElement>, position: any) => {
		const {target: { value, checked },} = event;
		const updatedCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);
		setCheckedState(updatedCheckedState);
		setAllCheckedState(false);
		let parsedValue = JSON.parse(value);
		if (checked) {
			items.map((item: any) => {
				if (item.objectId === parsedValue.objectId) item.checked = true;
			});
		} else {
			items.map((item: any) => {
				if (item.objectId === parsedValue.objectId) item.checked = false;
			});
		}
		if (handleFilterVendors) {
			handleFilterVendors(items);
		}
	};

	const handleAllCheckedBox = () => {
		setAllCheckedState(!allCheckedState);
		if (allCheckedState) {
			setCheckedState(new Array(items.length).fill(false));
			if (handleFilterVendors) {
				handleFilterVendors([]);
			}
		} else {
			setCheckedState(new Array(items.length).fill(true));
		}
	};

	const handleClearAll = () => {
		setAllCheckedState(false);
		setCheckedState(new Array(items.length).fill(false));
	};

	return (
		<>
			<Popover
				open={open}
				anchorEl={anchor}
				onClose={close}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Box p={1} className="search-wrapper">
					<TextField
						size="small"
						fullWidth
						tabIndex={1}
						value={search}
						onChange={(event: any) => handleSearch(event.target.value)}
						placeholder="Search"
						className="search-text-field"
						onKeyDown={(e) => {
							if (e.key !== "Escape") {
								e.stopPropagation();
							}
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					></TextField>
				</Box>
				<FormGroup className="componetType_form_group">
					<FormLabel className="clear_all" onClick={handleClearAll}>
						Clear
					</FormLabel>
					<FormControlLabel
						control={
							<Checkbox
								value={"All"}
								checked={allCheckedState}
								onChange={handleAllCheckedBox}
							/>
						}
						label={"All"}
					/>
					{items.map((item: any, index: number) => {
						return (
							<FormControlLabel
								key={item.name}
								control={
									<Checkbox
										value={JSON.stringify(item)}
										checked={checkedState[index]}
										onChange={(e) => isCheckboxChecked(e, index)}
									/>
								}
								label={item.name}
							/>
						);
					})}
				</FormGroup>
			</Popover>
		</>
	);
};

export default Trades;
