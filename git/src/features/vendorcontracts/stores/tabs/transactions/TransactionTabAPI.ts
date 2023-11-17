import { isLocalhost } from 'app/utils';
import { transactionsTabData } from './VCTransactionsData';

const moduleName = "Vendor Contracts: Transactions";

export const fetchVendorContractTransactions = async (appInfo: any, contractId: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo.uniqueId}/finance/vendorcontracts/${contractId}/transactions?sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const data = await response.json();
		return data;
	}
	return transactionsTabData;
};