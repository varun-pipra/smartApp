
import { getServerInfo } from 'app/hooks';
import { isLocalhost } from 'app/utils';
import { BidResponseData, getTextOccurencesRes } from 'data/bids/bidList';
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

export const getTextOccurences = async (body:any) => {
    let response;
    const server: any = getServerInfo();
    if(!isLocalhost) {
        response = await fetch(`${server?.hostUrl}/EnterpriseDesktop/Editor/GetTextOccurences?sessionId=${server?.sessionId}`, {
            method: 'POST',
            body: body,
            headers: {'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        });

        if(!response.ok) {
            const message = `API Request Error (${moduleName}): ${response.status}`;
            throw new Error(message);
        }
        const responseData = await response.json();
        return responseData;
    }
    return getTextOccurencesRes;
};