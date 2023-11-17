import { isLocalhost } from 'app/utils';
import { clientRequest } from '../utils';

const moduleName = "Client Contracts: Button Actions";

export const lockAndPostContract = async (appInfo: any, contractId: any, callback?: any) => {
	if (!isLocalhost) {
		const options = { method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(body),			
		}
		const response = await clientRequest(appInfo, `/${contractId}/lock`, options);
		callback && callback(response);
	}
};

export const activateClientContract = async (appInfo: any, contractId: any, callback?: any) => {
	if (!isLocalhost) {
		const options = { method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(body),			
		}
		const response = await clientRequest(appInfo, `/${contractId}/activate`, options);
		callback && callback(response);
	}
};

export const unLockContract = async (appInfo: any, contractId: any, callback?: any) => {
	if (!isLocalhost) {
		const options = { method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(body),			
		}
		const response = await clientRequest(appInfo, `/${contractId}/unlock`, options);
		callback && callback(response);
	}
};

export const declineContract = async (appInfo: any, contractId: any, body:any,callback?: any) => {
	if (!isLocalhost) {
		const options = { method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),			
		}
		const response = await clientRequest(appInfo, `/${contractId}/decline`, options);
		callback && callback(response);
	}
};
export const reviseContract = async (appInfo: any, contractId: any, body:any, callback?: any) => {
	if (!isLocalhost) {
		const options = { method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),			
		}
		const response = await clientRequest(appInfo, `/${contractId}/revise`, options);
		callback && callback(response);
	}
};
export const acceptContract = async (appInfo: any, contractId: any, body:any, callback?: any) => {
	console.log("accept body ", body)
	if (!isLocalhost) {
		const options = { method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),			
		}
		const response = await clientRequest(appInfo, `/${contractId}/accept`, options);
		callback && callback(response);
	}
};

export const cancelAndLockContract = async (appInfo: any, contractId: any, callback?: any) => {
	if (!isLocalhost) {
		const options = { method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(body),			
		}
		const response = await clientRequest(appInfo, `/${contractId}/cancelandlock`, options);
		callback && callback(response);
	}
};