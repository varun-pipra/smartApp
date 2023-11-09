import { isLocalhost } from 'app/utils';
import { transactionsTabData } from './CCTransactionsData';

const moduleName = "Client Contracts: Transactions";

export const fetchClientContractTransactions = async (appInfo: any, contractId: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo.uniqueId}/finance/clientcontracts/${contractId}/transactions?sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const data = await response.json();
		return data;
	}
	return transactionsTabData;
};