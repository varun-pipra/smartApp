import { isLocalhost } from 'app/utils';
import { triggerEvent } from 'utilities/commonFunctions';
import { ContactPerson, CompanyData, CompanyFiltersData } from 'data/bids/bidList';
import { userRolesData } from 'data/vendorContracts/userCompanyData';
import { companiesData } from 'data/clientContracts/clientCompanies';

const moduleName = "Client Contracts: Company Info";

export const fetchUserRoles = async (appInfo: any) => {
	// EnterpriseDesktop/Collaboration/LookupUsers?_dc=1681715207696&globalIds=9193ac67-fd46-4ae2-b34a-4db3656ad1cf
	let response;
	if (!isLocalhost) { 
        if(appInfo?.currentUserInfo?.userGlobalId) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Collaboration/LookupUsers?_dc=1681715207696&globalIds=${appInfo?.currentUserInfo?.userGlobalId}&sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
		return responseData?.values[0]
	} 
	return userRolesData?.values[0];
};

export const fetchClientCompanies = async (appInfo: any) => {
	let response;	
	if (!isLocalhost) { 
        if(appInfo?.currentUserInfo?.userGlobalId) response = await fetch(`${appInfo?.hostUrl}/admin/companies?globalId=${appInfo?.currentUserInfo?.userGlobalId}&sessionId=${appInfo?.sessionId}`);
		if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
		return responseData?.values
	} 
	return companiesData?.values;
};

