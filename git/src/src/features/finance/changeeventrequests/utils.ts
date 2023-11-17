
export const changeEventRequest = async (appInfo: any, endPoint: string, opts: any, deleteMethod=false) => {
	const baseURL: string = `${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/vendorpayapps`
	const session = endPoint?.includes('?') ? `&sessionId=${appInfo?.sessionId}` : `?sessionId=${appInfo?.sessionId}`
	const URL = baseURL + endPoint + session;
	const options = opts ? opts : {};
	const response = await fetch(URL, options);
	if (!response.ok) {
		const message = `API Request Error Client Contracts: ${response.status}`;
		throw new Error(message);
	}
	if(deleteMethod) {
		return response;
	} 
	const data = await response.json();
	return data;
}