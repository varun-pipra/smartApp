export const validate = (formData: any) => {
	console.log('formData',formData)
	const requiredFields: any = {
		costCode: true,
		costType: true,
		startDate: false,
		endDate: false,
		curve: false,
		originalBudgetAmount: true
	}

	const arr: boolean[] = []
	Object.keys(requiredFields).map((key: string) => {
		if (requiredFields[key] === true) {
			arr.push(formData[key] === '' || formData.originalBudgetAmount.amount === '' || formData.originalBudgetAmount.amount === '0'  ? true : false)
		}
	})

	return arr.includes(true) ? true : false;

}