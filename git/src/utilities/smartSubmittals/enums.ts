export const getSubmittalsStatus = (value: any) => {
	const types: any = {
		'Draft': '#ccc',
		'SuggestedDraft': 'rgb(241 235 167)',
		'Committed': '#39bf71'
	};
	return types[value];
};

export const getSubmittalsStatusValues = (value: any) => {
	const types: any = {		
		'SuggestedDraft': 0,
		'Draft':1,
		'Committed' : 2,
        'Deleted' : 3
	};
	return types[value];
};

export const getSubmittalsStatusLabel = (value: any) => {
	const types: any = {		
		'SuggestedDraft': "Suggested Draft",
		'Draft':"Draft",
		'Committed' : "Committed",
        'Deleted' : "Deleted"
	};
	return types[value];
};