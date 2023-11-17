export const changeEvents = {
	"data": [
		{
			"name": "Test Change Event",
			"id": "c50b65cf-ec66-4613-9059-0d143ed3269f",
			"createdOn": "2023-08-25T15:02:57.833Z",
			"description": "<p>Request from Vendor</p>",
			"code": "CE0013",
			"modifiedOn": "2023-08-28T06:15:05.967Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
				"email": "mksudeep+client@smartapp.com",
				"globalId": "a5822fde-1074-47c8-920b-1ea3f5c0d074",
				"lastName": "Client",
				"firstName": "Sudeep",
				"displayName": "Client, Sudeep"
			},
			"quoteAmount": 24000,
			"vendorContracts": [
				{
				  "title": "Testing & Contols",
				  "id": "cdfbd4fd-8ac8-4a7e-a872-62171ff6308a",
				  "poNumber": "P987654",
				  "code": "C10144"
				},
				{
					"title": "Testing & Contols123",
					"id": "cdfbd4fd-8ac8-4a7e-a872-62171ff6308a",
					"poNumber": "P987654",
					"code": "C10144"
				  }
			],
			"status": "SentBackForRevision",
			"estimatedAmount": 1000.00,
			"submitted": {
				"signature": "data:image/png;base64,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",
				"on": "2023-08-25T15:29:47.96Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"fundingSource": "ChangeOrder",
			"files": null,
			"clientContract": {
				"title": "ARC 13-07-23 CC",
				"id": "e551ba78-a05f-4415-bf97-233899285b3f",
				"poNumber": null,
				"code": "C0038",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fiqadmin%2Fdynamic%2F2308%2Fmka35l3k%2Fcheck.png?generation=1692886696349723&alt=media",
						"cloudStorageKey": null
					}
				}
			},
			"responses": [
				{
					"reason": "Change Required.",
					"signature": "data:image/png;base64,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",
					"on": "2023-08-28T06:15:05.967Z",
					"by": {
						"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
						"image": {
							"downloadUrl": "https://central.smartappbeta.com/skins/base/img/s_200dp.png",
							"cloudStorageKey": null
						},
						"email": "mksudeep+client@smartapp.com",
						"globalId": "a5822fde-1074-47c8-920b-1ea3f5c0d074",
						"lastName": "Client",
						"firstName": "Sudeep",
						"displayName": "Client, Sudeep"
					},
					"type": "SentBackForRevision"
				}
			],
			"budgetItems": [
				{
					"submitBy": null,
					"contractAmount": 250.00,
					"quote": null,
					"estimate": {
						"quantity": null,
						"amount": 1000.00,
						"unitCost": null
					},
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					"response": null,
					"vendorContract": {
						title: 'vxcvbnm',
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": null,
							"id": "f77b6757-2863-4c7c-9a9a-4ee8b40edc8e",
							"name": "IQ Prime",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					},
					"id": "31e88624-569e-4287-b07f-d29cf51b5a2d",
					"name": "00081",
					"costType": "L - Labor",
					"costCode": "Site Preparation 2100",
					"division": "02 - Existing Conditions",
					"unitCost": null,
					"description": "<p>Add estimate</p>",
					"unitOfMeasure": ""
				}
			]
		},
		{
			"createdOn": "2023-09-26T09:30:08.303Z",
			"modifiedOn": "2023-09-26T09:31:13.77Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
				"email": "swathi@smartapp.com",
				"globalId": "239c63a4-9de7-4a0d-94f4-eeba41799007",
				"lastName": "Kolli",
				"firstName": "Swathi",
				"displayName": "Kolli, Swathi"
			},
			"status": "QuoteReceived",
			"estimatedAmount": null,
			"submitted": null,
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "Internet & Environment services CC",
				"id": "448cc134-c75c-47fc-a9a6-882e3a0f578a",
				"poNumber": "P34567890",
				"code": "C0109",
				"client": {
					"pointOfContacts": [
						{
							"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
							"name": "Client, Sudeep",
							"email": "mksudeep+client@smartapp.com",
							"phone": "",
							"image": {
								"downloadUrl": "https://central.smartappbeta.com/skins/base/img/s_200dp.png",
								"cloudStorageKey": null
							}
						}
					],
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "contactus@iqclient.com",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/mka35l3k/check.png",
						"cloudStorageKey": null
					}
				}
			},
			"responses": null,
			"budgetItems": [
				{
					"submitBy": null,
					"quote": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					"estimate": null,
					"response": null,
					"vendorContract": null,
					"contractAmount": 30000.00,
					"name": "00375",
					"id": "5f8ca44d-96dd-423c-bd7f-6e592dd1cc8c",
					"quantity": null,
					"costType": "E - Equipment",
					"costCode": "Internet Services 201300",
					"division": "20 - ABC Miscellaneous",
					"unitCost": 200.00,
					"description": null,
					"unitOfMeasure": "ls",
					"estimatedEndDate": null,
					"estimatedStartDate": null
				},
				{
					"submitBy": "2023-09-28T18:30:00Z",
					"quote": {
						"quantity": 30,
						"amount": 90000.00,
						"unitCost": 3000.00
					},
					"estimateSource": "QuoteFromVendor",
					"status": "QuoteReceived",
					"submitted": {
						"signature": "data:image/png;base64,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",
						"on": "2023-09-26T09:30:52.757Z",
						"by": {
							"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
							"email": "mksudeep@smartapp.com",
							"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
							"lastName": "MK",
							"firstName": "Sudeep",
							"displayName": "MK, Sudeep"
						},
						"role": null
					},
					"estimate": null,
					"response": {
						"reason": null,
						"on": "2023-09-26T09:31:17.113Z",
						"by": {
							"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
							"image": {
								"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
								"cloudStorageKey": null
							},
							"email": "swathi@smartapp.com",
							"globalId": "239c63a4-9de7-4a0d-94f4-eeba41799007",
							"lastName": "Kolli",
							"firstName": "Swathi",
							"displayName": "Kolli, Swathi"
						},
						"status": "QuoteSent"
					},
					"vendorContract": {
						"title": "Internet&Enviromental Services",
						"id": "7bf6fcec-1a18-4e14-ba9a-4b59b220ca5e",
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
									"name": "Kolli, Swathi",
									"email": "swathi@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "4dec6c09-da4b-4cd4-9f45-cb054418b362",
							"name": "IQ Vendor",
							"email": "contactus@iqvendor.com",
							"phone": "",
							"image": {
								"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/kcx3i14q/cross.png",
								"cloudStorageKey": null
							}
						}
					},
					"contractAmount": 25000.00,
					"name": "00376",
					"id": "fd6bf0a1-dee9-4338-b803-72e099c0b720",
					"quantity": null,
					"costType": "L - Labor",
					"costCode": "Environmental Services 201600",
					"division": "20 - ABC Miscellaneous",
					"unitCost": 100.00,
					"description": null,
					"unitOfMeasure": "Hours",
					"estimatedEndDate": null,
					"estimatedStartDate": null
				}
			],
			"name": "Internet Services CE",
			"id": "371d1662-5916-4d91-821a-4e12d21debcd",
			"description": "<p><span style=\"color: rgb(34, 34, 34);\">If in any Case, We need the Contract to NOT be routed for Signature &amp; Approval then the new button added will directly move the Contract from&nbsp;&nbsp;</span><em style=\"color: rgb(23, 43, 77);\">\"Ready to Post\" to \"Active\"&nbsp;</em><span style=\"color: rgb(23, 43, 77);\">state without any intermediate states or approvals.</span></p>",
			"code": "CE0065"
		},
		{
			"name": "Demolition",
			"id": "701ba891-f63b-4042-bd9d-1fa923da518c",
			"createdOn": "2023-08-25T11:16:49.547Z",
			"description": "<p>Add estimate for one budget and one request quote.</p>",
			"code": "CE0012",
			"modifiedOn": "2023-08-25T11:21:39.083Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"status": "Revise",
			"estimatedAmount": 180000.000000000000,
			"submitted": null,
			"fundingSource": "ChangeOrder",
			"files": null,
			"clientContract": {
				"title": "r4r4r4",
				"id": "3655afa5-a66e-4614-b64a-26ef47da55d7",
				"poNumber": null,
				"code": "C0024",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fiqadmin%2Fdynamic%2F2308%2Fmka35l3k%2Fcheck.png?generation=1692886696349723&alt=media",
						"cloudStorageKey": null
					}
				}
			},
			"responses": null,
			"budgetItems": [
				{
					"submitBy": null,
					"contractAmount": 2000.00,
					"quote": null,
					"estimate": {
						"quantity": 300,
						"amount": 180000.00,
						"unitCost": 600.00
					},
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: {
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					},
					"response": null,
					"id": "4485e5e2-6296-4a75-8788-ebe18f9eb10d",
					"name": "00042",
					"costType": "E - Equipment",
					"costCode": "General Contractor- High Rise Office 1011",
					"division": "01 - General Requirement",
					"unitCost": 500.00,
					"description": "",
					"unitOfMeasure": "ea"
				},
				{
					"submitBy": null,
					"contractAmount": 25000.00,
					"quote": null,
					"estimate": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: {
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					},
					"response": null,
					"id": "aef94279-7f96-4879-b79d-ceabacb3ef6d",
					"name": "00019",
					"costType": "SVC - Professional Services",
					"costCode": "Demolition 2050",
					"division": "02 - Existing Conditions",
					"unitCost": 50.00,
					"description": "",
					"unitOfMeasure": "m2"
				},

			]
		},
		{
			"name": "Cement",
			"id": "6bc87857-27e3-4047-8049-2ebf838a33b4",
			"createdOn": "2023-08-24T12:23:10.13Z",
			"description": "<p>This edescription</p>",
			"code": "CE0004",
			"modifiedOn": "2023-08-24T17:57:24.887Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
				"email": "mksudeep+client@smartapp.com",
				"globalId": "a5822fde-1074-47c8-920b-1ea3f5c0d074",
				"lastName": "Client",
				"firstName": "Sudeep",
				"displayName": "Client, Sudeep"
			},
			"status": "Rejected",
			"estimatedAmount": 20000.000000000000,
			"submitted": {
				"signature": "data:image/png;base64,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",
				"on": "2023-08-24T17:56:06.29Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"fundingSource": "GeneralContractor",
			"files": null,
			"clientContract": {
				"title": "r4r4r4",
				"id": "3655afa5-a66e-4614-b64a-26ef47da55d7",
				"poNumber": null,
				"code": "C0024",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fiqadmin%2Fdynamic%2F2308%2Fmka35l3k%2Fcheck.png?generation=1692886696349723&alt=media",
						"cloudStorageKey": null
					}
				}
			},
			"responses": [
				{
					"reason": "Need the amount change.",
					"signature": "data:image/png;base64,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",
					"on": "2023-08-24T17:57:24.887Z",
					"by": {
						"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
						"image": {
							"downloadUrl": "https://central.smartappbeta.com/skins/base/img/s_200dp.png",
							"cloudStorageKey": null
						},
						"email": "mksudeep+client@smartapp.com",
						"globalId": "a5822fde-1074-47c8-920b-1ea3f5c0d074",
						"lastName": "Client",
						"firstName": "Sudeep",
						"displayName": "Client, Sudeep"
					},
					"type": "Declined"
				}
			],
			"budgetItems": [
				{
					"submitBy": null,
					"contractAmount": 50000.00,
					"quote": null,
					"estimate": {
						"quantity": 100,
						"amount": 20000.00,
						"unitCost": 200.00
					},
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: {
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					},
					"response": null,
					"id": "92f04f5c-a86a-461e-9bb1-83d2d08c27fe",
					"name": "00017",
					"costType": "L - Labor",
					"costCode": "Cement 2065",
					"division": "02 - Existing Conditions",
					"unitCost": 5.00,
					"description": null,
					"unitOfMeasure": "cc"
				}
			]
		},
		{
			"name": "Electricals 002",
			"id": "8eb67282-fe80-4f87-a90e-2de9b8ca19a7",
			"createdOn": "2023-08-24T14:04:36.613Z",
			"description": "<p>Electricals</p>",
			"code": "CE0007",
			"modifiedOn": "2023-08-24T18:24:36.633Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"status": "QuoteReceived",
			"estimatedAmount": 100000.000000000000,
			"submitted": null,
			"fundingSource": "ChangeOrder",
			"files": [
				{
					"id": "1ca2c423-ec28-4393-9af3-11a2920e3a1c",
					"name": "AB-1 - ASBESTOS ABATEMENT PLAN BUILDING 28 BASEMENT LEVEL.pdf",
					"stream": {
						"size": 1214923,
						"hash": "ca3b665b00c0942c23b0b8392ab25d5c",
						"id": "183dce55-3957-4598-ad7c-4c93d23bef51",
						"sketch": {
							"streamPages": [
								{
									"pageNumber": 1,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fsheetmanager%2Fstream%2F2023_2%2F183dce5539574598ad7c4c93d23bef51%2Fraw%2Fb25f70e90ae143f6a4ffe03a86209749?generation=1675881386505650&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/sheetmanager/stream/2023_2/183dce5539574598ad7c4c93d23bef51/raw/b25f70e90ae143f6a4ffe03a86209749"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fsheetmanager%2Fstream%2F2023_2%2F183dce5539574598ad7c4c93d23bef51%2Fthumbnails%2Fb25f70e90ae143f6a4ffe03a86209749?generation=1675881387601299&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/sheetmanager/stream/2023_2/183dce5539574598ad7c4c93d23bef51/thumbnails/b25f70e90ae143f6a4ffe03a86209749"
									}
								}
							],
							"contentPages": [
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "49a3b4e0-f278-46f4-9cfa-f668946a1c63",
									"actualPageNumber": 1,
									"contentPageNumber": 1,
									"thumbnail": null,
									"rawThumbnail": null
								}
							],
							"revisions": []
						},
						"thumbnails": [
							{
								"size": 1,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_2%2Fca3b665b00c0942c23b0b8392ab25d5c%2FRaw.png?generation=1675881388696800&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_2/ca3b665b00c0942c23b0b8392ab25d5c/Raw.png"
							},
							{
								"size": 2,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_2%2Fca3b665b00c0942c23b0b8392ab25d5c%2FIcon.png?generation=1675881390185492&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_2/ca3b665b00c0942c23b0b8392ab25d5c/Icon.png"
							},
							{
								"size": 3,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_2%2Fca3b665b00c0942c23b0b8392ab25d5c%2FSmall.png?generation=1675881391654339&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_2/ca3b665b00c0942c23b0b8392ab25d5c/Small.png"
							},
							{
								"size": 4,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_2%2Fca3b665b00c0942c23b0b8392ab25d5c%2FMedium.png?generation=1675881393185249&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_2/ca3b665b00c0942c23b0b8392ab25d5c/Medium.png"
							},
							{
								"size": 5,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_2%2Fca3b665b00c0942c23b0b8392ab25d5c%2FLarge.png?generation=1675881361171319&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_2/ca3b665b00c0942c23b0b8392ab25d5c/Large.png"
							}
						],
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/api/v2/download/183dce55-3957-4598-ad7c-4c93d23bef51",
						"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_2/ca3b665b00c0942c23b0b8392ab25d5c/Content"
					}
				}
			],
			"clientContract": {
				"title": "Electricals From Client",
				"id": "2e4f4ee5-059f-4709-8d2d-368d439ddc51",
				"poNumber": null,
				"code": "C0042",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fiqadmin%2Fdynamic%2F2308%2Fmka35l3k%2Fcheck.png?generation=1692886696349723&alt=media",
						"cloudStorageKey": null
					}
				}
			},
			"responses": null,
			"budgetItems": [
				{
					"submitBy": null,
					"contractAmount": 25000.00,
					"quote": null,
					"estimate": {
						"quantity": 50,
						"amount": 10000.00,
						"unitCost": 200.00
					},
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: {
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					},
					"response": null,
					"id": "97e8f5c3-09de-4a8d-8b79-3d28fa773403",
					"name": "00105",
					"costType": "L - Labor",
					"costCode": "High Voltage Distribution, Switching and Protection 16320",
					"division": "16 - Electrical",
					"unitCost": 250.00,
					"description": "<p>Change 200 to 50.</p>",
					"unitOfMeasure": "Hours"
				},
				{
					"submitBy": "2023-08-25T18:30:00Z",
					"contractAmount": 200000.00,
					"quote": {
						"quantity": 300,
						"amount": 90000.00,
						"unitCost": 300.00
					},
					"estimate": {
						"quantity": 300,
						"amount": 90000.00,
						"unitCost": 300.00
					},
					"estimateSource": "QuoteFromVendor",
					"status": "QuoteAccepted",
					"submitted": {
						"signature": "data:image/png;base64,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",
						"on": "2023-08-24T14:25:04.293Z",
						"by": {
							"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
							"email": "mksudeep@smartapp.com",
							"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
							"lastName": "MK",
							"firstName": "Sudeep",
							"displayName": "MK, Sudeep"
						},
						"role": null
					},
					vendorContract: {
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					},
					"response": {
						"reason": null,
						"on": "2023-08-24T17:31:02.47Z",
						"by": {
							"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
							"image": {
								"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
								"cloudStorageKey": null
							},
							"email": "swathi@smartapp.com",
							"globalId": "239c63a4-9de7-4a0d-94f4-eeba41799007",
							"lastName": "Kolli",
							"firstName": "Swathi",
							"displayName": "Kolli, Swathi"
						},
						"status": "QuoteSent"
					},
					"id": "5fcbec45-6625-4dbe-862b-b35143d2fa68",
					"name": "00107",
					"costType": "E - Equipment",
					"costCode": "Alarm Systems 16750",
					"division": "16 - Electrical",
					"unitCost": 400.00,
					"description": "<p>Provide the quote amount by 26 of this month.</p>",
					"unitOfMeasure": "cc"
				}
			]
		},
		{
			"createdOn": "2023-09-12T10:05:52.147Z",
			"modifiedOn": "2023-09-12T10:52:02.41Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"status": "AwaitingAcceptance",
			"estimatedAmount": 121000.00,
			"submitted": {
				"signature": "data:image/png;base64,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",
				"on": "2023-09-12T10:52:02.41Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "Internet & Environment services CC",
				"id": "448cc134-c75c-47fc-a9a6-882e3a0f578a",
				"poNumber": "P34567890",
				"code": "C0109",
				"client": {
					"pointOfContacts": [
						{
							"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
							"name": "Client, Sudeep",
							"email": "mksudeep+client@smartapp.com",
							"phone": "",
							"image": {
								"downloadUrl": "https://central.smartappbeta.com/skins/base/img/s_200dp.png",
								"cloudStorageKey": null
							}
						}
					],
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/mka35l3k/check.png",
						"cloudStorageKey": null
					}
				}
			},
			"responses": null,
			"budgetItems": [
				{
					"submitBy": "2023-09-20T18:30:00Z",
					"quote": {
						"quantity": 250,
						"amount": 50000.00,
						"unitCost": 200.00
					},
					"estimateSource": "QuoteFromVendor",
					"status": "QuoteAccepted",
					"submitted": {
						"signature": "data:image/png;base64,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",
						"on": "2023-09-12T10:22:23.947Z",
						"by": {
							"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
							"email": "mksudeep@smartapp.com",
							"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
							"lastName": "MK",
							"firstName": "Sudeep",
							"displayName": "MK, Sudeep"
						},
						"role": null
					},
					"estimate": {
						"quantity": 250,
						"amount": 75000.00,
						"unitCost": 300.00
					},
					"response": {
						"reason": null,
						"on": "2023-09-12T10:23:28.96Z",
						"by": {
							"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
							"image": {
								"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
								"cloudStorageKey": null
							},
							"email": "swathi@smartapp.com",
							"globalId": "239c63a4-9de7-4a0d-94f4-eeba41799007",
							"lastName": "Kolli",
							"firstName": "Swathi",
							"displayName": "Kolli, Swathi"
						},
						"status": "QuoteSent"
					},
					"vendorContract": {
						"title": "Internet&Enviromental Services",
						"id": "7bf6fcec-1a18-4e14-ba9a-4b59b220ca5e",
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
									"name": "Kolli, Swathi",
									"email": "swathi@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "4dec6c09-da4b-4cd4-9f45-cb054418b362",
							"name": "IQ Vendor",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/kcx3i14q/cross.png",
								"cloudStorageKey": null
							}
						}
					},
					"contractAmount": 30000.00,
					"name": "00375",
					"id": "5f8ca44d-96dd-423c-bd7f-6e592dd1cc8c",
					"quantity": null,
					"costType": "E - Equipment",
					"costCode": "Internet Services 201300",
					"division": "20 - ABC Miscellaneous",
					"unitCost": 200.00,
					"description": "<p>Request Quote</p>",
					"unitOfMeasure": "ls",
					"estimatedEndDate": null,
					"estimatedStartDate": null
				},
				{
					"submitBy": null,
					"quote": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					"estimate": {
						"quantity": 230,
						"amount": 46000.00,
						"unitCost": 200.00
					},
					"response": null,
					"vendorContract": {
						"title": "Internet&Enviromental Services",
						"id": "7bf6fcec-1a18-4e14-ba9a-4b59b220ca5e",
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
									"name": "Kolli, Swathi",
									"email": "swathi@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "4dec6c09-da4b-4cd4-9f45-cb054418b362",
							"name": "IQ Vendor",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/kcx3i14q/cross.png",
								"cloudStorageKey": null
							}
						}
					},
					"contractAmount": 25000.00,
					"name": "00376",
					"id": "fd6bf0a1-dee9-4338-b803-72e099c0b720",
					"quantity": null,
					"costType": "L - Labor",
					"costCode": "Environmental Services 201600",
					"division": "20 - ABC Miscellaneous",
					"unitCost": 100.00,
					"description": "<p>GC will give estimate</p>",
					"unitOfMeasure": "Hours",
					"estimatedEndDate": null,
					"estimatedStartDate": null
				}
			],
			"name": "Internet & Environment Services CE",
			"id": "39739f4f-2cf8-46ad-9bb9-40c64c27edd8",
			"description": "<p>Enviromnet And Internet things</p>",
			"code": "CE0049"
		},
		{
			"rowId": 1,
			"name": "Change Event 1",
			"id": "b9d87b70-978d-45f6-9183-7bc51cf87a0d",
			"description": "",
			"code": "CE0001",
			"status": "AwaitingTradeQuote",
			"estimatedAmount": null,
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "Electricals From Client",
				"id": "2e4f4ee5-059f-4709-8d2d-368d439ddc51",
				"poNumber": null,
				"code": "C0042",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": {
				"signature": "data:image/png;base64,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",
				"on": "2023-08-18T09:33:40.113Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"budgetItems": [
				{
					"description": "<p>description</p>",
					"quoteAmount": null,
					"submitBy": "2023-08-17T18:30:00.000Z",
					"contractAmount": 25000.00,
					"quote": {
						"amount": "1000",
						"quantity": "",
						"unitCost": ""
					},
					"estimateSource": "QuoteFromVendor",
					"status": "AwaitingQuote",
					"submitted": null,
					vendorContract: {
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					},
					"id": "97e8f5c3-09de-4a8d-8b79-3d28fa773403",
					"name": "00105",
					"costType": "L - Labor",
					"costCode": "High Voltage Distribution, Switching and Protection 16320",
					"division": "16 - Electrical",
					"unitCost": 250.00,
					"unitOfMeasure": "Hours"
				},
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 180000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: {
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						},
					}, "id": "2b8b8c46-6f56-4b23-96e7-45e15a7ffe7b",
					"name": "00106",
					"costType": "E - Equipment",
					"costCode": "Lightning Protection Systems 16670",
					"division": "16 - Electrical",
					"unitCost": 600.00,
					"unitOfMeasure": "mm"
				}
			]
		},
		{
			"rowId": 2,
			"name": "Change Event 2",
			"id": "d2522163-0096-46eb-9dae-182d38470cab",
			"description": "",
			"code": "CE0002",
			"status": "Draft",
			"estimatedAmount": null,
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "Lifts Installations",
				"id": "e4276fbc-a63b-49f0-91d7-633cb7995ab2",
				"poNumber": null,
				"code": "C0041",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": {
				"signature": "data:image/png;base64,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",
				"on": "2023-08-18T09:33:40.113Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"budgetItems": [
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 120000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "61d22e46-da19-45ba-aa87-2fc0a3a11891",
					"name": "00102",
					"costType": "E - Equipment",
					"costCode": "Lifts 14400",
					"division": "14 - Conveying Systems",
					"unitCost": 400.00,
					"unitOfMeasure": "m2"
				},
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 50000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "d9fa121a-1861-4aa7-8c21-8ce4cfcef557",
					"name": "00101",
					"costType": "L - Labor",
					"costCode": "Elevators 14200",
					"division": "14 - Conveying Systems",
					"unitCost": 500.00,
					"unitOfMeasure": "Days"
				}
			]
		},
		{
			"rowId": 3,
			"name": "Change Event 3",
			"id": "20587d9b-d175-473c-b3ea-ea80b4fff193",
			"description": "",
			"code": "CE0003",
			"status": "Draft",
			"estimatedAmount": 102000.00,
			// "fundingSource": "ChangeOrder",
			"fundingSource": "GeneralContractor",
			"clientContract": {
				"title": "New Contract TO Check Auto Pay app",
				"id": "56bfe267-7c83-422b-9c7b-30df989e6a0f",
				"poNumber": null,
				"code": "C0032",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": {
				"signature": "data:image/png;base64,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",
				"date": "2023-08-18T09:33:40.113Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "2de492c1-cf1f-49a5-8c1f-bfad6b16234c",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"budgetItems": [
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 1250000.00,
					"estimatedAmount": 2000.00,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: {},
					"id": "43cdd20e-4c79-4a82-b7d3-941f267723b2",
					"name": "00052",
					"costType": "E - Equipment",
					"costCode": "Expansion Control 5800",
					"division": "05 - Metals",
					"unitCost": 2500.00,
					"unitOfMeasure": "ls"
				},
				{
					"description": "<p>dfgh</p>",
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 20000000.00,
					"estimatedAmount": 100000.00,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "74b267a9-7344-4833-8a06-c71f9128194c",
					"name": "00059",
					"costType": "M - Materials",
					"costCode": "Gratings and Floor Plates 5535",
					"division": "05 - Metals",
					"unitCost": null,
					"unitOfMeasure": ""
				}
			]
		},
		{
			"rowId": 4,
			"name": "My Change Event",
			"id": "b65450e4-5ee9-4f0d-a795-3c8881a0683e",
			"description": "",
			"code": "CE0004",
			"status": "Draft",
			"estimatedAmount": 10.00,
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "ARC 13-07-23 CC",
				"id": "e551ba78-a05f-4415-bf97-233899285b3f",
				"poNumber": null,
				"code": "C0038",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": null,
			"budgetItems": [
				{
					"description": "<p>dfghj</p>",
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 250.00,
					"estimatedAmount": 10.00,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "31e88624-569e-4287-b07f-d29cf51b5a2d",
					"name": "00081",
					"costType": "L - Labor",
					"costCode": "Site Preparation 2100",
					"division": "02 - Existing Conditions",
					"unitCost": null,
					"unitOfMeasure": ""
				}
			]
		},
		{
			"rowId": 5,
			"name": "Paiting Wing",
			"id": "3c3c9db3-1f97-407b-a28f-1e4c8cc65137",
			"description": "",
			"code": "CE0005",
			"status": "Draft",
			"estimatedAmount": 1000.00,
			"fundingSource": "Contingency",
			"clientContract": {
				"title": "r4r4r4",
				"id": "3655afa5-a66e-4614-b64a-26ef47da55d7",
				"poNumber": null,
				"code": "C0024",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": null,
			"budgetItems": [
				{
					"description": "<p>sdfghjnmk,mnbv</p><p>dfghjk</p><p>dfghj</p><p>ertyu</p>",
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 50000.00,
					"estimatedAmount": 1000.00,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "92f04f5c-a86a-461e-9bb1-83d2d08c27fe",
					"name": "00017",
					"costType": "L - Labor",
					"costCode": "Cement 2065",
					"division": "02 - Existing Conditions",
					"unitCost": 5.00,
					"unitOfMeasure": "cc"
				},
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 11000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "017d61f6-7854-4df7-a558-90eb43c63366",
					"name": "00040",
					"costType": "M - Materials",
					"costCode": "General Contractor- Industrial Maintenance 1007",
					"division": "01 - General Requirement",
					"unitCost": 500.00,
					"unitOfMeasure": "ea"
				},
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 2500000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "5159e03e-726d-4455-b312-fcbc29eae8e0",
					"name": "00016",
					"costType": "M - Materials",
					"costCode": "Cement 2065",
					"division": "02 - Existing Conditions",
					"unitCost": 50.00,
					"unitOfMeasure": "cc"
				}
			]
		},
		{
			"rowId": 6,
			"name": "XVR",
			"id": "12f0a249-d147-49c6-87c5-672382186088",
			"description": "",
			"code": "CE0006",
			"status": "Draft",
			"estimatedAmount": null,
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "Xvr",
				"id": "19cebb16-8441-4032-8fc2-24a51b1e1457",
				"poNumber": null,
				"code": "C0045",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": null,
			"budgetItems": [
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 72000.00,
					"estimate": {amount: 100},
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "258cbd61-3a97-47c6-8742-d6faa8420d9a",
					"name": "00074",
					"costType": "OC - Owner Cost",
					"costCode": "Concrete Contractor 3010",
					"division": "03 - Concrete",
					"unitCost": 720.00,
					"unitOfMeasure": ""
				}, {
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 70000.00,
					"estimate": {
						"amount": 70000.00
					},
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "258cbd61-3a97-47c6-8742-d6faa8420d8a",
					"name": "00074",
					"costType": "OC - Owner Cost",
					"costCode": "Concrete Contractor 3010",
					"division": "03 - Concrete",
					"unitCost": 720.00,
					"unitOfMeasure": ""
				}
			]
		},
		{
			"rowId": 7,
			"name": "mks test",
			"id": "a0db632d-963e-4111-bd45-fb8267bdf68d",
			"description": "mks test desc",
			"code": "CE0007",
			"status": "Draft",
			"estimatedAmount": 2500.00,
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "New Contract TO Check Auto Pay app",
				"id": "56bfe267-7c83-422b-9c7b-30df989e6a0f",
				"poNumber": null,
				"code": "C0032",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": null,
			"budgetItems": [
				{
					"description": "<p>item 1 desc</p>",
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 500000.00,
					"estimatedAmount": 500.00,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "b46a1b9b-ddd0-4894-a45b-8f764523c430",
					"name": "00051",
					"costType": "E - Equipment",
					"costCode": "Millwright 5105",
					"division": "05 - Metals",
					"unitCost": 500.00,
					"unitOfMeasure": "ea"
				},
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 1250000.00,
					"estimatedAmount": 2000.00,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "43cdd20e-4c79-4a82-b7d3-941f267723b2",
					"name": "00052",
					"costType": "E - Equipment",
					"costCode": "Expansion Control 5800",
					"division": "05 - Metals",
					"unitCost": 2500.00,
					"unitOfMeasure": "ls"
				}
			]
		},
		{
			"rowId": 8,
			"name": "Pinting Wing 1",
			"id": "37903396-6d2a-4732-abb9-8cb26141b6d9",
			"description": "",
			"code": "CE0008",
			"status": "Draft",
			"estimatedAmount": null,
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "r4r4r4",
				"id": "3655afa5-a66e-4614-b64a-26ef47da55d7",
				"poNumber": null,
				"code": "C0024",
				"client": {
					"pointOfContacts": null,
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"submitted": null,
			"budgetItems": [
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 25000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "aef94279-7f96-4879-b79d-ceabacb3ef6d",
					"name": "00019",
					"costType": "SVC - Professional Services",
					"costCode": "Demolition 2050",
					"division": "02 - Existing Conditions",
					"unitCost": 50.00,
					"unitOfMeasure": "m2"
				},
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 5000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "ac7555b0-b983-40fa-9d17-d362d9911ab5",
					"name": "00020",
					"costType": "E - Equipment",
					"costCode": "Earthwork Supplies 2105",
					"division": "02 - Existing Conditions",
					"unitCost": 1000.00,
					"unitOfMeasure": "ea"
				},
				{
					"description": null,
					"quoteAmount": null,
					"submitBy": null,
					"contractAmount": 5000.00,
					"estimatedAmount": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"id": "ee2f2ddc-aace-4b9b-8160-e2a7c61609f7",
					"name": "00041",
					"costType": "E - Equipment",
					"costCode": "General Contractor- Institutional 1009",
					"division": "01 - General Requirement",
					"unitCost": 50.00,
					"unitOfMeasure": "ea"
				}
			]
		},
		{
			"rowId": 9,
			"name": "My Change Event",
			"id": "a7ab245d-58ba-4dc8-ba3c-8dd891d48544",
			"createdOn": "2023-08-06T13:54:00.423Z",
			"description": "Description of the event",
			"code": "CE0014",
			"modifiedOn": "2023-08-23T14:20:33.593Z",
			"createdBy": {
				"id": "38cb6d34-f0b0-4b24-b159-3a89bfe181cc",
				"email": "pkumar@smartapp.com",
				"globalId": "754d17cd-59c3-414e-9425-380bede7882a",
				"lastName": "Kumar",
				"firstName": "Prasanna",
				"displayName": "Kumar, Prasanna"
			},
			"modifiedBy": {
				"id": "38cb6d34-f0b0-4b24-b159-3a89bfe181cc",
				"email": "pkumar@smartapp.com",
				"globalId": "754d17cd-59c3-414e-9425-380bede7882a",
				"lastName": "Kumar",
				"firstName": "Prasanna",
				"displayName": "Kumar, Prasanna"
			},
			"status": "Draft",
			"estimatedAmount": 1000.000000000000,
			"files": [
				{
					"id": "7081a2a8-5b9c-40bb-8681-b493213a12d1",
					"stream": {
						"size": 128150,
						"hash": "ea503be8477b9aec92a59dd21ec5d1dc",
						"id": "1e0e1d08-a7aa-48ad-ae96-366ddc51fe19",
						"sketch": {
							"streamPages": [
								{
									"pageNumber": 1,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2F2256b195ac9240eab12404afe1de51a9?generation=1686733772217013&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/2256b195ac9240eab12404afe1de51a9"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2F2256b195ac9240eab12404afe1de51a9?generation=1686733773232480&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/2256b195ac9240eab12404afe1de51a9"
									}
								},
								{
									"pageNumber": 10,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2F999fccde171246688ecb736b992883a1?generation=1686733774242973&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/999fccde171246688ecb736b992883a1"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2F999fccde171246688ecb736b992883a1?generation=1686733775335200&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/999fccde171246688ecb736b992883a1"
									}
								},
								{
									"pageNumber": 2,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2Fb77cbb4eee444378ae934d527e73658f?generation=1686733776409932&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/b77cbb4eee444378ae934d527e73658f"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2Fb77cbb4eee444378ae934d527e73658f?generation=1686733777393743&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/b77cbb4eee444378ae934d527e73658f"
									}
								},
								{
									"pageNumber": 3,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2Fe21d9b94c5c64f9187edeb375f5d3114?generation=1686733778206976&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/e21d9b94c5c64f9187edeb375f5d3114"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2Fe21d9b94c5c64f9187edeb375f5d3114?generation=1686733779206826&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/e21d9b94c5c64f9187edeb375f5d3114"
									}
								},
								{
									"pageNumber": 4,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2Faf2cda746f1a4950bdfb6bea5fc5e38d?generation=1686733780303083&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/af2cda746f1a4950bdfb6bea5fc5e38d"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2Faf2cda746f1a4950bdfb6bea5fc5e38d?generation=1686733781350483&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/af2cda746f1a4950bdfb6bea5fc5e38d"
									}
								},
								{
									"pageNumber": 5,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2F1672bbf87fcd4d43a3e4c25a445cc781?generation=1686733781893499&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/1672bbf87fcd4d43a3e4c25a445cc781"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2F1672bbf87fcd4d43a3e4c25a445cc781?generation=1686733782450512&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/1672bbf87fcd4d43a3e4c25a445cc781"
									}
								},
								{
									"pageNumber": 6,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2Faaa056ae9bfc415293812b6ecd1d5814?generation=1686733783085989&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/aaa056ae9bfc415293812b6ecd1d5814"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2Faaa056ae9bfc415293812b6ecd1d5814?generation=1686733783600051&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/aaa056ae9bfc415293812b6ecd1d5814"
									}
								},
								{
									"pageNumber": 7,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2Fc7ec4b4925e247e59299790d214d72cc?generation=1686733784148858&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/c7ec4b4925e247e59299790d214d72cc"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2Fc7ec4b4925e247e59299790d214d72cc?generation=1686733784728314&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/c7ec4b4925e247e59299790d214d72cc"
									}
								},
								{
									"pageNumber": 8,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2Fc22a1b1d79c3401bbbe5c3f89edfa6fc?generation=1686733785273807&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/c22a1b1d79c3401bbbe5c3f89edfa6fc"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2Fc22a1b1d79c3401bbbe5c3f89edfa6fc?generation=1686733785817586&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/c22a1b1d79c3401bbbe5c3f89edfa6fc"
									}
								},
								{
									"pageNumber": 9,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2F163eb7d422d541a597bb482c8c820720?generation=1686733786928721&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/163eb7d422d541a597bb482c8c820720"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2F163eb7d422d541a597bb482c8c820720?generation=1686733787902792&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/163eb7d422d541a597bb482c8c820720"
									}
								},
								{
									"pageNumber": 11,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2F85dcf705f9d4453aa21e8130d9f79f4e?generation=1687352764167966&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/85dcf705f9d4453aa21e8130d9f79f4e"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2F85dcf705f9d4453aa21e8130d9f79f4e?generation=1687352765160116&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/85dcf705f9d4453aa21e8130d9f79f4e"
									}
								},
								{
									"pageNumber": 12,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2F6561ca8c1a364bd1b12cb9a1e507ca98?generation=1687352766115276&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/6561ca8c1a364bd1b12cb9a1e507ca98"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2F6561ca8c1a364bd1b12cb9a1e507ca98?generation=1687352767060668&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/6561ca8c1a364bd1b12cb9a1e507ca98"
									}
								},
								{
									"pageNumber": 13,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2Fa7ae8c4cba9d442ea68c0b33cb0b650a?generation=1687352768064441&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/a7ae8c4cba9d442ea68c0b33cb0b650a"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2Fa7ae8c4cba9d442ea68c0b33cb0b650a?generation=1687352769004024&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/a7ae8c4cba9d442ea68c0b33cb0b650a"
									}
								},
								{
									"pageNumber": 14,
									"rawImage": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fraw%2F9b170aa7ca1e44aeb3827f716f52bfcb?generation=1687352769968454&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/raw/9b170aa7ca1e44aeb3827f716f52bfcb"
									},
									"thumbnail": {
										"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2Fsheetmanager%2Fstream%2F2023_6%2F1e0e1d08a7aa48adae96366ddc51fe19%2Fthumbnails%2F9b170aa7ca1e44aeb3827f716f52bfcb?generation=1687352770991856&alt=media",
										"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/sheetmanager/stream/2023_6/1e0e1d08a7aa48adae96366ddc51fe19/thumbnails/9b170aa7ca1e44aeb3827f716f52bfcb"
									}
								}
							],
							"contentPages": [
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "8c9c3fd0-157b-4cd5-b56b-3554bddea63f",
									"actualPageNumber": 1,
									"contentPageNumber": 1,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "0cafaaa6-77c2-4a1a-bb3a-0f00b1a7b4c4",
									"actualPageNumber": 2,
									"contentPageNumber": 2,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "cfba9118-3c26-40f0-833c-dbf0fa032e4f",
									"actualPageNumber": 3,
									"contentPageNumber": 3,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "c97b48fe-7132-4dc2-8ff0-406aa7100840",
									"actualPageNumber": 4,
									"contentPageNumber": 4,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "7f8ca41a-8a3c-41f8-b35d-4e27be087f79",
									"actualPageNumber": 5,
									"contentPageNumber": 5,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "ac091079-7666-42b8-83b0-de0348955cb3",
									"actualPageNumber": 6,
									"contentPageNumber": 6,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "98741503-b553-49d0-abf1-55597fb75dd0",
									"actualPageNumber": 7,
									"contentPageNumber": 7,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "477ee3f8-25ea-47fe-9376-86873a0f12e0",
									"actualPageNumber": 8,
									"contentPageNumber": 8,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "53d28cc6-6fcb-40d6-b1ad-0d19ca4ec747",
									"actualPageNumber": 9,
									"contentPageNumber": 9,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "eee34262-f8eb-40da-a03c-8dc530ca69ae",
									"actualPageNumber": 10,
									"contentPageNumber": 10,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "d411d47b-35b8-41d0-b59e-8da26b03c374",
									"actualPageNumber": 11,
									"contentPageNumber": 11,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "ec44a1b3-b5ea-482b-995e-065ce70f46ff",
									"actualPageNumber": 12,
									"contentPageNumber": 12,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "ca912775-35bb-454c-9f22-a00e5f257a83",
									"actualPageNumber": 13,
									"contentPageNumber": 13,
									"thumbnail": null,
									"rawThumbnail": null
								},
								{
									"isDeleted": false,
									"markupHash": null,
									"id": "0b7c212c-b62d-41a6-bdd7-840cc8350d65",
									"actualPageNumber": 14,
									"contentPageNumber": 14,
									"thumbnail": null,
									"rawThumbnail": null
								}
							],
							"revisions": []
						},
						"thumbnails": [
							{
								"size": 1,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2F2023_6%2Fea503be8477b9aec92a59dd21ec5d1dc%2FRaw.png?generation=1686733791342005&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/2023_6/ea503be8477b9aec92a59dd21ec5d1dc/Raw.png"
							},
							{
								"size": 2,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2F2023_6%2Fea503be8477b9aec92a59dd21ec5d1dc%2FIcon.png?generation=1686733792404753&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/2023_6/ea503be8477b9aec92a59dd21ec5d1dc/Icon.png"
							},
							{
								"size": 3,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2F2023_6%2Fea503be8477b9aec92a59dd21ec5d1dc%2FSmall.png?generation=1686733793811390&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/2023_6/ea503be8477b9aec92a59dd21ec5d1dc/Small.png"
							},
							{
								"size": 4,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2F2023_6%2Fea503be8477b9aec92a59dd21ec5d1dc%2FMedium.png?generation=1686733795039140&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/2023_6/ea503be8477b9aec92a59dd21ec5d1dc/Medium.png"
							},
							{
								"size": 5,
								"width": null,
								"height": null,
								"markupHash": null,
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/dc2bcda5934c45a9a8492e8cf9281308%2F2023_6%2Fea503be8477b9aec92a59dd21ec5d1dc%2FLarge.png?generation=1686733796433145&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/2023_6/ea503be8477b9aec92a59dd21ec5d1dc/Large.png"
							}
						],
						"downloadUrl": "https://dc2bcda5934c45a9a8492e8cf9281308.smartappbeta.com/EnterpriseDesktop/api/v2/download/1e0e1d08-a7aa-48ad-ae96-366ddc51fe19",
						"cloudStorageKey": "gs://smartapp-appzones/dc2bcda5934c45a9a8492e8cf9281308/2023_6/ea503be8477b9aec92a59dd21ec5d1dc/Content"
					}
				}
			],
			"submitted": {
				"signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY0ODA0NjVGQUI4ODExRTI5ODIxRUMyNjFCOTMzREUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY0ODA0NjYwQUI4ODExRTI5ODIxRUMyNjFCOTMzREUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjQ4MDQ2NURBQjg4MTFFMjk4MjFFQzI2MUI5MzNERTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjQ4MDQ2NUVBQjg4MTFFMjk4MjFFQzI2MUI5MzNERTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7DYjn3AAACC0lEQVR42uxVzytEURT+Ht6U8qukTJPYIYqZpIQaMTs2jMlmNpP8AWR2lIWljZEFzYYaO2NhY2WHNKuhMAtSmudHaZ7BgrjO+4H3xuUNYiGnvnnv3ffO+c655zt3chhj+Enk4IftbxLYCFOEEwLLEie6jy0zWB6HYIIwbFxIJBIIh8M4PDqCIAjo6e6G3+83fuLQfR4IQVM0TuclZrBYLMZyRZHlZSAYDDKOSdmoKN/4MDc/D4Gubrcbuzs7CAQC6npkaQlWvooJCkuGpQjFzw+SJCGZTEKWZVyl04hEIohGo+q7+7u7TF+ZUGLVA5OlKejg0JCa/ZeM04OUcVP7fT51zxtdLkaVsNDMzEsfOJb69CQ/b4fX64Xdbkc8HjdV9+0KGp3Ol4y7PB6TopRqrCrgE9wkTTJ1VFSoAZWrEtRL29ZJZOlLiT3uLzC2PayBQ8BX0WpdMdqWSQ/VH5e/3gcUVNH8knD2xoEB9kZF/B64poG1GmB7BLiW3idoDgFlrUClj0hKuZ+8PwfH1NytXm2lpB0o9wBikXby0HGBs3XCCtCyrK1fbAANY28q4BEoKZerdxcxYHcSOF/RAusnmzLZKKgFnFSpo4smTleTWHhKv3arQVskjKp3ZU1AB1WSOiCyTQokU0ZKjvUUuPPVQyw0+lrK1EaYJdyy7O1W97Flo6L/v8zfJXgSYACwJzqnGnFMlAAAAABJRU5ErkJggg==",
				"on": "2023-08-23T13:18:56.96Z",
				"by": {
					"id": "38cb6d34-f0b0-4b24-b159-3a89bfe181cc",
					"email": "pkumar@smartapp.com",
					"globalId": "754d17cd-59c3-414e-9425-380bede7882a",
					"lastName": "Kumar",
					"firstName": "Prasanna",
					"displayName": "Kumar, Prasanna"
				},
				"role": "GeneralContractor"
			},
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"title": "Test Client Contract",
				"id": "53365592-c613-4470-9256-07053398a59f",
				"poNumber": null,
				"code": "C0025",
				"client": {
					"pointOfContacts": null,
					"id": "c475ef50-00d5-4888-bb46-251cb2ef5f86",
					"name": "Client",
					"email": "",
					"phone": "",
					"image": {
						"downloadUrl": "https://dc2bcda5934c45a9a8492e8cf9281308.smartappbeta.com/admin/static/img/nopreview.jpg",
						"cloudStorageKey": null
					}
				}
			},
			"responses": null,
			"budgetItems": [
				{
					"submitBy": null,
					"contractAmount": 11.00,
					"quote": null,
					"estimate": {
						"quantity": 0,
						"amount": 1000.00,
						"unitCost": 0.00
					},
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					vendorContract: null,
					"response": null,
					"id": "76b7ec1d-c574-4c70-9b15-34a7581c9c93",
					"name": "00002",
					"costType": "E - Equipment",
					"costCode": "General Contractor- Airports 1002",
					"division": "01 - General Requirement",
					"unitCost": 11.00,
					"description": "Description",
					"unitOfMeasure": "ls"
				}
			]
		},
		{
			"createdOn": "2023-09-18T10:57:03.847Z",
			"modifiedOn": "2023-09-21T13:34:32.163Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"status": "AwaitingAcceptance",
			"estimatedAmount": 229500.00,
			"submitted": {
				"signature": "data:image/png;base64,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",
				"on": "2023-09-21T13:34:32.163Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"client": {
					"pointOfContacts": [
						{
							"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
							"name": "Client, Sudeep",
							"email": "mksudeep+client@smartapp.com",
							"phone": "",
							"image": {
								"downloadUrl": "https://central.smartappbeta.com/skins/base/img/s_200dp.png",
								"cloudStorageKey": null
							}
						}
					],
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "test@IQclient.com",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/mka35l3k/check.png",
						"cloudStorageKey": null
					}
				},
				"title": "Walls&Corner Guards",
				"id": "85f8a013-d1da-414d-8d93-ac58c620be07",
				"poNumber": null,
				"code": "C0122"
			},
			"contractOption": "CreateNew",
			"responses": [
				{
					"reason": "something (such as a story or movie) considered as an object to be examined, explicated, or deconstructed ; b · something likened to a text.",
					"signature": "data:image/png;base64,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",
					"on": "2023-09-18T11:12:51.413Z",
					"by": {
						"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
						"image": {
							"downloadUrl": "https://central.smartappbeta.com/skins/base/img/s_200dp.png",
							"cloudStorageKey": null
						},
						"email": "mksudeep+client@smartapp.com",
						"globalId": "a5822fde-1074-47c8-920b-1ea3f5c0d074",
						"lastName": "Client",
						"firstName": "Sudeep",
						"displayName": "Client, Sudeep"
					},
					"type": "SentBackForRevision"
				}
			],
			"budgetItems": [
				{
					"submitBy": null,
					"quote": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					"estimate": {
						"quantity": 450,
						"amount": 229500.00,
						"unitCost": 510.00
					},
					"response": null,
					"vendorContract": {
						"title": "Wall & Corner Guards",
						"id": "c22bdfc1-7c17-4258-a9bd-32e9a0e16ad3",
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "9715c84f-adff-4bd4-80b5-e5c2d1a62a23",
									"name": "Kolli, Swathi",
									"email": "swathi@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "4dec6c09-da4b-4cd4-9f45-cb054418b362",
							"name": "IQ Vendor",
							"email": "",
							"phone": "",
							"image": {
								"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/kcx3i14q/cross.png",
								"cloudStorageKey": null
							}
						}
					},
					"contractAmount": 30000.00,
					"name": "00046",
					"id": "18904815-da8e-4e99-9645-4d1086dd8b98",
					"quantity": null,
					"costType": "E - Equipment",
					"costCode": "Access Flooring 10270",
					"division": "10 - Specialties",
					"unitCost": 30.00,
					"description": null,
					"unitOfMeasure": "ea",
					"estimatedEndDate": null,
					"estimatedStartDate": null
				}
			],
			"name": "Walls & Corner Guards CE",
			"id": "c3fc78f1-96b1-461a-8906-c77479e75798",
			"description": "",
			"code": "CE0058"
		},
		{
			"createdOn": "2023-10-06T12:05:40.47Z",
			"modifiedOn": "2023-10-12T06:58:53.897Z",
			"createdBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"modifiedBy": {
				"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
				"email": "mksudeep@smartapp.com",
				"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
				"lastName": "MK",
				"firstName": "Sudeep",
				"displayName": "MK, Sudeep"
			},
			"status": "AwaitingAcceptance",
			"estimatedAmount": 3400.00,
			"submitted": {
				"signature": "data:image/png;base64,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",
				"on": "2023-10-12T06:58:53.897Z",
				"by": {
					"id": "fb9fe865-986e-4991-91e5-656aa7b7fe14",
					"email": "mksudeep@smartapp.com",
					"globalId": "4cac5fc1-62d5-4676-9f1f-be5323b7a29b",
					"lastName": "MK",
					"firstName": "Sudeep",
					"displayName": "MK, Sudeep"
				},
				"role": "GeneralContractor"
			},
			"fundingSource": "ChangeOrder",
			"clientContract": {
				"client": {
					"pointOfContacts": [
						{
							"id": "a33967e9-b07a-42dc-88f7-c24633d38a6f",
							"name": "Client, Sudeep",
							"email": "mksudeep+client@smartapp.com",
							"phone": "",
							"image": {
								"downloadUrl": "https://central.smartappbeta.com/skins/base/img/s_200dp.png",
								"cloudStorageKey": null
							}
						}
					],
					"id": "1d34e18a-0020-4c12-a9c1-9e0541a671a2",
					"name": "IQ Client",
					"email": "test@IQclient.com",
					"phone": "",
					"image": {
						"downloadUrl": "https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2308/mka35l3k/check.png",
						"cloudStorageKey": null
					}
				},
				"title": "00 R1",
				"id": "65971fcb-c7b4-4f5b-b639-a59da145bf4a",
				"poNumber": null,
				"code": "C0099"
			},
			"contractOption": "UpdateExisting",
			"responses": null,
			"budgetItems": [
				{
					"submitBy": null,
					"quote": null,
					"estimateSource": "EstimatedChangeAmount",
					"status": "Active",
					"submitted": null,
					"estimate": {
						"quantity": null,
						"amount": 3400.00,
						"unitCost": null
					},
					"response": null,
					"vendorContract": {
						"title": "Test 2 30-06-23 Mansory",
						"id": "244e5c97-4783-4285-97d3-c5fc91a3ee8b",
						"vendor": {
							"pendingCompliances": null,
							"pointOfContacts": [
								{
									"id": "dff9a365-4d6a-4dd3-9f93-74247684fd7d",
									"name": "j, jxavier",
									"email": "jxavier@smartapp.com",
									"phone": "",
									"image": {
										"downloadUrl": "https://central.smartappbeta.com/skins/base/img/j_200dp.png",
										"cloudStorageKey": null
									}
								}
							],
							"id": "82187766-1002-490b-860e-87496d4c01b4",
							"name": "1 Bid Company",
							"email": "test@1bidcompany.com",
							"phone": "",
							"image": {
								"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
								"cloudStorageKey": null
							}
						}
					},
					"contractAmount": 0.00,
					"name": "00056",
					"id": "5728a944-442c-4a69-aef0-7a4304ea5599",
					"quantity": null,
					"costType": null,
					"costCode": null,
					"division": null,
					"unitCost": null,
					"description": "<p>aaaa</p>",
					"unitOfMeasure": null,
					"estimatedEndDate": null,
					"estimatedStartDate": null
				}
			],
			"name": "Create on 6th Oct",
			"id": "9d1c15a6-bc00-4d6f-9db0-631dd1207727",
			"description": "CE for Test",
			"code": "CE0074"
		}
	]
};

export const budgetLineItemList = [
	{
		value: 1239,
		label: "01 - General Requirement",
		options: [
			{
				value: 1256,
				label:
					"General Contractor 1001 Test Test Test Test Test TEst Test Test Test Test TEstTestTestTestTest TEst Test Test",
				colVal: "$400",
			},
			{
				value: 1257,
				label: "General Contractor- Airports 1002",
				colVal: "$800",
			},
			{
				value: 1258,
				label: "General Contractor- Churches 1003",
				colVal: "$400",
			},
			{
				value: 1259,
				label: "General Contractor- Commercial 1004",
				colVal: "$300",
			},
			{
				value: 1298,
				label: "Construction Cleaning Services 1710",
				colVal: "$400",
			},
			{
				value: 1299,
				label: "Insurance and Bonding 1905",
				colVal: "$500",
			},
		],
	},
	{
		value: 1191,
		label: "02 - Existing Conditions",
		options: [
			{
				value: 1300,
				label: "Site Work Supplier 2010",
				colVal: "$400",
			},
			{
				value: 1301,
				label: "Aggregate Manufacture Supplier 2040",
				colVal: "$200",
			},
			{
				value: 1335,
				label: "Fences & Gates 2830",
				colVal: "$300",
			},
			{
				value: 1336,
				label: "Landscaping and Irrigation 2900",
				colVal: "$600",
			},
		],
	},
	{
		value: 1241,
		label: "03 - Concrete",
		options: [
			{
				value: 1337,
				label: "Concrete Contractor 3010",
				colVal: "$400",
			},
			{
				value: 1338,
				label: "Concrete Supplier 3050",
				colVal: "$900",
			},
			{
				value: 1354,
				label: "Concrete Restoration and Cleaning 3700",
				colVal: "$1000",
			},
		],
	},
	{
		value: 1193,
		label: "04 - Masonry",
		options: [
			{
				value: 1355,
				label: "Masonry 4200",
				colVal: "$400",
			},
			{
				value: 1361,
				label: "Masonry Restoration and Cleaning 4500",
				colVal: "$50",
			},
			{
				value: 1362,
				label: "Special Masonry Installations 4550",
				colVal: "$200",
			},
		],
	},
];
export const referencefile = {
	"data": [
		{
			"id": "7ae6d8a2-0369-472b-9522-ed0e2d591f39",
			"name": "CE.png",
			"stream": {
				"size": 250232,
				"hash": "d40a918f1723a6ea69bacaa9ef12f3ae",
				"id": "556a841c-df3e-418c-8a4f-9decc0e784f0",
				"sketch": {
					"streamPages": [
						{
							"pageNumber": 1,
							"rawImage": {
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fsheetmanager%2Fstream%2F2023_8%2F556a841cdf3e418c8a4f9decc0e784f0%2Fraw%2Ff177b6dbd7064a7a939b7a8f261a9362?generation=1693294219649111&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/sheetmanager/stream/2023_8/556a841cdf3e418c8a4f9decc0e784f0/raw/f177b6dbd7064a7a939b7a8f261a9362"
							},
							"thumbnail": {
								"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2Fsheetmanager%2Fstream%2F2023_8%2F556a841cdf3e418c8a4f9decc0e784f0%2Fthumbnails%2Ff177b6dbd7064a7a939b7a8f261a9362?generation=1693294220911115&alt=media",
								"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/sheetmanager/stream/2023_8/556a841cdf3e418c8a4f9decc0e784f0/thumbnails/f177b6dbd7064a7a939b7a8f261a9362"
							}
						}
					],
					"contentPages": [
						{
							"isDeleted": false,
							"markupHash": null,
							"id": "40afc5bb-0749-403c-a496-f39ffae5f837",
							"actualPageNumber": 1,
							"contentPageNumber": 1,
							"thumbnail": null,
							"rawThumbnail": null
						}
					],
					"revisions": []
				},
				"thumbnails": [
					{
						"size": 1,
						"width": null,
						"height": null,
						"markupHash": null,
						"downloadUrl": null,
						"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_8/d40a918f1723a6ea69bacaa9ef12f3ae/Content"
					},
					{
						"size": 2,
						"width": null,
						"height": null,
						"markupHash": null,
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_8%2Fd40a918f1723a6ea69bacaa9ef12f3ae%2FIcon.png?generation=1693294213577950&alt=media",
						"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_8/d40a918f1723a6ea69bacaa9ef12f3ae/Icon.png"
					},
					{
						"size": 3,
						"width": null,
						"height": null,
						"markupHash": null,
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_8%2Fd40a918f1723a6ea69bacaa9ef12f3ae%2FSmall.png?generation=1693294215046971&alt=media",
						"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_8/d40a918f1723a6ea69bacaa9ef12f3ae/Small.png"
					},
					{
						"size": 4,
						"width": null,
						"height": null,
						"markupHash": null,
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_8%2Fd40a918f1723a6ea69bacaa9ef12f3ae%2FMedium.png?generation=1693294216836802&alt=media",
						"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_8/d40a918f1723a6ea69bacaa9ef12f3ae/Medium.png"
					},
					{
						"size": 5,
						"width": null,
						"height": null,
						"markupHash": null,
						"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_8%2Fd40a918f1723a6ea69bacaa9ef12f3ae%2FLarge.png?generation=1693294218335121&alt=media",
						"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_8/d40a918f1723a6ea69bacaa9ef12f3ae/Large.png"
					}
				],
				"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/api/v2/download/556a841c-df3e-418c-8a4f-9decc0e784f0",
				"cloudStorageKey": "gs://smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/2023_8/d40a918f1723a6ea69bacaa9ef12f3ae/Content"
			}
		}
	]
};