import { isLocalhost } from 'app/utils';
import { triggerEvent } from 'utilities/commonFunctions';
import { ForecastApiData } from 'data/vendorContracts/forecastData';

const moduleName = "Forecast: Forecasts Info";

export const fetchForecastsList = async (appInfo: any, contractId:any) => {
	let response;	
	if (!isLocalhost) {
		if (contractId) { 

			response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.uniqueId}/finance/vendorcontracts/${contractId}/forecasts?sessionId=${appInfo?.sessionId}`);
			if (!response?.ok) {
				const message = `API Request Error (${moduleName}): ${response?.status}`;
				// return response							
				throw new Error(message);
			}
			const responseData = await response?.json();
			return responseData
		}
	}
	return ForecastApiData;
};