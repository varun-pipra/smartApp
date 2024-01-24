/**
 * This function fetches the list of Catalogs
 */
const moduleName = 'Tools & Catalog: Catalog';

export const fetchCatalogList = async () => {
	const response = await fetch('https://edf52ecf-76f7-496e-a39f-d80c77fe4529.mock.pstmn.io/toolsAndEquipment/catalog/getAll', {
		// headers: { 'x-api-key': 'PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6' }
	});
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const catalogs = await response.json();

	return catalogs;
};
