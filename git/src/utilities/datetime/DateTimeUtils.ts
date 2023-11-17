/**
 * Date formatter utility function. (Do not edit this method)
 * @param input - date string
 * @param format - Intl.DateTimeFormat's format object
 */
export const formatDate = (input: string, format?: any) => {
	const defaultFormat = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};
	if(!input) return;
	else {
		const date = new Date(input);
		return new Intl.DateTimeFormat('en-US', (format || defaultFormat)).format(date);
	}
};

/**
 * Returns the date in the following format M/d/Y | Example: 01/01/2000
 * input - string variable that has a valid date format
 */
export const getDate = (input: string) => {
	if(!input) return;
	else {
		const date = new Date(input);
		return new Intl.DateTimeFormat('en-US').format(date);
	}
};

/**
 * Returns the time in the following format hh:mm AA | Example: 12:00 AM
 * input - string variable that has a valid date format
 */
export const getTime = (input: string) => {
	if(!input) return;
	else {
		const date = new Date(input);
		return new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'}).format(date);
	}
};

/**
 * Merges time to date and return ISO date string
 * date - string variable that has a valid date value
 * time - string variable that has the time in the following format hh:mm AA | Example: 12:00 AM
 */
export const addTimeToDate = (date: string, time: string) => {
	if(!date || !time) return;
	else {
		let [hourString, minuteMeridiem] = time.split(':'),
			[minuteString, meridiem] = minuteMeridiem.split(' ');

		let hours = parseInt(hourString),
			minutes = parseInt(minuteString);

		if(meridiem === 'AM') {
			if(hours === 12) hours -= 12;
		} else {
			if(hours !== 12) hours += 12;
		}

		const mergedDate = new Date(date);
		mergedDate.setHours(hours);
		mergedDate.setMinutes(minutes);

		return mergedDate.toISOString();
	}
};

export const fromSecondsToHourMinutes = (seconds: number) => {
	let hours = parseInt((seconds / 3600).toString()),
		minutes = parseInt(((seconds % 3600) / 60).toString());

	return `${(hours < 10 ? '0' : '')}${hours} hrs ${(minutes < 10 ? '0' : '')}${minutes} mins`;
};