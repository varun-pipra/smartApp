import {isLocalhost} from 'app/utils';
import {ClientGridData} from 'data/clientContracts/gridData';
import {clientRequest} from '../utils';

const moduleName = "Client Contracts: Grid Data";

export const createClientContract = async (appInfo: any, body: any, callback?: any) => {
	console.log('body', body);
	const options = {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body),
	};
	if(!isLocalhost) {
		const response = await clientRequest(appInfo, '', options);
		callback && callback(response);
	}
};

export const fetchClientContracts = async (appInfo: any) => {
	if(!isLocalhost) {
		const response = await clientRequest(appInfo, '?offset=0&limit=20000', {});
		return response?.data;
	}
	return ClientGridData?.data;
};

export const fetchClientContractsDetailById = async (appInfo: any, contractId: string) => {
	let contractDetails: any = {};
	if(!isLocalhost) {
		if(contractId) return await clientRequest(appInfo, `/${contractId}`, {});
	}
	// to Work in local
	ClientGridData.data?.forEach((obj: any) => {if(obj.id == contractId) contractDetails = obj;});
	return contractDetails;
};

export const updateClientContractDetails = async (appInfo: any, contractId: string, body: any, callback?: any) => {
	console.log("body", body, contractId);
	const options = {
		method: 'PATCH',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body),
	};

	if(!isLocalhost) {
		if(contractId) {
			const response = await clientRequest(appInfo, `/${contractId}`, options);
			callback && callback(response);
		}
	}
};
export const deleteClientContract = async (appInfo: any, contractId: string, callback?: any) => {
	const options = {
		method: 'DELETE',
		headers: {'content-type': 'application/json'},
		// body: JSON.stringify(body),
	};
	if(!isLocalhost) {
		const response = await clientRequest(appInfo, `/${contractId}`, options, true);
		callback && callback(response);
	}
};

export const postClientContractsToConnector = async (appInfo: any, type: any, callback?: any) => {
	const options = {
		method: 'POST',
		headers: {'content-type': 'application/json'},
	};
	if(!isLocalhost) {
		const response = await clientRequest(appInfo, `/postToConnector?connectorType=${type}`, options);
		callback && callback(response);
	}
};