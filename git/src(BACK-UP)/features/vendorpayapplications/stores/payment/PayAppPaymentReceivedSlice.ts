import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import { Writable } from 'stream';
import _ from 'lodash';

export interface VPAPaymentReceived {
	attachments?: any;
};

const initialState: VPAPaymentReceived = {
	attachments: []
};

export const vpaPaymentReceived = createSlice({
	name: 'vpaPaymentReceived',
	initialState,
	reducers: {
		setAttachments: (state, action: PayloadAction<any>) => {
			state.attachments = action.payload;
		}
	}
});

export const { setAttachments } = vpaPaymentReceived.actions;

export const getAttachments = (state: RootState) => state.vpaPaymentReceived.attachments;

export default vpaPaymentReceived.reducer;