import React, { useEffect, useState } from "react";
import { Button, IconButton, Box, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import './customComponents.scss';


export const QRCodeAlertUI = (props: any) => {
	const QRcodeRef = React.useRef<HTMLElement>(null);

	useEffect(() => {
		if (!QRcodeRef.current) return;
		QRcodeRef.current?.focus();
	}, [QRcodeRef]);

	const [qrValue, setQRValue] = React.useState('');
	return (
		<div className='QRCodeAlert'>
			<TextField
				inputRef={QRcodeRef} variant="standard" value={qrValue}
				onChange={(e) => { setQRValue(e.target.value) }}
				className='QRTextField'
			/><br />
			<div className='QRCodeButton'>
				<Button className="submit-cls" onClick={(e) => props.ClickHandler(qrValue)}>Submit</Button>
			</div>
		</div>
	)
}
export const CompanyTooltip = (props: any) => {
	const { data } = props;
	const Color = data?.company?.color;
	return (
		<div className='Pt-CompanyTooltip'>
			<div style={{ background: Color.includes('#') == false ? `#${Color}` : Color }} className='left-section'></div>
			<div className='right-section'>
				<div className='companyName CT-section'>{data?.company?.name}</div>
				<div className='companyDetails CT-section'>
					<div className='website'>
						<span className='common-icon-website CT-icons' />
						{data?.company?.website ? data?.company?.website : 'No Website'}
					</div>
					<div className='phone'>
						<span className='common-icon-phone CT-icons' />
						{data?.company?.phone ? data?.company?.phone : 'No Phone Number '}
					</div>
				</div>
				<div className='company-trades CT-section'>
					<span className='common-icon-orgconsole-trades CT-icons' />
					{data?.trade?.name}
				</div>
			</div>
		</div>
	)
}