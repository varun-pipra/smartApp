export const AddDirectCostFormValidation = (formData:any) => {
    if(formData.amount === '' || formData.vendorId === null) {
        return true;
    }
    return false;
}