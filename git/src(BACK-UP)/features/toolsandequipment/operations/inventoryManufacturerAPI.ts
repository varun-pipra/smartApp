/**
 * This function fetches the list of Catalogs
 */
const moduleName = "Add Inventory : manufacturer";

export const fetchInventoryManufacturerList = async () => {
  const response = await fetch( "https://b08151f5-40e5-4848-8155-453a10351668.mock.pstmn.io/toolsAndEquipment/inventory/manufacturers",
    {}
  );
  if (!response.ok) {
    const message = `API Request Error (${moduleName}): ${response.status}`;
    throw new Error(message);
  }
  const manufacturer = await response.json();
  return manufacturer;
};
