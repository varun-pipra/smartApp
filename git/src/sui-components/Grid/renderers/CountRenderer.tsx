import React from "react";
import SUIAlert from "sui-components/Alert/Alert";
import { SUIToast } from "sui-components/Toast/Suitoast";

export default (props: any) => {
  const [showToast, setShowToast] = React.useState<boolean>(false)
  const getText = (data:any) => {
    let budgetNames = '';
    data?.forEach((val:any, index:number) => {
      if(index > 0) budgetNames =  budgetNames + ',' + val
    })
    return budgetNames;
  }
//   console.log("1234", props?.value);
  if (typeof props.value === "object" && props?.value?.length > 0) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{ overflow: "hidden", textOverflow: "ellipsis", marginRight: '7px' }}
        >
          {props?.value?.[0]}
        </div>
        {props?.value?.length > 1 && (
          <div
            style={{
              minWidth: "25px",
              height: "25px",
              backgroundColor: "#E0F3FB",
              color: "#059CDF",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "800",
              display: "flex",
              borderWidth: "1px",
              borderColor: "#059cdf",
              borderStyle: "solid",
              boxShadow: "0px 1px 4px 0px #dadada",
            }}
          >
            <span onClick={() => {setShowToast(true)}}>+{props.value?.length - 1}</span>
          </div>
        )}
        {
					showToast && <SUIAlert
						open={showToast}
						onClose={() => {
							setShowToast(false);
						}}
						DailogClose={true}												
						contentText={<div>{props?.value?.map((val:any, index:number) => {
             return <div><span>{`${index+1}. ${val}`}</span><br/></div>
            })}

            </div>}
						title={'Budget Line Items'}
						// onAction={(e: any, type: string) => handleAlert(type)}
						showActions={false}
						modelWidth={'500px'}
					/>
				}
      </div>
    );
  } else {
    return props.value;
  }
};
