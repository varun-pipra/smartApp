import React, {useEffect} from 'react';
import {useAppSelector, useAppDispatch} from 'app/hooks';
import './ScheduleOfValues.scss';
import SUIGrid from 'sui-components/Grid/Grid';
import {ColDef} from 'ag-grid-enterprise';
import {getAmountAlignment} from 'utilities/commonutills';
import IQButton from 'components/iqbutton/IQButton';
import {Popover} from '@mui/material';
import {addPaymentToPayApp, removePaymentFromPayApp} from 'features/vendorpayapplications/stores/SOVAPI';
import {getPayAppDetails, setSelectedRecord} from 'features/vendorpayapplications/stores/VendorPayAppSlice';
import {getServer} from 'app/common/appInfoSlice';
import {getContractDetailsById} from 'features/vendorcontracts/stores/VendorContractsSlice';
import {amountFormatWithSymbol} from 'app/common/userLoginUtils';

interface ScheduleProps {
	readOnly?: boolean;
}

const ScheduleOFValues = (props: ScheduleProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const {currencySymbol} = useAppSelector((state) => state.appInfo);
	const {selectedRecord} = useAppSelector(state => state.vendorPayApps);
	const [openManageSov, setOpenManageSov] = React.useState<any>({});
	const [selectedRecs, setSelectedRecs] = React.useState<any>([]);
	const [sovData, setSovData] = React.useState<any>({});

	const [sovRef, setSovRef] = React.useState<any>(null);
	const [openSOVIndex, setOpenSOVIndex] = React.useState<any>(null);

	React.useEffect(() => {
		const recs: any = [];
		selectedRecord?.scheduleOfValues?.map((obj: any) => {
			console.log("dddd", obj);
			obj?.payments?.map((payment: any) => {
				payment?.status == 'SelectedForPayment' && recs.push(payment);
			});

		});
		setSelectedRecs([...recs]);
	}, [selectedRecord?.scheduleOfValues]);

	React.useEffect(() => {
		console.log("sov righnt", selectedRecord);
		let sovObj = {};
		selectedRecord?.contract && dispatch(getContractDetailsById({appInfo: appInfo, id: selectedRecord?.contract?.id})).then((data: any) => {
			// console.log("getContractDetailsById", data?.payload?.scheduleOfValues)
			data?.payload?.scheduleOfValues?.map((obj: any) => {
				sovObj = {...sovObj, [obj?.budgetItem?.id]: obj};
			});
			// console.log("sov data", sovObj)
			setSovData(sovObj);
		});
	}, [selectedRecord?.contract?.id]);

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
				);
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
				);
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
				);
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
						<span className='balanceAmount'>{amountFormatWithSymbol(params?.data?.balanceAmount)}</span>
						<span className='totalAmount'> of {amountFormatWithSymbol(params?.data?.bidValue)}</span>
					</div>
				);
			}
		},
	];
	const percentColumn = {
		headerName: "% Work Completion",
		field: "completionPercentage",
		cellStyle: {textAlign: "center"},
		minWidth: 170,
		menuTabs: [],
	};
	const uomColumn = {
		headerName: "Unit Quantity",
		field: "completionQuantity",
		cellStyle: {textAlign: "center"},
		minWidth: 160,
		menuTabs: [],
		valueGetter: (params: any) => `${getAmountAlignment(params?.data?.completionQuantity)} ${params?.data?.unitOfMeasure && params?.data?.completionQuantity > 0 ? params?.data?.unitOfMeasure : ''}`
	};
	const dollarAmountColumn = {
		headerName: "Work Stage",
		field: "workStage",
		cellStyle: {textAlign: "left"},
		minWidth: 160,
		menuTabs: [],
	};
	const PaymentStatusColumn = {
		headerName: "Payment Status",
		field: "status",
		minWidth: 225,
		menuTabs: [],
		cellStyle: {textAlign: "center"},
		cellRenderer: (params: any) => {
			const payStatus = params?.data?.status;

			if(payStatus === "Paid") {
				let styleOpts = {
					style: {color: payStatus === "Paid" ? "#008000c2" : "red"},
				};
				return <div {...styleOpts}>{payStatus}</div>;
			} else if(payStatus === "ReadyToBePaid") {
				const buttonStyles = {
					backgroundColor: selectedRecs.includes(params.data) ? "#1976D2" : "",
					color: selectedRecs.includes(params.data) ? "#fff" : "",
				};
				return (
					<IQButton className="reday-to-paid-btn"
						variant="outlined"
						color="primary"
						onClick={() => {
							onPaymentStatusClick(params?.data);
						}}
						// startIcon={<AddCircleOutlineIcon />}
						startIcon={
							selectedRecs.includes(params.data) ? (
								<span className="common-icon-tickmark"></span>
							) : (
								<span className="common-icon-add-circle"></span>
							)
						}
						style={buttonStyles}
					>
						{/* {"Ready to be Paid"} */}
						{selectedRecs.includes(params.data) ? "Selected For Payment" : "Ready To Be Paid"}
					</IQButton>
				);
			} else if(payStatus === "SelectedForPayment") {
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
	const [postion, setPosition] = React.useState<any>({top: null, left: null});
	const handleManageSov = (event: React.MouseEvent<HTMLElement>, index: any, colDefs: any, item: any) => {
		// setAnchorEl(event.currentTarget);
		console.log("itemmm", sovData, item);
		setOpenManageSov({...openManageSov, [index]: {show: true, colDefs: [...colDefs, PaymentStatusColumn], payments: sovData[item?.budgetItem?.id]?.payments}});
		setPosition({top: (event?.pageY + 20), left: (event?.pageX - 67)});
		setOpenSOVIndex(index);
	};
	const onPaymentStatusClick = (rec: any) => {
		const isFound = selectedRecs.indexOf(rec);
		// console.log("paaa", selectedRecs, rec, isFound)
		if(isFound === -1) {
			selectedRecs.push(rec);
			addPaymentToPayApp(appInfo, {id: rec?.id}, selectedRecord?.id, (response: any) => {
				dispatch(setSelectedRecord(response));
			});
		}
		else {
			selectedRecs.splice(isFound, 1);
			removePaymentFromPayApp(appInfo, selectedRecord?.id, rec?.id, (response: any) => {
				dispatch(getPayAppDetails({appInfo: appInfo, id: selectedRecord?.id}));
			});
		}
		setSelectedRecs([...selectedRecs]);
	};

	useEffect(() => {
		if(sovRef) {
			sovRef[openSOVIndex]?.current?.api.forEachNode((node: any) => {
				if(selectedRecs.length && selectedRecs.findIndex((rec: any) => rec.id === node.data.id) > -1) {
					node.setSelected(true);
				} else {
					node.setSelected(false);
				}
			});
		}
	}, [headers]);

	const getPayments = (item: any) => {
		return item?.payments?.map((obj: any) => {
			return {...obj, bidValue: item?.budgetItem?.bidValue};
		});
	};


	// const [columns2, setColumns2] = React.useState<ColDef[]>(headers2);

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
						{amountFormatWithSymbol(selectedRecord?.amount)}
					</span>
				</div>
			</div>
			{
				selectedRecord?.scheduleOfValues?.map((workItem: any, index: any) => {
					const colDefs = [...headers];
					workItem?.type != 'PercentComplete' && colDefs.splice(2, 1);
					colDefs.splice(1, 0, workItem?.type == 'PercentComplete' ? percentColumn : workItem?.type == 'UnitOfMeasure' ? uomColumn : dollarAmountColumn);
					const paymentsList = getPayments(workItem);
					console.log("workItem", colDefs, headers, paymentsList);
					return <>
						<div className='grid_heading'>{workItem?.budgetItem?.name} - {workItem?.budgetItem?.costCode} - {workItem?.budgetItem?.costType}</div>
						{['Draft', 'AutoGeneratedWaitingForBothParties']?.includes(selectedRecord?.status) && <IQButton
							className='btn-post-contract'
							style={{width: 'fit-content', marginBottom: '10px'}}
							onClick={(e: any) => handleManageSov(e, index, colDefs, {...workItem, payments: [...paymentsList]})}
							startIcon={<span className=''></span>}
						>
							Manage SOV
						</IQButton>
						} {
							openManageSov[index]?.show && <Popover
								open={true}
								//                 onClose={() => setOpenManageSov({...openManageSov, [index]: false})}
								anchorReference="anchorPosition"
								anchorPosition={{top: postion.top, left: postion.left}}
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
								<div className='sov-popup-grid' style={{padding: '10px'}}>
									<div className='ScheduleHeading_Section'>
										<span>{"Schedule Of Values "}</span>
										<span className='common-icon-close' onClick={() => setOpenManageSov({...openManageSov, [index]: {...openManageSov[index], show: false}})}></span>
									</div>
									<div className='grid_section' style={{height: '200px', width: '100%'}}>
										<SUIGrid
											headers={[...openManageSov[index]?.colDefs]}
											data={openManageSov[index]?.payments ? openManageSov[index]?.payments : []}
											nowRowsMsg={''}
											realTimeDocPrefix="transactions@"
											getReference={(tabRef: any) => {setSovRef({[index]: tabRef});}}
											suppressRowClickSelection={true}
										/>
									</div>
								</div>
							</Popover>
						}
						<div className='grid_section'>
							<SUIGrid
								headers={[...colDefs]}
								data={paymentsList}
								nowRowsMsg={''}
								realTimeDocPrefix="transactions@"
							/>
						</div>
					</>;
				})
			}
		</div>
	);
};
export default ScheduleOFValues;