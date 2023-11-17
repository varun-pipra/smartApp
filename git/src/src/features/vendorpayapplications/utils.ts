export const isUserGCForVPA = (appInfo: any) => {
	if (appInfo?.gblConfig?.isAdmin || appInfo?.gblConfig?.isProjectAdmin) return true;
	if (Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Vendor Pay Manager')) return true;
	if (Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Sub Contract Pay Manager')) return false;
	return 'Not Authorized';
}

export const payAppsRequest = async (appInfo: any, endPoint: string, opts: any, deleteMethod=false) => {
	const baseURL: string = `${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorpayapps`
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