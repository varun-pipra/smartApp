import PresenceManager from 'utilities/presence/PresenceManager.js';
import { postMessage } from 'app/utils';

export const renderPresence = (presenceProps: any, appInfoData: any, iFrameId: string, appType: string, lid = null, lname = null) => {
	if (presenceProps?.presenceId) {
		let presenceManager = new PresenceManager({
			domElementId: presenceProps?.presenceId,
			initialconfig: {
				showBrena: presenceProps?.showBrena,
				showLiveSupport: presenceProps?.showLiveSupport,
				showLiveLink: presenceProps?.showLiveLink,
				showStreams: presenceProps?.showStreams,
				showComments: presenceProps?.showComments,
				showChat: presenceProps?.showChat,
				hideProfile: presenceProps?.hideProfile,
				participants: [appInfoData?.currentUserInfo || '']
			}
		});
		addPresenceListener(presenceManager, appInfoData, iFrameId, appType, lid, lname);
	}
};

export const addPresenceListener = (presenceManager: any, appInfo: any, iFrameId: string, appType: string, lineItemId: any, lineItemName: any) => {
	// console.log('addPresenceListener', { iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType })
	if (presenceManager && presenceManager.control) {
		let participantCtrl = presenceManager.control;
		participantCtrl.addEventListener('brenabtnclick', function (e: any) {
			postMessage({ event: 'openbrena' });
		});

		participantCtrl.addEventListener('livesupportbtnclick', function (e: any) {
			postMessage({
				event: 'help',
				body: { iframeId: iFrameId, roomId: appInfo && appInfo.presenceRoomId, appType: appType }
			});
		});

		participantCtrl.addEventListener('livelinkbtnclick', function (e: any) {
			postMessage({
				event: 'launchcommonlivelink',
				body: { iframeId: iFrameId, roomId: appInfo.presenceRoomId, appType: appType },
				data: participantCtrl.getParticipants()
			});
		});

		participantCtrl.addEventListener('streambuttonclick', function (e: any) {
			postMessage({
				event: 'launchcommonstream',
				body: { iframeId: iFrameId, roomId: lineItemId ? lineItemId : appInfo.presenceRoomId, appType: appType },
				data: participantCtrl.getParticipants()
			});
		});

		participantCtrl.addEventListener('commentbuttonclick', function (e: any) {
			postMessage({
				event: 'launchcommoncomment',
				body: { iframeId: iFrameId, roomId: appInfo.presenceRoomId, appType: appType },
				data: participantCtrl.getParticipants()
			});
		});

		participantCtrl.addEventListener('presencecountclick', function (e: any) {
			let participantsjson = participantCtrl.getParticipants(),
				participantids = [];
			if (participantsjson) {
				for (var i = 0; i < participantsjson.length; i++) {
					participantids.push((participantsjson[i].userid));
				}
			}
			postMessage({
				event: 'launchlivechat',
				body: { iframeId: iFrameId, roomId: appInfo.presenceRoomId, appType: appType },
				livechatData: { participantsIds: participantids }
			});
		});

		participantCtrl.addEventListener('presenceuserclick', function (e: any) {
			postMessage({
				event: 'launchcontactcard',
				body: { iframeId: iFrameId, roomId: appInfo.presenceRoomId, appType: appType },
				data: {
					pageX: e.event.pageX,
					pageY: e.event.pageY,
					userId: e.data,
					openAction: 'click'
				}
			});
		});

		participantCtrl.addEventListener('presenceuserhover', function (e: any) {
			postMessage({
				event: 'launchcontactcard',
				body: { iframeId: iFrameId, roomId: appInfo.presenceRoomId, appType: appType },
				data: {
					pageX: e.event.pageX,
					pageY: e.event.pageY,
					userId: e.data,
					openAction: 'hover'
				}
			});
		});

		document.addEventListener('updateparticipants', function (event: any) {
			if (event.detail.appType === appType) {
				participantCtrl.updateParticipants(event.detail.data);
			}
		});

		document.addEventListener('updatecommentbadge', function (event: any) {
			if (event.detail.appType === appType) {
				let chatCount = event.detail.data,
					animation = (chatCount.eventType === 'commentReceived') ? true : false;
				participantCtrl.setButtonBadge('comment', chatCount.count, animation);
			}
		});

		if (appInfo) {
			postMessage({
				event: 'joinroom',
				body: { iframeId: iFrameId, roomId: lineItemId ? lineItemId : appInfo.presenceRoomId, appType: appType, roomTitle: lineItemName }
			});
		}
		return;
	}

	setTimeout(function () {
		addPresenceListener(presenceManager, appInfo, iFrameId, appType, lineItemId, lineItemName);
	}, 1000);
};