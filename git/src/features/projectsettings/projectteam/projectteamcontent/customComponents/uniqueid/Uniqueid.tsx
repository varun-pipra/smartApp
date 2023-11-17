import react, { useState, useEffect } from 'react';
import QrCodeIcon from '@mui/icons-material/QrCode';
//import PrintIcon from '@mui/icons-material/Print';
import './Uniqueid.scss';
import SUIAlert from 'sui-components/Alert/Alert';
import { InputLabel, Input, Checkbox, TextField } from '@mui/material';
import { Stack, Box, IconButton, Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import SmartDialog from 'components/smartdialog/SmartDialog'
export interface UniqueidProps {
	label?: string,
	required?: boolean
	url?: string;
	urlLabel?: string;
	onSubmit?: (value: any) => void;
	modelsx?: any;
	labelIcon?: boolean;
	printSumbmit?: any;
	checkbox?: any;
};

const Uniqueid = ({ label, required = false, url, urlLabel, onSubmit, modelsx, labelIcon = true, printSumbmit, checkbox }: UniqueidProps) => {

	const [showModel, setShowModel] = useState(false);
	const [uniqueInput, setUniqueInput] = useState('');
	const [checked, setChecked] = useState<any>();
	const [iQUrl, setIQUrl] = useState<any>();
	const [iQLable, setIQLable] = useState<any>();
	const [changedOn, setChangedOn] = useState<any>();

	useEffect(() => {
		setIQUrl(url)
		setIQLable(urlLabel)
	}, [url, urlLabel, changedOn])

	const onChangeEvent = (e: any) => {
		const { checked } = e.target;
		checkbox(checked, urlLabel)
		setChecked(checked);
		if (checked == true) {
			setShowModel(true)
		}
		else {
			setUniqueInput('')
			setShowModel(false);
			if (onSubmit) onSubmit(uniqueInput)
			setIQUrl('')
			setIQLable('')
			setChangedOn(new Date());
		};
	}

	const submit = () => {
		setShowModel(false);
		setUniqueInput('')
		if (onSubmit) onSubmit(uniqueInput)
	}

	return (
		<>
			<Stack direction="column" className="pt-iq-uniqueid-field" data-testid="uniqueId">
				{label && <Stack direction="row" className="label-container">
					{labelIcon && <QrCodeIcon />}
					<InputLabel variant="standard" required={required ? true : false} sx={{ fontSize: '16px', margin: '6px 0px 0px 0px' }}>{label}</InputLabel>
				</Stack>
				}
				<Stack direction="column" className="qr-container">
					<Stack direction="row" justifyContent="space-between" alignItems="center">

						<Stack direction="row" justifyContent="space-between" alignItems="center" className='QR-image-section'>
							{iQUrl && iQLable &&
								<>
									<Box className="qr-code-img" component="img" alt="QR Code" src={iQUrl} />
									<span>{iQLable}</span>
								</>
							}
						</Stack>

						<IconButton className="print-button" onClick={() => { printSumbmit() }}>
							<span className="common-icon-print"></span>
						</IconButton>
					</Stack>
					<FormControlLabel
						className="override-checkbox"
						value="end"
						control={<Checkbox onChange={(e) => { onChangeEvent(e) }} checked={checked} required={required ? true : false} />}
						label={'Override Value?'}
						labelPlacement="end"
					/>
				</Stack>
			</Stack>

			{showModel &&
				<SUIAlert
					open={showModel}
					contentText={
						<div className="barcode-container">
							<TextField variant="standard" onChange={(e) => { setUniqueInput(e.target.value) }} value={uniqueInput} style={{ width: '100%' }} /><br />
							<Box mt={3} display="flex" justifyContent="end" alignItems="end" >
								<Button variant="contained" color="primary" sx={{ height: 40 }} onClick={() => submit()}>Submit</Button>
							</Box>
						</div>
					}
					title={'Acquire Barcode'}
					showActions={false}
					DailogClose={true}
					onAction={(e: any, type: any) => {
						checkbox(false, urlLabel);
					}}
				/>

			}
		</>
	);
}

export default Uniqueid;