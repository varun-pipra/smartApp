import {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import IQSelect from 'components/iqselect/IQSelect';
import Location from 'features/common/locationfield/LocationField';
import {hideLoadMask} from 'app/hooks';
import {TextField, IconButton} from '@mui/material';

const options = [{name: 'UK'}, {name: 'USA'}, {name: 'USA'}, {name: 'USA'}, {name: 'USA'}, {name: 'USA'}, {name: 'USA'}, {name: 'USA'}, {name: 'USA'}];

export default () => {
	useEffect(() => {
		hideLoadMask();
	}, []);
	// return <FieldContainer className='common-icon-eraser'>
	// 	<Select placeholder='Select'>
	// 		<optgroup label="Swedish Cars">
	// 			<option value="volvo">Volvo</option>
	// 			<option value="saab">Saab</option>
	// 		</optgroup>
	// 		<optgroup label="German Cars">
	// 			<option value="mercedes">Mercedes</option>
	// 			<option value="audi">Audi</option>
	// 		</optgroup>
	// 	</Select>
	// </FieldContainer>;
	return <IQSelect
		// label='Country'
		// inputProps={{ placeholder: 'Select' }}
		placeholder='Select'
		MenuProps={{sx: {height: '10em'}}}
		displayField='name'
		valueField='name'
		options={options}
	/>;

	// const [ value, setValue ] = useState<any>([ 3, 72 ]);
	// const [ inputValue, setInputValue ] = useState<any>([ "1st Floor - SmartApp B1", "ADA SINGLE - LEVEL 2 - Android BIM File" ]);

	// const [ value, setValue ] = useState<any>([
	// 	{
	// 		"name": "1st Floor - SmartApp B1",
	// 		"id": 3
	// 	},
	// 	{
	// 		"name": "ADA SINGLE - LEVEL 2 - Android BIM File",
	// 		"id": 72
	// 	}
	// ].map((el: any) => {return {...el, text: el.name};}));

	// return <><Location
	// 	multiple={true}
	// 	options={[]}
	// 	style={{width: 500}}
	// 	value={value}
	// 	onChange={(e, newValue: any) => {
	// 		setValue(newValue);
	// 		// const reconciled = newValue?.filter((item: any) => {
	// 		// 	const found = value.find((existing: any) => existing.id === item.id);
	// 		// 	return !found;
	// 		// });
	// 		// console.log(reconciled);
	// 		// setValue((pValue: any) => {
	// 		// 	return [ ...pValue, ...reconciled ];
	// 		// });
	// 	}}
	// 	getOptionLabel={(option: any) => option?.text || ''}
	// />
	// </>;
};