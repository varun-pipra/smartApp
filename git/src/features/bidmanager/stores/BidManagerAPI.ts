import {isLocalhost} from 'app/utils';
import {ContactPerson, CompanyData, CompanyFiltersData} from 'data/bids/bidList';
/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Bid Manager: Budget Line Items";

export const fetchBudgetLineItemsData = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if(!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/scheduling/projectschedule/GetBudgetLineItems?forBidPackage=true&sessionId=${appInfo?.sessionId}`, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify({"projectId": appInfo?.uniqueId}),
	});
	else {
		response = await fetch('https://63e0a62465b57fe606467d2e.mockapi.io/api/v1/budgetLineItems');
	}
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return isLocalhost ? responseData : responseData?.data;
};



export const fetchContactPersonsData = async (appInfo: any, companyid: any) => {
	let response;
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo.uniqueId}/team/${companyid}?sessionId=${appInfo?.sessionId}`);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();

		return (responseData?.data || []);
	}
	else {
		await fetch('');
		return ContactPerson?.data;
	}
};

export const fetchCompanyData = async (appInfo: any) => {
	let response;
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo.uniqueId}/vendors?search=&sessionId=${appInfo?.sessionId}`);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();

		return (responseData?.data || []);
	}
	else {
		response = await fetch('');
		return CompanyData?.data;
	}


};

export const fetchTeammembersByProjectData = async (appInfo: any) => {
	let response;
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo.uniqueId}/team?sessionId=${appInfo?.sessionId}`, {
			method: 'GET',
			headers: {'content-type': 'application/json'}
		});
	}
	else {
		response = await fetch('https://63e0a62465b57fe606467d2e.mockapi.io/api/v1/budgetLineItems');
	}
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return responseData?.data || [];
};

export const fetchCompanyFilters = async (appInfo: any, name: any) => {
	let response: any;
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetByName?name=${name}&sessionId=${appInfo?.sessionId}`);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();

		return responseData?.listValues;
	}

	return CompanyFiltersData?.listValues;
};