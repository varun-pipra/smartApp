
import Button from "@mui/material/Button";
import * as React from "react";

import SUIAlert from "../../sui-components/Alert/Alert"

const AlertExample = (props: any) => {

	const [open, setOpen] = React.useState(false);

	const showAlert = () => {
        setOpen(true);
    }

    const handleClose = (e: any, reason: any) => {
        setOpen(false);
    }

    const handleAction  = (e: any, type: any) => {
        setOpen(false);
    }

	return (
        <>
            <Button variant="outlined" onClick={showAlert}>Show Alert</Button>
            <SUIAlert open={open}
                onClose={handleClose}
                onAction={handleAction}
                title="Are you sure?"
                contentText="This will remove the record permanently. You will not be able to recover it."
            ></SUIAlert>
        </>
	);
}

export default AlertExample;