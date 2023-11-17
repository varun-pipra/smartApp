import * as React from "react";
import Button from "@mui/material/Button";
import SUICalculator from "sui-components/Calculator/Calculator";

const CalculatorExample = (props: any) => {
  const costUnitOpts = [
    { label: "ea", value: "ea" },
    { label: "ls", value: "ls" },
    { label: "lf", value: "lf" },
    { label: "m", value: "m" },
    { label: "mm", value: "mm" },
    { label: "m2", value: "m2" },
    { label: "m3", value: "m3" },
    { label: "cc", value: "cc" },
  ];

  const [openCalculator, setOpenCalculator] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenCalculator(event.currentTarget);
  };

  const closeChange = () => {
    setOpenCalculator(null);
  };

  const onSubmit = (value: any) => {
    // console.log("calculator value --", value);
  };

  return (
    <>
      <Button variant="contained" onClick={handleClick}>
        Open calculator
      </Button>
      <SUICalculator
        clearCalculator={true}
        unitList={costUnitOpts}
        openCalculator={openCalculator}
        closeCalculator={(val: any) => closeChange()}
        calculatorTitle="Bid Calculator"
        onSubmit={(value) => onSubmit(value)}
      />
    </>
  );
};

export default CalculatorExample;
