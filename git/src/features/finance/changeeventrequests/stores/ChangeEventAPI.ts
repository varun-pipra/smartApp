import { getServerInfo } from 'app/hooks';
import { isLocalhost } from 'app/utils';
import { changeEvents, referencefile } from 'data/changeEventRequests/changeEventList';
import { budgetItems } from 'data/changeEventRequests/dropdownData';
import { vendorDetails } from 'data/changeEventRequests/selectedBudgetItems';
import { ClientGridData } from 'data/clientContracts/gridData';
import { clientRequest } from 'features/clientContracts/utils';
import { changeEventsRequest } from '../CERUtils';
import { LinkGriddata } from '../details/tabs/links/Links';

const moduleName = "Change Event Requests:";

// Form Drop down API

export const fetchActiveClientContracts = async () => {
	const server: any = getServerInfo();	
	if(!isLocalhost) {
		const response = await clientRequest(server, '/summary', {});
		return response?.data;
	}
	return ClientGridData?.data;
};

// Create Change Event Apis

export const fetchBudgetsByContractId = async (contractId: any) => {
	const server: any = getServerInfo();
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/contract/${contractId}/budgetItems`, {});
		return response?.data;
	}
	return budgetItems?.data;
};

export const addChangeEvent = async (payload: any, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, '', options);
		callback && callback(response);
	}
};

// Grid Apis

export const fetchChangeEvents = async () => {
	const server: any = getServerInfo();
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, '?offset=0&limit=20000', {});
		return response?.data;
	}
	return changeEvents?.data;
};

// Right Panel APIS

export const fetchChangeEventDetails = async (changeEventId: string) => {
	const server: any = getServerInfo();
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}`, {});
		return response;
	}
	const record = changeEvents?.data?.find((obj: any) => obj.id === changeEventId);
	return record;
};

// Change Event Details Tab APIS

export const updateChangeEventDetails = async (changeEventId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("updateChangeEventDetails", payload);
	const options = {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}`, options);
		callback && callback(response);
	}
};

// Budget Line Items Tab APIS

export const fetchBudgetsByChangeEvent = async (changeEventId: string) => {
	const server: any = getServerInfo();
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/budgetItems`, {});
		return response?.data;
	}
	return budgetItems?.data;
};

export const addBudgets = async (changeEventId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/budgetItems`, options);
		callback && callback(response);
	}
	// return budgetItems?.data;
};

export const removeBudgetsById = async (changeEventId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'DELETE',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/budgetItems`, options, true);
		callback && callback(response);
	}
	// return budgetItems?.data;
};

export const updateBudget = async (changeEventId: any, budgetId: string, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("update payload", payload);
	const options = {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/budgetItems/${budgetId}`, options);
		callback && callback(response);
	}
};

export const submitChangeEvent = async (changeEventId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/submit`, options);
		callback && callback(response);
	}
};

export const requestQuoteFromVendor = async (changeEventId: any, payload: any, callback: any) => {
	console.log("requestquote payload", payload);
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	}
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/quotes/request`, options);
		callback && callback(response);
	}
};

export const submitQuoteByVendor = async (changeEventId: any, payload: any, callback: any) => {
	console.log("requestquote payload", payload);
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	}
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/quotes/submit`, options);
		callback && callback(response);
	}
};

// Client Perform Action APIS

export const rejectByClient = async (changeEventId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("reject payload", payload);
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/reject`, options);
		callback && callback(response);
	}
};

export const reviseByClient = async (changeEventId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("revise payload", payload);
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/revise`, options);
		callback && callback(response);
	}
};

export const authorizeByClient = async (changeEventId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("authorize payload", payload);
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/authorize`, options);
		callback && callback(response);
	}
};

export const getVendorDetails = async (changeEventId: any, budgetId: string) => {
	const server: any = getServerInfo();
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/budgetItems/${budgetId}`, {});
		return response;
	}
	return vendorDetails;
};


export const deleteChangeEventRequest = async (changeEventId: any, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'DELETE',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}`, options, true);
		callback && callback(response);
	}
};

export const reviseBydgetById = async (changeEventId: any, budgetId: string, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		if(changeEventId && budgetId) {		
			const response = await changeEventsRequest(server, `/${changeEventId}/quotes/${budgetId}/revise`, options);
			callback && callback(response);
		}
	}
};

export const ignoreQuoteById = async (changeEventId: any, budgetId: string, callback: any) => {
	console.log("budgetId", budgetId, changeEventId)
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		if(changeEventId && budgetId) {		
			const response = await changeEventsRequest(server, `/${changeEventId}/quotes/${budgetId}/ignore`, options);
			callback && callback(response);
		}
	}
};

export const acceptBudgetById = async (changeEventId: any, budgetId: string, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		if(changeEventId && budgetId) {
			const response = await changeEventsRequest(server, `/${changeEventId}/quotes/${budgetId}/accept`, options);
			callback && callback(response);
		}
	}
};

export const cancelBudgetById = async (budgetId: string) => console.log(budgetId);

export const addChangeEventFiles = async (appInfo: any, changeEventId: any, files: Array<any>) => {
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(files),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/files`, options);
		return response;
	}
};

export const deleteChangeEventFiles = async (appInfo: any, changeEventId: any, files: Array<any>) => {
	const server: any = getServerInfo();
	const options = {
		method: 'DELETE',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(files),
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/files`, options);
		return response;
	}
};

export const fetchChangeEventFiles = async (appInfo: any, changeEventId: any) => {
	const server: any = getServerInfo();
	if(!changeEventId) return ;
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/${changeEventId}/files`, {});
		return response?.data;
	}
	return referencefile?.data;
};
// Links

export const fetchLinks = async (changeEventId: string) => {
	const server: any = getServerInfo();
	if (!isLocalhost) {
		if (changeEventId) {
			const response = await changeEventsRequest(server, `/${changeEventId}/links`, {});
			return response?.data;
		}
	}
	return LinkGriddata?.data;
};

export const postChangeEventsToConnector = async (type: any, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
	};
	if (!isLocalhost) {
		const response = await changeEventsRequest(server, `/postToConnector?connectorType=${type}`, options);
		callback && callback(response);
	}
};
