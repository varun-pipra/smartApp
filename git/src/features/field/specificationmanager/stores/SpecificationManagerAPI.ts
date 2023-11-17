import {
	specList,
	specBookPages,
	markupsData,
	localSheetData,
} from "data/specmanager/specmanager";
import {isLocalhost} from "app/utils";
import {specbrenaList, divisionList} from "data/specmanager/specmanagerbrena";
import {getServerInfo} from "app/hooks";

const moduleName = "Spec Manager";

export const fetchSpecManagerList = async () => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections?sessionId=${appInfo?.sessionId}&specbookId=`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		const modifiedRespone = responseData?.data?.map((row: any, index: number) => {
			return {...row, rowId: row.id + '-' + new Date().getTime()};
		});
		return modifiedRespone || [];
	}
	return specList;
};

export const fetchSpecBrenaList = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections?sessionId=${appInfo?.sessionId}&specbookId=${payload.id}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || [];
	}
	return specbrenaList;
};

export const fetchSpecBookPages = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/specbook/pages/${payload.id}?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || {};
	}
	return specBookPages;
};

export const fetchSpecSectionById = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections/${payload}?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || [];
	}
	return specbrenaList;
};

export const addSpecSectionData = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections?sessionId=${appInfo?.sessionId}`,
			{
				method: "POST",
				headers: {"content-type": "application/json"},
				body: JSON.stringify(payload),
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || [];
	} else return {success: true};
};

export const publishSpecSection = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections/${payload.id}?sessionId=${appInfo?.sessionId}`,
			{
				method: "PATCH",
				headers: {"content-type": "application/json"},
				body: JSON.stringify(payload),
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || [];
	} else return {success: true};
};

export const publishMultipleSpecSection = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections?sessionId=${appInfo?.sessionId}`,
			{
				method: "PATCH",
				headers: {"content-type": "application/json"},
				body: JSON.stringify(payload),
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || [];
	} else return {success: true};
};

export const deleteMultipleSpecSections = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections?sessionId=${appInfo?.sessionId}`,
			{
				method: "DELETE",
				headers: {"content-type": "application/json"},
				body: JSON.stringify(payload),
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || [];
	} else return {success: true};
};

export const getTextByBoundary = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/extract/text?sessionId=${appInfo?.sessionId}&url=${payload?.url}&x1=${payload?.x1}&x2=${payload?.x2}&y1=${payload?.y1}&y2=${payload?.y2}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || "";
	}
	return "SmartApp";
};

export const getMarkupsByPage = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/specbook/${payload.specbookId}/${payload.pageNo}?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || [];
	}
	return markupsData;
};

export const getMarkupsByPageForSections = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/sections/${payload.specbookId}/${payload.pageNo}?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || [];
	}
	return markupsData;
};

export const getMarkupsByPageForSubmitals = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals/${payload.specbookId}/${payload.pageNo}?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || [];
	}
	return markupsData;
};

export const getMarkupsByPageForSubmittals = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/submittals/${payload.specbookId}/${payload.pageNo}?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || [];
	}
	return markupsData;
};

export const validateSheetName = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/FileIt/Files.iapi/ValidateSheetName?_dc=${payload._dc}&projectId=${appInfo?.SpecBookFolder?.projectId}&name=${payload.name}&folderId=${appInfo?.SpecBookFolder?.folderId}&includeFolder=true&requireBlockChainCheck=false&sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || [];
	}
	return localSheetData;
};

export const getSignedUrl = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/fileit/files.iapi/GetSignedUrl?sessionId=${appInfo?.sessionId}`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.data || {};
	}
	return true;
};

export const callUploadedCloudUrl = async (url: any) => {
	let response;
	if(!isLocalhost) {
		response = await fetch(`${url}`, {
			method: "PUT",
		});

		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		console.log("response callUploadedCloudUrl", response);
		return response || {};
	}
};

export const saveSpecDocument = async (payload: any, file: any) => {
	let response;
	const appInfo: any = getServerInfo();
	let fileObject = new FormData();
	fileObject.append("file1", file);
	fileObject.append("inputData", JSON.stringify(payload));

	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/FileIt/Files.iapi/SaveDocuments?sessionId=${appInfo?.sessionId}`,
			{
				method: "POST",
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				body: fileObject,
			}
		);

		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData;
	}
};

export const getUploadStatus = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/fileit/files.iapi/GetUploadStatus?sessionId=${appInfo?.sessionId}`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || {};
	}
	return true;
};

export const getUIDForLocalFiles = async (payload: any) => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/fileit/files.iapi/GetUID?sessionId=${appInfo?.sessionId}`,
			{
				method: "POST",
				body: JSON.stringify(payload),
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || {};
	}
	return true;
};

export const fetchDivisionList = async () => {
	let response;
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/divisions?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData?.listValues || [];
	}
	return divisionList.listValues;

};
export const GetUnpublishedCount = async () => {
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		let response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/session?sessionId=${appInfo?.sessionId}`
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || {};
	} else return {
		"lastUnpublishedCount": 5,
		"lastSpecBookId": "78069ae7-04e6-47bf-9322-ce60105df782"
	};
};
export const fetchSectionsNew = async (payload: any) => {
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		let response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/session/${payload}/new/?sessionId=${appInfo?.sessionId}`,
			{
				method: "PATCH",
				headers: {"content-type": "application/json"}
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || {};
	} else return {success: true};
};
export const fetchSectionsCommit = async (payload: any) => {
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		let response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/session/${payload}/commit/?sessionId=${appInfo?.sessionId}`,
			{
				method: "PATCH",
				headers: {"content-type": "application/json"}
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || {};
	} else return {success: true};
};
export const fetchSectionsRollBack = async (payload: any) => {
	const appInfo: any = getServerInfo();
	if(!isLocalhost) {
		let response = await fetch(
			`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/specmanager/${appInfo?.uniqueId}/session/${payload}/rollbackall?sessionId=${appInfo?.sessionId}`,
			{
				method: "PATCH",
				headers: {"content-type": "application/json"}
			}
		);
		if(!response.ok) {
			const message = `API Request Error (${moduleName}): ${response.status}`;
			throw new Error(message);
		}
		const responseData = await response.json();
		return responseData || {};
	} else return {success: true};
};