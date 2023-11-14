import { isLocalhost } from 'app/utils';
import { contractDetail } from './VCContractFilesData';

const moduleName = "Vendor Contracts: Files";

export const addContractFiles = async (appInfo: any, contractId: any, files: Array<any>) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo.uniqueId}/finance/vendorcontracts/${contractId}/files?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(files),

		});
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const jsonResponse = await response.json();
		return jsonResponse.files;
	}
	return contractDetail.files;
};

export const deleteContractFiles = async (appInfo: any, contractId: any, files: Array<any>) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo.uniqueId}/finance/vendorcontracts/${contractId}/files?sessionId=${appInfo?.sessionId}`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(files),

		});
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
	}
	return;
};

export const uploadLocalFile = async (appInfo: any, file: any) => {
	let response;
	let fileObject = new FormData();
	fileObject.append('file', file);
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/streams?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: fileObject
		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData;
	}
};