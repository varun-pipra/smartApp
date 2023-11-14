export const Validate = (formData: any, fromAvailableBalc: any) => {
	// console.log("Validate", fromAvailableBalc, formData.transferAmount.replaceAll(',', ''))
	if (formData.fromBudgetLineItem === '' || formData.transferAmount === '' || Number(fromAvailableBalc) < Number(formData.transferAmount.replaceAll(',', ''))) {
		return true;
	}
	return false;
}