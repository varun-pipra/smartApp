import React, { FC, useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "./CountDisplayGrid.module.css";

interface Grid {
  image: string;
  count: number;
  category: string;
}

export interface CountDisplayProps {
  data: Grid[];
  scrollValue?: number;
}

export const CountGrid: FC<CountDisplayProps> = ({
  data,
  scrollValue = 250,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [rightArrow, showRightArrow] = useState(false);
  const [leftArrow, showLeftArrow] = useState(false);

  useEffect(() => {
    if (null !== gridRef.current) {
      if (gridRef.current.scrollWidth > gridRef.current.offsetWidth) {
        showRightArrow(true);
        showLeftArrow(false);
      } else {
        showRightArrow(false);
      }
      if (gridRef.current.scrollLeft > 0) {
        showLeftArrow(true);
      } else {
        showLeftArrow(false);
      }
      let margin = gridRef.current.scrollWidth - gridRef.current.offsetWidth;
      if (gridRef.current.scrollLeft >= margin) {
        showRightArrow(false);
      }
    }
  }, []);

  const handleScroll = () => {
    if (null !== gridRef.current) {
      let margin = gridRef.current.scrollWidth - gridRef.current.offsetWidth;
      if (gridRef.current.scrollLeft === 0) {
        showLeftArrow(false);
      }
      if (gridRef.current.scrollLeft >= margin) {
        showRightArrow(false);
      }
      if (
        gridRef.current.scrollLeft > 0 &&
        gridRef.current.scrollLeft < margin
      ) {
        showRightArrow(true);
        showLeftArrow(true);
      }
    }
  };

  const handleGridClickScroll = (direction: string) => {
    if (null !== gridRef.current) {
      if (direction === "left") {
        gridRef.current.scrollLeft -= scrollValue;
      } else {
        gridRef.current.scrollLeft += scrollValue;
      }
      let margin = gridRef.current.scrollWidth - gridRef.current.offsetWidth;
      if (gridRef.current.scrollLeft === 0) {
        showRightArrow(true);
        showLeftArrow(false);
      }
      if (gridRef.current.scrollLeft === margin) {
        showRightArrow(false);
        showLeftArrow(true);
      }
    }
  };

  return (
    <React.Fragment>
      {data && data.length > 0 && (
        <div className={`${styles["grid_toolbar"]} ${styles["gridBoxMob"]}`} data-testid="countGrid">
          <div
            className={`${styles["grid_toolbar_wrapper"]} ${styles["gridWeb"]}`}
          >
            <div className={`${styles["pos-rel"]} ${styles["gridInner"]}`}>
              <div
                className={styles["gridBox"]}
                ref={gridRef}
                onScroll={handleScroll}
                data-testid="gridBox"
              >
                {data.map((options, idx) => {
                  return (
                    <div
                      className={styles["innerOptions"]}
                      id={options.category + idx}
                      data-testid="cell"
                    >
                      <Grid container spacing={0}>
                        <Grid item xs={4}>
                          <img
                            src={options.image}
                            alt="image"
                            height={40}
                            width={40}
                          />
                        </Grid>
                        <Grid item xs={8}>
                          <div className={styles["gridContnet_count"]}>
                            <div className={styles["grid_text"]}>
                              {options.count}
                            </div>
                            <div className={styles["grid_category"]}>
                              {options.category}
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  );
                })}
              </div>
              {leftArrow ? (
                <div
                  className={styles["previousScroll"]}
                  onClick={() => handleGridClickScroll("left")}
                  data-testid="previousScroll"
                >
                  <ArrowBackIosIcon fontSize="large" color="action" />
                </div>
              ) : null}
              {rightArrow ? (
                <div
                  className={styles["nextScroll"]}
                  onClick={() => handleGridClickScroll("right")}
                  data-testid="nextScroll"
                >
                  <ArrowForwardIosIcon fontSize="large" color="action" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default CountGrid;
