import { Avatar, Box, Card, TextField } from "@mui/material";
import DynamicTooltip from "sui-components/DynamicTooltip/DynamicTooltip";
import SUIGrid from "sui-components/Grid/Grid";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import { formatDate, getDate } from "utilities/datetime/DateTimeUtils";

import './ContractorResponse.scss';
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import React from "react";

interface ContractorResponseProps {
	responseType: number;
	contractorName?: string;
	respondedOn?: any;
	reason?: any;
	sign?: any;
	thumbNailImg?: any;
	text?: any;
}

const getName = (type: number) => {
	return type == 0 ? 'Contract Reviewed & Declined By' : type == 1 ? 'Contract Revised & Resubmitted by' : type == 2 ? 'Contract Signed & Accepted by' : 'Pay Application Rejected by'
}

const ContractorResponseTooltip = (props: any) => {
	//   const signaturePadRef = useRef<any>();  

	//   React.useEffect(() => {
	//     if (props?.sign && props?.type == 2) {
	//         console.log("sign", props?.sign)
	//         signaturePadRef.current.fromData(props?.sign);
	//   }}, [props?.sign])

	return (
		<div className='bidPackage_tooltip_content'>
			<label className='bidPackage_tooltip_label'>{props?.headerText ? props?.headerText : getName(props?.type)}</label>
			<div className='bidPackage_tooltip_grid' style={{ height: 200, width: 310 }}>
				<div className='tooltip-thumb-wrap'>
					<Box className='tooltip-thumbnail' component="img"
						src={props?.thumbNail} />
					<span className='tooltip-name'>{props?.name}</span>
				</div>
				<span className='tooltip-sign'>{props?.type == 0 ? 'Reason' : props?.type == 1 ? "Reason for sending back the contract" : props?.type == 2 ? "Signature" : "Reason For Rejecting The Pay Application"}</span>
				{props?.type == 0 || props?.type == 1 || props?.type == 3 ? <Card style={{ height: 130, width: 310 }}><TextField
							id="description"
							variant='outlined'
							InputProps={{
								readOnly: true
							}}
							fullWidth
							multiline
							minRows={2}
							maxRows={10}
							placeholder='Enter Reason for Declining the Contract'
							name='reason'
							value={props?.reason}
						/></Card> :

					<Card style={{ height: 100, width: 310 }}><img src={props?.sign} /></Card>}
				{
					props?.type == 2 && <span className='tooltip-signedon'>{`Signed On ${formatDate(props?.respondedOn)}`}</span>
				}
			</div>
		</div>
	)
}

export const ContractorResponse = (props: ContractorResponseProps) => {
	console.log("props ContractorResponse", props)
	return (
		<div className='contract-footer-class'>
			<DynamicTooltip
				title={<ContractorResponseTooltip headerText={props?.text} type={props?.responseType} respondedOn={props?.respondedOn} name={props?.contractorName} reason={props?.reason} sign={props?.sign} thumbNail={props?.thumbNailImg} />}
				placement="top"
				sx={{
					"& .MuiTooltip-tooltip": {
						background: '#333333'
					}
				}}
			>
				<div className='contract-footer-wrap'>
					<div className='left'>
						<span className={props?.responseType == 0 ? 'common-icon-reviewed-decline' : props?.responseType == 1 ? 'common-icon-resubmitted' : props?.responseType == 2 ? 'common-icon-contracts' : 'common-icon-reviewed-decline'}
							style={{ backgroundColor: props?.responseType == 0 ? '#850a0a' : props?.responseType == 1 ? '#a5490d' : props?.responseType == 2 ? '#3c8435' : 'red', color: 'white' }}></span>
					</div>
					<div className='right'>
						<span className='label'>{props?.text ? props?.text : getName(props?.responseType)}</span>
						<span className='label1'>{`${props?.contractorName}, ${formatDate(props?.respondedOn)}`}</span>
					</div>
				</div>
			</DynamicTooltip>
		</div>)
}