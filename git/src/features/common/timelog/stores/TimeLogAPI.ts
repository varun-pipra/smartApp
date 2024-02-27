import { getServerInfo } from "app/hooks";
import { isLocalhost } from "app/utils";
import {
  timelogList,
  workTeamData,
  workTeamGridData,
} from "data/timelog/TimeLogData";
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
  const body = {"offset": 0,"rows": 10000 ,...payload};
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
      else return [...timelogList?.segments, ...response?.segments];
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