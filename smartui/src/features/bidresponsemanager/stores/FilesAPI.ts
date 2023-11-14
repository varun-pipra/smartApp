import {isLocalhost} from 'app/utils';

const moduleName = "Bid Response Manager: Reference Files";

export const uploadReferenceFile = async (appInfo: any, body: any, bidderId: string) => {
	let response;
	if(!isLocalhost && bidderId) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/bids/${bidderId}/response?sessionId=${appInfo?.sessionId}`, {
			method: 'PATCH',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body)
		});

		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}

		const responseData = await response.json();
		return responseData;
	}
};

export const uploadLocalFile = async (appInfo: any, file: any) => {
	let response;
	let fileObject = new FormData();
	fileObject.append('file', file);
	if(!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/streams?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: fileObject
		});

		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData;
	}
};