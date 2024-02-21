import { Stack, StackProps } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import React, { memo, useEffect, useState } from 'react';

import './IQGridToolbar.scss';

// Project files and internal support import
import IQSearch from 'components/iqsearchfield/IQSearchField';

interface IQSearchComponentProps {
	show?: boolean;
	type?: 'regular' | 'viewBuilder';
	searchText?: string | undefined;
	groupOptions?: any;
	filterOptions?: any;
	onGroupChange?: any;
	onSearchChange?: any;
	onFilterChange?: any;
	onFilterMenuClose?: any;
	defaultFilters?: any;
	defaultSearchText?: any;
	defaultGroups?: any;
	headerStatusFilters?: any;
	placeholder?:any;
	showNone?:boolean;
	viewBuilderapplied?:boolean;
};

export type IQGridToolbarProps = StackProps & {
	searchComponent?: IQSearchComponentProps;
	viewBuilder?: React.ReactNode;
	leftItems?: React.ReactNode;
	rightItems?: React.ReactNode;
};

// Component definition
const IQGridToolbar = ({ className, leftItems, rightItems, searchComponent, viewBuilder, ...stackProps }: IQGridToolbarProps) => {
	// Local variable declaration


	// State declaration
	const [isVisible, setVisible] = useState<boolean>(false);

	// Effect definitions
	useEffect(() => {
		const visible: any = (!isEmpty(searchComponent) && searchComponent.show && !isEmpty(searchComponent.type)) || !isEmpty(leftItems) || !isEmpty(rightItems);
		setVisible(visible);
	}, [searchComponent, leftItems, rightItems]);

	// Default props to be applied to the base window
	const defaultProps: StackProps = {
		direction: 'row'
	};

	const mergedProps = merge(defaultProps, stackProps);

	return (isVisible ? <Stack className={`toolbar-root-container${className ? ` ${className}` : ''}`} {...mergedProps}>
		<div className='toolbar-item-wrapper options-wrapper'>
			{leftItems}
		</div>
		{searchComponent?.show ? <div className='toolbar-item-wrapper search-wrapper'>
		<>
			{searchComponent?.type === 'regular' ? <IQSearch
				searchText={searchComponent?.searchText}
				groups={searchComponent?.groupOptions}
				filters={searchComponent?.filterOptions}
				onGroupChange={searchComponent?.onGroupChange}
				onSearchChange={searchComponent?.onSearchChange}
				onFilterChange={searchComponent?.onFilterChange}
				onFilterMenuClose={searchComponent?.onFilterMenuClose}
				defaultFilters={searchComponent?.defaultFilters}
				defaultGroups={searchComponent?.defaultGroups}
				defaultSearchText={searchComponent?.defaultSearchText}
				headerStatusFilters={searchComponent?.headerStatusFilters}
				placeholder={searchComponent?.placeholder}
				showNone={searchComponent?.showNone}
				viewBuilderapplied={searchComponent?.viewBuilderapplied}
			/> : undefined}
			{searchComponent?.type === 'viewBuilder' ? <IQSearch
				groups={searchComponent?.groupOptions}
				filters={searchComponent?.filterOptions}
				onGroupChange={searchComponent?.onGroupChange}
				onSearchChange={searchComponent?.onSearchChange}
				onFilterChange={searchComponent?.onFilterChange}
				onFilterMenuClose={searchComponent?.onFilterMenuClose}
				defaultFilters={searchComponent?.defaultFilters}
				defaultGroups={searchComponent?.defaultGroups}
				defaultSearchText={searchComponent?.defaultSearchText}
				placeholder={searchComponent?.placeholder}
				viewBuilderapplied={searchComponent?.viewBuilderapplied}
			/> : undefined}
			{viewBuilder}
		</>	
		</div> : ''}
		<div className='toolbar-item-wrapper toolbar-group-button-wrapper'>
			{rightItems}
		</div>
	</Stack> : <></>);
};

export default memo(IQGridToolbar);