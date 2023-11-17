import { compare } from "utilities/commonFunctions";

export const stateMap: any = {
	'Draft': { icon: 'common-icon-Draft', text: 'Draft', bgColor: '#323232', lightColor: '#dfdfdf', color: '#fff' },
	'AwaitingAcceptance': { icon: 'common-icon-bid-pending-icon', text: 'Awaiting Acceptance', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	'Authorized': { icon: 'common-icon-authorized', text: 'Authorized', bgColor: '#0a8127', lightColor: '#daedde', color: '#fff' },
	'AuthorizedUpdateContracts': { icon: 'common-icon-authorized', text: 'Authorized - Update Contracts', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	'Rejected': { icon: 'common-icon-reviewed-decline', text: 'Rejected', bgColor: '#d34441', lightColor: '#f9e2e2', color: '#fff' },
	'SentBackForRevision': { icon: 'common-icon-resubmitted', text: 'Sent Back For Revision', bgColor: '#a2480d', lightColor: '#f2e4da', color: '#fff' },
	'Revise': { icon: 'common-icon-resubmitted', text: 'Revise & Resubmit', bgColor: '#a2480d', lightColor: '#f2e4da', color: '#fff' },
	'AwaitingTradeQuote': { icon: 'common-icon-trade', text: 'Awaiting Trade Quote', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	'AwaitingQuote': { icon: 'common-icon-bid-pending-icon', text: 'Awaiting Quote', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	'QuoteSent': { icon: 'common-icon-quote-sent', text: 'Quote Sent', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff' },
	'QuoteReceived': { icon: 'common-icon-quote-received', text: 'Quote Received', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff' },
	'Active': { icon: 'common-icon-Active', text: 'Active', bgColor: '#0a8127', lightColor: '#daedde', color: '#fff' },
};

export const budgetStateMap: any = {
	'AwaitingQuote': { icon: 'common-icon-bid-pending-icon', text: 'Awaiting Quote', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	'QuoteSent': { icon: 'common-icon-quote-sent', text: 'Quote Sent', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff' },
	'QuoteReceived': { icon: 'common-icon-quote-received', text: 'Quote Received', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff' },
	'QuoteAccepted': { icon: 'common-icon-tickmark', text: 'Quote Accepted', bgColor: '#b9d536', lightColor: '#dfdfdf', color: '#fff' },
	'Revise': { icon: 'common-icon-resubmitted', text: 'Sent Back To Vendor', bgColor: '#e2b937', lightColor: '#f2e4da', color: '#fff' }
};

export const fundingSourceMap: any = {
	'ChangeOrder': 'Change Order',
	'GeneralContractor': 'General Contractor',
	'Contingency': 'Contingency'
};

export const statusFilterOptions: any = [
	{ icon: 'common-icon-Draft', text: 'Draft', key: 'Draft', value: 'Draft', id: 'Draft', bgColor: '#323232', lightColor: '#dfdfdf', color: '#fff' },
	{ icon: 'common-icon-bid-pending-icon', text: 'Awaiting Acceptance', key: 'AwaitingAcceptance', value: 'AwaitingAcceptance', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	{ icon: 'common-icon-authorized', text: 'Authorized', key: 'Authorized', value: 'Authorized', bgColor: '#0a8127', lightColor: '#daedde', color: '#fff' },
	{ icon: 'common-icon-authorized', text: 'Authorized - Update Contracts', key: 'AuthorizedUpdateContracts', value: 'AuthorizedUpdateContracts', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	{ icon: 'common-icon-reviewed-decline', text: 'Rejected', key: 'Rejected', value: 'Rejected', bgColor: '#d34441', lightColor: '#f9e2e2', color: '#fff' },
	{ icon: 'common-icon-resubmitted', text: 'Sent Back For Revision', key: 'SentBackForRevision', value: 'SentBackForRevision', bgColor: '#a2480d', lightColor: '#f2e4da', color: '#fff' },
	{ icon: 'common-icon-resubmitted', text: 'Revise & Resubmit', key: 'Revise', value: 'Revise', bgColor: '#a2480d', lightColor: '#f2e4da', color: '#fff' },
	{ icon: 'common-icon-trade', text: 'Awaiting Trade Quote', key: 'AwaitingTradeQuote', value: 'AwaitingTradeQuote', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	{ icon: 'common-icon-bid-pending-icon', text: 'Awaiting Quote', key: 'AwaitingQuote', value: 'AwaitingQuote', bgColor: '#c09e2b', lightColor: '#f7f1dc', color: '#fff' },
	{ icon: 'common-icon-quote-sent', text: 'Quote Sent', key: 'QuoteSent', value: 'QuoteSent', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff' },
	{ icon: 'common-icon-quote-received', text: 'Quote Received', key: 'QuoteReceived', value: 'QuoteReceived', bgColor: '#37bb6e', lightColor: '#bff3d5', color: '#fff' }
];

export const changeEventsRequest = async (appInfo: any, endPoint: string, opts: any, deleteMethod = false) => {
	const baseURL: string = `${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/changeevents`;
	const session = endPoint?.includes('?') ? `&sessionId=${appInfo?.sessionId}` : `?sessionId=${appInfo?.sessionId}`;
	const URL = baseURL + endPoint + session;
	const options = opts ? opts : {};
	const response = await fetch(URL, options);
	if (!response.ok) {
		const message = `API Request Error Client Contracts: ${response.status}`;
		throw new Error(message);
	}
	if (deleteMethod) {
		return response;
	}
	const data = await response.json();
	return data;
};

export const formatBudgetItems = (options: any) => {
	const groupNames: any = [];
	let data = options?.map((option: any, index: any) => {
		const values: any = [];
		options?.forEach((option1: any) => {
			if (option?.division === option1?.division) {
				const value = {
					value: option1?.id,
					label: option1?.name + '-' + option1?.costCode + '-' + option1?.costType,
					contractAmount: option1?.contractAmount,
					unitOfMeasure: option1?.unitOfMeasure,
					quantity: option1?.quantity,
					unitCost: option1?.unitCost,
					description: option1?.description
				};
				values.push(value);
			}
		});
		if (!groupNames?.includes(option?.division)) {
			groupNames.push(option?.division);
			return {
				id: index,
				value: option?.id,
				label: option?.division,
				options: values.sort(compare)
			};
		} return;
	});
	data = data.filter(function (element: any) {
		return element !== undefined;
	});
	return data.sort(compare);

};

export const checkEstimatedAmount = (data: any) => {
	console.log("data", data);
	let isAmountFound: any = true;
	data?.budgetItems?.forEach((item: any) => {
		if (isAmountFound && item?.estimateSource == 'EstimatedChangeAmount') {
			console.log("isAmountFound", data, isAmountFound);
			isAmountFound = item?.estimate?.amount ? true : false;
		}
		else isAmountFound = isAmountFound && item?.quote?.amount ? true : false;
	});
	console.log("isAmountFound12", data, isAmountFound);
	return isAmountFound;
};

export const checkAtleastOneBudgetIsAssignedToVendor = (data: any) => {
	let isFound = false;
	data?.budgetItems?.forEach((item: any) => {
		if (!isFound && item?.estimateSource == 'QuoteFromVendor') isFound = true;
	});
	return isFound;
};

export const checkSubmitBy = (data: any) => {
	let isFound = true;
	data?.budgetItems?.filter((obj: any) => obj?.estimateSource == 'QuoteFromVendor')?.forEach((item: any) => {
		if (isFound && item?.submitBy) isFound = true;
		else isFound = false;
	});
	return isFound;

};

export const checkSubmitEnable = (data: any) => {
	let isFound = true;
	data?.budgetItems?.forEach((item: any) => {
		if (isFound && item?.quote?.amount) isFound = true;
		else isFound = false;
	});
	return isFound;
};

// export const isUserGCForCER = (appInfo:any) => {
//     if(appInfo?.gblConfig?.isAdmin || appInfo?.gblConfig?.isProjectAdmin) return true;
//     if(Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Vendor Contract Manager')) return true;
//     if(Object.values(appInfo?.gblConfig?.user?.projectZonePermissions)?.includes('Client Contract Manager')) return false;
//     return 'Not Authorized';
//   }

export const confirmationDescriptionMap: any = {
	submit: 'would like to send the Change Event Requests to the Client for an approval.',
	reject: 'reviewed the Change Event Request in detail and decided not proceed with the proposed Change Event Request.',
	revise: 'reviewed the Change Event Request in detail and would like to make some changes detailed the above reason.',
	requestQuote: 'would like to Request a Quote from Trade for the above listed Work Item(s).',
	verifyAuthorize: 'reviewed the Change Event Request in detail and I acknowledge & Authorize the Budget for all the Work Items to get Updated.'
};

export const getUpdatedCEAmount = (budgetItem: any) => {
	const contractAmount = budgetItem?.contractAmount ? budgetItem?.contractAmount : 0;
	const estimatedAmount = budgetItem?.status == 'QuoteReceived' ? budgetItem?.quote?.amount ?? 0 : budgetItem?.estimate?.amount ?? 0;
	console.log("budgetItem", budgetItem, Number(contractAmount) + Number(estimatedAmount))
	return Number(contractAmount) + Number(estimatedAmount);
};