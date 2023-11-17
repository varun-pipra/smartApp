import { store } from 'app/store';
import { setLiveData } from 'features/bidmanager/stores/gridSlice';
import { setBiddersData } from 'features/bidmanager/stores/BiddersSlice';
import { setSelectedRecord } from 'features/bidmanager/stores/BidManagerSlice';
import { setBidQueriesData } from 'features/bidmanager/stores/BidQueriesSlice';
import { setAwardBidDetailsData } from 'features/bidmanager/stores/awardBidSlice';

export const mainGridRTListener = (path: any, event: any) => {
	const { value } = event;
	console.log('BID MANAGER MAIN GRID RT DATA==============================================================>', value);

	if (value) {
		const { update } = value;
		store.dispatch(setLiveData(value));
		if (update?.length) {
			const rootState = store.getState();
			const { selectedRecord } = rootState?.bidManager;
			const record = update[0];
			const { bidders } = record;
			if (selectedRecord && record?.id === selectedRecord?.id) {
				store.dispatch(setSelectedRecord(record));
				store.dispatch(setBiddersData(bidders));
			}
		}
	}
};

export const bidQueryRTListener = (path: any, event: any) => {
	const { value } = event;
	console.log('BID MANAGER BID QUERY RT DATA==============================================================>', value);

	if (value) {
		const { bidPackageUniqueId, update } = value;

		if (update?.length) {
			const rootState = store.getState();
			const { selectedRecord } = rootState?.bidManager;
			if (bidPackageUniqueId === selectedRecord?.id) {
				store.dispatch(setBidQueriesData(update));
			}
		}
	}
};

export const awardBidRTListener = (path: any, event: any) => {
	const { value } = event;
	console.log('BID MANAGER AWARD BID RT DATA==============================================================>', value);

	if (value) {
		const { bidPackageUniqueId, update } = value;
		if (update?.length) {
			const record = update[0];
			const rootState = store.getState();
			const { selectedRecord } = rootState?.bidManager;
			if (bidPackageUniqueId === selectedRecord?.id) {
				const { awardBidDetailData } = rootState?.awardBid;
				let newList = [];

				for (const detail of awardBidDetailData) {
					if (detail.id === record.id) {
						newList.push(record);
					} else {
						newList.push(detail);
					}
				}

				store.dispatch(setAwardBidDetailsData(newList));
			}
		}
	}
};

const awardBidSample = {
	"bidPackageUniqueId": "f3c22dc5-ecb2-4625-8b1d-796576b271d2",
	"update": [
		{
			"id": "64a93ba0-a55f-47d6-adc3-2f0a35c20358",
			"name": null,
			"packageStatus": 0,
			"bidderUID": "d68eb31b-7129-4191-a346-c22881f8d55f",
			"company": {
				"id": "00000000-0000-0000-0000-000000000000",
				"objectId": 0,
				"isRestricted": false,
				"thumbnailUrl": null,
				"calendarId": null,
				"isImportedFromOrg": false,
				"isOrgCompany": false,
				"name": null,
				"phone": null,
				"website": null,
				"colorCode": null,
				"vendorId": null,
				"hasSubCompany": false,
				"companyType": 0,
				"isDiverseSupplier": false,
				"complianceStatus": null,
				"address": null,
				"tradeName": null,
				"diverseCategories": null
			},
			"contact": null,
			"responseStatus": 4,
			"submissionStatus": 1,
			"description": null,
			"processType": 0,
			"budgetItems": [],
			"queryDeadLine": null,
			"queryCount": 0,
			"bidAmount": 25,
			"totalBudget": null,
			"bidCoverLetter": null,
			"bidInclusions": null,
			"bidExclusions": null,
			"respondedOn": null,
			"respondedBy": null,
			"respondedByThumbnail": null,
			"endDate": "2023-06-27T18:30:00",
			"bidders": [],
			"referenceFiles": [],
			"intendToBidCountdown": 1,
			"intendToBid": 2,
			"hasIntendToBidCountdown": false
		}
	]
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
	"id": "f2d1aa9c-13d3-4e18-bf2e-44b5a046eb4d",
	"displayId": "P0052",
	"name": "0007 - Alma's Soup",
	"startDate": "2023-06-15T18:30:00Z",
	"endDate": "2023-06-29T18:30:00Z",
	"status": 0,
	"description": null,
	"instructions": null,
	"processType": 0,
	"type": 1,
	"budgetItems": [
		{
			"id": "c27327d4-90f7-4a5e-a57f-e7dd977fe568",
			"description": null,
			"createdBy": null,
			"modifiedBy": null,
			"createdDate": "0001-01-01T00:00:00",
			"modifiedDate": "0001-01-01T00:00:00",
			"projectId": "00000000-0000-0000-0000-000000000000",
			"name": "00043",
			"division": "01 - General Requirement",
			"costCode": "General Contractor 1001",
			"costType": "L - Labor",
			"estimatedStart": null,
			"estimatedEnd": null,
			"curve": 0,
			"originalAmount": 0,
			"status": 0,
			"totalRefundAmount": 0,
			"totalTransactionAmount": 0,
			"totalTransferIn": 0,
			"totalTransferOut": 0,
			"totalTransferAmount": 0,
			"totalChangeOrders": 0,
			"revisedBudget": 600000,
			"balance": 0,
			"isCostCodeInvalid": false,
			"Vendors": null,
			"unitOfMeasure": "",
			"unitQuantity": null,
			"unitCost": null,
			"pendingChangeOrderAmount": null,
			"pendingTransactionAmount": null,
			"pendingRefundAmount": null,
			"budgetForecast": null,
			"balanceForecast": null,
			"actualScheduleStart": null,
			"actualScheduleEnd": null,
			"projectedScheduleStart": null,
			"projectedScheduleEnd": null,
			"contract": null,
			"bidPackage": null
		}
	],
	"cCEmails": [],
	"bidders": [
		{
			"id": "88b714fc-3879-445c-9c0b-ee1e275792ea",
			"queryCount": 0,
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
			"contactPerson": {
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
				"companyName": "1 Bid Company"
			},
			"intendToBid": 0,
			"submissionStatus": 0,
			"totalBidValue": 0,
			"totalBudgetValue": 0,
			"bidCoverLetter": null,
			"bidInclusions": null,
			"bidExclusions": null,
			"awarded": false,
			"noOfFiles": 0
		}
	],
	"hasQueryDeadLine": false,
	"queryDeadLine": null,
	"hasSiteWalkthrough": false,
	"siteWalkthrough": null,
	"walkthroughNotes": null,
	"hasIntendToBidCountdown": true,
	"intendToBidCountdown": 1,
	"hasCountdownEmails": false,
	"countdownEmails": 0,
	"estimatedBudget": 600000,
	"refFileCount": 12,
	"bidderQueryCount": 0,
	"bidderCount": 1,
	"referenceFiles": [
		{
			"id": "f0a3edd0-972e-40fb-89fc-82b0747d831e",
			"driveObjectId": null,
			"objectId": 1412463,
			"fileType": 1,
			"contentType": "",
			"name": "0004 - A004 SHEET INDEX 3 - FIRE SPRINKLER AND ALARM - 4091-500 (1)",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/a110fe76fa6572417761b629544eea13/5",
			"createdDate": "2023-06-16T17:16:29.797Z"
		},
		{
			"id": "62d50676-922b-4a09-bb47-54d59a15641f",
			"driveObjectId": null,
			"objectId": 1436941,
			"fileType": 0,
			"contentType": ".pdf",
			"name": "dummy.pdf",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/2942bfabb3d05332b66eb128e0842cff/5",
			"createdDate": "2023-06-22T05:50:21.687Z"
		},
		{
			"id": "d75ecd22-c7e5-4e46-91ad-8208a5048810",
			"driveObjectId": null,
			"objectId": 1437238,
			"fileType": 20,
			"contentType": ".png",
			"name": "check.png",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/0b16724f1be1e3ef716f6be553e0cce7/5",
			"createdDate": "2023-06-22T06:57:00.78Z"
		},
		{
			"id": "308eb0c9-df8d-4079-a89b-9a016a7457ac",
			"driveObjectId": null,
			"objectId": 1437245,
			"fileType": 0,
			"contentType": ".pdf",
			"name": "Smartapp.pdf",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/c76028ce52ff09bf56c61383f0965b9a/5",
			"createdDate": "2023-06-22T06:57:22.03Z"
		},
		{
			"id": "878c585f-021f-4bf4-a347-7f78ffa7dcfd",
			"driveObjectId": null,
			"objectId": 1437246,
			"fileType": 0,
			"contentType": ".pdf",
			"name": "7602 - M602 MECHANICAL DETAILS - 4091-500.pdf",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/cbd16a557f6c5e87b2bbecedbd991c5e/5",
			"createdDate": "2023-06-22T06:57:22.217Z"
		},
		{
			"id": "913ef5ea-6fba-4989-bce8-41333a59fe42",
			"driveObjectId": null,
			"objectId": 1450262,
			"fileType": 0,
			"contentType": ".pdf",
			"name": "E0.7 - ELECTRICAL SITE UNDERSLAB PLANS.pdf",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/f0c37be1924cabda09cfc5184ef0ed03/5",
			"createdDate": "2023-06-22T16:50:42.287Z"
		},
		{
			"id": "ca7445f8-a886-45e8-b493-afebeed29864",
			"driveObjectId": null,
			"objectId": 1450269,
			"fileType": 1,
			"contentType": ".pdf",
			"name": "Q012022244B42.pdf",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/62833e883e39eca00662572b0b7fcedb/5",
			"createdDate": "2023-06-22T16:51:02.96Z"
		},
		{
			"id": "2c39d57b-afbd-4845-b93b-9c255c58dc52",
			"driveObjectId": null,
			"objectId": 1453333,
			"fileType": 0,
			"contentType": ".png",
			"name": "Division and LID Title issue.png",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/497fbab5adde86f36f80cb485de8e465/5",
			"createdDate": "2023-06-23T06:20:43.763Z"
		},
		{
			"id": "776e32cb-e010-4837-a240-03d1af1d36e2",
			"driveObjectId": null,
			"objectId": 1455721,
			"fileType": 0,
			"contentType": ".pdf",
			"name": "Content.pdf",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/2e85ce8b136f33bcd3885386495126ba/5",
			"createdDate": "2023-06-23T10:30:31.54Z"
		},
		{
			"id": "0431b68d-d0a8-4db7-93ab-5cf5f3cab8b0",
			"driveObjectId": null,
			"objectId": 1455722,
			"fileType": 0,
			"contentType": ".pdf",
			"name": "4.pdf",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/728a28dfe10acbdc2dc988d717be689c/5",
			"createdDate": "2023-06-23T10:30:31.837Z"
		},
		{
			"id": "e16cc062-9eef-486e-84bc-54f48a87fed5",
			"driveObjectId": null,
			"objectId": 1455797,
			"fileType": 0,
			"contentType": ".png",
			"name": "Empty text overflow.png",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/ec9c0ab6d18d65e76d14755fe69c3398/5",
			"createdDate": "2023-06-23T10:35:14.693Z"
		},
		{
			"id": "cf88948e-2f3f-4bbd-9b2d-5128423cb05f",
			"driveObjectId": null,
			"objectId": 1455798,
			"fileType": 0,
			"contentType": ".png",
			"name": "High Budget PC.png",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/45a6a21763d8375a7363d1ec050cfc9e/5",
			"createdDate": "2023-06-23T10:35:14.943Z"
		}
	],
	"projectInfo": {
		"id": "6e83792a-3e66-49d6-9442-c6a1e918b48f",
		"name": "MyWorkSpace Project",
		"thumbnailUrl": "https://central.smartappbeta.com/Content/ProjectThumbnailImageByAppZoneId/5ba09a787d0a4ea1bc0f0c1420152d1c",
		"location": {
			"latitude": 12.9539974,
			"longitude": 77.6309395,
			"mapPolygon": "POLYGON ((13.173706 77.8826809, 13.173706 77.3791981, 12.7342888 77.3791981, 12.7342888 77.8826809, 13.173706 77.8826809))",
			"encodedpolygon": "s~koAwmjzM?xiaBjytA??yiaBkytA?"
		}
	},
	"createdBy": {
		"roles": {
			"532022": "GC/CM/PCM",
			"532042": "Supervisor"
		},
		"projectZonePermissions": null,
		"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
		"objectId": 534917,
		"phone": "4016261441",
		"email": "mksudeep@smartapp.com",
		"firstName": "Sudeep",
		"lastName": "MK",
		"thumbnail": "https://central.smartappbeta.com/images/37466949-8b40-485c-84e8-a6a69b56a34f",
		"companyName": "Tutions"
	},
	"modifiedBy": {
		"roles": {
			"532018": "Architect"
		},
		"projectZonePermissions": null,
		"id": "5b7f3eb7-9161-434d-b43d-0524d92842ff",
		"objectId": 1132500,
		"phone": "",
		"email": "pjegannathan@smartapp.com",
		"firstName": "Premkumar",
		"lastName": "Alexis",
		"thumbnail": "https://central.smartappbeta.com/skins/base/img/P_200dp.png",
		"companyName": "1 Bid Company"
	},
	"company": {
		"id": "babe38cd-a0a3-4f1b-b7e9-5d715bd22066",
		"objectId": 547977,
		"isRestricted": false,
		"thumbnailUrl": "https://central.smartappbeta.com/skins/base/img/t_200dp.png",
		"calendarId": null,
		"isImportedFromOrg": false,
		"isOrgCompany": false,
		"name": "Tutions",
		"phone": "+14016261441",
		"website": "",
		"colorCode": "5de8c6",
		"vendorId": "",
		"hasSubCompany": false,
		"companyType": 1,
		"isDiverseSupplier": false,
		"complianceStatus": null,
		"address": "1350,Division Road ",
		"tradeName": null,
		"diverseCategories": null
	},
	"awardedTo": null
};