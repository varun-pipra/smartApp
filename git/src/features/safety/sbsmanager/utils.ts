export const PhasesColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#03A9F4",
  "#009688",
  "#8BC34A",
  "#E8812A",
  "#795548",
  "#607D8B",
  "#9E9E9E",
];

export const sbsRequest = async (appInfo: any, endPoint: string, opts: any, deleteMethod=false) => {
	const baseURL: string = `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}`
	const session = endPoint?.includes('?') ? `&sessionId=${appInfo?.sessionId}` : `?sessionId=${appInfo?.sessionId}`
	const URL = baseURL + endPoint + session;
	const options = opts ? opts : {};
	const response = await fetch(URL, options);
	if (!response.ok) {
		const message = `API Request Error SBS: ${response.status}`;
		throw new Error(message);
	}
	if(deleteMethod) {
		return response;
	} 
	const data = await response.json();
	return data;
}
