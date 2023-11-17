export const Validate = (formData:any) => {
    if(formData.fromBudgetLineItem === '' || formData.toBudgetLineItem === '' || formData.transferAmount === '') {
        return true;
    }
    return false;
}