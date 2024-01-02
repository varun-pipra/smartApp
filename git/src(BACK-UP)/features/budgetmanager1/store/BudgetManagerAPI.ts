import {getServerInfo} from 'app/hooks';
import {isLocalhost} from 'app/utils';
import {budgetLineItems} from 'data/budgetmanager/budgetItems';

const moduleName = "Budget Manager:";

export const fetchBudgetItems = async () => {
	const server: any = getServerInfo();
	const {hostUrl, uniqueId, sessionId} = server;

	if(!isLocalhost) {
		const response = await fetch(`${hostUrl}/EnterpriseDesktop/api/v2/budgets/${uniqueId}/lineitems?sessionId=${sessionId}`);
		const result: any = response.json();
		return result?.data || [];
	}
	return budgetLineItems?.data;
};

export const fetchBudgetById = async (budgetId: any) => {
	const server: any = getServerInfo();
	const {hostUrl, uniqueId, sessionId} = server;

	if(!isLocalhost) {
		const response = await fetch(`${hostUrl}/EnterpriseDesktop/api/v2/budgets/${uniqueId}/lineitems/${budgetId}?sessionId=${sessionId}`);
		const data: any = response.json();
		return data || {};
	}
	const item = budgetLineItems.data.find((el: any) => el.id === budgetId);
	return item;
};

export const addBudgetItem = async (payload: any, callback: any) => {
	const server: any = getServerInfo();
};