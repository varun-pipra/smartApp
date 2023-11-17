/**
 * This function fetches the data of stackedbarchart
 */
const moduleName = "analytical_tab : donutchart";

export const fetchDonutChartData = async () => {
  const response = await fetch(
    "https://2122a918-af44-4f20-8642-9ff6343cfe88.mock.pstmn.io/toolsAndEquipment/catalog/analyticalChart/donut",
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
  const donutchart = await response.json();
  return donutchart;
};
