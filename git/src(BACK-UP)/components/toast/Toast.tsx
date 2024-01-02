import React, { Fragment, useEffect, useState } from 'react';
import './Toast.scss'

export interface ToastProps {
	message: string | undefined,
	interval?: number,
	showclose?: boolean,
	onHide?: any;
};

const Toast = ({ message, interval = 0, showclose = false, onHide }: ToastProps) => {
	const [Showmessage, setShowmessage] = useState(true);
	const [Showclosebtn, setShowclosebtn] = useState(false);

	useEffect(() => {
		if (interval > 0) {
			setTimeout(() => {
				setShowmessage(false);
				onHide && onHide();
			}, interval);
		}
		interval != 0 && showclose == false ? setShowclosebtn(false)
			: interval != 0 && showclose == true ? setShowclosebtn(true)
				: interval == 0 && showclose == false ? setShowclosebtn(false)
					: interval == 0 && showclose == true ? setShowclosebtn(true)
						: setShowclosebtn(false)
	}, []);


	const Closetoast = () => {
		setShowmessage(false)
	}
	return (
		<Fragment >
			{Showmessage &&
				<div data-testid="toastmsg" className='toastmessage-div' >
					<span className='toastmessage'>{message}</span>
					{Showclosebtn && <span data-testid="closebutton" className='close-button' onClick={() => Closetoast()}>x</span>}
				</div>
			}
		</Fragment>

	);
}

export default Toast;