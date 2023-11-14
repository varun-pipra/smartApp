import { getValuesOfAllEntries } from "features/vendorcontracts/vendorcontractsdetails/tabs/schedulevalues/utils";

export const tilesConstData = [
    {
        title: "Pay When Paid",
        desc: "Payout based on aggregate Vendors verified work & Submitted Pay Application.",
        recordId: 1,
        type: 'PayWhenPaid',
        
    },
    {
        title: "Percent Complete",
        desc: "Payout based on Percentage Work Completion and set Percentage Payout.",
        recordId: 2,
        isActive: true,
        type: 'PercentComplete',
        
    },
    {
        title: "Dollar Amount",
        desc: "Payout based on defined Work Stage Completion and Payout Amount.",
        recordId: 3,
        type: 'DollarAmount',
        
    }
];

export const getSumOfEXistedValues = (data:any, key:string, params:any) => {
    console.log(params?.rowIndex, data)
    // const splicedData = data?.splice(0, 1)
    const values = params?.node?.rowPinned == 'top' ? getValuesOfAllEntries(data, key) : getValuesOfAllEntries(data, key);
    console.log("values", values)
    return values?.reduce((a:any, b:any) => Number(a) + Number(b),0)
}