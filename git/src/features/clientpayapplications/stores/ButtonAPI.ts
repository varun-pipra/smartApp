import { isLocalhost } from 'app/utils';
import { VendorContractDetails, VendorContractsGridData } from 'data/vendorContracts/gridData';
import { WorkItems } from 'data/vendorContracts/scheduleOfValues';
import { VendorPayAppsGridData, vendorPayAppsGridData } from 'data/vendorpayapplications/gridData';
import { triggerEvent } from 'utilities/commonFunctions';
import { clientPayAppsRequest } from '../utils';

const moduleName = "Client Pay Apps : Button APIS ";

export const submitPayApp = async (appInfo: any, payAppId:string, callback?: any) => {
	console.log('body', payAppId)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}/submit`, options);
		callback && callback(response);
	}
};

export const rejectPayApp = async (appInfo: any, body: any, payAppId:string, callback?: any) => {
	console.log('body', body, payAppId)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}/reject`, options);
		callback && callback(response);
	}
};


export const authorizePayApp = async (appInfo: any, body: any, payAppId:string, callback?: any) => {
	console.log('body', body, payAppId)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}/authorize`, options);
		callback && callback(response);
	}
};

export const paymentSent = async (appInfo: any, body: any, payAppId:string, callback?: any) => {
	console.log('body', body, payAppId)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost && payAppId) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}/paymentsent`, options);
		callback && callback(response);
	}
};

export const paymentReceived = async (appInfo: any, body: any, payAppId:string, callback?: any) => {
	console.log('body', body, payAppId)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}/paymentreceived`, options);
		callback && callback(response);
	}
};