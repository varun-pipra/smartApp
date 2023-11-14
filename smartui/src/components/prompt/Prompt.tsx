import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";

export interface PromptProps {
  open: boolean;
  alertMessage?: React.ReactNode;
  buttons?: React.ReactNode;
  title?: React.ReactNode;
  id?: string;
  image?: string;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false ;
  scroll?: "body" | "paper";
  icon?: React.ReactNode | undefined;
  height?: string;
  width?: string;
}

export const Prompt: FunctionComponent<PromptProps> = ({
  open = false,
  alertMessage,
  title,
  buttons,
  id = "responsive-dialog-title",
  image = null,
  fullWidth = false,
  maxWidth = "sm",
  scroll = "paper",
  icon,
  height,
  width,
}) => {
  const [isOpen, setOpen] = React.useState(open);

  const handleClose = () => {
    setOpen(false);
  };
  const modal = (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby={id}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        scroll={scroll}
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            minHeight: `${height}`,
            maxHeight: `${width}`,
          },
        }}
      >
        <DialogTitle id={id}>{title}</DialogTitle>
        {image || icon ? (
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0}
          >
            <Grid
              item
              xs={3}
              container
              alignItems="center"
              justifyContent="center"
            >
              <>
                {image && (
                  <img
                    id="alertPopupImage"
                    src={image}
                    alt="alertPopupImage"
                    loading="lazy"
                    height={100}
                    width={100}
                  />
                )}
                {icon && !image && <div id="alertPopupIcon" data-testid="icon">{icon}</div>}
              </>
            </Grid>
            <Grid item xs={9}>
              <DialogContent>
                <DialogContentText>{alertMessage}</DialogContentText>
              </DialogContent>
            </Grid>
          </Grid>
        ) : (
          <DialogContent>
            <DialogContentText>{alertMessage}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>{buttons}</DialogActions>
      </Dialog>
    </React.Fragment>
  );

  return open ? ReactDOM.createPortal(modal, document.body) : null;
};
