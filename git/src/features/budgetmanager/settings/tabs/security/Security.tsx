import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { TextField, Box, InputAdornment, Checkbox } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

import './Security.scss';

import IQButton from 'components/iqbutton/IQButton';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { addSecurity } from '../../../operations/settingsAPI';
import { fetchSecurity } from "../../../operations/settingsSlice";
import { getServer } from 'app/common/appInfoSlice';
import Toast from 'components/toast/Toast';

const Security = () => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const [searchInput, setSearchInput] = useState('');
	const { securityData } = useAppSelector<any>(state => state.settings);
	const [securityArray, setSecurityArray] = useState<any>(securityData.roles && securityData.roles?.length > 0 ? securityData.roles : []);
	const [filteredResults, setFilteredResults] = useState<any>(securityData.roles && securityData.roles?.length > 0 ? securityData.roles : []);
	const [toast, setToast] = useState<any>({ displayToast: false, text: '', rolesUpdated: false });

	const handleSearch = (value: any) => {
		setSearchInput(value);
		if (value !== '') {
			const filteredData = securityArray.filter((item: any) => {
				return Object.values(item).join('').toLowerCase().includes(value.toLowerCase());
			})
			setFilteredResults(filteredData);
		}
		else {
			setFilteredResults(securityArray);
		}
	};

	const handleChange = (value: any, index: number, key: any) => {
		const columnsDataClone = [...filteredResults];

		if (key === 'canEdit') {
			columnsDataClone[index] = { ...columnsDataClone[index], canEdit: value };
		}
		else if (key === 'canLock') {
			columnsDataClone[index] = { ...columnsDataClone[index], canLock: value };
		}
		else if (key === 'canView') {
			columnsDataClone[index] = { ...columnsDataClone[index], canView: value };
		}

		setFilteredResults([...columnsDataClone]);
		setToast({ ...toast, displayToast: false, text: '', rolesUpdated: true })
	};

	const handleSave = () => {
		const payload = { roles: filteredResults };
		addSecurity(appInfo, payload, (response: any) => {
			dispatch(fetchSecurity(appInfo));
		});
		setToast({ ...toast, displayToast: true, text: 'Saved Successfully' })
	};

	return (
		<Box className='bm-security-setting-box'>
			<TextField
				size="small"
				fullWidth tabIndex={1}
				value={searchInput}
				onChange={(event: any) => handleSearch(event.target.value)}
				placeholder="Search"
				onKeyDown={(e) => {
					if (e.key !== "Escape") {
						e.stopPropagation();
					}
				}}
				InputProps={{
					endAdornment: <InputAdornment position="end">
						<SearchIcon />
					</InputAdornment>,
				}}
			/>
			<Box className='security-table'>
				<div className='security-header'>
					<span className='security-role-cell'>Role</span>
					<span className='security-role-chk-cell'>View</span>
					<span className='security-role-chk-cell'>Edit</span>
					<span className='security-role-chk-cell'>Lock</span>
				</div>
				<div className='security-body'>
					{filteredResults?.length > 0 && filteredResults.map((value: any, index: number) => (
						<div className='security-body-row' key={`security-body-row-${index}`}>
							<IQTooltip
								key={`security-role-cell-tooltip-${index}`}
								title={value.name?.length > 22 ? value.name : ''}
								arrow={true}
								sx={{
									'& .MuiTooltip-tooltip': {
										padding: '1em 1em',
										marginTop: '1px !important',
									}
								}}
							>
								<span className='security-role-cell' key={`security-role-cell-${index}`}>
									{value.name}
								</span>
							</IQTooltip>
							<span className='security-role-chk-cell' key={`security-role-view-cell-${index}`}>
								<Checkbox
									size='small'
									className='security-checkbox'
									key={`security-role-view-chk-${index}`}
									checked={value.canView}
									onChange={(event) => handleChange(event.target.checked, index, 'canView')}
								/>
							</span>
							<span className='security-role-chk-cell' key={`security-role-edit-cell-${index}`}>
								<Checkbox
									size='small'
									className='security-checkbox'
									key={`security-role-edit-chk-${index}`}
									checked={value.canEdit}
									onChange={(event) => handleChange(event.target.checked, index, 'canEdit')}
								/>
							</span>
							<span className='security-role-chk-cell' key={`security-role-lock-cell-${index}`}>
								<Checkbox
									size='small'
									className='security-checkbox'
									key={`security-role-lock-chk-${index}`}
									checked={value.canLock}
									onChange={(event) => handleChange(event.target.checked, index, 'canLock')}
								/>
							</span>
						</div>
					))}
				</div>
				<div className='security-footer'>
					<IQButton color='blue' onClick={handleSave}>Save</IQButton>
				</div>
			</Box>
			{
				toast.displayToast && toast.rolesUpdated ?
					<Toast message={toast.text} interval={3000} />
					: null
			}
		</Box>
	);
}

export default Security;