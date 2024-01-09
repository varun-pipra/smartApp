import { getServerInfo } from 'app/hooks';
import { isLocalhost } from 'app/utils';
import { timelogList } from 'data/timelog/TimeLogData';

const moduleName = "Time Log Requests:";

// Grid Apis

export const fetchTimeLog = async () => {
	const server: any = getServerInfo();
	if (!isLocalhost) {


	}
	else{ return timelogList }
};
