import {getServerInfo} from 'app/hooks';
import {currency, currencyCode} from 'app/utils';

export const isVendorContractGC = () => {};
export const isVendorContractSC = () => {};

export const isClientContractGC = () => {};
export const isClientContractSC = () => {};

export const isVendorPayAppGC = () => {};
export const isVendorPayAppSC = () => {};

export const isClientPayAppGC = () => {};
export const isClientPayAppSC = () => {};

export const amountFormatWithSymbol = (amount: any) => {
	const server = getServerInfo();
	const currencySymbol = currency[server?.currencyType];
	const formatCode = currencyCode[server?.currencyType];
	const value = typeof amount == 'number' ? amount : Number(amount?.replaceAll(',', ''));

	if(value && !isNaN(value)) {
		return `${currencySymbol}  ${new Intl.NumberFormat(formatCode).format(value)}`;
	}
	else {
		return `${currencySymbol} 0`;
	}
};

export const amountFormatWithOutSymbol = (amount: any) => {
	const server = getServerInfo();
	const formatCode = currencyCode[server?.currencyType];
	const value = typeof amount == 'number' ? amount : Number(amount?.replaceAll(',', ''));
	if(value && !isNaN(value)) {
		return `${new Intl.NumberFormat(formatCode).format(value)}`;
	}
	else {
		return `0`;
	}
};

export const isBudgetManager = () => {
	const server = getServerInfo(),
		permissions = server?.gblConfig?.user?.projectZonePermissions,
		isSuperAdmin = server?.gblConfig?.isAdmin
		// isAdmin = server?.gblConfig?.isProjectAdmin;
	if(isSuperAdmin || (permissions && Object?.values(permissions)?.includes('Budget Manager'))) return true;
	return false;
};

export const isBidManager = () => {
	const server = getServerInfo(),
		permissions = server?.gblConfig?.user?.projectZonePermissions,
		isSuperAdmin = server?.gblConfig?.isAdmin
		// isAdmin = server?.gblConfig?.isProjectAdmin;
	if(isSuperAdmin || (permissions && Object?.values(permissions)?.includes('Bid Manager'))) return true;
	return false;
};

export const isBidResponseManager = () => {
	const server = getServerInfo(),
		permissions = server?.gblConfig?.user?.projectZonePermissions,
		isSuperAdmin = server?.gblConfig?.isAdmin
		// isAdmin = server?.gblConfig?.isProjectAdmin;
	if(isSuperAdmin || (permissions && Object?.values(permissions)?.includes('Bid Response Manager'))) return true;
	return false;
};

export const isChangeEventGC = () => {
	const server = getServerInfo(),
		permissions = server?.gblConfig?.user?.projectZonePermissions,
		isSuperAdmin = server?.gblConfig?.isAdmin
		// isAdmin = server?.gblConfig?.isProjectAdmin;
	if(isSuperAdmin || (permissions && Object?.values(permissions)?.includes('Vendor Change Event Manager'))) return true;
	return false;
};

export const isChangeEventSC = () => {
	const server = getServerInfo(),
		permissions = server?.gblConfig?.user?.projectZonePermissions;
	if(permissions && Object?.values(permissions)?.includes('Sub Contractor Change Event Manager')) return true;
	return false;
};

export const isChangeEventClient = () => {
	const server = getServerInfo(),
		permissions = server?.gblConfig?.user?.projectZonePermissions;

	if(permissions && Object?.values(permissions)?.includes('Client Change Event Manager')) return true;
	return false;
};