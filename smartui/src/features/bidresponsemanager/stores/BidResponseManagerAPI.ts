
import { isLocalhost } from 'app/utils';
import { BidResponseData } from 'data/bids/bidList';
import { triggerEvent } from 'utilities/commonFunctions';

const moduleName = "Bid Response Manager: Grid Data";

export const patchDeclineAndIntendToBid = async (appInfo: any, packageId: any, bidderUniqueId: any, body: any, callback?: any) => {
	let response;
	if (!isLocalhost) {
		if (packageId && bidderUniqueId) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${packageId}/bidders/${bidderUniqueId}?sessionId=${appInfo?.sessionId}`,
			{
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body)
			}
		);
	}
	if (!response?.ok) {
		const message = `API Request Error (${moduleName}): ${response?.status}`;
		throw new Error(message);
	}

	callback && callback(response);
};