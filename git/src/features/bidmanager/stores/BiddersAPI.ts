import { isLocalhost } from 'app/utils';
import { triggerEvent } from 'utilities/commonFunctions';
import { BiddersData } from 'data/bids/bidList';

const moduleName = "Bid Manager: Bidders Tab";

export const fetchBiddersList = async (appInfo: any, packageId: any) => {
	let response: any;
	if (!isLocalhost) {
		if (packageId) {
			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders?sessionId=${appInfo?.sessionId}`);
		}
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || []
	}

	return BiddersData?.data;
};

export const CreateBidders = async (appInfo: any, packageId: any, body: any) => {
	if (!isLocalhost) {
		if (packageId) {
			let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders?sessionId=${appInfo?.sessionId}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),

			});

			if (!response.ok) {
				const message = `API Request Error (${moduleName}): ${response.status}`;
				throw new Error(message);
			}
			const data = await response.json();
		}
	}
};

export const deleteBidders = async (appInfo: any, packageId: any, bidderId: any) => {
	let response;
	if (!isLocalhost) {
		if (packageId && bidderId) {
			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderId}?sessionId=${appInfo?.sessionId}`,
				{
					method: 'DELETE',
					headers: { 'content-type': 'application/json' }
				}
			);

			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				throw new Error(message);
			}
			return response;
		}
	}
};