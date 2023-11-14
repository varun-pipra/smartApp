import {postMessage} from 'app/utils';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';

import {store, RootState, AppDispatch} from './store';
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface PostMessageParams {
	iframeId: string;
	appType: string;
};

interface DriveFileParams extends PostMessageParams {
	roomId?: string;
	folderType?: string;
};

let server: any;
export const getServerInfo = () => {
	if (!server) {
		const rootState = store.getState();
		server = rootState?.appInfo?.server;
	}

	return server;
};

export const hideLoadMask = () => {
	const loader = document.getElementById('smartapp-react-loader');
	if (loader) {
		loader.style.display = 'none';
	}
};

export const useDriveFileBrowser = (params: DriveFileParams) => {
	postMessage({
		event: 'getdrivefiles',
		body: params
	});
};

export const useHomeNavigation = (frameId: string, appType: string) => {
	postMessage({
		event: 'gohome',
		body: {
			iframeId: frameId,
			appType: appType
		}
	});
};

export const useFilePreview = (iframe: string, appInfo: any, appType: string, files: Array<any>, index: number) => {
	const formattedList = files?.map((file: any) => {
		let { fileType, ...fileObj } = file;
		fileObj.fileType = null;
		return fileObj;
	});

	postMessage({
		event: 'quickview', body: {
			iframeId: iframe,
			roomId: appInfo && appInfo.presenceRoomId,
			appType: appType,
			filesIDArr: formattedList,
			fileIndex: index
		}
	});
};

export const useLocalFileUpload = async (appInfo: any, files: any, moduleName?: string) => {
	let fileObject = new FormData();
	for (let i = 0; i < files?.length; i++) {
		fileObject.append(`file${i}`, files[i]);
	}

	let response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/streams?sessionId=${appInfo?.sessionId}`, {
		method: 'POST',
		body: fileObject
	});

	if (!response.ok) {
		const message = `API Request Error (File Upload ${moduleName}): ${response.status}`;
		throw new Error(message);
	}

	const data = await response.json();
	return data;
};

export const fileDownload = (selectedids: any, filename: any) => {
	postMessage({
		event: 'handledownloadprocess',
		body: {
			selectedItems: selectedids,
			action: 'df',
			isFilesMode: true,
			FileName: filename
		}
	});
};