import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress } from '@mui/material';
export const SuccessDialog = () => {
    return(<>
    <div className="validate-sucess-cls">
    <span className="common-icon-tickmark"></span>
    <span className="validate-text">Budget File has been Validated Successfully!</span>
    <span className="begin-text">Budget import is in progress... <CircularProgress style={{width: '25px', height: '25px', color: 'green', marginLeft: '15px'}} /></span>       
    </div>
    </>)
}