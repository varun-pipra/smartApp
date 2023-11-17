import { isLocalhost } from 'app/utils';
import { BidResponseData } from 'data/bids/bidList';
import { triggerEvent } from 'utilities/commonFunctions';
import { bidResponsePackage } from 'data/bids/bidList';

const moduleName = "Bid Response Manager: Grid Data";

export const fetchBidResponseList = async (appInfo: any) => {
	if (!isLocalhost) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${appInfo?.currentUserInfo?.userid}/responseManager?sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || []
	}

	return BidResponseData?.data;
};

export const fetchBidResponseDetails = async (appInfo: any, responseId: any) => {
	let response;
	let responseDetails: any = {};
	if (!isLocalhost) {
		if (responseId) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/package/${responseId}/response?sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return (responseData || {});
	}


	return bidResponsePackage;
};
export const deleteBidResponcePackages = async (appInfo: any, bidderUniqueId: any) => {
	console.log('deleteBidResponcePackages', appInfo, bidderUniqueId);
	if (!isLocalhost) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${bidderUniqueId}/response?sessionId=${appInfo?.sessionId}`,
			{
				method: 'DELETE',
				headers: { 'content-type': 'application/json' },

			}
		);

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
	}
};