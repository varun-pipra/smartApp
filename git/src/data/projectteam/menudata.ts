export const assignUnassignData = [
	{ text: 'None', value: 'None', icon: 'common-icon-none', disable: false, key: 'noneChecked', isMTA: true },
	{ text: 'Full Access with All Permissions (Super Admin)', value: 'Super Admin', icon: 'common-icon-super-admin', disable: false, key: 'superadminChecked', isMTA: true },
	{ text: 'Admin access for the Assigned Role (Admin)', value: 'Admin', icon: 'common-icon-Admin-Settings', disable: false, key: 'adminChecked', isMTA: true },
	{ text: 'Admin access for the Assigned Role & Purchase Add-ons (Admin with Billing)', value: 'Admin with Billing', icon: 'common-icon-admin-with-billing', disable: false, key: 'adminWithPay', isMTA: true },
	{ text: 'Can Add Users and Companies (Project Team Manager)', value: 'Project Team Manager', icon: 'common-icon-team-member', disable: false, key: 'projectTeamManager', isMTA: true },
	{ text: 'Can Add and Manage my Company Workers and Attestation (Company Manager)', value: 'Company Manager', icon: 'common-icon-Admin-Settings', disable: false, key: 'companyManger', isMTA: true },
	{ text: 'Manage my Company’s Certificate of Insurance and Diversity Information (Compliance Manager)', value: 'Compliance Manager', icon: 'common-icon-compliance-Status', disable: false, key: 'complianceManager', isMTA: true }
]
export const generalPermissionsMap = {
	"None": { enum: 0, msg: 'Access removed!' },
	"Super Admin": { enum: 1, msg: 'Super Admin access permitted!' },
	"Admin": { enum: 4, msg: 'Admin access permitted!' },
	"Admin with Billing": { enum: 2, msg: 'Admin with billing access permitted!' },
	"Project Team Manager": { enum: 5, msg: 'Project Team Manager access permitted!' },
	"Company Manager": { enum: 0, msg: 'Company Manager access permitted!' }, //3
	"Compliance Manager": { enum: 0, msg: 'Compliance Manager access permitted!' } //6
}
export const userPermissionTypeMap: any = {
	"Admin": { enum: 1 },
	"ProjectAdmin": { enum: 4 },
	"AdminWithBilling": { enum: 2 },
	"ProjectTeamManager": { enum: 5, msg: 'Project Team Manager access permitted!' },
	"CompanyManager": { enum: 3, msg: 'Company Manager access permitted!' },
	"ComplianceManager": { enum: 6, msg: 'Compliance Manager access permitted!' }
}
export const assignUnassignDataNonMTA = [
	{ text: 'None', value: 'None', icon: 'common-icon-none', disable: false, key: 'noneChecked', isMTA: false },
	{ text: 'Admin access for the Assigned Role (Admin)', value: 'Admin', icon: 'common-icon-super-admin', disable: false, key: 'adminChecked', isMTA: false }
]
export const generalPermissionsMapNonMTA = {
	"None": { enum: 0, msg: 'Access removed!' },
	"Admin": { enum: 1, msg: 'Admin access permitted!' }
}
export const assignUnassignData2 = [
	{ text: 'General Contractor', value: '', icon: '', key: '' },
	{ text: 'Create and Update Budget', value: 'Budget Manager', icon: 'common-icon-budget-manager', disable: false, key: 'budgetManager'},
	{ text: 'Create and Award Bids to Vendors', value: 'Bid Manager', icon: 'common-icon-bid-lookup', disable: false, key: 'bidManager'},
	{ text: 'Create and Manage Contracts, Vendors & Clients', value: 'Vendor Contract Manager', icon: 'common-icon-manage-pay-icon', disable: false, key: 'vendorContractManager' },
	{ text: 'Create and Manage Pay Applications with both Vendors & Clients', value: 'Vendor Pay Manager', icon: 'common-icon-manage-pay-icon', disable: false, key: 'vendorPayManager' },
	{ text: 'Create & Manage Contract Change Events with both Vendors & Clients', value: 'Vendor Change Event Manager', icon: 'common-icon-manage-pay-icon', disable: false, key: 'vendorChangeEventManager' },
	{ text: 'Client', value: '', icon: '', key: '' },
	{ text: 'Approve & Manage Client Contracts', value: 'Client Contract Manager', icon: 'common-icon-contracts', disable: false, key: 'clientContractManager' },
	{ text: 'Approve & Manage Client Pay Applications', value: 'Client Pay Manager', icon: 'common-icon-contracts', disable: false, key: 'clientPayManager' },
	{ text: 'Approve Change Events', value: 'Client Change Event Manager', icon: 'common-icon-contracts', disable: false, key: 'clientChangeEventManager' },
	{ text: 'Vendor', value: '', icon: '', key: '' },
	{ text: 'Submit Bid Responses for my Company', value: 'Bid Response Manager', icon: 'common-icon-contracts', disable: false, key: 'bidResponseManager' },
	{ text: 'Manage and Review my Company Contracts', value: 'Sub Contract Manager', icon: 'common-icon-vendor-contracts', disable: false, key: 'subContractManager' },
	{ text: 'Create and Manage my Company Pay Application', value: 'Sub Contract Pay Manager', icon: 'common-icon-vendor-contracts', disable: false, key: 'subContractPayManager' },
	{ text: 'Respond to Quote Requests for my Company', value: 'Sub Contractor Change Event Manager', icon: 'common-icon-bid-response', disable: false, key: 'subContractorChangeEventManager' },	
	{ text: 'Safety Requirement Manager', value: 'Safety Requirement Manager', icon: 'common-icon-Safety-Onboarding-Flyer', disable: false, key: 'safetyRequirementManager' }
];

export const timelogAssignUnassignData = [
	{ text: 'Can Manage Time for this Project', value: 'Can Manage Time for this Project', icon: 'common-icon-Timer', disable: false, key: 'projectTimeLog'},
	{ text: 'Can Manage Time for My Company', value: 'Can Manage Time for My Company', icon: 'common-icon-Timer', disable: false, key: 'CompanyTimeLog'},
];