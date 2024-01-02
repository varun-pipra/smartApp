import { isLocalhost } from 'app/utils';
import { triggerEvent } from 'utilities/commonFunctions';
import { clientRequest } from '../utils';
import { BudgetData } from 'data/clientContracts/budgetData';

const moduleName = "Client Contracts Budgets: Forecasts Info";

export const fetchBudgetData = async (appInfo: any) => {
	let response;
	if (!isLocalhost) { 
		console.log("budgets", appInfo)
        response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems?sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
		return responseData?.data
	} 
	return BudgetData?.data;
};

export const addBudgets = async (appInfo: any, contractId:any, body: any, callback?: any) => {
	console.log('body', body)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientRequest(appInfo, `/${contractId}/budgetitems`, options);
		callback && callback(response);
	}
};

export const deleteBudgets = async (appInfo: any, contractId:any, body: any, callback?: any) => {
	console.log('body', body)
    const options = {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientRequest(appInfo, `/${contractId}/budgetitems`, options, true);
		callback && callback(response);
	}
};