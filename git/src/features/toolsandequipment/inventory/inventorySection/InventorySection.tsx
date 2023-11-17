import React from 'react';
import './InventorySection.scss'

import { Card, Grid, FormControl, FormControlLabel, Stack } from '@mui/material';
import { Input, InputLabel, InputAdornment, TextField, NativeSelect, RadioGroup, Radio } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Uniqueid from '../../../../components/uniqueid/Uniqueid';
export interface InventoryObjectProps {
	id: number;
	toolName: string;
	rtlsTagNo: string;
	status: string;
	procurementType: string;
	uniqueId: any;
}

export interface InventorySectionprops {
	id: number;
	inventoryobject: InventoryObjectProps;
	onChange?: (obj: InventoryObjectProps) => void
}

const InventorySection = (props: InventorySectionprops) => {

	const [inputValues, setInputValues] = React.useState<InventoryObjectProps>(props.inventoryobject)
	const [toolNamefocus, settoolNamefocus] = React.useState(false);
	const [rtlsTagNofocus, setrtlsTagNo] = React.useState(false);

	const data = (e: any, inputName: any) => {

		if (inputName == 'toolName') {
			e.type == 'focus' ? settoolNamefocus(true) : settoolNamefocus(false);
		}
		else if (inputName = 'rtlsTagNo') {
			e.type == 'focus' ? setrtlsTagNo(true) : setrtlsTagNo(false);
		}
	}
	React.useEffect(() => {
		setInputValues(props.inventoryobject);
	}, [props.inventoryobject])

	const handleOnChange = (event: any) => {
		const { name, value } = event.target;
		const updatedvalues = { ...inputValues, [name]: value }
		setInputValues(updatedvalues);
		if (props.onChange) props.onChange(updatedvalues)
	};
	const handleUniqueidSubmit = (value: any) => {
		const updatedvalues = { ...inputValues, 'uniqueId': value }
		setInputValues(updatedvalues);
		if (props.onChange) props.onChange(updatedvalues)
	}
	return (
		<Stack direction="row" className='Inventory-section-container'>
			<Card variant="outlined" className='Inventory-card'>
				<InputLabel className="inventory-number">{props.id}</InputLabel>
				<Stack direction="column" className="inventory-content">
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={4} lg={4} >
							<TextField
								id="input-with-icon-textfield"
								label={toolNamefocus || inputValues.toolName != '' ? "Tool Name" : ''}
								placeholder={toolNamefocus && inputValues.toolName == '' ? '' : 'Tool Name'}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AccountCircle color={'warning'} />
										</InputAdornment>
									)
								}}
								value={inputValues.toolName}
								name='toolName'
								variant="standard"
								onChange={(e) => { handleOnChange(e) }}
								onFocus={(e) => { data(e, 'toolName') }}
								onBlur={(e) => { data(e, 'toolName') }}
								className='textfield'
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={4}>
							<TextField
								id="input-with-icon-textfield"
								label={rtlsTagNofocus || inputValues.rtlsTagNo != '' ? "RTLS Tag No" : '     '}
								placeholder={rtlsTagNofocus && inputValues.rtlsTagNo == '' ? '' : 'RTLS Tag No*'}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<AccountCircle color={'warning'} />
										</InputAdornment>

									),
									endAdornment: (
										<InputAdornment position="end">
											<AccountCircle color={'warning'} />
										</InputAdornment>
									)
								}}
								name='rtlsTagNo'
								variant="standard"
								className='textfield'
								value={inputValues.rtlsTagNo}
								onChange={(e) => { handleOnChange(e) }}
								onFocus={(e) => { data(e, 'rtlsTagNo') }}
								onBlur={(e) => { data(e, 'rtlsTagNo') }}
								required={rtlsTagNofocus || inputValues.rtlsTagNo != '' ? true : false}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={4} >
							<Uniqueid label={'Unique ID'} required={true} onSubmit={(value) => { handleUniqueidSubmit(value) }} />
						</Grid>
					</Grid>
					<Grid container spacing={2} mt={1}>
						<Grid item xs={12} sm={6} md={4} lg={4}>

							<InputLabel variant="standard" htmlFor="uncontrolled-native" required={true}>
								Status
							</InputLabel>
							<AccountCircle sx={{ margin: '0px -21px -10px 0px' }} color={'warning'} />
							<NativeSelect
								value={inputValues.status}
								inputProps={{
									name: 'status',
									id: 'uncontrolled-native',
								}}
								sx={{ padding: '0px 0px 0px 33px' }}
								className='selectfield'
								onChange={(e) => { handleOnChange(e) }}
								required
							>
								<option value={''}>Select</option>
								<option value={'Available'}>Available</option>
								<option value={'Marked Missing'}>Marked Missing</option>
								<option value={'Needs Service'}>Needs Service</option>
								<option value={'Seen Outside Geofence'}>Seen Outside Geofence</option>
								<option value={'Assigned'}>Assigned</option>
								<option value={'Out for Repairs'}> Out for Repairs</option>

							</NativeSelect>

						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={4}>
							<InputLabel id="demo-row-radio-buttons-group-label" required={true}>Procurement Type</InputLabel>
							<RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label"
								name="procurementType"
								value={inputValues.procurementType}
								onChange={(e) => { handleOnChange(e) }}
							>
								<FormControlLabel value="Purchased" control={<Radio />} label="Purchased" />
								<FormControlLabel value="Rented" control={<Radio />} label="Rented" />
							</RadioGroup>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={4}>

						</Grid>
					</Grid>
				</Stack>
			</Card>
		</Stack>
	)
}

export default InventorySection;