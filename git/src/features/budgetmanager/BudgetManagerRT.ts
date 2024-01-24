import {store} from 'app/store';
import {setGridData, setLiveData} from './operations/gridSlice';
import {setSelectedRowData} from './operations/rightPanelSlice';

export const budgetManagerMainGridRTListener = (path: any, event: any) => {
	const {value} = event;
	console.log('BUDGET MANAGER MAIN GRID RT DATA==============================================================>', value);

	if(value) {
		console.log('liveData inside value');
		const {add, update, remove} = value;
		const rootState = store.getState();

		const {gridData} = rootState.gridData;
		let dataList = [...gridData];
		let diffObject: any = {};

		if(add?.length > 0) {
			console.log('liveData inside add');
			dataList = gridData.concat(add);
			add.map((el: any) => diffObject[el.id] = undefined);
		}

		if(gridData.length > 0 && update?.length > 0) {
			const updateIdList = update.map((el: any) => el.id);
			const {selectedRow} = rootState?.rightPanel;
			const filteredArray = gridData.filter((item: any) => {
				if(updateIdList.indexOf(item.id) !== -1) {
					diffObject[item.id] = objDiff(item, update.find((el: any) => el.id === item.id));
				}
				return updateIdList.indexOf(item.id) === -1;
			});
			dataList = filteredArray.concat(update);

			if(selectedRow && updateIdList.indexOf(selectedRow.id) > -1) {
				const currentItem = update.find((item: any) => item.id === selectedRow.id);
				store.dispatch(setSelectedRowData(currentItem));
			}
		}

		if(gridData.length > 0 && remove?.length > 0) {
			const idList = remove.map((el: any) => el.id);
			dataList = gridData.filter((item: any) => idList.indexOf(item.id) === -1);
		}

		console.log('liveData------------length', dataList.length);
		store.dispatch(setGridData(dataList));
		store.dispatch(setLiveData(diffObject));
	}
};

const objDiff = (oldRec: any, newRec: any) => {
	// console.log('Object.keys(oldRec, newRec)-->', Object.values(oldRec), Object.values(newRec));
	let keyValues;
	keyValues = Object.keys(oldRec).filter(key => {
		if(typeof (oldRec[key]) != 'object') {
			// if(((oldRec[key] != undefined && oldRec[key] != null) &&  (newRec[key] != undefined && newRec[key] != null))){
			if(oldRec[key] != newRec[key]) {
				if(!['modifiedDate', 'rowId'].includes(key)) {
					// console.log('Object key-->', key);
					return key;
				}
			}
			// }				
		}
	});

	// console.log('keyValues--->', keyValues);
	return keyValues.filter((element) => {
		return element != undefined || element != null;
	});
};