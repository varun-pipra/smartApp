import {
	Button,
	DialogContent,
	DialogContentText,
	DialogProps,
} from "@mui/material";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./SafetyViolationDialog.scss";
import { useState, useEffect } from "react";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { postMessage } from "app/utils";
export interface SafetyViolationDialogProps extends DialogProps {
	title: string;
	contentText: any;
	onAction?: Function;
	showActions?: boolean;
	dialogClose?: boolean;
	helpIcon?: boolean;
	helpModule?:string;
	width?: any;
	positiveActionLabel?: string;
	negativeActionLabel?: string;
	disable?: boolean;
	onClose?: any;
	iconTitleContent?: React.ReactNode;
	customButtons?:boolean;
	customButtonsContent?: React.ReactNode;
	showPositiveBtn?:boolean;
	showNegativeBtn?:boolean;
	onHelpOpen?:any;

}

const SafetyViolationDialog = (props: SafetyViolationDialogProps) => {
	const {
		title = "",
		dialogClose = false,
		helpIcon = false,
		positiveActionLabel = "",
		negativeActionLabel = "",
		disable = false,
		width = 600,
		open = false,
		showActions = false,
		customButtons = false,
		onClose = () => { },
		contentText = "",
		iconTitleContent = <></>,
		customButtonsContent = <></>,
		onAction = () => { },
		showPositiveBtn = true,
		showNegativeBtn = true,
		className = '',
		...others
	} = props;
	const [openDlg, setOpenDlg] = useState(false);
	const handleAction = (event: any, type: string) => {
		if (onAction) {
			onAction(event, type);
		}
	};
	const handleHelp =() => {
		console.log('violationExpungeHelp postMessage');
		if(props?.helpModule === 'SBS'){
			postMessage({
				"event": "sbs",
				"body": {
					"evt": "managephasehelp",
					"record": {}
				}
			})
		}else {
			postMessage({ event: 'projectteam', body: { evt: 'violationExpungeHelp', record: {}}});
		}		
		if(props?.onHelpOpen) props?.onHelpOpen(true);
	};
	useEffect(() => {
		setOpenDlg(open);
	}, [open]);
	return (
		<Dialog
			open={openDlg}
			className={"safety-violation-dialog-container " + className }
			onClose={onClose}
			sx={{
				".MuiDialog-container": {
					".MuiPaper-root": {
						maxWidth: width,
					},
				},
			}}
		>
			<DialogTitle>
				{iconTitleContent && (
					iconTitleContent
				)}
				{title && (
					title
				)}
				{dialogClose && (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
						}}
					>
						<IconButton
							onClick={(e) => {
								setOpenDlg(false);
								handleHelp();
							}}
						>
							{helpIcon && (
								<span className="common-icon-Live-Support-Help header_icon"></span>
							)}
						</IconButton>
						<IconButton
							onClick={(e) => {
								setOpenDlg(false);
								handleAction(e, "close");
							}}
						>
							<span className="common-icon-close" style={{ fontSize: "18px", color: "#333",}}></span>
						</IconButton>
					</div>
				)}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>{contentText}</DialogContentText>
			</DialogContent>
			{showActions && (
				<DialogActions>
					{showNegativeBtn && (
						<Button
							className="cancel-cls"
							onClick={(e) => handleAction(e, "cancel")}
						>
							{negativeActionLabel}
						</Button>
					)}
					{showPositiveBtn && (
						<Button
							className="yes-cls"
							variant="contained"
							autoFocus
							disabled={disable}
							onClick={(e) => handleAction(e, "ok")}
						>
							{positiveActionLabel}
						</Button>
					)}
				</DialogActions>
			)}
			{customButtons && (
				<DialogActions>
				{customButtonsContent}
			</DialogActions>
			)}
		</Dialog>
	);
};

export default SafetyViolationDialog;
