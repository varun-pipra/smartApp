import { isLocalhost } from "app/utils";

/**
 * This function fetches the list of Table Columns
 */
const moduleName = 'Budget Manager: Table Columns';

export const fetchTableColumnList = async (appInfo: any) => {
	const response = await fetch('https://0da46fbd-f492-4445-b60d-27b535a00ba3.mock.pstmn.io/budgetManager/tableColumns/getAll', {
		headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' }
	});

	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const tableColumns = await response.json();

	return tableColumns;
}

export const fetchBudgetIsLockedOrUnlocked = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}?sessionId=${appInfo?.sessionId}`);
	else {
		response = await fetch('https://273cef99-11a5-4abe-b70c-085f40fa7bfa.mock.pstmn.io/unlock', {
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

	return responseData;
};


export const lockAndUnlockBudget = async (appInfo: any, body: any, callback?: any) => {

	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

		});
	} else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/lineitems', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const data = await response.json();
	callback && callback(data);
};

export const fetchBudgetManagerDownloadTemplete = async (appInfo: any, callback?:any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/budgets/${appInfo?.uniqueId}/import/downloadtemplate?sessionId=${appInfo?.sessionId}`);
	}
	
	else {
		response = await fetch('https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/enterprisedesktop/api/v2/budgets/6e83792a-3e66-49d6-9442-c6a1e918b48f/import/downloadtemplate?sessionId=9e139005c10e4a6fa6b0f517007ed11a', {headers: {'Access-Control-Allow-Origin': '*'}});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const data = await response;
	callback && callback(data);
};
