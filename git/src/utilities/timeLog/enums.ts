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