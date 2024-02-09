import { CircularProgress } from "@mui/material"

export const InProgressDialog = () => {
    return(<>
    <div className="validate-sucess-cls">
    <span className="validate-animation"></span>
     <span className="validate-text">Validating File Import</span>
     <span  className="wait-text">Validation is in progress, please wait...</span>
     </div>
    </>)
}