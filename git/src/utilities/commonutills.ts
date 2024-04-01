export class CommonUtils {
	static isEmpty(value: any) {
		if(
			value == null ||
			value === undefined ||
			value === '' ||
			(value instanceof Object && Object.keys(value).length == 0) ||
			(typeof value === 'number' && (value === null || value === undefined)) ||
			(value instanceof String && value === '') ||
			(value instanceof Array && value.length == 0) ||
			(value instanceof Map && value.size == 0 && Object.keys(value).length === 0)
		) {
			return true;
		}
		return false;
	}
	static isRemoved(value: any) {
		return value instanceof String && value === '_removed';
	}
	static isNotEmpty(value: any) {
		return !CommonUtils.isEmpty(value);
	}
}

export const getAmountAlignment = (amount: any) => {
	return amount ? amount?.toLocaleString("en-US") : '';
};

export const getAmountAlignmentNew = (amount: any, code: any) => {
	if(amount && !isNaN(amount)) {
		return new Intl.NumberFormat(code).format(amount);
	} else {
		return 0;
	}
};

export const getFormattedAmount = (amount: any, code: any) => {
	if(amount && !isNaN(amount)) {
		return new Intl.NumberFormat(code || 'en-US').format(amount);
	} else {
		return 0;
	}
};

export const isUserGC = (appInfo: any) => {
	if(appInfo?.gblConfig?.isAdmin) return true;
	if(Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Vendor Contract Manager')) return true;
	if(Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Sub Contract Manager')) return false;
	return 'Not Authorized';
};
export const getCurrencySymbolAndAlign = (data: any) => {
	const number = Number(data);
};

export const errorStatus = [500, 400, 401, 403, 404, 303];
export const errorMsg = 'Something Went Wrong!!!';

export const providerSourceObj:any = {
	0: 'Trade Partner',
	1: 'Self Perform'
}

export const importType:any = {
		'new': 0, 
        'replace': 1,
        'append': 2,
        'merge': 3
};
export const billableInCCObj:any = {
	'false': 'Non-Billable',
	'true': 'Billable'
}
export const sourceTypeObj:any = {
	0: "Purchase",
	1: "Rent"
};

export const measurementSymbols:any = {
	"Feet": 'ft',
	"Meters": 'm',
	"CentiMeters": 'cm',
	"MilliMeters": 'mm',
}

export const connectorsObj:any = {
	"SAP Connector": 0,
	"Procore Connector": 1,
	"CMiC Connector": 2,
}

export const getConnectorType:any = (name:any) => {
	return name?.toLowerCase()?.includes('sap') ? 0 : name?.toLowerCase()?.includes('procore') ? 1 : 2;
}

export	const connectorImages:any = {
	0: "https://connectorscdn.smartappbeta.com/641b5203-bfa5-4185-9975-78e157b85bf2/1.0.8/icons/sap-blue-logo-sm.png",
	1: "https://connectorscdn.smartappbeta.com/19d2f6b2-78bb-4324-8e26-4b53581da07a/1.0.3/icons/procore.png",
	2: "https://connectorscdn.smartappbeta.com/054dff2a-f744-4951-8e96-ee8d9fa6749b/1.0.2/icons/cmic-logo.png",
};
