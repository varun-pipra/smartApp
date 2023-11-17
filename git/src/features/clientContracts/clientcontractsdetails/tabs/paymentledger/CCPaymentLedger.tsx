import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Box, Button } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import './CCPaymentLedger.scss';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import SUIGrid from 'sui-components/Grid/Grid';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { getCCPaymentLedgerList } from 'features/clientContracts/stores/PaymentLedgerSlice';
import { getServer } from "app/common/appInfoSlice";
import { getMinMaxDrawerStatus, setMinMaxDrawerStatus } from 'features/clientContracts/stores/ClientContractsSlice';
import { vendorPayAppsPaymentStatus, vendorPayAppsPaymentStatusFilterOptions, vendorPayStatus } from 'utilities/vendorPayApps/enums';
import IQButton from 'components/iqbutton/IQButton';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import { CustomGroupHeader } from 'features/bidmanager/bidmanagercontent/bidmanagergrid/BidManagerGrid';
import { amountFormatWithSymbol, amountFormatWithOutSymbol } from 'app/common/userLoginUtils';
import { isUserGCForCC } from 'features/clientContracts/utils';
var tinycolor = require('tinycolor2');

const CCPaymentLedger = (props: any) => {
	const dispatch = useAppDispatch();
	const [data, setData] = useState<Array<any>>([]);
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const { selectedRecord } = useAppSelector(state => state.clientContracts);
	const appInfo = useAppSelector(getServer);
	const { paymentLedgerList } = useAppSelector((state) => state.cCPaymentLedger);
	const [rowdata, setRowData] = useState([]);
	const minMaxStatus: any = useAppSelector(getMinMaxDrawerStatus);
	const [filteredRecords, setFilteredRecords] = React.useState<any>([]);
	const [searchText, setSearchText] = React.useState<any>('');


	const groupKeyValue = React.useRef<any>(null);

	const groupOptions = [
		{ text: "Payment Status", value: "status" },
	];

	const filterOptions = [
		{
			text: "Payment Status",
			value: "status",
			key: "status",
			// iconCls: "common-icon-name-id",
			children: {
				type: "checkbox",
				items: vendorPayAppsPaymentStatusFilterOptions
			},
		},
	];

	const [filters, setFilters] = React.useState<any>(filterOptions);

	React.useEffect(() => {
		dispatch(getCCPaymentLedgerList({ appInfo: appInfo, id: selectedRecord?.id }));
	}, [selectedRecord]);

	React.useEffect(() => {
		setRowData(paymentLedgerList);
	}, [paymentLedgerList]);

	const headers: any = [
		{
			headerName: 'Pay ID',
			field: 'code',
			maxWidth: 120,
			pinned: 'left',
			cellRenderer: (params: any) => {
				return (
				  <>
					<span
					  className="ag-costcodegroup"
					  style={{
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
						overflow: "hidden",
						color: "#059CDF",
					  }}
					>
					  <span
						className="hot-link"
						onClick={() => {
						  window.open(
							`${appInfo?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/client-pay-applications/home?id=${params?.data?.id}#react`,
							"_blank"
						  );
						}}
					  >
						{params.data?.code}
					  </span>
					</span>
				  </>
				);
			  },
		},
		{
			headerName: 'Status',
			field: 'status',
			minWidth: 320,
			pinned: 'left',
			cellRenderer: (params: any) => {
				const status = params?.data?.status;
				const stateConstant = vendorPayStatus[status];
				const stageIndicator = <IQTooltip title={status?.length > 11 ? status : ''}>
					<Button disabled
						className='payment-status'
						variant='contained'
						style={{
							backgroundColor: stateConstant?.color,
							color: tinycolor(stateConstant?.color).isDark() ? 'white' : 'black',
						}}><span className={`payment-status-icon ${stateConstant?.icon}`}></span>{stateConstant?.text}</Button>
				</IQTooltip>;
				return stageIndicator;
			}
		},
		{
			headerName: 'Budget Amount',
			field: 'budgetAmount',
			maxWidth: 140,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				if (!params.node.footer) {
					return (
						<div className='right-align'>
							{amountFormatWithSymbol(params?.value)}
						</div>
					)
				}
			},
			// valueGetter: (params: any) => {
			// 	if (params.node.group && !params.node.footer) {
			// 		const groupKey = params.node.key;
			// 		const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;
			// 		return (currentRecord?.budgetAmount || 0);
			// 	}
			// }
		}, {
			headerName: 'Client Company',
			field: 'client.name',
			suppressMenu: true
		}, {
			headerName: 'Invoice Amount',
			field: 'invoiceAmount',
			suppressMenu: true,
			maxWidth: 145,
			aggFunc: 'sum',
			cellRenderer: (params: any) => {
				if (params.node.footer || params.node.level > 0 || !params.node.expanded) {
					return <div className='right-align'>
						{amountFormatWithSymbol(params?.value)}
					</div>
				}
			}
		}, {
			headerName: 'Pay Application Amount',
			field: 'amount',
			suppressMenu: true,
			minWidth: 200,
			aggFunc: 'sum',
			cellRenderer: (params: any) => {
				if (params.node.footer || params.node.level > 0 || !params.node.expanded) {
					return <div className='right-align'>
						{amountFormatWithSymbol(params?.value)}
					</div>
				}
			}
		}, {
			headerName: 'Balance Amount',
			field: 'balanceAmount',
			suppressMenu: true,
			maxWidth: 145,
			cellRenderer: (params: any) => {
				if (params.node.footer || params.node.level > 0 || !params.node.expanded)
					return <div className='right-align'>
						{amountFormatWithSymbol(params?.value)}
					</div>
			}
		}, {
			headerName: 'Invoice Date',
			field: 'invoiceDate',
			suppressMenu: true,
			maxWidth: 150,
			cellRenderer: (params: any) => {
				return params.value ? formatDate(params.value, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
			}
		}, {
			headerName: 'PO Number',
			field: 'poNumber',
			maxWidth: 130,
			suppressMenu: true
		}, {
			headerName: 'Invoice',
			field: 'invoiceUrl',
			maxWidth: 100,
			suppressMenu: true,
			cellRenderer: (params: any) => {
				return params.value ? <div
					className='center-align'
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<span className='common-icon-pdf' style={{
						color: '#d16d6c',
						fontSize: '1.25em',
						cursor: 'pointer'
					}}></span>
				</div> : '';
			}
		}
	];
	const [columns, setColumns] = React.useState<any>(headers);


	const autoGroupColumnDef: ColDef = useMemo<ColDef>(() => {
		return {
			headerName: 'Pay ID',
			field: 'budgetLineItem',
			pinned: 'left',
			minWidth: 500,
			rowGroup: true,
			resizable: true,
			suppressRowClickSelection: true,
			cellRenderer: 'agGroupCellRenderer',
			suppressMenu: true,
			cellRendererParams: {
				innerRenderer: (cell: any) => {
					if (!cell.data) {
						const isFooter = cell?.node?.footer;
						const isRootLevel = cell?.node?.level === -1;
						if (isFooter) {
							if (isRootLevel) {
								return 'Summary';
							}
							return `Subtotal`;
						} else {
							return `${cell?.value}`;
						}
					}
					if (cell.node.group) {
						return <div className='bold-font'>{cell.value}</div>;
					} else {
						const { status } = cell.data;
						const stateConstant = vendorPayStatus[(status)];
						const stageIndicator = <IQTooltip title={status.length > 11 ? status : ''}>
							<Button disabled
								className='payment-status'
								variant='contained'
								style={{
									backgroundColor: stateConstant?.color,
									color: tinycolor(cell.data?.stageColor).isDark() ? 'white' : 'black',
								}}><span style={{ marginRight: '5px' }} className={`payment-status-icon ${stateConstant?.icon}`}></span>{stateConstant?.text}</Button>
						</IQTooltip>;
						return <div className='vertical-center-align'>
							<span style={{ paddingRight: '5em' }}>{cell.value}</span>{stageIndicator}
						</div>;
					}
				}
			},
			valueGetter: (cell: any) => {
				if (cell.node.group) {
					return cell.data?.budgetLineItem || '';
				} else return cell.data?.code || '';
			}
		};
	}, []);

	const maximizeIcon = useMemo<React.ReactElement>(() => {
		return <div className='common-icon-maximise' style={{ fontSize: '1.25rem' }}></div>;
	}, []);
	const onMaximizeTransactions = () => {
		dispatch(setMinMaxDrawerStatus({ minMax: true, forecast: false, transactions: false, paymentLedger: true }));
	};


	const handleGroupChange = (groupKey: any) => {
		const columnsCopy = [...columns];
		console.log("activeMainGridGroupKey", groupKey, columnsCopy);
		if (((groupKey ?? false) && groupKey !== "")) {
			// setGroupKey(activeMainGridGroupKey);
			groupKeyValue.current = groupKey;
			columnsCopy.forEach((col: any) => {
				col.rowGroup = groupKey ? groupKey === col.field : false;
				setColumns(columnsCopy);
			});
		} else if (groupKey ?? true) {
			groupKeyValue.current = null;
			columnsCopy.forEach((col: any) => {
				console.log("status", col?.rowGroup);
				col.rowGroup = false;
			});
			console.log("else group key", columnsCopy);
			setColumns(columnsCopy);
		};
	};

	const handleOnSearchChange = (text: any) => {
		if (paymentLedgerList?.length && text && text !== ' ') {
			setSearchText(text);
			const filteredIds = filteredRecords?.map((obj: any) => obj?.id);
			const firstResult = paymentLedgerList.filter((obj: any) => {
				return filteredIds?.includes(obj?.id) && JSON.stringify(obj).toLowerCase().includes(text.toLowerCase());
			});
			setRowData(firstResult);
		} else {
			setRowData(filteredRecords);
		}
	};
	const handleFilterChange = (filters: any) => {
		let filteredData: any = [...paymentLedgerList];
		console.log("handleFilterChange", filters, filteredData);
		if (filters?.status?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return filters?.status?.includes(rec?.status);
			});
		}
		setRowData(filteredData);
		setFilteredRecords(filteredData);
	};

	const GroupRowInnerRenderer = (props: any) => {
		const node = props.node;
		if (node.group) {
			const colName = groupKeyValue?.current;
			console.log("cellerender", colName, node?.group);
			const data = node?.childrenAfterGroup?.[0]?.data || {};
			if (colName === "status") {
				return (
					<div style={{ display: 'flex' }}>
						<CustomGroupHeader iconCls={'common-icon-orgconsole-safety-policies'} baseCustomLine={false}
							label={vendorPayAppsPaymentStatus[data?.status]} colName={colName}
						/>
					</div>
				);
			}

		};
	};

	const groupRowRendererParams = useMemo(() => {
		return {
			checkbox: true,
			suppressCount: false,
			suppressGroupRowsSticky: true,
			innerRenderer: GroupRowInnerRenderer
		};
	}, []);

	const getContingencies = () => {
		if (selectedRecord?.contingencyPercentage && selectedRecord?.contingencyPercentage > 0) return selectedRecord?.contingencyPercentage + '%';
		if (selectedRecord?.contingencyAmount && selectedRecord?.contingencyAmount > 0) return amountFormatWithOutSymbol(selectedRecord?.contingencyAmount);
	};

	const getFee = () => {
		if (selectedRecord?.feePercentage && selectedRecord?.feePercentage > 0) return selectedRecord?.feePercentage + '%';
		if (selectedRecord?.feeAmount && selectedRecord?.feeAmount > 0) return amountFormatWithOutSymbol(selectedRecord?.feeAmount);
	};

	return <Box className='cc-payment-ledger'>
		<div className='header'>
			<div className='title-action'>
				<span className='title'>Payment Ledger</span>
				{!minMaxStatus.minMax && (<span style={{ cursor: 'pointer' }} onClick={onMaximizeTransactions}> {maximizeIcon}</span>)}
			</div>
			<div className='kpi-fields'>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>
						Contingencies
						<IQTooltip title={'The contingnency amount allocated for the contract.'} arrow={true}>
							<span className='common-icon-infoicon'></span>
						</IQTooltip>
					</div>
					<div className='kpi-field-container'>
						<span className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></span>
						<span className='kpi-value'>
							{currencySymbol} {selectedRecord?.addContingencies ? getContingencies() : 0.00}
						</span>
					</div>
				</span>
				{isUserGCForCC(appInfo) && <span className='kpi-item-tile'>
					<div className='kpi-label'>
						Fee
						<IQTooltip title={'This is the fee defined for the contract.'} arrow={true}>
							<span className='common-icon-infoicon'></span>
						</IQTooltip>
					</div>
					<div className='kpi-field-container'>
						<span className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></span>
						<span className='kpi-value'>
							{/* {`${selectedRecord?.feePercentage ? selectedRecord?.feePercentage : ''} %`} */}
							{currencySymbol} {selectedRecord?.addFee ? getFee() : 0.00}
						</span>
					</div>
				</span> }
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Down Payment
						<IQTooltip title={'This is the down payment for the contract..'} arrow={true}>
							<span className='common-icon-infoicon'></span>
						</IQTooltip>
					</div>
					<div className='kpi-field-container'>
						<span className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></span>
						<span className='kpi-value'>
							{amountFormatWithSymbol(selectedRecord?.downPaymentAmount)}
						</span>
					</div>
				</span>
				<span className='kpi-item-tile'>
					<div className='kpi-label'>Total Amount Paid
						<span className='common-icon-infoicon'></span>
					</div>
					<div className='kpi-field-container'>
						<span className='common-icon-Budgetcalculator' style={{ fontSize: '1.25rem' }}></span>
						<span className='kpi-value'>
							{amountFormatWithSymbol(selectedRecord?.totalPaidToDate)}
						</span>
					</div>
				</span>

			</div>
		</div>
		<div className='search-action'>
			{/* <IQButton color='blue'>
				+ Create Pay Application
			</IQButton> */}
			<IQSearch sx={{ height: '2em', width: '16rem' }}
				groups={groupOptions}
				filters={filters}
				onSearchChange={(text: string) => handleOnSearchChange(text)}
				onFilterChange={(filters: any) => handleFilterChange(filters)}
				onGroupChange={(groupKey: any) => handleGroupChange(groupKey)}

			/>
		</div>
		<div className='cc-payment-ledger-list'>
			<SUIGrid
				headers={columns}
				data={rowdata ? rowdata : []}
				getRowId={(params: any) => params.data.id}
				grouped={true}
				//groupIncludeTotalFooter={false}
				groupIncludeFooter={false}
				nowRowsMsg={'<div>Click on Add Transaction Button</div> <div>To add transaction</div>'}
				// realTimeDocPrefix="transactions@"
				// autoGroupColumnDef={autoGroupColumnDef}
				groupDisplayType={'groupRows'}
				groupRowRendererParams={groupRowRendererParams}
			/>
		</div>
	</Box>;
};

export default CCPaymentLedger;