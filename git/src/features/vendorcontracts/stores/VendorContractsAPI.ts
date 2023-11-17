import { isLocalhost } from 'app/utils';
import { triggerEvent } from 'utilities/commonFunctions';
import { ContactPerson, CompanyData, CompanyFiltersData, vcTransactions } from 'data/bids/bidList';
import { userCompanyData, userRolesData, bidLookUPData } from 'data/vendorContracts/userCompanyData';

const moduleName = "Vendor Contracts: Company Info";

export const fetchUserRoles = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		if (appInfo?.currentUserInfo?.userGlobalId) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Collaboration/LookupUsers?_dc=1681715207696&globalIds=${appInfo?.currentUserInfo?.userGlobalId}&sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			// return response							
			throw new Error(message);
		}
		const responseData = await response?.json();
		return responseData?.values[0]
	}
	return userRolesData?.values[0];
};

export const fetchBidLookup = async (appInfo: any, objectId: any) => {
	let response;
	if (!isLocalhost) {
		if (objectId) {
			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/awardedBids/${objectId}?excludeTiedToContracts=true&sessionId=${appInfo?.sessionId}`);
		}
		if (!response?.ok) {
			const message = `API Request Error(${moduleName}): ${response?.status}`;
			// return response							
			throw new Error(message);
		}
		const responseData = await response?.json();
		return responseData.data
	}
	return bidLookUPData.data
};

export const fetchCompanyData = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo.uniqueId}/vendors?search=&sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			// return response							
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data
	}
	return CompanyData?.data
};

export const fetchVendorContractTransactions = async (appInfo: any, contractId: any) => {
	let response;
	if (!isLocalhost) {
		//enterprisedesktop/api/v2/projects/0C64BEA8-8B90-4A6B-9946-A14F41C2676C/vendorcontracts/6B0D0DB4-C53A-4313-8256-40BE154EC62D/transactions
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo.uniqueId}/finance/vendorcontracts/${contractId}/transactions?search=&sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			// return response							
			throw new Error(message);
		}
		const data = await response.json();
		return data?.data;
	}
	return vcTransactions?.data;
};

// export const lockAndPostContract = async (appInfo: any, contractId: any, callback?: any) => {
// 	let response: any;
// 	if (!isLocalhost) {
// 		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/lock?sessionId=${appInfo?.sessionId}`, {
// 			method: 'POST',
// 			headers: { 'content-type': 'application/json' },
// 			// body: JSON.stringify(body),

// 		});
// 		if (!response.ok) {
// 			const message = `API Request Error (${moduleName}): ${response.status}`;
// 			throw new Error(message);
// 		}
// 		const data = await response.json();
// 		callback && callback(data);
// 	}

// };

// export const unLockContract = async (appInfo: any, contractId: any, callback?: any) => {
// 	let response: any;
// 	if (!isLocalhost) {
// 		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/unlock?sessionId=${appInfo?.sessionId}`, {
// 			method: 'POST',
// 			headers: { 'content-type': 'application/json' },
// 			// body: JSON.stringify(body),

// 		});
// 		if (!response.ok) {
// 			const message = `API Request Error (${moduleName}): ${response.status}`;
// 			throw new Error(message);
// 		}
// 		const data = await response.json();
// 		callback && callback(data);
// 	}

// };