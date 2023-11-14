import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Itooltip from "./itooltippopup";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import React from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
const IQTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    height: 22em;
    font-weight: 800;
    background-color: white;
  }
`;

export default function SimpleTooltips() {
  const longText = (
    <Box
      sx={{
        height: "300px",
        padding: "0.5em 0.3em",
        width: "320px",
        backgroundColor: "#f5f5f9",
      }}
    >
      <Itooltip />
    </Box>
  );
  return (
    <Box>
      <IQTooltip title={longText} arrow={true} aria-label="add">
        <AddCircleOutlineIcon />
      </IQTooltip>
    </Box>
  );
}
