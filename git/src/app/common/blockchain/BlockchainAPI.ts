import {isLocalhost} from 'app/utils';
import {getServerInfo} from 'app/hooks';
/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Module wise Blockchain status check";

export const fetchBlockchainStatus = async (type: number) => {
	const server: any = getServerInfo();
	let response: any;
	if(!isLocalhost) {
		response = await fetch(`${server?.hostUrl}/EnterpriseDesktop/blockchain/FinanceBlockChain/IsBlockChainEnabled?sessionId=${server?.sessionId}&projectId=${server.uniqueId}&type=${type}`, {
			method: 'GET',
			// headers: {'content-type': 'application/json'}
		});
		return response;
	}

	return true;
};

export const blockchainAction = async (enable: boolean, type: number) => {
	const server: any = getServerInfo();
	let response: any;
	if(!isLocalhost) {
		response = await fetch(`${server?.hostUrl}/EnterpriseDesktop/blockchain/FinanceBlockChain/EnableDisableBlockChain?projectId=${server.uniqueId}&isEnabled=${enable}&type=${type}&sessionId=${server?.sessionId}`, {
			method: 'PATCH',
			// headers: {'content-type': 'application/json'}
		});
		return response;
	}

	return true;
};