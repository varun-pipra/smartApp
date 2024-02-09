import { isLocalhost } from 'app/utils';
import { CostCodeFilterData, DivisionCostCodeDropdownData } from 'data/MultiLevelFilterData';
import { triggerEvent } from 'utilities/commonFunctions';

const moduleName = "Budget Manager: Import";

// export const importBudgets = async (appInfo:any, importOption:any, fileName:any, callback?:any) => {
//     console.log("import api", appInfo, importOption, fileName)
//     const formData = new FormData();
//     let response:any;
//     if(!isLocalhost) {
//         if(fileName) { 
//             formData.append("File", fileName);
//             console.log("formData", formData)
//             const response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/import?type=${importOption}&sessionId=${appInfo?.sessionId}`, {
//                 method: 'POST',
//                 // headers: {'content-type': 'application/x-www-form-urlencoded'},
// 			    body: formData,
//             })
//         }
//         console.log("import api resp", response, response?.json)
//         if (!response?.ok) {
// 			const message = `API Request Error (${moduleName}): ${response?.status}`;
// 			throw new Error(message);
//         }
//         const responseData = await response?.json();
//         console.log("responseData", responseData)
//         callback && callback(responseData);
//     } else callback && callback({
//         "Success": true,
//         "Message": "Successfully added import lineitems request.",
//         "ResultId": "0411c417-aa70-4b92-9efe-69f802644ac2",
//         "IsDataValid": true,
//         "IsReplaceAllowed": false
//     });
    
// }

export const importBudgets = async (appInfo: any, importOption:any, fileName:any, callback?: any) => {
    let response: any;
    const formData = new FormData();
	if(!isLocalhost) {
        formData.append("File", fileName);
        console.log("impoert", importOption, fileName, formData)
		response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/import?type=${importOption}&sessionId=${appInfo?.sessionId}`, {
			method: 'POST',
			body: formData,

		});
	} else {
		response = await fetch('https://632b335b713d41bc8e83479b.mockapi.io/budget/api/lineitems', {
			headers: {
				"x-api-key": "PMAK-62cdcdcdc696447f8ebe5958-4e1696b00ae09e46fde6936f46ab906da6"
			},
		});
    }
    console.log("response from api", response)
	if(!response.ok) {
		const message = `API Request Error (${moduleName}): ${response.status}`;
		throw new Error(message);
	}
	const data = await response.json();
	callback && callback(data);
};

export const fetchImportStatus = async (appInfo:any, requestId:any, callback?:any) => {
    let response:any;
    if(!isLocalhost) {
        if(requestId) { 
            const response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/import/status?requestId=${requestId}&sessionId=${appInfo?.sessionId}`)
        }
        if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
        callback && callback(responseData);
    } else callback && callback(1);
    
}

export const checkIsReplaceAllowed = async (appInfo:any, callback?:any) => {
    let response:any;
    if(!isLocalhost) {
            const response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/import/isreplaceAllowed?sessionId=${appInfo?.sessionId}`, {
                method: 'POST',
            })
        if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
        callback && callback(responseData);
    } else callback && callback(false);  
}

export const notifyOnceImportComplete = async (appInfo:any, requestId:any, callback?:any) => {
    let response:any;
    if(!isLocalhost) {
            const response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/import/notify?requestId=${requestId}&sessionId=${appInfo?.sessionId}`, {
                method: 'POST',
            })
        if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
        callback && callback(responseData);
    } else callback && callback(false);  
}

export const cancelImport = async (appInfo:any, requestId:any, callback?:any) => {
    let response:any;
    if(!isLocalhost) {
            const response = await fetch(`${appInfo?.hostUrl}/EnterpriseDesktop/api/v2/budgets/${appInfo?.uniqueId}/import/cancel?requestId=${requestId}&sessionId=${appInfo?.sessionId}`, {
                method: 'POST',
            })
        if (!response?.ok) {
			const message = `API Request Error (${moduleName}): ${response?.status}`;
			throw new Error(message);
		}
		const responseData = await response?.json();
        callback && callback(responseData);
    } else callback && callback(false);  
}