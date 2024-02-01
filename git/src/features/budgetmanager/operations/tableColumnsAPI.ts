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

export const fetchBudgetManagerDownloadTemplete = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/budgets/${appInfo?.uniqueId}/import/downloadtemplate?sessionId=${appInfo?.sessionId}`);
	
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
	}
	else return 'https://file-examples.com/wp-content/storage/2017/02/file_example_XLSX_1000.xlsx';
};
