/**
 * This function fetches the list of Costtype dropdown optins
 */
const moduleName = 'Budget Manager: Costtype Options';

export const fetchCosttypeOptionList = async () => {
	const response = await fetch('https://f0e27571-0a78-4496-933a-1ec91d25a541.mock.pstmn.io/budgetManager/costType', {
		headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' }
	});

	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return responseData;
}
