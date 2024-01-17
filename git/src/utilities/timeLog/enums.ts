export const getTimeLogStatus = (value: any) => {
	const types: any = {
		'Reported': "Reported",
		'InProgress': "In Progress",
		'Planned': "Planned",
		'Unavailable': "Unavailable",
		'SentBack': 'Sent Back',
		'Accepted': 'Accepted'
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