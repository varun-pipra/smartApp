import { isLocalhost } from 'app/utils';

/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Budget Manager: Settings";

export const fetchSettingsData = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/settings?sessionId=${appInfo?.sessionId}`)
	else {
		response = await fetch('https://6359ffe738725a1746bb7f4c.mockapi.io/budget/api/settingsinputvalue', {
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
	return isLocalhost ? responseData[0] : responseData;

};

export const addSettings = async (appInfo: any, body: any, callback?: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/settings?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

		});
	} else {
		response = await fetch('https://6359ffe738725a1746bb7f4c.mockapi.io/budget/api/settingsinputvalue', {
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

export const fetchSettingsCostCodeAndTypeData = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;

	response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetAll?projectId=${appInfo?.uniqueId}&sessionId=${appInfo?.sessionId}`);

	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;

		throw new Error(message);
	}
	const responseData = await response.json();

	return responseData;

};

export const fetchdefaultData = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api.
	// Once if we can read the project id and session token you can replace this with original api projectId

	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop//Dashboard/GlobalSmartApps/GetSmartAppList?projectId=${appInfo?.projectId}&sessionId=${appInfo?.sessionId}`)
	else {
		response = await fetch('https://6359ffe738725a1746bb7f4c.mockapi.io/budget/api/defaultapp', {
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
	return isLocalhost ? responseData[0] : responseData;
};

export const fetchSecurityData = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/security?sessionId=${appInfo?.sessionId}`)
	else {
		response = await fetch('https://6359ffe738725a1746bb7f4c.mockapi.io/budget/api/security', {
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
	return isLocalhost ? responseData[0] : responseData;
};

export const addSecurity = async (appInfo: any, body: any, callback?: any) => {

	let response;
	// if (!isLocalhost) {
	// 	response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/security?sessionId=${appInfo?.sessionId}`, {
	// 		method: 'POST',
	// 		headers: { 'content-type': 'application/json' },
	// 		body: JSON.stringify(body),

	// 	});
	// } else {
	// 	response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/settings', {
	// 		headers: {
	// 			"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
	// 		},
	// 	});
	// }
	response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/security?sessionId=${appInfo?.sessionId}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),

	});
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}

	callback && callback(response.json());
};