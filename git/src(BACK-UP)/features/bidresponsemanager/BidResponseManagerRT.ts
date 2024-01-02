import { store } from 'app/store';
import { setLiveData } from 'features/bidresponsemanager/stores/gridSlice';
import { setBidQueriesData } from 'features/bidmanager/stores/BidQueriesSlice';
import { setResponseRecord } from 'features/bidresponsemanager/stores/BidResponseSlice';
import { setSelectedRecord, setBidDetails } from 'features/bidresponsemanager/stores/BidResponseManagerSlice';

export const mainGridRTListener = (path: any, event: any) => {
	const { value } = event;
	console.log('BID RESPONSE MANAGER MAIN GRID RT DATA==============================================================>', value);

	if (value) {
		const { bidPackageUniqueId, add, update } = value;
		const rootState = store.getState();

		if (add?.length || update?.length) {
			const { selectedRecord } = rootState?.bidResponseManager;
			const { companyId } = rootState.appInfo?.server?.currentUserInfo;
			const newRecord = add?.find((record: any) => companyId === record?.company?.objectId),
				updatedRecord = update?.find((record: any) => companyId === record?.company?.objectId);

			if (newRecord) {
				store.dispatch(setLiveData({ add: [newRecord] }));
			}

			if (updatedRecord && selectedRecord?.id === bidPackageUniqueId) {
				store.dispatch(setLiveData({ update: [updatedRecord] }));
				store.dispatch(setBidDetails(updatedRecord));
				store.dispatch(setSelectedRecord(updatedRecord));
				store.dispatch(setResponseRecord(updatedRecord));
			}
		}
	}
};

export const bidQueryRTListener = (path: any, event: any) => {
	const { value } = event;
	console.log('BID RESPONSE MANAGER BID QUERY RT DATA==============================================================>', value);

	if (value) {
		const { bidPackageUniqueId, update } = value;
		if (update?.length) {
			const rootState = store.getState();
			const { selectedRecord } = rootState?.bidResponseManager;
			const { companyId } = rootState.appInfo?.server?.currentUserInfo;
			if (bidPackageUniqueId === selectedRecord?.id) {
				const queriesToShow = update.filter((query: any) => !query?.isPrivate || query?.queryBy?.companyId === companyId);
				store.dispatch(setBidQueriesData(queriesToShow));
			}
		}
	}
};

const querySample = {
	"bidPackageUniqueId": "f3c22dc5-ecb2-4625-8b1d-796576b271d2",
	"update": [
		{
			"id": "5bd78e42-474a-40a0-8b9f-7a57662171db",
			"bidPackageUniqueId": "f3c22dc5-ecb2-4625-8b1d-796576b271d2",
			"bidderId": "8b11dfe7-3d1f-4e82-9714-00d1d7de1ac2",
			"queryBy": {
				"roles": {
					"531964": "Safety Manager",
					"531966": "Scheduler"
				},
				"projectZonePermissions": null,
				"id": "fbb5d36d-68a2-440e-b33a-80510217c9c8",
				"objectId": 588058,
				"phone": "3434534",
				"email": "kchauhan@smartapp.com",
				"firstName": "kirtika",
				"lastName": "chauhan",
				"thumbnail": "https://central.smartappbeta.com/skins/base/img/k_200dp.png",
				"companyName": "Smartapp"
			},
			"queryDate": "2023-06-27T10:25:19.573Z",
			"queryResponse": {
				"queryId": "5bd78e42-474a-40a0-8b9f-7a57662171db",
				"responseBy": {
					"roles": {
						"531964": "Safety Manager",
						"531966": "Scheduler"
					},
					"projectZonePermissions": null,
					"id": "fbb5d36d-68a2-440e-b33a-80510217c9c8",
					"objectId": 588058,
					"phone": "3434534",
					"email": "kchauhan@smartapp.com",
					"firstName": "kirtika",
					"lastName": "chauhan",
					"thumbnail": "https://central.smartappbeta.com/skins/base/img/k_200dp.png",
					"companyName": "Smartapp"
				},
				"responseDate": "2023-06-27T10:25:59.333Z",
				"responseText": "make private",
				"isPrivate": true
			},
			"queryText": "Private query",
			"isPrivate": true
		},
		{
			"id": "5c07bd54-04be-483b-b0cd-aacb1ca5e412",
			"bidPackageUniqueId": "f3c22dc5-ecb2-4625-8b1d-796576b271d2",
			"bidderId": "8b11dfe7-3d1f-4e82-9714-00d1d7de1ac2",
			"queryBy": {
				"roles": {
					"531964": "Safety Manager",
					"531966": "Scheduler"
				},
				"projectZonePermissions": null,
				"id": "fbb5d36d-68a2-440e-b33a-80510217c9c8",
				"objectId": 588058,
				"phone": "3434534",
				"email": "kchauhan@smartapp.com",
				"firstName": "kirtika",
				"lastName": "chauhan",
				"thumbnail": "https://central.smartappbeta.com/skins/base/img/k_200dp.png",
				"companyName": "Smartapp"
			},
			"queryDate": "2023-06-28T10:17:41.007Z",
			"queryResponse": null,
			"queryText": "test,,,",
			"isPrivate": true
		}
	]
};

const sample = {
	"bidPackageUniqueId": "d5635f02-6099-42a0-9e3a-bb173556b44e",
	"update": [
		{
			"id": "d5635f02-6099-42a0-9e3a-bb173556b44e",
			"name": null,
			"packageStatus": 0,
			"bidderUID": "3241f30a-363e-42fa-9bfc-49f9b6d259e6",
			"company": {
				"id": "82187766-1002-490b-860e-87496d4c01b4",
				"objectId": 1134563,
				"isRestricted": false,
				"thumbnailUrl": "https://central.smartappbeta.com/skins/base/img/b_200dp.png",
				"calendarId": null,
				"isImportedFromOrg": false,
				"isOrgCompany": false,
				"name": "1 Bid Company",
				"phone": "",
				"website": "",
				"colorCode": "7949d2",
				"vendorId": "",
				"hasSubCompany": false,
				"companyType": 1,
				"isDiverseSupplier": false,
				"complianceStatus": null,
				"address": "1350,Division Road ",
				"tradeName": null,
				"diverseCategories": null
			},
			"contact": {
				"roles": {
					"532018": "Architect"
				},
				"projectZonePermissions": null,
				"id": "639dc19a-f885-44fd-ab58-7b8cad032bc0",
				"objectId": 1134646,
				"phone": "",
				"email": "pjegannathan+1@smartapp.com",
				"firstName": "Premkumar",
				"lastName": "A",
				"thumbnail": "https://central.smartappbeta.com/skins/base/img/P_200dp.png",
				"companyName": "1 Bid Company",
				"companyUId": "82187766-1002-490b-860e-87496d4c01b4"
			},
			"responseStatus": 5,
			"submissionStatus": 3,
			"description": null,
			"processType": 0,
			"budgetItems": [
				{
					"id": "f06cad77-e13c-49fa-9877-f416db6c74e8",
					"name": "00033",
					"bidValue": 15000,
					"division": "08 - Doors and Windows",
					"costCode": "Special Windows 8650",
					"costType": "M - Materials",
					"unitOfMeasure": "ea",
					"unitCost": 2000,
					"unitQuantity": 300,
					"budgetValue": 15000
				}
			],
			"queryDeadLine": null,
			"queryCount": 0,
			"bidAmount": 15000,
			"totalBudget": 15000,
			"bidCoverLetter": null,
			"bidInclusions": null,
			"bidExclusions": null,
			"respondedOn": "2023-06-30T11:11:59.017Z",
			"respondedBy": "A, Premkumar",
			"respondedByThumbnail": "https://central.smartappbeta.com/skins/base/img/P_200dp.png",
			"endDate": null,
			"bidders": [],
			"referenceFiles": [],
			"intendToBidCountdown": 1,
			"intendToBid": 2,
			"hasIntendToBidCountdown": false
		}
	]
};