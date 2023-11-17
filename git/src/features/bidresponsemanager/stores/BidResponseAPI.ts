import {isLocalhost} from 'app/utils';
import {BidResponseData} from 'data/bids/bidResponseList';

const moduleName = "Bid Response: LID";

export const fetchBidResponseList = async (appInfo: any, bidderId: any) => {
	let response;
	if(!isLocalhost) {
		if(bidderId) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${bidderId}/response?sessionId=${appInfo?.sessionId}`);
		if(response && !response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
		return (responseData || {});
	}

	return BidResponseData;
};

export const AddBidResponsePackage = async (appInfo: any, bidderUniqueId: any, projectUniqueId: any, body: any, callback?: any) => {

	let response: any;
	if(!isLocalhost) {
		if(bidderUniqueId && projectUniqueId) {
			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${bidderUniqueId}/response/${projectUniqueId}?sessionId=${appInfo?.sessionId}`, {
				method: 'POST',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify(body)
			});
		}

		if(response && !response?.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}

		const data = await response?.json();
		callback && callback(data);
	}
};

export const UpdateBidResponse = async (appInfo: any, bidderUniqueId: any, body: any, callback?: any) => {
	let response: any;
	if(!isLocalhost) {
		if(bidderUniqueId) {
			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${bidderUniqueId}/response?sessionId=${appInfo?.sessionId}`, {
				method: 'PATCH',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify(body)
			});
		}

		if(response && !response?.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}

		const data = await response?.json();
		callback && callback(data);
	}
};