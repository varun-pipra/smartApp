import { isLocalhost } from 'app/utils';

const moduleName = "Vendor Contracts: Button Actions";

export const lockAndPostContract = async (appInfo: any, contractId: any, callback?: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/lock?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' }

		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}

		const data = await response.json();
		callback && callback(data);
	}
};

export const activateContract = async (appInfo: any, contractId: any, callback?: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/activate?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' }

		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}

		const data = await response.json();
		callback && callback(data);
	}
};

export const unLockContract = async (appInfo: any, contractId: any, callback?: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/unlock?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' }

		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}

		const data = await response.json();
		callback && callback(data);
	}
};

export const declineContract = async (appInfo: any, contractId: any, body:any,callback?: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/decline?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),			

		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}

		const data = await response.json();
		callback && callback(data);
	}
};
export const reviseContract = async (appInfo: any, contractId: any, body:any, callback?: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/revise?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),						

		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}

		const data = await response.json();
		callback && callback(data);
	}
};
export const acceptContract = async (appInfo: any, contractId: any, body:any, callback?: any) => {
	let response: any;
	console.log("accept body ", body)
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/accept?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),						

		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}

		const data = await response.json();
		callback && callback(data);
	}
};

export const cancelAndLockContract = async (appInfo: any, contractId: any, callback?: any) => {
	let response: any;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/cancelandlock?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' }

		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			return response							
			throw new Error(message);
		}

		const data = await response.json();
		callback && callback(data);
	}
};