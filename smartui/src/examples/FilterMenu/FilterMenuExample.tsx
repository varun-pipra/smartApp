import React, { useState } from "react";
import SUIFilterInfiniteMenu from "sui-components/FilterInfiniteMenu/SUIFilterInfiniteMenu";
import { MenuItem, Button, ListSubheader } from "@mui/material";
const FilterMenuExample = (props: any) => {
	const [toggleDropDown, setToggleDropDown] = useState<any>(false);
	const [filterIconPos, setFilterIconPos] = useState<any>({clientX: 0, clientY: 0});

  const menusData = [
	  {
		"id": 23,
		"value": "16 Division Master Format",
		"relatedTo": null,
		"relatedToText": "",
		"allowProjectOverride": true,
		"projectId": null,
		"children": [
		  {
			"id": 1239,
			"listId": 23,
			"value": "01 - General Requirement",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 1,
			"listValues": null,
			"isSystem": true,
			"children":[
				{
					"id": 12391,
					"listId": 23,
					"value": "test 3rd level",
					"keyValue": null,
					"keyValueItemId": null,
					"displayOrder": 1,
					"listValues": null,
					"isSystem": true
				  },
				  {
					"id": 12402,
					"listId": 23,
					"value": "Test - 3rd level 2",
					"keyValue": null,
					"keyValueItemId": null,
					"displayOrder": 2,
					"listValues": null,
					"isSystem": true
				  }
			]
		  },
		  {
			"id": 1240,
			"listId": 23,
			"value": "02 - Existing Conditions",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1241,
			"listId": 23,
			"value": "03 - Concrete",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 3,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1242,
			"listId": 23,
			"value": "04 - Masonry",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 4,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1243,
			"listId": 23,
			"value": "05 - Metals",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 5,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1244,
			"listId": 23,
			"value": "06 - Wood and Plastics",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 6,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1245,
			"listId": 23,
			"value": "07 - Thermal and Moisture Protection",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 7,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1246,
			"listId": 23,
			"value": "08 - Doors and Windows",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 8,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1247,
			"listId": 23,
			"value": "09 - Finishes",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 9,
			"listValues": null,
			"isSystem": true
		  },
		
		  {
			"id": 43,
			"value": "Deb Cetagory",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": false
	  },
	  {
		"id": 42,
		"value": "52",
		"relatedTo": 7,
		"relatedToText": "Blood Group5",
		"allowProjectOverride": true,
		"projectId": null,
		"children": [
		  {
			"id": 2010,
			"listId": 42,
			"value": "test",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 1,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 2011,
			"listId": 42,
			"value": "test1",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": false
		  }
		],
		"isImportedFromOrg": false,
		"listCategories": null,
		"isSystem": false
	  },
	  {
		"id": 8,
		"value": "Accident Mechanism",
		"relatedTo": 22,
		"relatedToText": "Blood Group",
		"allowProjectOverride": true,
		"projectId": null,
		"children": [
		  {
			"id": 1611,
			"listId": 8,
			"value": "Falling Object",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 9,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1612,
			"listId": 8,
			"value": "Lifting/ Handling",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 10,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1613,
			"listId": 8,
			"value": "Motor Vehicle Accident",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 11,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1614,
			"listId": 8,
			"value": "Reaching for",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 12,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1615,
			"listId": 8,
			"value": "Spill/ Fall at same Elevation",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 13,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1616,
			"listId": 8,
			"value": "Spill",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 14,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1617,
			"listId": 8,
			"value": "Struck Against",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 15,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1618,
			"listId": 8,
			"value": "Struck By",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 16,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1619,
			"listId": 8,
			"value": "Stuck By",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 17,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1620,
			"listId": 8,
			"value": "Violence",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 18,
			"listValues": null,
			"isSystem": false
		  }
		],
		"isImportedFromOrg": false,
		"listCategories": [
		  {
			"id": 1,
			"value": "App Lookup",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": false
	  },
	  {
		"id": 22,
		"value": "Blood Group",
		"relatedTo": 7,
		"relatedToText": "Blood Group5",
		"allowProjectOverride": true,
		"projectId": null,
		"children": [
		  {
			"id": 1594,
			"listId": 22,
			"value": "A+",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 1,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1595,
			"listId": 22,
			"value": "A-",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1596,
			"listId": 22,
			"value": "B+",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 3,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1597,
			"listId": 22,
			"value": "B-",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 4,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1598,
			"listId": 22,
			"value": "O+",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 5,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1599,
			"listId": 22,
			"value": "O-",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 6,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1600,
			"listId": 22,
			"value": "AB+",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 7,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1601,
			"listId": 22,
			"value": "AB-",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 8,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 1602,
			"listId": 22,
			"value": "Custom",
			"keyValue": "Animal",
			"keyValueItemId": 1593,
			"displayOrder": 9,
			"listValues": null,
			"isSystem": false
		  }
		],
		"isImportedFromOrg": false,
		"listCategories": [
		  {
			"id": 1,
			"value": "App Lookup",
			"projectId": null,
			"isSystem": false
		  },
		  {
			"id": 5,
			"value": "Planner",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": false
	  },
	  {
		"id": 7,
		"value": "Blood Group5",
		"relatedTo": 8,
		"relatedToText": "Accident Mechanism",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": null,
		"isImportedFromOrg": false,
		"listCategories": [
		  {
			"id": 3,
			"value": "Budget Cost Code",
			"projectId": null,
			"isSystem": false
		  },
		  {
			"id": 6,
			"value": "Safety",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": false
	  },
	  {
		"id": 6,
		"value": "Body Part Injured",
		"relatedTo": 1,
		"relatedToText": "Type Of Injury",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": null,
		"isImportedFromOrg": false,
		"listCategories": [
		  {
			"id": 6,
			"value": "Safety",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": false
	  },
	  {
		"id": 40,
		"value": "Cities",
		"relatedTo": 39,
		"relatedToText": "Country",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": [
		  {
			"id": 1998,
			"listId": 40,
			"value": "Bangalore",
			"keyValue": "India",
			"keyValueItemId": 1994,
			"displayOrder": 1,
			"children": null,
			"isSystem": false
		  },
		  {
			"id": 1999,
			"listId": 40,
			"value": "Delhi",
			"keyValue": "India",
			"keyValueItemId": 1994,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 2000,
			"listId": 40,
			"value": "Mumbai",
			"keyValue": "India",
			"keyValueItemId": 1994,
			"displayOrder": 3,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 2001,
			"listId": 40,
			"value": "Lahore",
			"keyValue": "Pakistan",
			"keyValueItemId": 1995,
			"displayOrder": 4,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 2002,
			"listId": 40,
			"value": "NY",
			"keyValue": "US",
			"keyValueItemId": 1996,
			"displayOrder": 5,
			"listValues": null,
			"isSystem": false
		  },
		  {
			"id": 2003,
			"listId": 40,
			"value": "Londan",
			"keyValue": "UK",
			"keyValueItemId": 1997,
			"displayOrder": 6,
			"listValues": null,
			"isSystem": false
		  }
		],
		"isImportedFromOrg": false,
		"listCategories": null,
		"isSystem": false
	  },
	  {
		"id": 34,
		"value": "Compliance Categories",
		"relatedTo": null,
		"relatedToText": "",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": [
		  {
			"id": 1971,
			"listId": 34,
			"value": "Certificate Of Insurance",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 1,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1972,
			"listId": 34,
			"value": "Certificate Of Good Standing",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1973,
			"listId": 34,
			"value": "Workmans Comp",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 3,
			"listValues": null,
			"isSystem": true
		  }
		],
		"isImportedFromOrg": false,
		"listCategories": null,
		"isSystem": true
	  },
	  {
		"id": 11,
		"value": "Constraint Categories",
		"relatedTo": null,
		"relatedToText": "",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": [
		  {
			"id": 1139,
			"listId": 11,
			"value": "Tools",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 1,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1140,
			"listId": 11,
			"value": "Information",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 2,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1141,
			"listId": 11,
			"value": "Material",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 3,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1142,
			"listId": 11,
			"value": "Equipment",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 4,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1143,
			"listId": 11,
			"value": "Safety",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 5,
			"listValues": null,
			"isSystem": true
		  },
		  {
			"id": 1144,
			"listId": 11,
			"value": "Space",
			"keyValue": null,
			"keyValueItemId": null,
			"displayOrder": 6,
			"listValues": null,
			"isSystem": true
		  }
		],
		"isImportedFromOrg": false,
		"listCategories": [
		  {
			"id": 5,
			"value": "Planner",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": true
	  },
	  {
		"id": 5,
		"value": "Contributing Factor",
		"relatedTo": 7,
		"children": [],
		"relatedToText": "Blood Group5",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": null,
		"isImportedFromOrg": false,
		"listCategories": [
		  {
			"id": 1,
			"value": "App Lookup",
			"projectId": null,
			"isSystem": false
		  },
		  {
			"id": 3,
			"value": "Budget Cost Code",
			"projectId": null,
			"isSystem": false
		  },
		  {
			"id": 6,
			"value": "Safety",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": false
	  },
	  {
		"id": 31,
		"value": "Copy of Body Part Injured",
		"relatedTo": 22,
		"relatedToText": "Blood Group",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": null,
		"isImportedFromOrg": false,
		"listCategories": null,
		"isSystem": false
	  },
	  {
		"id": 30,
		"value": "Copy of Contributing Factor",
		"relatedTo": 7,
		"relatedToText": "Blood Group5",
		"allowProjectOverride": true,
		"projectId": null,
		"listValues": null,
		"isImportedFromOrg": false,
		"listCategories": [
		  {
			"id": 1,
			"value": "App Lookup",
			"projectId": null,
			"isSystem": false
		  }
		],
		"isSystem": false
	  },
	 
	];
	const onSelectionChange = (data: any)=>{
		// console.log(data);
	};
  return (
    <>
     
      <div  style={{position: 'absolute',top: 50, left: 200}}>
	  <Button
          sx={{
            borderRadius: 50,
            padding: "1px",
            width: "24px",
            minWidth: "24px",
            height:'24px',
            border: '1px solid #0590cd !important',
          }}
          onClick={(e) => { setFilterIconPos(e); setToggleDropDown(!toggleDropDown)}}
        >
          <div className="budget-Filter-blue" ></div>
        </Button>
        <SUIFilterInfiniteMenu
          menusData={menusData}
		  onSelectionChange={onSelectionChange}
		  identifier="id"
		  toggleDropDown={toggleDropDown}
		  filterIconPos={filterIconPos}
        ></SUIFilterInfiniteMenu>
      </div>
      
    </>
  );
};

export default FilterMenuExample;
