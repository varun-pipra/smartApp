import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { triggerEvent } from 'utilities/commonFunctions';
import { VendorContractsGridData } from 'data/vendorContracts/gridData';
import { fetchPaymentLedgerList } from './PaymentLedgerAPI';
import { RootState } from 'app/store';

export interface VCPaymentLedgerProps {
	loading: boolean;
	paymentLedgerList: any
	paymentLedgerCount: number;
};

const initialState: VCPaymentLedgerProps = {
	loading: false,
	paymentLedgerList: [],
	paymentLedgerCount: 0,
};

export const getVCPaymentLedgerList = createAsyncThunk<any, any>(
	'VCPaymentLedger',
	async (obj) => {
		const response = await fetchPaymentLedgerList(obj?.appInfo, obj?.id);
		return response;
	}
);

export const VCPaymentLedgerSlice = createSlice({
	name: 'vCPaymentLedger',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setVCPaymentLedgerData: (state, action: PayloadAction<any>) => {
			state.paymentLedgerList = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getVCPaymentLedgerList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getVCPaymentLedgerList.fulfilled, (state, action) => {
				state.loading = false;
				state.paymentLedgerCount = action.payload?.length || 0;
				state.paymentLedgerList = action.payload?.map((txn: any) => {
					return {
						...txn, ...{
							budgetLineItem: `${txn?.budgetItem?.name ?? ''} - ${txn?.budgetItem?.division ?? ''} - ${txn?.budgetItem?.costCode ?? ''}`
						}
					};
				});
				state.paymentLedgerList = action.payload;
			})
			.addCase(getVCPaymentLedgerList.rejected, (state) => {
				state.loading = false;
			})
	}

});

export const { setVCPaymentLedgerData } = VCPaymentLedgerSlice.actions;
export const getPaymentLedgeCount = (state: RootState) => state.vCPaymentLedger.paymentLedgerCount;


export default VCPaymentLedgerSlice.reducer;