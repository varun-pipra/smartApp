import "./Reference.scss";
import { getServer ,  getSketchPageInfo} from "app/common/appInfoSlice";
import { useAppDispatch, useAppSelector, useFilePreview } from "app/hooks";
import { prepareFileList } from "features/bidmanager/stores/FilesSlice";
import { useEffect, useState } from "react";
import DocUploader from "sui-components/DocUploader/DocUploader";
import { fileDownload } from "app/hooks";
import SUIGrid from "sui-components/Grid/Grid";
import { getSpecBookPages, resetSpecBookPages } from "features/field/specificationmanager/stores/SpecificationManagerSlice";
import SpecDocViewer from "features/bidmanager/bidpackagedetails/tabs/referencefiles/SpecificationDocviewer/SpecDocViewer";
import { getMarkupsByPageForSubmittals } from "features/field/specificationmanager/stores/SpecificationManagerAPI";
import { getTextOccurences } from "features/bidresponsemanager/stores/BidResponseManagerAPI";
import { modifyMarkupData } from "utilities/commonFunctions";

export const ReferenceFiles = ({ iFrameId, appType }: any) => {
  const appInfo = useAppSelector(getServer);
  const dispatch = useAppDispatch();
  const {specBookpages } = useAppSelector(
    (state) => state.specificationManager
  );
  const sketchPageinfo= useAppSelector(getSketchPageInfo);
  const [specBookPagesData, setSpecBookPagesData] = useState({});
  const [openSpecDocViewer, setOpenSpecDocViewer] = useState(false);
  const [sepcSelectedRecord, setSepcSelectedRecord] = useState<any>({});
  const [searchText,setSearchText] = useState<any>('')
  const [bidRefernceagePUId, setBidRefernceagePUId] = useState();
  const { selectedRecord, bidDetails } = useAppSelector(
    (state) => state.bidResponseManager
  );
  const [files, setFiles] = useState<any>({});

  useEffect(() => {
    if(sketchPageinfo){
      if((searchText.length)){
        handelSearchChange()
      }else{
        getMarkupsPerpage();
      }
    }    
  }, [sketchPageinfo]);

  const getMarkupsPerpage = ()=>{
    let payload = {
      specbookId: sepcSelectedRecord?.specBookId,
      pageNo:sketchPageinfo?.currentPage?.page
    }
    getMarkupsByPageForSubmittals(payload)
      .then((res:any)=>{
        let updatedRes = res.map((item:any) => { return {...item, locked: true} })
        let data = {
          "extractionAreas": updatedRes
        };
        setBidRefernceagePUId(res[0]?.data?.pageUId)
        sketchPageinfo.callback(data);
      })
      .catch((error:any)=>{
        console.log('error',error);
      })
  }

  useEffect(() => {
    if (specBookpages.hasOwnProperty("totalCount")) {
      setSpecBookPagesData(specBookpages);
      setOpenSpecDocViewer(true);
    }
  }, [specBookpages]);

  const onImagePreview = (event: any) => {
    const { data } = event;
    handelFileClick(data);
  };

  const handelFileClick = (data: any) => {
    setSepcSelectedRecord(data);
    let payload = {
      id: data?.specBookId,
    };
    dispatch(getSpecBookPages(payload));
  };

  const closeSpecDocViewer = () => {
    setOpenSpecDocViewer(false);
    dispatch(resetSpecBookPages(""));
  };

  const specColumns = [
    {
      headerName: "Spec Number",
      field: "number",
      cellClass: "sm-number",
      cellRenderer: "agGroupCellRenderer",
      sort: "asc",
      resizable: true,
      minWidth: 200,
      pinned: "left",
    },
    {
      headerName: "Spec Section Title",
      field: "title",
      cellClass: "sm-title",
      resizable: true,
      minWidth: 250,
      pinned: "left",
    },
    {
      headerName: "Spec Book",
      field: "specBook",
      minWidth: 150,
      suppressMenu: true,
      resizable: true,
      cellClass: "sm-specBookName",
    },
    {
      headerName: "Division",
      field: "division",
      cellClass: "sm-division",
      minWidth: 250,
      resizable: true,
      suppressMenu: true,
    },

    {
      headerName: "Pages",
      field: "pages",
      cellClass: "sm-pages",
      minWidth: 120,
      suppressMenu: true,
      resizable: true,
      cellStyle: { color: "#059cdf" },
      valueGetter: (params: any) =>
        params?.data?.startPage
          ? `${params?.data?.startPage} - ${params?.data?.endPage}`
          : "NA",
    },
    {
      headerName: "File",
      field: "thumbnailUrl",
      menuTabs: [],
      minWidth: 50,
      flex: 1,
        onCellClicked: onImagePreview,
      cellStyle: {
        display: "flex",
        alignItems: "normal",
        justifyContent: "left",
        cursor: "pointer",
      },
      cellRenderer: (params: any) => {
        return (
          <img
            src={
              "https://storage.googleapis.com/download/storage/v1/b/smartapp-appzones/o/5ba09a787d0a4ea1bc0f0c1420152d1c%2F2023_8%2F0d3c3fc1ff62c1a29890817ac4ecb38c%2FLarge.png?generation=1692893852476902&alt=media"
            }
            className="thumbnailUrl-cls"
          />
        );
      },
    },
  ];

  useEffect(() => {
    const filesObject = {
      drawings: prepareFileList(
        bidDetails?.referenceFiles ? bidDetails?.referenceFiles : [],
        0
      ),
      documents: prepareFileList(
        bidDetails?.referenceFiles ? bidDetails?.referenceFiles : [],
        1
      ),
      specs: prepareFileList(
        bidDetails?.referenceFiles ? bidDetails?.referenceFiles : [],
        20
      ),
    };
    setFiles(filesObject);
  }, [bidDetails]);

  const openPreview = (files: Array<any>, index: number) => {
    useFilePreview(iFrameId, appInfo, appType, files, index);
  };

  const download = (imgData: any, fileType: any) => {
    console.log("downloadimgData", imgData);
    const objectIds = imgData?.map((item: any) => item.objectId);
    const filename = selectedRecord?.name + " - " + fileType;
    fileDownload(objectIds, filename);
  };

  useEffect(()=> {
      handelSearchChange()
  },[searchText])

  const handelSearchChange =() =>{
    if(bidRefernceagePUId && sepcSelectedRecord?.specBookId) {
      let params = `searchText=${searchText}&pageId=${bidRefernceagePUId}&contentId=${sepcSelectedRecord?.specBookId}`
      getTextOccurences(params).then((resp:any)=>{
        let updatedRes = modifyMarkupData(resp.data).map((item:any) => { return {...item, locked: true} })
        let data = {
          "extractionAreas": updatedRes
        };
        console.log('udated markup data',data, sketchPageinfo);
        sketchPageinfo?.callback(data)
      })
    }
   
  }

  return (
    <div className="referenceFile">
      <span className="header-text">Reference Files</span>
      <DocUploader
        width={"1070px"}
        height={"200px"}
        folderType="Drawing"
        docLabel={"Drawings"}
        onImageClick={openPreview}
        imgData={files?.drawings}
        readOnly={true}
        showDownloadButton={true}
        fileDownload={(data: any) => {
          download(data, "Drawings");
        }}
      ></DocUploader>
      <DocUploader
        width={"1070px"}
        height={"200px"}
        folderType="File"
        docLabel={"Documents"}
        onImageClick={openPreview}
        imgData={files?.documents}
        readOnly={true}
        showDownloadButton={true}
        fileDownload={(data: any) => {
          download(data, "Documents");
        }}
      ></DocUploader>
      <div className="spec-upload-base-container">
        <span className="common-icon-Upload-File"></span>
        <span>Specifications</span>
      </div>
	  <div className="bid-res-spec-grid">
		<SUIGrid
			headers={specColumns}
			data={bidDetails.specifications}
			getRowId={(record: any) => record.data.id}
			nowRowsMsg={"No files found"}
		/>
	  </div>     
      {openSpecDocViewer && (
				<SpecDocViewer
				specBookPagesData={specBookPagesData}
				selectedRecord={sepcSelectedRecord}
				closeSpecDocViewer={closeSpecDocViewer}
        onDocSearch={(text:any)=>setSearchText(text)}
				/>
			)}
    </div>
  );
};
