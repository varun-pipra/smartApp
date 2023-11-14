import { isLocalhost } from 'app/utils';
import { AwardBidDetails } from 'data/bids/awardBidList';
const moduleName = "Bid Manager: Award Bid Details";

export const fetchAwardBidDetails = async (appInfo: any, packageId: any, bidderUniqueID: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderUniqueID}?sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData
	}

	return AwardBidDetails;
};

export const awardBid = async (appInfo: any, packageId: any, bidderUniqueID: any) => {
	if (!isLocalhost) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderUniqueID}/awardbid?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}

		const data = await response.json();
		return data;
	}
};

export const updateBudget = async (appInfo: any, packageId: any, bidderUniqueID: any, callback?: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderUniqueID}/updatebudget?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
			// body: payload,
		});
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const data = await response.json();
		callback && callback(data);
	}
};