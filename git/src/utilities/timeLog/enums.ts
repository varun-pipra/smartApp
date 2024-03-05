export const getTimeLogStatus = (value: any) => {
	const types: any = {
		'Reported': "Reported",
		'InProgress': "In Progress",
		'Accepted': "Accepted",
		'Planned': "Planned",
		'Unavailable': 'Unavailable',
		'SentBack': 'Sent Back',
		'Deleted': 'Deleted'
	};
	return types[value];
};

export const getTimeLogDateRange = (value: any) => {
	const types: any = {
		'today': "Today",
		'yesterday': "Yesterday",
		'lastWeek': "Last Week",
		'thisWeek': "This Week",
		'thisMonth': 'This Month',
		'lastMonth': 'Last Month',
		'future': 'Future',
		'past' : 'Past'
	};
	return types[value];
};
export const getSource = (value: any) => {
	const types: any = {
		"Manual": "Manual",
		"SmartGate": 'Smart Gate',
		"Kiosk" : 'Kiosk',
		"Rtls": 'RTLS',
		"Gps": "GPS",
		"Sms":'SMS',
		"Auto": "Auto",
		"Others": "Others",
	};
	return types[value];
};

export const getTimeSegmentFor = (value: any) => {
	const types: any = {
		"AppzoneUser": "App Zone User",
		"AdhocUser": "Adhoc User",
	};
	return types[value];
};

