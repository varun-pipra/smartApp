import { Box, IconButton, InputBase, InputLabel, Stack } from "@mui/material";
import { memo, useEffect, useState } from "react";
import BrenaLoading from "resources/images/brena/brena-gif.gif";
import BrenaLoadingdot from "resources/images/brena/load-dot.gif";
import "./SSBrenalLeftPanel.scss";
import { SubmitalBrenaToolbar } from "features/field/smartsubmittals/content/toolbar/sslefttoolbar/SubmitalBrenaToolbar";
import SSBrenaCardSection from "./SSBrenaCardSection/SSBrenaCardSection";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  getSectionsCardsDataList,
  getSubmittalType,
} from "./stores/SmartSubmitalLeftToolbarSlice";
import {
  DeleteBrenaSubmittals,
  UpdateStatusCommit,
  updateStatusToCommit,
} from "./stores/SmartSubmitalLeftToolbarApi";
import { getSubmittalsStatusValues } from "utilities/smartSubmittals/enums";

const SSBrenalLeftPanel = (props: any) => {
  const dispatch = useAppDispatch();
  const { sectionsCardsData, selectedCardsIds } = useAppSelector(
    (state: any) => state.smartSubmitalsLeftToolbar
  );
  const { SSBrenaOpen, selectedRecord, selectedRecordsData, selectedBrenaFilter } = useAppSelector(
    (state: any) => state.smartSubmittals
  );
  const [showBrenaSuggestion, setShowBrenaSuggestion] = useState(true);
  const [cardsData, setCardsData] = useState([]);
  const [cardsModifiedData, setCardsModifiedData] = useState([]);
  const [totalSubmittals, setTotalSubmittals] = useState(0);
  const [committedCount, setCommittedCount] = useState(0);
  const CardsApi = () => {
    const sectionIds = selectedRecordsData.map((rec: any) => rec?.data?.id);
    const sectionIdsStr = sectionIds.join("|");
    let payload = {
      id: sectionIdsStr,
      specBookId: selectedRecord?.specBook?.id,
    };
    dispatch(getSectionsCardsDataList(payload));
  };
  const GenerateCardsData = (array: any) => {
    let Res: any = [];
    for (let i = 0; i < array.length; i++) {
      const index = Res.findIndex((item: any) => {
        return item.sectionName === array[i].sectionTitle;
      });
      if (index === -1) {
        Res.push({
          sectionName: array[i].sectionTitle,
          startPage: array[i].startPage,
          children: [array[i]],
        });
      } else {
        Res?.[index]?.children?.push(array[i]);
      }
    }
    return Res;
  };
  useEffect(() => {
    if (selectedRecord && SSBrenaOpen) {
      CardsApi();
      dispatch(getSubmittalType());
    }
  }, [SSBrenaOpen, selectedRecord]);
  useEffect(() => {
    setTimeout(() => {
      if (sectionsCardsData?.length > 0) {
        setShowBrenaSuggestion(false);
        const mapFields = sectionsCardsData.map((item: any) => ({
          ...item,
          selected: false,
        }));
        setCardsModifiedData(mapFields);
      }
    }, 2000);
  }, [sectionsCardsData]);
  useEffect(() => {
    if (cardsModifiedData?.length > 0) {
      // Res.reduce((count, current) => count + current.children.length, 0);
      let totalCommittedCount = 0;
      cardsModifiedData.forEach((item: any) => {
        if (item?.status?.toLowerCase() === "committed") {
          totalCommittedCount++;
        }
      });
      setCommittedCount(totalCommittedCount);
      setTotalSubmittals(cardsModifiedData.length);
      const data = GenerateCardsData(cardsModifiedData);
      setCardsData(data);
    } else if (cardsModifiedData?.length === 0) {
      setCardsData([]);
    }
  }, [cardsModifiedData]);
  useEffect(() => {
    if (Object.keys(selectedBrenaFilter)?.length > 0) {
      let res = [...cardsModifiedData].filter((obj: any) => {
        return Object.entries(selectedBrenaFilter).every(([key, find]: any) => {
          return find.includes(obj[key]);
        });
      });
      const data = GenerateCardsData(res);
      setCardsData(data);
    } else {
      const data = GenerateCardsData(cardsModifiedData);
      setCardsData(data);
    }
  }, [selectedBrenaFilter]);
  const onCardsSearch = (searchTxt: any) => {
    if (searchTxt !== "") {
      const filteredData: any = [...cardsModifiedData].filter((obj: any) => {
        return JSON.stringify(obj).toLowerCase().includes(searchTxt);
      });
      const data = GenerateCardsData(filteredData);
      setCardsData(data);
    } else if (searchTxt === "") {
      const data = GenerateCardsData(cardsModifiedData);
      setCardsData(data);
    }
  };
  const cardStatusClick = (rec: any) => {
    let payload = [{"uniqueId":rec.uniqueid, 'Status': 2}];
    
    updateStatusToCommit(payload)
      .then((res: any) => {
        CardsApi();
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };
  const handleDeleteCards = () => {
    if (selectedCardsIds?.length) {
      DeleteBrenaSubmittals(selectedCardsIds)
        .then((res: any) => {
          CardsApi();
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    }
  };
  const handleStatusChecked = () => {
    if (selectedCardsIds?.length) {
      let payload =  selectedCardsIds.map((id:any)=>{
        return {"uniqueId":id, 'Status': 2}
      })
      updateStatusToCommit(payload)
        .then((res: any) => {
          CardsApi();
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    }
  };
  const centerNodes = [
    { id: 1, name: "New", count: 1, color: "#F0FEDA" },
    { id: 2, name: "Updated", count: 2, color: "#FFEFCA" },
    { id: 3, name: "Removed", count: 3, color: "#FFF3F4" },
  ];
  return (
    <div className="smart-submital-brena-left-cont">
      {showBrenaSuggestion ? (
        <div className="brena-animate-cls">
          <div className="brena-gif">
            <img className="ss-brena-left-initial" src={BrenaLoading} />
          </div>
          <div className="brena-text">
            <p>
              <b>Brena</b> is automatically extracting the Submittal Registry
              details from the selected Spec sections...
            </p>
          </div>
          <div className="brena-dot">
            {" "}
            <img src={BrenaLoadingdot} />
          </div>
        </div>
      ) : (
        <>
          <SubmitalBrenaToolbar
            onCardsSearch={onCardsSearch}
            handleStatusChecked={handleStatusChecked}
            handleDeleteCards={handleDeleteCards}
            handleRefreshCards={CardsApi}
          />
          <SSBrenaCardSection
            sectionData={cardsData}
            cardStatusClick={cardStatusClick}
          ></SSBrenaCardSection>

          <div className="ss-brena-left-footer">
            <div className="ss-brena-left-footer_total-section">
              Total Submittals: {totalSubmittals}
            </div>
            <div className="ss-brena-left-footer_center-footer">
              {centerNodes.map((item) => {
                return (
                  <div className="ss-brena-left-footer_center-container-footer">
                    <span
                      className="ss-brena-left-footer_statusCircle"
                      style={{ color: item.color, backgroundColor: item.color }}
                    ></span>
                    <span>{`${item.count}` + " " + `${item.name}`}</span>
                  </div>
                );
              })}
            </div>
            <div className="ss-brena-left-footer_commited-section">
              Committed: {committedCount}
            </div>
          </div>

          {/* <div
            className="ssm-main-container"
            style={{ backgroundImage: `url(${SubmitalBrena})` }}
          >
            <div style={{ marginLeft: "10px", marginTop: "5px" }}>
              <img
                src={BrenaProcessing}
                style={{ width: "45.4em", height: "8em" }}
              />
            </div>
           
           <SSBrenaCardSection sectionData={data}></SSBrenaCardSection>
          </div> */}
        </>
      )}
    </div>
  );
};

export default memo(SSBrenalLeftPanel);
