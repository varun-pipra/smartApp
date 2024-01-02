

export const clientRequest = async (appInfo:any, endPoint:string, opts:any, deleteMethod=false) => {
    console.log("clientRequest", appInfo, endPoint, opts)
    const baseURL:string = `${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/clientcontracts`
    const session = endPoint?.includes('?') ? `&sessionId=${appInfo?.sessionId}` : `?sessionId=${appInfo?.sessionId}`
    const URL = baseURL + endPoint + session;
    const options = opts ? opts : {};
    console.log("URL", URL, options)
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

export const isUserGCForCC = (appInfo:any) => {
    if(appInfo?.gblConfig?.isAdmin) return true;
    if(Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Vendor Contract Manager')) return true;
    if(Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Client Contract Manager')) return false;
    return 'Not Authorized';
  }