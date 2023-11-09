import * as React from 'react';
import _ from 'lodash';
import { Stack, InputBase, IconButton, SxProps } from '@mui/material';
import { FilterNoneOutlined, Search, FilterList, KeyboardArrowDown, Clear } from '@mui/icons-material';

import './style.scss';
import IconMenu from 'components/iqsearchfield/iqiconbuttonmenu/IQIconButtonMenu';
import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import eye from 'resources/images/common/Eye.svg';
import groupBy from 'resources/images/common/GroupIcon.svg';
import Grid from 'resources/images/common/Grid.svg';
import filter from 'resources/images/common/FilterIcon.svg';
import FuzzySearch from 'fuzzy-search';
import Avatar from '@mui/material/Avatar';

export interface ViewBuilderProps {
	sx?: SxProps;
	value?: unknown;
	groupHeader?: string | React.ReactNode;
	filterHeader?: string | React.ReactNode;
	groups?: Array<any>;
	filters?: Array<any>;
	onGroupChange?: (name: string) => {};
	onFilterChange?: (filtersObject: any) => {};
	onSearchChange?: (searchText: string) => void;
	onSettingsChange?: (value: any) => void;
	lefticon?: boolean;
	Righticon?: boolean;
};

const ViewBuilder = (props: ViewBuilderProps) => {
	const { lefticon = true, Righticon = true, ...rest } = props
	const [filters, setFilters] = React.useState({});
	const [group, setGroup] = React.useState({ name: '' });
	const [search, setSearch] = React.useState({ text: '' });
	const [placeholder, setPlaceholder] = React.useState('Search');

	const updateFilters = (filterEl: any) => {
		if (!filterEl) setFilters({});
		else setFilters((prevFilters) => {
			return { ...prevFilters, ...filterEl };
		});
	};

	React.useEffect(() => {
		updatePlaceHolder();
		props.onFilterChange && props.onFilterChange(filters);
	}, [filters]);

	const updateGroup = (groupName: string) => {
		setGroup({ name: groupName });
	};

	React.useEffect(() => {
		updatePlaceHolder();
		props.onGroupChange && props.onGroupChange(group.name);
	}, [group]);

	const updateSearch = (e: any) => {
		const searchString = e.currentTarget?.value;
		setSearch({ text: searchString });
	};

	React.useEffect(() => {
		props.onSearchChange && props.onSearchChange(search.text);
	}, [search]);

	const onClickedSettings = (event: any) => {
		props.onSettingsChange && props.onSettingsChange({ key: 'settings' });
	}

	const updatePlaceHolder = () => {
		const isGrouped = !_.isEmpty(group.name);
		const isFiltered = !_.isEmpty(_.findKey(filters, function (value: []) { return value.length > 0 }));
		const text = (isGrouped || isFiltered) ? `${isGrouped ? 'Grouping ' : 'iqsearch-field'}${(isGrouped && isFiltered) ? '& ' : ''}${isFiltered ? 'Filter ' : ''}Applied` : 'Search';
		setPlaceholder(text);
	};

	const handleSearchClear = () => {
		setSearch({ text: '' });
	}

	return (
		<>
			{/* <Stack className="iqsearch-field" direction={'row'} sx={props.sx}>
			{lefticon &&
				<IconMenu
					// options={props.groups}
					// defaultValue={group.name ? { [group.name]: true } : {}}
					// onChange={updateGroup}
					// menuProps={{
					//     open: true,
					//     header: (props.groupHeader || 'Group By'),
					//     placement: 'bottom-start'
					// }}
					buttonProps={{
						className: "group-menu",
						startIcon: <FilterAltOutlinedIcon style={{ fontSize: '1.2em' }} fontSize='large' />,
						endIcon: <ArrowDropDownOutlinedIcon style={{ marginLeft: '-5px', fontSize: '1.6em' }} />,
						"aria-label": "Group menu",
						disableRipple: true
					}}
				/>
			}
			<InputBase
				placeholder={placeholder}
				value={search?.text}
				onChange={updateSearch}
				inputProps={{ 'aria-label': 'Search' }}
			/>
			{
				search.text !== '' ?

					<IconButton className="search-trigger" onClick={handleSearchClear} disableRipple>
						<Clear />
					</IconButton>
					:
					<IconButton className="search-trigger" aria-label="Search" disableRipple>
						<Search />
						<ArrowDropDownOutlinedIcon />
					</IconButton>
			}
			{Righticon &&
				// <IconMenu
				// 	// options={props.filters}
				// 	// defaultValue={filters}
				// 	// subMenu={true}
				// 	// onChange={updateFilters}
				// 	// menuProps={{
				// 	//     open: true,
				// 	//     header: (props.filterHeader || 'Filter By'),
				// 	//     placement: 'bottom-end'
				// 	// }}
				// 	buttonProps={{
				// 		className: "filter-menu",
				// 		startIcon: <SettingsOutlinedIcon onClick={(e)=>onClickedSettings(e)} style={{ fontSize: '1.2em' }} />,
				// 		"aria-label": "Group menu",
				// 		disableRipple: true
				// 	}}
				// />
				<IconButton style={{boxShadow:'none'}}>
					<SettingsOutlinedIcon onClick={(e)=>onClickedSettings(e)} style={{ fontSize: '1.2em',color:'#666666'}} className= "filter-menu"/>
				</IconButton>
			}
		</Stack> */}
			<Stack className="iqsearch-field" direction={'row'} sx={props.sx}>
				{lefticon &&
					<IconMenu
						// options={props.groups}
						// defaultValue={group.name ? { [group.name]: true } : {}}
						// onChange={updateGroup}
						// menuProps={{
						//     open: true,
						//     header: (props.groupHeader || 'Group By'),
						//     placement: 'bottom-start'
						// }}
						buttonProps={{
							className: "group-menu",
							startIcon: <Avatar src={groupBy} variant="square" style={{ fontSize: '1.2em' }} />,
							"aria-label": "Group menu",
							disableRipple: true
						}}
					/>
				}
				<InputBase
					placeholder={placeholder}
					value={search?.text}
					onChange={updateSearch}
					inputProps={{ 'aria-label': 'Search' }}
				/>
				{
					search.text !== '' ?

						<IconButton className="search-trigger" onClick={handleSearchClear} disableRipple>
							<Clear />
						</IconButton>
						:
						<IconButton className="search-trigger" aria-label="Search" disableRipple>
							<Search />
							<ArrowDropDownOutlinedIcon />
						</IconButton>
				}
				{Righticon &&
					// <IconMenu
					// 	// options={props.filters}
					// 	// defaultValue={filters}
					// 	// subMenu={true}
					// 	// onChange={updateFilters}
					// 	// menuProps={{
					// 	//     open: true,
					// 	//     header: (props.filterHeader || 'Filter By'),
					// 	//     placement: 'bottom-end'
					// 	// }}
					// 	buttonProps={{
					// 		className: "filter-menu",
					// 		startIcon: <SettingsOutlinedIcon onClick={(e)=>onClickedSettings(e)} style={{ fontSize: '1.2em' }} />,
					// 		"aria-label": "Group menu",
					// 		disableRipple: true
					// 	}}
					// />
					<IconButton style={{ boxShadow: 'none' }}>
						<Avatar src={filter} variant="square" className="filter-menu" onClick={(e) => onClickedSettings(e)} style={{ fontSize: '1.2em', color: '#666666' }} />
						{/* <SettingsOutlinedIcon onClick={(e)=>onClickedSettings(e)} style={{ fontSize: '1.2em',color:'#666666'}} className= "filter-menu"/> */}
					</IconButton>
				}
			</Stack>
			<div className='iq-view-eye-grid-bulider'>
				<Avatar src={eye} variant="square" style={{ fontSize: '1.2em' }} />
			</div>
			<div className='iq-view-eye-grid-bulider'>
				<Avatar src={Grid} variant="square" style={{ fontSize: '1.2em' }} />
			</div>
		</>
	);
};

export default ViewBuilder;

