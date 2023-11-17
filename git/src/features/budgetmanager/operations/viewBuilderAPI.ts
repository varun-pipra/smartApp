import { isLocalhost } from 'app/utils';
import { ViewBuilderData } from 'data/viewBuildeData';

/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Budget Manager: Settings";

export const fetchViewBuilderData = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/viewbuilder?sessionId=${appInfo?.sessionId}`)
	else {
		response = await fetch('https://639b176231877e43d681ee84.mockapi.io/budget/api/viewbuilder', {
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
	return isLocalhost ? ViewBuilderData : responseData;

};

export const fetchView = async (appInfo: any, viewId:any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/viewbuilder/${viewId}?sessionId=${appInfo?.sessionId}`);
	else {
		response = await fetch(`https://639b176231877e43d681ee84.mockapi.io/budget/api/viewbuilder/${viewId}`);
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return isLocalhost ? responseData : (responseData || {});
};


export const addNewView = async (appInfo: any, body: any, callback?: any) => {

	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/viewbuilder?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

		});
	} else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/viewbuilder', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	callback && callback(response.json());
};

export const updateViewItem = async (appInfo: any, viewId: any, body: any, callback?: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api

	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/viewbuilder/${viewId}?sessionId=${appInfo?.sessionId}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json'},
			body: JSON.stringify(body),

		});
	} else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/viewbuilder');
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}

	const data = await response.json();
	callback && callback(data);
};

export const deleteView = async (appInfo: any, viewId: any, callback?: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/viewbuilder/${viewId}?sessionId=${appInfo?.sessionId}`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			// body: none,

		});
	} else {
		response = await fetch(`https://632b335b713d41bc8e83479b.mockapi.io/budget/api/viewbuilder`);
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	callback && callback(response);
};