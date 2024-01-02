import RTDocument from "./RTDocument";
import RTHelper from "./RTHelper";

class RTDataManager {
	constructor(config) {
		if (config && config.documentId) {
			this.rtHelper = new RTHelper();
			// console.log('**********RealTimeDataManager************');
			var that = this;
			that.config = {
				documentId: config.documentId,
				rtcConfig: {
					collectionId: this.rtHelper.evalRTCCollectionId(config.baseUrl),
					url: config.appzoneRTCServerUrl
				}
			};
			this.realTimeDocument = new RTDocument({
				dataManager: this,
				modelConfig: that.config.rtcConfig,
				config: config
			});
			setTimeout(function () {
				that.start();
			}, 500);
		}
	}

	start = () => {
		if (!this.realTimeDocument) {
			return console.error("RealTime document creation has failed");
		}

		var that = this,
			config = that.config,
			documentId = (config && config.documentId);

		that.realTimeDocument.start({
			id: documentId,
			data: config.data || {},
			name: "iqcommon"
		}, function () {
			that.fireEvent && that.fireEvent("started", that.getData());
			document.dispatchEvent(new CustomEvent("rtdstarted", {
				detail: that.getData()
			}));
		});

		window.RTDataManager = that;
	}

	getData = () => {
		return this.realTimeDocument && this.realTimeDocument.get();
	}

	getItemRelativePathByKeyValue = (itemList, key, value) => {
		var that = this, relativePath = "";
		itemList.some(function (item, index) {
			if (item[key] === value) {
				relativePath = (`${index}`);
			}
			else {
				if (!(item.children)) return false;

				var childPath = that.getItemRelativePathByKeyValue(item.children, key, value),
					isChildItem = (childPath);

				if (isChildItem) {
					relativePath = (`${index}.children.${childPath}`);
				}
				return isChildItem;
			}
			return item[key] === value;
		});
		return relativePath;
	}

	updateRealTimeModel = (key, path, value, action) => {
		var realTimeDocumentConstants = this.rtHelper.Constants.realTimeDocument;

		try {
			this.realTimeDocument.update({
				type: realTimeDocumentConstants.KeyTypes[key],
				value: {
					path: path,
					data: value
				},
				action: action
			});
		} catch (err) { }
	}

	destroy = () => {
		this.realTimeDocument && this.realTimeDocument.destroy();
	}
}

export default RTDataManager;