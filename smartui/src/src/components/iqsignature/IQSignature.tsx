import {Stack} from '@mui/material';
import {memo, useEffect} from 'react';
import Signature, {ReactSignatureCanvasProps} from 'react-signature-canvas';

import './IQSignature.scss';

export interface IQSignatureProps extends ReactSignatureCanvasProps {
	signRef: any;
	title?: string;
	className?: string;
	value?: string;
	onClear?: any;
};

export default memo(({className, signRef, title = 'Signature', canvasProps, value = '',
	onClear, ...props}: IQSignatureProps) => {
	const readOnly = value !== '';

	const clearSignature = () => {
		if(signRef?.current) {
			signRef.current.clear();
			onClear && onClear();
		}
	};

	useEffect(() => {
		if(signRef.current) {
			const parentNode = signRef.current._canvas.parentNode;
			signRef.current.width = parentNode?.clientWidth;
			signRef.current.height = parentNode?.clientHeight;
			if(readOnly) {
				signRef.current.fromDataURL(value);
				signRef.current.off();
			}
		}
	}, [value]);

	return <Stack className={`iq-signature${className ? ` ${className}` : ''}`}>
		<div className='title-box'>
			<span className='common-icon-signature'></span>
			<span className='title-text'>{title}</span>
		</div>
		<div className={`sign-pad-box${readOnly ? ' read-only' : ''}`}>
			<Signature
				{...props}
				canvasProps={{
					...canvasProps, ...{
						className: `sign-pad${readOnly ? ' read-only' : ''}`
					}
				}}
				ref={signRef}
			/>
			{!readOnly && <div className='pad-controls'>
				<div></div>
				<div style={{fontSize: 14}}>Please sign above</div>
				<div className='eraser-control'>
					<span
						className='common-icon-eraser'
						onClick={clearSignature}
					></span>
				</div>
			</div>}
		</div>
	</Stack>;
});