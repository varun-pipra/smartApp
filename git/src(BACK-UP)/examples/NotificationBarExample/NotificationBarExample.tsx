import Button from "@mui/material/Button";
import React from "react";

import SUINotificationBar from "../../sui-components/NotificationBar/NotificationBar";

const NotificationBarExample = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  // Callback from the child component, Triggers on click of action button
  const handleAction = (e: any, obj: any) => {
    // console.log(obj);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        Open Notification Alert
      </Button>
      <SUINotificationBar
        open={open}
        setOpen={setOpen}
        actionButtonNames={[
          { name: "START CONTRACT FOR THIS BID", id: "yesBtn" },
        ]}
        headerTitle="Your Bid Response Is Submited"
        bodyTitle="Your Bid Respnose ID: 300000"
        bodyDescription="Do you want to start contract for this Bid"
        handleBtnClick={handleAction}
      />
    </>
  );
};

export default NotificationBarExample;
