import { getServerInfo } from 'app/hooks';
import { isLocalhost } from 'app/utils';
import { timelogList , workTeamData , workTeamGridData} from 'data/timelog/TimeLogData';

const moduleName = "Time Log Requests:";

// Grid Apis

export const fetchTimeLog = async () => {
	const server: any = getServerInfo();
	if (!isLocalhost) {


	}
	else{ return timelogList }
};

export const fetchWorkTeamData = async () => {
	const server: any = getServerInfo();
	if (!isLocalhost) {


	}
	else{ return workTeamData }
};

export const fetchWorkTeamGridData = async () => {
	const server: any = getServerInfo();
	if (!isLocalhost) {


	}
	else{ 
		console.log(workTeamGridData , 'workTeamGridData')
		return workTeamGridData 
	}
};
