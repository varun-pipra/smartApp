import { isLocalhost } from 'app/utils';
import { VB_BudgetManager, VB_BidManager, VB_BidResponseManager, VB_VendorContract, VB_VendorPayApp, VB_ChangeEvent, VB_ClientPayApp, VB_ClientContract } from 'data/viewBuildeData';

/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Budget Manager: Settings";

export const fetchViewBuilderData = async (appInfo: any, modName: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	console.log('fetchViewBuilderData', modName)
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/viewbuilder?viewFor=${modName}&sessionId=${appInfo?.sessionId}`)
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

	//return isLocalhost ? ViewBuilderData : responseData;
	return isLocalhost ?
		modName == 'bidmanager' ? VB_BidManager :
			modName == 'bidresponse' ? VB_BidResponseManager :
				modName == 'vendorcontract' ? VB_VendorContract :
					modName == 'clientcontract' ? VB_ClientContract :
						modName == 'vendorpayapp' ? VB_VendorPayApp :
							modName == 'clientpayapp' ? VB_ClientPayApp :
								modName == 'changeevent' ? VB_ChangeEvent
									: VB_BudgetManager
		: responseData;
};

export const fetchView = async (appInfo: any, viewId: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	console.log('viewId', viewId)

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

	// const data: any = VB_BudgetManager?.data?.filter((value: any) => { return value.viewId == viewId });
	// return data[0];
};


export const addNewView = async (appInfo: any, body: any, modName: any, callback?: any) => {
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
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/viewbuilder/${viewId}?sessionId=${appInfo?.sessionId}`, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
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