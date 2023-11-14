import React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import "./NotificationBar.scss";

export default function SUINotificationBar({
  open,
  setOpen,
  actionButtonNames,
  headerTitle,
  bodyTitle,
  bodyDescription,
  handleBtnClick,
}: any) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        sx={{ backgroundColor: "#00CC99 !important" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={24 * 60 * 1000}
      >
        <div className="sa-notification-bar">
          <div className="sa-notification-bar_top-wrapper">
            <div>
              <CheckCircleIcon fontSize="large" />
            </div>
            <div className="sa-notification-bar_body">
              <div className="sa-notification-bar_left-container">
                <div>{headerTitle}</div>
                <div className="sa-notification-bar_left-container_body">
                  <div>{bodyTitle}</div>
                  <div>{bodyDescription}</div>
                </div>
              </div>
              <div className="sa-notification-bar_right-container">
                <ClearIcon onClick={() => setOpen(false)} />
              </div>
            </div>
          </div>
          <div className="sa-notification-bar_bottom-wrapper">
            {(actionButtonNames || []).map((obj: any) => (
              <button
                className="sa-notification-bar_btn"
                key={obj.id}
                onClick={(e) => handleBtnClick(e, obj)}
              >
                <AddIcon sx={{ fontSize: "15px" }} /> <span>{obj.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Snackbar>
    </Stack>
  );
}
