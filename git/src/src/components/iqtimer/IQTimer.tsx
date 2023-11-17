import React, { useEffect, useState } from 'react';

import './IQTimer.scss';

const IQTimer = ({ value }: any) => {
	const [date, setDate] = useState(new Date(value));
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	const interval = setInterval(() => timer(), 1000);

	const timer = () => {
		const diff = date.getTime() - new Date().getTime();

		if (diff === 0) {
			clearInterval(interval);
			return;
		}

		setSeconds(Math.floor((diff / 1000) % 60));
		setMinutes(Math.floor((diff / 1000 / 60) % 60));
		setHours(Math.floor(diff / (60 * 60 * 1000)));
	};

	return <div className='iqtimer'>
		{`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
	</div>;
};

export default IQTimer;