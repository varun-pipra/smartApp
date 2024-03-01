import { FormControlLabel, IconButton, Radio, RadioGroup, Stack } from "@mui/material";
import IQBaseWindow from "components/iqbasewindow/IQBaseWindow";
import { gridData } from "data/Budgetmanger/griddata";
import { memo } from "react";

import './BudgetImporter.scss';
import IQFileUploadField from "components/iqfileuploadfield/IQFileUploadField";
import IQButton from "components/iqbutton/IQButton";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getTemplateForBudget, setImportBudgetsStatus, setToastMessage } from "../operations/tableColumnsSlice";
import { getServer } from "app/common/appInfoSlice";
import React from "react";
import { fetchBudgetManagerDownloadTemplete } from "../operations/tableColumnsAPI";
import { InProgressDialog } from "./InProgess";
import { SuccessDialog } from "./Success";
import { ErrorDialog } from "./Error";
import { ConfirmationDialog } from "./ConfirmationDialog/ConfirmationDialog";
import { importBudgets, fetchImportStatus, cancelImport, checkIsReplaceAllowed, valdationStatus } from "../operations/budgetImportAPI";
import { importType } from "utilities/commonutills";
import { fetchGridData } from "../operations/gridSlice";
import IQTooltip from "components/iqtooltip/IQTooltip";

const BudgetImporter = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const ref = React.useRef<HTMLAnchorElement | null>(null);
	const [importOption, setImportOption] = React.useState<any>('new');	
	const [file, setFile] = React.useState<any>(null);		
	const [showInProgress, setShowInProgress] = React.useState<boolean>(false);
	const [showSuccess, setShowSuccess] = React.useState<boolean>(false);
	const [showError, setShowError] = React.useState<boolean>(false);
	const [importStatus, setImportStatus] = React.useState<any>(null);
	const [disableStartImport, setDisableStartImport] = React.useState<boolean>(true);
	const [showToast, setShowToast] = React.useState<boolean>(false);
	const [isReplaceAllowed, setIsReplaceAllowed] = React.useState<boolean>(false);							
	const [showAlert, setShowAlert] = React.useState<any>({show:false, msg: <div className="warning-text"><span>This will Replace/Overwrite all the existing Budget Line Items with the New Items. Do you want to Continue?</span></div>})	
	const [importResponse, setImportResponse] = React.useState<any>({});
  const validationInterval = React.useRef<any>({})
  const statusInterval = React.useRef<any>()
	console.log("props?.noOfBudgetItems", props?.noOfBudgetItems, props?.noOfLevels)

	React.useEffect(() => {props?.noOfBudgetItems == 0 ? setImportOption('new') : setImportOption('replace')}, [props?.noOfBudgetItems])
	React.useEffect(() => {
		dispatch(setImportBudgetsStatus(importStatus));
		if(importStatus == 1) {
			dispatch(setToastMessage({ displayToast: true, message: 'Budget File is Imported' }))
			props?.onClose(true);
		}
		if(importStatus == 2) { setShowError(true);
			setShowSuccess(false)
		}
	}, [importStatus]);

	const callImport = () => {
		setShowInProgress(true)
		importBudgets(appInfo, importType?.[importOption], file, (response:any) => {
			console.log("import response", response)
      setImportResponse(response);
       validationInterval.current = setInterval(function () {
        valdationStatus(appInfo, response?.ResultId, (vldStatus: any) => {
          if (vldStatus?.Success && vldStatus?.IsDataValid) {
            setShowInProgress(false);
            setImportResponse(vldStatus);
            setShowSuccess(true);
            let statusResult: any = 0;
             statusInterval.current = setInterval(function () {
              if ([1, 2]?.includes(statusResult)) {
                clearInterval(statusInterval.current);
                dispatch(setImportBudgetsStatus(statusResult));
                dispatch(fetchGridData(appInfo));
              }
              fetchImportStatus(
                appInfo,
                vldStatus?.ResultId,
                (statusResp: any) => {
                  statusResult = statusResp;
                  if (statusResp) setImportStatus(statusResp);
                }
              );
            }, 3000);
            clearInterval(validationInterval.current);
          } else if (vldStatus?.Success && vldStatus?.IsDataValid === false) {
            setShowInProgress(false);
            setShowError(true);
            clearInterval(validationInterval.current);
          }
        });
      }, 3000);
		})
	}

	const onStartImport = () => { 
		console.log("import start")
		if(importOption == 'new') callImport()
		if(importOption == 'replace') {
			checkIsReplaceAllowed(appInfo, (response:any) => {
				setIsReplaceAllowed(response)
				if(response) setShowAlert({
					show:true, 
					msg: <div className="warning-text"><span>This will Replace/Overwrite all the existing Budget Line Items with the New Items. Do you want to Continue?</span></div>
				})
				else setShowAlert({
					show:true, 
					msg: <div className="warning-text"><span>One or more Budget Line Items are currently being used in one of the following modules - Bids, Contracts & Pay applications. Hence this Budget File cannot be imported.</span></div>,
					button1:'CANCEL',
					button2:'OK',
				})			
			})
		}		
		if(importOption == 'append') setShowAlert({
				show:true, 
				msg: <div className="warning-text"><span>New Budget Line items will be Appended to the existing items Are you sure you want to continue?</span></div>
			}
		)
		
		// setTimeout(() => {setShowInProgress(false); setShowSuccess(true)}, 1000); 
	};
	const onCancelImport = () => { 
    setShowInProgress(false); 
    setShowSuccess(false); 
    setShowError(false); 
    setDisableStartImport(true) ; 
    setImportStatus(0)
    cancelImport(appInfo, 
      importResponse?.ResultId, (resp:any) => {
        clearInterval(statusInterval.current);
        clearInterval(validationInterval.current);
      }) 
    };
	const onNotifyAfterImport = () => { props?.onClose(false); props?.openNotification(true) };
	const onStartOver = () => {setShowError(false); setImportStatus(0); callImport()};
	const handleOnOptionChange = (event:any) => {
		console.log("event", event?.target.value);
		setImportOption(event.target.value);
	};

	const handleAlertAction = (type:string, option:string) => {
		if(type == 'yes' && option=='append') callImport();
		if(type == 'yes' && option=='replace' && isReplaceAllowed) callImport();
		if(type == 'yes' && option=='replace' && !isReplaceAllowed) props?.onClose(true);
		setShowAlert({show: false, msg: ''});
	}

	const handleHelp = () => {
		postMessage({
			event: "help",
			body: {
				iframeId: 'budgetManagerIframe',
				roomId: appInfo && appInfo.presenceRoomId,
				appType: "BudgetManager",
				isFromHelpIcon: true
			}
		});
	}

	return (
    <IQBaseWindow
      open={true}
      title="Budget Importer"
      className="bm-importer"
      minHeight="300px"
      tools={{
        closable: true,
        customTools: (
          <IQTooltip title="Help" placement={"bottom"}>
            <IconButton
              key={"budget-importer-help"}
              className="budget-importer-help"
              aria-label="help"
              onClick={handleHelp}
            >
              <span className="common-icon-Live-Support-Help header_icon"></span>
            </IconButton>
          </IQTooltip>
        ),
      }}
      actions={
        <div>
          {!showInProgress && !showSuccess && !showError && (
            <IQButton
              color="orange"
              className="start-import-cls"
              disabled={disableStartImport}
              onClick={() => onStartImport()}
            >
              START IMPORT
            </IQButton>
          )}
          {(showInProgress || showError) && (
            <IQButton
              color="lightGrey"
              className="cancel-import-cls"
              onClick={() => onCancelImport()}
            >
              CANCEL IMPORT
            </IQButton>
          )}
          {showSuccess && (
            <IQButton color="lightGrey" onClick={() => onNotifyAfterImport()}>
              NOTIFY ME AFTER COMPLETE
            </IQButton>
          )}
          {showError && (
            <IQButton
              color="lightGrey"
              className="start-over-cls"
              onClick={() => onStartOver()}
            >
              START OVER
            </IQButton>
          )}
        </div>
      }
      withInModule={true}
      {...props}
    >
      {showInProgress && <InProgressDialog />}
      {showSuccess && <SuccessDialog />}
      {showError && <ErrorDialog />}
      {!showInProgress && !showSuccess && !showError && (
        <div className="import-wrap-cls">
          <Stack className="bm-type">
            <div className="question-cls">
              How do you like to Start your Budget Import?
            </div>
            <RadioGroup
              name="import-type"
              value={importOption}
              onChange={(e: any) => handleOnOptionChange(e)}
            >
              {props?.noOfBudgetItems == 0 && (
                <FormControlLabel value="new" control={<Radio />} label="New" />
              )}
              <FormControlLabel
                value="replace"
                control={<Radio />}
                label="Replace Data"
                disabled={props?.noOfBudgetItems == 0}
              />
              <FormControlLabel
                value="append"
                control={<Radio />}
                label="Append Data"
                disabled={props?.noOfBudgetItems == 0}
              />
              <FormControlLabel
                value="merge"
                control={<Radio />}
                label="Merge Data"
                disabled={true}
              />
            </RadioGroup>
          </Stack>
          <Stack className="select-file-cls">
            <IQFileUploadField
              label="Select File to Import"
              placeholder="Note: Supported file .xlsx or .xls"
              onFileChange={(file: any) => {
                console.log("filee", file);
                setFile(file);
                setDisableStartImport(false);
              }}
            />
          </Stack>
          <Stack className="info-box">
            <div className="info-container">
              <span className="info-icon common-icon-info-white"></span>
              <span className="info-text">
                We recommend you to first download the standard budget template
                and use this template to build your data file.
                <br />
                Note: Once the template is ready, use that file to begin your
                import process.
                <br />
                <IQButton
                  className="download-template-btn"
                  color="orange"
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      `${appInfo?.hostUrl}/enterprisedesktop/api/v2/budgets/${appInfo?.uniqueId}/import/downloadtemplate?noofsegments=${props?.noOfLevels}&sessionId=${appInfo?.sessionId}`,
                      "_blank"
                    )
                  }
                >
                  DOWNLOAD TEMPLATE
                </IQButton>
              </span>
            </div>
          </Stack>
        </div>
      )}
      {showAlert?.show && (
        <ConfirmationDialog
          handleAction={(type: string) => {
            handleAlertAction(type, importOption);
          }}
          onClose={() => {
              setShowAlert({show: false, msg: ''});
          }}
          content={showAlert?.msg}
          button1={showAlert?.button1}
          button2={showAlert?.button2}
        />
      )}
    </IQBaseWindow>
  );
};

export default memo(BudgetImporter);