import CompanyCardExample from "examples/CompanyCard/CompanyCardExample";
import CompanyExample from 'examples/Company/CompanyExample';
import EmailExample from 'examples/Email/EmailExample';
import CalculatorExample from 'examples/Calculator/CalculatorExample';

const ComponentsDemoExample = (props: any) => {
  return (
    <>
      <CompanyExample></CompanyExample>
      <CompanyCardExample></CompanyCardExample>
      <EmailExample></EmailExample>
      <CalculatorExample></CalculatorExample>
    </>
  );
};

export default ComponentsDemoExample;
