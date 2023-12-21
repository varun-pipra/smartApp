export const PhasesData = [
  {
    id: 1,
    name: "Pre Construction",
    color: "#F44336",
    uniqueId: "e2ae03bd-f828-4da2-9d71-edfe9abd520b",
    value: "e2ae03bd-f828-4da2-9d71-edfe9abd520b",
    sequenceNo: 1,
  },
  {
    id: 2,
    name: "In Construction",
    color: "#E91E63",
    uniqueId: "fe20f93a-0b8b-40af-8980-d8b74922c407",
    value: "fe20f93a-0b8b-40af-8980-d8b74922c407",
    sequenceNo: 2,
  },
  {
    id: 3,
    name: "Post Construction",
    color: "#9C27B0",
    uniqueId: "2b4b3571-d90e-4185-ad7d-7a2108488d23",
    value: "2b4b3571-d90e-4185-ad7d-7a2108488d23",
    sequenceNo: 3,
  },
  {
    id: 4,
    name: "Operations and Maintenance",
    color: "#673AB7",
    uniqueId: "7fac0e31-cf2e-4a14-b09a-2c7b3d683353",
    value: "7fac0e31-cf2e-4a14-b09a-2c7b3d683353",
    sequenceNo: 4,
  }
];

export const GridData = [
      {
          "id": 16,
          "uniqueid": "e93b0916-d619-4974-8df6-d9839127e667",
          "displayId": "SBS0016",
          "name": "Plumbing",
          "startDate": "2023-11-22T00:00:00",
          "endDate": "2023-11-28T00:00:00",
          "description": "Desiciption update",
          "category": {
              "id": 1155,
              "name": "Exterior Walls & Doors"
          },
          "phase": [
              {
                  "id": 2,
                  "name": "In Construction",
                  "color": "#d6a827",
                  "uniqueId": null,
                  "sequenceNo": null
              }
          ],
          "trades": [
              {
                  "id": 1,
                  "name": "Architectural"
              }
          ],
          "configureSupplementalInfo": true,
          "supplementalInfoAppId": 532163,
          "status": 0,
          "additionalInfo": [],
          "sbsNameFieldId": null,
          "categoryFieldId": null,
          "phaseFieldId": "fld41443c68",
          "tradeFieldId": null,
          "estStartDateFieldId": "fld9d953125",
          "estEndDateFieldId": null,
          "createdBy": {
              "id": 534917,
              "name": ""
          },
          "createdDate": "2023-11-20T12:57:28.86",
          "modifiedBy": {
              "id": 534917,
              "name": "MK, Sudeep"
          },
          "modifiedDate": "2023-12-19T13:52:43.467",
          "hasDifferentCategory": true,
          "referencefiles": [],
          "links": []
      },
      {
          "id": 20,
          "uniqueid": "1e40b642-4e82-4a63-aa2c-70d36e30b18a",
          "displayId": "SBS0020",
          "name": "File Test R 01",
          "startDate": "2023-11-22T00:00:00",
          "endDate": "2023-11-30T00:00:00",
          "description": "",
          "category": {
              "id": 1162,
              "name": "Consultant"
          },
          "phase": [
              {
                  "id": 18,
                  "name": "Construction Complete",
                  "color": "#9E9E9E",
                  "uniqueId": null,
                  "sequenceNo": null
              }
          ],
          "trades": [
              {
                  "id": 3,
                  "name": "Carpentry"
              },
              {
                  "id": 4,
                  "name": "Ceiling"
              }
          ],
          "configureSupplementalInfo": true,
          "supplementalInfoAppId": 532073,
          "status": 0,
          "additionalInfo": [],
          "sbsNameFieldId": null,
          "categoryFieldId": null,
          "phaseFieldId": null,
          "tradeFieldId": null,
          "estStartDateFieldId": null,
          "estEndDateFieldId": null,
          "createdBy": {
              "id": 534917,
              "name": ""
          },
          "createdDate": "2023-11-22T15:11:52.207",
          "modifiedBy": {
              "id": 613606,
              "name": "Mani, Vimal Raj"
          },
          "modifiedDate": "2023-12-19T11:54:27.793",
          "hasDifferentCategory": true,
          "referencefiles": [],
          "links": []
      },
      {
          "id": 21,
          "uniqueid": "3a022d97-b9e6-439e-b91e-c438bd79e5de",
          "displayId": "SBS0021",
          "name": "SBS Name",
          "startDate": "2023-12-12T00:00:00",
          "endDate": "2023-12-20T00:00:00",
          "description": "SBS Manger",
          "category": {
              "id": 1162,
              "name": "Consultant"
          },
          "phase": [
              {
                  "id": 16,
                  "name": "Pre Construction",
                  "color": "#8BC34A",
                  "uniqueId": null,
                  "sequenceNo": null
              }
          ],
          "trades": [
              {
                  "id": 1,
                  "name": "Architectural"
              },
              {
                  "id": 70,
                  "name": "aDD "
              }
          ],
          "configureSupplementalInfo": true,
          "supplementalInfoAppId": 532073,
          "status": 0,
          "additionalInfo": [],
          "sbsNameFieldId": null,
          "categoryFieldId": null,
          "phaseFieldId": null,
          "tradeFieldId": null,
          "estStartDateFieldId": null,
          "estEndDateFieldId": null,
          "createdBy": {
              "id": 534917,
              "name": ""
          },
          "createdDate": "2023-12-19T09:22:03.607",
          "modifiedBy": {
              "id": 613606,
              "name": "Mani, Vimal Raj"
          },
          "modifiedDate": "2023-12-19T11:59:11.623",
          "hasDifferentCategory": true,
          "referencefiles": [],
          "links": []
      }
  ];
  export const CategoryList = {
    id: 13,
    name: "Submittal Type",
    relatedTo: null,
    relatedToText: null,
    allowProjectOverride: true,
    projectId: null,
    listValues: [
      {
        id: 1167,
        listId: 13,
        projectId: null,
        value: "Calculations",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 1,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1168,
        listId: 13,
        projectId: null,
        value: "Test/Inspection",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 2,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1169,
        listId: 13,
        projectId: null,
        value: "Guarantee/ Warrantee",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 3,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1170,
        listId: 13,
        projectId: null,
        value: "Shop Drawings",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 4,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1171,
        listId: 13,
        projectId: null,
        value: "Certificates",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 5,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1172,
        listId: 13,
        projectId: null,
        value: "Samples",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 6,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1173,
        listId: 13,
        projectId: null,
        value: "Manufacturer Data",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 7,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1174,
        listId: 13,
        projectId: null,
        value: "Others",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 8,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1175,
        listId: 13,
        projectId: null,
        value: "Manufacturer's Data",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 9,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1176,
        listId: 13,
        projectId: null,
        value: "Manufacturer''s Data",
        description: null,
        keyValue: "Manufacturer''s Data",
        keyValueItemId: null,
        displayOrder: 10,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1177,
        listId: 13,
        projectId: null,
        value: "Certificate",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 11,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1178,
        listId: 13,
        projectId: null,
        value: "Closeout",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 12,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1179,
        listId: 13,
        projectId: null,
        value: "General",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 13,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1180,
        listId: 13,
        projectId: null,
        value: "Informational",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 14,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1181,
        listId: 13,
        projectId: null,
        value: "Mill Cert",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 15,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1182,
        listId: 13,
        projectId: null,
        value: "Mix Design",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 16,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1183,
        listId: 13,
        projectId: null,
        value: "Product Data",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 17,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1184,
        listId: 13,
        projectId: null,
        value: "Product Design Criteria",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 18,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1185,
        listId: 13,
        projectId: null,
        value: "Project record Documents",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 19,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1186,
        listId: 13,
        projectId: null,
        value: "Quality Assurance",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 20,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1187,
        listId: 13,
        projectId: null,
        value: "Sample",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 21,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1188,
        listId: 13,
        projectId: null,
        value: "Test Reports",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 22,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1189,
        listId: 13,
        projectId: null,
        value: "Warranty",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 23,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1190,
        listId: 13,
        projectId: null,
        value: "O&M Manual",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 24,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1191,
        listId: 13,
        projectId: null,
        value: "Qualification Data",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 25,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1192,
        listId: 13,
        projectId: null,
        value: "Product Certificate",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 26,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1193,
        listId: 13,
        projectId: null,
        value: "Welder Certificate",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 27,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1194,
        listId: 13,
        projectId: null,
        value: "Maintenance Data",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 28,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1195,
        listId: 13,
        projectId: null,
        value: "Wiring Diagram",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 29,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1196,
        listId: 13,
        projectId: null,
        value: "As-Builts",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 30,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1197,
        listId: 13,
        projectId: null,
        value: "Coordination Drawings",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 31,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1198,
        listId: 13,
        projectId: null,
        value: "Reports",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 32,
        listValues: null,
        isSystem: false,
      },
      {
        id: 1199,
        listId: 13,
        projectId: null,
        value: "Meetings",
        description: null,
        keyValue: null,
        keyValueItemId: null,
        displayOrder: 33,
        listValues: null,
        isSystem: false,
      },
    ],
    isImportedFromOrg: false,
    listCategories: [
      {
        id: 1,
        name: "App Lookup",
        projectId: null,
        isSystem: false,
      },
    ],
    isSystem: false,
  };

  export const gridDetailsByIdData = {
    "id": 11,
    "uniqueid": "51cccec6-32c1-48e4-80cd-c2778ff41888",
    "displayId": "SBS0011",
    "name": "SS4",
    "startDate": "2023-12-03T00:00:00",
    "endDate": "2023-12-05T00:00:00",
    "description": "Pre Construction description",
    "category": {
        "id": 12,
        "name": "Certificates"
    },
    "phase": {
        "id": 14,
        "name": "Pre Construction",
        "color": "#F44336",
        "uniqueId": "e2ae03bd-f828-4da2-9d71-edfe9abd520b",
        "sequenceNo": "e2ae03bd-f828-4da2-9d71-edfe9abd520b"
    },
    "trades": [
      {
        objectId: 1,
        status: 1,
        isPrimary: !1,
        companyId: null,
        uniqueId: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
        name: "Capentry",
        description: "Capentry",
        color: "#1D2899",
        isDrawingDiscipline: !0,
        isImportedFromOrg: !1,
        label: "Capentry",
        value: "64bf0c89-2636-4673-9e2c-a1be824fdb27",
        displayLabel: "Capentry",
      }
    ],
    "configureSupplementalInfo": false,
    "status": 0,
    "additionalInfo": [],
    "SBSNameFieldId": "fledNameFld123",
    "categoryFieldId": "fldFls2345",
    "phaseFieldId": "fldPhase23",
    "tradeFieldId": "fldTrade234",
    "estStartDateFieldId": "fldest123",
    "estEndDateFieldId": "fldest235",
    "createdBy": {
        "id": 531825,
        "name": ""
    },
    "createdDate": "2023-06-06T12:15:31.26",
    "modifiedBy": {
        "id": 531825,
        "name": "LocalUser6, LocalUser6"
    },
    "modifiedDate": "2023-06-06T12:21:39.927",
    "referencefiles": [
      {
          "sbsId": 21,
          "name": "download.jpg",
          "folderType": 0,
          "description": null,
          "createdBy": {
              "id": null,
              "name": "MK, Sudeep"
          },
          "createdDate": "2023-12-19T04:24:06.54",
          "phase": {
              "id": null,
              "name": null,
              "color": null,
              "uniqueId": null,
              "sequenceNo": null
          },
          "contentType": null,
          "thumbnail": null,
          "downloadUrl": null,
          "fileId": null,
          "driveId": null,
          "objectId": 0
      }
  ],
    "links": []
}

export const getGridDataById ={
  "id": 13,
  "uniqueid": "a87452a0-1a3f-4603-b0f4-d926a13a400e",
  "displayId": "SBS0013",
  "name": "SBS Name",
  "startDate": "2023-11-20T00:00:00",
  "endDate": "2023-11-21T00:00:00",
  "description": "SBS Manger",
  "category": {
      "id": 1159,
      "name": "Structural"
  },
  "phase": [
      {
          "id": 1,
          "name": "Pre Construction",
          "color": "#81c3dc",
          "uniqueId": null,
          "sequenceNo": null
      }
  ],
  "trades": [
      {
          "id": 2,
          "name": "Capentry2 "
      }
  ],
  "configureSupplementalInfo": false,
  "supplementalInfoAppId": 0,
  "status": 0,
  "additionalInfo": [
      {
          "id": null,
          "sbsId": 13,
          "name": null,
          "appId": null,
          "appName": null,
          "icon": null
      }
  ],
  "SBSNameFieldId": "fld0b2dfc09" ,
  "categoryFieldId": null,
  "phaseFieldId": null,
  "tradeFieldId": null,
  "estStartDateFieldId": null,
  "estEndDateFieldId": null,
  "createdBy": {
      "id": 534917,
      "name": ""
  },
  "createdDate": "2023-11-20T05:32:38.57",
  "modifiedBy": {
      "id": 534917,
      "name": "MK, Sudeep"
  },
  "modifiedDate": null,
  "referencefiles": [
    {
        "sbsId": 21,
        "name": "download.jpg",
        "folderType": 0,
        "description": null,
        "createdBy": {
            "id": null,
            "name": "MK, Sudeep"
        },
        "createdDate": "2023-12-19T04:24:06.54",
        "phase": {
            "id": null,
            "name": null,
            "color": null,
            "uniqueId": null,
            "sequenceNo": null
        },
        "contentType": null,
        "thumbnail": null,
        "downloadUrl": null,
        "fileId": null,
        "driveId": null,
        "objectId": 0
    }
],
  "links": [
    {
        "sbsId": 16,
        "name": "New",
        "stagename": "Draft",
        "stageColor": "E40808",
        "type": 0,
        "description": "",
        "createdBy": {
            "id": null,
            "name": "MK, Sudeep"
        },
        "createdDate": "2023-11-28T04:52:25.2"
    }
  ]
}
export const GeneralSettingsCategories = {"totalCount":54,"success":true,"values":[{"id":14,"name":"16 Division Master Format","relatedTo":null,"relatedToText":"","allowProjectOverride":false,"projectId":null,"listValues":[{"id":747,"listId":14,"projectId":null,"value":"01 - General Requirement","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":748,"listId":14,"projectId":null,"value":"02 - Existing Conditions","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":749,"listId":14,"projectId":null,"value":"03 - Concrete","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":750,"listId":14,"projectId":null,"value":"04 - Masonry","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":751,"listId":14,"projectId":null,"value":"05 - Metals","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":752,"listId":14,"projectId":null,"value":"06 - Wood and Plastics","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":753,"listId":14,"projectId":null,"value":"07 - Thermal and Moisture Protection","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true},{"id":754,"listId":14,"projectId":null,"value":"08 - Doors and Windows","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":8,"listValues":null,"isSystem":true},{"id":755,"listId":14,"projectId":null,"value":"09 - Finishes","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":9,"listValues":null,"isSystem":true},{"id":756,"listId":14,"projectId":null,"value":"10 - Specialties","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":10,"listValues":null,"isSystem":true},{"id":757,"listId":14,"projectId":null,"value":"11 - Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":11,"listValues":null,"isSystem":true},{"id":758,"listId":14,"projectId":null,"value":"12 - Furnishings","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":12,"listValues":null,"isSystem":true},{"id":759,"listId":14,"projectId":null,"value":"13 - Special Construction","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":13,"listValues":null,"isSystem":true},{"id":760,"listId":14,"projectId":null,"value":"14 - Conveying Systems","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":14,"listValues":null,"isSystem":true},{"id":761,"listId":14,"projectId":null,"value":"15 - Mechanical/Plumbing","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":15,"listValues":null,"isSystem":true},{"id":762,"listId":14,"projectId":null,"value":"16 - Electrical","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":16,"listValues":null,"isSystem":true},{"id":763,"listId":14,"projectId":null,"value":"20 - ABC Miscellaneous","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":17,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":2,"name":"Budget Top Segment","projectId":null,"isSystem":false}],"isSystem":true},{"id":24,"name":"3rd Level for 16 Division Cost Code","relatedTo":19,"relatedToText":"Cost Code for 16 Division Master Format","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false}],"isSystem":false},{"id":38,"name":"4th Level for 16 Division Master Format","relatedTo":24,"relatedToText":"3rd Level for 16 Division Cost Code","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false}],"isSystem":false},{"id":15,"name":"50 Division Master Format","relatedTo":null,"relatedToText":"","allowProjectOverride":false,"projectId":null,"listValues":[{"id":697,"listId":15,"projectId":null,"value":"00 - Procurement and Contracting Requirements","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":698,"listId":15,"projectId":null,"value":"01 - General Requirements","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":699,"listId":15,"projectId":null,"value":"02 - Existing Conditions","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":700,"listId":15,"projectId":null,"value":"03 - Concrete","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":701,"listId":15,"projectId":null,"value":"04 - Masonry","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":702,"listId":15,"projectId":null,"value":"05 - Metals","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":703,"listId":15,"projectId":null,"value":"06 - Wood, Plastics, and Composites","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true},{"id":704,"listId":15,"projectId":null,"value":"07 - Thermal and Moisture Protection","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":8,"listValues":null,"isSystem":true},{"id":705,"listId":15,"projectId":null,"value":"08 - Openings","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":9,"listValues":null,"isSystem":true},{"id":706,"listId":15,"projectId":null,"value":"09 - Finishes","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":10,"listValues":null,"isSystem":true},{"id":707,"listId":15,"projectId":null,"value":"10 - Specialties","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":11,"listValues":null,"isSystem":true},{"id":708,"listId":15,"projectId":null,"value":"11 - Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":12,"listValues":null,"isSystem":true},{"id":709,"listId":15,"projectId":null,"value":"12 - Furnishings","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":13,"listValues":null,"isSystem":true},{"id":710,"listId":15,"projectId":null,"value":"13 - Special Construction","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":14,"listValues":null,"isSystem":true},{"id":711,"listId":15,"projectId":null,"value":"14 - Conveying Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":15,"listValues":null,"isSystem":true},{"id":712,"listId":15,"projectId":null,"value":"15 - Plumbing + HVAC","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":16,"listValues":null,"isSystem":true},{"id":713,"listId":15,"projectId":null,"value":"16 - Electrical + Lighting","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":17,"listValues":null,"isSystem":true},{"id":714,"listId":15,"projectId":null,"value":"17 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":18,"listValues":null,"isSystem":true},{"id":715,"listId":15,"projectId":null,"value":"18 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":19,"listValues":null,"isSystem":true},{"id":716,"listId":15,"projectId":null,"value":"19 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":20,"listValues":null,"isSystem":true},{"id":717,"listId":15,"projectId":null,"value":"20 - Mechanical Support","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":21,"listValues":null,"isSystem":true},{"id":718,"listId":15,"projectId":null,"value":"21 - Fire Suppression","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":22,"listValues":null,"isSystem":true},{"id":719,"listId":15,"projectId":null,"value":"22 - Plumbing","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":23,"listValues":null,"isSystem":true},{"id":720,"listId":15,"projectId":null,"value":"23 - Heating Ventilating and Air Conditioning","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":24,"listValues":null,"isSystem":true},{"id":721,"listId":15,"projectId":null,"value":"24 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":25,"listValues":null,"isSystem":true},{"id":722,"listId":15,"projectId":null,"value":"25 - Integrated Automation","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":26,"listValues":null,"isSystem":true},{"id":723,"listId":15,"projectId":null,"value":"26 - Electrical","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":27,"listValues":null,"isSystem":true},{"id":724,"listId":15,"projectId":null,"value":"27 - Communications","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":28,"listValues":null,"isSystem":true},{"id":725,"listId":15,"projectId":null,"value":"28 - Electronic Safety and Security","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":29,"listValues":null,"isSystem":true},{"id":726,"listId":15,"projectId":null,"value":"29 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":30,"listValues":null,"isSystem":true},{"id":727,"listId":15,"projectId":null,"value":"30 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":31,"listValues":null,"isSystem":true},{"id":728,"listId":15,"projectId":null,"value":"31 - Earthwork","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":32,"listValues":null,"isSystem":true},{"id":729,"listId":15,"projectId":null,"value":"32 - Exterior Improvements","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":33,"listValues":null,"isSystem":true},{"id":730,"listId":15,"projectId":null,"value":"33 - Utilities","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":34,"listValues":null,"isSystem":true},{"id":731,"listId":15,"projectId":null,"value":"34 - Transportation","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":35,"listValues":null,"isSystem":true},{"id":732,"listId":15,"projectId":null,"value":"35 - Waterways and Marine Construction","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":36,"listValues":null,"isSystem":true},{"id":733,"listId":15,"projectId":null,"value":"36 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":37,"listValues":null,"isSystem":true},{"id":734,"listId":15,"projectId":null,"value":"37 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":38,"listValues":null,"isSystem":true},{"id":735,"listId":15,"projectId":null,"value":"38 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":39,"listValues":null,"isSystem":true},{"id":736,"listId":15,"projectId":null,"value":"39 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":40,"listValues":null,"isSystem":true},{"id":737,"listId":15,"projectId":null,"value":"40 - Process Interconnections","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":41,"listValues":null,"isSystem":true},{"id":738,"listId":15,"projectId":null,"value":"41 - Material Processing and Handling Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":42,"listValues":null,"isSystem":true},{"id":739,"listId":15,"projectId":null,"value":"42 - Process Heating, Cooling, and Drying Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":43,"listValues":null,"isSystem":true},{"id":740,"listId":15,"projectId":null,"value":"43 - Process Gas and Liquid Handling, Purification and Storage Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":44,"listValues":null,"isSystem":true},{"id":741,"listId":15,"projectId":null,"value":"44 - Pollution Control Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":45,"listValues":null,"isSystem":true},{"id":742,"listId":15,"projectId":null,"value":"45 - Industry-Specific Manufacturing Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":46,"listValues":null,"isSystem":true},{"id":743,"listId":15,"projectId":null,"value":"46 - Water and Wastewater Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":47,"listValues":null,"isSystem":true},{"id":744,"listId":15,"projectId":null,"value":"47 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":48,"listValues":null,"isSystem":true},{"id":745,"listId":15,"projectId":null,"value":"48 - Electrical Power Generation","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":49,"listValues":null,"isSystem":true},{"id":746,"listId":15,"projectId":null,"value":"49 - RESERVED FOR FUTURE EXPANSION","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":50,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":2,"name":"Budget Top Segment","projectId":null,"isSystem":false}],"isSystem":true},{"id":11,"name":"Accident Mechanism","relatedTo":10,"relatedToText":"Blood Group","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false}],"isSystem":false},{"id":64,"name":"Account Type","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":false},{"id":48,"name":"Air Quality Index","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":1529,"listId":48,"projectId":null,"value":"0 to 50 - Good","description":"Air quality is considered satisfactory, and air pollution poses little or no risk","keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1530,"listId":48,"projectId":null,"value":"51 to 100 - Moderate","description":"Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.","keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":1531,"listId":48,"projectId":null,"value":"101 to 150 - Unhealthy for Sensitive Groups","description":"Members of sensitive groups may experience health effects. The general public is not likely to be affected.","keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":1532,"listId":48,"projectId":null,"value":"151 to 200 - Unhealthy","description":"Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects","keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":1533,"listId":48,"projectId":null,"value":"201 to 300 - Very Unhealthy","description":"Health warnings of emergency conditions. The entire population is more likely to be affected.","keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":1534,"listId":48,"projectId":null,"value":"300 and higher - Hazardous","description":"Health alert: everyone may experience more serious health effects","keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":true},{"id":10,"name":"Blood Group","relatedTo":6,"relatedToText":"Gender","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false},{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false}],"isSystem":false},{"id":9,"name":"Body Part Injured","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":47,"name":"Cities","relatedTo":46,"relatedToText":"Country","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false},{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":false},{"id":30,"name":"Company Category","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":5,"name":"Planner","projectId":null,"isSystem":false}],"isSystem":false},{"id":21,"name":"Compliance Categories","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":1110,"listId":21,"projectId":null,"value":"Certificate Of Insurance","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1111,"listId":21,"projectId":null,"value":"Certificate Of Good Standing","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":1112,"listId":21,"projectId":null,"value":"Workmans Comp","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":null,"isSystem":true},{"id":1,"name":"Constraint Categories","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":647,"listId":1,"projectId":null,"value":"Tools","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":648,"listId":1,"projectId":null,"value":"Information","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":649,"listId":1,"projectId":null,"value":"Material","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":650,"listId":1,"projectId":null,"value":"Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":651,"listId":1,"projectId":null,"value":"Safety","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":652,"listId":1,"projectId":null,"value":"Space","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":5,"name":"Planner","projectId":null,"isSystem":false}],"isSystem":true},{"id":43,"name":"Continents","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":2,"name":"Budget Top Segment","projectId":null,"isSystem":false}],"isSystem":false},{"id":8,"name":"Contributing Factor","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false},{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":19,"name":"Cost Code for 16 Division Master Format","relatedTo":14,"relatedToText":"16 Division Master Format","allowProjectOverride":false,"projectId":null,"listValues":[{"id":764,"listId":19,"projectId":null,"value":"General Contractor 1001","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":1,"listValues":null,"isSystem":true},{"id":765,"listId":19,"projectId":null,"value":"General Contractor- Airports 1002","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":2,"listValues":null,"isSystem":true},{"id":766,"listId":19,"projectId":null,"value":"General Contractor- Churches 1003","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":3,"listValues":null,"isSystem":true},{"id":767,"listId":19,"projectId":null,"value":"General Contractor- Commercial 1004","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":4,"listValues":null,"isSystem":true},{"id":768,"listId":19,"projectId":null,"value":"General Contractor- Design/Build 1005","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":5,"listValues":null,"isSystem":true},{"id":769,"listId":19,"projectId":null,"value":"General Contractor- Heavy/Highway 1006","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":6,"listValues":null,"isSystem":true},{"id":770,"listId":19,"projectId":null,"value":"General Contractor- Industrial Maintenance 1007","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":7,"listValues":null,"isSystem":true},{"id":771,"listId":19,"projectId":null,"value":"General Contractor- Industrial 1008","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":8,"listValues":null,"isSystem":true},{"id":772,"listId":19,"projectId":null,"value":"General Contractor- Institutional 1009","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":9,"listValues":null,"isSystem":true},{"id":773,"listId":19,"projectId":null,"value":"General Contractor- Pre Engineered Buildings 1010","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":10,"listValues":null,"isSystem":true},{"id":774,"listId":19,"projectId":null,"value":"General Contractor- High Rise Office 1011","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":11,"listValues":null,"isSystem":true},{"id":775,"listId":19,"projectId":null,"value":"General Contractor- Low Rise Office 1012","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":12,"listValues":null,"isSystem":true},{"id":776,"listId":19,"projectId":null,"value":"General Contractor- High Rise Apartments 1013","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":13,"listValues":null,"isSystem":true},{"id":777,"listId":19,"projectId":null,"value":"General Contractor- Low Rise Apartments 1014","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":14,"listValues":null,"isSystem":true},{"id":778,"listId":19,"projectId":null,"value":"General Contractor- Waste Water Treatment 1015","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":15,"listValues":null,"isSystem":true},{"id":779,"listId":19,"projectId":null,"value":"General Contractor- Construction Manager 1016","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":16,"listValues":null,"isSystem":true},{"id":780,"listId":19,"projectId":null,"value":"General Contractor- Facilities Manager 1017","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":17,"listValues":null,"isSystem":true},{"id":781,"listId":19,"projectId":null,"value":"General Contractor- Historical Renovation 1018","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":18,"listValues":null,"isSystem":true},{"id":782,"listId":19,"projectId":null,"value":"General Contractor- Tenant Finish 1019","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":19,"listValues":null,"isSystem":true},{"id":783,"listId":19,"projectId":null,"value":"General Contractor- Interior Finish 1021","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":20,"listValues":null,"isSystem":true},{"id":784,"listId":19,"projectId":null,"value":"General Contractor- Farm Buildings 1024","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":21,"listValues":null,"isSystem":true},{"id":785,"listId":19,"projectId":null,"value":"General Contractor- Health Care Facilities/Services 1025","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":22,"listValues":null,"isSystem":true},{"id":786,"listId":19,"projectId":null,"value":"General Contractor- Hangar & Maintenance 1026","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":23,"listValues":null,"isSystem":true},{"id":787,"listId":19,"projectId":null,"value":"General Contractor- Industrial & Commercial 1030","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":24,"listValues":null,"isSystem":true},{"id":788,"listId":19,"projectId":null,"value":"General Contractor- Custom Built Homes 1031","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":25,"listValues":null,"isSystem":true},{"id":789,"listId":19,"projectId":null,"value":"General Contractor- Residential Multi Family 1032","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":26,"listValues":null,"isSystem":true},{"id":790,"listId":19,"projectId":null,"value":"General Contractor- Retail 1033","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":27,"listValues":null,"isSystem":true},{"id":791,"listId":19,"projectId":null,"value":"General Contractor- Other Specialty Construction 1040","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":28,"listValues":null,"isSystem":true},{"id":792,"listId":19,"projectId":null,"value":"Construction Management/Coordination Firm 1060","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":29,"listValues":null,"isSystem":true},{"id":793,"listId":19,"projectId":null,"value":"Project Scheduling 1310","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":30,"listValues":null,"isSystem":true},{"id":794,"listId":19,"projectId":null,"value":"Engineering Services 1330","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":31,"listValues":null,"isSystem":true},{"id":795,"listId":19,"projectId":null,"value":"Construction Documentation 1380","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":32,"listValues":null,"isSystem":true},{"id":796,"listId":19,"projectId":null,"value":"Quality Control Services 1400","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":33,"listValues":null,"isSystem":true},{"id":797,"listId":19,"projectId":null,"value":"Temporary Facilities 1500","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":34,"listValues":null,"isSystem":true},{"id":798,"listId":19,"projectId":null,"value":"Portable Toilets 1505","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":35,"listValues":null,"isSystem":true},{"id":799,"listId":19,"projectId":null,"value":"Temporary Utilities 1510","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":36,"listValues":null,"isSystem":true},{"id":800,"listId":19,"projectId":null,"value":"Security Services 1520","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":37,"listValues":null,"isSystem":true},{"id":801,"listId":19,"projectId":null,"value":"Construction Aids 1525","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":38,"listValues":null,"isSystem":true},{"id":802,"listId":19,"projectId":null,"value":"Temporary Controls 1560","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":39,"listValues":null,"isSystem":true},{"id":803,"listId":19,"projectId":null,"value":"Project Identification and Signs 1580","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":40,"listValues":null,"isSystem":true},{"id":804,"listId":19,"projectId":null,"value":"Construction Equipment 1600","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":41,"listValues":null,"isSystem":true},{"id":805,"listId":19,"projectId":null,"value":"Construction Tools 1630","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":42,"listValues":null,"isSystem":true},{"id":806,"listId":19,"projectId":null,"value":"Construction Cleaning Services 1710","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":43,"listValues":null,"isSystem":true},{"id":807,"listId":19,"projectId":null,"value":"Insurance and Bonding 1905","description":null,"keyValue":"01 - General Requirement","keyValueItemId":747,"displayOrder":44,"listValues":null,"isSystem":true},{"id":808,"listId":19,"projectId":null,"value":"Site Work Supplier 2010","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":45,"listValues":null,"isSystem":true},{"id":809,"listId":19,"projectId":null,"value":"Aggregate Manufacture Supplier 2040","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":46,"listValues":null,"isSystem":true},{"id":810,"listId":19,"projectId":null,"value":"Demolition 2050","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":47,"listValues":null,"isSystem":true},{"id":811,"listId":19,"projectId":null,"value":"Hazardous Material Removal 2055","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":48,"listValues":null,"isSystem":true},{"id":812,"listId":19,"projectId":null,"value":"Off-site Transportation and Disposal 2060","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":49,"listValues":null,"isSystem":true},{"id":813,"listId":19,"projectId":null,"value":"Cement 2065","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":50,"listValues":null,"isSystem":true},{"id":814,"listId":19,"projectId":null,"value":"Site Preparation 2100","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":51,"listValues":null,"isSystem":true},{"id":815,"listId":19,"projectId":null,"value":"Earthwork Supplies 2105","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":52,"listValues":null,"isSystem":true},{"id":816,"listId":19,"projectId":null,"value":"Geosynthetics 2107","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":53,"listValues":null,"isSystem":true},{"id":817,"listId":19,"projectId":null,"value":"Dewatering 2140","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":54,"listValues":null,"isSystem":true},{"id":818,"listId":19,"projectId":null,"value":"Excavation Support & Shoring Systems 2150","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":55,"listValues":null,"isSystem":true},{"id":819,"listId":19,"projectId":null,"value":"Soil Stabilization 2240","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":56,"listValues":null,"isSystem":true},{"id":820,"listId":19,"projectId":null,"value":"Soil Treatment 2280","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":57,"listValues":null,"isSystem":true},{"id":821,"listId":19,"projectId":null,"value":"Tunneling 2300","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":58,"listValues":null,"isSystem":true},{"id":822,"listId":19,"projectId":null,"value":"Man Hole Covers 2315","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":59,"listValues":null,"isSystem":true},{"id":823,"listId":19,"projectId":null,"value":"Piling 2350","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":60,"listValues":null,"isSystem":true},{"id":824,"listId":19,"projectId":null,"value":"Caissons/Drilled Piers 2380","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":61,"listValues":null,"isSystem":true},{"id":825,"listId":19,"projectId":null,"value":"Railroad Work 2450","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":62,"listValues":null,"isSystem":true},{"id":826,"listId":19,"projectId":null,"value":"Marine Work 2480","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":63,"listValues":null,"isSystem":true},{"id":827,"listId":19,"projectId":null,"value":"Marine Diving 2485","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":64,"listValues":null,"isSystem":true},{"id":828,"listId":19,"projectId":null,"value":"Asphalt Paving 2510","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":65,"listValues":null,"isSystem":true},{"id":829,"listId":19,"projectId":null,"value":"Asphalt Paving Concrete Materials 2513","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":66,"listValues":null,"isSystem":true},{"id":830,"listId":19,"projectId":null,"value":"Unit Pavers 2515","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":67,"listValues":null,"isSystem":true},{"id":831,"listId":19,"projectId":null,"value":"Base Courses 2516","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":68,"listValues":null,"isSystem":true},{"id":832,"listId":19,"projectId":null,"value":"Concrete Paving 2520","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":69,"listValues":null,"isSystem":true},{"id":833,"listId":19,"projectId":null,"value":"Curbs 2525","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":70,"listValues":null,"isSystem":true},{"id":834,"listId":19,"projectId":null,"value":"Athletic Paving & Surfacing 2530","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":71,"listValues":null,"isSystem":true},{"id":835,"listId":19,"projectId":null,"value":"Pavement Marking 2580","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":72,"listValues":null,"isSystem":true},{"id":836,"listId":19,"projectId":null,"value":"Site Utilities Pressure Piping 2600","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":73,"listValues":null,"isSystem":true},{"id":837,"listId":19,"projectId":null,"value":"Water Wells 2670","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":74,"listValues":null,"isSystem":true},{"id":838,"listId":19,"projectId":null,"value":"Sewerage and Drainage 2700","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":75,"listValues":null,"isSystem":true},{"id":839,"listId":19,"projectId":null,"value":"Septic Systems 2710","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":76,"listValues":null,"isSystem":true},{"id":840,"listId":19,"projectId":null,"value":"Restoration of Underground Pipelines 2760","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":77,"listValues":null,"isSystem":true},{"id":841,"listId":19,"projectId":null,"value":"Ponds and Reservoirs 2770","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":78,"listValues":null,"isSystem":true},{"id":842,"listId":19,"projectId":null,"value":"Site Improvements 2800","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":79,"listValues":null,"isSystem":true},{"id":843,"listId":19,"projectId":null,"value":"Fences & Gates 2830","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":80,"listValues":null,"isSystem":true},{"id":844,"listId":19,"projectId":null,"value":"Landscaping and Irrigation 2900","description":null,"keyValue":"02 - Existing Conditions","keyValueItemId":699,"displayOrder":81,"listValues":null,"isSystem":true},{"id":845,"listId":19,"projectId":null,"value":"Concrete Contractor 3010","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":82,"listValues":null,"isSystem":true},{"id":846,"listId":19,"projectId":null,"value":"Concrete Supplier 3050","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":83,"listValues":null,"isSystem":true},{"id":847,"listId":19,"projectId":null,"value":"Concrete Formwork 3100","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":84,"listValues":null,"isSystem":true},{"id":848,"listId":19,"projectId":null,"value":"Concrete Reinforcing 3200","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":85,"listValues":null,"isSystem":true},{"id":849,"listId":19,"projectId":null,"value":"Reinforcing Steel 3210","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":86,"listValues":null,"isSystem":true},{"id":850,"listId":19,"projectId":null,"value":"Cast In Place Concrete 3300","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":87,"listValues":null,"isSystem":true},{"id":851,"listId":19,"projectId":null,"value":"Cement Supplier 3310","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":88,"listValues":null,"isSystem":true},{"id":852,"listId":19,"projectId":null,"value":"Ready-Mix Concrete 3320","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":89,"listValues":null,"isSystem":true},{"id":853,"listId":19,"projectId":null,"value":"Concrete Placing and Finishing 3345","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":90,"listValues":null,"isSystem":true},{"id":854,"listId":19,"projectId":null,"value":"Concrete Curling Supplier 3346","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":91,"listValues":null,"isSystem":true},{"id":855,"listId":19,"projectId":null,"value":"Grout 3347","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":92,"listValues":null,"isSystem":true},{"id":856,"listId":19,"projectId":null,"value":"Special Finish Concrete 3350","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":93,"listValues":null,"isSystem":true},{"id":857,"listId":19,"projectId":null,"value":"Specially Placed Concrete 3360","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":94,"listValues":null,"isSystem":true},{"id":858,"listId":19,"projectId":null,"value":"Precast Concrete 3400","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":95,"listValues":null,"isSystem":true},{"id":859,"listId":19,"projectId":null,"value":"Site Cast Precast Concrete 3460","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":96,"listValues":null,"isSystem":true},{"id":860,"listId":19,"projectId":null,"value":"Precast Concrete Specialties 3480","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":97,"listValues":null,"isSystem":true},{"id":861,"listId":19,"projectId":null,"value":"Cementitious Decks 3500","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":98,"listValues":null,"isSystem":true},{"id":862,"listId":19,"projectId":null,"value":"Concrete Restoration and Cleaning 3700","description":null,"keyValue":"03 - Concrete","keyValueItemId":749,"displayOrder":99,"listValues":null,"isSystem":true},{"id":863,"listId":19,"projectId":null,"value":"Masonry 4200","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":100,"listValues":null,"isSystem":true},{"id":864,"listId":19,"projectId":null,"value":"Brick Masonry Supplies 4331","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":101,"listValues":null,"isSystem":true},{"id":865,"listId":19,"projectId":null,"value":"Mortar & Masonry Grout 4332","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":102,"listValues":null,"isSystem":true},{"id":866,"listId":19,"projectId":null,"value":"Reinforced Unit Masonry 4333","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":103,"listValues":null,"isSystem":true},{"id":867,"listId":19,"projectId":null,"value":"Washed Sand & Gravel 4336","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":104,"listValues":null,"isSystem":true},{"id":868,"listId":19,"projectId":null,"value":"Stone 4400","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":105,"listValues":null,"isSystem":true},{"id":869,"listId":19,"projectId":null,"value":"Masonry Restoration and Cleaning 4500","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":106,"listValues":null,"isSystem":true},{"id":870,"listId":19,"projectId":null,"value":"Special Masonry Installations 4550","description":null,"keyValue":"04 - Masonry","keyValueItemId":701,"displayOrder":107,"listValues":null,"isSystem":true},{"id":871,"listId":19,"projectId":null,"value":"Structural Metal Erection 5010","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":108,"listValues":null,"isSystem":true},{"id":872,"listId":19,"projectId":null,"value":"Basic Metal Materials and Methods 5050","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":109,"listValues":null,"isSystem":true},{"id":873,"listId":19,"projectId":null,"value":"Structural Framing 5100","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":110,"listValues":null,"isSystem":true},{"id":874,"listId":19,"projectId":null,"value":"Millwright 5105","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":111,"listValues":null,"isSystem":true},{"id":875,"listId":19,"projectId":null,"value":"Rigging 5110","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":112,"listValues":null,"isSystem":true},{"id":876,"listId":19,"projectId":null,"value":"Structural Steel 5120","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":113,"listValues":null,"isSystem":true},{"id":877,"listId":19,"projectId":null,"value":"Steel Joists 5210","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":114,"listValues":null,"isSystem":true},{"id":878,"listId":19,"projectId":null,"value":"Metal Decking 5300","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":115,"listValues":null,"isSystem":true},{"id":879,"listId":19,"projectId":null,"value":"Cold Formed Metal Framing 5400","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":116,"listValues":null,"isSystem":true},{"id":880,"listId":19,"projectId":null,"value":"Load Bearing Metal Studs 5410","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":117,"listValues":null,"isSystem":true},{"id":881,"listId":19,"projectId":null,"value":"Miscellaneous Metal Fabrications 5500","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":118,"listValues":null,"isSystem":true},{"id":882,"listId":19,"projectId":null,"value":"Metal Handrails & Railings 5520","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":119,"listValues":null,"isSystem":true},{"id":883,"listId":19,"projectId":null,"value":"Gratings and Floor Plates 5535","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":120,"listValues":null,"isSystem":true},{"id":884,"listId":19,"projectId":null,"value":"Metal Castings 5560","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":121,"listValues":null,"isSystem":true},{"id":885,"listId":19,"projectId":null,"value":"Ornamental Metal 5700","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":122,"listValues":null,"isSystem":true},{"id":886,"listId":19,"projectId":null,"value":"Expansion Control 5800","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":123,"listValues":null,"isSystem":true},{"id":887,"listId":19,"projectId":null,"value":"Metal Restoration and Cleaning 5900","description":null,"keyValue":"05 - Metals","keyValueItemId":751,"displayOrder":124,"listValues":null,"isSystem":true},{"id":888,"listId":19,"projectId":null,"value":"Wood And Plastic Fastenings 6090","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":125,"listValues":null,"isSystem":true},{"id":889,"listId":19,"projectId":null,"value":"Rough Carpentry 6100","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":126,"listValues":null,"isSystem":true},{"id":890,"listId":19,"projectId":null,"value":"Structural Wood Components 6130","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":127,"listValues":null,"isSystem":true},{"id":891,"listId":19,"projectId":null,"value":"Prefabricated Structural Wood 6170","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":128,"listValues":null,"isSystem":true},{"id":892,"listId":19,"projectId":null,"value":"Finish Carpentry/Architectural Woodwork 6200","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":129,"listValues":null,"isSystem":true},{"id":893,"listId":19,"projectId":null,"value":"Lumber 6300","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":130,"listValues":null,"isSystem":true},{"id":894,"listId":19,"projectId":null,"value":"Countertops 6415","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":131,"listValues":null,"isSystem":true},{"id":895,"listId":19,"projectId":null,"value":"Plastic Fabrications 6600","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":132,"listValues":null,"isSystem":true},{"id":896,"listId":19,"projectId":null,"value":"Wood and Plastic Restoration and Cleaning 6900","description":null,"keyValue":"06 - Wood and Plastics","keyValueItemId":752,"displayOrder":133,"listValues":null,"isSystem":true},{"id":897,"listId":19,"projectId":null,"value":"Waterproofing/Dampproofing 7100","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":134,"listValues":null,"isSystem":true},{"id":898,"listId":19,"projectId":null,"value":"Insulation 7200","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":135,"listValues":null,"isSystem":true},{"id":899,"listId":19,"projectId":null,"value":"Exterior Insulation and Finish Systems 7240","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":136,"listValues":null,"isSystem":true},{"id":900,"listId":19,"projectId":null,"value":"Fireproofing 7250","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":137,"listValues":null,"isSystem":true},{"id":901,"listId":19,"projectId":null,"value":"Shingles 7310","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":138,"listValues":null,"isSystem":true},{"id":902,"listId":19,"projectId":null,"value":"Roofing Tiles 7320","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":139,"listValues":null,"isSystem":true},{"id":903,"listId":19,"projectId":null,"value":"Preformed Roofing and Cladding/Siding 7400","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":140,"listValues":null,"isSystem":true},{"id":904,"listId":19,"projectId":null,"value":"Roofing Supplier 7405","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":141,"listValues":null,"isSystem":true},{"id":905,"listId":19,"projectId":null,"value":"Membrane Roofing and Sheet Metal 7500","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":142,"listValues":null,"isSystem":true},{"id":906,"listId":19,"projectId":null,"value":"Roof Specialties 7700","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":143,"listValues":null,"isSystem":true},{"id":907,"listId":19,"projectId":null,"value":"Skylights 7800","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":144,"listValues":null,"isSystem":true},{"id":908,"listId":19,"projectId":null,"value":"Firestopping 7840","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":145,"listValues":null,"isSystem":true},{"id":909,"listId":19,"projectId":null,"value":"Joint Sealers 7900","description":null,"keyValue":"07 - Thermal and Moisture Protection","keyValueItemId":704,"displayOrder":146,"listValues":null,"isSystem":true},{"id":910,"listId":19,"projectId":null,"value":"Metal Doors and Frames 8100","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":147,"listValues":null,"isSystem":true},{"id":911,"listId":19,"projectId":null,"value":"Special Metal Doors and Frames 8120","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":148,"listValues":null,"isSystem":true},{"id":912,"listId":19,"projectId":null,"value":"Wood and Plastic Doors 8200","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":149,"listValues":null,"isSystem":true},{"id":913,"listId":19,"projectId":null,"value":"Special Doors 8300","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":150,"listValues":null,"isSystem":true},{"id":914,"listId":19,"projectId":null,"value":"Access Doors 8305","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":151,"listValues":null,"isSystem":true},{"id":915,"listId":19,"projectId":null,"value":"Sliding Doors 8310","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":152,"listValues":null,"isSystem":true},{"id":916,"listId":19,"projectId":null,"value":"Overhead and Coiling Doors 8330","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":153,"listValues":null,"isSystem":true},{"id":917,"listId":19,"projectId":null,"value":"Folding Doors and Grilles 8350","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":154,"listValues":null,"isSystem":true},{"id":918,"listId":19,"projectId":null,"value":"Entrances, Storefronts, Glazing and Curtain Wall 8400","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":155,"listValues":null,"isSystem":true},{"id":919,"listId":19,"projectId":null,"value":"Metal Windows 8500","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":156,"listValues":null,"isSystem":true},{"id":920,"listId":19,"projectId":null,"value":"Wood and Plastic Windows 8600","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":157,"listValues":null,"isSystem":true},{"id":921,"listId":19,"projectId":null,"value":"Special Windows 8650","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":158,"listValues":null,"isSystem":true},{"id":922,"listId":19,"projectId":null,"value":"Hardware 8700 ","description":null,"keyValue":"08 - Doors and Windows","keyValueItemId":754,"displayOrder":159,"listValues":null,"isSystem":true},{"id":923,"listId":19,"projectId":null,"value":"Basic Finish Materials And Methods 9050","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":160,"listValues":null,"isSystem":true},{"id":924,"listId":19,"projectId":null,"value":"Ceiling Suspension 9120","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":161,"listValues":null,"isSystem":true},{"id":925,"listId":19,"projectId":null,"value":"Lath and Plaster 9200","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":162,"listValues":null,"isSystem":true},{"id":926,"listId":19,"projectId":null,"value":"Drywall 9250","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":163,"listValues":null,"isSystem":true},{"id":927,"listId":19,"projectId":null,"value":"Tile and Terrazzo 9300","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":164,"listValues":null,"isSystem":true},{"id":928,"listId":19,"projectId":null,"value":"Acoustical Treatment 9500","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":165,"listValues":null,"isSystem":true},{"id":929,"listId":19,"projectId":null,"value":"Wood Flooring 9550","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":166,"listValues":null,"isSystem":true},{"id":930,"listId":19,"projectId":null,"value":"Stone & Masonry Flooring 9600","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":167,"listValues":null,"isSystem":true},{"id":931,"listId":19,"projectId":null,"value":"Cultured Marble 9610","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":168,"listValues":null,"isSystem":true},{"id":932,"listId":19,"projectId":null,"value":"Soft Flooring 9650","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":169,"listValues":null,"isSystem":true},{"id":933,"listId":19,"projectId":null,"value":"Carpet 9680","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":170,"listValues":null,"isSystem":true},{"id":934,"listId":19,"projectId":null,"value":"Special Flooring and Floor Treatment 9700","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":171,"listValues":null,"isSystem":true},{"id":935,"listId":19,"projectId":null,"value":"Paint Removal 9790","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":172,"listValues":null,"isSystem":true},{"id":936,"listId":19,"projectId":null,"value":"Special Coatings 9800","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":173,"listValues":null,"isSystem":true},{"id":937,"listId":19,"projectId":null,"value":"Painting and Wall Coverings 9900","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":174,"listValues":null,"isSystem":true},{"id":938,"listId":19,"projectId":null,"value":"Wall coverings 9950","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":175,"listValues":null,"isSystem":true},{"id":939,"listId":19,"projectId":null,"value":"Sandblasting 9980 ","description":null,"keyValue":"09 - Finishes","keyValueItemId":706,"displayOrder":176,"listValues":null,"isSystem":true},{"id":940,"listId":19,"projectId":null,"value":"Miscellaneous Specialties 10950 ","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":177,"listValues":null,"isSystem":true},{"id":941,"listId":19,"projectId":null,"value":"Chalkboards and Tackboards 10100","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":178,"listValues":null,"isSystem":true},{"id":942,"listId":19,"projectId":null,"value":"Compartments and Cubicles 10150","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":179,"listValues":null,"isSystem":true},{"id":943,"listId":19,"projectId":null,"value":"Louvers, Vents and Screens 10200","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":180,"listValues":null,"isSystem":true},{"id":944,"listId":19,"projectId":null,"value":"Wall and Corner Guards 10260","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":181,"listValues":null,"isSystem":true},{"id":945,"listId":19,"projectId":null,"value":"Access Flooring 10270","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":182,"listValues":null,"isSystem":true},{"id":946,"listId":19,"projectId":null,"value":"Specialty Modules 10280","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":183,"listValues":null,"isSystem":true},{"id":947,"listId":19,"projectId":null,"value":"Fireplaces and Stoves 10300","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":184,"listValues":null,"isSystem":true},{"id":948,"listId":19,"projectId":null,"value":"Prefabricated Exterior Specialties 10340","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":185,"listValues":null,"isSystem":true},{"id":949,"listId":19,"projectId":null,"value":"Flagpoles 10350","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":186,"listValues":null,"isSystem":true},{"id":950,"listId":19,"projectId":null,"value":"Identifying Devices 10400","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":187,"listValues":null,"isSystem":true},{"id":951,"listId":19,"projectId":null,"value":"Pedestrian Control Devices 10450","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":188,"listValues":null,"isSystem":true},{"id":952,"listId":19,"projectId":null,"value":"Lockers 10500","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":189,"listValues":null,"isSystem":true},{"id":953,"listId":19,"projectId":null,"value":"Fire Protection Specialties 10520","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":190,"listValues":null,"isSystem":true},{"id":954,"listId":19,"projectId":null,"value":"Protective Covers 10530","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":191,"listValues":null,"isSystem":true},{"id":955,"listId":19,"projectId":null,"value":"Postal Specialties 10550","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":192,"listValues":null,"isSystem":true},{"id":956,"listId":19,"projectId":null,"value":"Partitions 10600","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":193,"listValues":null,"isSystem":true},{"id":957,"listId":19,"projectId":null,"value":"Operable Partitions 10650","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":194,"listValues":null,"isSystem":true},{"id":958,"listId":19,"projectId":null,"value":"Storage Shelving 10670","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":195,"listValues":null,"isSystem":true},{"id":959,"listId":19,"projectId":null,"value":"Exterior Sun Control Devices 10700","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":196,"listValues":null,"isSystem":true},{"id":960,"listId":19,"projectId":null,"value":"Telephone Specialties 10750","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":197,"listValues":null,"isSystem":true},{"id":961,"listId":19,"projectId":null,"value":"Toilet and Bath Accessories 10800","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":198,"listValues":null,"isSystem":true},{"id":962,"listId":19,"projectId":null,"value":"Scales 10880","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":199,"listValues":null,"isSystem":true},{"id":963,"listId":19,"projectId":null,"value":"Wardrobe and Closet Specialties 10900","description":null,"keyValue":"10 - Specialties","keyValueItemId":756,"displayOrder":200,"listValues":null,"isSystem":true},{"id":964,"listId":19,"projectId":null,"value":"Maintenance Equipment 11010","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":201,"listValues":null,"isSystem":true},{"id":965,"listId":19,"projectId":null,"value":"Bank, Security and Vault Equipment 11020","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":202,"listValues":null,"isSystem":true},{"id":966,"listId":19,"projectId":null,"value":"Ecclesiastical Equipment 11040","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":203,"listValues":null,"isSystem":true},{"id":967,"listId":19,"projectId":null,"value":"Library Equipment 11050","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":204,"listValues":null,"isSystem":true},{"id":968,"listId":19,"projectId":null,"value":"Theater and Stage Equipment 11060","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":205,"listValues":null,"isSystem":true},{"id":969,"listId":19,"projectId":null,"value":"Instrumental Equipment 11070","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":206,"listValues":null,"isSystem":true},{"id":970,"listId":19,"projectId":null,"value":"Mercantile Equipment 11100","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":207,"listValues":null,"isSystem":true},{"id":971,"listId":19,"projectId":null,"value":"Commercial Laundry and Dry Cleaning Equipment 11110","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":208,"listValues":null,"isSystem":true},{"id":972,"listId":19,"projectId":null,"value":"Vending Equipment 11120","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":209,"listValues":null,"isSystem":true},{"id":973,"listId":19,"projectId":null,"value":"Audio Visual Equipment 11130","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":210,"listValues":null,"isSystem":true},{"id":974,"listId":19,"projectId":null,"value":"Service Station Equipment 11140","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":211,"listValues":null,"isSystem":true},{"id":975,"listId":19,"projectId":null,"value":"Air Compressor 11145","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":212,"listValues":null,"isSystem":true},{"id":976,"listId":19,"projectId":null,"value":"Parking Control Equipment 11150","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":213,"listValues":null,"isSystem":true},{"id":977,"listId":19,"projectId":null,"value":"Loading Dock Equipment 11160","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":214,"listValues":null,"isSystem":true},{"id":978,"listId":19,"projectId":null,"value":"Solid Waste Handling Equipment 11170","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":215,"listValues":null,"isSystem":true},{"id":979,"listId":19,"projectId":null,"value":"Detention Equipment 11190","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":216,"listValues":null,"isSystem":true},{"id":980,"listId":19,"projectId":null,"value":"Water Supply and Treatment Equipment 11200","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":217,"listValues":null,"isSystem":true},{"id":981,"listId":19,"projectId":null,"value":"Dam, Hydroelectric, and Irrigation Project 11280","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":218,"listValues":null,"isSystem":true},{"id":982,"listId":19,"projectId":null,"value":"Fluid Waste Treatment and Disposal Equipment 11300","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":219,"listValues":null,"isSystem":true},{"id":983,"listId":19,"projectId":null,"value":"Food Service Equipment 11400","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":220,"listValues":null,"isSystem":true},{"id":984,"listId":19,"projectId":null,"value":"Residential Equipment 11450","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":221,"listValues":null,"isSystem":true},{"id":985,"listId":19,"projectId":null,"value":"Unit Kitchens 11460","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":222,"listValues":null,"isSystem":true},{"id":986,"listId":19,"projectId":null,"value":"Darkroom Equipment 11470","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":223,"listValues":null,"isSystem":true},{"id":987,"listId":19,"projectId":null,"value":"Athletic, Recreational and Therapeutic Equipment 11480","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":224,"listValues":null,"isSystem":true},{"id":988,"listId":19,"projectId":null,"value":"Industrial and Process Equipment 11500","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":225,"listValues":null,"isSystem":true},{"id":989,"listId":19,"projectId":null,"value":"Laboratory Equipment 11600","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":226,"listValues":null,"isSystem":true},{"id":990,"listId":19,"projectId":null,"value":"Planetarium and Observatory Equipment 11660","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":227,"listValues":null,"isSystem":true},{"id":991,"listId":19,"projectId":null,"value":"Medical Equipment 11700","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":228,"listValues":null,"isSystem":true},{"id":992,"listId":19,"projectId":null,"value":"Mortuary Equipment 11780","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":229,"listValues":null,"isSystem":true},{"id":993,"listId":19,"projectId":null,"value":"Navigation Equipment 11850","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":230,"listValues":null,"isSystem":true},{"id":994,"listId":19,"projectId":null,"value":"Miscellaneous Specialty Equipment 11900 ","description":null,"keyValue":"11 - Equipment","keyValueItemId":708,"displayOrder":231,"listValues":null,"isSystem":true},{"id":995,"listId":19,"projectId":null,"value":"Artwork 12100","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":232,"listValues":null,"isSystem":true},{"id":996,"listId":19,"projectId":null,"value":"Manufactured Casework 12300","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":233,"listValues":null,"isSystem":true},{"id":997,"listId":19,"projectId":null,"value":"Medical Casework 12335","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":234,"listValues":null,"isSystem":true},{"id":998,"listId":19,"projectId":null,"value":"Residential Casework 12390","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":235,"listValues":null,"isSystem":true},{"id":999,"listId":19,"projectId":null,"value":"Window Treatment 12500","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":236,"listValues":null,"isSystem":true},{"id":1000,"listId":19,"projectId":null,"value":"Landscape Partitions and Components 12610","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":237,"listValues":null,"isSystem":true},{"id":1001,"listId":19,"projectId":null,"value":"Furniture, Furniture Systems, and Furniture 12620","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":238,"listValues":null,"isSystem":true},{"id":1002,"listId":19,"projectId":null,"value":"Rugs and Mats 12670","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":239,"listValues":null,"isSystem":true},{"id":1003,"listId":19,"projectId":null,"value":"Multiple Seating 12700","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":240,"listValues":null,"isSystem":true},{"id":1004,"listId":19,"projectId":null,"value":"Systems Furniture 12750","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":241,"listValues":null,"isSystem":true},{"id":1005,"listId":19,"projectId":null,"value":"Interior Plants and Planters 12800 ","description":null,"keyValue":"12 - Furnishings","keyValueItemId":758,"displayOrder":242,"listValues":null,"isSystem":true},{"id":1006,"listId":19,"projectId":null,"value":"Air Supported Structures 13010","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":243,"listValues":null,"isSystem":true},{"id":1007,"listId":19,"projectId":null,"value":"Integrated Assemblies 13020","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":244,"listValues":null,"isSystem":true},{"id":1008,"listId":19,"projectId":null,"value":"Special Purpose Rooms 13030","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":245,"listValues":null,"isSystem":true},{"id":1009,"listId":19,"projectId":null,"value":"Sound, Vibration, and Seismic Control 13080","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":246,"listValues":null,"isSystem":true},{"id":1010,"listId":19,"projectId":null,"value":"Radiation Protection 13090","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":247,"listValues":null,"isSystem":true},{"id":1011,"listId":19,"projectId":null,"value":"Nuclear Reactors 13100","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":248,"listValues":null,"isSystem":true},{"id":1012,"listId":19,"projectId":null,"value":"Pre Engineered Structures 13120","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":249,"listValues":null,"isSystem":true},{"id":1013,"listId":19,"projectId":null,"value":"Pools 13150","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":250,"listValues":null,"isSystem":true},{"id":1014,"listId":19,"projectId":null,"value":"Ice Rinks 13160","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":251,"listValues":null,"isSystem":true},{"id":1015,"listId":19,"projectId":null,"value":"Kennels and Animal Shelters 13170","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":252,"listValues":null,"isSystem":true},{"id":1016,"listId":19,"projectId":null,"value":"Site Constructed Incinerators 13180","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":253,"listValues":null,"isSystem":true},{"id":1017,"listId":19,"projectId":null,"value":"Liquid and Gas Storage Tanks 13200","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":254,"listValues":null,"isSystem":true},{"id":1018,"listId":19,"projectId":null,"value":"Digestion Tank Covers and Appurtenances 13230","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":255,"listValues":null,"isSystem":true},{"id":1019,"listId":19,"projectId":null,"value":"Oxygenation Systems 13240","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":256,"listValues":null,"isSystem":true},{"id":1020,"listId":19,"projectId":null,"value":"Sludge Conditioning Systems 13260","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":257,"listValues":null,"isSystem":true},{"id":1021,"listId":19,"projectId":null,"value":"Utility Control Systems 13300","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":258,"listValues":null,"isSystem":true},{"id":1022,"listId":19,"projectId":null,"value":"Industrial and Process Control Systems 13400","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":259,"listValues":null,"isSystem":true},{"id":1023,"listId":19,"projectId":null,"value":"Recording Instrumentation 13500","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":260,"listValues":null,"isSystem":true},{"id":1024,"listId":19,"projectId":null,"value":"Transportation Control Instrumentation 13550","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":261,"listValues":null,"isSystem":true},{"id":1025,"listId":19,"projectId":null,"value":"Solar Energy Systems 13600","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":262,"listValues":null,"isSystem":true},{"id":1026,"listId":19,"projectId":null,"value":"Wind Energy Systems 13700","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":263,"listValues":null,"isSystem":true},{"id":1027,"listId":19,"projectId":null,"value":"Building Automation Systems 13800","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":264,"listValues":null,"isSystem":true},{"id":1028,"listId":19,"projectId":null,"value":"Fire Suppression and Supervisory Systems 13900 ","description":null,"keyValue":"13 - Special Construction","keyValueItemId":710,"displayOrder":265,"listValues":null,"isSystem":true},{"id":1029,"listId":19,"projectId":null,"value":"Dumbwaiters 14100","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":266,"listValues":null,"isSystem":true},{"id":1030,"listId":19,"projectId":null,"value":"Elevators 14200","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":267,"listValues":null,"isSystem":true},{"id":1031,"listId":19,"projectId":null,"value":"Moving Stairs and Walks 14300","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":268,"listValues":null,"isSystem":true},{"id":1032,"listId":19,"projectId":null,"value":"Lifts 14400","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":269,"listValues":null,"isSystem":true},{"id":1033,"listId":19,"projectId":null,"value":"Vehicle Lifts 14450","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":270,"listValues":null,"isSystem":true},{"id":1034,"listId":19,"projectId":null,"value":"Material Handling Systems 14500","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":271,"listValues":null,"isSystem":true},{"id":1035,"listId":19,"projectId":null,"value":"Chutes 14560","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":272,"listValues":null,"isSystem":true},{"id":1036,"listId":19,"projectId":null,"value":"Tube Systems 14580","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":273,"listValues":null,"isSystem":true},{"id":1037,"listId":19,"projectId":null,"value":"Hoists and Cranes 14600","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":274,"listValues":null,"isSystem":true},{"id":1038,"listId":19,"projectId":null,"value":"Turntables 14700","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":275,"listValues":null,"isSystem":true},{"id":1039,"listId":19,"projectId":null,"value":"Scaffolding 14800","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":276,"listValues":null,"isSystem":true},{"id":1040,"listId":19,"projectId":null,"value":"Transportation Systems 14900 ","description":null,"keyValue":"14 - Conveying Systems","keyValueItemId":760,"displayOrder":277,"listValues":null,"isSystem":true},{"id":1041,"listId":19,"projectId":null,"value":"Basic Mechanical Materials And Methods 15050","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":278,"listValues":null,"isSystem":true},{"id":1042,"listId":19,"projectId":null,"value":"Industrial Process Piping 15230","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":279,"listValues":null,"isSystem":true},{"id":1043,"listId":19,"projectId":null,"value":"Mechanical Insulation 15250","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":280,"listValues":null,"isSystem":true},{"id":1044,"listId":19,"projectId":null,"value":"Fire Protection 15300","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":281,"listValues":null,"isSystem":true},{"id":1045,"listId":19,"projectId":null,"value":"Plumbing 15400","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":282,"listValues":null,"isSystem":true},{"id":1046,"listId":19,"projectId":null,"value":"Heating, Ventilating, and Air Conditioning (HVAC) 15500","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":283,"listValues":null,"isSystem":true},{"id":1047,"listId":19,"projectId":null,"value":"Heating Boilers And Accessories 15510","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":284,"listValues":null,"isSystem":true},{"id":1048,"listId":19,"projectId":null,"value":"Process Piping & Equipment 15800","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":285,"listValues":null,"isSystem":true},{"id":1049,"listId":19,"projectId":null,"value":"Controls 15950","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":286,"listValues":null,"isSystem":true},{"id":1050,"listId":19,"projectId":null,"value":"Testing, Adjusting, and Balancing 15990 ","description":null,"keyValue":"15 - Mechanical/Plumbing","keyValueItemId":761,"displayOrder":287,"listValues":null,"isSystem":true},{"id":1051,"listId":19,"projectId":null,"value":"Basic Electrical Materials And Methods 16050","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":288,"listValues":null,"isSystem":true},{"id":1052,"listId":19,"projectId":null,"value":"Electrical Contractor 16100","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":289,"listValues":null,"isSystem":true},{"id":1053,"listId":19,"projectId":null,"value":"Site Electrical Distribution 16300","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":290,"listValues":null,"isSystem":true},{"id":1054,"listId":19,"projectId":null,"value":"High Voltage Distribution, Switching and Protection 16320","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":291,"listValues":null,"isSystem":true},{"id":1055,"listId":19,"projectId":null,"value":"Industrial Electrical Work 16400","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":292,"listValues":null,"isSystem":true},{"id":1056,"listId":19,"projectId":null,"value":"Lightning Protection Systems 16670","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":293,"listValues":null,"isSystem":true},{"id":1057,"listId":19,"projectId":null,"value":"Communications 16700","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":294,"listValues":null,"isSystem":true},{"id":1058,"listId":19,"projectId":null,"value":"Alarm Systems 16750","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":295,"listValues":null,"isSystem":true},{"id":1059,"listId":19,"projectId":null,"value":"Fiber Optic Cabling 16800","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":296,"listValues":null,"isSystem":true},{"id":1060,"listId":19,"projectId":null,"value":"Controls 16900","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":297,"listValues":null,"isSystem":true},{"id":1061,"listId":19,"projectId":null,"value":"Testing 16950 ","description":null,"keyValue":"16 - Electrical","keyValueItemId":762,"displayOrder":298,"listValues":null,"isSystem":true},{"id":1062,"listId":19,"projectId":null,"value":"Construction Reports 201000","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":299,"listValues":null,"isSystem":true},{"id":1063,"listId":19,"projectId":null,"value":"Construction Employment Firm 201100","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":300,"listValues":null,"isSystem":true},{"id":1064,"listId":19,"projectId":null,"value":"Advertising 201200","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":301,"listValues":null,"isSystem":true},{"id":1065,"listId":19,"projectId":null,"value":"Internet Services 201300","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":302,"listValues":null,"isSystem":true},{"id":1066,"listId":19,"projectId":null,"value":"Timberline Software 201400","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":303,"listValues":null,"isSystem":true},{"id":1067,"listId":19,"projectId":null,"value":"Chapter Lobbyist 201500","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":304,"listValues":null,"isSystem":true},{"id":1068,"listId":19,"projectId":null,"value":"Environmental Services 201600","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":305,"listValues":null,"isSystem":true},{"id":1069,"listId":19,"projectId":null,"value":"Labor Staffing Services 201800","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":306,"listValues":null,"isSystem":true},{"id":1070,"listId":19,"projectId":null,"value":"Arborist 202010","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":307,"listValues":null,"isSystem":true},{"id":1071,"listId":19,"projectId":null,"value":"Dumpster Service/Rolloff/Transfer Station 20202020","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":308,"listValues":null,"isSystem":true},{"id":1072,"listId":19,"projectId":null,"value":"Employee Benefits 20202030","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":309,"listValues":null,"isSystem":true},{"id":1073,"listId":19,"projectId":null,"value":"Financial Planning 20202040","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":310,"listValues":null,"isSystem":true},{"id":1074,"listId":19,"projectId":null,"value":"Prevailing Wage Benefit Plans 20202050","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":311,"listValues":null,"isSystem":true},{"id":1075,"listId":19,"projectId":null,"value":"Printing & Reproduction 20202060","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":312,"listValues":null,"isSystem":true},{"id":1076,"listId":19,"projectId":null,"value":"Online Planroom 20202070","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":313,"listValues":null,"isSystem":true},{"id":1077,"listId":19,"projectId":null,"value":"Automotive Dealership 20202080","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":314,"listValues":null,"isSystem":true},{"id":1078,"listId":19,"projectId":null,"value":"Safety Services 20202090","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":315,"listValues":null,"isSystem":true},{"id":1079,"listId":19,"projectId":null,"value":"Cement Based Underlayment 203450","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":316,"listValues":null,"isSystem":true},{"id":1080,"listId":19,"projectId":null,"value":"Accounting 20100","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":317,"listValues":null,"isSystem":true},{"id":1081,"listId":19,"projectId":null,"value":"Consulting 20200","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":318,"listValues":null,"isSystem":true},{"id":1082,"listId":19,"projectId":null,"value":"Attorney 20300","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":319,"listValues":null,"isSystem":true},{"id":1083,"listId":19,"projectId":null,"value":"Developer 20400","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":320,"listValues":null,"isSystem":true},{"id":1084,"listId":19,"projectId":null,"value":"Engineer 20500","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":321,"listValues":null,"isSystem":true},{"id":1085,"listId":19,"projectId":null,"value":"Architect 20600","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":322,"listValues":null,"isSystem":true},{"id":1086,"listId":19,"projectId":null,"value":"Business Services 20700","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":323,"listValues":null,"isSystem":true},{"id":1087,"listId":19,"projectId":null,"value":"Insurance 20800","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":324,"listValues":null,"isSystem":true},{"id":1088,"listId":19,"projectId":null,"value":"Bonding 20805","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":325,"listValues":null,"isSystem":true},{"id":1089,"listId":19,"projectId":null,"value":"Banking 20810","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":326,"listValues":null,"isSystem":true},{"id":1090,"listId":19,"projectId":null,"value":"Supplier 20900","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":327,"listValues":null,"isSystem":true},{"id":1091,"listId":19,"projectId":null,"value":"Signs 20202100 ","description":null,"keyValue":"20 - ABC Miscellaneous","keyValueItemId":763,"displayOrder":328,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false}],"isSystem":true},{"id":16,"name":"Cost Type","relatedTo":null,"relatedToText":"","allowProjectOverride":false,"projectId":null,"listValues":[{"id":676,"listId":16,"projectId":null,"value":"None - None","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":677,"listId":16,"projectId":null,"value":"E - Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":678,"listId":16,"projectId":null,"value":"L - Labor","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":679,"listId":16,"projectId":null,"value":"M - Materials","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":680,"listId":16,"projectId":null,"value":"OC - Owner Cost","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":681,"listId":16,"projectId":null,"value":"S - Commitment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":682,"listId":16,"projectId":null,"value":"SVC - Professional Services","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true},{"id":683,"listId":16,"projectId":null,"value":"O - Others","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":8,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":true},{"id":44,"name":"Countries","relatedTo":43,"relatedToText":"Continents","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false},{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":false},{"id":46,"name":"Country","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":2,"name":"Budget Top Segment","projectId":null,"isSystem":false}],"isSystem":false},{"id":12,"name":"Currency","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":false},{"id":20,"name":"Diverse Supplier Categories","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":1092,"listId":20,"projectId":null,"value":"Minority-owned business","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1093,"listId":20,"projectId":null,"value":"Women-owned business","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":1094,"listId":20,"projectId":null,"value":"LGBT-owned business","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":1095,"listId":20,"projectId":null,"value":"Disabled-owned business","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":1096,"listId":20,"projectId":null,"value":"Veteran-owned business","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":1097,"listId":20,"projectId":null,"value":"Service-disabled veteran-owned business","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":1098,"listId":20,"projectId":null,"value":"Historically underutilized business zones (HUBZone)","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true},{"id":1099,"listId":20,"projectId":null,"value":"Small business enterprises","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":8,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":null,"isSystem":true},{"id":7,"name":"Equipment Being Used","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false},{"id":9,"name":"O&M","projectId":null,"isSystem":false}],"isSystem":false},{"id":6,"name":"Gender","relatedTo":5,"relatedToText":"Injured Category","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false}],"isSystem":false},{"id":5,"name":"Injured Category","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":2,"name":"Issues Categories","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":653,"listId":2,"projectId":null,"value":"Inaccurate Planning","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":654,"listId":2,"projectId":null,"value":"Prerequisite work","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":655,"listId":2,"projectId":null,"value":"Owner Changes","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":656,"listId":2,"projectId":null,"value":"Design matter","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":657,"listId":2,"projectId":null,"value":"Failed Inspection or No inspection","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":658,"listId":2,"projectId":null,"value":"Labor not available","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":659,"listId":2,"projectId":null,"value":"Material not available","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true},{"id":660,"listId":2,"projectId":null,"value":"Equipment not available","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":8,"listValues":null,"isSystem":true},{"id":661,"listId":2,"projectId":null,"value":"Contracts","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":9,"listValues":null,"isSystem":true},{"id":662,"listId":2,"projectId":null,"value":"Change order (C/O)","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":10,"listValues":null,"isSystem":true},{"id":663,"listId":2,"projectId":null,"value":"Request for information (RFI)","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":11,"listValues":null,"isSystem":true},{"id":664,"listId":2,"projectId":null,"value":"Submittals","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":12,"listValues":null,"isSystem":true},{"id":665,"listId":2,"projectId":null,"value":"Weather","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":13,"listValues":null,"isSystem":true},{"id":666,"listId":2,"projectId":null,"value":"I forgot","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":14,"listValues":null,"isSystem":true},{"id":667,"listId":2,"projectId":null,"value":"Unforeseen conditions","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":15,"listValues":null,"isSystem":true},{"id":668,"listId":2,"projectId":null,"value":"Value engineering delay","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":16,"listValues":null,"isSystem":true},{"id":669,"listId":2,"projectId":null,"value":"Longer than anticipated","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":17,"listValues":null,"isSystem":true},{"id":670,"listId":2,"projectId":null,"value":"No access","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":18,"listValues":null,"isSystem":true},{"id":671,"listId":2,"projectId":null,"value":"Other Priority Work","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":19,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":5,"name":"Planner","projectId":null,"isSystem":false}],"isSystem":true},{"id":39,"name":"Level 1","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":2,"name":"Budget Top Segment","projectId":null,"isSystem":false}],"isSystem":false},{"id":40,"name":"Level 2","relatedTo":39,"relatedToText":"Level 1","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false}],"isSystem":false},{"id":41,"name":"Level 3","relatedTo":40,"relatedToText":"Level 2","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false}],"isSystem":false},{"id":42,"name":"Level 4","relatedTo":41,"relatedToText":"Level 3","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false}],"isSystem":false},{"id":22,"name":"ListToImport","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":8,"name":"sample 2","projectId":null,"isSystem":false}],"isSystem":false},{"id":63,"name":"Material Category","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false},{"id":9,"name":"O&M","projectId":null,"isSystem":false}],"isSystem":false},{"id":61,"name":"Measurement","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false}],"isSystem":false},{"id":31,"name":"Project Phase","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false}],"isSystem":false},{"id":58,"name":"Safety - Accident Mechanism","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":57,"name":"Safety - Accident Report Type","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":56,"name":"Safety - Body Part Injured","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":55,"name":"Safety - Contributing Factor","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":54,"name":"Safety - Gender","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":52,"name":"Safety - Property Damage","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":53,"name":"Safety - Type Of Injury","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":3,"name":"Safety Bulletin","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":672,"listId":3,"projectId":null,"value":"Bad Weather","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1528,"listId":3,"projectId":null,"value":"Air Quality Alert","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":673,"listId":3,"projectId":null,"value":"Evacuation","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":674,"listId":3,"projectId":null,"value":"Flooding","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":675,"listId":3,"projectId":null,"value":"Gas Leak","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":true},{"id":27,"name":"Safety Violation Category","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":1144,"listId":27,"projectId":null,"value":"Critical","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1145,"listId":27,"projectId":null,"value":"Fatality","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":1146,"listId":27,"projectId":null,"value":"Marginal","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":1147,"listId":27,"projectId":null,"value":"Near-miss","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":true},{"id":28,"name":"Safety Violation Type","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":1148,"listId":28,"projectId":null,"value":"Behavior","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1149,"listId":28,"projectId":null,"value":"Equipment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":1150,"listId":28,"projectId":null,"value":"No PPE","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":1151,"listId":28,"projectId":null,"value":"Harassment","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":1152,"listId":28,"projectId":null,"value":"Violent","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":1153,"listId":28,"projectId":null,"value":"Not Following Safety Protocols","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":true},{"id":45,"name":"States","relatedTo":44,"relatedToText":"Countries","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":3,"name":"Budget Cost Code","projectId":null,"isSystem":false},{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":false},{"id":13,"name":"Submittal Type","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":1,"name":"App Lookup","projectId":null,"isSystem":false}],"isSystem":false},{"id":29,"name":"System Breakdown Structure Categories (SBS)","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":1154,"listId":29,"projectId":null,"value":"Excavation","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1155,"listId":29,"projectId":null,"value":"Exterior Walls & Doors","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":1156,"listId":29,"projectId":null,"value":"Foundation","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":1157,"listId":29,"projectId":null,"value":"Gas","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":1158,"listId":29,"projectId":null,"value":"Plumbing","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":1159,"listId":29,"projectId":null,"value":"Structural","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":1160,"listId":29,"projectId":null,"value":"Utilities & Systems","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":5,"name":"Planner","projectId":null,"isSystem":false}],"isSystem":true},{"id":23,"name":"Test Finance List","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":4,"name":"Finance","projectId":null,"isSystem":false},{"id":10,"name":"new category","projectId":null,"isSystem":false}],"isSystem":false},{"id":60,"name":"Time Log Activities","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":11,"name":"Time Log Activities","projectId":null,"isSystem":false}],"isSystem":false},{"id":4,"name":"Type Of Injury","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":6,"name":"Safety","projectId":null,"isSystem":false}],"isSystem":false},{"id":17,"name":"Unit of Measure - Quantity","relatedTo":null,"relatedToText":"","allowProjectOverride":false,"projectId":null,"listValues":[{"id":684,"listId":17,"projectId":null,"value":"ea","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":685,"listId":17,"projectId":null,"value":"ls","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":686,"listId":17,"projectId":null,"value":"lf","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":687,"listId":17,"projectId":null,"value":"m","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":688,"listId":17,"projectId":null,"value":"mm","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":689,"listId":17,"projectId":null,"value":"m2","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":690,"listId":17,"projectId":null,"value":"m3","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true},{"id":691,"listId":17,"projectId":null,"value":"cc","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":8,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":true},{"id":18,"name":"Unit of Measure - Time","relatedTo":null,"relatedToText":"","allowProjectOverride":false,"projectId":null,"listValues":[{"id":692,"listId":18,"projectId":null,"value":"Hours","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":693,"listId":18,"projectId":null,"value":"Days","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":694,"listId":18,"projectId":null,"value":"Months","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":695,"listId":18,"projectId":null,"value":"Weeks","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":696,"listId":18,"projectId":null,"value":"Years","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":[{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":true},{"id":62,"name":"Unit of Measurement","relatedTo":61,"relatedToText":"Measurement","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":4,"name":"Finance","projectId":null,"isSystem":false}],"isSystem":false},{"id":25,"name":"Wall Materials","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":[{"id":1122,"listId":25,"projectId":null,"value":"Wood stud layer","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":1,"listValues":null,"isSystem":true},{"id":1123,"listId":25,"projectId":null,"value":"Metal stud layer","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":2,"listValues":null,"isSystem":true},{"id":1124,"listId":25,"projectId":null,"value":"Concrete block","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":3,"listValues":null,"isSystem":true},{"id":1125,"listId":25,"projectId":null,"value":"Concrete","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":4,"listValues":null,"isSystem":true},{"id":1126,"listId":25,"projectId":null,"value":"Drywall","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":5,"listValues":null,"isSystem":true},{"id":1127,"listId":25,"projectId":null,"value":"Stucco","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":6,"listValues":null,"isSystem":true},{"id":1128,"listId":25,"projectId":null,"value":"Tile","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":7,"listValues":null,"isSystem":true},{"id":1129,"listId":25,"projectId":null,"value":"Plywood","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":8,"listValues":null,"isSystem":true},{"id":1130,"listId":25,"projectId":null,"value":"Melamine","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":9,"listValues":null,"isSystem":true},{"id":1131,"listId":25,"projectId":null,"value":"Gypsum wallboard","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":10,"listValues":null,"isSystem":true},{"id":1132,"listId":25,"projectId":null,"value":"Plaster","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":11,"listValues":null,"isSystem":true},{"id":1133,"listId":25,"projectId":null,"value":"Brick","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":12,"listValues":null,"isSystem":true},{"id":1134,"listId":25,"projectId":null,"value":"Paint","description":null,"keyValue":null,"keyValueItemId":null,"displayOrder":13,"listValues":null,"isSystem":true}],"isImportedFromOrg":false,"listCategories":null,"isSystem":true},{"id":26,"name":"Worker In - Reason for denial","relatedTo":null,"relatedToText":"","allowProjectOverride":true,"projectId":null,"listValues":null,"isImportedFromOrg":false,"listCategories":[{"id":7,"name":"Time & Attendance","projectId":null,"isSystem":false}],"isSystem":false}],"message":""}