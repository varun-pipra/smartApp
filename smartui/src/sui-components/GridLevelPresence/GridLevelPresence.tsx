import * as React from 'react';
import PresenceManager from 'utilities/presence/PresenceManager.js';
import { postMessage } from 'app/utils';
import './GridLevelPresence.scss';

export interface GridLevelPresenceProps {
	params:any;
	presenceData:any;
	refreshPresence:any;
	joinPresence:any;
	exitPresence:any;
}

const SUIGridLevelPresence = (props: GridLevelPresenceProps) => {
	const {params, presenceData, refreshPresence, joinPresence, exitPresence} = props;
	const [presencePrevState, setPresencePrevState] = React.useState<any>([]);

	React.useEffect(() => {
		updateRowwisePresence();
	}, [presenceData, refreshPresence])

	React.useEffect(() => {
		if(joinPresence){
			postMessage(joinPresence);
		}
	}, [joinPresence])

	React.useEffect(() => {
		if(exitPresence){
			postMessage(exitPresence);
		}
	}, [exitPresence])
	

	const updatePresenceData = (pId: any, data: any) => {
		let presenceCmpRef = document.getElementById(pId) as any | null;
		if (presenceCmpRef) {
			let presenceManager = (presenceCmpRef.children && presenceCmpRef.children[0]) as any | null;
			if (presenceManager != null) {
				presenceManager.updateParticipants(data);
			}
		}
		return '';
	}

	const updateRowwisePresence = () => {
		let data:any = {
			"f991abc3-7496-4721-8365-8b03ec0539b3": [
				{
					"userid": "7480a85f-28bc-4dc1-9ef2-49d139a13e2a",
					"name": "Pradhan, Binaya",
					"email": "bpradhan@smartapp.com",
					"profile": "https://central.smartappbeta.com/images/f9bdd176-2904-4271-a45e-22150dd770ec",
					"color": "#080808",
					"company": "SubContSync",
					"self": false
				}
			]
		}
		let pids = Object.keys(data);
		if (presencePrevState.length) {
			presencePrevState.forEach((id: any) => {
				if (!pids.includes(id)) {
					updatePresenceData(id, []);
				}
			});
		}
		setPresencePrevState(pids);
		pids.forEach((pId) => {
			updatePresenceData(pId, data[pId]);
		})
	}

	const addPresenceListener = (presenceManager: any, roomId?: any) => {
		if (presenceManager && presenceManager.control) {
			let participantCtrl = presenceManager.control;
			participantCtrl.addEventListener('presencecountclick', function (e: any) {
				let participantsjson = participantCtrl.getParticipants(),
					participantids = [];
				if (participantsjson) {
					for (var i = 0; i < participantsjson.length; i++) {
						participantids.push((participantsjson[i].userid))
					}
				}
				postMessage({
					event: "launchlivechat",
					body: { iframeId: "budgetManagerIframe", roomId: roomId, appType: "BudgetManagerLineItem_" + roomId },
					livechatData: { participantsIds: participantids }
				});
			});
			participantCtrl.addEventListener('presenceuserclick', function (e: any) {
				postMessage({
					event: "launchcontactcard",
					body: { iframeId: "budgetManagerIframe", roomId: roomId, appType: "BudgetManagerLineItem_" + roomId },
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
					event: "launchcontactcard",
					body: { iframeId: "budgetManagerIframe", roomId: roomId, appType: "BudgetManagerLineItem_" + roomId },
					data: {
						pageX: e.event.pageX,
						pageY: e.event.pageY,
						userId: e.data,
						openAction: 'hover'
					}
				});
			});
			return;
		}
		setTimeout(function () {
			addPresenceListener(presenceManager, roomId);
		}, 1000);
	}

	const generatePresenceToolIds = (data: any) => {
		const presenceId = data.id;
		const presenceTools = <React.Fragment>{
			<>
				<div id={presenceId} className='budgetmanager-presence'></div>
			</>
		}</React.Fragment>
		return presenceTools;
	}

	const renderPresence = (presenceId: any) => {
		let presenceManager = new PresenceManager({
			domElementId: presenceId,
			initialconfig: {
				'showLiveSupport': false,
				'showLiveLink': false,
				'showStreams': false,
				'showComments': false,
				'showChat': false,
				'hideProfile': true,
				'participants': [],
				'maxUser': 1
			}
		});
		addPresenceListener(presenceManager, presenceId);
		return '';
	}

	return (
		<div className='grid-level-presence-cont presence-tools'>
			{[generatePresenceToolIds(params?.data)].map((presenceTool: any) => presenceTool)}
			<span>{renderPresence(params?.data?.id)}</span>
		</div>
	)
};


export default SUIGridLevelPresence;