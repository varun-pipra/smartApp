import * as React from 'react';
import { Button, Menu, MenuItem, ListSubheader, Divider } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import _ from 'lodash';

import './ButtonMenu.scss';

export interface ButtonMenuOption {
	text: string;
	value: number | string;
	options?: Array<{ text: string, value: string; }>;
}

export interface ButtonMenuProps {
	width?: string | number;
	value?: string;
	options: Array<ButtonMenuOption>;
	onChange: Function;
	useNestedOptions?: boolean;
	buttonStyle?: object;
	startIcon?: any;
};

const ButtonMenu = (props: ButtonMenuProps) => {
	const intialValue = props.value ? getDefaultValue(props.options, props.value, props.useNestedOptions) : 'Select Option';
	//const intialValue = 'Select Option';
	const [ selection, setSelection ] = React.useState(intialValue);
	const [ currentValue, setCurrentValue ] = React.useState(props.value);

	const handleChange = (event: any, value: 'string') => {
		const text = event.currentTarget.textContent;
		if (selection !== text) {
			setSelection(text);
			setCurrentValue(value);
			props.onChange(value);
		}
	};

	return (
		<>
			{ props.useNestedOptions ?
				<PopupState variant="popover">
					{ (popupState) => (
						<React.Fragment>
							<Button
								size={ 'large' }
								variant="outlined"
								startIcon={ props.startIcon }
								endIcon={ <ArrowDown /> }
								{ ...bindTrigger(popupState) }
								sx={ props.buttonStyle }
							>
								{ selection }
							</Button>
							<Menu { ...bindMenu(popupState) } PaperProps={ { sx: { width: props.width } } } className='nested_Menu'>
								{ props.options?.length && props.options.map((el: any, index: number) => {

									return (
										[
											<ListSubheader
												sx={ {
													fontWeight: "bolder",
													lineHeight: 1.8,
													marginTop: "5px",
													color: 'black'
												} }
											>
												{ el.text }
											</ListSubheader>,

											el.options?.length && el.options.map((el: any, index: number) => {
												return (
													<MenuItem
														selected={ el.value === currentValue }
														key={ `menu-${el.value}` }
														onClick={ (e) => { handleChange(e, el.value); popupState.close(); } }
														sx={ { padding: '6px 16px 6px 30px', fontSize: '0.8rem' } }
													>
														{ el.text }
													</MenuItem>

												);
											})
										]
									);
								}) }
							</Menu>
						</React.Fragment>
					) }
				</PopupState>
				:
				<PopupState variant="popover">
					{ (popupState) => (
						<React.Fragment>
							<Button
								size={ 'small' }
								variant="outlined"
								endIcon={ <ArrowDown /> }
								{ ...bindTrigger(popupState) }
								sx={ { width: props.width } }
							>
								{ selection }
							</Button>
							<Menu { ...bindMenu(popupState) } PaperProps={ { sx: { width: props.width } } }>
								{ props.options?.length && props.options.map((el: any, index: number) => {
									return <MenuItem
										selected={ el.value === currentValue }
										key={ `menu-${el.value}` }
										onClick={ (e) => { handleChange(e, el.value); popupState.close(); } }>
										{ el.text }
									</MenuItem>;
								}) }
							</Menu>
						</React.Fragment>
					) }
				</PopupState>
			}
		</>
	);
};

const getDefaultValue = (options: ButtonMenuOption[], value: any, useNestedOptions: any) => {
	if (useNestedOptions) {
		const data: any = options.map(data => {
			const result = _.find(data.options, { value: value });
			return result?.value;
		});
		return data.includes(value) ? value : '';
	}
	else {
		const item: any = _.find(options, { value: value });
		return item.text;
	}
};


export default ButtonMenu;