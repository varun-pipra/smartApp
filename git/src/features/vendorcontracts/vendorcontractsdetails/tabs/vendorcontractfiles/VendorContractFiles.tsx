import { useAppDispatch, useAppSelector, useDriveFileBrowser, useFilePreview, useLocalFileUpload } from 'app/hooks';
import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import { postMessage, isLocalhost } from 'app/utils';
import SUIContractDocuments from 'sui-components/ContractDocuments/ContractDocuments';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import { ColDef } from 'ag-grid-community';
import { fileDownload } from 'app/hooks';

import './VendorContractFiles.scss';

import { getServer } from 'app/common/appInfoSlice';
import { getContractDetailsById, getSelectedRecord, setShowContractAttachments } from '../../../stores/VendorContractsSlice';
import {
	getStandardFiles, getAdditionalFiles,
	setAdditionalFiles, setStandardFiles, setContractFilesCount
} from '../../../stores/tabs/contractfiles/VCContractFilesTabSlice';
import { deleteContractFiles, uploadLocalFile, addContractFiles } from '../../../stores/tabs/contractfiles/VCContractFilesTabAPI';
import { contractDetail } from '../../../stores/tabs/contractfiles/VCContractFilesData';

interface VendorContractFilesProps {
	readOnly: boolean;
};

const VendorContractFiles = ({ readOnly }: VendorContractFilesProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const currentContract = useAppSelector(getSelectedRecord);
	const standardFiles = useAppSelector(getStandardFiles);
	const additionalFiles = useAppSelector(getAdditionalFiles);
	const [selectedStandardFile, setSelectedStandardFile] = useState<any>(null);

	useEffect(() => {
		if (isLocalhost) {
			const { standard = [], additional = [] } = contractDetail?.files || {};
			dispatch(setStandardFiles(standard));
			dispatch(setAdditionalFiles(additional));
			dispatch(setContractFilesCount((standard?.length || 0) + (additional?.length || 0)));
		}
	}, [contractDetail]);

	useEffect(() => {
		if(currentContract){
			const { files } = currentContract;
			const { standard = [], additional = [] } = files || {};
			dispatch(setStandardFiles(standard));
			dispatch(setAdditionalFiles(additional));
			dispatch(setContractFilesCount((standard?.length || 0) + (additional?.length || 0)));
		}
	}, [currentContract]);

	useEffect(() => {
		if (selectedStandardFile) {
			const index = standardFiles?.findIndex((file: any) => file.id === selectedStandardFile.id);
			const formattedFileList = standardFiles?.map((file: any) => {
				const { id, name, thumbnail } = file;
				return {
					id, fileName: name, thumbnail
				}
			});

			openPreview(formattedFileList, index);
		}
	}, [selectedStandardFile]);

	const onImagePreview = (event: any) => {
		const { data } = event;
		setSelectedStandardFile(data);
	};

	const contractDocHeaders: ColDef[] = [
		{
			headerName: 'Document ID',
			field: 'documentId',
			maxWidth: 170,
			flex: 2,
			menuTabs: [],
			headerCheckboxSelection: true,
			checkboxSelection: true,
			cellStyle: {
				display: 'flex',
				alignItems: 'left',
			},
		},
		{
			headerName: 'File Name',
			menuTabs: [],
			field: 'name',
			minWidth: 200,
			flex: 2,
			cellStyle: {
				display: 'flex',
				alignItems: 'left',
			},
		},
		{
			headerName: 'Description',
			menuTabs: [],
			field: 'description',
			minWidth: 200,
			flex: 2,
			cellStyle: {
				display: 'flex',
				alignItems: 'left',
			},
		},
		{
			headerName: 'File',
			menuTabs: [],
			field: 'thumbnail',
			minWidth: 115,
			flex: 1,
			type: 'avatar',
			cellStyle: {
				display: 'flex',
				alignItems: 'left',
			},
			onCellClicked: onImagePreview,
			cellRenderer: (params: any) => {
				return <img src={params.value} />;
			}
		}
	];

	const deleteStandardFiles = (files: Array<any>) => {
		const deletionList = files.map(item => ({ id: item.id, type: 'Standard' }));
		deleteContractFiles(appInfo, currentContract.id, deletionList)
			.then(() => {
				dispatch(getContractDetailsById({ appInfo: appInfo, id: currentContract.id }));
			});
	};

	const deleteAdditionalFiles = (file: any) => {
		deleteContractFiles(appInfo, currentContract.id, [{ id: file.id, type: 'Additional' }])
			.then(() => {
				dispatch(getContractDetailsById({ appInfo: appInfo, id: currentContract.id }));
			});
	};

	const addContractDocs = () => {
		dispatch(setShowContractAttachments(true));
	};

	const openDrive = (folderType: string) => {
		useDriveFileBrowser({ iframeId: 'vendorContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'VendorContracts', folderType: folderType });
	};

	const openPreview = (files: Array<any>, index: number) => {
		useFilePreview('vendorContractsIframe', appInfo, 'VendorContracts', files, index);
	};

	const localFileUpload = (data: any) => {
		useLocalFileUpload(appInfo, data).then((fileList: any) => {
			const structuredFiles = fileList?.map((file: any) => {
				return {
					type: 'Additional',
					name: file.name,
					description: file.description,
					stream: {
						fileId: file.id
					}
				};
			});
			addContractFiles(appInfo, currentContract?.id, structuredFiles)
				.then((res: any) => {
					dispatch(setAdditionalFiles(res?.additional));
					dispatch(setContractFilesCount((res?.standard?.length || 0) + (res?.additional?.length || 0)));
					dispatch(getContractDetailsById({ appInfo: appInfo, id: currentContract.id }));
				});
		});
	};

	const download = (imgData: any, fileType: any) => {
		const ids = imgData?.map((item: any) => item.id);
		const filename = currentContract?.title + ' - ' + fileType;
		fileDownload(ids, filename)
	}

	return (
		<div className='vendor-contract-files-container'>
			<div className='vendor-contract-header-text'>Contract Files</div>
			<SUIContractDocuments
				readOnly={readOnly}
				contractDocHeaders={contractDocHeaders}
				contractDocData={standardFiles.length > 0 ? standardFiles : []}
				deleteContractDocs={deleteStandardFiles}
				addContractDocs={addContractDocs}
				contractBtnLbl={'+ Add Standard Contract Documents'}
				contractHeader='Standard Contract Documents'
			></SUIContractDocuments>

			<DocUploader
				width={'1070px'}
				height={'200px'}
				folderType='Drawing'
				btnLabel='Add Additional Contract Files'
				docLabel='Additional Contract Files'
				onImageDelete={deleteAdditionalFiles}
				imgData={additionalFiles.length > 0 ? additionalFiles : []}
				docSubLabel={'(You may to select files from DRIVE or drag and drop file(s) below)'}
				readOnly={readOnly}
				onImageClick={openPreview}
				onProjectFile={(folderType: any) => { openDrive(folderType) }}
				localFileClick={(data: any) => { localFileUpload(data) }}
				showDownloadButton={true}
				fileDownload={(data: any) => { download(data, 'Drawings') }}
				docPlaceholder={'Click on + to add Additional Contract Files'}
				icon={'common-icon-standard-contract'}
				showIcon={false}
			></DocUploader>
		</div>
	);
};

export default VendorContractFiles;
