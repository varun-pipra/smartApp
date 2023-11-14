import React, {useCallback, useRef, useState, useEffect} from "react";
import SignatureCanvas from "react-signature-canvas";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
//import CloseIcon from "@mui/icons-material/Close";
//import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
//import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
//import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import "./ContractSignModal.scss";

interface SignModalPorps {
	formType: string; //Types: sign/decline/revise
	open: boolean;
	userName: any;
	onModalClose: any;
	onSubmit: any;
}

const ContractSignModal = (props: SignModalPorps) => {
	const signaturePadRef = useRef<any>();
	const reasonRef = useRef<any>();
	const [ isChecked, setIsChecked ] = useState<boolean>(false);
	const [ signaturevalidation, setSignatureValidation ] = useState<any>(true);
	const [ toggleModal, setToggleModal ] = useState<boolean>(false);
	const [ formType, setFormType ] = useState<string>("");
	const [ reasonVal, setReasonVal ] = useState<any>(" ");
	const [ testValue, setTestValue ] = useState<boolean>(false);

	useEffect(() => {
		reasonRef.current = reasonVal;
	}, [ reasonVal ]);

	const handleClose = () => {
		clearSignature();
		props.onModalClose();
	};

	const SignatureComponent = () => {
		return (
			<>
				<div className="contracts-sign-modal_sig-pad-title">
					<span className="common-icon-signature"></span> Signature
				</div>
				<div className="contracts-sign-modal_sig-pad-wrapper" style={{width: '100%'}}>
					<SignatureCanvas
						ref={signaturePadRef}
						penColor="black"
						canvasProps={{
							// width: 350,
							//height: 150,
							className: "contracts-sign-modal_sig-pad",
						}}
						onEnd={() => {handleOnEnd();}}
					/>
					<div className="contracts-sign-modal_sign-above-wrapper">
						<div className="contracts-sign-modal_sign-above-txt">
							Please sign above
						</div>
						<span
							className="contracts-sign-modal_sign-eraser common-icon-eraser"
							onClick={() => clearSignature()}
						></span>
					</div>
				</div>
			</>
		);
	};

	const TitleComponent = (titleProps: any) => {
		return (
			<DialogTitle sx={{m: 0, p: 2}}>
				{titleProps.title}
				<IconButton
					aria-label="close"
					onClick={() => handleClose()}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[ 500 ],
					}}
				>
					<span className="common-icon-close"></span>
				</IconButton>
			</DialogTitle>
		);
	};

	const checkboxHandle = (event: any) => {
		if(event.target.checked) {
			setIsChecked(true);
		}
		else {
			setIsChecked(false);
		}
	};
	const CheckboxComponent = useCallback(
		(checkboxProps: any) => {
			return (
				<div>
					<Checkbox
						onChange={(event: any) => {checkboxHandle(event);}}

					/>

					<span className="contracts-sign-modal_agree-text">
						I, <b>{props.userName}, </b> {checkboxProps.desc}
					</span>
				</div>
			);
		},
		[ props.userName ]
	);

	const getBtnName = () => {
		let btnName = "";
		switch(formType) {
			case "sign":
				btnName = "ACCEPT";
				break;
			case "decline":
				btnName = "DECLINE";
				break;
			case "revise" || 'reject':
				btnName = "SUBMIT";
				break;

		}
		return btnName;
	};

	const clearSignature = () => {
		setSignatureValidation(true);
		if(signaturePadRef?.current) {
			signaturePadRef.current.clear();
		}
	};

	const getSignature = () => {

		return signaturePadRef?.current?.getTrimmedCanvas().toDataURL("image/png");
	};

	const handleMainBtnClick = () => {
		props.onSubmit({signature: getSignature(), reason: reasonRef?.current, type: formType});
		// props.onSubmit({ reason: reasonRef?.current, type: formType });    
	};
	const handleOnEnd = () => {
		setSignatureValidation(signaturePadRef?.current?.isEmpty());
	};
	const validation = () => {
		let validate;
		if(formType == 'decline' || formType == 'revise') {
			validate = !isChecked || signaturevalidation || !testValue ? true : false;
		}
		else if(formType == 'reject') {
			validate = !testValue ? true : false;
		}
		else {
			validate = !isChecked || signaturevalidation ? true : false;
		}
		return validate;
	};

	useEffect(() => {
		setToggleModal(props.open);
	}, [ props.open ]);

	useEffect(() => {
		setFormType(props.formType);
	}, [ props.formType ]);

	return (
		<Dialog
			onClose={handleClose}
			open={toggleModal}
			className="contracts-sign-modal"
		>
			{formType === "sign" && (
				<>
					<TitleComponent title="Sign & Accept Contract"></TitleComponent>
					<DialogContent className="contracts-sign-modal_content">
						<>
							<div className="contracts-sign-modal_sig-pad-title">
								<span className="common-icon-signature"></span> Signature
							</div>
							<div className="contracts-sign-modal_sig-pad-wrapper" style={{width: '100%'}}>
								<SignatureCanvas
									ref={signaturePadRef}
									penColor="black"
									canvasProps={{
										// width: 428,
										//height: 100,
										className: "contracts-sign-modal_sig-pad",
									}}
									onEnd={() => {handleOnEnd();}}
								/>
								<div className="contracts-sign-modal_sign-above-wrapper">
									<div className="contracts-sign-modal_sign-above-txt">
										Please sign above
									</div>
									<span
										className="contracts-sign-modal_sign-eraser common-icon-eraser"
										onClick={(e: any) => {clearSignature();}}
									></span>
								</div>
							</div>
						</>
						<CheckboxComponent desc="reviewed the Contract in detail and I digitally sign to accept this Contract."></CheckboxComponent>
					</DialogContent>
				</>
			)}
			{formType === "decline" && (
				<>
					<TitleComponent title="Decline Contract"></TitleComponent>
					<DialogContent className="contracts-sign-modal_content">
						<div className="contracts-sign-modal_decline-title">
							<span className="common-icon-Description"></span> Reason For Declining the Contract
						</div>

						<TextField
							id="description"
							variant='outlined'
							fullWidth
							multiline
							minRows={6}
							maxRows={10}
							placeholder='Enter Reason for Delcining the Contract'
							name='reason'
							value={reasonVal}
							onChange={(event) => {
								event.target.value ? setTestValue(true) : setTestValue(false);
								setReasonVal(event.target.value);
							}}
						/>
						<>
							<div className="contracts-sign-modal_sig-pad-title">
								<span className="common-icon-signature"></span> Signature
							</div>
							<div className="contracts-sign-modal_sig-pad-wrapper" style={{width: '100%'}}>
								<SignatureCanvas
									ref={signaturePadRef}
									penColor="black"
									canvasProps={{
										// width: 428,
										//height: 150,
										className: "contracts-sign-modal_sig-pad",
									}}
									onEnd={() => {handleOnEnd();}}
								/>
								<div className="contracts-sign-modal_sign-above-wrapper">
									<div className="contracts-sign-modal_sign-above-txt">
										Please sign above
									</div>
									<span
										className="contracts-sign-modal_sign-eraser common-icon-eraser"
										onClick={(e: any) => {clearSignature();}}
									></span>
								</div>
							</div>
						</>
						<CheckboxComponent desc="reviewed the Contract in detail and would like to make some changes detailed in the above reason."></CheckboxComponent>
					</DialogContent>
				</>
			)}
			{formType === "revise" && (
				<>
					<TitleComponent title="Revise & Resubmit Contract"></TitleComponent>
					<DialogContent className="contracts-sign-modal_content">
						<div className="contracts-sign-modal_decline-title">
							<span className="common-icon-Description"></span> Reason for sending
							back the Contract
						</div>

						<TextField
							id="description"
							variant='outlined'
							fullWidth
							multiline
							minRows={6}
							maxRows={10}
							placeholder="Enter Reason for sending back the contract"
							value={reasonVal}
							onChange={(event) => {
								event.target.value ? setTestValue(true) : setTestValue(false);
								setReasonVal(event.target.value);
							}}
						></TextField>
						<>
							<div className="contracts-sign-modal_sig-pad-title">
								<span className="common-icon-signature"></span>  Signature
							</div>
							<div className="contracts-sign-modal_sig-pad-wrapper" style={{width: '100%'}}>
								<SignatureCanvas
									ref={signaturePadRef}
									penColor="black"
									canvasProps={{
										// width: 428,
										//height: 150,
										className: "contracts-sign-modal_sig-pad",
									}}
									onEnd={() => {handleOnEnd();}}
								/>
								<div className="contracts-sign-modal_sign-above-wrapper">
									<div className="contracts-sign-modal_sign-above-txt">
										Please sign above
									</div>
									<span
										className="contracts-sign-modal_sign-eraser common-icon-eraser"
										onClick={() => clearSignature()}
									></span>
								</div>
							</div>
						</>
						<CheckboxComponent desc="reviewed the Contract in detail and would"></CheckboxComponent>
					</DialogContent>
				</>
			)}
			{
				formType === 'reject' && (
					<>
						<TitleComponent title="Reject Pay Application"></TitleComponent>
						<DialogContent className="contracts-sign-modal_content">
							<div className="contracts-sign-modal_decline-title">
								<span className="common-icon-Description"></span> Reason For Rejecting the Pay Application
							</div>
							<TextField
								id="description"
								variant='outlined'
								fullWidth
								multiline
								minRows={6}
								maxRows={10}
								placeholder='Enter Reason for Delcining the Contract'
								name='reason'
								value={reasonVal}
								onChange={(event) => {
									event.target.value ? setTestValue(true) : setTestValue(false);
									setReasonVal(event.target.value);
								}}
							/>
						</DialogContent>
					</>
				)
			}
			<DialogActions>
				<Button
					autoFocus
					variant="contained"
					onClick={handleClose}
					sx={{
						color: "white",
						backgroundColor: "rgb(102 102 102)",
						"&:hover": {
							backgroundColor: "rgb(102 102 102)",
						},
					}}
				>
					CANCEL
				</Button>
				<Button
					className={validation() ? "diabled-btn-cls" : ""}
					autoFocus
					onClick={handleMainBtnClick}
					variant="contained"
					sx={{
						color: "white",
						backgroundColor: "#059cdf",
						"&:hover": {
							backgroundColor: "#059cdf",
						},
					}}
				>
					SUBMIT
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ContractSignModal;