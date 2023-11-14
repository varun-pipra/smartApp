import { isLocalhost } from 'app/utils';
import { triggerEvent } from 'utilities/commonFunctions';
import { ForecastApiData } from 'data/vendorContracts/forecastData';
import { clientRequest } from '../utils';

const moduleName = "Client Contracts Forecast: Forecasts Info";

export const fetchForecastsList = async (appInfo: any, contractId:any) => {
	if (!isLocalhost) {
		if (contractId) { 
                const response = await clientRequest(appInfo, `/${contractId}/forecasts`, {});
                return response
		}
	}
	return ForecastApiData;
};