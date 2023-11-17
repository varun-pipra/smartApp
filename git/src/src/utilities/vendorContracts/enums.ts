export const vendorContractsStatus: any = {
	ActiveUnlocked: 'Active Unlocked',
	AwaitingAcceptance: "Awaiting Acceptance",
	Scheduled: "Scheduled",
	ReadyToSubmit: "Ready To Post",
	Active: "Active",
	Expired: "Expired",
	Closed: "Closed",
	NoFunds: "No Funds",
	Declined: "Contract Not Accepted",
	Draft: "Draft",
	AwaitingAcceptanceUnlocked: "Awaiting Acceptance Unlocked",
	SentBackForRevision: "Sent Back For Revision",
	ActivePendingSOVUpdate: 'Active-Need SOV Update',
	ActiveUnlockedPendingSOVUpdate: 'Active Unlocked-Need SOV Update'
};
export const vendorContractsResponseStatus: any = {
	AwaitingAcceptance: "Awaiting Acceptance",
	Active: "Active",
	Declined: "Declined",
	SentBackForRevision: "Sent Back For Revision",
	OnHold: "On Hold",
	ActivePendingSOVUpdate: 'Active-Need SOV Update',
};

export const vendorContractsStatusIcons: any = {
	ActiveUnlocked: 'common-icon-unlock-padlock',
	AwaitingAcceptance: "common-icon-bid-pending-icon",
	Scheduled: "common-icon-Scheduled",
	ReadyToSubmit: "common-icon-ReadyToPost",
	Active: "common-icon-Active",
	Expired: "common-icon-Expired",
	Closed: "common-icon-Closed",
	NoFunds: "common-icon-Closed",
	Declined: "common-icon-Closed",
	Draft: "common-icon-Draft",
	AwaitingAcceptanceUnlocked: "common-icon-bid-pending-icon",
	SentBackForRevision: "common-icon-resubmitted",
	ActivePendingSOVUpdate: "common-icon-payment-ledger",
	ActiveUnlockedPendingSOVUpdate: "common-icon-unlock-padlock"
};
export const vendorContractsResponseStatusIcons: any = {
	AwaitingAcceptance: "common-icon-bid-pending-icon",
	Active: "common-icon-Active",
	Declined: "common-icon-Declined",
	SentBackForRevision: "common-icon-resubmitted",
	OnHold: "common-icon-Pause",
	ActivePendingSOVUpdate: "common-icon-payment-ledger",
};

export const vendorContractsStatusColors: any = {
	ActiveUnlocked: '#60ad07',
	AwaitingAcceptance: "#c29e0a",
	Scheduled: "#836aea",
	ReadyToSubmit: "#c83cd0",
	Active: "#0a8127",
	Expired: "#d35c0e",
	Closed: "#782a04",
	NoFunds: "#ab0909",
	Declined: "#ab0909",
	Draft: "#323232",
	AwaitingAcceptanceUnlocked: "#c29e0a",
	SentBackForRevision: "#9e4b1b",
	ActivePendingSOVUpdate: '#14cc40',
	ActiveUnlockedPendingSOVUpdate: '#60ad07'
};
export const vendorContractsResponseStatusColors: any = {
	AwaitingAcceptance: "#c29e0a",
	Active: "#0a8127",
	Declined: "#d34441",
	SentBackForRevision: "#9e4b1b",
	OnHold: "#d5c13a",
	ActivePendingSOVUpdate: '#14cc40',	
};

export const PaymentStatus: any = {
	Pending: "Pending",
	ReadyToBePaid: "Ready To Be Paid",
	SelectedForPayment: "Selected For Payment",
	Paid: "Paid",
};

export const vendorContractsStatusOptions = [
	{name: 'Active Unlocked', text: 'Active Unlocked', id: 'ActiveUnlocked', key: 'ActiveUnlocked', value: 'ActiveUnlocked', icon: 'common-icon-unlock-padlock', color: "60ad07", bgColor: "#60ad07", iconType: 'class'},
	{name: 'Awaiting Acceptance', text: 'Awaiting Acceptance', id: 'AwaitingAcceptance', key: 'AwaitingAcceptance', value: 'AwaitingAcceptance', icon: 'common-icon-bid-pending-icon', color: "c29e0a", bgColor: "#c29e0a", iconType: 'class'},
	{name: 'Draft', text: 'Draft', id: 'Draft', key: 'Draft', value: 'Draft', icon: 'common-icon-Draft', color: "323232", bgColor: "#323232", iconType: 'class'},
	{name: 'Scheduled', text: 'Scheduled', id: 'Scheduled', key: 'Scheduled', value: 'Scheduled', icon: 'common-icon-Scheduled', color: "836aea", bgColor: "#836aea", iconType: 'class'},
	{name: 'Ready To Post', text: 'Ready To Post', id: 'ReadyToSubmit', key: 'ReadyToSubmit', value: 'ReadyToSubmit', icon: 'common-icon-ReadyToPost', color: "c83cd0", bgColor: "#c83cd0", iconType: 'class'},
	{name: 'Active', text: 'Active', id: 'Active', key: 'Active', value: 'Active', icon: 'common-icon-Active', color: "0a8127", bgColor: "#0a8127", iconType: 'class'},
	{name: 'Expired', text: 'Expired', id: 'Expired', key: 'Expired', value: 'Expired', icon: 'common-icon-Expired', color: "d35c0e", bgColor: "#d35c0e", iconType: 'class'},
	{name: 'Closed', text: 'Closed', id: 'Closed', key: 'Closed', value: 'Closed', icon: 'common-icon-Closed', color: "782a04", bgColor: "#782a04", iconType: 'class'},
	{name: 'No Funds', text: 'No Funds', id: 'NoFunds', key: 'NoFunds', value: 'NoFunds', icon: 'common-icon-Closed', color: "ab0909", bgColor: "#ab0909", iconType: 'class'},
	{name: 'Contract Not Accepted', text: 'Contract Not Accepted', id: 'Declined', key: 'Declined', value: 'Declined', icon: 'common-icon-Closed', color: "ab0909", bgColor: "#ab0909", iconType: 'class'},
	{name: 'Awaiting Acceptance Unlocked', text: 'Awaiting Acceptance Unlocked', id: 'AwaitingAcceptanceUnlocked', key: 'AwaitingAcceptanceUnlocked', value: 'AwaitingAcceptanceUnlocked', icon: 'common-icon-bid-pending-icon', color: "ab0909", bgColor: "#ab0909", iconType: 'class'},
	{name: 'Sent Back For Revision', text: 'Sent Back For Revision', id: 'SentBackForRevision', key: 'SentBackForRevision', value: 'SentBackForRevision', icon: 'common-icon-resubmitted', color: "9e4b1b", bgColor: "#9e4b1b", iconType: 'class'},
	{name: 'Active-Need SOV Update', text: 'Active-Need SOV Update', id: 'ActivePendingSOVUpdate', key: 'ActivePendingSOVUpdate', value: 'ActivePendingSOVUpdate', icon: 'common-icon-payment-ledger', color: "14cc40", bgColor: "#14cc40", iconType: 'class'},
	{name: 'Active Unlocked-Need SOV Update', text: 'Active Unlocked-Need SOV Update', id: 'ActiveUnlockedPendingSOVUpdate', key: 'ActiveUnlockedPendingSOVUpdate', value: 'ActiveUnlockedPendingSOVUpdate', icon: 'common-icon-unlock-padlock', color: "60ad07", bgColor: "#60ad07", iconType: 'class'}
];

export const vendorContractsResponseStatusOptions = [
	{name: 'Awaiting Acceptance', text: 'Awaiting Acceptance', id: 'AwaitingAcceptance', key: 'AwaitingAcceptance', value: 'AwaitingAcceptance', icon: 'common-icon-bid-pending-icon', color: "c29e0a", bgColor: "#c29e0a", iconType: 'class'},
	{name: 'Active', text: 'Active', id: 'Active', key: 'Active', value: 'Active', icon: 'common-icon-Active', color: "0a8127", bgColor: "#0a8127", iconType: 'class'},
	{name: 'Declined', text: 'Declined', id: 'Declined', key: 'Declined', value: 'Declined', icon: 'common-icon-Declined', color: "d34441", bgColor: "#d34441", iconType: 'class'},
	{name: 'Send Back For Revision', text: 'Send Back For Revision', id: 'SentBackForRevision', key: 'SentBackForRevision', value: 'SentBackForRevision', icon: 'common-icon-resubmitted', color: "9e4b1b", bgColor: "#9e4b1b", iconType: 'class'},
	{name: 'On Hold', text: 'On Hold', id: 'OnHold', key: 'OnHold', value: 'OnHold', icon: 'common-icon-Pause', color: "d5c13a", bgColor: "#d5c13a", iconType: 'class'},
	{name: 'Active-Need SOV Update', text: 'Active-Need SOV Update', id: 'ActivePendingSOVUpdate', key: 'ActivePendingSOVUpdate', value: 'ActivePendingSOVUpdate', icon: 'common-icon-payment-ledger', color: "14cc40", bgColor: "#14cc40", iconType: 'class'},	
];
export const vendorContractsStatusFilterOptions = [{text: 'Active Unlocked', id: 'ActiveUnlocked', key: 'ActiveUnlocked', value: 'ActiveUnlocked', iconCls: 'common-icon-unlock-padlock', color: "60ad07", iconType: 'class'},
{text: 'Awaiting Acceptance', id: 'AwaitingAcceptance', key: 'AwaitingAcceptance', value: 'AwaitingAcceptance', iconCls: 'common-icon-bid-pending-icon', color: "c29e0a", iconType: 'class'},
{text: 'Draft', id: 'Draft', key: 'Draft', value: 'Draft', iconCls: 'common-icon-Draft', color: "323232", iconType: 'class'},
{text: 'Scheduled', id: 'Scheduled', key: 'Scheduled', value: 'Scheduled', iconCls: 'common-icon-Scheduled', color: "836aea", iconType: 'class'},
{text: 'Ready To Post', id: 'ReadyToSubmit', key: 'ReadyToSubmit', value: 'ReadyToSubmit', iconCls: 'common-icon-ReadyToPost', color: "c83cd0", iconType: 'class'},
{text: 'Active', id: 'Active', key: 'Active', value: 'Active', iconCls: 'common-icon-Active', color: "0a8127", iconType: 'class'},
{text: 'Expired', id: 'Expired', key: 'Expired', value: 'Expired', iconCls: 'common-icon-Expired', color: "d35c0e", iconType: 'class'},
{text: 'Closed', id: 'Closed', key: 'Closed', value: 'Closed', iconCls: 'common-icon-Closed', color: "782a04", iconType: 'class'},
{text: 'No Funds', id: 'NoFunds', key: 'NoFunds', value: 'NoFunds', iconCls: 'common-icon-Closed', color: "ab0909", iconType: 'class'},
{text: 'Contract Not Accepted', key: 'Declined', value: 'Declined', id: 'Declined', iconCls: 'common-icon-Closed', color: "ab0909", iconType: 'class'},
{text: 'Awaiting Acceptance Unlocked', id: 'AwaitingAcceptanceUnlocked', key: 'AwaitingAcceptanceUnlocked', value: 'AwaitingAcceptanceUnlocked', iconCls: 'common-icon-bid-pending-icon', color: "ab0909", iconType: 'class'},
{text: 'Sent Back For Revision', id: 'SentBackForRevision', key: 'SentBackForRevision', value: 'SentBackForRevision', iconCls: 'common-icon-resubmitted', color: "9e4b1b", iconType: 'class'},
{text: 'Active-Need SOV Update', id: 'ActivePendingSOVUpdate', key: 'ActivePendingSOVUpdate', value: 'ActivePendingSOVUpdate', iconCls: 'common-icon-payment-ledger', color: "14cc40", iconType: 'class'},
{text: 'Active Unlocked-Need SOV Update', id: 'ActiveUnlockedPendingSOVUpdate', key: 'ActiveUnlockedPendingSOVUpdate', value: 'ActiveUnlockedPendingSOVUpdate', iconCls: 'common-icon-unlock-padlock', color: "60ad07", iconType: 'class'},
];

export const vendorContractsResponseStatusFilterOptions = [
	{text: 'Awaiting Acceptance', id: 'AwaitingAcceptance', key: 'AwaitingAcceptance', value: 'AwaitingAcceptance', icon: 'common-icon-bid-pending-icon', color: "c29e0a", iconType: 'class'},
	{text: 'Active', id: 'Active', icon: 'common-icon-Active', key: 'Active', value: 'Active', color: "0a8127", iconType: 'class'},
	{text: 'Declined', id: 'Declined', icon: 'common-icon-Declined', key: 'Declined', value: 'Declined', color: "d34441", iconType: 'class'},
	{text: 'Send Back For Revision', id: 'SentBackForRevision', key: 'SentBackForRevision', value: 'SentBackForRevision', icon: 'common-icon-resubmitted', color: "9e4b1b", iconType: 'class'},
	{text: 'On Hold', id: 'OnHold', icon: 'common-icon-Pause', key: 'OnHold', value: 'OnHold', color: "d5c13a", iconType: 'class'},
	{name: 'Active-Need SOV Update', text: 'Active-Need SOV Update', id: 'ActivePendingSOVUpdate', key: 'ActivePendingSOVUpdate', value: 'ActivePendingSOVUpdate', icon: 'common-icon-payment-ledger', color: "14cc40", bgColor: "#14cc40", iconType: 'class'},	
];