import { useAppDispatch, useAppSelector, useDriveFileBrowser, useFilePreview, useLocalFileUpload, fileDownload } from 'app/hooks';
import React, { useRef, useEffect, useCallback, useState, memo } from 'react';
import { postMessage, isLocalhost } from 'app/utils';
import SUIContractDocuments from 'sui-components/ContractDocuments/ContractDocuments';
import DocUploader from 'sui-components/DocUploader/DocUploader';

import './ClientContractFiles.scss';

import { getServer } from 'app/common/appInfoSlice';
import { getClientContractDetails, getSelectedRecord, setShowContractAttachments } from '../../../stores/ClientContractsSlice';
import { getStandardFiles, getAdditionalFiles, setAdditionalFiles, setStandardFiles, setContractFilesCount } from '../../../stores/tabs/contractfiles/CCContractFilesTabSlice';
import { deleteContractFiles, addContractFiles } from '../../../stores/tabs/contractfiles/CCContractFilesTabAPI';
import { contractDetail } from '../../../stores/tabs/contractfiles/CCContractFilesData';
import SUIAlert from 'sui-components/Alert/Alert';

interface ClientContractFilesProps {
	readOnly: boolean;
};

const ClientContractFiles = ({ readOnly }: ClientContractFilesProps) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const currentContract = useAppSelector(getSelectedRecord);
	const { selectedRecord } = useAppSelector(state => state.clientContracts)
	const standardFiles = useAppSelector(getStandardFiles);
	const additionalFiles = useAppSelector(getAdditionalFiles);
	const [selectedStandardFile, setSelectedStandardFile] = useState<any>(null);
	const [alert, setAlert] = React.useState<boolean>(false)
	const [deletingFiles, setDeletingFiles] = useState<any>();

	const openPreview = (files: Array<any>, index: number) => {
		setSelectedStandardFile(null);
		useFilePreview('clientContractsIframe', appInfo, 'ClientContracts', files, index);
	};

	useEffect(() => {
		if (isLocalhost) {
			const { standard = [], additional = [] } = contractDetail?.files || {};
			dispatch(setStandardFiles(standard));
			dispatch(setAdditionalFiles(additional));
			dispatch(setContractFilesCount((standard?.length || 0) + (additional?.length || 0)));
		}
	}, [contractDetail]);

	useEffect(() => {
		//const { files } = currentContract;
		const { standard = [], additional = [] } = selectedRecord?.files || {};
		dispatch(setStandardFiles(standard));
		dispatch(setAdditionalFiles(additional));
		dispatch(setContractFilesCount((standard?.length || 0) + (additional?.length || 0)));
	}, [selectedRecord]);

	useEffect(() => {
		if (selectedStandardFile) {
			console.log('selectedStandardFile',selectedStandardFile)
			const index = standardFiles?.findIndex((file: any) => file.id === selectedStandardFile.id);
			const formattedFileList = standardFiles?.map((file: any) => {
				const { id, name, thumbnail } = file;
				return {
					id, fileName: name, thumbnail
				}
			});
			console.log('formattedFileList',formattedFileList)
			openPreview(formattedFileList, index);
		}
	}, [selectedStandardFile]);

	const onImagePreview = (event: any) => {
		const { data } = event;
		setSelectedStandardFile(data);
	};

	const contractDocHeaders = [
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
			onCellClicked: onImagePreview,
			cellStyle: {
				display: 'flex',
				alignItems: 'left',
			},
			cellRenderer: (params: any) => {
				return <img src={params.value} />;
			}
		}
	];

	const deleteStandardFiles = (files: Array<any>) => {

		setDeletingFiles(files)
		setAlert(true)

	};

	const deleteAdditionalFiles = (file: any) => {
		deleteContractFiles(appInfo, selectedRecord.id, [{ id: file?.id, type: 'Additional' }])
			.then(() => {
				dispatch(getClientContractDetails({ appInfo: appInfo, contractId: selectedRecord.id }));
			});
	};

	const addContractDocs = () => {
		dispatch(setShowContractAttachments(true));
	};

	const openDrive = (folderType: string) => {
		useDriveFileBrowser({ iframeId: 'clientContractsIframe', roomId: appInfo && appInfo.presenceRoomId, appType: 'ClientContracts', folderType: folderType });
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
					dispatch(getClientContractDetails({ appInfo: appInfo, contractId: currentContract.id }));
				});
		});
	};
	const handleListChanges = (val: string) => {
		if (val == 'yes') {
			const deletionList = deletingFiles.map((item: any) => ({ id: item.id, type: 'Standard' }));
			deleteContractFiles(appInfo, currentContract.id, deletionList)
				.then(() => {
					dispatch(getClientContractDetails({ appInfo: appInfo, contractId: currentContract.id }));
					setAlert(false);
				});
		}
		else {
			setAlert(false)
		}
	}

	const download = (imgData: any, fileType: any) => {
		const ids = imgData?.map((item: any) => item.id);
		const filename = currentContract?.title + ' - ' + fileType;;
		fileDownload(ids, filename)
	}
	return (
		<div className='client-contract-files-container'>
			<div className='client-contract-header-text'>Contract Files</div>
			<SUIContractDocuments
				contractDocHeaders={contractDocHeaders}
				readOnly={readOnly}
				contractDocData={standardFiles.length > 0 ? standardFiles : []}
				deleteContractDocs={deleteStandardFiles}
				addContractDocs={addContractDocs}
				contractBtnLbl={'+ Add Standard Contract Documents'}
				contractHeader='Standard Contract Documents'
				showDownloadButton={true}
				fileDownload={(data: any) => { download(data, 'Files') }}
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
				showIcon={false}
			></DocUploader>
			<SUIAlert
				open={alert}
				contentText={<span>Are you sure want to continue?</span>}

				title={'Confirmation'}
				onAction={(e: any, type: string) => handleListChanges(type)}
			/>
		</div>
	);
};

export default ClientContractFiles;
