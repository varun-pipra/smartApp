import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { IconButton } from "@mui/material";

export interface SMBrenaSearchProps {
  open?: boolean;
  handleClose?: () => void;
  readonly?: boolean;
  renderModel?: boolean;
}

const useStyles = makeStyles({
  modalStyle: {
    position: "fixed",
    top: "28.5em",
    left: "85.6%",
    right: "0",
    minHeight: "39.5em",
    transform: "translate(-50%, -50%)",
    width: 430,
    backgroundColor: "#fff",
    boxShadow: "0px 0px 2px 1px rgb(219 215 215) !important",
  },
  parentDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px",
    boxShadow: '-2px 1px 8px #0000001a'
  },
  childDiv: {
    borderRadius: "4px",
    boxShadow: "0px 0px 2px 1px rgb(219 215 215) !important",
    marginTop: "16px",
    height: "4.5em",
    transition: "background-color 0.3s",
    "&.clicked": {
      backgroundColor: "#fffad2",
    },
  },
  textField: {
    marginLeft: "14px",
    marginTop: "9px",
    paddingTop: "10px",
  },
  pageStyle: {
    color: "#059cdf",
    fontSize: "14px",
    position: "relative",
    top: "1em",
    left: "1.2em",
    fontWeight: "lighter",
  },
});

const searchResults = [
  {
    text: "CONSTRUCTION MANAGEMENT AND COORDINATION",
    page: "PAGE NO 7",
  },
  {
    text: "CONSTRUCTION AND EQUIPMENT",
    page: "PAGE NO 12",
  },
  {
    text: "CONSTRUCTION METHODOLOGY",
    page: "PAGE NO 14",
  },
  {
    text: "CONSTRUCTION MANAGMENT LOGISTICS",
    page: "PAGE NO 15",
  },
  {
    text: "CONSTRUCTION MANAGMENT LOGISTICS",
    page: "PAGE NO 1565",
  },
];

const SMBrenaSearch = (props: SMBrenaSearchProps) => {
  const classes = useStyles();
  const {
    open = false,
    handleClose = () => {},
    readonly = false,
    renderModel = true,
  } = props;
  const [clickedDiv, setClickedDiv] = useState<number | null>(null);

  const handleChildDivClick = (index: number) => {
    setClickedDiv(index === clickedDiv ? null : index);
  };

  const renderBody = () => {
    return (
      <>
        <div className={classes.parentDiv}>
          <div className="search-result-cls">Search Results for "Construction"</div>
          <div
          // style={{ marginRight: "-1.8em" }}
          >
            <IconButton onClick={handleClose}>
              <span
                className="common-icon-close"
                style={{ fontSize: "18px", color: "#333" }}
              ></span>
            </IconButton>
          </div>
        </div>
        {readonly ? (
          <div style={{ position: "absolute", top: "18em", left: "8em" }}>
            No Search result found
          </div>
        ) : (
          <div className="consolidated-results" style={{ padding: "10px" }}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={`${classes.childDiv} ${
                  clickedDiv === index + 1 ? "clicked" : ""
                }`}
                onClick={() => handleChildDivClick(index + 1)}
              >
                <div className={classes.textField}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "normal",
                      fontFamily: "Roboto-Regular",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: clickedDiv ? "transparent" : "#cbffcb",
                      }}
                    >
                      {result.text.substring(0, 11)}
                    </span>
                    {result.text.substring(11)}
                  </div>
                </div>
                <span className={classes.pageStyle}>{result.page}</span>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {renderModel ? (
        <Modal
          sx={{
            "& .MuiBackdrop-root": {
              backgroundColor: "inherit",
            },
          }}
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="search-result-cls"
        >
          <Box className={classes.modalStyle}>{renderBody()}</Box>
        </Modal>
      ) : (
        <div>{renderBody()}</div>
      )}
    </div>
  );
};

export default SMBrenaSearch;
