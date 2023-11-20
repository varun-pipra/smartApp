import { isLocalhost, localServer } from "app/utils";
import { getServerInfo } from "app/hooks";
import {
  CategoryList,
  GridData,
  PhasesData,
  gridDetailsByIdData,
} from "data/sbsManager/sbsData";
import { appDependentFieldsData, appsData } from "data/sbsManager/appsList";
import { sbsRequest } from "../utils";

const moduleName = "Sbs Manager";
export const fetchPhaseDropdownData = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/phase?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.data || [];
  }
  return PhasesData || [];
};
export const AddSbsManagerForm = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}?sessionId=${appInfo?.sessionId}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const responseData = await response.json();
    return responseData || {};
  } else return { success: true };
};

export const fetchDataList = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.data || [];
  }
  return GridData;
};
export const fetchCategoryList = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetByName?name=System Breakdown Structure Categories (SBS)&sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.listValues || [];
  }
  return CategoryList?.listValues || [];
};

export const deletePhase = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/phase?sessionId=${appInfo?.sessionId}`,
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const responseData = await response.json();
    return responseData || {};
  } else return { success: true };
};

export const createNewPhase = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/phase?sessionId=${appInfo?.sessionId}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const responseData = await response.json();
    return responseData || {};
  } else return { success: true };
};

export const updatePhases = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/phase?sessionId=${appInfo?.sessionId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const responseData = await response.json();
    return responseData || {};
  } else return { success: true };
};

export const fetchGridDetailsDataByID = async (uniqueid: any) => {
  let response;
  const appInfo: any = getServerInfo();
  // let detail = {}
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/${uniqueid}?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.data || [];
  }
  return GridData?.filter((obj:any) => obj?.id == uniqueid)[0]
};

export const deleteSBSGridRecs = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if(!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}?sessionId=${appInfo?.sessionId}`,
      {
        method: "DELETE",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload),
      }
    );
    if(!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData || [];
  } else return {success: true};
};

// Additional Info Tab apis

export const fetchAppsList = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/wdc/GetSmartAppViews?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.data || [];
  }
  return appsData?.data;
};

export const fetchDependentAppFields = async (appId:any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/admin/WorkPlanner/GetAppMDCollections?appId=${appId}&sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData || [];
  }
  return appDependentFieldsData;
};

export const updateSupplementalAppFields = async (payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("updateSupplementalAppFields", payload);
	const options = {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await sbsRequest(server, `/additionalInfo`, options);
		callback && callback(response);
	}
};

export const deleteSupplementalAppFields = async (payload: any, callback: any) => {
	const server: any = getServerInfo();
	const options = {
		method: 'DELETE',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await sbsRequest(server, `/additionalInfo`, options, true);
		callback && callback(response);
	}
};

