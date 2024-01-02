import { isLocalhost } from 'app/utils';

/**
 * This function fetches the list of Costcode dropdown optins
 */
const moduleName = "Vendor: Grid Data";

export const fetchVendorDataList = async (appInfo: any) => {
	// This is the ,mock api which contains same data of original api. 
	// Once if we can read the project id and session token you can replace this with original api
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/admin/companies?sessionId=${appInfo?.sessionId}`);	
	else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/company', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		}
		);
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();
    // console.log("Vendor: Grid Data responseData", responseData)
	return isLocalhost ? responseData : (responseData?.values || []);
};