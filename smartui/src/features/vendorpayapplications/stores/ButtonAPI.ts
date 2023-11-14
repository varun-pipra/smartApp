import { isLocalhost } from 'app/utils';
import { VendorContractDetails, VendorContractsGridData } from 'data/vendorContracts/gridData';
import { WorkItems } from 'data/vendorContracts/scheduleOfValues';
import { VendorPayAppsGridData, vendorPayAppsGridData } from 'data/vendorpayapplications/gridData';
import { triggerEvent } from 'utilities/commonFunctions';
import { payAppsRequest } from '../utils';

const moduleName = "Vendor Pay Apps : Button APIS ";

export const submitPayApp = async (appInfo: any, payAppId: string, callback?: any) => {
	console.log('submitPayApp', payAppId)
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}/submit`, options);
		callback && callback(response);
	}
};

export const rejectPayApp = async (appInfo: any, body: any, payAppId: string, callback?: any) => {
	console.log('body', body, payAppId)
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}/reject`, options);
		callback && callback(response);
	}
};


export const authorizePayApp = async (appInfo: any, body: any, payAppId: string, callback?: any) => {
	console.log('body', body, payAppId)
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}/authorize`, options);
		callback && callback(response);
	}
};

export const paymentSent = async (appInfo: any, body: any, payAppId: string, callback?: any) => {
	console.log('body', body, payAppId)
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}/paymentsent`, options);
		callback && callback(response);
	}
};

export const paymentReceived = async (appInfo: any, body: any, payAppId: string, callback?: any) => {
	console.log('body', body, payAppId)
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}/paymentreceived`, options);
		callback && callback(response);
	}
};