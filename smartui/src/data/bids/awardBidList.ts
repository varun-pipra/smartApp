import Active from 'resources/images/Active.svg';
import AmericanPaintingCompany from 'resources/images/bidManager/AmericanPaintingCompany.png';
import FloridaCompany from 'resources/images/bidManager/FloridaCompany.png';
import RochesterPaintingDecoration from 'resources/images/bidManager/RochesterPaintingDecoration.png';

export const AwardBidList = [{
	id: 1,
	icon: RochesterPaintingDecoration,
	header: 'Rochester Painting & decoration',
	bidValue: 25000,
	attachments: 3,
	intendToBid: 'Yes',
	submissionStatus: 'Submitted',
	submittedOn: "2023-01-11T11:03:06.867",
	submittedBy: "Philip Parker",
	awarded: false,
	packageDetails: [{
		item: "0001-00010-Accountant-L-Labor",
		value: 9500
	},
	{
		item: "0001-00010-Concrete-M-Materials",
		value: 23000
	},
	{
		item: "0001-00010-Site Remediation-L-Labor",
		value: 175000
	},
	{
		item: "0001-00010-Accountant-L-Labor",
		value: 4500
	}
	]

},
{
	id: 2,
	icon: AmericanPaintingCompany,
	header: 'American Painting Company',
	bidValue: 19000,
	attachments: 5,
	awarded: false,
	intendToBid: 'Yes',
	submissionStatus: 'Submitted',
	submittedOn: "2023-01-11T11:03:06.867",
	submittedBy: "Philip Parker",

	packageDetails: [{
		item: "0001-00010-Accountant-L-Labor",
		value: 9500
	},
	{
		item: "0001-00010-Concrete-M-Materials",
		value: 23000
	},
	{
		item: "0001-00010-Site Remediation-L-Labor",
		value: 175000
	},
	{
		item: "0001-00010-Accountant-L-Labor",
		value: 5000
	}
	]
},
{
	id: 3,
	icon: FloridaCompany,
	header: 'Florida Company',
	bidValue: 20000,
	attachments: 3,
	awarded: false,
	intendToBid: 'Yes',
	submissionStatus: 'Submitted',
	submittedOn: "2023-01-11T11:03:06.867",
	submittedBy: "Philip Parker",
	packageDetails: []
},
{
	id: 4,
	icon: FloridaCompany,
	header: 'Smartapp Company',
	bidValue: 25000,
	attachments: 3,
	intendToBid: 'Yes',
	awarded: false,
	submissionStatus: 'Submitted',
	submittedOn: "2023-01-11T11:03:06.867",
	submittedBy: "Philip Parker",
	packageDetails: []
},
]
export const AwardBidDetails = {
	"id": "93f54114-bc5f-4c2d-a653-d3f0369834b7",
	"name": null,
	"packageStatus": 0,
	submissionStatus: 2,
	"bidderUID": "c4a811cc-5d2d-4f63-add1-9105051ac09e",
	"company": {
		"id": "43cbc95d-241f-458d-b299-e0b0c90754b9",
		"objectId": 531393,
		"isRestricted": false,
		"thumbnailUrl": "https://s3.amazonaws.com/smartapp-appzones/v20mta/iqadmin/dynamic/2007/4hwcccir/406766ee9aa546f29629344810be8945.png",
		"calendarId": null,
		"isImportedFromOrg": false,
		"name": "Purushotham K S",
		"phone": "",
		"website": "",
		"colorCode": null,
		"vendorId": null,
		"hasSubCompany": false,
		"companyType": 0,
		"isDiverseSupplier": false,
		"complianceStatus": null
	},
	"responseStatus": 5,
	"description": null,
	"processType": 0,
	"budgetItems": [
		// {
		// 	"id": "55041e2f-3f4f-4772-8d58-08f8d4f0fd8e",
		// 	"name": "00008",
		// 	"bidValue": 345912,
		// 	"division": "01 - General Requirement",
		// 	"costCode": "General Contractor- Airports 1002",
		// 	"costType": "E - Equipment",
		// 	"unitOfMeasure": "Is",
		// 	"unitQuantity": 500,
		// 	"unitCost": 12,
		// 	"budgetValue": 35780
		// },
		// {
		// 	"id": "047382ef-a99b-4808-9f48-752bab005e70",
		// 	"name": "00002",
		// 	"bidValue": 0,
		// 	"division": "Div1",
		// 	"costCode": "cc2",
		// 	"costType": "ct2",
		// 	"unitOfMeasure": "Is",
		// 	"unitQuantity": 500,
		// 	"unitCost": 12,
		// 	"budgetValue": 10000
		// }
	],
	"queryDeadLine": null,
	"intentToBid": false,
	"queryCount": 0,
	"bidAmount": 20900,
	"totalBudget": 20000,
	"bidCoverLetter": "<p>Bid Cover letter</p>",
	"bidInclusions": "<h1>Bid inclusion data</h1>",
	"bidExclusions": "Bid exclusion text",
	"respondedOn": "2023-03-04T08:04:09.97",
	"respondedBy": "1031, Kirtika",
	"endDate": null,
	"bidders": [],
	"referenceFiles": [
		{
			"id": "7adabee8-c655-4701-9bd3-1e4b89d4d1b7",
			"driveObjectId": null,
			"objectId": 1665520,
			"fileType": 1,
			"contentType": ".png",
			"name": "Division and LID Title issue.png",
			"thumbnail": "https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/EnterpriseDesktop/thumbnail/497fbab5adde86f36f80cb485de8e465/5",
			"createdDate": "2023-07-12T16:51:15Z",
			"downloadUrl": "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_5%2F497fbab5adde86f36f80cb485de8e465%2FLarge.png?generation=1685564873250026&alt=media"
		}
	],
}

export const AwardBidTooltipContent = [
	{
		id: 1,
		company: "Rochester Painting & Company",
		amount: "$1,200",
		logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
		isAwarded: false,
	},
	{
		id: 2,
		company: "Florida Compnay",
		amount: "$1,150",
		logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
	},
	{
		id: 3,
		company: "Asian Paints",
		amount: "$1,100",
		logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
	},
	{
		id: 1,
		company: "American Paintings & Company",
		amount: "1,200",
		logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
		isAwarded: true,
	},
	{
		id: 2,
		company: "EIPSano Interirors",
		amount: "1,100",
		logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
	},
	{
		id: 3,
		company: "Tata Birla",
		amount: "1,000",
		logo: "https://media.glassdoor.com/sql/3321963/pipra-squarelogo-1664262055537.png",
	},
]