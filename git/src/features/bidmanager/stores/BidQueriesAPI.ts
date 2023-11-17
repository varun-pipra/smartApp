import { isLocalhost } from 'app/utils';
import { triggerEvent } from 'utilities/commonFunctions';
import { BidQueriesData } from 'data/bids/bidList';

const moduleName = "Bid Manager: Bid Queries";

export const fetchBidQueriesByPackageAndBidder = async (appInfo: any, packageId: any, bidderId: any) => {
	if (!isLocalhost) {
		if (packageId && bidderId) {
			let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderId}/query?sessionId=${appInfo?.sessionId}`);
			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				throw new Error(message);
			}
			const responseData = await response.json();
			return responseData?.data || [];
		} else return [];
	}

	return BidQueriesData?.data;
};

export const fetchBidQueriesByPackage = async (appInfo: any, packageId: any) => {
	if (!isLocalhost) {
		if (packageId) {
			let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/query?sessionId=${appInfo?.sessionId}`);
			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				throw new Error(message);
			}
			const responseData = await response.json();
			return responseData?.data || [];
		} else return [];
	}

	return BidQueriesData?.data;
};

export const CreateBidQueries = async (appInfo: any, packageId: any, bidderId: any, body: any) => {
	if (!isLocalhost) {
		if (packageId && bidderId) {
			let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderId}/query?sessionId=${appInfo?.sessionId}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				throw new Error(message);
			}
			const data = await response.json();
		}
	}

	return {};
};

export const ResponseBidQueries = async (appInfo: any, packageId: any, bidderId: any, queryId: any, body: any) => {
	if (!isLocalhost) {
		if (packageId && bidderId) {
			let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderId}/query/${queryId}/response?sessionId=${appInfo?.sessionId}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body)
			});
			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				throw new Error(message);
			}
			const data = await response.json();
		}
	}

	return {};
};