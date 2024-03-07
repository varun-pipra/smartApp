import { isLocalhost } from 'app/utils';
import { VendorContractDetails, VendorContractsGridData } from 'data/vendorContracts/gridData';
import { WorkItems } from 'data/vendorContracts/scheduleOfValues';
import { triggerEvent } from 'utilities/commonFunctions';

const moduleName = 'Vendor Contracts: Grid Data';

export const createVendorContracts = async (appInfo: any, body: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts?sessionId=${appInfo?.sessionId}`, {
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
		return data;
	}
};

export const fetchVendorContractsList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts?offset=0&limit=10000&sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
			return response							
		}
		const responseData = await response.json();
		return (responseData?.data || []);
	}
	return VendorContractsGridData?.data;
};

export const fetchVendorContractDetailsById = async (appInfo: any, contractId: string) => {
	let response;
	let packageDetails: any = {};
	if (!isLocalhost) {
		if(contractId) response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}?sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			// return response							
			throw new Error(message);
		}
		const responseData = await response?.json();
		return (responseData || {});
	}
	// to Work in local
	VendorContractsGridData.data?.forEach((obj: any) => { if (obj.id == contractId) packageDetails = obj });
	return packageDetails;
};

// Recently changed to By Vendor Contract ID

// export const fetchBudgetItemsByPackage = async (appInfo: any, packageId: string, bidderUniqueID: string) => {
// 	let response;
// 	if (!isLocalhost) {
// 		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/bids/${appInfo?.uniqueId}/packages/${packageId}/summary?sessionId=${appInfo?.sessionId}`);
// 		if (!response.ok) {
// 			const message = `API Request Error (${moduleName}): ${response.status}`;
// 			// return response							
// 			throw new Error(message);
// 		}
// 		const responseData = await response.json();
// 		return (responseData || {});
// 	}
// 	return WorkItems;
// };

export const fetchBudgetItemsByVendorContractId = async (appInfo: any, contractId: string) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/budgetitems?sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			// return response							
			throw new Error(message);
		}
		const responseData = await response.json();
		return (responseData || []);
	}
	return WorkItems;
};

export const updateContractDetails = async (appInfo: any, body: any, contractId: any) => {
	console.log('body', body, contractId)
	let response: any;
	if (!isLocalhost) {
		if (contractId) {
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}?sessionId=${appInfo?.sessionId}`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			const data = await response.json();
			return data;
		}
	}

};

export const deleteContract = async (appInfo: any, contractId: any) => {
	let response: any;
	if (!isLocalhost) {
		if (contractId) {
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}?sessionId=${appInfo?.sessionId}`, {
				method: 'DELETE',
				headers: { 'content-type': 'application/json' }
			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				return response							
				throw new Error(message);
			}
			console.log('delete contract')
		}
	}
};


export const postVendorContractsToConnector = async (appInfo: any, type: any, callback?:any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/postToConnector?connectorType=${type}&sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },

		});
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}
		const data = await response.json();
		callback && callback(data);
	}
};
