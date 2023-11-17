import React, { useState } from "react";
import ContractSignModal from "sui-components/ContractSignModal/ContractSignModal";

const ContractsSignModalExample = (props: any) => {
  const [open, setOpen] = useState(false);

  const onModalClose = () => {
    setOpen(false);
  };

  const onModalSubmit = (values: any) => {
    console.log(values);
    setOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Modal
      </button>
      <ContractSignModal
        open={open}
        formType={"decline"}
        userName="Gerlad Alexander"
        onModalClose={onModalClose}
        onSubmit={onModalSubmit}
      ></ContractSignModal>
    </>
  );
};
export default ContractsSignModalExample;
