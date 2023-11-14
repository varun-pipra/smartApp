import React, { useState } from 'react';
import _ from 'lodash';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, SelectProps, TextField, ListSubheader } from '@mui/material';
import { Clear } from '@mui/icons-material';

import './IQSelect.scss';
import { getRandomNumber } from 'app/utils';
import FilterIcon from 'resources/images/common/FilterIcon.svg';
import FilterIconBlue from 'resources/images/common/FilterIconBlue.svg';
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';

type IQSelectProps = SelectProps & {
	label?: string;
	className?: string;
	displayField: string;
	valueField: string;
	filters?: Array<any>;
	defaultFilters?: any;
	options: Array<any>;
};

const IQSelect = ({ id, className, displayField, valueField, label, MenuProps, filters, defaultFilters, options, ...other }: IQSelectProps) => {
	const [localId, setLocalId] = useState(`iq-select-${getRandomNumber()}`);

	const currentId = id || localId;
	const filterProps = filters?.length && filters.length > 0 ? {
		endAdornment: <InputAdornment position="end">
			<IconMenu
				showNone={true}
				noneText='Clear'
				options={filters}
				defaultValue={defaultFilters}
				allowSubMenu={true}
				// checkMenu={true}
				// onChange={() => { }}
				menuProps={{
					open: true,
					header: 'Filter By',
					placement: 'bottom-end',
				}}
				buttonProps={{
					'aria-label': 'Filter menu',
					className: 'filter-menu',
					disableRipple: true,
					startIcon: <Box component='img' alt='Filter By' className='filter-menu-icon' src={true ? FilterIconBlue : FilterIcon} />
				}}
			/>
		</InputAdornment>
	} : undefined;

	const fieldProps = {

	};

	const mergedMenuProps = _.merge({
		sx: {
			'.MuiList-root': {
				paddingTop: 'unset',
				paddingBottom: 'unset'
			}
		}
	}, MenuProps);

	return <FormControl
		className={`iq-select ${className}`}
		variant='standard'
		sx={{ m: 1, width: 300 }}>
		{label && <InputLabel
			id={`${currentId}-label`}
			sx={{
				'&.Mui-focused': {
					color: '#333333',
					fontSize: '14px',
					fontWeight: 400
				}
			}}
		>
			{label}
		</InputLabel>}
		<Select
			label={label}
			labelId={`${currentId}-label`}
			id={currentId}
			MenuProps={mergedMenuProps}
			{...other}
			{...filterProps}
		>
			<ListSubheader sx={{ paddingTop: '8px' }}>
				<TextField
					size="small"
					// Autofocus on textfield
					autoFocus
					placeholder="Search"
					fullWidth
					// onChange={(e) => setSearchText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key !== "Escape") {
							// Prevents autoselecting item while typing (default Select behaviour)
							e.stopPropagation();
						}
					}}
				/>
			</ListSubheader>
			{options.map((item, index) => (
				<MenuItem
					key={`${currentId}-option-${index}`}
					value={item[valueField]}
				>
					{item[displayField]}
				</MenuItem>
			))}
		</Select>
	</FormControl>;
};

export default IQSelect;