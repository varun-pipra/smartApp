import { getServerInfo } from "app/hooks";
import { isLocalhost } from "app/utils";
import {  sectionCardsData, submittalTypeValues } from "data/smartsubmittals/smartsubmittals";
const moduleName = "Smart Submital";

export const fetchSectionCardsList = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals/${payload?.specBookId}?sessionId=${appInfo?.sessionId}&sectionId=${payload?.id}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.data || [];
  }
  return sectionCardsData.data;
};

export const UpdateStatusCommit = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals/status/2`,
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

export const updateStatusToCommit = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals?sessionId=${appInfo?.sessionId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData || [];
  } else return { success: true };
};

export const DeleteBrenaSubmittals = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals`,
      {
        method: "DELETE",
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

export const fetchSmartSubmitalType = async () => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/ListManager/List.iapi/GetByName?name=Submittal Type&sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData?.listValues || [];
  }
  return submittalTypeValues.listValues;
};

export const extractSubmittalFromSection = async (payload: any) => {
  let response;
  const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections?sessionId=${appInfo?.sessionId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData || [];
  } else return true ;
};
