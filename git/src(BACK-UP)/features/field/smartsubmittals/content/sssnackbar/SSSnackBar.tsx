import { Snackbar, Stack } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { memo, useState } from "react";
import "./SSSnackBar.scss";

export const SSSnackBar = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        sx={{ backgroundColor: "#23c763!important", borderRadius:'5em'}}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
      >
        <div className="notification-bar-smart">
          <div className="notification-bar-wrapper-smart">
            <div style={{color:'white'}}>
              <CheckCircleIcon  />
            </div>
            <div className="notification-bar_body">
              <div className="notification-bar-container">
                <div>17 Submittal Items has been successfully suggested as DRAFT. Please review & Accept to proceed.</div>
              </div>
            </div>
          </div>
        </div>
      </Snackbar>
    </Stack>
    </>
  );
};
export default memo(SSSnackBar);
