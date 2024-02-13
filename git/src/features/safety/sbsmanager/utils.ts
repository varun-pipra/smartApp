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

export const GetUniqueList = (data: any, key?: any) => {
    let unique: any = [];
    data?.map((x: any) => unique?.filter((a: any) => a?.[key] === x?.[key])?.length > 0 ? null : unique.push(x));
    unique?.sort((a: any, b: any) => a?.[key]?.localeCompare(b?.[key], undefined, { numeric: true }));
    return unique;
  };
export const findAndUpdateFiltersData = (filterOptions:any, data: any,key: string, nested?: boolean, nestedKey?: any) => {
    const formattedData = data?.map((rec: any) => {
      if(Array.isArray(rec?.[key])) {
          let data:any = [];
          (rec?.[key] || []).forEach((item:any) => {
            data.push({
              text: item?.[key] === "" ? "NA" : item?.[key] ?? item?.["name"],
              value: item?.[key] === "" ? "NA" : item?.[key] ?? item?.["name"],
              id: item?.id,
            })
          });
        
          return data;
      } else if (nested)
        return {
          text: rec?.[key]?.[nestedKey] ?? 'NA',
          value: rec?.[key]?.[nestedKey] ?? 'NA',
          id: rec?.[key]?.id,
        };
      else
        return {
          text: rec?.[key] === "" ? "NA" : rec?.[key] ?? rec?.["name"],
          value: rec?.[key] === "" ? "NA" : rec?.[key] ?? rec?.["name"],
          id: rec?.id,
        };
    });
    console.log('formattedData',formattedData)
    const filtersCopy: any = [...filterOptions];
    let currentItem: any = filtersCopy.find((rec: any) => rec?.keyValue === key);
    currentItem.children.items = GetUniqueList(formattedData?.flat(), "text");
	let mapData = [...filterOptions].map((item:any) => {
		if(item.key === currentItem.key) return currentItem;
		else return item;
	});
	return mapData;
  };
