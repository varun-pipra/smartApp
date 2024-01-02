import { memo } from 'react';
import { Autocomplete, AutocompleteProps, Checkbox } from '@mui/material';

import './IQAutocomplete.scss';

export interface IQAutocompleteProps extends AutocompleteProps<any, boolean | undefined, boolean | undefined, boolean | undefined> { };

const IQAutocomplete = <
	T,
	Multiple extends boolean | undefined = undefined,
	DisableClearable extends boolean | undefined = undefined,
	FreeSolo extends boolean | undefined = undefined,
	>({ className, ...props }: IQAutocompleteProps) => {

	return <Autocomplete
		{...props}
		className={`iq-autocomplete ${className ? ` ${className}` : ''}`}
	/>;
};

export default memo(IQAutocomplete);