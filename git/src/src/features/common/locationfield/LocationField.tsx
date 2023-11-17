import {CheckBox, CheckBoxOutlineBlank} from '@mui/icons-material';
import {
	Checkbox, InputAdornment,
	MenuItem, TextField
} from '@mui/material';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import IQAutocomplete, {IQAutocompleteProps} from 'components/iqautocomplete/IQAutocomplete';
import {memo, useEffect, useMemo, useState, useRef} from 'react';
import './LocationField.scss';
import IQMenuButton from 'components/iqmenu/IQMenuButton';
import {fetchLevelData, fetchLocationData} from './LocationStore';

const icon = <CheckBoxOutlineBlank fontSize='small' />;
const checkedIcon = <CheckBox fontSize='small' />;

export type ILocationField = Omit<IQAutocompleteProps, 'renderInput'> & {
	closeLevel?: boolean;
	hideLevel?: boolean;
};

const LocationField = ({className, closeLevel, hideLevel = false, ...props}: ILocationField) => {
	let firstLoad = useRef<boolean>(true);
	const dispatch = useAppDispatch();
	const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false),
		[selectedLevel, setSelectedLevel] = useState<any>(),
		{levels = [], locations = []} = useAppSelector(state => state.location);

	const handleLevelSelection = (level: any) => {
		setSelectedLevel(level);
	};

	const startIcon = useMemo(() => <InputAdornment position='start'>
		<span className='field-icon common-icon-Location-filled' />
	</InputAdornment>, []);

	useEffect(() => {
		dispatch(fetchLevelData()).then((response: any) => {
			const listLength = response.payload?.length || 0;
			setSelectedLevel(listLength > 0 ? response.payload[listLength - 1] : undefined);
		});
	}, []);

	useEffect(() => {
		if(selectedLevel?.levelId) {
			dispatch(fetchLocationData(selectedLevel?.levelId)).then((response: any) => {
				if(firstLoad.current === false) setDropdownOpen(response.payload?.length > 0);
				firstLoad.current = false;
			});
		}
	}, [selectedLevel?.levelId]);

	return <IQAutocomplete
		{...props}
		open={isDropdownOpen}
		onOpen={() => setDropdownOpen(true)}
		onClose={() => setDropdownOpen(false)}
		options={locations}
		disableCloseOnSelect={props.multiple}
		className={`iq-location-field ${className ? ` ${className}` : ''}`}
		ListboxProps={{
			style: {
				minHeight: 300
			}
		}}
		renderOption={(optionProps, option: any) => {
			const isOptionSelected = props.value?.find((opt: any) => opt.id === option.id);
			// console.log('optionProps', option, isOptionSelected);
			return <li
				{...optionProps}
				key={option.uniqueId}
				aria-selected={`${isOptionSelected ? 'true' : 'false'}`}
			>
				{props.multiple && <Checkbox
					icon={icon}
					checked={isOptionSelected ? true : false}
					checkedIcon={checkedIcon}
				/>}
				{option.text || ''}
			</li>;
		}}
		renderInput={(inputProps) => {
			const tagAdornments = <>{startIcon}{inputProps.InputProps.startAdornment}</>;
			return <TextField {...inputProps}
				placeholder={props?.value ? '' : props.placeholder}
				variant='standard'
				InputProps={{
					...inputProps.InputProps,
					startAdornment: tagAdornments,
					endAdornment: <InputAdornment position='end' style={{cursor: 'pointer'}}>
						{!hideLevel && <LevelButton
							levels={levels}
							selection={selectedLevel}
							onItemClick={handleLevelSelection}
						/>}
					</InputAdornment>
				}}
			/>;
		}}
	/>;
};

export default memo(LocationField);

const LevelButton = memo((props: any) => {
	const [toggle, setToggle] = useState<boolean>(false);

	return <IQMenuButton
		type='icon'
		menuWidth='20em'
		icon={<span className='common-icon-down-arrow' />}
		close={toggle}
	>
		{props.levels?.map((level: any) => {
			const isSelected = props.selection?.levelId === level.levelId;

			return <MenuItem
				key={`iq-location-level-${level.levelId}`}
				sx={{
					backgroundColor: (isSelected ? '#fffad2' : ''),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
				onClick={() => {
					setToggle((pClose: boolean) => !pClose);
					props.onItemClick(level);
				}}
			>
				{level.name}
				{isSelected && <span className='common-icon-tick' />}
			</MenuItem>;
		})}
	</IQMenuButton>;
});