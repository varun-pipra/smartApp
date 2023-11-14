import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import './ScheduleOfValues.scss';
import SUIGrid from 'sui-components/Grid/Grid';
import { ColDef } from 'ag-grid-enterprise';

interface ScheduleProps {

}
const records: any = [
	{
		id: 1,
		count: 2,
		name: 'AT',
		workCOmpletion: '50',
		description: 'of Work Completion,Pay',
		payout: '60',
		payOutAmount: '5850',
		balanceAmount: '2925',
		totalAmount: '9750'
	},
	{
		id: 2,
		count: 3,
		name: 'AT',
		workCOmpletion: '50',
		description: 'of Work Completion,Pay',
		payout: '50',
		payOutAmount: '5850',
		balanceAmount: '925',
		totalAmount: '9750'
	}
]
const records2: any = [
	{
		id: 1,
		count: 1,
		name: 'AT',
		unitQuantity: 50,
		description: 'of Work Completion,Pay',
		payOutAmount: '5000',
		balanceAmount: '18625',
		totalAmount: '23,625'
	},
	{
		id: 1,
		count: 1,
		name: 'AT',
		unitQuantity: 100,
		description: 'of Work Completion,Pay',
		payOutAmount: '15000',
		balanceAmount: '625',
		totalAmount: '23,625'
	},
	{
		id: 1,
		count: 1,
		name: 'AT',
		unitQuantity: 130,
		description: 'of Work Completion,Pay',
		payOutAmount: '3625',
		balanceAmount: '0',
		totalAmount: '23,625'
	},
]
const records3: any = [
	{
		id: 1,
		count: 2,
		name: 'AT',
		workCOmpletion: '50',
		description: 'of Work Completion,Pay',
		payout: '60',
		payOutAmount: '5850',
		balanceAmount: '2925',
		totalAmount: '9750',
		PoNumber: 'P07541'
	},

]
const ScheduleOFValues = (props: ScheduleProps) => {
	const dispatch = useAppDispatch();
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const headers: ColDef[] = [
		{
			headerName: '',
			minWidth: 80,
			cellRenderer: (params: any) => {
				return (
					<div>
						<span className='count'>{params.data.count}</span>
						<span>{params.data.name}</span>
					</div>
				)
			}
		},
		{
			headerName: '% Work Completion',
			minWidth: 200,
			type: "centerAligned",
			cellStyle: { textAlign: 'center' },
			cellRenderer: (params: any) => {

				return (
					<span>{params.data.workCOmpletion} %</span>
				)
			}
		},
		{
			headerName: '',
			minWidth: 200,
			cellRenderer: (params: any) => {
				return (
					<span>{params.data.description}</span>
				)
			}
		},
		{
			headerName: '%Payout',
			minWidth: 120,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<span>{params.data.payout}%</span>
				)
			}
		},
		{
			headerName: 'Payout Amount',
			minWidth: 165,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<span>{currencySymbol}{params.data.payOutAmount}</span>
				)
			}
		},
		{
			headerName: 'Balance Amount',
			minWidth: 165,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<div>
						<span className='balanceAmount'>{currencySymbol}{params.data.balanceAmount}</span>
						<span className='totalAmount'> of {currencySymbol}{params.data.totalAmount}</span>
					</div>
				)
			}
		},
	]
	const headers2: ColDef[] = [
		{
			headerName: '',
			minWidth: 100,
			cellRenderer: (params: any) => {
				return (
					<div>
						<span className='count'>{params.data.count}</span>
						<span>{params.data.name}</span>
					</div>
				)
			}
		},
		{
			headerName: 'Unit Quantity',
			minWidth: 200,
			type: "centerAligned",
			cellStyle: { textAlign: 'center' },
			cellRenderer: (params: any) => {
				return (
					<span>{params?.data?.unitQuantity.toLocaleString("en-US")}</span>
				)
			}
		},
		{
			headerName: '',
			minWidth: 250,
			cellRenderer: (params: any) => {
				return (
					<span>{params.data.description}</span>
				)
			}
		},

		{
			headerName: 'Payout Amount',
			minWidth: 165,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<span>{currencySymbol}{params.data.payOutAmount}</span>
				)
			}
		},
		{
			headerName: 'Balance Amount',
			minWidth: 165,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<div>
						<span className='balanceAmount'>{currencySymbol}{params.data.balanceAmount}</span>
						<span className='totalAmount'> of {currencySymbol}{params.data.totalAmount}</span>
					</div>
				)
			}
		},
	]
	const headers3: ColDef[] = [
		{
			headerName: '',
			minWidth: 80,
			cellRenderer: (params: any) => {
				return (
					<div>
						<span className='count'>{params.data.count}</span>
						<span>{params.data.name}</span>
					</div>
				)
			}
		},
		{
			headerName: '% Work Completion',
			minWidth: 180,
			type: "centerAligned",
			cellStyle: { textAlign: 'center' },
			cellRenderer: (params: any) => {

				return (
					<span>{params.data.workCOmpletion} %</span>
				)
			}
		},
		{
			headerName: '',
			minWidth: 190,
			cellRenderer: (params: any) => {
				return (
					<span>{params.data.description}</span>
				)
			}
		},
		{
			headerName: '%Payout',
			minWidth: 110,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<span>{params.data.payout}%</span>
				)
			}
		},
		{
			headerName: 'Payout Amount',
			field: 'payOutAmount',
			minWidth: 150,
			type: "rightAligned",
			aggFunc: 'sum',
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<span>{currencySymbol}{params.data.payOutAmount}</span>
				)
			}
		},
		{
			headerName: 'Balance Amount',
			minWidth: 150,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<div>
						<span className='balanceAmount'>{currencySymbol}{params.data.balanceAmount}</span>
						<span className='totalAmount'> of {currencySymbol}{params.data.totalAmount}</span>
					</div>
				)
			}
		},
		{
			headerName: 'PO Number',
			minWidth: 150,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				return (
					<span>{params.data.PoNumber}</span>
				)
			}
		},
	]
	const [columns, setColumns] = React.useState<ColDef[]>(headers);
	const [columns2, setColumns2] = React.useState<ColDef[]>(headers2);
	const [columns3, setColumns3] = React.useState<ColDef[]>(headers3);
	return (
		<div className='scheduleOFvalue'>
			<p className='schedule_heading'>Schedule of Values</p>
			<div className='totalrefund_section'>
				<div className='kpi-label'>
					<span>Total Refund Amount</span>
					<span className='common-icon-infoicon' />
				</div>
				<div className='kpi-field-container'>
					<div className='common-icon-Budgetcalculator'></div>
					<span className='kpi-value'>
						{`${currencySymbol}${'31,425.00'}`}
					</span>
				</div>
			</div>
			<div className='grid_heading'>0005 - 02100 - Site Remediation - M - Materials</div>
			<div className='grid_section'>
				<SUIGrid
					headers={columns}
					data={records}
					nowRowsMsg={'<div>Click on Add Transaction Button</div> <div>To add transaction</div>'}
					realTimeDocPrefix="transactions@"

				/>
			</div>
			<div className='grid_heading'>0005 - 02100 - Site Remediation - M - Materials</div>
			<div className='grid_section'>
				<SUIGrid
					headers={columns2}
					data={records2}
					nowRowsMsg={'<div>Click on Add Transaction Button</div> <div>To add transaction</div>'}
					realTimeDocPrefix="transactions@"
					
				/>
			</div>
			{/* <div className='grid_section'>
				<SUIGrid
					headers={columns3}
					data={records3}
					nowRowsMsg={'<div>Click on Add Transaction Button</div> <div>To add transaction</div>'}
					realTimeDocPrefix="transactions@"

				/>
			</div> */}
		</div>
	)
}
export default ScheduleOFValues;