import { isLocalhost, localServer } from 'app/utils';
/**
 * This function fetches the list of Project Team Members
 */
const moduleName = "Project Team: Data";
export const fetchPaginationCompanies = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response =await fetch(`${appInfo?.hostUrl}/admin/companies/GetCompaniesData?sessionId=${appInfo?.sessionId}`, {
				method: 'POST',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify(payload),
		});
	} 
	else {
		// response =await fetch(`https://76e0aa5a9d1444a39437783ac8388138.smartappbeta.com/EnterpriseDesktop/Safety/Flyer.iapi/GetCompaniesData?sessionId=a965c1efc2074571bdaffb8440a2df1c`, {
		// 		method: 'POST',
		// 		headers: {"access-control-allow-origin" : "*",'content-type': 'application/json'},
		// 		body: JSON.stringify(payload),
		// });
		response = await fetch(`${localServer}projectteam/companies.json`);
	};
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();
	callback && callback(responseData);
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
export const fetchTradesDataList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Project/Trades/GetTrades?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetTrades.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Project/Trades/GetTrades?_dc=1683026053758&projectId=531979');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchWorkTeamsDataList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/Enterprisedesktop/WorkPlannerTeams/Teams?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/Teams.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/Enterprisedesktop/WorkPlannerTeams/Teams?_dc=1683026053758&projectId=531979');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchEmailSuggestionsList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Project/Project/GetEmailSuggestions?sessionId=${appInfo?.sessionId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetEmailSuggestions.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Project/Project/GetEmailSuggestions?_dc=1683026053758');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchCompaniesDataList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		let apiURL;
		if (!appInfo?.isMTA || appInfo?.isFromZone) {
			apiURL = `${appInfo?.hostUrl}/admin/companies`;
		} else {
			apiURL = `${appInfo?.hostUrl}/api/Project/${appInfo?.gblConfig?.project?.projectCentralUniqueId}/companies`;
		}
		apiURL = apiURL + `?sessionId=${appInfo?.sessionId}`;
		response = await fetch(apiURL);
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/companies.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/admin/companies?_dc=1683026053758');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchShiftDataList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Scheduling/WorkPlannerShifts/Shifts?sessionId=${appInfo?.sessionId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/Shifts.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Scheduling/WorkPlannerShifts/Shifts?_dc=1683026053758');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchActiveCalendarList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Calendar/SmartApp/GetActiveCalendars?sessionId=${appInfo?.sessionId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetActiveCalendars.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Calendar/SmartApp/GetActiveCalendars?_dc=1683026053758');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchSkillsDataList = async (appInfo: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Project/Skills/GetSkills?sessionId=${appInfo?.sessionId}`);
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetSkills.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Project/Skills/GetSkills?_dc=1683026053758');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchCategoriesDataList = async (appInfo: any, tradeId: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Flyer.iapi/Categories?sessionId=${appInfo?.sessionId}&tradeId=${tradeId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/Categories.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Flyer.iapi/Categories?_dc=1683026053758&tradeId=66');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	return (responseData?.values || []);
};
export const fetchPendingDocsData = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/HasPendingDocs?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}&tradeId=${payload?.tradeId}&userId=${payload?.userId}&skillId=${payload?.skillId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/HasPendingDocs.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/HasPendingDocs?_dc=1683026053758&projectId=531979&tradeId=66&userId=6424244&skillId=');
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData || []);
	//	return (responseData || {});
};
export const fetchSafetyManualsData = async (appInfo: any, payload: any, callback: any) => {
	let response,
		paramName = '&trades=',
		tradeUrlParam = paramName + (payload?.trades || []).join(paramName);
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/safety/flyer/SafetyManuals?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}${tradeUrlParam}&userId=${payload?.userId}`, {});
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/SafetyManuals.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/safety/flyer/SafetyManuals?_dc=1683026053758&projectId=531979${tradeUrlParam}&userId=${payload?.userId}`, {});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData.values || []);
	//return (responseData.values || []);
};
export const fetchSafetyCertificationData = async (appInfo: any, payload: any, callback: any) => {
	let response,
		paramName = '&trades=',
		tradeUrlParam = paramName + (payload?.trades || []).join(paramName);
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/safety/flyer/SafetyCertifications?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}${tradeUrlParam}&userId=${payload?.userId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/SafetyCertifications.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/safety/flyer/SafetyCertifications?_dc=1683026053758&projectId=531979${tradeUrlParam}&userId=${payload?.userId}`);
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData.values || []);
	//return (responseData.values || []);
};
export const upsertProbationData = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/UpsertProbation?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/UpsertProbation.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/UpsertProbation?_dc=1682948043233', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	let responseData = await response.json();
	responseData.values = payload;
	callback && callback(responseData.values || {});
};
export const fetchBadgeLayoutsData = async (appInfo: any, callback: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/GetBadgeLayouts?sessionId=${appInfo?.sessionId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetBadgeLayouts.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/GetBadgeLayouts`);
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const fetchWorkerBadgesData = async (appInfo: any, payload: any, callback: any) => {
	let response;
	let url;
	if (!isLocalhost) {
		if (payload.layout) {
			url = `${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/GetWorkerBadgeByLayout?sessionId=${appInfo?.sessionId}&id=${payload?.id}&layout=${payload.layout}`;
		} else {
			url = `${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/GetWorkerBadges?sessionId=${appInfo?.sessionId}&id=${payload?.id}`;
		}
		response = await fetch(url);
	}
	else {
		if (localServer) {
			if (payload.layout) {
				url = `${localServer}projectteam/GetWorkerBadgeByLayout.json`
			} else {
				url = `${localServer}projectteam/GetWorkerBadges.json`
			}
		} else {
			if (payload.layout) {
				url = `https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/GetWorkerBadgeByLayout?id=${payload?.id}&layout=${payload.layout}`;
			} else {
				url = `https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/GetWorkerBadges?id=${payload?.id}`;
			}
			response = await fetch(url);
		}
		response = await fetch(url);
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData.values);
};
export const fetchPrintersData = async (appInfo: any, callback: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/GetPrinters?sessionId=${appInfo?.sessionId}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetPrinters.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/GetPrinters`);
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData.values);
};
export const fetchRoleInfo = async (appInfo: any, payload: any, callback: any) => {
	const gblConfig = appInfo?.gblConfig;
	/* payload = {
		roleIds: '12;23', \\";" separated roleIds
		userId: 533789 \\ selected row's objectId
	} */
	let response,
		projectUID = gblConfig?.project?.projectCentralUniqueId || appInfo?.currentProjectInfo?.uniqueId,
		saxhome = gblConfig?.saxhome,
		isMTA = appInfo?.isMTA,
		globalID = gblConfig?.globalID,
		apiURL = '';
	if (!isMTA) {
		apiURL = `${appInfo?.hostUrl}/admin/roles/roledetailsbyids`;
	} else {
		apiURL = `${saxhome}/api/Project/${projectUID}/roles/getdetailsbyids`;
	}

	if (!isLocalhost) {
		apiURL = `${apiURL}?sessionId=${appInfo?.sessionId}&globalID=${globalID}&ids=${payload.roleIds}&userId=${payload.userId}`;
		if (saxhome) {
			apiURL = encodeURIComponent(apiURL);
			apiURL = `${appInfo?.hostUrl}/Enterprisedesktop/SAX/API/EndPoint?sessionId=${appInfo?.sessionId}&url=${apiURL}`;
		}
		response = await fetch(apiURL);
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetRoleInfo.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/GetRoleInfo`);
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const resendPoliciesCertificationLink = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/ResendPoliciesCertificationLink?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}&userId=${payload?.userId}&type=${payload?.type}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/ResendPoliciesCertificationLink.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Credential.iapi/ResendPoliciesCertificationLink`);
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};
export const getReports = async (appInfo: any, callback: any) => {
	let response,
		reportFor = "ProjectTeam";
	if (!isLocalhost) response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/project.mvc/GetReports?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}&reportFor=${reportFor}`);
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetReports.json`);
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/project.mvc/GetReports`);
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData.values || []);
};

export const updateSettings = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/project/project/UpdateSetting?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/UpdateSetting.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/project/project/UpdateSetting?_dc=1682948043233', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	let responseData = await response.json();
	responseData.values = payload;
	callback && callback(responseData.values || {});
};
export const updateGeneralPermissions = async (appInfo: any, payload: any, callback: any) => {
	const gblConfig = appInfo?.gblConfig;
	/* payload = {
		role: 0/1/2/4/5,
		userIds: [533789, 533659] \\ selected row's objectId
	} */
	let response,
		projectUID = gblConfig?.project?.projectCentralUniqueId || appInfo?.currentProjectInfo?.uniqueId,
		saxhome = gblConfig?.saxhome,
		isMTA = appInfo?.isMTA,
		isFromZone = appInfo?.isFromZone,
		globalID = gblConfig?.globalID,
		apiURL = '',
		payloadBody: any = { payload: payload.userIds };

	if (!isLocalhost) {
		if (!isMTA) {
			apiURL = `${appInfo?.hostUrl}/admin/users/MarkAsAdmins?sessionId=${appInfo?.sessionId}&roleid=${payload.role}&globalId=${globalID}`;
		} else {
			if (isFromZone) {
				apiURL = `${saxhome}/api/Project/${projectUID}/members/markasadmins/${payload.role}?sessionId=${appInfo?.sessionId}&globalid=${globalID}`;
				if (saxhome) {
					// apiURL = encodeURIComponent(apiURL);
					payloadBody.url = apiURL;
					apiURL = `${appInfo?.hostUrl}/Enterprisedesktop/SAX/API/EndPoint?sessionId=${appInfo?.sessionId}`;
				}
			} else {
				apiURL = `${appInfo?.hostUrl}/api/Project/${projectUID}/members/markasadmins/${payload.role}?sessionId=${appInfo?.sessionId}`;
			}
		}
		response = await fetch(apiURL, {
			method: 'POST',
			body: JSON.stringify(payloadBody)
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/updateGeneralPermissions.json`, {
				method: 'POST',
				body: JSON.stringify(payloadBody)
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/GetRoleInfo`, {
				method: 'POST',
				body: JSON.stringify(payloadBody)
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
export const updateVendorPermissions = async (appInfo: any, payload: any, callback: any) => {
	const gblConfig = appInfo?.gblConfig;
	/* payload = {
		roles: [{}],
		userIds: [533789, 533659] \\ selected row's objectId
	} */
	let response,
		projectUID = gblConfig?.project?.projectCentralUniqueId || appInfo?.currentProjectInfo?.uniqueId,
		saxhome = gblConfig?.saxhome,
		isMTA = appInfo?.isMTA,
		isFromZone = appInfo?.isFromZone,
		globalID = gblConfig?.globalID,
		apiURL = '';

	if (!isLocalhost) {
		if (!isMTA || isFromZone) {
			apiURL = `${appInfo?.hostUrl}/admin/users/UpdateUserProjectZonePermissions?sessionId=${appInfo?.sessionId}`;
		} else {
			apiURL = `${appInfo?.hostUrl}/api/Project/${projectUID}/members/ProjectZonePermissions?sessionId=${appInfo?.sessionId}&globalId=${globalID}`;
		}
		response = await fetch(apiURL, {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/updateGeneralPermissions.json`, {
				method: 'POST',
				body: JSON.stringify({ payload: payload.userIds })
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/GetRoleInfo`, {
				method: 'POST',
				body: JSON.stringify({ payload: payload.userIds })
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
export const getSafetyViolation = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload?.userUniqueId}/violations?sessionId=${appInfo?.sessionId}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/getSafetyViolation.json`, {
				method: 'GET'
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violations`, {
				method: 'GET'
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
export const getUserViolationActivity = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violationactivity?sessionId=${appInfo?.sessionId}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
	} else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/GetUserViolationActivity.json`, {
				method: 'GET'
			});
		} else {
			response = await fetch(`https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/enterprisedesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/Users/${payload.userUniqueId}/violationactivity`, {
				method: 'GET'
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
export const getLocationLevels = async (appInfo: any, payload: any, callback: any) => {
	/* 
		payload = {type: "Location"}
	*/
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/FileIt/Files.iapi/getlevels?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}&type=${payload?.type}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
	} else {
		response = await fetch(`${localServer}projectteam/LocationLevels.json`, {
			method: 'GET'
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData.values);
};
export const getLocationTags = async (appInfo: any, payload: any, callback: any) => {
	/*
		payload = {type: "Location", hierarchy: "<selected_levelId>", isSetOnly: false}
	*/
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/FileIt/Files.iapi/gettags?sessionId=${appInfo?.sessionId}&projectId=${appInfo?.projectId}&type=${payload?.type}&isSetOnly=${payload?.isSetOnly}&hierarchy=${payload?.hierarchy}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
	} else {
		const urls: any = {
			1: 'LocationJobsiteTags.json',
			7: 'LocationBuildingTags.json',
			112: 'LocationFloorTags.json',
			111: 'LocationRoomTags.json'
		};
		response = await fetch(`${localServer}projectteam/${urls[payload?.hierarchy]}`, {
			method: 'GET'
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData.Items);
};
export const checkIsRTLSIdExists = async (appInfo: any, payload: any, callback: any) => {
	/* 
		payload = {rtlsId: '123123',userId: 234243}
	*/
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/admin/users/IsRTLSIdExists?sessionId=${appInfo?.sessionId}&rtlsId=${payload.rtlsId}&rtlsId=${payload.userId}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
	} else {
		response = await fetch(`${localServer}projectteam/IsRTLSIdExists.json?dc=` + new Date().getTime(), {
			method: 'GET'
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData?.values?.isExists);
};

export const upsertUserDetails = async (appInfo: any, payload: any, callback: any) => {
	/* 
		payload = {<All_UserDetails>}
	*/
	let response;
	if (!isLocalhost) {
		let gblConfig = appInfo?.gblConfig,
			globalID = (appInfo?.gblConfig?.globalID),
			apiURL = '',
			saxhome = gblConfig?.saxhome,
			isMTA = appInfo?.isMTA;
		if (!isMTA) {
			apiURL = `${appInfo?.hostUrl}/admin/users/update/${payload.id}?sessionId=${appInfo?.sessionId}`
		} else {
			apiURL = appInfo?.isFromZone ? `${saxhome}/api/Project/${appInfo?.gblConfig?.currentProjectInfo?.uniqueId}/members/${payload.id}?sessionId=${appInfo?.sessionId}&globalid=${globalID}` : `${appInfo?.hostUrl}/api/Project/${appInfo?.gblConfig?.currentProjectInfo?.uniqueId}/members/${payload.id}?sessionId=${appInfo?.sessionId}`;
		}

		if (isMTA && appInfo?.isFromZone) {
			payload = {
				url: apiURL,
				payload: payload
			};
			apiURL = `${appInfo?.hostUrl}/Enterprisedesktop/SAX/API/EndPoint?sessionId=${appInfo?.sessionId}`;
		}
		response = await fetch(`${apiURL}`, {
			method: 'PUT',
			// headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload)
		});
	} else {
		response = await fetch(`${localServer}projectteam/UpsertUserDetails.json`, {
			method: 'GET'
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};

export const upsertWorker = async (appInfo: any, payload: any, callback: any) => {
	// https://8f55be2adf864ace8c8c0243eb53f010.smartappbeta.com/EnterpriseDesktop/Safety/Credential.iapi/UpsertWorker
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Credential.iapi/UpsertWorker?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: { 'content-type': 'application/json' }
		});
	} else {
		response = await fetch(`${localServer}projectteam/IsRTLSIdExists.json?dc=` + new Date().getTime(), {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};

export const upsertPolicyData = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Flyer.iapi/UpsertPolicyData?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/UpsertProbation.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Flyer.iapi/UpsertPolicyData?_dc=1682948043233', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	let responseData = await response.json();
	responseData.values = payload;
	callback && callback(responseData.values || {});
};

export const UpsertCertificateData = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/Safety/Flyer.iapi/UpsertCertificateData?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	}
	else {
		if (localServer) {
			response = await fetch(`${localServer}projectteam/UpsertProbation.json`);
		} else {
			response = await fetch('https://74fc368a-503f-402f-a174-0d560d5c95bb.mock.pstmn.io/EnterpriseDesktop/Safety/Flyer.iapi/UpsertCertificateData?_dc=1682948043233', {
				method: 'POST',
				body: JSON.stringify(payload)
			});
		}
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	let responseData = await response.json();
	responseData.values = payload;
	callback && callback(responseData.values || {});
};

export const uploadUserImage = async (appInfo: any, file: any, callback: any) => {
	const gblConfig = appInfo?.gblConfig;
	const saxhome = gblConfig?.saxhome;
	let response;

	if (!isLocalhost) {
		response = await fetch(`${saxhome}/api/project/upload?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: file
		});

		if (!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		console.log('responseData uploadLocalFile', responseData)
		callback && callback(responseData);
	}


};

export const updatewarningstatus = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/projects/${appInfo?.gblConfig?.currentProjectInfo?.projectUniqueId}/users/${payload.userUniqueId}/updatewarningstatus?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: JSON.stringify(payload?.request),
			headers: { 'content-type': 'application/json' }
		});
	} else {
		response = await fetch(`${localServer}projectteam/IsRTLSIdExists.json?dc=` + new Date().getTime(), {
			method: 'POST',
			body: JSON.stringify(payload?.request)
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};

export const UpdateUserOrgProjects = async (appInfo: any, payload: any, callback: any) => {
	let response;
	if (!isLocalhost) {
		response = await fetch(`${appInfo?.hostUrl}/admin/users/UpdateUserOrgProjects?sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: { 'content-type': 'application/json' }
		});
	} else {
		response = await fetch(`${localServer}projectteam/IsRTLSIdExists.json?dc=` + new Date().getTime(), {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	}
	if (!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const responseData = await response.json();

	callback && callback(responseData);
};