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

export const fetchTimeLog = async () => {
  const server: any = getServerInfo();
  const options = {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
      "offset":0,
      "rows":10000,
    }),
	};
  const isMock = window.location.href?.includes('t=1')  
  if (!isLocalhost) {
    if(isMock) return timelogList?.segments
    else { 
      const response = await TimeLogRequest(server, '/segments/all', options);
      return response?.segments;
    }

  } else return timelogList?.segments;
};

export const fetchTimeLogDetails = async (timeLogId:any) => {
  const server: any = getServerInfo();
  const isMock = window.location.href?.includes('t=1')  
  if (!isLocalhost) {
    if(isMock) return timelogList?.segments?.find((obj: any) => obj.id === timeLogId);
    else{
      const response = await TimeLogRequest(server, `/segments/${timeLogId}`, {});
      return response;
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
