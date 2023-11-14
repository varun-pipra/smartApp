import { Snackbar, Stack } from "@mui/material";

//import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { memo, useState } from "react";
import "./SpecBookSnackbar.scss";

export const SpecBookSnackbar = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar className="notification-bar-main"
         // sx={{ backgroundColor: "#23c763!important", borderRadius: "5em" }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
        >
          <div className="notification-bar">
            <div className="sm-notification-bar-wrapper">
              <div style={{ color: "white" }}>
                
                <span className="common-icon-tickmark"></span>
              </div>
              <div className="notification-bar_body">
                <div className="sm-notification-bar-container">
                  <div>168 Unique Spec Sections Extracted Successfully</div>
                </div>
              </div>
            </div>
          </div>
        </Snackbar>
      </Stack>
    </>
  );
};
export default memo(SpecBookSnackbar);
