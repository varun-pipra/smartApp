import { isLocalhost } from 'app/utils';
import { payAppsRequest } from '../utils';

const moduleName = "Vendor Pay Apps : SOV ";

export const addPaymentToPayApp = async (appInfo: any, body: any, payAppId:string, callback?: any) => {
	console.log('body', body, payAppId)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = await payAppsRequest(appInfo, `/${payAppId}/scheduleofvalues`, options);
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
		const response = await payAppsRequest(appInfo, `/${payAppId}/scheduleofvalues/${paymentId}`, options);
		callback && callback(response);
    }
};
