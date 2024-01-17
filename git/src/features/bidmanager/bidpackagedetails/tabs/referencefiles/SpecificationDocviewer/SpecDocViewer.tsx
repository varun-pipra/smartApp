import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import SUIDialog from "sui-components/Dialog/Dialog";

import './SpecDocViewer.scss'
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
const SpecDocViewer = (props:any) => {
  const dispatch = useAppDispatch();
  const  {selectedRecord,closeSpecDocViewer,specBookPagesData , ...rest} = props;
  const docViewElementId = "sbs-spec-canvasWrapper";
  const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length > 0) {
      setShowSearchpanel(true);
    } else {
      setShowSearchpanel(false);
    }
  }, [search]);

  return (
    <div>
    <SUIDialog
    open={true}
    headerTitle={selectedRecord.number + ': ' + selectedRecord.title}
    toolsOpts={{
      closable: true,
    }}
    PaperProps={{
      sx: { height: "70%", width: "65%" ,padding: '0px !important' },
    }}
    onClose={closeSpecDocViewer}
    style={{
      color: '#333333',
      fontSize: '1.12rem',
      fontWeight: 'bolder',
      fontFamily: 'Roboto-regular',
      padding:'0px !important'
    }}
  >
    <div className="spec-doc-viewer">
      <div className="iq-brena-search-cont" style={{display:'flex'}}>
        <IQSearchField
          placeholder={"Search Text"}
          showGroups={false}
          showFilter={false}
          filterHeader=""
          onSearchChange={(searchText: any) => setSearch(searchText)}
        />
      </div>
        <IQBrenaDocViewer
          showToolbar={false}
          docViewElementId={docViewElementId}
          sketchData={specBookPagesData}
          stopFocus={true}
          defaultPageToNavigate={selectedRecord?.startPage}
        />
        {showSearchpanel && (
          <SMBrenaSearch
            renderModel={true}
            open={showSearchpanel}
            handleClose={() => setShowSearchpanel(false)}
            readonly={false}
          />
        )}
      </div>
    </SUIDialog>
    </div>
  );
};

export default memo(SpecDocViewer);
