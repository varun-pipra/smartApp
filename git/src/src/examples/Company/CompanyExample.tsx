import SUIBaseDropdownSelector from "sui-components/BaseDropdown/BaseDropdown";
import * as React from "react";

const CompanyExample = (props: any) => {
  const value = [
    {
      color: "210fff",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c51",
      displayField: "ACME Inc1",
      thumbnailUrl:
        "https://s3.amazonaws.com/smartapp-appzones/8f55be2adf864ace8c8c0243eb53f010/iqadmin/dynamic/2108/zqb2cqap/7.jpg",
    }
  ];

  const placeHolder = "Select Company";

  const noDataFoundMsg = (
    <div>
      <img
        src="https://s3.amazonaws.com/smartapp-appzones/8f55be2adf864ace8c8c0243eb53f010/iqadmin/dynamic/2108/zqb2cqap/7.jpg"
        alt="Avatar"
        style={{ width: "28px", height: "28px" }}
        className="base-custom-img"
      />
      <div>No Company Exist</div>
      <div>Click on the + add button to add</div>
      <div>this company to the list</div>
    </div>
  );

  const dropdownOptions = [
    {
      color: "210fff",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c5",
      displayField: "ACME Inc",
      thumbnailUrl:
        "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/8f55be2adf864ace8c8c0243eb53f010%2Fiqadmin%2Fdynamic%2F2301%2F0rdknwnf%2Felegant-futuristic-3d-logo-mockup_225928-126.jpg?generation=1672831604227808&alt=media",
    },
    {
      color: "210fff",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c51",
      displayField: "ACME Inc1",
      thumbnailUrl:
        "https://s3.amazonaws.com/smartapp-appzones/8f55be2adf864ace8c8c0243eb53f010/iqadmin/dynamic/2108/zqb2cqap/7.jpg",
    },
    {
      color: "24442f",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c52",
      displayField: "ACME Inc2",
    },
    {
      color: "123456",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c53",
      displayField: "ACME Inc3",
    },
    {
      color: "123456",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c54",
      displayField: "ACME Inc4",
    },
    {
      color: "21042f",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c55",
      displayField: "ACME In5c",
    },
    {
      color: "21042f",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c56",
      displayField: "ACME Inc6",
    },
    {
      color: "21042f",
      id: "89f3a9ca-d7ea-4ff9-b13a-bce194ad68c57",
      displayField: "ACME Inc7",
    },
  ];

  const handleValueChange = (value: any) => {
    console.log("value", value);
  };

  return (
    <>
      <SUIBaseDropdownSelector
        value={value}
        width="300px"
        menuWidth="450px"
        placeHolder={placeHolder}
        dropdownOptions={dropdownOptions}
        noDataFoundMsg={noDataFoundMsg}
        handleValueChange={handleValueChange}
      ></SUIBaseDropdownSelector>
    </>
  );
};

export default CompanyExample;
