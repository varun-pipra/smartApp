import React, { useEffect, useState } from "react";
import "./UserSelectionTile.scss";

const userSelectionTile = (props: any) => {
  const [tilesData, setTilesData] = useState<any>(props.tilesData || []);
  const [activeTile, setActiveTile] = useState<any>({});

  useEffect(() => {
    if (activeTile) {
      props.selectedTile(activeTile);
    }
  }, [activeTile]);
  
  const createTiles = () => {
    return (tilesData || []).map((tile: any) => {
      const isActive = tile.isActive;
      const isDisabled = tile.readOnly;
      return (
        <li
          tabIndex={0}
          key={tile.recordId}
          onClick={(event) => handleChange(event, tile)}
          className={`user-selection-tiles_item 
                                ${isActive ? "active" : ""}
                                ${isDisabled ? "disabled" : ""}`}
        >
          <div className="user-selection-tiles_item-title-wrapper">
            <div className="user-selection-tiles_item-desc">
              {tile.type === "One Side" ? (
                <span className="common-icon-oneside"></span>
              ) : (
                <span className="common-icon-bothside"></span>
              )}
              <p style={{ textAlign: "center" }}>{tile.type}</p>
            </div>
          </div>
        </li>
      );
    });
  };

  const handleChange = (event: any, selectedTile: any) => {
    let tiles = [...tilesData];
    tiles.forEach((tile: any) => {
      if (tile.type === selectedTile?.type) {
        tile.isActive = true;
      } else {
        tile.isActive = false;
      }
    });
    setTilesData(tiles);
    setActiveTile(selectedTile);
  };

  return <ul className="user-selection-tiles">{createTiles()}</ul>;
};
export default userSelectionTile;
