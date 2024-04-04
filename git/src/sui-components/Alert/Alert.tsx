//import CloseIcon from '@mui/icons-material/Close';
import './Alert.scss';

import {hideLoadMask} from 'app/hooks';
import {ReactNode, useEffect, useState} from 'react';

import {Button, DialogContent, DialogContentText, DialogProps} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

export interface SuiAlertProps extends DialogProps {
	title: string,
	contentText: any,
	onAction?: Function;
	showActions?: boolean;
	DailogClose?: boolean;
	modelWidth?: any;
	negativeAction?:string;
}

const SUIAlert = ({className, negativeAction = 'Cancel', ...props}: SuiAlertProps) => {
	const [openDlg, setOpenDlg] = useState(props.open);
	const [showActions, setShowActions] = useState(props?.showActions != undefined ? props?.showActions : true);

	const handleAction = (event: any, type: string) => {
		if(props.onAction) {
			props.onAction(event, type);
		}
	};

	useEffect(() => {
		if(props.open) {
			hideLoadMask();
		}
		setOpenDlg(props.open);
	}, [props.open]);

	useEffect(() => {
		setShowActions(props?.showActions != undefined ? props?.showActions : true);
	}, [props?.showActions]);

	return (
		<Dialog
			open={openDlg}
			className={`SuiAlert${className ? ` ${className}` : ''}`}
			onClose={props.onClose}
			sx={{
				'& .MuiPaper-root': {
					width: props.modelWidth ? props.modelWidth : '100% !important'
				}
			}}
		>
			<DialogTitle className='DailogTitle'>
				{props.title}
				{props.DailogClose &&
					<IconButton disableRipple onClick={(e) => {setOpenDlg(false); handleAction(e, 'close'); props.onClose && props.onClose(e, 'escapeKeyDown');}}>
						<span className="common-icon-Cancel"></span>
					</IconButton>
				}
			</DialogTitle>
			<DialogContent>
				{props.contentText}
			</DialogContent>
			{showActions &&
				<DialogActions>

					<Button className="cancel-cls" onClick={(e) => handleAction(e, 'cancel')}>{negativeAction}</Button>
					<Button className="yes-cls" variant="contained" autoFocus onClick={(e) => handleAction(e, 'yes')}>
						Yes
					</Button>
				</DialogActions>
			}
		</Dialog>
	);
};

export default SUIAlert;