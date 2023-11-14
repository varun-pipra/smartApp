/**
 * Uplaod document attachment or add URL.
 */

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Box, IconButton, Stack } from "@mui/material";
import "./DocumentAttachment.scss";
import React, { FormEvent, useState } from "react";

export interface DocumentAttachmentProps {
  label: string;
  placeholder: string;
  width?: string;
}

const DocumentAttachment = ({
  label,
  placeholder,
  width,
}: DocumentAttachmentProps) => {
  const [isFileType, setIsFileType] = useState<boolean>(false);
  const [document, setDocument] = useState<any>("");

  const handleDocumentFile = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const files = target?.files as FileList;
    setIsFileType(false);
    if (files.length > 0) {
      setIsFileType(true);
      setDocument(
        Array.prototype.map.call(files, (file) => file.name).join(",")
      );
    }
  };

  const handleInputChange = (event: FormEvent) => {
    const target = event.target as HTMLInputElement;
    setDocument(target.value);
  };
  return (
    <>
      <Box className="file-wrapper" sx={{ width: width ?? "100%" }}>
        <Stack direction={"row"}>
          <TextField
            label={label}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssignmentIcon
                    className="icon-file"
                    sx={{ color: "#e67419" }}
                    data-testid="Icon-id"
                  />
                </InputAdornment>
              ),
            }}
            variant="standard"
            placeholder={placeholder}
            value={document}
            onInput={(event) => (!isFileType ? handleInputChange(event) : "")}
            className="spectification-text"
            data-testid="TextField-id"
            fullWidth
            inputProps={{
              style: {
                color: "#47aae3",
              },
            }}
          />
          <IconButton
            className="file-input-wrapper"
            sx={{ position: "relative" }}
          >
            <AddCircleOutlineSharpIcon
              data-testid="button-id"
              fontSize="large"
              sx={{ color: "#e67419" }}
            />
            <input
              type="file"
              multiple
              data-testid="Button"
              id="dock-file"
              className={"file-input"}
              onChange={(event) => handleDocumentFile(event)}
            />
          </IconButton>
        </Stack>
      </Box>
    </>
  );
};

export default DocumentAttachment;
