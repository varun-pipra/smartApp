import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchBlockchainStatus} from './BlockchainAPI';

export interface BidManagerState {
	loading: boolean;
	blockchainEnabled: boolean;
	showBlockchainDialog: boolean;
};

const initialState: BidManagerState = {
	loading: false,
	blockchainEnabled: false,
	showBlockchainDialog: false
};

export const moduleType: any = {
	BidManager: 1,
	ClientContracts: 2,
	VendorContracts: 3,
	VendorPayApplication: 4,
	ClientPayApplication: 5
};

export const checkBlockchainStatus = createAsyncThunk<any, any>('blockchainStatus', async (typeString: string) => {
	const typeValue = moduleType[typeString];
	const status = await fetchBlockchainStatus(typeValue);
	return status;
});

export const blockchain = createSlice({
	name: 'blockchain',
	initialState,
	reducers: {
		setShowBlockchainDialog: (state, action: PayloadAction<boolean>) => {
			state.showBlockchainDialog = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(checkBlockchainStatus.pending, (state, action) => {
			state.loading = true;
		}).addCase(checkBlockchainStatus.fulfilled, (state, action) => {
			state.loading = false;
			state.blockchainEnabled = action.payload;
		}).addCase(checkBlockchainStatus.rejected, (state, action) => {
			state.loading = false;
		});
	}
});

export const {setShowBlockchainDialog} = blockchain.actions;

export default blockchain.reducer;