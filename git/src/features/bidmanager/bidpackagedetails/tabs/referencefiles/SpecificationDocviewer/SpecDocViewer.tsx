// import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import IQSearchField from "components/iqsearchfield/IQSearchField";
import IQBrenaDocViewer from "components/iqbrenadocviewer/IQBrenaDocViewer";
import SUIDialog from "sui-components/Dialog/Dialog";
// import "./SSBrenalRightPanel.scss";
// import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
// import { getSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
// import { getSketchPageInfo } from "app/common/appInfoSlice";
// import { getMarkupsByPageForSubmittals } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import './SpecDocViewer.scss'
import SMBrenaSearch from "features/field/specificationmanager/smbrena/content/leftpanel/SMBrenaSearch";
import SSMittalLeftForm from "features/field/smartsubmittals/content/toolbar/sslefttoolbar/SSAddForm";
const SpecDocViewer = (props:any) => {
  const dispatch = useAppDispatch();
  const  {selectedRecord,closeSpecDocViewer,specBookPagesData , ...rest} = props;
  console.log(selectedRecord.startPage,'selectedRecord')
  const [openDlg,setOpenDlg] = useState(false)
  const docViewElementId = "sbs-spec-canvasWrapper";
  const [showSearchpanel, setShowSearchpanel] = useState(false);
  const [search, setSearch] = useState("");
  // const sketchPageinfo= useAppSelector(getSketchPageInfo);

  // useEffect(()=>{
  //   if(selectedRecord && SSBrenaOpen) {
  //     let payload = {
  //       id : selectedRecord?.specBook?.id
  //     };
  //     dispatch(getSpecBookPages(payload));
  //   }
  // },[SSBrenaOpen,selectedRecord])

  // useEffect(() => {
  //   console.log(specBookpages,'specBookpages')
  //   setSpecBookPagesData(specBookpages);
  //   setOpenDlg(true)
  // }, [specBookpages]);

  useEffect(() => {
    if (search.length > 0) {
      setShowSearchpanel(true);
    } else {
      setShowSearchpanel(false);
    }
  }, [search]);

  // useEffect(() => {
  //   if(sketchPageinfo){
  //     getMarkupsPerpage();
  //   }    
  // }, [sketchPageinfo]);

  // const getMarkupsPerpage = ()=>{
  //   let payload = {
  //     specbookId:selectedRecord?.specBook?.id,
  //     pageNo:sketchPageinfo?.currentPage?.page
  //   }
  //   getMarkupsByPageForSubmittals(payload)
  //     .then((res:any)=>{
  //       let updatedRes = res.map((item:any) => { return {...item, locked: true} })
  //       let data = {
  //         "extractionAreas": updatedRes
  //       };
  //       sketchPageinfo.callback(data);
  //     })
  //     .catch((error:any)=>{
  //       console.log('error',error);
  //     })
  // }

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
    // buttons={buttonsEl1}
    onClose={closeSpecDocViewer}
    style={{
      color: '#333333',
      fontSize: '1.12rem',
      fontWeight: 'bolder',
      fontFamily: 'Roboto-regular',
      // padding: '4px !important'
      padding:'0px !important'
    }}
    // background='#F2F2F2'
    // padding='0.3em'
    // minWidth='33% !important'
    // height='50px'
    // borderRadius='3px !important'
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
      {/* <div> */}
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
    {/* </div> */}
    </SUIDialog>
    </div>
  );
};

export default memo(SpecDocViewer);
