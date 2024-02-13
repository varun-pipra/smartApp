export const getTimeLogStatus = (value: any) => {
	const types: any = {
		0: "Reported",
		1: "In Progress",
		2: "Accepted",
		3: "Planned",
		4: 'Unavailable',
		5: 'Sent Back'
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
		'future': 'Future'
	};
	return types[value];
};
export const getSource = (value: any) => {
	const types: any = {
		0: "Manual",
		1: 'Smart Gate',
		2 : 'Kiosk',
		3: 'RTLS',
		4: "GPS",
		5:'SMS',
		6: "Auto",
		7: "Others",
	};
	return types[value];
};