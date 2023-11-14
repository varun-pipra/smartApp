import IQMenuButton from 'components/iqmenu/IQMenuButton';
import {memo, useState} from 'react';
import {Checkbox, List, ListItem, ListItemButton, ListItemIcon} from '@mui/material';

type IFilterHeader = {
	options: Array<any>;
	columnName: string;
	onSort: Function;
	onFilter: Function;
	defaultFilters?: Array<string>;
	onOpen?: Function;
	onClose?: Function;
};

export default memo(({options = [], columnName, onSort, onOpen, onClose, onFilter, defaultFilters = []}: IFilterHeader) => {
	const [filters, setFilters] = useState<Array<string>>(defaultFilters);
	const [sort, setSort] = useState<0 | 1 | 2>(0);
	const sortEnum: any = {
		0: null,
		1: 'asc',
		2: 'desc'
	};

	const handleFilter = (value: string) => {
		let newList: any = [];
		if(value !== 'clear') {
			if(filters.indexOf(value) > -1) {
				newList = filters.filter((status: string) => status !== value);
			} else {
				newList = filters.concat(value);
			}
		}

		const newFilters = newList.sort();
		setFilters(newFilters);
		onFilter(newFilters);
	};

	const handleHeaderClick = (e: any) => {
		const {classList} = e.target;

		if(classList.contains('custom-filter-header') || classList.contains('custom-filter-text')) {
			const nextSort: any = sort === 2 ? 0 : (sort + 1);
			setSort(nextSort);
			onSort(sortEnum[nextSort]);
		}
	};

	return <div
		className='custom-filter-header'
		onClick={handleHeaderClick}
		style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
	>
		<div
			className='custom-filter-text ag-header-cell-text'
			style={{display: 'flex', gap: '0.5em'}}
		>
			{columnName}
			{sort !== 0 && <span className={`ag-icon ag-icon-${sort === 1 ? 'asc' : 'desc'}`}></span>}
		</div>
		<IQMenuButton
			type='icon'
			onOpen={onOpen}
			onClose={onClose}
			className='filter-icon-btn'
			icon={<span className='filter-btn common-icon-filter-option' style={{fontSize: '0.75em', color: filters.length === 0 ? '#a7a7a7' : '#059cdf'}}></span>}
			menuProps={{
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'left'
				},
				transformOrigin: {
					vertical: 'top',
					horizontal: 'left'
				}
			}}
		>
			<List
				className='custom-filter-header'
				sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
			>
				<ListItem className='title-item'>Filter By</ListItem>
				<ListItem disablePadding>
					<ListItemButton
						dense
						role={undefined}
						className='clear-item'
						onClick={() => handleFilter('clear')}
					>
						Clear
					</ListItemButton>
				</ListItem>
				{options.map((el: any) => {
					const labelId = `checkbox-list-label-${el.key}`;
					return <ListItem
						key={el.value}
						disablePadding
					>
						<ListItemButton
							dense
							role={undefined}
							style={{color: el.bgColor}}
							onClick={() => handleFilter(el.value)}
						>
							<ListItemIcon>
								<Checkbox
									edge='start'
									tabIndex={-1}
									disableRipple
									inputProps={{'aria-labelledby': labelId}}
									checked={filters.indexOf(el.value) !== -1}
								/>
							</ListItemIcon>
							<span className={`option-icon ${el.icon}`}></span>
							{el.text}
						</ListItemButton>
					</ListItem>;
				})}
			</List>
		</IQMenuButton>
	</div>;
});