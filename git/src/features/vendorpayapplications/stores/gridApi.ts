import { isLocalhost } from 'app/utils';
import { VendorContractDetails, VendorContractsGridData } from 'data/vendorContracts/gridData';
import { WorkItems } from 'data/vendorContracts/scheduleOfValues';
import { VendorPayAppsGridData, vendorPayAppsGridData } from 'data/vendorpayapplications/gridData';
import { triggerEvent } from 'utilities/commonFunctions';
import { payAppsRequest } from '../utils';

const moduleName = "Vendor Pay Apps: Grid Data";

export const createVendorPayApps = async (appInfo: any, body: any, callback?: any) => {
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, '', options);
		callback && callback(response);
	}
};

export const fetchVendorPayApps = async (appInfo: any) => {
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, '?offset=0&limit=20000', {});
		return response?.data
	}
	return vendorPayAppsGridData?.data
};

export const fetchVendorPayAppDetails = async (appInfo: any, payAppId: string) => {
	let payAppDetails: any = {}
	if (!isLocalhost) {
		if (payAppId) {
			const response = await payAppsRequest(appInfo, `/${payAppId}`, {});
			return response
		}
	}
	vendorPayAppsGridData.data?.forEach((obj: any) => { if (obj.id == payAppId) payAppDetails = obj });
	return payAppDetails;
}

export const deletePayApp = async (appInfo: any, payAppId: string, callback?: any) => {
	const options = {
		method: 'DELETE',
		headers: { 'content-type': 'application/json' },
		// body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}`, options, true);
		callback && callback(response);
	}
};

export const patchVendorPayAppDetails = async (appInfo: any, body: any, payAppId: string, callback?: any) => {
	console.log("patchVendorPayAppDetails", payAppId, body)

	const options = {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}`, options);
		callback && callback(response);
	}
};

export const postVendorPayAppsToConnector = async (appInfo: any, type: any, callback?: any) => {
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
	}
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/postToConnector?connectorType=${type}`, options);
		callback && callback(response);
	}
};