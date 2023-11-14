import { isLocalhost } from 'app/utils';
import { VendorContractDetails, VendorContractsGridData } from 'data/vendorContracts/gridData';
import { WorkItems } from 'data/vendorContracts/scheduleOfValues';
import { VendorPayAppsGridData, vendorPayAppsGridData } from 'data/vendorpayapplications/gridData';
import { triggerEvent } from 'utilities/commonFunctions';
import { clientPayAppsRequest } from '../utils';

const moduleName = "Client Pay Apps : SOV ";

export const addPaymentToPayApp = async (appInfo: any, body: any, payAppId:string, callback?: any) => {
	console.log('body', body, payAppId)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}/billingschedule/payments`, options);
		callback && callback(response);
	}
};

export const removePaymentFromPayApp = async (appInfo: any, payAppId:string, paymentId:string, callback?:any) => {
	const options = {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        // body: JSON.stringify(body),
	}
	if (!isLocalhost) {
		const response = await clientPayAppsRequest(appInfo, `/${payAppId}/billingschedule/payments/${paymentId}`, options, true);
		callback && callback(response);
    }
};
