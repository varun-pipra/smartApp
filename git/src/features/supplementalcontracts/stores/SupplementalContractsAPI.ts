import { isLocalhost } from 'app/utils';
import { contracts } from './supplementalContracts';

const moduleName = "Supplemental Contracts: List";

export const fetchSupplementalContracts = async (appInfo: any, categories: Array<any> = []) => {
	if (isLocalhost)
		return contracts;
	else {
		let params: URLSearchParams = new URLSearchParams({ sessionId: appInfo?.sessionId });
		if (categories && categories.length > 0) {
			categories.map((cat) => params.append('categories', cat));
		}
		let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo.uniqueId}/supplementalContractFiles?${params.toString()}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const contractResponse = await response.json();
		return contractResponse.data;
	}
};