import {isLocalhost} from 'app/utils';
import {gridData} from 'data/Budgetmanger/griddata';
/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Budget Manager: Grid Data";

export const fetchGridDataList = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if(!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems?sessionId=${appInfo?.sessionId}`);
	else {
		// response = await fetch('data.json', {
		response = await fetch('https://be2c996c-6425-48aa-9e0e-218203724691.mock.pstmn.io/budget/api/lineitems', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		}
		);
	}
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return isLocalhost ? gridData?.data : (responseData?.data || []);
};

export const fetchLineItem = async (appInfo: any, lineItemId: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response: any;
	if(!isLocalhost) {
		if(lineItemId) {
			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems/${lineItemId}?sessionId=${appInfo?.sessionId}`);
		}
	}
	else {
		response = await fetch('https://be2c996c-6425-48aa-9e0e-218203724691.mock.pstmn.io/budget/api/lineitems', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		}
		);
	}
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return isLocalhost ? responseData : (responseData || {});
};

export const addBudgetLineItem = async (appInfo: any, body: any, callback?: any) => {
	let response: any;
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body),

		});
	} else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/lineitems', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		});
	}
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const data = await response.json();

	callback && callback(data);
};

export const deleteBudgetLineItem = async (appInfo: any, lineItemIds: any, callback?: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems?sessionId=${appInfo?.sessionId}`, {
			method: 'DELETE',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(lineItemIds),

		});
	} else {
		response = await fetch(`https://632b335b713d41bc8e83479b.mockapi.io/budget/api/lineitems`, {
			method: 'DELETE',
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
			body: JSON.stringify(lineItemIds),
		});
	}
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}

	callback && callback(response);
};

export const updateBudgetLineItem = async (appInfo: any, lineItemId: any, body: any, callback?: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	// console.log("line item payload", body)
	let response;
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/lineitems/${lineItemId}?sessionId=${appInfo?.sessionId}`, {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body),

		});
	} else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/lineitems', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		});
	}
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}

	const data = await response.json();
	callback && callback(data);
};