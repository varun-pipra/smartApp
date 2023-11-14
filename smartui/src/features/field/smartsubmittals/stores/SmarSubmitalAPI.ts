import { getServerInfo } from "app/hooks";
import { isLocalhost } from "app/utils";
import { smartSubmitalDetailList, smartSubmittalFlatList, smartList,submittalById } from "data/smartsubmittals/smartsubmittals";
const moduleName = "Smart Submital";

export const fetchSmartSubmitalGridList = async (payload:any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    if(payload.type === 'default') {
      response =   await fetch(
        `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections?sessionId=${appInfo?.sessionId}&specbookId=`
      );
    } else {
      response =  await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals?sessionId=${appInfo?.sessionId}`
      );
    }
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.data || [];
  } else  {
    // if(payload.type === 'default') {
    //   response =   await fetch('https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/api/v2/specmanager/6e83792a-3e66-49d6-9442-c6a1e918b48f/sections?sessionId=8ec117bd7a254e78a1e2785f7fcd22ce&specbookId=');
    // } else {
    //   response =  await fetch('https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/api/v2/specmanager/6e83792a-3e66-49d6-9442-c6a1e918b48f/submittals?sessionId=8ec117bd7a254e78a1e2785f7fcd22ce&specbookId=');
    // };
    // const responseData = await response.json();
    // return responseData?.data || [];
    return payload.type === 'default' ? smartList || [] : smartSubmittalFlatList?.data || [];
  };
};

export const fetchSmartSubmitalDetailGridList = async (payload: any, callback: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if (!isLocalhost) {
	  response = await fetch(
		`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals/${payload?.specBook?.id}?sectionId=${payload?.id}&sessionId=${appInfo?.sessionId}`
	  );
	  if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	  }
	  const responseData = await response.json();
		callback && callback(responseData?.data || []);
	}
	else callback && callback(smartSubmitalDetailList.data || []);
};

export const AddSmartSubmitalBrena = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals?sessionId=${appInfo?.sessionId}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.data || [];
  } else return { success: true };
};
export const fetchSubmittalById = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals/${payload?.specBookId}/id/${payload?.submittalId}?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData || {};
  }
  return submittalById;
};