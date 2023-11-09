import {Checkbox, Stack} from '@mui/material';
import IQWindow from 'components/iqbasewindow/IQBaseWindow';
import {IQBaseWindowProps} from 'components/iqbasewindow/IQBaseWindowTypes';
import IQSignature, {IQSignatureProps} from 'components/iqsignature/IQSignature';
import {ReactNode, memo, useState} from 'react';
import SUIGrid, {TableGridProps} from 'sui-components/Grid/Grid';

import './SignatureWithGrid.scss';

type SignatureWithGridProps = IQBaseWindowProps & {
	gridProps: TableGridProps;
	leftSign: IQSignatureProps;
	rightSign?: IQSignatureProps | undefined;
	declarationText?: ReactNode | string;
	onDeclarationCheckChange?: Function;
};

export default memo(({className, gridProps, leftSign, rightSign, declarationText,
	onDeclarationCheckChange, ...props}: SignatureWithGridProps) => {
	const [declaration, setDeclaration] = useState(false);

	return <IQWindow
		{...props}
		className={`signature-with-grid${className ? ` ${className}` : ''}`}
		tools={{closable: true}}
		PaperProps={{
			sx: {
				width: '77em',
				height: '53em'
			}
		}}
	>
		<SUIGrid {...gridProps} />
		<Stack direction='row' className='sign-box'>
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