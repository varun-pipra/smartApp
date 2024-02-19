import WarningIcon from '@mui/icons-material/Warning';
export const ErrorDialog = () => {
    return(<>
     <div className="not-import-cls">        
        <span className="common-icon-not-import-warning"></span>
        <span className="not-import-text">Your Budget File was not imported.</span>
        <span className="import-file-text" style={{color: 'warning'}}>We found one or many issues with the import file...</span>
        </div>
        </>)
}