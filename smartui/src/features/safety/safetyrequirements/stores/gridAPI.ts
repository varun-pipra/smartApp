import { isLocalhost } from 'app/utils';
import { SafetyRequrAppsGridData } from 'data/safety/gridData';

import { triggerEvent } from 'utilities/commonFunctions';

const moduleName = "Safety Requirement: Grid Data";


export const fetchSafetyRequirementList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/TaskAnalysis.iapi/GetAllSTACategories?${appInfo?.uniqueId}?sessionId=${appInfo?.sessionId}`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return (responseData?.values || []);
	}
	else {
		response = await fetch(`https://9f58487c-ef29-4c15-a0dc-82d1c8c800b6.mock.pstmn.io/EnterpriseDesktop/Safety/TaskAnalysis.iapi/GetAllSTACategories?projectId=531979`);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return (responseData?.values || []);
	}
};
