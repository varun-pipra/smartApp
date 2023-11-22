import {getServer} from 'app/common/appInfoSlice';

import {useAppDispatch, useAppSelector, useFilePreview, useLocalFileUpload} from 'app/hooks';
import {postMessage} from 'app/utils';
import {getSelectedRecord, setSelectedRecord, setShowContracts} from 'features/bidmanager/stores/BidManagerSlice';
import {uploadReferenceFile} from 'features/bidmanager/stores/FilesAPI';
import {
	getFileObject, getUploadQueue, setUploadQueue
} from 'features/bidmanager/stores/FilesSlice';
import {useEffect, useState} from 'react';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import {fileDownload} from 'app/hooks';

export const ReferenceFiles = ({iFrameId, appType, readOnly}: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const bidPackage = useAppSelector(getSelectedRecord);
	const fileObject = useAppSelector(getFileObject);
	const fileQueue = useAppSelector(getUploadQueue);

	let typeVariable: any;

	const addContractDocs = (type: any) => {
		setFileType(getTypeValue(type));
		dispatch(setShowContracts(true));
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

	return <div className='referenceFile'>
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
		<DocUploader
			width={'1070px'}
			height={'200px'}
			folderType='SpecBooks'
			docLabel={'Specifications'}
			btnLabel={'Add Specifications'}
			onImageClick={openPreview}
			onImageDelete={deleteImage}
			imgData={fileObject.specs}
			readOnly={readOnly}
			onProjectFile={(type: any) => {typeVariable = 20; openDrive(type);}}
			localFileClick={(data: any) => {typeVariable = 20; localFileUpload(data);}}
			showDownloadButton={true}
			fileDownload={(data: any) => {download(data, 'SpecBooks');}}
		></DocUploader>
	</div>;
};