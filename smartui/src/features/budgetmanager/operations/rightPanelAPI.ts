import { isLocalhost } from "app/utils";
import { rollupTaskData } from 'data/Budgetmanger/rolluptaskdata';
import { CompanyData } from 'data/bids/bidList';

const moduleName = 'Budget Manager: Transactions Data';
export const getUserImage = async (appInfo: any, userId: string) => {
	// console.log("userImage", appInfo,userId)
	let response;
	if (!isLocalhost) response = `${appInfo?.hostUrl}/EnterpriseDesktop/collaboration/userimage/${userId}?sessionId=${appInfo?.sessionId}`;
	else {
		response = `https://8f55be2adf864ace8c8c0243eb53f010.smartappbeta.com/EnterpriseDesktop/collaboration/userimage/${userId}?sessionId=c0197c71dee549aca59d51066bc83407`;
	}
	return response;
};

export const getRollupTaskData = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems/rolluptasks?sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || []
	}
	return rollupTaskData?.data;
};
export const addRollupTask = async (appInfo: any, name: any, budgetlineid: any) => {
	console.log('apiaddRollupTask', name, budgetlineid);
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems/createrolluptag?sessionId=${appInfo?.sessionId}&name=${name}&budgetItemId=${budgetlineid}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
		});
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const data = await response?.json();
		console.log('api response wbs',data);
		return data;
	}

};

export const fetchCompanyData = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo.uniqueId}/vendors?search=&sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			// return response							
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data
	}
	return CompanyData?.data
};