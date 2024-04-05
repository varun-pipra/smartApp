export const getEstimateRoomEnums = (value: any) => {
	const types: any = {
		'Deactivated': "Deactivated",
		'PublishedToBudget': "Published to Budget",
		'Draft': "Draft",
		'DraftTrade': "Draft: Trade",
		'DraftSubmitted': 'Draft: Estimate Submitted'
	};
	return types[value];
};
