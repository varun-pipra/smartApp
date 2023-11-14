import _ from 'lodash';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';

import { fetchSupplementalContracts } from './SupplementalContractsAPI';

export interface SupplementalContractState {
	loading: boolean;
	contractList: any;
	addButtonDisabled: boolean;
};

const initialState: SupplementalContractState = {
	loading: false,
	contractList: [],
	addButtonDisabled: true
};

export const getSupplementalContracts = createAsyncThunk<any, any>('supplementalContracts', async ({ appInfo, categories }) => {
	const response = await fetchSupplementalContracts(appInfo, categories);
	return response;
});

export const supplementalContractsSlice = createSlice({
	name: 'supplementalContracts',
	initialState,
	reducers: {
		setAddButtonDisabled: (state, action: PayloadAction<boolean>) => {
			state.addButtonDisabled = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getSupplementalContracts.pending, (state) => {
			state.loading = true;
		}).addCase(getSupplementalContracts.fulfilled, (state, action) => {
			state.contractList = action.payload;
		}).addCase(getSupplementalContracts.rejected, (state) => {
			state.loading = false;
		});
	}
});

export const { setAddButtonDisabled } = supplementalContractsSlice.actions;

export const getContractList = (state: RootState) => state.supplementalContracts.contractList;
export const getAddButtonDisabled = (state: RootState) => state.supplementalContracts.addButtonDisabled;

export default supplementalContractsSlice.reducer;