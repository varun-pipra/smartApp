import WarningIcon from "@mui/icons-material/Warning";
export const ErrorDialog = (props: any) => {
  return (
    <>
      <div className="not-import-cls">
        <span className="common-icon-not-import-warning"></span>
        <span className="not-import-text">
          Your Budget File was not imported.
        </span>
        <span className="import-file-text" style={{ color: "warning" }}>
          We found one or more columns from the File Import that needs
          correction...
        </span>
        <div className="column-wrap-cls">
          {props?.errorFields && (
            <>
              <span className="common-icon-column-names"></span>
              <span className="column-title-cls">
                <span>Column Names: </span> {props.errorFields}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
};
