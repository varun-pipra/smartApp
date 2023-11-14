import React, { useEffect, useState } from "react";
import SSBrenaCard from "./SSBrenaCard";
import "./SSBrenaCardSection.scss";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSelectedCardsIds } from "../stores/SmartSubmitalLeftToolbarSlice";
import { getSketchIns } from "app/common/appInfoSlice";

const SSBrenaCardSection = (props: any) => {
  const dispatch = useAppDispatch();
  const { sectionData, cardStatusClick, ...rest } = props;
  const [cardSectionData, setCardSectionData] = useState<any>(sectionData);
  const { selectedCardsIds } = useAppSelector(
    (state: any) => state.smartSubmitalsLeftToolbar
  );
  const sketchInstance = useAppSelector(getSketchIns);
  const [docViewerins, setDocViewerins] = useState<any>({});
  const { specDropdownValue } = useAppSelector(
    (state: any) => state.smartSubmittals
  );

  useEffect(() => {
    if (sectionData) {
      setCardSectionData(sectionData);
    }
  }, [sectionData]);

  useEffect(() => {
    setDocViewerins(sketchInstance);
  }, [sketchInstance]);

  useEffect(() => {
    if (document?.getElementsByClassName("ss-brena-card-section_name")[1] && specDropdownValue) {
      let joinedVal = specDropdownValue?.split(' ')?.join('-');
      let a: any = document
        ?.getElementsByClassName(joinedVal)[0]
        ?.getBoundingClientRect();
      document
        ?.getElementsByClassName("ss-brena-card-section")[0]
        ?.scrollTo(0, a?.y);
    }
  }, [specDropdownValue]);

  const onCardTileClick = (rec: any) => {
    console.log("rec", rec);
    docViewerins.navigateToPage(rec?.startPage);
    const cardSectionCopy = [...cardSectionData];
    cardSectionCopy.forEach((section: any) => {
      section.children.forEach((card: any) => {
        if (card.id === rec.id) {
          if (selectedCardsIds.includes(rec.uniqueid) && card.selected) {
            const filter = selectedCardsIds.filter(
              (x: any) => x !== rec.uniqueid
            );
            dispatch(setSelectedCardsIds(filter));
          } else {
            dispatch(setSelectedCardsIds([...selectedCardsIds, rec.uniqueid]));
          }
          card.selected = card?.selected ? false : true;
        }
      });
    });
    setCardSectionData(cardSectionCopy);
  };
  const onCardStatusClick = (rec: any) => {
    cardStatusClick(rec);
  };
  const onSectionNameClick = (rec:any)=>{
    console.log('onSectionNameClick',rec);
    docViewerins.navigateToPage(rec?.startPage);
  }
  return (
    <div className="ss-brena-card-section">
      {(cardSectionData || []).map((section: any, index: any) => {
        return (
          <React.Fragment key={index}>
            <div className="ss-brena-card-section_title-wrapper">
              <div
                className={
                  "ss-brena-card-section_name" + " " + section.sectionName?.split(' ')?.join('-')
                }
                style={{zIndex: index + 1}}
                onClick={()=>onSectionNameClick(section)}
              >
                {section.sectionName}
              </div>
              {section?.children?.length && (
                <div className="ss-brena-card-section_count">
                  {section.children.length}
                </div>
              )}
            </div>
            {(section.children || []).map((card: any, index: any) => {
              return (
                <SSBrenaCard
                  cardData={card}
                  cardIndex={index}
                  onCardTileClick={(data: any) => onCardTileClick(data)}
                  onCardStatusClick={(data: any) => onCardStatusClick(data)}
                ></SSBrenaCard>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SSBrenaCardSection;
