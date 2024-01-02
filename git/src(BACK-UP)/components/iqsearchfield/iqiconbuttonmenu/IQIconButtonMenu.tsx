import {useEffect, useState, ReactNode} from 'react';
import _ from 'lodash';
import {
	Button, Checkbox, ListItemIcon, ListItemText, ListItemButton,
	ListSubheader, ListItem, MenuList, ClickAwayListener, Paper, Popper, Divider, Box, TextField, InputAdornment, Avatar
} from '@mui/material';
import {KeyboardArrowRight as ArrowRight} from '@mui/icons-material';

import './IQIconButtonMenu.scss';
import IQIconButtonMenuProps, {IQIconButtonMenuChildren, IQIconButtonMenuChildrenItem} from './IQIconButtonMenu.d';
import IQMenuListItem from '../iqlistitem/IQMenuListItem';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';

const IQIconButtonMenu = (props: IQIconButtonMenuProps) => {
	const {defaultFilters, defaultGroups = "", headerStatusFilters, showSearchField = false} = props;
	const [open, setOpen] = useState(false);
	const [anchor, setAnchor] = useState();
	const selection: any = props.allowSubMenu ? _.findKey(props.defaultValue, function (value) {return value.length > 0;}) : _.keys(props.defaultValue);
	const [selectionFilter, setSelectionFilter] = useState<any>({});
	const [selectionKeys, setSelectionKeys] = useState<any>([]);
	const getSelectionKeys = (data: any) => {
		let defaultData = _.keys(data);
		let selectionValues = [];
		for(let i = 0;i < defaultData.length;i++) {
			if(data?.[defaultData[i]]?.length > 0) selectionValues.push(defaultData[i]);
		};
		return selectionValues;
	};

	useEffect(() => {
		if(_.keys(props.defaultValue) ?? false) {
			let keyValues: any = getSelectionKeys(props.defaultValue);
			setSelectionKeys(keyValues);
		};
	}, [selectionFilter]);

	useEffect(() => {
		if((defaultFilters ?? false) && Object.keys(defaultFilters).length === 0) setSelectionKeys([]);
		else if(defaultFilters ?? false) {
			let keyValues: any = getSelectionKeys(defaultFilters);
			setSelectionKeys(keyValues);
			handleChange(defaultFilters);
		};
	}, [defaultFilters]);

	useEffect(() => {
		if(defaultGroups !== "" ?? false) {
			let value = [defaultGroups];
			setSelectionKeys(value);
		};
	}, [defaultGroups]);

	const handleChange = (value: any) => {
		if(!_.isEqual(selectionFilter, value)) {
			if(headerStatusFilters?.names?.length === 0 && selectionFilter?.value?.safetyStatus?.length > 0) {
				setSelectionFilter({value});
				props.onChange && props.onChange(value);
			} else {
				setSelectionFilter({...selectionFilter, value});
				props.onChange && props.onChange(value);
			};
		};
	};

	const handleClick = (e?: any) => {
		if(e) setAnchor(e.currentTarget);
		setOpen(!open);
		props.onClose && props.onClose(!open);
	};

	const handleClickAway = (e: any) => {
		if(open) {
			setAnchor(undefined);
			setOpen(false);
			props.onClose && props.onClose(false);
		}
	};

	let optionList = props.options?.length
    ? props.options.sort((a: any, b: any) => {
        if (a.text < b.text) return -1;
        else if (a.text > b.text) return 1;
        else return 0;
      })
    : [];

	if(props.showNone)
		optionList = _.concat([{
			text: (props.noneText || 'None'),
			value: 'none'
		}], optionList);

	let popperSx = {zIndex: 9999};
	if(props.menuProps?.sx) popperSx = Object.assign(popperSx, props.menuProps.sx);
	// console.log('**** RECEIVED DEFAULT VALUES', defaultFilters, defaultGroups, selectionKeys);
	return <ClickAwayListener
		mouseEvent="onMouseDown"
		touchEvent="onTouchStart"
		onClickAway={handleClickAway}
	>
		<span className="iqicon-menu-button">
			<Button
				{...props.buttonProps}
				className={_.isEmpty(selection) ? '' : 'menu-selected'}
				onClick={handleClick}
			/>
			{open ? <Popper open={open} anchorEl={anchor} className="search-group-filter-menu" sx={popperSx} {..._.omit(props.menuProps, ['sx', 'open'])}>
				<Paper elevation={3}>
					{props.extraMenuItemShow &&
						<>
							<MenuList >
								{props.extraMenuItem.length > 0 ?
									props.extraMenuItem?.map((el: any, index: any) => {
										return (
											<ListItem
												key={`iqmenu-item-${el.value}-${index}`}
												className={
													!el.disabled && selection && selection.indexOf(el.value) > -1
														? "menu-selected"
														: ""
												}
												onClick={(e) => {props.onChange && props.onChange(el.value, el);}}
												disabled={el.disabled}
											>
												{el.icon && (
													<ListItemIcon key={`iqmenu-item-icon-${el.value}-${index}`}>
														{el.icon}
													</ListItemIcon>
												)}
												{el.iconCls && (
													<ListItemIcon key={`iqmenu-item-icon-${el.value}-${index}`}>
														<span className={el.iconCls}></span>
													</ListItemIcon>
												)}
												<ListItemText key={`iqmenu-item-text-${el.value}-${index}`}>
													{el.text}
												</ListItemText>
											</ListItem>
										);
									})
									: ''
								}
							</MenuList>
							<Divider />
						</>
					}
					<MenuList>
						{props.menuProps?.header ? <ListSubheader aria-label={`${props.menuProps.header} menu`}>{props.menuProps.header}</ListSubheader> : ''}
						{props.options?.length ? optionList?.map((el: any, index: number) => {
							const hasSubMenu = props.allowSubMenu && (el.children?.items?.length > 0 || el.children?.component);
							const subMenuNode = hasSubMenu ? getSubMenuNodeByType(el.value, el.children, props.defaultValue[(el.value)], handleChange, showSearchField) : undefined;
							const MenuListItem = hasSubMenu ? IQMenuListItem : ListItem;
							const secondaryActionProp = hasSubMenu ? {
								menu: subMenuNode,
								secondaryAction: <ArrowRight />
							} : {
								onClick: (e: any) => {
									if(props.allowSubMenu) {
										if(el.value === 'none') {
											setSelectionKeys([]);
											props.onChange && props.onChange({}, 'None');
										} else {
											props.onChange && props.onChange({[el.key]: el.value});
										}
									} else {
										let value = undefined;
										if(el.value !== 'none') value = el.value;
										setSelectionKeys(value);
										props.onChange && props.onChange(value, el);
									}
									handleClick();
								}
							};

							return (
								<div>
									{!el.hidden && (
										<MenuListItem
											key={`iqmenu-item-${el.value}-${index}`}
											className={
												!el.disabled && selectionKeys && (selectionKeys || []).indexOf(el.value) > -1
													? "menu-selected"
													: ""
											}
											{...secondaryActionProp}
											disabled={el.disabled}
										>
											{el.icon && (
												<ListItemIcon key={`iqmenu-item-icon-${el.value}-${index}`}>
													{el.icon}
												</ListItemIcon>
											)}
											{el.iconCls && (
												<ListItemIcon key={`iqmenu-item-icon-${el.value}-${index}`}>
													<span className={el.iconCls}></span>
												</ListItemIcon>
											)}

											<ListItemText key={`iqmenu-item-text-${el.value}-${index}`}>
												{el.text}
											</ListItemText>
										</MenuListItem>
									)}
								</div>
							);
						}) : ''}
					</MenuList>
				</Paper>
			</Popper> : ''}
		</span>
	</ClickAwayListener>;
};

export default IQIconButtonMenu;

const getSubMenuNodeByType = (name: any, child: IQIconButtonMenuChildren | any, selected: any, changeHandler:any, isSearchField?: boolean): ReactNode => {
	let subMenuNodes: ReactNode = <></>;

	switch(child.type ?? name) {
		case 'custom':
			subMenuNodes = child.component;
			break;
		case 'Custom':
			subMenuNodes = <MultipleSubMenu name={name} childItems={child} selection={selected} onChange={changeHandler} />;
			break;
		case 'checkbox':
			subMenuNodes = <CheckboxListMenu name={name} items={child.items} selection={selected} onChange={changeHandler} isSearchField={isSearchField} />;
			break;
		case 'radio':
			subMenuNodes = child.component;
			break;
		default:
			subMenuNodes = <MultipleSubMenu name={name} childItems={child} selection={selected} onChange={changeHandler} />;
	}
	return subMenuNodes;
};

export const MultipleSubMenu = (props: any) => {
	const {name, childItems, ...rest} = props;
	const [selection, setSelection] = useState({});
	const onItemClick = (e: any, selectedItem: any) => {
		setSelection(selectedItem);
	};

	useEffect(() => {
		if(Object.keys(selection)?.length !== 0) {
			props.onChange && props.onChange(selection, (name ?? ""));
		}
	}, [selection]);

	return (
		(childItems?.length ?? false) && (
			<MenuList>
				{childItems?.map((item: any, index: any) => {
					return (
						<div key={`listitem-${item?.value}-${index}`}>
							{
								!item.hidden &&
								(<ListItem
									key={`listitem-${item?.value}-${index}`}
									onClick={(e: any) => onItemClick(e, item)}
								>
									 <ListItemIcon>
									{item.icon ? 
										<img
											src={item?.icon}
											alt="Avatar"
											style={{ width: "24px", height: "24px", padding: "1px" }}
											className="base-custom-img"
										/> : <Avatar 
										sx={{ backgroundColor: `#${item.color}`, 
												width: "24px", 
												height: "24px", 
												padding: "1px", 
												marginRight: '10px', 
												fontSize: '13px' 
									}}>{item?.value?.[0]?.toUpperCase()}</Avatar>
									}
									</ListItemIcon>
									{item.iconCls && (
										<ListItemIcon key={`iqmenu-item-icon-${item.value}-${index}`}>
											<span className={item.iconCls}></span>
										</ListItemIcon>
									)}
									<ListItemText id={index} primary={item?.text} key={index} />
								</ListItem>)
							}
						</div>
					);
				})}
			</MenuList>
		)
	);
};


export const CheckboxListMenu = (props: {name: string, selection: any, items: Array<IQIconButtonMenuChildrenItem> | undefined, onChange: any, isSearchField?: boolean}) => {
	const {isSearchField, ...rest} = props;
	let itemList = _.concat([{text: 'All', value: 'all'}], props.items);
	const [menuItems, setMenuItems] = React.useState(itemList || []);
	const [selection, setSelection] = useState(props.selection || []);
	const onItemClick = (e: any) => {
		const currentValue = e.currentTarget.getAttribute('data-value');
		const valueIndex = selection.indexOf(currentValue);

		if(currentValue === 'all') {
			if(selection.length === itemList.length) {
				setSelection([]);
			} else {
				setSelection(_.map(itemList, 'value'));
			}
		} else {
			if(valueIndex > -1) {
				setSelection((prev: any) => prev.filter((el: any) => el !== currentValue));
			} else {
				setSelection(selection.concat(currentValue));
			}
		}
	};

	useEffect(() => {
		props.onChange && props.onChange({[props.name]: selection});
	}, [selection]);
	const [searchValue, setSearchValue] = useState("");

	const handleSearch = (e: any) => {
		let keyword = e?.target?.value;
		setSearchValue(keyword);
		const res = JSON.parse(JSON.stringify(itemList)).filter((obj: any) => {
			return obj.value && JSON.stringify(obj.value)?.toLowerCase()?.includes(keyword);
		});
		setMenuItems(res);
	};
	
	const handleSearchClear = () => {
		setSearchValue('');
		setMenuItems(itemList);
	};
	
	return props.items?.length ? (
    <MenuList>
      {isSearchField && (
        <Box className="search-wrapper skill-search">
          <TextField
            variant={"outlined"}
            autoFocus
            value={searchValue}
            onChange={handleSearch}
            size="small"
            fullWidth
            tabIndex={1}
            className={"smart-dropdown-search-box search-field "}
            onKeyDown={(e: any) => {
              if (e.key !== "Escape") {
                e.stopPropagation();
              }
            }}
            placeholder={"Search"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {searchValue == "" ? (
                    <SearchIcon />
                  ) : (
                    <ClearIcon
                      onClick={handleSearchClear}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      {menuItems?.map((item: any, index) => {
        const labelId = `checkbox-list-${item?.value}-${index}`;

        return (
          <div>
            {!item?.hidden && (
              <ListItem
                key={`listitem-${item?.value}-${index}`}
                className={
                  props.selection?.indexOf(item?.value) > -1
                    ? "menu-selected"
                    : ""
                }
              >
                <ListItemButton
                  key={`listitembutton-${item?.value}-${index}`}
                  dense
                  disableRipple
                  role={undefined}
                  data-value={item?.value}
                  onClick={onItemClick}
                >
                  <ListItemIcon key={`listitem-icon-${item?.value}-${index}`}>
                    <Checkbox
                      key={`listitem-checkbox-${item?.value}-${index}`}
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      checked={selection.indexOf(item?.value) > -1}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  {(item?.basecustomline ?? false) && (
                    <div
                      className="base-custom-line"
                      style={{ backgroundColor: `#${item.color}` }}
                    ></div>
                  )}
                  {item.iconCls && (
                    <ListItemIcon
                      key={`iqmenu-item-icon-${item.value}-${index}`}
                    >
                      <span
                        className={item.iconCls}
                        style={{ color: item.color }}
                      ></span>
                    </ListItemIcon>
                  )}
                  <ListItemText id={labelId} primary={item?.text} />
                </ListItemButton>
              </ListItem>
            )}
          </div>
        );
      })}
    </MenuList>
  ) : null;
};

export const PopoverSelect = (props: any) => {
	const {open, options, ...rest} = props;
	const [anchor, setAnchor] = useState();
	let popperSx = {zIndex: 9999};
	if(props.menuProps?.sx) popperSx = Object.assign(popperSx, props.menuProps.sx);
	const selection: any = props.allowSubMenu ? _.findKey(props.defaultValue, function (value) {return value.length > 0;}) : _.keys(props.defaultValue);

	const handleChange = (value: any) => {
		props.onChange && props.onChange(value);
	};

	const handleClick = (e?: any) => {

	};

	return (
		<MenuList className='user-menu-items'>
			{options?.map((el: any, index: number) => {
				const hasSubMenu = props.allowSubMenu && (el.children?.items?.length > 0 || el.children?.length > 0);
				const subMenuNode = hasSubMenu ? getSubMenuNodeByType(el.value, el.children, props.defaultValue[(el.value)], handleChange) : undefined;
				const MenuListItem = hasSubMenu ? IQMenuListItem : ListItem;
				const secondaryActionProp = hasSubMenu ? {
					menu: subMenuNode,
					secondaryAction: <ArrowRight />
				} : {
					onClick: (e: any) => {
						if(props.allowSubMenu) {
							if(el.value === 'none') {
								props.onChange && props.onChange();
							} else {
								props.onChange && props.onChange(el?.value);
							}
						} else {
							let value = undefined;
							if(el.value !== 'none') value = el.value;
							props.onChange && props.onChange(value);
						}
						handleClick();
					}
				};

				return (
					<MenuListItem
						key={`iqmenu-item-${el.value}-${index}`}
						className={
							selection && selection.indexOf(el.value) > -1
								? "menu-selected"
								: ""
						}
						{...secondaryActionProp}
					>
						{el.icon && (
							<ListItemIcon key={`iqmenu-item-icon-${el.value}-${index}`}>
								{el.icon}
							</ListItemIcon>
						)}
						{el.iconCls && (
							<ListItemIcon key={`iqmenu-item-icon-${el.value}-${index}`}>
								<span className={el.iconCls}></span>
							</ListItemIcon>
						)}

						<ListItemText key={`iqmenu-item-text-${el.value}-${index}`}>
							{el.text}
						</ListItemText>
					</MenuListItem>
				);
			})}
		</MenuList>
	);
};