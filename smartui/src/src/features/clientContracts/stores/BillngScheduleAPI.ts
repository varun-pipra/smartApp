import { isLocalhost } from 'app/utils';
import { clientRequest } from '../utils';

export const createBillingSchedule = async (appInfo: any, contractId:any, body: any, callback?: any) => {
	console.log('body', body)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = contractId && await clientRequest(appInfo, `/${contractId}/billingschedule`, options);
		callback && callback(response);
	}
};

export const addBillingSchedulePayment = async (appInfo: any, contractId:any, body: any, callback?: any) => {
	console.log('body', body)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = contractId && await clientRequest(appInfo, `/${contractId}/billingschedule/payments`, options);
		callback && callback(response);
	}
};

export const deleteBillingScheduleByContract = async (appInfo: any, contractId:any, callback?: any) => {
    const options = {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        // body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = contractId && await clientRequest(appInfo, `/${contractId}/billingschedule`, options, true);
		callback && callback(response);
	}
};

export const deletePayment = async (appInfo: any, contractId:any, paymentId:string, callback?: any) => {
	// console.log('body', body)
    const options = {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        // body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = contractId && await clientRequest(appInfo, `/${contractId}/billingschedule/payments/${paymentId}`, options, true);
		callback && callback(response);
	}
};

export const updatePayment = async (appInfo: any, contractId:any, body: any, paymentId:string, callback?: any) => {
	console.log('body', body)
    const options = {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = contractId && await clientRequest(appInfo, `/${contractId}/billingschedule/payments/${paymentId}`, options);
		callback && callback(response);
	}
};

export const updatePayWhenPaid = async (appInfo: any, contractId:any, body: any, callback?: any) => {
	console.log('body', body)
    const options = {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    }
	if (!isLocalhost) {
		const response = contractId && await clientRequest(appInfo, `/${contractId}/billingschedule`, options);
		callback && callback(response);
	}
};