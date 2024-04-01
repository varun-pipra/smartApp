export const getBidType = (value: any) => {
	const types: any = {
		0: 'Single Party',
		1: 'Multi Party',
	};
	return types[value];
};

export const getBidProcessType = (value: any) => {
	const types: any = {
		0: 'Open',
		1: 'Closed',
	};
	return types[value];
};

export const getBidStatusIdFromText = (value: any) => {
	const types: any = {
		'Draft': 0,
		'ReadyToPost': 1,
		'Scheduled': 2,
		'Active': 3,
		'Paused': 4,
		'Awarded': 5,
		'Expired': 6,
		'Cancelled': 7,
		'Closed': 8
	};
	return types[value];
};

export const getBidStatus = (value: any) => {
	const types: any = {
		0: 'Draft',
		1: 'Ready To Post',
		2: 'Scheduled',
		3: 'Active',
		4: 'Paused',
		5: 'Awarded',
		6: 'Expired',
		7: 'Cancelled',
		8: 'Closed'
	};
	return types[value];
};

export const getGridStatusIcons = (value: any) => {
	const types: any = {
		0: '',
		1: '',
		2: 'common-icon-scheduled',
		3: 'common-icon-active-timer',
		4: 'common-icon-Pausestatus',
		5: 'common-icon-AwardBid',
		6: '',
		7: '',
		8: 'common-icon-Lock'
	};
	return types[value];
};

export const StatusIcons: any = {
	"2": 'common-icon-Scheduled',
	"1": 'common-icon-ReadyToPost',
	"0": 'common-icon-Draft',
	"3": 'common-icon-Active',
	"4": 'common-icon-Pause',
	"6": 'common-icon-Expired',
	"5": 'common-icon-AwardBid',
	"8": 'common-icon-Closed',
	"7": 'common-icon-Cancelled',
	"10": 'common-icon-bid-manager',
	"11": 'common-icon-BidQueries',
	"12": 'common-icon-ReadyToSubmit',
	"13": 'common-icon-Draft',
	"14": 'common-icon-Declined',
	"15": 'common-icon-NotResponded'
};

export const StatusColors: any = {
	"0": "323232",
	"1": "c83dd0",
	"2": "937eeb",
	"3": "098024",
	"4": "c1b30c",
	"5": "07bd69",
	"6": "d35c0e",
	"7": "d34441",
	"8": "752d0e",

};

export const statusOptions = [
	{name: 'Scheduled', text: 'Scheduled', key: 'Scheduled', id: 2, value: '2', icon: 'common-icon-Scheduled', color: "937eeb", bgColor: "#937eeb", iconType: 'class'},
	{name: 'Ready To Post', text: 'ReadyToPost', key: 'Ready To Post', id: 1, value: '1', icon: 'common-icon-ReadyToPost', color: "c83dd0", bgColor: "#c83dd0", iconType: 'class'},
	{name: 'Draft', text: 'Draft', key: 'Draft', id: 0, value: '0', icon: 'common-icon-Draft', color: "323232", bgColor: "#323232", iconType: 'class'},
	{name: 'Active', text: 'Active', key: 'Active', id: 3, value: '3', icon: 'common-icon-Active', color: "098024", bgColor: "#098024", iconType: 'class'},
	{name: 'Paused', text: 'Paused', key: 'Paused', id: 4, value: '4', icon: 'common-icon-Pause', color: "c1b30c", bgColor: "#c1b30c", iconType: 'class'},
	{name: 'Expired', text: 'Expired', key: 'Expired', id: 6, value: '6', icon: 'common-icon-Expired', color: "d35c0e", bgColor: "#d35c0e", iconType: 'class'},
	{name: 'Awarded', text: 'Awarded', key: 'Awarded', id: 5, value: '5', icon: 'common-icon-AwardBid', color: "07bd69", bgColor: "#07bd69", iconType: 'class'},
	{name: 'Cancelled', text: 'Cancelled', key: 'Cancelled', id: 7, value: '7', icon: 'common-icon-Cancelled', color: "d34441", bgColor: "#d34441", iconType: 'class'},
	{name: 'Closed', text: 'Closed', key: 'Closed', id: 8, value: '8', icon: 'common-icon-Closed', color: "752d0e", bgColor: "#752d0e", iconType: 'class'}
];

export const statusFilterOptions = [
	{text: 'Scheduled', id: '2', key: '2', value: '2', icon: 'common-icon-Scheduled', color: "937eeb", iconType: 'class'},
	{text: 'Ready To Post', key: '1', id: '1', value: '1', icon: 'common-icon-ReadyToPost', color: "c83dd0", iconType: 'class'},
	{text: 'Draft', key: '0', id: '0', value: '0', icon: 'common-icon-Draft', color: "323232", iconType: 'class'},
	{text: 'Active', key: '3', id: '3', value: '3', icon: 'common-icon-Active', color: "098024", iconType: 'class'},
	{text: 'Paused', key: '4', id: '4', value: '4', icon: 'common-icon-Pause', color: "c1b30c", iconType: 'class'},
	{text: 'Expired', key: '6', id: '6', value: '6', icon: 'common-icon-Expired', color: "d35c0e", iconType: 'class'},
	{text: 'Awarded', key: '5', id: '5', value: '5', icon: 'common-icon-AwardBid', color: "07bd69", iconType: 'class'},
	{text: 'Cancelled', key: '7', id: '7', value: '7', icon: 'common-icon-Cancelled', color: "d34441", iconType: 'class'},
	{text: 'Closed', key: '8', id: '8', value: '8', icon: 'common-icon-Closed', color: "752d0e", iconType: 'class'}
];

export const getIntendToBid = (value: any) => {
	const types: any = {
		0: 'Undecided',
		1: 'No',
		2: 'Yes',
		3: 'Expired',
	};
	return types[value];
};
export const getIntendToBidColors = (value: any) => {
	const types: any = {
		0: 'c6b832',
		1: 'da5350',
		2: '338b3d',
		3: '6b6b6b',
	};
	return types[value];
};


export const getSubmissionStatus = (value: any) => {
	const types: any = {
		0: 'Not Applicable',
		1: 'Not Submitted',
		2: 'Pending',
		3: 'Submitted',
	};
	return types[value];
};
export const getSubmissionStatusColors = (value: any) => {
	const types: any = {
		0: '333333',
		1: '338b3d',
		2: 'da5350',
		3: '338b3d',
	};
	return types[value];
};

export const getSubmissionStatusIcons = (value: any) => {
	const types: any = {
		0: 'common-icon-bid-pending-icon',
		1: 'common-icon-bid-manager',
		2: 'common-icon-not-submitted',
		3: 'common-icon-bid-manager',
	};
	return types[value];
};

export const BidResponseStatus: any = {
	0: 'Not Responded',
	1: 'Declined',
	2: 'Draft',
	3: 'Ready to Submit',
	4: 'Expired',
	5: 'Bid Submitted'
};

export const BidResponseStatusColor: any = {
	0: '#616161',
	1: '#d84542',
	2: '#bfb832',
	3: '#289bdb',
	4: '#ce6023',
	5: '#268330'
};

export const BidStatus: any = {

};

export const BidStatusColors: any = {
	0: '323232',
	1: 'c83dd0',
	2: '937eeb',
	3: '098024',
	4: 'c1b30c',
	5: '07bd69',
	6: 'd35c0e',
	7: 'd35c0e',
	8: 'd35c0e'
};

export const BidStatusIcons: any = {

};

export const awardTileIntendBidBGColor: any = {
	0: '#c6b832',
	1: '#da5350',
	2: '#07bd69',
	3: '#6b6b6b',
};
// export const awardTileIntendBidColor: any = {
// 	0: 'gray',
// 	1: 'red',
// 	2: 'green',
// 	3: 'gray',
// };
export const awardTileSubmissionStatusBGColor: any = {
	0: '#333333',
	1: '#338b3d',
	2: '#da5350',
	3: '#07bd69',
};
// export const awardTileSubmissionStatusColor: any = {
// 	0: 'black',
// 	1: 'green',
// 	2: 'red',
// 	3: 'green',
// };
export const getCompanyFilterOptions = [{
	text: 'Scope',
	key: 'scope',
	value: 'scope',
	iconCls: 'common-icon-scope',
	children: {
		type: 'checkbox',
		items: [{
			id : 1,
			text: 'This Project',
			key: 'scope',
			value: 'This Project'
		}, {
			id : 2,
			text: 'Organizational',
			value: 'Organizational',
			key: 'scope',
		},]
	}
},
{
	text: 'Diverse Supplier',
	key: 'diverseCategories',
	value: 'diverseCategories',
	iconCls: 'common-icon-diverse-supplier',
	children: {
		type: 'checkbox',
		items: []
	}
},
{
	text: 'Compliance Status',
	key: 'complianceStatus',
	value: 'complianceStatus',
	iconCls: 'common-icon-compliance-Status',
	children: {
		type: 'checkbox',
		items: [{
			text: 'Compliant',
			key: 'complianceStatus',
			value: 'Compliant'
		}, {
			text: 'Not Verified',
			value: 'Not Verified',
			key: 'complianceStatus',
		},
		{
			text: 'Non Compliant',
			value: 'N/A',
			key: 'complianceStatus',
		},
		{
			text: 'Expired',
			value: 'Expired',
			key: 'complianceStatus',
		}
		]
	}
}];