/**
 * This function fetches the data of stackedbarchart
 */
 const moduleName = 'analytical_tab : stackedbarchart';

 export const fetchStackedBarChartData = async () => {
     const response = await fetch(
        'https://3bd59b5f-f5bd-4b54-9e70-838cdc84fc01.mock.pstmn.io/stackedbarchart/chart',
        {}
     );
     if (!response.ok) {
         const message = `API Request Error (${moduleName}): ${response.status}`;
         throw new Error(message);
     }
     const stackedbarchart = await response.json();
     return stackedbarchart;
 }
 