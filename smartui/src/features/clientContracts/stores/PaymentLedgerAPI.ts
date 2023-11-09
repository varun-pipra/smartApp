import { isLocalhost } from "app/utils";
import { ccChangeEvents } from "data/clientContracts/changeEvents";
import { CCPaymentLedgerGridData } from "data/clientContracts/PaymentLedger";
import { clientRequest } from '../utils';

const moduleName = "Client Contracts Budgets: Payment Ledger";

export const fetchPaymentLedgerList = async (appInfo: any, contractId: any) => {

	let response;
	if (!isLocalhost) {
		if (contractId) {

			response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.uniqueId}/finance/clientpayapps?clientcontractid=${contractId}&sessionId=${appInfo?.sessionId}`);
			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				throw new Error(message);
			}
			const responseData = await response?.json();
			return responseData?.data
		}
	}
	return CCPaymentLedgerGridData?.data
};

export const fetchClientContractChangeEvents = async (appInfo: any, contractId:string) => {
	let response;
	if (!isLocalhost) {
		if (contractId) {
		
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo.uniqueId}/finance/clientcontracts/${contractId}/changeevents?sessionId=${appInfo?.sessionId}`);
			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				// return response							
				throw new Error(message);
			}
			const responseData = await response?.json();
			return responseData
		}
	}
	return ccChangeEvents;
};