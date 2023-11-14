import { store } from 'app/store';
import { setLiveData } from 'features/vendorcontracts/stores/gridSlice';

export const mainGridRTListener = (path: any, event: any) => {
	const { value } = event;
	console.log('VENDOR CONTRACTS MAIN GRID RT DATA==============================================================>', value);

	if (value) {
		store.dispatch(setLiveData(value));
	}
};