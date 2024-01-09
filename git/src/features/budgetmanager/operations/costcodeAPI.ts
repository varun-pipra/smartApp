import { isLocalhost } from 'app/utils';
import { CostCodeFilterData, DivisionCostCodeDropdownData } from 'data/MultiLevelFilterData';
import { triggerEvent } from 'utilities/commonFunctions';

/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Budget Manager: Cost Code Filter Data";

export const fetchCostCode = async () => {
	const response = await fetch('https://f0e27571-0a78-4496-933a-1ec91d25a541.mock.pstmn.io/budgetManager/costCode', {
		headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' }
	});

	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return [];
	// return responseData;
}

export const fetchCostCodeDivision = async () => {
	const response = await fetch('https://f0e27571-0a78-4496-933a-1ec91d25a541.mock.pstmn.io/budgetManager/costCodeDivision', {
		headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' }
	});

	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	// return [];
	return responseData;
}

export const fetchDivisionCostCodeFilterData = async (appInfo: any, costCodeName: string) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost && costCodeName) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetListTreeByNameforBudget?name=${costCodeName}&sessionId=${appInfo?.sessionId}`);
	else {
		response = await fetch('https://6359ffe738725a1746bb7f4c.mockapi.io/budget/api/lineitems', {
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

	return isLocalhost ? CostCodeFilterData : responseData;
};
export const fetchCostCodeAndTypeDropdownData = async (appInfo: any, name: string) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) { 
		if(name) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetListByNameGroupforBudget?name=${name}&sessionId=${appInfo?.sessionId}`);
	}
	else {
		response = await fetch('https://63e0a62465b57fe606467d2e.mockapi.io/api/v1/costCodeOptions', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		});
	}
	if (!response?.ok) {
		const message = `API Request Error (${moduleName}): ${response?.status}`;
		throw new Error(message);
	}
	const responseData = await response?.json();

	return isLocalhost ? DivisionCostCodeDropdownData : responseData ?? [];};
