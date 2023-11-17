import SUIEmailSelector from 'sui-components/Email/Email'
import * as React from "react";

const EmailExample = (props: any) => {

  const emailOptions = [
    {
      "id": 0,
      "phone": "1234",
      "email": "admin@smartapp.com",
      "uniqueId": "cd80bc52-1ba1-4734-a46c-179c5d4c53821",
      "firstName": "Purushotham",
      "lastName": "K S",
      "thumbnail":"https://central.smartappbeta.com/skins/base/img/k_200dp.png"
    },
    {
      "id": 0,
      "phone": "1231231",
      "email": "satish@smartapp.com",
      "uniqueId": "cd80bc52-1ba1-4734-a46c-179c5d4c53822",
      "firstName": "Purushotham",
      "lastName": "K S",
      "thumbnail":"https://central.smartappbeta.com/skins/base/img/a_200dp.png"
    },
    {
      "id": 0,
      "phone": "213123",
      "email": "prem2@smartapp.com",
      "uniqueId": "cd80bc52-1ba1-4734-a46c-179c5d4c53823",
      "firstName": "Purushotham",
      "lastName": "K S",
      "thumbnail":"https://central.smartappbeta.com/skins/base/img/k_200dp.png"
    },
    {
      "id": 0,
      "phone": "21312312",
      "email": "swathi@smartapp.com",
      "uniqueId": "cd80bc52-1ba1-4734-a46c-179c5d4c53825",
      "firstName": "Purushotham",
      "lastName": "K S",
      "thumbnail":"https://central.smartappbeta.com/skins/base/img/a_200dp.png"
    },
    {
      "id": 0,
      "phone": "23213123",
      "email": "raghu@smartapp.com",
      "uniqueId": "cd80bc52-1ba1-4734-a46c-179c5d4c53862",
      "firstName": "Purushotham",
      "lastName": "K S",
      "thumbnail":"https://central.smartappbeta.com/skins/base/img/a_200dp.png"
    },
    {
      "id": 531407,
      "phone": "124578",
      "email": "prem3@smartapp.com",
      "uniqueId": "425dbf29-380c-4003-a241-6beee9db105665",
      "firstName": "Satish",
      "lastName": "K S",
      "thumbnail":"https://central.smartappbeta.com/skins/base/img/a_200dp.png"
    }
  ];
  const defaultSelectedValue:any = [{
    "id": 531407,
    "phone": "124578",
    "email": "prem1@smartapp.com",
    "uniqueId": "425dbf29-380c-4003-a241-6beee9db105665",
    "firstName": "Satish",
    "lastName": "K S",
    "thumbnail":"https://central.smartappbeta.com/skins/base/img/a_200dp.png"
  }]
 
  const emailLabel = "Bidding CC Emails";
  const emailIcon = React.useMemo<React.ReactElement>(() => {
    return <div className="common-icon-info-icon common-icon-Budgetcalculator"></div>;
  }, []);

  const selectedEmails = (eList:any) =>{
    // console.log('eList', eList);
  }

  return (
    <>
      <SUIEmailSelector emailLabel={emailLabel} emailIcon={emailIcon} emailOptions={emailOptions} selectedEmailList={selectedEmails} defaultSelectedValue={defaultSelectedValue}></SUIEmailSelector>
    </>
  );
};

export default EmailExample;
