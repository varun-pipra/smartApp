import { isLocalhost } from 'app/utils';
/**
 * This function fetches the list of transaction data */
const moduleName = 'Budget Manager: Transactions Data';

export const getTransactionsData = async (appInfo: any, lineItemId: string) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	// console.log("{lineItemId}", lineItemId)
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems/${lineItemId}/transactions?sessionId=${appInfo?.sessionId}`);
	else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/transactions', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		}
		);
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return isLocalhost ? responseData : (responseData?.data || []);
};

export const getForecastData = async (appInfo: any, lineItemId: string) => {
	// console.log('lineItemId', lineItemId)
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	// console.log("{lineItemId}", lineItemId)
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems/${lineItemId}/forecast?sessionId=${appInfo?.sessionId}`);
	else {
		response = await fetch('https://f0e27571-0a78-4496-933a-1ec91d25a541.mock.pstmn.io/budgetManager/forecast', {
			headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' }
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return isLocalhost ? responseData?.data : (responseData?.data || []);
};

// * This function create a row in transactions table */
export const addTransaction = async (appInfo: any, body: any, lineItemId: string, callback?: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems/${lineItemId}/transactions?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

		});
	} else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/transactions', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	callback && callback(response.json());
};

// * This function updates a row in transactions table based on transaction Id */
export const updateTransactionRecord = async (payload: any, lineItemId: string) => {
	const response = await fetch(`https://25f2042c21be4e549de116706a271321.smartappbeta.com/EnterpriseDesktop/api/v2/budgets/{projectId:guid}/lineitems/${lineItemId}/transactions/${payload.id}`, {
		headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' },
		method: 'PUT',
		body: payload
	});

	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();
	return responseData;
}

// * This function deletes a row in transactions table based on transaction Id */
export const deleteTransactionsData = async (id: number, lineItemId: string) => {
	const response = await fetch(`https://25f2042c21be4e549de116706a271321.smartappbeta.com/EnterpriseDesktop/api/v2/budgets/{projectId:guid}/lineitems/${lineItemId}/transactions/${id}`, {
		headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' },
		method: 'DELETE'
	});

	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();
	return responseData;
}