import { isLocalhost, localServer } from "app/utils";
import { getServerInfo } from "app/hooks";
import {
  CategoryList,
  GridData,
  PhasesData,
  getGridDataById,
  gridDetailsByIdData,
  GeneralSettingsCategories,
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
export const fetchCategoryList = async (name:any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetByName?name=${name}&sessionId=${appInfo?.sessionId}`
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
    return responseData || [];
  }
  return getGridDataById
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
    return response;
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
    if(appId) {
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
  }
  return appDependentFieldsData;
};

export const updateAdditionalInfo = async (payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("updateAdditionalInfo", payload);
	const options = {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await sbsRequest(server, ``, options);
		callback && callback(response);
	}
};

export const saveLinksData = async (payload: any, callback: any) => {
	const appInfo: any = getServerInfo();
  let response;
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/link?sessionId=${appInfo?.sessionId}`,
      {
        method: "PATCH",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
      callback && callback(response);
  }
};

export const saveRightPanelData = async (body: any) => {
  const appInfo: any = getServerInfo();
  let response;
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}?sessionId=${appInfo?.sessionId}`,
      {
        method: "PATCH",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!response?.ok) {
      const message = `API Request Error (${moduleName}): ${response?.status}`;
      throw new Error(message);
    }
    const data = await response?.json();
    return data;
  };
  return true;
};


export const AddFiles = async (sbsId: string, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("updateAdditionalInfo", payload);
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await sbsRequest(server, `/reference?sbsID=${sbsId}`, options);
		callback && callback(response);
	}
};


export const deleteFiles = async (sbsId: string, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("delete files", payload);
	const options = {
		method: 'DELETE',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await sbsRequest(server, `/reference?sbsID=${sbsId}`, options, true);
		callback && callback(response);
	}
};

export const UpdateSettings  = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/category?sessionId=${appInfo?.sessionId}`,
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
export const fetchSettingsCategoriesList = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetListManagerByCategories?projectId=${appInfo?.projectId}&page=1&start=0&limit=25`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.values || [];
  } else return GeneralSettingsCategories?.values || [];
};
export const fetchSbsSettings = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/sbs/${appInfo?.uniqueId}/category?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.[0] || {};
  } else return {
        "id": 1,
        "categoryId": 1,
        "projectId": "6e83792a-3e66-49d6-9442-c6a1e918b48f"
    };
};