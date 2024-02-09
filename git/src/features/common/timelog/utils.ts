import React from 'react';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { postMessage } from "app/utils";
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