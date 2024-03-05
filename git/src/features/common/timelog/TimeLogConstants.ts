export const timelogStatusMap = [
	{icon: 'common-icon-CurrentTime', text: 'Reported', key: 'Reported', value: 'Reported', id: 'Reported', bgColor: '#323232', lightColor: '#dfdfdf', color: '#fff'},
	{icon: 'common-icon-bid-pending-icon', text: 'In Progress', key: 'InProgress', value: 'InProgress', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff'},
	{icon: 'common-icon-tickmark', text: 'Accepted', key: 'Accepted', value: 'Accepted', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff'},
	{icon: 'common-icon-planned', text: 'Planned', key: 'Planned', value: 'Planned', bgColor: '#5cc7ec', lightColor: '#daedde', color: '#fff'},
	{icon: 'common-icon-unavailable', text: 'Unavailable', key: 'Unavailable', value: 'Unavailable', bgColor: '#d34441', lightColor: '#f9e2e2', color: '#fff'},
	{icon: 'common-icon-resubmitted', text: 'Sent Back', key: 'SentBack', value: 'SentBack', bgColor: '#a2480d', lightColor: '#f2e4da', color: '#fff'},
	
];

export const timelogSourceMap = [
	{ text: 'Manual', key: 'Manual', value: 'Manual', id: 'Manual'},
	{text: 'Smart Gate', key: 'SmartGate', value: 'SmartGate' ,id:'SmartGate'},
	{text: 'Kiosk', key: 'Kiosk', value: 'Kiosk', id:'Kiosk'},
	{text: 'RTLS', key: 'RTLS', value: 'Rtls',id:'RTLS'},
	{text: 'GPS', key: 'GPS', value: 'Gps',id:'GPS'},
	{text: 'SMS', key: 'SMS', value: 'Sms',id:'SMS'},
	{text: 'Auto', key: 'Auto', value: 'Auto',id:'Auto'},
	{text: 'Others', key: 'Others', value: 'Others',id:'Others'},
];