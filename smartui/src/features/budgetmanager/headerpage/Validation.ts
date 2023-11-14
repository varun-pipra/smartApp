export const validate = (formData: any) => {
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
			arr.push(formData[key] === '' || formData.originalBudgetAmount.amount === '' ? true : false)
		}
	})

	return arr.includes(true) ? true : false;

}