import {getServer} from 'app/common/appInfoSlice';

import {useAppDispatch, useAppSelector, useFilePreview, useLocalFileUpload} from 'app/hooks';
import {postMessage} from 'app/utils';
import {getSelectedRecord, setSelectedRecord, setShowContracts} from 'features/bidmanager/stores/BidManagerSlice';
import {uploadReferenceFile} from 'features/bidmanager/stores/FilesAPI';
import {
	getFileObject, getUploadQueue, setUploadQueue
} from 'features/bidmanager/stores/FilesSlice';
import {useEffect, useMemo, useState} from 'react';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import {fileDownload} from 'app/hooks';

import SUIGrid from "sui-components/Grid/Grid";
import { getSMList, getSpecBookPages, resetSpecBookPages } from 'features/field/specificationmanager/stores/SpecificationManagerSlice';
import IQButton from 'components/iqbutton/IQButton';
import './ReferenceFiles.scss'
import AddSpecificationsDialog from './AddSepcDialog/AddSpecificationsDialog'
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SpecDocViewer from './SpecificationDocviewer/SpecDocViewer';
import IQTooltip from 'components/iqtooltip/IQTooltip';
export const ReferenceFiles = ({iFrameId, appType, readOnly}: any) => {
	const onImagePreview = (event: any) => {
		const { data } = event;
		handelFileClick(data);
	};
	const specColumns =  [
		{
		  headerName: "Spec Number",
		  field: "number",
		  cellClass: "sm-number",
		  cellRenderer: "agGroupCellRenderer",
		  sort: "asc",
		  checkboxSelection: true,
		  headerCheckboxSelection: true,
		  resizable: true,
		  minWidth: 200,
		},
		{
		  headerName: "Spec Section Title",
		  field: "title",
		  cellClass: "sm-title",
		  resizable: true,
		  minWidth: 350,
		},
		{
		  headerName: "Spec Book",
		  field: "specBook",
		  minWidth: 150,
		  suppressMenu: true,
		  resizable: true,
		  cellClass: "sm-specBookName",
		  keyCreator: (params: any) => params.data?.specBook?.fileName || "None",
		  valueGetter: (params: any) => `${params?.data?.specBook?.fileName}`
		},
		{
		  headerName: "Division",
		  field: "division",
		  cellClass: "sm-division",
		  minWidth: 250,
		  resizable: true,
		  suppressMenu: true,
		  keyCreator: (params: any) => params.data.division && `${params.data.division.number} - ${params.data.division.text}` || "None",
		  valueGetter: (params: any) => {
			const division = params?.data?.division;
			if (
			  division &&
			  division.number !== undefined &&
			  division.text !== undefined
			) {
			  return `${division.number} - ${division.text}`;
			}
		  },
		},
	
		{
		  headerName: "Pages",
		  field: "pages",
		  cellClass: "sm-pages",
		  minWidth: 120,
		  suppressMenu: true,
		  resizable: true,
		  cellStyle: { color: "#059cdf" },
		  valueGetter: (params: any) => params?.data?.startPage ? `${params?.data?.startPage} - ${params?.data?.endPage}` : 'NA'
		},
		{
			headerName: "File",
			field: "thumbnailUrl",
			menuTabs: [],
			minWidth: 100,
			flex: 1,
			type: 'avatar',
			onCellClicked: onImagePreview,
			cellStyle: {
				display: 'flex',
				alignItems: 'left',
			},
			cellRenderer: (params: any) => {
				return <img src={params.value} />;
			}
		},
	  ]
	const headers = useMemo(() => specColumns, []);
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const bidPackage = useAppSelector(getSelectedRecord);
	const fileObject = useAppSelector(getFileObject);
	const fileQueue = useAppSelector(getUploadQueue);
	const [selected, setSelected] = useState<any>([]);
	const [specModifiedList, setSpecModifiedList] = useState<Array<any>>([]);
	const [openAddSpecDlg , setOpenAddSpecDlg] = useState(false)
	const { SMData , specBookpages} = useAppSelector((state) => state.specificationManager);
	const [openSpecDocViewer,setOpenSpecDocViewer] = useState(false);
    const [specBookPagesData, setSpecBookPagesData] = useState({});
	const [sepcSelectedRecord,setSepcSelectedRecord] = useState({});
	const {sepcSelectedRecordInAddSpecDlg} = useAppSelector((state) => state.bidManager);

	useEffect(() => {
		if(specBookpages.hasOwnProperty('totalCount')){
		  setSpecBookPagesData(specBookpages);
		  setOpenSpecDocViewer(true)
		}
	}, [specBookpages]);

	useEffect(()=>{
		setSepcSelectedRecord(sepcSelectedRecordInAddSpecDlg)
	},[sepcSelectedRecordInAddSpecDlg])

	useEffect(()=>{
	if(appInfo){
		dispatch(getSMList());
	}
	},[appInfo])

	useEffect(() => {
	if(SMData?.length > 0) {
		const data: any = SMData.map((item: any) => ({
			...item, pages: `${item.startPage} - ${item.endPage}`,
			bidPackageValue: item.bidPackageName === null || item.bidPackageName === '' ? 'NA' : item.bidPackageName
		}));
		setSpecModifiedList(data);
	} else {
		setSpecModifiedList([]);
	}
}, [SMData]);
	
	let typeVariable: any;

	const handelFileClick = (data:any) => {
		setSepcSelectedRecord(data)
        let payload = {
          id: data.specBook?.id,
        };
        dispatch(getSpecBookPages(payload));
      }


	const addContractDocs = (type: any) => {
		setFileType(getTypeValue(type));
		dispatch(setShowContracts(true));
	};

	const rowSelected = (sltdRows: any) => {
		const selectedRowData = sltdRows.api.getSelectedRows();
		
		setSelected(selectedRowData);
	  };

	const [fileType, setFileType] = useState<number>();

	const getTypeValue = (type: string): number => {
		let fType = 0;
		switch(type) {
			case 'Drawings':
				fType = 0;
				break;
			case 'Files':
				fType = 1;
				break;
			case 'SpecBooks':
				fType = 20;
				break;
		}

		return fType;
	};

	const openDrive = (folderType: string) => {
		let params: any = {iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType, multiSelect: true};
		if(folderType) {
			params.folderType = folderType;
			setFileType(getTypeValue(folderType));
		}

		postMessage({
			event: 'getdrivefiles',
			body: params
		});
	};

	const localFileUpload = (data: any) => {
		useLocalFileUpload(appInfo, data).then((res) => {
			saveReferenceFiles({add: constructList(res)});
		});
	};

	const openPreview = (files: Array<any>, index: number) => {
		useFilePreview(iFrameId, appInfo, appType, files, index);
	};

	const saveReferenceFiles = (formattedList: any) => {
		uploadReferenceFile(appInfo, {referenceFiles: formattedList}, bidPackage?.id)
			.then((bidPackageItem: any) => {
				typeVariable = undefined;
				setFileType(undefined);
				dispatch(setUploadQueue([]));
				dispatch(setSelectedRecord(bidPackageItem));
			});
	};

	const deleteImage = (item: any) => {
		saveReferenceFiles({remove: [{objectId: item.objectId, id: (item.driveObjectId || item.id), name: item.name}]});
	};

	const constructList = (list: Array<any>, fromDrive = false) => {
		const modifiedList = list?.map((item: any) => {
			if(fromDrive)
				return {
					driveObjectId: item.id,
					name: item.name,
					fileType: fileType
				};
			else {
				return {
					id: item.id,
					name: item.name,
					fileType: typeVariable
				};
			}
		});

		return modifiedList;
	};

	const closeSpecDocViewer=()=>{
		setOpenSpecDocViewer(false)
		dispatch(resetSpecBookPages(''))
	}

	useEffect(() => {
		if(fileQueue && fileQueue.length > 0) {
			saveReferenceFiles({add: constructList(fileQueue, true)});
		}
	}, [fileQueue]);

	const download = (imgData: any, fileType: any) => {
		const objectIds = imgData?.map((item: any) => item.objectId);
		const filename = bidPackage?.name + ' - ' + fileType;
		fileDownload(objectIds, filename);
	};

	return (
	<div className='referenceFile'>
		{openAddSpecDlg ? (
				<AddSpecificationsDialog
					open={true}
					closeAddSpec={() => setOpenAddSpecDlg(false)}
					onAddRecord={(data:any)=>saveReferenceFiles(data)}
				/>
			) : (
				<></>
			)}
		<div className='header-text'>Reference Files</div>
		<DocUploader
			width={'1070px'}
			height={'200px'}
			folderType='Drawings'
			docLabel={'Drawings'}
			onImageClick={openPreview}
			onImageDelete={deleteImage}
			imgData={fileObject.drawings}
			readOnly={readOnly}
			onProjectFile={(type: any) => {typeVariable = 0; openDrive(type);}}
			localFileClick={(data: any) => {typeVariable = 0; localFileUpload(data);}}
			showDownloadButton={true}
			fileDownload={(data: any) => {download(data, 'Drawings');}}
		></DocUploader>
		<DocUploader
			width={'1070px'}
			height={'200px'}
			folderType='Files'
			docLabel={'Documents'}
			btnLabel={'Add Documents'}
			showContractOption={true}
			onImageClick={openPreview}
			onImageDelete={deleteImage}
			imgData={fileObject.documents}
			readOnly={readOnly}
			onProjectFile={(type: any) => {typeVariable = 1; openDrive(type);}}
			contractsClick={(type: any) => {typeVariable = 1; addContractDocs(type);}}
			localFileClick={(data: any) => {typeVariable = 1; localFileUpload(data);}}
			showDownloadButton={true}
			fileDownload={(data: any) => {download(data, 'Files');}}
		></DocUploader>
		<div>
		<div className='doc-uploadd-header'>
			<span className="doc-lbl-hdr-bold">Specifications</span>
		</div>
		<div className='specifications-container'>
			<IQButton
				className='specifications-add-btn'
			onClick={()=>setOpenAddSpecDlg(true)}
			>
			<span style={{marginRight: '6px',fontSize: '19px'}} className='common-icon-Add'></span><span> Add Specifications</span>
			</IQButton>
			<div className="icon-section">
            <IQTooltip title="Delete" placement="bottom">
              <IconButton
                className="ref-delete-btn"
                disabled={selected.length === 0}
              >
                <span className="common-icon-delete"></span>
              </IconButton>
            </IQTooltip>
          </div>
		</div>
		<div className="doc-file-grid-view" style={{height: '430px',overflow: 'auto' , marginBottom: '0px'}}>
			<SUIGrid
			headers={headers}
			data={specModifiedList}
			rowSelected={(e: any) => rowSelected(e)}
			getRowId={(record: any) => record.data.id}
			/>
      	</div>
	</div>
		{ openSpecDocViewer ?(
			<SpecDocViewer
				 specBookPagesData={specBookPagesData} 
				 selectedRecord={sepcSelectedRecord} 
				 closeSpecDocViewer={closeSpecDocViewer}
				 />):<>
			</>
		}
	</div>
	)
};