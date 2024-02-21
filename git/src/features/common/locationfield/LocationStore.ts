import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isLocalhost } from 'app/utils';
import { getServerInfo } from 'app/hooks';
import { levels, tags } from './localData';

export interface LocationFieldState {
	levels?: any;
	locations?: any;
	locationsdata?:any;
};

const initialState: LocationFieldState = {
	levels: [],
	locations: [],
	locationsdata:[],
};

export const fetchLevelData = createAsyncThunk<any>(
	'levels', async () => {
		const response = await fetchLevels();
		return response;
	}
);

export const fetchLocationData = createAsyncThunk<any, any>(
	'locations', async (levelId?:any) => {
		const response = await fetchLocations(levelId);
		return response;
	}
);

export const fetchLocationswithOutIdData = createAsyncThunk<any>(
	'locationswithOutId', async () => {
		const response = await fetchLocationswithOutId();
		return response;
	}
);

export const locationSlice = createSlice({
	name: 'location',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchLevelData.fulfilled, (state, action) => {
			state.levels = action.payload;
		}).addCase(fetchLocationData.fulfilled, (state, action) => {
			state.locations = action.payload;
		}).addCase(fetchLocationswithOutIdData.fulfilled, (state, action) => {
			state.locationsdata = action.payload;
		})
	}
});

export default locationSlice.reducer;

const fetchLevels = async () => {
	if(isLocalhost) return levels.values;
	else {
		const server: any = getServerInfo();
		const levelsUrl = `${server?.hostUrl}/EnterpriseDesktop/FileIt/Files.iapi/getlevels?sessionId=${server?.sessionId}&type=Location&projectId=${server?.projectId}`;
		const response = await fetch(levelsUrl);
		const data: any = await response.json();
		return data.values;
	}
};

const fetchLocations = async (levelId: any) => {
	if(isLocalhost) return tags.Items;
	else {
		const server: any = getServerInfo();
		const locationssUrl = `${server?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${server?.uniqueId}/lineitems/locations?sessionId=${server?.sessionId}&levelId=${levelId}`;
		const response = await fetch(locationssUrl);
		const result: any = await response.json();
		return result.data;
	}
};

const fetchLocationswithOutId = async () => {
	if(isLocalhost) return tags.Items;
	else {
		const server: any = getServerInfo();
		const locationssUrl = `${server?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${server?.uniqueId}/lineitems/locations?sessionId=${server?.sessionId}`;
		const response = await fetch(locationssUrl);
		const result: any = await response.json();
		return result.data;
	}
};