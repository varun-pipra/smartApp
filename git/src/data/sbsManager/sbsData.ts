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
      id: 1,
      uniqueid: "13512d23-8697-49b0-902f-ec539e348307",
      displayId: "SBS0001",
      name: "SS4",
      startDate: "2023-12-03T00:00:00",
      endDate: "2023-12-05T00:00:00",
      description: "ss4",
      category: {
        id: 12,
        name: "Electrical",
      },
      phase: [{
        id: 14,
        name: "Pre Construction",
        color: "#81c3dc",
        uniqueId: null,
      }],
      trades: [
        {
          "objectId": 1,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "d02338c7-456b-4abf-adee-7ce609460bcd",
          "name": "Architectural",
          "description": "Architectural",
          "color": "#2E7D32",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },{
        "objectId": 2,
        "status": 1,
        "isPrimary": false,
        "companyId": null,
        "uniqueId": "b931157f-208f-4afd-8876-b227b6dde462",
        "name": "Audio / Video",
        "description": "Audio / Video",
        "color": "#880E4F",
        "isDrawingDiscipline": false,
        "isImportedFromOrg": false
    },  {
      "objectId": 3,
      "status": 1,
      "isPrimary": false,
      "companyId": null,
      "uniqueId": "c18a9f54-abb7-4b06-9535-4d0d71ab5552",
      "name": "Carpentry",
      "description": "Carpentry",
      "color": "#51927E",
      "isDrawingDiscipline": false,
      "isImportedFromOrg": false
  },
      ],
      configureSupplementalInfo: true,
      supplementalInfoAppId: "ad97b41b-afda-4175-810c-e4cdee2d5dac",
      status: 0,
      "sbsNameFieldId": "fld0b2dfc09",

    },
    {
      id: 4,
      uniqueid: "2a9a3de8-6a2e-4f65-a856-3326f1c4bbde",
      displayId: "SBS0004",
      name: "SS2",
      startDate: "2023-12-03T00:00:00",
      endDate: "2023-12-05T00:00:00",
      description: "ss2",
      category: {
        id: 11,
        name: "Stucatural",
      },
      phase: [{
        id: 12,
        name: "In Construction",
        color: "#d6a827",
        uniqueId: null,
      }],
      trades: [
        {
          "objectId": 4,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "8ea457b3-b3d9-4ec1-9095-f5d0473094a7",
          "name": "Ceiling",
          "description": "Ceiling",
          "color": "#745125",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 5,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "47faf423-7f42-48e6-bd57-9ab8b9651dbc",
          "name": "Ceramic Tile",
          "description": "Ceramic Tile",
          "color": "#507E65",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      },
      {
          "objectId": 6,
          "status": 1,
          "isPrimary": false,
          "companyId": null,
          "uniqueId": "774f59dc-f28e-4048-bc85-31ccb2ae2be6",
          "name": "Civil",
          "description": "Civil",
          "color": "#C7F4E9",
          "isDrawingDiscipline": false,
          "isImportedFromOrg": false
      }
      ],
      configureSupplementalInfo: false,
      status: 0,
      "sbsNameFieldId": "fld0b2dfc09",
      
    },
    {
      id: 5,
      uniqueid: "2d376e6d-ac69-479b-9c47-f0b22159ca98",
      displayId: "SBS0005",
      name: "SS3",
      startDate: "2023-12-03T00:00:00",
      endDate: "2023-12-05T00:00:00",
      description: "ss3",
      category: {
        id: 12,
        name: "Utillites",
      },
      phase: [{
        id: 14,
        name: "Post Construction",
        color: "#fd8d27",
        uniqueId: null,
      }],
      trades: [{
        "objectId": 7,
        "status": 1,
        "isPrimary": false,
        "companyId": null,
        "uniqueId": "8c077a6f-fb85-41d3-a12c-0d9a8aaa908d",
        "name": "Cleaning",
        "description": "Cleaning",
        "color": "#F40C53",
        "isDrawingDiscipline": false,
        "isImportedFromOrg": false
    },
    {
      "id": 14,
      "uniqueid": "84cdf129-6b47-4689-a874-9da67ba7defb",
      "displayId": "SBS0014",
      "name": "FinanceBid",
      "startDate": "2023-11-21T00:00:00",
      "endDate": "2023-11-29T00:00:00",
      "description": "Photosdesk",
      "category": {
          "id": 1155,
          "name": "Exterior Walls & Doors"
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
              "name": "Audio / Video"
          },
          {
              "id": 70,
              "name": "aDD "
          }
      ],
      "configureSupplementalInfo": false,
      "supplementalInfoAppId": 0,
      "status": 0,
      "additionalInfo": [
          {
              "id": null,
              "sbsId": 14,
              "name": null,
              "appId": null,
              "appName": null,
              "icon": null
          }
      ],
      "sbsNameFieldId": "fld0b2dfc09",
      "categoryFieldId": null,
      "phaseFieldId": null,
      "tradeFieldId": null,
      "estStartDateFieldId": null,
      "estEndDateFieldId": null,
      "createdBy": {
          "id": 534917,
          "name": ""
      },
      "createdDate": "2023-11-20T07:11:37.83",
      "modifiedBy": {
          "id": 534917,
          "name": "MK, Sudeep"
      },
      "modifiedDate": null,
      "referencefiles": [],
      "links": []
  },
    {
        "objectId": 8,
        "status": 1,
        "isPrimary": false,
        "companyId": null,
        "uniqueId": "4537fb2c-77f6-4c18-a202-2150f09502d2",
        "name": "Concrete",
        "description": "Concrete",
        "color": "#7DBEB5B8",
        "isDrawingDiscipline": false,
        "isImportedFromOrg": false
    },
    {
        "objectId": 9,
        "status": 1,
        "isPrimary": false,
        "companyId": null,
        "uniqueId": "a33b32e5-1df1-4422-a05e-05a277e37973",
        "name": "Concrete Restoration",
        "description": "Concrete Restoration",
        "color": "#25A375",
        "isDrawingDiscipline": false,
        "isImportedFromOrg": false
    }],
      configureSupplementalInfo: false,
      status: 0,
    },
    {
      id: 6,
      uniqueid: "8583bf33-6861-44cb-93b7-3f66d874b99e",
      displayId: "SBS0006",
      name: "SS4",
      startDate: "2023-12-03T00:00:00",
      endDate: "2023-12-05T00:00:00",
      description: "ss4",
      category: {
        id: 12,
        name: "Stucatural",
      },
      phase: [{
        id: 14,
        name: "Operations and Maintenance",
        "color": "#b88fc6",
        uniqueId: null,
      }],
      trades: [],
      configureSupplementalInfo: false,
      status: 0,
    },
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
    "referencefiles": [],
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
  "referencefiles": [],
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