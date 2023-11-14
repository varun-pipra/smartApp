export const getTrades = (value: any) => {
	if (value?.length > 0) {
		const trades: any = value.map((obj: any) => { return obj.name });
		return trades.join(', ');
	}
	return '';
};