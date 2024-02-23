import React, { useEffect, useState, ReactNode } from 'react';
import './ViewDropdown.Scss';
import _ from 'lodash';
import {
	Button, Checkbox, ListItemIcon, ListItemText, ListItemButton, Collapse, List,
	ListSubheader, ListItem, MenuList, ClickAwayListener, Paper, Popper, Divider, Box, TextField, InputAdornment, Avatar
} from '@mui/material';
import { KeyboardArrowRight as ArrowRight } from '@mui/icons-material';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';


const ViewDropDown = (props: any) => {
	const { options } = props
	const [open, setOpen] = useState(false);
	const [anchor, setAnchor] = useState();
	const selection: any = props.allowSubMenu ? _.findKey(props.defaultValue, function (value) { return value.length > 0; }) : _.keys(props.defaultValue);

	const [selectOptions, setSelectOptions] = useState<any>([]);

	useEffect(() => {
		if (options && options.length > 0) {	
			const data = options?.map((value: any, index: any)=>{return value.data});
			const groupedData = data?.reduce((acc:any, item:any, index:any) => {
				const headerName = item.viewType === 2 ? "Standard" 
													: item.viewType === 1 ? "Public" : "Private";
				const existingItem = acc.find((group:any) => group.headerName === headerName);
				if (existingItem) {
						existingItem.children.push({ key: item.viewId, value: item.viewId, text: item.viewName, selected: item.defaultView });
				} else {
					acc.push({
						id: index + 1,
						headerName: headerName,
						open: item.defaultView ? false : true,
						collapse: item.defaultView ? false : true,
						children: [{ key: item.viewId, value: item.viewId, text: item.viewName, selected: item.defaultView }]
					});
				}
				return acc;
			}, []);
			setSelectOptions([...groupedData]);
		}
	}, [options])

	const handleClick = (e?: any) => {
		if (e) setAnchor(e.currentTarget);
		setOpen(!open);
		props.onClose && props.onClose(!open);
	};

	const handleClickAway = (e: any) => {
		if (open) {
			setAnchor(undefined);
			setOpen(false);
			props.onClose && props.onClose(false);
		}
	};


	let popperSx = { zIndex: 9999 };
	if (props.menuProps?.sx) popperSx = Object.assign(popperSx, props.menuProps.sx);


	const collapseHandleClick = (key: any) => {
		const updatedarray = selectOptions?.map((item: any, i: any) => {
			if (item?.id === key) { return { ...item, open: !item.open } }
			return item;
		})
		setSelectOptions([...updatedarray]);
	}

	const OptionsClick = (value: any) => {
		const updatedarray = selectOptions?.map((item: any) => {
			const data = item?.children.map((child: any) => {
				if (child.text === value) { return { ...child, selected: true } }
				else { return { ...child, selected: false } }
				return child;
			})
			return { ...item, children: data };
		});
		setSelectOptions([...updatedarray]);
		setAnchor(undefined);
		setOpen(false);
		props.optionOnChange(value);

	}

	return (
		<ClickAwayListener
			mouseEvent="onMouseDown"
			touchEvent="onTouchStart"
			onClickAway={handleClickAway}
		>
			<span className="viewbuilder-list-button">
				<Button
					{...props.buttonProps}
					className={_.isEmpty(selection) ? '' : 'menu-selected'}
					onClick={handleClick}
				/>
				{open ? <Popper open={open} anchorEl={anchor} className="search-group-filter-menu viewBuilder-dropdown" sx={popperSx} {..._.omit(props.menuProps, ['sx', 'open'])}>
					<Paper elevation={3}>
						<MenuList className="viewBuilder-listmenu" sx={{paddingTop:'0px !important'}}>
							{selectOptions && selectOptions.map((main: any, i: any) => {
								return (
									main?.collapse == false ?
										<>
											<ListItemButton sx={{paddingTop:'4px !important',paddingBottom:'4px !important'}}>
												<ListItemText primary={main?.headerName} sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold !important' }, }} />
											</ListItemButton>
											<List component="span">
												{main?.children?.map((sub: any, i: any) => {
													return (
														<MenulistOption
															sub={sub}
															i={i}
															OptionsClick={(value: any) => { OptionsClick(value) }}
														/>
													)
												})
												}
											</List>
										</>
										:
										<>
											<ListItemButton onClick={() => { collapseHandleClick(main?.id) }}>
												<ListItemText primary={main?.headerName} sx={{ '& .MuiListItemText-primary': { fontWeight:'bold !important'}, }}/>
												{main?.open ? <ExpandLess /> : <ExpandMore />}
											</ListItemButton>
											<Collapse in={main?.open} timeout="auto" unmountOnExit>
												<List component="span">
													{main?.children?.map((sub: any, i: any) => {
														return (
															<MenulistOption
																sub={sub}
																i={i}
																OptionsClick={(value: any) => { OptionsClick(value) }}
															/>
														)
													})}

												</List>
											</Collapse>
										</>
								)
							})}
						</MenuList>
					</Paper>
				</Popper> : ''}
			</span>
		</ClickAwayListener>
	)
};

export default ViewDropDown;

const MenulistOption = (props: any) => {
	const { sub, i } = props;
	return (
		<ListItemButton key={i} selected={sub?.selected} align-items={'flex-end'} onClick={() => { props.OptionsClick(sub.text) }}
			sx={{
				"&.MuiButtonBase-root": { pt: 0, pb: 0, paddingLeft: '30px !important' },
				"&.Mui-selected": { backgroundColor: "#fff9cc !important", borderColor: "#fff9cc !important" },
			}}
		>
			<ListItemText primary={sub.text} />
			{sub?.selected && <ListItemIcon
				sx={{
					"&.MuiListItemIcon-root": { display: "contents !important", fontSize: 26 },

				}}
			>
				<span className='common-icon-Verification-Sucessfully' />
			</ListItemIcon>}
		</ListItemButton>
	)
}


