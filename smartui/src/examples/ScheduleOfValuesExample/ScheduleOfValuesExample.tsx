import IQButton from "components/iqbutton/IQButton";
import SUIScheduleOfValues from "sui-components/ScheduleOfValues/ScheduleOfValues";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useAppSelector } from "app/hooks";
import { useState } from "react";

const ScheduleOfValuesExample = (props: any) => {
  const { currencySymbol } = useAppSelector((state) => state.appInfo);
  const [selectedRecs, setSelectedRecs] = useState<any>([]);

  let gridColumn = [
    {
      headerName: "",
      minWidth: 50,
      menuTabs: [],
      cellRenderer: (params: any) => {
        return (
          <div>
            <span className="work-status">{params.data.count}</span>
            <span>{params.data.name}</span>
          </div>
        );
      },
    },
    {
      headerName: "% Work Completion",
      field: "workCompletion",
      cellStyle: { textAlign: "center" },
      minWidth: 180,
      menuTabs: [],
    },
    {
      headerName: "",
      field: "ofWorkCompletionPay",
      minWidth: 190,
      menuTabs: [],
    },
    {
      headerName: "% Payout",
      type: "rightAligned",
      field: "description",
      minWidth: 80,
      menuTabs: [],
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Payout Amount",
      field: "payAmount",
      type: "currency",
      minWidth: 160,
      menuTabs: [],
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Blance Amount",
      field: "balanceAmount",
      type: "rightAligned",
      minWidth: 160,
      menuTabs: [],
      cellStyle: { textAlign: "right" },
      cellRenderer: (params: any) => {
        return (
          <div>
            <span className="balanceAmount">{`${currencySymbol} ${params.data.balanceAmount.toLocaleString(
              "en-US"
            )}`}</span>
            <span className="balance-amt">{` of ${currencySymbol} ${params.data.totalAmount.toLocaleString(
              "en-US"
            )}`}</span>
          </div>
        );
      },
    },
    {
      headerName: "Payment Status",
      field: "paymentStatus",
      minWidth: 185,
      menuTabs: [],
      cellStyle: { textAlign: "center" },
      cellRenderer: (params: any) => {
        const payStatus = params.data.paymentStatus;

        if (payStatus === "Paid") {
          let styleOpts = {
            style: { color: payStatus === "Paid" ? "#008000c2" : "red" },
          };
          return <div {...styleOpts}>{payStatus}</div>;
        } else if (payStatus === "Ready to be Paid") {
          return (
            <IQButton
              variant="outlined"
              color="primary"
              onClick={() => {
                onPaymentStatusClick(params.data);
              }}
              startIcon={<AddCircleOutlineIcon />}
            >
              {"Ready to be Paid"}
            </IQButton>
          );
        } else if (payStatus === "Selected") {
          return (
            <IQButton
              color="primary"
              onClick={() => {
                onPaymentStatusClick(params.data);
              }}
              startIcon={<CheckCircleOutlineIcon />}
            >
              {"Selected"}
            </IQButton>
          );
        } else {
          return payStatus;
        }
      },
    },
  ];

  const onPaymentStatusClick = (rec: any) => {
    const isFound = selectedRecs.indexOf(rec);
    isFound === -1 ? selectedRecs.push(rec) : selectedRecs.splice(isFound, 1);
    setSelectedRecs([...selectedRecs]);
  };

  let gridData = [
    {
      id: "cf321266-f8fc-48e6-9e67-04b1b596f1a8",
      count: 1,
      name: "AT",
      description: "10%",
      workCompletion: "30%",
      payAmount: "40,000",
      balanceAmount: "360000",
      totalAmount: " 400,000",
      poNumber: "PO7655",
      ofWorkCompletionPay: "of Work Completion,Pay",
      paymentStatus: "Paid",
    },
    {
      id: "344147ad-b2ce-4033-9ed8-04b74e77047c",
      count: 2,
      name: "AT",
      description: "70%",
      workCompletion: "50%",
      payAmount: "5,850",
      balanceAmount: " 2,925",
      totalAmount: " 400,000",
      poNumber: "PO7541",
      ofWorkCompletionPay: "of Work Completion,Pay",
      paymentStatus: "Ready to be Paid",
    },
    {
      id: "02db7f32-ed55-4e6f-a04f-0a500535cd3a",
      count: 3,
      name: "AT",
      description: "20%",
      workCompletion: "100%",
      payAmount: "1,950",
      balanceAmount: " 0",
      totalAmount: " 400,000",
      poNumber: "PO6765",
      ofWorkCompletionPay: "of Work Completion,Pay",
      paymentStatus: "Pending",
    },
    {
      id: "4",
      count: 4,
      name: "AT",
      description: "40%",
      workCompletion: "80%",
      payAmount: "5,950",
      balanceAmount: " 500",
      totalAmount: " 400,000",
      poNumber: "PO6766",
      ofWorkCompletionPay: "of Work Completion,Pay",
      paymentStatus: "Selected",
    },
  ];

  return (
    <>
      <SUIScheduleOfValues
        label={"Schedule of Values"}
        required={true}
        selectedRecs={selectedRecs}
        cmpWidth={"60%"}
        gridData={gridData}
        gridColumn={gridColumn}
      />
    </>
  );
};

export default ScheduleOfValuesExample;
