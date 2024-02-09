import WarningIcon from '@mui/icons-material/Warning';
export const ErrorDialog = () => {
    return(<>
        <WarningIcon  color='warning'/>
        <span className="error-text">Your Budget File was not imported.</span>
        <span className="error-text" style={{color: 'warning'}}>We found one or many issues with the import file...</span>
        </>)
}