import RTModelManager from "./RTModelManager";
import RTHelper from "./RTHelper";

class RTDocument {
	_id = null;
	_rtModel = null;
	_rtDocument = null;
	_rtCollaborators = null;
	_rtCollectionName = null;

	constructor(config) {
		this.rtHelper = new RTHelper();
		this.config = config;
		var rtMdlManger = new RTModelManager(config);
		this._rtModel = rtMdlManger.getModel(config.modelConfig);


		var that = this, dataManager = config.dataManager;
		// To identify connection status
		this._rtModel.on('change', '$connection.state', function (path, envt) {
			var connectionStatus = envt.value === "connected";
			if (connectionStatus != that._connectionState) {
				that._rtModel._connectionState = connectionStatus;
			}
		});
	}

	getCollectionName = (name) => {
		var modelConfig = this.config.modelConfig,
			collectionId = modelConfig && modelConfig.collectionId;

		this._rtCollectionName = name;
		return collectionId ? (`${collectionId}:${name}`) : name;
	}

	getCollectionType = () => {
		return this._rtCollectionName && this._rtCollectionName.split('files')[0];
	}

	create = (data, callback) => {
		// evaluate if the real time document
		if (!this._rtDocument) throw 'Failed to load real time document';

		var that = this;
		this._rtDocument.create(data, function () {
			callback && callback(that._rtDocument.get());
		});

	}

	load = () => {

		// check if the required parameters are available to load the real time document
		if (!this._id || !this._rtModel) throw 'Insufficient data to load real time document';

		// extract the real time document from the real time model based on id
		this._rtDocument = this._rtModel.at(this._id);
	}

	loadCollaborators = (callback) => {
		this._rtCollaborators = this._rtDocument && this._rtDocument.atCollaborators();
		var that = this;
		if (this._rtCollaborators) {
			this._rtCollaborators.subscribe(function (err) {
				callback && callback();
			});
		} else {
			console.log((`RealTimeDocument - Failed to create collaborators model - ${that._id}`));
			callback && callback();
		}
	}

	onAfterLoad = (callback) => {
		var that = this;
		this.loadCollaborators(function () {

			that.bind();

			callback && callback();
		});
	}

	get = () => {
		// evaluate if the real time document
		if (!this._rtDocument) throw 'Failed to load real time document';

		return this._rtDocument.get();
	}

	bind = () => {
		if (!this.listeners) return;

		// for each of the listener bind the 
		//@TO_DO
	}

	start = (options, callback) => {
		if (!this._rtModel) {
			callback();
			return;
		}

		options.id = (options.id || this.rtHelper.getUuid()).toLowerCase();

		// evaluate the id for the real time document
		this._id = this._id || `${this.getCollectionName(options.name)}.${options.id}`;

		// load the document from the real time model
		this.load();

		var that = this;

		//To receive remote document updates, as the data changes on the server
		this._rtDocument.subscribe(function (err) {
			that._afterDocumentSubscribe(options, callback);
		});
	}

	_afterDocumentSubscribe = (options, callback) => {
		// fetch the real time data for the document
		var that = this,
			rtdData = this.get();

		// check for real time document data existence
		if (!(rtdData)) {
			// check for validity of data to create the document
			if (typeof (options.data) != "object") throw 'Invalid data format to create document';

			console.log((`RealTimeDocument - Creating a new model for real time communication - ${that._id}`), options);
			// create the real time document with the provided data
			this.create(options.data, function (rtdrData) {
				// init collaborators and bind event listeners
				that.onAfterLoad(function () {
					callback && callback(null);
				});
			});
		} else {
			console.log((`RealTimeDocument - Existing model for real time communication - ${that._id}`), options);
			// init collaborators and bind event listeners
			this.onAfterLoad(function () {
				callback && callback(rtdData);
			});
		}
	}

	update = (data) => {
		if (!this._rtDocument) {
			return;
		}

		var realTimeDocumentConstants = this.rtHelper.Constants.realTimeDocument,
			realTimeModelKeyTypes = realTimeDocumentConstants.KeyTypes,
			type = data.type,
			action = data.action,
			value = data.value,
			pathPrefix = "",
			docType = realTimeDocumentConstants.DocumentTypes.main;


		(value.path) && (value.path = pathPrefix + value.path);
		value.type = type;
		if ((value.path === "" || typeof (value.path) === "undefined")) {
			// console.log("Common RealTimeDocument - Unknown path to update the real time model", data);
			return;
		}

		// console.log('Common RealTimeDocument - Updating real time model', data);
		this.updateDocumentDataByPath(action, value, docType);
	}

	_getObjectByPath = (objectPath, docType) => {
		var realTimeDocumentConstants = this.rtHelper.Constants.realTimeDocument,
			document = docType === realTimeDocumentConstants.DocumentTypes.collaborators ? this._rtCollaborators : this._rtDocument;
		return document.get(objectPath);
	}

	_getObjectIndexById = (objectPath, key, value, docType) => {
		var objectIndex = -1, objectArray = this._getObjectByPath(objectPath, docType);

		if (!(value) || !(objectArray)) return objectIndex;
		if (!this.findBy) {
			this.findBy = function (array, fn, scope) {
				var i, len;

				for (i = 0, len = array.length; i < len; i++) {
					if (fn.call(scope || array, array[i], i)) {
						return array[i];
					}
				}

				return null;
			}
		}

		this.findBy(objectArray, function (object, index) {
			// null values evaluate to be of type object
			if ((object) && typeof (object) == "object") {
				if (!(key)) return true;
				if (object[key] == value) objectIndex = index;
				return object[key] == value;
			} else {
				if (object == value) objectIndex = index;
				return object == value;
			}
		});
		return objectIndex;
	}

	updateDocumentDataByPath = function (action, eventData, docType) {
		var realTimeDocumentConstants = this.rtHelper.Constants.realTimeDocument,
			realTimeDocumentActions = realTimeDocumentConstants.Actions,
			updatePath = eventData.path,
			propertyType = eventData.propertyType,
			propertyValue = eventData.data,
			objectIndex = propertyType == 'array' ? this._getObjectIndexById(updatePath, eventData.key,
				typeof (propertyValue) == "object" ? propertyValue[eventData.key] : propertyValue, docType) : -1,
			document = docType === realTimeDocumentConstants.DocumentTypes.collaborators ? this._rtCollaborators : this._rtDocument;


		// logic to update the extra data
		switch (action) {
			case realTimeDocumentActions.Add:
				if (propertyType == 'array') {
					if (objectIndex != -1) return console.error("updateDocumentDataByPath - Duplicate id - Failed to perform add action");
					document.push(updatePath, propertyValue);
				} else document.set(updatePath, propertyValue);
				break;
			case realTimeDocumentActions.Update:
				if (propertyType == 'array') {
					if (objectIndex != -1) document.push(updatePath, propertyValue);
					else document.set(`${updatePath}.${objectIndex}`, propertyValue);
				} else document.set(updatePath, propertyValue);
				break;
			case realTimeDocumentActions.Remove:
				propertyType == 'array' ? (objectIndex > -1 && document.remove(updatePath, objectIndex, 1)) :
					document.del(updatePath);
				break;
		}
	}

	_getSyncedData = (path, event) => {
		var realTimeDocumentConstants = this.rtHelper.Constants.realTimeDocument,
			actionTypes = realTimeDocumentConstants.Actions;
		return {
			action: event.type == 'insert' ? actionTypes.Add : event.type == 'change' ? actionTypes.Update : actionTypes.Remove,
			property: path,
			value: (event.value) || (event.values && event.values[0]) || (event.removed && event.removed[0]),
			previous: event.previous
		};
	}

	destroy = () => {
		this._id = null;
		//this._rtCollaborators && this._rtCollaborators.destroy();
		this._rtDocument && this._rtDocument.destroy();
		//this._rtCollaborators = null;
		this._rtDocument = null;
	}
}

export default RTDocument;