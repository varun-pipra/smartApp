import React, { useEffect, useRef, useState } from "react";
import CostCodeSelect from 'sui-components/CostCodeSelect/costCodeSelect';


export const optionsdata = [
	{
		"id": 1018,
		"value": "India",
		"hierarchy": "1018",
		"children": [
			{
				"id": 1030,
				"value": "UP - Noida - Sector 1",
				"hierarchy": "1018;1021;1025;1030",
				"children": {
					"id": 1030,
					"value": "UP - Noida - Sector 1.1",
					"hierarchy": "1018;1021;1025;1030",
					"children": null
				},
			},
			{
				"id": 1031,
				"value": "UP - Noida - Sector 2",
				"hierarchy": "1018;1021;1025;1031",
				"children": null
			},
			{
				"id": 1032,
				"value": "UP - Noida - Lucknow - Gomati nagar",
				"hierarchy": "1018;1021;1026;1032",
				"children": null
			},
			{
				"id": 1033,
				"value": "UP - Noida - Lucknow - Lucknow A1",
				"hierarchy": "1018;1021;1026;1033",
				"children": null
			},
			{
				"id": 1027,
				"value": "UK - Nainital",
				"hierarchy": "1018;1022;1027",
				"children": null
			},
			{
				"id": 1028,
				"value": "UK - Nainital - Rurki",
				"hierarchy": "1018;1022;1028",
				"children": null
			}
		]
	},
	{
		"id": 1019,
		"value": "Nepal",
		"hierarchy": "1019",
		"children": [
			{
				"id": 1023,
				"value": "Kathmandu",
				"hierarchy": "1019;1023",
				"children": null
			}
		]
	},
	{
		"id": 1020,
		"value": "UK",
		"hierarchy": "1020",
		"children": [
			{
				"id": 1034,
				"value": "London - London_c1 - London-c1-a1",
				"hierarchy": "1020;1024;1029;1034",
				"children": null
			},
			{
				"id": 1035,
				"value": "London - London_c1 - London-c1-a2",
				"hierarchy": "1020;1024;1029;1035",
				"children": null
			}
		]
	}
]
export const menusData = [
	{
		"isLeaf": false,
		"children": [
			{
				"isLeaf": false,
				"children": [
					{
						"isLeaf": false,
						"children": [
							{
								"isLeaf": true,
								"children": [

								],
								"hierarchy": "1239;1256;1980;1984",
								"id": 1984,
								"listId": 38,
								"value": "Level 4 LV1",
								"keyValue": "Level 3 LV1",
								"keyValueItemId": 1980,
								"displayOrder": 1,
								"listValues": null,
								"isSystem": false
							},
							{
								"isLeaf": true,
								"children": [

								],
								"hierarchy": "1239;1256;1980;1985",
								"id": 1985,
								"listId": 38,
								"value": "Level 4 LV2",
								"keyValue": "Level 3 LV1",
								"keyValueItemId": 1980,
								"displayOrder": 2,
								"listValues": null,
								"isSystem": false
							}
						],
						"hierarchy": "1239;1256;1980",
						"id": 1980,
						"listId": 37,
						"value": "Parking Area",
						"keyValue": "General Contractor 1001",
						"keyValueItemId": 1256,
						"displayOrder": 1,
						"listValues": null,
						"isSystem": false
					},
					{
						"isLeaf": false,
						"children": [
							{
								"isLeaf": true,
								"children": [

								],
								"hierarchy": "1239;1256;1981;1986",
								"id": 1986,
								"listId": 38,
								"value": "Level 4 LV3",
								"keyValue": "Level 3 LV2",
								"keyValueItemId": 1981,
								"displayOrder": 3,
								"listValues": null,
								"isSystem": false
							},
							{
								"isLeaf": true,
								"children": [

								],
								"hierarchy": "1239;1256;1981;1987",
								"id": 1987,
								"listId": 38,
								"value": "Level 4 LV4",
								"keyValue": "Level 3 LV2",
								"keyValueItemId": 1981,
								"displayOrder": 4,
								"listValues": null,
								"isSystem": false
							}
						],
						"hierarchy": "1239;1256;1981",
						"id": 1981,
						"listId": 37,
						"value": "Drop Area",
						"keyValue": "General Contractor 1001",
						"keyValueItemId": 1256,
						"displayOrder": 2,
						"listValues": null,
						"isSystem": false
					}
				],
				"hierarchy": "1239;1256",
				"id": 1256,
				"listId": 28,
				"value": "General Contractor 1001",
				"keyValue": "01 - General Requirement",
				"keyValueItemId": 1239,
				"displayOrder": 1,
				"listValues": null,
				"isSystem": false
			},
			{
				"isLeaf": false,
				"children": [
					{
						"isLeaf": true,
						"children": [

						],
						"hierarchy": "1239;1257;1982",
						"id": 1982,
						"listId": 37,
						"value": "Lounge",
						"keyValue": "General Contractor- Airports 1002",
						"keyValueItemId": 1257,
						"displayOrder": 3,
						"listValues": null,
						"isSystem": false
					},
					{
						"isLeaf": true,
						"children": [

						],
						"hierarchy": "1239;1257;1983",
						"id": 1983,
						"listId": 37,
						"value": "Check-in",
						"keyValue": "General Contractor- Airports 1002",
						"keyValueItemId": 1257,
						"displayOrder": 4,
						"listValues": null,
						"isSystem": false
					},
					{
						"isLeaf": true,
						"children": [

						],
						"hierarchy": "1239;1257;2004",
						"id": 2004,
						"listId": 37,
						"value": " Service Desk",
						"keyValue": "General Contractor- Airports 1002",
						"keyValueItemId": 1257,
						"displayOrder": 5,
						"listValues": null,
						"isSystem": false
					}
				],
				"hierarchy": "1239;1257",
				"id": 1257,
				"listId": 28,
				"value": "General Contractor- Airports 1002",
				"keyValue": "01 - General Requirement",
				"keyValueItemId": 1239,
				"displayOrder": 2,
				"listValues": null,
				"isSystem": false
			}
		],
		"hierarchy": "1239",
		"id": 1239,
		"listId": 23,
		"value": "01 - General Requirement",
		"keyValue": null,
		"keyValueItemId": null,
		"displayOrder": 1,
		"listValues": null,
		"isSystem": false
	},
	{
		"isLeaf": true,
		"children": [

		],
		"hierarchy": "1240",
		"id": 1240,
		"listId": 23,
		"value": "02 - Existing Conditions",
		"keyValue": null,
		"keyValueItemId": null,
		"displayOrder": 2,
		"listValues": null,
		"isSystem": false
	},
	{
		"isLeaf": false,
		"children": [
			{
				"isLeaf": true,
				"children": [

				],
				"hierarchy": "1241;1337",
				"id": 1337,
				"listId": 28,
				"value": "Concrete Contractor 3010",
				"keyValue": "03 - Concrete",
				"keyValueItemId": 1241,
				"displayOrder": 82,
				"listValues": null,
				"isSystem": false
			},
			{
				"isLeaf": true,
				"children": [

				],
				"hierarchy": "1241;1338",
				"id": 1338,
				"listId": 28,
				"value": "Concrete Supplier 3050",
				"keyValue": "03 - Concrete",
				"keyValueItemId": 1241,
				"displayOrder": 83,
				"listValues": null,
				"isSystem": false
			}
		],
		"hierarchy": "1241",
		"id": 1241,
		"listId": 23,
		"value": "03 - Concrete",
		"keyValue": null,
		"keyValueItemId": null,
		"displayOrder": 3,
		"listValues": null,
		"isSystem": false
	}
]
export default function CostCodeSelectExamle() {

	return (
		<CostCodeSelect
			label="Division/Cost Code"
			options={optionsdata}
			// onChange={(value) => { console.log('value', value) }}
			required={true}
			startIcon={<div className='common-icon-Budgetcalculator' style={{ fontSize: '1.3rem' }}></div>}
			checkedColor={'#0590cd'}
			showFilter={false}
			selectedValue={''}
			Placeholder={'Select'}
			outSideOfGrid={true}
			showFilterInSearch={true}
			filteroptions={menusData}
		/>
	);
}
