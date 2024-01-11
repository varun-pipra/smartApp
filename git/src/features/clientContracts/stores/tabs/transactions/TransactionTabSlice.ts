import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

import { fetchClientContractTransactions } from './TransactionTabAPI';

export interface VCTransactionsTabState {
	loading: boolean;
	kpiData: any;
	transactionCount: number;
	modifiedTransactions: any;
	originalTransactions: any;
};

const initialState: VCTransactionsTabState = {
	loading: false,
	kpiData: {},
	transactionCount: 0,
	modifiedTransactions: [],
	originalTransactions: []
};

export const fetchTransactions = createAsyncThunk<any, any>('transactions', async ({ appInfo, contractId }) => {
	const response = await fetchClientContractTransactions(appInfo, contractId);
	return response;
});

export const clientTransactionsTabData = createSlice({
	name: 'clientTransactionsTabData',
	initialState,
	reducers: {
		setModifiedTransactions: (state, action: PayloadAction<boolean>) => {
			state.modifiedTransactions = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchTransactions.pending, (state) => {
			state.loading = true;
		}).addCase(fetchTransactions.fulfilled, (state, action) => {
			const { transactions, ...everythingElse } = action.payload;
			state.kpiData = everythingElse;
			state.transactionCount = transactions?.length || 0;
			state.originalTransactions = transactions.map((txn: any) => {
				return {
					...txn, ...{
						// budgetLineItem: `${txn.budgetItem.name} - ${txn.budgetItem.division} - ${txn.budgetItem.costCode}`
						budgetLineItem: `${txn.budgetItem.name ? txn.budgetItem.name : ""} ${txn.budgetItem.division ? " - " + txn.budgetItem.division : ""} ${txn.budgetItem.costCode ? " - " + txn.budgetItem.costCode : ""}`
					}
				};
			});
		}).addCase(fetchTransactions.rejected, (state) => {
			state.loading = false;
		});
	}
});

export const { setModifiedTransactions } = clientTransactionsTabData.actions;

export const getKpiData = (state: RootState) => state.clientTransactionsTabData.kpiData;
export const getModifiedTransactions = (state: RootState) => state.clientTransactionsTabData.modifiedTransactions;
export const getOriginalTransactions = (state: RootState) => state.clientTransactionsTabData.originalTransactions;
export const getTransactionCount = (state: RootState) => state.clientTransactionsTabData.transactionCount;

export default clientTransactionsTabData.reducer;