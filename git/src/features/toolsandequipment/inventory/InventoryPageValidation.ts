import { InventoryObjectProps } from './inventorySection/InventorySection';

export const InventoryPageValidation = (data: InventoryObjectProps[]) => {

	const requiredfields = {
		rtlsTagNo: { required: true, errormsg: 'Required' },
		status: { required: true, errormsg: 'Required' },
		procurementType: { required: true, errormsg: 'Required' },
		uniqueId: { required: true, errormsg: 'Required' }
	}
	const arrayrequired: any = [];
	data.length <= 0 ? arrayrequired.push(true) : arrayrequired.push(false);
	if (data.length > 0) {
		data.map((value, i) => {
			arrayrequired.push(value.rtlsTagNo === '' || value.status === '' || value.procurementType === '' || value.uniqueId === '' ? true : false);
		})
	}

	return arrayrequired.includes(true) ? true : false;
}