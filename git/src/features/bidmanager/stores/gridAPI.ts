import {isLocalhost} from 'app/utils';
import {list} from 'data/bids/bidList';


const getPayloadInRequiredFormat = (payload: any) => {
	var formBody: any = [];
	for (var property in payload) {
		var encodedKey = encodeURIComponent(property);
		var encodedValue = encodeURIComponent(payload[property]);
		formBody.push(encodedKey + "=" + encodedValue);
	};
	formBody = formBody.join("&");
	return formBody;
}
const moduleName = "Bid Manager: Grid Data";

export const fetchBidPackageList = async (appInfo: any) => {
	if (!isLocalhost) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/packages?sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || [];
	}

	return list;
};

export const createBidPackage = async (appInfo: any, body: any) => {
	const payload: any = getPayloadInRequiredFormat(body);
	let response: any;
	if (!isLocalhost) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/packages?sessionId=${appInfo?.sessionId}`, {
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
};

export const fetchBidPackage = async (appInfo: any, packageId: any) => {
	if (!isLocalhost && packageId) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/packages/${packageId}?sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}

		const responseData = await response.json();
		return responseData || {};
	}

	const packageDetails = list.find((obj: any) => obj.id === packageId);
	return {...packageDetails,"specifications": [
        {
            "": 1,
            "id": "64a4bf2e-fccc-49fe-b28f-8f4d23cc4af6",
            "title": "REQUEST FOR INFORMATION",
            "division": "01 - General Requirement",
            "number": "05510",
            "startPage": 5,
            "endPage": 10,
            "specBook": "A3.6.pdf"
        }
    ]};
};

export const updateBidPackage = async (appInfo: any, packageId: any, body: any) => {
	const payload: any = getPayloadInRequiredFormat(body);

	if (!isLocalhost) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/packages/${packageId}?sessionId=${appInfo?.sessionId}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),

		});
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}

		const data = await response.json();
		return data;
	}

	return {};
};

export const deleteBidPackages = async (appInfo: any, packageId: any) => {
	if (!isLocalhost) {
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/packages/${packageId}?sessionId=${appInfo?.sessionId}`,
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

export const patchBidPackage = async (appInfo: any, packageId: any, body: any) => {
	let response;
	if (!isLocalhost) {
		if (packageId) {
			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/packages/${packageId}?sessionId=${appInfo?.sessionId}`, {
				method: 'PATCH',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(body),
			});

			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				throw new Error(message);
			}
			const data = await response?.json();
			return data;
		}
	}

	return {};
};

export const postBidsToConnector = async (appInfo: any, type:number, callback?:any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/bids/${appInfo?.uniqueId}/postToConnector?connectorType=${type}&sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			// body: JSON.stringify(body),
		});

		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const data = await response?.json();
		callback && callback(data);
	}
	return {};
};