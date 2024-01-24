import {memo} from 'react';
import './BlockchainIB.scss';

const InformationIB = ({className}: {className?: string;}) => {
	return <div className={`bubble-box${className ? ` ${className}` : ''}`}>
		<div className='icon common-icon-blockchain'></div>
		<div className='text'>
			<div>Awaiting Blockchain Authentication.</div>
			<div>Status will be updated one authentication is successful.</div>
		</div>
	</div>;
};

export default memo(InformationIB);