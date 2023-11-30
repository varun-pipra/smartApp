export const getResponseStatus = (value: any) => {
	const types: any = {
		0: "Not Responded",
		1: "Declined",
		2: "Draft",
		3: "Ready To Submit",
		4: "Expired",
		5: "Bid Submitted"
	};
	return types[value];
};

export const getResponseStatusColor = (value: any) => {
	const types: any = {
		0: "616161",
		1: "d93c3c",
		2: "bbb40f",
		3: "0599da",
		4: 'd35b0d',
		5: '098024'
	};
	return types[value];
};

export const getResponseStatusIcons = (value: any) => {
	const types: any = {
		0: 'common-icon-NotResponded',
		1: 'common-icon-Declined',
		2: 'common-icon-Draft',
		3: 'common-icon-ReadyToSubmit',
		4: 'common-icon-Expired',
		5: 'common-icon-bid-manager'
	};
	return types[value];
};

export const ResponseStatusOptions = [
	{name: 'Not Responded', key: 'NotResponded', text: 'Not Responded', id: 0, value: '0', icon: 'common-icon-NotResponded bid-filter', color: "b3b3b3", bgColor: "#b3b3b3", iconType: 'class'},
	{name: 'Declined', key: 'Declined', text: 'Declined', id: 1, value: '1', icon: 'common-icon-Declined bid-filter', color: "ec8d8d", bgColor: "#ec8d8d", iconType: 'class'},
	{name: 'Draft', key: 'Draft', text: 'Draft', id: 2, value: '2', icon: 'common-icon-BRDraft bid-filter', color: "c1b30c", bgColor: "#c1b30c", iconType: 'class'},
	{name: 'Ready to Submit', key: 'ReadytoSubmit', text: 'Ready to Submit', id: 3, value: '3', icon: 'common-icon-ReadyToSubmit bid-filter', color: "5cc7ec", bgColor: "#5cc7ec", iconType: 'class'},
	{name: 'Bid Submitted', key: 'BidSubmitted', text: 'Bid Submitted', id: 5, value: '5', icon: 'common-icon-Biddetailsgray bid-filter', color: "098024", bgColor: "#098024", iconType: 'class'},
	{name: 'Expired', key: 'Expired', text: 'Expired', id: 4, value: '4', icon: 'common-icon-Expired bid-filter', color: "d35c0e", bgColor: "#d35c0e", iconType: 'class'},
];

export const ResponseStatusFilterOptions = [{text: 'Not Responded', id: '0', key: '0', value: '0', icon: 'common-icon-NotResponded bid-filter', color: "b3b3b3", iconType: 'class'},
{text: 'Declined', id: '1', key: '1', value: '1', icon: 'common-icon-Declined bid-filter', color: "ec8d8d", iconType: 'class'},
{text: 'Draft', id: '2', key: '2', value: '2', icon: 'common-icon-BRDraft bid-filter', color: "c1b30c", iconType: 'class'},
{text: 'Ready to Submit', key: '3', value: '3', id: '3', icon: 'common-icon-ReadyToSubmit bid-filter', color: "5cc7ec", iconType: 'class'},
{text: 'Bid Submitted', key: '5', value: '5', id: '5', icon: 'common-icon-Biddetailsgray bid-filter', color: "098024", iconType: 'class'},
{text: 'Expired', id: '4', key: '4', value: '4', icon: 'common-icon-Expired bid-filter', color: "d35c0e", iconType: 'class'},
];

export const getPackageStatus = (value: any) => {
	const types: any = {
		0: "Draft",
		1: "Ready To Post",
		2: "Scheduled",
		3: "Active",
		4: "Paused",
		5: "Awarded",
		6: "Expired",
		7: "Cancelled",
		8: "Closed"
	};
	return types[value];
};

export const getPackageStatusColor = (value: any) => {
	const types: any = {
		0: "c6b832",
		1: "d84542",
		2: "c6b832",
		3: "098024",
		4: 'bbb40f',
		5: '06c16b',
		6: 'c60f0f',
		7: 'c60f0f',
		8: 'c60f0f'
	};
	return types[value];
};
export const getTabId = (value: any) => {
	const types: any = {
		'bid-details': "BID_DETAILS",
		'reference-files': "REFERENCE_FILES",
		'bid-queries': "BID_QUERIES",
		'bidResponse': "BID_RESPONSE"
	};
	return types[value];
};