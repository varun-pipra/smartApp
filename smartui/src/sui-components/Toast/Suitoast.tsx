import React, { Fragment, useEffect, useState } from 'react';
import './Suitoast.scss'

interface ToastProps {
	message?: any,
	interval?: number,
	showclose?: boolean,
	onHide?: any;
};

interface ToastProps2 {
	message1?: any,
	message2?: any,
	interval?: number,
	showclose?: boolean,
	onHide?: any;
};
export const SUIToast = ({ message, interval = 0, showclose = false, onHide }: ToastProps) => {
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
				<div data-testid="toastmsg" className='Sui-toastmessage-div' >
					<div className='closebutton_section'>
						{Showclosebtn && <span className="common-icon-close" onClick={() => Closetoast()}></span>}
					</div>
					<div className='message_section'>
						<div className='icon'>
							<span className='common-icon-c-mark'></span>
						</div>
						<div className='message'>
							{message}
						</div>
					</div>
				</div>
			}
		</Fragment>

	);
}

export const SUIToast2 = ({ message1, message2, interval = 0, showclose = false, onHide }: ToastProps2) => {
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
				<div data-testid="toastmsg" className='Sui-toastmessage-div2' >
					<div className='closebutton_section'>
						{Showclosebtn && <span className="common-icon-close" onClick={() => Closetoast()}></span>}
					</div>
					<div className='message_section'>
						<div className='icon'>
							<span className='common-icon-Certification-approve-icon' style={{ fontSize: message2 ? '64px' : '32px' }}></span>
						</div>
						<div className='message'>
							<div className='message1_div'>
								{message2 && <span className='number'>1</span>}
								<span className='message'>{message1}</span>
							</div>
							{message2 &&
								<>
									<div className='line'></div>
									<div className='message2_div'>
										<span className='number'>2</span>
										<span className='message'>{message2}</span>
									</div>
								</>
							}
						</div>
					</div>
				</div>
			}
		</Fragment>

	);
}