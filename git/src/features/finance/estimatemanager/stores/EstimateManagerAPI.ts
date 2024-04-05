import { isLocalhost } from "app/utils";
import { gridData } from "data/Budgetmanger/griddata";

export const fetchGridDataList = async () => {
	let data: Array<any> = [];
	if(isLocalhost) {
		data = gridData.data;
	}

	return data;
};