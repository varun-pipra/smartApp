import './Reference.scss';

import { getServer } from 'app/common/appInfoSlice';
import { useAppSelector, useFilePreview } from 'app/hooks';
import { prepareFileList } from 'features/bidmanager/stores/FilesSlice';
import { useEffect, useState } from 'react';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import { fileDownload } from 'app/hooks';

export const ReferenceFiles = ({ iFrameId, appType }: any) => {
	const appInfo = useAppSelector(getServer);
	const { selectedRecord, bidDetails } = useAppSelector((state) => state.bidResponseManager);
	const [files, setFiles] = useState<any>({});

	useEffect(() => {
		const filesObject = {
			drawings: prepareFileList(bidDetails?.referenceFiles ? bidDetails?.referenceFiles : [], 0),
			documents: prepareFileList(bidDetails?.referenceFiles ? bidDetails?.referenceFiles : [], 1),
			specs: prepareFileList(bidDetails?.referenceFiles ? bidDetails?.referenceFiles : [], 20)
		};
		setFiles(filesObject);
	}, [bidDetails]);

	const openPreview = (files: Array<any>, index: number) => {
		useFilePreview(iFrameId, appInfo, appType, files, index);
	};

	const download = (imgData: any, fileType: any) => {
		console.log('downloadimgData', imgData)
		const objectIds = imgData?.map((item: any) => item.objectId);
		const filename = selectedRecord?.name + ' - ' + fileType;
		fileDownload(objectIds, filename);
	};

	return (
		<div className='referenceFile'>
			<span className="header-text">Reference Files</span>
			<DocUploader
				width={'1070px'}
				height={'200px'}
				folderType='Drawing'
				docLabel={'Drawings'}
				onImageClick={openPreview}
				imgData={files?.drawings}
				readOnly={true}
				showDownloadButton={true}
				fileDownload={(data: any) => { download(data, 'Drawings'); }}
			></DocUploader>
			<DocUploader
				width={'1070px'}
				height={'200px'}
				folderType='File'
				docLabel={'Documents'}
				onImageClick={openPreview}
				imgData={files?.documents}
				readOnly={true}
				showDownloadButton={true}
				fileDownload={(data: any) => { download(data, 'Documents'); }}
			></DocUploader>
			<DocUploader
				width={'1070px'}
				height={'200px'}
				folderType='Specification'
				docLabel={'Specification'}
				onImageClick={openPreview}
				imgData={files?.specs}
				readOnly={true}
				showDownloadButton={true}
				fileDownload={(data: any) => { download(data, 'Specifications'); }}
			></DocUploader>
		</div>
	);
};