import { useEffect, memo, useState } from "react";
import "./IQBrenaDocViewer.scss";
import { useAppDispatch } from "app/hooks";
import {
  setSketchIns,
  setSketchMarkup,
  setSketchPageInfo,
} from "app/common/appInfoSlice";

declare global {
  var IQSketchLiteManager: any;
}
interface IQBaseWindowProps {
  imageUrl?: string;
  docViewElementId?: string;
  showToolbar?: boolean;
  sketchData?: any;
  stopFocus?:boolean;
  defaultPageToNavigate?:number;
}

const IQBrenaDocViewer = ({
  imageUrl,
  docViewElementId = "canvasWrapper",
  showToolbar = false,
  sketchData,
  stopFocus = false,
  defaultPageToNavigate = 1
}: IQBaseWindowProps) => {
  const dispatch = useAppDispatch();

  let hasInit = false;
  useEffect(() => {
    console.log("imageUrl", imageUrl);
    console.log("sketchData", sketchData);
    if (sketchData) {
      renderViewer();
    }
  }, [sketchData]);

  const renderViewer = () => {
    var wrapperDiv = document.getElementById(docViewElementId);
    if (wrapperDiv?.getAttribute("hasInit")) {
      return;
    }
    wrapperDiv?.setAttribute("hasInit", "true");
    var docView = new IQSketchLiteManager({
      domElementId: docViewElementId,
      initialconfig: {
        callback: function (eventName: any, args: any) {
          console.log(
            "****IQSketchLiteManager***** - has fired the following event",
            eventName,
            args,
            new Date()
          );
          switch (eventName) {
            case "markupPlaced":
              dispatch(setSketchMarkup(args));
              break;
            case "getMarkupsByPage":
              dispatch(setSketchPageInfo(args));
              break;
          }
        },
        showToolbar: showToolbar,
        appId: "84baee6482c14663ad5efd136e06287e",
        imageUrl: imageUrl,
        currentPage: 1,
        totalCount: sketchData?.totalCount,
        pages: sketchData?.pages,
        stopFocus: stopFocus,
        /* "markups": {
          "extractionAreas": [
            {
              coordinates: {
                x1: 2862,
                x2: 3004,
                y1: 1895,
                y2: 1975,
              },
              tooltip: "Sheet Title",
              stroke: "#efb239",
              locked: true,
              data: {
                type: "Sheet Title",
                value: "ELECTRICAL GENERAL NOTES AND LEGEND",
              },
            },
            {
              coordinates: {
                x1: 2857,
                x2: 3007,
                y1: 2065,
                y2: 2129,
              },
              tooltip: "Sheet Name",
              stroke: "#74ae29",
              data: {
                type: "Sheet Name",
                value: "E000",
              },
            },
            {
              coordinates: {
                x1: 2862,
                x2: 2883,
                y1: 1018,
                y2: 1267,
              },
              tooltip: "Revision",
              stroke: "#32b2bf",
              data: {
                type: "Revision",
              },
            },
            {
              coordinates: {
                x1: 2883,
                x2: 2949,
                y1: 1018,
                y2: 1267,
              },
              tooltip: "Rev Description",
              stroke: "#165ebd",
              data: {
                type: "Rev Description",
              },
            },
            {
              coordinates: {
                x1: 31,
                x2: 510,
                y1: 553,
                y2: 576,
              },
              tooltip: "Title Description",
              stroke: "#165ebd",
              data: {
                type: "Title Description",
              },
            },
            {
              coordinates: {
                x1: 2952,
                x2: 3005,
                y1: 1018,
                y2: 1262,
              },
              tooltip: "Rev Date Issued",
              stroke: "#a61ebd",
              data: {
                type: "Rev Date Issued",
              },
            },
            {
              coordinates: {
                x1: 2861,
                x2: 3010,
                y1: 1323,
                y2: 1346,
              },
              tooltip: "Title Date Issued",
              stroke: "#a61ebd",
              data: {
                type: "Title Date Issued",
              },
            },
          ],
        }, */
      },
    });
    dispatch(setSketchIns(docView));
    setTimeout(() => {
      docView.navigateToPage(defaultPageToNavigate);
    }, 2000);
  };

  return (
    <div className="iq-brena-doc-viewer">
      <div id={docViewElementId} className="canvas-wrapper-cls"></div>
    </div>
  );
};

export default memo(IQBrenaDocViewer);
