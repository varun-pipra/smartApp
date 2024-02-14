import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, IconButton, MenuItem, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import "./MultipleMenu.scss";
import IQTooltip from 'components/iqtooltip/IQTooltip';

interface MeltipleMenuProps {
	icon?: any;
	iconDisable?: any;
	options?: any;
	options2?: any;
	userPrivileges?: any;
	vendorPermission?: any;
	MenuOptionsClick?: (value: any, isDirty: any) => any;
	Menuheading?: any;
	Menuheading1?:any;
	options3?:any;
}

const MultipleMenuSelect = (props: MeltipleMenuProps) => {
	const { icon, iconDisable, options, options2, options3, Menuheading,Menuheading1, MenuOptionsClick, userPrivileges, vendorPermission } = props;
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [toggleChecked, setToggleChecked] = React.useState<any>();
	const [isDirty, setIsDirty] = React.useState<any>(false);
	const [MenuOptions, setMenuOptions] = React.useState<any>([]);
	const [MenuOptions2, setMenuOptions2] = React.useState<any>([]);
	const [MenuOptions3, setMenuOptions3] = React.useState<any>([]);
	const [selectedOptions, setSelectedOptions] = useState<any>([]);
	const [callAPI, setCallAPI] = useState<any>(false);
	const open = Boolean(anchorEl);
	React.useEffect(() => {
		if (userPrivileges && userPrivileges.length > 0) {
			setSelectedOptions([...userPrivileges]);
		}
	}, [userPrivileges])
	React.useEffect(() => {
		if (options && options.length > 0) {
			setMenuOptions([...options]);
		}
	}, [options])

	React.useEffect(() => {
		if (options2 && options2.length > 0) {
			setMenuOptions2([...options2]);
		}
	}, [options2])

	React.useEffect(() => {
		if (options3 && options3.length > 0) {
			setMenuOptions3([...options3]);
		}
	}, [options3]);

	React.useEffect(() => {
		if (selectedOptions && selectedOptions.length > 0) {
			if(options && options.length > 0){
				options.map((val: any) => {
					var idx = selectedOptions.findIndex((o:any) => { return val.value == o})
					if(idx > -1) {
						val.selectionClass = 'selected-text-cls';
						val.tickIcon = 'common-icon-tick selected';
					} else {
						val.selectionClass = '';
						val.tickIcon = '';
					}
					return val;
				})
				setMenuOptions([...options]);
			}

			if(options2 && options2.length > 0){
				options2.map((val: any) => {
					var idx = selectedOptions.findIndex((o:any) => { return val.value == o})
					if(idx > -1) {
						val.selectionClass = 'selected-text-cls';
						val.tickIcon = 'common-icon-tick selected';
					} else {
						val.selectionClass = '';
						val.tickIcon = '';
					}
					return val;
				})
				setMenuOptions2([...options2]);
			}

			if(options3 && options3.length > 0){
				options3.map((val: any) => {
					var idx = selectedOptions.findIndex((o:any) => { return val?.value == o})
					if(idx > -1) {
						val.selectionClass = 'selected-text-cls';
						val.tickIcon = 'common-icon-tick selected';
					} else {
						val.selectionClass = '';
						val.tickIcon = '';
					}
					return val;
				})
				setMenuOptions3([...options2]);
			}
		}
	}, [selectedOptions])

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
		setCallAPI(!callAPI);
	};
	const onTimeLogChange = (value: any) => {
		const index = selectedOptions?.indexOf(value);
        if (index === -1) {
            setSelectedOptions([...selectedOptions, value]);
        } else {
            const newArray = [...selectedOptions];
            newArray.splice(index, 1);
            setSelectedOptions([...newArray]);
        };
	};
	const onUserPrivilageChange = (value: any) => {
		const index = selectedOptions.indexOf(value);
		const newArray = [...selectedOptions];

		if (index === -1) {
			options2.map((o: any) => {
				const idx = selectedOptions.indexOf(o.value);
				idx >= 0 && newArray.splice(idx, 1);
			})
			setSelectedOptions([...newArray, value]);// Value doesn't exist, so add it to the array
			// setCallAPI(!callAPI);
			handleClose();
		} /* else {
			newArray.splice(index, 1);// Value exists, so remove it from the array
			setSelectedOptions(newArray);
		} */
	}
	const MenuItemOnchange = (value: any) => {
		const index = selectedOptions.indexOf(value);
		setIsDirty(true);
		if (index === -1) {
			setSelectedOptions([...selectedOptions, value]);// Value doesn't exist, so add it to the array
		} else {
			const newArray = [...selectedOptions];
			newArray.splice(index, 1);// Value exists, so remove it from the array
			setSelectedOptions([...newArray]);
		}
		// setCallAPI(!callAPI);
	}
	const highlightItem = (e: any) => {
		const target = e.currentTarget;
		if(e.type != 'mouseleave')
			target.classList.add("highlight-cls");
		else 
			target.classList.remove("highlight-cls");
	};

	React.useEffect(() => {
		selectedOptions;
		userPrivileges;
		if (props.MenuOptionsClick) props.MenuOptionsClick(selectedOptions, isDirty)
	}, [callAPI])

	return (
		<span className='MultipleMenuSelect'>
			<IconButton onClick={handleClick} disabled={iconDisable}>{icon}</IconButton>
			<Menu
				id="MultipleMenuSelect"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				{MenuOptions2.length > 0 && MenuOptions2?.map((data: any, i: any) => {
					return (
						<ListItem
							className={'menuItem-list ' + data?.selectionClass}
							key={i}
							onClick={() => { data?.disable ? '' : onUserPrivilageChange(data?.value) }}
							disabled={data?.disable}
							onMouseEnter={highlightItem}
							onMouseLeave={highlightItem}
						>
							<ListItemIcon key={i + '_icon'}><span className={`${data?.icon} icon-size`}></span></ListItemIcon>
							<ListItemText className={data?.selectionClass} key={i + '_text'}>{data.text}</ListItemText>
							<ListItemIcon className='menuItem-trick-icon'><span className={data?.tickIcon}></span></ListItemIcon>
						</ListItem>
					)
				})}
				{Menuheading1 && <MenuItem><span className='common-icon-Timer icon-size'></span> {Menuheading1}</MenuItem>}
				{(options3 || [])?.length > 0 && options3?.map((data: any, i: any) => {
					return (data?.value ?
						<ListItem
							className={'menuItem-list submenuitem-cls '+ data?.selectionClass}
							key={i}
							onClick={() => { data?.disable ? '' : onTimeLogChange(data?.value) }}
							disabled={data?.disable}
							onMouseEnter={highlightItem}
							onMouseLeave={highlightItem}
						>
							<ListItemIcon key={i + '_icon'}><span className={`${data?.icon} icon-size`}></span></ListItemIcon>
							<ListItemText className={data?.selectionClass} key={i + '_text'}>{data.text}</ListItemText>
							<ListItemIcon className='menuItem-trick-icon'><span className={data?.tickIcon}></span></ListItemIcon>
						</ListItem> :
						<MenuItem className="submenuitem-cls">{data?.text}</MenuItem>
					)
				})}
				{Menuheading && <MenuItem><span className='common-icon-finance icon-size'></span> {Menuheading}</MenuItem>}
				{MenuOptions.length > 0 && MenuOptions?.map((data: any, i: any) => {
					return (data?.value ?
						<ListItem
							className={'menuItem-list submenuitem-cls '+ data?.selectionClass}
							key={i}
							onClick={() => { data?.disable ? '' : MenuItemOnchange(data?.value) }}
							disabled={data?.disable}
							onMouseEnter={highlightItem}
							onMouseLeave={highlightItem}
						>
							<ListItemIcon key={i + '_icon'}><span className={`${data?.icon} icon-size`}></span></ListItemIcon>
							<ListItemText className={data?.selectionClass} key={i + '_text'}>{data.text}</ListItemText>
							<ListItemIcon className='menuItem-trick-icon'><span className={data?.tickIcon}></span></ListItemIcon>
						</ListItem> :
						<MenuItem className="submenuitem-cls">{data?.text}</MenuItem>
					)
				})}
			</Menu>
		</span>
	)
}
export default MultipleMenuSelect;
