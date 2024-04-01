import { getServerInfo } from "app/hooks";
import { isLocalhost } from "app/utils";
import {
  timelogList,
  workTeamData,
  workTeamGridData,
} from "data/timelog/TimeLogData";
import { timelogAppsData} from 'data/timelog/TimeLogAppsData';
import { TimeLogRequest } from "../utils";
const moduleName = "Time Log Requests:";

// Grid Apis

export const addTimeLog = async (payload: any, callback: any) => {
  console.log("addTimeLog", addTimeLog)
	const server: any = getServerInfo();
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await TimeLogRequest(server, '/segments', options);
		callback && callback(response);
	}
};

export const fetchTimeLog = async (payload:any) => {
  const server: any = getServerInfo();
  const body = {"offset": 0,"rows": 20000 ,...payload};
  console.log('body',body);
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
  const isMock = window.location.href?.includes('t=1');
  const isMReal = window.location.href?.includes('t=2');
  if (!isLocalhost) {
    if (isMock) return timelogList?.segments
    else {
      const response = await TimeLogRequest(server, '/segments/all', options);
      if (isMReal) {
        return [...timelogList?.segments, ...response?.segments];
      }
      else return [...response?.segments];
    }

  } else return timelogList?.segments;
};

export const fetchTimeLogDetails = async (timeLogId: any) => {
  const server: any = getServerInfo();
  const isMock = window.location.href?.includes('t=1');
  const isMReal = window.location.href?.includes('t=2'); 
  if (!isLocalhost) {
    if (isMock) return timelogList?.segments?.find((obj: any) => obj.id === timeLogId);
    else {
      const response = await TimeLogRequest(server, `/segments/${timeLogId}`, {});
      const mockRecord:any = timelogList?.segments?.find((obj: any) => obj.id === timeLogId);
      console.log("mockRecord", mockRecord)
      if(isMReal) {
        return mockRecord ? mockRecord : response;
      }
      else return mockRecord ? mockRecord : response;
    }

  } else {
    const record = timelogList?.segments?.find((obj: any) => obj.id === timeLogId);
    return record;
  }
};


export const fetchWorkTeamData = async () => {
  const server: any = getServerInfo();
  if (!isLocalhost) {
  } else {
    return workTeamData;
  }
};

export const fetchWorkTeamGridData = async () => {
  const server: any = getServerInfo();
  if (!isLocalhost) {
  } else {
    console.log(workTeamGridData, "workTeamGridData");
    return workTeamGridData;
  }
};

export const updateTimeLogDetails = async (timeLogId: any, payload: any, callback: any) => {
	const server: any = getServerInfo();
	console.log("updateTimelog", payload);
	const options = {
		method: 'PATCH',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
		const response = await TimeLogRequest(server, `/segments/${timeLogId}`, options);
		callback && callback(response);
	}
};

export const deleteTimeLogData = async (timeLogId: any, callback: any) =>{
    const server: any = getServerInfo();
    const options = {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      // body: JSON.stringify(payload),
    };
    if (!isLocalhost) {
      const response = await TimeLogRequest(server, `/segments/${timeLogId}`, options, true);
      callback && callback(response);
    }
}

export const acceptTimeLog = async (payload:any, callback:any) => {
  const server:any = getServerInfo();
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  };
  if(!isLocalhost) {
      const response = await TimeLogRequest(server, '/segments/accept', options);
      callback && callback(response);
    }
}

export const sendBackTimeLog = async (payload:any, callback: any) =>{
  const server: any = getServerInfo();
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  };
  if (!isLocalhost) {
    const response = await TimeLogRequest(server, `/segments/sendback`, options, true);
    callback && callback(response);
  }
}

//-------------------------Links APi Start -----------------------------//
export const deleteLinksData = async (timeLogId :any,linkid: any, callback: any) =>{
  const server: any = getServerInfo();
  const options = {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
  };
  if (!isLocalhost) {
    const response = await TimeLogRequest(server, `/segments/${timeLogId}/links/${linkid}`, options, true);
    console.log('deletelinkresponse',response)
    callback && callback(response);
  }
}
export const saveLinksData = async (timeLogId:any,payload: any, callback: any) => {
  console.log("saveLinksData", payload)
	const server: any = getServerInfo();
  const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	};
	if (!isLocalhost) {
    const response = await TimeLogRequest(server, `/segments/${timeLogId}/links`, options);
    console.log('response api',response)
		callback && callback(response);
	}
};
export const fetchSSRTimeLofGridDataList = async (payload: any, callback: any) => {
	let response: any;
	if (isLocalhost) response = await fetch(`https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/api/v2/timelog/6e83792a-3e66-49d6-9442-c6a1e918b48f/segments/all?sessionId=a6e545eec27d482aa3e2109959a711bb`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});

	const responseData = await response.json();
	callback && callback(responseData.segments, responseData?.count);
};

//appslist calling 
export const fetchTimelogAppsList = async () => {
	let response;
	const appInfo: any = getServerInfo();
	if (!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/AppGroups/AppGroups.iapi/SmartAppList?&projectId=${appInfo?.projectId}?sessionId=${appInfo?.sessionId}`
		);
		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.values || [];
	}
	return timelogAppsData?.values;
};
export const fetchAppsPermission = async(smartAppId:any) =>{
  console.log('smartAppId',smartAppId)
  let response;
	const appInfo: any = getServerInfo();
  if (!isLocalhost) {
    response = await fetch(
      `${appInfo?.hostUrl}/EnterpriseDesktop/AppZone/ZoneInfo.iapi/CanCreateItem?smartAppId=${smartAppId}&projectId=${appInfo?.projectId}?sessionId=${appInfo?.sessionId}`
    );
    if (!response.ok) {
      const message = `API Request Error (${moduleName}): ${response.status}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    console.log('responseData',responseData)
    return responseData;
  }
  return {"success":true,"values":true};
}