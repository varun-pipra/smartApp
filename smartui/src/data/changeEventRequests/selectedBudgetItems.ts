export const selectedBudgetItems = [
	{
		"quoteAmount": null,
		"submitBy": "2023-08-23T18:30:00Z",
		"contractAmount": 25000.00,
		"quote": null,
		"estimate": null,
		"estimateSource": "QuoteFromVendor",
		"status": "AwaitingQuote",
		"submitted": {
			"signature": "data:image/png;base64,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",
			"on": "2023-08-21T11:37:25.943Z",
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
		"vendor": {
			"pendingCompliances": null,
			"pointOfContacts": null,
			"id": "4dec6c09-da4b-4cd4-9f45-cb054418b362",
			"name": "IQ Vendor",
			"email": "",
			"phone": "",
			"image": {
				"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
				"cloudStorageKey": null
			}
		},
		"response": {
			"reason": null,
			"on": null,
			"by": null,
			"status": "AwaitingQuote"
		},
		"id": "97e8f5c3-09de-4a8d-8b79-3d28fa773403",
		"name": "00105",
		"costType": "L - Labor",
		"costCode": "High Voltage Distribution, Switching and Protection 16320 - WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
		"division": "16 - Electrical",
		"unitCost": 250.00,
		"description": "<p>description</p>",
		"unitOfMeasure": "Hours"
	},
	{
		"quoteAmount": null,
		"submitBy": null,
		"contractAmount": 180000.00,
		"quote": null,
		"estimate": null,
		"estimateSource": "EstimatedChangeAmount",
		"status": "Active",
		"submitted": null,
		"vendor": {
			"pendingCompliances": null,
			"pointOfContacts": null,
			"id": "4dec6c09-da4b-4cd4-9f45-cb054418b362",
			"name": "IQ Vendor",
			"email": "",
			"phone": "",
			"image": {
				"downloadUrl": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/admin/static/img/nopreview.jpg",
				"cloudStorageKey": null
			}
		},
		"response": null,
		"id": "2b8b8c46-6f56-4b23-96e7-45e15a7ffe7b",
		"name": "00106",
		"costType": "E - Equipment",
		"costCode": "Lightning Protection Systems 16670",
		"division": "16 - Electrical",
		"unitCost": 600.00,
		"description": null,
		"unitOfMeasure": "mm"
	}
];

export const vendorDetails = {
	"id": "75eac187-d54a-4ae0-a28a-4299333ea154",
	"vendorContract": {
		"id": "6b0d0db4-c53a-4313-8256-40be154ec62d",
		"title": "Demo Contract: 01",
		"vendor": {
			"pendingCompliances": null,
			"pointOfContacts": [
				{
					"id": "5b02aa0b-4da7-4ade-85fa-0660a8955f91",
					"name": "Test, Superintendent",
					"email": "smartapptu+superintendent@gmail.com",
					"phone": "",
					"image": {
						"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
						"cloudStorageKey": null
					}
				},
				{
					"id": "5b02aa0b-4da7-4ade-85fa-0660a8955f91",
					"name": "Test, Superintendent",
					"email": "smartapptu+superintendent@gmail.com",
					"phone": "",
					"image": {
						"downloadUrl": "https://central.smartappbeta.com/skins/base/img/S_200dp.png",
						"cloudStorageKey": null
					}
				}
			],
			"id": "0c74903f-9b9b-42ad-b6bc-75aea29c9bf7",
			"name": "Smartapp.Com, Inc.",
			"email": "",
			"phone": "000-000-000",
			"image": {
				"downloadUrl": "https://dc2bcda5934c45a9a8492e8cf9281308.smartappbeta.com/admin/static/img/nopreview.jpg",
				"cloudStorageKey": null
			}
		}
	}
};