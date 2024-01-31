import { memo, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import SUIDialog from "sui-components/Dialog/Dialog";

import "./SpecDocViewer.scss";
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import _ from "lodash";
import SmartDialog from "components/smartdialog/SmartDialog";
const SpecDocViewer = (props: any) => {
  const dispatch = useAppDispatch();
  const {
    selectedRecord,
    closeSpecDocViewer,
    specBookPagesData,
    onDocSearch,
    ...rest
  } = props;
  const docViewElementId = "sbs-spec-canvasWrapper";
  const [search, setSearch] = useState("");

  const debounceOnSearch = useCallback(
    _.debounce((searchText) => {
      onDocSearch(searchText);
    }, 2000),
    [search]
  );

  return (
    <div>
      <SmartDialog
        className={"barcode-model"}
        open={true}
        PaperProps={{
          sx: { height: "75%", width: "70%", padding: "0px !important" },
        }}
        onClose={closeSpecDocViewer}
  
        custom={{
          closable: true,
          resizable: true,
          title: <><span style={{color: "#333333",fontSize: "1.12rem",fontWeight: "bolder",fontFamily: "Roboto-regular",padding: "0px !important"}}>{selectedRecord.number + ": " + selectedRecord.title}</span></>
        }}
      >
        <div className="spec-doc-viewer">
          <div className="iq-brena-search-cont" style={{ display: "flex" }}>
            <IQSearchField
              placeholder={"Search Text"}
              showGroups={false}
              showFilter={false}
              filterHeader=""
              onSearchChange={(searchText: any) => debounceOnSearch(searchText)}
            />
          </div>
          <IQBrenaDocViewer
            showToolbar={false}
            docViewElementId={docViewElementId}
            sketchData={specBookPagesData}
            stopFocus={true}
            defaultPageToNavigate={selectedRecord?.startPage}
          />
        </div>
      </SmartDialog>
    </div>
  );
};

export default memo(SpecDocViewer);
