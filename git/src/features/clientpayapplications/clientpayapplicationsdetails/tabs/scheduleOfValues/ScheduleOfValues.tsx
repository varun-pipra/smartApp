import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import './ScheduleOfValues.scss';
import SUIGrid from 'sui-components/Grid/Grid';
import { ColDef } from 'ag-grid-enterprise';
import { getAmountAlignment } from 'utilities/commonutills';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getServer } from 'app/common/appInfoSlice';
import IQButton from 'components/iqbutton/IQButton';
import { Popover } from '@mui/material';
import { getClientContractDetails, setSelectedRecord } from 'features/clientContracts/stores/ClientContractsSlice';
import { addPaymentToPayApp, removePaymentFromPayApp } from 'features/clientpayapplications/stores/BillingSovAPI';
import { getClientPayAppDetailsById } from 'features/clientpayapplications/stores/ClientPayAppsSlice';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

interface ScheduleProps {

}

const ScheduleOFValues = (props: ScheduleProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedRecord } = useAppSelector(state => state.clientPayApps);
	const [openManageSov, setOpenManageSov] = React.useState<any>(false)
	const [selectedRecs, setSelectedRecs] = React.useState<any>([]);
	const [postion, setPosition] = React.useState<any>({ top: null, left: null });
	const [billingSovData, setBillingSovData] = React.useState<any>({});
	const [sovRef, setSovRef] = React.useState<any>(null);


	React.useEffect(() => {
		dispatch(getClientContractDetails({ appInfo: appInfo, contractId: selectedRecord?.contract?.id })).then((data: any) => {
			setBillingSovData(data?.payload?.billingSchedule);
			// setFormData({ ...formData, poNumber: data?.payload?.poNumber });

		})
	}, [selectedRecord?.contract?.id])

	React.useEffect(() => { setSelectedRecs(selectedRecord?.billingSchedule?.payments ? selectedRecord?.billingSchedule?.payments : []) }, [selectedRecord?.billingSchedule])
	console.log('selectedRecord', selectedRecord)
	const headers: ColDef[] = [
		{
			headerName: '',
			minWidth: 70,
			menuTabs: [],
			cellRenderer: (params: any) => {
				return (
					<div>
						<span className="vc-schedule-values_row-count">
							{params.node.rowIndex + 1}
						</span>
						<span>AT</span>
					</div>
				)
			}
		},
		{
			headerName: "",
			minWidth: 175,
			sortable: false,
			cellRenderer: (params: any) => {
				return <div>of Work Completion, Pay</div>;
			},
		},
		{
			headerName: '% Payout',
			minWidth: 100,
			field: 'payoutPercentage',
			type: "rightAligned",
			menuTabs: [],
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<span>{params.data?.payoutPercentage}%</span>
				)
			}
		},
		{
			headerName: 'Payout Amount',
			minWidth: 140,
			field: 'payoutAmount',
			type: "rightAligned",
			menuTabs: [],
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<span>{amountFormatWithSymbol(params.data?.payoutAmount)}</span>
				)
			}
		},
		{
			headerName: 'Balance Amount',
			minWidth: 150,
			field: 'balanceAmount',
			type: "rightAligned",
			menuTabs: [],
			cellRenderer: (params: any) => {
				// console.log("params In cellrender", params)
				return (
					<div>
						<span className='balanceAmount'>{amountFormatWithSymbol(params.data.balanceAmount)}</span>
						<span className='totalAmount'> of {amountFormatWithSymbol(selectedRecord?.contract?.amount)}</span>
					</div>
				)
			}
		},
	];
	const percentColumn = {
		headerName: "% Work Completion",
		field: "completionPercentage",
		cellStyle: { textAlign: "center" },
		minWidth: 170,
		menuTabs: [],
	};
	const uomColumn = {
		headerName: "Unit Quantity",
		field: "completionQuantity",
		cellStyle: { textAlign: "center" },
		minWidth: 160,
		menuTabs: [],
		valueGetter: (params: any) => `${getAmountAlignment(params?.data?.completionQuantity)} ${params?.data?.unitOfMeasure && params?.data?.completionQuantity > 0 ? params?.data?.unitOfMeasure : ''}`
	};
	const dollarAmountColumn = {
		headerName: "Work Stage",
		field: "workStage",
		cellStyle: { textAlign: "left" },
		minWidth: 160,
		menuTabs: [],
	};
	const PaymentStatusColumn = {
		headerName: "Payment Status",
		field: "status",
		minWidth: 225,
		menuTabs: [],
		cellStyle: { textAlign: "center" },
		cellRenderer: (params: any) => {
			const payStatus = params?.data?.status;

			if (payStatus === "Paid") {
				let styleOpts = {
					style: { color: payStatus === "Paid" ? "#008000c2" : "red" },
				};
				return <div {...styleOpts}>{payStatus}</div>;
			} else if (payStatus === "ReadyToBePaid") {
				return (
					<IQButton className="reday-to-paid-btn"
						variant="outlined"
						color="primary"
						onClick={() => {
							onPaymentStatusClick(params?.data);
						}}
						startIcon={<span className="common-icon-add-circle"></span>}
					>
						{"Ready to be Paid"}
					</IQButton>
				);
			} else if (payStatus === "SelectedForPayment") {
				return (
					<IQButton className="selected-btn"
						color="primary"
						onClick={() => {
							onPaymentStatusClick(params.data);
						}}
						startIcon={<span className="common-icon-tickmark"></span>}
					>
						{"Selected For Payment"}
					</IQButton>
				);
			} else {
				return payStatus;
			}
		},
	};
	const [columns, setColumns] = React.useState<ColDef[]>(headers);
	React.useEffect(() => {
		const colDefs = [...headers];
		console.log("workItem", colDefs, headers);
		selectedRecord?.billingSchedule?.type != 'PercentComplete' && colDefs.splice(2, 1);
		colDefs.splice(1, 0, selectedRecord?.billingSchedule?.type == 'PercentComplete' ? percentColumn : selectedRecord?.billingSchedule?.type == 'UnitOfMeasure' ? uomColumn : dollarAmountColumn);
		setColumns([...colDefs])

	}, [selectedRecord?.billingSchedule]);

	useEffect(() => {
		if (sovRef) {
			sovRef?.current?.api.forEachNode((node: any) => {
				if (selectedRecs.length && selectedRecs.findIndex((rec: any) => rec.id === node.data.id) > -1) {
					node.setSelected(true);
				} else {
					node.setSelected(false);
				}
			});
		}
	}, [headers])

	const handleManageSov = (event: React.MouseEvent<HTMLElement>) => {
		// setAnchorEl(event.currentTarget);
		setOpenManageSov(true);
		setPosition({ top: (event?.pageY + 20), left: (event?.pageX - 67) })
	}
	const onPaymentStatusClick = (rec: any) => {
		const isFound = selectedRecs.indexOf(rec);
		console.log("paaa", selectedRecs, rec, isFound)
		if (isFound === -1) {
			selectedRecs.push(rec)
			addPaymentToPayApp(appInfo, { id: rec?.id }, selectedRecord?.id, (response: any) => {
				dispatch(setSelectedRecord(response))
			})
		}
		else {
			selectedRecs.splice(isFound, 1);
			removePaymentFromPayApp(appInfo, selectedRecord?.id, rec?.id, (response: any) => {
				dispatch(getClientPayAppDetailsById({ appInfo: appInfo, id: selectedRecord?.id }))
			})
		}
		setSelectedRecs([...selectedRecs]);
	};
	return (
		<div className='scheduleOFvalue'>
			<p className='schedule_heading'>Billing Schedules</p>
			{['Draft', 'AutoGeneratedWaitingForBothParties']?.includes(selectedRecord?.status) && <IQButton
				className='btn-post-contract'
				style={{ width: 'fit-content', marginBottom: '10px' }}
				onClick={(e: any) => handleManageSov(e)}
				disabled={selectedRecord?.type == 'DownPayment'}
				startIcon={<span className=''></span>}
			>
				Manage Billing Schedule
			</IQButton>
			}
			{
				openManageSov && <Popover
					open={true}
					onClose={() => setOpenManageSov(false)}
					anchorReference="anchorPosition"
					anchorPosition={{ top: postion.top, left: postion.left }}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
					sx={{
						'.MuiPopover-paper': {
							width: '60% !important',
							maxHeight: 250,
						}
					}}
				>
					<div className='sov-popup-grid' style={{ padding: '10px' }}>
						<div className='ScheduleHeading_Section'>
							<span>{"Schedule Of Values "}</span>
							<span className='common-icon-close' onClick={() => setOpenManageSov(false)}></span>
						</div>
						<div className='grid_section' style={{ height: '200px', width: '100%' }}>
							<SUIGrid
								headers={[...columns, PaymentStatusColumn]}
								data={billingSovData?.payments ? billingSovData?.payments : []}
								nowRowsMsg={''}
								realTimeDocPrefix="transactions@"
								getReference={(tabRef: any) => { setSovRef(tabRef) }}
								suppressRowClickSelection={true}
							/>
						</div>
					</div>
				</Popover>

			}
			<div className='grid_section'>
				<SUIGrid
					headers={[...columns]}
					data={selectedRecord?.billingSchedule?.payments ? selectedRecord?.billingSchedule?.payments : []}
					nowRowsMsg={''}
					realTimeDocPrefix="transactions@"
				/>
			</div>
		</div>
	)
}
export default ScheduleOFValues;