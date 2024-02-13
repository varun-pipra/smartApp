export const timelogStatusMap = [
	{icon: 'common-icon-CurrentTime', text: 'Reported', key: 'Reported', value: '0', id: 'Reported', bgColor: '#323232', lightColor: '#dfdfdf', color: '#fff'},
	{icon: 'common-icon-bid-pending-icon', text: 'In Progress', key: 'InProgress', value: '1', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff'},
	{icon: 'common-icon-tickmark', text: 'Accepted', key: 'Accepted', value: '2', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff'},
	{icon: 'common-icon-planned', text: 'Planned', key: 'Planned', value: '3', bgColor: '#5cc7ec', lightColor: '#daedde', color: '#fff'},
	{icon: 'common-icon-unavailable', text: 'Unavailable', key: 'Unavailable', value: '4', bgColor: '#d34441', lightColor: '#f9e2e2', color: '#fff'},
	{icon: 'common-icon-resubmitted', text: 'Sent Back', key: 'SentBack', value: '5', bgColor: '#a2480d', lightColor: '#f2e4da', color: '#fff'},
	
];

export const timelogSourceMap = [
	{ text: 'Manual', key: 'Manual', value: '0', id: 'Manual'},
	{text: 'Smart Gate', key: 'SmartGate', value: '1' ,id:'SmartGate'},
	{text: 'Kiosk', key: 'Kiosk', value: '2', id:'Kiosk'},
	{text: 'RTLS', key: 'RTLS', value: '3',id:'RTLS'},
	{text: 'GPS', key: 'GPS', value: '4',id:'GPS'},
	{text: 'SMS', key: 'SMS', value: '5',id:'SMS'},
	{text: 'Auto', key: 'Auto', value: '6',id:'Auto'},
	{text: 'Others', key: 'Others', value: '7',id:'Others'},
];