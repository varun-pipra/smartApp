import "./BlockchainAuthModel.scss";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {styled} from "@mui/material/styles";
import {useAppDispatch, useAppSelector} from "app/hooks";
import {setShowBlockchainDialog} from "app/common/blockchain/BlockchainSlice";

const BootstrapDialog = styled(Dialog)(({theme}) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

const BlockchainAuthModal = (props: any) => {
	const dispatch = useAppDispatch();
	const {showBlockchainDialog} = useAppSelector((state) => state.blockchain);

	const handleClose = () => {
		dispatch(setShowBlockchainDialog(false));
	};

	return (
		<BootstrapDialog
			open={showBlockchainDialog}
			onClose={handleClose}
			className="block-chain-auth-modal"
			{...props}
		>
			<DialogTitle className="block-chain-auth-modal_title" sx={{m: 0, p: 2}}>Blockchain Authentication</DialogTitle>
			<IconButton
				aria-label="close"
				onClick={handleClose}
				sx={{
					position: "absolute",
					right: 8,
					top: 8,
					color: (theme: any) => theme.palette.grey[500],
				}}
			>
				<CloseIcon />
			</IconButton>
			<DialogContent dividers>
				<div className="block-chain-auth-modal_body">
					<div className="block-chain-auth-modal_body-desc">
						Go to Smartapp.com mobile app on your{" "}
						<span className="block-chain-auth-modal_body-device-txt">
							device
						</span>{" "}
						to complete the transaction
					</div>
					<div className="block-chain-auth-modal_body-box">

						<div className="block-chain-auth-modal_body-box-steps">
							<div className="block-chain-auth-modal_body-box-header">
								How to Authenticate this Block Chain Transaction.
							</div>
							<div className="block-chain-auth-modal_body-box-steps-center">
								<ol>
									<li>On your device go to Smartapp.com mobile app.</li>
									<li>Under user menu select Blockchain Queue.</li>
									<li>Authenticate the Block Chain Transaction to confirm.</li>
								</ol>
							</div>
						</div>
						<div className="block-chain-auth-modal_body-note">
							In case if you have not setup your block chain yet, then you can
							do it from under the user menu in the BlockChain Settings.
						</div>
					</div>
				</div>
			</DialogContent>
		</BootstrapDialog>
	);
};

export default BlockchainAuthModal;