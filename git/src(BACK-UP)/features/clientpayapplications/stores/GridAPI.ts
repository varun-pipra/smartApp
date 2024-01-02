import { isLocalhost } from 'app/utils';
import { ClientPayAppsData } from 'data/clientpayapps/gridData';
import { VendorContractDetails, VendorContractsGridData } from 'data/vendorContracts/gridData';
import { WorkItems } from 'data/vendorContracts/scheduleOfValues';
import { triggerEvent } from 'utilities/commonFunctions';
import { clientPayAppsRequest } from '../utils';
const moduleName = "Client Vendor Pay Apps: Grid Data";

export const createClientPayApp = async (appInfo: any, body: any, callback?: any) => {
	console.log('createClientPayApp', body)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, '', options);
		callback && callback(response);
	}
};

export const fetchClientPayApps = async (appInfo: any) => {
	
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, '?offset=0&limit=10000', {});
		return response?.data
    }
    return ClientPayAppsData?.data
};

export const fetchClientPayAppDetails = async (appInfo: any, clientPayAppId:string) => {
	console.log("detailsss", clientPayAppId)
	let clientPayAppDetails:any = {}
	if (!isLocalhost) {
		if(clientPayAppId) {
			const response = await clientPayAppsRequest(appInfo, `/${clientPayAppId}`, {});
			return response
		}
    }
	ClientPayAppsData.data?.forEach((obj: any) => { if (obj.id == clientPayAppId) clientPayAppDetails = obj });
	return clientPayAppDetails;
}

export const deletePayApp = async (appInfo: any, payAppId:string, callback?:any) => {
	const options = {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        // body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}`, options, true);
		callback && callback(response);
    }
};

export const patchClientPayAppDetails = async (appInfo: any, body:any, payAppId:string, callback?:any) => {
	console.log("patchClientPayAppDetails", payAppId, body)
	
	const options = {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}`, options);
		callback && callback(response);
    }
};