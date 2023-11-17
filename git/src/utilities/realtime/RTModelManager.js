import RTHelper from "./RTHelper";
var RTModel = require('@smartapp/rtapi/dist/client/rtapi.js');

class RTModelManager {
	constructor(config) {
		this._baseUrl = config.config.baseUrl;
		this.rtHelper = new RTHelper();
	}
	_baseUrl = null;
	_rtModel = null;
	_connectionState = false;

	getModel = (config) => {
		if (typeof (RTModel) === 'undefined' || !config || !(config.url)) {
			console.log("Cannot support real time collaboration");
			return;
		}

		if (this._rtModel) {
			return this._rtModel;
		}

		//to handle subscribe timeout
		var modelOpts = { subscribableTimeouts: { can: 26000, cannot: 5000 } };
		this._rtModel = typeof (RTModel) && new RTModel(modelOpts);

		var that = this,
			connectionParams = {
				reconnect: true,
				failFast: false,
				reconnectTime: 10000,
				sessionJwt: function (callBack) {
					var requestUrl = `${that._baseUrl}/Enterprisedesktop/RealTime/Appzone/GenerateRTAPIJwtToken`;
					// console.log(requestUrl);
					if (that.rtHelper.isLocalHost()) {
						callBack("fake-token");
						return;
					}
					that.rtHelper.generateRequestByUrl(requestUrl, 'GET', function (token) {
						callBack(token);
					}, function () {
						callBack(null);
					})
				}
			};

		connectionParams.base = config.url;

		this._rtModel.createConnection(connectionParams);

		this._connectionState = (this._rtModel.connection.state === "connected");

		return this._rtModel;
	}

	isConnected = function () {
		return this._connectionState;
	}
}

export default RTModelManager;