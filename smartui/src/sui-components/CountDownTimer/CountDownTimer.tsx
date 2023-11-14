import React, { useState, useCallback } from "react";
import { Stack } from '@mui/material';

import './CountDownTimer.scss';

const SUICountDownTimer = (props: any) => {
	const [days, setDays] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);
	const [counterExpired, setCounterExpired] = useState(false);

	/**
	 * Triggers on each second from setInterval
	 * Sets the states of days/hours/minues/seconds
	 * @author Srinivas Nadendla
	 */
	const getTimeUntil = () => {
		const { days, targetDate } = props,
			target = new Date(props.targetDate),
			time = target.toString() !== '"Invalid Date"' ? (target?.getTime() - new Date().getTime()) : 0;

		if (time < 0 || Number.isNaN(time)) {
			clearInterval(timeInterval);
			setCounterExpired(true);
			return;
		}

		setSeconds(Math.floor((time / 1000) % 60));
		setMinutes(Math.floor((time / 1000 / 60) % 60));
		setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
		setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
	};

	const DaySection = useCallback(() => {
		return (
			<span className="time-unit">
				<span className="value">{`${days < 10 ? "0" : ""}${days}`}</span>
				<span className="label">{`day${days > 1 ? "s" : ""}`}</span>
			</span>
		);
	}, [days]);

	const HoursSection = useCallback(() => {
		return (
			<span className="time-unit">
				<span className="value">{`${hours < 10 ? "0" : ""}${hours}`}</span>
				<span className="label">{`hour${hours > 1 ? "s" : ""}`}</span>
			</span>
		);
	}, [hours]);

	const MinutesSection = useCallback(() => {
		return (
			<span className="time-unit">
				<span className="value">{`${minutes < 10 ? "0" : ""}${minutes}`}</span>
				<span className="label">{`hour${minutes > 1 ? "s" : ""}`}</span>
			</span>
		);
	}, [minutes]);

	const SecondsSection = useCallback(() => {
		return (
			<span className='time-unit'>
				<span className='value'>{`${seconds < 10 ? '0' : ''}${seconds}`}</span>
				<span className='label'>{`second${seconds > 1 ? 's' : ''}`}</span>
			</span>
		);
	}, [seconds]);

	const timeInterval = setInterval(() => getTimeUntil(), 1000);

	return (
		// <Stack className={`sui-countdown-timer${counterExpired ? ' expired' : ''}`} direction='row'>
		<Stack className='sui-countdown-timer' direction='row'>
			<DaySection></DaySection>
			<span className='separator'>:</span>
			<HoursSection></HoursSection>
			<span className='separator'>:</span>
			<MinutesSection></MinutesSection>
			<span className='separator'>:</span>
			<SecondsSection></SecondsSection>
		</Stack>
	);
};

export default SUICountDownTimer;
