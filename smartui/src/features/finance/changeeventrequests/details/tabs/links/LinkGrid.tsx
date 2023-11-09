
import React, { useEffect, useMemo, useState } from 'react';
import SUIGrid from 'sui-components/Grid/Grid';
import { ColDef } from 'ag-grid-enterprise';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import IQTooltip from 'components/iqtooltip/IQTooltip';
import { amountFormatWithSymbol } from 'app/common/userLoginUtils';

const LinkGrid = (props: any) => {
	const { currencySymbol, server } = useAppSelector((state) => state.appInfo);
	const [rowData, setRowData] = useState<any>([]);
	const [gridRef, setGridRef] = useState<any>('');
	const headers = [
		{
			headerName: 'Contract Name',
			field: 'budgetLineItem',
			minWidth: 150,
			hide: true,
			rowGroup: true
		}, {
			headerName: 'Type',
			field: 'type',
			minWidth: 150,
		}, {
			headerName: 'Contract Value',
			field: 'budgetItem.contractAmount',
			minWidth: 150,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				return !params?.node?.group && <div className='right-align'>{amountFormatWithSymbol(params.value)}</div>
			}
		}, {
			headerName: 'Est.Change Event Amount',
			field: 'budgetItem.changeOrderAmount',
			minWidth: 230,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				return !params?.node?.group && <div className='right-align'>{amountFormatWithSymbol(params.value)}</div>
			}
		}, {
			headerName: 'Revised Budget',
			field: 'budgetItem.revisedAmount',
			minWidth: 170,
			type: "rightAligned",
			cellRenderer: (params: any) => {
				return !params?.node?.group && <div className='right-align'>{amountFormatWithSymbol(params.value)}</div>
			}
		}
	];
	const [columns, setColumns] = React.useState<any>(headers);

	useEffect(() => {
		console.log("dataaaa", props?.data)
		setRowData(props.data)
	}, [props.data])

	const autoGroupColumnDef: ColDef = useMemo<ColDef>(() => {
		return {
			headerName: 'Contract Name',
			field: 'budgetLineItem',
			minWidth: 400,
			rowGroup: true,
			resizable: true,
			suppressRowClickSelection: false,
			cellRenderer: 'agGroupCellRenderer',
			cellRendererParams: {
				suppressCount: false,
				checkbox: true,
				innerRenderer: (cell: any) => {
					console.log("celll", cell)
					if (cell?.node?.group) {
						return <div className='bold-font'>{cell.value}</div>;
					} else {
						const contractUrl = cell?.data?.type == 'Vendor Contract' ? 'vendor-contracts' : 'client-contracts'
						return <>
							{cell?.data?.hasChangeOrder && <IQTooltip
								title={'Schedule Of Values of the Contract to be updated due to recent approval of the Change Event Request.'}
								placement={'bottom'}
								arrow={true}
							>
								<span className='common-icon-c-mark' style={{ color: '#26d8b1', position: 'absolute', left: '1%', marginTop: '8px', fontSize: '24px', cursor: 'pointer' }} />
							</IQTooltip>}
							<span className='ag-costcodegroup'
								style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
								onClick={() => window.open(`${server?.hostUrl}/EnterpriseDesktop/DesktopClientUI/AppZoneV2/appholder/?url=https://react.smartappbeta.com/${contractUrl}/home?id=${cell?.data?.contract?.name}#react`, '_blank')}
							>{cell?.data?.contract?.name} </span>
						</>
					}
				}
			},
			// valueGetter: (params: any) => {
			// 	if (params.node.group) {
			// 		return params.data?.budgetLineItem || '';
			// 	}
			// 	else {
			// 		return params.data?.name || '';
			// 	}
			// }
		};
	}, []);
	const onRowSelection = (event: any) => {
		const selectedData: any = event.api.getSelectedRows();
		props.gridRowSelection(selectedData)
	};

	return (
		<SUIGrid
			headers={columns}
			data={rowData}
			animateRows={true}
			getRowId={(params: any) => params.data?.rowId}
			grouped={true}
			rowSelection='multiple'
			nowRowsMsg={'<div>Create new Link by Clicking the + button above</div>'}
			getReference={(value: any) => { setGridRef(value) }}
			autoGroupColumnDef={autoGroupColumnDef}
			groupIncludeFooter={false}
			groupIncludeTotalFooter={false}
			groupSelectsChildren={true}
			rowSelected={onRowSelection}
		/>
	)
}
export default LinkGrid;