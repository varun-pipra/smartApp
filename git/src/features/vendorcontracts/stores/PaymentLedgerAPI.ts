import { isLocalhost } from "app/utils";
import { vcChangeEvents } from "data/vendorContracts/changeEvents";
import { vendorPayAppsGridData } from "data/vendorpayapplications/gridData";
import { payAppsRequest } from "features/vendorpayapplications/utils";

const moduleName = "Vendor Contracts: Change Events";


export const fetchPaymentLedgerList = async (appInfo: any, contractId:any) => {
	console.log("payAppsRequestpayAppsRequest", appInfo)
	if (!isLocalhost) {
		if(contractId) {
			const response = await payAppsRequest(appInfo, `?vendorcontractid=${contractId}&offset=0&limit=10000`, {});
			return response?.data
			}
		}
    return vendorPayAppsGridData?.data
};

export const fetchVendorContractChangeEvents = async (appInfo: any, contractId:string) => {
	let response;
	if (!isLocalhost) {
		if(contractId) {
			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo.uniqueId}/finance/vendorcontracts/${contractId}/changeevents?offset=0&limit=10000&sessionId=${appInfo?.sessionId}`);
			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				// return response							
				throw new Error(message);
			}
			const responseData = await response?.json();
			return responseData
		}
	}
	return vcChangeEvents;
};