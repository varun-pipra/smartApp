import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isLocalhost } from 'app/utils';
import { getServerInfo } from 'app/hooks';
import { levels, locationConfigData, segmentsDataByLocation, tags } from './localData';

export interface LocationFieldState {
	levels?: any;
	locations?: any;
	locationsdata?:any;
	locationConfig?:any;
	locationSegmentsData?:any;
};

const initialState: LocationFieldState = {
	levels: [],
	locations: [],
	locationsdata:[],
	locationConfig: {},
	locationSegmentsData: {}

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
export const getProjetLocationConfig = createAsyncThunk<any>(
	'locationConfig', async () => {
		const response = await fetchProjectLocationConfig();
		return response;
	}
);
export const getLocationSegmentsData = createAsyncThunk<any>(
	'locationSegmentsData', async () => {
		const response = await fetchLocationSegmentsData();
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
		}).addCase(getProjetLocationConfig.fulfilled, (state, action) => {
			state.locationConfig = action.payload;
		}).addCase(getLocationSegmentsData.fulfilled, (state, action) => {
			state.locationSegmentsData = action.payload;
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
// https://8f55be2adf864ace8c8c0243eb53f010.smartappbeta.com/EnterpriseDesktop/ProjectLocations/ProjectLocations/GetProjectLocationConfig
const fetchProjectLocationConfig = async () => {
	if(isLocalhost) return locationConfigData?.values;
	else {
		const server: any = getServerInfo();
		const locationssUrl = `${server?.hostUrl}/EnterpriseDesktop/ProjectLocations/ProjectLocations/GetProjectLocationConfig`;
		const options = {method: 'POST',headers: {'content-type': 'application/json'}, body: JSON.stringify({projectId: server?.projectId})}
		const response = await fetch(locationssUrl, options);
		const result: any = await response.json();
		return result?.values;
	}
};

// https://8f55be2adf864ace8c8c0243eb53f010.smartappbeta.com/EnterpriseDesktop/ProjectLocations/ProjectLocations/GetMapItemsDetails?_dc=1708496971048&projectId=531979
const fetchLocationSegmentsData = async () => {
	if(isLocalhost) return segmentsDataByLocation?.values;
	else {
		const server: any = getServerInfo();
		const locationssUrl = `${server?.hostUrl}/EnterpriseDesktop/ProjectLocations/ProjectLocations/GetMapItemsDetails?_dc=1708496971048&projectId=${server?.projectId}`;
		const response = await fetch(locationssUrl);
		const result: any = await response.json();
		return result?.values;
	}
};

