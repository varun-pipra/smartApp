export function getValuesOfAllEntries(data:any, key:any) {
    const values = data?.map((row:any) => {
        return row[key]
    })
    return values;
} 

export const tiles = [
    {
      title: "Percent Complete",
      desc: "Payout based on Percentage Work Completion and set Percentage Payout.",
      recordId: 1,
      type: 'PercentComplete',
      isActive: true,
    },
    {
      title: "Unit of Measure",
      desc: "Payout based on defined Unit Quantity utilisation and set Payout Amount.",
      type: 'UnitOfMeasure',
      recordId: 2,
    },
    {
      title: "Dollar Amount",
      desc: "Payout based on defined Work Stage Completion and Payout Amount.",
      recordId: 3,
      type: 'DollarAmount',
    },
    {
      title: "Through Date",
      desc: "Payout based on defined Data Interval Frequency.",
      recordId: 4,
      type: 'ThroughDate',
    },
  ];