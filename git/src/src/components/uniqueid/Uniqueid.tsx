import react, { useState, useEffect } from 'react';
import QrCodeIcon from '@mui/icons-material/QrCode';
//import PrintIcon from '@mui/icons-material/Print';
import './Uniqueid.scss';

import { InputLabel, Input, Checkbox } from '@mui/material';
import { Stack, Box, IconButton, Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import SmartDialog from 'components/smartdialog/SmartDialog'
export interface UniqueidProps {
	label?: string,
	required?: boolean
	url?: string;
	onSubmit?: (value: any) => void
};

const Uniqueid = ({ label, required = false, url, onSubmit }: UniqueidProps) => {
	const qrUrl = "";
	// const qrUrl = "https://betaimg.smartappbeta.com/barcode/generatebarcode?bfrmt=QR&val=2222222&w=240&h=243";
	const [showModel, setShowModel] = useState(false);
	const [uniqueInput, setUniqueInput] = useState('');
	const [checked, setChecked] = useState();

	const onChangeEvent = (e: any) => {
		const { checked } = e.target;
		setChecked(checked);
		if (checked == true) {
			setShowModel(true)
		}
		else {
			setShowModel(false)
			setUniqueInput('');

		};
	}

	const submit = () => {
		setShowModel(false);
		if (onSubmit) onSubmit(uniqueInput)
	}
	useEffect(() => {
		if (onSubmit) onSubmit(uniqueInput)
	}, [uniqueInput])
	return (
		<>
			<Stack direction="column" className="iq-uniqueid-field" data-testid="uniqueId">
				{label && <Stack direction="row" className="label-container">
					<QrCodeIcon />
					<InputLabel variant="standard" required={required ? true : false} sx={{ fontSize: '16px', margin: '6px 0px 0px 0px' }}>{label}</InputLabel>
				</Stack>
				}
				<Stack direction="row" className="qr-container">
					<FormControlLabel
						className="override-checkbox"
						value="end"
						control={<Checkbox onChange={(e) => { onChangeEvent(e) }} checked={checked} required={required ? true : false} />}
						label={'Override Value?'}
						labelPlacement="end"
					/>
					{url && checked && uniqueInput ? <Box className="qr-code-img" component="img" alt="QR Code" src={url} /> : <Box className="qr-code-img" component="span" />}
					<IconButton className="print-button">
						<span className="common-icon-print"></span>
					</IconButton>
				</Stack>
			</Stack>
			{showModel &&
				<SmartDialog className={'barcode-model'} open={showModel} PaperProps={{
					sx: { height: '20%', width: '20%', minWidth: '25%', minHeight: '30%' },

				}}
					custom={{
						closable: true,
						resizable: false,
						title: 'Acquire Barcode',
					}}>
					<Stack direction="column" className="barcode-container">
						<Input onChange={(e) => { setUniqueInput(e.target.value) }} value={uniqueInput} />
						<Box mt={3} display="flex" justifyContent="end" alignItems="end" >
							<Button variant="contained" color="primary" sx={{ height: 40 }} onClick={() => submit()}>Submit</Button>
						</Box>
					</Stack>
				</SmartDialog>
			}
		</>
	);
}

export default Uniqueid;