import React, { memo, useState } from "react";
import "./SSBrenaCard.scss";
import { IconButton, Paper } from "@mui/material";
import SSMittalLeftForm from "features/field/smartsubmittals/content/toolbar/sslefttoolbar/SSAddForm";
import { getSubmittalsStatusLabel } from "utilities/smartSubmittals/enums";
import IQTooltip from "components/iqtooltip/IQTooltip";
interface SSBrenaCardProps {
  readOnly?: boolean;
  cardData?: any;
  cardIndex?: any;
  onCardTileClick?: any;
  onCardStatusClick?: any;
}

const SSBrenaCard = (props: SSBrenaCardProps) => {
  const [cardData, setCardData] = useState(props.cardData);
  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (props?.cardData ?? false) {
      setCardData(props.cardData);
    }
  }, [props]);
  /**
   * @param status string
   * @returns class name based on status
   * @author Srinivas Nadendla
   */
  const getStatusClass = (status: any) => {
    let clsName = "";
    switch (status?.toLowerCase()) {
      case "suggesteddraft":
        clsName = "suggested-draft";
        break;
      case "draft":
        clsName = "draft";
        break;
      case "committed":
        clsName = "committed";
        break;
      case "deleted":
        clsName = "deleted";
        break;
    }
    return clsName;
  };
  const getCardType = (cardType: any) => {
    let clsName = "";
    switch (cardType?.toLowerCase()) {
      case "removed":
        clsName = "removed-submittal";
        break;
      case "new":
        clsName = "new-submittal";
        break;
      case "updated":
        clsName = "updated-submittal";
        break;
    }
    return clsName;
  };
  /**
   * On card click based on the rec status call parent component method to update selected flag
   * @param e
   * @param data
   * @author Srinivas Nadendla
   */
  const onCardClick = (e: any, data: any) => {
    // if (data?.status?.toLowerCase() !== "committed") {
    props.onCardTileClick(data);
    // }
  };
  const updateCardStatus = (e: any, data: any) => {
    if (
      data?.status?.toLowerCase() === "draft" ||
      data?.status?.toLowerCase() === "suggesteddraft"
    ) {
      props.onCardStatusClick(data);
    }
  };
  const editCardSection = (e: any, data: any) => {
    handleOpen();
  };
  return (
    <>
      <Paper
        elevation={3}
        className={
          "ss-brena-card  " +
          getStatusClass(cardData.status) +
          " " +
          (cardData.selected ? "selected" : "")
        }
        onClick={(e: any) => onCardClick(e, cardData)}
      >
        <div className="ss-brena-card_header">
          <div className="ss-brena-card_header-left">
            <div className="ss-brena-card_header-left-num">
              {props.cardIndex + 1}
            </div>
            <div className="ss-brena-card_header-left-commit">
              <IQTooltip title="Commit" placement="bottom">
                <div
                  // sx={{ p: "5px" }}
                  onClick={(e: any) => updateCardStatus(e, cardData)}
                >
                  <span className="common-icon-submit-check"></span>
                </div>
              </IQTooltip>
            </div>
            <div
              className="ss-brena-card_header-left-edit"
              style={{ cursor: "pointer" }}
              onClick={(e: any) => editCardSection(e, cardData)}
            >
              <IQTooltip title="Edit" placement="bottom">
                <span className="common-icon-Edit"></span>
              </IQTooltip>
            </div>
          </div>
          <div className="ss-brena-card_header-right">
            <div className="ss-brena-card_header-right_status-label">
              Status
            </div>
            <div className="ss-brena-card_header-right_status">
              {getSubmittalsStatusLabel(cardData?.status)}
            </div>
          </div>
        </div>
        <div className={"ss-brena-card_body " + getCardType(cardData.cardType)}>
          <div className="ss-brena-card_type">
            <span className="ss-brena-card_type-label">Submittal Type</span>{" "}
            {cardData.type}
          </div>
          <div className="ss-brena-card_title-label">Submittal Title </div>
          <div className="ss-brena-card_title">{cardData.title}</div>
          <br />
          <div className="ss-brena-card_title-label">Submittal Summary </div>
          <div className="ss-brena-card_title">{cardData.summary}</div>
        </div>
      </Paper>
      {isOpen && (
        <SSMittalLeftForm
          drawIcon={true}
          arrow={true}
          onClose={handleClose}
          editCardData={cardData}
          editMode={true}
        />
      )}
    </>
  );
};

export default SSBrenaCard;
