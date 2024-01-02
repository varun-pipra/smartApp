import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import './SUISelectionTiles.scss';

const SUISelectionTiles = (props: any) => {
  const [tilesData, setTilesData] = useState<any>(props.tilesData || []);
  const [activeTile, setActiveTile] = useState<any>({});

  useEffect(() => {
    setTilesData(props.tilesData);
  }, [props.tilesData]);

  useEffect(()=>{
    props.selectedTile(activeTile);
  },[activeTile]);

  const createTiles = () => {
    return (tilesData || []).map((tile: any) => {
      return (
        <li
          tabIndex={0}
          key={tile.recordId}
          onClick={(event) => !props.readOnly && handleChange(event, tile)}
          className={
            "sui-selection-tiles_item " + (tile.isActive ? "active" : "")
          }
          >
          <div className="sui-selection-tiles_item-title-wrapper">
            <div className="sui-selection-tiles_item-title">{tile.title}</div>
            
            {!props.readOnly && tile.isActive && <Radio
              checked
              value={tile.recordId}
              name="selction-tiles-radio"
              />}
            {!props.readOnly && !tile.isActive && <Radio
              name="selction-tiles-radio"
            />}
          </div>
          <div className="sui-selection-tiles_item-desc">{tile.desc}</div>
        </li>
      );
    });
  };

  const handleChange = (event: any, selectedTile: any) => {
    let tiles = [...tilesData];
    tiles.forEach((tile: any) => {
      tile.isActive = tile.recordId === selectedTile?.recordId;
    });
    setTilesData(tiles);
    setActiveTile(selectedTile);
  };

  return <ul className="sui-selection-tiles">{createTiles()}</ul>;
};
export default SUISelectionTiles;
