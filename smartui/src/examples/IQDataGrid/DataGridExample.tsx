import {hideLoadMask} from 'app/hooks';
import IQDataGrid from 'components/iqdatagrid/IQDataGrid';
import {memo, useMemo, useEffect, useState} from 'react';
import './DGStyle.scss';
import {data} from './sampleBudgetData';
import {ColDef} from 'ag-grid-community';

const DataGridExample = () => {
	const defaultColDef = useMemo(() => {
		return {
			minWidth: 150,
			suppressMenu: true
		};
	}, []);

	const autoGroupColumnDef = useMemo<ColDef>(() => {
		return {
			headerName: 'Cost Code Group',
			minWidth: 500,
			pinned: true,
			// sort: 'asc',
			cellRendererParams: {
				suppressCount: true,
				checkbox: true
			}
		};
	}, []);

	const getDataId = useMemo(() => {
		return (data: any) => data.id;
	}, []);

	const getDataPath = useMemo(() => {
		return (data: any) => data.costCodeGroup;
	}, []);

	useEffect(() => {
		hideLoadMask();
	}, []);

	const columns = [
		{headerName: 'Budget ID/CBS', field: 'budgetId'},
		{
			headerName: 'Description', field: 'description',
			// editable: true
		},
		{headerName: 'Division/Cost Code', field: 'costCode'},
		{headerName: 'Cost Type', field: 'Cost Type'},
		{headerName: 'Associated Location/System', field: 'locations'},
		{headerName: 'Original Budget Amount', field: 'originalBudgetAmount'},
		{headerName: 'Budget Transfer Amount', field: 'budgetTransferAmount'},
		{headerName: 'Approved COs', field: 'approvedCOs'},
		{headerName: 'Revised Budget', field: 'revisedBudget'},
		{headerName: 'Transaction Amount', field: 'transactionAmount'},
		{headerName: 'Remaining Balance', field: 'remainingBalance'},
		{headerName: 'Curve', field: 'curve'},
		{headerName: 'Vendor', field: 'vendor'},
		{headerName: 'Estimated Start Date', field: 'estimatedStartDate'},
		{headerName: 'Estimated End Date', field: 'estimatedEndDate'},
		{headerName: 'Projected Schedule Start', field: 'projectedScheduleStart'},
		{headerName: 'Projected Schedule End', field: 'projectedScheduleEnd'},
		{headerName: 'Actual Schedule Start', field: 'actualScheduleStart'},
		{headerName: 'Actual Schedule End', field: 'actualScheduleEnd'},
		{headerName: 'Unit of Measure', field: 'unitofMeasure'},
		{headerName: 'Unit Quantity', field: 'unitQuantity'},
		{headerName: 'Unit Cost', field: 'unitCost'},
		{headerName: 'Pending Change Order', field: 'pendingChangeOrder'},
		{headerName: 'Pending Transactions', field: 'pendingTransactions'},
		{headerName: 'Budget Forecast', field: 'budgetForecast'},
		{headerName: 'Balance Forecast', field: 'balanceForecast'},
		{headerName: 'Bid Package Name', field: 'bidPackageName'},
		{headerName: 'Bid Award Date', field: 'bidAwardDate'},
		{headerName: 'Bid Status', field: 'bidStatus'},
		{headerName: 'Vendor Contract Name', field: 'vendorContractName'},
		{headerName: 'Vendor Contract Date', field: 'vendorContractDate'},
		{headerName: 'Vendor Contract Status', field: 'vendorContractStatus'},
		{headerName: 'Client Contract Name', field: 'clientContractName'},
		{headerName: 'Client Contract Date', field: 'clientContractDate'},
		{headerName: 'Client Contract Status', field: 'clientContractStatus'}
	];

	return <IQDataGrid
		rowData={data}
		columnDefs={columns}
		defaultColDef={defaultColDef}
		autoGroupColumnDef={autoGroupColumnDef}
		treeData={true}
		animateRows={true}
		groupDefaultExpanded={-1}
		rowSelection={'multiple'}
		groupSelectsChildren={true}
		suppressRowClickSelection={true}
		getRowId={getDataId}
		getDataPath={getDataPath}
	/>;
};

export default memo(DataGridExample);