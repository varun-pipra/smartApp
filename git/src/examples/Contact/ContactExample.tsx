import SUIBaseDropdownSelector from "sui-components/BaseDropdown/BaseDropdown";
import * as React from "react";

const ContactExample = (props: any) => {
	const value: any = [
	  {
	    id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c52",
	    displayField: "Goldern Jimmy",
	  },
	];

	const placeHolder = "Contact Person's Name";

	const noDataFoundMsg = <div><img src="https://s3.amazonaws.com/smartapp-appzones/8f55be2adf864ace8c8c0243eb53f010/iqadmin/dynamic/2108/zqb2cqap/7.jpg" alt="Avatar" style={{ width: "28px", height: "28px" }} className="base-custom-img"
	/><div>No Contact Exist</div><div>Click on the + add button to add</div><div>this contact to the list</div></div>;

	const dropdownOptions = [
		{
			// color: "210fff",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5",
			displayField: "James Anderson",
			emailId: "James@gmail.com",
			phNo: "1234567890",
			thumbnailUrl:
				"https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/8f55be2adf864ace8c8c0243eb53f010%2Fiqadmin%2Fdynamic%2F2301%2F0rdknwnf%2Felegant-futuristic-3d-logo-mockup_225928-126.jpg?generation=1672831604227808&alt=media",
		},
		{
			// color: "21112f",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c51",
			displayField: "Adam Chirt",
			emailId: "James@gmail.com",
			phNo: "1234567890",
			thumbnailUrl:
				"https://s3.amazonaws.com/smartapp-appzones/8f55be2adf864ace8c8c0243eb53f010/iqadmin/dynamic/2108/zqb2cqap/7.jpg",
		},
		{
			// color: "24442f",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c52",
			emailId: "James@gmail.com",
			phNo: "1234567890",
			displayField: "Goldern Jimmy",
		},
		{
			// color: "123456",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c53",
			displayField: "Grahan Menn",
			emailId: "James@gmail.com",
			phNo: "1234567890",
		},
		{
			// color: "54321",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c54",
			displayField: "Andrew well",
			emailId: "James@gmail.com",
			phNo: "1234567890",
		},
		{
			// color: "21042f",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c55",
			displayField: "Daniel Ken",
			emailId: "James@gmail.com",
			phNo: "1234567890",
		},
		{
			// color: "21042f",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c56",
			displayField: "Steven Son",
			emailId: "James@gmail.com",
			phNo: "1234567890",
		},
		{
			// color: "21042f",
			id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c57",
			displayField: "Smith gold",
			emailId: "James@gmail.com",
			phNo: "1234567890",
		},
	];

	const handleValueChange = (value: any) => {
		console.log('value', value);
	}

	return (
		<>
			<SUIBaseDropdownSelector
				value={value}
				width="300px"
				menuWidth="450px"
				placeHolder={placeHolder}
				dropdownOptions={dropdownOptions}
				noDataFoundMsg={noDataFoundMsg}
				showSearchInSearchbar={true}
				showFilterInSearch={false}
				handleValueChange={handleValueChange}
			></SUIBaseDropdownSelector>
		</>
	);
};

export default ContactExample;
