/**
 * This function fetches the list of Catalogs
 */
const moduleName = "Add Inventory : category";

export const fetchInventoryCategoryList = async () => {
  const response = await fetch(
    "https://c722988b-befa-42b4-8e25-82c2c98cc48e.mock.pstmn.io/toolsAndEquipment/inventory/categories",
    {}
  );
  if (!response.ok) {
    const message = `API Request Error (${moduleName}): ${response.status}`;
    throw new Error(message);
  }
  const categories = await response.json();
  return categories;
};
