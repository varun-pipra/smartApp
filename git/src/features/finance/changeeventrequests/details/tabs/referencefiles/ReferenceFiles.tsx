import './ReferenceFiles.scss';
import React, { useEffect, useState } from 'react';
import { postMessage } from 'app/utils';
import { getServer } from 'app/common/appInfoSlice';
import { useAppSelector, useFilePreview, useLocalFileUpload, useAppDispatch } from 'app/hooks';
import DocUploader from 'sui-components/DocUploader/DocUploader';
import { fileDownload } from 'app/hooks';
import { deleteChangeEventFiles, addChangeEventFiles } from '../../../stores/ChangeEventAPI';
import { setReferenceFiles, getReferenceFiles, addReferenceFiles, getChangeEventById, getChangeEventFiles, setDriveFiles } from '../../../stores/ChangeEventSlice';
import { isChangeEventClient, isChangeEventSC } from 'app/common/userLoginUtils';

const ReferenceFiles = (props: any) => {
	const dispatch = useAppDispatch();
	let iFrameId = 'changeEventRequestsIframe';
	const appInfo = useAppSelector(getServer);
	const appType = 'ChangeEventRequests';
	const { changeRequestDetails, driveFiles = [] } = useAppSelector(state => state.changeEventRequest);
	const referenceFiles = useAppSelector(getReferenceFiles);
	const isReadonly = isChangeEventClient() || isChangeEventSC() ? true : !['Draft', 'SentBackForRevision', 'Rejected']?.includes(changeRequestDetails?.status);

	useEffect(() => {
		dispatch(getChangeEventFiles({ appInfo: appInfo, changeEventId: changeRequestDetails?.id }));
	}, [changeRequestDetails]);

	useEffect(() => {
		if (driveFiles?.length > 0) {
			saveFilesFromDrive(appInfo, [...driveFiles]);
			dispatch(setDriveFiles([]));
		}
	}, [appInfo, driveFiles]);

	const saveFilesFromDrive = (appInfo: any, fileList: Array<any>) => {
		const files = driveFiles.map((file: any) => {
			return {
				stream: {
					driveObjectId: file.id
				}
			};
		});
		//dispatch(addReferenceFiles({ appInfo: appInfo, changeEventId: changeRequestDetails?.id, files: files }));
		addChangeEventFiles(appInfo, changeRequestDetails?.id, files)
			.then((res: any) => {
				console.log('responseAddCangeeventfiles', res);
				dispatch(getChangeEventFiles({ appInfo: appInfo, changeEventId: changeRequestDetails?.id }));

			});
	};

	const openDrive = () => {
		let params: any = { iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType, folderType: 'Drawings' };
		postMessage({ event: 'getdrivefiles', body: params });
	};

	const localFileUpload = (data: any) => {
		useLocalFileUpload(appInfo, data).then((fileList: any) => {
			// console.log('fileList', fileList);
			const structuredFiles = fileList?.map((file: any) => {
				return {
					name: file.name,
					stream: {
						fileId: file.id
					}
				};
			});
			// dispatch(addReferenceFiles({ appInfo: appInfo, changeEventId: changeRequestDetails?.id, files: structuredFiles }))
			// 	.then((response: any) => {
			// 		console.log('responseAddCangeeventfiles', response);
			// 		dispatch(getChangeEventFiles({ appInfo: appInfo, changeEventId: changeRequestDetails?.id }));
			// 	});
			addChangeEventFiles(appInfo, changeRequestDetails?.id, structuredFiles)
				.then((res: any) => {
					console.log('responseAddCangeeventfiles', res);
					dispatch(getChangeEventFiles({ appInfo: appInfo, changeEventId: changeRequestDetails?.id }));
				});
		});
	};

	const openPreview = (files: Array<any>, index: number) => {
		useFilePreview(iFrameId, appInfo, appType, files, index);
	};

	const deleteImage = (item: any) => {
		// console.log('item', item);
		deleteChangeEventFiles(appInfo, changeRequestDetails.id, [{ id: item.id }])
			.then(() => {
				dispatch(getChangeEventFiles({ appInfo: appInfo, changeEventId: changeRequestDetails?.id }));
			});
	};

	const download = (data: any, fileType: any) => {
		const ids = data?.map((item: any) => item.id);
		const filename = fileType;
		fileDownload(ids, filename);
	};

	return (
		<div className='ev-referencefiles'>
			{/* <div className='eventrequest-details-box'>
				<div className='eventrequest-details-header'>
					<div className='title-action'>
						<span className='common-icon-contract-files iconmodify'></span>
						<span className='title' style={{ marginLeft: '6px' }}>Reference Files</span>
					</div>
				</div>
			</div> */}
			<DocUploader
				width={'1070px'}
				height={'200px'}
				folderType='Drawings'
				btnLabel={'Add Reference Files'}
				docLabel={'Reference Files'}
				onImageClick={openPreview}
				onImageDelete={deleteImage}
				imgData={referenceFiles && referenceFiles?.length > 0 ? referenceFiles : []}
				readOnly={isReadonly}
				onProjectFile={() => openDrive()}
				localFileClick={(data: any) => localFileUpload(data)}
				showDownloadButton={true}
				fileDownload={(data: any) => { download(data, 'Drawings'); }}
				docPlaceholder={'Click on + to add Reference Files'}
				icon={'common-icon-standard-contract'}
				showIcon={true}
				labelIcon={'common-icon-contract-files iconmodify'}
				showlabelIcon={true}
			></DocUploader>
		</div>
	);
};

export default ReferenceFiles;