class RTHelper {
	Constants = {
		ResultStatus: {
			Success: 0,
			Error: 1
		},
		realTimeDocument: {
			KeyTypes: {

			},
			Actions: {
				Add: 1,
				Update: 2,
				Remove: 3
			},
			DocumentTypes: {
				'main': 0,
				'collaborators': 1
			}
		}
	}

	isLocalHost = () => {
		return (window.location.hostname === 'localhost' || window.location.hostname.indexOf('192.168') >= 0);
	}

	generateRequestByUrl = (requestUrl, requestType, successCallBack, errorCallBack) => {
		var that = this;
		fetch(requestUrl, {
			method: requestType
		})
			.then((response) => response.json())
			.then((responseData) => {
				var successCode = that.Constants.ResultStatus.Success,
					statusCode = (responseData.hasOwnProperty("StatusCode")) ? responseData.StatusCode :
						(responseData.hasOwnProperty("statusCode")) ? responseData.statusCode : undefined;

				if (statusCode === successCode) {
					successCallBack && successCallBack(responseData.data, responseData);
				} else if (responseData.success) {
					successCallBack && successCallBack(responseData.values, responseData);
				} else errorCallBack && errorCallBack();
			})
			.catch((error) => {
				errorCallBack && errorCallBack(error);
			});
	}

	evalRTCCollectionId = (urlstring) => {
		var url = this.parseUrl(urlstring);
		if (!url) return null;

		return url.host.replace(/\./g, ':');
	}

	parseUrl = (url) => {
		var queryRegParser = /(?:^|&)([^&=]*)=?([^&]*)/g,
			urlRegParser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
			urlParseKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];

		var mt = urlRegParser.exec(url),
			result = {}, queryVals = {},
			ind = 14;

		while (ind--) {
			result[urlParseKeys[ind]] = mt[ind] || "";
		}

		result.searchParams = { get: function (name) { return queryVals[name]; } };
		result[urlParseKeys[12]].replace(queryRegParser, function ($0, $1, $2) {
			if ($1) queryVals[$1] = $2;
		});
		return result;
	}

	getUuid = (strGuid) => {
		var uuid;
		if (strGuid) {
			strGuid = strGuid.replace(/-/g, '');
			if (strGuid.length !== 32) {
				console.error("Invalid guid string");
				return null;
			}
			uuid = strGuid.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5');

		} else {
			var d = new Date().getTime();
			uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}
		return uuid;
	}
}

export default RTHelper;