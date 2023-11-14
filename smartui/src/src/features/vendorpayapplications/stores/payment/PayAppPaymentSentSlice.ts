import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { Writable } from 'stream';
import _ from 'lodash';

export interface VPAPaymentSent {
	attachments?: any;
};

const initialState: VPAPaymentSent = {
	attachments: []
};

export const vpaPaymentSent = createSlice({
	name: 'vpaPaymentSent',
	initialState,
	reducers: {
		setAttachments: (state, action: PayloadAction<any>) => {
			state.attachments = action.payload;
		}
	}
});

export const { setAttachments } = vpaPaymentSent.actions;

export const getAttachments = (state: RootState) => state.vpaPaymentSent.attachments;

export default vpaPaymentSent.reducer;