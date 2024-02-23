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
