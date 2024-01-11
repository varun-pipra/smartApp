import { isLocalhost } from 'app/utils';
import { VendorContractDetails, VendorContractsGridData } from 'data/vendorContracts/gridData';
import { WorkItems } from 'data/vendorContracts/scheduleOfValues';
import { triggerEvent } from 'utilities/commonFunctions';

const moduleName = "Vendor Contracts: Schedule Of Values";

export const createScheduleOfValues = async (appInfo: any, contractId:any, budgetId:any, body:any, callback?: any) => {
	console.log("createScheduleOfValues", body)
	let response: any;
	if (!isLocalhost) {
		if(contractId && budgetId) {
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/scheduleofvalues/${budgetId}?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			const data = await response.json();
			callback && callback(data);
		}
	}

};

export const addPaymenForSov = async (appInfo: any, contractId:any, budgetId:any, body:any, callback?: any) => {
	console.log("addPaymenForSov", body)
	let response: any;
	if (!isLocalhost) {
		if(contractId && budgetId) {
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/scheduleofvalues/${budgetId}/payments?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			const data = await response.json();
			callback && callback(data);
		}
	}

};

export const updateScheduleOfValues = async (appInfo: any, contractId:any, budgetId:any, paymentId:any, body:any, callback?: any) => {
	console.log("updateScheduleOfValues", body)
	let response: any;
	if (!isLocalhost) {
		if(budgetId && contractId && paymentId) {
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/scheduleofvalues/${budgetId}/payments/${paymentId}?sessionId=${appInfo?.sessionId}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			const data = await response.json();
			callback && callback(data);
		}
	}
};

export const updateScheduleOfValuesThroughDate = async (appInfo: any, contractId:any, budgetId:any, body:any, callback?: any) => {
	console.log("updateScheduleOfValues through date", body)
	let response: any;
	if (!isLocalhost) {
		if(budgetId && contractId) {
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/scheduleofvalues/${budgetId}?sessionId=${appInfo?.sessionId}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			const data = await response.json();
			callback && callback(data);
		}
	}
};

export const deleteAllScheduleOfValues = async (appInfo: any, contractId:any, budgetItemId:any, callback?: any) => {
    let response: any;
	if (!isLocalhost) {
		if(contractId && budgetItemId) {

			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/scheduleofvalues/${budgetItemId}?sessionId=${appInfo?.sessionId}`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			// body: JSON.stringify(body),

			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			console.log("delete sov")
			// const data = await response.json();
			callback && callback(response);
		}
	}

};
export const deleteScheduleOfValue = async (appInfo: any, contractId:any, budgetItemId:any, sovId:any, callback?: any) => {
	let response: any;
	console.log("single delete")
	if (!isLocalhost) {
		if(contractId && budgetItemId && sovId) {

			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/scheduleofvalues/${budgetItemId}/payments/${sovId}?sessionId=${appInfo?.sessionId}`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			// body: JSON.stringify(body),

			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			// const data = await response.json();
			callback && callback(response);
		}
	}
};

export const deleteBudgetItem = async (appInfo: any, contractId:any, budgetItemId:any, callback?: any) => {
	let response: any;
	console.log("budget item delete")
	if (!isLocalhost) {
		if(contractId && budgetItemId) {

			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/budgetlineitem/${budgetItemId}?sessionId=${appInfo?.sessionId}`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			// body: JSON.stringify(body),

			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			// const data = await response.json();
			callback && callback(response);
		}
	}
};