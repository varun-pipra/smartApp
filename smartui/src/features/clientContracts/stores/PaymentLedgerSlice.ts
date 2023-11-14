import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchPaymentLedgerList} from './PaymentLedgerAPI';
import {RootState} from 'app/store';

export interface VCPaymentLedgerProps {
	loading: boolean;
	paymentLedgerList: any;
	paymentLedgerCount: any;
};

const initialState: VCPaymentLedgerProps = {
	loading: false,
	paymentLedgerList: [],
	paymentLedgerCount: 0
};

export const getCCPaymentLedgerList = createAsyncThunk<any, any>(
	'CCPaymentLedger',
	async (obj) => {
		const response = await fetchPaymentLedgerList(obj?.appInfo, obj?.id);
		return response;
	}
);

export const CCPaymentLedgerSlice = createSlice({
	name: 'cCPaymentLedger',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		setCCPaymentLedgerData: (state, action: PayloadAction<any>) => {
			state.paymentLedgerList = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCCPaymentLedgerList.pending, (state) => {
				state.loading = true;
			})
			.addCase(getCCPaymentLedgerList.fulfilled, (state, action) => {
				state.loading = false;
				state.paymentLedgerList = action.payload;
				state.paymentLedgerCount = action?.payload?.length;
			})
			.addCase(getCCPaymentLedgerList.rejected, (state) => {
				state.loading = false;
			});
	}

});

export const {setCCPaymentLedgerData} = CCPaymentLedgerSlice.actions;
export const getPaymentLedgerCount = (state: RootState) => state.cCPaymentLedger.paymentLedgerCount;

export default CCPaymentLedgerSlice.reducer;