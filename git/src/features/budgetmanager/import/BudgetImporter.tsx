import { FormControlLabel, Radio, RadioGroup, Stack } from "@mui/material";
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
import { importBudgets, fetchImportStatus, cancelImport, checkIsReplaceAllowed } from "../operations/budgetImportAPI";
import { importType } from "utilities/commonutills";
import { fetchGridData } from "../operations/gridSlice";

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
	const [importResponse, setImportResponse] = React.useState<any>({})
	console.log("props?.noOfBudgetItems", props?.noOfBudgetItems, props?.noOfLevels)

	React.useEffect(() => {props?.noOfBudgetItems == 0 ? setImportOption('new') : setImportOption('replace')}, [props?.noOfBudgetItems])
	React.useEffect(() => {
		if(importStatus == 1) { 
			props?.onClose(true);			
			dispatch(setToastMessage({ displayToast: true, message: 'Budget Line Items added successfully' }))
		}
		if(importStatus == 2) { setShowError(true);
			setShowSuccess(false)
		}			
		dispatch(setImportBudgetsStatus(importStatus));

	}, [importStatus]);

	const callImport = () => {
		setShowInProgress(true)
		importBudgets(appInfo, importType?.[importOption], file, (response:any) => {
			console.log("import response", response)
			if(response?.Success && response?.IsDataValid) {
				setShowInProgress(false)
				setImportResponse(response)
				setShowSuccess(true)
				let statusResult:any=0;
				const interval = setInterval(function() {
					if([1,2]?.includes(statusResult)){
						clearInterval(interval);
						dispatch(fetchGridData(appInfo)); 
					}
					fetchImportStatus(appInfo, response?.ResultId, (statusResp:any) => {
						statusResult=statusResp
						if(statusResp) setImportStatus(statusResp)
					});
				}, 3000);
			} else {
				setShowInProgress(false)
				setShowError(true)
			}	
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
					msg: <div className="warning-text"><span>One or more Budget Line Items are currently being used in one of the following modules-Bids, Contracts and Pay applications. Hence this budget file cannot be imported.?</span></div>
				})			
			})
		}		
		if(importOption == 'append') setShowAlert({
				show:true, 
				msg: <div className="warning-text"><span>New Budget Line items will be Appended to the existing items, Are you sure want to continue?</span></div>
			}
		)
		
		// setTimeout(() => {setShowInProgress(false); setShowSuccess(true)}, 1000); 
	};
	const onCancelImport = () => { setShowInProgress(false); setShowSuccess(false); setShowError(false); cancelImport(appInfo, importResponse?.ResultId, (resp:any) => {}) };
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


	return <IQBaseWindow
		open={true}
		title='Budget Importer'
		className="bm-importer"
		minHeight='300px'
		tools={{
			closable: true
		}}
		actions={
			<div>
				{!showInProgress && !showSuccess && !showError && <IQButton color="orange" disabled={disableStartImport} onClick={() => onStartImport()}>
					START IMPORT
				</IQButton>}
				{(showInProgress || showError) && <IQButton color="lightGrey" onClick={() => onCancelImport()}>
					CANCEL IMPORT
				</IQButton>}
				{showSuccess && <IQButton color="lightGrey" onClick={() => onNotifyAfterImport()}>
					NOTIFY ME AFTER COMPLETE
				</IQButton>}
				{showError && <IQButton color="lightGrey" onClick={() => onStartOver()}>
					START OVER
				</IQButton>}
			</div>
		}
		withInModule={true}
		{...props}
	>
		{showInProgress && <InProgressDialog />}
		{showSuccess && <SuccessDialog />}
		{showError && <ErrorDialog />}
		{!showInProgress && !showSuccess && !showError && <div className="import-wrap-cls">
			<Stack className="bm-type">
				<div className="question-cls">How do you like to start your Budget Import?</div>
				<RadioGroup
					name="import-type"
					value={importOption}
					onChange={(e:any) => handleOnOptionChange(e)}
				>
					{props?.noOfBudgetItems == 0 && <FormControlLabel
						value="new"
						control={<Radio />}
						label="New"
					/>}
					<FormControlLabel
						value="replace"
						control={<Radio />}
						label="Replace"
						disabled={props?.noOfBudgetItems == 0}
					/>
					<FormControlLabel
						value="append"
						control={<Radio />}
						label="Append"
						disabled={props?.noOfBudgetItems == 0}
					/>
					<FormControlLabel
						value="merge"
						control={<Radio />}
						label="Merge"
						disabled={true}
					/>
				</RadioGroup>
			</Stack>
			<Stack className="select-file-cls">
				<IQFileUploadField
					label='Select File to Import'
					placeholder='Note: Supported file .xlsx or .xls'
					onFileChange={(file:any) => { console.log("filee", file); setFile(file); setDisableStartImport(false) }}
				/>
			</Stack>
			<Stack className="info-box">
				<div className="info-container">
					<span className='info-icon common-icon-info-white'></span>
					<span className='info-text'>We recommend you to first download the standard budget template and use this template to build your data file.<br />
						Note: Once the template is ready, use that to begin your import process.<br />
						<IQButton
							className="download-template-btn"
							color="orange"
							variant="outlined"
							onClick={() =>
								window.open(`${appInfo?.hostUrl}/enterprisedesktop/api/v2/budgets/${appInfo?.uniqueId}/import/downloadtemplate?noofsegments=${props?.noOfLevels}&sessionId=${appInfo?.sessionId}`, "_blank")
							}
						>
							DOWNLOAD TEMPLATE
						</IQButton>
					</span>
				</div>
			</Stack></div>}
			{showAlert?.show && <ConfirmationDialog handleAction={(type:string) => {handleAlertAction(type, importOption)}} content={showAlert?.msg}/>}
	</IQBaseWindow>;
};

export default memo(BudgetImporter);