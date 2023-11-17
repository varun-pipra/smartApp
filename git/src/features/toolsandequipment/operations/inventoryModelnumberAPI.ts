/**
 * This function fetches the list of Catalogs
 */
const moduleName = "Add Inventory : modelnumber";

export const fetchInventoryModelnumberList = async () => {
  const response = await fetch(
    "https://f088bdc1-723f-460c-917d-0758c8ec8188.mock.pstmn.io/toolsAndEquipment/inventory/modelnumbers",
    {}
  );
  if (!response.ok) {
    const message = `API Request Error (${moduleName}): ${response.status}`;
    throw new Error(message);
  }
  const modelnumber = await response.json();
  return modelnumber;
};
