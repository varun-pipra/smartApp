/**
 * This function fetches the data of stackedbarchart
 */
const moduleName = "analytical_tab : groupedbarchart";

export const fetchGroupedBarChartData = async () => {
  const response = await fetch(
    "https://2122a918-af44-4f20-8642-9ff6343cfe88.mock.pstmn.io/toolsAndEquipment/catalog/analyticalChart/groupedBarChart",
    {
      headers: {
        "x-api-key":
          "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6",
      },
    }
  );
  if (!response.ok) {
    const message = `API Request Error (${moduleName}): ${response.status}`;
    throw new Error(message);
  }
  const groupedbarchart = await response.json();
  return groupedbarchart;
};
