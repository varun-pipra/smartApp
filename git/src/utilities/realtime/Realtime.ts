import RTDataManager from 'utilities/realtime/RTDataManager';

interface RTDocumentProps {
	projectUid: string;
	documentId: string;
	baseUrl: string;
	appzoneRTCServerUrl: string;
};

const onRTDocumentChange = (path: string, rtDocument: any, listener: any) => {
	if(rtDocument && rtDocument.realTimeDocument && rtDocument.realTimeDocument._rtDocument) {
		console.log(`Created RTDocment change event for PATH: ${path}`);
		let pathObject = rtDocument.realTimeDocument._rtDocument.at && rtDocument.realTimeDocument._rtDocument.at(path);
		console.log(`Created RTDocment path object for PATH: `, pathObject);
		pathObject && pathObject.on('change', '**', listener);
		return;
	}
};

export const initRTDocument = (appInfo: any, path: string, documentId: string, listener: any) => {
	const config: RTDocumentProps = {
		projectUid: appInfo.uniqueId,
		documentId: documentId,
		baseUrl: appInfo.hostUrl,
		appzoneRTCServerUrl: appInfo.appzoneRTCServerUrl
	};

	try {
		let rtdManager = new RTDataManager(config);
		document.addEventListener('uitestrt', function (event: any) {
			if(event.detail && rtdManager && rtdManager.updateRealTimeModel) {
				rtdManager.updateRealTimeModel(path, path, event.detail, 2);
			}
		});
		addListener(path, rtdManager, listener);
		console.log(`Created RTDocment for PATH: ${path}`);
	} catch(e) {
		console.log('Failed to create RTDocument', e);
	}
	return;
};

const addListener = (path: string, rtdManager: any, listener: any) => {
	const realTimeDocument = rtdManager.realTimeDocument;
	const _rtDocument = realTimeDocument?._rtDocument;

	if(!_rtDocument)
		setTimeout(() => {
			addListener(path, rtdManager, listener);
		}, 1000);
	else onRTDocumentChange(path, rtdManager, listener);
};