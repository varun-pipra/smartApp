/**
 * This function fetches the list of Catalogs
 */
const moduleName = "Add Inventory : Subcategory";

export const fetchInventorySubCategoryList = async () => {
  const response = await fetch(
    "https://1396ca01-9098-4ce6-b25e-551d4bed09a2.mock.pstmn.io/toolsAndEquipment/inventory/subcategories",
    {}
  );
  if (!response.ok) {
    const message = `API Request Error (${moduleName}): ${response.status}`;
    throw new Error(message);
  }
  const Subcategories = await response.json();
  return Subcategories;
};
