import { Avatar, AvatarSize } from '@ui5/webcomponents-react';
import { ColDef } from 'ag-grid-enterprise';
import React, { useEffect, useMemo, useState } from 'react';

import './VCTransactionGrid.scss';

import { getCurrencySymbol, getServer } from 'app/common/appInfoSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { postMessage } from 'app/utils';
import { fetchTransactions, getModifiedTransactions } from 'features/vendorcontracts/stores/tabs/transactions/TransactionTabSlice';
import SUIGrid from 'sui-components/Grid/Grid';
import { formatDate } from 'utilities/datetime/DateTimeUtils';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

interface TransactionGridProps {
	groupAndFilterData?: any;
};

const VCTransactionGrid = ({ groupAndFilterData }: TransactionGridProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const currency = useAppSelector(getCurrencySymbol);
	const records = useAppSelector(getModifiedTransactions);
	const { selectedRecord } = useAppSelector(state => state.vendorContracts);
	const [selectedId, setSelectedId] = useState<any>();

	useEffect(() => {
		setSelectedId(selectedRecord?.id);
	}, [selectedRecord]);

	useEffect(() => {
		if (selectedId)
			dispatch(fetchTransactions({ 'appInfo': appInfo, contractId: selectedId }));
	}, [selectedId]);

	useEffect(() => {
		let updatedColumns: any = [...columns].map((rec: any) => {
			if (groupAndFilterData.group != 'None') {
				return {
					...rec,
					rowGroup: rec.field === groupAndFilterData.group,
					pinned: rec.field === groupAndFilterData.group ? 'left' : '',
					hide: rec.field === groupAndFilterData.group || rec.field == 'name' ? true : false,
				};
			} else if (groupAndFilterData.group == 'None') {
				return {
					...rec,
					rowGroup: false,
					hide: rec.field === "budgetItem.budgetAmount" ? true : false
				};
			} else {
				return { ...rec, };
			}
		});
		setColumns(updatedColumns);
	}, [groupAndFilterData]);

	const onRowClick = (e: any, index: number) => {
		const selectedRowData: any = records[index];
		if (selectedRowData.smartItemId !== null) {
			postMessage({ event: 'openitem', body: { smartItemId: selectedRowData.smartItemId } });
		}
	};

	const headers: ColDef[] = [
		{
			headerName: 'Item Name',
			field: 'name',
			pinned: 'left',
			hide: true,
			rowGroup: true
		},
		{
			headerName: 'Budget Line Item',
			field: 'budgetLineItem',
			pinned: 'left',
			menuTabs: [],
			hide: true,
			rowGroup: false,
			cellRenderer: (params: any) => {
				if (!params.data) {
					const isFooter = params?.node?.footer;
					const isRootLevel = params?.node?.level === -1;
					if (isFooter) {
						if (isRootLevel) {
							return <span style={{ fontWeight: 'bold' }}>Summary</span>;
						}
					} else {
						return `${params?.value}`;
					}
				}
				else {
					return params.value;
				}
			},
		},
		{
			headerName: 'Budget Amount',
			field: 'budgetItem.budgetAmount',
			maxWidth: 140,
			menuTabs: [],
			cellRenderer: (params: any) => {
				return (params.node.group && !params.node.footer) ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const groupKey = params.node.key;
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;

					return (currentRecord?.budgetItem?.budgetAmount || 0);
				}
			}
		}, {
			headerName: 'Transaction Amount',
			field: 'transactionAmount',
			menuTabs: [],
			maxWidth: 172,
			aggFunc: 'sum',
			type: 'rightAligned',
			cellRenderer: (params: any) => {
				if (params.node.footer || params.node.level > 0 || !params.node.expanded)
					return <div className='right-align'>
						{amountFormatWithSymbol(params.value)}
					</div>;
			}
		}, {
			headerName: 'Remaining Balance',
			field: 'balance',
			menuTabs: [],
			maxWidth: 165,
			cellRenderer: (params: any) => {
				return (!params.node.group && !params.node.footer) ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			}
		}, {
			headerName: 'Actual Start Date',
			field: 'actualStartDate',
			menuTabs: [],
			cellRenderer: (params: any) => {
				return params.value ? formatDate(params.value, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
			}
		}, {
			headerName: 'Actual End Date',
			field: 'actualEndDate',
			menuTabs: [],
			cellRenderer: (params: any) => {
				return params.value ? formatDate(params.value, { year: 'numeric', month: '2-digit', day: '2-digit' }) : '';
			}
		}, {
			headerName: 'Unit of Measure',
			field: 'budgetItem.unitOfMeasure',
			menuTabs: [],
			maxWidth: 150,
			cellRenderer: (params: any) => {
				return <div className='center-align'>
					{(params.value || '')}
				</div>;
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const groupKey = params.node.key;
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;

					return (currentRecord?.budgetItem?.unitOfMeasure || '');
				} else return params?.data?.budgetItem?.unitOfMeasure || '';
			}
		}, {
			headerName: 'Unit Cost',
			field: 'budgetItem.unitCost',
			menuTabs: [],
			maxWidth: 98,
			cellRenderer: (params: any) => {
				return !params.node.footer ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const groupKey = params.node.key;
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;

					return (currentRecord?.budgetItem?.unitCost || 0);
				} else return (params?.data?.budgetItem?.unitCost || 0);
			}
		}, {
			headerName: 'Est. UOM QTY',
			field: 'estimatedQuantity',
			menuTabs: [],
			maxWidth: 130,
			aggFunc: 'sum',
			cellRenderer: (params: any) => {
				return (!params.node.footer) ? <div className='right-align'>
					{(params.value ? params?.value : 0)?.toLocaleString('en-US')}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;
					return (currentRecord?.budgetItem?.quantity || 0);
				} else return (params?.data?.estimatedQuantity || 0);
			},
			// cellRenderer: (params: any) => {
			// 	return !params.node.footer ? <div className='right-align'>
			// 		{(params.value ? params.value : 0)}
			// 	</div> : '';
			// },
			// valueGetter: (params: any) => {
			// 	console.log("params", params)
			// 	if (params.node.group && !params.node.footer) {
			// 	console.log("group", params)					
			// 		return (params?.data?.budgetItem?.quantity || 0);
			// 	} else return (params?.data?.estimatedQuantity || 0);
			// }
		}, {
			headerName: 'Est. Amount',
			field: 'estimatedAmount',
			menuTabs: [],
			maxWidth: 120,
			aggFunc: 'sum',
			cellRenderer: (params: any) => {
				return (!params.node.footer) ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.group && !params.node.footer) {
					const currentRecord = params?.node?.childrenAfterGroup?.[0]?.data;
					return (currentRecord?.budgetItem?.budgetAmount || 0);
				} else return (params?.data?.estimatedAmount || 0);
			},

		}, {
			headerName: 'Actual UOM QTY',
			field: 'actualQuantity',
			menuTabs: [],
			maxWidth: 150,
			aggFunc: 'sum',
			type: 'rightAligned',
			cellRenderer: (params: any) => {
				return (params.node.leafGroup && params.node.footer) || !params.node.group ? <div className='right-align'>
					{(params.value ? params.value : 0)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.leafGroup && !params.node.footer) {
					return (params.node.aggData?.actualQuantity || 0);
				} else return (params?.data?.actualQuantity || 0);
			}
		}, {
			headerName: 'Actual Amount',
			field: 'actualCost',
			menuTabs: [],
			maxWidth: 135,
			aggFunc: 'sum',
			type: 'rightAligned',
			cellRenderer: (params: any) => {
				return (params.node.leafGroup && params.node.footer) || !params.node.group ? <div className='right-align'>
					{amountFormatWithSymbol(params.value)}
				</div> : '';
			},
			valueGetter: (params: any) => {
				if (params.node.leafGroup && !params.node.footer) {
					return (params.node.aggData?.actualCost || 0);
				} else return (params?.data?.actualCost || 0);
			}
		}
	];

	const [columns, setColumns] = React.useState<ColDef[]>(headers);

	const autoGroupColumnDef: ColDef = useMemo<ColDef>(() => {
		return {
			headerName: 'Item Name',
			field: 'budgetLineItem',
			pinned: 'left',
			minWidth: 400,
			rowGroup: true,
			resizable: true,
			suppressRowClickSelection: true,
			cellRenderer: 'agGroupCellRenderer',
			onCellClicked: (cell: any) => {
				// console.log('cell', cell);
				const { smartapp, id } = cell.data;
				if (id) {
					postMessage({ event: 'openitem', body: { smartItemId: id } });
				}
			},
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
						const { name, board, smartapp } = cell.data;
						const initials = name?.split('-')[0];

						const image = smartapp.id ? <img src={`${appInfo?.hostUrl}/EnterpriseDesktop/Dashboard/Shortcut.mvc/GetAppThumbnailUrl?appId=${smartapp.id}&size=2&sessionId=${appInfo?.sessionId}`} style={{ height: '24px', width: '24px' }} /> :
							<Avatar colorScheme={'Accent10'} initials={initials} size={AvatarSize.XS}></Avatar>;

						return <div className='blue-color mouse-pointer vertical-center-align'>
							{/* <span style={{ fontSize: '1.5em' }} className='common-icon-PlannerTag'></span>&nbsp;&nbsp;{cell.value} */}
							{image}&nbsp;&nbsp;{cell.value}
						</div>;
					}
				}
			},
			valueGetter: (params: any) => {
				if (params.node.group) {
					return params.data?.budgetLineItem || '';
				} else return params.data?.name || '';
			}
		};
	}, []);

	return <SUIGrid
		headers={columns}
		data={records}
		grouped={true}
		getRowId={(params: any) => params.data.id}
		nowRowsMsg={'<div>No records to display</div>'}
		groupDefaultExpanded={1}
		autoGroupColumnDef={autoGroupColumnDef}
	/>;
};

export default VCTransactionGrid;