/**
 * This function fetches the list of tools
 */
const moduleName = 'Tools & Catalog: Inventory';

export const fetchInventoryList = async () => {
	const response = await fetch('https://edf52ecf-76f7-496e-a39f-d80c77fe4529.mock.pstmn.io/toolsAndEquipment/inventory/tools/getAll', {
		headers: {'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6'}
	});
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const tools = await response.json();
	return tools;
};

export const fetchAnalyticsData = async () => {
	const response = await fetch('https://edf52ecf-76f7-496e-a39f-d80c77fe4529.mock.pstmn.io/toolsAndEquipment/inventory/analytics/getAll', {
		headers: {'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6'}
	});
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const analyticsData = await response.json();
	return analyticsData;
};

export const fetchRTLSData = async () => {
	const response = await fetch('https://edf52ecf-76f7-496e-a39f-d80c77fe4529.mock.pstmn.io/toolsAndEquipment/inventory/rtls/getAll', {
		headers: {'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6'}
	});
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const rtlsData = await response.json();
	return rtlsData;
};