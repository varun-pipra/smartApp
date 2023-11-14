import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { IconButton, Box, Typography } from "@mui/material";
import { InsertDriveFile } from "@mui/icons-material";

const Itooltip = () => {
  return (
    <>
      <IconButton className="file-input-wrapper" sx={{ marginLeft: "120px" }}>
        <AddCircleOutlineSharpIcon
          sx={{ color: "#e67419", fontSize: "50px" }}
        />
      </IconButton>
      <Typography margin={"0px 0px 0px 100px"} color={"black"}>
        Add Document
      </Typography>
      <br />

      <Box
        height="120px"
        width="300px"
        border="1px dashed black"
        marginLeft="10px"
        marginRight="10px"
      >
        <InsertDriveFile
          sx={{ fontSize: "80px", marginLeft: "110px", color: "gray" }}
        />
        <Typography color={"black"} textAlign="center">
          No Documents Exist
        </Typography>
      </Box>
    </>
  );
};

export default Itooltip;
