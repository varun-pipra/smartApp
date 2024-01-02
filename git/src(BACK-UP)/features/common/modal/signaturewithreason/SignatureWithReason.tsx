import IQWindow from 'components/iqbasewindow/IQBaseWindow';
import {IQBaseWindowProps} from 'components/iqbasewindow/IQBaseWindowTypes';
import IQSignature, {IQSignatureProps} from 'components/iqsignature/IQSignature';
import {ReactNode, memo, useState} from 'react';

import './SignatureWithReason.scss';
import {Stack, Checkbox, TextField} from '@mui/material';

type SignatureWithReasonProps = IQBaseWindowProps & {
	reasonLabel?: string;
	leftSign: IQSignatureProps;
	rightSign?: IQSignatureProps | undefined;
	declarationText?: ReactNode | string;
	onReasonChange?: Function;
	onDeclarationCheckChange?: Function;
};

export default memo(({className, leftSign, rightSign, declarationText, onReasonChange,
	onDeclarationCheckChange, reasonLabel, ...props}: SignatureWithReasonProps) => {
	const [declaration, setDeclaration] = useState(false);
	const [reason, setReason] = useState('');

	const handleReasonChange = (e: any) => {
		const text = e.target.value;
		setReason(text);
		onReasonChange && onReasonChange(text);
	};

	return <IQWindow
		{...props}
		className={`signature-with-reason${className ? ` ${className}` : ''}`}
		tools={{closable: true}}
		PaperProps={{
			sx: {
				width: '35em',
				height: '45em'
			}
		}}
	>
		<div className='reason-field'>
			<div className='title-box'>
				<span className='common-icon-Description'></span>
				<span className='title-text'>{reasonLabel}</span>
			</div>
			<TextField
				variant='outlined'
				fullWidth
				multiline
				minRows={8}
				maxRows={15}
				name='reason'
				value={reason}
				onChange={handleReasonChange}
			/>
		</div>
		<Stack className='sign-box'>
			<IQSignature {...leftSign} />
			{rightSign && <IQSignature {...rightSign} />}
		</Stack>
		<div className='declaration'>
			<Checkbox
				value={declaration}
				disableRipple
				onChange={(e: any, checked: boolean) => {
					setDeclaration(checked);
					onDeclarationCheckChange && onDeclarationCheckChange(checked);
				}}
			/>
			{declarationText}
		</div>
	</IQWindow>;
});