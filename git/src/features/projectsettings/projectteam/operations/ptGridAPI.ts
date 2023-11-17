import { isLocalhost, localServer } from 'app/utils';
/**
 * This function fetches the list of Project Team Members
 */
const moduleName = "Project Team: Grid Data";

export const fetchPtGridDataList = async (appInfo: any, payload: any, callback: any) => {
	let response;
	// if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/GetMembersSafetyData?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}`);
	if (isLocalhost) response = await fetch(`https://5ba09a787d0a4ea1bc0f0c1420152d1c.smartappbeta.com/Enterprisedesktop/api/v2/users/filtered?sessionId=3a62f03dd83d4e25b36fc38e5213fe1d`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({"projectId":"6e83792a-3e66-49d6-9442-c6a1e918b48f","limit":10000,"offset":0,"sortBy":"lastName","sortDirection":"ASC"})
	});
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/List.json?cache=${new Date().getTime()}`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/GetMembersSafetyData?_dc=1682926868070&projectId=531979&page=1&start=0&limit=25');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	};
	const responseData = await response.json(),
		gridData = responseData?.values || responseData?.data || [];
	// if (gridData && gridData.length > 0) {
	// postMessage({
	// 	event: 'projectteam',
	// 	evnt: 'updatetotalcount',
	// 	body: {
	// 		evt: "updatetotalcount",
	// 		totalCount: responseData?.actualCount || gridData?.length || 0
	// 	},
	// 	data: {
	// 		evt: "updatetotalcount",
	// 		totalCount: responseData?.actualCount || gridData?.length || 0
	// 	}
	// });
	// }
	const modifiedRespone = gridData.map((row: any, index: number) => {
		return { ...row,
			rowNum:index, 
			// rowId: row.id + '-' + new Date().getTime(), 
			roleIds: row.roles?.map((r: any) => r.objectId) }
	});
	callback && callback(modifiedRespone, responseData?.totalCount);
};

export const fetchSSRPtGridDataList = async (appInfo: any, payload: any, callback: any) => {
	let response: any;
	if (isLocalhost) response = await fetch(`https://8f55be2adf864ace8c8c0243eb53f010.smartappbeta.com/Enterprisedesktop/api/v2/users/filtered1?sessionId=2fe3b5f4770c4de396beb34651f8cd96`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});
	else {
		response = await fetch(`${appInfo?.hostUrl}/Enterprisedesktop/api/v2/users/filtered1?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload)
		});
	}

	const responseData = await response.json(),
		gridData = responseData?.values || responseData?.data || [];
	if (payload && !payload.groupByValue) {
		postMessage({
			event: 'projectteam',
			evnt: 'updatetotalcount',
			body: {
				evt: "updatetotalcount",
				totalCount: responseData?.actualCount || gridData?.length || 0
			},
			data: {
				evt: "updatetotalcount",
				totalCount: responseData?.actualCount || gridData?.length || 0
			}
		});
	}
	callback && callback(responseData.data, responseData?.totalCount);
};

export const fetchRolesDataList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		let apiURL;
		if (!appInfo?.isMTA || appInfo?.isFromZone) {
			apiURL = `${appInfo?.hostUrl}/admin/users/roles`;
		} else {
			apiURL = `${appInfo?.hostUrl}/api/Project/${appInfo?.gblConfig?.project?.projectCentralUniqueId}/members/roles`;
		}
		apiURL = apiURL + `?sessionId=${appInfo?.sessionId}&showAppRoles=true&projectId=${appInfo?.projectId}`;
		response = await fetch(apiURL);
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/Roles.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/admin/users/roles?_dc=1682948043233&showAppRoles=true&page=1&start=0&limit=25');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const hasSupplementalInfo = async (appInfo: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/admin/users/hassupplementalapp?sessionId=${appInfo?.sessionId}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify([1])
	});
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/hassupplementalapp.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/admin/users/hassupplementalapp?_dc=1682948043233', {
				method: 'POST',
				body: JSON.stringify([1])
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchSafetyColumnsData = async (appInfo: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/GetSafetyColumns?sessionId=${appInfo?.sessionId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetSafetyColumns.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/GetSafetyColumns?_dc=1682948043233');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchRTLSUserData = async (appInfo: any, fromDate: any, filterFromDate: any, filterToDate: any) => {
	let response,
		payload = {
			projectId: appInfo?.projectId,
			fromDate: fromDate,
			filterFromDate: null,
			filterToDate: null
		};
	if (filterFromDate && filterToDate) {
		payload = { ...payload, filterFromDate, filterToDate }
	}
	if (!isLocalhost) {
		const anyConnectUrl = appInfo?.hostUrl.replace(appInfo?.hostUrl.split('.')[0], appInfo?.hostUrl.split('.')[0] + 'anyconnect');
		response = await fetch(`${anyConnectUrl}/offline_web/${appInfo?.urlAppZoneID}/getRTLSUserData?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/getRTLSUserData.json?dc=` + new Date().getTime());
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/offline_web/8f55be2adf864ace8c8c0243eb53f010/getRTLSUserData?_dc=1682948043233', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const getUserRTLSData = async (appInfo: any, payLoad: any, callback: any) => {
	let response,
		jsonData: any = {
			fromDate: payLoad?.fromDate,
			filterFromDate: null,
			filterToDate: null
		};
	if (payLoad?.userIds) {
		jsonData['userIds'] = payLoad?.userIds;
	} else {
		jsonData['projectId'] = appInfo?.projectId;
	}
	if (payLoad?.filterFromDate && payLoad?.filterToDate) {
		jsonData['filterFromDate'] = payLoad?.filterFromDate;
		jsonData['filterToDate'] = payLoad?.filterToDate;
	}
	if (!isLocalhost) {
		const anyConnectUrl = appInfo?.hostUrl.replace(appInfo?.hostUrl.split('.')[0], appInfo?.hostUrl.split('.')[0] + 'anyconnect');
		response = await fetch(`${anyConnectUrl}/offline_web/${appInfo?.urlAppZoneID}/getRTLSUserData?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(jsonData)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/getRTLSUserData.json?dc=` + new Date().getTime());
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/offline_web/8f55be2adf864ace8c8c0243eb53f010/getRTLSUserData?_dc=1682948043233', {
				method: 'POST',
				body: JSON.stringify(jsonData)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData?.values || []);
};
export const memberPrivilegeApi = async (appInfo: any, payLoad: any, status: any, callback: any) => {
	let response,
		isMTA = (appInfo?.gblConfig?.project?.isProjectCentralZone),
		isOpenedFromProjCtrl = (appInfo?.viewConfig?.openFrom === 'ProjectCentral');
	if (!isLocalhost) {
		let url;
		if (status == "Active") {
			if (!isMTA) {
				url = `${appInfo?.hostUrl}/admin/users/DeactivateMulti`;
			} else {
				if (isOpenedFromProjCtrl) {
					url = `/api/Project/${appInfo?.viewConfig?.currentProjectRecord?.id}/members/DeactivateMulti`;
				} else {
					url = `${appInfo?.gblConfig?.saxhome}/api/Project/${appInfo?.gblConfig?.project?.projectCentralUniqueId}/members/DeactivateMulti`;
				}
			}
		} else {
			if (!isMTA) {
				url = `${appInfo?.hostUrl}/admin/users/ActivateMulti`;
			} else {
				if (isOpenedFromProjCtrl) {
					url = `api/Project/${appInfo?.viewConfig?.currentProjectRecord?.id}/members/ActivateMulti`;
				} else {
					url = `${appInfo?.gblConfig?.saxhome}/api/Project/${appInfo?.gblConfig?.project?.projectCentralUniqueId}/members/ActivateMulti`;
				}
			}
		}
		if (isMTA && !isOpenedFromProjCtrl) {
			payLoad = {
				url: url,
				payload: payLoad
			};
			url = `${appInfo?.hostUrl}/Enterprisedesktop/SAX/API/EndPoint?sessionId=${appInfo?.sessionId}`;
		}
		response = await fetch(url, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payLoad)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/ActivateMulti.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/admin/users/ActivateMulti`, {
				method: 'POST',
				body: JSON.stringify(payLoad)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const deleteMemberApi = async (appInfo: any, selectedRecords: any, callback: any) => {
	let isMTA = (appInfo?.gblConfig?.project?.isProjectCentralZone),
		isOpenedFromProjCtrl = (appInfo?.viewConfig?.openFrom === 'ProjectCentral'),
		apiList = [];
	if (!isLocalhost) {
		let url: any, projectId = appInfo?.glConfig?.currentProjectInfo?.id;
		if (!isMTA) {
			if (appInfo?.viewConfig?.isGlobalUsers) {
				projectId = appInfo?.viewConfig?.currentProjectRecord?.id || projectId;
			}
			url = `${appInfo?.hostUrl}/admin/users/Delete`;
		} else {
			if (isOpenedFromProjCtrl) {
				url = `/api/Project/${appInfo?.viewConfig?.currentProjectRecord?.id}/members/Delete`;
			} else {
				url = `${appInfo?.gblConfig?.saxhome}/api/Project/${appInfo?.gblConfig?.project?.projectCentralUniqueId}/members/Delete`;
			}
		}
		if (appInfo?.viewConfig?.openFrom !== "EnterpriseDesktop" && !(appInfo?.viewConfig?.isOpenedFromProjectCentral)) {
			projectId = null;
		}
		apiList = selectedRecords.map((item: any) => {
			return new Promise((resolve, reject) => {
				let apiUrl = `${url}/${item.objectId}${appInfo?.viewConfig?.isFromZone && isMTA ? '?globalid=' + (appInfo?.gblConfig?.globalID) || '' : ''}`,
					payload = null;
				if (isMTA && !isOpenedFromProjCtrl) {
					payload = {
						url: apiUrl,
						payload: { projectId }
					};
					apiUrl = `${appInfo?.hostUrl}/Enterprisedesktop/SAX/API/EndPoint?sessionId=${appInfo?.sessionId}`;
				} else {
					payload = { projectId }
				}
				fetch(apiUrl, {
					method: 'DELETE',
					body: JSON.stringify(payload)
				}).then((res) => {
					resolve(res.json());
				})
					.catch(error => {
						reject(error);
					});
			})
		});

		Promise.all(apiList).then(() => {
			callback && callback();
		});

	} else {
		apiList = selectedRecords.map((item: any) => {
			return new Promise((resolve, reject) => {
				if (localServer) {
					fetch(`${localServer}projectteam/Delete.json`);
				} else {
					fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/admin/users/Delete`, {
						method: 'DELETE'
					}).then((res) => {
						resolve(res.json());
					})
						.catch(error => {
							reject(error);
						});
				}

			})
		});

		Promise.all(apiList).then(() => {
			callback && callback();
		});
	}
};
export const approveWorkersApi = async (appInfo: any, payLoad: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/ApproveWorkers?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payLoad)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/ApproveWorkers.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/ApproveWorkers`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payLoad)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const memberInviteApi = async (appInfo: any, payLoad: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/admin/users/ReSendUserInvite?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payLoad)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/ReSendUserInvite.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/admin/users/ReSendUserInvite`, {
				method: 'POST',
				body: JSON.stringify(payLoad)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const printWorkerBadge = async (appInfo: any, payload: any, userId: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Flyer.iapi/PrintWorkerBadgeBySide/${userId}?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/PrintWorkerBadgeBySide.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Flyer.iapi/PrintWorkerBadgeBySide/${userId}`, {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const addSafetyViolation = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violations?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload.data)
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/addSafetyViolation.json`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violations`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		callback && callback(response);
		//throw new Error(message);
	} else {
		const responseData = await response.json();

		callback && callback(responseData);
	};
};
export const expungeSafetyViolation = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violations/${payload.violationId}/expunge?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload.data)
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/expungeSafetyViolation.json`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violations/${payload.violationId}`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const deleteSafetyViolation = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violations/${payload.violationId}?sessionId=${appInfo?.sessionId}`, {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload.data)
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/deleteSafetyViolation.json`, {
				method: 'DELETE',
				body: JSON.stringify(payload.data)
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violations/${payload.violationId}`, {
				method: 'DELETE',
				body: JSON.stringify(payload.data)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	if (response.status === 204) {
		callback && callback(true);
	}
	const responseData = await response.json();

	callback && callback(responseData ?? true);
};
export const blockUser = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/users/${payload.userUniqueId}/block?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload.data)
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/blockUnBlockUser.json`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/users/${payload.userUniqueId}/block`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const unBlockUser = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/users/${payload.userUniqueId}/reinstate?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload.data)
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/blockUnBlockUser.json`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/users/${payload.userUniqueId}/reinstate`, {
				method: 'POST',
				body: JSON.stringify(payload.data)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
