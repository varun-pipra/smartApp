import React from 'react';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { postMessage } from "app/utils";
import moment from "moment";

export const AddLinksData = [
	{
		"text": "New Smart Item",
		"value": "New Smart Item",
		"id": 1,
		"type": "Custom",
		iconCls: "common-icon-new-smart-item",
		children: []
	},
	{
		"text": "Existing Smart Items",
		"value": "Existing Smart Items",
		"id": 2,
		"type": "Custom",
		children: [],
		iconCls: "common-icon-existing-smart-items",
	}
];

export const AppList = (appsList:any) => {

	const addLinksOptionsCopy = [...AddLinksData];
	let newSmartItem: any = addLinksOptionsCopy.find((rec: any) => rec.value === "New Smart Item");
	let existingSmartItem: any = addLinksOptionsCopy.find((rec: any) => rec.value === "Existing Smart Items");
	const appsForNew = appsList?.map((obj: any) => {
		return {
			...obj,
			isNew: true,
			"text": obj?.name,
			"value": obj?.name,
			"id": obj?.id,
			icon: obj?.thumbnailUrl,
			"appid": obj?.objectId,
			"type": "Document"
		};
	});
	const appsForExisting = appsList?.map((obj: any) => {
		return {
			...obj,
			isNew: false,
			"text": obj?.name,
			"value": obj?.name,
			"id": obj?.id,
			icon: obj?.thumbnailUrl,
			"appid": obj?.objectId,
			"type": "Document"
		};
	});
	newSmartItem.children = appsForNew;
	existingSmartItem.children = appsForExisting;
	return addLinksOptionsCopy
}

export const TimeLogRequest = async (appInfo: any, endPoint: string, opts: any, deleteMethod = false) => {
	const baseURL: string = `${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/timelog/${appInfo?.uniqueId}`;
	const session = endPoint?.includes('?') ? `&sessionId=${appInfo?.sessionId}` : `?sessionId=${appInfo?.sessionId}`;
	const URL = baseURL + endPoint + session;
	const options = opts ? opts : {};
	const response = await fetch(URL, options);
	if (!response.ok) {
		const message = `API Request Error Time Log: ${response.status}`;
		throw new Error(message);
	}
	if (deleteMethod) {
		return response;
	}
	const data = await response.json();
	return data;
};

export const AppList_PostMessage = (e: any) => {

		const data = { "Id": e.id, "smartAppId": e.appid, "Text": e.text, "Type": e.type, }
		let sendMsg = {
			event: "common",
			body: { evt: "smartitemlink", isNew: e.isNew, data: data }
		}
		console.log('sendMsg', sendMsg)
		postMessage(sendMsg);
};

export const getPickerDefaultTime = (time: any, incrementDecrement: any) => {
	const ConvertDate: any = new Date(time);
	if (isNaN(ConvertDate)) {
		return '';
	};
	const ConvertTime: any = moment.utc(time).format('hh:mm A');
	let [hours, minutes, ampm] = ConvertTime?.split(/:|\s/);
	hours = parseInt(hours, 10);
	minutes = parseInt(minutes, 10);
	if (isNaN(hours) && isNaN(minutes)) {
		return '';
	}
	if (incrementDecrement) {
		minutes += 5;
		if (minutes >= 60) {
			minutes -= 60;
			hours = (hours + 1) % 12;
		}
	} else {
		minutes -= 5;
		if (minutes < 0) {
			minutes += 60;
			hours = (hours - 1 + 12) % 12;
		}
	}
	// Format the new time
	hours = hours === 0 ? 12 : hours; // Handle midnight (0 hours)
	if (hours === 12 && minutes === 0) {
		ampm = ampm?.toLowerCase() === "am" ? "PM" : "AM";
	}
	let newTime = `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
	return newTime;
}

export const getDuration = (data:any) => {
	if(data){
		let hours = Math.floor(data / 60);
		let minutes = data % 60 ?? "00";
		return `${hours} Hrs ${minutes ? minutes : '00'} Mins`
	}
	else{
		return '0 Hrs : 00 Mins'
	}
}

export const GetUniqueList = (data: any, key?: any) => {
  let unique: any = [];
  data?.map((item: any) =>
    unique?.filter((obj: any) => obj?.[key] === item?.[key])?.length > 0
      ? null
      : item?.value
      ? unique.push(item)
      : null
  );
  unique?.sort((a: any, b: any) =>
    a?.[key]?.localeCompare(b?.[key], undefined, { numeric: true })
  );
  return unique;
};

export const findAndUpdateFiltersData = (
  filterOptions: any,
  data: any,
  key: string,
  nested?: boolean,
  nestedKey?: any
	) => {
  const formattedData = data?.map((rec: any) => {
	 if (nested)
      return {
        text: rec?.[key]?.[nestedKey],
        value: rec?.[key]?.[nestedKey],
        id: rec?.[key]?.id,
      };
    else
      return {
        text: rec?.[key] ?? rec?.["name"],
        value: rec?.[key] ?? rec?.["name"],
        id: rec?.id,
      };
	});
	
  const filtersCopy: any = [...filterOptions];
  let currentItem: any = filtersCopy.find((rec: any) => rec?.keyValue === key);
  currentItem.children.items = GetUniqueList(formattedData?.flat(), "text");
  let mapData = [...filterOptions].map((item: any) => {
    if (item.key === currentItem.key) return currentItem;
    else return item;
  });
  return mapData;
};

export const dateFormat = (date:any) =>{
	// Extract year, month, and day
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
	const day = String(date.getDate()).padStart(2, '0');

	// Format the date as YYYY-MM-DD
	const formattedDate = year + '-' + month + '-' + day;
	return formattedDate
}
export const dateFunctionalities  = (value:any) =>{
	
		if(value == 'today'){
				const date = dateFormat(new Date());
				return {from :date ,to : date}
		}
		else if (value == 'yesterday'){
			const defaultDate = new Date(new Date().setDate(new Date().getDate() - 1));
			const yesterdaydate = dateFormat(defaultDate);
			return {from :yesterdaydate ,to : yesterdaydate}
		}
		else if(value == 'thisWeek'){
			const today = new Date();
			const dayOfWeek = today.getDay();
			const difference = dayOfWeek - 1;
			const firstDayOfWeek = new Date(today);

			const defaultDate = new Date(firstDayOfWeek.setDate(today.getDate() - difference));
			const thisweek = dateFormat(defaultDate);
			return {from :thisweek ,to : dateFormat(new Date())}
		}
		else if(value == 'lastWeek'){
				var today = new Date();
				var dayOfWeek = today.getDay();
				var difference = dayOfWeek - 1;

				// Adjust the date to get to the first day of the week
				var firstDayOfCurrentWeek = new Date(today);
				firstDayOfCurrentWeek.setDate(today.getDate() - difference);

				// Subtract 7 days to get to the first day of the previous week
				var firstDayOfPreviousWeek = new Date(firstDayOfCurrentWeek);
				const previousDate = new Date(firstDayOfPreviousWeek.setDate(firstDayOfCurrentWeek.getDate() - 7))

				// Subtract 1 day to get to the last day of the previous week
				var lastDayOfPreviousWeek = new Date(firstDayOfCurrentWeek);
				const defaultDate = new Date(lastDayOfPreviousWeek.setDate(firstDayOfCurrentWeek.getDate() - 1));

				const first = dateFormat(previousDate);
				const last = dateFormat(defaultDate);
				return {from :first ,to : last}
		}
		else if (value == 'thisMonth'){
				var today = new Date();
				var thismonth = new Date();
				var monthfirstdate = new Date(thismonth.setDate(1));

				var currentDate = new Date();
				currentDate.setMonth(currentDate.getMonth() + 1, 0);
				const monthlastdate  = new Date(currentDate.setMonth(currentDate.getMonth() + 1, 0));

				return {from : dateFormat(monthfirstdate) ,to : dateFormat(monthlastdate)}
		}
		else if (value == 'lastMonth'){
			var currentDate = new Date();
			
			// Get the first date of the current month
			var firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
			
			var lastDateOfPreviousMonth = new Date(firstDateOfCurrentMonth);
			const lastdate = 	new Date(lastDateOfPreviousMonth.setDate(firstDateOfCurrentMonth.getDate() - 1));
			
			// Move back one month from the first date of the current month to get the first date of the previous month
			var firstDateOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

			return {from : dateFormat(firstDateOfPreviousMonth) ,to : dateFormat(lastdate)}
		}
		else if (value == 'future'){
			var currentDate = new Date();
			const yesterdaydate = new Date(new Date().setDate(new Date().getDate() + 1));
			return {from :dateFormat(currentDate) ,to : dateFormat(yesterdaydate)}
		}
}

export const generateSplitEntryData  = (row:any) => {
	let data:any = [];
	[0,1]?.forEach((item:any, index:any) => {
		if(index === 0) {
			data.push({ startTime: moment?.utc(row?.startTime)?.format('LT'), endTime: "", notes: "", duration: "0 Hrs 00 Mins" });
		} else if(index === 1) {
			data.push({ startTime: "", endTime: moment?.utc(row?.endTime)?.format('LT'), notes: "", duration: "0 Hrs 00 Mins", disable:true });
		};
	});
	return data;
};

export const checkGUID = (segmentId:any)  => {
		const containsOnlyZeros =/^[0-9-]*$/.test(segmentId);
		return !containsOnlyZeros;
}