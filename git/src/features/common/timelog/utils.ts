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